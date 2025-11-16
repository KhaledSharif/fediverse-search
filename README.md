# Fediverse Search

An interactive terminal browser for searching across multiple fediverse servers (Mastodon, Threads, and other ActivityPub-compatible platforms). Built with React + Ink for a rich terminal UI experience.

## Features

- **Interactive Terminal UI**: Master-detail split screen with keyboard navigation
- **Multi-server search**: Query multiple fediverse instances in parallel
- **Protocol support**: Mastodon, Pixelfed, and Threads (via ActivityPub)
- **Live ranking**: Switch between date, engagement, and relevance sorting on-the-fly
- **Dynamic filtering**: Filter results by server or search within results
- **Open in browser**: Press 'o' or Enter to open posts in your default browser
- **Deduplication**: Automatically removes duplicate posts across servers
- **Configurable**: Easily add or remove servers via config file
- **Well-tested**: Built with TDD (70 passing tests)

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

### Quick Start

```bash
npm run dev -- "your search query"
```

This launches an interactive terminal browser where you can:
- Navigate results with arrow keys
- View full post details in real-time
- Open posts in your browser
- Filter and re-rank results dynamically

### Interactive UI Layout

```
┌──────────────────────────────────────────────────────────────┐
│ Search: "cats" | 42 results | Rank: date                     │
├────────────────────┬─────────────────────────────────────────┤
│ Results (1-10/42)  │ @alice@mastodon.social                  │
│                    │                                         │
│ > @alice: Check... │ Full post content appears here          │
│   @bob: Amazing... │ without truncation.                     │
│   @carol: Look...  │                                         │
│   @dave: I love... │ Posted: 2025-11-15 14:32:45             │
│   @eve: Best...    │ Server: mastodon.social                 │
│   @frank: Wow...   │                                         │
│   @grace: Here...  │ ⬆️ 5 boosts  ❤️ 10 favorites            │
│   @henry: Another..│                                         │
│   @iris: Testing...│ 🔗 https://mastodon.social/@alice/123   │
│   @jane: Final...  │                                         │
├────────────────────┴─────────────────────────────────────────┤
│ ↑/↓ Navigate | o Open | / Search | f Filter | r Rank | q Quit │
└──────────────────────────────────────────────────────────────┘
```

### Keyboard Shortcuts

- **↑/↓** or **j/k** - Navigate through results list
- **o** or **Enter** - Open selected post in default browser
- **/** - Search within results (filter by keyword)
- **f** - Filter results by server
- **r** - Cycle through ranking strategies (date → engagement → relevance)
- **q** or **Esc** - Quit the browser

### Command-Line Options

- `--config <path>` - Path to config file (default: `config.json`)
- `--help`, `-h` - Show help message

### Examples

Basic search:
```bash
npm run dev -- "climate change"
```

Search with custom config:
```bash
npm run dev -- "open source" --config custom-servers.json
```

Production build:
```bash
npm run build
npm start "photography"
```

### Quick Script

For convenience, use the provided `run.sh` script:

```bash
./run.sh "your search query"
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

Built using Test-Driven Development (TDD) with the red-green-refactor cycle, using React + Ink for the interactive terminal UI.

### Core Modules

- **config.ts** - Configuration loading and validation
- **search.ts** - Main search orchestrator
- **dedupe.ts** - Result deduplication logic
- **ranker.ts** - Sorting and ranking strategies
- **adapters/** - Platform-specific API adapters
  - `mastodon.ts` - Mastodon/Pixelfed API
  - `threads.ts` - Threads ActivityPub API
  - `base.ts` - Shared adapter logic
- **ui/** - Interactive terminal UI components (React + Ink)
  - `App.tsx` - Main application with state management
  - `components/` - Reusable UI components
  - `hooks/` - Custom React hooks

### Project Structure

```
fediverse-search/
├── src/
│   ├── index.ts              # CLI entry point & Ink renderer
│   ├── search.ts             # Search orchestrator
│   ├── config.ts             # Config loader
│   ├── dedupe.ts             # Deduplication
│   ├── ranker.ts             # Ranking logic
│   ├── types.ts              # TypeScript types
│   ├── adapters/
│   │   ├── base.ts           # Base adapter
│   │   ├── mastodon.ts       # Mastodon adapter
│   │   └── threads.ts        # Threads adapter
│   └── ui/
│       ├── App.tsx           # Main Ink application
│       ├── components/
│       │   ├── MasterDetailLayout.tsx  # Split screen layout
│       │   ├── ResultsList.tsx         # Scrollable results
│       │   ├── DetailView.tsx          # Post details
│       │   └── StatusBar.tsx           # Keyboard shortcuts
│       └── hooks/
│           └── useUrlOpener.ts         # Open URLs in browser
├── tests/
│   ├── config.test.ts
│   ├── search.test.ts
│   ├── dedupe.test.ts
│   ├── ranker.test.ts
│   ├── adapters/
│   │   ├── mastodon.test.ts
│   │   └── threads.test.ts
│   └── ui/
│       ├── App.test.tsx
│       ├── components/
│       │   ├── MasterDetailLayout.test.tsx
│       │   ├── ResultsList.test.tsx
│       │   ├── DetailView.test.tsx
│       │   └── StatusBar.test.tsx
│       └── hooks/
│           └── useUrlOpener.test.ts
├── config.json               # Server configuration
└── package.json
```

## How It Works

1. **Load configuration** - Reads server list from config file
2. **Parallel queries** - Searches all configured servers simultaneously
3. **Merge results** - Combines responses from all servers
4. **Deduplicate** - Removes duplicate posts (by URL)
5. **Initial rank** - Sorts results by date (default)
6. **Launch interactive UI** - Renders React-based terminal browser using Ink
7. **Real-time interactions** - Handle keyboard input for navigation, filtering, ranking, and URL opening

## Interactive Features

The Ink-powered UI provides these real-time interactions:

- **Master-Detail Layout**: Split screen shows list (left) and details (right)
- **Live Ranking**: Press 'r' to cycle through date/engagement/relevance without re-querying
- **Dynamic Filtering**: Press 'f' to filter by server or '/' to search within content
- **Instant Navigation**: Arrow keys update the detail view immediately
- **Browser Integration**: Press 'o' to open the selected post URL in your default browser

## Testing

This project was built using strict TDD:

- **70 passing tests** covering all functionality
- Unit tests for each module (search, config, dedupe, ranker)
- Component tests for all UI components (App, ResultsList, DetailView, etc.)
- Integration tests for search orchestrator
- Hook tests for URL opening functionality
- Mocked external API calls for reliability

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
