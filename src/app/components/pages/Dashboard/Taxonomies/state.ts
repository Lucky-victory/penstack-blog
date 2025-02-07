import { create } from "zustand";

type TaxonomiesState = {
  type: "categories" | "tags";
  searchTerm: string;
  setType: (type: "categories" | "tags") => void;
  setSearchTerm: (searchTerm: string) => void;
};

export const useTaxonomiesStore = create<TaxonomiesState>((set) => ({
  type: "categories",
  searchTerm: "",
  setType: (type: "categories" | "tags") => set({ type }),
  setSearchTerm: (searchTerm: string) => set({ searchTerm }),
}));
