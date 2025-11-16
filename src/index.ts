#!/usr/bin/env node

import React from 'react';
import { render } from 'ink';
import { config } from 'dotenv';
import { loadConfig } from './config.js';
import { search } from './search.js';
import { App } from './ui/App.js';

// Load environment variables from .env file
config();

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    console.log(`
Fediverse Search - Interactive terminal browser for fediverse search

Usage:
  npm run dev -- <query> [options]

  or after building:

  npm start <query> [options]

Options:
  --config <path>      Path to config file (default: config.json)
  --help, -h           Show this help message

Keyboard Shortcuts:
  ↑/↓  or j/k          Navigate results
  o    or Enter        Open selected post in browser
  /                    Search within results
  f                    Filter by server
  r                    Cycle ranking (date → engagement → relevance)
  q    or Esc          Quit

Examples:
  npm run dev -- "climate change"
  npm run dev -- "open source" --config custom.json
  npm start "photography"
`);
    process.exit(0);
  }

  // Parse arguments
  let query = '';
  let configPath = 'config.json';

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--config' && i + 1 < args.length) {
      configPath = args[++i];
    } else if (!arg.startsWith('--')) {
      query += (query ? ' ' : '') + arg;
    }
  }

  if (!query) {
    console.error('Error: Query is required\n');
    console.log('Run with --help for usage information');
    process.exit(1);
  }

  // Show loading message
  console.log(`Searching for: "${query}"`);
  console.log('Fetching results...\n');

  // Load config
  const configData = loadConfig(configPath);

  // Perform search
  const results = await search(query, configData.servers, 'date');

  // Check if we have results
  if (results.length === 0) {
    console.log('No results found.');
    process.exit(0);
  }

  // Render the interactive UI
  render(React.createElement(App, { query, results }));
}

main().catch((error) => {
  console.error('Error:', error.message);
  process.exit(1);
});
