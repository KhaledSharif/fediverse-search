export type ServerType = 'mastodon' | 'threads';
export type RankingStrategy = 'date' | 'engagement' | 'relevance';

export interface ServerConfig {
  name: string;
  type: ServerType;
}

export interface Config {
  servers: ServerConfig[];
}

export interface SearchResult {
  id: string;
  server: string;
  user: string;
  content: string;
  url: string;
  createdAt: Date;
  boosts?: number;
  favorites?: number;
}

export interface SearchAdapter {
  search(server: string, query: string): Promise<SearchResult[]>;
}
