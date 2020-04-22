import React from 'react';
import { connect } from 'react-redux';
import HealthStatusSummary from './HealthStatusSummary';

export const schema = {
  description: `Table containing the health status for all telemetries, as defined by 
                custom health status functions defined in the component`,
  defaultSize: [78, 44],
  props: {
    titleBar: {
      type: 'boolean',
      description: 'Whether to display the title bar',
      isPrivate: false,
      default: false,
    },
    title: {
      type: 'string',
      description: 'Name diplayed in the title bar (if visible)',
      isPrivate: false,
      default: 'Health status summary',
    },
    hasRawMode: {
      type: 'boolean',
      description: 'Whether the component has a raw mode version',
      isPrivate: true,
      default: false,
    },
  },
};

const HealthStatusSummaryContainer = () => {
  return <HealthStatusSummary />;
};

const mapStateToProps = () => ({});
const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(HealthStatusSummaryContainer);
