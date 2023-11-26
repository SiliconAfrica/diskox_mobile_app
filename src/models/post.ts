import { ICommunity } from './Community';
import { ITag } from './Tag';
import { IUser, UserStats } from './user';

export type IPost = {
  id: number;
  user_id: number;
  category_id: number;
  slug: string;
  title: string;
  description: string;
  post_type: string;
  country: string;
  repost_count: number;
  repost_comment: Array<any>;
  visibility: string;
  poll_duration: number;
  status: string;
  created_at: string;
  upvotes_count: number;
  downvotes_count: number;
  comments_count: number;
  replies_count: number;
  reactions_count: number;
  view_count: number;
  latest_comments: number;
  latest_replies: number;
  has_upvoted: number;
  is_bookmarked: number;
  has_downvoted: number;
  has_voted_poll: number;
  tags: ITag[];
  last_two_comments: any[];
  polls: IPoll[];
  post_images: MediaPost[];
  post_videos: MediaPost[];
  user: IUser & UserStats;
  reposted_post: any[];
  has_reacted: any[];
  community_id: number;
  community?: ICommunity;
};

export type MediaPost = {
  id: number;
  postable_id: number;
  postable_type: string;
  image_path: string;
  created_at: string;
  updated_at: string;
  video_path: string;
  type: string;
  video_thumbnail: string;
};

export type IPoll = {
  id: number,
  post_id: number,
  subject: string,
  vote_count: number,
  deleted_at: string,
  created_at: string,
  updated_at: string,
  is_voted: 0 | 1
}
