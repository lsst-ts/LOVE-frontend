import React, { memo } from 'react';
import M1M3DetailedStatus from './M1M3DetailedStatus';


export const schema = {
  description: 'M1M3 Detailed Status component',
  defaultSize: [77, 32],
  props: {
    title: {
      type: 'string',
      description: 'Name displayed in the title bar (if visible)',
      isPrivate: false,
      default: 'M1M3 Detailed Status',
    },
  },
};


const M1M3DetailedStatusContainer = (props) => {
  return <div> Test {JSON.stringify(props)} </div>;
};

export default memo(M1M3DetailedStatusContainer);
