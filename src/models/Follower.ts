import { IUser } from "./user";

export type Follower = {
    follower: IUser;
    following: IUser;
    follower_id: number;
    user_id: number;
}