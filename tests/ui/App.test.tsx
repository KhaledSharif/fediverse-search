import { describe, it, expect } from 'vitest';
import React from 'react';
import { render } from 'ink-testing-library';
import { App } from '../../src/ui/App.js';
import type { SearchResult } from '../../src/types.js';

describe('App Component', () => {
  it('should render without crashing', () => {
    const mockResults: SearchResult[] = [];
    const { lastFrame } = render(<App query="test" results={mockResults} />);

    expect(lastFrame()).toBeDefined();
  });

  it('should display the search query', () => {
    const mockResults: SearchResult[] = [];
    const { lastFrame } = render(<App query="cats" results={mockResults} />);

    expect(lastFrame()).toContain('cats');
  });

  it('should display results count', () => {
    const mockResults: SearchResult[] = [
      {
        id: '1',
        server: 'mastodon.social',
        user: 'alice',
        content: 'Test content',
        url: 'https://mastodon.social/@alice/1',
        createdAt: new Date('2024-01-01'),
        boosts: 5,
        favorites: 10
      },
      {
        id: '2',
        server: 'mastodon.social',
        user: 'bob',
        content: 'Another test',
        url: 'https://mastodon.social/@bob/2',
        createdAt: new Date('2024-01-02'),
        boosts: 3,
        favorites: 7
      }
    ];
    const { lastFrame } = render(<App query="test" results={mockResults} />);

    expect(lastFrame()).toContain('2 results');
  });
});
