
import { create } from 'zustand'
import { VISIBILITY } from '../components/modals/VisibiltyModal';
import { POST_FILTERR } from '../enums/Postfilters';
import { IPost } from '../models/post';

interface State {
    showLogin: boolean;
    showSignup: boolean;
    showShare: boolean;
    showVisibility: boolean;
    showFilter: boolean;
    postId: number;
    visibility: string;
    filterBy: string;
    forCommunity: boolean;
    showPostAction: boolean;
    activePost: IPost | null;
    setAll: (data: Partial<State>) => void;
}

export const useModalState = create<State>((set) => ({
    showLogin: false,
    showSignup: false,
    showShare: false,
    showVisibility: false,
    showFilter: false,
    postId: 0,
    visibility: VISIBILITY.EVERYONE,
    filterBy: POST_FILTERR.ALL,
    forCommunity: false,
    showPostAction: false,
    activePost: null,
    setAll: (data: Partial<Omit<State, 'setAll'>>) => set((state) => ({ ...state, ...data })),

}));
