export const hasFakeData = true;
export const hasCommandPrivileges = false;

// eslint-disable-next-line
export const CSCSummaryHierarchy = {
  'Aux Telescope': {
    'CSC Group 1': [
      'ScriptQueue',
      'scheduler',
      'ATMonochromator',
      'FiberSpectrograph',
      'ATCamera',
      'Scheduler3',
      'ScriptQueue3',
      'Scheduler4',
      'ScriptQueue4',
      'Scheduler5',
      'ScriptQueue5',
      'Scheduler6',
      'ScriptQueue6',
      'Scheduler7',
      'ScriptQueue7',
      'Scheduler8',
      'ScriptQueue8',
      'Scheduler9',
      'ScriptQueue9',
      'Scheduler10',
      'ScriptQueue10',
      'Scheduler11',
      'ScriptQueue11',
      'Scheduler12',
      'ScriptQueue12',
      'Scheduler13',
      'ScriptQueue13',
      'Scheduler14',
      'ScriptQueue14',
      'Scheduler15',
      'ScriptQueue15',
      'Scheduler16',
      'ScriptQueue16',
      'Scheduler17',
      'ScriptQueue17',
      'Scheduler18',
      'ScriptQueue18',
      'Scheduler19',
      'ScriptQueue19',
      'Scheduler20',
    ],
  },
  'Main Telescope': {
    'CSC Group 1': ['CSC4'],
    'CSC Group 2': [],
  },
  Observatory: {
    'CSC Group 1': [],
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
