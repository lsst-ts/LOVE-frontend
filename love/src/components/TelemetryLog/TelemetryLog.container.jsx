import React, { useState } from 'react';
import { connect } from 'react-redux';
import TelemetryLog from './TelemetryLog';
import { requestGroupSubscription, requestGroupSubscriptionRemoval } from '../../redux/actions/ws';
import {saveGroupSubscriptions} from '../../Utils';

const TelemetryLogContainer = ({ data, groupName, changeGroup, subscribeToStream, unsubscribeToStream }) => {
  const subscribeAndChangeGroup = (category, csc, stream) => {
    subscribeToStream(category, csc, stream);
    changeGroup([category, csc, stream].join('-'));
  };
  return (
    <TelemetryLog data={data} subscribeToStream={subscribeAndChangeGroup} unsubscribeToStream={unsubscribeToStream} />
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
    subscribeToStream: (category, csc, stream) => {
      const groupName = [category, csc, stream].join('-');
      dispatch(requestGroupSubscription(groupName));

      return groupName;
    },
    unsubscribeToStream: (category, csc, stream) => {
      const groupName = [category, csc, stream].join('-');
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
