import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SearchResult } from '../src/types.js';

// Create shared mock instances
const mockMastodonSearchFn = vi.fn();
const mockThreadsSearchFn = vi.fn();

// Mock the adapters
vi.mock('../src/adapters/mastodon.js', () => ({
  MastodonAdapter: class {
    search(...args: any[]) {
      return mockMastodonSearchFn(...args);
    }
  }
}));

vi.mock('../src/adapters/threads.js', () => ({
  ThreadsAdapter: class {
    search(...args: any[]) {
      return mockThreadsSearchFn(...args);
    }
  }
}));

// Import after mocking
import { search } from '../src/search.js';

describe('Search Orchestrator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should search across multiple servers and merge results', async () => {
    const result1: SearchResult = {
      id: '1',
      server: 'mastodon.social',
      user: 'user1',
      content: 'test post',
      url: 'https://mastodon.social/1',
      createdAt: new Date('2024-01-01'),
      boosts: 5,
      favorites: 10
    };

    const result2: SearchResult = {
      id: '2',
      server: 'threads.net',
      user: 'user2',
      content: 'another post',
      url: 'https://threads.net/2',
      createdAt: new Date('2024-01-02'),
      boosts: 3,
      favorites: 7
    };

    mockMastodonSearchFn.mockResolvedValue([result1]);
    mockThreadsSearchFn.mockResolvedValue([result2]);

    const servers = [
      { name: 'mastodon.social', type: 'mastodon' as const },
      { name: 'threads.net', type: 'threads' as const }
    ];

    const results = await search('test query', servers);

    expect(results).toHaveLength(2);
    expect(results.find(r => r.id === '1')).toBeDefined();
    expect(results.find(r => r.id === '2')).toBeDefined();
  });

  it('should deduplicate results with same URL', async () => {
    const result1: SearchResult = {
      id: '1',
      server: 'mastodon.social',
      user: 'user1',
      content: 'test post',
      url: 'https://example.com/same',
      createdAt: new Date('2024-01-01'),
      boosts: 5,
      favorites: 10
    };

    const result2: SearchResult = {
      id: '2',
      server: 'hachyderm.io',
      user: 'user2',
      content: 'test post',
      url: 'https://example.com/same', // Same URL - should be deduped
      createdAt: new Date('2024-01-01'),
      boosts: 3,
      favorites: 7
    };

    mockMastodonSearchFn.mockResolvedValueOnce([result1]).mockResolvedValueOnce([result2]);

    const servers = [
      { name: 'mastodon.social', type: 'mastodon' as const },
      { name: 'hachyderm.io', type: 'mastodon' as const }
    ];

    const results = await search('test query', servers);

    expect(results).toHaveLength(1);
    expect(results[0].server).toBe('mastodon.social'); // First one should be kept
  });

  it('should apply ranking strategy', async () => {
    const oldResult: SearchResult = {
      id: '1',
      server: 'mastodon.social',
      user: 'user1',
      content: 'old post',
      url: 'https://mastodon.social/1',
      createdAt: new Date('2024-01-01'),
      boosts: 0,
      favorites: 0
    };

    const newResult: SearchResult = {
      id: '2',
      server: 'mastodon.social',
      user: 'user2',
      content: 'new post',
      url: 'https://mastodon.social/2',
      createdAt: new Date('2024-01-10'),
      boosts: 0,
      favorites: 0
    };

    mockMastodonSearchFn.mockResolvedValue([oldResult, newResult]);

    const servers = [{ name: 'mastodon.social', type: 'mastodon' as const }];

    const results = await search('test query', servers, 'date');

    expect(results[0].id).toBe('2'); // Newer post should be first
    expect(results[1].id).toBe('1');
  });

  it('should handle server errors gracefully', async () => {
    const result1: SearchResult = {
      id: '1',
      server: 'mastodon.social',
      user: 'user1',
      content: 'test post',
      url: 'https://mastodon.social/1',
      createdAt: new Date('2024-01-01'),
      boosts: 5,
      favorites: 10
    };

    // First server succeeds, second fails
    mockMastodonSearchFn
      .mockResolvedValueOnce([result1])
      .mockResolvedValueOnce([]); // Empty results for failed server

    const servers = [
      { name: 'mastodon.social', type: 'mastodon' as const },
      { name: 'failing.server', type: 'mastodon' as const }
    ];

    const results = await search('test query', servers);

    // Should still return results from successful server
    expect(results).toHaveLength(1);
    expect(results[0].id).toBe('1');
  });

  it('should handle empty search query', async () => {
    const servers = [{ name: 'mastodon.social', type: 'mastodon' as const }];

    const results = await search('', servers);

    expect(results).toEqual([]);
  });

  it('should handle empty server list', async () => {
    const results = await search('test query', []);

    expect(results).toEqual([]);
  });
});
