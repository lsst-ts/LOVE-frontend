import React from 'react';
import { connect } from 'react-redux';
import Dome from './Dome';
import { getDomeState, getATMCSState } from '../../../redux/selectors';
import { addGroup, removeGroup } from '../../../redux/actions/ws';
import SubscriptionTableContainer from '../../GeneralPurpose/SubscriptionTable/SubscriptionTable.container';

export const schema = {
  description: 'Summary view of the ATDome. Contains general information about the dome and mount state',
  defaultSize: [51, 45],
  props: {
    title: {
      type: 'string',
      description: 'Name diplayed in the title bar (if visible)',
      isPrivate: false,
      default: 'Dome',
    },
    controls: {
      type: 'boolean',
      description: "Whether to display controls to configure periods of time'",
      default: true,
      isPrivate: false,
    },
  },
};

const DomeContainer = ({
  dropoutDoorOpeningPercentage,
  mainDoorOpeningPercentage,
  azimuthPosition,
  azimuthState,
  azimuthCommanded,
  domeInPosition,
  dropoutDoorState,
  mainDoorState,
  detailedState,
  atMountState,
  mountInPosition,
  trackID,
  targetAzimuth,
  targetElevation,
  targetNasmyth1,
  targetNasmyth2,
  m3State,
  minEl,
  maxEl,
  timeAzLim,
  timeRotLim,
  timeUnobservable,
  timeElHighLimit,
  currentPointingAz,
  currentPointingEl,
  currentPointingNasmyth1,
  currentPointingNasmyth2,
  width,
  height,
  subscribeToStream,
  unsubscribeToStream,
  controls,
  ...props
}) => {
  if (props.isRaw) {
    return <SubscriptionTableContainer subscriptions={props.subscriptions}></SubscriptionTableContainer>;
  }

  return (
    <Dome
      dropoutDoorOpeningPercentage={dropoutDoorOpeningPercentage}
      mainDoorOpeningPercentage={mainDoorOpeningPercentage}
      azimuthPosition={azimuthPosition}
      azimuthState={azimuthState}
      azimuthCommanded={azimuthCommanded}
      domeInPosition={domeInPosition}
      dropoutDoorState={dropoutDoorState}
      mainDoorState={mainDoorState}
      atMountState={atMountState}
      mountInPosition={mountInPosition}
      trackID={trackID}
      targetAzimuth={targetAzimuth}
      targetElevation={targetElevation}
      targetNasmyth1={targetNasmyth1}
      targetNasmyth2={targetNasmyth2}
      m3State={m3State}
      minEl={minEl}
      maxEl={maxEl}
      timeAzLim={timeAzLim}
      timeRotLim={timeRotLim}
      timeUnobservable={timeUnobservable}
      timeElHighLimit={timeElHighLimit}
      currentPointingAz={currentPointingAz}
      currentPointingEl={currentPointingEl}
      currentPointingNasmyth1={currentPointingNasmyth1}
      currentPointingNasmyth2={currentPointingNasmyth2}
      subscribeToStream={subscribeToStream}
      unsubscribeToStream={unsubscribeToStream}
      width={width}
      height={height}
      controls={controls}
    />
  );
};

const mapStateToProps = (state) => {
  const domeState = getDomeState(state);
  const mountState = getATMCSState(state);
  return {...domeState, ...mountState};
};

const mapDispatchToProps = (dispatch) => {
  const subscriptions = [
    'telemetry-ATDome-0-position',
    'event-ATDome-0-azimuthState',
    'event-ATDome-0-azimuthCommandedState',
    'event-ATDome-0-dropoutDoorState',
    'event-ATDome-0-mainDoorState',
    'event-ATDome-0-allAxesInPosition',
    'telemetry-ATMCS-0-mount_AzEl_Encoders',
    'telemetry-ATMCS-0-mount_Nasmyth_Encoders',
    'event-ATMCS-0-atMountState',
    'event-ATMCS-0-target',
    'event-ATMCS-0-allAxesInPosition',
    'event-ATMCS-0-m3State',
    'event-ATMCS-0-positionLimits',
    'event-ATPtg-1-timesOfLimits',
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

export default connect(mapStateToProps, mapDispatchToProps)(DomeContainer);
