import React from 'react';
import { connect } from 'react-redux';
import { addGroup, removeGroup, sendLOVECscObservingLogs } from '../../redux/actions/ws';
import { getUsername } from '../../redux/selectors';
import SubscriptionTableContainer from '../GeneralPurpose/SubscriptionTable/SubscriptionTable.container';
import ObservingLogInput from './ObservingLogInput';

export const schema = {
  description: 'Input component for the submission of observing log messages',
  defaultSize: [36, 28],
  props: {
    titleBar: {
      type: 'boolean',
      description: 'Whether to display the title bar',
      isPrivate: false,
      default: true,
    },
    title: {
      type: 'string',
      description: 'Name diplayed in the title bar (if visible)',
      isPrivate: false,
      default: 'Observing log input',
    },
    margin: {
      type: 'boolean',
      description: 'Whether to display component with a margin',
      isPrivate: false,
      default: true,
    },
  },
};

const ObservingLogInputContainer = ({ subscribeToStreams, unsubscribeToStreams, ...props }) => {
  if (props.isRaw) {
    return <SubscriptionTableContainer subscriptions={props.subscriptions}></SubscriptionTableContainer>;
  }
  return (
    <ObservingLogInput subscribeToStreams={subscribeToStreams} unsubscribeToStreams={unsubscribeToStreams} {...props} />
  );
};

const mapStateToProps = (state) => {
  return {
    username: getUsername(state),
  };
};

const mapDispatchToProps = (dispatch) => {
  const subscriptions = ['event-LOVE-0-observingLog'];
  return {
    subscriptions,
    subscribeToStreams: () => {
      subscriptions.forEach((stream) => dispatch(addGroup(stream)));
    },
    unsubscribeToStreams: () => {
      subscriptions.forEach((stream) => dispatch(removeGroup(stream)));
    },
    sendMessage: (user, message) => {
      return dispatch(sendLOVECscObservingLogs(user, message));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ObservingLogInputContainer);
