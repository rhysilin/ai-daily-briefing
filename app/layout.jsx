export const metadata = {
  title: 'AI 学院｜AI 教程、资讯与创业情报',
  description: 'AI 学院持续整理 AI 教程、工具指南、行业资讯和创业情报，帮助个人和小团队把 AI 真正用起来。',
};

import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
