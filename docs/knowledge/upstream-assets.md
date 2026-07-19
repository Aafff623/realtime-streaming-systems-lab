# Upstream asset inventory

## Source code

| 当前路径 | 原始包 | 内容 |
|---|---|---|
| `backend/` | `qiyu-live-app-master.zip` | Java 微服务后端，400 个文件 |
| `web/` | `qiyu-live-web-master.zip` | Vue 2 静态前端，51 个文件 |
| `upstream-docs/` | `qiyu-live-app-document-master.zip` | 42 篇 DOCX 和 1 个空 README |

## Additional reference material

`upstream-docs/reference-pdf/` 保存额外发现的 49 份 PDF 与 1 份 DOCX。原目录和文件名存在编码损坏，当前只做原样保留。

## Raw backups

三个原始 ZIP 位于 `assets/backup/`。43 份 DOCX 的 47 个内嵌媒体已原样提取到 `assets/backup/docx-media/`，并由同目录 `manifest.json` 记录来源。该路径已被根 `.gitignore` 排除。

## Curated assets

- `assets/images/avatar/`: 2 个 Web 上游样例头像。
- `assets/images/icon/`: 5 个 Logo、直播状态和支付样例图标。
- `assets/images/knowledge/`: 3 张已人工检查的课程流程图。
- `web/css/fonts/`: 已恢复 Element UI 的 WOFF 与 TTF 图标字体。
- `assets/images/readme/preview-shell.png`: 静态 Web 页面壳真实截图。

来源与 SHA-256 见 `assets/images/manifest.json`。

## Migration notes

- 移除三层无业务意义的 `*-master/<project>` 包装。
- 不修改源代码和课程文档内容。
- 可执行配置以 `backend/nacos-config/` 和 `backend/sql/` 为准。
- 课程资料后续按主题转为 Markdown。原始媒体先进入 backup，人工检查后才复制到公开资产目录。
