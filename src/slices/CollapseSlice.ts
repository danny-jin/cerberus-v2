import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

interface CollapseState {
  isCollapse: boolean;
}

// Adds a message to the store
const collapseToggle = function (state: CollapseState, _collapse:any) {
  let collapse = _collapse;
  state.isCollapse = collapse;
};
const initialState: CollapseState = {
  isCollapse: false,
};
const collapseSlice = createSlice({
  name: 'collapse',
  initialState,
  reducers: {
    // Creates an error message
    toggle: (state, action) => {
      collapseToggle(state, action.payload);
    },
  },
});

export const {toggle} = collapseSlice.actions;

export const selectCollapse = (state: RootState) => state.collapse.isCollapse;

export default collapseSlice.reducer;
