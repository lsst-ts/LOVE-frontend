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
  salindex,
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
      salindex={salindex}
    />
  );
};

const mapStateToProps = (state, ownProps) => {
  const queueState = getScriptQueueState(state, ownProps.salindex);
  const scriptHeartbeats = getScriptHeartbeats(state, ownProps.salindex);
  const summaryStateValue = getSummaryStateValue(state, `event-ScriptQueue-${ownProps.salindex}-summaryState`);
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

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    subscribeToStreams: () => {
      dispatch(requestGroupSubscription(`event-ScriptQueueState-${ownProps.salindex}-stream`));
      dispatch(requestGroupSubscription(`event-ScriptQueue-${ownProps.salindex}-summaryState`));
      dispatch(requestGroupSubscription(`event-ScriptHeartbeats-${ownProps.salindex}-stream`));
    },
    unsubscribeToStreams: () => {
      dispatch(requestGroupSubscriptionRemoval(`event-ScriptQueueState-${ownProps.salindex}-stream`));
      dispatch(requestGroupSubscriptionRemoval(`event-ScriptQueue-${ownProps.salindex}-summaryState`));
      dispatch(requestGroupSubscriptionRemoval(`event-ScriptHeartbeats-${ownProps.salindex}-stream`));
    },
    requestSALCommand: (cmd) => {
      return dispatch(requestSALCommand({ ...cmd, component: 'ScriptQueue', salindex: ownProps.salindex }));
    },
  };
};
const connectedContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ScriptQueueContainer);

connectedContainer.defaultProps = {
  salindex: 1,
};

export default connectedContainer;
