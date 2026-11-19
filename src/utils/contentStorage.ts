import { musicGroups, type MusicGroup } from '../data/groups';
import { mockNews, type NewsItem } from '../data/mockData';
import { readStorage, writeStorage } from './storage';

export const GROUPS_STORAGE_KEY = 'idolverse-groups';
export const NEWS_STORAGE_KEY = 'idolverse-news';

export function getGroups(): MusicGroup[] {
  return readStorage<MusicGroup[]>(GROUPS_STORAGE_KEY, musicGroups);
}
export function saveGroups(items: MusicGroup[]): void {
  writeStorage(GROUPS_STORAGE_KEY, items);
}
export function getNews(): NewsItem[] {
  return readStorage<NewsItem[]>(NEWS_STORAGE_KEY, mockNews);
}
export function saveNews(items: NewsItem[]): void {
  writeStorage(NEWS_STORAGE_KEY, items);
}
