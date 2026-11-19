import { useEffect } from 'react';
import { X } from 'lucide-react';

type ImageLightboxProps = { src: string; alt: string; onClose: () => void };

export function ImageLightbox({ src, alt, onClose }: ImageLightboxProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', handleKeyDown); document.body.style.overflow = previousOverflow; };
  }, [onClose]);

  return <div className="image-lightbox" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <button className="image-lightbox-close" type="button" onClick={onClose} aria-label="Закрыть фотографию"><X size={24}/></button>
    <img onLoad={(event) => event.currentTarget.classList.add("is-loaded")} onError={(event) => event.currentTarget.classList.add("is-error")} loading="lazy" decoding="async" src={src} alt={alt}/>
    <span className="image-lightbox-caption">{alt}</span>
  </div>;
}
