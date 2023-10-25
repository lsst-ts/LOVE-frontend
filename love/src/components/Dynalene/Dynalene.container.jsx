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
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addGroup, removeGroup } from '../../redux/actions/ws';
import Dynalene from './Dynalene';
import { getDynaleneStatus, getDynaleneData } from 'redux/selectors';
import SubscriptionTableContainer from '../GeneralPurpose/SubscriptionTable/SubscriptionTable.container';

export const schema = {
  description: 'Dynalene',
  defaultSize: [57, 48],
  props: {
    title: {
      type: 'string',
      description: 'Dynalene',
      isPrivate: false,
      default: 'Dynalene',
    },
    tableVisible: {
      type: 'boolean',
      description: 'Display Sensor data Table',
      isPrivate: false,
      default: false,
    },
  },
};

const DynaleneContainer = ({ subscribeToStreams, unsubscribeToStreams, controls, ...props }) => {
  if (props.isRaw) {
    return <SubscriptionTableContainer subscriptions={props.subscriptions}></SubscriptionTableContainer>;
  }
  return (
    <Dynalene
      subscribeToStreams={subscribeToStreams}
      unsubscribeToStreams={unsubscribeToStreams}
      controls={controls}
      {...props}
    />
  );
};

const mapStateToProps = (state) => {
  const dynaleneStatus = getDynaleneStatus(state);
  const dynaleneData = getDynaleneData(state);
  return {
    ...dynaleneStatus,
    ...dynaleneData,
  };
};

const mapDispatchToProps = (dispatch) => {
  const subscriptions = [
    'event-HVAC-0-dynaleneState',
    'event-HVAC-0-dynAmbientDeltaModeStatus',
    'event-HVAC-0-dynCH1PressRemoteSP',
    'event-HVAC-0-dynCH2PressRemoteSP',
    'event-HVAC-0-dynExhaustAirBackupModeStatus',
    'event-HVAC-0-dynExtAirRemoteSP',
    'event-HVAC-0-dynMainGridAlarm',
    'event-HVAC-0-dynMainGridAlarmCMD',
    'event-HVAC-0-dynMainGridFailureFlag',
    'event-HVAC-0-dynPierFansOnOff',
    'event-HVAC-0-dynRemoteLocalModeStatus',
    'event-HVAC-0-dynSafetyResetFlag',
    'event-HVAC-0-dynSysFault',
    'event-HVAC-0-dynSysOK',
    'event-HVAC-0-dynSysWarning',
    'event-HVAC-0-dynSystOnOff',
    'event-HVAC-0-dynTAalarm',
    'event-HVAC-0-dynTAalarmCMD',
    'event-HVAC-0-dynTAalarmMonitor',
    'event-HVAC-0-dynTMAalarm',
    'event-HVAC-0-dynTMAalarmCMD',
    'event-HVAC-0-dynTMAalarmMonitor',
    'event-HVAC-0-dynTaRemoteSP',
    'event-HVAC-0-dynTankLevelAlarmCMD',
    'event-HVAC-0-dynTelemetryEnable',
    'event-HVAC-0-dynTmaRemoteSP',
    'event-HVAC-0-dynaleneTankLevel',
    'telemetry-HVAC-0-dynaleneP05',
  ];
  return {
    subscriptions,
    subscribeToStreams: () => {
      subscriptions.forEach((s) => dispatch(addGroup(s)));
    },
    unsubscribeToStreams: () => {
      subscriptions.forEach((s) => dispatch(removeGroup(s)));
    },
  };
};

DynaleneContainer.propTypes = {
  /** Wheter the component is in raw mode */
  isRaw: PropTypes.bool,
  /** List of the component's subscriptions */
  subscriptions: PropTypes.array,
};

export default connect(mapStateToProps, mapDispatchToProps)(DynaleneContainer);
