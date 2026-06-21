import { create } from "zustand";
import type { SearchResult } from "../types";

interface SearchState {
  query: string;
  activeFilter: string;
  results: SearchResult[];
  loading: boolean;
  setQuery: (q: string) => void;
  setFilter: (f: string) => void;
  setResults: (r: SearchResult[]) => void;
  setLoading: (l: boolean) => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  query: "",
  activeFilter: "",
  results: [],
  loading: false,
  setQuery: (query) => set({ query }),
  setFilter: (activeFilter) => set({ activeFilter }),
  setResults: (results) => set({ results }),
  setLoading: (loading) => set({ loading }),
}));
