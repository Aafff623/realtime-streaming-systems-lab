# 本地开发环境就绪度报告

- 日期：2026-07-19
- 系统：Windows 11 64 位
- 项目：Realtime Streaming Systems Lab / Qiyu Live
- 结论：当前环境尚不能启动完整项目

## 1. 总体结论

本机已经具备 Java、Maven、MySQL、Docker CLI、Node.js 和 Python 等基础工具，但数据库、中间件、域名映射和项目配置仍有多项阻塞。

当前适合做源码阅读、静态 Web 预览和后端代码修改，不适合直接启动完整微服务集群。

主要阻塞：

1. 根 POM 重复声明 `qiyu-live-im-interface`，Maven 在读取 Reactor 时失败。
2. Nacos 和 RocketMQ 未安装或未运行。
3. Redis 已安装但未启动，项目要求的 `8801` 端口被 Python HTTP 服务占用。
4. MySQL 正在 `3306` 运行，项目配置使用 `8808`。
5. 项目所需 hosts 映射全部缺失。
6. `NACOS_USER`、`NACOS_PWD` 环境变量未设置。
7. 六个业务数据库、300 张用户分表及必要 seed 数据尚未确认。
8. User、Account、Message Provider 同时配置 Dubbo 端口 `9090`。

## 2. 电脑资源

| 项目 | 当前状态 |
|---|---|
| CPU | Intel Core i7-14650HX，24 逻辑处理器 |
| 内存 | 31.8 GB |
| 当前可用内存 | 约 11.2 GB |
| 工作盘剩余空间 | 约 101.1 GB |
| WSL | WSL 2 已安装，Ubuntu 当前停止 |

硬件可以运行最小服务子集。若同时启动 Nacos、RocketMQ、Redis、MySQL 和全部 13 个 Java 服务，当前 11 GB 可用内存会比较紧张，建议限制 JVM 内存或分批启动。

## 3. 开发工具检查

| 工具 | 项目要求 | 本机状态 | 判断 |
|---|---|---|---|
| JDK | 17 | 已安装 17.0.18；当前 `JAVA_HOME` 指向 21.0.9 | 需要切换 |
| Maven | 支持 Java 17 | 3.9.12 | 可用 |
| Docker CLI | 可选但推荐 | 29.1.3 | 已安装 |
| Docker Compose | 可选但推荐 | 5.0.0 | 已安装 |
| Docker Desktop | 容器运行时 | 已安装，服务未运行 | 需要启动 |
| MySQL | 8.0 | 8.0.26，服务运行中 | 版本可用，配置不匹配 |
| Redis | 6.0 | 8.6.1 二进制已安装，未运行 | 需要配置并启动 |
| Nacos | 2.2.1 | 未发现安装目录、进程或监听端口 | 缺失 |
| RocketMQ | 4.8.0 | 未发现安装目录、进程或监听端口 | 缺失 |
| Node.js | 非当前 Web 必需 | 24.14.0 | 可用 |
| Python | 静态 HTTP 服务 | 3.11.9 | 可用 |

### Java 状态

当前：

```text
JAVA_HOME=C:\Users\Lenovo\.jdks\ms-21.0.9-1
java=21.0.9
```

可用的 JDK 17：

```text
C:\Users\Lenovo\.jdks\ms-17.0.18
```

PowerShell 当前会话可这样切换：

```powershell
$env:JAVA_HOME = "C:\Users\Lenovo\.jdks\ms-17.0.18"
$env:Path = "$env:JAVA_HOME\bin;$env:Path"
java -version
mvn -version
```

## 4. Docker 状态

Docker CLI 和 Compose 已安装，但 Docker Desktop 后台服务没有运行：

```text
Docker Desktop Service: Stopped
desktop-linux engine: unavailable
```

因此当前无法检查已有镜像和容器，也无法用 Compose 启动 Nacos、Redis、RocketMQ。

建议后续使用 Docker Desktop 统一运行中间件，Java 服务仍可先从 IDE 启动。

## 5. MySQL 状态

本机 MySQL 8.0.26 服务正在运行：

```text
Service: MySQL80
Host: 127.0.0.1
Port: 3306
```

项目配置要求：

```text
cloud.db:8808
cloud.msg.db:8808
cloud.user.db.master:8808
cloud.user.db.slave:8808
```

当前不匹配。可选方案：

1. 把 Nacos 数据源配置统一改为本机 `3306`。
2. 为 MySQL 增加 `8808 -> 3306` 端口转发。
3. 改为 Docker MySQL 并直接暴露 `8808`。

MySQL 拒绝无密码访问，因此本次无法确认项目数据库是否已经创建。

### 项目需要的数据库

- `qiyu_live_common`
- `qiyu_live_user`
- `qiyu_live_msg`
- `qiyu_live_living`
- `qiyu_live_gift`
- `qiyu_live_bank`

DDL 位于：

```text
backend/sql/qiyu-live-common.sql
backend/sql/qiyu-live-user.sql
backend/sql/qiyu-live-msg.sql
backend/sql/qiyu-live-living.sql
backend/sql/qiyu-live-gift.sql
backend/sql/qiyu-live-bank.sql
```

### 用户分表

ShardingSphere 配置要求：

- `t_user_00` 到 `t_user_99`
- `t_user_phone_00` 到 `t_user_phone_99`
- `t_user_tag_00` 到 `t_user_tag_99`

合计 300 张表。需要执行：

```text
backend/sql/create_t_user_100.sql
backend/sql/create_t_user_phone_100.sql
backend/sql/create_t_user_tag_100.sql
```

### 必要 seed 数据

- `t_id_generate_config`：至少配置用户 ID 号段。
- `t_pay_topic`：支付完成消息 Topic。
- `t_pay_product`：充值商品。
- `t_gift_config`：礼物配置，可参考 `backend/insert_gift_sql`。
- 用户 VIP 标签：影响首页开播入口。

## 6. Redis 状态

Redis 8.6.1 已安装：

```text
D:\develop\Redis-8.6.1-Windows-x64-msys2
```

但 Redis Server 没有运行，`redis-cli` 也未加入系统 PATH。

项目要求：

```text
cloud.db:8801
```

当前 `127.0.0.1:8801` 被 Python HTTP Server 占用：

```text
Server: SimpleHTTP/0.6 Python/3.11.9
Content-Type: text/html
```

这个端口虽然可连接，但不是 Redis 协议，Java 服务连接时会失败。

Redis 主要用途：

- 登录 Token
- 短信验证码
- 用户与直播间缓存
- 礼物消费幂等
- PK 进度
- 虚拟币余额缓存
- IM 用户路由与 ACK
- API 限流

## 7. Nacos 状态

项目要求 Nacos 2.2.1：

```text
qiyu.nacos.com:8848
namespace=qiyu-live-test
```

当前状态：

- 未发现 Nacos 安装。
- `8848` 无监听。
- `qiyu.nacos.com` 无法解析。
- `NACOS_USER` 未设置。
- `NACOS_PWD` 未设置。

需要导入 `backend/nacos-config/` 下 14 个 YAML Data ID。

配置中还存在以下问题：

- Dubbo Registry 账号混用 `nacos/nacos` 和 `qiyu/qiyu`。
- API Redis 密码使用 `root`，多数 Provider 使用 `qiyu`。
- IM Core Server 的 discovery IP 仍是中文占位符。
- Message Provider 和 IM Core Server 缺 RocketMQ Consumer 配置。

## 8. RocketMQ 状态

项目要求 RocketMQ 4.8.0：

```text
qiyu.rmq.com:9876
```

当前状态：

- 未发现 NameServer 或 Broker 安装。
- 无 RocketMQ 进程。
- `9876`、`10909`、`10911` 均无监听。
- `qiyu.rmq.com` 解析到公网停放地址，不是本地服务。

需要的主要 Topic：

- `UserCacheAsyncDelete`
- `send_gift`
- `remove_gift_cache`
- `qiyu_live_im_biz_msg_topic`
- `qiyu_live_im_ack_msg_topic`
- `im_online_topic`
- `im_offline_topic`
- 支付动态 Topic

## 9. hosts 与域名

Windows hosts 当前只有其它项目记录，没有本项目映射。

建议加入：

```text
127.0.0.1 qiyu.nacos.com
127.0.0.1 cloud.db
127.0.0.1 cloud.msg.db
127.0.0.1 cloud.user.db.master
127.0.0.1 cloud.user.db.slave
127.0.0.1 qiyu.rmq.com
127.0.0.1 app.qiyu.live.com
127.0.0.1 web.qiyu.live.com
```

注意：

- `app.qiyu.live.com` 当前解析到公网地址，不应直接用于本地调试。
- `web.qiyu.live.com` 当前也未映射到本机。
- Cookie Domain 和 Gateway CORS 都依赖 `qiyu.live.com` 子域，不能简单改用 `localhost` 而不调整代码。

## 10. 应用端口

| 服务 | 端口 |
|---|---:|
| Gateway HTTP | 80 |
| API HTTP | 8100 |
| Bank API HTTP | 8201 |
| Web 静态站 | 5500 |
| IM TCP | 8085 |
| IM WebSocket | 8086 |
| User Provider Dubbo | 9090 |
| Account Provider Dubbo | 9090 |
| Message Provider Dubbo | 9090 |
| ID Generate Dubbo | 9092 |
| Gift Provider Dubbo | 9093 |
| Bank Provider Dubbo | 9096 |
| Living Provider Dubbo | 9089 |
| IM Provider Dubbo | 9010 |
| IM Router Dubbo | 9098 |
| IM Core Server Dubbo | 9099 |

User、Account、Message Provider 的 `9090` 会在单机启动时冲突，必须至少修改其中两个。

## 11. 代码与配置阻塞

即使数据库和中间件全部准备好，仍有以下阻塞：

1. `backend/pom.xml` 重复声明 `qiyu-live-im-interface`。
2. `qiyu-live-api/src/main/resource/` 应为 `src/main/resources/`。
3. 三个 Provider 使用同一个 Dubbo `9090`。
4. Message Provider 和 IM Core Server 缺 RocketMQ Consumer 配置。
5. IM Core Server 注册 IP 是未替换占位符。
6. Redis、MySQL、Nacos 的账号和密码不一致。
7. Gateway 使用 80 端口，Windows 下可能需要管理员权限。
8. Docker Compose 文件存在服务名和端口复制错误。

JDK 17 环境下执行：

```powershell
mvn validate -DskipTests
```

当前结果：

```text
'modules.module[14]' specifies duplicate child module qiyu-live-im-interface
```

## 12. 推荐实施顺序

### 第一阶段：修复代码侧阻塞

1. 删除根 POM 重复模块。
2. 修正 API resources 目录。
3. 给三个 Provider 分配独立 Dubbo 端口。
4. 统一本地端口、账号和密码。
5. 补齐 MQ Consumer 配置和 IM discovery IP。

### 第二阶段：准备基础设施

1. 启动 Docker Desktop。
2. 停止或迁移占用 `8801` 的 Python HTTP Server。
3. 启动 Redis、Nacos 和 RocketMQ。
4. 决定 MySQL 使用 `3306` 还是映射到 `8808`。
5. 配置 hosts 和 `NACOS_USER`、`NACOS_PWD`。

### 第三阶段：初始化数据

1. 创建六个数据库。
2. 执行基础 DDL。
3. 创建 300 张用户分表。
4. 插入 ID、支付、礼物等 seed 数据。
5. 导入 14 个 Nacos YAML。

### 第四阶段：启动最小链路

建议先运行：

```text
id-generate-provider
user-provider
account-provider
msg-provider
living-provider
qiyu-live-api
qiyu-live-gateway
web:5500
```

先验证：

1. 直播间列表。
2. 短信测试模式。
3. 登录与 Cookie。
4. 首页状态。

登录链路稳定后，再接入 Bank、Gift 和完整 IM。

## 13. 最终判断

| 范围 | 结论 |
|---|---|
| 硬件资源 | 最小链路可运行，完整集群需要控制内存 |
| Java/Maven | 工具齐全，需要切换 JDK 17 |
| MySQL | 服务可用，但端口、库表和数据尚未对齐 |
| Redis | 已安装但未运行，且端口冲突 |
| Nacos | 缺失 |
| RocketMQ | 缺失 |
| Docker | 已安装但未启动 |
| 网络与域名 | 未配置 |
| 项目构建 | 被根 POM 阻断 |
| 整体状态 | Not Ready |
