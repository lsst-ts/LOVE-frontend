/** 
This file is part of LOVE-frontend.

Developed for the LSST Telescope and Site Systems.
This product includes software developed by the LSST Project
 (https://www.lsst.org).

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
import { getM1M3ActuatorForces, getM1M3ActuatorsState } from 'redux/selectors';
import SubscriptionTableContainer from 'components/GeneralPurpose/SubscriptionTable/SubscriptionTable.container';
import M1M3Compact from './M1M3Compact';
import { EUIs } from 'Config';

export const schema = {
  description: 'View of M1M3 actuators in compact mode (only show forces on actuators)',
  defaultSize: [61, 32],
  props: {
    title: {
      type: 'string',
      description: 'Name diplayed in the title bar (if visible)',
      isPrivate: false,
      default: 'M1M3Compact',
    },
    showForcesSelector: {
      type: 'boolean',
      description:
        'Whether to show the forces selector. If false, preSelectedForce and preSelectedForceParameter will be used (see below).',
      isPrivate: false,
      default: true,
    },
    preSelectedForce: {
      type: 'string',
      description: 'The force to show by default',
      isPrivate: false,
      default: 'Preclipped Forces',
    },
    preSelectedForceParameter: {
      type: 'string',
      description: 'The force parameter to show by default',
      isPrivate: false,
      default: 'zForces',
    },
    showActuatorsForces: {
      type: 'boolean',
      description: 'Whether to show the actuators forces',
      isPrivate: false,
      default: true,
    },
    EUI: {
      type: 'boolean',
      description: 'Whether the component has a EUI link',
      isPrivate: false,
      default: EUIs.M1M3,
    },
  },
};

const M1M3CompactContainer = ({ subscribeToStreams, unsubscribeToStreams, ...props }) => {
  if (props.isRaw) {
    return <SubscriptionTableContainer subscriptions={props.subscriptions}></SubscriptionTableContainer>;
  }
  return <M1M3Compact subscribeToStreams={subscribeToStreams} unsubscribeToStreams={unsubscribeToStreams} {...props} />;
};

const mapStateToProps = (state) => {
  const actuatorsState = getM1M3ActuatorsState(state);
  const actuatorsForces = getM1M3ActuatorForces(state);
  return {
    ...actuatorsState,
    ...actuatorsForces,
  };
};

const mapDispatchToProps = (dispatch) => {
  const subscriptions = [
    'telemetry-MTM1M3-0-forceActuatorData',
    'telemetry-MTM1M3-0-appliedAccelerationForces',
    'telemetry-MTM1M3-0-appliedAzimuthForces',
    'telemetry-MTM1M3-0-appliedBalanceForces',
    'telemetry-MTM1M3-0-appliedCylinderForces',
    'telemetry-MTM1M3-0-appliedElevationForces',
    'telemetry-MTM1M3-0-appliedForces',
    'telemetry-MTM1M3-0-appliedThermalForces',
    'telemetry-MTM1M3-0-appliedVelocityForces',
    'event-MTM1M3-0-forceActuatorState',
    'event-MTM1M3-0-forceActuatorInfo',
    'event-MTM1M3-0-appliedActiveOpticForces',
    'event-MTM1M3-0-appliedOffsetForces',
    'event-MTM1M3-0-appliedStaticForces',
    'event-MTM1M3-0-enabledForceActuators',
    'event-MTM1M3-0-preclippedAccelerationForces',
    'event-MTM1M3-0-preclippedActiveOpticForces',
    'event-MTM1M3-0-preclippedBalanceForces',
    'event-MTM1M3-0-preclippedAzimuthForces',
    'event-MTM1M3-0-preclippedCylinderForces',
    'event-MTM1M3-0-preclippedElevationForces',
    'event-MTM1M3-0-preclippedForces',
    'event-MTM1M3-0-preclippedOffsetForces',
    'event-MTM1M3-0-preclippedStaticForces',
    'event-MTM1M3-0-preclippedThermalForces',
    'event-MTM1M3-0-preclippedVelocityForces',
    'event-MTM1M3-0-raisingLoweringInfo',
    'event-MTM1M3-0-forceActuatorWarning',
    'event-MTM1M3-0-forceActuatorForceWarning',
    'event-MTM1M3-0-forceActuatorFollowingErrorCounter',
    'event-MTM1M3-0-forceSetpointWarning',
    'event-MTM1M3-0-forceActuatorBumpTestStatus',
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
export default connect(mapStateToProps, mapDispatchToProps)(M1M3CompactContainer);
