export interface WikiArticle {
  title: string;
  extract: string;
  thumbnail?: {
    source: string;
    width: number;
    height: number;
  };
  pageid: number;
  description?: string;
  url?: string;
}

export interface SavedArticle {
  pageid: number;
  timestamp: number;
}