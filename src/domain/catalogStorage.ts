import { mockIdols, mockNews } from '../data/mockData';
import { musicGroups } from '../data/groups';
import { readStorage, writeStorage } from '../utils/storage';
import { normalizeLegacyCatalog, type CatalogData } from './catalog';
import { getGroups, getNews } from '../utils/contentStorage';


export const CATALOG_STORAGE_KEY = 'idolverse-normalized-catalog-v1';
export const CATALOG_MIGRATION_KEY = 'idolverse-normalized-catalog-migrated-v1';

/** One-time, non-destructive migration from the v78 browser model. */
export function getCatalog(): CatalogData {
  const saved = readStorage<CatalogData | null>(CATALOG_STORAGE_KEY, null);
  if (saved?.schemaVersion === 1) return saved;

  const savedIdols = readStorage<typeof mockIdols>('idolverse-idols', []);
  const savedById = new Map(savedIdols.map((idol) => [idol.id, idol]));
  const legacyIdols = [
    ...mockIdols.map((idol) => ({ ...idol, ...savedById.get(idol.id) })),
    ...savedIdols.filter((idol) => !mockIdols.some((base) => base.id === idol.id)),
  ];
  const legacyGroups = getGroups();
  const legacyNews = getNews();
  const catalog = normalizeLegacyCatalog(
    legacyIdols.length ? legacyIdols : mockIdols,
    legacyGroups.length ? legacyGroups : musicGroups,
    legacyNews.length ? legacyNews : mockNews,
  );
  writeStorage(CATALOG_STORAGE_KEY, catalog);
  writeStorage(CATALOG_MIGRATION_KEY, { completedAt: new Date().toISOString(), schemaVersion: catalog.schemaVersion });
  return catalog;
}

export function saveCatalog(catalog: CatalogData): void {
  writeStorage(CATALOG_STORAGE_KEY, catalog);
}

export function updateCatalog<T extends keyof CatalogData>(key: T, value: CatalogData[T]): CatalogData {
  const catalog = getCatalog();
  const updated = { ...catalog, [key]: value };
  saveCatalog(updated);
  return updated;
}
