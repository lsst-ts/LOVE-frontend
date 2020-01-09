import React from 'react';
import { connect } from 'react-redux';
import Camera from './Camera';
import { getCameraState } from '../../../redux/selectors';
import { requestGroupSubscription, requestGroupSubscriptionRemoval } from '../../../redux/actions/ws';

export const schema = {
  description: 'Summary view of the ATCamera. Contains information about its current state and exposures table',
  defaultSize: [49, 17],
  props: {},
};

const CameraContainer = ({
  raftsDetailedState,
  imageReadinessDetailedState,
  calibrationDetailedState,
  shutterDetailedState,
  imageSequence,
  subscribeToStream,
  unsubscribeToStream,
}) => {  
  return (
    <Camera
      raftsDetailedState={raftsDetailedState}
      imageReadinessDetailedState={imageReadinessDetailedState}
      calibrationDetailedState={calibrationDetailedState}
      shutterDetailedState={shutterDetailedState}
      imageSequence={imageSequence}
      subscribeToStream={subscribeToStream}
      unsubscribeToStream={unsubscribeToStream}
    />
  );
};

const mapStateToProps = (state) => {
  const cameraState = getCameraState(state);
  return cameraState;
};

const mapDispatchToProps = (dispatch) => {
  return {
    subscribeToStream: () => {
      dispatch(requestGroupSubscription('event-ATCamera-0-startIntegration'));
      dispatch(requestGroupSubscription('event-ATCamera-0-startReadout'));
      dispatch(requestGroupSubscription('event-ATCamera-0-endReadout'));
      dispatch(requestGroupSubscription('event-ATCamera-0-endOfImageTelemetry'));
      dispatch(requestGroupSubscription('event-ATCamera-0-raftsDetailedState'));
      dispatch(requestGroupSubscription('event-ATCamera-0-shutterDetailedState'));
      dispatch(requestGroupSubscription('event-ATCamera-0-imageReadinessDetailedState'));
      dispatch(requestGroupSubscription('event-ATCamera-0-calibrationDetailedState'));
      dispatch(requestGroupSubscription('event-ATCamera-0-imageReadoutParameters'));
    },
    unsubscribeToStream: () => {
      dispatch(requestGroupSubscriptionRemoval('event-ATCamera-0-startIntegration'));
      dispatch(requestGroupSubscriptionRemoval('event-ATCamera-0-startReadout'));
      dispatch(requestGroupSubscriptionRemoval('event-ATCamera-0-endReadout'));
      dispatch(requestGroupSubscriptionRemoval('event-ATCamera-0-endOfImageTelemetry'));
      dispatch(requestGroupSubscriptionRemoval('event-ATCamera-0-raftsDetailedState'));
      dispatch(requestGroupSubscriptionRemoval('event-ATCamera-0-shutterDetailedState'));
      dispatch(requestGroupSubscriptionRemoval('event-ATCamera-0-imageReadinessDetailedState'));
      dispatch(requestGroupSubscriptionRemoval('event-ATCamera-0-calibrationDetailedState'));
      dispatch(requestGroupSubscriptionRemoval('event-ATCamera-0-imageReadoutParameters'));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CameraContainer);
