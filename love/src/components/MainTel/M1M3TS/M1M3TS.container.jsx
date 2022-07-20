import React from 'react';
import { connect } from 'react-redux';
import { addGroup, removeGroup } from 'redux/actions/ws';
import {
  getM1M3TSState,
  getM1M3TSThermalState,
  getM1M3TSTemperatureState
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
    minTemperatureLimit: {
      type: 'number',
      description: 'Minimum Temperature limit',
      isPrivate: false,
      default: -6000,
    },
    maxTemperatureLimit: {
      type: 'number',
      description: 'Maximum Temperature limit',
      isPrivate: false,
      default: 6000,
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
  const m1m3TSThermalState = getM1M3TSThermalState(state);
  const m1m3TSTemperatureState = getM1M3TSTemperatureState(state);
  return { ...m1m3TSState, ...m1m3TSThermalState, ...m1m3TSTemperatureState };
};

const mapDispatchToProps = (dispatch) => {
  const subscriptions = [
    'event-MTM1M3TS-0-summaryState',
    // 'event-MTM1M3TS-0-enabledILC',
    'event-MTM1M3TS-0-powerStatus',
    'event-MTM1M3TS-0-thermalData',
    'event-MTM1M3TS-0-thermalSettings',
    'event-MTM1M3TS-0-appliedSetpoint',
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
