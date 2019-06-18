export const getToken = (state) => state.auth.token;

export const getTokenStatus = (state) => state.auth.status;

export const getStreamsData = (state, groupNames) => {
  if (state.ws === undefined) return undefined;

  const filteredList = state.ws.subscriptions.filter((s) => groupNames.includes(s.groupName));
  const dict = {};

  filteredList.forEach((s) => {
    dict[s.groupName] = s.data;
  });
  return dict;
};

export const getStreamData = (state, groupName) => {
  return getStreamsData(state, [groupName])[groupName];
};

export const getTimestampedStreamData = (state, groupName) => {
  if (state.ws === undefined) return undefined;
  const filteredElement = state.ws.subscriptions.filter((s) => s.groupName === groupName)[0];
  const data = filteredElement ? filteredElement.data : undefined;
  const timestamp = filteredElement ? filteredElement.timestamp : undefined;
  return {
    data: data,
    timestamp: timestamp,
  };
};

export const getCameraState = (state) => {
  return state.camera;
};

export const getDomeState = (state) => {
  const domeSubscriptions = [
    'telemetry-ATDome-position',
    'event-ATDome-azimuthState',
    'event-ATDome-azimuthCommandedState',
    'event-ATDome-dropoutDoorState',
    'event-ATDome-mainDoorState',
    'telemetry-ATMCS-ATMCS_mountEncoders',
    'event-ATMCS-detailedState',
    'event-ATMCS-atMountState',
    'event-ATMCS-target',
  ];
  const domeData = getStreamsData(state, domeSubscriptions);
  return {
    dropoutDoorOpeningPercentage: domeData['telemetry-ATDome-position'] ? domeData['telemetry-ATDome-position']['dropoutDoorOpeningPercentage']:0,
    mainDoorOpeningPercentage: domeData['telemetry-ATDome-position'] ? domeData['telemetry-ATDome-position']['mainDoorOpeningPercentage']:0,
    azimuthPosition: domeData['telemetry-ATDome-position'] ? domeData['telemetry-ATDome-position']['azimuthPosition']:0,
    azimuthState: domeData['event-ATDome-azimuthState'],
    azimuthCommandedState: domeData['event-ATDome-azimuthCommandedState'],
    dropoutDoorState: domeData['event-ATDome-dropoutDoorState'],
    mainDoorState: domeData['event-ATDome-mainDoorState'],
    ATMCS_mountEncoders: domeData['telemetry-ATMCS-ATMCS_mountEncoders'],
    detailedState: domeData['event-ATMCS-detailedState'],
    atMountState: domeData['event-ATMCS-atMountState'],
    target: domeData['event-ATMCS-target'],
  };
};
