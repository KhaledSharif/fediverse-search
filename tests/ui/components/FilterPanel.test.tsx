import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render } from 'ink-testing-library';
import { FilterPanel } from '../../../src/ui/components/FilterPanel.js';

describe('FilterPanel Component', () => {
  const mockServers = ['mastodon.social', 'hachyderm.io', 'mastodon.art'];

  it('should render without crashing', () => {
    const mockOnApply = vi.fn();
    const mockOnCancel = vi.fn();

    const { lastFrame } = render(
      <FilterPanel
        availableServers={mockServers}
        selectedServers={new Set()}
        onApply={mockOnApply}
        onCancel={mockOnCancel}
      />
    );

    expect(lastFrame()).toBeDefined();
  });

  it('should display title', () => {
    const mockOnApply = vi.fn();
    const mockOnCancel = vi.fn();

    const { lastFrame } = render(
      <FilterPanel
        availableServers={mockServers}
        selectedServers={new Set()}
        onApply={mockOnApply}
        onCancel={mockOnCancel}
      />
    );

    const output = lastFrame();
    expect(output).toContain('Filter by server');
  });

  it('should display all available servers', () => {
    const mockOnApply = vi.fn();
    const mockOnCancel = vi.fn();

    const { lastFrame } = render(
      <FilterPanel
        availableServers={mockServers}
        selectedServers={new Set()}
        onApply={mockOnApply}
        onCancel={mockOnCancel}
      />
    );

    const output = lastFrame();
    expect(output).toContain('mastodon.social');
    expect(output).toContain('hachyderm.io');
    expect(output).toContain('mastodon.art');
  });

  it('should display instructions', () => {
    const mockOnApply = vi.fn();
    const mockOnCancel = vi.fn();

    const { lastFrame } = render(
      <FilterPanel
        availableServers={mockServers}
        selectedServers={new Set()}
        onApply={mockOnApply}
        onCancel={mockOnCancel}
      />
    );

    const output = lastFrame();
    expect(output).toMatch(/space/i);
    expect(output).toMatch(/enter/i);
    expect(output).toMatch(/esc/i);
  });

  it('should indicate selected servers with checkmarks', () => {
    const mockOnApply = vi.fn();
    const mockOnCancel = vi.fn();
    const selectedServers = new Set(['mastodon.social', 'mastodon.art']);

    const { lastFrame } = render(
      <FilterPanel
        availableServers={mockServers}
        selectedServers={selectedServers}
        onApply={mockOnApply}
        onCancel={mockOnCancel}
      />
    );

    const output = lastFrame();
    // Should show some indication of selection
    expect(output).toMatch(/[✓✔☑]/);
  });

  it('should show count of selected servers when some are selected', () => {
    const mockOnApply = vi.fn();
    const mockOnCancel = vi.fn();
    const selectedServers = new Set(['mastodon.social', 'mastodon.art']);

    const { lastFrame } = render(
      <FilterPanel
        availableServers={mockServers}
        selectedServers={selectedServers}
        onApply={mockOnApply}
        onCancel={mockOnCancel}
      />
    );

    const output = lastFrame();
    expect(output).toContain('2');
  });
});
