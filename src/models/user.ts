export interface IUser  {
  id: number;
  name: string;
  email: string;
  username: string;
  email_verified_at: string;
  country: string;
  state: string;
  profile_image: string;
  gender: string;
  phone_number: string;
  birthday: string;
  describes_you: string;
  about: string;
  deleted_at: string;
  created_at: string;
  updated_at: string;
  cover_photo: string;
  suspended_at: string;
  disabled_at: string;
  suspension_expired_at: string;
  last_seen: string;
  isFollowing?: 0|1;
};

export interface UserStats {
  following_count: number;
  followers_count: number;
  isFollowing: number;
  isBlocked: number;
  iBlocked: number;
};
