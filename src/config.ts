import { readFileSync, existsSync } from 'fs';
import { Config, ServerConfig, ServerType } from './types.js';

const VALID_SERVER_TYPES: ServerType[] = ['mastodon', 'threads'];

const DEFAULT_CONFIG: Config = {
  servers: [
    { name: 'mastodon.social', type: 'mastodon' },
    { name: 'hachyderm.io', type: 'mastodon' },
    { name: 'mastodon.art', type: 'mastodon' },
    { name: 'pixelfed.social', type: 'mastodon' }
  ]
};

export function loadConfig(configPath: string = 'config.json'): Config {
  if (!existsSync(configPath)) {
    return DEFAULT_CONFIG;
  }

  try {
    const fileContent = readFileSync(configPath, 'utf-8');
    const parsed = JSON.parse(fileContent);

    validateConfig(parsed);

    return parsed as Config;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`Invalid JSON in config file: ${error.message}`);
    }
    throw error;
  }
}

function validateConfig(config: any): void {
  if (!config.servers || !Array.isArray(config.servers)) {
    throw new Error('Config must contain a servers array');
  }

  config.servers.forEach((server: any, index: number) => {
    validateServer(server, index);
  });
}

function validateServer(server: any, index: number): void {
  if (!server.name || typeof server.name !== 'string') {
    throw new Error(`Server at index ${index} must have a name field`);
  }

  if (!server.type || typeof server.type !== 'string') {
    throw new Error(`Server at index ${index} must have a type field`);
  }

  if (!VALID_SERVER_TYPES.includes(server.type)) {
    throw new Error(
      `Invalid server type "${server.type}" at index ${index}. Must be one of: ${VALID_SERVER_TYPES.join(', ')}`
    );
  }
}

export { Config };
