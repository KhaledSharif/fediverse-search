import { SearchResult, RankingStrategy } from './types.js';

export { RankingStrategy };

// Scoring weights for relevance calculation
const MATCH_COUNT_WEIGHT = 100;
const DENSITY_WEIGHT = 1000;

export function rankResults(
  results: SearchResult[],
  strategy: RankingStrategy,
  query?: string
): SearchResult[] {
  // Create a copy to avoid mutating the original array
  const sorted = [...results];

  switch (strategy) {
    case 'date':
      return sortByDate(sorted);
    case 'engagement':
      return sortByEngagement(sorted);
    case 'relevance':
      return sortByRelevance(sorted, query);
    default:
      return sorted;
  }
}

function sortByDate(results: SearchResult[]): SearchResult[] {
  return results.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

function sortByEngagement(results: SearchResult[]): SearchResult[] {
  return results.sort((a, b) => {
    const aEngagement = getEngagementScore(a);
    const bEngagement = getEngagementScore(b);
    return bEngagement - aEngagement;
  });
}

function getEngagementScore(result: SearchResult): number {
  return (result.boosts || 0) + (result.favorites || 0);
}

function sortByRelevance(results: SearchResult[], query?: string): SearchResult[] {
  // If no query provided, fall back to date sorting
  if (!query || query.trim() === '') {
    return sortByDate(results);
  }

  // Calculate relevance scores
  const scored = results.map(result => ({
    result,
    score: calculateRelevanceScore(result.content, query)
  }));

  // Sort by score (descending)
  scored.sort((a, b) => b.score - a.score);

  return scored.map(item => item.result);
}

function calculateRelevanceScore(content: string, query: string): number {
  const lowerContent = content.toLowerCase();
  const queryTerms = query.toLowerCase().split(/\s+/);

  let matchCount = 0;

  for (const term of queryTerms) {
    const regex = new RegExp(term, 'gi');
    const matches = lowerContent.match(regex);
    if (matches) {
      matchCount += matches.length;
    }
  }

  if (matchCount === 0) {
    return 0;
  }

  // Score = (match count * weight) + (match density * weight)
  // This favors both number of matches and compactness of content
  const contentLength = content.length || 1;
  const densityScore = (matchCount / contentLength) * DENSITY_WEIGHT;

  return matchCount * MATCH_COUNT_WEIGHT + densityScore;
}
