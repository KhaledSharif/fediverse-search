import { SearchAdapter, SearchResult } from '../types.js';
import { BaseAdapter } from './base.js';

interface MastodonStatus {
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

interface MastodonSearchResponse {
  statuses: MastodonStatus[];
}

export class MastodonAdapter extends BaseAdapter implements SearchAdapter {
  async search(server: string, query: string): Promise<SearchResult[]> {
    // Get auth token from environment
    const authToken = this.getAuthToken(server);

    if (!authToken) {
      console.log(`Skipping ${server}: No authentication credentials found`);
      return [];
    }

    const url = `https://${server}/api/v2/search?q=${encodeURIComponent(query)}&type=statuses&limit=20`;

    const data = await this.fetchJson<MastodonSearchResponse>(url, authToken);

    if (!data) {
      return [];
    }

    return data.statuses.map(status => this.parseStatus(status, server));
  }

  private getAuthToken(server: string): string | undefined {
    // Convert server name to env var format: mastodon.social -> MASTODON_SOCIAL
    const envKey = server.toUpperCase().replace(/\./g, '_') + '_ACCESS_TOKEN';
    return process.env[envKey];
  }

  private parseStatus(status: MastodonStatus, server: string): SearchResult {
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
