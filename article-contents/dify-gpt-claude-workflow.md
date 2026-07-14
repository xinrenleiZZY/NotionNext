# Dify + GPT + Claude：AI 工作流搭建实战

## 为什么要用 Dify？

[Dify](https://dify.ai) 是一个开源的 LLM 应用开发平台，它让我能够：

- 可视化编排 AI 工作流
- 同时接入多个大模型
- 构建知识库 RAG 应用
- 快速搭建对话式 AI 服务

## 多模型接入配置

### GPT-4（OpenAI）

擅长创意生成、头脑风暴、文案撰写。

```yaml
model: gpt-4-turbo
temperature: 0.7
max_tokens: 4096
```

### Claude（Anthropic）

擅长逻辑推理、长文本分析、代码审查。

```yaml
model: claude-3-opus-20240229
temperature: 0.3
max_tokens: 8192
```

### Deepseek

擅长代码生成、中文理解、性价比高。

```yaml
model: deepseek-chat
temperature: 0.5
max_tokens: 4096
```

## 实战工作流：智能内容生产

```
[用户输入主题]
      ↓
[GPT-4: 生成大纲]  → 创意发散
      ↓
[Claude: 完善细节] → 逻辑补充
      ↓
[Deepseek: 代码示例] → 技术实现
      ↓
[GPT-4: 最终润色]  → 质量把控
      ↓
[输出成品内容]
```

## 知识库构建

用 Dify 的知识库功能，上传技术文档后：

1. 文档自动分段向量化
2. 支持多种检索模式
3. 多模型 RAG 问答

## 部署建议

```bash
# 本地部署 Dify
git clone https://github.com/langgenius/dify.git
cd dify/docker
docker-compose up -d
```

Dify 的 Docker 部署非常方便，配合我的 HZX 系统可以实现完整的 AI 自动化工作流。

---

*AI 不是替代人类，而是让每个修士都能发挥更大的力量。*
