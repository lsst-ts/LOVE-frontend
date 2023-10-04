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
import { addGroup, removeGroup } from 'redux/actions/ws';
import {
  getM1M3State,
  getM1M3ActuatorsState,
  getM1M3ActuatorForces,
  getM1M3HardpointMonitorData,
  getM1M3HardpointActuatorState,
  getAlignmentState,
} from 'redux/selectors';
import SubscriptionTableContainer from 'components/GeneralPurpose/SubscriptionTable/SubscriptionTable.container';
import M1M3 from './M1M3';
import { EUIs } from 'Config';

export const schema = {
  description: 'View of M1M3 actuators',
  defaultSize: [61, 32],
  props: {
    title: {
      type: 'string',
      description: 'Name diplayed in the title bar (if visible)',
      isPrivate: false,
      default: 'M1M3',
    },
    EUI: {
      type: 'boolean',
      description: 'Whether the component has a EUI link',
      isPrivate: false,
      default: EUIs.M1M3,
    },
  },
};

const M1M3Container = ({ subscribeToStreams, unsubscribeToStreams, ...props }) => {
  if (props.isRaw) {
    return <SubscriptionTableContainer subscriptions={props.subscriptions}></SubscriptionTableContainer>;
  }
  return <M1M3 subscribeToStreams={subscribeToStreams} unsubscribeToStreams={unsubscribeToStreams} {...props} />;
};

const mapStateToProps = (state) => {
  const m1m3State = getM1M3State(state);
  const actuatorsState = getM1M3ActuatorsState(state);
  const actuatorsForces = getM1M3ActuatorForces(state);
  const hardpointsMonitor = getM1M3HardpointMonitorData(state);
  const hardpointsActuatorState = getM1M3HardpointActuatorState(state);
  const alignmentState = getAlignmentState(state);
  return {
    ...m1m3State,
    ...actuatorsState,
    ...actuatorsForces,
    ...hardpointsMonitor,
    ...hardpointsActuatorState,
    ...alignmentState,
  };
};

const mapDispatchToProps = (dispatch) => {
  const subscriptions = [
    'telemetry-MTM1M3-0-forceActuatorData',
    'telemetry-MTM1M3-0-hardpointActuatorData',
    'telemetry-MTM1M3-0-hardpointMonitorData',
    'telemetry-MTM1M3-0-imsData',
    'telemetry-MTM1M3-0-appliedAccelerationForces',
    'telemetry-MTM1M3-0-appliedAzimuthForces',
    'telemetry-MTM1M3-0-appliedBalanceForces',
    'telemetry-MTM1M3-0-appliedCylinderForces',
    'telemetry-MTM1M3-0-appliedElevationForces',
    'telemetry-MTM1M3-0-appliedForces',
    'telemetry-MTM1M3-0-appliedThermalForces',
    'telemetry-MTM1M3-0-appliedVelocityForces',
    'event-MTM1M3-0-summaryState',
    'event-MTM1M3-0-detailedState',
    'event-MTM1M3-0-forceActuatorState',
    'event-MTM1M3-0-forceActuatorInfo',
    'event-MTM1M3-0-hardpointActuatorState',
    'event-MTM1M3-0-hardpointActuatorInfo',
    'event-MTM1M3-0-appliedActiveOpticForces',
    'event-MTM1M3-0-appliedOffsetForces',
    'event-MTM1M3-0-appliedStaticForces',
    'event-MTM1M3-0-enabledForceActuators',
    'event-OAA-0-alignment',
    // 'event-MTM1M3-0-preclippedAccelerationForces',
    // 'event-MTM1M3-0-preclippedActiveOpticForces',
    // 'event-MTM1M3-0-preclippedBalanceForces',
    // 'event-MTM1M3-0-preclippedAzimuthForces',
    // 'event-MTM1M3-0-preclippedCylinderForces',
    // 'event-MTM1M3-0-preclippedElevationForces',
    // 'event-MTM1M3-0-preclippedForces',
    // 'event-MTM1M3-0-preclippedOffsetForces',
    // 'event-MTM1M3-0-preclippedStaticForces',
    // 'event-MTM1M3-0-preclippedThermalForces',
    // 'event-MTM1M3-0-preclippedVelocityForces',
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
export default connect(mapStateToProps, mapDispatchToProps)(M1M3Container);
