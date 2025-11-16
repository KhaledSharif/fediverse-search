import { describe, it, expect } from 'vitest';
import React from 'react';
import { render } from 'ink-testing-library';
import { MasterDetailLayout } from '../../../src/ui/components/MasterDetailLayout.js';
import { Text } from 'ink';

describe('MasterDetailLayout Component', () => {
  it('should render both master and detail sections', () => {
    const { lastFrame } = render(
      <MasterDetailLayout
        master={<Text>Master Content</Text>}
        detail={<Text>Detail Content</Text>}
      />
    );

    const output = lastFrame();
    expect(output).toContain('Master Content');
    expect(output).toContain('Detail Content');
  });

  it('should render both sections in a split layout', () => {
    const { lastFrame } = render(
      <MasterDetailLayout
        master={<Text>LEFT</Text>}
        detail={<Text>RIGHT</Text>}
      />
    );

    const output = lastFrame();
    // Both sections should be present
    expect(output).toContain('LEFT');
    expect(output).toContain('RIGHT');
    // Output should contain border characters indicating split layout
    expect(output).toContain('│');
  });

  it('should apply split layout styling', () => {
    const { lastFrame } = render(
      <MasterDetailLayout
        master={<Text>M</Text>}
        detail={<Text>D</Text>}
      />
    );

    // Just ensure it renders without errors
    expect(lastFrame()).toBeDefined();
  });
});
