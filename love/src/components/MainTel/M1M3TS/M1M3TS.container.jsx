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
  getM1M3TSState,
  getM1M3TSThermalState,
  getM1M3TSTemperatureState,
  getM1M3TSMixingState,
  getM1M3TSWarningState,
} from 'redux/selectors';
import SubscriptionTableContainer from 'components/GeneralPurpose/SubscriptionTable/SubscriptionTable.container';
import M1M3TS from './M1M3TS';

export const schema = {
  description: 'View of M1M3 Thermal System',
  defaultSize: [60, 47],
  props: {
    title: {
      type: 'string',
      description: 'Name diplayed in the title bar (if visible)',
      isPrivate: false,
      default: 'M1M3 Thermal System',
    },
    minTemperatureLimit: {
      type: 'number',
      description: 'Minimum Temperature limit',
      isPrivate: false,
      default: -6000,
    },
    maxTemperatureLimit: {
      type: 'number',
      description: 'Maximum Temperature limit',
      isPrivate: false,
      default: 6000,
    },
    hasRawMode: {
      type: 'boolean',
      description: 'Whether the component has a raw mode version',
      isPrivate: false,
      default: true,
    },
  },
};

const M1M3TSContainer = (props) => {
  if (props.isRaw) {
    return <SubscriptionTableContainer subscriptions={props.subscriptions}></SubscriptionTableContainer>;
  }
  return <M1M3TS {...props} />;
};

const mapStateToProps = (state) => {
  const m1m3TSState = getM1M3TSState(state);
  const m1m3TSThermalState = getM1M3TSThermalState(state);
  const m1m3TSTemperatureState = getM1M3TSTemperatureState(state);
  const m1m3TSMixingState = getM1M3TSMixingState(state);
  const thermalWarnings = getM1M3TSWarningState(state);

  return {
    ...m1m3TSState,
    ...m1m3TSThermalState,
    ...m1m3TSTemperatureState,
    ...m1m3TSMixingState,
    thermalWarnings,
  };
};

const mapDispatchToProps = (dispatch) => {
  const subscriptions = [
    'event-MTM1M3TS-0-summaryState',
    'event-MTM1M3TS-0-enabledILC',
    'event-MTM1M3TS-0-powerStatus',
    'event-MTM1M3TS-0-thermalInfo',
    'event-MTM1M3TS-0-thermalSettings',
    'event-MTM1M3TS-0-appliedSetpoint',
    'event-MTM1M3TS-0-thermalWarning',
    'telemetry-MTM1M3TS-0-mixingValve',
    'telemetry-MTM1M3TS-0-thermalData',
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
export default connect(mapStateToProps, mapDispatchToProps)(M1M3TSContainer);
