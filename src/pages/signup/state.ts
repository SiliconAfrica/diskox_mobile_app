import { create } from 'zustand'

interface State {
    stage: number;
    username: string;
    email: string;
    password: string;
    password_confirmation: string;
    setAll: (data: Partial<State>) => void;
    reset: () => void
}

export const useSignupState = create<State>((set) => ({
    stage: 1,
    username: '',
    email: '',
    password: '',
    password_confirmation: '',
    setAll: (data) => set((state) => ({ ...state, ...data })),
    reset: () => set((state) => ({ state: 1, username: '', email: '', password: '', password_confirmation: '' })),
}));