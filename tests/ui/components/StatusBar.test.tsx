import { describe, it, expect } from 'vitest';
import React from 'react';
import { render } from 'ink-testing-library';
import { StatusBar } from '../../../src/ui/components/StatusBar.js';

describe('StatusBar Component', () => {
  it('should render without crashing', () => {
    const { lastFrame } = render(<StatusBar />);

    expect(lastFrame()).toBeDefined();
  });

  it('should display keyboard shortcuts', () => {
    const { lastFrame } = render(<StatusBar />);

    const output = lastFrame();
    expect(output).toMatch(/navigate/i);
    expect(output).toMatch(/open/i);
    expect(output).toMatch(/search/i);
    expect(output).toMatch(/filter/i);
    expect(output).toMatch(/rank/i);
    expect(output).toMatch(/quit/i);
  });

  it('should display shortcut keys', () => {
    const { lastFrame } = render(<StatusBar />);

    const output = lastFrame();
    expect(output).toContain('o');
    expect(output).toContain('/');
    expect(output).toContain('f');
    expect(output).toContain('r');
    expect(output).toContain('q');
  });

  it('should display optional stats when provided', () => {
    const { lastFrame } = render(
      <StatusBar query="cats" totalResults={42} activeFilters={2} />
    );

    const output = lastFrame();
    expect(output).toContain('cats');
    expect(output).toContain('42');
    expect(output).toContain('2');
  });
});
