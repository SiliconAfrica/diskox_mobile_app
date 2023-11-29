import {create} from 'zustand'

type CreatePostModal = {
    tags: number[];
    setTags: (tag: number) => void;
    reset: () => void;
}

export const useCreatePostState = create<CreatePostModal>((set, get) => ({
    tags: [],
    setTags: (data) => set((state) => {
        if (state.tags.includes(data)) {
            const newT = state.tags.filter((item) => item !== data)
            return {
                ...state,
                tags: newT,
            }
        }
        return {
            ...state,
            tags: [...state.tags, data]
        }
    }),
    reset: () => set(() => ({ tags: []}))
}))