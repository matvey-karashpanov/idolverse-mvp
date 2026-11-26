import { beforeEach, describe, expect, it } from 'vitest';

import reducer, {
  addCorrection,
  deleteCorrection,
  updateCorrection,
  type Correction,
} from './correctionsSlice';

const firstCorrection: Correction = {
  id: 'correction-1',
  name: 'Anna',
  email: 'anna@example.com',
  target: 'Профиль айдола',
  message: 'Please correct the debut date.',
  createdAt: '2026-11-26T09:00:00.000Z',
};

const secondCorrection: Correction = {
  ...firstCorrection,
  id: 'correction-2',
  email: 'maria@example.com',
};

describe('corrections reducer', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('adds a correction to the beginning of the list with the new status', () => {
    let state = reducer(undefined, addCorrection(firstCorrection));
    state = reducer(state, addCorrection(secondCorrection));

    expect(state.items).toHaveLength(2);
    expect(state.items[0]).toMatchObject({
      ...secondCorrection,
      status: 'new',
    });
    expect(state.items[1]).toMatchObject({
      ...firstCorrection,
      status: 'new',
    });
    expect(JSON.parse(localStorage.getItem('idolverse-corrections') || '[]')).toEqual(
      state.items,
    );
  });

  it('updates correction status and administrator reply without changing other fields', () => {
    const initialState = reducer(undefined, addCorrection(firstCorrection));

    const state = reducer(
      initialState,
      updateCorrection({
        id: firstCorrection.id,
        status: 'in_progress',
        adminReply: 'We are checking this information.',
      }),
    );

    expect(state.items[0]).toMatchObject({
      ...firstCorrection,
      status: 'in_progress',
      adminReply: 'We are checking this information.',
    });
    expect(JSON.parse(localStorage.getItem('idolverse-corrections') || '[]')).toEqual(
      state.items,
    );
  });

  it('deletes a correction by id and persists the remaining list', () => {
    let state = reducer(undefined, addCorrection(firstCorrection));
    state = reducer(state, addCorrection(secondCorrection));
    state = reducer(state, deleteCorrection(firstCorrection.id));

    expect(state.items).toHaveLength(1);
    expect(state.items[0].id).toBe(secondCorrection.id);
    expect(JSON.parse(localStorage.getItem('idolverse-corrections') || '[]')).toEqual(
      state.items,
    );
  });
});
