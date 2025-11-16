import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render } from 'ink-testing-library';
import { ResultsList } from '../../../src/ui/components/ResultsList.js';
import type { SearchResult } from '../../../src/types.js';

describe('ResultsList Component', () => {
  const mockResults: SearchResult[] = [
    {
      id: '1',
      server: 'mastodon.social',
      user: 'alice@mastodon.social',
      content: 'This is a test post with some content that should be truncated if it is too long',
      url: 'https://mastodon.social/@alice/1',
      createdAt: new Date('2024-01-01'),
      boosts: 5,
      favorites: 10
    },
    {
      id: '2',
      server: 'hachyderm.io',
      user: 'bob@hachyderm.io',
      content: 'Another test post',
      url: 'https://hachyderm.io/@bob/2',
      createdAt: new Date('2024-01-02'),
      boosts: 3,
      favorites: 7
    }
  ];

  it('should render without crashing', () => {
    const mockOnSelect = vi.fn();
    const { lastFrame } = render(
      <ResultsList
        results={mockResults}
        selectedIndex={0}
        onSelect={mockOnSelect}
      />
    );

    expect(lastFrame()).toBeDefined();
  });

  it('should display user handles', () => {
    const mockOnSelect = vi.fn();
    const { lastFrame } = render(
      <ResultsList
        results={mockResults}
        selectedIndex={0}
        onSelect={mockOnSelect}
      />
    );

    const output = lastFrame();
    expect(output).toContain('@alice');
    expect(output).toContain('@bob');
  });

  it('should display truncated content', () => {
    const mockOnSelect = vi.fn();
    const { lastFrame } = render(
      <ResultsList
        results={mockResults}
        selectedIndex={0}
        onSelect={mockOnSelect}
      />
    );

    const output = lastFrame();
    // Should show some content
    expect(output).toContain('test post');
  });

  it('should display result count', () => {
    const mockOnSelect = vi.fn();
    const { lastFrame } = render(
      <ResultsList
        results={mockResults}
        selectedIndex={0}
        onSelect={mockOnSelect}
      />
    );

    const output = lastFrame();
    expect(output).toContain('2');
  });

  it('should handle empty results', () => {
    const mockOnSelect = vi.fn();
    const { lastFrame } = render(
      <ResultsList
        results={[]}
        selectedIndex={0}
        onSelect={mockOnSelect}
      />
    );

    const output = lastFrame();
    expect(output).toContain('No results');
  });
});
