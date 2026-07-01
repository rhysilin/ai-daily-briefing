import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowUpRight,
  BookOpenText,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Layers3,
  Link2,
  Search,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import reports from '../data/reports.json';
import './styles.css';

const sortedReports = [...reports].sort((a, b) => b.date.localeCompare(a.date));

function formatDate(date) {
  return new Intl.DateTimeFormat('zh-CN', {
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  }).format(new Date(`${date}T08:00:00+08:00`));
}

function countItems(report) {
  return report.sections.reduce((sum, section) => sum + section.items.length, 0);
}

function useHashDate() {
  const initialDate = window.location.hash?.replace('#', '') || sortedReports[0].date;
  const [selectedDate, setSelectedDate] = useState(
    sortedReports.some((report) => report.date === initialDate) ? initialDate : sortedReports[0].date,
  );

  const selectDate = (date) => {
    setSelectedDate(date);
    window.history.replaceState(null, '', `#${date}`);
  };

  return [selectedDate, selectDate];
}

function DateTimeline({ selectedDate, onSelect }) {
  return (
    <aside className="timeline-panel">
      <div className="panel-heading">
        <span><CalendarDays size={18} /> 日报归档</span>
        <small>{sortedReports.length} 期</small>
      </div>
      <div className="timeline-list">
        {sortedReports.map((report, index) => {
          const active = report.date === selectedDate;
          return (
            <button
              type="button"
              className={`timeline-item ${active ? 'active' : ''}`}
              key={report.date}
              onClick={() => onSelect(report.date)}
            >
              <span className="timeline-dot" />
              <span className="timeline-content">
                <strong>{formatDate(report.date)}</strong>
                <small>{report.date} · {countItems(report)} 条精选</small>
              </span>
              {index === 0 && <span className="latest-pill">最新</span>}
            </button>
          );
        })}
      </div>
    </aside>
  );
}

function Metric({ icon, label, value }) {
  return (
    <div className="metric">
      {icon}
      <div>
        <strong>{value}</strong>
        <span>{label}</span>
      </div>
    </div>
  );
}

function ItemCard({ item, sectionAccent }) {
  return (
    <article className={`item-card accent-${sectionAccent || 'cyan'}`}>
      <div className="item-meta">
        <span className="tag">{item.tag || '精选'}</span>
        {item.status && <span className="status">{item.status}</span>}
      </div>
      <h3>{item.title}</h3>
      <p className="summary">{item.summary}</p>
      <div className="why">
        <strong>为什么值得关注</strong>
        <span>{item.why}</span>
      </div>
      <a href={item.url} target="_blank" rel="noreferrer" className="source-link">
        <Link2 size={15} /> 查看来源 <ArrowUpRight size={15} />
      </a>
    </article>
  );
}

function ReportDetail({ report }) {
  const totalItems = countItems(report);
  const sources = report.stats?.sources || totalItems;
  const actionCount = report.actions.length;

  return (
    <div className="report-detail">
      <section className="hero">
        <div className="hero-topline">
          <span className="hero-badge"><Sparkles size={16} /> AI Daily Briefing</span>
          <span className="date-row"><CalendarDays size={17} /> {report.date}</span>
        </div>
        <h1>{report.title}</h1>
        <p className="subtitle">{report.subtitle}</p>
        <div className="hero-metrics">
          <Metric icon={<BookOpenText size={20} />} label="精选条目" value={totalItems} />
          <Metric icon={<Search size={20} />} label="来源入口" value={sources} />
          <Metric icon={<CheckCircle2 size={20} />} label="行动建议" value={actionCount} />
        </div>
      </section>

      <section className="overview glass-card">
        <div>
          <span className="eyebrow"><Clock3 size={15} /> 今日导读</span>
          <h2>先看这一段就够了</h2>
        </div>
        <p>{report.summary}</p>
      </section>

      <div className="sections">
        {report.sections.map((section) => (
          <section className="section glass-card" key={section.name}>
            <div className="section-title">
              <span><Layers3 size={19} /> {section.name}</span>
              <small>{section.items.length} 条</small>
            </div>
            <div className="cards">
              {section.items.map((item) => (
                <ItemCard item={item} sectionAccent={section.accent} key={`${section.name}-${item.title}`} />
              ))}
            </div>
          </section>
        ))}
      </div>

      <section className="actions glass-card">
        <div className="section-title action-title">
          <span><TrendingUp size={20} /> 今日可行动建议</span>
          <small>适合小团队落地</small>
        </div>
        <ul>
          {report.actions.map((action, index) => (
            <li key={action}>
              <span className="action-index">{index + 1}</span>
              <span>{action}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function App() {
  const [selectedDate, setSelectedDate] = useHashDate();
  const selectedReport = useMemo(
    () => sortedReports.find((report) => report.date === selectedDate) || sortedReports[0],
    [selectedDate],
  );

  return (
    <main>
      <nav className="top-nav">
        <div className="brand-mark">AI</div>
        <div>
          <strong>AI 创业资讯早报</strong>
          <span>每日归档 · 持续更新</span>
        </div>
      </nav>

      <div className="layout">
        <DateTimeline selectedDate={selectedReport.date} onSelect={setSelectedDate} />
        <ReportDetail report={selectedReport} />
      </div>

      <footer>
        由 Hermes cron 生成 · GitHub 存档 · Vercel 自动部署
        <ChevronRight size={14} />
        <a href="https://github.com/rhysilin/ai-daily-briefing" target="_blank" rel="noreferrer">查看项目</a>
      </footer>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
