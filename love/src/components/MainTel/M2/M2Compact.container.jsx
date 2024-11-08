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
import { getM2ActuatorForceTopics } from 'redux/selectors';
import SubscriptionTableContainer from 'components/GeneralPurpose/SubscriptionTable/SubscriptionTable.container';
import M2Compact from './M2Compact';
import { EUIs } from 'Config';

export const schema = {
  description: 'View of M2 actuators in compact mode (only show forces on actuators)',
  defaultSize: [60, 47],
  props: {
    title: {
      type: 'string',
      description: 'Name diplayed in the title bar (if visible)',
      isPrivate: false,
      default: 'M2 Compact',
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
      default: 'Forces',
    },
    preSelectedForceParameter: {
      type: 'string',
      description: 'The force parameter to show by default',
      isPrivate: false,
      default: 'measured',
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

const M2CompactContainer = (props) => {
  if (props.isRaw) {
    return <SubscriptionTableContainer subscriptions={props.subscriptions}></SubscriptionTableContainer>;
  }
  return <M2Compact {...props} />;
};

const mapStateToProps = (state) => {
  const forceTopicsData = getM2ActuatorForceTopics(state);

  return {
    ...forceTopicsData,
  };
};

const mapDispatchToProps = (dispatch) => {
  const subscriptions = [
    'telemetry-MTM2-0-ilcData',
    'telemetry-MTM2-0-axialActuatorSteps',
    'telemetry-MTM2-0-axialEncoderPositions',
    'telemetry-MTM2-0-axialForce',
    'telemetry-MTM2-0-tangentActuatorSteps',
    'telemetry-MTM2-0-tangentEncoderPositions',
    'telemetry-MTM2-0-tangentForce',
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

export default connect(mapStateToProps, mapDispatchToProps)(M2CompactContainer);
