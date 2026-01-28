/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed by Inria Chile and the Telescope and Site Software team.

Developed for the Vera C. Rubin Observatory Telescope and Site Systems.

This program is free software: you can redistribute it and/or modify it under 
the terms of the GNU General Public License as published by the Free Software 
Foundation, either version 3 of the License, or at your option) any later version.

This program is distributed in the hope that it will be useful,but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR 
 A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with 
this program. If not, see <http://www.gnu.org/licenses/>.
*/

import React from 'react';
import { connect } from 'react-redux';
import { getUsername, getAllAlarms, getTaiToUtc, getAllTime } from '../../redux/selectors';
import { addGroup, removeGroup, requestSALCommand } from '../../redux/actions/ws';
import { logAlarm } from '../../redux/actions/alarms';
import SubscriptionTableContainer from '../GeneralPurpose/SubscriptionTable/SubscriptionTable.container';
import Watcher from './Watcher';

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

const WatcherContainer = ({ alarms, subscribeToStream, unsubscribeToStream, ...props }) => {
  if (props.isRaw) {
    return <SubscriptionTableContainer subscriptions={props.subscriptions}></SubscriptionTableContainer>;
  }
  return (
    <Watcher
      subscribeToStream={subscribeToStream}
      unsubscribeToStream={unsubscribeToStream}
      alarms={alarms}
      {...props}
    />
  );
};

const mapStateToProps = (state) => {
  const alarms = getAllAlarms(state);
  const user = getUsername(state);
  const taiToUtc = getTaiToUtc(state);
  const timeData = getAllTime(state);
  return { alarms, user, taiToUtc, timeData };
};

const mapDispatchToProps = (dispatch) => {
  const subscriptions = ['event-Watcher-0-stream', 'event-Watcher-0-alarm'];
  return {
    subscriptions,
    subscribeToStreams: () => {
      //Alarms
      subscriptions.forEach((stream) => dispatch(addGroup(stream)));
    },
    unsubscribeToStreams: () => {
      //Alarms
      subscriptions.forEach((stream) => dispatch(removeGroup(stream)));
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
    logAlarm: (name) => dispatch(logAlarm(name)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(WatcherContainer);
