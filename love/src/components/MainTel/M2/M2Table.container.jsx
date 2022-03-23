import React from 'react';
import { connect } from 'react-redux';
import { addGroup, removeGroup } from 'redux/actions/ws';
import {
  getM2ActuatorTable,
} from 'redux/selectors';
import SubscriptionTableContainer from 'components/GeneralPurpose/SubscriptionTable/SubscriptionTable.container';
import M2Table from './M2Table';

export const schema = {
  description: `Table containing low level information about the MTM2 forces`,
  defaultSize: [60, 12],
  props: {
    title: {
      type: 'string',
      description: 'Name diplayed in the title bar (if visible)',
      isPrivate: false,
      default: 'MTM2 Forces',
    },
    hasRawMode: {
      type: 'boolean',
      description: 'Whether the component has a raw mode version',
      isPrivate: false,
      default: false,
    },
  },
};

const M2TableContainer = ({ ...props }) => {
  if (props.isRaw) {
    return <SubscriptionTableContainer subscriptions={props.subscriptions}></SubscriptionTableContainer>;
  }
  return <M2Table {...props} />;
};

const mapStateToProps = (state) => {
  const m2ActuatorTable = getM2ActuatorTable(state);
  return {
    ...m2ActuatorTable,
  };
};

const mapDispatchToProps = (dispatch) => {
  const subscriptions = [
    'telemetry-MTM2-0-forceBalance',
    'telemetry-MTM2-0-netForcesTotal',
    'telemetry-MTM2-0-netMomentsTotal',
    'telemetry-MTM2-0-position',
    'telemetry-MTM2-0-positionIMS',
    'event-Heartbeat-0-stream',
  ];
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

export default connect(mapStateToProps, mapDispatchToProps)(M2TableContainer);
