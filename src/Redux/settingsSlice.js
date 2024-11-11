import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  language: 'EN', // default language
  currency: 'EUR', // default currency
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setLanguage: (state, action) => {
      state.language = action.payload;
    },
    setCurrency: (state, action) => {
      state.currency = action.payload;
    },
  },
});

export const { setLanguage, setCurrency } = settingsSlice.actions;

export default settingsSlice.reducer;
