import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock node-fetch - must be hoisted
const mockFetch = vi.hoisted(() => vi.fn());
vi.mock('node-fetch', () => ({
  default: mockFetch
}));

import { ThreadsAdapter } from '../../src/adapters/threads.js';

describe('Threads Adapter', () => {
  let adapter: ThreadsAdapter;

  beforeEach(() => {
    adapter = new ThreadsAdapter();
    vi.clearAllMocks();
  });

  describe('search', () => {
    it('should fetch and parse search results from Threads', async () => {
      // Threads might use a different structure, but for now assume similar to Mastodon
      const mockResponse = {
        statuses: [
          {
            id: '456',
            account: {
              acct: 'threads_user@threads.net'
            },
            content: '<p>Test thread content</p>',
            url: 'https://threads.net/@threads_user/post/456',
            created_at: '2024-01-01T00:00:00.000Z',
            reblogs_count: 3,
            favourites_count: 7
          }
        ]
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse
      });

      const results = await adapter.search('threads.net', 'test query');

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(results).toHaveLength(1);
      expect(results[0].id).toBe('456');
      expect(results[0].server).toBe('threads.net');
      expect(results[0].user).toBe('threads_user@threads.net');
      expect(results[0].content).toBe('Test thread content');
    });

    it('should strip HTML tags from content', async () => {
      const mockResponse = {
        statuses: [
          {
            id: '456',
            account: { acct: 'user1' },
            content: '<p>Hello <strong>Threads</strong>!</p>',
            url: 'https://threads.net/@user1/456',
            created_at: '2024-01-01T00:00:00.000Z',
            reblogs_count: 0,
            favourites_count: 0
          }
        ]
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const results = await adapter.search('threads.net', 'test');

      expect(results[0].content).toBe('Hello Threads!');
    });

    it('should handle empty search results', async () => {
      const mockResponse = {
        statuses: []
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const results = await adapter.search('threads.net', 'test');

      expect(results).toEqual([]);
    });

    it('should handle API errors gracefully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 503,
        statusText: 'Service Unavailable'
      });

      const results = await adapter.search('threads.net', 'test');

      expect(results).toEqual([]);
    });

    it('should handle network errors gracefully', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network timeout'));

      const results = await adapter.search('threads.net', 'test');

      expect(results).toEqual([]);
    });

    it('should handle missing fields in API response', async () => {
      const mockResponse = {
        statuses: [
          {
            id: '456',
            account: {},
            url: 'https://threads.net/@user1/456',
            created_at: '2024-01-01T00:00:00.000Z'
          }
        ]
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const results = await adapter.search('threads.net', 'test');

      expect(results).toHaveLength(1);
      expect(results[0].user).toBe('unknown');
      expect(results[0].content).toBe('');
      expect(results[0].boosts).toBe(0);
      expect(results[0].favorites).toBe(0);
    });
  });
});
