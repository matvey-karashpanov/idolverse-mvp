import { CalendarDays, ArrowUpRight, Newspaper, ExternalLink } from 'lucide-react';
import { mockNews } from '../data/mockData';
import { SectionTitle } from '../components/SectionTitle';

export function NewsPage() {
  return <div className="page">
    <SectionTitle eyebrow="WHAT'S NEW" title="Новости IDOLVERSE" description="Новости, релизы и события азиатской музыкальной сцены."/>
    <div className="news-grid">
      {mockNews.map((item, index) => <article className="news-card" key={item.id}>
        <div className={`news-art ${item.image ? 'has-news-image' : ''}`}>
          {item.image ? <img src={item.image} alt={item.title} /> : <><Newspaper size={34}/><span>NEWS / 0{index + 1}</span></>}
        </div>
        <div className="news-body">
          <div className="news-meta"><span className="tag">{item.category}</span><span><CalendarDays size={14}/>{item.date}</span></div>
          <h2>{item.title}</h2><p>{item.summary}</p>
          {item.sourceUrl ? <a className="news-more" href={item.sourceUrl} target="_blank" rel="noreferrer">Источник <ExternalLink size={15}/></a> : <span className="news-more">Демо-материал <ArrowUpRight size={16}/></span>}
        </div>
      </article>)}
    </div>
    <p className="demo-disclaimer">Для новостей о релизах указаны ссылки на публикации СМИ и официальные страницы. Остальные материалы ленты демонстрационные.</p>
  </div>;
}
