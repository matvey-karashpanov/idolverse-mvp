/**
 * Resolve public-directory assets for local development and GitHub Pages.
 * The helper is idempotent so edited paths saved in localStorage are safe.
 */
export function assetUrl(path: string): string {
  const base = import.meta.env.BASE_URL || '/';
  const cleanPath = path.replace(/^\/+/, '');
  const cleanBase = base.replace(/^\/+|\/+$/g, '');
  if (cleanBase && (cleanPath === cleanBase || cleanPath.startsWith(`${cleanBase}/`))) {
    return `/${cleanPath}`;
  }
  return `${base}${cleanPath}`;
}
