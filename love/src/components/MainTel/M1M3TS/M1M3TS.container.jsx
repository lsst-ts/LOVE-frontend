import React from 'react';
import { connect } from 'react-redux';
import { addGroup, removeGroup } from 'redux/actions/ws';
import {
  getM1M3TSState
} from 'redux/selectors';
import SubscriptionTableContainer from 'components/GeneralPurpose/SubscriptionTable/SubscriptionTable.container';
import M1M3TS from './M1M3TS';

export const schema = {
  description: 'View of M1M3 Thermal System',
  defaultSize: [60, 47],
  props: {
    title: {
      type: 'string',
      description: 'Name diplayed in the title bar (if visible)',
      isPrivate: false,
      default: 'M1M3 Thermal System',
    },
    minForceLimit: {
      type: 'number',
      description: 'Minimum force limit',
      isPrivate: false,
      default: 0,
    },
    maxForceLimit: {
      type: 'number',
      description: 'Maximum force limit',
      isPrivate: false,
      default: 1000,
    },
    hasRawMode: {
      type: 'boolean',
      description: 'Whether the component has a raw mode version',
      isPrivate: false,
      default: false,
    },
  },
};

const M1M3TSContainer = (props) => {
  if (props.isRaw) {
    return <SubscriptionTableContainer subscriptions={props.subscriptions}></SubscriptionTableContainer>;
  }
  return <M1M3TS {...props} />;
};

const mapStateToProps = (state) => {
  const m1m3TSState = getM1M3TSState(state);

  return { ...m1m3TSState };
};

const mapDispatchToProps = (dispatch) => {
  const subscriptions = [
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
export default connect(mapStateToProps, mapDispatchToProps)(M1M3TSContainer);
