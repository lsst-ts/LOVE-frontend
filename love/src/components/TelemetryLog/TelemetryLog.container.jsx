import React from 'react';
import { connect } from 'react-redux';
import TelemetryLog from './TelemetryLog';
import { requestGroupSubscription, requestGroupSubscriptionRemoval, requestSALCommand } from '../../redux/actions/ws';
import { saveGroupSubscriptions } from '../../Utils';

export const schema = {
  description: 'Internal use',
  defaultSize: [63, 17],
  props: {},
};
const TelemetryLogContainer = ({
  streams,
  subscriptionsList,
  saveSubscriptionLocally,
  removeSubscriptionLocally,
  subscribeToStream,
  unsubscribeToStream,
  requestSALCommand,
}) => {
  const subscribeAndSaveGroup = (groupName) => {
    subscribeToStream(groupName);
    saveSubscriptionLocally(groupName);
  };

  const unsubscribeAndRemoveGroup = (groupName) => {
    unsubscribeToStream(groupName);
    removeSubscriptionLocally(groupName);
  };

  return (
    <TelemetryLog
      streams={streams}
      subscribeToStream={subscribeAndSaveGroup}
      unsubscribeToStream={unsubscribeAndRemoveGroup}
      subscriptionsList={subscriptionsList}
      requestSALCommand={requestSALCommand}
    />
  );
};

const mapStateToProps = (state, ownProps) => {
  let streams = state.ws.subscriptions.filter((s) => ownProps.subscriptionsList.includes(s.groupName));
  if (streams.length === 0) return {};
  streams = streams.filter((s) => s.data);

  if (streams.length === 0) return {};
  return { streams: streams };
};

const mapDispatchToProps = (dispatch) => {
  return {
    subscribeToStream: (groupName) => {
      dispatch(requestGroupSubscription(groupName));
    },
    unsubscribeToStream: (groupName) => {
      dispatch(requestGroupSubscriptionRemoval(groupName));
    },
    requestSALCommand: (cmd) => {
      dispatch(requestSALCommand(cmd));
    },
  };
};

export default saveGroupSubscriptions(connect(mapStateToProps, mapDispatchToProps)(TelemetryLogContainer));
