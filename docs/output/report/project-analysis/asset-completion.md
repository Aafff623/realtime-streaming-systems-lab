# Asset completion report

- Status: awaiting-review
- Date: 2026-07-19
- Scope: Web static assets, Project Init assets, upstream DOCX media

## Completed

### Web runtime assets

- Restored `web/css/fonts/element-icons.woff`.
- Restored `web/css/fonts/element-icons.ttf`.
- Verified all active local image references in HTML and business JavaScript already resolve.

Font source URLs and SHA-256 are recorded in `web/css/fonts/manifest.json`.

### Curated reusable assets

- 2 sample avatars in `assets/images/avatar/`.
- 5 Logo, live status and payment sample icons in `assets/images/icon/`.
- 3 reviewed course diagrams in `assets/images/knowledge/`.
- Provenance and SHA-256 in `assets/images/manifest.json`.

### Upstream document media

43 DOCX files were scanned. 22 contained media, producing 47 extracted files.

Raw files and the source mapping are stored in `assets/backup/docx-media/`. This directory is ignored by Git because screenshots may contain environment or third-party account details.

### README Preview

`assets/images/readme/preview-shell.png` is a real 1440x1000 headless Edge capture of the static live-room shell. The backend was not running, so it shows the room layout, gift/shop entry points and chat area without dynamic data.

## Intentionally not fabricated

- Three Showcase screenshots remain pending until the backend is runnable.
- No fake local MP4 was created for the commented `test.mp4` reference.
- Optional Axios and flv.js source maps were not added because they do not affect runtime.

## README illustrations (generated)

Prompts: `docs/output/prd/readme-diagrams/readme-image-prompts.md`

| File | Notes |
|---|---|
| `assets/images/readme/banner.png` | 20:9 (API 无 3:1，取最接近宽幅) |
| `assets/images/readme/features.png` | 16:9 |
| `assets/images/readme/architecture.png` | 16:9 |
| `assets/images/readme/tech-stack.png` | 16:9 |
| `assets/images/readme/workflow.png` | 16:9；图中残留少量 sync/async 英文，可接受或二次修图 |
| `assets/images/readme/structure.png` | 16:9 |

根 `README.md` 已按章节引用全部六张插图，并保留真实 `preview-shell.png`。三张 Showcase 仍等待后端跑通后截取。
