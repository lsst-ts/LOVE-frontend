import React from 'react';
import { connect } from 'react-redux';
import { addGroup, removeGroup } from '../../redux/actions/ws';
import { getObservingLogs, getTaiToUtc } from '../../redux/selectors';
import SubscriptionTableContainer from '../GeneralPurpose/SubscriptionTable/SubscriptionTable.container';
import ObservingLogMessages from './ObservingLogMessages';

export const schema = {
  description: 'Component a textfield for the submission of observing log messages',
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
      default: 'Observing log',
    },
    margin: {
      type: 'boolean',
      description: 'Whether to display component with a margin',
      isPrivate: false,
      default: true,
    },
  },
};

const ObservingLogMessagesContainer = ({ subscribeToStreams, unsubscribeToStreams, taiToUtc, ...props }) => {
  if (props.isRaw) {
    return <SubscriptionTableContainer subscriptions={props.subscriptions}></SubscriptionTableContainer>;
  }
  return (
    <ObservingLogMessages
      subscribeToStreams={subscribeToStreams}
      unsubscribeToStreams={unsubscribeToStreams}
      taiToUtc={taiToUtc}
      {...props}
    />
  );
};

const mapStateToProps = (state) => {
  return {
    logMessages: getObservingLogs(state),
    taiToUtc: getTaiToUtc(state),
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
    sendMessage: (message) => {
      //   return dispatch(requestSALCommand({ ...cmd, component: 'ObservingLogMessages', salindex: ownProps.salindex }));
      return;
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ObservingLogMessagesContainer);
