import React from 'react';
import { connect } from 'react-redux';
import { addGroup, removeGroup } from 'redux/actions/ws';
import {
  getM1M3State,
  getM1M3ActuatorsState,
  getM1M3ActuatorForces,
  getM1M3HardpointMonitorData,
  getM1M3HardpointActuatorState,
} from 'redux/selectors';
import SubscriptionTableContainer from 'components/GeneralPurpose/SubscriptionTable/SubscriptionTable.container';
import FacilityMap from './FacilityMap';

export const schema = {
  description: 'Vera C. Rubin Summit Facility Map',
  defaultSize: [61, 32],
  props: {
    title: {
      type: 'string',
      description: 'Observatory Facility Map',
      isPrivate: false,
      default: 'Facility Map',
    },
  },
};

const FacilityMapContainer = ({ subscribeToStreams, unsubscribeToStreams, ...props }) => {
  if (props.isRaw) {
    return <SubscriptionTableContainer subscriptions={props.subscriptions}></SubscriptionTableContainer>;
  }
  return <FacilityMap subscribeToStreams={subscribeToStreams} unsubscribeToStreams={unsubscribeToStreams} {...props} />;
};

const mapStateToProps = (state) => {
  const m1m3State = getM1M3State(state);
  const actuatorsState = getM1M3ActuatorsState(state);
  const actuatorsForces = getM1M3ActuatorForces(state);
  const hardpointsMonitor = getM1M3HardpointMonitorData(state);
  const hardpointsActuatorState = getM1M3HardpointActuatorState(state);
  return { ...m1m3State, ...actuatorsState, ...actuatorsForces, ...hardpointsMonitor, ...hardpointsActuatorState };
};

const mapDispatchToProps = (dispatch) => {
  const subscriptions = [
    'telemetry-MTM1M3-0-forceActuatorData',
    'telemetry-MTM1M3-0-hardpointActuatorData',
    'telemetry-MTM1M3-0-hardpointMonitorData',
    'telemetry-MTM1M3-0-imsData',
    'telemetry-MTM1M3-0-appliedAccelerationForces',
    'telemetry-MTM1M3-0-appliedAzimuthForces',
    'telemetry-MTM1M3-0-appliedBalanceForces',
    'telemetry-MTM1M3-0-appliedCylinderForces',
    'telemetry-MTM1M3-0-appliedElevationForces',
    'telemetry-MTM1M3-0-appliedForces',
    'telemetry-MTM1M3-0-appliedThermalForces',
    'telemetry-MTM1M3-0-appliedVelocityForces',
    'event-MTM1M3-0-summaryState',
    'event-MTM1M3-0-detailedState',
    'event-MTM1M3-0-forceActuatorState',
    'event-MTM1M3-0-forceActuatorInfo',
    'event-MTM1M3-0-hardpointActuatorState',
    'event-MTM1M3-0-appliedActiveOpticForces',
    'event-MTM1M3-0-appliedOffsetForces',
    'event-MTM1M3-0-appliedStaticForces',
    // 'event-MTM1M3-0-preclippedAccelerationForces',
    // 'event-MTM1M3-0-preclippedActiveOpticForces',
    // 'event-MTM1M3-0-preclippedBalanceForces',
    // 'event-MTM1M3-0-preclippedAzimuthForces',
    // 'event-MTM1M3-0-preclippedCylinderForces',
    // 'event-MTM1M3-0-preclippedElevationForces',
    // 'event-MTM1M3-0-preclippedForces',
    // 'event-MTM1M3-0-preclippedOffsetForces',
    // 'event-MTM1M3-0-preclippedStaticForces',
    // 'event-MTM1M3-0-preclippedThermalForces',
    // 'event-MTM1M3-0-preclippedVelocityForces',
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
export default connect(mapStateToProps, mapDispatchToProps)(FacilityMapContainer);
