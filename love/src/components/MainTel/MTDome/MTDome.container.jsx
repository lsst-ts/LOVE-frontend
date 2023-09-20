/** This file is part of LOVE-frontend.

Developed for Inria Chile Tech Team.

See the COPYRIGHT file at the top-level directory of this distribution
for details of code ownership.

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.*/

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
  mtDomeSummaryState,
  mtMountSummaryState,
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
    <MTDome
      subscribeToStream={subscribeToStream}
      unsubscribeToStream={unsubscribeToStream}
      trackId={trackId}
      mtDomeSummaryState={mtDomeSummaryState}
      mtMountSummaryState={mtMountSummaryState}
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
    'telemetry-MTMount-0-azimuth',
    'telemetry-MTMount-0-elevation',
    'event-MTDome-0-azEnabled',
    'event-MTDome-0-azMotion',
    'event-MTDome-0-azTarget',
    'event-MTDome-0-operationalMode',
    'event-MTMount-0-target',
    'event-MTDome-0-summaryState',
    'event-MTMount-0-summaryState',
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
