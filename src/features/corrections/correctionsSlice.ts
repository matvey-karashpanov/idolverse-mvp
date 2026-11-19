import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { readStorage, writeStorage } from '../../utils/storage';

export type CorrectionStatus = 'new' | 'in_progress' | 'resolved';

export interface Correction {
  id: string;
  name: string;
  email: string;
  target: string;
  message: string;
  createdAt: string;
  status?: CorrectionStatus;
  adminReply?: string;
}

interface CorrectionsState {
  items: Correction[];
}

const STORAGE_KEY = 'idolverse-corrections';

const initialState: CorrectionsState = {
  items: readStorage<Correction[]>(STORAGE_KEY, []),
};

const correctionsSlice = createSlice({
  name: 'corrections',
  initialState,
  reducers: {
    addCorrection(state, action: PayloadAction<Correction>) {
      state.items.unshift({
        ...action.payload,
        status: 'new',
      });
      writeStorage(STORAGE_KEY, state.items);
    },

    updateCorrection(
      state,
      action: PayloadAction<{
        id: string;
        status?: CorrectionStatus;
        adminReply?: string;
      }>,
    ) {
      const correction = state.items.find((item) => item.id === action.payload.id);

      if (!correction) {
        return;
      }

      if (action.payload.status) {
        correction.status = action.payload.status;
      }

      if (action.payload.adminReply !== undefined) {
        correction.adminReply = action.payload.adminReply;
      }

      writeStorage(STORAGE_KEY, state.items);
    },

    deleteCorrection(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item.id !== action.payload);
      writeStorage(STORAGE_KEY, state.items);
    },
  },
});

export const { addCorrection, updateCorrection, deleteCorrection } =
  correctionsSlice.actions;

export default correctionsSlice.reducer;
