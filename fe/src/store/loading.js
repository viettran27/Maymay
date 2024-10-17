import { create } from "zustand";

export const useLoading = create((set) => ({
    isLoading: false,
    showLoading: () => set({ isLoading: true }),
    hideLoading: () => set({ isLoading: false }),
}))