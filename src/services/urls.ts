export const URLS = {
  LOGIN: "/auth/login",
  SIGNUP: "/auth/register",
  VERIFY_EMAIL: "/auth/verify_email",
  CHECK_USERNAME: "/auth/check_if_username_exists",
  CHECK_EMAIL: "/auth/check_if_email_exists",
  RESEND_OTP: "/auth/resend_otp",
  UPDATE_COUNTRY_SATE: "/update_country_state",
  PASSWORD_RESET_OTP: "/auth/password_reset_otp",
  RESET_PASSWORD: "/auth/reset_password",
  INCREMENT_POST_VIEWS: "/increment_post_views",
  GET_SINGLE_POST: "/fetch_single_post_by_id",
  GET_TRENDING_POSTS: "/fetch_trending_posts",
  REACT_TO_POST: "/react_to_post",
  POST_COMMENT: "/create_comment",
  UPVOTE_POST: "/upvote_post",
  DOWN_VOTE_POST: "/downvote_post",
  REPOST: "/repost",
  GET_POSTS: "/fetch_posts",
  TOP_STORIES: "/fetch_top_stories_posts",
  MOST_UPVOTES: "/fetch_posts_with_highest_upvotes",
  MOST_COMMENTS: "/fetch_posts_with_highest_comments",
  MOST_REACTIONS: "/fetch_posts_with_highest_reactions",
  GET_POST: "/fetch_posts",
  CHATTED_USER: "/fetch_chatted_users",
  GET_CHAT_MESSAGES: "/fetch_messages",
  POST_CHAT_MESSAGE: "/send_message",
  UPDATE_CHAT_MESSAGE: "/edit_message",
  GET_USER_BY_USERNAME: "/get_user_by_username",
  GET_USER_BY_ID: "/get_user",
  GET_PROFILE_POSTS: "/fetch_user_posts",
  GET_PROFILE_POLLS: "/fetch_user_polls",
  GET_PROFILE_DRAFTS: "/fetch_draft_posts",
  GET_PROFILE_UPVOTES: "/fetch_user_upvoted_posts",
  GET_PROFILE_COMMENTS: "/fetch_user_commented_posts",
  GET_PROFILE_OVERVIEW_POSTS: "/fetch_user_overview_posts",
  GET_POLLS: "/fetch_posts_by_post_type/poll",
  GET_QUESTIONS: "/fetch_posts_by_post_type/question",
  VOTE_POLL: "/vote_poll",
  GET_COMMENTS_BY_POST_ID: "/get_comment_by_post_id",
  CREATE_COMMENT: "/create_comment",
  CREATE_REPLY: "/create_reply",
  GET_REPLIES: "/get_replies_by_comment_id",
  GET_NOITIFICATIONS: "/fetch_all_notifications",
  UPVOTE_COMMENT: "/upvote_comment",
  DOWNVOTE_COMMENT: "/downvote_comment",
  UPVOTE_REPLY: "/upvote_reply",
  DOWNVOTE_REPLY: "/downvote_reply",
  UPDATE_COMMMENT: "/update_comment",
  DELETE_COMMMENT: "/delete_comment",
  UPDATED_REPLY: "/update_reply",
  DELETE_REPLY: "/delete_reply",
  GET_REFERRALS: "/fetch_user_referrals",
  COUNT_REFERRALS: "/count_user_referrals",
  FETCH_REF_POINTS: "/fetch_user_referral_points",
  FETCH_KNOWLEDGE_BASE: "/fetch_all_knowledge_base",
  FETCH_SINGLE_KNOWLEDGE_BASE: "/fetch_single_knowledge_base/",
  FETCH_ANNOUNCEMENTS: "/fetch_announcements_page",
  FETCH_SINGLE_ANOUNCEMENT: "/fetch_single_announcement/",
  SEARCH: "/search_query",
  GET_COMMUNITIES: "/all_communities",
  GET_JOINED_COMMUNITIES: "/fetch_communities_user_belongs_to",
  GET_COMMUNITY_COUNTRIES: "/fetch_community_countries",
  GET_COMMUNITY_BY_COUNTRIES: "/fetch_communities_by_country",
  GET_SINGLE_COMMUNITY: "/fetch_single_community",
  CHECK_COMMUNITY_ROLE: "/check_member_community_role",
  JOIN_COMMUNITY: "/join_or_leave_community",
  JOIN_MULTIPLE_COMMUNITIES: "/join_multiple_communities",
  GET_COMMUNITY_POSTS: "fetch_single_community_posts",
  GET_COMMUNITY_MEMBERS: "/fetch_community_members",
  UPDATE_COMMUNITY_PROFILE_IMAGE: "/update_community_profile_image",
  UPDATE_COMMUNITY_BANNER_IMAGE: "/update_community_banner_image",
  ACCEPT_COMMUNITY_MEMBER_REQUEST: "/accept_community_member_request",
  DECLINE_COMMUNITY_MEMBER_REQUEST: "/decline_community_member_request",
  SEARCH_COMMUNITY_MEMBERS_BY_USERNAME: "/search_community_member_by_username",
  SUSPENDED_COMMUNITY_MEMBER: "/suspend_community_member",
  UNSUSPEND_COMMUNITY_MEMBER: "/unsuspend_community_member",
  GET_SUSPENDED_COMMUNITY_MEMBERS: "/fetch_suspended_community_members",
  INVITE_COMMUNITY_MEMBER: "/community_invite_users",
  FETCH_COMMUNITY_MEMBER_REQUEST: "/fetch_community_members_requests",
  FETCH_ACCEPTED_COMMUNITY_INVITATIONS:
    "/fetch_community_accepted_invitation_requests",
  FETCH_PENDING_COMMUNITY_INVITATIONS:
    "/fetch_community_pending_invitation_requests",
  CANCEL_COMMUNITY_INVITATIONS: "/cancel_community_invitation",
  ACCEPT_COMMUNITY_INVITATION: "/accept_community_invite_user",
  DECLINE_COMMUNITY_INVITATION: "/decline_community_invitation",
  BLOCK_COMMUNITY_MEMBER: "/block_community_member",
  UNBLOCK_COMMUNITY_MEMBER: "/unblock_community_member",
  FETCH_BLOCKED_COMMUNITY_MEMBERS: "/fetch_block_community_members",
  REMOVE_COMMUNITY_MEMBER: "/remove_community_member",
  APPROVE_COMMUNITY_POST: "/approve_community_post",
  DECLINE_COMMUNITY_POST: "/decline_community_post",
  ASSIGN_COMMUNITY_ROLE: "/assign_community_role",
  REVOKE_COMMUNITY_ROLE: "/revoke_user_community_role_permissions",
  GET_USER_FOLLOWING_AND_FOLLOWERS_COUNT:
    "/fetch_user_followings_and_followers_count",
  FOLLOW_OR_UNFOLLOW_USER: "/follow_unfollow_user",
  FETCH_USER_FOLLOWERS: "/fetch_user_followers",
  SEARCH_USER_FOLLOWERS: "/search_user_followers_by_username",
  GET_COMMUNITY_MODERATORS: "/fetch_community_moderators",
  GET_COMMUNITY_PENDING_POSTS: "/fetch_community_pending_posts",
  ADD_COMMUNITY_RULE: "/add_community_rules",
  UPDATE_COMMUNITY_RULE: "/update_community_rules",
  DELETE_COMMUNITY_RULE: "/delete_community_rule",
  GET_COMMUNITY_RULES: "/fetch_all_community_rules",
  CREATE_COMMUNITY: "/create_community",
  GET_AUTH_USER_DETAILS: "/get_auth_user_details",
  GET_ANALYSIS: "/user_analysis_tab_figures",
  UPDATE_PROFILE: "/update_profile",
  CHANGE_PASSWORD: "/password",
  FETCH_BLOCKED_USERS: "/fetch_blocked_users",
  BLOCK_AND_UNBLOCK_USER: "/block_and_unblock_user",
  REACT_TO_MESSAGE: "/react_to_message",
  DELETE_MESSAGE: "/delete_sent_message",
  GET_CATEGORIES: "/fetch_categories",
  UPDATE_INTEREST: "/update_user_interests",
  BOOKMARK_POST: "/bookmark_post",
  AD_SHARING_REQUEST: "/send_ad_sharing_request",
  GET_VERIFICATION_AND_MONETIZATION_REQUIREMENT:
    "/get_user_requirements_for_verification_and_monetization",
  UPDATE_COMMUNITY_PROFILE: "/update_community_profile",
  UPDATE_COMMUNITY_TYPE: "/update_community_type",
  UPDATE_COVER_PHOTO: "/update_cover_photo",
  REACT_TO_COMMENT: "/react_to_comment",
  GET_BOOKMARK_POSTS: "/fetch_bookmarked_post",
  REPORT_USER: "/report_user",
  REPORT_COMMENT: "/report_comment",
  REPORT_REPLY: "/report_reply",
  GOOGLE_AUTH: "/auth/login_or_register_with_google",
  GET_SINGLE_REPLY: "/get_single_reply",
  GET_SINGLE_COMMENT: "/get_single_comment",
  REACT_TO_REPLY: "/react_to_reply",
  VERIFY_ACCOUNT: "/request_for_verification",
  GET_POPULAR_HASTAGS: "/fetch_popular_hashtags",
  FETCH_POSTS_BY_HASHTAG: "/fetch_posts_by_hashtag",
  UPDATE_COMMENT: "/update_comment",
  DELETE_COMMENT: "/delete_comment",
  DELETE_POST: "delete_post",
  GET_FOLLOWING: "/following_posts",
  GET_USER_FOLLOWING: "/fetch_user_following",
  GET_USERS_FOLLOWERS: "/fetch_user_followers",
  GET_MENTIONS: "/search_user_mentions",
  UPDATE_POST: "/update_post",
  GET_MY_COMMUNITIES: "/fetch_communities_user_belongs_to",
  RECOMMENDED_PEOPLE: "/get_people_you_may_know",
  RECOMMENDED_COMMUNITY: "/get_communities_you_may_know",
  SEND_PUSH_NOTIFICATION_TOKEN: "/save_mobile_logs_token",
  GET_NOTIFICATION_COUNT: "/fetch_unread_notifications_count",
  MARK_NOTIFICATION_READ: "/mark_notification_read",
  GET_ALL_COMMUNITY: "/all_communities",
  SEND_WITHDRAWAL_OTP: "/send_withdrawal_otp",
  FETCH_USER_WITHDRAWAL: "/fetch_user_withdrawals",
  BANK_ACCOUNT: "/bank_accounts",
  SEND_PUSH_NOTIFICATION_TOKEN: '/save_mobile_logs_token',
  GET_NOTIFICATION_COUNT: '/fetch_unread_notifications_count',
  MARK_NOTIFICATION_READ: '/mark_notification_read',
  MARK_ALL_NOTIFICATIONS_AS_READ: '/mark_all_notification_read',
  GET_ALL_COMMUNITY: '/all_communities',
  GET_POST_BY_SLUG: '/fetch_single_post_by_slug',

  // URLS WITH DYNAMIC
  GET_POST_REACTION: (id: number) => `fetch_post_reacted_users_by_reaction_type/${id}/love`,
  GET_COMMENT_REACTION: (comment_id: number) => `/fetch_comment_reacted_users_by_reaction_type/${comment_id}/love`,
  GET_REPLY_REACTION: (reply_id: number) => `/fetch_reply_reacted_users_by_reaction_type/${reply_id}/love`,
};
