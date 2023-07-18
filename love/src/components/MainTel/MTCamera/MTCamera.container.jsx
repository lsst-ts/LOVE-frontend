import React, { Component } from 'react';
import { connect } from 'react-redux';
import SubscriptionTableContainer from 'components/GeneralPurpose/SubscriptionTable/SubscriptionTable.container';
import { addGroup, removeGroup } from 'redux/actions/ws';
import { getTempControlStatus, getFocalPlaneReb, getFocalPlaneCCD } from '../../../redux/selectors';
import MTCamera from './MTCamera';

export const schema = {
  description: 'View of MTCamera',
  defaultSize: [40, 23],
  props: {
    title: {
      type: 'string',
      description: 'Name displayed in the title bar (if visible)',
      isPrivate: false,
      default: 'MTCamera',
    },
    salindex: {
      type: 'number',
      description: 'Salindex of MTCamera',
      isPrivate: false,
      default: 1,
    },
  },
};

const MTCameraContainer = ({
  subscribeToStreams,
  unsubscribeToStreams,
  tempControlActive,
  hVBiasSwitch,
  anaV,
  power,
  gDV,
  oDI,
  oDV,
  oGV,
  rDV,
  temp,
  ...props
}) => {
  if (props.isRaw) {
    return <SubscriptionTableContainer subscriptions={props.subscriptions}></SubscriptionTableContainer>;
  }
  return (
    <MTCamera
      subscribeToStreams={subscribeToStreams}
      unsubscribeToStreams={unsubscribeToStreams}
      tempControlActive={tempControlActive}
      hVBiasSwitch={hVBiasSwitch}
      anaV={anaV}
      power={power}
      gDV={gDV}
      oDI={oDI}
      oDV={oDV}
      oGV={oGV}
      rDV={rDV}
      temp={temp}
      {...props}
    />
  );
};

const mapStateToProps = (state) => {
  const tempControl = getTempControlStatus(state);
  const focalPlaneReb = getFocalPlaneReb(state);
  const focalPlaneCCD = getFocalPlaneCCD(state);
  return {
    ...tempControl,
    ...focalPlaneReb,
    ...focalPlaneCCD,
  };
};

const mapDispatchToProps = (dispatch) => {
  const subscriptions = [
    'event-MTCamera-0-summaryState',
    'event-MTCamera-0-ccsCommandState',
    'event-MTCamera-0-calibrationDetailedState',
    'event-MTCamera-0-offlineDetailedState',
    'event-MTCamera-0-imageReadinessDetailedState',
    'event-MTCamera-0-shutterDetailedState',
    'event-MTCamera-0-filterChangerDetailedState',
    'event-MTCamera-0-raftsDetailedState',
    'event-MTCamera-0-startIntegration',
    'event-MTCamera-0-startReadout',
    'event-MTCamera-0-endReadout',
    'event-MTCamera-0-endOfImageTelemetry',
    'telemetry-MTCamera-0-focal_plane_Reb',
    'telemetry-MTCamera-0-focal_plane_Ccd',
  ];
  return {
    subscriptions,
    subscribeToStreams: () => {
      subscriptions.forEach((stream) => dispatch(addGroup(stream)));
    },
    unsubscribeToStreams: () => {
      subscriptions.forEach((stream) => dispatch(removeGroup(stream)));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MTCameraContainer);
