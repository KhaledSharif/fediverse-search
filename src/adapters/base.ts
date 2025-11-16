import fetch from 'node-fetch';

export abstract class BaseAdapter {
  protected async fetchJson<T>(url: string, authToken?: string): Promise<T | null> {
    try {
      const headers: Record<string, string> = {
        'Accept': 'application/json'
      };

      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      const response = await fetch(url, { headers });

      if (!response.ok) {
        console.error(`API error: HTTP ${response.status} for ${url}`);
        return null;
      }

      return await response.json() as T;
    } catch (error) {
      console.error(`Failed to fetch ${url}:`, error instanceof Error ? error.message : 'Unknown error');
      return null;
    }
  }

  protected stripHtml(html: string): string {
    return html.replace(/<[^>]+>/g, '');
  }
}
