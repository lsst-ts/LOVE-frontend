import React from 'react';
import { connect } from 'react-redux';
import MotorTable from './MotorTable';
import { getMountMotorsState, getMountMotorsSubscriptions } from '../../../../redux/selectors';
import { addGroupSubscription, requestGroupSubscriptionRemoval } from '../../../../redux/actions/ws';
import SubscriptionTableContainer from '../../../GeneralPurpose/SubscriptionTable/SubscriptionTable.container';

export const schema = {
  description: `Table containing low level information about the AT mount motors and drives`,
  defaultSize: [55, 14],
  props: {
    title: {
      type: 'string',
      description: 'Name diplayed in the title bar (if visible)',
      isPrivate: false,
      default: 'ATMount motors',
    },
  },
};

const MotorTableContainer = ({ ...props }) => {
  if (props.isRaw) {
    return <SubscriptionTableContainer subscriptions={props.subscriptions}></SubscriptionTableContainer>;
  }
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
    subscriptions: mountMotorSubscriptions,
    subscribeToStream: () => {
      mountMotorSubscriptions.forEach((stream) => dispatch(addGroupSubscription(stream)));
    },
    unsubscribeToStream: () => {
      mountMotorSubscriptions.forEach((stream) => dispatch(requestGroupSubscriptionRemoval(stream)));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MotorTableContainer);
