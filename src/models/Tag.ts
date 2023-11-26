import { IUser } from "./user";

export type ITag = {
    id: number;
    post_id: number;
    user_id: number;
    created_at: string;
    updated_at: string;
    user: IUser;
}