import React, { useState, useMemo } from 'react';
import { Box, Text, useInput, useApp } from 'ink';
import type { SearchResult, RankingStrategy } from '../types.js';
import { MasterDetailLayout } from './components/MasterDetailLayout.js';
import { ResultsList } from './components/ResultsList.js';
import { DetailView } from './components/DetailView.js';
import { StatusBar } from './components/StatusBar.js';
import { SearchPanel } from './components/SearchPanel.js';
import { FilterPanel } from './components/FilterPanel.js';
import { rankResults } from '../ranker.js';
import { openUrl } from './hooks/useUrlOpener.js';

interface AppProps {
  query: string;
  results: SearchResult[];
}

export const App: React.FC<AppProps> = ({ query, results }) => {
  const { exit } = useApp();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [ranking, setRanking] = useState<RankingStrategy>('date');
  const [searchFilter, setSearchFilter] = useState('');
  const [serverFilter, setServerFilter] = useState<Set<string>>(new Set());
  const [showingFilterPanel, setShowingFilterPanel] = useState(false);
  const [showingSearchPanel, setShowingSearchPanel] = useState(false);

  // Get unique servers for filtering
  const availableServers = useMemo(() => {
    return Array.from(new Set(results.map(r => r.server)));
  }, [results]);

  // Apply filters and ranking
  const filteredAndRankedResults = useMemo(() => {
    let filtered = results;

    // Apply search filter
    if (searchFilter) {
      const lowerFilter = searchFilter.toLowerCase();
      filtered = filtered.filter(r =>
        r.content.toLowerCase().includes(lowerFilter) ||
        r.user.toLowerCase().includes(lowerFilter)
      );
    }

    // Apply server filter
    if (serverFilter.size > 0) {
      filtered = filtered.filter(r => serverFilter.has(r.server));
    }

    // Apply ranking
    return rankResults(filtered, ranking, query);
  }, [results, searchFilter, serverFilter, ranking, query]);

  // Get selected result
  const selectedResult = filteredAndRankedResults[selectedIndex] || null;

  // Keyboard shortcuts
  useInput((input, key) => {
    // Don't process shortcuts if in a modal
    if (showingFilterPanel || showingSearchPanel) {
      if (key.escape || input === 'q') {
        setShowingFilterPanel(false);
        setShowingSearchPanel(false);
      }
      return;
    }

    // Open URL
    if (input === 'o' || key.return) {
      if (selectedResult?.url) {
        openUrl(selectedResult.url);
      }
    }

    // Toggle search panel
    if (input === '/') {
      setShowingSearchPanel(true);
    }

    // Toggle filter panel
    if (input === 'f') {
      setShowingFilterPanel(true);
    }

    // Cycle ranking
    if (input === 'r') {
      setRanking(current => {
        if (current === 'date') return 'engagement';
        if (current === 'engagement') return 'relevance';
        return 'date';
      });
    }

    // Quit
    if (input === 'q' || (key.escape && !showingFilterPanel && !showingSearchPanel)) {
      exit();
    }
  });

  // Handle modals
  if (showingSearchPanel) {
    return (
      <SearchPanel
        currentFilter={searchFilter}
        onSearch={(query) => {
          setSearchFilter(query);
          setShowingSearchPanel(false);
        }}
        onCancel={() => setShowingSearchPanel(false)}
      />
    );
  }

  if (showingFilterPanel) {
    return (
      <FilterPanel
        availableServers={availableServers}
        selectedServers={serverFilter}
        onApply={(selected) => {
          setServerFilter(selected);
          setShowingFilterPanel(false);
        }}
        onCancel={() => setShowingFilterPanel(false)}
      />
    );
  }

  return (
    <Box flexDirection="column" height="100%">
      {/* Header */}
      <Box borderStyle="single" borderBottom paddingBottom={1}>
        <Text>
          Search: "<Text color="cyan">{query}</Text>" |
          {' '}{filteredAndRankedResults.length} results |
          Rank: <Text color="yellow">{ranking}</Text>
          {searchFilter && <Text color="green"> | Filter: "{searchFilter}"</Text>}
          {serverFilter.size > 0 && <Text color="green"> | Servers: {serverFilter.size}</Text>}
        </Text>
      </Box>

      {/* Master-Detail Layout */}
      <Box flexGrow={1}>
        <MasterDetailLayout
          master={
            <ResultsList
              results={filteredAndRankedResults}
              selectedIndex={selectedIndex}
              onSelect={setSelectedIndex}
            />
          }
          detail={<DetailView result={selectedResult} />}
        />
      </Box>

      {/* Status Bar */}
      <StatusBar
        query={query}
        totalResults={filteredAndRankedResults.length}
        activeFilters={
          (searchFilter ? 1 : 0) + (serverFilter.size > 0 ? 1 : 0)
        }
      />
    </Box>
  );
};
