/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed for Inria Chile.

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
  getM1M3HardpointActuatorData,
  getM1M3ActuatorsData,
  getM1M3IMSData,
  getM1M3AppliedForces,
} from 'redux/selectors';
import SubscriptionTableContainer from 'components/GeneralPurpose/SubscriptionTable/SubscriptionTable.container';
import M1M3Table from './M1M3Table';

export const schema = {
  description: `Table containing low level information about the Simonyi M1M3 forces`,
  defaultSize: [55, 14],
  props: {
    title: {
      type: 'string',
      description: 'Name diplayed in the title bar (if visible)',
      isPrivate: false,
      default: 'Simonyi M1M3 Forces',
    },
  },
};

const M1M3TableContainer = ({ ...props }) => {
  if (props.isRaw) {
    return <SubscriptionTableContainer subscriptions={props.subscriptions}></SubscriptionTableContainer>;
  }
  return <M1M3Table {...props} />;
};

const mapStateToProps = (state) => {
  const m1m3State = getM1M3State(state);
  const m1m3HardpointActuatorData = getM1M3HardpointActuatorData(state);
  const m1m3ActuatorsData = getM1M3ActuatorsData(state);
  const m1m3IMSData = getM1M3IMSData(state);
  const m1m3AppliedForces = getM1M3AppliedForces(state);
  return {
    ...m1m3State,
    ...m1m3HardpointActuatorData,
    ...m1m3ActuatorsData,
    ...m1m3IMSData,
    ...m1m3AppliedForces,
  };
};

const mapDispatchToProps = (dispatch) => {
  const subscriptions = [
    'telemetry-MTM1M3-0-forceActuatorData',
    'telemetry-MTM1M3-0-hardpointActuatorData',
    'telemetry-MTM1M3-0-imsData',
    'telemetry-MTM1M3-0-appliedForces',
    'event-MTM1M3-0-summaryState',
    'event-MTM1M3-0-detailedState',
  ];
  return {
    subscriptions,
    subscribeToStream: () => {
      subscriptions.forEach((stream) => dispatch(addGroup(stream)));
    },
    unsubscribeToStream: () => {
      subscriptions.forEach((stream) => dispatch(removeGroup(stream)));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(M1M3TableContainer);
