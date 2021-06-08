import React from 'react';
import { connect } from 'react-redux';
import { addGroup, removeGroup } from 'redux/actions/ws';
import { getM1M3State } from 'redux/selectors';
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
  return m1m3State;
};

const mapDispatchToProps = (dispatch) => {
  const subscriptions = [
    'telemetry-MTM1M3-0-forceActuatorData',
    'telemetry-MTM1M3-0-hardpointActuatorData',
    'telemetry-MTM1M3-0-imsData',
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
