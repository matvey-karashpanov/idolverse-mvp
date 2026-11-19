import { configureStore } from '@reduxjs/toolkit';

import correctionsReducer from '../features/corrections/correctionsSlice';
import idolsReducer from '../features/idols/idolsSlice';

export const store = configureStore({
  reducer: {
    idols: idolsReducer,
    corrections: correctionsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
