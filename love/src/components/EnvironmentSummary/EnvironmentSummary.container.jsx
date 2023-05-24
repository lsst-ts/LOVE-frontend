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
  subscribeToStream,
  unsubscribeToStream,
  simonyiTrackingState,
  simonyiAltitude,
  simonyiAzimuth,
  simonyiRotator,
  simonyiDomeAlt,
  simonyiDomeAz,
  simonyiMoonRa,
  simonyiMoonDec,
  simonyiSunRa,
  simonyiSunDec,
  auxtelTrackingState,
  auxtelAltitude,
  auxtelAzimuth,
  auxtelRotator,
  auxtelDomeAlt,
  auxtelDomeAz,
  ...props
}) => {
  if (props.isRaw) {
    return <SubscriptionTableContainer subscriptions={props.subscriptions}></SubscriptionTableContainer>;
  }
  return (
    <EnvironmentSummary
      subscribeToStream={subscribeToStream}
      unsubscribeToStream={unsubscribeToStream}
      simonyiTrackingState={simonyiTrackingState}
      simonyiAltitude={simonyiAltitude}
      simonyiAzimuth={simonyiAzimuth}
      simonyiRotator={simonyiRotator}
      simonyiDomeAlt={simonyiDomeAlt}
      simonyiDomeAz={simonyiDomeAz}
      simonyiMoonRa={simonyiMoonRa}
      simonyiMoonDec={simonyiMoonDec}
      simonyiSunRa={simonyiSunRa}
      simonyiSunDec={simonyiSunDec}
      auxtelTrackingState={auxtelTrackingState}
      auxtelAltitude={auxtelAltitude}
      auxtelAzimuth={auxtelAzimuth}
      auxtelRotator={auxtelRotator}
      auxtelDomeAlt={auxtelDomeAlt}
      auxtelDomeAz={auxtelDomeAz}
      {...props}
    />
  );
};

const mapStateToProps = (state) => {
  const environmentSummary = getObservatoryState(state);
  return {
    ...environmentSummary,
  };
};

const mapDispatchToProps = (dispatch) => {
  const subscriptions = [
    `telemetry-Scheduler-1-observatoryState`,
    `telemetry-Scheduler-2-observatoryState`,
    `event-Scheduler-1-target`,
  ];
  return {
    subscriptions,
    subscribeToStream: () => {
      subscriptions.forEach((stream) => dispatch(addGroup(stream)));
    },
    unsubscribeToStream: () => {
      subscriptions.forEach((stream) => dispatch(removeGroup(stream)));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EnvironmentSummaryContainer);
