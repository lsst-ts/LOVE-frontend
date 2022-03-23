import React from 'react';
import { connect } from 'react-redux';
import { addGroup, removeGroup } from 'redux/actions/ws';
import {
  getM2State,
  getM2Inclinometer,
  getM2Actuator,
  getM2ActuatorForce,
} from 'redux/selectors';
import SubscriptionTableContainer from 'components/GeneralPurpose/SubscriptionTable/SubscriptionTable.container';
import M2 from './M2';

export const schema = {
  description: 'View of M2 actuators',
  defaultSize: [60, 47],
  props: {
    title: {
      type: 'string',
      description: 'Name diplayed in the title bar (if visible)',
      isPrivate: false,
      default: 'M2',
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

const M2Container = (props) => {
  if (props.isRaw) {
    return <SubscriptionTableContainer subscriptions={props.subscriptions}></SubscriptionTableContainer>;
  }
  return <M2 {...props} />;
};

const mapStateToProps = (state) => {
  const m2State = getM2State(state);
  const inclinometerState = getM2Inclinometer(state);
  const actuators = getM2Actuator(state);
  const forces = getM2ActuatorForce(state);

  return { ...m2State, ...inclinometerState, ...actuators, ...forces };
};

const mapDispatchToProps = (dispatch) => {
  const subscriptions = [
    'telemetry-MTM2-0-axialActuatorSteps',
    'telemetry-MTM2-0-axialEncoderPositions',
    'telemetry-MTM2-0-tangentActuatorSteps',
    'telemetry-MTM2-0-tangentEncoderPositions',
    'telemetry-MTM2-0-axialForce',
    'telemetry-MTM2-0-tangentForce',
    'telemetry-MTM2-0-ilcData',
    'telemetry-MTM2-0-zenithAngle',
    'event-MTM2-0-inclinationTelemetrySource',
    'event-MTM2-0-summaryState',
    'event-MTM2-0-commandableByDDS',
    'event-MTM2-0-forceBalanceSystemStatus',
    'event-MTM2-0-m2AssemblyInPosition',
    'event-Heartbeat-0-stream',
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
