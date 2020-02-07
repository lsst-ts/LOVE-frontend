import React from 'react';
import { connect } from 'react-redux';
import TimeSeries from './TimeSeries';

export const schema = {
  description: `Interactive timeseries plot display, with multiple telemetry selection available`,
  defaultSize: [78, 44],
  props: {},
};

const TimeSeriesContainer = () => {
  return <TimeSeries />;
};

const mapStateToProps = () => ({});
const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(TimeSeriesContainer);
