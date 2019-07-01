import React from 'react';
import { connect } from 'react-redux';
import { getTimestampedStreamData } from '../../../redux/selectors';
import { requestGroupSubscription, requestGroupSubscriptionRemoval } from '../../../redux/actions/ws';
import TimeSeriesPlot from './TimeSeriesPlot';

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
      dispatch(requestGroupSubscription(groupName));
    },
    unsubscribeToStream: (groupName) => {
      dispatch(requestGroupSubscriptionRemoval(groupName));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TimeSeriesPlotContainer);
