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
  imagesInSequenceInt,
  imageNameInt,
  imageIndexInt,
  imageSourceInt,
  imageControllerInt,
  imageDateInt,
  imageNumberInt,
  timestampAcquisitionStartInt,
  exposureTimeInt,
  modeInt,
  timeoutInt,
  imagesInSequenceSReadout,
  imageNameSReadout,
  imageIndexSReadout,
  imageSourceSReadout,
  imageControllerSReadout,
  imageDateSReadout,
  imageNumberSReadout,
  timestampAcquisitionStartSReadout,
  exposureTimeSReadout,
  timestampStartOfReadoutSReadout,
  imagesInSequenceEReadout,
  imageNameEReadout,
  imageIndexEReadout,
  imageSourceEReadout,
  imageControllerEReadout,
  imageDateEReadout,
  imageNumberEReadout,
  timestampAcquisitionStartEReadout,
  requestedExposureTimeEReadout,
  timestampEndOfReadoutEReadout,
  imagesInSequenceTelemetry,
  imageNameTelemetry,
  imageIndexTelemetry,
  imageSourceTelemetry,
  imageControllerTelemetry,
  imageDateTelemetry,
  imageNumberTelemetry,
  timestampAcquisitionStartTelemetry,
  exposureTimeTelemetry,
  imageTagTelemetry,
  timestampDateObsTelemetry,
  timestampDateEndTelemetry,
  measuredShutterOpenTimeTelemetry,
  darkTimeTelemetry,
  emulatedImageTelemetry,
  tempControlActive,
  hVBiasSwitch,
  anaV,
  power,
  gDV,
  // oDI,
  oDV,
  oGV,
  rDV,
  temp,
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
    ...startIntegration,
    ...startReadout,
    ...endReadout,
    ...endOfImageTelemetry,
  };
};

const mapDispatchToProps = (dispatch) => {
  const subscriptions = [
    'event-CCCamera-0-summaryState',
    'event-CCCamera-0-ccsCommandState',
    'event-CCCamera-0-calibrationDetailedState',
    'event-CCCamera-0-offlineDetailedState',
    'event-CCCamera-0-imageReadinessDetailedState',
    'event-CCTCamera-0-shutterDetailedState',
    'event-CCCamera-0-filterChangerDetailedState',
    'event-CCCamera-0-raftsDetailedState',
    'event-CCCamera-0-startIntegration',
    'event-CCCamera-0-startReadout',
    'event-CCCamera-0-endReadout',
    'event-CCCamera-0-endOfImageTelemetry',
    'telemetry-CCCamera-0-focal_plane_Reb',
    'telemetry-CCCamera-0-focal_plane_Ccd',
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