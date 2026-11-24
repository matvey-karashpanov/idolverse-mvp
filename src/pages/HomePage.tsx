import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import { getNews, getGroups } from '../utils/contentStorage';

import { assetUrl } from '../utils/assetUrl';

const groupLogos: Record<string, string> = {
  bts: assetUrl('/images/bts-logo.jpg'),
  seventeen: assetUrl('/images/seventeen-logo.jpg'),
  blackpink: assetUrl('/images/blackpink-logo.jpg'),
  aespa: assetUrl('/images/aespa-logo.jpg'),
  'stray-kids': assetUrl('/images/stray-kids-logo.jpg'),
  cortis: assetUrl('/images/cortis-logo.jpg'),
  twice: assetUrl('/images/twice-logo.jpg'),
  txt: assetUrl('/images/txt-logo.jpg'),
  enhypen: assetUrl('/images/enhypen-logo.jpg'),
  ive: assetUrl('/images/ive-logo.jpg'),
};
const heroSlides = [
  {
    image: assetUrl('/images/home-carousel-1.jpg'),
    desktopImage: assetUrl('/images/hero-straykids-wide.webp'),
    alt: 'Stray Kids',
    groupId: 'stray-kids',
    groupName: 'STRAY KIDS',
    gradient: 'soft',
  },
  { image: assetUrl('/images/home-carousel-2.jpg'), desktopImage: assetUrl('/images/hero-blackpink-wide.webp'), alt: 'BLACKPINK', groupId: 'blackpink', groupName: 'BLACKPINK', gradient: 'soft' },
  {
    image: assetUrl('/images/newjeans-carousel.webp'),
    desktopImage: assetUrl('/images/hero-newjeans-wide.webp'),
    alt: 'NewJeans',
    groupId: 'newjeans',
    groupName: 'NEWJEANS',
    gradient: 'soft',
  },
];

export function HomePage() {
  const idols = useAppSelector((state) => state.idols.items);
  const popularIdols = idols.slice(0, 10);
  const topGroups = getGroups().slice(0, 10);
  // Hide the first three homepage headlines; keep the remaining seven visible.
  const news = getNews().slice(3, 10);
  const [heroSlide, setHeroSlide] = useState(0);
  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setHeroSlide((current) => (current + 1) % heroSlides.length);
    }, 5000);
    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <div className="home-dashboard">
      <section className="dashboard-hero">
        <div className={`dashboard-hero-carousel hero-slide-${heroSlide} hero-gradient-${heroSlides[heroSlide].gradient}`} aria-label="Фотогалерея групп">
          <Link className="dashboard-hero-slide-link" to={heroSlides[heroSlide].groupId === 'newjeans' ? '/groups' : `/groups/${heroSlides[heroSlide].groupId}`} aria-label={`Открыть ${heroSlides[heroSlide].groupName}`}>
            <picture className="dashboard-hero-picture">
              {heroSlides[heroSlide].desktopImage && (
                <source media="(min-width: 1001px)" srcSet={heroSlides[heroSlide].desktopImage} />
              )}
              <img onLoad={(event) => event.currentTarget.classList.add("is-loaded")} onError={(event) => event.currentTarget.classList.add("is-error")} loading="lazy" decoding="async" className="dashboard-hero-slide" src={heroSlides[heroSlide].image} alt={heroSlides[heroSlide].alt} />
            </picture>
            <span className="hero-slide-caption">{heroSlides[heroSlide].groupName}</span>
          </Link>
          <div className="hero-carousel-dots" aria-label="Слайды карусели">
            {heroSlides.map((slide, index) => <button key={slide.groupId} type="button" aria-label={`Показать ${slide.groupName}`} className={heroSlide === index ? 'active' : ''} onClick={() => setHeroSlide(index)} />)}
          </div>
        </div>
        <div className="dashboard-hero-copy">
          <h1>Вся информация<br />о любимых айдолах<br />в одном сайте</h1>
        </div>
      </section>

      <section className="dashboard-columns">
        <div className="dashboard-column">
          <div className="dashboard-column-heading"><h2>Последние новости</h2><Link to="/news">Все новости</Link></div>
          <div className="dashboard-news-list">
            {news.map((item, index) => (
              <Link className="dashboard-news-item" to="/news" key={item.id}>
                <span className="dashboard-thumb" aria-hidden="true">{item.image ? <img onLoad={(event) => event.currentTarget.classList.add("is-loaded")} onError={(event) => event.currentTarget.classList.add("is-error")} loading="lazy" decoding="async" src={item.image} style={{objectPosition:`${item.imagePositionX ?? 50}% ${item.imagePositionY ?? 50}%`,transform:`scale(${item.imageScale ?? 1})`}} alt="" /> : ['✦', '♪', '★', '♫', '✧'][index]}</span>
                <span>{item.title}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="dashboard-column">
          <div className="dashboard-column-heading"><h2>Топ групп</h2><Link to="/groups">Все группы</Link></div>
          <div className="dashboard-ranking">
            {topGroups.map((group) => (
              <Link to={`/groups/${group.id}`} className="dashboard-rank" key={group.id}>
                <span className="rank-logo"><img onLoad={(event) => event.currentTarget.classList.add("is-loaded")} onError={(event) => event.currentTarget.classList.add("is-error")} loading="lazy" decoding="async" src={groupLogos[group.id]} alt="" /></span>
                <strong>{group.name}</strong>
              </Link>
            ))}
          </div>
        </div>

        <div className="dashboard-column">
          <div className="dashboard-column-heading"><h2>Популярные айдолы</h2><Link to="/idols">Все айдолы</Link></div>
          <div className="dashboard-popular-list">
            {popularIdols.map((idol) => (
              <Link to={`/idols/${idol.id}`} className="dashboard-popular-item" key={idol.id}>
                <span className="popular-avatar">{idol.photo ? <img onLoad={(event) => event.currentTarget.classList.add("is-loaded")} onError={(event) => event.currentTarget.classList.add("is-error")} loading="lazy" decoding="async" src={idol.photo} alt="" /> : idol.name.slice(0, 1)}</span>
                <strong>{idol.name}</strong>
                <span className="popular-direction">{idol.direction}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
