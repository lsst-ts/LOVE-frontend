/** 
This file is part of LOVE-frontend.

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
import { addGroup, removeGroup } from 'redux/actions/ws';
import { getGlycolSystemData } from 'redux/selectors';
import SubscriptionTableContainer from 'components/GeneralPurpose/SubscriptionTable/SubscriptionTable.container';
import { hvacDevicesMaxPowerKw } from 'Config';
import HeatMonitor from './HeatMonitor';

export const schema = {
  description:
    'Displays energy consumption of devices in the HVAC glycol cooling system. Based on telemetry from HVAC glycol sensors.',
  defaultSize: [77, 32],
  props: {
    title: {
      type: 'string',
      description: 'Name displayed in the title bar (if visible)',
      isPrivate: false,
      default: 'Glycol Heat Monitor',
    },
    hasRawMode: {
      type: 'boolean',
      description: 'Whether the component has a raw mode version',
      isPrivate: true,
      default: true,
    },
    devicesHeatThresholds: {
      type: 'object',
      description: 'Power max capacity (in kW) for each device to compute energy consumption percentage',
      isPrivate: false,
      default: hvacDevicesMaxPowerKw,
    },
  },
};

const Container = (props) => {
  if (props.isRaw) {
    return <SubscriptionTableContainer subscriptions={props.subscriptions}></SubscriptionTableContainer>;
  }
  return <HeatMonitor {...props} />;
};

const mapStateToProps = (state, ownProps) => {
  const glycolSystemData = getGlycolSystemData(state);
  return {
    ...glycolSystemData,
  };
};

const mapDispatchToProps = (dispatch) => {
  const subscriptions = ['event-HVAC-0-summaryState', 'telemetry-HVAC-0-glycolSensor', 'telemetry-HVAC-0-dynaleneP05'];
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

export default connect(mapStateToProps, mapDispatchToProps)(Container);
