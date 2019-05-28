import React, { useState, useEffect } from 'react';
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
  const [currentPosition, setCurrentPosition] = useState({ az: 0, el: 0, targetAz: 0, targetEl: 0 });
  useEffect(() => {
    setInterval(() => {
      setCurrentPosition((prevState) => {
        return {
          az: prevState.targetAz,
          el: prevState.targetEl,
          domeAz: Math.random() * 360,
          targetAz: Math.random() * 360,
          targetEl: Math.random() * 90,
          dropoutDoorOpeningPercentage: Math.random() * 100,
          mainDoorOpeningPercentage: Math.random() * 100,
        };
      });
    }, 2000);
    return () => {};
  }, []);
  return (
    <Dome
      dropoutDoorOpeningPercentage={currentPosition.dropoutDoorOpeningPercentage}
      mainDoorOpeningPercentage={currentPosition.mainDoorOpeningPercentage}
      azimuthPosition={currentPosition.domeAz}
      azimuthState={azimuthState}
      dropoutDoorState={dropoutDoorState}
      mainDoorState={mainDoorState}
      ATMCS_mountEncoders={{
        elevationCalculatedAngle: currentPosition.el,
        azimuthCalculatedAngle: currentPosition.az,
      }}
      detailedState={detailedState}
      atMountState={atMountState}
      target={{
        elevation: currentPosition.targetEl,
        azimuth: currentPosition.targetAz,
      }}
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
