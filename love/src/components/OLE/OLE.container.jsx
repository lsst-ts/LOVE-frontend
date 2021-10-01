import React from 'react';
import { connect } from 'react-redux';
import OLE from './OLE';
import SubscriptionTableContainer from 'components/GeneralPurpose/SubscriptionTable/SubscriptionTable.container';
import { addGroup, removeGroup } from 'redux/actions/ws';

export const schema = {
  description: 'View of Exposure log service',
  defaultSize: [61, 32],
  props: {
    title: {
      type: 'string',
      description: 'Name displayed in the title bar (if visible)',
      isPrivate: false,
      default: 'Exposure Log Service',
    },
  },
};

const OLEContainer = ({ subscribeToStreams, unsubscribeToStreams, ...props }) => {
  if (props.isRaw) {
    return <SubscriptionTableContainer subscriptions={props.subscriptions}></SubscriptionTableContainer>;
  }
  return <OLE subscribeToStreams={subscribeToStreams} unsubscribeToStreams={unsubscribeToStreams} {...props} />;
};

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  const subscriptions = [];
  return {
    subscriptions,
    subscribeToStreams: () => {
      subscriptions.forEach((s) => dispatch(addGroup(s)));
    },
    unsubscribeToStreams: () => {
      subscriptions.forEach((s) => dispatch(removeGroup(s)));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(OLEContainer);
