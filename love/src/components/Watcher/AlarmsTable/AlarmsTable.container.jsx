import React from 'react';
import { connect } from 'react-redux';
import { getUsername, getAllAlarms } from '../../../redux/selectors';
import {
  requestGroupSubscription,
  requestGroupSubscriptionRemoval,
  requestSALCommand,
} from '../../../redux/actions/ws';
import AlarmsTable from './AlarmsTable';
import mockAlarms from './mock';

const AlarmsTableContainer = ({
  alarms,
  filterCallback = () => true,
  user,
  subscribeToStream,
  unsubscribeToStream,
  ...props }) => {
  return (
    <AlarmsTable
      {...props}
      subscribeToStream={subscribeToStream}
      unsubscribeToStream={unsubscribeToStream}
      alarms={alarms.filter(filterCallback)}
    />
  );
};

const mapStateToProps = (state) => {
  const alarms = getAllAlarms(state).concat(mockAlarms);
  // const alarms = getAllAlarms(state);
  const user = getUsername(state);
  return { alarms, user };
};

const mapDispatchToProps = (dispatch) => {
  return {
    subscribeToStreams: () => {
      //Alarms
      dispatch(requestGroupSubscription('event-Watcher-0-alarm'));
    },
    unsubscribeToStreams: () => {
      //Alarms
      dispatch(requestGroupSubscriptionRemoval('event-Watcher-0-alarm'));
    },
    ackAlarm: (name, severity, acknowledgedBy) => {
      return dispatch(
        requestSALCommand({
          cmd: 'cmd_acknowledge',
          component: 'Watcher',
          salindex: 0,
          params: {
            name,
            severity,
            acknowledgedBy,
          },
        }),
      );
    },
    muteAlarm: (name, severity, duration, mutedBy) => {
      console.log('muteAlarm:', {name, severity, duration, mutedBy});
      return dispatch(
        requestSALCommand({
          cmd: 'cmd_mute',
          component: 'Watcher',
          salindex: 0,
          params: {
            name,
            duration,
            severity,
            mutedBy,
          },
        }),
      );
    },
    unmuteAlarm: (name) => {
      return dispatch(
        requestSALCommand({
          cmd: 'cmd_unmute',
          component: 'Watcher',
          salindex: 0,
          params: {
            name,
          },
        }),
      );
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AlarmsTableContainer);
