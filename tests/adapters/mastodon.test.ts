import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock node-fetch - must be hoisted
const mockFetch = vi.hoisted(() => vi.fn());
vi.mock('node-fetch', () => ({
  default: mockFetch
}));

import { MastodonAdapter } from '../../src/adapters/mastodon.js';

describe('Mastodon Adapter', () => {
  let adapter: MastodonAdapter;

  beforeEach(() => {
    adapter = new MastodonAdapter();
    vi.clearAllMocks();
    // Set mock auth token for testing
    process.env.MASTODON_SOCIAL_ACCESS_TOKEN = 'test_token_123';
  });

  describe('search', () => {
    it('should fetch and parse search results from Mastodon API', async () => {
      const mockResponse = {
        statuses: [
          {
            id: '123',
            account: {
              acct: 'user1@mastodon.social'
            },
            content: '<p>Test post content</p>',
            url: 'https://mastodon.social/@user1/123',
            created_at: '2024-01-01T00:00:00.000Z',
            reblogs_count: 5,
            favourites_count: 10
          }
        ]
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse
      });

      const results = await adapter.search('mastodon.social', 'test query');

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://mastodon.social/api/v2/search?q=test%20query&type=statuses&limit=20',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Accept': 'application/json'
          })
        })
      );

      expect(results).toHaveLength(1);
      expect(results[0].id).toBe('123');
      expect(results[0].server).toBe('mastodon.social');
      expect(results[0].user).toBe('user1@mastodon.social');
      expect(results[0].content).toBe('Test post content');
      expect(results[0].url).toBe('https://mastodon.social/@user1/123');
      expect(results[0].boosts).toBe(5);
      expect(results[0].favorites).toBe(10);
    });

    it('should strip HTML tags from content', async () => {
      const mockResponse = {
        statuses: [
          {
            id: '123',
            account: { acct: 'user1' },
            content: '<p>Hello <strong>world</strong>!</p><br><a href="#">Link</a>',
            url: 'https://mastodon.social/@user1/123',
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

      const results = await adapter.search('mastodon.social', 'test');

      expect(results[0].content).toBe('Hello world!Link');
    });

    it('should handle empty search results', async () => {
      const mockResponse = {
        statuses: []
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const results = await adapter.search('mastodon.social', 'test');

      expect(results).toEqual([]);
    });

    it('should handle API errors gracefully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      });

      const results = await adapter.search('mastodon.social', 'test');

      expect(results).toEqual([]);
    });

    it('should handle network errors gracefully', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const results = await adapter.search('mastodon.social', 'test');

      expect(results).toEqual([]);
    });

    it('should handle missing fields in API response', async () => {
      const mockResponse = {
        statuses: [
          {
            id: '123',
            account: {},
            url: 'https://mastodon.social/@user1/123',
            created_at: '2024-01-01T00:00:00.000Z'
          }
        ]
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const results = await adapter.search('mastodon.social', 'test');

      expect(results).toHaveLength(1);
      expect(results[0].user).toBe('unknown');
      expect(results[0].content).toBe('');
      expect(results[0].boosts).toBe(0);
      expect(results[0].favorites).toBe(0);
    });

    it('should URL-encode query parameters', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ statuses: [] })
      });

      await adapter.search('mastodon.social', 'test & special chars');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('test%20%26%20special%20chars'),
        expect.any(Object)
      );
    });
  });
});
