import { create } from 'zustand'

interface State {
    showLogin: boolean;
    showSignup: boolean;
    setAll: (data: Partial<State>) => void;
}

export const useModalState = create<State>((set) => ({
    showLogin: false,
    showSignup: false,
    setAll: (data: Partial<Omit<State, 'setAll'>>) => set((state) => ({ ...state, ...data })),
}));