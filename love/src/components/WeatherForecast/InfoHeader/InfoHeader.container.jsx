import React from 'react';
import { connect } from 'react-redux';
import { addGroup, removeGroup } from 'redux/actions/ws';
// getEfdConfig, getTaiToUtc 
import { getInfoHeaderDailyTrend, getInfoHeaderHourlyTrend, getWeatherForecastState} from 'redux/selectors';
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
  return <InfoHeader {...props} />;
};

const mapStateToProps = (state) => {
  const weatherForecastState = getWeatherForecastState(state);
  const daily = getInfoHeaderDailyTrend(state);
  const hourly = getInfoHeaderHourlyTrend(state);
  return { ...weatherForecastState, daily, hourly };
};

const mapDispatchToProps = (dispatch) => {
  const subscriptions = [
    // 'event-WeatherForecast-0-summaryState',
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

export default connect(mapStateToProps, mapDispatchToProps)(InfoHeaderContainer);
