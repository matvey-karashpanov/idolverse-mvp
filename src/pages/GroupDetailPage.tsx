import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Globe2, CalendarDays, Building2, Users, Music2, Youtube, Instagram } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { getGroups, getNews } from '../utils/contentStorage';
import { useAppSelector } from '../app/hooks';
import { RelatedNewsCarousel } from '../components/RelatedNewsCarousel';
import { ImageLightbox } from '../components/ImageLightbox';

export function GroupDetailPage() {
  const { id } = useParams();
  const idols = useAppSelector((state) => state.idols.items);
  const groups = getGroups();
  const news = getNews();
  const group = groups.find(item => item.id === id);
  const gallery = useRef<HTMLDivElement>(null);
  const [selectedAlbum, setSelectedAlbum] = useState<{year:string;title:string;releaseDate?:string;image?:string;description?:string;tracks?:string[]}|null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<{ src: string; alt: string } | null>(null);

  if (!group) return <div className="page"><div className="state-panel"><h2>Группа не найдена</h2><p>Возможно, ссылка устарела.</p><Link className="button primary" to="/groups">Вернуться к каталогу групп</Link></div></div>;

  const memberProfiles = idols.filter(idol => idol.group.toLowerCase() === group.name.toLowerCase() || (group.id === 'txt' && idol.group === 'TXT'));
  const members = group.members.map(name => ({ name, idol: memberProfiles.find(idol => idol.name.toLowerCase() === name.toLowerCase()) }));
  const relatedNews = news.filter(item => item.groupIds?.includes(group.id));

  return <div className="page group-profile-page">
    <Link className="back-link" to="/groups"><ArrowLeft size={16}/> Назад к каталогу групп</Link>
    <section className="group-profile-hero">
      <div className={`group-profile-art ${group.groupPhoto ? 'has-group-photo' : ''}`}>{group.groupPhoto ? <img onLoad={(event) => event.currentTarget.classList.add("is-loaded")} onError={(event) => event.currentTarget.classList.add("is-error")} loading="lazy" decoding="async" src={group.groupPhoto} style={{objectPosition:`${group.groupPhotoPositionX ?? 50}% ${group.groupPhotoPositionY ?? 50}%`}} alt={`${group.name} — групповая фотография`} /> : <><Users size={42}/><span>ФОТО ГРУППЫ</span></>}</div>
      <div className="group-profile-heading"><span className="tag">{group.direction}</span><h1>{group.name}</h1><p>Музыкальная группа</p>
        <div className="social-placeholder" aria-label="Социальные сети"><span><Youtube size={22}/></span><span><Instagram size={22}/></span><span className="tiktok-mark">♪</span></div>
      </div>
      <div className="group-profile-facts">
        <div><Globe2/><span>Страна</span><strong>{group.country}</strong></div>
        <div><CalendarDays/><span>Дата дебюта</span><strong>{group.debut}</strong></div>
        <div><Building2/><span>Агентство</span><strong>{group.agency}</strong></div>
        <div><Users/><span>Участники</span><strong>{group.memberCount}</strong></div>
        <div><Music2/><span>Статус</span><strong>{group.status}</strong></div>
      </div>
    </section>

    <section className="profile-section group-members-section">
      <div className="profile-section-heading"><h2>Участники</h2><span className="group-section-count">{group.memberCount} участников</span></div>
      <div className="group-member-carousel">
        <div className="group-member-track" ref={gallery}>
          {members.map((member, index) => <article className="group-member-card" key={member.name}>
            <div className="group-member-name">{member.name}</div>
            {member.idol ? (
              <Link className="group-member-photo has-member-photo" to={`/idols/${member.idol.id}`} aria-label={`Открыть профиль ${member.name}`}>
                {member.idol.photo ? <img onLoad={(event) => event.currentTarget.classList.add("is-loaded")} onError={(event) => event.currentTarget.classList.add("is-error")} loading="lazy" decoding="async" src={member.idol.photo} alt={`${member.name} — фотография участника SEVENTEEN`} /> : <><Music2 size={28}/><span>ФОТО УЧАСТНИКА</span></>}
              </Link>
            ) : <div className="group-member-photo"><Music2 size={28}/><span>ФОТО УЧАСТНИКА</span></div>}
            <div className="group-member-role">{member.idol?.role ?? (index === 0 ? 'Участник группы' : 'Участник')}</div>
            {member.idol ? <Link className="card-link" to={`/idols/${member.idol.id}`}>Открыть профиль <ArrowRight size={14}/></Link> : <span className="group-member-pending">Профиль скоро появится</span>}
          </article>)}
        </div>
        <button className="profile-carousel-arrow" type="button" aria-label="Следующие участники" onClick={() => gallery.current?.scrollBy({left: 360,behavior:'smooth'})}><ArrowRight/></button>
      </div>
      {memberProfiles.length > 0 && <p className="group-member-note">Профили участников, уже добавленные в каталог: {memberProfiles.length}. Остальные карточки пока являются заглушками.</p>}
    </section>

    <GroupStrip title="Дискография" items={group.discography} onAlbumClick={setSelectedAlbum}/>
    {selectedAlbum && <AlbumModal album={selectedAlbum} onClose={() => setSelectedAlbum(null)}/>}
    <RelatedNewsCarousel items={relatedNews}/>

    <section className="profile-section">
      <div className="profile-section-heading"><h2>Фотографии</h2></div>
      <div className="group-gallery-grid">
        {group.groupGallery?.length ? group.groupGallery.map((photo, index) => <button type="button" className="group-gallery-image gallery-image-button" key={photo} onClick={() => setSelectedPhoto({ src: photo, alt: `${group.name} — фотография ${index + 1}` })}><img onLoad={(event) => event.currentTarget.classList.add("is-loaded")} onError={(event) => event.currentTarget.classList.add("is-error")} src={photo} alt={`${group.name} — фотография ${index + 1}`} loading="lazy" decoding="async" /></button>) : [1,2,3,4].map(item => <div className="group-gallery-placeholder" key={item}><Music2 size={27}/><span>ФОТО ГРУППЫ {item}</span></div>)}
      </div>
    </section>
    {selectedPhoto && <ImageLightbox src={selectedPhoto.src} alt={selectedPhoto.alt} onClose={() => setSelectedPhoto(null)} />}
  </div>;
}

type AlbumItem = { year: string; title: string; releaseDate?: string; image?: string; description?: string; tracks?: string[] };

function GroupStrip({title,items,onAlbumClick}:{title:string;items:AlbumItem[];onAlbumClick?:(album:AlbumItem)=>void}) {
  const track = useRef<HTMLDivElement>(null);
  const sortedItems = [...items].sort((a,b) => (b.releaseDate ?? b.year).localeCompare(a.releaseDate ?? a.year));
  const isDiscography = title === 'Дискография';
  return <section className="profile-section">
    <div className="profile-section-heading"><h2>{title}</h2></div>
    <div className="profile-carousel">
      <div className="profile-card-grid" ref={track}>
        {sortedItems.map(item => <article className={`profile-timeline-card ${isDiscography ? 'album-clickable' : ''}`} key={`${item.year}-${item.title}`}>
          {isDiscography ? <button className="album-card-button" type="button" onClick={() => onAlbumClick?.(item)} aria-label={`Открыть альбом ${item.title}`}>
            <div className={`profile-card-art ${item.image ? 'has-album-cover' : ''}`}>{item.image ? <img onLoad={(event) => event.currentTarget.classList.add("is-loaded")} onError={(event) => event.currentTarget.classList.add("is-error")} loading="lazy" decoding="async" className="album-cover-foreground" src={item.image} alt={`Обложка ${item.title}`}/> : <><Music2 size={25}/><span>ОБЛОЖКА АЛЬБОМА</span></>}</div>
            <div className="profile-card-caption"><strong>{item.releaseDate ?? item.year}</strong><span>{item.title}</span></div>
          </button> : <><div className="profile-card-art"><Music2 size={25}/><span>ИЗОБРАЖЕНИЕ</span></div><div className="profile-card-caption"><strong>{item.year}</strong><span>{item.title}</span></div></>}
        </article>)}
      </div>
      <button className="profile-carousel-arrow" type="button" aria-label={`Следующие элементы: ${title}`} onClick={() => track.current?.scrollBy({left:360,behavior:'smooth'})}><ArrowRight/></button>
    </div>
  </section>;
}

function AlbumModal({album,onClose}:{album:AlbumItem;onClose:()=>void}) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    document.addEventListener('keydown',onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown',onKeyDown); document.body.style.overflow = ''; };
  },[onClose]);
  return <div className="album-modal-backdrop" role="presentation" onMouseDown={event => { if(event.target === event.currentTarget) onClose(); }}>
    <section className="album-modal" role="dialog" aria-modal="true" aria-labelledby="album-modal-title">
      <button className="album-modal-close" type="button" onClick={onClose} aria-label="Закрыть">×</button>
      <div className="album-modal-cover">{album.image ? <img onLoad={(event) => event.currentTarget.classList.add("is-loaded")} onError={(event) => event.currentTarget.classList.add("is-error")} loading="lazy" decoding="async" src={album.image} alt={`Обложка альбома ${album.title}`}/> : <div className="album-modal-cover-placeholder"><Music2 size={42}/><span>SEVENTEEN</span></div>}</div>
      <div className="album-modal-content">
        <span className="album-modal-eyebrow">SEVENTEEN · ДИСКОГРАФИЯ</span>
        <h2 id="album-modal-title">{album.title}</h2>
        <div className="album-modal-meta"><span>아티스트</span><strong>세븐틴 (SEVENTEEN)</strong><span>발매</span><strong>{album.releaseDate ?? album.year}</strong></div>
        <h3>앨범소개</h3>
        <p>{album.description ?? 'Описание альбома будет добавлено позже.'}</p>
        {album.tracks && <><h3>트랙리스트</h3><ol className="album-tracklist">{album.tracks.map((track,index)=><li key={`${track}-${index}`}><span>{String(index+1).padStart(2,'0')}</span>{track}</li>)}</ol></>}<a className="album-source-link" href="https://pledis.co.kr/ko/artist/detail/seventeen/discography/" target="_blank" rel="noreferrer">Источник: PLEDIS Entertainment ↗</a>
      </div>
    </section>
  </div>;
}
