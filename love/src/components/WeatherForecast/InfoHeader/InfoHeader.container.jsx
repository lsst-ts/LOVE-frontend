import React from 'react';
import { connect } from 'react-redux';
import { addGroup, removeGroup } from 'redux/actions/ws';
import { getInfoHeaderDailyTrend, getInfoHeaderHourlyTrend, getEfdConfig, getTaiToUtc } from 'redux/selectors';
import SubscriptionTableContainer from 'components/GeneralPurpose/SubscriptionTable/SubscriptionTable.container';
import InfoHeader from './InfoHeader';

export const schema = {
  description: 'View of Info Header of Weather Forecast',
  defaultSize: [62, 18],
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
  },
};


const InfoHeaderContainer = ({ subscribeToStreams, unsubscribeToStreams, ...props }) => {
  if (props.isRaw) {
    return <SubscriptionTableContainer subscriptions={props.subscriptions}></SubscriptionTableContainer>;
  }
  
  return <InfoHeader
      subscribeToStreams={subscribeToStreams}
      unsubscribeToStreams={unsubscribeToStreams}
      {...props}
    />;
};

const mapStateToProps = (state) => {
  const infoHeaderDailyTrend = getInfoHeaderDailyTrend(state);
  const infoHeaderHourlyTrend = getInfoHeaderHourlyTrend(state);
  const taiToUtc = getTaiToUtc(state);
  const efdConfigFile = getEfdConfig(state);

  return {
    infoHeaderDailyTrend,
    infoHeaderHourlyTrend,
    taiToUtc,
    efdConfigFile,
  };
};

const mapDispatchToProps = (dispatch) => {
  const subscriptions = [
    'telemetry-WeatherForecast-0-WeatherForecast_dailyTrend',
    'telemetry-WeatherForecast-0-WeatherForecast_hourlyTrend',
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
export default connect(mapStateToProps, mapDispatchToProps)(InfoHeaderContainer);
