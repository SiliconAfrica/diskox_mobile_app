export interface ICommunity {
  id: number;
  user_id: number;
  name: string;
  username: string;
  description: string;
  type: string;
  topics: string;
  profile_image: string;
  status: string;
  created_at: string;
  updated_at: string;
  banner_image: string;
  restricted: number;
  post_approval: number;
  is_member: number;
  is_member_request_pending: number;
  members_count: number;
}
