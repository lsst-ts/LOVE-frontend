import React from 'react';
import { connect } from 'react-redux';
import { addGroup, removeGroup } from 'redux/actions/ws';
import { getM1M3State} from 'redux/selectors';
import SubscriptionTableContainer from 'components/GeneralPurpose/SubscriptionTable/SubscriptionTable.container';
import WeatherForecast from './WeatherForecast';

export const schema = {
  description: 'View of Weather Forecast',
  defaultSize: [62, 65],
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

const WeatherForecastContainer = ({ subscribeToStreams, unsubscribeToStreams, ...props }) => {
  if (props.isRaw) {
    return <SubscriptionTableContainer subscriptions={props.subscriptions}></SubscriptionTableContainer>;
  }
  return <WeatherForecast subscribeToStreams={subscribeToStreams} unsubscribeToStreams={unsubscribeToStreams} {...props} />;
};

const mapStateToProps = (state) => {
  const weatherState = {}; // = getWeatherState(state);
  return { ...weatherState };
};

const mapDispatchToProps = (dispatch) => {
  const subscriptions = [
    'telemetry-WeatherForecast-0-WeatherForecast_dailyTrend',
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
export default connect(mapStateToProps, mapDispatchToProps)(WeatherForecastContainer);
