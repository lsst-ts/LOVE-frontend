import React from 'react';
import { connect } from 'react-redux';
import CameraHexapod from './CameraHexapod';
import SubscriptionTableContainer from 'components/GeneralPurpose/SubscriptionTable/SubscriptionTable.container';
import { addGroup, removeGroup } from 'redux/actions/ws';
import { getHexapodStatus, getHexapodTables } from 'redux/selectors';
import { EUIs } from 'Config';

export const schema = {
  description: 'View of Camera Hexapod',
  defaultSize: [40, 23],
  props: {
    title: {
      type: 'string',
      description: 'Name displayed in the title bar (if visible)',
      isPrivate: false,
      default: 'Camera Hexapod',
    },
    salindex: {
      type: 'number',
      description: 'Salindex of Simonyi Hexapod. 1 for Camera Hexapod and 2 for M2 Hexapod',
      isPrivate: false,
      default: 1,
    },
    EUI: {
      type: 'boolean',
      description: 'Whether the component has a EUI link',
      isPrivate: false,
      default: EUIs.HEXAPOD,
    },
  },
};

const CameraHexapodContainer = ({ subscribeToStreams, unsubscribeToStreams, ...props }) => {
  if (props.isRaw) {
    return <SubscriptionTableContainer subscriptions={props.subscriptions}></SubscriptionTableContainer>;
  }
  return (
    <CameraHexapod subscribeToStreams={subscribeToStreams} unsubscribeToStreams={unsubscribeToStreams} {...props} />
  );
};

const mapStateToProps = (state, ownProps) => {
  const hexapodStatus = getHexapodStatus(state, ownProps.salindex);
  const hexapodTables = getHexapodTables(state, ownProps.salindex);
  return {
    ...hexapodStatus,
    ...hexapodTables,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const subscriptions = [
    `telemetry-MTHexapod-${ownProps.salindex}-actuators`,
    `telemetry-MTHexapod-${ownProps.salindex}-application`,
    `event-MTHexapod-${ownProps.salindex}-commandableByDDS`,
    `event-MTHexapod-${ownProps.salindex}-compensationMode`,
    `event-MTHexapod-${ownProps.salindex}-compensationOffset`,
    `event-MTHexapod-${ownProps.salindex}-connected`,
    `event-MTHexapod-${ownProps.salindex}-controllerState`,
    `event-MTHexapod-${ownProps.salindex}-inPosition`,
    `event-MTHexapod-${ownProps.salindex}-interlock`,
    `event-MTHexapod-${ownProps.salindex}-summaryState`,
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

export default connect(mapStateToProps, mapDispatchToProps)(CameraHexapodContainer);
