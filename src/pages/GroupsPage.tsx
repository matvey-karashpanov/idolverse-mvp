import { useMemo, useState } from 'react';
import { Search, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SectionTitle } from '../components/SectionTitle';
import { musicGroups } from '../data/groups';

const directions = ['Все', 'K-POP', 'C-POP', 'J-POP'] as const;

export function GroupsPage() {
  const [query, setQuery] = useState('');
  const [direction, setDirection] = useState<(typeof directions)[number]>('Все');
  const filteredGroups = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase();
    return musicGroups.filter((group) => {
      const matchesDirection = direction === 'Все' || group.direction === direction;
      const searchable = [group.name, group.agency, group.country, ...group.members].join(' ').toLocaleLowerCase();
      return matchesDirection && (!normalized || searchable.includes(normalized));
    });
  }, [query, direction]);

  const resetFilters = () => { setQuery(''); setDirection('Все'); };

  return <div className="page">
    <SectionTitle title="Каталог групп" />
    <div className="catalog-toolbar">
      <label className="search-field">
        <Search size={19}/>
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Название, агентство, страна или участник..." aria-label="Поиск групп"/>
        <kbd>⌕</kbd>
      </label>
      <div className="filter-row">{directions.map((item) => <button key={item} className={direction === item ? 'filter-chip active' : 'filter-chip'} onClick={() => setDirection(item)}>{item}</button>)}</div>
      <button className="reset-button" onClick={resetFilters}>Сбросить <ArrowRight size={15}/></button>
    </div>
    <div className="results-line"><span>{filteredGroups.length} {filteredGroups.length === 1 ? 'группа' : 'групп'}</span></div>
    {filteredGroups.length ? <div className="groups-grid">
      {filteredGroups.map(group => <Link to={`/groups/${group.id}`} className="group-card" key={group.id}>
        <div className={`group-card-art ${group.groupPhoto ? 'has-group-photo' : ''}`}>{group.groupPhoto ? <img onLoad={(event) => event.currentTarget.classList.add("is-loaded")} onError={(event) => event.currentTarget.classList.add("is-error")} loading="lazy" decoding="async" src={group.groupPhoto} alt={`${group.name} — групповая фотография`} /> : <><Users size={34}/><span>ФОТО ГРУППЫ</span></>}</div>
        <div className="group-card-content"><span className="tag">{group.direction}</span><h2>{group.name}</h2><p>{group.agency}</p>
          <div className="group-card-meta"><span>Дебют: {group.debut}</span><span>{group.memberCount} участников</span></div>
        </div>
      </Link>)}
    </div> : <div className="state-panel empty-state"><span>✦</span><h3>Ничего не найдено</h3><p>Попробуй изменить запрос или выбрать другое направление.</p><button className="button secondary" onClick={resetFilters}>Сбросить фильтры</button></div>}
  </div>;
}
