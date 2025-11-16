import React from 'react';
import { Box, Text } from 'ink';

interface StatusBarProps {
  query?: string;
  totalResults?: number;
  activeFilters?: number;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  query,
  totalResults,
  activeFilters
}) => {
  return (
    <Box flexDirection="column" borderStyle="single" borderTop paddingTop={1}>
      {(query || totalResults !== undefined || activeFilters !== undefined) && (
        <Box marginBottom={1}>
          {query && <Text color="gray">Query: "{query}" </Text>}
          {totalResults !== undefined && <Text color="gray">| {totalResults} results </Text>}
          {activeFilters !== undefined && activeFilters > 0 && (
            <Text color="yellow">| {activeFilters} filters active </Text>
          )}
        </Box>
      )}
      <Box>
        <Text>
          <Text color="cyan">↑/↓</Text> Navigate |
          <Text color="cyan"> o</Text> Open |
          <Text color="cyan"> /</Text> Search |
          <Text color="cyan"> f</Text> Filter |
          <Text color="cyan"> r</Text> Rank |
          <Text color="cyan"> q</Text> Quit
        </Text>
      </Box>
    </Box>
  );
};
