import React from 'react';
import { connect } from 'react-redux';
import EnvironmentSummary from './EnvironmentSummary';
import { addGroup, removeGroup } from 'redux/actions/ws';
import SubscriptionTableContainer from 'components/GeneralPurpose/SubscriptionTable/SubscriptionTable.container';
import { getObservatoryState } from 'redux/selectors';

export const schema = {
  description: 'Summary view of Environment Summary.',
  defaultSize: [74, 32],
  props: {
    title: {
      type: 'string',
      description: 'Name displayed in the title bar (if visible)',
      isPrivate: false,
      default: 'Environment Summary',
    },
  },
};

const EnvironmentSummaryContainer = ({
  subscribeToStreams,
  unsubscribeToStreams,
  simonyiTrackingState,
  simonyiRa,
  simonyiDec,
  simonyiAltitude,
  simonyiAzimuth,
  simonyiRotator,
  simonyiDomeAlt,
  simonyiDomeAz,
  simonyiMoonRa,
  simonyiMoonDec,
  simonyiMoonPhase,
  simonyiSunRa,
  simonyiSunDec,
  auxtelTrackingState,
  auxtelRa,
  auxtelDec,
  auxtelAltitude,
  auxtelAzimuth,
  auxtelRotator,
  auxtelDomeAlt,
  auxtelDomeAz,
  isRaining,
  isSnowing,
  numChannels,
  temperature,
  location,
  windDirection,
  windSpeed,
  ...props
}) => {
  if (props.isRaw) {
    return <SubscriptionTableContainer subscriptions={props.subscriptions}></SubscriptionTableContainer>;
  }
  return (
    <EnvironmentSummary
      subscribeToStreams={subscribeToStreams}
      unsubscribeToStreams={unsubscribeToStreams}
      simonyiTrackingState={simonyiTrackingState}
      simonyiRa={simonyiRa}
      simonyiDec={simonyiDec}
      simonyiAltitude={simonyiAltitude}
      simonyiAzimuth={simonyiAzimuth}
      simonyiRotator={simonyiRotator}
      simonyiDomeAlt={simonyiDomeAlt}
      simonyiDomeAz={simonyiDomeAz}
      simonyiMoonRa={simonyiMoonRa}
      simonyiMoonDec={simonyiMoonDec}
      simonyiMoonPhase={simonyiMoonPhase}
      simonyiSunRa={simonyiSunRa}
      simonyiSunDec={simonyiSunDec}
      auxtelTrackingState={auxtelTrackingState}
      auxtelRa={auxtelRa}
      auxtelDec={auxtelDec}
      auxtelAltitude={auxtelAltitude}
      auxtelAzimuth={auxtelAzimuth}
      auxtelRotator={auxtelRotator}
      auxtelDomeAlt={auxtelDomeAlt}
      auxtelDomeAz={auxtelDomeAz}
      isRaining={isRaining}
      isSnowing={isSnowing}
      numChannels={numChannels}
      temperature={temperature}
      location={location}
      windDirection={windDirection}
      windSpeed={windSpeed}
    />
  );
};

const mapStateToProps = (state) => {
  const environmentSummary = getObservatoryState(state);
  return environmentSummary;
};

const mapDispatchToProps = (dispatch) => {
  const subscriptions = [
    'event-Scheduler-1-observingMode',
    'event-Scheduler-2-observingMode',
    `telemetry-Scheduler-1-observatoryState`,
    `telemetry-Scheduler-2-observatoryState`,
    `event-Scheduler-1-target`,
    'event-ESS-301-precipitation',
    'telemetry-ESS-301-temperature',
    'telemetry-ESS-301-airFlow',
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

export default connect(mapStateToProps, mapDispatchToProps)(EnvironmentSummaryContainer);
