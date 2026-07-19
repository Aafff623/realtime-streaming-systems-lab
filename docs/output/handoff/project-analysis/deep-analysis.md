# Handoff: Deep project analysis

- Status: awaiting-review
- Theme: `project-analysis`
- PRD: `docs/output/prd/project-analysis/prd.md`
- Started: 2026-07-19

## Objective

对 `backend/`、`web/` 和 `upstream-docs/` 做只读深度分析，输出可追溯的架构、业务、数据、工程质量、安全和可运行性结论。

## Scope

- 服务拓扑和模块职责
- 登录、送礼、IM 端到端链路
- 数据库、缓存、MQ 与一致性
- 前后端协议对应关系
- 配置差异与启动前置
- 测试、安全和技术债
- 分阶段学习与改造建议

## Constraints

- 不修改业务代码。
- 不搭建完整中间件环境。
- 关键结论引用具体文件。
- 区分实现事实、上游课程意图和建议。

## Deliverables

- `docs/output/report/project-analysis/deep-analysis.md`
- `project-analysis.canvas.tsx`

## Verification

- 核对关键 POM、Nacos 配置、Controller、Service、IM Handler、Web API 与 WebSocket 客户端。
- 对高风险结论进行交叉检索。
- 执行 `mvn validate -DskipTests`，确认根 POM 重复模块阻断 Reactor。
- 搜索后端测试注解与 Web 超前接口。
- Canvas 与 README Preview 未发现 IDE lint 错误。
