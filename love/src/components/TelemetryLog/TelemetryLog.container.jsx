import React from 'react';
import { connect } from 'react-redux';
import TelemetryLog from './TelemetryLog';
import { requestGroupSubscription, requestGroupSubscriptionRemoval } from '../../redux/actions/ws';

const TelemetryLogContainer = ({ data, subscribeToStream, unsubscribeToStream }) => {
  return <TelemetryLog data={data} subscribeToStream={subscribeToStream} unsubscribeToStream={unsubscribeToStream} />;
};

TelemetryLogContainer.defaultProps = {
  token: 'asd',
};
const mapStateToProps = (state) => {
  const scriptqueue = state.ws.subscriptions.filter((s) => s.groupName === 'event-ScriptQueue-all');

  if (scriptqueue.length === 0) return {};
  if (!scriptqueue[0].data) return {};
  return { data: scriptqueue[0].data };
};

const mapDispatchToProps = (dispatch) => {
  return {
    subscribeToStream: (category, csc, stream) => {
      const groupName = [category, csc, stream].join('-');
      dispatch(requestGroupSubscription(groupName));
    },
    unsubscribeToStream: (category, csc, stream) => {
      const groupName = [category, csc, stream].join('-');
      dispatch(requestGroupSubscriptionRemoval(groupName));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TelemetryLogContainer);
