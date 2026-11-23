import { describe, expect, it } from 'vitest';
import { normalizeLegacyCatalog, getAlbumsForIdol, getNewsForIdol } from './catalog';
import type { Idol, NewsItem } from '../data/mockData';
import type { MusicGroup } from '../data/groups';

const idols = [
  { id: 'a', name: 'Artist A', nativeName: '', direction: 'K-POP', group: 'Group One', role: 'Vocal', birthday: '', country: '', agency: 'Agency A', bio: '', debut: '2020', status: 'Активен' },
  { id: 'b', name: 'Artist B', nativeName: '', direction: 'K-POP', group: 'Group One', role: 'Rapper', birthday: '', country: '', agency: 'Agency B', bio: '', debut: '2020', status: 'Активен' },
] as Idol[];
const groups = [{ id: 'group-one', name: 'Group One', direction: 'K-POP', country: '', debut: '', agency: 'Agency A', status: 'Активна', memberCount: 2, members: ['Artist A', 'Artist B'], discography: [{ year: '2024', title: 'First EP', tracks: ['Track 1', 'Track 2'], memberIds: ['a'] }], milestones: [] }] as MusicGroup[];
const news = [{ id: 'news-1', title: 'News', category: '', date: '', summary: '', groupIds: ['group-one'], idolIds: ['a'] }] as NewsItem[];

describe('normalized catalog', () => {
  it('creates many-to-many relations without duplicating idol or group records', () => {
    const catalog = normalizeLegacyCatalog(idols, groups, news);
    expect(catalog.idols).toHaveLength(2);
    expect(catalog.groups).toHaveLength(1);
    expect(catalog.groupMemberships).toHaveLength(2);
    expect(catalog.agencies).toHaveLength(2);
  });
  it('resolves group releases and individual credits for an idol', () => {
    const catalog = normalizeLegacyCatalog(idols, groups, news);
    expect(getAlbumsForIdol(catalog, 'a')).toHaveLength(1);
    expect(getAlbumsForIdol(catalog, 'b')).toHaveLength(1);
  });
  it('resolves related news from explicit idol relations', () => {
    const catalog = normalizeLegacyCatalog(idols, groups, news);
    expect(getNewsForIdol(catalog, 'a')).toHaveLength(1);
    expect(getNewsForIdol(catalog, 'b')).toHaveLength(0);
  });
});
