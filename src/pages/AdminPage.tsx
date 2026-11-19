import { useMemo, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, Check, CheckCheck, ChevronRight, CircleHelp, Clock3, FilePenLine, Inbox, LayoutDashboard, LogOut, Search, ShieldCheck, Users, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { updateCorrection, deleteCorrection, type Correction, type CorrectionStatus } from '../features/corrections/correctionsSlice';
import { updateIdol } from '../features/idols/idolsSlice';
import type { Idol } from '../data/mockData';
import { assetUrl } from '../utils/assetUrl';

type Section = 'overview' | 'inbox' | 'catalog';
const statusLabels: Record<CorrectionStatus,string> = { new:'Новое', in_progress:'В работе', resolved:'Решено' };

export function AdminPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const corrections = useAppSelector(state => state.corrections.items);
  const idols = useAppSelector(state => state.idols.items);
  const [authorized] = useState(() => localStorage.getItem('idolverse-current-role') === 'admin');
  const [section,setSection] = useState<Section>('overview');
  const [activeId,setActiveId] = useState<string|null>(null);
  const [filter,setFilter] = useState<'all'|CorrectionStatus>('all');
  const [query,setQuery] = useState('');
  const [idolQuery,setIdolQuery] = useState('');
  const [editingIdol,setEditingIdol] = useState<Idol|null>(null);
  const [notice,setNotice] = useState('');
  const selected = corrections.find(item => item.id === activeId) ?? null;
  const newCount = corrections.filter(item => (item.status ?? 'new') === 'new').length;
  const progressCount = corrections.filter(item => item.status === 'in_progress').length;
  const filteredCorrections = useMemo(() => corrections.filter(item => {
    const status = item.status ?? 'new';
    const matchesStatus = filter === 'all' || status === filter;
    const haystack = `${item.name} ${item.email} ${item.target} ${item.message}`.toLowerCase();
    return matchesStatus && haystack.includes(query.toLowerCase());
  }),[corrections,filter,query]);
  const filteredIdols = idols.filter(item => `${item.name} ${item.group}`.toLowerCase().includes(idolQuery.toLowerCase()));

  const selectSection = (next:Section) => { setSection(next); setActiveId(null); setNotice(''); };
  const saveIdol = (event:FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingIdol) return;
    dispatch(updateIdol({ ...editingIdol, photo: editingIdol.photo ? assetUrl(editingIdol.photo) : '' }));
    setEditingIdol(null);
    setNotice('Изменения профиля сохранены на этом устройстве.');
  };
  const updateStatus = (item:Correction,status:CorrectionStatus) => dispatch(updateCorrection({id:item.id,status}));
  const dateLabel = (value:string) => new Intl.DateTimeFormat('ru-RU',{day:'numeric',month:'long',year:'numeric',hour:'2-digit',minute:'2-digit'}).format(new Date(value));

  if (!authorized) return <div className="admin-gate page"><div className="admin-gate-card"><div className="admin-gate-icon"><ShieldCheck size={30}/></div><span className="admin-eyebrow">IDOLVERSE · CONTROL ROOM</span><h1>Требуется вход администратора</h1><p>Войдите через иконку пользователя на сайте с учётной записью администратора. Обычные пользовательские аккаунты не имеют доступа к этой странице.</p><div className="admin-demo-note"><CircleHelp size={17}/><span>Демо-доступ: admin@idolverse.com · пароль Admin123!</span></div><Link to="/" className="button primary">Вернуться на сайт и войти <ChevronRight size={17}/></Link><a href="/" className="admin-back-link">Вернуться на сайт</a></div></div>;

  return <div className="admin-shell">
    <aside className="admin-sidebar">
      <a href="/" className="admin-brand"><span className="admin-brand-mark">✦</span><span>IDOLVERSE<small>ADMIN SPACE</small></span></a>
      <div className="admin-side-label">РАБОЧЕЕ ПРОСТРАНСТВО</div>
      <button className={section==='overview'?'admin-nav-item active':'admin-nav-item'} onClick={()=>selectSection('overview')}><LayoutDashboard size={18}/>Обзор</button>
      <button className={section==='inbox'?'admin-nav-item active':'admin-nav-item'} onClick={()=>selectSection('inbox')}><Inbox size={18}/>Обращения{newCount>0&&<b>{newCount}</b>}</button>
      <button className={section==='catalog'?'admin-nav-item active':'admin-nav-item'} onClick={()=>selectSection('catalog')}><Users size={18}/>Каталог артистов</button>
      <div className="admin-sidebar-bottom"><div className="admin-profile-mini"><div className="admin-avatar">A</div><div><strong>Администратор</strong><span>Демо-аккаунт</span></div></div><button className="admin-logout" onClick={()=>{localStorage.removeItem('idolverse-current-user');localStorage.removeItem('idolverse-current-role');navigate('/');}}><LogOut size={16}/>Выйти</button><a href="/" className="admin-public-link">← Открыть публичный сайт</a></div>
    </aside>
    <main className="admin-main">
      <header className="admin-topbar"><div><span className="admin-topbar-kicker">IDOLVERSE / ADMIN</span><strong>{section==='overview'?'Обзор':section==='inbox'?'Обращения пользователей':'Управление каталогом'}</strong></div><div className="admin-topbar-right"><span className="admin-live-dot"/>Демо-режим <button className="admin-bell" onClick={()=>selectSection('inbox')} aria-label="Открыть обращения"><Bell size={19}/>{newCount>0&&<i/>}</button></div></header>
      <div className="admin-content">
        {notice && <div className="admin-notice"><CheckCircle2Icon/> {notice}<button onClick={()=>setNotice('')} aria-label="Закрыть"><X size={15}/></button></div>}
        {section==='overview' && <section>
          <div className="admin-welcome"><div><span className="admin-eyebrow">ПАНЕЛЬ УПРАВЛЕНИЯ</span><h1>С возвращением!</h1><p>Здесь собраны обращения пользователей и быстрый доступ к обновлению каталога.</p></div><div className="admin-welcome-art">✦</div></div>
          <div className="admin-stats-grid">
            <button className="admin-stat-card" onClick={()=>{setFilter('all');selectSection('inbox')}}><span className="admin-stat-icon violet"><Inbox size={19}/></span><span>Всего обращений</span><strong>{corrections.length}</strong><small>Все сообщения сообщества</small></button>
            <button className="admin-stat-card" onClick={()=>{setFilter('new');selectSection('inbox')}}><span className="admin-stat-icon amber"><Bell size={19}/></span><span>Новые</span><strong>{newCount}</strong><small>Требуют внимания</small></button>
            <button className="admin-stat-card" onClick={()=>{setFilter('in_progress');selectSection('inbox')}}><span className="admin-stat-icon blue"><Clock3 size={19}/></span><span>В работе</span><strong>{progressCount}</strong><small>На рассмотрении</small></button>
            <button className="admin-stat-card" onClick={()=>selectSection('catalog')}><span className="admin-stat-icon green"><Users size={19}/></span><span>Артисты в каталоге</span><strong>{idols.length}</strong><small>Доступны для редактирования</small></button>
          </div>
          <div className="admin-overview-grid"><div className="admin-panel"><div className="admin-panel-heading"><div><h2>Последние обращения</h2><p>Новые сообщения от пользователей</p></div><button className="admin-text-action" onClick={()=>selectSection('inbox')}>Все обращения <ChevronRight size={15}/></button></div>
            {corrections.length ? corrections.slice(0,5).map(item=><button className="admin-recent-row" key={item.id} onClick={()=>{selectSection('inbox');setActiveId(item.id);}}><span className="admin-recent-avatar">{item.name.trim().charAt(0).toUpperCase()}</span><span className="admin-recent-copy"><strong>{item.name}</strong><small>{item.target||'Общее предложение'} · {item.message.slice(0,58)}{item.message.length>58?'…':''}</small></span><span className={`admin-status-pill ${item.status??'new'}`}>{statusLabels[item.status??'new']}</span></button>) : <div className="admin-empty"><Inbox size={28}/><strong>Пока нет обращений</strong><span>Когда пользователь отправит форму, сообщение появится здесь.</span></div>}
          </div><div className="admin-panel admin-quick-panel"><div className="admin-panel-heading"><div><h2>Быстрые действия</h2><p>Что нужно сделать?</p></div></div><button className="admin-quick-action" onClick={()=>selectSection('inbox')}><span className="admin-quick-icon"><Inbox size={18}/></span><span><strong>Разобрать обращения</strong><small>Просмотреть сообщения и обновить статус</small></span><ChevronRight size={17}/></button><button className="admin-quick-action" onClick={()=>selectSection('catalog')}><span className="admin-quick-icon"><FilePenLine size={18}/></span><span><strong>Изменить профиль артиста</strong><small>Обновить биографию и данные в каталоге</small></span><ChevronRight size={17}/></button></div></div>
        </section>}
        {section==='inbox' && <section><div className="admin-page-heading"><div><span className="admin-eyebrow">COMMUNITY / FEEDBACK</span><h1>Обращения</h1><p>Все предложения и исправления, отправленные через форму обратной связи.</p></div><div className="admin-heading-count"><strong>{corrections.length}</strong><span>сообщений</span></div></div>
          <div className="admin-inbox-toolbar"><div className="admin-search"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Поиск по имени, email или сообщению"/></div><div className="admin-filter-tabs">{(['all','new','in_progress','resolved'] as const).map(key=><button key={key} className={filter===key?'selected':''} onClick={()=>setFilter(key)}>{key==='all'?'Все':statusLabels[key]}</button>)}</div></div>
          <div className="admin-inbox-layout"><div className="admin-message-list">{filteredCorrections.length ? filteredCorrections.map(item=><button key={item.id} className={`admin-message-card ${activeId===item.id?'selected':''}`} onClick={()=>setActiveId(item.id)}><div className="admin-message-top"><span className="admin-message-avatar">{item.name.trim().charAt(0).toUpperCase()}</span><span className="admin-message-person"><strong>{item.name}</strong><small>{item.email}</small></span><time>{dateLabel(item.createdAt)}</time></div><span className="admin-message-target">{item.target||'Общее предложение'}</span><p>{item.message}</p><span className={`admin-status-pill ${item.status??'new'}`}>{statusLabels[item.status??'new']}</span></button>) : <div className="admin-empty"><Inbox size={28}/><strong>Ничего не найдено</strong><span>Попробуй изменить фильтр или поисковый запрос.</span></div>}</div>
            <div className="admin-message-detail">{selected ? <MessageDetail key={selected.id} item={selected} onStatus={status=>updateStatus(selected,status)} onDelete={()=>{dispatch(deleteCorrection(selected.id));setActiveId(null);}}/> : <div className="admin-detail-placeholder"><div><Inbox size={30}/></div><strong>Выбери обращение</strong><span>Подробности сообщения и действия появятся здесь.</span></div>}</div>
          </div>
        </section>}
        {section==='catalog' && <section><div className="admin-page-heading"><div><span className="admin-eyebrow">CONTENT / ARTISTS</span><h1>Каталог артистов</h1><p>Редактируй информацию в профилях. Изменения сразу отобразятся на публичной стороне этого браузера.</p></div><div className="admin-heading-count"><strong>{idols.length}</strong><span>артистов</span></div></div>
          <div className="admin-search catalog-search"><Search size={17}/><input value={idolQuery} onChange={e=>setIdolQuery(e.target.value)} placeholder="Найти артиста или группу"/></div>
          {editingIdol ? <form className="admin-edit-form" onSubmit={saveIdol}><div className="admin-panel-heading"><div><h2>Редактирование профиля</h2><p>{editingIdol.name} · {editingIdol.group}</p></div><button type="button" className="admin-icon-button" onClick={()=>setEditingIdol(null)}><X size={18}/></button></div><div className="admin-form-grid">
            <label>Имя артиста<input required value={editingIdol.name} onChange={e=>setEditingIdol({...editingIdol,name:e.target.value})}/></label><label>Имя на родном языке<input value={editingIdol.nativeName} onChange={e=>setEditingIdol({...editingIdol,nativeName:e.target.value})}/></label><label>Группа<input value={editingIdol.group} onChange={e=>setEditingIdol({...editingIdol,group:e.target.value})}/></label><label>Роль / позиция<input value={editingIdol.role} onChange={e=>setEditingIdol({...editingIdol,role:e.target.value})}/></label><label>Дата рождения<input value={editingIdol.birthday} onChange={e=>setEditingIdol({...editingIdol,birthday:e.target.value})}/></label><label>Страна<input value={editingIdol.country} onChange={e=>setEditingIdol({...editingIdol,country:e.target.value})}/></label><label>Агентство<input value={editingIdol.agency} onChange={e=>setEditingIdol({...editingIdol,agency:e.target.value})}/></label><label>Фото (путь к изображению)<input value={editingIdol.photo??''} onChange={e=>setEditingIdol({...editingIdol,photo:e.target.value})} placeholder="/images/artist.jpg"/></label><label className="wide">Биография<textarea rows={5} value={editingIdol.bio} onChange={e=>setEditingIdol({...editingIdol,bio:e.target.value})}/></label></div><div className="admin-form-actions"><button type="button" className="button secondary" onClick={()=>setEditingIdol(null)}>Отмена</button><button className="button primary" type="submit"><Check size={16}/>Сохранить изменения</button></div></form> : <div className="admin-artist-grid">{filteredIdols.map(item=><article className="admin-artist-card" key={item.id}><div className="admin-artist-photo">{item.photo?<img src={item.photo} alt=""/>:<Users size={22}/>}</div><div className="admin-artist-copy"><strong>{item.name}</strong><span>{item.group} · {item.direction}</span></div><button className="admin-edit-button" onClick={()=>{setEditingIdol(item);setNotice('');}}><FilePenLine size={15}/>Изменить</button></article>)}</div>}
        </section>}
      </div>
    </main>
  </div>;
}

function MessageDetail({item,onStatus,onDelete}:{item:Correction;onStatus:(status:CorrectionStatus)=>void;onDelete:()=>void}) {
  const [reply,setReply] = useState(item.adminReply??'');
  const [saved,setSaved] = useState(false);
  const dispatch = useAppDispatch();
  const saveReply = () => { dispatch(updateCorrection({id:item.id,adminReply:reply})); setSaved(true); };
  return <div className="admin-detail-inner"><div className="admin-detail-header"><div><span className="admin-eyebrow">ВХОДЯЩЕЕ ОБРАЩЕНИЕ</span><h2>{item.target||'Общее предложение'}</h2></div><span className={`admin-status-pill ${item.status??'new'}`}>{statusLabels[item.status??'new']}</span></div><div className="admin-sender"><div className="admin-message-avatar large">{item.name.trim().charAt(0).toUpperCase()}</div><div><strong>{item.name}</strong><a href={`mailto:${item.email}`}>{item.email}</a></div></div><div className="admin-detail-date"><Clock3 size={14}/>{new Intl.DateTimeFormat('ru-RU',{dateStyle:'long',timeStyle:'short'}).format(new Date(item.createdAt))}</div><div className="admin-user-message"><span>СООБЩЕНИЕ ПОЛЬЗОВАТЕЛЯ</span><p>{item.message}</p></div><div className="admin-detail-section"><label htmlFor="admin-reply">Внутренняя заметка администратора</label><textarea id="admin-reply" rows={4} value={reply} onChange={e=>{setReply(e.target.value);setSaved(false);}} placeholder="Например: проверить дату релиза по официальному источнику..."/><button className="button secondary" onClick={saveReply}>Сохранить заметку</button>{saved&&<small className="admin-saved-note">Заметка сохранена</small>}</div><div className="admin-detail-section"><span className="admin-detail-label">СТАТУС ОБРАЩЕНИЯ</span><div className="admin-status-actions"><button className={(item.status??'new')==='new'?'current':''} onClick={()=>onStatus('new')}>Новое</button><button className={item.status==='in_progress'?'current':''} onClick={()=>onStatus('in_progress')}><Clock3 size={14}/>В работе</button><button className={item.status==='resolved'?'current':''} onClick={()=>onStatus('resolved')}><CheckCheck size={14}/>Решено</button></div></div><div className="admin-detail-footer"><button className="admin-delete-action" onClick={onDelete}>Удалить обращение</button><a href={`mailto:${item.email}?subject=${encodeURIComponent('Ответ по обращению в IDOLVERSE')}`} className="button primary">Ответить по email ↗</a></div></div>;
}

function CheckCircle2Icon(){ return <CheckCheck size={17}/>; }
