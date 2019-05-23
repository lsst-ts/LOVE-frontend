import React from 'react';
import { connect } from 'react-redux';
import Camera from './Camera';
import { getCameraState } from '../../../redux/selectors';
import { requestGroupSubscription, requestGroupSubscriptionRemoval } from '../../../redux/actions/ws';

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
      dispatch(requestGroupSubscription('event-ATCamera-startIntegration'));
      dispatch(requestGroupSubscription('event-ATCamera-startReadout'));
      dispatch(requestGroupSubscription('event-ATCamera-endReadout'));
      dispatch(requestGroupSubscription('event-ATCamera-endOfImageTelemetry'));
      dispatch(requestGroupSubscription('event-ATCamera-raftsDetailedState'));
      dispatch(requestGroupSubscription('event-ATCamera-shutterDetailedState'));
      dispatch(requestGroupSubscription('event-ATCamera-imageReadinessDetailedState'));
      dispatch(requestGroupSubscription('event-ATCamera-calibrationDetailedState'));
      dispatch(requestGroupSubscription('event-ATCamera-imageReadoutParameters'));
    },
    unsubscribeToStream: () => {
      dispatch(requestGroupSubscriptionRemoval('event-ATCamera-startIntegration'));
      dispatch(requestGroupSubscriptionRemoval('event-ATCamera-startReadout'));
      dispatch(requestGroupSubscriptionRemoval('event-ATCamera-endReadout'));
      dispatch(requestGroupSubscriptionRemoval('event-ATCamera-endOfImageTelemetry'));
      dispatch(requestGroupSubscriptionRemoval('event-ATCamera-raftsDetailedState'));
      dispatch(requestGroupSubscriptionRemoval('event-ATCamera-shutterDetailedState'));
      dispatch(requestGroupSubscriptionRemoval('event-ATCamera-imageReadinessDetailedState'));
      dispatch(requestGroupSubscriptionRemoval('event-ATCamera-calibrationDetailedState'));
      dispatch(requestGroupSubscriptionRemoval('event-ATCamera-imageReadoutParameters'));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CameraContainer);
