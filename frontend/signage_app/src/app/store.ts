import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import contentReducer from '../features/Content/contentSlice';
import deviceReducer from '../features/Device/deviceSlice';

export const store = configureStore({
  reducer: {
    content:contentReducer,
    device:deviceReducer,
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
