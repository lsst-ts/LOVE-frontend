import React from 'react';
import { connect } from 'react-redux';
import TelemetryLog from './TelemetryLog';
import { requestGroupSubscription, requestGroupSubscriptionRemoval } from '../../redux/actions/ws';
import { saveGroupSubscriptions } from '../../Utils';

const TelemetryLogContainer = ({
  streams,
  subscriptionsList,
  saveSubscriptionLocally,
  removeSubscriptionLocally,
  subscribeToStream,
  unsubscribeToStream,
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
    />
  );
};

const mapStateToProps = (state, ownProps) => {
  let streams = state.ws.subscriptions.filter((s) => ownProps.subscriptionsList.includes(s.groupName));
  if (streams.length === 0) return {};
  streams = streams.filter(s=>s.data);

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
  };
};

export default saveGroupSubscriptions(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(TelemetryLogContainer),
);
