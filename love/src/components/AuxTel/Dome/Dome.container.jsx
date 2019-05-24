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
  dropoutDoorState,
  mainDoorState,
  ATMCS_mountEncoders,
  detailedState,
  atMountState,
  target,
  subscribeToStream,
  unsubscribeToStream,
}) => {
  return (
    <Dome
      dropoutDoorOpeningPercentage={dropoutDoorOpeningPercentage}
      mainDoorOpeningPercentage={mainDoorOpeningPercentage}
      azimuthPosition={azimuthPosition}
      azimuthState={azimuthState}
      dropoutDoorState={dropoutDoorState}
      mainDoorState={mainDoorState}
      ATMCS_mountEncoders={ATMCS_mountEncoders}
      detailedState={detailedState}
      atMountState={atMountState}
      target={target}
      subscribeToStream={subscribeToStream}
      unsubscribeToStream={unsubscribeToStream}
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
      dispatch(requestGroupSubscription('telemetry-ATDome-dropoutDoorOpeningPercentage'));
      dispatch(requestGroupSubscription('telemetry-ATDome-mainDoorOpeningPercentage'));
      dispatch(requestGroupSubscription('telemetry-ATDome-azimuthPosition'));
      dispatch(requestGroupSubscription('event-ATDome-azimuthState'));
      dispatch(requestGroupSubscription('event-ATDome-dropoutDoorState'));
      dispatch(requestGroupSubscription('event-ATDome-mainDoorState'));
      //ATMCS
      dispatch(requestGroupSubscription('telemetry-ATMCS-ATMCS_mountEncoders'));
      dispatch(requestGroupSubscription('event-ATMCS-detailedState'));
      dispatch(requestGroupSubscription('event-ATMCS-atMountState'));
      dispatch(requestGroupSubscription('event-ATMCS-target'));
    },
    unsubscribeToStream: () => {
      //Dome
      dispatch(requestGroupSubscriptionRemoval('telemetry-ATDome-dropoutDoorOpeningPercentage'));
      dispatch(requestGroupSubscriptionRemoval('telemetry-ATDome-mainDoorOpeningPercentage'));
      dispatch(requestGroupSubscriptionRemoval('telemetry-ATDome-azimuthPosition'));
      dispatch(requestGroupSubscriptionRemoval('event-ATDome-azimuthState'));
      dispatch(requestGroupSubscriptionRemoval('event-ATDome-dropoutDoorState'));
      dispatch(requestGroupSubscriptionRemoval('event-ATDome-mainDoorState'));
      //ATMCS
      dispatch(requestGroupSubscriptionRemoval('telemetry-ATMCS-ATMCS_mountEncoders'));
      dispatch(requestGroupSubscriptionRemoval('event-ATMCS-detailedState'));
      dispatch(requestGroupSubscriptionRemoval('event-ATMCS-atMountState'));
      dispatch(requestGroupSubscriptionRemoval('event-ATMCS-target'));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DomeContainer);
