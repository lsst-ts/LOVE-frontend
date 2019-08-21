import React from 'react';
import { connect } from 'react-redux';
import Dome from './Dome';
import { getDomeState } from '../../../redux/selectors';
import { requestGroupSubscription, requestGroupSubscriptionRemoval } from '../../../redux/actions/ws';

const DomeContainer = ({
  dropoutDoorOpeningPercentage,
  mainDoorOpeningPercentage,
  azimuthPosition,
  azimuthState,
  domeInPosition,
  azimuthCommandedState,
  dropoutDoorState,
  mainDoorState,
  mountEncoders,
  detailedState,
  atMountState,
  target,
  mountInPosition,
  currentTimesToLimits,
  width,
  height,
  subscribeToStream,
  unsubscribeToStream,
}) => {
  return (
    <Dome
      dropoutDoorOpeningPercentage={dropoutDoorOpeningPercentage}
      mainDoorOpeningPercentage={mainDoorOpeningPercentage}
      domeInPosition={domeInPosition}
      azimuthPosition={azimuthPosition}
      azimuthState={azimuthState}
      azimuthCommandedState={azimuthCommandedState}
      dropoutDoorState={dropoutDoorState}
      mainDoorState={mainDoorState}
      mountEncoders={mountEncoders}
      detailedState={detailedState}
      atMountState={atMountState}
      target={target}
      mountInPosition={mountInPosition}
      subscribeToStream={subscribeToStream}
      unsubscribeToStream={unsubscribeToStream}
      width={width}
      height={height}
      currentTimesToLimits={currentTimesToLimits}
    />
  );
};

const mapStateToProps = (state) => {
  const domeState = getDomeState(state);
  return domeState;
};

const mapDispatchToProps = (dispatch) => {
  return {
    subscribeToStream: () => {
      //Dome
      dispatch(requestGroupSubscription('telemetry-ATDome-1-dropoutDoorOpeningPercentage'));
      dispatch(requestGroupSubscription('telemetry-ATDome-1-mainDoorOpeningPercentage'));
      dispatch(requestGroupSubscription('telemetry-ATDome-1-azimuthPosition'));
      dispatch(requestGroupSubscription('event-ATDome-1-azimuthState'));
      dispatch(requestGroupSubscription('event-ATDome-1-azimuthCommandedState'));
      dispatch(requestGroupSubscription('event-ATDome-1-dropoutDoorState'));
      dispatch(requestGroupSubscription('event-ATDome-1-mainDoorState'));
      dispatch(requestGroupSubscription('event-ATDome-1-allAxesInPosition'));
      //ATMCS
      dispatch(requestGroupSubscription('telemetry-ATMCS-1-mountEncoders'));
      dispatch(requestGroupSubscription('event-ATMCS-1-detailedState'));
      dispatch(requestGroupSubscription('event-ATMCS-1-atMountState'));
      dispatch(requestGroupSubscription('event-ATMCS-1-target'));
      dispatch(requestGroupSubscription('event-ATMCS-1-allAxesInPosition'));
      dispatch(requestGroupSubscription('event-ATMCS-1-m3State'));
      //ATPtg
      dispatch(requestGroupSubscription('telemetry-ATPtg-1-currentTimesToLimits'));
    },
    unsubscribeToStream: () => {
      //Dome
      dispatch(requestGroupSubscriptionRemoval('telemetry-ATDome-1-dropoutDoorOpeningPercentage'));
      dispatch(requestGroupSubscriptionRemoval('telemetry-ATDome-1-mainDoorOpeningPercentage'));
      dispatch(requestGroupSubscriptionRemoval('telemetry-ATDome-1-azimuthPosition'));
      dispatch(requestGroupSubscriptionRemoval('event-ATDome-1-azimuthState'));
      dispatch(requestGroupSubscriptionRemoval('event-ATDome-1-azimuthCommandedState'));
      dispatch(requestGroupSubscriptionRemoval('event-ATDome-1-dropoutDoorState'));
      dispatch(requestGroupSubscriptionRemoval('event-ATDome-1-mainDoorState'));
      dispatch(requestGroupSubscriptionRemoval('event-ATDome-1-allAxesInPosition'));
      //ATMCS
      dispatch(requestGroupSubscriptionRemoval('telemetry-ATMCS-1-mountEncoders'));
      dispatch(requestGroupSubscriptionRemoval('event-ATMCS-1-detailedState'));
      dispatch(requestGroupSubscriptionRemoval('event-ATMCS-1-atMountState'));
      dispatch(requestGroupSubscriptionRemoval('event-ATMCS-1-target'));
      dispatch(requestGroupSubscriptionRemoval('event-ATMCS-1-allAxesInPosition'));
      dispatch(requestGroupSubscriptionRemoval('event-ATMCS-1-m3State'));
      //ATPtg
      dispatch(requestGroupSubscriptionRemoval('telemetry-ATPtg-1-currentTimesToLimits'));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DomeContainer);
