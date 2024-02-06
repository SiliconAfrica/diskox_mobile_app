import { IUser } from "./user";

export interface IRecommendedPeople extends IUser {
    recommended_followers: Array<{
        id: 249,
        name: string;
        username: string;
        profile_image: string;
        describes_you: string;
        about: string;
        is_verified: number;
    }>;
}