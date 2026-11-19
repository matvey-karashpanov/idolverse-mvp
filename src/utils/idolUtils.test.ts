import { describe, expect, it } from 'vitest';
import { mockIdols } from '../data/mockData';
import { filterIdols, validateCorrection } from './idolUtils';
describe('filterIdols', () => {
 it('filters by direction', () => { expect(filterIdols(mockIdols, '', 'C-POP').map(x => x.name)).toEqual(['Wang Yibo']); });
 it('searches case-insensitively by group and name', () => { expect(filterIdols(mockIdols, 'seventeen', 'Все')).toHaveLength(2); expect(filterIdols(mockIdols, 'KARINA', 'Все')[0].id).toBe('karina'); });
 it('returns empty list when there is no match', () => { expect(filterIdols(mockIdols, 'unknown-artist', 'Все')).toHaveLength(0); });
});
describe('validateCorrection', () => {
 it('returns all field errors for invalid values', () => { expect(validateCorrection({name:'A',email:'wrong',message:'short'})).toEqual({name:'Укажите имя (минимум 2 символа).',email:'Введите корректный email.',message:'Опишите исправление подробнее (минимум 10 символов).'}); });
 it('accepts valid values', () => { expect(validateCorrection({name:'Anna',email:'anna@example.com',message:'Please correct this artist profile.'})).toEqual({}); });
});
