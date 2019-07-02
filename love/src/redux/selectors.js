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

export const getLastSALCommand = (state) => {
  return state.ws.lastSALCommand;
}
export const getDomeState = (state) => {
  const domeSubscriptions = [
    'telemetry-ATDome-position',
    'event-ATDome-azimuthState',
    'event-ATDome-azimuthCommandedState',
    'event-ATDome-dropoutDoorState',
    'event-ATDome-mainDoorState',
    'event-ATDome-allAxesInPosition',
    'telemetry-ATMCS-mountEncoders',
    'event-ATMCS-detailedState',
    'event-ATMCS-atMountState',
    'event-ATMCS-target',
    'event-ATMCS-allAxesInPosition',
  ];
  const domeData = getStreamsData(state, domeSubscriptions);
  return {
    dropoutDoorOpeningPercentage: domeData['telemetry-ATDome-position'] ? domeData['telemetry-ATDome-position']['dropoutDoorOpeningPercentage']:0,
    mainDoorOpeningPercentage: domeData['telemetry-ATDome-position'] ? domeData['telemetry-ATDome-position']['mainDoorOpeningPercentage']:0,
    azimuthPosition: domeData['telemetry-ATDome-position'] ? domeData['telemetry-ATDome-position']['azimuthPosition']:0,
    azimuthState: domeData['event-ATDome-azimuthState'],
    azimuthCommandedState: domeData['event-ATDome-azimuthCommandedState'],
    domeInPosition: domeData['event-ATDome-allAxesInPosition'],
    dropoutDoorState: domeData['event-ATDome-dropoutDoorState'],
    mainDoorState: domeData['event-ATDome-mainDoorState'],
    mountEncoders: domeData['telemetry-ATMCS-mountEncoders'],
    detailedState: domeData['event-ATMCS-detailedState'],
    atMountState: domeData['event-ATMCS-atMountState'],
    mountInPosition: domeData['event-ATMCS-allAxesInPosition'],
    target: domeData['event-ATMCS-target'],
  };
};


export const getCurrentScript = (state) => {
  const ScriptQueueData = getStreamData(state, 'event-ScriptQueueState-stream');
  if(!ScriptQueueData || !ScriptQueueData.current) return 'None';

  return ScriptQueueData.current;
}

export const getKey = (dict, key, def) => {
  if (dict && dict !== {} && Object.keys(dict).includes(key)) {
    return dict[key];
  } else {
    return def;
  }  
}

export const getScriptQueueState = (state) => {
  const scriptQueueData = getStreamData(state, 'event-ScriptQueueState-stream');
  return {
    state: getKey(scriptQueueData, 'state', undefined),
    availableScripts: getKey(scriptQueueData, 'available_scripts', undefined),
    waitingScripts: getKey(scriptQueueData, 'waiting_scripts', undefined),
    currentScript: getKey(scriptQueueData, 'current', 'None'),
    finishedScripts: getKey(scriptQueueData, 'finished_scripts', undefined),
  }
}