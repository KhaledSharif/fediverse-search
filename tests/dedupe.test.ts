import { describe, it, expect } from 'vitest';
import { deduplicateResults } from '../src/dedupe.js';
import { SearchResult } from '../src/types.js';

describe('Deduplication', () => {
  const createResult = (id: string, url: string, server: string = 'mastodon.social'): SearchResult => ({
    id,
    server,
    user: 'testuser',
    content: 'test content',
    url,
    createdAt: new Date('2024-01-01'),
    boosts: 0,
    favorites: 0
  });

  describe('deduplicateResults', () => {
    it('should remove duplicate results by URL', () => {
      const results: SearchResult[] = [
        createResult('1', 'https://example.com/post/1'),
        createResult('2', 'https://example.com/post/1'), // duplicate URL
        createResult('3', 'https://example.com/post/2')
      ];

      const deduplicated = deduplicateResults(results);

      expect(deduplicated).toHaveLength(2);
      expect(deduplicated[0].id).toBe('1');
      expect(deduplicated[1].id).toBe('3');
    });

    it('should preserve first occurrence when duplicates exist', () => {
      const results: SearchResult[] = [
        createResult('1', 'https://example.com/post/1', 'mastodon.social'),
        createResult('2', 'https://example.com/post/1', 'hachyderm.io'),
        createResult('3', 'https://example.com/post/1', 'mastodon.art')
      ];

      const deduplicated = deduplicateResults(results);

      expect(deduplicated).toHaveLength(1);
      expect(deduplicated[0].id).toBe('1');
      expect(deduplicated[0].server).toBe('mastodon.social');
    });

    it('should handle empty array', () => {
      const results: SearchResult[] = [];

      const deduplicated = deduplicateResults(results);

      expect(deduplicated).toEqual([]);
    });

    it('should handle single result', () => {
      const results: SearchResult[] = [
        createResult('1', 'https://example.com/post/1')
      ];

      const deduplicated = deduplicateResults(results);

      expect(deduplicated).toHaveLength(1);
      expect(deduplicated[0].id).toBe('1');
    });

    it('should handle results with no duplicates', () => {
      const results: SearchResult[] = [
        createResult('1', 'https://example.com/post/1'),
        createResult('2', 'https://example.com/post/2'),
        createResult('3', 'https://example.com/post/3')
      ];

      const deduplicated = deduplicateResults(results);

      expect(deduplicated).toHaveLength(3);
    });

    it('should handle results with missing URLs gracefully', () => {
      const result1 = createResult('1', '');
      const result2 = createResult('2', '');
      const result3 = createResult('3', 'https://example.com/post/3');

      const results: SearchResult[] = [result1, result2, result3];

      const deduplicated = deduplicateResults(results);

      // Results with empty URLs should not be considered duplicates of each other
      expect(deduplicated).toHaveLength(3);
    });

    it('should handle case-sensitive URLs', () => {
      const results: SearchResult[] = [
        createResult('1', 'https://example.com/Post/1'),
        createResult('2', 'https://example.com/post/1')
      ];

      const deduplicated = deduplicateResults(results);

      // URLs are case-sensitive, these should be considered different
      expect(deduplicated).toHaveLength(2);
    });
  });
});
