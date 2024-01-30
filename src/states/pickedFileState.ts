import { create } from 'zustand'
import { ImagePickerAsset } from 'expo-image-picker';

interface State {
    files: ImagePickerAsset[];
    setAll: (data: ImagePickerAsset) => void;
    clearFiles: () => void
}

export const useGlobalFileState = create<State>((set) => ({
    files: [],
    setAll: (data) => set((state) => ({ ...state, files: [...state.files,data] })),
    clearFiles: () => set((state) => ({ ...state, files: [] }))
}));
