import { create } from "zustand";

export interface IUserState {
  username: string;
  email: string;
  updated_at: string;
  created_at: string;
  id: number;
  token: string;
  about: string;
  birthday: any;
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
  community_privilege: number;
  state: string;
  ad_sharing: number;
  suspended_at: string;
  suspension_expired_at: string;
  setAll: (data: Partial<IUserState>) => void;
}

export const useDetailsState = create<IUserState>((set) => ({
  username: "",
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
  community_privilege: 0,
  ad_sharing: 0,
  updated_at: "",
  created_at: "",
  id: 0,
  token: "",
  setAll: (data: Partial<Omit<IUserState, "setAll">>) =>
    set((state) => ({ ...state, ...data })),
}));

export const useUserStateBeforeAddingByRegistration = create<IUserState>(
  (set) => ({
    username: "",
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
    community_privilege: 0,
    ad_sharing: 0,
    updated_at: "",
    created_at: "",
    id: 0,
    token: "",
    setAll: (data: Partial<Omit<IUserState, "setAll">>) =>
      set((state) => ({ ...state, ...data })),
  })
);
