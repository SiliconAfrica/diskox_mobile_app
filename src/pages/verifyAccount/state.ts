import { ImagePickerAsset } from 'expo-image-picker';
import {create} from 'zustand'

export interface IType {
    category: string;
    government_id: ImagePickerAsset | null;
    self_with_id: ImagePickerAsset | null;
    video: string|null;
    setAll: (data: Partial<IType>) => void,
    clearAll: () => void,
    video: string;
    video: string|null;
    setAll: (data: Partial<IType>) => void,
    clearAll: () => void,
}

export const useVerificationState = create<IType>((set) => ({
    category: '',
    government_id: null,
    self_with_id: null,
    video: null,
    setAll: (data) => set((state) => ({ ...state, ...data})),
    clearAll: () => set(() => ({ category: '', government_id: null, self_with_id: null, video: '' }))
    video: '',
    video: null,
    setAll: (data) => set((state) => ({ ...state, ...data})),
    clearAll: () => set(() => ({ category: '', government_id: null, self_with_id: null, video: '' }))
}));