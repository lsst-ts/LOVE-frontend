import React from 'react';
import { connect } from 'react-redux';
import { getStreamData } from '../../../redux/selectors';
import { requestGroupSubscription, requestGroupSubscriptionRemoval } from '../../../redux/actions/ws';
import LabeledStatusText from './LabeledStatusText';

const LabeledStatusTextContainer = ({
  streamState,
  groupName,
  subscribeToStream,
  unsubscribeToStream,
  label,
  accessor,
  stateToLabelMap,
  stateToStyleMap,
}) => {
  return (
    <LabeledStatusText
      streamState={streamState}
      groupName={groupName}
      label={label}
      accessor={accessor}
      stateToLabelMap={stateToLabelMap}
      stateToStyleMap={stateToStyleMap}
      subscribeToStream={subscribeToStream}
      unsubscribeToStream={unsubscribeToStream}
    />
  );
};

const mapStateToProps = (state, ownProps) => {
  const streamState = getStreamData(state, ownProps.groupName);
  return { streamState: streamState };
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

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LabeledStatusTextContainer);
