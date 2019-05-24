export const getToken = (state) => state.auth.token;

export const getTokenStatus = (state) => state.auth.status;

export const getStreamData = (state, groupName) => {
  return state.ws.subscriptions.filter((s) => s.groupName === groupName)[0].data;
};

export const getCameraState = (state) => {
  return state.camera;
};

export const getDomeState = (state) => {
  console.log(state.ws.subscriptions)
  return {
    dropoutDoorOpeningPercentage: state.ws.subscriptions['telemetry-ATDome-dropoutDoorOpeningPercentage'] ? state.ws.subscriptions['telemetry-ATDome-dropoutDoorOpeningPercentage'].data: {},
    mainDoorOpeningPercentage: state.ws.subscriptions['telemetry-ATDome-mainDoorOpeningPercentage'] ? state.ws.subscriptions['telemetry-ATDome-mainDoorOpeningPercentage'].data: {},
    azimuthPosition: state.ws.subscriptions['telemetry-ATDome-azimuthPosition'] ? state.ws.subscriptions['telemetry-ATDome-azimuthPosition'].data: {},
    azimuthState: state.ws.subscriptions['event-ATDome-azimuthState'] ? state.ws.subscriptions['event-ATDome-azimuthState'].data: {},
    dropoutDoorState: state.ws.subscriptions['event-ATDome-dropoutDoorState'] ? state.ws.subscriptions['event-ATDome-dropoutDoorState'].data: {},
    mainDoorState: state.ws.subscriptions['event-ATDome-mainDoorState'] ? state.ws.subscriptions['event-ATDome-mainDoorState'].data: {},
    ATMCS_mountEncoders: state.ws.subscriptions['telemetry-ATMCS-ATMCS_mountEncoders'] ? state.ws.subscriptions['telemetry-ATMCS-ATMCS_mountEncoders'].data: {},
    detailedState: state.ws.subscriptions['event-ATMCS-detailedState'] ? state.ws.subscriptions['event-ATMCS-detailedState'].data: {},
    atMountState: state.ws.subscriptions['event-ATMCS-atMountState'] ? state.ws.subscriptions['event-ATMCS-atMountState'].data: {},
    target: state.ws.subscriptions['event-ATMCS-target'] ? state.ws.subscriptions['event-ATMCS-target'].data: {},
  }
}