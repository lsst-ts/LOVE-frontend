import React from 'react';
import { connect } from 'react-redux';
import { addGroupSubscription, requestGroupSubscriptionRemoval } from '../../redux/actions/ws';
import { getObservingLogs } from '../../redux/selectors';
import ObservingLogMessages from './ObservingLogMessages';

export const schema = {
  description: 'Component a textfield for the submission of observing log messages',
  defaultSize: [36, 28],
  props: {},
};

const ObservingLogMessagesContainer = ({ subscribeToStreams, unsubscribeToStreams, ...props }) => {
  return (
    <ObservingLogMessages
      subscribeToStreams={subscribeToStreams}
      unsubscribeToStreams={unsubscribeToStreams}
      {...props}
    />
  );
};

const mapStateToProps = (state) => {
  return {
    logMessages: getObservingLogs(state)
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
