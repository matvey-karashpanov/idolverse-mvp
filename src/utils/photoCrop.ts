import type { CSSProperties } from 'react';

/**
 * Keeps both pan axes usable even when object-fit: cover has no overflow
 * on one axis. A small minimum zoom creates room to move the image inside
 * its clipped frame; the sliders then pan independently of the source ratio.
 */
export function getPhotoCropStyle(
  positionX = 50,
  positionY = 50,
  scale = 1.25,
): CSSProperties {
  const safeScale = Math.max(1.25, Math.min(3, scale));
  const x = Math.max(0, Math.min(100, positionX));
  const y = Math.max(0, Math.min(100, positionY));
  const translateX = (50 - x) * 0.2;
  const translateY = (50 - y) * 0.2;

  return {
    objectPosition: `${x}% ${y}%`,
    transform: `translate(${translateX}%, ${translateY}%) scale(${safeScale})`,
    transformOrigin: 'center center',
  };
}
