import React from 'react';
import { connect } from 'react-redux';
import Dome from './MTDome';
import {
  getDomeStatus,
  getLouversStatus,
  getApertureShutter,
  getDomeAzimuth,
  getLightWindScreen,
} from '../../../redux/selectors';
import { addGroup, removeGroup } from '../../../redux/actions/ws';
import SubscriptionTableContainer from '../../GeneralPurpose/SubscriptionTable/SubscriptionTable.container';

export const schema = {
  description: 'Summary view of the MTDome. Contains general information about the dome and louvers state',
  defaultSize: [51, 45],
  props: {
    title: {
      type: 'string',
      description: 'Name displayed in the title bar (if visible)',
      isPrivate: false,
      default: 'Main Telescope Dome',
    },
    controls: {
      type: 'boolean',
      description: "Whether to display controls to configure periods of time'",
      default: true,
      isPrivate: false,
    },
  },
};

const MTDomeContainer = ({
  subscribeToStream,
  unsubscribeToStream,
  positionActualShutter,
  positionCommandedShutter,
  positionActualDomeAz,
  positionCommandedDomeAz,
  positionActualLightWindScreen,
  positionCommandedLightWindScreen,
  actualPositionLouvers,
  commandedPositionLouvers,
  azimuthDomeState,
  azimuthDomeMotion,
  azimuthDomeTarget,
  elevationDomeState,
  elevationDomeMotion,
  elevationDomeTarget,
  modeDomeStatus,
  ...props
}) => {
  if (props.isRaw) {
    return <SubscriptionTableContainer subscriptions={props.subscriptions}></SubscriptionTableContainer>;
  }
  return (
    <Dome
      subscribeToStream={subscribeToStream}
      unsubscribeToStream={unsubscribeToStream}
      positionActualShutter={positionActualShutter}
      positionCommandedShutter={positionCommandedShutter}
      positionActualDomeAz={positionActualDomeAz}
      positionCommandedDomeAz={positionCommandedDomeAz}
      positionActualLightWindScreen={positionActualLightWindScreen}
      positionCommandedLightWindScreen={positionCommandedLightWindScreen}
      actualPositionLouvers={actualPositionLouvers}
      commandedPositionLouvers={commandedPositionLouvers}
      azimuthDomeState={azimuthDomeState}
      azimuthDomeMotion={azimuthDomeMotion}
      azimuthDomeTarget={azimuthDomeTarget}
      elevationDomeState={elevationDomeState}
      elevationDomeMotion={elevationDomeMotion}
      elevationDomeTarget={elevationDomeTarget}
      modeDomeStatus={modeDomeStatus}
    />
  );
};

const mapStateToProps = (state) => {
  const domeState = getDomeStatus(state);
  const louversState = getLouversStatus(state);
  const apertureShutterState = getApertureShutter(state);
  const lightWindScreenState = getLightWindScreen(state);
  const domeAzimuthState = getDomeAzimuth(state);
  return { ...domeState, ...louversState, ...apertureShutterState, ...lightWindScreenState, ...domeAzimuthState };
};

const mapDispatchToProps = (dispatch) => {
  const subscriptions = [
    'telemetry-MTDome-0-apertureShutter',
    'telemetry-MTDome-0-azimuth',
    'telemetry-MTDome-0-lightWindScreen',
    'telemetry-MTDome-0-louvers',
    'event-MTDome-0-logevent_azEnabled',
    'event-MTDome-0-logevent_azMotion',
    'event-MTDome-0-logevent_azTarget',
    'event-MTDome-0-logevent_elEnabled',
    'event-MTDome-0-logevent_elMotion',
    'event-MTDome-0-logevent_elTarget',
    'event-MTDome-0-logevent_operationalMode',
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
