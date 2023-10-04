import { MediaPost } from "./post";

export interface IComment {
    id: number;
    user_id: number;
    post_id: number;
    comment: string;
    created_at: string;
    upvotes_count: number
    downvotes_count: number;
    reactions_count: number;
    replies_count: number;
    has_upvoted: number;
    has_downvoted: number;
    post_images: MediaPost[],
    user: {
        id: number
        name: string;
        username: string;
        describes_you: string;
        profile_image: string;
        cover_photo: string;
        about: string
        last_seen: string
        following_count: number
        followers_count: number
        isFollowing: number
    },
    has_reacted: any[]
}