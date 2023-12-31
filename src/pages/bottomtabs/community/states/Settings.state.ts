import { create } from 'zustand'
import { IRule } from '../../../../models/Rules';

interface State {
    title: string;
    username: string;
    description: string;
    topics:Array<string>;
    id: number;
    user_id: number;
    type: string;
    profile_image: string;
    status: string;
    banner_image: string;
    restricted: number;
    rules: Array<IRule>;
    setAll: (data: Partial<State>) => void;
}

export const useCommunityDetailsState = create<State>((set) => ({
    title: '',
    username: '',
    description: '',
    topics: [],
    id: 0,
    user_id: 0,
    type: '',
    profile_image: '',
    status: '',
    banner_image: '',
    restricted: 0,
    rules: [],
    setAll: (data: Partial<Omit<State, 'setAll'>>) => set((state) => ({ ...state, ...data })),
}));