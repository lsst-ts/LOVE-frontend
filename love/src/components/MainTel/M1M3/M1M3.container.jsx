import React from 'react';
import { connect } from 'react-redux';
import { addGroup, removeGroup } from '../../../redux/actions/ws';
import { getM1M3State } from '../../../redux/selectors';
import M1M3 from './M1M3';
import SubscriptionTableContainer from '../../GeneralPurpose/SubscriptionTable/SubscriptionTable.container';

export const schema = {
  description: 'View of M1M3 actuators',
  defaultSize: [61, 32],
  props: {
    title: {
      type: 'string',
      description: 'Name diplayed in the title bar (if visible)',
      isPrivate: false,
      default: 'M1M3',
    },
  },
};

const M1M3Container = ({ subscribeToStreams, unsubscribeToStreams, ...props }) => {
  if (props.isRaw) {
    return <SubscriptionTableContainer subscriptions={props.subscriptions}></SubscriptionTableContainer>;
  }
  return <M1M3 subscribeToStreams={subscribeToStreams} unsubscribeToStreams={unsubscribeToStreams} {...props} />;
};

const mapStateToProps = (state) => {
  const m1m3State = getM1M3State(state);
  return m1m3State;
};

const mapDispatchToProps = (dispatch) => {
  const subscriptions = [
    'telemetry-MTM1M3-0-accelerometerData',
    'telemetry-MTM1M3-0-forceActuatorData',
    'telemetry-MTM1M3-0-forceActuatorPressure',
    'telemetry-MTM1M3-0-gyroData',
    'telemetry-MTM1M3-0-hardpointActuatorData',
    'telemetry-MTM1M3-0-hardpointMonitorData',
    'telemetry-MTM1M3-0-imsData',
    'telemetry-MTM1M3-0-inclinometerData',
    'event-MTM1M3-0-summaryState',
    'event-MTM1M3-0-detailedState',
    'event-MTM1M3-0-forceActuatorState',
    'event-MTM1M3-0-forceActuatorInfo',
    'event-MTM1M3-0-forceActuatorWarning',
    'event-MTM1M3-0-hardpointActuatorState',
    'event-MTM1M3-0-hardpointActuatorInfo',
    'event-MTM1M3-0-hardpointActuatorWarning',
    'event-MTM1M3-0-hardpointMonitorState',
    'event-MTM1M3-0-hardpointMonitorInfo',
    'event-MTM1M3-0-hardpointMonitorWarning',
    'event-MTM1M3-0-forceSetpointWarning',
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
export default connect(mapStateToProps, mapDispatchToProps)(M1M3Container);
