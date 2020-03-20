import React from 'react';
import CSCSummary from './CSCSummary';
import { CSCSummaryHierarchy } from '../../Config';

export const schema = {
  description: 'Summary of all CSCs, including heartbeats, summary state, logs and error codes',
  defaultSize: [57, 35],
  props: {
    titleBar: {
      type: 'boolean',
      description: 'Whether to display the title bar',
      isPrivate: false,
      default: true,
    },
    title: {
      type: 'string',
      description: 'Name diplayed in the title bar (if visible)',
      isPrivate: false,
      default: 'CSC summary',
    },
    margin: {
      type: 'boolean',
      description: 'Whether to display component with a margin',
      isPrivate: false,
      default: true,
    },
    hierarchy: {
      type: 'object',
      description: 'Hierarchy on which to display CSC summaries',
      isPrivate: false,
      default: CSCSummaryHierarchy,
    },
  },
};

const CSCSummaryContainer = ({ hierarchy = CSCSummaryHierarchy, expandHeight }) => {
  return <CSCSummary hierarchy={hierarchy} expandHeight={expandHeight} />;
};

export default CSCSummaryContainer;
