import React from 'react';
import { connect } from 'react-redux';
import Dome from './Dome';
import { getDomeState } from '../../../redux/selectors';
import { requestGroupSubscription, requestGroupSubscriptionRemoval } from '../../../redux/actions/ws';

export const schema = {
  description: 'Summary view of the ATDome. Contains general information about the dome and mount state',
  defaultSize: [49, 38],
  props: {},
};

const DomeContainer = ({
  dropoutDoorOpeningPercentage,
  mainDoorOpeningPercentage,
  azimuthPosition,
  azimuthState,
  domeInPosition,
  azimuthCommandedState,
  dropoutDoorState,
  mainDoorState,
  azElMountEncoders,
  nasmythMountEncoders,
  detailedState,
  atMountState,
  target,
  mountInPosition,
  currentTimesToLimits,
  positionLimits,
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
      azElMountEncoders={azElMountEncoders}
      nasmythMountEncoders={nasmythMountEncoders}
      detailedState={detailedState}
      atMountState={atMountState}
      target={target}
      mountInPosition={mountInPosition}
      subscribeToStream={subscribeToStream}
      unsubscribeToStream={unsubscribeToStream}
      width={width}
      height={height}
      currentTimesToLimits={currentTimesToLimits}
      positionLimits={positionLimits}
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
      dispatch(requestGroupSubscription('telemetry-ATDome-0-dropoutDoorOpeningPercentage'));
      dispatch(requestGroupSubscription('telemetry-ATDome-0-mainDoorOpeningPercentage'));
      dispatch(requestGroupSubscription('telemetry-ATDome-0-azimuthPosition'));
      dispatch(requestGroupSubscription('event-ATDome-0-azimuthState'));
      dispatch(requestGroupSubscription('event-ATDome-0-azimuthCommandedState'));
      dispatch(requestGroupSubscription('event-ATDome-0-dropoutDoorState'));
      dispatch(requestGroupSubscription('event-ATDome-0-mainDoorState'));
      dispatch(requestGroupSubscription('event-ATDome-0-allAxesInPosition'));
      //ATMCS
      dispatch(requestGroupSubscription('telemetry-ATMCS-0-mount_AzEl_Encoders'));
      dispatch(requestGroupSubscription('telemetry-ATMCS-0-mount_Nasmyth_Encoders'));
      dispatch(requestGroupSubscription('event-ATMCS-0-detailedState'));
      dispatch(requestGroupSubscription('event-ATMCS-0-atMountState'));
      dispatch(requestGroupSubscription('event-ATMCS-0-target'));
      dispatch(requestGroupSubscription('event-ATMCS-0-allAxesInPosition'));
      dispatch(requestGroupSubscription('event-ATMCS-0-m3State'));
      dispatch(requestGroupSubscription('event-ATMCS-0-positionLimits'));
      //ATPtg
      dispatch(requestGroupSubscription('telemetry-ATPtg-1-currentTimesToLimits'));
    },
    unsubscribeToStream: () => {
      //Dome
      dispatch(requestGroupSubscriptionRemoval('telemetry-ATDome-0-dropoutDoorOpeningPercentage'));
      dispatch(requestGroupSubscriptionRemoval('telemetry-ATDome-0-mainDoorOpeningPercentage'));
      dispatch(requestGroupSubscriptionRemoval('telemetry-ATDome-0-azimuthPosition'));
      dispatch(requestGroupSubscriptionRemoval('event-ATDome-0-azimuthState'));
      dispatch(requestGroupSubscriptionRemoval('event-ATDome-0-azimuthCommandedState'));
      dispatch(requestGroupSubscriptionRemoval('event-ATDome-0-dropoutDoorState'));
      dispatch(requestGroupSubscriptionRemoval('event-ATDome-0-mainDoorState'));
      dispatch(requestGroupSubscriptionRemoval('event-ATDome-0-allAxesInPosition'));
      //ATMCS
      dispatch(requestGroupSubscriptionRemoval('telemetry-ATMCS-0-mount_AzEl_Encoders'));
      dispatch(requestGroupSubscriptionRemoval('telemetry-ATMCS-0-mount_Nasmyth_Encoders'));
      dispatch(requestGroupSubscriptionRemoval('event-ATMCS-0-detailedState'));
      dispatch(requestGroupSubscriptionRemoval('event-ATMCS-0-atMountState'));
      dispatch(requestGroupSubscriptionRemoval('event-ATMCS-0-target'));
      dispatch(requestGroupSubscriptionRemoval('event-ATMCS-0-allAxesInPosition'));
      dispatch(requestGroupSubscriptionRemoval('event-ATMCS-0-m3State'));
      dispatch(requestGroupSubscriptionRemoval('event-ATMCS-0-positionLimits'));
      //ATPtg
      dispatch(requestGroupSubscriptionRemoval('telemetry-ATPtg-1-currentTimesToLimits'));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DomeContainer);
