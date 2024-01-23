import React, { memo } from 'react';
import BumpTests from './BumpTests';

export const schema = {
  description: 'Table to retrieve M1M3 Bump Tests reports',
  defaultSize: [61, 32],
  props: {
    title: {
      type: 'string',
      description: 'Name diplayed in the title bar (if visible)',
      isPrivate: false,
      default: 'M1M3 Bump Tests Reports',
    },
  },
};

const BumpTestsContainer = (props) => {
  return <BumpTests {...props} />;
};

export default memo(BumpTestsContainer);
