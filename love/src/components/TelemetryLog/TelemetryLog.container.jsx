import React from 'react';
import { connect } from 'react-redux';
import TelemetryLog from './TelemetryLog';
import { addGroup, removeGroup, requestSALCommand } from '../../redux/actions/ws';
import { saveGroupSubscriptions } from '../../Utils';

export const schema = {
  description: 'Internal use',
  defaultSize: [63, 17],
  props: {
    titleBar: {
      type: 'boolean',
      description: 'Whether to display the title bar',
      isPrivate: false,
      default: false,
    },
    title: {
      type: 'string',
      description: 'Name diplayed in the title bar (if visible)',
      isPrivate: false,
      default: 'Telemetry log',
    },
    margin: {
      type: 'boolean',
      description: 'Whether to display component with a margin',
      isPrivate: false,
      default: true,
    },
  },
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
      dispatch(addGroup(groupName));
    },
    unsubscribeToStream: (groupName) => {
      dispatch(removeGroup(groupName));
    },
    requestSALCommand: (cmd) => {
      dispatch(requestSALCommand(cmd));
    },
  };
};

export default saveGroupSubscriptions(connect(mapStateToProps, mapDispatchToProps)(TelemetryLogContainer));
