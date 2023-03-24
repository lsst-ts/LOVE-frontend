import React from 'react';
import { connect } from 'react-redux';
import ObservatorySummary from './ObservatorySummary';
import { getObservatoryState } from '../../redux/selectors';
import { addGroup, removeGroup } from '../../redux/actions/ws';
import SubscriptionTableContainer from '../GeneralPurpose/SubscriptionTable/SubscriptionTable.container';

export const schema = {
  description: `Component containing summary information for the Observatory, Simonyi Telescope, and Auxiliary Telescope`,
  defaultSize: [21, 25],
  props: {
    title: {
      type: 'string',
      description: 'Name diplayed in the title bar (if visible)',
      isPrivate: false,
      default: 'Observatory Summary',
    },
  },
};

const ObservatorySummaryContainer = ({ ...props }) => {
  if (props.isRaw) {
    return <SubscriptionTableContainer subscriptions={props.subscriptions}></SubscriptionTableContainer>;
  }
  return <ObservatorySummary {...props} />;
};

const mapStateToProps = (state) => {
  const observatorySummary = getObservatoryState(state);
  return observatorySummary;
};
/*
const mapDispatchToProps = (dispatch) => {
  const index = 0;
  const mountSubscriptions = getMountSubscriptions(index);
  return {
    subscriptions: mountSubscriptions,
    subscribeToStream: () => {
      mountSubscriptions.forEach((stream) => dispatch(addGroup(stream))); 
    },
    unsubscribeToStream: () => {
      mountSubscriptions.forEach((stream) => dispatch(removeGroup(stream)));
    },
  };
};
*/
export default connect(mapStateToProps)(ObservatorySummaryContainer);
