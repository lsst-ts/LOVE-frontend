export const getToken = (state) => state.auth.token;

export const getTokenStatus = (state) => state.auth.status;

export const getStreamsData = (state, groupNames) => {
  if(state.ws === undefined)
  return undefined;
  
  const filteredList = state.ws.subscriptions.filter((s) => groupNames.includes(s.groupName));
  const dict = {};

  filteredList.forEach(s => {
    dict[s.groupName] = s.data
  });
  return dict;
};

export const getStreamData = (state, groupName) => {
  return getStreamsData(state, [groupName])[groupName];
};

export const getTimestampedStreamData = (state, groupName) => {
  if(state.ws === undefined)
    return undefined;
  const filteredElement = state.ws.subscriptions.filter((s) => s.groupName === groupName)[0];
  const data = filteredElement ? filteredElement.data : undefined;
  const timestamp = filteredElement ? filteredElement.timestamp : undefined;
  return {
    data: data,
    timestamp: timestamp,
  }
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
