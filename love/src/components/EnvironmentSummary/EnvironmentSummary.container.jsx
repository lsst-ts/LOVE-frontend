import React from 'react';
import { connect } from 'react-redux';
import EnvironmentSummary from './EnvironmentSummary';
import { addGroup, removeGroup } from 'redux/actions/ws';
import SubscriptionTableContainer from 'components/GeneralPurpose/SubscriptionTable/SubscriptionTable.container';
import { getRawStatus } from 'redux/selectors';

export const schema = {
  description: 'Summary view of Environment Summary.',
  defaultSize: [74, 47],
  props: {
    title: {
      type: 'string',
      description: 'Name displayed in the title bar (if visible)',
      isPrivate: false,
      default: 'Environment Summary',
    },
  },
};

const EnvironmentSummaryContainer = ({ subscribeToStream, unsubscribeToStream, ...props }) => {
  if (props.isRaw) {
    return <SubscriptionTableContainer subscriptions={props.subscriptions}></SubscriptionTableContainer>;
  }
  return (
    <EnvironmentSummary subscribeToStream={subscribeToStream} unsubscribeToStream={unsubscribeToStream} {...props} />
  );
};

const mapStateToProps = (state) => {
  const rawStatus = getRawStatus(state);
  return {
    ...rawStatus,
  };
};

const mapDispatchToProps = (dispatch) => {
  const subscriptions = [];
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

export default connect(mapStateToProps, mapDispatchToProps)(EnvironmentSummaryContainer);
