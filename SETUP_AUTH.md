# Authentication Setup Guide

## Quick Start

You mentioned you have:
- Client Key
- Client Secret
- Access Token

**You only need the Access Token!** The client key and secret are used for OAuth flows, but we're using direct token authentication.

## Step-by-Step Setup

### 1. Create your .env file

```bash
cp .env.example .env
```

### 2. Add your Mastodon credentials

Edit `.env` and add:

```bash
# For mastodon.social
MASTODON_SOCIAL_ACCESS_TOKEN=your_access_token_here
```

**Naming Convention:**
- Server: `mastodon.social` → Env var: `MASTODON_SOCIAL_ACCESS_TOKEN`
- Server: `hachyderm.io` → Env var: `HACHYDERM_IO_ACCESS_TOKEN`
- Server: `mastodon.art` → Env var: `MASTODON_ART_ACCESS_TOKEN`

**Rule:** Convert domain to UPPERCASE and replace dots with underscores, then add `_ACCESS_TOKEN`

### 3. Test it works

```bash
./run.sh cat --limit 5
```

If you see "Skipping" messages, the token isn't found. If you see results, it's working!

## What Happens

- ✅ **With token**: Server is queried and returns search results
- ⚠️ **Without token**: Server is automatically skipped (no error)
- 🔒 **Invalid token**: API returns error (handled gracefully)

## Example .env

```bash
# Mastodon.social (has auth - will be queried)
MASTODON_SOCIAL_ACCESS_TOKEN=abc123xyz789...

# Hachyderm.io (no auth - will be skipped)
# HACHYDERM_IO_ACCESS_TOKEN=

# Pixelfed.social (no auth - will be skipped)
# PIXELFED_SOCIAL_ACCESS_TOKEN=
```

## Testing Your Setup

```bash
# Build and search
./run.sh "your search term" --limit 3

# You should see:
# - "Searching for: your search term"
# - "Querying N servers..."
# - "Skipping X: No authentication credentials found" (for servers without tokens)
# - Search results from authenticated servers
```

## Troubleshooting

**No results found?**
- Check your token is correct (copy-paste carefully)
- Verify the env var name matches your server (uppercase, underscores)
- Try a more common search term (e.g., "cat", "hello", "test")

**"Skipping mastodon.social"?**
- Token not found in .env
- Check the variable name: `MASTODON_SOCIAL_ACCESS_TOKEN`
- No quotes needed around the token value

**API errors?**
- 401/403: Token invalid or expired
- 500: Server-side error (not your fault)
- Timeout: Server is slow or down
