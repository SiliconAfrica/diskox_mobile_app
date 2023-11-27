import { create } from 'zustand'
import { useState } from 'react';

interface State {
    ids: number[];
    setAll: (data: number) => void;
}

export const useDeletePostState = create<State>((set) => ({
    ids: [],
    setAll: (data) => set((state) => ({ ...state, data })),
}));
