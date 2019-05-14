import React, { useState } from 'react';
import { connect } from 'react-redux';
import TelemetryLog from './TelemetryLog';
import { requestGroupSubscription, requestGroupSubscriptionRemoval } from '../../redux/actions/ws';

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

const ConnectedLogContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(TelemetryLogContainer);

const StreamGroupSetter = () => {
  const [groupName, setGroupName] = useState('');

  const changeGroup = (groupName) => {
    setGroupName(groupName);
  };

  return <ConnectedLogContainer groupName={groupName} changeGroup={changeGroup} />;
};
export default StreamGroupSetter;
