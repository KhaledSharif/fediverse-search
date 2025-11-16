import React, { useState } from 'react';
import { Box, Text } from 'ink';
import { TextInput } from '@inkjs/ui';

interface SearchPanelProps {
  onSearch: (query: string) => void;
  onCancel: () => void;
  currentFilter: string;
}

export const SearchPanel: React.FC<SearchPanelProps> = ({
  onSearch,
  onCancel,
  currentFilter
}) => {
  const [searchValue, setSearchValue] = useState(currentFilter);

  const handleSubmit = () => {
    onSearch(searchValue);
  };

  return (
    <Box flexDirection="column" padding={2} borderStyle="round" borderColor="cyan">
      <Box marginBottom={1}>
        <Text bold color="cyan">
          🔍 Search within results
        </Text>
      </Box>

      <Box marginBottom={1}>
        <Text>
          Enter search term to filter results by content or username:
        </Text>
      </Box>

      <Box marginBottom={1}>
        <TextInput
          defaultValue={searchValue}
          onChange={setSearchValue}
          onSubmit={handleSubmit}
          placeholder="Type to search..."
        />
      </Box>

      <Box>
        <Text color="gray">
          Press <Text color="green">Enter</Text> to search |{' '}
          <Text color="red">Esc</Text> to cancel
        </Text>
      </Box>
    </Box>
  );
};
