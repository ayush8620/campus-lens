import { create } from "zustand";
import type { CollegeFilters } from "@/types";

interface FilterState extends Omit<CollegeFilters, "cursor" | "limit"> {}

interface FilterActions {
  setFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  resetFilters: () => void;
  setSearch: (text: string) => void;
}

type FilterStore = FilterState & FilterActions;

const initialState: FilterState = {
  search: undefined,
  state: undefined,
  city: undefined,
  minFees: undefined,
  maxFees: undefined,
  minRating: undefined,
  ownership: undefined,
  naacGrade: undefined,
  course: undefined,
  sort: undefined,
};

export const useFilterStore = create<FilterStore>()((set) => ({
  ...initialState,

  setFilter: (key, value) => {
    set({ [key]: value || undefined });
  },

  resetFilters: () => {
    set(initialState);
  },

  setSearch: (text) => {
    set({ search: text || undefined });
  },
}));
