import React from 'react';
import { connect } from 'react-redux';
import { addGroup, removeGroup } from 'redux/actions/ws';
import {
  getM1M3State,
  getM1M3HardpointActuatorData,
  getM1M3ActuatorsData,
  getM1M3IMSData,
  getM1M3AppliedForces,
} from 'redux/selectors';
import SubscriptionTableContainer from 'components/GeneralPurpose/SubscriptionTable/SubscriptionTable.container';
import M1M3Table from './M1M3Table';

export const schema = {
  description: `Table containing low level information about the MTM1M3 forces`,
  defaultSize: [55, 14],
  props: {
    title: {
      type: 'string',
      description: 'Name diplayed in the title bar (if visible)',
      isPrivate: false,
      default: 'MTM1M3 Forces',
    },
  },
};

const M1M3TableContainer = ({ ...props }) => {
  if (props.isRaw) {
    return <SubscriptionTableContainer subscriptions={props.subscriptions}></SubscriptionTableContainer>;
  }
  return <M1M3Table {...props} />;
};

const mapStateToProps = (state) => {
  const m1m3State = getM1M3State(state);
  const m1m3HardpointActuatorData = getM1M3HardpointActuatorData(state);
  const m1m3ActuatorsData = getM1M3ActuatorsData(state);
  const m1m3IMSData = getM1M3IMSData(state);
  const m1m3AppliedForces = getM1M3AppliedForces(state);
  return {
    ...m1m3State,
    ...m1m3HardpointActuatorData,
    ...m1m3ActuatorsData,
    ...m1m3IMSData,
    ...m1m3AppliedForces,
  };
};

const mapDispatchToProps = (dispatch) => {
  const subscriptions = [
    'telemetry-MTM1M3-0-forceActuatorData',
    'telemetry-MTM1M3-0-hardpointActuatorData',
    'telemetry-MTM1M3-0-imsData',
    'telemetry-MTM1M3-0-appliedForces',
    'event-MTM1M3-0-summaryState',
    'event-MTM1M3-0-detailedState',
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

export default connect(mapStateToProps, mapDispatchToProps)(M1M3TableContainer);
