import React from 'react';
import { connect } from 'react-redux';
import LightPath from './LightPath';
import { getMountState, getMountSubscriptions } from '../../../redux/selectors';
import { requestGroupSubscription, requestGroupSubscriptionRemoval } from '../../../redux/actions/ws';

const LightPathContainer = () => {
  return <LightPath />;
};

const mapStateToProps = (state) => {
  const domeState = getMountState(state);
  return domeState;
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
)(LightPathContainer);
