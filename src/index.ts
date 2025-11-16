#!/usr/bin/env node

import { config } from 'dotenv';
import { loadConfig } from './config.js';
import { search } from './search.js';
import { RankingStrategy } from './types.js';

// Load environment variables from .env file
config();

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`
Fediverse Search - Search across multiple fediverse servers

Usage:
  npm run dev -- <query> [options]

  or after building:

  npm start <query> [options]

Options:
  --rank <strategy>    Ranking strategy: date, engagement, relevance (default: date)
  --config <path>      Path to config file (default: config.json)
  --limit <number>     Max results to display (default: 20)
  --help, -h           Show this help message

Examples:
  npm run dev -- "climate change" --rank engagement
  npm run dev -- "open source" --rank relevance
  npm start "photography" --rank date --limit 10
`);
    process.exit(0);
  }

  // Parse arguments
  let query = '';
  let ranking: RankingStrategy = 'date';
  let configPath = 'config.json';
  let limit = 20;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--rank' && i + 1 < args.length) {
      ranking = args[++i] as RankingStrategy;
    } else if (arg === '--config' && i + 1 < args.length) {
      configPath = args[++i];
    } else if (arg === '--limit' && i + 1 < args.length) {
      limit = parseInt(args[++i], 10);
    } else if (!arg.startsWith('--')) {
      query += (query ? ' ' : '') + arg;
    }
  }

  if (!query) {
    console.error('Error: Query is required\n');
    console.log('Run with --help for usage information');
    process.exit(1);
  }

  console.log(`Searching for: "${query}"`);
  console.log(`Ranking by: ${ranking}\n`);

  // Load config
  const config = loadConfig(configPath);
  console.log(`Querying ${config.servers.length} servers...\n`);

  // Perform search
  const results = await search(query, config.servers, ranking);

  // Display results
  if (results.length === 0) {
    console.log('No results found.');
    return;
  }

  console.log(`Found ${results.length} results:\n`);

  const displayResults = results.slice(0, limit);

  for (let i = 0; i < displayResults.length; i++) {
    const result = displayResults[i];
    console.log(`${i + 1}. [${result.server}] @${result.user}`);
    console.log(`   ${result.content.slice(0, 200)}${result.content.length > 200 ? '...' : ''}`);
    console.log(`   ${result.url}`);
    if (result.boosts || result.favorites) {
      console.log(`   ⬆️  ${result.boosts} boosts  ❤️  ${result.favorites} favorites`);
    }
    console.log();
  }

  if (results.length > limit) {
    console.log(`... and ${results.length - limit} more results (use --limit to show more)`);
  }
}

main().catch((error) => {
  console.error('Error:', error.message);
  process.exit(1);
});
