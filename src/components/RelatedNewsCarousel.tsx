import { ArrowRight, Music2 } from 'lucide-react';
import type { NewsItem } from '../data/mockData';

export function RelatedNewsCarousel({ items, emptyText = 'Связанных новостей пока нет.' }: { items: NewsItem[]; emptyText?: string }) {
  if (!items.length) return <section className="profile-section">
    <div className="profile-section-heading"><h2>Карьера и события</h2></div>
    <p className="related-news-empty">{emptyText}</p>
  </section>;

  return <section className="profile-section">
    <div className="profile-section-heading"><h2>Карьера и события</h2></div>
    <div className="profile-carousel">
      <div className="profile-card-grid related-news-track">
        {items.map(item => <article className="profile-timeline-card related-news-card" key={item.id}>
          <div className={`profile-card-art related-news-art ${item.image ? 'has-related-news-image' : ''}`}>
            {item.image ? <img onLoad={(event) => event.currentTarget.classList.add("is-loaded")} onError={(event) => event.currentTarget.classList.add("is-error")} loading="lazy" decoding="async" src={item.image} alt={item.title}/> : <><Music2 size={25}/><span>НОВОСТИ</span></>}
          </div>
          <div className="profile-card-caption">
            <strong>{item.date}</strong>
            <span>{item.title}</span>
            {item.sourceUrl && <a className="related-news-source" href={item.sourceUrl} target="_blank" rel="noreferrer">Источник <ArrowRight size={12}/></a>}
          </div>
        </article>)}
      </div>
    </div>
  </section>;
}
