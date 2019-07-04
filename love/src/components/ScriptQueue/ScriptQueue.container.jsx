import React from 'react';
import { connect } from 'react-redux';
import { requestGroupSubscription, requestGroupSubscriptionRemoval, requestSALCommand } from '../../redux/actions/ws';
import { getScriptQueueState, getScriptHeartbeats } from '../../redux/selectors';

import ScriptQueue from './ScriptQueue';

const ScriptQueueContainer = ({
  subscribeToStreams,
  unsubscribeToStreams,
  summaryStateValue,
  queueState,
  scriptHeartbeats,
}) => {
  return (
    <ScriptQueue
      subscribeToStreams={subscribeToStreams}
      unsubscribeToStreams={unsubscribeToStreams}
      summaryStateValue={summaryStateValue}
      current={queueState.current}
      finishedScriptList={queueState.finishedScriptList}
      availableScriptList={queueState.availableScriptList}
      waitingScriptList={queueState.waitingScriptList}
      state={queueState.state}
      heartbeats={scriptHeartbeats}
    />
  );
};

const mapStateToProps = (state) => {
  const queueState = getScriptQueueState(state);
  const scriptHeartbeats = getScriptHeartbeats(state);
  return {
    queueState: queueState,
    scriptHeartbeats: scriptHeartbeats,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    subscribeToStreams: () => {
      dispatch(requestGroupSubscription('event-ScriptQueueState-stream'));
      dispatch(requestGroupSubscription('event-ScriptQueueState-summaryState'));
      dispatch(requestGroupSubscription('event-ScriptHeartbeats-stream'));
    },
    unsubscribeToStreams: () => {
      dispatch(requestGroupSubscriptionRemoval('event-ScriptQueueState-stream'));
      dispatch(requestGroupSubscriptionRemoval('event-ScriptQueueState-summaryState'));
      dispatch(requestGroupSubscriptionRemoval('event-ScriptHeartbeats-stream'));
    },
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ScriptQueueContainer);
