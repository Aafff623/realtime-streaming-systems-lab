# Web context

## 形态

`web/` 是 Vue 2.6.10 + Element UI 的多页静态项目。没有 `package.json`、构建工具、锁文件和自动化测试。

## 页面

- `html/living_room_list.html`: 首页、登录、直播间列表和开播入口。
- `html/living_room.html`: 普通直播间、聊天、礼物、红包和带货。
- `html/living_room_pk.html`: PK 直播间。
- `html/flv_js.html`: 独立 FLV 播放测试。
- `html/red_packet.html`: 红包雨动画 Demo。

## 集成方式

- REST 基址硬编码在 `js/constants.js`。
- Axios 使用 Cookie 与后端交互。
- 直播间通过自定义 WebSocket JSON 文本协议接入 IM。
- 礼物动画依赖 SVGA CDN。

## 已知限制

- 主直播间页面没有把 flv.js 播放能力接入 video。
- 活跃本地图片引用已核对完整，Element UI 图标字体已恢复。
- Vue 2 与 Axios 0.19 已过时。
- 存在未定义变量、方法缺失和心跳定时器泄漏风险。
- 只能作为教学 Demo 预览，不能视为完整前端产品。
