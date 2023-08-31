/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed by Inria Chile.

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
import { getAllAlarms, getLastestAlarms, getAlarmConfig } from '../../../redux/selectors';
import { addGroup, removeGroup } from '../../../redux/actions/ws';
import AlarmAudio from './AlarmAudio';

const AlarmAudioContainer = ({ ...props }) => {
  return <AlarmAudio {...props} />;
};

const mapStateToProps = (state) => {
  const alarms = getAllAlarms(state);
  const alarmsConfig = getAlarmConfig(state);
  return {
    alarms,
    alarmsConfig,
  };
};

const mapDispatchToProps = (dispatch) => {
  const subscriptions = ['event-Watcher-0-stream', 'event-Watcher-0-alarm'];
  return {
    subscriptions,
    subscribeToStreams: () => {
      subscriptions.forEach((stream) => dispatch(addGroup(stream)));
    },
    unsubscribeToStreams: () => {
      subscriptions.forEach((stream) => dispatch(removeGroup(stream)));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AlarmAudioContainer);
