import React, { Component } from 'react';
import { connect } from 'react-redux';
import SubscriptionTableContainer from 'components/GeneralPurpose/SubscriptionTable/SubscriptionTable.container';
import { addGroup, removeGroup } from 'redux/actions/ws';
import { getCCTempControlStatus, getCCFocalPlaneReb, getCCFocalPlaneCCD } from '../../../redux/selectors';
import CCCamera from './CCCamera';

export const schema = {
  description: 'View of Commissioning Camera',
  defaultSize: [40, 23],
  props: {
    title: {
      type: 'string',
      description: 'Name displayed in the title bar (if visible)',
      isPrivate: false,
      default: 'CCCamera',
    },
    salindex: {
      type: 'number',
      description: 'Salindex of CCCamera',
      isPrivate: false,
      default: 1,
    },
  },
};

const CCCameraContainer = ({
  subscribeToStreams,
  unsubscribeToStreams,
  tempControlActive,
  hVBiasSwitch,
  anaV,
  power,
  gDV,
  // oDI,
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
    <CCCamera
      subscribeToStreams={subscribeToStreams}
      unsubscribeToStreams={unsubscribeToStreams}
      tempControlActive={tempControlActive}
      hVBiasSwitch={hVBiasSwitch}
      anaV={anaV}
      power={power}
      gDV={gDV}
      // oDI={oDI}
      oDV={oDV}
      oGV={oGV}
      rDV={rDV}
      temp={temp}
    />
  );
};

const mapStateToProps = (state) => {
  const tempControl = getCCTempControlStatus(state);
  const focalPlaneReb = getCCFocalPlaneReb(state);
  const focalPlaneCCD = getCCFocalPlaneCCD(state);
  return {
    ...tempControl,
    ...focalPlaneReb,
    ...focalPlaneCCD,
  };
};

const mapDispatchToProps = (dispatch) => {
  const subscriptions = [
    'event-CCCamera-0-summaryState',
    'event-CCCamera-0-ccsCommandState',
    'event-CCCamera-0-calibrationDetailedState',
    'event-CCCamera-0-offlineDetailedState',
    'event-CCCamera-0-imageReadinessDetailedState',
    'event-CCCamera-0-shutterDetailedState',
    'event-CCCamera-0-filterChangerDetailedState',
    'event-CCCamera-0-raftsDetailedState',
    'event-CCCamera-0-startIntegration',
    'event-CCCamera-0-startReadout',
    'event-CCCamera-0-endReadout',
    'event-CCCamera-0-endOfImageTelemetry',
    'telemetry-CCCamera-0-focal_plane_Reb',
    'telemetry-CCCamera-0-focal_plane_Ccd',
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

export default connect(mapStateToProps, mapDispatchToProps)(CCCameraContainer);
