import { ServerConfig, SearchResult, RankingStrategy } from './types.js';
import { MastodonAdapter } from './adapters/mastodon.js';
import { ThreadsAdapter } from './adapters/threads.js';
import { deduplicateResults } from './dedupe.js';
import { rankResults } from './ranker.js';

export async function search(
  query: string,
  servers: ServerConfig[],
  ranking: RankingStrategy = 'date'
): Promise<SearchResult[]> {
  // Handle empty query or servers
  if (!query || query.trim() === '' || servers.length === 0) {
    return [];
  }

  // Create adapter instances
  const mastodonAdapter = new MastodonAdapter();
  const threadsAdapter = new ThreadsAdapter();

  // Query all servers in parallel
  const searchPromises = servers.map(server => {
    const adapter = server.type === 'threads' ? threadsAdapter : mastodonAdapter;
    return adapter.search(server.name, query);
  });

  // Wait for all searches to complete
  const resultsPerServer = await Promise.all(searchPromises);

  // Merge all results
  let allResults = resultsPerServer.flat();

  // Deduplicate by URL
  allResults = deduplicateResults(allResults);

  // Apply ranking
  allResults = rankResults(allResults, ranking, query);

  return allResults;
}
