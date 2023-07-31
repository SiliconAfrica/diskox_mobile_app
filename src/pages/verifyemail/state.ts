import { create } from 'zustand'

interface State {
    stage: number;
    setAll: (data: Partial<State>) => void;
}

export const useVerifyState = create<State>((set) => ({
    stage: 1,
    setAll: (data) => set((state) => ({ ...state, ...data })),
}));