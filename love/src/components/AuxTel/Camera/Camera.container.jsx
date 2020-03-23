import React from 'react';
import { connect } from 'react-redux';
import Camera from './Camera';
import { getCameraState } from '../../../redux/selectors';
import { addGroupSubscription, requestGroupSubscriptionRemoval } from '../../../redux/actions/ws';

export const schema = {
  description: 'Summary view of the ATCamera. Contains information about its current state and exposures table',
  defaultSize: [49, 17],
  props: {
    titleBar: {
      type: 'boolean',
      description: 'Whether to display the title bar',
      isPrivate: false,
      default: true,
    },
    title: {
      type: 'string',
      description: 'Name diplayed in the title bar (if visible)',
      isPrivate: false,
      default: 'Camera',
    },
    margin: {
      type: 'boolean',
      description: 'Whether to display component with a margin',
      isPrivate: false,
      default: true,
    },
  },
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
      dispatch(addGroupSubscription('event-ATCamera-0-startIntegration'));
      dispatch(addGroupSubscription('event-ATCamera-0-startReadout'));
      dispatch(addGroupSubscription('event-ATCamera-0-endReadout'));
      dispatch(addGroupSubscription('event-ATCamera-0-endOfImageTelemetry'));
      dispatch(addGroupSubscription('event-ATCamera-0-raftsDetailedState'));
      dispatch(addGroupSubscription('event-ATCamera-0-shutterDetailedState'));
      dispatch(addGroupSubscription('event-ATCamera-0-imageReadinessDetailedState'));
      dispatch(addGroupSubscription('event-ATCamera-0-calibrationDetailedState'));
      dispatch(addGroupSubscription('event-ATCamera-0-imageReadoutParameters'));
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

export default connect(mapStateToProps, mapDispatchToProps)(CameraContainer);
