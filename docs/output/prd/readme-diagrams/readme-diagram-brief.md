# README diagram brief

## Positioning

旗鱼直播是用于学习直播平台微服务、IM 和高并发业务设计的代码样例。README 面向开发者，重点解释边界、链路、运行条件和已知限制。

## Chapter map

1. Header 与项目边界
2. 为什么值得分析
3. 功能与业务域
4. Web Preview
5. Showcase 槽位
6. 快速开始
7. 架构与技术栈
8. 登录、送礼、IM 主链路
9. 仓库结构
10. 学习路线
11. 文档入口与限制

## Image nodes

| 文件 | 章节 | 传达内容 | 状态 |
|---|---|---|---|
| `banner.png` | Header | 直播、信号流、微服务 | 已生成（20:9，近似 3:1） |
| `features.png` | 功能 | 登录、直播、礼物、支付、IM | 已生成 |
| `architecture.png` | 架构 | Web、Gateway、API、Dubbo、MQ、IM | 已生成 |
| `tech-stack.png` | 技术栈 | Java 与中间件分层 | 已生成 |
| `workflow.png` | 主链路 | 送礼到 WebSocket 推送 | 已生成 |
| `structure.png` | 目录 | backend、web、docs、assets | 已生成 |
| `preview-shell.png` | Preview | Web 静态页面入口 | 已截静态页面壳，后端数据缺省 |
| `showcase-*.png` | Showcase | 首页、直播间、PK | 待系统跑通后截图 |

## Design language

- 方向: 深海蓝背景、青色信号流、克制的直播红点。
- 图形: 服务节点、消息轨迹、波形和直播画面框。
- 材质: 扁平矢量与技术示意图，不使用 3D 玻璃和发光堆叠。
- 文字: 图片内尽量无可读文字，标签由 README 正文承担。
- 比例: Banner 3:1，其余优先 16:9。

## Acceptance

- 图片在 GitHub 浅色与深色主题下均可辨认。
- 架构图不虚构服务。
- Preview 与 Showcase 分开。
- 图片落入 `assets/images/readme/` 后才加入 README 引用。
