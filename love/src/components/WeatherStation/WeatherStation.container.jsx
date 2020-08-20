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
    weather: getStreamData(state, `telemetry-Environment-${ownProps.salindex}-weather`),
    windSpeed: getStreamData(state, `telemetry-Environment-${ownProps.salindex}-windSpeed`),
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const subscriptions = [
    `telemetry-Environment-${ownProps.salindex}-weather`,
    `telemetry-Environment-${ownProps.salindex}-windDirection`,
    `telemetry-Environment-${ownProps.salindex}-windGustDirection`,
    `telemetry-Environment-${ownProps.salindex}-windSpeed`,
    `telemetry-Environment-${ownProps.salindex}-airTemperature`,
    `telemetry-Environment-${ownProps.salindex}-soilTemperature`,
    `telemetry-Environment-${ownProps.salindex}-dewPoint`,
    `telemetry-Environment-${ownProps.salindex}-relativeHumidity`,
    `telemetry-Environment-${ownProps.salindex}-snowDepth`,
    `telemetry-Environment-${ownProps.salindex}-precipitation`,
    `telemetry-Environment-${ownProps.salindex}-airPressure`,
    `telemetry-Environment-${ownProps.salindex}-solarNetRadiation`,
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
