# AI Daily Briefing

一个面向小团队 / 独立开发者 / AI 创业者的移动端友好 AI 日报页面。

## 本地开发

```bash
npm install
npm run check
npm run build
npm run dev
```

## 内容更新

日报内容位于 `data/daily.json`。后续 Hermes cron 任务可以每日生成新的 JSON，提交到 GitHub 后由 Vercel 自动部署。

## 部署

项目托管在 GitHub，并通过 Vercel 自动部署。
