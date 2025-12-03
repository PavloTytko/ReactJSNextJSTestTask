import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  searchQuery: string;
}

const initialState: UiState = {
  searchQuery: '',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    clearSearch(state) {
      state.searchQuery = '';
    },
  },
});

export const { setSearchQuery, clearSearch } = uiSlice.actions;
export default uiSlice.reducer;
