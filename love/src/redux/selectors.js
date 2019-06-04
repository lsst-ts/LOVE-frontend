export const getToken = (state) => state.auth.token;

export const getTokenStatus = (state) => state.auth.status;

export const getStreamData = (state, groupName) => {
  return state.ws.subscriptions.filter((s) => s.groupName === groupName)[0] ? state.ws.subscriptions.filter((s) => s.groupName === groupName)[0].data : undefined;
};

export const getCameraState = (state) => {
  return state.camera;
};

export const getDomeState = (state) => {
  return {
    dropoutDoorOpeningPercentage: state.ws.subscriptions['telemetry-ATDome-dropoutDoorOpeningPercentage']
      ? state.ws.subscriptions['telemetry-ATDome-dropoutDoorOpeningPercentage'].data
      : undefined,
    mainDoorOpeningPercentage: state.ws.subscriptions['telemetry-ATDome-mainDoorOpeningPercentage']
      ? state.ws.subscriptions['telemetry-ATDome-mainDoorOpeningPercentage'].data
      : undefined,
    azimuthPosition: state.ws.subscriptions['telemetry-ATDome-azimuthPosition']
      ? state.ws.subscriptions['telemetry-ATDome-azimuthPosition'].data
      : undefined,
    azimuthState: state.ws.subscriptions['event-ATDome-azimuthState']
      ? state.ws.subscriptions['event-ATDome-azimuthState'].data
      : undefined,
    azimuthCommandedState: state.ws.subscriptions['event-ATDome-azimuthState']
      ? state.ws.subscriptions['event-ATDome-azimuthState'].data
      : undefined,
    dropoutDoorState: state.ws.subscriptions['event-ATDome-dropoutDoorState']
      ? state.ws.subscriptions['event-ATDome-dropoutDoorState'].data
      : undefined,
    mainDoorState: state.ws.subscriptions['event-ATDome-mainDoorState']
      ? state.ws.subscriptions['event-ATDome-mainDoorState'].data
      : undefined,
    ATMCS_mountEncoders: state.ws.subscriptions['telemetry-ATMCS-ATMCS_mountEncoders']
      ? state.ws.subscriptions['telemetry-ATMCS-ATMCS_mountEncoders'].data
      : undefined,
    detailedState: state.ws.subscriptions['event-ATMCS-detailedState']
      ? state.ws.subscriptions['event-ATMCS-detailedState'].data
      : undefined,
    atMountState: state.ws.subscriptions['event-ATMCS-atMountState']
      ? state.ws.subscriptions['event-ATMCS-atMountState'].data
      : undefined,
    target: state.ws.subscriptions['event-ATMCS-target']
      ? state.ws.subscriptions['event-ATMCS-target'].data
      : undefined,
  };
};
