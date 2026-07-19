# Port registry

| 用途 | 端口 | 启动位置 | 说明 |
|---|---:|---|---|
| README preview shell | 4173 | 仓库根 | 渲染根 `README.md` |
| Web static preview | 5500 | `web/` | 匹配后端现有 CORS Origin |
| Gateway | 80 | 后端配置 | 以 Nacos 配置为准 |
| IM TCP | 8085 | IM Core Server | 客户端 TCP |
| IM WebSocket | 8086 | IM Core Server | Web 前端连接 |

新增本地服务前先登记，避免与现有后端服务和课程环境冲突。
