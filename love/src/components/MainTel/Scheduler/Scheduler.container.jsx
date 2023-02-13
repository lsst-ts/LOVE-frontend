import React from 'react';
import { connect } from 'react-redux';
import Scheduler from './Scheduler';
import { addGroup, removeGroup } from '../../../redux/actions/ws';
import SubscriptionTableContainer from '../../GeneralPurpose/SubscriptionTable/SubscriptionTable.container';
import { getAzimuthState, getElevationState } from '../../../redux/selectors';

export const schema = {
  description: 'Summary view of the Scheduler. Contains general information about the scheduler state',
  defaultSize: [51, 45],
  props: {
    title: {
      type: 'string',
      description: 'Name displayed in the title bar (if visible)',
      isPrivate: false,
      default: 'Scheduler',
    },
    controls: {
      type: 'boolean',
      description: "Whether to display controls to configure periods of time'",
      default: true,
      isPrivate: false,
    },
  },
};

const SchedulerContainer = ({
  subscribeToStream,
  unsubscribeToStream,
  azimuthActualPosition,
  elevationActualPosition,
  ...props
}) => {
  if (props.isRaw) {
    return <SubscriptionTableContainer subscriptions={props.subscriptions}></SubscriptionTableContainer>;
  }
  return (
    <Scheduler
      subscribeToStream={subscribeToStream}
      unsubscribeToStream={unsubscribeToStream}
      azimuthActualPosition={azimuthActualPosition}
      elevationActualPosition={elevationActualPosition}
    />
  );
};

const mapStateToProps = (state) => {
  const Az = getAzimuthState(state);
  const El = getElevationState(state);
  return { ...Az, ...El };
};

const mapDispatchToProps = (dispatch) => {
  const subscriptions = ['telemetry-MTMount-0-azimuth', 'telemetry-MTMount-0-elevation'];
  return {
    subscriptions,
    subscribeToStream: () => {
      subscriptions.forEach((stream) => dispatch(addGroup(stream)));
    },
    unsubscribeToStream: () => {
      subscriptions.forEach((stream) => dispatch(removeGroup(stream)));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SchedulerContainer);