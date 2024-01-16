import { set } from 'lodash';
import {create} from 'zustand';
import { Mention } from '../../models/mention';

type State = {
    ids: string[];
    users: Mention[];
    selectedUsers: Mention[];
    setSelectedUsers: (data: Mention) =>void;
    setId: (id: string) => void;
    setMention: (data: Mention[]) => void;
    reset: () => void
}

export const useCommentMentionState = create<State>((set) => ({
    ids:[],
    users: [],
    selectedUsers: [],
    setSelectedUsers: (data) => set((state) => ({ ...state, selectedUsers: [...state.selectedUsers, data]})),
    setId: (data) => set((state) => ({ ids: [...state.ids, data ]})),
    setMention: (data) => set((state) => ({ ...state, users: [...state.users, ...data] })),
    reset: () => set(() => ({ selectedUsers: [], users:[],ids:[]}))
}))