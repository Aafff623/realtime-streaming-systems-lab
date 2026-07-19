# Project context

## 一句话定位

旗鱼直播是一个教学型直播平台样例，用于研究微服务、即时通讯、直播业务和高并发数据设计。

## 当前目标

先建立可追溯的项目知识，再完成 `project-analysis` 深度分析。当前不把系统描述为可直接生产部署的成品。

## 仓库组成

- `backend/`: 以 Spring Boot、Dubbo、Nacos、MySQL、Redis、RocketMQ、ShardingSphere 和 Netty 组成的后端。
- `web/`: 无构建链路的 Vue 2 + Element UI 多页前端。
- `upstream-docs/`: 课程 Word/PDF 原稿。原稿可能与最终代码版本不一致。
- `docs/`: 当前仓库维护的结构化知识和 Agent 交付物。

## 已知事实

- 后端根 POM 使用 Java 17 和 Spring Boot 3.0.4。
- 后端包含网关、API 聚合层、多个 Dubbo Provider、IM Core Server 和 Router。
- Web 端通过 Cookie 调用 REST API，通过自定义 WebSocket 协议接入 IM。
- 上游代码几乎没有可用的自动化测试。
- 配置包含教学环境地址和示例凭据，接入真实环境前必须清理。

## 当前状态

Project Init 已建立 monorepo 边界和文档骨架。第一个 theme 是 `project-analysis`，其 PRD 仍需用户批准。
