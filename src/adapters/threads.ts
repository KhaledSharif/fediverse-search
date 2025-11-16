import { SearchAdapter, SearchResult } from '../types.js';
import { BaseAdapter } from './base.js';

interface ThreadsStatus {
  id: string;
  account?: {
    acct?: string;
  };
  content?: string;
  url?: string;
  created_at?: string;
  reblogs_count?: number;
  favourites_count?: number;
}

interface ThreadsSearchResponse {
  statuses: ThreadsStatus[];
}

export class ThreadsAdapter extends BaseAdapter implements SearchAdapter {
  async search(server: string, query: string): Promise<SearchResult[]> {
    // Note: Threads may use different API endpoints in production
    // For now, assuming similar ActivityPub-compatible API structure
    const url = `https://${server}/api/v2/search?q=${encodeURIComponent(query)}&type=statuses&limit=20`;

    const data = await this.fetchJson<ThreadsSearchResponse>(url);

    if (!data) {
      return [];
    }

    return data.statuses.map(status => this.parseStatus(status, server));
  }

  private parseStatus(status: ThreadsStatus, server: string): SearchResult {
    return {
      id: status.id,
      server,
      user: status.account?.acct || 'unknown',
      content: this.stripHtml(status.content || ''),
      url: status.url || '',
      createdAt: status.created_at ? new Date(status.created_at) : new Date(),
      boosts: status.reblogs_count || 0,
      favorites: status.favourites_count || 0
    };
  }
}
