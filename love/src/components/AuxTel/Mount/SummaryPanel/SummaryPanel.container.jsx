import React from 'react';
import { connect } from 'react-redux';
import SummaryPanel from './SummaryPanel';
import { getMountState, getMountSubscriptions } from '../../../../redux/selectors';
import { addGroupSubscription, removeGroup } from '../../../../redux/actions/ws';
import SubscriptionTableContainer from '../../../GeneralPurpose/SubscriptionTable/SubscriptionTable.container';

export const schema = {
  description: `Panel containing summary information about the AT, including the ATMCS, ATPneumatics and ATHexapod`,
  defaultSize: [21, 25],
  props: {
    title: {
      type: 'string',
      description: 'Name diplayed in the title bar (if visible)',
      isPrivate: false,
      default: 'AT summary',
    },
  },
};

const SummaryPanelContainer = ({ ...props }) => {
  if (props.isRaw) {
    return <SubscriptionTableContainer subscriptions={props.subscriptions}></SubscriptionTableContainer>;
  }
  return <SummaryPanel {...props} />;
};

const mapStateToProps = (state) => {
  const mountState = getMountState(state, 0);
  return mountState;
};

const mapDispatchToProps = (dispatch) => {
  const index = 0;
  const mountSubscriptions = getMountSubscriptions(index);
  return {
    subscriptions: mountSubscriptions,
    subscribeToStream: () => {
      mountSubscriptions.forEach((stream) => dispatch(addGroupSubscription(stream)));
    },
    unsubscribeToStream: () => {
      mountSubscriptions.forEach((stream) => dispatch(removeGroup(stream)));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SummaryPanelContainer);
