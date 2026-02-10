import React from 'react';
import { connect } from 'react-redux';
import MTDome from './MTDome';
import {
  getDomeStatus,
  getLouversStatus,
  getApertureShutter,
  getDomeAzimuth,
  getLightWindScreen,
  getPointingStatus,
  getMainTelescopeState,
} from '../../../redux/selectors';
import { addGroup, removeGroup } from '../../../redux/actions/ws';
import SubscriptionTableContainer from '../../GeneralPurpose/SubscriptionTable/SubscriptionTable.container';

export const schema = {
  description: 'Summary view of the Simonyi Dome. Contains general information about the dome and louvers state',
  defaultSize: [51, 45],
  props: {
    title: {
      type: 'string',
      description: 'Name displayed in the title bar (if visible)',
      isPrivate: false,
      default: 'Simonyi Telescope Dome',
    },
  },
};

const MTDomeContainer = ({ subscribeToStream, unsubscribeToStream, ...props }) => {
  if (props.isRaw) {
    return <SubscriptionTableContainer subscriptions={props.subscriptions}></SubscriptionTableContainer>;
  }
  return <MTDome subscribeToStream={subscribeToStream} unsubscribeToStream={unsubscribeToStream} />;
};

const mapStateToProps = (state) => {
  const domeState = getDomeStatus(state);
  const louversState = getLouversStatus(state);
  const apertureShutterState = getApertureShutter(state);
  const lightWindScreenState = getLightWindScreen(state);
  const domeAzimuthState = getDomeAzimuth(state);
  const pointingState = getPointingStatus(state);
  const telescopeState = getMainTelescopeState(state);
  return {
    ...domeState,
    ...louversState,
    ...apertureShutterState,
    ...lightWindScreenState,
    ...domeAzimuthState,
    ...pointingState,
    ...telescopeState,
  };
};

const mapDispatchToProps = (dispatch) => {
  const subscriptions = [
    'telemetry-MTDome-0-apertureShutter',
    'telemetry-MTDome-0-azimuth',
    'telemetry-MTDome-0-lightWindScreen',
    'telemetry-MTDome-0-louvers',
    'telemetry-MTMount-0-azimuth',
    'telemetry-MTMount-0-elevation',
    'telemetry-MTPtg-0-mountStatus',
    'telemetry-MTPtg-0-mountPosition',
    'event-MTDome-0-azEnabled',
    'event-MTDome-0-azMotion',
    'event-MTDome-0-azTarget',
    'event-MTDome-0-operationalMode',
    'event-MTMount-0-target',
    'event-MTDome-0-summaryState',
    'event-MTMount-0-summaryState',
    'event-MTPtg-0-currentTarget',
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

export default connect(mapStateToProps, mapDispatchToProps)(MTDomeContainer);
