export interface TKnowledge {
  id: number;
  title: string;
  slug: string;
  message: string;
  created_at: string;
  status: string;
  is_pinned: string;
  content_type: string;
  cover_photo: [string];
}

export interface IAnnouncement {
  id: number;
  title: string;
  slug: string;
  message: string;
  created_at: string;
  status: string;
  is_pinned: number;
  content_type: string;
  cover_photo: [string];
}
