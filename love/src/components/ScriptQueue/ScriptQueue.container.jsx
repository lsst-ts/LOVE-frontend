import React from 'react';
import { connect } from 'react-redux';
import { requestGroupSubscription, requestGroupSubscriptionRemoval, requestSALCommand } from '../../redux/actions/ws';
import { getScriptQueueState, getScriptHeartbeats, getSummaryStateValue } from '../../redux/selectors';

import ScriptQueue from './ScriptQueue';

const ScriptQueueContainer = ({
  subscribeToStreams,
  unsubscribeToStreams,
  requestSALCommand,
  summaryStateValue,
  queueState,
  scriptHeartbeats,
}) => {
  return (
    <ScriptQueue
      subscribeToStreams={subscribeToStreams}
      unsubscribeToStreams={unsubscribeToStreams}
      requestSALCommand={requestSALCommand}
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
  const summaryStateValue = getSummaryStateValue(state, 'event-ScriptQueue-summaryState');
  return {
    queueState: queueState,
    scriptHeartbeats: scriptHeartbeats,
    summaryStateValue: summaryStateValue,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    subscribeToStreams: () => {
      dispatch(requestGroupSubscription('event-ScriptQueueState-stream'));
      dispatch(requestGroupSubscription('event-ScriptQueue-summaryState'));
      dispatch(requestGroupSubscription('event-ScriptHeartbeats-stream'));
    },
    unsubscribeToStreams: () => {
      dispatch(requestGroupSubscriptionRemoval('event-ScriptQueueState-stream'));
      dispatch(requestGroupSubscriptionRemoval('event-ScriptQueue-summaryState'));
      dispatch(requestGroupSubscriptionRemoval('event-ScriptHeartbeats-stream'));
    },
    requestSALCommand: (cmd) =>{
      dispatch(requestSALCommand(cmd))
    }
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ScriptQueueContainer);
