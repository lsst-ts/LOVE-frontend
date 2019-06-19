export const hasFakeData = true;
export const hasCommandPrivileges = false;

// eslint-disable-next-line
export const CSCSummaryHierarchy = {
  'Aux Telescope': {
    'ATTCS': [
      'ATMCS',
      'ATPtg'
      'ATDome',
      'ATDomeTrajectory',
      'ATAOS',
      'ATPneumatics',
      'ATHexapod',
    ],
    'ATCalSys':[
      'ATMonochromator',
      'FiberSpectrograph',
      'ATWhiteLight',
      'Electrometer1',
      'Electrometer2',
      'LinearStage1',
      'LinearStage2'
    ],
    'LATISS': [
        'ATCamera',
        'ATArchiver',
        'ATHeaderService',
        'ATSpectrograph'
    ],
  },
  'Main Telescope': {
    'CSC Group 1': ['CSC4'],
    'CSC Group 2': [],
  },
  Observatory: {
    'Queue': [
        'ScriptQueue1',
        'ScriptQueue2',
    ],
    'Environment': [
        'DIMM',
        'Environment',
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
