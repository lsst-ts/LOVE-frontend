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
};

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
    dropoutDoorOpeningPercentage: domeData['telemetry-ATDome-1-position']
      ? domeData['telemetry-ATDome-1-position']['dropoutDoorOpeningPercentage']
      : 0,
    mainDoorOpeningPercentage: domeData['telemetry-ATDome-1-position']
      ? domeData['telemetry-ATDome-1-position']['mainDoorOpeningPercentage']
      : 0,
    azimuthPosition: domeData['telemetry-ATDome-1-position']
      ? domeData['telemetry-ATDome-1-position']['azimuthPosition']
      : 0,
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

export const getLATISSState = (state) => {
  const latissSubscriptions = [
    // Spectrograph
    'event-ATSpectrograph-0-reportedFilterPosition',
    'event-ATSpectrograph-0-reportedDisperserPosition',
    'event-ATSpectrograph-0-reportedLinearStagePosition',
    'event-ATSpectrograph-0-lsState',
    'event-ATSpectrograph-0-fwState',
    'event-ATSpectrograph-0-gwState',
    // Camera
    'event-ATCamera-0-shutterDetailedState',
    'event-ATCamera-0-raftsDetailedState',
  ];
  const latissData = getStreamsData(state, latissSubscriptions);
  const reportedFilterPosition = latissData['event-ATSpectrograph-0-reportedFilterPosition'];
  const reportedDisperserPosition = latissData['event-ATSpectrograph-0-reportedDisperserPosition'];
  const reportedLinearStagePosition = latissData['event-ATSpectrograph-0-reportedLinearStagePosition'];
  const lsState = latissData['event-ATSpectrograph-0-lsState'];
  const fwState = latissData['event-ATSpectrograph-0-fwState'];
  const gwState = latissData['event-ATSpectrograph-0-gwState'];
  const shutterDetailedState = latissData['event-ATCamera-0-shutterDetailedState'];
  const raftsDetailedState = latissData['event-ATCamera-0-raftsDetailedState'];

  return {
    reportedFilterPosition: reportedFilterPosition
      ? reportedFilterPosition[reportedFilterPosition.length - 1]['position'].value
      : 0,
    reportedFilterName: reportedFilterPosition
      ? reportedFilterPosition[reportedFilterPosition.length - 1]['name'].value
      : '',
    reportedDisperserPosition: reportedDisperserPosition
      ? reportedDisperserPosition[reportedDisperserPosition.length - 1]['position'].value
      : 0,
    reportedDisperserName: reportedDisperserPosition
      ? reportedDisperserPosition[reportedDisperserPosition.length - 1]['name'].value
      : '',
    reportedLinearStagePosition: reportedLinearStagePosition
      ? reportedLinearStagePosition[reportedLinearStagePosition.length - 1]['position'].value
      : 0,
    lsState: lsState ? lsState[lsState.length - 1]['state'].value : 0,
    fwState: fwState ? fwState[fwState.length - 1]['state'].value : 0,
    gwState: gwState ? gwState[gwState.length - 1]['state'].value : 0,
    shutterDetailedState: shutterDetailedState
      ? shutterDetailedState[shutterDetailedState.length - 1]['substate'].value
      : 0,
    raftsDetailedState: raftsDetailedState ? raftsDetailedState[raftsDetailedState.length - 1]['substate'].value : 0,
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
