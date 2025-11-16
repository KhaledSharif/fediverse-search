import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { loadConfig, Config } from '../src/config.js';
import { writeFileSync, unlinkSync, existsSync } from 'fs';
import { join } from 'path';

const TEST_CONFIG_PATH = join(process.cwd(), 'test-config.json');

describe('Config Loader', () => {
  afterEach(() => {
    if (existsSync(TEST_CONFIG_PATH)) {
      unlinkSync(TEST_CONFIG_PATH);
    }
  });

  describe('loadConfig', () => {
    it('should load valid config from JSON file', () => {
      const validConfig = {
        servers: [
          { name: 'mastodon.social', type: 'mastodon' },
          { name: 'hachyderm.io', type: 'mastodon' }
        ]
      };

      writeFileSync(TEST_CONFIG_PATH, JSON.stringify(validConfig));

      const config = loadConfig(TEST_CONFIG_PATH);

      expect(config).toBeDefined();
      expect(config.servers).toHaveLength(2);
      expect(config.servers[0].name).toBe('mastodon.social');
      expect(config.servers[0].type).toBe('mastodon');
    });

    it('should return default config when file does not exist', () => {
      const config = loadConfig('nonexistent-config.json');

      expect(config).toBeDefined();
      expect(config.servers).toBeDefined();
      expect(config.servers.length).toBeGreaterThan(0);
    });

    it('should throw error for invalid JSON', () => {
      writeFileSync(TEST_CONFIG_PATH, '{ invalid json }');

      expect(() => loadConfig(TEST_CONFIG_PATH)).toThrow();
    });

    it('should throw error if servers array is missing', () => {
      writeFileSync(TEST_CONFIG_PATH, JSON.stringify({ foo: 'bar' }));

      expect(() => loadConfig(TEST_CONFIG_PATH)).toThrow('servers array');
    });

    it('should throw error if server entry is missing required fields', () => {
      const invalidConfig = {
        servers: [
          { name: 'mastodon.social' } // missing type
        ]
      };

      writeFileSync(TEST_CONFIG_PATH, JSON.stringify(invalidConfig));

      expect(() => loadConfig(TEST_CONFIG_PATH)).toThrow();
    });

    it('should accept both mastodon and threads server types', () => {
      const mixedConfig = {
        servers: [
          { name: 'mastodon.social', type: 'mastodon' },
          { name: 'threads.net', type: 'threads' }
        ]
      };

      writeFileSync(TEST_CONFIG_PATH, JSON.stringify(mixedConfig));

      const config = loadConfig(TEST_CONFIG_PATH);

      expect(config.servers).toHaveLength(2);
      expect(config.servers[1].type).toBe('threads');
    });

    it('should reject invalid server types', () => {
      const invalidConfig = {
        servers: [
          { name: 'example.com', type: 'invalid' }
        ]
      };

      writeFileSync(TEST_CONFIG_PATH, JSON.stringify(invalidConfig));

      expect(() => loadConfig(TEST_CONFIG_PATH)).toThrow('server type');
    });
  });
});
