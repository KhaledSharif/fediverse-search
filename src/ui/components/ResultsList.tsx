import React from 'react';
import { Box, Text } from 'ink';
import { Select } from '@inkjs/ui';
import type { SearchResult } from '../../types.js';

interface ResultsListProps {
  results: SearchResult[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}

const truncateContent = (content: string, maxLength: number = 60): string => {
  if (content.length <= maxLength) return content;
  return content.slice(0, maxLength) + '...';
};

export const ResultsList: React.FC<ResultsListProps> = ({
  results,
  selectedIndex,
  onSelect
}) => {
  if (results.length === 0) {
    return (
      <Box flexDirection="column">
        <Text>No results found</Text>
      </Box>
    );
  }

  // Convert results to Select options
  const options = results.map((result, index) => ({
    label: `@${result.user.split('@')[0]}: ${truncateContent(result.content)}`,
    value: String(index)
  }));

  return (
    <Box flexDirection="column">
      <Box marginBottom={1}>
        <Text>Results (1-{Math.min(10, results.length)}/{results.length})</Text>
      </Box>
      <Select
        options={options}
        onChange={(value: string) => onSelect(parseInt(value, 10))}
      />
    </Box>
  );
};
