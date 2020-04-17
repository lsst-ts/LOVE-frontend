import React from 'react';
import { connect } from 'react-redux';
import TimeSeries from './TimeSeries';

export const schema = {
  description: `Interactive timeseries plot display, with multiple telemetry selection available`,
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
      default: 'Time series',
    },
    hasRawMode: {
      type: 'boolean',
      description: 'Whether the component has a raw mode version',
      isPrivate: true,
      default: false,
    },
  },
};

const TimeSeriesContainer = () => {
  return <TimeSeries />;
};

const mapStateToProps = () => ({});
const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(TimeSeriesContainer);
