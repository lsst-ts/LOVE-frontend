import React from 'react';
import { connect } from 'react-redux';
import { requestGroupSubscription, requestGroupSubscriptionRemoval, requestSALCommand } from '../../redux/actions/ws';

import ScriptQueue from './ScriptQueue';

const ScriptQueueContainer = ({ subscribeToStreams, unsubscribeToStreams }) => {
  return <ScriptQueue subscribeToStreams={subscribeToStreams} unsubscribeToStreams={unsubscribeToStreams} />;
};

const mapStateToProps = () => {};

const mapDispatchToProps = (dispatch) => {
  return {
    subscribeToStreams : () =>{
      dispatch(requestGroupSubscription('event-ScriptQueueState-stream'));
      dispatch(requestGroupSubscription('event-ScriptQueueState-summaryState'));
    },
    unsubscribeToStreams : () =>{
      dispatch(requestGroupSubscriptionRemoval('event-ScriptQueueState-stream'));
      dispatch(requestGroupSubscriptionRemoval('event-ScriptQueueState-summaryState'));
    }
  }
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ScriptQueueContainer);
