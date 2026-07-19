# Backend context

## 形态

`backend/` 是 Java 17 Maven 多模块工程。根 POM 聚合 RPC Interface、Provider、HTTP API、Gateway、Framework Starter 和 IM Server。

## 入口层

- `qiyu-live-gateway`: `/live/api/**` 网关与 Token 校验。
- `qiyu-live-api`: 面向 Web 的 BFF。
- `qiyu-live-bank-api`: 支付回调入口。

## 服务层

用户、账号、短信、直播、礼物、支付、分布式 ID、IM 和消息路由分别由 Dubbo Provider 承担。RPC 契约位于对应 `*-interface` 模块。

## 基础设施

- Nacos: 注册中心与配置中心。
- MySQL 8: 业务持久化。
- ShardingSphere JDBC: 用户库分表与读写分离。
- Redis: Token、缓存、幂等和 IM 路由绑定。
- RocketMQ: 礼物、上线状态和缓存失效消息。
- Netty: IM TCP 与 WebSocket 长连接。

## 事实源

- 依赖与模块: `backend/pom.xml`
- 远程配置: `backend/nacos-config/`
- 数据库脚本: `backend/sql/`
- HTTP 接口: `backend/qiyu-live-api/**/controller/`

## 已知风险

- 根 POM 重复声明 `qiyu-live-im-interface`。
- `qiyu-live-api` 的 bootstrap 路径可能写成 `resource` 而不是 `resources`。
- 多个 Provider 使用相同 Dubbo 端口。
- 配置中的账号、密码、域名和 IP 不一致。
- 核心业务缺少自动化测试。
