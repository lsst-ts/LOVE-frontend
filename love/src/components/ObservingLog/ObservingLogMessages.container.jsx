import React from 'react';
import { connect } from 'react-redux';
import { requestGroupSubscription, requestGroupSubscriptionRemoval } from '../../redux/actions/ws';
import ObservingLogMessages from './ObservingLogMessages';

export const schema = {
  description: 'Component a textfield for the submission of observing log messages',
  defaultSize: [36, 28],
  props: {},
};

const ObservingLogMessagesContainer = ({ subscribeToStreams, unsubscribeToStreams, ...props }) => {
  return <ObservingLogMessages subscribeToStreams={subscribeToStreams} unsubscribeToStreams={unsubscribeToStreams} {...props} />;
};

const mapStateToProps = (state) => {
  return {
    logMessages: [{
      message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut mauris enim, bibendum vel lacinia eu, tempus nec dui. Duis dignissim, nunc quis dictum pulvinar, tortor orci pretium nunc, sit amet iaculis ipsum tellus nec felis. Morbi tempus lacus ut tellus posuere gravida. Vivamus dignissim, nisl eu rhoncus imperdiet, turpis quam euismod mauris, vel euismod nibh purus non erat. Praesent consequat blandit iaculis. Nullam et venenatis lorem. Etiam pulvinar mauris vitae ultricies interdum.',
      user: 'admin',
    },
    {
      message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut mauris enim, bibendum vel lacinia eu, tempus nec dui. Duis dignissim, nunc quis dictum pulvinar, tortor orci pretium nunc, sit amet iaculis ipsum tellus nec felis. Morbi tempus lacus ut tellus posuere gravida. Vivamus dignissim, nisl eu rhoncus imperdiet, turpis quam euismod mauris, vel euismod nibh purus non erat. Praesent consequat blandit iaculis. Nullam et venenatis lorem. Etiam pulvinar mauris vitae ultricies interdum.',
      user: 'test',
    },
    {
      message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut mauris enim, bibendum vel lacinia eu, tempus nec dui. Duis dignissim, nunc quis dictum pulvinar, tortor orci pretium nunc, sit amet iaculis ipsum tellus nec felis. Morbi tempus lacus ut tellus posuere gravida. Vivamus dignissim, nisl eu rhoncus imperdiet, turpis quam euismod mauris, vel euismod nibh purus non erat. Praesent consequat blandit iaculis. Nullam et venenatis lorem. Etiam pulvinar mauris vitae ultricies interdum.',
      user: 'admin',
    },
    {
      message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut mauris enim, bibendum vel lacinia eu, tempus nec dui. Duis dignissim, nunc quis dictum pulvinar, tortor orci pretium nunc, sit amet iaculis ipsum tellus nec felis. Morbi tempus lacus ut tellus posuere gravida. Vivamus dignissim, nisl eu rhoncus imperdiet, turpis quam euismod mauris, vel euismod nibh purus non erat. Praesent consequat blandit iaculis. Nullam et venenatis lorem. Etiam pulvinar mauris vitae ultricies interdum.',
      user: 'test',
    },
    {
      message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ',
      user: 'admin',
    }],
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
      //   return dispatch(requestSALCommand({ ...cmd, component: 'ObservingLogMessages', salindex: ownProps.salindex }));
      return;
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ObservingLogMessagesContainer);
