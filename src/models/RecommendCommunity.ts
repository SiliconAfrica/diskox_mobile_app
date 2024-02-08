import { ICommunity } from "./Community";

export interface IRecommendedCommunities extends ICommunity {
    recommended_members: Array<{
        id: number,
        name: string,
        username: string,
        profile_image: string,
        is_accepted: number,
        blocked_at: string
    }>;
}