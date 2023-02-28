import React from 'react';
import { connect } from 'react-redux';
import { addGroup, removeGroup } from 'redux/actions/ws';
import { getWeatherForecastState, getInfoHeaderDailyTrend, getInfoHeaderHourlyTrend} from 'redux/selectors';
import SubscriptionTableContainer from 'components/GeneralPurpose/SubscriptionTable/SubscriptionTable.container';
import WeatherForecast from './WeatherForecast';

export const schema = {
  description: 'View of Weather Forecast',
  defaultSize: [65, 87],
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
    // 'telemetry-ATMCS-0-mount_AzEl_Encoders',
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
