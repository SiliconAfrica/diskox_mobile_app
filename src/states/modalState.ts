import { create } from "zustand";
import { POST_FILTERR } from "../enums/Postfilters";
import { IPost } from "../models/post";
import { IChatMessage } from "../models/chatmessages";

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
  showReportComment: boolean;
  showReportReply: boolean;
  postId: number;
  visibility: string;
  filterBy: string;
  forCommunity: boolean;
  showImageVideoSlider: boolean;
  imageVideoSliderData: any[];
  showReportPost: boolean;
  showBlockUser: boolean;
  showInviteModerator: boolean;
  showDeleteConvo: boolean;
  imageViewer: boolean;
  activeImages: string[];
  activeComment_id: number;
  activeReply_id: number;
  activeUser_id: number;
  activeChat: { userId: number; username: string } | null;
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
  showReportComment: false,
  showReportReply: false,
  postId: 0,
  visibility: VISIBILITY.EVERYONE,
  filterBy: POST_FILTERR.ALL,
  forCommunity: false,
  showImageVideoSlider: false,
  imageVideoSliderData: [],
  showReportPost: false,
  showBlockUser: false,
  showInviteModerator: false,
  activeChat: null,
  showDeleteConvo: false,
  imageViewer: false,
  activeImages: [],
  activeComment_id: null,
  activeReply_id: null,
  activeUser_id: null,
  setAll: (data: Partial<Omit<State, "setAll">>) =>
    set((state) => ({ ...state, ...data })),
}));
