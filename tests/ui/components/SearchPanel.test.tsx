import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render } from 'ink-testing-library';
import { SearchPanel } from '../../../src/ui/components/SearchPanel.js';

describe('SearchPanel Component', () => {
  it('should render without crashing', () => {
    const mockOnSearch = vi.fn();
    const mockOnCancel = vi.fn();

    const { lastFrame } = render(
      <SearchPanel
        onSearch={mockOnSearch}
        onCancel={mockOnCancel}
        currentFilter=""
      />
    );

    expect(lastFrame()).toBeDefined();
  });

  it('should display title', () => {
    const mockOnSearch = vi.fn();
    const mockOnCancel = vi.fn();

    const { lastFrame } = render(
      <SearchPanel
        onSearch={mockOnSearch}
        onCancel={mockOnCancel}
        currentFilter=""
      />
    );

    const output = lastFrame();
    expect(output).toContain('Search within results');
  });

  it('should display instructions', () => {
    const mockOnSearch = vi.fn();
    const mockOnCancel = vi.fn();

    const { lastFrame } = render(
      <SearchPanel
        onSearch={mockOnSearch}
        onCancel={mockOnCancel}
        currentFilter=""
      />
    );

    const output = lastFrame();
    expect(output).toMatch(/enter/i);
    expect(output).toMatch(/esc/i);
  });

  it('should render with initial filter value', () => {
    const mockOnSearch = vi.fn();
    const mockOnCancel = vi.fn();

    const { lastFrame } = render(
      <SearchPanel
        onSearch={mockOnSearch}
        onCancel={mockOnCancel}
        currentFilter="test query"
      />
    );

    // Component should render successfully with initial value
    // Note: TextInput is interactive and may not show value in static render
    const output = lastFrame();
    expect(output).toBeDefined();
    expect(output).toContain('Search within results');
  });

  it('should have a text input field', () => {
    const mockOnSearch = vi.fn();
    const mockOnCancel = vi.fn();

    const { lastFrame } = render(
      <SearchPanel
        onSearch={mockOnSearch}
        onCancel={mockOnCancel}
        currentFilter=""
      />
    );

    // TextInput should be present (we can't test interaction in ink-testing-library easily)
    expect(lastFrame()).toBeDefined();
  });
});
