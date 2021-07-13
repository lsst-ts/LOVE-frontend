import React from 'react';
import { connect } from 'react-redux';
import { addGroup, removeGroup } from '../../../redux/actions/ws';
import CableWraps from './CableWraps';
import SubscriptionTableContainer from '../../GeneralPurpose/SubscriptionTable/SubscriptionTable.container';
import {
  getCCWState,
  getRotatorState,
  getCCWFollowingError,
  getCCWPosition,
  getRotatorPosition,
} from 'redux/selectors';

export const schema = {
  description: 'View of both MT azimuth and Camera cable wraps',
  defaultSize: [61, 32],
  props: {
    title: {
      type: 'string',
      description: 'Name displayed in the title bar (if visible)',
      isPrivate: false,
      default: 'CableWraps',
    },
  },
};

const CableWrapsContainer = ({ subscribeToStreams, unsubscribeToStreams, ...props }) => {
  if (props.isRaw) {
    return <SubscriptionTableContainer subscriptions={props.subscriptions}></SubscriptionTableContainer>;
  }
  return <CableWraps subscribeToStreams={subscribeToStreams} unsubscribeToStreams={unsubscribeToStreams} {...props} />;
};

const mapStateToProps = (state) => {
  const ccwState = getCCWState(state);
  const ccwPosition = getCCWPosition(state);
  const rotatorState = getRotatorState(state);
  const rotatorPosition = getRotatorPosition(state);
  const followError = getCCWFollowingError(state);
  return {
    ...ccwState,
    ...ccwPosition,
    ...rotatorState,
    ...rotatorPosition,
    ...followError,
  };
};

const mapDispatchToProps = (dispatch) => {
  const subscriptions = [
    'telemetry-MTMount-0-cameraCableWrap',
    'telemetry-MTRotator-0-ccwFollowingError',
    'telemetry-MTRotator-0-rotation',
    'event-MTMount-0-cameraCableWrapFollowing',
    'event-MTMount-0-cameraCableWrapState',
    'event-MTMount-0-cameraCableWrapTarget',
    'event-MTMount-0-summaryState',
    'event-MTRotator-0-configuration',
    'event-MTRotator-0-inPosition',
    'event-MTRotator-0-interlock',
    'event-MTRotator-0-summaryState',
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
export default connect(mapStateToProps, mapDispatchToProps)(CableWrapsContainer);
