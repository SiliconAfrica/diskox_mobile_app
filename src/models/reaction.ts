import {IUser} from "./user";

export type IReaction = {
    id: number;
    type: string;
    user: IUser;
}