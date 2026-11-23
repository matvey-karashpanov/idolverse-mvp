import { useMemo, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, CheckCheck, ChevronRight, CircleHelp, Clock3, FilePenLine, Inbox, LogOut, Search, ShieldCheck, Users, X, Newspaper, ImagePlus, Plus, Trash2, Save } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { updateCorrection, deleteCorrection, type Correction, type CorrectionStatus } from '../features/corrections/correctionsSlice';
import { updateIdol } from '../features/idols/idolsSlice';
import type { Idol } from '../data/mockData';
import { getGroups, saveGroups, getNews, saveNews } from '../utils/contentStorage';
import type { MusicGroup } from '../data/groups';
import type { NewsItem } from '../data/mockData';
import { addIdol, removeIdol } from '../features/idols/idolsSlice';

type Section = 'inbox' | 'catalog' | 'groups' | 'news';
const statusLabels: Record<CorrectionStatus,string> = { new:'Новое', in_progress:'В работе', resolved:'Решено' };

async function optimizeUploadedImage(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const maxDimension = 1400;
  const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Не удалось обработать изображение');
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return canvas.toDataURL('image/jpeg', 0.82);
}

export function AdminPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const corrections = useAppSelector(state => state.corrections.items);
  const idols = useAppSelector(state => state.idols.items);
  const [authorized] = useState(() => localStorage.getItem('idolverse-current-role') === 'admin');
  const [section,setSection] = useState<Section>('inbox');
  const [activeId,setActiveId] = useState<string|null>(null);
  const [filter,setFilter] = useState<'all'|CorrectionStatus>('all');
  const [query,setQuery] = useState('');
  const [idolQuery,setIdolQuery] = useState('');
  const [editingIdol,setEditingIdol] = useState<Idol|null>(null);
  const [notice,setNotice] = useState('');
  const [groups, setGroups] = useState<MusicGroup[]>(getGroups);
  const [news, setNews] = useState<NewsItem[]>(getNews);
  const [newIdol, setNewIdol] = useState(false);
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

  const selectSection = (next:Section) => { setSection(next); setActiveId(null); setNotice(''); setEditingIdol(null); setNewIdol(false); };
  const saveIdol = (event:FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingIdol) return;
    if(newIdol) dispatch(addIdol(editingIdol)); else dispatch(updateIdol(editingIdol));
    setEditingIdol(null);
    setNewIdol(false);
    setNotice('Изменения профиля сохранены на этом устройстве.');
  };
  const updateStatus = (item:Correction,status:CorrectionStatus) => dispatch(updateCorrection({id:item.id,status}));
  const dateLabel = (value:string) => new Intl.DateTimeFormat('ru-RU',{day:'numeric',month:'long',year:'numeric',hour:'2-digit',minute:'2-digit'}).format(new Date(value));

  if (!authorized) return <div className="admin-gate page"><div className="admin-gate-card"><div className="admin-gate-icon"><ShieldCheck size={30}/></div><span className="admin-eyebrow">IDOLVERSE · CONTROL ROOM</span><h1>Требуется вход администратора</h1><p>Войдите через иконку пользователя на сайте с учётной записью администратора. Обычные пользовательские аккаунты не имеют доступа к этой странице.</p><div className="admin-demo-note"><CircleHelp size={17}/><span>Демо-доступ: admin@idolverse.com · пароль Admin123!</span></div><Link to="/" className="button primary">Вернуться на сайт и войти <ChevronRight size={17}/></Link><a href="/" className="admin-back-link">Вернуться на сайт</a></div></div>;

  return <div className="admin-shell">
    <aside className="admin-sidebar">
      <a href="/" className="admin-brand"><span className="admin-brand-mark iv-logo-mark">IV</span><span>IDOLVERSE<small>ADMIN SPACE</small></span></a>
      <div className="admin-side-label">РАБОЧЕЕ ПРОСТРАНСТВО</div>
      <button className={section==='inbox'?'admin-nav-item active':'admin-nav-item'} onClick={()=>selectSection('inbox')}><Inbox size={18}/>Обращения{newCount>0&&<b>{newCount}</b>}</button>
      <button className={section==='catalog'?'admin-nav-item active':'admin-nav-item'} onClick={()=>selectSection('catalog')}><Users size={18}/>Артисты</button>
      <button className={section==='groups'?'admin-nav-item active':'admin-nav-item'} onClick={()=>selectSection('groups')}><Users size={18}/>Группы</button>
      <button className={section==='news'?'admin-nav-item active':'admin-nav-item'} onClick={()=>selectSection('news')}><Newspaper size={18}/>Новости</button>
      <div className="admin-sidebar-bottom"><button className="admin-logout" onClick={()=>{localStorage.removeItem('idolverse-current-user');localStorage.removeItem('idolverse-current-role');navigate('/');}}><LogOut size={16}/>Выйти</button></div>
    </aside>
    <main className="admin-main">
      <header className="admin-topbar"><div><strong>{{inbox:'Обращения пользователей',catalog:'Управление артистами',groups:'Управление группами',news:'Управление новостями'}[section]}</strong></div></header>
      <div className="admin-content">
        {notice && <div className="admin-notice"><CheckCircle2Icon/> {notice}<button onClick={()=>setNotice('')} aria-label="Закрыть"><X size={15}/></button></div>}
        {section==='inbox' && <section><div className="admin-page-heading"><div><h1>Обращения</h1></div><div className="admin-heading-count"><strong>{corrections.length}</strong><span>сообщений</span></div></div>
          <div className="admin-inbox-stats"><div><span>Всего обращений</span><strong>{corrections.length}</strong></div><div><span>Новые</span><strong>{newCount}</strong></div><div><span>В работе</span><strong>{progressCount}</strong></div></div>
          <div className="admin-inbox-toolbar"><div className="admin-search"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Поиск по имени, email или сообщению"/></div><div className="admin-filter-tabs">{(['all','new','in_progress','resolved'] as const).map(key=><button key={key} className={filter===key?'selected':''} onClick={()=>setFilter(key)}>{key==='all'?'Все':statusLabels[key]}</button>)}</div></div>
          <div className="admin-inbox-layout"><div className="admin-message-list">{filteredCorrections.length ? filteredCorrections.map(item=><button key={item.id} className={`admin-message-card ${activeId===item.id?'selected':''}`} onClick={()=>setActiveId(item.id)}><div className="admin-message-top"><span className="admin-message-avatar">{(item.name || 'Г').trim().charAt(0).toUpperCase()}</span><span className="admin-message-person"><strong>{item.name}</strong><small>{item.email}</small></span><time>{dateLabel(item.createdAt)}</time></div><span className="admin-message-target">{item.target||'Общее предложение'}</span><p>{item.message}</p><span className={`admin-status-pill ${item.status??'new'}`}>{statusLabels[item.status??'new']}</span></button>) : <div className="admin-empty"><Inbox size={28}/><strong>Ничего не найдено</strong><span>Попробуй изменить фильтр или поисковый запрос.</span></div>}</div>
            <div className="admin-message-detail">{selected ? <MessageDetail key={selected.id} item={selected} onStatus={status=>updateStatus(selected,status)} onDelete={()=>{dispatch(deleteCorrection(selected.id));setActiveId(null);}}/> : <div className="admin-detail-placeholder"><div><Inbox size={30}/></div><strong>Выбери обращение</strong><span>Подробности сообщения и действия появятся здесь.</span></div>}</div>
          </div>
        </section>}
        {section==='catalog' && <section><div className="admin-page-heading"><div><h1>Каталог артистов</h1></div><div className="admin-heading-count"><strong>{idols.length}</strong><span>артистов</span></div></div>
          <div className="admin-manager-toolbar"><div className="admin-search catalog-search"><Search size={17}/><input value={idolQuery} onChange={e=>setIdolQuery(e.target.value)} placeholder="Найти артиста или группу"/></div><button className="button primary" onClick={()=>{setEditingIdol({id:`idol-${Date.now()}`,name:'',nativeName:'',direction:'K-POP',group:'Сольный проект',role:'',birthday:'',country:'',agency:'',bio:'',debut:'',status:'Активен'});setNewIdol(true);}}><Plus size={16}/>Добавить артиста</button></div>
          {editingIdol ? <form className="admin-edit-form" onSubmit={saveIdol}><div className="admin-panel-heading"><div><h2>Редактирование профиля</h2><p>{editingIdol.name} · {editingIdol.group}</p></div><button type="button" className="admin-icon-button" onClick={()=>setEditingIdol(null)}><X size={18}/></button></div><div className="admin-form-grid">
            <label>Имя артиста<input required value={editingIdol.name} onChange={e=>setEditingIdol({...editingIdol,name:e.target.value})}/></label><label>Имя на родном языке<input value={editingIdol.nativeName} onChange={e=>setEditingIdol({...editingIdol,nativeName:e.target.value})}/></label><label>Направление<select value={editingIdol.direction} onChange={e=>setEditingIdol({...editingIdol,direction:e.target.value as Idol['direction']})}><option>K-POP</option><option>C-POP</option><option>J-POP</option></select></label><label>Группа<input value={editingIdol.group} onChange={e=>setEditingIdol({...editingIdol,group:e.target.value})}/></label><label>Роль / позиция<input value={editingIdol.role} onChange={e=>setEditingIdol({...editingIdol,role:e.target.value})}/></label><label>Дата рождения<input value={editingIdol.birthday} onChange={e=>setEditingIdol({...editingIdol,birthday:e.target.value})}/></label><label>Страна<input value={editingIdol.country} onChange={e=>setEditingIdol({...editingIdol,country:e.target.value})}/></label><label>Агентство<input value={editingIdol.agency} onChange={e=>setEditingIdol({...editingIdol,agency:e.target.value})}/></label><label>Год дебюта<input value={editingIdol.debut} onChange={e=>setEditingIdol({...editingIdol,debut:e.target.value})}/></label><label>Статус<select value={editingIdol.status} onChange={e=>setEditingIdol({...editingIdol,status:e.target.value as Idol['status']})}><option>Активен</option><option>Сольный артист</option></select></label><label className="wide">Фотография артиста<input type="file" accept="image/*" onChange={async e=>{const file=e.target.files?.[0];if(file){try{const photo=await optimizeUploadedImage(file);setEditingIdol({...editingIdol,photo});}catch{setNotice('Не удалось загрузить изображение. Попробуй другой файл.');}}}}/><small>Загрузи портрет. Затем настрой положение лица в предпросмотре.</small></label><label>Положение по горизонтали<input type="range" min="0" max="100" value={Number(editingIdol.photoPositionX??50)} onChange={e=>setEditingIdol({...editingIdol,photoPositionX:Number(e.target.value)})}/></label><label>Положение по вертикали<input type="range" min="0" max="100" value={Number(editingIdol.photoPositionY??35)} onChange={e=>setEditingIdol({...editingIdol,photoPositionY:Number(e.target.value)})}/></label><label className="wide">Масштаб фото личной страницы <strong>{Math.round(Number(editingIdol.photoScale??1)*100)}%</strong><input type="range" min="50" max="300" step="5" value={Math.max(50,Math.min(300,Math.round(Number(editingIdol.photoScale??1)*100)))} onChange={e=>setEditingIdol({...editingIdol,photoScale:Number(e.target.value)/100})}/><small>Настройка влияет только на большую фотографию в профиле артиста.</small></label><div className="wide admin-panel-heading"><div><h3>Фото в каталоге «Айдолы»</h3><p>Независимое кадрирование карточки в общем каталоге.</p></div></div><label>Положение по горизонтали<input type="range" min="0" max="100" value={Number(editingIdol.catalogPhotoPositionX??editingIdol.photoPositionX??50)} onChange={e=>setEditingIdol({...editingIdol,catalogPhotoPositionX:Number(e.target.value)})}/></label><label>Положение по вертикали<input type="range" min="0" max="100" value={Number(editingIdol.catalogPhotoPositionY??editingIdol.photoPositionY??35)} onChange={e=>setEditingIdol({...editingIdol,catalogPhotoPositionY:Number(e.target.value)})}/></label><label className="wide">Масштаб фото карточки <strong>{Math.round(Number(editingIdol.catalogPhotoScale??1)*100)}%</strong><input type="range" min="50" max="300" step="5" value={Math.max(50,Math.min(300,Math.round(Number(editingIdol.catalogPhotoScale??1)*100)))} onChange={e=>setEditingIdol({...editingIdol,catalogPhotoScale:Number(e.target.value)/100})}/><small>Настройка влияет только на карточку в каталоге «Айдолы».</small></label><div className="admin-photo-preview"><img src={editingIdol.photo} alt="Предпросмотр фото в каталоге" style={{objectPosition:`${editingIdol.catalogPhotoPositionX??editingIdol.photoPositionX??50}% ${editingIdol.catalogPhotoPositionY??editingIdol.photoPositionY??35}%`,transform:editingIdol.catalogPhotoScale?`scale(${editingIdol.catalogPhotoScale})`:undefined}}/></div><div className="admin-photo-preview">{editingIdol.photo&&<img src={editingIdol.photo} alt="Предпросмотр портрета" style={{objectPosition:`${editingIdol.photoPositionX??50}% ${editingIdol.photoPositionY??35}%`,transform:editingIdol.photoScale?`scale(${editingIdol.photoScale})`:undefined}}/>}</div><label className="wide">Биография<textarea rows={5} value={editingIdol.bio} onChange={e=>setEditingIdol({...editingIdol,bio:e.target.value})}/></label></div><div className="admin-form-actions"><button type="button" className="button secondary" onClick={()=>{setEditingIdol(null);setNewIdol(false);}}>Отмена</button><button className="button primary" type="submit"><Check size={16}/>{newIdol?'Добавить артиста':'Сохранить изменения'}</button></div></form> : <div className="admin-artist-grid">{filteredIdols.map(item=><article className="admin-artist-card" key={item.id}><div className="admin-artist-photo">{item.photo?<img onLoad={(event) => event.currentTarget.classList.add("is-loaded")} onError={(event) => event.currentTarget.classList.add("is-error")} loading="lazy" decoding="async" src={item.photo} alt=""/>:<Users size={22}/>}</div><div className="admin-artist-copy"><strong>{item.name}</strong><span>{item.group} · {item.direction}</span></div><button className="admin-edit-button" onClick={()=>{setEditingIdol(item);setNewIdol(false);setNotice('');}}><FilePenLine size={15}/>Изменить</button><button className="admin-delete-action" onClick={()=>{if(window.confirm(`Удалить профиль ${item.name}?`))dispatch(removeIdol(item.id));}} aria-label={`Удалить ${item.name}`}><Trash2 size={15}/></button></article>)}</div>}
        </section>}
        {section==='groups' && <ContentManager title="Группы" items={groups} onSave={(items)=>{setGroups(items);saveGroups(items);setNotice('Изменения групп сохранены в этом браузере.');}} kind="groups" />}
        {section==='news' && <ContentManager title="Новости" items={news} onSave={(items)=>{setNews(items);saveNews(items);setNotice('Изменения новостей сохранены в этом браузере.');}} kind="news" />}
      </div>
    </main>
  </div>;
}

function ContentManager({title,items,onSave,kind}:{title:string;items:any[];onSave:(items:any[])=>void;kind:'groups'|'news'}) {
  const [editing,setEditing]=useState<any|null>(null);
  const [search,setSearch]=useState('');
  const isGroup=kind==='groups';
  const filtered=items.filter(item=>`${item.name??item.title} ${item.agency??item.category??''}`.toLowerCase().includes(search.toLowerCase()));
  const update=(key:string,value:any)=>setEditing((current:any)=>({...current,[key]:value}));
  const upload=async(file:File|undefined,field:string)=>{if(!file)return;try{update(field,await optimizeUploadedImage(file));}catch{window.alert('Не удалось обработать изображение. Попробуй другой файл.');}};
  const submit=(event:FormEvent)=>{event.preventDefault();const next=editing.id&&items.some(item=>item.id===editing.id)?items.map(item=>item.id===editing.id?editing:item):[{...editing,id:editing.id||`${kind}-${Date.now()}`},...items];onSave(next);setEditing(null);};
  const create=()=>setEditing(isGroup?{id:`group-${Date.now()}`,name:'',direction:'K-POP',country:'',debut:'',agency:'',status:'Активна',memberCount:0,members:[],discography:[],milestones:[],groupPhoto:'',groupPhotoPositionX:50,groupPhotoPositionY:50,groupPhotoScale:1,groupCardPhoto:'',groupCardPhotoPositionX:50,groupCardPhotoPositionY:50,groupCardPhotoScale:1}:{id:`news-${Date.now()}`,title:'',category:'Новости айдолов',date:new Date().toLocaleDateString('ru-RU'),summary:'',image:'',imagePositionX:50,imagePositionY:50,imageScale:1,sourceUrl:''});
  return <section><div className="admin-page-heading"><div><h1>{title}</h1></div><div className="admin-heading-count"><strong>{items.length}</strong><span>записей</span></div></div>
    <div className="admin-manager-toolbar"><div className="admin-search catalog-search"><Search size={17}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder={`Поиск: ${title.toLowerCase()}`}/></div><button className="button primary" onClick={create}><Plus size={16}/>Добавить {isGroup?'группу':'новость'}</button></div>
    {editing ? <form className="admin-edit-form" onSubmit={submit}><div className="admin-panel-heading"><div><h2>{isGroup?'Карточка группы':'Материал новости'}</h2><p>Заполни основные поля и добавь изображение.</p></div><button type="button" className="admin-icon-button" onClick={()=>setEditing(null)}><X size={18}/></button></div><div className="admin-form-grid">
      <label>{isGroup?'Название группы':'Заголовок'}<input required value={isGroup?editing.name:editing.title} onChange={e=>update(isGroup?'name':'title',e.target.value)}/></label>
      <label>Направление / категория{isGroup?<select value={editing.direction} onChange={e=>update('direction',e.target.value)}><option>K-POP</option><option>C-POP</option><option>J-POP</option></select>:<input value={editing.category} onChange={e=>update('category',e.target.value)}/>}</label>
      <label>Страна / дата{isGroup?<input value={editing.country} onChange={e=>update('country',e.target.value)}/>:<input value={editing.date} onChange={e=>update('date',e.target.value)}/>}</label>
      <label>Дебют / агентство{isGroup?<input value={editing.debut} onChange={e=>update('debut',e.target.value)}/>:<input value={editing.sourceUrl} onChange={e=>update('sourceUrl',e.target.value)} placeholder="Ссылка на источник"/>}</label>
      {isGroup&&<><label>Агентство<input value={editing.agency} onChange={e=>update('agency',e.target.value)}/></label><label>Статус<input value={editing.status} onChange={e=>update('status',e.target.value)}/></label><label>Участники через запятую<input value={(editing.members||[]).join(', ')} onChange={e=>{const members=e.target.value.split(',').map((v:string)=>v.trim()).filter(Boolean);update('members',members);update('memberCount',members.length);}}/></label></>}
      {!isGroup&&<><label className="wide">Краткое содержание<textarea rows={5} value={editing.summary} onChange={e=>update('summary',e.target.value)}/></label><label>Связанные группы (ID через запятую)<input value={(editing.groupIds||[]).join(', ')} onChange={e=>update('groupIds',e.target.value.split(',').map((v:string)=>v.trim()).filter(Boolean))}/></label><label>Связанные артисты (ID через запятую)<input value={(editing.idolIds||[]).join(', ')} onChange={e=>update('idolIds',e.target.value.split(',').map((v:string)=>v.trim()).filter(Boolean))}/></label></>}
      {isGroup ? <>
        <div className="wide admin-panel-heading"><div><h3>Фото для карточки в каталоге «Группы»</h3><p>Отдельное изображение и кадрирование для каталога. Можно приблизить фотографию независимо от страницы группы.</p></div></div>
        <label className="wide">Фотография карточки<input type="file" accept="image/*" onChange={e=>upload(e.target.files?.[0],'groupCardPhoto')}/><small>Если не загрузить отдельное фото, будет использоваться фотография страницы группы.</small></label>
        <label>Положение по горизонтали<input type="range" min="0" max="100" value={Number(editing.groupCardPhotoPositionX??50)} onChange={e=>update('groupCardPhotoPositionX',Number(e.target.value))}/></label>
        <label>Положение по вертикали<input type="range" min="0" max="100" value={Number(editing.groupCardPhotoPositionY??50)} onChange={e=>update('groupCardPhotoPositionY',Number(e.target.value))}/></label>
        <label className="wide">Масштаб фото карточки <strong>{Math.round(Number(editing.groupCardPhotoScale??1)*100)}%</strong><input type="range" min="50" max="300" step="5" value={Math.max(50,Math.min(300,Math.round(Number(editing.groupCardPhotoScale??1)*100)))} onChange={e=>update('groupCardPhotoScale',Number(e.target.value)/100)}/><small>Можно приблизить изображение в карточке, не меняя фото на странице группы.</small></label>
        <div className="admin-photo-preview"><img src={editing.groupCardPhoto||editing.groupPhoto} alt="Предпросмотр фотографии карточки" style={{objectPosition:`${editing.groupCardPhotoPositionX??50}% ${editing.groupCardPhotoPositionY??50}%`,objectFit:'cover',transform:`scale(${editing.groupCardPhotoScale??1})`}}/></div>
        <div className="wide admin-panel-heading"><div><h3>Главная фотография страницы группы</h3><p>Это большое изображение в профиле группы. Оно показывается целиком, без обрезания участников.</p></div></div>
        <label className="wide">Фотография страницы группы<input type="file" accept="image/*" onChange={e=>upload(e.target.files?.[0],'groupPhoto')}/><small>Изменение этого изображения не затронет фото карточки, если для неё загружено отдельное фото.</small></label>
        <label>Положение по горизонтали<input type="range" min="0" max="100" value={Number(editing.groupPhotoPositionX??50)} onChange={e=>update('groupPhotoPositionX',Number(e.target.value))}/></label>
        <label>Положение по вертикали<input type="range" min="0" max="100" value={Number(editing.groupPhotoPositionY??50)} onChange={e=>update('groupPhotoPositionY',Number(e.target.value))}/></label>
        <label className="wide">Масштаб фото страницы <strong>{Math.round(Number(editing.groupPhotoScale??1)*100)}%</strong><input type="range" min="50" max="100" step="5" value={Math.max(50,Math.min(100,Math.round(Number(editing.groupPhotoScale??1)*100)))} onChange={e=>update('groupPhotoScale',Number(e.target.value)/100)}/><small>Можно уменьшить фотографию, сохраняя её целиком и без обрезания.</small></label>
        <div className="admin-photo-preview"><img src={editing.groupPhoto} alt="Предпросмотр фотографии страницы группы" style={{objectFit:'contain',maxWidth:`${Math.min(100,Number(editing.groupPhotoScale??1)*100)}%`}}/></div>
      </> : <>
        <label className="wide">Фотография<input type="file" accept="image/*" onChange={e=>upload(e.target.files?.[0],'image')}/><small>Изображение сохранится локально в этом браузере.</small></label>
        <label>Положение по горизонтали<input type="range" min="0" max="100" value={Number(editing.imagePositionX??50)} onChange={e=>update('imagePositionX',Number(e.target.value))}/></label>
        <label>Положение по вертикали<input type="range" min="0" max="100" value={Number(editing.imagePositionY??50)} onChange={e=>update('imagePositionY',Number(e.target.value))}/></label>
        <label className="wide">Масштаб фотографии <strong>{Math.round(Number(editing.imageScale??1)*100)}%</strong><input type="range" min="100" max="200" step="5" value={Math.max(100,Math.min(200,Math.round(Number(editing.imageScale??1)*100)))} onChange={e=>update('imageScale',Number(e.target.value)/100)}/></label>
        <div className="admin-photo-preview">{editing.image&&<img src={editing.image} alt="Предпросмотр" style={{objectPosition:`${editing.imagePositionX??50}% ${editing.imagePositionY??50}%`,objectFit:'cover',transform:`scale(${editing.imageScale??1})`}}/>}</div>
      </>}
    </div><div className="admin-form-actions"><button type="button" className="button secondary" onClick={()=>setEditing(null)}>Отмена</button><button className="button primary" type="submit"><Save size={16}/>Сохранить</button></div></form> : <div className="admin-artist-grid">{filtered.map(item=><article className="admin-artist-card" key={item.id}><div className="admin-artist-photo">{(isGroup?(item.groupCardPhoto||item.groupPhoto):item.image)?<img src={isGroup?(item.groupCardPhoto||item.groupPhoto):item.image} alt=""/>:<ImagePlus size={22}/>}</div><div className="admin-artist-copy"><strong>{isGroup?item.name:item.title}</strong><span>{isGroup?`${item.direction} · ${item.agency}`:item.category}</span></div><button className="admin-edit-button" onClick={()=>setEditing(isGroup?{...item,groupCardPhoto:item.groupCardPhoto||item.groupPhoto,groupCardPhotoPositionX:item.groupCardPhotoPositionX??item.groupPhotoPositionX??50,groupCardPhotoPositionY:item.groupCardPhotoPositionY??item.groupPhotoPositionY??50,groupCardPhotoScale:item.groupCardPhotoScale??item.groupPhotoScale??1}:{...item})}><FilePenLine size={15}/>Изменить</button><button className="admin-delete-action" onClick={()=>onSave(items.filter(entry=>entry.id!==item.id))} aria-label="Удалить"><Trash2 size={15}/></button></article>)}</div>}
  </section>;
}

function MessageDetail({item,onStatus,onDelete}:{item:Correction;onStatus:(status:CorrectionStatus)=>void;onDelete:()=>void}) {
  const [reply,setReply] = useState(item.adminReply??'');
  const [saved,setSaved] = useState(false);
  const dispatch = useAppDispatch();
  const saveReply = () => { dispatch(updateCorrection({id:item.id,adminReply:reply})); setSaved(true); };
  return <div className="admin-detail-inner"><div className="admin-detail-header"><div><span className="admin-eyebrow">ВХОДЯЩЕЕ ОБРАЩЕНИЕ</span><h2>{item.target||'Общее предложение'}</h2></div><span className={`admin-status-pill ${item.status??'new'}`}>{statusLabels[item.status??'new']}</span></div><div className="admin-sender"><div className="admin-message-avatar large">{(item.name || 'Г').trim().charAt(0).toUpperCase()}</div><div><strong>{item.name?.trim() || 'Без имени'}</strong><a href={`mailto:${item.email}`}>{item.email}</a></div></div><div className="admin-detail-date"><Clock3 size={14}/>{new Intl.DateTimeFormat('ru-RU',{dateStyle:'long',timeStyle:'short'}).format(new Date(item.createdAt))}</div><div className="admin-user-message"><span>СООБЩЕНИЕ ПОЛЬЗОВАТЕЛЯ</span><p>{item.message}</p></div><div className="admin-detail-section"><label htmlFor="admin-reply">Внутренняя заметка администратора</label><textarea id="admin-reply" rows={4} value={reply} onChange={e=>{setReply(e.target.value);setSaved(false);}} placeholder="Например: проверить дату релиза по официальному источнику..."/><button className="button secondary" onClick={saveReply}>Сохранить заметку</button>{saved&&<small className="admin-saved-note">Заметка сохранена</small>}</div><div className="admin-detail-section"><span className="admin-detail-label">СТАТУС ОБРАЩЕНИЯ</span><div className="admin-status-actions"><button className={(item.status??'new')==='new'?'current':''} onClick={()=>onStatus('new')}>Новое</button><button className={item.status==='in_progress'?'current':''} onClick={()=>onStatus('in_progress')}><Clock3 size={14}/>В работе</button><button className={item.status==='resolved'?'current':''} onClick={()=>onStatus('resolved')}><CheckCheck size={14}/>Решено</button></div></div><div className="admin-detail-footer"><button className="admin-delete-action" onClick={onDelete}>Удалить обращение</button><a href={`mailto:${item.email}?subject=${encodeURIComponent('Ответ по обращению в IDOLVERSE')}`} className="button primary">Ответить по email ↗</a></div></div>;
}

function CheckCircle2Icon(){ return <CheckCheck size={17}/>; }
