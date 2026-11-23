import { describe, expect, it } from 'vitest';
import { mockIdols } from '../data/mockData';
import { filterIdols, validateCorrection } from './idolUtils';
describe('filterIdols', () => {
 it('filters by direction', () => { expect(filterIdols(mockIdols, '', 'C-POP').map(x => x.name)).toEqual(['Wang Yibo']); });
 it('searches case-insensitively by group and name', () => {
  const seventeenMembers = filterIdols(mockIdols, 'seventeen', 'Все');
  expect(seventeenMembers).toHaveLength(13);
  expect(seventeenMembers.every((idol) => idol.group === 'SEVENTEEN')).toBe(true);
  expect(filterIdols(mockIdols, 'KARINA', 'Все')[0].id).toBe('karina');
 });
 it('returns empty list when there is no match', () => { expect(filterIdols(mockIdols, 'unknown-artist', 'Все')).toHaveLength(0); });
});
describe('validateCorrection', () => {
 it('returns all field errors for invalid values', () => { expect(validateCorrection({name:'',email:'wrong',message:'short'})).toEqual({email:'Введите корректный email.',message:'Опишите исправление подробнее (минимум 10 символов).'}); });
 it('allows an empty display name', () => { expect(validateCorrection({name:'',email:'anna@example.com',message:'Please correct this artist profile.'})).toEqual({}); });
});
