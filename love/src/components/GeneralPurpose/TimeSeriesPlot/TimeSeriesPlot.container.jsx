import React from 'react';
import { connect } from 'react-redux';
import { getTimestampedStreamData } from '../../../redux/selectors';
import { addGroupSubscription, requestGroupSubscriptionRemoval } from '../../../redux/actions/ws';
import TimeSeriesPlot from './TimeSeriesPlot';

export const schema = {
  description: 'Time series plot for any data stream coming from SAL',
  defaultSize: [31, 8],
  props: {
    dataSources: {
      type: 'array',
      description: 'Array containing the name of the data sources for the plot',
      isPrivate: false,
      default: ['Dome Azimuth'],
    },
    groupNames: {
      type: 'object',
      description:
        'Object containing the mapping of every data source to the SAL stream, in the format <stream_type>-<CSC>-<salIndex>-<stream>',
      isPrivate: false,
      default: {
        'Dome Azimuth': 'telemetry-ATDome-0-position',
      },
    },
    layers: {
      type: 'object',
      description: 'Object containing the mapping of every data source to an object with the layer data',
      isPrivate: false,
      default: {
        'Dome Azimuth': {
          mark: {
            interpolate: 'linear',
          },
        },
      },
    },
    encoding: {
      type: 'object',
      description: 'Object containing the mapping of every data source to an object with the encoding data',
      isPrivate: false,
      default: {
        color: {
          scale: {
            domain: ['Dome Azimuth'],
            range: ['hsl(201, 70%, 40%)'],
          },
        },
      },
    },
    accessors: {
      type: 'object',
      description:
        'Object containing the mapping of every data source to a function that extracts the value to be plotted from the incoming data stream',
      isPrivate: false,
      default: '{ "Dome Azimuth": (data) => data.azimuthPosition.value }',
    },
    _functionProps: {
      type: 'array',
      description: 'Array containing the props that are functions',
      isPrivate: true,
      default: ['accessors'],
    },
  },
};
const TimeSeriesPlotContainer = ({
  streamStates,
  groupName,
  accessor,
  subscribeToStream,
  unsubscribeToStream,
  ...props
}) => {
  return (
    <TimeSeriesPlot
      streamStates={streamStates}
      groupName={groupName}
      accessor={accessor}
      subscribeToStream={subscribeToStream}
      unsubscribeToStream={unsubscribeToStream}
      {...props}
    />
  );
};

const mapStateToProps = (state, ownProps) => {
  const streamStates = {};
  ownProps.dataSources.map((dataSource) => {
    const groupName = ownProps.groupNames[dataSource];
    const streamState = getTimestampedStreamData(state, groupName);
    streamStates[dataSource] = { data: streamState.data, timestamp: streamState.timestamp };
    return 0;
  });
  return { streamStates: streamStates };
};

const mapDispatchToProps = (dispatch) => {
  return {
    subscribeToStream: (groupName) => {
      dispatch(addGroupSubscription(groupName));
    },
    unsubscribeToStream: (groupName) => {
      dispatch(requestGroupSubscriptionRemoval(groupName));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TimeSeriesPlotContainer);
