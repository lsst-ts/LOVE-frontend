import React from 'react';
import { connect } from 'react-redux';
import SummaryPanel from './SummaryPanel';
import { getMountState, getMountSubscriptions } from '../../../../redux/selectors';
import { requestGroupSubscription, requestGroupSubscriptionRemoval } from '../../../../redux/actions/ws';

const SummaryPanelContainer = ({ ...props }) => {
  return <SummaryPanel {...props} />;
};

const mapStateToProps = (state) => {
  const mountState = getMountState(state);
  return mountState;
};

const mapDispatchToProps = (dispatch) => {
  const index = 1;
  const mountSubscriptions = getMountSubscriptions(index);
  return {
    subscribeToStream: () => {
      mountSubscriptions.forEach((stream) => dispatch(requestGroupSubscription(stream)));
    },
    unsubscribeToStream: () => {
      mountSubscriptions.forEach((stream) => dispatch(requestGroupSubscriptionRemoval(stream)));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SummaryPanelContainer);
