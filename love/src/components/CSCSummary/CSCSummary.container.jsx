import React from 'react';
import CSCSummary from './CSCSummary';
import { CSCSummaryHierarchy } from '../../Config';

export const schema = {
  description: 'Summary of all CSCs, including heartbeats, summary state, logs and error codes',
  defaultSize: [57, 35],
  props: {},
};

const CSCSummaryContainer = ({ expandHeight }) => {
  return (
    <CSCSummary
      hierarchy={CSCSummaryHierarchy}
      expandHeight={expandHeight}
    />
  );
};

export default CSCSummaryContainer;
