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
  'Auxiliary Telescope': {
    ATTCS: [
      { name: 'ATMCS', salindex: 0 },
      { name: 'ATPtg', salindex: 0 },
      { name: 'ATDome', salindex: 0 },
      { name: 'ATDomeTrajectory', salindex: 0 },
      { name: 'ATAOS', salindex: 0 },
      { name: 'ATPneumatics', salindex: 0 },
      { name: 'ATHexapod', salindex: 0 },
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
    MTCS: [
      { name: 'MTMount', salindex: 0 },
      { name: 'MTPtg', salindex: 0 },
      { name: 'MTAOS', salindex: 0 },
      { name: 'MTM1M3', salindex: 0 },
      { name: 'MTM2', salindex: 0 },
      { name: 'MTHexapod', salindex: 1 },
      { name: 'MTHexapod', salindex: 2 },
      { name: 'MTRotator', salindex: 0 },
      { name: 'MTDome', salindex: 0 },
      { name: 'MTDomeTrajectory', salindex: 0 },
    ],
    ComCam: [
      { name: 'CCCamera', salindex: 0 },
      { name: 'CCArchiver', salindex: 0 },
      { name: 'CCHeaderService', salindex: 0 },
    ],
  },
  Observatory: {
    HigherLevel: [
      { name: 'ScriptQueue', salindex: 1 },
      { name: 'ScriptQueue', salindex: 2 },
      { name: 'Watcher', salindex: 0 },
    ],
    Environment: [
      { name: 'DIMM', salindex: 1 },
      { name: 'DIMM', salindex: 2 },
      { name: 'WeatherStation', salindex: 1 },
    ],
  },
};

export const defaultCSCList = [
  { name: 'ATMCS', salindex: 0 },
  { name: 'ATPtg', salindex: 0 },
  { name: 'ATDome', salindex: 0 },
  { name: 'ATDomeTrajectory', salindex: 0 },
  { name: 'ATAOS', salindex: 0 },
  { name: 'ATPneumatics', salindex: 0 },
  { name: 'ATHexapod', salindex: 0 },
  { name: 'ATMonochromator', salindex: 0 },
  { name: 'FiberSpectrograph', salindex: 0 },
  { name: 'ATWhiteLight', salindex: 0 },
  { name: 'Electrometer', salindex: 1 },
  { name: 'Electrometer', salindex: 2 },
  { name: 'LinearStage', salindex: 1 },
  { name: 'LinearStage', salindex: 2 },
  { name: 'ATCamera', salindex: 0 },
  { name: 'ATArchiver', salindex: 0 },
  { name: 'ATHeaderService', salindex: 0 },
  { name: 'ATSpectrograph', salindex: 0 },
  { name: 'MTMount', salindex: 0 },
  { name: 'MTPtg', salindex: 0 },
  { name: 'MTAOS', salindex: 0 },
  { name: 'MTM1M3', salindex: 0 },
  { name: 'MTM2', salindex: 0 },
  { name: 'MTHexapod', salindex: 1 },
  { name: 'MTHexapod', salindex: 2 },
  { name: 'MTRotator', salindex: 0 },
  { name: 'MTDome', salindex: 0 },
  { name: 'MTDomeTrajectory', salindex: 0 },
  { name: 'CCCamera', salindex: 0 },
  { name: 'CCArchiver', salindex: 0 },
  { name: 'CCHeaderService', salindex: 0 },
  { name: 'ScriptQueue', salindex: 1 },
  { name: 'ScriptQueue', salindex: 2 },
  { name: 'Watcher', salindex: 0 },
  { name: 'DIMM', salindex: 1 },
  { name: 'DIMM', salindex: 2 },
  { name: 'WeatherStation', salindex: 1 },
];

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
  'NOT READY': 'warning',
  'IN POSITION': 'ok',
  NASMITH1: 'ok',
  NASMITH2: 'ok',
  PORT3: 'ok',
  CLOSED: 'ok',
  OPEN: 'ok',
  OPENED: 'ok',
  REMOTECONTROL: 'ok',
  HANDPADDLECONTROL: 'ok',
  INVALID: 'warning',
  'IN MOTION': 'running',
  'NOT IN POSITION': 'running',
  UNKNOWN: 'invalid',
  'UNKNOWN POSITION': 'invalid',
};

export const stateToStyleDome = {
  'IN POSITION': 'ok',
  'NOT IN POSITION': 'warning',
};

export const stateToStyleLightpath = {
  DISABLED: 'warning',
  ENABLED: 'ok',
  FAULT: 'warning',
  OFFLINE: 'warning',
  STANDBY: 'warning',
  CLOSED: 'ok',
  OPEN: 'ok',
  OPENED: 'ok',
  'IN MOTION': 'running',
  INVALID: 'warning',
  'NOT READY': 'warning',
  'IN POSITION': 'ok',
  UNKNOWN: 'invalid',
  'UNKNOWN POSITION': 'invalid',
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
  1: 'REMOTECONTROL',
  2: 'HANDPADDLECONTROL',
  6: 'NASMITH1',
  7: 'NASMITH2',
  8: 'PORT3',
  9: 'IN MOTION',
  10: 'UNKNOWN POSITION',
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
  0: 'UNKNOWN',
};

// ATPneumatics
export const m1CoverStateStateMap = {
  1: 'DISABLED',
  2: 'ENABLED',
  3: 'FAULT',
  4: 'OFFLINE',
  5: 'STANDBY',
  6: 'CLOSED',
  7: 'OPENED',
  8: 'IN MOTION',
  9: 'INVALID',
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
  UNKNOWN: 'invalid',
  INMOTION: 'running',
  STOPPING: 'warning',
  ENABLED: 'ok',
  DISABLED: 'warning',
  CLOSING: 'warning',
  OPENING: 'warning',
  'PARTIALLY OPEN': 'warning',
  OPEN: 'ok',
  CLOSED: 'ok',
  'NOT MOVING': 'ok',
  'MOVING CW': 'warning',
  'MOVING CCW': 'warning',
};

export const motorDriveStateMap = {
  false: 'DISABLED',
  true: 'ENABLED',
};

export const stateToStyleMTMountCommander = {
  'NONE': 'invalid',
  'CSC': 'ok',
  'EUI': 'warning',
  'HHD': 'warning',
};

export const mtMountCommanderStateMap = {
  0: 'NONE',
  1: 'CSC',
  2: 'EUI',
  3: 'HHD',
};

export const stateToStyleMTMountPowerState = {
  'OFF': 'invalid',
  'ON': 'ok',
  'FAULT': 'alert',
  'TURNING_ON': 'warning',
  'TURNING_OFF': 'warning',
  'UNKNOWN': 'invalid',
};

export const mtMountPowerStateMap = {
  0: 'OFF',
  1: 'ON',
  2: 'FAULT',
  3: 'TURNING_ON',
  4: 'TURNING_OFF',
  15: 'UNKNOWN',
};

export const stateToStyleMTMountAxisMotionState = {
  'STOPPING': 'warning',
  'STOPPED': 'ok',
  'MOVING_POINT_TO_POINT': 'warning',
  'JOGGING': 'warning',
  'TRACKING': 'warning',
  'TRACKING_PAUSED': 'warning',
};

export const mtMountAxisMotionStateMap = {
  0: 'STOPPING',
  1: 'STOPPED',
  2: 'MOVING_POINT_TO_POINT',
  3: 'JOGGING',
  4: 'TRACKING',
  5: 'TRACKING_PAUSED',
};

export const mtMountMirrorCoversStateMap = {
  0: 'RETRACTED',
  1: 'DEPLOYED',
  2: 'RETRACTING',
  3: 'DEPLOYING',
  4: 'LOST',
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
  COMMANDER: 'Commander',
  /** Deprecated: used for old producer version */
  /* EVENTS: 'Events',
  TELEMETRIES: 'Telemetries', */
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

/**
 * Available commands in the TCS and their parameters. Each command is represented
 * as a dictionary key and their parameters as the values of said dictionary.
 * Within each dictionary value, each parameter is represented in a separate dictionary.
 * Each key in this new dictionary contains the parameter name and each corresponding
 * value contains a 2 item array with its first element being the param type, e.g.
 * 'string', 'angle', 'number', 'boolean'. The second element contains the default
 * value.
 *
 */

const rotTypes = [
  { label: 'Sky', value: 0 },
  { label: 'SkyAuto', value: 1 },
  { label: 'Parallactic', value: 2 },
  { label: 'PhysicalSky', value: 3 },
  { label: 'Physical', value: 4 },
];

export const TCSCommands = {
  slew_object: {
    name: ['string', undefined],
    rot: ['angle', 0.0],
    rot_type: [rotTypes, rotTypes[1]],
    slew_timeout: ['number', 240.0],
  },
  slew_icrs: {
    ra: ['angle', undefined],
    dec: ['angle', undefined],
    rot: ['angle', 0.0],
    rot_type: [rotTypes, rotTypes[1]],
    target_name: ['string', 'slew_icrs'],
    slew_timeout: ['number', 240.0],
    stop_before_slew: ['boolean', true],
    wait_settle: ['boolean', true],
  },
  point_azel: {
    az: ['angle', undefined],
    el: ['angle', undefined],
    rot_tel: ['angle', 0.0],
    target_name: ['string', 'azel_target'],
    wait_dome: ['boolean', false],
    slew_timeout: ['number', 1200.0],
  },
  offset_xy: {
    x: ['number', undefined],
    y: ['number', undefined],
    relative: ['boolean', false],
    persistent: ['boolean', false],
  },
  offset_azel: {
    az: ['number', undefined],
    el: ['number', undefined],
    relative: ['boolean', false],
    persistent: ['boolean', false],
  },
  offset_radec: {
    ra: ['angle', undefined],
    dec: ['angle', undefined],
  },
  slew_dome_to: {
    az: ['number', undefined],
  },
  // focus_offset: {},
  home_dome: {},
};

export const ATCSCommands = {
  ...TCSCommands,
};

export const M1M3ActuatorPositions = [
  { id: 101, position: [-3.0582e1, 0.0] },
  { id: 102, position: [-5.6794e1, 0.0] },
  { id: 103, position: [-8.3007e1, 0.0] },
  { id: 104, position: [-1.0922e2, 0.0] },
  { id: 105, position: [-1.35433e2, 0.0] },
  { id: 106, position: [-1.56221e2, 0.0] },
  { id: 107, position: [-1.7475e1, -2.2701e1] },
  { id: 108, position: [-4.3688e1, -2.2701e1] },
  { id: 109, position: [-6.9901e1, -2.2701e1] },
  { id: 110, position: [-9.6114e1, -2.2701e1] },
  { id: 111, position: [-1.22326e2, -2.2701e1] },
  { id: 112, position: [-1.48539e2, -2.2701e1] },
  { id: 113, position: [0.0, -4.5402e1] },
  { id: 114, position: [-3.0582e1, -4.5402e1] },
  { id: 115, position: [-5.6794e1, -4.5402e1] },
  { id: 116, position: [-8.3007e1, -4.5402e1] },
  { id: 117, position: [-1.0922e2, -4.5402e1] },
  { id: 118, position: [-1.35433e2, -4.5402e1] },
  { id: 119, position: [-1.53563e2, -3.9279e1] },
  { id: 120, position: [-1.7475e1, -6.8103e1] },
  { id: 121, position: [-4.3688e1, -6.8103e1] },
  { id: 122, position: [-6.9901e1, -6.8103e1] },
  { id: 123, position: [-9.6113e1, -6.8103e1] },
  { id: 124, position: [-1.22326e2, -6.8103e1] },
  { id: 125, position: [-1.46632e2, -5.9762e1] },
  { id: 126, position: [0.0, -9.0804e1] },
  { id: 127, position: [-3.0582e1, -9.0804e1] },
  { id: 128, position: [-5.6794e1, -9.0804e1] },
  { id: 129, position: [-8.3007e1, -9.0804e1] },
  { id: 130, position: [-1.0922e2, -9.0804e1] },
  { id: 131, position: [-1.33384e2, -8.5331e1] },
  { id: 132, position: [-1.7475e1, -1.13505e2] },
  { id: 133, position: [-4.3688e1, -1.13505e2] },
  { id: 134, position: [-6.9901e1, -1.13505e2] },
  { id: 135, position: [-9.6113e1, -1.13505e2] },
  { id: 136, position: [-1.15723e2, -1.08078e2] },
  { id: 137, position: [-8.738, -1.36206e2] },
  { id: 138, position: [-3.495e1, -1.36206e2] },
  { id: 139, position: [-6.1163e1, -1.28639e2] },
  { id: 140, position: [-8.2273e1, -1.35291e2] },
  { id: 141, position: [-1.4399e1, -1.57687e2] },
  { id: 142, position: [-4.272e1, -1.52471e2] },
  { id: 143, position: [-6.315e1, -1.45385e2] },
  { id: 207, position: [1.7475e1, -2.2701e1] },
  { id: 208, position: [4.3688e1, -2.2701e1] },
  { id: 209, position: [6.9901e1, -2.2701e1] },
  { id: 210, position: [9.6114e1, -2.2701e1] },
  { id: 211, position: [1.22326e2, -2.2701e1] },
  { id: 212, position: [1.48539e2, -2.2701e1] },
  { id: 214, position: [3.0582e1, -4.5402e1] },
  { id: 215, position: [5.6794e1, -4.5402e1] },
  { id: 216, position: [8.3007e1, -4.5402e1] },
  { id: 217, position: [1.0922e2, -4.5402e1] },
  { id: 218, position: [1.35433e2, -4.5402e1] },
  { id: 219, position: [1.53563e2, -3.9279e1] },
  { id: 220, position: [1.7475e1, -6.8103e1] },
  { id: 221, position: [4.3688e1, -6.8103e1] },
  { id: 222, position: [6.9901e1, -6.8103e1] },
  { id: 223, position: [9.6113e1, -6.8103e1] },
  { id: 224, position: [1.22326e2, -6.8103e1] },
  { id: 225, position: [1.46632e2, -5.9762e1] },
  { id: 227, position: [3.0582e1, -9.0804e1] },
  { id: 228, position: [5.6794e1, -9.0804e1] },
  { id: 229, position: [8.3007e1, -9.0804e1] },
  { id: 230, position: [1.0922e2, -9.0804e1] },
  { id: 231, position: [1.33384e2, -8.5331e1] },
  { id: 232, position: [1.7475e1, -1.13505e2] },
  { id: 233, position: [4.3688e1, -1.13505e2] },
  { id: 234, position: [6.9901e1, -1.13505e2] },
  { id: 235, position: [9.6113e1, -1.13505e2] },
  { id: 236, position: [1.15723e2, -1.08078e2] },
  { id: 237, position: [8.738, -1.36206e2] },
  { id: 238, position: [3.495e1, -1.36206e2] },
  { id: 239, position: [6.1163e1, -1.28639e2] },
  { id: 240, position: [8.2273e1, -1.35291e2] },
  { id: 241, position: [1.4399e1, -1.57687e2] },
  { id: 242, position: [4.272e1, -1.52471e2] },
  { id: 243, position: [6.315e1, -1.45385e2] },
  { id: 301, position: [3.0582e1, 0.0] },
  { id: 302, position: [5.6794e1, 0.0] },
  { id: 303, position: [8.3007e1, 0.0] },
  { id: 304, position: [1.0922e2, 0.0] },
  { id: 305, position: [1.35433e2, 0.0] },
  { id: 306, position: [1.56221e2, -9.7e-2] },
  { id: 307, position: [1.7475e1, 2.2701e1] },
  { id: 308, position: [4.3688e1, 2.2701e1] },
  { id: 309, position: [6.9901e1, 2.2701e1] },
  { id: 310, position: [9.6114e1, 2.2701e1] },
  { id: 311, position: [1.22326e2, 2.2701e1] },
  { id: 312, position: [1.48539e2, 2.2701e1] },
  { id: 313, position: [0.0, 4.5402e1] },
  { id: 314, position: [3.0582e1, 4.5402e1] },
  { id: 315, position: [5.6794e1, 4.5402e1] },
  { id: 316, position: [8.3007e1, 4.5402e1] },
  { id: 317, position: [1.0922e2, 4.5402e1] },
  { id: 318, position: [1.35433e2, 4.5402e1] },
  { id: 319, position: [1.53563e2, 3.9279e1] },
  { id: 320, position: [1.7475e1, 6.8103e1] },
  { id: 321, position: [4.3688e1, 6.8103e1] },
  { id: 322, position: [6.9901e1, 6.8103e1] },
  { id: 323, position: [9.6113e1, 6.8103e1] },
  { id: 324, position: [1.22326e2, 6.8103e1] },
  { id: 325, position: [1.46632e2, 5.9762e1] },
  { id: 326, position: [0.0, 9.0804e1] },
  { id: 327, position: [3.0582e1, 9.0804e1] },
  { id: 328, position: [5.6794e1, 9.0804e1] },
  { id: 329, position: [8.3007e1, 9.0804e1] },
  { id: 330, position: [1.0922e2, 9.0804e1] },
  { id: 331, position: [1.33384e2, 8.5331e1] },
  { id: 332, position: [1.7475e1, 1.13505e2] },
  { id: 333, position: [4.3688e1, 1.13505e2] },
  { id: 334, position: [6.9901e1, 1.13505e2] },
  { id: 335, position: [9.6113e1, 1.13505e2] },
  { id: 336, position: [1.15723e2, 1.08078e2] },
  { id: 337, position: [8.738, 1.36206e2] },
  { id: 338, position: [3.495e1, 1.36206e2] },
  { id: 339, position: [6.1163e1, 1.28639e2] },
  { id: 340, position: [8.2273e1, 1.35291e2] },
  { id: 341, position: [1.4399e1, 1.57687e2] },
  { id: 342, position: [4.272e1, 1.52471e2] },
  { id: 343, position: [6.315e1, 1.45385e2] },
  { id: 407, position: [-1.7475e1, 2.2701e1] },
  { id: 408, position: [-4.3688e1, 2.2701e1] },
  { id: 409, position: [-6.9901e1, 2.2701e1] },
  { id: 410, position: [-9.6114e1, 2.2701e1] },
  { id: 411, position: [-1.22326e2, 2.2701e1] },
  { id: 412, position: [-1.48539e2, 2.2701e1] },
  { id: 414, position: [-3.0582e1, 4.5402e1] },
  { id: 415, position: [-5.6794e1, 4.5402e1] },
  { id: 416, position: [-8.3007e1, 4.5402e1] },
  { id: 417, position: [-1.0922e2, 4.5402e1] },
  { id: 418, position: [-1.35433e2, 4.5402e1] },
  { id: 419, position: [-1.53563e2, 3.9279e1] },
  { id: 420, position: [-1.7475e1, 6.8103e1] },
  { id: 421, position: [-4.3688e1, 6.8103e1] },
  { id: 422, position: [-6.9901e1, 6.8103e1] },
  { id: 423, position: [-9.6113e1, 6.8103e1] },
  { id: 424, position: [-1.22326e2, 6.8103e1] },
  { id: 425, position: [-1.46632e2, 5.9762e1] },
  { id: 427, position: [-3.0582e1, 9.0804e1] },
  { id: 428, position: [-5.6794e1, 9.0804e1] },
  { id: 429, position: [-8.3007e1, 9.0804e1] },
  { id: 430, position: [-1.0922e2, 9.0804e1] },
  { id: 431, position: [-1.33384e2, 8.5331e1] },
  { id: 432, position: [-1.7475e1, 1.13505e2] },
  { id: 433, position: [-4.3688e1, 1.13505e2] },
  { id: 434, position: [-6.9901e1, 1.13505e2] },
  { id: 435, position: [-9.6113e1, 1.13505e2] },
  { id: 436, position: [-1.15723e2, 1.08078e2] },
  { id: 437, position: [-8.738, 1.36206e2] },
  { id: 438, position: [-3.495e1, 1.36206e2] },
  { id: 439, position: [-6.1163e1, 1.28639e2] },
  { id: 440, position: [-8.2273e1, 1.35291e2] },
  { id: 441, position: [-1.4399e1, 1.57687e2] },
  { id: 442, position: [-4.272e1, 1.52471e2] },
  { id: 443, position: [-6.315e1, 1.45385e2] },
];
