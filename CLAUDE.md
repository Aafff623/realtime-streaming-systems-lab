> **Output Style**: `humanizer-output-style` skill，统一语气与去 AI 味。详见 `skills/humanizer-output-style/SKILL.md`

# Claude project instructions

## 读取顺序

1. `CONTEXT.md`
2. `CONTEXT-MAP.md`
3. `docs/contexts/<area>.md`
4. `docs/agents/workflow.md`
5. 相关 ADR、PRD 和 handoff

## 工作约束

- 当前项目以架构学习和深度分析为目标，不默认追求生产部署。
- 根目录是 monorepo 协作层，`backend/` 与 `web/` 是产品层。
- `upstream-docs/` 和 `assets/backup/` 是上游只读资产。
- PRD 状态不是 `approved` 时，不实现业务功能。
- 不猜测服务配置。以代码、`backend/nacos-config/` 和 `backend/sql/` 为证据。
- 涉及登录、支付、IM、用户输入或凭据时，先做安全检查。
- 不自动 commit 或 push。

## 本地端口

- README 预览壳: `4173`
- Web 静态 Preview: `5500`

完整登记见 `docs/knowledge/port-registry.md`。

## 当前业务 theme

`project-analysis`

- 报告: `docs/output/report/project-analysis/`
- PRD: `docs/output/prd/project-analysis/`
- Handoff: `docs/output/handoff/project-analysis/`
