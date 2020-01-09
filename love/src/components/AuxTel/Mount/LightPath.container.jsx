import React from 'react';
import { connect } from 'react-redux';
import LightPath from './LightPath';
import { getMountState, getMountSubscriptions } from '../../../redux/selectors';
import { requestGroupSubscription, requestGroupSubscriptionRemoval } from '../../../redux/actions/ws';

export const schema = {
  description: `Diagram containing high-level information about the AT mount sub-components, including M1, M2, M3, nasmyth ports, and mirror cover`,
  defaultSize: [20, 34],
  props: {},
  allowOverflow: true,
};

const LightPathContainer = ({ ...props }) => {
  return <LightPath {...props} />;
};

const mapStateToProps = (state) => {
  const mountState = getMountState(state, 0);
  return mountState;
};

const mapDispatchToProps = (dispatch) => {
  const index = 0;
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
