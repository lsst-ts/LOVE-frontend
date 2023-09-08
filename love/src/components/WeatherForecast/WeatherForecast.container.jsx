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
import { getWeatherForecastState, getInfoHeaderDailyTrend, getInfoHeaderHourlyTrend } from 'redux/selectors';
import SubscriptionTableContainer from 'components/GeneralPurpose/SubscriptionTable/SubscriptionTable.container';
import WeatherForecast from './WeatherForecast';

export const schema = {
  description: 'View of Weather Forecast',
  defaultSize: [65, 88],
  props: {
    title: {
      type: 'string',
      description: 'Name diplayed in the title bar (if visible)',
      isPrivate: false,
      default: 'Weather Forecast',
    },
    controls: {
      type: 'boolean',
      description: "Whether to display controls to configure periods of time'",
      default: true,
      isPrivate: false,
    },
    hasRawMode: {
      type: 'boolean',
      description: 'Whether the component has a raw mode version',
      isPrivate: false,
      default: true,
    },
    infoHeader: {
      type: 'boolean',
      description: "Whether to display info header'",
      default: true,
      isPrivate: false,
    },
    cloud: {
      type: 'boolean',
      description: "Whether to display plot of cloud'",
      default: true,
      isPrivate: false,
    },
    wind: {
      type: 'boolean',
      description: "Whether to display plot of wind'",
      default: true,
      isPrivate: false,
    },
    temperature: {
      type: 'boolean',
      description: "Whether to display plot of temperature'",
      default: true,
      isPrivate: false,
    },
    rain: {
      type: 'boolean',
      description: "Whether to display  plot of precipitation'",
      default: true,
      isPrivate: false,
    },
  },
};

const WeatherForecastContainer = ({ ...props }) => {
  if (props.isRaw) {
    return <SubscriptionTableContainer subscriptions={props.subscriptions}></SubscriptionTableContainer>;
  }
  return <WeatherForecast {...props} />;
};

const mapStateToProps = (state) => {
  const weatherForecastState = getWeatherForecastState(state);
  const daily = getInfoHeaderDailyTrend(state);
  const hourly = getInfoHeaderHourlyTrend(state);
  return { ...weatherForecastState, daily, hourly };
};

const mapDispatchToProps = (dispatch) => {
  const subscriptions = [
    'event-WeatherForecast-0-summaryState',
    'telemetry-WeatherForecast-0-dailyTrend',
    'telemetry-WeatherForecast-0-hourlyTrend',
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
export default connect(mapStateToProps, mapDispatchToProps)(WeatherForecastContainer);
