import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the open package
const mockOpen = vi.hoisted(() => vi.fn());
vi.mock('open', () => ({
  default: mockOpen
}));

import { openUrl } from '../../../src/ui/hooks/useUrlOpener.js';

describe('useUrlOpener', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call open with the provided URL', async () => {
    const testUrl = 'https://mastodon.social/@alice/123';

    await openUrl(testUrl);

    expect(mockOpen).toHaveBeenCalledTimes(1);
    expect(mockOpen).toHaveBeenCalledWith(testUrl);
  });

  it('should handle errors gracefully', async () => {
    mockOpen.mockRejectedValueOnce(new Error('Failed to open'));

    // Should not throw
    await expect(openUrl('https://example.com')).resolves.not.toThrow();
  });

  it('should not call open with empty URL', async () => {
    await openUrl('');

    expect(mockOpen).not.toHaveBeenCalled();
  });
});
