# Qiyu Live knowledge index

## 代码事实源

- 后端模块与版本: `backend/pom.xml`
- Nacos 配置: `backend/nacos-config/`
- 数据库结构: `backend/sql/`
- 前端 API: `web/js/constants.js`
- 前端 IM 协议: `web/js/living_room.js`、`web/js/living_room_pk.js`

## 上游课程资料

原始资料在 `upstream-docs/`。当前尚未批量转换为 Markdown，转换时按以下主题组织：

- `infrastructure/`: Docker、Maven、部署
- `middleware/`: Dubbo、Nacos、Gateway、ShardingSphere
- `data/`: 分库分表、缓存、ID、标签
- `account/`: 登录、短信、鉴权
- `im/`: Netty、协议、Router
- `live/`: PK、红包、带货
- `ops/`: 日志、压测、限流

## 维护规则

任何从课程资料抽取的结论都要附来源文件，并与当前源码核对。冲突时记录差异，不静默改写。
