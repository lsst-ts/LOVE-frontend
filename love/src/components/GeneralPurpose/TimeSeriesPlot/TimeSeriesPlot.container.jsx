import React from 'react';
import { connect } from 'react-redux';
import { getTimestampedStreamData } from '../../../redux/selectors';
import { requestGroupSubscription, requestGroupSubscriptionRemoval } from '../../../redux/actions/ws';
import TimeSeriesPlot from './TimeSeriesPlot';

const TimeSeriesPlotContainer = ({
  data,
  timestamp,
  groupName,
  accessor,
  subscribeToStream,
  unsubscribeToStream,
  ...props,
}) => {
  return (
    <TimeSeriesPlot
      data={data}
      groupName={groupName}
      accessor={accessor}
      timestamp={timestamp}
      subscribeToStream={subscribeToStream}
      unsubscribeToStream={unsubscribeToStream}
      {...props}
    />
  );
};

const mapStateToProps = (state, ownProps) => {
  const streamState = getTimestampedStreamData(state, ownProps.groupName);
  return { data: streamState.data, timestamp: streamState.timestamp };
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
