import React from 'react';
import { connect } from 'react-redux';
import { addGroup, removeGroup } from '../../redux/actions/ws';
import { getStreamData } from '../../redux/selectors';
import SubscriptionTableContainer from '../GeneralPurpose/SubscriptionTable/SubscriptionTable.container';
import WeatherForecast from './WeatherForecast';

export const schema = {
  description: 'Component that displays the data coming from a weather station',
  defaultSize: [57, 35],
  props: {
    title: {
      type: 'string',
      description: 'Name diplayed in the title bar (if visible)',
      isPrivate: false,
      default: 'Weather forecast component',
    },
    salindex: {
      type: 'number',
      description: 'Salindex of the CSC',
      isPrivate: false,
      default: 1,
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
  },
};

const WeatherForecastContainer = ({ ...props }) => {
  if (props.isRaw) {
    return <SubscriptionTableContainer subscriptions={props.subscriptions}></SubscriptionTableContainer>;
  }
  return <WeatherForecast {...props} />;
};

const mapStateToProps = (state, ownProps) => {
  return {
    weather: getStreamData(state, `telemetry-WeatherForecast-${ownProps.salindex}-weather`),
    windSpeed: getStreamData(state, `telemetry-WeatherForecast-${ownProps.salindex}-windSpeed`),
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const subscriptions = [
    `telemetry-WeatherForecast-${ownProps.salindex}-weather`,
    `telemetry-WeatherForecast-${ownProps.salindex}-windDirection`,
    `telemetry-WeatherForecast-${ownProps.salindex}-windGustDirection`,
    `telemetry-WeatherForecast-${ownProps.salindex}-windSpeed`,
    `telemetry-WeatherForecast-${ownProps.salindex}-airTemperature`,
    `telemetry-WeatherForecast-${ownProps.salindex}-soilTemperature`,
    `telemetry-WeatherForecast-${ownProps.salindex}-dewPoint`,
    `telemetry-WeatherForecast-${ownProps.salindex}-relativeHumidity`,
    `telemetry-WeatherForecast-${ownProps.salindex}-snowDepth`,
    `telemetry-WeatherForecast-${ownProps.salindex}-precipitation`,
    `telemetry-WeatherForecast-${ownProps.salindex}-airPressure`,
    `telemetry-WeatherForecast-${ownProps.salindex}-solarNetRadiation`,
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
const connectedContainer = connect(mapStateToProps, mapDispatchToProps)(WeatherForecastContainer);

connectedContainer.defaultProps = {
  salindex: 1,
};

export default connectedContainer;
