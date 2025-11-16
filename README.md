# Fediverse Search

A minimal, test-driven Node.js/TypeScript application for searching across multiple fediverse servers (Mastodon, Threads, and other ActivityPub-compatible platforms).

## Features

- **Multi-server search**: Query multiple fediverse instances in parallel
- **Protocol support**: Mastodon, Pixelfed, and Threads (via ActivityPub)
- **Deduplication**: Automatically removes duplicate posts across servers
- **Flexible ranking**: Sort results by date, engagement, or relevance
- **Configurable**: Easily add or remove servers via config file
- **Well-tested**: Built with TDD (44 passing tests)

## Installation

```bash
npm install
```

## Configuration

### 1. Server Configuration

Copy the example config and customize it:

```bash
cp config.example.json config.json
```

Edit `config.json` to add your preferred fediverse servers:

```json
{
  "servers": [
    { "name": "mastodon.social", "type": "mastodon" },
    { "name": "hachyderm.io", "type": "mastodon" },
    { "name": "pixelfed.social", "type": "mastodon" }
  ]
}
```

### 2. Authentication Setup (Required for Search Results)

Mastodon search APIs require authentication. To get your access token:

1. Go to your Mastodon instance (e.g., https://mastodon.social)
2. Settings → Development → New Application
3. Give it a name (e.g., "Fediverse Search")
4. Set scopes: `read:search` (or just use default scopes)
5. Click "Submit"
6. Copy your **Access Token**

Create a `.env` file:

```bash
cp .env.example .env
```

Edit `.env` and add your credentials:

```bash
# For mastodon.social (replace dots with underscores, uppercase)
MASTODON_SOCIAL_ACCESS_TOKEN=your_actual_token_here

# For other instances (optional):
HACHYDERM_IO_ACCESS_TOKEN=your_token_here
MASTODON_ART_ACCESS_TOKEN=your_token_here
```

**Important:** Servers without authentication credentials will be automatically skipped.

## Usage

### Development mode

```bash
npm run dev -- "your search query"
```

### With options

```bash
npm run dev -- "climate change" --rank engagement --limit 10
```

### Production build

```bash
npm run build
npm start "your search query"
```

## Options

- `--rank <strategy>` - Ranking strategy:
  - `date` - Sort by newest first (default)
  - `engagement` - Sort by boosts + favorites
  - `relevance` - Sort by keyword match density

- `--config <path>` - Path to config file (default: `config.json`)

- `--limit <number>` - Max results to display (default: 20)

- `--help`, `-h` - Show help message

## Examples

Search for photography content ranked by engagement:
```bash
npm run dev -- photography --rank engagement
```

Search for climate discussions with relevance ranking:
```bash
npm run dev -- "climate change" --rank relevance
```

Use a custom config file:
```bash
npm run dev -- "open source" --config custom-servers.json
```

## Development

### Running tests

```bash
npm test                 # Run all tests
npm run test:watch       # Watch mode
npm run test:ui          # Interactive UI
```

### Building

```bash
npm run build            # Compile TypeScript
```

## Architecture

Built using Test-Driven Development (TDD) with the red-green-refactor cycle:

### Core Modules

- **config.ts** - Configuration loading and validation
- **search.ts** - Main search orchestrator
- **dedupe.ts** - Result deduplication logic
- **ranker.ts** - Sorting and ranking strategies
- **adapters/** - Platform-specific API adapters
  - `mastodon.ts` - Mastodon/Pixelfed API
  - `threads.ts` - Threads ActivityPub API
  - `base.ts` - Shared adapter logic

### Project Structure

```
fediverse-search/
├── src/
│   ├── index.ts              # CLI entry point
│   ├── search.ts             # Search orchestrator
│   ├── config.ts             # Config loader
│   ├── dedupe.ts             # Deduplication
│   ├── ranker.ts             # Ranking logic
│   ├── types.ts              # TypeScript types
│   └── adapters/
│       ├── base.ts           # Base adapter
│       ├── mastodon.ts       # Mastodon adapter
│       └── threads.ts        # Threads adapter
├── tests/
│   ├── config.test.ts
│   ├── search.test.ts
│   ├── dedupe.test.ts
│   ├── ranker.test.ts
│   └── adapters/
│       ├── mastodon.test.ts
│       └── threads.test.ts
├── config.json               # Server configuration
└── package.json
```

## How It Works

1. **Load configuration** - Reads server list from config file
2. **Parallel queries** - Searches all configured servers simultaneously
3. **Merge results** - Combines responses from all servers
4. **Deduplicate** - Removes duplicate posts (by URL)
5. **Rank** - Sorts results by chosen strategy
6. **Display** - Outputs formatted results

## Testing

This project was built using strict TDD:

- 44 tests covering all core functionality
- Unit tests for each module
- Integration tests for search orchestrator
- Mocked external API calls

## Adding New Servers

To add a new fediverse server, simply edit `config.json`:

```json
{
  "servers": [
    { "name": "your-server.social", "type": "mastodon" }
  ]
}
```

Supported types:
- `mastodon` - Mastodon, Pixelfed, and most ActivityPub servers
- `threads` - Meta's Threads platform

## License

ISC

## Contributing

This project was built with TDD. When adding new features:

1. Write failing tests first (RED)
2. Implement minimal code to pass (GREEN)
3. Refactor for quality (REFACTOR)
4. Repeat

Run tests before submitting changes:
```bash
npm test
```
