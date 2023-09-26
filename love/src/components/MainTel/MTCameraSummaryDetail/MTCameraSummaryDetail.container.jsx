/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed by Inria Chile.

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
import MTCameraSummaryDetail from './MTCameraSummaryDetail';
import {
  getMTCameraSummary,
  getStartIntegration,
  getStartReadout,
  getEndReadout,
  getEndOfImageTelemetry,
} from '../../../redux/selectors';
import { addGroup, removeGroup } from '../../../redux/actions/ws';
import SubscriptionTableContainer from '../../GeneralPurpose/SubscriptionTable/SubscriptionTable.container';

export const schema = {
  description: 'Summary view of the MTCamera. Contains information about its current state and exposures table',
  defaultSize: [49, 17],
  props: {
    title: {
      type: 'string',
      description: 'Name displayed in the title bar (if visible)',
      isPrivate: false,
      default: 'Main Telescope Camera',
    },
  },
};

const MTCameraSummaryDetailContainer = ({
  subscribeToStream,
  unsubscribeToStream,
  mtcameraSummaryState,
  mtcameraCcsCmdState,
  mtcameraCalibrationDetailedStatus,
  mtcameraOffLineDetailedState,
  mtcameraImageReadinessDetailedState,
  mtCameraShutterDetailedState,
  mtCameraFilterChangerDetailedState,
  mtCameraRaftsDetailedState,
  ...props
}) => {
  if (props.isRaw) {
    return <SubscriptionTableContainer subscriptions={props.subscriptions}></SubscriptionTableContainer>;
  }
  return (
    <MTCameraSummaryDetail
      mtcameraSummaryState={mtcameraSummaryState}
      mtcameraCcsCmdState={mtcameraCcsCmdState}
      mtcameraCalibrationDetailedStatus={mtcameraCalibrationDetailedStatus}
      mtcameraOffLineDetailedState={mtcameraOffLineDetailedState}
      mtcameraImageReadinessDetailedState={mtcameraImageReadinessDetailedState}
      mtCameraShutterDetailedState={mtCameraShutterDetailedState}
      mtCameraFilterChangerDetailedState={mtCameraFilterChangerDetailedState}
      mtCameraRaftsDetailedState={mtCameraRaftsDetailedState}
      {...props}
    />
  );
};

const mapStateToProps = (state) => {
  const summaryStatus = getMTCameraSummary(state);
  const startIntegration = getStartIntegration(state);
  const startReadout = getStartReadout(state);
  const endReadout = getEndReadout(state);
  const endOfImageTelemetry = getEndOfImageTelemetry(state);
  return {
    ...summaryStatus,
    ...startIntegration,
    ...startReadout,
    ...endReadout,
    ...endOfImageTelemetry,
  };
};

const mapDispatchToProps = (dispatch) => {
  const subscriptions = [
    'event-MTCamera-0-summaryState',
    'event-MTCamera-0-ccsCommandState',
    'event-MTCamera-0-calibrationDetailedState',
    'event-MTCamera-0-offlineDetailedState',
    'event-MTCamera-0-imageReadinessDetailedState',
    'event-MTCamera-0-shutterDetailedState',
    'event-MTCamera-0-filterChangerDetailedState',
    'event-MTCamera-0-raftsDetailedState',
    'event-MTCamera-0-startIntegration',
    'event-MTCamera-0-startReadout',
    'event-MTCamera-0-endReadout',
    'event-MTCamera-0-endOfImageTelemetry',
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

export default connect(mapStateToProps, mapDispatchToProps)(MTCameraSummaryDetailContainer);
