# Qiyu Live deep analysis

- Status: awaiting-review
- Date: 2026-07-19
- Scope: `backend/`, `web/`, `upstream-docs/`
- Method: source tracing, configuration cross-check, Maven validation, intent versus implementation

## Executive judgment

旗鱼直播不是一个空壳 Demo。后端确实实现了用户、账号、直播间、礼物、虚拟币、支付、IM Router 和 Netty 长连接，登录、送礼、IM 三条主链路能从 Web 追到 Redis、MySQL、RocketMQ 和 WebSocket。

问题也很明确：这份代码更像课程阶段性快照，而不是最终可交付版本。业务覆盖面不低，但构建、配置、资金一致性、鉴权边界和自动化测试没有闭环。

当前判断：

- 架构学习价值: 高。服务拆分、异步送礼、IM 路由和分库分表都有实际代码。
- 开箱运行能力: 低。根 POM 已确认无法通过 Maven validate，配置还依赖课程环境。
- 业务完整度: 中。核心直播链路存在，红包和带货前端超前于后端。
- 生产可信度: 很低。支付回调、扣币和 MQ 幂等存在可造成资损的实现。
- 回归信心: 接近零。没有业务测试和 CI 门禁。

## 1. System shape

### Repository scale

- 后端: 400 个文件，26 个 Maven module 声明，其中 1 个重复。
- Web: 51 个文件，无 package manager 和构建链路。
- 上游资料: 93 个 DOCX/PDF 文件。
- 可运行后端入口: 约 13 个 Application。
- 业务测试注解: 未发现 `@Test`、`@SpringBootTest`、`@WebMvcTest` 或 `@DataJpaTest`。

### Backend layers

入口层：

- `qiyu-live-gateway`: 路由、CORS、Cookie Token 校验。
- `qiyu-live-api`: 面向 Web 的 HTTP BFF。
- `qiyu-live-bank-api`: 支付通知入口。

业务 Provider：

- User、Account、Message、Living、Gift、Bank、ID Generate。
- 每个主要域使用 `*-interface` 暴露 Dubbo RPC 契约。

实时通信：

- `qiyu-live-im-core-server`: Netty TCP/WebSocket 长连接。
- `qiyu-live-im-router-provider`: 根据 Redis 绑定把消息定向到 IM Core 实例。
- `qiyu-live-im-provider`: IM Token 与在线能力。

横切能力：

- `qiyu-live-framework-datasource-starter`
- `qiyu-live-framework-redis-starter`
- `qiyu-live-framework-web-starter`
- `qiyu-live-framework-mq-starter`

### Infrastructure

- Nacos 同时承担注册中心和配置中心。
- MySQL 保存用户、直播、礼物、账户、支付和短信数据。
- ShardingSphere JDBC 把用户相关表按 `user_id % 100` 分为 100 张。
- Redis 保存 Token、缓存、礼物幂等键、PK 进度和 IM 路由。
- RocketMQ 承担送礼、IM 业务消息、ACK 重试、上下线和缓存失效。

## 2. Core flow: login and authorization

### Implemented path

```text
Web send SMS
  -> Gateway whitelist
  -> UserLoginController
  -> Message RPC stores code in Redis

Web login
  -> User RPC queries or creates user
  -> Account RPC creates token in Redis
  -> API sets qytk Cookie

Protected request
  -> Gateway reads qytk
  -> Account RPC resolves userId
  -> Gateway injects qiyu_gh_user_id header
  -> API interceptor writes request context
```

Key evidence:

- Web endpoints: `web/js/constants.js:4-6`
- Cookie request mode: `web/js/utils.js:32-37`
- Gateway filter: `backend/qiyu-live-gateway/src/main/java/org/qiyu/live/gateway/filter/AccountCheckFilter.java:45-91`
- Token storage: `backend/qiyu-live-account-provider/src/main/java/org/qiyu/live/account/provider/service/impl/AccountTokenServiceImpl.java:27-37`

### Gaps

1. Token storage writes `String.valueOf(userId)` but reads and casts to `Integer`. This can fail at runtime before the Gateway can authorize a request.
2. Gateway rejects missing or invalid tokens with `Mono.empty()` and no 401/403 response. The Web cannot distinguish expired login from network failure.
3. API identity is only an HTTP header. If `qiyu-live-api` is reachable without the Gateway, a caller can forge `qiyu_gh_user_id`.
4. Login Cookie lacks `HttpOnly`, `Secure` and `SameSite`.
5. `/home/initPage` is not in the Gateway whitelist, while the Web calls it before establishing login state.

## 3. Core flow: gift delivery

### Implemented path

```text
Web POST /gift/send
  -> API reads authenticated userId
  -> API publishes send_gift
  -> Gift Provider consumes
  -> Bank RPC checks and decrements balance
  -> Living RPC lists room users
  -> IM Router locates connections
  -> IM Core pushes gift event
  -> Web plays SVGA animation
```

Evidence:

- Consumer: `backend/qiyu-live-gift-provider/src/main/java/org/qiyu/live/gift/provider/consumer/SendGiftConsumer.java:92-129`
- Balance service: `backend/qiyu-live-bank-provider/src/main/java/org/qiyu/live/bank/provider/service/impl/QiyuCurrencyAccountServiceImpl.java:54-136`
- PK calculation: `SendGiftConsumer.java:152-197`

### Gaps

1. The consumer writes a five-minute idempotency key before deducting balance. If processing then fails, RocketMQ retries are skipped.
2. The listener always returns `CONSUME_SUCCESS`, including partial failure paths.
3. Balance validation and Redis decrement are separate operations. Concurrent requests can pass the same balance check.
4. Redis and MySQL updates are not one transaction. Database updates run in an unmanaged static thread pool.
5. SQL decrement has no `current_balance >= num` guard, so the database can go negative.
6. The gift flow never inserts the existing `t_gift_record` record.
7. API reports success after publishing, even when MQ send throws.

The design intent is reasonable: use MQ to absorb spikes and IM to report asynchronous results. The implementation lacks a durable state machine, atomic balance operation and retry-safe idempotency boundary.

## 4. Core flow: IM

### Implemented path

```text
Web gets IM token and server address
  -> ws://host:8086/{token}/{userId}/1001/{roomId}
  -> IM Core validates token
  -> Redis binds user to server instance
  -> RocketMQ publishes online event

Web sends code 1003 business message
  -> IM Core publishes IM business topic
  -> Message Provider resolves room recipients
  -> IM Router groups users by bound instance
  -> IM Core pushes message
  -> Web sends code 1005 ACK
  -> delayed ACK topic retries missing acknowledgements
```

Evidence:

- Handshake: `backend/qiyu-live-im-core-server/src/main/java/org/qiyu/live/im/core/server/handler/ws/WsSharkHandler.java:65-102`
- Web endpoint construction: `web/js/living_room.js:337-352`
- Gift message codes: `SendGiftConsumer.java:111-125`

### Gaps

1. WebSocket token is placed in the URL, which can enter browser, proxy and access logs.
2. Handshake parsing indexes `uri.split("/")` without checking length. Malformed requests can raise runtime exceptions.
3. The code uses plain `ws://`, not TLS.
4. Web sends heartbeat every 3 seconds while the server constants describe a 30-second design interval.
5. Web heartbeat intervals are not cleared on disconnect or page teardown.
6. Documentation calls this a binary protocol, but the WebSocket path processes JSON text frames.
7. Web handles red-packet bizCode `5560`, but the backend has no matching enum or producer.

IM is the strongest learning section of the project because the routing and ACK path are both implemented. It still needs a written protocol contract and adversarial input handling.

## 5. Payment and virtual currency

This is the highest-risk part of the code.

### Confirmed problems

1. `PayNotifyController` accepts a plain `param` POST with no signature or source verification.
2. The callback trusts `userId`, `orderId` and `bizCode` from parsed JSON.
3. `PayOrderServiceImpl.payNotify` does not check that an order is unpaid before adding coins.
4. Repeating the same callback can repeat the balance increment.
5. `BankServiceImpl` simulates payment by calling the local notify endpoint directly.
6. Increment and decrement persist asynchronously and can diverge from Redis.
7. Recharge writes the gift-consumption trade type in `consumeIncrDBHandler`.

Evidence:

- Callback controller: `backend/qiyu-live-bank-api/src/main/java/org/qiyu/live/bank/api/controller/PayNotifyController.java:24-26`
- Callback mapping: `backend/qiyu-live-bank-api/src/main/java/org/qiyu/live/bank/api/service/impl/PayNotifyServiceImpl.java:23-29`
- Order handling: `backend/qiyu-live-bank-provider/src/main/java/org/qiyu/live/bank/provider/service/impl/PayOrderServiceImpl.java:89-133`
- Balance persistence: `QiyuCurrencyAccountServiceImpl.java:54-136`

This flow should be treated as a teaching mock only. It cannot be exposed to untrusted traffic.

## 6. Intended versus implemented

### Course intent present, implementation incomplete

- Live commerce: Web defines `/shop/*` APIs, but the backend has no matching Java implementation.
- Red-packet rain: Web defines three REST endpoints and bizCode `5560`, but the backend has no matching handlers.
- Gift record: SQL and service exist, but the gift consumer never writes the record.
- PK online state: the provider can report successful linking with `onlineStatus=false`, which conflicts with the API assertion.
- Logout: Web deletes cookie `ztscrip`, while backend authentication uses `qytk`.

### Documentation drift

- README says Netty 3.7.0, module POM uses Netty 4.1.89.Final.
- Web context described a binary WebSocket protocol, implementation uses JSON text frames.
- Course notes describe features that are not present in this source snapshot.

The correct approach is to preserve these as mismatches, not silently rewrite intent to match code.

## 7. Build and runtime audit

### Confirmed build blocker

`mvn validate -DskipTests` fails before compilation:

```text
'modules.module[14]' specifies duplicate child module qiyu-live-im-interface
```

Evidence: `backend/pom.xml:26-27`.

### High-probability startup blockers

- `qiyu-live-api/src/main/resource/bootstrap.yml` uses the wrong Maven resource directory.
- Account, User and Message Provider all use Dubbo port `9090`.
- IM Core and Message Provider code expects RocketMQ consumer properties missing from their Nacos YAML.
- All services depend on course-only domains such as `qiyu.nacos.com`, `cloud.db` and `qiyu.rmq.com`.
- User storage requires 300 physical sharded tables and MySQL primary/replica hosts.
- IM Core and SMS configs contain unresolved placeholders.
- Nacos, Redis and MySQL credentials are inconsistent across services.

### Deployment drift

Several Docker Compose files contain copied service names or port mappings that do not match Nacos Dubbo ports. The root POM also contains a macOS-specific Arthas path.

## 8. Test and engineering quality

### Test state

- No business test annotations were found.
- Existing `src/test` code is mainly Dubbo, BIO/NIO/AIO and IM client demos.
- No CI configuration was found in the extracted source.
- Payment, balance, MQ idempotency, Gateway authorization and IM protocol have no regression coverage.

### Dependency state

- Spring Boot 3.0.4 is old.
- Dubbo 3.2.0-beta.3 and Spring Cloud Alibaba 2022.0.0.0-RC1 are pre-release dependencies.
- Vue 2.6.10 is EOL.
- Axios 0.19 and vendored JS dependencies have no lockfile or automated vulnerability tracking.
- Fastjson APIs and Fastjson2 are mixed across modules.

### Web state

- No build system, linting, type checking or tests.
- Main live-room pages do not connect flv.js to the video element.
- Active local image references are complete, and the missing Element icon fonts have now been restored.
- Several JS paths contain undefined variables or missing methods.

## 9. Risk priorities

### P0: protect money and identity

1. Keep Bank API inaccessible until callback verification and order idempotency exist.
2. Replace balance check/decrement with an atomic operation and durable ledger.
3. Redesign gift MQ idempotency around a processing state and retryable outcome.
4. Prevent direct access to API services or authenticate the Gateway identity header.

### P1: make one vertical slice runnable

1. Remove the duplicate Maven module declaration.
2. Fix API bootstrap resource location.
3. Create one canonical local environment map for ports, hosts and credentials.
4. Start only login dependencies first: ID, Account, User, Message, API and Gateway.
5. Add tests for token serialization, 401 responses and login state.

### P2: restore protocol and product coherence

1. Write the IM protocol contract, including encoding, heartbeat, ACK and close behavior.
2. Decide whether red-packet and shop features belong to this snapshot.
3. Wire actual live playback or state clearly that the pages are interaction mockups.
4. Replace vendored Web dependencies with a reproducible build.

## 10. Recommended learning path

1. Read Gateway and Account Token code, then reproduce the token type mismatch.
2. Trace one HTTP request through BFF and Dubbo.
3. Follow `send_gift` from API to MQ, balance, room membership and IM.
4. Follow WebSocket login, online event, business topic, Router and ACK.
5. Compare user sharding YAML with SQL creation procedures.
6. Study the payment flow as a negative example of money-boundary design.
7. Add tests before attempting framework upgrades.

## 11. What was verified

- Root Maven validation was run and failed on the duplicate module.
- Key authorization, token, gift consumer, balance, payment and WebSocket files were read directly.
- Frontend routes were searched against backend Java code.
- Test annotations were searched across backend Java sources.

Not verified:

- Full compile after removing the POM blocker.
- Any service startup against Nacos, MySQL, Redis or RocketMQ.
- Runtime exploitability under a real deployment topology.
- Dependency CVEs with a package scanner.
