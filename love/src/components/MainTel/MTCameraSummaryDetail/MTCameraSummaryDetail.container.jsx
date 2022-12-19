import React from 'react';
import { connect } from 'react-redux';
import MTCameraSummaryDetail from './MTCameraSummaryDetail';
import {
  getMTCamSummaryStatus,
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
  subSystems,
  subSystemState,
  subSystemColor,
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
  oDI,
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
    <MTCameraSummaryDetail
      subSystems={subSystems}
      subSystemState={subSystemState}
      subSystemColor={subSystemColor}
      imagesInSequenceInt={imagesInSequenceInt}
      imageNameInt={imageNameInt}
      imageIndexInt={imageIndexInt}
      imageSourceInt={imageSourceInt}
      imageControllerInt={imageControllerInt}
      imageDateInt={imageDateInt}
      imageNumberInt={imageNumberInt}
      timestampAcquisitionStartInt={timestampAcquisitionStartInt}
      exposureTimeInt={exposureTimeInt}
      modeInt={modeInt}
      timeoutInt={timeoutInt}
      imagesInSequenceSReadout={imagesInSequenceSReadout}
      imageNameSReadout={imageNameSReadout}
      imageIndexSReadout={imageIndexSReadout}
      imageSourceSReadout={imageSourceSReadout}
      imageControllerSReadout={imageControllerSReadout}
      imageDateSReadout={imageDateSReadout}
      imageNumberSReadout={imageNumberSReadout}
      timestampAcquisitionStartSReadout={timestampAcquisitionStartSReadout}
      exposureTimeSReadout={exposureTimeSReadout}
      timestampStartOfReadoutSReadout={timestampStartOfReadoutSReadout}
      imagesInSequenceEReadout={imagesInSequenceEReadout}
      imageNameEReadout={imageNameEReadout}
      imageIndexEReadout={imageIndexEReadout}
      imageSourceEReadout={imageSourceEReadout}
      imageControllerEReadout={imageControllerEReadout}
      imageDateEReadout={imageDateEReadout}
      imageNumberEReadout={imageNumberEReadout}
      timestampAcquisitionStartEReadout={timestampAcquisitionStartEReadout}
      requestedExposureTimeEReadout={requestedExposureTimeEReadout}
      timestampEndOfReadoutEReadout={timestampEndOfReadoutEReadout}
      imagesInSequenceTelemetry={imagesInSequenceTelemetry}
      imageNameTelemetry={imageNameTelemetry}
      imageIndexTelemetry={imageIndexTelemetry}
      imageSourceTelemetry={imageSourceTelemetry}
      imageControllerTelemetry={imageControllerTelemetry}
      imageDateTelemetry={imageDateTelemetry}
      imageNumberTelemetry={imageNumberTelemetry}
      timestampAcquisitionStartTelemetry={timestampAcquisitionStartTelemetry}
      exposureTimeTelemetry={exposureTimeTelemetry}
      imageTagTelemetry={imageTagTelemetry}
      timestampDateObsTelemetry={timestampDateObsTelemetry}
      timestampDateEndTelemetry={timestampDateEndTelemetry}
      measuredShutterOpenTimeTelemetry={measuredShutterOpenTimeTelemetry}
      darkTimeTelemetry={darkTimeTelemetry}
      emulatedImageTelemetry={emulatedImageTelemetry}
      {...props}
    />
  );
};

const mapStateToProps = (state) => {
  const summaryStatus = getMTCamSummaryStatus(state);
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
    'event-MTCamera-0-summaryStatus',
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
