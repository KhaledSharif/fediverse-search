import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';

interface FilterPanelProps {
  availableServers: string[];
  selectedServers: Set<string>;
  onApply: (selected: Set<string>) => void;
  onCancel: () => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  availableServers,
  selectedServers,
  onApply,
  onCancel
}) => {
  const [selected, setSelected] = useState(new Set(selectedServers));
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  useInput((input, key) => {
    // Navigate up/down
    if (key.upArrow || input === 'k') {
      setHighlightedIndex(prev => Math.max(0, prev - 1));
    } else if (key.downArrow || input === 'j') {
      setHighlightedIndex(prev => Math.min(availableServers.length - 1, prev + 1));
    }
    // Toggle selection with space
    else if (input === ' ') {
      const server = availableServers[highlightedIndex];
      setSelected(prev => {
        const newSet = new Set(prev);
        if (newSet.has(server)) {
          newSet.delete(server);
        } else {
          newSet.add(server);
        }
        return newSet;
      });
    }
    // Apply filter with Enter
    else if (key.return) {
      onApply(selected);
    }
    // Cancel with Esc
    else if (key.escape || input === 'q') {
      onCancel();
    }
  });

  return (
    <Box flexDirection="column" padding={2} borderStyle="round" borderColor="yellow">
      <Box marginBottom={1}>
        <Text bold color="yellow">
          🔍 Filter by server
        </Text>
      </Box>

      <Box marginBottom={1}>
        <Text>
          Select servers to include in results ({selected.size} selected):
        </Text>
      </Box>

      <Box flexDirection="column" marginBottom={1}>
        {availableServers.map((server, index) => {
          const isSelected = selected.has(server);
          const isHighlighted = index === highlightedIndex;

          return (
            <Box key={server}>
              <Text
                color={isHighlighted ? 'cyan' : undefined}
                bold={isHighlighted}
              >
                {isHighlighted ? '→ ' : '  '}
                {isSelected ? '✓ ' : '○ '}
                {server}
              </Text>
            </Box>
          );
        })}
      </Box>

      <Box>
        <Text color="gray">
          <Text color="cyan">Space</Text> to toggle |{' '}
          <Text color="green">Enter</Text> to apply |{' '}
          <Text color="red">Esc</Text> to cancel
        </Text>
      </Box>
    </Box>
  );
};
