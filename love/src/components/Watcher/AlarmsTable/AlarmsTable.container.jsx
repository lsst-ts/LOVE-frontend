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

const AlarmsTableContainer = ({ alarms, filters, user, subscribeToStream, unsubscribeToStream, ...props }) => {
  console.log('filters: ', filters);
  return (
    <AlarmsTable
      {...props}
      subscribeToStream={subscribeToStream}
      unsubscribeToStream={unsubscribeToStream}
      // alarms={alarms}
      alarms={applyFilter(alarms, filters)}
    />
  );
};

const applyFilter = (data, filters) => {

  console.log('data: ', data);
  console.log('filters: ', filters);
  const filteredData = data.filter(dataValue => Object.keys(filters).every(filterKey => dataValue[filterKey] === filters[filterKey]));
  console.log('filteredData: ', filteredData);
  return filteredData;
}

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
