import { IUser } from './user';

export type FollowingModel =  {
    user_id: number;
    follower_id: number;
    follower: Partial<IUser>;
    following: Partial<IUser>;
}