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
  const m1m3State = getM2State(state);
  const actuatorsState = getM1M3ActuatorsState(state);
  const actuatorsForces = getM1M3ActuatorForces(state);
  const hardpointsMonitor = getM1M3HardpointMonitorData(state);
  const hardpointsActuatorState = getM1M3HardpointActuatorState(state);
  return { ...m1m3State, ...actuatorsState, ...actuatorsForces, ...hardpointsMonitor, ...hardpointsActuatorState };
};

const mapDispatchToProps = (dispatch) => {
  const subscriptions = [
    'telemetry-MTM1M3-0-accelerometerData',
    'telemetry-MTM1M3-0-forceActuatorData',
    'telemetry-MTM1M3-0-forceActuatorPressure',
    'telemetry-MTM1M3-0-hardpointActuatorData',
    'telemetry-MTM1M3-0-hardpointMonitorData',
    'telemetry-MTM1M3-0-imsData',
    'event-MTM1M3-0-summaryState',
    'event-MTM1M3-0-detailedState',
    'event-MTM1M3-0-forceActuatorState',
    'event-MTM1M3-0-forceActuatorInfo',
    'event-MTM1M3-0-hardpointActuatorState',
    'event-MTM1M3-0-hardpointActuatorInfo',
    'event-MTM1M3-0-hardpointMonitorState',
    'event-MTM1M3-0-hardpointMonitorInfo',
    'event-MTM1M3-0-appliedAberrationForces',
    'event-MTM1M3-0-appliedAccelerationForces',
    'event-MTM1M3-0-appliedActiveOpticForces',
    'event-MTM1M3-0-appliedAzimuthForces',
    'event-MTM1M3-0-appliedBalanceForces',
    'event-MTM1M3-0-appliedCylinderForces',
    'event-MTM1M3-0-appliedElevationForces',
    'event-MTM1M3-0-appliedForces',
    'event-MTM1M3-0-appliedOffsetForces',
    'event-MTM1M3-0-appliedStaticForces',
    'event-MTM1M3-0-appliedThermalForces',
    'event-MTM1M3-0-appliedVelocityForces',
    'event-MTM1M3-0-preclippedAberrationForces',
    'event-MTM1M3-0-preclippedAccelerationForces',
    'event-MTM1M3-0-preclippedActiveOpticForces',
    'event-MTM1M3-0-preclippedAzimuthForces',
    'event-MTM1M3-0-preclippedBalanceForces',
    'event-MTM1M3-0-preclippedCylinderForces',
    'event-MTM1M3-0-preclippedElevationForces',
    'event-MTM1M3-0-preclippedForces',
    'event-MTM1M3-0-preclippedOffsetForces',
    'event-MTM1M3-0-preclippedStaticForces',
    'event-MTM1M3-0-preclippedThermalForces',
    'event-MTM1M3-0-preclippedVelocityForces',
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
