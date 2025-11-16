import { describe, it, expect } from 'vitest';
import { rankResults, RankingStrategy } from '../src/ranker.js';
import { SearchResult } from '../src/types.js';

describe('Ranker', () => {
  const createResult = (
    id: string,
    createdAt: Date,
    boosts: number = 0,
    favorites: number = 0,
    content: string = 'test content'
  ): SearchResult => ({
    id,
    server: 'mastodon.social',
    user: 'testuser',
    content,
    url: `https://mastodon.social/@testuser/${id}`,
    createdAt,
    boosts,
    favorites
  });

  describe('rankResults - date', () => {
    it('should sort results by date (newest first)', () => {
      const results: SearchResult[] = [
        createResult('1', new Date('2024-01-01')),
        createResult('2', new Date('2024-01-03')),
        createResult('3', new Date('2024-01-02'))
      ];

      const ranked = rankResults(results, 'date');

      expect(ranked[0].id).toBe('2'); // 2024-01-03
      expect(ranked[1].id).toBe('3'); // 2024-01-02
      expect(ranked[2].id).toBe('1'); // 2024-01-01
    });

    it('should handle results with same date', () => {
      const date = new Date('2024-01-01');
      const results: SearchResult[] = [
        createResult('1', date),
        createResult('2', date),
        createResult('3', date)
      ];

      const ranked = rankResults(results, 'date');

      expect(ranked).toHaveLength(3);
    });
  });

  describe('rankResults - engagement', () => {
    it('should sort results by total engagement (boosts + favorites)', () => {
      const date = new Date('2024-01-01');
      const results: SearchResult[] = [
        createResult('1', date, 5, 10),  // 15 total
        createResult('2', date, 20, 30), // 50 total
        createResult('3', date, 3, 7)    // 10 total
      ];

      const ranked = rankResults(results, 'engagement');

      expect(ranked[0].id).toBe('2'); // 50
      expect(ranked[1].id).toBe('1'); // 15
      expect(ranked[2].id).toBe('3'); // 10
    });

    it('should handle zero engagement', () => {
      const date = new Date('2024-01-01');
      const results: SearchResult[] = [
        createResult('1', date, 0, 0),
        createResult('2', date, 5, 0),
        createResult('3', date, 0, 0)
      ];

      const ranked = rankResults(results, 'engagement');

      expect(ranked[0].id).toBe('2');
      expect(ranked).toHaveLength(3);
    });
  });

  describe('rankResults - relevance', () => {
    it('should rank results with more query keyword matches higher', () => {
      const date = new Date('2024-01-01');
      const results: SearchResult[] = [
        createResult('1', date, 0, 0, 'hello world'),
        createResult('2', date, 0, 0, 'hello hello hello'),
        createResult('3', date, 0, 0, 'goodbye')
      ];

      const ranked = rankResults(results, 'relevance', 'hello');

      expect(ranked[0].id).toBe('2'); // 3 matches
      expect(ranked[1].id).toBe('1'); // 1 match
      expect(ranked[2].id).toBe('3'); // 0 matches
    });

    it('should be case-insensitive for relevance matching', () => {
      const date = new Date('2024-01-01');
      const results: SearchResult[] = [
        createResult('1', date, 0, 0, 'HELLO world'),
        createResult('2', date, 0, 0, 'hello HELLO'),
        createResult('3', date, 0, 0, 'goodbye')
      ];

      const ranked = rankResults(results, 'relevance', 'hello');

      expect(ranked[0].id).toBe('2'); // 2 matches
      expect(ranked[1].id).toBe('1'); // 1 match
      expect(ranked[2].id).toBe('3'); // 0 matches
    });

    it('should handle multi-word query strings', () => {
      const date = new Date('2024-01-01');
      const results: SearchResult[] = [
        createResult('1', date, 0, 0, 'hello world foo bar'),
        createResult('2', date, 0, 0, 'hello world'),
        createResult('3', date, 0, 0, 'hello')
      ];

      const ranked = rankResults(results, 'relevance', 'hello world');

      expect(ranked[0].id).toBe('2'); // both words, compact
      expect(ranked[1].id).toBe('1'); // both words, more text
      expect(ranked[2].id).toBe('3'); // only one word
    });

    it('should default to date sorting if no query provided', () => {
      const results: SearchResult[] = [
        createResult('1', new Date('2024-01-01')),
        createResult('2', new Date('2024-01-03')),
        createResult('3', new Date('2024-01-02'))
      ];

      const ranked = rankResults(results, 'relevance');

      expect(ranked[0].id).toBe('2'); // newest
    });
  });

  describe('rankResults - edge cases', () => {
    it('should handle empty array', () => {
      const ranked = rankResults([], 'date');

      expect(ranked).toEqual([]);
    });

    it('should handle single result', () => {
      const results: SearchResult[] = [
        createResult('1', new Date('2024-01-01'))
      ];

      const ranked = rankResults(results, 'date');

      expect(ranked).toHaveLength(1);
      expect(ranked[0].id).toBe('1');
    });

    it('should not mutate original array', () => {
      const results: SearchResult[] = [
        createResult('1', new Date('2024-01-01')),
        createResult('2', new Date('2024-01-03'))
      ];

      const original = [...results];
      rankResults(results, 'date');

      expect(results).toEqual(original);
    });
  });
});
