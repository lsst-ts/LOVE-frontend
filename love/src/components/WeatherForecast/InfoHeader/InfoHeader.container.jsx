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
import { getInfoHeaderDailyTrend, getInfoHeaderHourlyTrend, getWeatherForecastState } from 'redux/selectors';
import SubscriptionTableContainer from 'components/GeneralPurpose/SubscriptionTable/SubscriptionTable.container';
import InfoHeader from './InfoHeader';

export const schema = {
  description: 'View of Info Header of Weather Forecast',
  defaultSize: [70, 12],
  props: {
    title: {
      type: 'string',
      description: 'Name diplayed in the title bar (if visible)',
      isPrivate: false,
      default: 'Info Header Weather Forecast',
    },
    frecuency: {
      type: 'string',
      description: 'Frecuency option between "hourly" and "daily"',
      isPrivate: false,
      default: 'daily',
    },
    hasRawMode: {
      type: 'boolean',
      description: 'Whether the component has a raw mode version',
      isPrivate: false,
      default: true,
    },
  },
};

const InfoHeaderContainer = ({ ...props }) => {
  if (props.isRaw) {
    return <SubscriptionTableContainer subscriptions={props.subscriptions}></SubscriptionTableContainer>;
  }
  return <InfoHeader daily={props.daily} hourly={props.hourly} {...props} />;
};

const mapStateToProps = (state) => {
  const weatherForecastState = getWeatherForecastState(state);
  const daily = getInfoHeaderDailyTrend(state);
  const hourly = getInfoHeaderHourlyTrend(state);
  return { ...weatherForecastState, daily, hourly };
};

const mapDispatchToProps = (dispatch) => {
  const subscriptions = ['telemetry-WeatherForecast-0-dailyTrend', 'telemetry-WeatherForecast-0-hourlyTrend'];
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

export default connect(mapStateToProps, mapDispatchToProps)(InfoHeaderContainer);
