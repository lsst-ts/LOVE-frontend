import React from 'react';
import { connect } from 'react-redux';
import MountDetail from './MountDetail';
import { getMountState, getMountSubscriptions } from '../../../redux/selectors';
import { requestGroupSubscription, requestGroupSubscriptionRemoval } from '../../../redux/actions/ws';

const MountDetailContainer = () => {
  return <MountDetail />;
};

const mapStateToProps = (state) => {
  const domeState = getMountState(state);
  return domeState;
};

const mapDispatchToProps = (dispatch) => {
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
)(MountDetailContainer);
