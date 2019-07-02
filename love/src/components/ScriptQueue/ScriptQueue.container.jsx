import React from 'react';
import { connect } from 'react-redux';
import { requestGroupSubscription, requestGroupSubscriptionRemoval, requestSALCommand } from '../../redux/actions/ws';
import { getScriptQueueState } from '../../redux/selectors';

import ScriptQueue from './ScriptQueue';

const ScriptQueueContainer = ({
  subscribeToStreams,
  unsubscribeToStreams,
  summaryStateValue,
  current,
  finishedScriptList,
  availableScriptList,
  waitingScriptList,
  state,
}) => {
  return (
    <ScriptQueue
      subscribeToStreams={subscribeToStreams}
      unsubscribeToStreams={unsubscribeToStreams}
      summaryStateValue={summaryStateValue}
      current={current}
      finishedScriptList={finishedScriptList}
      availableScriptList={availableScriptList}
      waitingScriptList={waitingScriptList}
      state={state}
    />
  );
};

const mapStateToProps = (state) => {
  const queueState = getScriptQueueState(state);
  return queueState;
};

const mapDispatchToProps = (dispatch) => {
  return {
    subscribeToStreams: () => {
      dispatch(requestGroupSubscription('event-ScriptQueueState-stream'));
      dispatch(requestGroupSubscription('event-ScriptQueueState-summaryState'));
    },
    unsubscribeToStreams: () => {
      dispatch(requestGroupSubscriptionRemoval('event-ScriptQueueState-stream'));
      dispatch(requestGroupSubscriptionRemoval('event-ScriptQueueState-summaryState'));
    },
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ScriptQueueContainer);
