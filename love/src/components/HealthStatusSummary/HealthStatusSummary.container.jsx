import React from 'react';
import { connect } from 'react-redux';
import HealthStatusSummary from './HealthStatusSummary';

export const schema = {
  description: `Table containing the health status for all telemetries, as defined by 
                custom health status functions defined in the component`,
  defaultSize: [78, 44],
  props: {},
};

const HealthStatusSummaryContainer = () => {
  return <HealthStatusSummary />;
};

const mapStateToProps = () => ({});
const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(HealthStatusSummaryContainer);
