export const hasFakeData = false;
export const hasCommandPrivileges = true;
// Whether to simulate websocket messages
export const WEBSOCKET_SIMULATION = false;
// File located in public/websocket-simulations containing a
// set of websocket messages
export const WEBSOCKET_SIMULATION_FILE = 'test.json';
// Base URL for ScriptQueue scripts' documentation
export const SCRIPT_DOCUMENTATION_BASE_URL = 'https://ts-standardscripts.lsst.io/py-api';
// Moment formats
export const ISO_DATE_FORMAT = 'YYYY/MM/DD';
export const TIME_FORMAT = 'HH:mm:ss';
export const DATE_TIME_FORMAT = 'YYYY/MM/DD, HH:mm:ss';

// eslint-disable-next-line
export const CSCSummaryHierarchy = {
  'Aux Telescope': {
    ATTCS: [
      { name: 'ATMCS', salindex: 0 },
      { name: 'ATPtg', salindex: 0 },
      { name: 'ATDome', salindex: 0 },
      { name: 'ATDomeTrajectory', salindex: 0 },
      { name: 'ATAOS', salindex: 0 },
      { name: 'ATPneumatics', salindex: 0 },
      { name: 'ATHexapod', salindex: 0 },
      { name: 'GenericCamera', salindex: 1 },
    ],
    ATCalSys: [
      { name: 'ATMonochromator', salindex: 0 },
      { name: 'FiberSpectrograph', salindex: 0 },
      { name: 'ATWhiteLight', salindex: 0 },
      { name: 'Electrometer', salindex: 1 },
      { name: 'Electrometer', salindex: 2 },
      { name: 'LinearStage', salindex: 1 },
      { name: 'LinearStage', salindex: 2 },
    ],
    LATISS: [
      { name: 'ATCamera', salindex: 0 },
      { name: 'ATArchiver', salindex: 0 },
      { name: 'ATHeaderService', salindex: 0 },
      { name: 'ATSpectrograph', salindex: 0 },
    ],
  },
  'Main Telescope': {
    'CSC Group 1': [
      { name: 'Test', salindex: 1 },
      { name: 'Test', salindex: 2 },
    ],
    'CSC Group 2': [],
  },
  Observatory: {
    Queue: [
      { name: 'ScriptQueue', salindex: 1 },
      { name: 'ScriptQueue', salindex: 2 },
    ],
    WeatherStation: [
      { name: 'DIMM', salindex: 1 },
      { name: 'DIMM', salindex: 2 },
      { name: 'WeatherStation', salindex: 1 },
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

export const stateToStyleMount = {
  'NOT READY': 'running',
  'IN POSITION': 'ok',
  NASMITH1: 'ok',
  NASMITH2: 'ok',
  PORT3: 'ok',
  UNKNOWN: 'invalid',
  CLOSED: 'ok',
  OPEN: 'ok',
  INVALID: 'warning',
  'IN MOTION': 'running',
  'NOT IN POSITION': 'running',
};

export const stateToStyleDome = {
  'IN POSITION': 'ok',
  'NOT IN POSITION': 'running',
};

export const stateToStyleLightpath = {
  CLOSED: 'ok',
  OPEN: 'ok',
  'IN MOTION': 'running',
  INVALID: 'warning',
  'NOT READY': 'running',
  'IN POSITION': 'ok',
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
  4: 'IN MOTION',
  0: 'UNKNOWN',
};

export const m3PortSelectedStateMap = {
  1: 'NASMITH1',
  2: 'NASMITH2',
  3: 'PORT3',
  0: 'UNKNOWN',
};

export const m3InPositionStateMap = {
  1: 'NOT READY',
  2: 'IN POSITION',
  false: 'NOT READY',
  true: 'IN POSITION',
  0: 'UNKNOWN',
};

// ATPneumatics
export const m1CoverStateStateMap = {
  1: 'CLOSED',
  2: 'OPEN',
  3: 'IN MOTION',
  4: 'INVALID',
  0: 'UNKNOWN',
};

export const m1CoverLimitSwitchesStateMap = {
  1: 'OPEN',
  2: 'CLOSED',
  0: 'UNKNOWN',
};

export const m1VentsLimitSwitchesStateMap = {
  1: 'NOT READY',
  2: 'IN POSITION',
  0: 'UNKNOWN',
};

// ATHexapod
export const hexapodInPositionStateMap = {
  1: 'NOT READY',
  2: 'IN POSITION',
  0: 'UNKNOWN',
};

// LATISS
export const movingElementStateMap = {
  1: 'HOMING',
  2: 'MOVING',
  3: 'STATIONARY',
  4: 'NOTINPOSITION',
  0: 'UNKNOWN',
};

export const nasmythRotatorInPositionStateMap = {
  1: 'NOT READY',
  2: 'IN POSITION',
  0: 'UNKNOWN',
};

export const raftsStateMap = {
  1: 'NEEDS_CLEAR',
  2: 'CLEARING',
  3: 'INTEGRATING',
  4: 'READING_OUT',
  5: 'QUIESCENT',
  0: 'UNKNOWN',
};

export const shutterStateMap = {
  1: 'CLOSED',
  2: 'OPEN',
  3: 'CLOSING',
  4: 'OPENING',
  0: 'UNKNOWN',
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

export const motorDriveStateMap = {
  false: 'DISABLED',
  true: 'ENABLED',
};

export const stateToStyleMotorDrive = {
  DISABLED: 'ok',
  ENABLED: 'running',
};

export const motorBrakeStateMap = {
  false: 'DISENGAGED',
  true: 'ENGAGED',
};

export const stateToStyleMotorBrake = {
  DISENGAGED: 'running',
  ENGAGED: 'ok',
};

export const HEARTBEAT_COMPONENTS = {
  MANAGER: 'Manager',
  EVENTS: 'Events',
  TELEMETRIES: 'Telemetries',
  HEARTBEATS: 'CSCHeartbeats',
  LOVE: 'LOVE CSC',
  SCRIPTQUEUE: 'ScriptQueue-1',
  COMMANDER: 'Commander',
};

export const severityToStatus = {
  0: 'unknown',
  1: 'ok',
  2: 'warning',
  3: 'serious',
  4: 'critical',
};

export const severityEnum = {
  unknown: 0,
  ok: 1,
  warning: 2,
  serious: 3,
  critical: 4,
};

export const M1M3ActuatorPositions = [
  {id: 101, position: [-3.0582000e+01,  0.0000000e+00]},
  {id: 102, position: [-5.6794000e+01,  0.0000000e+00]},
  {id: 103, position: [-8.3007000e+01,  0.0000000e+00]},
  {id: 104, position: [-1.0922000e+02,  0.0000000e+00]},
  {id: 105, position: [-1.3543300e+02,  0.0000000e+00]},
  {id: 106, position: [-1.5622100e+02,  0.0000000e+00]},
  {id: 107, position: [-1.7475000e+01, -2.2701000e+01]},
  {id: 108, position: [-4.3688000e+01, -2.2701000e+01]},
  {id: 109, position: [-6.9901000e+01, -2.2701000e+01]},
  {id: 110, position: [-9.6114000e+01, -2.2701000e+01]},
  {id: 111, position: [-1.2232600e+02, -2.2701000e+01]},
  {id: 112, position: [-1.4853900e+02, -2.2701000e+01]},
  {id: 113, position: [ 0.0000000e+00, -4.5402000e+01]},
  {id: 114, position: [-3.0582000e+01, -4.5402000e+01]},
  {id: 115, position: [-5.6794000e+01, -4.5402000e+01]},
  {id: 116, position: [-8.3007000e+01, -4.5402000e+01]},
  {id: 117, position: [-1.0922000e+02, -4.5402000e+01]},
  {id: 118, position: [-1.3543300e+02, -4.5402000e+01]},
  {id: 119, position: [-1.5356300e+02, -3.9279000e+01]},
  {id: 120, position: [-1.7475000e+01, -6.8103000e+01]},
  {id: 121, position: [-4.3688000e+01, -6.8103000e+01]},
  {id: 122, position: [-6.9901000e+01, -6.8103000e+01]},
  {id: 123, position: [-9.6113000e+01, -6.8103000e+01]},
  {id: 124, position: [-1.2232600e+02, -6.8103000e+01]},
  {id: 125, position: [-1.4663200e+02, -5.9762000e+01]},
  {id: 126, position: [ 0.0000000e+00, -9.0804000e+01]},
  {id: 127, position: [-3.0582000e+01, -9.0804000e+01]},
  {id: 128, position: [-5.6794000e+01, -9.0804000e+01]},
  {id: 129, position: [-8.3007000e+01, -9.0804000e+01]},
  {id: 130, position: [-1.0922000e+02, -9.0804000e+01]},
  {id: 131, position: [-1.3338400e+02, -8.5331000e+01]},
  {id: 132, position: [-1.7475000e+01, -1.1350500e+02]},
  {id: 133, position: [-4.3688000e+01, -1.1350500e+02]},
  {id: 134, position: [-6.9901000e+01, -1.1350500e+02]},
  {id: 135, position: [-9.6113000e+01, -1.1350500e+02]},
  {id: 136, position: [-1.1572300e+02, -1.0807800e+02]},
  {id: 137, position: [-8.7380000e+00, -1.3620600e+02]},
  {id: 138, position: [-3.4950000e+01, -1.3620600e+02]},
  {id: 139, position: [-6.1163000e+01, -1.2863900e+02]},
  {id: 140, position: [-8.2273000e+01, -1.3529100e+02]},
  {id: 141, position: [-1.4399000e+01, -1.5768700e+02]},
  {id: 142, position: [-4.2720000e+01, -1.5247100e+02]},
  {id: 143, position: [-6.3150000e+01, -1.4538500e+02]},
  {id: 207, position: [ 1.7475000e+01, -2.2701000e+01]},
  {id: 208, position: [ 4.3688000e+01, -2.2701000e+01]},
  {id: 209, position: [ 6.9901000e+01, -2.2701000e+01]},
  {id: 210, position: [ 9.6114000e+01, -2.2701000e+01]},
  {id: 211, position: [ 1.2232600e+02, -2.2701000e+01]},
  {id: 212, position: [ 1.4853900e+02, -2.2701000e+01]},
  {id: 214, position: [ 3.0582000e+01, -4.5402000e+01]},
  {id: 215, position: [ 5.6794000e+01, -4.5402000e+01]},
  {id: 216, position: [ 8.3007000e+01, -4.5402000e+01]},
  {id: 217, position: [ 1.0922000e+02, -4.5402000e+01]},
  {id: 218, position: [ 1.3543300e+02, -4.5402000e+01]},
  {id: 219, position: [ 1.5356300e+02, -3.9279000e+01]},
  {id: 220, position: [ 1.7475000e+01, -6.8103000e+01]},
  {id: 221, position: [ 4.3688000e+01, -6.8103000e+01]},
  {id: 222, position: [ 6.9901000e+01, -6.8103000e+01]},
  {id: 223, position: [ 9.6113000e+01, -6.8103000e+01]},
  {id: 224, position: [ 1.2232600e+02, -6.8103000e+01]},
  {id: 225, position: [ 1.4663200e+02, -5.9762000e+01]},
  {id: 227, position: [ 3.0582000e+01, -9.0804000e+01]},
  {id: 228, position: [ 5.6794000e+01, -9.0804000e+01]},
  {id: 229, position: [ 8.3007000e+01, -9.0804000e+01]},
  {id: 230, position: [ 1.0922000e+02, -9.0804000e+01]},
  {id: 231, position: [ 1.3338400e+02, -8.5331000e+01]},
  {id: 232, position: [ 1.7475000e+01, -1.1350500e+02]},
  {id: 233, position: [ 4.3688000e+01, -1.1350500e+02]},
  {id: 234, position: [ 6.9901000e+01, -1.1350500e+02]},
  {id: 235, position: [ 9.6113000e+01, -1.1350500e+02]},
  {id: 236, position: [ 1.1572300e+02, -1.0807800e+02]},
  {id: 237, position: [ 8.7380000e+00, -1.3620600e+02]},
  {id: 238, position: [ 3.4950000e+01, -1.3620600e+02]},
  {id: 239, position: [ 6.1163000e+01, -1.2863900e+02]},
  {id: 240, position: [ 8.2273000e+01, -1.3529100e+02]},
  {id: 241, position: [ 1.4399000e+01, -1.5768700e+02]},
  {id: 242, position: [ 4.2720000e+01, -1.5247100e+02]},
  {id: 243, position: [ 6.3150000e+01, -1.4538500e+02]},
  {id: 301, position: [ 3.0582000e+01,  0.0000000e+00]},
  {id: 302, position: [ 5.6794000e+01,  0.0000000e+00]},
  {id: 303, position: [ 8.3007000e+01,  0.0000000e+00]},
  {id: 304, position: [ 1.0922000e+02,  0.0000000e+00]},
  {id: 305, position: [ 1.3543300e+02,  0.0000000e+00]},
  {id: 306, position: [ 1.5622100e+02, -9.7000000e-02]},
  {id: 307, position: [ 1.7475000e+01,  2.2701000e+01]},
  {id: 308, position: [ 4.3688000e+01,  2.2701000e+01]},
  {id: 309, position: [ 6.9901000e+01,  2.2701000e+01]},
  {id: 310, position: [ 9.6114000e+01,  2.2701000e+01]},
  {id: 311, position: [ 1.2232600e+02,  2.2701000e+01]},
  {id: 312, position: [ 1.4853900e+02,  2.2701000e+01]},
  {id: 313, position: [ 0.0000000e+00,  4.5402000e+01]},
  {id: 314, position: [ 3.0582000e+01,  4.5402000e+01]},
  {id: 315, position: [ 5.6794000e+01,  4.5402000e+01]},
  {id: 316, position: [ 8.3007000e+01,  4.5402000e+01]},
  {id: 317, position: [ 1.0922000e+02,  4.5402000e+01]},
  {id: 318, position: [ 1.3543300e+02,  4.5402000e+01]},
  {id: 319, position: [ 1.5356300e+02,  3.9279000e+01]},
  {id: 320, position: [ 1.7475000e+01,  6.8103000e+01]},
  {id: 321, position: [ 4.3688000e+01,  6.8103000e+01]},
  {id: 322, position: [ 6.9901000e+01,  6.8103000e+01]},
  {id: 323, position: [ 9.6113000e+01,  6.8103000e+01]},
  {id: 324, position: [ 1.2232600e+02,  6.8103000e+01]},
  {id: 325, position: [ 1.4663200e+02,  5.9762000e+01]},
  {id: 326, position: [ 0.0000000e+00,  9.0804000e+01]},
  {id: 327, position: [ 3.0582000e+01,  9.0804000e+01]},
  {id: 328, position: [ 5.6794000e+01,  9.0804000e+01]},
  {id: 329, position: [ 8.3007000e+01,  9.0804000e+01]},
  {id: 330, position: [ 1.0922000e+02,  9.0804000e+01]},
  {id: 331, position: [ 1.3338400e+02,  8.5331000e+01]},
  {id: 332, position: [ 1.7475000e+01,  1.1350500e+02]},
  {id: 333, position: [ 4.3688000e+01,  1.1350500e+02]},
  {id: 334, position: [ 6.9901000e+01,  1.1350500e+02]},
  {id: 335, position: [ 9.6113000e+01,  1.1350500e+02]},
  {id: 336, position: [ 1.1572300e+02,  1.0807800e+02]},
  {id: 337, position: [ 8.7380000e+00,  1.3620600e+02]},
  {id: 338, position: [ 3.4950000e+01,  1.3620600e+02]},
  {id: 339, position: [ 6.1163000e+01,  1.2863900e+02]},
  {id: 340, position: [ 8.2273000e+01,  1.3529100e+02]},
  {id: 341, position: [ 1.4399000e+01,  1.5768700e+02]},
  {id: 342, position: [ 4.2720000e+01,  1.5247100e+02]},
  {id: 343, position: [ 6.3150000e+01,  1.4538500e+02]},
  {id: 407, position: [-1.7475000e+01,  2.2701000e+01]},
  {id: 408, position: [-4.3688000e+01,  2.2701000e+01]},
  {id: 409, position: [-6.9901000e+01,  2.2701000e+01]},
  {id: 410, position: [-9.6114000e+01,  2.2701000e+01]},
  {id: 411, position: [-1.2232600e+02,  2.2701000e+01]},
  {id: 412, position: [-1.4853900e+02,  2.2701000e+01]},
  {id: 414, position: [-3.0582000e+01,  4.5402000e+01]},
  {id: 415, position: [-5.6794000e+01,  4.5402000e+01]},
  {id: 416, position: [-8.3007000e+01,  4.5402000e+01]},
  {id: 417, position: [-1.0922000e+02,  4.5402000e+01]},
  {id: 418, position: [-1.3543300e+02,  4.5402000e+01]},
  {id: 419, position: [-1.5356300e+02,  3.9279000e+01]},
  {id: 420, position: [-1.7475000e+01,  6.8103000e+01]},
  {id: 421, position: [-4.3688000e+01,  6.8103000e+01]},
  {id: 422, position: [-6.9901000e+01,  6.8103000e+01]},
  {id: 423, position: [-9.6113000e+01,  6.8103000e+01]},
  {id: 424, position: [-1.2232600e+02,  6.8103000e+01]},
  {id: 425, position: [-1.4663200e+02,  5.9762000e+01]},
  {id: 427, position: [-3.0582000e+01,  9.0804000e+01]},
  {id: 428, position: [-5.6794000e+01,  9.0804000e+01]},
  {id: 429, position: [-8.3007000e+01,  9.0804000e+01]},
  {id: 430, position: [-1.0922000e+02,  9.0804000e+01]},
  {id: 431, position: [-1.3338400e+02,  8.5331000e+01]},
  {id: 432, position: [-1.7475000e+01,  1.1350500e+02]},
  {id: 433, position: [-4.3688000e+01,  1.1350500e+02]},
  {id: 434, position: [-6.9901000e+01,  1.1350500e+02]},
  {id: 435, position: [-9.6113000e+01,  1.1350500e+02]},
  {id: 436, position: [-1.1572300e+02,  1.0807800e+02]},
  {id: 437, position: [-8.7380000e+00,  1.3620600e+02]},
  {id: 438, position: [-3.4950000e+01,  1.3620600e+02]},
  {id: 439, position: [-6.1163000e+01,  1.2863900e+02]},
  {id: 440, position: [-8.2273000e+01,  1.3529100e+02]},
  {id: 441, position: [-1.4399000e+01,  1.5768700e+02]},
  {id: 442, position: [-4.2720000e+01,  1.5247100e+02]},
  {id: 443, position: [-6.3150000e+01,  1.4538500e+02]}
  ]