import { create } from "zustand";
import { POST_FILTERR } from "../enums/Postfilters";

export enum VISIBILITY {
  EVERYONE = "everyone",
  FOLLOWERS = "followers",
}

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
  setAll: (data: Partial<Omit<State, "setAll">>) =>
    set((state) => ({ ...state, ...data })),
}));
