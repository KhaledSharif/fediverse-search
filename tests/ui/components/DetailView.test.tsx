import { describe, it, expect } from 'vitest';
import React from 'react';
import { render } from 'ink-testing-library';
import { DetailView } from '../../../src/ui/components/DetailView.js';
import type { SearchResult } from '../../../src/types.js';

describe('DetailView Component', () => {
  const mockResult: SearchResult = {
    id: '123',
    server: 'mastodon.social',
    user: 'alice@mastodon.social',
    content: 'This is a full post content that should be displayed without any truncation whatsoever. It can be quite long and detailed.',
    url: 'https://mastodon.social/@alice/123',
    createdAt: new Date('2024-01-15T14:32:45.000Z'),
    boosts: 15,
    favorites: 42
  };

  it('should render without crashing', () => {
    const { lastFrame } = render(<DetailView result={mockResult} />);

    expect(lastFrame()).toBeDefined();
  });

  it('should display full user handle', () => {
    const { lastFrame } = render(<DetailView result={mockResult} />);

    const output = lastFrame();
    expect(output).toContain('@alice@mastodon.social');
  });

  it('should display full content without truncation', () => {
    const { lastFrame } = render(<DetailView result={mockResult} />);

    const output = lastFrame();
    expect(output).toContain('This is a full post content');
    expect(output).toContain('without any truncation whatsoever');
    expect(output).toContain('quite long and detailed');
  });

  it('should display post metadata', () => {
    const { lastFrame } = render(<DetailView result={mockResult} />);

    const output = lastFrame();
    expect(output).toContain('mastodon.social');
    expect(output).toContain('2024');
  });

  it('should display engagement stats', () => {
    const { lastFrame } = render(<DetailView result={mockResult} />);

    const output = lastFrame();
    expect(output).toContain('15');
    expect(output).toContain('42');
    expect(output).toMatch(/boost/i);
    expect(output).toMatch(/favorite/i);
  });

  it('should display URL', () => {
    const { lastFrame } = render(<DetailView result={mockResult} />);

    const output = lastFrame();
    expect(output).toContain('https://mastodon.social/@alice/123');
  });

  it('should handle result with no engagement stats', () => {
    const resultWithoutStats: SearchResult = {
      ...mockResult,
      boosts: 0,
      favorites: 0
    };

    const { lastFrame } = render(<DetailView result={resultWithoutStats} />);

    expect(lastFrame()).toBeDefined();
  });

  it('should show placeholder when no result is provided', () => {
    const { lastFrame } = render(<DetailView result={null} />);

    const output = lastFrame();
    expect(output).toContain('Select a result');
  });
});
