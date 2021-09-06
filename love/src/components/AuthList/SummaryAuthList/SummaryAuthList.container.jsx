import React from 'react';
import { connect } from 'react-redux';
import { addGroup, removeGroup } from 'redux/actions/ws';
import { getAuthlistState } from 'redux/selectors';
import SummaryAuthList from './SummaryAuthList';
import SubscriptionTableContainer from '../../GeneralPurpose/SubscriptionTable/SubscriptionTable.container';

export const schema = {
  description: 'Auth list summary table',
  defaultSize: [20, 20],
  props: {
    title: {
      type: 'string',
      description: 'Name diplayed in the title bar (if visible)',
      isPrivate: false,
      default: 'Authorization List Summary',
    },
    cscList: {
      type: 'array',
      description: 'List of CSCs to display their Auth Lists',
      isPrivate: false,
      default: ['ATDome:0', 'ATMCS:0'],
    },
  },
};

const SummaryAuthListContainer = ({ ...props }) => {
  if (props.isRaw) {
    return <SubscriptionTableContainer subscriptions={props.subscriptions} />;
  }
  return <SummaryAuthList {...props} />;
};

const mapStateToProps = (state, ownProps) => {
  const subscriptions = ownProps.cscList.map((csc) => {
    const [name, salindex] = csc.split(':');
    return `event-${name}-${salindex}-authList`;
  });
  const authlistState = getAuthlistState(state, subscriptions);
  return { ...authlistState };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const subscriptions = ownProps.cscList.map((csc) => {
    const [name, salindex] = csc.split(':');
    return `event-${name}-${salindex}-authList`;
  });
  return {
    subscriptions,
    subscribeToStream: () => {
      subscriptions.forEach((stream) => dispatch(addGroup(stream)));
    },
    unsubscribeToStream: () => {
      subscriptions.forEach((stream) => dispatch(removeGroup(stream)));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SummaryAuthListContainer);
