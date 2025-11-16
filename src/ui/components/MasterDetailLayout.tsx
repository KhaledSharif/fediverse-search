import React from 'react';
import { Box } from 'ink';

interface MasterDetailLayoutProps {
  master: React.ReactNode;
  detail: React.ReactNode;
}

export const MasterDetailLayout: React.FC<MasterDetailLayoutProps> = ({
  master,
  detail
}) => {
  return (
    <Box flexDirection="row" width="100%">
      {/* Master (left side) - 50% width */}
      <Box width="50%" flexDirection="column" paddingRight={1} borderStyle="single" borderRight>
        {master}
      </Box>

      {/* Detail (right side) - 50% width */}
      <Box width="50%" flexDirection="column" paddingLeft={1}>
        {detail}
      </Box>
    </Box>
  );
};
