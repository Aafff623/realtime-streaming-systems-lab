> **Output Style**: `humanizer-output-style` skill，统一语气与去 AI 味。详见 `skills/humanizer-output-style/SKILL.md`

# Agent guide

## 项目定位

旗鱼直播是一个用于学习直播平台架构的多组件仓库。仓库包含 Java 微服务后端、Vue 2 静态前端和上游课程资料。

## 开始工作前

1. 先读 `CONTEXT.md` 和 `CONTEXT-MAP.md`。
2. 根据改动范围读 `docs/contexts/` 下的对应上下文。
3. 涉及架构边界时检查 `docs/adr/`。
4. 新需求先进入本地 `.scratch/issues/`，再按 `docs/agents/workflow.md` 推进。
5. 未批准 PRD 前，不写业务功能代码。

## 项目边界

- `backend/`: Java 17、Spring Boot 3、Dubbo 多模块后端。
- `web/`: Vue 2、Element UI 多页静态前端。
- `upstream-docs/`: 上游课程资料，只读保留，不直接作为可执行事实源。
- `docs/`: Agent 协作、架构决策、知识库和交付物。
- `assets/`: 原始包备份、README 配图和展示素材。

## 工程规则

- 优先做最小、可验证的改动。
- 不把上游讲义中的配置片段当成当前运行配置，后端 `nacos-config/` 和 `sql/` 才是代码侧事实源。
- 不提交密钥、真实手机号、数据库密码或第三方平台凭据。
- 发现 Bug 时记录根因、复现方式、关键路径和验证结果。
- 不修改 `upstream-docs/` 与 `assets/backup/` 中的原始资产。

## 验证

- 后端改动至少运行相关 Maven 模块测试或编译。
- 前端改动至少通过静态服务手动验证目标页面。
- 文档改动使用 `preview-readme.html` 检查 README 渲染。

## 交付

执行 `docs/agents/deliver.md`。任务完成后停在 `awaiting-review`，由用户验收后再提交。
