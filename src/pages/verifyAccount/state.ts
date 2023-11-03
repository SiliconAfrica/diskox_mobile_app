import { ImagePickerAsset } from 'expo-image-picker';
import {create} from 'zustand'

export interface IType {
    category: string;
    government_id: ImagePickerAsset | null;
    self_with_id: ImagePickerAsset | null;
    video: string;
    setAll: (data: Partial<IType>) => void
}

export const useVerificationState = create<IType>((set) => ({
    category: '',
    government_id: null,
    self_with_id: null,
    video: '',
    setAll: (data) => set((state) => ({ ...state, ...data}))
}));