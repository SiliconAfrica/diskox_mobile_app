import { create } from 'zustand'


interface State {
    showModal: boolean;
    setAll: (data: Partial<State>) => void;
}

export const useChatScreenState = create<State>((set) => ({
    showModal: false,
    setAll: (data: Partial<Omit<State, 'setAll'>>) => set((state) => ({ ...state, ...data })),
}));