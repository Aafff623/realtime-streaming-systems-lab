# Context map

| 范围 | 上下文 | 代码或资产根 |
|---|---|---|
| 全局 | `CONTEXT.md` | 仓库根 |
| 后端 | `docs/contexts/backend.md` | `backend/` |
| 前端 | `docs/contexts/web.md` | `web/` |
| 上游资料 | `docs/contexts/upstream-docs.md` | `upstream-docs/` |
| Agent 协作 | `docs/agents/workflow.md` | `docs/agents/` |
| 领域语言 | `docs/agents/domain.md` | 全局 |
| 当前分析 | `docs/output/report/project-analysis/README.md` | 全局 |

## 使用方法

只读取当前任务需要的上下文。跨后端、前端的链路分析同时读取 `backend.md` 与 `web.md`，再回到源码核实接口与协议。
