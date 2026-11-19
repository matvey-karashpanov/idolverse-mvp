import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { mockIdols, type Idol } from '../../data/mockData';
import { readStorage, writeStorage } from '../../utils/storage';
import { filterIdols, type DirectionFilter } from '../../utils/idolUtils';

type LoadStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

interface IdolsState {
  items: Idol[];
  status: LoadStatus;
  error: string | null;
  query: string;
  direction: DirectionFilter;
}

const STORAGE_KEY = 'idolverse-idols';

function getInitialIdols(): Idol[] {
  const savedItems = readStorage<Idol[]>(STORAGE_KEY, []);
  const savedById = new Map(savedItems.map((idol) => [idol.id, idol]));

  const mergedMockIdols = mockIdols.map((idol) => ({
    ...idol,
    ...savedById.get(idol.id),
  }));

  const customIdols = savedItems.filter(
    (savedIdol) => !mockIdols.some((mockIdol) => mockIdol.id === savedIdol.id),
  );

  return [...mergedMockIdols, ...customIdols];
}

const initialItems = getInitialIdols();

const initialState: IdolsState = {
  items: initialItems,
  status: 'idle',
  error: null,
  query: '',
  direction: 'Все',
};

export const loadIdols = createAsyncThunk<
  Idol[],
  void,
  { state: { idols: IdolsState } }
>(
  'idols/load',
  async () => {
    // Simulate an API request until the backend is available.
    await new Promise((resolve) => window.setTimeout(resolve, 250));
    return initialItems;
  },
  {
    condition: (_, { getState }) => {
      const { status } = getState().idols;
      return status === 'idle' || status === 'failed';
    },
  },
);

const idolsSlice = createSlice({
  name: 'idols',
  initialState,
  reducers: {
    setQuery(state, action: PayloadAction<string>) {
      state.query = action.payload;
    },
    setDirection(state, action: PayloadAction<DirectionFilter>) {
      state.direction = action.payload;
    },
    resetFilters(state) {
      state.query = '';
      state.direction = 'Все';
    },
    addIdol(state, action: PayloadAction<Idol>) {
      state.items.unshift(action.payload);
      writeStorage(STORAGE_KEY, state.items);
    },
    updateIdol(state, action: PayloadAction<Idol>) {
      const index = state.items.findIndex((idol) => idol.id === action.payload.id);

      if (index === -1) {
        state.items.unshift(action.payload);
      } else {
        state.items[index] = action.payload;
      }

      writeStorage(STORAGE_KEY, state.items);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadIdols.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loadIdols.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(loadIdols.rejected, (state) => {
        state.status = 'failed';
        state.error = 'Не удалось загрузить каталог. Попробуйте ещё раз.';
      });
  },
});

export const { setQuery, setDirection, resetFilters, addIdol, updateIdol } =
  idolsSlice.actions;

export default idolsSlice.reducer;

export const selectFilteredIdols = (state: { idols: IdolsState }) =>
  filterIdols(state.idols.items, state.idols.query, state.idols.direction);
