import { ImagePickerAsset } from "expo-image-picker";
import { IFile } from "../pages/chat";
import { IUser } from "./user";

export type IChatMessage = {
  chat_code: string;
  created_at: string;
  deleted_by: number;
  deleted_for: "everyone" | "me";
  deleted_time: string;
  id: number;
  message: string;
  post_images: Array<{
    created_at: string;
    deleted_by: any;
    deleted_for: any;
    deleted_time: string;
    id: number;
    image_path: string;
    processed: number;
    type: string;
  }>;
  reactions: Array<{
    id: number;
    type: string;
    reacted_by: number;
  }>;
  receiver_id: number;
  sender_id: number;
  sender_user: Partial<IUser>;
  post_files: Array<{
    id: 583;
    file_path: string;
    type: string;
    file_name: string;
    processed: number;
    created_at: string;
    deleted_for: string;
    deleted_by: number;
    deleted_time: string;
  }>;
};

export type IChatResponse = {
  status: string;
  code: number;
  data: Array<IChatMessage>;
  links: {
    first: string;
    last: string;
    prev: string;
    next: string;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
};

export type IPost_Image = {
  created_at: string;
  deleted_by: any;
  deleted_for: any;
  deleted_time: string;
  id: number;
  image_path: string;
  processed: number;
  type: string;
};

export type IChatContainer = {
  chat: IChatMessage;
  isSent: boolean;
  message: string;
  files: ImagePickerAsset[];
  created_at: string;
};

export type UNsentMessage = {
  message: string;
  files: IFile[];
  docs: IFile[];
  created_at: string;
};
