import React, { useState } from 'react';
import { connect } from 'react-redux';
import TelemetryLog from './TelemetryLog';
import { requestGroupSubscription, requestGroupSubscriptionRemoval } from '../../redux/actions/ws';
import { saveGroupSubscriptions } from '../../Utils';

const TelemetryLogContainer = ({
  data,
  groupName,
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
      data={data}
      subscribeToStream={subscribeAndSaveGroup}
      unsubscribeToStream={unsubscribeAndRemoveGroup}
    />
  );
};

const mapStateToProps = (state, ownProps) => {
  const scriptqueue = state.ws.subscriptions.filter((s) => s.groupName === ownProps.groupName); //'event-ScriptQueue-all');

  if (scriptqueue.length === 0) return {};
  if (!scriptqueue[0].data) return {};
  return { data: scriptqueue[0].data };
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
