import { create } from 'zustand'
import { useState } from 'react';

interface State {
    stage: number;
    email: string;
    setAll: (data: Partial<State>) => void;
}

export const useResetState = create<State>((set) => ({
    stage: 1,
    email: "",
    setAll: (data) => set((state) => ({ ...state, ...data })),
}));
