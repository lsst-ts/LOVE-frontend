export const hasFakeData = false;
export const hasCommandPrivileges = true;

// eslint-disable-next-line
export const CSCSummaryHierarchy = {
  'Aux Telescope': {
    'ATTCS': [
      {name: 'ATMCS', salindex: 0 },
      {name: 'ATPtg', salindex: 0},
      {name: 'ATDome', salindex: 0 },
      {name: 'ATDomeTrajectory', salindex: 0 },
      {name: 'ATAOS', salindex: 0 },
      {name: 'ATPneumatics', salindex: 0 },
      {name: 'ATHexapod', salindex: 0 },
    ],
    'ATCalSys':[
      {name:'ATMonochromator', salindex: 0},
      {name:'FiberSpectrograph', salindex: 0},
      {name:'ATWhiteLight', salindex: 0},
      {name:'Electrometer', salindex: 1},
      {name:'Electrometer', salindex: 2},
      {name:'LinearStage', salindex: 1},
      {name: 'LinearStage', salindex: 2}
    ],
    'LATISS': [
        {name:'ATCamera', salindex: 0},
        {name:'ATArchiver', salindex: 0},
        {name:'ATHeaderService', salindex: 0},
        {name: 'ATSpectrograph', salindex: 0}
    ],
  },
  'Main Telescope': {
    'CSC Group 1': [{ name: 'Test', salindex:1},{ name: 'Test', salindex:2}],
    'CSC Group 2': [],
  },
  Observatory: {
    'Queue': [
        {name: 'ScriptQueue', salindex: 1},
        {name: 'ScriptQueue', salindex: 2},
    ],
    'Environment': [
        {name: 'DIMM', salindex: 0},
        {name: 'Environment', salindex: 0},
    ],
  },
};

export const getCameraStatusStyle = (status) => {
  if (!status) return '';
  if (status.toLowerCase() === 'integrating') return 'running';
  if (status.toLowerCase() === 'reading_out') return 'running';
  if (status.toLowerCase() === 'ready') return 'ok';
  if (status.toLowerCase() === 'done') return 'ok';
  return '';
};

export const stateToStyleLATISS = {
  HOMING: 'running',
  MOVING: 'running',
  STATIONARY: 'ok',
  NOTINPOSITION: 'warning',
  NEEDS_CLEAR: 'ok',
  CLEARING: 'running',
  INTEGRATING: 'running',
  READING_OUT: 'running',
  QUIESCENT: 'ok',
  CLOSED: 'ok',
  OPEN: 'ok',
  CLOSING: 'running',
  OPENING: 'running',
};

export const stateToStyleCamera = {
  NEEDS_CLEAR: 'ok',
  CLEARING: 'running',
  INTEGRATING: 'running',
  READING_OUT: 'running',
  QUIESCENT: 'ok',
  READY: 'ok',
  NOT_READY: 'warning',
  GETTING_READY: 'running',
  DISABLED: 'warning',
  ENABLED: 'ok',
  CLOSED: 'ok',
  OPEN: 'ok',
  CLOSING: 'running',
  OPENING: 'running',
  END_READOUT: 'ok',
  END_TELEMETRY: 'ok',
};

// Dome and mount view
export const domeAzimuthStateMap = {
  1: 'NOT MOVING',
  2: 'MOVING CW',
  3: 'MOVING CCW',
  0: 'UNKNOWN',
};

export const dropoutDoorStateMap = {
  1: 'CLOSED',
  2: 'OPEN',
  3: 'PARTIALLY OPEN',
  4: 'OPENING',
  5: 'CLOSING',
  0: 'UNKNOWN',
};

export const mainDoorStateMap = {
  1: 'CLOSED',
  2: 'OPEN',
  3: 'PARTIALLY OPEN',
  4: 'OPENING',
  5: 'CLOSING',
  0: 'UNKNOWN',
};

export const mountTrackingStateMap = {
  1: 'DISABLED',
  2: 'ENABLED',
  3: 'STOPPING',
  0: 'UNKNOWN',
};

export const m3RotatorStateMap = {
  1: 'NASMITH1',
  2: 'NASMITH2',
  3: 'PORT3',
  4: 'INMOTION',
  0: 'UNKNOWN',
};

export const m3PortStateMap = {
  1: 'NASMITH1',
  2: 'NASMITH2',
  3: 'PORT3',
  0: 'UNKNOWN',
};

// LATISS
export const movingElementStateMap = {
  0: 'HOMING',
  1: 'MOVING',
  2: 'STATIONARY',
  3: 'NOTINPOSITION',
};

export const raftsStateMap = {
  0: 'NEEDS_CLEAR',
  1: 'CLEARING',
  2: 'INTEGRATING',
  3: 'READING_OUT',
  4: 'QUIESCENT',
};

export const shutterStateMap = {
  0: 'CLOSED',
  1: 'OPEN',
  2: 'CLOSING',
  3: 'OPENING',
};


export const stateToStyleDomeAndMount = {
  NASMITH1: 'ok',
  NASMITH2: 'ok',
  PORT3: 'ok',
  UNKNOWN: 'warning',
  INMOTION: 'running',
  STOPPING: 'warning',
  ENABLED: 'ok',
  DISABLED: 'warning',
  CLOSING: 'running',
  OPENING: 'running',
  'PARTIALLY OPEN': 'warning',
  OPEN: 'ok',
  CLOSED: 'ok',
  'NOT MOVING': 'ok',
  'MOVING CW': 'running',
  'MOVING CCW': 'running',
};
