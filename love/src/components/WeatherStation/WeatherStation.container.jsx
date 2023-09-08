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
import { addGroup, removeGroup } from '../../redux/actions/ws';
import { getESSstate } from '../../redux/selectors';
import SubscriptionTableContainer from '../GeneralPurpose/SubscriptionTable/SubscriptionTable.container';
import WeatherStation from './WeatherStation';

export const schema = {
  description: 'Component that displays the data coming from a weather station',
  defaultSize: [57, 35],
  props: {
    title: {
      type: 'string',
      description: 'Name diplayed in the title bar (if visible)',
      isPrivate: false,
      default: 'Weather station component',
    },
    hasRawMode: {
      type: 'boolean',
      description: 'Whether the component has a raw mode version',
      isPrivate: true,
      default: false,
    },
    controls: {
      type: 'boolean',
      description: "Whether to display controls to configure periods of time'",
      default: true,
      isPrivate: false,
    },
    salindex: {
      type: 'number',
      description: 'ESS Index the Weather Station listens to',
      default: '301',
      isPrivate: false,
    },
  },
};

const WeatherStationContainer = ({ ...props }) => {
  if (props.isRaw) {
    return <SubscriptionTableContainer subscriptions={props.subscriptions}></SubscriptionTableContainer>;
  }
  return <WeatherStation {...props} />;
};

const mapStateToProps = (state, ownProps) => {
  const ESSstate = getESSstate(state, ownProps.salindex);
  return {
    ...ESSstate,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const subscriptions = [
    `event-ESS-${ownProps.salindex}-highElectricField`,
    `event-ESS-${ownProps.salindex}-lightningStrike`,
    `event-ESS-${ownProps.salindex}-precipitation`,
    `event-ESS-${ownProps.salindex}-sensorStatus`,
    `telemetry-ESS-${ownProps.salindex}-accelerometer`,
    `telemetry-ESS-${ownProps.salindex}-accelerometerPSD`,
    `telemetry-ESS-${ownProps.salindex}-airFlow`,
    `telemetry-ESS-${ownProps.salindex}-airTurbulence`,
    `telemetry-ESS-${ownProps.salindex}-dewPoint`,
    `telemetry-ESS-${ownProps.salindex}-electricFieldStrength`,
    `telemetry-ESS-${ownProps.salindex}-lightningStrikeStatus`,
    `telemetry-ESS-${ownProps.salindex}-pressure`,
    `telemetry-ESS-${ownProps.salindex}-rainRate`,
    `telemetry-ESS-${ownProps.salindex}-relativeHumidity`,
    `telemetry-ESS-${ownProps.salindex}-snowRate`,
    `telemetry-ESS-${ownProps.salindex}-solarRadiation`,
    `telemetry-ESS-${ownProps.salindex}-spectrumAnalyzer`,
    `telemetry-ESS-${ownProps.salindex}-temperature`,
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
const connectedContainer = connect(mapStateToProps, mapDispatchToProps)(WeatherStationContainer);

connectedContainer.defaultProps = {
  salindex: 301,
};

export default connectedContainer;
