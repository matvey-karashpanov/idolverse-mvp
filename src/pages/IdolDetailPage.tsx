import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, CalendarDays, Globe2, Building2, Users, Youtube, Instagram, Music2 } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import { mockNews } from '../data/mockData';
import { musicGroups } from '../data/groups';
import { RelatedNewsCarousel } from '../components/RelatedNewsCarousel';
import { assetUrl } from '../utils/assetUrl';

type IdolAlbum = { year: string; title: string; releaseDate?: string; image?: string; description?: string; tracks?: string[]; memberIds?: string[] };

export function IdolDetailPage() {
  const { id } = useParams();
  const idol = useAppSelector((state) => state.idols.items.find((item) => item.id === id));

  const [selectedAlbum, setSelectedAlbum] = useState<IdolAlbum|null>(null);
  const artistGroup = musicGroups.find(group => group.name.toLowerCase() === idol?.group.toLowerCase());
  const albumItems: IdolAlbum[] = artistGroup
    ? artistGroup.discography
        .filter(album => !album.memberIds || album.memberIds.includes(idol?.id ?? ''))
        .sort((a,b) => (b.releaseDate ?? b.year).localeCompare(a.releaseDate ?? a.year))
    : [];
  const relatedNews = mockNews.filter(item => item.idolIds?.includes(idol?.id ?? ''));

  if (!idol) {
    return <div className="page"><div className="state-panel"><h2>Артист не найден</h2><p>Возможно, профиль был удалён или ссылка устарела.</p><Link className="button primary" to="/idols">Вернуться в каталог</Link></div></div>;
  }

  return (
    <div className="page idol-profile-page">
      <Link className="back-link" to="/idols"><ArrowLeft size={16}/> Назад к каталогу</Link>

      <section className="profile-hero">
        <div className={`profile-photo ${idol.photo ? 'has-artist-photo' : 'photo-placeholder'} ${['wangyibo', 'mingyu', 'scoups', 'dino'].includes(idol.id) ? `zoom-portrait ${idol.id}-portrait` : ['joshua', 'wonwoo', 'jun', 'hoshi', 'woozi'].includes(idol.id) ? 'subtle-zoom-portrait' : ''}`}>{idol.photo ? <img src={idol.photo} alt={`${idol.name} — фотография артиста`} /> : <><Music2 size={38}/><span>ФОТО АРТИСТА</span></>}</div>
        <div className="profile-heading">
          <h1>{idol.name}</h1>
          <p className="native-name">{idol.nativeName}</p>
          <div className="social-placeholder" aria-label="Социальные сети"><span><Youtube size={22}/></span><span><Instagram size={22}/></span><span className="tiktok-mark">♪</span></div>
        </div>
        <div className="profile-facts">
          <div><CalendarDays/><span>Дата рождения</span><strong>{idol.birthday}</strong></div>
          <div><Globe2/><span>Место рождения</span><strong>{idol.country}</strong></div>
          <div><Building2/><span>Агентство</span><strong>{idol.agency}</strong></div>
          <div><Users/><span>Группа</span><strong>{idol.group}</strong></div>
          <div><Music2/><span>Позиция</span><strong>{idol.role}</strong></div>
        </div>
      </section>

      <RelatedNewsCarousel items={relatedNews} />
      <ProfileCarousel title="Дискография" items={albumItems} onAlbumClick={setSelectedAlbum} />
      {selectedAlbum && <IdolAlbumModal album={selectedAlbum} onClose={() => setSelectedAlbum(null)} />}

      <section className="profile-section">
        <div className="profile-section-heading"><h2>Фотографии</h2></div>
        <div className="profile-carousel">
          <div className="profile-photo-grid" id="photo-gallery">
            {idol.photo && <div className="profile-gallery-image"><img src={idol.photo} alt={`${idol.name} — портрет`} /></div>}
            {idol.id === 'joshua' && <div className="profile-gallery-image"><img src={assetUrl('/images/joshua-jeonghan-album.jpg')} alt="Joshua и Jeonghan — совместная фотография" /></div>}
            {idol.id === 'jeonghan' && <div className="profile-gallery-image"><img src={assetUrl('/images/joshua-jeonghan-album.jpg')} alt="Jeonghan и Joshua — совместная фотография" /></div>}
            {(idol.id === 'vernon' || idol.id === 'the8') && <div className="profile-gallery-image"><img src={assetUrl('/images/vernon-the8-album.jpg')} alt="Vernon и The8 — совместная фотография" /></div>}
            {idol.id === 'dino' && <div className="profile-gallery-image"><img src={assetUrl('/images/dino-album.jpg')} alt="Материал к альбому Dino" /></div>}
            {(idol.id === 'mingyu' || idol.id === 'scoups') && <div className="profile-gallery-image"><img src={assetUrl('/images/cxm-hype-vibes.jpg')} alt="S.Coups и Mingyu — промофото юнита CxM" /></div>}
            {[1, 2, 3].map((item) => <div className="profile-gallery-placeholder" key={item}><Music2 size={24}/><span>ФОТО {item}</span></div>)}
          </div>
          <button className="profile-carousel-arrow" type="button" aria-label="Следующие фотографии" onClick={() => document.getElementById('photo-gallery')?.scrollBy({ left: 360, behavior: 'smooth' })}><ArrowRight/></button>
        </div>
      </section>
    </div>
  );
}

function ProfileCarousel({ title, items, onAlbumClick }: { title: string; items: IdolAlbum[]; onAlbumClick?: (album:IdolAlbum)=>void }) {
  const trackRef = useRef<HTMLDivElement>(null);
  return <section className="profile-section">
    <div className="profile-section-heading"><h2>{title}</h2></div>
    {items.length ? <div className="profile-carousel">
      <div className="profile-card-grid" ref={trackRef}>
        {items.map(item => <article className="profile-timeline-card album-clickable" key={`${item.releaseDate ?? item.year}-${item.title}`}>
          <button className="album-card-button" type="button" onClick={()=>onAlbumClick?.(item)} aria-label={`Открыть альбом ${item.title}`}>
            <div className={`profile-card-art ${item.image ? 'has-album-cover' : ''}`}>{item.image ? <img className="album-cover-foreground" src={item.image} alt={`Обложка ${item.title}`}/> : <><Music2 size={25}/><span>ОБЛОЖКА АЛЬБОМА</span></>}</div>
            <div className="profile-card-caption"><strong>{item.releaseDate ?? item.year}</strong><span>{item.title}</span></div>
          </button>
        </article>)}
      </div>
      <button className="profile-carousel-arrow" type="button" aria-label={`Следующие элементы: ${title}`} onClick={() => trackRef.current?.scrollBy({ left: 380, behavior: 'smooth' })}><ArrowRight/></button>
    </div> : <p className="related-news-empty">Дискография пока не добавлена.</p>}
  </section>;
}

function IdolAlbumModal({album,onClose}:{album:IdolAlbum;onClose:()=>void}) {
  useEffect(() => {
    const onKeyDown=(event:KeyboardEvent)=>{if(event.key==='Escape')onClose();};
    document.addEventListener('keydown',onKeyDown); document.body.style.overflow='hidden';
    return ()=>{document.removeEventListener('keydown',onKeyDown);document.body.style.overflow='';};
  },[onClose]);
  return <div className="album-modal-backdrop" role="presentation" onMouseDown={event=>{if(event.target===event.currentTarget)onClose();}}>
    <section className="album-modal idol-album-modal" role="dialog" aria-modal="true" aria-labelledby="idol-album-title">
      <button className="album-modal-close" type="button" onClick={onClose} aria-label="Закрыть">×</button>
      <div className="album-modal-cover">{album.image ? <img src={album.image} alt={`Обложка альбома ${album.title}`}/> : <div className="album-modal-cover-placeholder"><Music2 size={42}/><span>ALBUM ART</span></div>}</div>
      <div className="album-modal-content">
        <span className="album-modal-eyebrow">{idolGroupLabel(album)} · ДИСКОГРАФИЯ</span>
        <h2 id="idol-album-title">{album.title}</h2>
        <div className="album-modal-meta"><span>Год выпуска</span><strong>{album.releaseDate ?? album.year}</strong></div>
        <h3>Описание альбома</h3><p>{album.description ?? 'Подробная информация об этом релизе будет добавлена позже.'}</p>
        {album.tracks && <><h3>Трек-лист</h3><ol className="album-tracklist">{album.tracks.map((track,index)=><li key={`${track}-${index}`}><span>{String(index+1).padStart(2,'0')}</span>{track}</li>)}</ol></>}
        <a className="album-source-link" href="https://pledis.co.kr/ko/artist/detail/seventeen/discography/" target="_blank" rel="noreferrer">Источник: PLEDIS Entertainment ↗</a>
      </div>
    </section>
  </div>;
}

function idolGroupLabel(album: IdolAlbum) { return album.memberIds ? 'ПРОЕКТ УЧАСТНИКОВ' : 'ДИСКОГРАФИЯ ГРУППЫ'; }
