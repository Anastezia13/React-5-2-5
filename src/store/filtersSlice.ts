import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface FiltersState {
  search: string;
  city: string;
  skills: string[];
  page: number;
}

const initialState: FiltersState = {
  search: '',
  city: 'Все',
  skills: ['JavaScript', 'React', 'Redux'],
  page: 1,
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    hydrateFilters: (_state, action: PayloadAction<FiltersState>) => action.payload,
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
      state.page = 1;
    },
    setCity: (state, action: PayloadAction<string>) => {
      state.city = action.payload;
      state.page = 1;
    },
    addSkill: (state, action: PayloadAction<string>) => {
      const skill = action.payload.trim();
      if (skill && !state.skills.includes(skill)) {
        state.skills.push(skill);
        state.page = 1;
      }
    },
    removeSkill: (state, action: PayloadAction<string>) => {
      state.skills = state.skills.filter((skill) => skill !== action.payload);
      state.page = 1;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
  },
});

export const {
  hydrateFilters,
  setSearch,
  setCity,
  addSkill,
  removeSkill,
  setPage,
} = filtersSlice.actions;
export default filtersSlice.reducer;
