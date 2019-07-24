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
};
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
    dropoutDoorOpeningPercentage: domeData['telemetry-ATDome-position']
      ? domeData['telemetry-ATDome-position']['dropoutDoorOpeningPercentage']
      : 0,
    mainDoorOpeningPercentage: domeData['telemetry-ATDome-position']
      ? domeData['telemetry-ATDome-position']['mainDoorOpeningPercentage']
      : 0,
    azimuthPosition: domeData['telemetry-ATDome-position']
      ? domeData['telemetry-ATDome-position']['azimuthPosition']
      : 0,
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

export const getKey = (dict, key, def) => {
  if (dict && dict !== {} && Object.keys(dict).includes(key)) {
    return dict[key];
  } else {
    return def;
  }
};

export const getScriptQueueState = (state, salindex) => {
  const scriptQueueData = getStreamData(state, `event-ScriptQueueState-${salindex}-stream`);
  return {
    state: getKey(scriptQueueData, 'state', undefined),
    availableScriptList: getKey(scriptQueueData, 'available_scripts', undefined),
    waitingScriptList: getKey(scriptQueueData, 'waiting_scripts', undefined),
    current: getKey(scriptQueueData, 'current', 'None'),
    finishedScriptList: getKey(scriptQueueData, 'finished_scripts', undefined),
  };
};

/**
 * Returns all heartbeats in the state that belong to a scriptqueue of specific salindex.
 *
 * @param {obj} state
 * @param {integer} salindex
 */
export const getScriptHeartbeats = (state, salindex) => {
  return state.heartbeats.scripts.filter((heartbeat) => heartbeat.queueSalIndex === salindex);
};

export const getSummaryStateValue = (state, groupName) => {
  const summaryState = getStreamData(state, groupName);
  let summaryStateValue = undefined;
  if (summaryState) {
    summaryStateValue = summaryState[summaryState.length - 1].summaryState.value;
  }
  return summaryStateValue;
};

export const getCSCHeartbeats = (state) => {
  return state.heartbeats.cscs;
};

/**
 * Reshape the output of getStreamsData into a dictionary indexed by "csc-salindex" for all "csc-salindex" pairs
 * for which a subscription to a given category and stream exists in the state.
 * Currently hardcoded to use salindex=1 only
 * @param {object} state
 * @param {string} category
 * @param {array} CSCsSalindexList: array [cscname {string}, salindex {int}] pairs 
 * @param {string} stream
 * @param {bool} lastDataOnly: flag to return the last data only instead of the whole array, e.g., {csc: Object} instead of {csc: Array[]}
 */
export const getAllStreamsAsDictionary = (state, category, CSCsSalindexList, stream, lastDataOnly=false) => {
  const groupNames = CSCsSalindexList.map( ([CSC,salindex]) => `${category}-${CSC}-${salindex}-${stream}`);
  const streams = getStreamsData(state, groupNames);

  const dictionary = {};
  CSCsSalindexList.forEach(([CSC, salindex]) => {
    const groupName = `${category}-${CSC}-${salindex}-${stream}`;
    if (Object.keys(streams).includes(groupName)) {
      dictionary[`${CSC}-${salindex}`] = streams[groupName];
      if (dictionary[`${CSC}-${salindex}`] && lastDataOnly) {
        dictionary[`${CSC}-${salindex}`] = dictionary[`${CSC}-${salindex}`][0];
      }
    }
  });

  return dictionary;
};
