export const getToken = (state) => state.auth.token;

export const getUsername = (state) => state.auth.username;

export const getPermCmdExec = (state) => state.auth.permissions.cmd_exec;

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
    'telemetry-ATDome-1-position',
    'event-ATDome-1-azimuthState',
    'event-ATDome-1-azimuthCommandedState',
    'event-ATDome-1-dropoutDoorState',
    'event-ATDome-1-mainDoorState',
    'event-ATDome-1-allAxesInPosition',
    'telemetry-ATMCS-1-mountEncoders',
    'event-ATMCS-1-detailedState',
    'event-ATMCS-1-atMountState',
    'event-ATMCS-1-target',
    'event-ATMCS-1-allAxesInPosition',
  ];
  const domeData = getStreamsData(state, domeSubscriptions);
  return {
    dropoutDoorOpeningPercentage: domeData['telemetry-ATDome-1-position'] ? domeData['telemetry-ATDome-1-position']['dropoutDoorOpeningPercentage']:0,
    mainDoorOpeningPercentage: domeData['telemetry-ATDome-1-position'] ? domeData['telemetry-ATDome-1-position']['mainDoorOpeningPercentage']:0,
    azimuthPosition: domeData['telemetry-ATDome-1-position'] ? domeData['telemetry-ATDome-1-position']['azimuthPosition']:0,
    azimuthState: domeData['event-ATDome-1-azimuthState'],
    azimuthCommandedState: domeData['event-ATDome-1-azimuthCommandedState'],
    domeInPosition: domeData['event-ATDome-1-allAxesInPosition'],
    dropoutDoorState: domeData['event-ATDome-1-dropoutDoorState'],
    mainDoorState: domeData['event-ATDome-1-mainDoorState'],
    mountEncoders: domeData['telemetry-ATMCS-1-mountEncoders'],
    detailedState: domeData['event-ATMCS-1-detailedState'],
    atMountState: domeData['event-ATMCS-1-atMountState'],
    mountInPosition: domeData['event-ATMCS-1-allAxesInPosition'],
    target: domeData['event-ATMCS-1-target'],
  };
};

export const getKey = (dict, key, def) => {
  if (dict && dict !== {} && Object.keys(dict).includes(key)) {
    return dict[key];
  } else {
    return def;
  }
}

export const getScriptQueueState = (state, salindex) => {
  const scriptQueueData = getStreamData(state, `event-ScriptQueueState-${salindex}-stream`);
  return {
    state: getKey(scriptQueueData, 'state', undefined),
    availableScriptList: getKey(scriptQueueData, 'available_scripts', undefined),
    waitingScriptList: getKey(scriptQueueData, 'waiting_scripts', undefined),
    current: getKey(scriptQueueData, 'current', 'None'),
    finishedScriptList: getKey(scriptQueueData, 'finished_scripts', undefined),
  }
}

/**
 * Returns all heartbeats in the state that belong to a scriptqueue of specific salindex.
 *
 * @param {obj} state
 * @param {integer} salindex
 */
export const getScriptHeartbeats = (state, salindex) => {
  return state.heartbeats.scripts.filter(heartbeat => heartbeat.queueSalIndex === salindex);
}

export const getSummaryStateValue = (state, groupName) => {
  const summaryState = getStreamData(state, groupName);
  let summaryStateValue = undefined;
  if (summaryState) {
    summaryStateValue = summaryState[summaryState.length - 1].summaryState.value;
  }
  return summaryStateValue;
}
