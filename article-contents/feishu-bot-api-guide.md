# 飞书 API 接入实战：从 Bot 到自动化工作流

## 项目起源

在 HZX 采购管理系统中，飞书 Bot 扮演着消息中枢的角色。从最初简单的消息推送，到后来完整的任务调度系统，feishu_bot 的演进见证了业务需求的增长。

## 飞书 Bot 开发流程

### 第一步：创建应用

1. 打开 [飞书开放平台](https://open.feishu.cn/)
2. 创建企业自建应用
3. 获取 App ID 和 App Secret

### 第二步：权限配置

```json
{
  "permissions": [
    "im:message",
    "im:chat",
    "contact:user",
    "contact:group"
  ]
}
```

### 第三步：消息推送

```python
import requests

def send_feishu_message(webhook_url, content):
    payload = {
        "msg_type": "interactive",
        "content": {
            "elements": [
                {"tag": "markdown", "content": content}
            ]
        }
    }
    resp = requests.post(webhook_url, json=payload)
    return resp.json()
```

## 高级功能

### 群消息监控

HZX 系统中的 `hzx-monitor` 服务会实时监控指定群聊的消息，当检测到特定关键词时，自动触发对应的任务流程。

### 定时任务推送

结合 `apscheduler`，实现定时向群聊推送运行报告：

```python
@scheduler.scheduled_job('cron', hour='9', minute='30')
def morning_report():
    stats = get_yesterday_stats()
    send_feishu_message(WEBHOOK_URL, format_report(stats))
```

### 交互式卡片

飞书的交互式消息卡片可以实现按钮点击、表单提交等交互，非常适合审批流程。

## 踩坑记录

1. **Token 过期** — 需要定时刷新 tenant_access_token
2. **消息频率限制** — 飞书 API 有严格的 QPS 限制
3. **Webhook 安全** — 建议配置 IP 白名单
4. **消息格式** — 不同消息类型（文本/卡片/富文本）的 JSON 结构差异较大

---

*飞书 Bot 让 HZX 系统有了"嘴巴"，能说话、能汇报、能告警。*
