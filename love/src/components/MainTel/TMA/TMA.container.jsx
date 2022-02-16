import React from 'react';
import { connect } from 'react-redux';
import { addGroup, removeGroup } from '../../../redux/actions/ws';
import TMA from './TMA';
import {
  getTMASummary,
  getAzimuthState,
  getElevationState,
  getDrivesAzimuthElevationState,
} from 'redux/selectors';
// import SubscriptionTableContainer from '../../GeneralPurpose/SubscriptionTable/SubscriptionTable.container';

export const schema = {
  description:
    'View of Telescope Mount Assembly',
  defaultSize: [61, 32],
  props: {
    title: {
      type: 'string',
      description: 'Name diplayed in the title bar (if visible)',
      isPrivate: false,
      default: 'Telescope Mount Assembly',
    },
  },
};

const TMAContainer = ({
  subscribeToStreams,
  unsubscribeToStreams,
  ...props
}) => {
  // if (props.isRaw) {
  //   return <SubscriptionTableContainer subscriptions={props.subscriptions}></SubscriptionTableContainer>;
  // }
  return (
    <TMA
      subscribeToStreams={subscribeToStreams}
      unsubscribeToStreams={unsubscribeToStreams}
      {...props}
    />
  );
};

const mapStateToProps = (state) => {
  const tmaSummary = getTMASummary(state);
  const azimuth = getAzimuthState(state);
  const elevation = getElevationState(state);
  const drives = getDrivesAzimuthElevationState(state);
  return { 
    ...tmaSummary,
    ...azimuth,
    ...elevation,
    ...drives,
   };
};

const mapDispatchToProps = (dispatch) => {
  const subscriptions = [
    'telemetry-MTMount-0-azimuth',
    'telemetry-MTMount-0-azimuthDrives',
    'telemetry-MTMount-0-elevation',
    'telemetry-MTMount-0-elevationDrives',
    'event-MTMount-0-azimuthDrivesThermalSystemState',
    'event-MTMount-0-azimuthInPosition',
    'event-MTMount-0-azimuthLimits',
    'event-MTMount-0-azimuthMotionState',
    'event-MTMount-0-azimuthSystemState',
    'event-MTMount-0-balanceSystemState',
    'event-MTMount-0-commander',
    'event-MTMount-0-connected',
    'event-MTMount-0-elevationInPosition',
    'event-MTMount-0-elevationLimits',
    'event-MTMount-0-elevationMotionState',
    'event-MTMount-0-elevationSystemState',
    'event-MTMount-0-mirrorCoverLocksMotionState',
    'event-MTMount-0-mirrorCoversMotionState',
    'event-MTMount-0-target',
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
export default connect(mapStateToProps, mapDispatchToProps)(TMAContainer);
