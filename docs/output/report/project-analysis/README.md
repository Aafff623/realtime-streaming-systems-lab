# Project analysis report

- Status: awaiting-review
- Date: 2026-07-19
- Scope: backend, web, upstream docs

## Baseline findings

旗鱼直播的后端已经覆盖登录、直播间、礼物、虚拟币、支付、红包、带货和自研 IM 链路。系统结构适合教学拆解，但离可重复启动和生产运行还有明显距离。

当前最需要验证的事实：

1. 根 POM 的重复模块是否阻断 Reactor 构建。
2. Nacos 配置、域名、密码和端口能否在单机环境对齐。
3. 登录、送礼和 IM 三条主链路的接口协议是否前后一致。
4. Web 静态资产补齐后，直播播放接线与后端数据的实际可用范围。
5. 核心业务缺少测试时，如何建立最小回归基线。

## Known risks

- Dubbo 与 Spring Cloud Alibaba 使用 beta/RC 依赖。
- 多个 Provider 配置相同 Dubbo 端口。
- Web 使用 EOL 的 Vue 2 和旧版 Axios。
- REST、Cookie、CORS、域名和 WebSocket 均依赖教学环境硬编码。
- 核心礼物、支付、IM 流程无自动化测试。

## Detailed report

正式报告位于 `deep-analysis.md`，覆盖服务拓扑、登录/送礼/IM 链路、数据一致性、配置、测试、安全和分阶段建议。

## Verified blocker

`mvn validate -DskipTests` 已确认根 POM 的重复 `qiyu-live-im-interface` 模块会阻断 Reactor 构建。
