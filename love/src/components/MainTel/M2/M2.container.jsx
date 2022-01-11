import React from 'react';
import { connect } from 'react-redux';
import { addGroup, removeGroup } from 'redux/actions/ws';
import {
  getM2State,
  getM1M3ActuatorsState,
  getM1M3ActuatorForces,
  getM1M3HardpointMonitorData,
  getM1M3HardpointActuatorState,
} from 'redux/selectors';
import SubscriptionTableContainer from 'components/GeneralPurpose/SubscriptionTable/SubscriptionTable.container';
import M2 from './M2';

export const schema = {
  description: 'View of M2 actuators',
  defaultSize: [61, 32],
  props: {
    title: {
      type: 'string',
      description: 'Name diplayed in the title bar (if visible)',
      isPrivate: false,
      default: 'M2',
    },
  },
};

const M2Container = (props) => {
  if (props.isRaw) {
    return <SubscriptionTableContainer subscriptions={props.subscriptions}></SubscriptionTableContainer>;
  }
  return <M2 {...props} />;
};

const mapStateToProps = (state) => {
  const m2State = getM2State(state);
  return { ...m2State };
};

const mapDispatchToProps = (dispatch) => {
  const subscriptions = [
    'telemetry-MTM2-0-axialActuatorSteps',
    'telemetry-MTM2-0-axialEncoderPositions',
    'telemetry-MTM2-0-axialForce',
    'telemetry-MTM2-0-displacementSensors',
    'telemetry-MTM2-0-forceBalance',
    'telemetry-MTM2-0-ilcData',
    'event-MTM2-0-summaryState',
    'event-MTM2-0-commandableByDDS',
    'event-MTM2-0-forceBalanceSystemStatus',
    'event-MTM2-0-m2AssemblyInPosition',
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
export default connect(mapStateToProps, mapDispatchToProps)(M2Container);
