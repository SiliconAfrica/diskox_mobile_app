import { create } from 'zustand'

interface State {
    username: string;
    email: string;
    updated_at: string;
    created_at: string;
    id: number;
    token: string;
    about: string;
    birthday: string;
    country: string;
    cover_photo: string;
    deleted_at: string;
    describes_you: string;
    email_verified_at: string;
    gender: string;
    last_seen: string;
    name: string;
    phone_number: string;
    profile_image: string;
    state: string;
    suspended_at: string;
    suspension_expired_at: string
    setAll: (data: Partial<State>) => void;
}

export const useDetailsState = create<State>((set) => ({
    username: '',
    email: "",
    about: "",
    birthday: "",
    country: "",
    cover_photo: "",
    deleted_at: "",
    describes_you: "",
    email_verified_at: "",
    gender: "",
    last_seen: "",
    name: "",
    phone_number: "",
    profile_image: "",
    state: "",
    suspended_at: "",
    suspension_expired_at: "",
    updated_at: '',
    created_at: '',
    id: 0,
    token: '',
    setAll: (data: Partial<Omit<State, 'setAll'>>) => set((state) => ({ ...state, ...data })),
}));