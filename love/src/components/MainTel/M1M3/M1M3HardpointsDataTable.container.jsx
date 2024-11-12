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
import {
  getM1M3ForceControllerState,
  getM1M3HardpointActuatorData,
  getM1M3HardpointActuatorSettings,
  getM1M3HardpointMonitorData,
  getM1M3HardpointActuatorWarningData,
} from 'redux/selectors';
import SubscriptionTableContainer from 'components/GeneralPurpose/SubscriptionTable/SubscriptionTable.container';
import M1M3HardpointsDataTable from './M1M3HardpointsDataTable';

export const schema = {
  description: `Table containing low level information about the Simonyi M1M3 Hardpoints measures.`,
  defaultSize: [55, 14],
  props: {
    title: {
      type: 'string',
      description: 'Name diplayed in the title bar (if visible)',
      isPrivate: false,
      default: 'Simonyi M1M3 Hardpoints Data Table',
    },
  },
};

const M1M3HardpointsDataTableContainer = ({ ...props }) => {
  if (props.isRaw) {
    return <SubscriptionTableContainer subscriptions={props.subscriptions}></SubscriptionTableContainer>;
  }
  return <M1M3HardpointsDataTable {...props} />;
};

const mapStateToProps = (state) => {
  const m1m3ForceControllerState = getM1M3ForceControllerState(state);
  const m1m3HardpointActuatorData = getM1M3HardpointActuatorData(state);
  const m1m3HardpointActuatorSettings = getM1M3HardpointActuatorSettings(state);
  const m1m3HardpointMonitorData = getM1M3HardpointMonitorData(state);
  const m1m3HardpointActuatorWarningData = getM1M3HardpointActuatorWarningData(state);
  return {
    ...m1m3ForceControllerState,
    ...m1m3HardpointActuatorData,
    ...m1m3HardpointActuatorSettings,
    ...m1m3HardpointMonitorData,
    ...m1m3HardpointActuatorWarningData,
  };
};

const mapDispatchToProps = (dispatch) => {
  const subscriptions = [
    'telemetry-MTM1M3-0-hardpointActuatorData',
    'telemetry-MTM1M3-0-hardpointMonitorData',
    'event-MTM1M3-0-hardpointActuatorWarning',
    'event-MTM1M3-0-forceControllerState',
    'event-MTM1M3-0-hardpointActuatorSettings',
  ];
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

export default connect(mapStateToProps, mapDispatchToProps)(M1M3HardpointsDataTableContainer);
