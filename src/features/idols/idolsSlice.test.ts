import { describe, expect, it } from 'vitest';
import reducer, { setDirection, setQuery, resetFilters, loadIdols } from './idolsSlice';
import { mockIdols } from '../../data/mockData';
describe('idols reducer', () => {
 it('updates search and direction filters', () => { let state = reducer(undefined, setQuery('Lisa')); state = reducer(state, setDirection('K-POP')); expect(state.query).toBe('Lisa'); expect(state.direction).toBe('K-POP'); });
 it('resets filters', () => { let state = reducer(undefined, setQuery('abc')); state = reducer(state, setDirection('J-POP')); state = reducer(state, resetFilters()); expect(state.query).toBe(''); expect(state.direction).toBe('Все'); });
 it('handles async loading states', () => { let state = reducer(undefined, loadIdols.pending('request-1', undefined)); expect(state.status).toBe('loading'); state = reducer(state, loadIdols.fulfilled(mockIdols, 'request-1', undefined)); expect(state.status).toBe('succeeded'); expect(state.items).toHaveLength(mockIdols.length); });
 it('shows an error state when catalogue loading fails', () => { const state = reducer(undefined, loadIdols.rejected(new Error('network error'), 'request-2', undefined)); expect(state.status).toBe('failed'); expect(state.error).toContain('Попробуйте ещё раз'); });
});
