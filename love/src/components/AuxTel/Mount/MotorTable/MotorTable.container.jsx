import React from 'react';
import { connect } from 'react-redux';
import MotorTable from './MotorTable';
import { getMountMotorsState, getMountMotorsSubscriptions } from '../../../../redux/selectors';
import { requestGroupSubscription, requestGroupSubscriptionRemoval } from '../../../../redux/actions/ws';

export const schema = {
  description: `Table containing low level information about the AT mount motors and drives`,
  defaultSize: [53, 11],
  props: {},
};

const MotorTableContainer = ({ ...props }) => {
  return <MotorTable {...props} />;
};

const mapStateToProps = (state) => {
  const mountMotorState = getMountMotorsState(state, 0);
  return mountMotorState;
};

const mapDispatchToProps = (dispatch) => {
  const index = 0;
  const mountMotorSubscriptions = getMountMotorsSubscriptions(index);
  return {
    subscribeToStream: () => {
      mountMotorSubscriptions.forEach((stream) => dispatch(requestGroupSubscription(stream)));
    },
    unsubscribeToStream: () => {
      mountMotorSubscriptions.forEach((stream) => dispatch(requestGroupSubscriptionRemoval(stream)));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MotorTableContainer);
