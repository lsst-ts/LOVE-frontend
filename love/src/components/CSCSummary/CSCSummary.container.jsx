import React from 'react';
import { connect } from 'react-redux';
import CSCSummary from './CSCSummary';
import { hasFakeData, CSCSummaryHierarchy } from '../../Config';
import { requestGroupSubscription, requestGroupSubscriptionRemoval, requestSALCommand } from '../../redux/actions/ws';

const CSCSummaryContainer = ({ subscribeToStreams, unsubscribeToStreams }) => {
  return (
    <CSCSummary
      hierarchy={CSCSummaryHierarchy}
      subscribeToStreams={subscribeToStreams}
      unsubscribeToStreams={unsubscribeToStreams}
    />
  );
};

const mapStateToProps = (state) => {
  console.log(state.ws);
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
