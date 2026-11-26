import { Music2 } from 'lucide-react';
import { Link } from 'react-router-dom';

import type { Idol } from '../data/mockData';
import { getPhotoCropStyle } from '../utils/photoCrop';

interface IdolCardProps {
  idol: Idol;
}

const portraitZoomIds = new Set(['wangyibo', 'mingyu', 'scoups', 'dino']);
const subtleZoomIds = new Set(['joshua', 'wonwoo', 'jun', 'hoshi', 'woozi']);

function getPortraitClassName(id: string): string {
  if (portraitZoomIds.has(id)) {
    return `zoom-portrait ${id}-portrait`;
  }

  return subtleZoomIds.has(id) ? 'subtle-zoom-portrait' : '';
}

export function IdolCard({ idol }: IdolCardProps) {
  return (
    <Link className="idol-card" to={`/idols/${idol.id}`}>
      {(idol.catalogPhoto || idol.photo) ? (
        <div className={`idol-card-photo ${getPortraitClassName(idol.id)}`}>
          <img onLoad={(event) => event.currentTarget.classList.add("is-loaded")} onError={(event) => event.currentTarget.classList.add("is-error")} src={idol.catalogPhoto || idol.photo} style={getPhotoCropStyle(idol.catalogPhotoPositionX ?? idol.photoPositionX ?? 50, idol.catalogPhotoPositionY ?? idol.photoPositionY ?? 35, idol.catalogPhotoScale ?? 1.25)} alt={`${idol.name} — фотография`} loading="lazy" />
        </div>
      ) : (
        <div className="photo-placeholder">
          <Music2 size={28} />
          <span>ФОТО ПОЗЖЕ</span>
        </div>
      )}

      <div className="idol-card-content">
        <span className="tag">{idol.direction}</span>
        <h3>{idol.name}</h3>
        <p>
          {idol.group} · {idol.role}
        </p>
      </div>
    </Link>
  );
}
