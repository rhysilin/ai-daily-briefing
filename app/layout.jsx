export const metadata = {
  title: 'AI 创业资讯 CMS',
  description: '由 AI 维护的中文 AI 创业资讯 CMS',
};

import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
