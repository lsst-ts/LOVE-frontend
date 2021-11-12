import React from 'react';
import { connect } from 'react-redux';
import CameraHexapod from './CameraHexapod';
import SubscriptionTableContainer from 'components/GeneralPurpose/SubscriptionTable/SubscriptionTable.container';
import { addGroup, removeGroup } from 'redux/actions/ws';

export const schema = {
  description: 'View of Camera Hexapod',
  defaultSize: [75, 32],
  props: {
    title: {
      type: 'string',
      description: 'Name displayed in the title bar (if visible)',
      isPrivate: false,
      default: 'Camera Hexapod',
    },
    salindex: {
      type: 'number',
      description: 'Salindex of the Hexapod',
      isPrivate: false,
      default: 1,
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

const mapStateToProps = (state) => {
  const hexapodStatus = getHexapodStatus(state);
  const hexapodTables = getHexapodTables(state);
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
