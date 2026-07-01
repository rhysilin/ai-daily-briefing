# AI Daily Briefing

一个面向小团队 / 独立开发者 / AI 创业者的移动端友好 AI 日报站点。

## 功能

- 最新日报首页展示
- 日期归档列表，可切换历史日报
- 创业/产品、开源项目、学习资源三类卡片
- 今日导读、来源链接、行动建议
- 适配手机阅读

## 本地开发

```bash
npm install
npm run check
npm run build
npm run dev
```

## 内容更新

日报内容位于 `data/reports.json`，数组第一项/最新日期会展示为默认日报。后续 Hermes cron 任务可以每日追加一条日报数据，提交到 GitHub 后由 Vercel 自动部署。

## 部署

项目托管在 GitHub，并通过 Vercel 自动部署。
