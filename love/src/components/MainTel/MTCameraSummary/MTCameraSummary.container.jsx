import React from 'react';
import { connect } from 'react-redux';
import MTCameraSummary from './MTCameraSummary';
import { getCameraState } from '../../../redux/selectors';
import { addGroup, removeGroup } from '../../../redux/actions/ws';
import SubscriptionTableContainer from '../../GeneralPurpose/SubscriptionTable/SubscriptionTable.container';

export const schema = {
  description: 'Summary view of the MTCamera. Contains information about its current state and exposures table',
  defaultSize: [49, 17],
  props: {
    title: {
      type: 'string',
      description: 'Name diplayed in the title bar (if visible)',
      isPrivate: false,
      default: 'Main Telescope Camera',
    },
  },
};

const MTCameraCummaryContainer = ({
  raftsDetailedState,
  imageReadinessDetailedState,
  calibrationDetailedState,
  shutterDetailedState,
  imageSequence,
  ...props
}) => {
  if (props.isRaw) {
    return <SubscriptionTableContainer subscriptions={props.subscriptions}></SubscriptionTableContainer>;
  }
  return (
    <MTCameraSummary
      raftsDetailedState={raftsDetailedState}
      imageReadinessDetailedState={imageReadinessDetailedState}
      calibrationDetailedState={calibrationDetailedState}
      shutterDetailedState={shutterDetailedState}
      imageSequence={imageSequence}
      {...props}
    />
  );
};

const mapStateToProps = (state) => {
  const cameraState = getCameraState(state);
  return cameraState;
};

const mapDispatchToProps = (dispatch) => {
  const subscriptions = [
    'event-ATCamera-0-startIntegration',
    'event-ATCamera-0-startReadout',
    'event-ATCamera-0-endReadout',
    'event-ATCamera-0-endOfImageTelemetry',
    'event-ATCamera-0-raftsDetailedState',
    'event-ATCamera-0-shutterDetailedState',
    'event-ATCamera-0-imageReadinessDetailedState',
    'event-ATCamera-0-calibrationDetailedState',
    'event-ATCamera-0-imageReadoutParameters',
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

export default connect(mapStateToProps, mapDispatchToProps)(MTCameraCummaryContainer);
