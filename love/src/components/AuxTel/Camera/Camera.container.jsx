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
    },
    unsubscribeToStream: () => {
      dispatch(requestGroupSubscriptionRemoval('event-ATCamera-startIntegration'));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CameraContainer);
