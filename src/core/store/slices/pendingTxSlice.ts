import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IPendingTx } from '../../interfaces/base';

const initialState: Array<IPendingTx> = [];

const pendingTxSlice = createSlice({
  name: 'pendingTransactions',
  initialState,
  reducers: {
    fetchPendingTxs(state, action: PayloadAction<IPendingTx>) {
      state.push(action.payload);
    },
    clearPendingTx(state, action: PayloadAction<string>) {
      const target = state.find(x => x.txHash === action.payload);
      if (target) {
        state.splice(state.indexOf(target), 1);
      }
    },
  },
});

export const getStakingTypeText = (action: string) => {
  return action.toLowerCase() === 'stake' ? 'Staking 3DOG' : 'Unstaking 3DOGs';
};

export const getWrappingTypeText = (action: string) => {
  return action.toLowerCase() === 'wrap' ? 'Wrapping 3DOG' : 'Unwrapping 3DOGs';
};

export const isPendingTxn = (pendingTransactions: IPendingTx[], type: string) => {
  return pendingTransactions.map(x => x.type).includes(type);
};

export const txnButtonText = (pendingTransactions: IPendingTx[], type: string, defaultText: string) => {
  return isPendingTxn(pendingTransactions, type) ? 'Pending...' : defaultText;
};

export const txnButtonTextGeneralPending = (pendingTransactions: IPendingTx[], type: string, defaultText: string) => {
  return pendingTransactions.length >= 1 ? 'Pending...' : defaultText;
};

export const {fetchPendingTxs, clearPendingTx} = pendingTxSlice.actions;

export default pendingTxSlice.reducer;
