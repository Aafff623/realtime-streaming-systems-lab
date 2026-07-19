# Agent workflow

## 状态流

```text
Issue
  -> report/project-analysis
  -> prd/project-analysis/prd.md (draft)
  -> approved
  -> handoff/project-analysis/<task>.md
  -> implementation
  -> awaiting-review
  -> user review
  -> commit and archive
```

## 规则

1. 新问题先进入 `.scratch/issues/`。
2. Bug 必须记录复现与根因，功能需求必须写清验收条件。
3. PRD 未批准时，只允许调研、诊断、文档和原型工作。
4. 一项实施任务对应一个 handoff。
5. 完成实施与验证后停在 `awaiting-review`。
6. 用户通过 Review 后，才更新 commit-history 或执行 commit。

## Bug 模板

Bug 记录至少包含：

- 问题描述
- 根因
- 自动或手动复现
- 关键代码位置
- 修复方向
- 接手 Agent 引导
- 验证结果
