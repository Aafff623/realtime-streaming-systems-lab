# Domain model

## 核心域

| 域 | 主要职责 | 后端边界 |
|---|---|---|
| User | 用户资料、手机号、标签 | `qiyu-live-user-*` |
| Account | 登录 Token 与会话 | `qiyu-live-account-*` |
| Living | 直播间、开播、关播、PK | `qiyu-live-living-*` |
| Gift | 礼物配置、送礼记录与异步处理 | `qiyu-live-gift-*` |
| Bank | 旗鱼币账户、充值商品、支付订单 | `qiyu-live-bank-*` |
| IM | 登录、在线状态、消息路由与长连接 | `qiyu-live-im-*` |
| Message | 短信验证码 | `qiyu-live-msg-*` |
| ID | 分布式 ID | `qiyu-live-id-generate-*` |

## 关键术语

- Anchor: 主播，发起直播或 PK 的用户。
- Living Room: 直播间，承载观看、聊天、礼物和红包。
- Qiyu Currency: 平台虚拟币，用于礼物和支付。
- IM Core Server: 维护客户端 TCP/WebSocket 长连接的 Netty 服务。
- IM Router: 根据 Redis 中的用户绑定信息，把业务消息路由到正确的 IM Core Server。
- Provider: Dubbo 服务实现。
- Interface: Dubbo RPC 契约与 DTO。
- BFF: `qiyu-live-api`，对 Web 端暴露 HTTP 接口并聚合 RPC。

## 主要链路

### 登录

Web -> Gateway -> API -> SMS RPC -> User RPC -> Account Token RPC -> Cookie

### 送礼

Web -> API -> RocketMQ -> Gift Provider -> Bank RPC -> Living RPC -> IM Router -> IM Core Server -> WebSocket

### IM 登录

Web 获取 IM 配置 -> 连接 IM Core Server -> 校验 IM Token -> Redis 记录用户与服务实例绑定 -> 发布上线消息
