import React from 'react';
import { connect } from 'react-redux';
import Dome from './MTDome';
import {
  getDomeStatus,
  getLouversStatus,
  getApertureShutter,
  getDomeAzimuth,
  getLightWindScreen,
  getPointingStatus,
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
  trackId,
  mtdomeSummaryState,
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
  currentPointingAz,
  targetPointingAz,
  currentPointingEl,
  targetPointingEl,
  ...props
}) => {
  if (props.isRaw) {
    return <SubscriptionTableContainer subscriptions={props.subscriptions}></SubscriptionTableContainer>;
  }
  return (
    <Dome
      subscribeToStream={subscribeToStream}
      unsubscribeToStream={unsubscribeToStream}
      trackId={trackId}
      mtdomeSummaryState={mtdomeSummaryState}
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
      currentPointingAz={currentPointingAz}
      targetPointingAz={targetPointingAz}
      currentPointingEl={currentPointingEl}
      targetPointingEl={targetPointingEl}
    />
  );
};

const mapStateToProps = (state) => {
  const domeState = getDomeStatus(state);
  const louversState = getLouversStatus(state);
  const apertureShutterState = getApertureShutter(state);
  const lightWindScreenState = getLightWindScreen(state);
  const domeAzimuthState = getDomeAzimuth(state);
  const pointingState = getPointingStatus(state);
  return {
    ...domeState,
    ...louversState,
    ...apertureShutterState,
    ...lightWindScreenState,
    ...domeAzimuthState,
    ...pointingState,
  };
};

const mapDispatchToProps = (dispatch) => {
  const subscriptions = [
    'telemetry-MTDome-0-apertureShutter',
    'telemetry-MTDome-0-azimuth',
    'telemetry-MTDome-0-lightWindScreen',
    'telemetry-MTDome-0-louvers',
    'event-MTDome-0-azEnabled',
    'event-MTDome-0-azMotion',
    'event-MTDome-0-azTarget',
    'event-MTDome-0-elEnabled',
    'event-MTDome-0-elMotion',
    'event-MTDome-0-elTarget',
    'event-MTDome-0-operationalMode',
    'event-MTMount-0-target',
    'event-MTMount-0-target',
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
