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
    <CCCamera
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
  return {
    // subscriptions,
    subscribeToStream: () => {
      subscriptions.forEach((stream) => dispatch(addGroup(stream)));
    },
    unsubscribeToStream: () => {
      subscriptions.forEach((stream) => dispatch(removeGroup(stream)));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CCCameraContainer);
