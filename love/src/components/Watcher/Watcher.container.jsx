import React from 'react';
import { connect } from 'react-redux';
import { getUsername, getAllAlarms, getTaiToUtc } from '../../redux/selectors';
import { addGroupSubscription, requestGroupSubscriptionRemoval, requestSALCommand } from '../../redux/actions/ws';
import SubscriptionTableContainer from '../GeneralPurpose/SubscriptionTable/SubscriptionTable.container';
import Watcher from './Watcher';
// import mockAlarms from './AlarmsTable/mock'

export const schema = {
  description: `Table containing alarms triggered by all CSCs, with the corresponding
              interactions such as searching, filtering, acknowledging and muting`,
  defaultSize: [63, 17],
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
      default: 'Watcher',
    },
    margin: {
      type: 'boolean',
      description: 'Whether to display component with a margin',
      isPrivate: false,
      default: true,
    },
  },
};

const WatcherContainer = ({ alarms, user, subscribeToStream, unsubscribeToStream, ...props }) => {
  if (props.isRaw) {
    return <SubscriptionTableContainer subscriptions={props.subscriptions}></SubscriptionTableContainer>;
  }
  return (
    <Watcher
      {...props}
      subscribeToStream={subscribeToStream}
      unsubscribeToStream={unsubscribeToStream}
      alarms={alarms}
    />
  );
};

const mapStateToProps = (state) => {
  // const alarms = mockAlarms;
  // const alarms = getAllAlarms(state).concat(mockAlarms);
  const alarms = getAllAlarms(state);
  const user = getUsername(state);
  const taiToUtc = getTaiToUtc(state);
  return { alarms, user, taiToUtc };
};

const mapDispatchToProps = (dispatch) => {
  const subscriptions = ['event-Watcher-0-alarm']
  return {
    subscriptions,
    subscribeToStreams: () => {
      //Alarms
      subscriptions.forEach((stream) => dispatch(addGroupSubscription(stream)));
    },
    unsubscribeToStreams: () => {
      //Alarms
      subscriptions.forEach((stream) => dispatch(requestGroupSubscriptionRemoval(stream)));
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
    unackAlarm: (name) => {
      return dispatch(
        requestSALCommand({
          cmd: 'cmd_unacknowledge',
          component: 'Watcher',
          salindex: 0,
          params: {
            name,
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

export default connect(mapStateToProps, mapDispatchToProps)(WatcherContainer);
