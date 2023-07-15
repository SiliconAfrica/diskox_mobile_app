import { create } from 'zustand'

interface State {
    isLoggedIn: boolean;
    isDarkMode: boolean;
    setAll: (data: Partial<State>) => void;
}

export const useUtilState = create<State>((set) => ({
    isLoggedIn: false,
    isDarkMode: true,
    setAll: (data) => set((state) => ({ ...state, ...data })),
}));