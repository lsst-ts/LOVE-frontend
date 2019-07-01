import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Dome from './Dome';
import { getDomeState } from '../../../redux/selectors';
import { requestGroupSubscription, requestGroupSubscriptionRemoval } from '../../../redux/actions/ws';
import { hasFakeData } from '../../../Config';

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
  width,
  height,
  subscribeToStream,
  unsubscribeToStream,
}) => {
  const [currentPosition, setCurrentPosition] = useState({
    iter: 0,
    az: 0,
    el: 0,
    domeAz: 0,
    targetAz: 0,
    targetEl: 0,
    targetDomeAz: 0,
  });
  useEffect(() => {
    setInterval(() => {
      setCurrentPosition((prevState) => {
        const newAz = Math.round(Math.random() * 360);
        const newEl = Math.round(Math.random() * 90);
        return {
          iter: prevState.iter === 0 ? 1 : 0,
          az: prevState.targetAz,
          el: prevState.targetEl,
          domeAz: prevState.targetDomeAz,
          targetAz: prevState.iter === 0 ? prevState.targetAz : newAz,
          targetEl: prevState.iter === 0 ? prevState.targetEl : newEl,
          targetDomeAz: prevState.iter === 0 ? prevState.targetDomeAz : newAz + Math.round((Math.random() - 0.5) * 20),
          dropoutDoorOpeningPercentage: 100,
          mainDoorOpeningPercentage: 100,
        };
      });
    }, 2000);
    return () => {};
  }, []);
  if (hasFakeData) {
    return (
      <Dome
        dropoutDoorOpeningPercentage={{ value: currentPosition.dropoutDoorOpeningPercentage }}
        mainDoorOpeningPercentage={{ value: currentPosition.mainDoorOpeningPercentage }}
        azimuthPosition={{ value: currentPosition.domeAz }}
        azimuthState={azimuthState}
        azimuthCommandedState={[
          {
            azimuth: { value: currentPosition.targetDomeAz },
          },
        ]}
        dropoutDoorState={dropoutDoorState}
        mainDoorState={mainDoorState}
        mountEncoders={{
          elevationCalculatedAngle: { value: currentPosition.el },
          azimuthCalculatedAngle: { value: currentPosition.az },
        }}
        detailedState={detailedState}
        atMountState={atMountState}
        target={[
          {
            elevation: { value: currentPosition.targetEl },
            azimuth: { value: currentPosition.targetAz },
            trackId: { value: 0 },
          },
        ]}
        subscribeToStream={subscribeToStream}
        unsubscribeToStream={unsubscribeToStream}
        width={width}
        height={height}
      />
    );
  }

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
      dispatch(requestGroupSubscription('event-ATDome-azimuthCommandedState'));
      dispatch(requestGroupSubscription('event-ATDome-dropoutDoorState'));
      dispatch(requestGroupSubscription('event-ATDome-mainDoorState'));
      dispatch(requestGroupSubscription('event-ATDome-allAxesInPosition'));
      //ATMCS
      dispatch(requestGroupSubscription('telemetry-ATMCS-mountEncoders'));
      dispatch(requestGroupSubscription('event-ATMCS-detailedState'));
      dispatch(requestGroupSubscription('event-ATMCS-atMountState'));
      dispatch(requestGroupSubscription('event-ATMCS-target'));
      dispatch(requestGroupSubscription('event-ATMCS-allAxesInPosition'));
    },
    unsubscribeToStream: () => {
      //Dome
      dispatch(requestGroupSubscriptionRemoval('telemetry-ATDome-dropoutDoorOpeningPercentage'));
      dispatch(requestGroupSubscriptionRemoval('telemetry-ATDome-mainDoorOpeningPercentage'));
      dispatch(requestGroupSubscriptionRemoval('telemetry-ATDome-azimuthPosition'));
      dispatch(requestGroupSubscriptionRemoval('event-ATDome-azimuthState'));
      dispatch(requestGroupSubscriptionRemoval('event-ATDome-azimuthCommandedState'));
      dispatch(requestGroupSubscriptionRemoval('event-ATDome-dropoutDoorState'));
      dispatch(requestGroupSubscriptionRemoval('event-ATDome-mainDoorState'));
      dispatch(requestGroupSubscriptionRemoval('event-ATDome-allAxesInPosition'));
      //ATMCS
      dispatch(requestGroupSubscriptionRemoval('telemetry-ATMCS-mountEncoders'));
      dispatch(requestGroupSubscriptionRemoval('event-ATMCS-detailedState'));
      dispatch(requestGroupSubscriptionRemoval('event-ATMCS-atMountState'));
      dispatch(requestGroupSubscriptionRemoval('event-ATMCS-target'));
      dispatch(requestGroupSubscription('event-ATMCS-allAxesInPosition'));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DomeContainer);
