import type { Idol, NewsItem } from '../data/mockData';
import type { MusicGroup } from '../data/groups';

export type EntityStatus = 'active' | 'inactive' | 'archived';
export type CreditRole = 'performer' | 'author' | 'composer' | 'producer' | 'arranger' | 'other';

export interface Agency { id: string; name: string; country?: string; website?: string; description?: string; }
export interface IdolRecord extends Omit<Idol, 'group' | 'agency' | 'status'> { status: EntityStatus | Idol['status']; }
export interface GroupRecord extends Omit<MusicGroup, 'members' | 'agency' | 'status'> { status: EntityStatus | string; }
export interface GroupMembership { id: string; groupId: string; idolId: string; role?: string; startDate?: string; endDate?: string; isCurrent: boolean; }
export interface IdolAgencyRelation { id: string; idolId: string; agencyId: string; relationshipType: 'exclusive' | 'solo' | 'management' | 'distribution' | 'other'; startDate?: string; endDate?: string; isCurrent: boolean; }
export interface GroupAgencyRelation { id: string; groupId: string; agencyId: string; relationshipType: 'management' | 'label' | 'distribution' | 'other'; startDate?: string; endDate?: string; isCurrent: boolean; }
export interface Album { id: string; title: string; description?: string; releaseDate?: string; year?: string; type: 'studio' | 'mini' | 'single' | 'ep' | 'compilation' | 'ost' | 'project' | 'unknown'; coverImage?: string; sourceUrl?: string; }
export interface AlbumGroupRelation { id: string; albumId: string; groupId: string; relationshipType: 'group_release' | 'unit_release' | 'project_release' | 'collaboration' | 'other'; }
export interface AlbumCredit { id: string; albumId: string; idolId: string; role: CreditRole; }
export interface Track { id: string; albumId: string; title: string; trackNumber: number; duration?: string; }
export interface TrackCredit { id: string; trackId: string; idolId: string; role: CreditRole; }
export interface NewsRecord extends NewsItem {}
export interface NewsGroupRelation { id: string; newsId: string; groupId: string; relationshipType: 'main_subject' | 'mentioned' | 'featured'; }
export interface NewsIdolRelation { id: string; newsId: string; idolId: string; relationshipType: 'main_subject' | 'mentioned' | 'featured'; }

export interface CatalogData {
  schemaVersion: 1;
  idols: IdolRecord[];
  groups: GroupRecord[];
  agencies: Agency[];
  groupMemberships: GroupMembership[];
  idolAgencies: IdolAgencyRelation[];
  groupAgencies: GroupAgencyRelation[];
  albums: Album[];
  albumGroups: AlbumGroupRelation[];
  albumCredits: AlbumCredit[];
  tracks: Track[];
  trackCredits: TrackCredit[];
  news: NewsRecord[];
  newsGroups: NewsGroupRelation[];
  newsIdols: NewsIdolRelation[];
}

const id = (...parts: string[]) => parts.join(':').toLowerCase().replace(/[^a-z0-9:_-]+/g, '-');
const key = (value: string) => value.trim().toLocaleLowerCase('ru-RU');
const albumType = (title: string): Album['type'] => {
  const value = title.toLowerCase();
  if (value.includes('single')) return 'single';
  if (value.includes('ost')) return 'ost';
  if (value.includes('repackage')) return 'studio';
  if (value.includes('mini') || value.includes('ep')) return 'mini';
  if (value.includes('project') || value === 'q&a') return 'project';
  return 'unknown';
};

/** Converts the v78 denormalized browser data into a relational shape. Does not mutate legacy records. */
export function normalizeLegacyCatalog(idols: Idol[], groups: MusicGroup[], news: NewsItem[]): CatalogData {
  const agencyNames = new Set<string>();
  idols.forEach((idol) => idol.agency && agencyNames.add(idol.agency.trim()));
  groups.forEach((group) => group.agency && agencyNames.add(group.agency.trim()));
  const agencies: Agency[] = [...agencyNames].filter(Boolean).map((name) => ({ id: `agency:${id(name)}`, name }));
  const agencyByName = new Map(agencies.map((agency) => [key(agency.name), agency.id]));
  const groupByName = new Map(groups.map((group) => [key(group.name), group.id]));
  const idolByName = new Map(idols.map((idol) => [key(idol.name), idol.id]));

  const groupMemberships: GroupMembership[] = [];
  const idolAgencies: IdolAgencyRelation[] = [];
  const groupAgencies: GroupAgencyRelation[] = [];
  const albums: Album[] = [];
  const albumGroups: AlbumGroupRelation[] = [];
  const albumCredits: AlbumCredit[] = [];
  const tracks: Track[] = [];
  const trackCredits: TrackCredit[] = [];

  groups.forEach((group) => {
    group.members.forEach((memberName) => {
      const idolId = idolByName.get(key(memberName));
      if (idolId) groupMemberships.push({ id: id('membership', group.id, idolId), groupId: group.id, idolId, isCurrent: true });
    });
    const agencyId = agencyByName.get(key(group.agency));
    if (agencyId) groupAgencies.push({ id: id('group-agency', group.id, agencyId), groupId: group.id, agencyId, relationshipType: 'management', isCurrent: true });
    (group.discography || []).forEach((release, index) => {
      const albumId = id('album', group.id, release.title, release.year || String(index));
      albums.push({ id: albumId, title: release.title, year: release.year, releaseDate: release.releaseDate, description: release.description, coverImage: release.image, type: albumType(release.title) });
      albumGroups.push({ id: id('album-group', albumId, group.id), albumId, groupId: group.id, relationshipType: 'group_release' });
      (release.memberIds || []).forEach((idolId) => {
        if (idols.some((idol) => idol.id === idolId)) albumCredits.push({ id: id('album-credit', albumId, idolId, 'performer'), albumId, idolId, role: 'performer' });
      });
      (release.tracks || []).forEach((title, trackIndex) => {
        tracks.push({ id: id('track', albumId, String(trackIndex + 1)), albumId, title: title.replace(' *TITLE', ''), trackNumber: trackIndex + 1 });
      });
    });
  });
  idols.forEach((idol) => {
    const agencyId = agencyByName.get(key(idol.agency));
    if (agencyId) idolAgencies.push({ id: id('idol-agency', idol.id, agencyId), idolId: idol.id, agencyId, relationshipType: 'management', isCurrent: true });
    const groupId = groupByName.get(key(idol.group));
    if (groupId && !groupMemberships.some((relation) => relation.groupId === groupId && relation.idolId === idol.id)) {
      groupMemberships.push({ id: id('membership', groupId, idol.id), groupId, idolId: idol.id, role: idol.role, isCurrent: true });
    }
  });
  const newsGroups: NewsGroupRelation[] = [];
  const newsIdols: NewsIdolRelation[] = [];
  news.forEach((item) => {
    (item.groupIds || []).forEach((groupId) => { if (groupByName.has(key(groupId)) || groups.some((group) => group.id === groupId)) newsGroups.push({ id: id('news-group', item.id, groupId), newsId: item.id, groupId, relationshipType: 'main_subject' }); });
    (item.idolIds || []).forEach((idolId) => { if (idols.some((idol) => idol.id === idolId)) newsIdols.push({ id: id('news-idol', item.id, idolId), newsId: item.id, idolId, relationshipType: 'main_subject' }); });
  });

  return {
    schemaVersion: 1,
    idols: idols.map((idol) => ({ ...idol })),
    groups: groups.map((group) => ({ ...group })),
    agencies, groupMemberships, idolAgencies, groupAgencies,
    albums, albumGroups, albumCredits, tracks, trackCredits,
    news: news.map((item) => ({ ...item })), newsGroups, newsIdols,
  };
}

export function getCurrentGroupIds(catalog: CatalogData, idolId: string): string[] {
  return catalog.groupMemberships.filter((item) => item.idolId === idolId && item.isCurrent).map((item) => item.groupId);
}
export function getCurrentAgencyIds(catalog: CatalogData, idolId: string): string[] {
  return catalog.idolAgencies.filter((item) => item.idolId === idolId && item.isCurrent).map((item) => item.agencyId);
}
export function getAlbumsForIdol(catalog: CatalogData, idolId: string): Album[] {
  const credited = new Set(catalog.albumCredits.filter((item) => item.idolId === idolId).map((item) => item.albumId));
  const groupIds = new Set(getCurrentGroupIds(catalog, idolId));
  catalog.albumGroups.forEach((relation) => {
    if (groupIds.has(relation.groupId) && relation.relationshipType === 'group_release') credited.add(relation.albumId);
  });
  return catalog.albums.filter((album) => credited.has(album.id));
}
export function getNewsForIdol(catalog: CatalogData, idolId: string): NewsRecord[] {
  const newsIds = new Set(catalog.newsIdols.filter((item) => item.idolId === idolId).map((item) => item.newsId));
  return catalog.news.filter((item) => newsIds.has(item.id));
}
