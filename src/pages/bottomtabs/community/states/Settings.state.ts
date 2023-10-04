import { create } from 'zustand'

interface State {
    title: string;
    username: string;
    description: string;
    topics:Array<string>;
    setAll: (data: Partial<State>) => void;
}

export const useCommunityDetailsState = create<State>((set) => ({
    title: '',
    username: '',
    description: '',
    topics: [],
    setAll: (data: Partial<Omit<State, 'setAll'>>) => set((state) => ({ ...state, ...data })),
}));