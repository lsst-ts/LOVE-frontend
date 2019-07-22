import React from 'react';
import { connect } from 'react-redux';
import CSCSummary from './CSCSummary';
import { hasFakeData, CSCSummaryHierarchy } from '../../Config';
import { requestGroupSubscription, requestGroupSubscriptionRemoval, requestSALCommand } from '../../redux/actions/ws';
import {getCSCHeartbeats} from '../../redux/selectors';
const CSCSummaryContainer = ({ subscribeToStreams, unsubscribeToStreams, heartbeatsData }) => {
  return (
    <CSCSummary
      hierarchy={CSCSummaryHierarchy}
      subscribeToStreams={subscribeToStreams}
      unsubscribeToStreams={unsubscribeToStreams}
      heartbeatsData={heartbeatsData}
    />
  );
};

const mapStateToProps = (state) => {
  const heartbeatsData = getCSCHeartbeats(state);
  return {
    heartbeatsData
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    subscribeToStreams: () => {
      dispatch(requestGroupSubscription('event-Heartbeat-0-stream'));
    },
    unsubscribeToStreams: () => {
      dispatch(requestGroupSubscriptionRemoval('event-Heartbeat-0-stream'));
    },
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CSCSummaryContainer);
