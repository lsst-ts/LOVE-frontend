import React from 'react';
import { connect } from 'react-redux';
import { addGroup, removeGroup } from '../../redux/actions/ws';
import { getStreamData } from '../../redux/selectors';
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
      description:
        "Whether to display controls to configure periods of time'",
      default: true,
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
  return {
    weather: getStreamData(state, `telemetry-WeatherStation-${ownProps.salindex}-weather`),
    windSpeed: getStreamData(state, `telemetry-WeatherStation-${ownProps.salindex}-windSpeed`),
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const subscriptions = [
    `telemetry-WeatherStation-${ownProps.salindex}-weather`,
    `telemetry-WeatherStation-${ownProps.salindex}-windDirection`,
    `telemetry-WeatherStation-${ownProps.salindex}-windGustDirection`,
    `telemetry-WeatherStation-${ownProps.salindex}-windSpeed`,
    `telemetry-WeatherStation-${ownProps.salindex}-airTemperature`,
    `telemetry-WeatherStation-${ownProps.salindex}-soilTemperature`,
    `telemetry-WeatherStation-${ownProps.salindex}-dewPoint`,
    `telemetry-WeatherStation-${ownProps.salindex}-relativeHumidity`,
    `telemetry-WeatherStation-${ownProps.salindex}-snowDepth`,
    `telemetry-WeatherStation-${ownProps.salindex}-precipitation`,
    `telemetry-WeatherStation-${ownProps.salindex}-airPressure`,
    `telemetry-WeatherStation-${ownProps.salindex}-solarNetRadiation`,
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
  salindex: 1,
};

export default connectedContainer;
