import React from 'react';
import { connect } from 'react-redux';
import { addGroupSubscription, requestGroupSubscriptionRemoval } from '../../redux/actions/ws';
import { getObservingLogs, getTaiToUtc } from '../../redux/selectors';
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
  return {
    subscribeToStreams: () => {
      dispatch(addGroupSubscription('event-LOVE-0-observingLog'));
    },
    unsubscribeToStreams: () => {
      dispatch(requestGroupSubscriptionRemoval('event-LOVE-0-observingLog'));
    },
    sendMessage: (message) => {
      //   return dispatch(requestSALCommand({ ...cmd, component: 'ObservingLogMessages', salindex: ownProps.salindex }));
      return;
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ObservingLogMessagesContainer);
