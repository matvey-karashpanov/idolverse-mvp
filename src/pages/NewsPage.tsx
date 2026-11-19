import { useMemo, useState } from 'react';
import { CalendarDays, ArrowUpRight, Newspaper, ExternalLink, Search, ArrowRight } from 'lucide-react';
import { useAppSelector } from '../app/hooks';
import { getGroups, getNews } from '../utils/contentStorage';
import { SectionTitle } from '../components/SectionTitle';

const directions = ['Все', 'K-POP', 'C-POP', 'J-POP'] as const;

export function NewsPage() {
  const idols = useAppSelector((state) => state.idols.items);
  const [query, setQuery] = useState('');
  const [news] = useState(getNews);
  const [groups] = useState(getGroups);
  const [direction, setDirection] = useState<(typeof directions)[number]>('Все');
  const filteredNews = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase();
    return news.filter((item) => {
      const text = `${item.title} ${item.summary} ${item.category}`.toLocaleLowerCase();
      const relatedGroupIds = item.groupIds ?? [];
      const relatedIdols = idols.filter((idol) => item.idolIds?.includes(idol.id));
      const relatedGroups = groups.filter((group) => relatedGroupIds.includes(group.id));
      const directionsForItem = [...relatedIdols.map((idol) => idol.direction), ...relatedGroups.map((group) => group.direction)];
      const matchesDirection = direction === 'Все' || directionsForItem.includes(direction) || (!relatedGroupIds.length && !item.idolIds?.length);
      return matchesDirection && (!normalized || text.includes(normalized));
    });
  }, [news, groups, idols, query, direction]);
  const resetFilters = () => { setQuery(''); setDirection('Все'); };

  return <div className="page">
    <SectionTitle title="Новости IDOLVERSE" />
    <div className="catalog-toolbar">
      <label className="search-field">
        <Search size={19}/>
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Поиск новостей..." aria-label="Поиск новостей"/>
        <kbd>⌕</kbd>
      </label>
      <div className="filter-row">{directions.map((item) => <button key={item} type="button" className={direction === item ? 'filter-chip active' : 'filter-chip'} onClick={() => setDirection(item)}>{item}</button>)}</div>
      <button className="reset-button" type="button" onClick={resetFilters}>Сбросить <ArrowRight size={15}/></button>
    </div>
    <div className="results-line"><span>{filteredNews.length} {filteredNews.length === 1 ? 'новость' : 'новостей'}</span></div>
    {filteredNews.length ? <div className="news-grid">
      {filteredNews.map((item, index) => <article className="news-card" key={item.id}>
        <div className={`news-art ${item.image ? 'has-news-image' : ''}`}>
          {item.image ? <img onLoad={(event) => event.currentTarget.classList.add("is-loaded")} onError={(event) => event.currentTarget.classList.add("is-error")} src={item.image} alt={item.title} loading="lazy" decoding="async" /> : <><Newspaper size={34}/><span>NEWS / 0{index + 1}</span></>}
        </div>
        <div className="news-body">
          <div className="news-meta"><span className="tag">{item.category}</span><span><CalendarDays size={14}/>{item.date}</span></div>
          <h2>{item.title}</h2><p>{item.summary}</p>
          {item.sourceUrl ? <a className="news-more" href={item.sourceUrl} target="_blank" rel="noreferrer">Источник <ExternalLink size={15}/></a> : <span className="news-more">Демо-материал <ArrowUpRight size={16}/></span>}
        </div>
      </article>)}
    </div> : <div className="state-panel empty-state"><span>✦</span><h3>Ничего не найдено</h3><p>Попробуй изменить запрос или выбрать другое направление.</p><button className="button secondary" onClick={resetFilters}>Сбросить фильтры</button></div>}
    <p className="demo-disclaimer">Для новостей о релизах указаны ссылки на публикации СМИ и официальные страницы. Остальные материалы ленты демонстрационные.</p>
  </div>;
}
