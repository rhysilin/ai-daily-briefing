# AI Daily Briefing CMS

一个面向小团队 / 独立开发者 / AI 创业者的中文 AI 资讯 CMS。

它不是人工后台优先的 CMS，而是 **AI 维护优先**：AI 每天检索、生成中文正文，并通过受保护 API 写入 Vercel Blob 内容库。

## 功能

- 首页文章列表
- 日期归档
- 文章详情页：标题、摘要、中文正文、来源、行动建议
- AI 私有后台 API
- Vercel Blob 作为免费持久化内容库
- Vercel 自动部署

## 本地开发

```bash
npm install
npm run check
npm run build
npm run dev
```

## AI 写入接口

请求头：

```http
Authorization: Bearer <AI_CMS_TOKEN>
Content-Type: application/json
```

新增/更新文章：

```bash
POST /api/ai/articles
```

最小 JSON：

```json
{
  "title": "中文标题",
  "body": "中文正文",
  "date": "2026-07-01",
  "excerpt": "摘要"
}
```

返回会包含文章详情链接：`/articles/<slug>`。
