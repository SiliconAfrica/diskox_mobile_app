import { create } from "zustand";
import { IRule } from "../../../../models/Rules";
import { IUser } from "../../../../models/user";

interface State {
  title: string;
  username: string;
  description: string;
  topics: string;
  newTopic: string;
  id: number;
  user_id: number;
  type: string;
  profile_image: string;
  status: string;
  banner_image: string;
  restricted: number;
  post_approval: number;
  communityUserToTakeActionOn: Partial<IUser>;
  single_moderator_permissions: {
    rules: boolean;
    users: boolean;
    content: boolean;
  };
  rules: Array<IRule>;
  setAll: (data: Partial<State>) => void;
}

export const useCommunityDetailsState = create<State>((set) => ({
  title: "",
  username: "",
  description: "",
  topics: "",
  newTopic: "",
  id: 0,
  user_id: 0,
  type: "",
  profile_image: "",
  status: "",
  banner_image: "",
  restricted: 0,
  post_approval: 0,
  communityUserToTakeActionOn: {},
  single_moderator_permissions: { rules: false, users: false, content: false },
  rules: [],
  setAll: (data: Partial<Omit<State, "setAll">>) =>
    set((state) => ({ ...state, ...data })),
}));
