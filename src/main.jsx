import React from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowUpRight, CalendarDays, CheckCircle2, Sparkles } from 'lucide-react';
import daily from '../data/daily.json';
import './styles.css';

function ItemCard({ item }) {
  return (
    <article className="item-card">
      <div className="item-meta">
        <span className="tag">{item.tag || '精选'}</span>
        {item.status && <span className="status">{item.status}</span>}
      </div>
      <h3>{item.title}</h3>
      <p className="summary">{item.summary}</p>
      <div className="why">
        <strong>为什么值得关注：</strong>{item.why}
      </div>
      <a href={item.url} target="_blank" rel="noreferrer" className="source-link">
        查看来源 <ArrowUpRight size={15} />
      </a>
    </article>
  );
}

function App() {
  return (
    <main>
      <section className="hero">
        <div className="hero-badge"><Sparkles size={16} /> AI Daily Briefing</div>
        <h1>{daily.title}</h1>
        <p className="subtitle">{daily.subtitle}</p>
        <div className="date-row"><CalendarDays size={17} /> {daily.date}</div>
      </section>

      <section className="overview">
        <h2>今日导读</h2>
        <p>{daily.summary}</p>
      </section>

      <div className="sections">
        {daily.sections.map((section) => (
          <section className="section" key={section.name}>
            <div className="section-title">
              <span>{section.name}</span>
              <small>{section.items.length} 条</small>
            </div>
            <div className="cards">
              {section.items.map((item) => <ItemCard item={item} key={`${section.name}-${item.title}`} />)}
            </div>
          </section>
        ))}
      </div>

      <section className="actions">
        <h2>今日可行动建议</h2>
        <ul>
          {daily.actions.map((action) => (
            <li key={action}><CheckCircle2 size={18} /> <span>{action}</span></li>
          ))}
        </ul>
      </section>

      <footer>
        由 Hermes cron 自动生成 · GitHub + Vercel 自动部署
      </footer>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
