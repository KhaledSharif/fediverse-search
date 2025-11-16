import open from 'open';

export const openUrl = async (url: string): Promise<void> => {
  if (!url || url.trim() === '') {
    return;
  }

  try {
    await open(url);
  } catch (error) {
    // Silently fail - user will see no action if opening fails
    console.error('Failed to open URL:', error);
  }
};
