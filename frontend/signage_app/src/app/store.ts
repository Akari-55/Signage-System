import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import contentReducer from '../features/Content/contentSlice';

export const store = configureStore({
  reducer: {
    content:contentReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
