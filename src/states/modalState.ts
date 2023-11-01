import { create } from "zustand";
import { POST_FILTERR } from "../enums/Postfilters";
import { IPost } from "../models/post";

export enum VISIBILITY {
  EVERYONE = "everyone",
  FOLLOWERS = "followers",
}

interface State {
  addAccount: boolean;
  activePost: IPost | null;
  showLogin: boolean;
  showSignup: boolean;
  showShare: boolean;
  showVisibility: boolean;
  showMonetization: boolean;
  showFilter: boolean;
  showPostAction: boolean;
  showVerification: boolean;
  postId: number;
  visibility: string;
  filterBy: string;
  forCommunity: boolean;
  showImageVideoSlider: boolean;
  imageVideoSliderData: any[];
  showReportPost: boolean;
  setAll: (data: Partial<State>) => void;
}

export const useModalState = create<State>((set) => ({
  addAccount: false,
  activePost: null,
  showLogin: false,
  showSignup: false,
  showShare: false,
  showVisibility: false,
  showMonetization: false,
  showFilter: false,
  showPostAction: false,
  showVerification: false,
  postId: 0,
  visibility: VISIBILITY.EVERYONE,
  filterBy: POST_FILTERR.ALL,
  forCommunity: false,
  showImageVideoSlider: false,
  imageVideoSliderData: [],
  showReportPost: false,
  setAll: (data: Partial<Omit<State, "setAll">>) =>
    set((state) => ({ ...state, ...data })),
}));
