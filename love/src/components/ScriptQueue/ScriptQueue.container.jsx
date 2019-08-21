import React from 'react';
import { connect } from 'react-redux';
import { requestGroupSubscription, requestGroupSubscriptionRemoval, requestSALCommand } from '../../redux/actions/ws';
import {
  getScriptQueueState,
  getScriptHeartbeats,
  getSummaryStateValue,
  getPermCmdExec,
  getLastSALCommand,
  getUsername,
} from '../../redux/selectors';

import ScriptQueue from './ScriptQueue';

const ScriptQueueContainer = ({
  subscribeToStreams,
  unsubscribeToStreams,
  requestSALCommand,
  summaryStateValue,
  queueState,
  scriptHeartbeats,
  commandExecutePermission,
  lastSALCommand,
  username,
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
      commandExecutePermission={commandExecutePermission}
      lastSALCommand={lastSALCommand}
      username={username}
    />
  );
};

const mapStateToProps = (state) => {
  const queueState = getScriptQueueState(state, 1);
  const scriptHeartbeats = getScriptHeartbeats(state, 1);
  const summaryStateValue = getSummaryStateValue(state, 'event-ScriptQueue-1-summaryState');
  const commandExecutePermission = getPermCmdExec(state);
  const lastSALCommand = getLastSALCommand(state);
  const username = getUsername(state);
  return {
    queueState: queueState,
    scriptHeartbeats: scriptHeartbeats,
    summaryStateValue: summaryStateValue,
    commandExecutePermission: commandExecutePermission,
    lastSALCommand: lastSALCommand,
    username: username,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    subscribeToStreams: () => {
      dispatch(requestGroupSubscription('event-ScriptQueueState-1-stream'));
      dispatch(requestGroupSubscription('event-ScriptQueue-1-summaryState'));
      dispatch(requestGroupSubscription('event-ScriptHeartbeats-1-stream'));
    },
    unsubscribeToStreams: () => {
      dispatch(requestGroupSubscriptionRemoval('event-ScriptQueueState-1-stream'));
      dispatch(requestGroupSubscriptionRemoval('event-ScriptQueue-1-summaryState'));
      dispatch(requestGroupSubscriptionRemoval('event-ScriptHeartbeats-1-stream'));
    },
    requestSALCommand: (cmd) => {
      return dispatch(requestSALCommand(cmd));
    },
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ScriptQueueContainer);
