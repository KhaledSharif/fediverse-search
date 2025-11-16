import { SearchResult } from './types.js';

export function deduplicateResults(results: SearchResult[]): SearchResult[] {
  const seen = new Set<string>();
  const deduplicated: SearchResult[] = [];

  for (const result of results) {
    // Skip results without URLs or with empty URLs
    if (!result.url || result.url.trim() === '') {
      deduplicated.push(result);
      continue;
    }

    // Only add if we haven't seen this URL before
    if (!seen.has(result.url)) {
      seen.add(result.url);
      deduplicated.push(result);
    }
  }

  return deduplicated;
}
