/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed for Inria Chile.

This program is free software: you can redistribute it and/or modify it under 
the terms of the GNU General Public License as published by the Free Software 
Foundation, either version 3 of the License, or at your option) any later version.

This program is distributed in the hope that it will be useful,but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR 
 A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with 
this program. If not, see <http://www.gnu.org/licenses/>.
*/

import React from 'react';
import { connect } from 'react-redux';
import Dome from './Dome';
import { getDomeState, getATMCSState } from '../../../redux/selectors';
import { addGroup, removeGroup } from '../../../redux/actions/ws';
import SubscriptionTableContainer from '../../GeneralPurpose/SubscriptionTable/SubscriptionTable.container';
import { EUIs } from 'Config';

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
    EUI: {
      type: 'boolean',
      description: 'Whether the component has a EUI link',
      isPrivate: false,
      default: EUIs.ATDOME,
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
  atDomeSummaryState,
  ATMCSSummaryState,
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
      atDomeSummaryState={atDomeSummaryState}
      ATMCSSummaryState={ATMCSSummaryState}
    />
  );
};

const mapStateToProps = (state) => {
  const domeState = getDomeState(state);
  const mountState = getATMCSState(state);
  return { ...domeState, ...mountState };
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
    'event-ATDome-0-summaryState',
    'event-ATMCS-0-summaryState',
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
