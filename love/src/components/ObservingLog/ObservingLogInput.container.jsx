import React from 'react';
import { connect } from 'react-redux';
import { requestGroupSubscription, requestGroupSubscriptionRemoval } from '../../redux/actions/ws';
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
      dispatch(requestGroupSubscription('event-LOVE-0-observingLog'));
    },
    unsubscribeToStreams: () => {
      dispatch(requestGroupSubscriptionRemoval('event-LOVE-0-observingLog'));
    },
    sendMessage: (message) => {
      //   return dispatch(requestSALCommand({ ...cmd, component: 'ObservingLogInput', salindex: ownProps.salindex }));
      return;
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ObservingLogInputContainer);
