# ADR 0001: Monorepo boundaries

- Status: accepted
- Date: 2026-07-19

## Context

上游资产由后端源码、静态 Web 前端和课程资料分别提供。原始 ZIP 解压后存在多层 `*-master` 包装目录，不利于统一导航和 Agent 协作。

## Decision

使用一个协作型 monorepo 根：

- `backend/` 是后端产品根。
- `web/` 是前端产品根。
- `upstream-docs/` 是只读知识来源。
- `docs/` 和 `assets/` 由当前仓库维护。

原始 ZIP 移入 `assets/backup/`，并通过 `.gitignore` 保持本地归档。

## Consequences

- 跨前后端链路可以在一个上下文中分析。
- 上游代码仍保留自身构建方式，不强行合并 Maven 与前端工具链。
- 后续若拆分仓库，需要分别迁移两个产品根，并保留此 ADR 的来源说明。
