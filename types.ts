
export enum MediaCategory {
  ANIME = 'Anime',
  LIVE_ACTION = 'Movie',
  MANGA = 'Manga/Truyện Tranh'
}

export enum MediaStatus {
  WATCHING = 'Đang xem',
  COMPLETED = 'Hoàn thành',
  PLAN_TO_WATCH = 'Dự định xem',
  ON_HOLD = 'Tạm dừng',
  DROPPED = 'Bỏ dở'
}

export interface MediaItem {
  id: string;
  title: string;
  category: MediaCategory;
  status: MediaStatus;
  rating: number; // 1-10
  description: string;
  imageUrl: string;
  movieUrl?: string; // Link xem phim
  topOrder?: number; // Thứ tự ưu tiên (Top)
  genres: string[];
  createdAt: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}
