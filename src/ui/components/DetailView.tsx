import React from 'react';
import { Box, Text } from 'ink';
import type { SearchResult } from '../../types.js';

interface DetailViewProps {
  result: SearchResult | null;
}

const formatDate = (date: Date): string => {
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
};

export const DetailView: React.FC<DetailViewProps> = ({ result }) => {
  if (!result) {
    return (
      <Box flexDirection="column" paddingX={2}>
        <Text color="gray">Select a result to view details</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" paddingX={2}>
      <Box marginBottom={1}>
        <Text bold>@{result.user}</Text>
      </Box>

      <Box marginBottom={1}>
        <Text>{result.content}</Text>
      </Box>

      <Box marginBottom={1}>
        <Text color="gray">
          Posted: {formatDate(result.createdAt)}
        </Text>
      </Box>

      <Box marginBottom={1}>
        <Text color="gray">
          Server: {result.server}
        </Text>
      </Box>

      {(result.boosts || result.favorites) ? (
        <Box marginBottom={1}>
          <Text>
            ⬆️  {result.boosts} boosts  ❤️  {result.favorites} favorites
          </Text>
        </Box>
      ) : null}

      <Box>
        <Text color="blue">
          🔗 {result.url}
        </Text>
      </Box>
    </Box>
  );
};
