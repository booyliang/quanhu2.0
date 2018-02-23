# 圈乎2.0管理后台

## config 配置相关

### app.**.json

* *base* 基础配置
* *dev*  开发环境配置
* *mo*   MO环境配置
* *test* test环境配置
* *prod* 生产环境配置

| key              | value         |
|------------------|---------------|
| APP_PROTOCOL     | APP 协议        |
| APP_HOST         | APP HOST      |
| DOWNLOAD_APP_URL | APP 下载落地页地址   |
| SENTRY_CONFIG    | 异常监控配置（具体见下表） |

### SENTRY_CONFIG

| key          | value            |
|--------------|------------------|
| organization | 组织唯一识别名          |
| project      | 项目名              |
| apiKey       | api key 需开项目读写权限 |
| dsn          | 项目的 public dsn   |


