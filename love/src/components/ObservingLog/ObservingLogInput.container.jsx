import React from 'react';
import { connect } from 'react-redux';
import { addGroupSubscription, requestGroupSubscriptionRemoval, sendLOVECscObservingLogs } from '../../redux/actions/ws';
import { getUsername } from '../../redux/selectors';
import ObservingLogInput from './ObservingLogInput';

export const schema = {
  description: 'Component a textfield for the submission of observing log messages',
  defaultSize: [36, 28],
  props: {},
};

const ObservingLogInputContainer = ({ subscribeToStreams, unsubscribeToStreams, ...props }) => {
  return <ObservingLogInput subscribeToStreams={subscribeToStreams} unsubscribeToStreams={unsubscribeToStreams} {...props} />;
};

const mapStateToProps = (state) => {
  return {
    username: getUsername(state),
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
    sendMessage: (user, message) => {
        return dispatch(sendLOVECscObservingLogs(user, message))
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ObservingLogInputContainer);
