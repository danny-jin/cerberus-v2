import { configureStore } from '@reduxjs/toolkit';

import appSliceReducer from './slices/appSlice';
import accountSliceReducer from './slices/accountSlice';
import pendingTxSliceReducer from './slices/pendingTxSlice';

const store = configureStore({
  reducer: {
    app: appSliceReducer,
    account: accountSliceReducer,
    pendingTx: pendingTxSliceReducer
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
