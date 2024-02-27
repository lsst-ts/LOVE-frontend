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
import CCCameraSummaryDetail from './CCCameraSummaryDetail';
import {
  getCCCameraSummary,
  getCCStartIntegration,
  getCCStartReadout,
  getCCEndReadout,
  getCCEndOfImageTelemetry,
} from '../../../redux/selectors';
import { addGroup, removeGroup } from '../../../redux/actions/ws';
import SubscriptionTableContainer from '../../GeneralPurpose/SubscriptionTable/SubscriptionTable.container';

export const schema = {
  description: 'Summary view of the CCCamera. Contains information about its current state and exposures table',
  defaultSize: [49, 17],
  props: {
    title: {
      type: 'string',
      description: 'Name displayed in the title bar (if visible)',
      isPrivate: false,
      default: 'Commissioning Camera',
    },
  },
};

const CCCameraSummaryDetailContainer = ({
  subscribeToStreams,
  unsubscribeToStreams,
  cccameraSummaryState,
  cccameraCcsCmdState,
  cccameraCalibrationDetailedStatus,
  cccameraOffLineDetailedState,
  cccameraImageReadinessDetailedState,
  ccCameraShutterDetailedState,
  ccCameraFilterChangerDetailedState,
  ccCameraRaftsDetailedState,
  ...props
}) => {
  if (props.isRaw) {
    return <SubscriptionTableContainer subscriptions={props.subscriptions}></SubscriptionTableContainer>;
  }
  return (
    <CCCameraSummaryDetail
      subscribeToStreams={subscribeToStreams}
      unsubscribeToStreams={unsubscribeToStreams}
      cccameraSummaryState={cccameraSummaryState}
      cccameraCcsCmdState={cccameraCcsCmdState}
      cccameraCalibrationDetailedStatus={cccameraCalibrationDetailedStatus}
      cccameraOffLineDetailedState={cccameraOffLineDetailedState}
      cccameraImageReadinessDetailedState={cccameraImageReadinessDetailedState}
      ccCameraShutterDetailedState={ccCameraShutterDetailedState}
      ccCameraFilterChangerDetailedState={ccCameraFilterChangerDetailedState}
      ccCameraRaftsDetailedState={ccCameraRaftsDetailedState}
      {...props}
    />
  );
};

const mapStateToProps = (state) => {
  const summaryStatus = getCCCameraSummary(state);
  const startIntegration = getCCStartIntegration(state);
  const startReadout = getCCStartReadout(state);
  const endReadout = getCCEndReadout(state);
  const endOfImageTelemetry = getCCEndOfImageTelemetry(state);
  return {
    ...summaryStatus,
    startIntegration,
    startReadout,
    endReadout,
    endOfImageTelemetry,
  };
};

const mapDispatchToProps = (dispatch) => {
  const subscriptions = [
    'event-CCCamera-0-summaryState',
    'event-CCCamera-0-ccsCommandState',
    'event-CCCamera-0-calibrationDetailedState',
    'event-CCCamera-0-offlineDetailedState',
    'event-CCCamera-0-imageReadinessDetailedState',
    'event-CCCamera-0-shutterDetailedState',
    'event-CCCamera-0-filterChangerDetailedState',
    'event-CCCamera-0-raftsDetailedState',
    'event-CCCamera-0-startIntegration',
    'event-CCCamera-0-startReadout',
    'event-CCCamera-0-endReadout',
    'event-CCCamera-0-endOfImageTelemetry',
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

export default connect(mapStateToProps, mapDispatchToProps)(CCCameraSummaryDetailContainer);
