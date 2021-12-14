import { configureStore } from "@reduxjs/toolkit";

import  collapseReducer  from './slices/CollapseSlice'

const store = configureStore({
  reducer: {
    collapse: collapseReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
