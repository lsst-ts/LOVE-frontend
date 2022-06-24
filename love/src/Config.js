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
// OLE Configurations
export const LOG_TYPE_OPTIONS = ['fault', 'ok', 'wait'];
export const EXPOSURE_FLAG_OPTIONS = ['none', 'junk', 'questionable'];

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
  NASMYTH1: 'ok',
  NASMYTH2: 'ok',
  PORT3: 'ok',
  CLOSED: 'ok',
  OPEN: 'ok',
  OPENED: 'ok',
  REMOTECONTROL: 'ok',
  HANDPADDLECONTROL: 'ok',
  INVALID: 'warning',
  'IN MOTION': 'running',
  'NOT IN POSITION': 'warning',
  UNKNOWN: 'invalid',
  'UNKNOWN POSITION': 'invalid',
};

export const stateToStyleDome = {
  'IN POSITION': 'ok',
  'NOT IN POSITION': 'warning',
  UNKNOWN: 'invalid',
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

// M2

// M1M3
export const m1m3DetailedStateMap = {
  1: 'DISABLED STATE',
  2: 'FAULT STATE',
  3: 'OFFLINE STATE',
  4: 'STANDBY STATE',
  5: 'PARKED STATE',
  6: 'RAISING STATE',
  7: 'ACTIVE STATE',
  8: 'LOWERING STATE',
  9: 'PARKED ENGINEERING STATE',
  10: 'RAISING ENGINEERING STATE',
  11: 'ACTIVE ENGINEERING STATE',
  12: 'LOWERING ENGINEERING STATE',
  13: 'LOWERING FAULT STATE',
  14: 'PROFILE HARDPOINT CORRECTION STATE',
  0: 'UNKNOWN',
};

export const m1m3DetailedStateToStyle = {
  'DISABLED STATE': 'warning',
  'FAULT STATE': 'warning',
  'OFFLINE STATE': 'warning',
  'STANDBY STATE': 'warning',
  'PARKED STATE': 'ok',
  'RAISING STATE': 'running',
  'ACTIVE STATE': 'ok',
  'LOWERING STATE': 'running',
  'PARKED ENGINEERING STATE': 'ok',
  'RAISING ENGINEERING STATE': 'running',
  'ACTIVE ENGINEERING STATE': 'ok',
  'LOWERING ENGINEERING STATE': 'running',
  'LOWERING FAULT STATE': 'running',
  'PROFILE HARDPOINT CORRECTION STATE': 'ok',
};

export const m1mActuatorILCStateMap = {
  1: 'ON',
  0: 'OFF',
};

export const m1m3HardpointActuatorMotionStateMap = {
  1: 'CHASING',
  2: 'STEPPING',
  3: 'QUICK POSITIONING',
  4: 'FINE POSITIONING',
  0: 'STANDBY',
};

export const m1m3ILCStateToStyle = {
  ON: 'ok',
  OFF: 'warning',
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
  6: 'NASMYTH1',
  7: 'NASMYTH2',
  8: 'PORT3',
  9: 'IN MOTION',
  10: 'UNKNOWN POSITION',
  0: 'UNKNOWN',
};

export const m3PortSelectedStateMap = {
  6: 'NASMYTH1',
  7: 'NASMYTH2',
  8: 'PORT3',
  0: 'UNKNOWN',
};

export const m3InPositionStateMap = {
  1: 'NOT READY',
  2: 'IN POSITION',
  0: 'UNKNOWN',
};

// ATAOS
export const ataosCorrectionsStateMap = {
  false: 'DISABLED',
  true: 'ENABLED',
  undefined: 'UNKNOWN',
};

export const ataosCorrectionsStateToStyle = {
  DISABLED: 'warning',
  ENABLED: 'ok',
  UNKNOWN: 'invalid',
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
  1: 'IN POSITION',
  2: 'NOT READY',
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

export const inclinationTelemetrySourceStateMap = {
  1: 'ONBOARD',
  2: 'MTMOUNT',
};

export const m2ActuatorILCStateMap = {
  1: 'FAULT',
  0: 'OPERATIVE',
};

export const m2ActuatorILCStateToStyle = {
  OPERATIVE: 'ok',
  FAULT: 'warning',
};

export const m2ActuatorLimitSwitchStateMap = {
  1: 'CLOSED',
  0: 'OPEN',
};

export const m2ActuatorLimitSwitchStateToStyle = {
  OPEN: 'ok',
  CLOSED: 'warning',
};

export const stateToStyleDomeAndMount = {
  NASMYTH1: 'ok',
  NASMYTH2: 'ok',
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
  NONE: 'invalid',
  CSC: 'ok',
  EUI: 'warning',
  HHD: 'warning',
};

export const mtMountCommanderStateMap = {
  0: 'NONE',
  1: 'CSC',
  2: 'EUI',
  3: 'HHD',
};

export const mtMountConnectedStateMap = {
  undefined: 'UNKOWN',
  false: 'DISCONNECTED',
  true: 'CONNECTED',
};

export const stateToStyleMTMountConnected = {
  UNKOWN: 'invalid',
  DISCONNECTED: 'warning',
  CONNECTED: 'ok',
};

export const stateToStyleMTMountPowerState = {
  OFF: 'invalid',
  ON: 'ok',
  FAULT: 'alert',
  TURNING_ON: 'warning',
  TURNING_OFF: 'warning',
  UNKNOWN: 'invalid',
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
  STOPPING: 'warning',
  STOPPED: 'ok',
  'MOVING POINT TO POINT': 'warning',
  JOGGING: 'warning',
  TRACKING: 'warning',
  TRACKING_PAUSED: 'warning',
  UNKNOWN: 'invalid',
};

export const mtMountAxisMotionStateMap = {
  0: 'STOPPING',
  1: 'STOPPED',
  2: 'MOVING POINT TO POINT',
  3: 'JOGGING',
  4: 'TRACKING',
  5: 'TRACKING_PAUSED',
  undefined: 'UNKNOWN',
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

// MT Camera Hexapod
export const hexapodStatusStatetoStyle = {
  UNKNOWN: 'undefined',
  DISABLED: 'disabled',
  ENABLED: 'enabled',
  FAULT: 'fault',
  OFFLINE: 'offline',
  STANDBY: 'standby',
};

export const hexapodCommandableByDDSStateMap = {
  false: 'NOT COMMANDABLE',
  true: 'COMMANDABLE',
};

export const hexapodCommandableByDDSStatetoStyle = {
  'NOT COMMANDABLE': 'alert',
  COMMANDABLE: 'ok',
};

export const hexapodCompensationModeStateMap = {
  false: 'DISABLED',
  true: 'ENABLED',
};

export const hexapodCompensationModeStatetoStyle = {
  DISABLED: 'undefined',
  ENABLED: 'ok',
};

export const hexapodInterlockStateMap = {
  false: 'Disengaged',
  true: 'Engaged',
};

export const hexapodControllerStateMap = {
  0: 'STANDBY',
  1: 'DISABLED',
  2: 'ENABLED',
  3: 'OFFLINE',
  4: 'FAULT',
};

export const hexapodControllerStatetoStyle = {
  STANDBY: 'ok',
  DISABLED: 'undefined',
  ENABLED: 'ok',
  OFFLINE: 'undefined',
  FAULT: 'alert',
};

export const hexapodControllerStateOfflineSubStateMap = {
  0: 'PUBLISH ONLY',
  1: 'AVAILABLE',
};

export const hexapodControllerStateEnabledSubstateMap = {
  0: 'STATIONARY',
  1: 'MOVING POINT TO POINT',
  2: 'SLEWING OR TRACKING',
  3: 'CONTROLLED STOPPING',
  4: 'INITIALIING',
  5: 'RELATIVE',
  6: 'CONSTANT VELOCITY',
};

export const hexapodMTInPositionStateMap = {
  false: 'NOT READY',
  true: 'IN POSITION',
};

export const hexapodMTInPositionStatetoStyle = {
  'NOT READY': 'warning',
  'IN POSITION': 'ok',
};

export const hexapodConnectedStateMap = {
  false: 'DISCONNECTED',
  true: 'CONNECTED',
};

export const hexapodConnectedStatetoStyle = {
  DISCONNECTED: 'alert',
  CONNECTED: 'ok',
};

// MTDome
export const mtdomeStatusStatetoStyle = {
  UNKNOWN: 'undefined',
  DISABLED: 'disabled',
  ENABLED: 'enabled',
  FAULT: 'fault',
  OFFLINE: 'offline',
  STANDBY: 'standby',
};

export const mtDomeModeStateMap = {
  0: 'DEGRADED',
  1: 'NORMAL',
};

export const mtDomeModeStatetoStyle = {
  DEGRADED: 'warning',
  NORMAL: 'ok',
};

export const mtDomeAzimuthEnabledStateMap = {
  0: 'DISABLED',
  1: 'ENABLED',
  2: 'FAULT',
};

export const mtDomeAzimuthEnabledStatetoStyle = {
  DISABLED: 'undefined',
  ENABLED: 'ok',
  FAULT: 'fault',
};

export const mtdomeMotionStateMap = {
  0: 'CLOSED',
  1: 'CRAWLING',
  2: 'MOVING',
  3: 'OPEN',
  4: 'PARKED',
  5: 'PARKING',
  6: 'STOPPED',
  7: 'STOPPING',
  8: 'STOPPING BRAKING',
  9: 'STOPPED BRAKED',
  10: 'BRAKES DISENGAGED',
  11: 'BRAKES ENGAGED',
  12: 'DEFLATED',
  13: 'DEFLATING',
  14: 'DISABLING MOTOR POWER',
  15: 'DISENGAGING BRAKES',
  16: 'ENABLING MOTOR POWER',
  17: 'ENGAGING BRAKES',
  18: 'GO DEGRADED',
  19: 'GO NORMAL',
  20: 'GO STATIONARY',
  21: 'INFLATED',
  22: 'INFLATING',
  23: 'LP DISENGAGED',
  24: 'LP DISENGAGING',
  25: 'LP ENGAGED',
  26: 'LP ENGAGING',
  27: 'MOTOR COOLING OFF',
  28: 'MOTOR COOLING ON',
  29: 'MOTOR POWER OFF',
  30: 'MOTOR POWER ON',
  31: 'STARTING MOTOR COOLING',
  32: 'STOPPING MOTOR COOLING',
};

export const mtdomeMotionStatetoStyle = {
  CLOSED: 'undefined',
  CRAWLING: 'warning',
  MOVING: 'warning',
  OPEN: 'ok',
  PARKED: 'ok',
  PARKING: 'warning',
  STOPPED: 'ok',
  STOPPING: 'warning',
  'STOPPING BRAKING': 'warning',
  'STOPPED BRAKED': 'ok',
  'BRAKES DISENGAGED': 'ok',
  'BRAKES ENGAGED': 'alert',
  DEFLATED: 'undefined',
  DEFLATING: 'warning',
  'DISABLING MOTOR POWER': 'warning',
  'DISENGAGING BRAKES': 'warning',
  'ENABLING MOTOR POWER': 'warning',
  'ENGAGING BRAKES': 'warning',
  'GO DEGRADED': 'warning',
  'GO NORMAL': 'ok',
  'GO STATIONARY': 'ok',
  INFLATED: 'ok',
  INFLATING: 'warning',
  'LP DISENGAGED': 'undefined',
  'LP DISENGAGING': 'warning',
  'LP ENGAGED': 'ok',
  'LP ENGAGING': 'warning',
  'MOTOR COOLING OFF': 'undefined',
  'MOTOR COOLING ON': 'ok',
  'MOTOR POWER OFF': 'undefined',
  'MOTOR POWER ON': 'ok',
  'STARTING MOTOR COOLING': 'warning',
  'STOPPING MOTOR COOLING': 'warning',
};

export const mtdomeElevationEnabledStateToMap = {
  0: 'DISABLED',
  1: 'ENABLED',
  2: 'FAULT',
};

export const mtdomeElevationEnabledStatetoStyle = {
  DISABLED: 'undefined',
  ENABLED: 'ok',
  FAULT: 'fault',
};

/**
 * Available commands in the TCS and their parameters. Each command is represented
 * as a dictionary key and their parameters as the values of said dictionary.
 * Within each dictionary value, each parameter is represented in a separate dictionary.
 * Each key in this new dictionary contains the parameter name and each corresponding
 * value contains a 2 item array with its first element being the param type, e.g.
 * 'string', 'angle', 'number', 'boolean', 'time', 'dict'. The second element contains the default
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

const SimpleNamespace = [{ label: 'None', value: undefined }];

const AzWrapStrategy = [
  { label: 'None', value: undefined },
  { label: 'MAXTIMEONTARGET', value: 3 },
  { label: 'NOUNWRAP', value: 1 },
  { label: 'OPTIMIZE', value: 2 },
];

const RotFrame = [
  { label: 'TARGET', value: 1 }, // self.RotFrame.TARGET
  { label: 'AZEL', value: 2 }, // self.RotFrame.AZEL
  { label: 'FIXED', value: 3 }, // self.RotFrame.FIXED
];

const RotMode = [
  { label: 'FIELD', value: 1 }, // self.RotMode.FIELD
  { label: 'SLIT', value: 2 }, // self.RotMode.SLIT
];

const Planets = [
  { label: 'JUPITER', value: 5 },
  { label: 'MARS', value: 4 },
  { label: 'MERCURY', value: 1 },
  { label: 'MOON', value: 3 },
  { label: 'NEPTUNE', value: 8 },
  { label: 'PLUTO', value: 9 },
  { label: 'SATURN', value: 6 },
  { label: 'URANUS', value: 7 },
  { label: 'VENUS', value: 2 },
];

const cmdAck = [
  { label: 'None', value: undefined },
  { label: 'LabelNameCommand', value: 'CmdAck from the command that started the slew process' },
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
    az: ['number', undefined], // Or str ?
  },
  // focus_offset: {},
  home_dome: {},
};

const BaseTCSMethods = {
  add_point_data: {}, //
  disable_dome_following: {
    check: [SimpleNamespace, SimpleNamespace[1]], // types.SimpleNamespace or None
  },
  enable_dome_following: {
    check: [SimpleNamespace, SimpleNamespace[1]], // types.SimpleNamespace or None
  },
  offset_azel: {
    az: ['number', 0.0],
    el: ['number', 0.0],
    relative: ['boolean', true],
    absorb: ['boolean', false],
  },
  offset_radec: {
    ra: ['angle', 0.0], // float, str
    dec: ['angle', 0.0], // float, str
  },
  offset_xy: {
    x: ['number', 0.0],
    y: ['number', 0.0],
    relative: ['bolean', true],
    absorb: ['boolean', false],
  },
  point_azel: {
    az: ['angle', undefined], // float, str or astropy.coordinates.Angle
    el: ['angle', undefined], // float, str or astropy.coordinates.Angle
    rot_tel: ['angle', 0.0], // float, str or astropy.coordinates.Angle
    target_name: ['string', 'azel_target'],
    wait_dome: ['boolean', false],
    slew_timeout: ['number', 1200.0], // seconds
  },
  reset_offsets: {
    absorbed: ['boolean', true],
    non_absorbed: ['boolean', true],
  },
  slew_icrs: {
    ra: ['angle', undefined], // float, str or astropy.coordinates.Angle
    dec: ['angle', undefined], // float, str or astropy.coordinates.Angle
    rot: ['angle', 0.0], // float, str or astropy.coordinates.Angle
    rot_type: [rotTypes, rotTypes[1]],
    target_name: ['string', 'slew_icrs'],
    dra: ['number', 0.0], // optional
    ddec: ['number', 0.0], // optional
    offset_x: ['number', 0.0], // optional
    offset_y: ['number', 0.0], // optional
    az_wrap_strategy: [AzWrapStrategy, AzWrapStrategy[1]],
    slew_timeout: ['number', 240.0],
    stop_before_slew: ['boolean', true],
    wait_settle: ['boolean', true],
  },
  slew_object: {
    name: ['string', ''], // Target name
    rot: ['angle', 0.0],
    rot_type: [rotTypes, rotTypes[1]],
    dra: ['number', 0.0], // optional
    ddec: ['number', 0.0], // optional
    offset_x: ['number', 0.0], // optional
    offset_y: ['number', 0.0], // optional
    az_wrap_strategy: [AzWrapStrategy, AzWrapStrategy[1]],
    time_on_target: ['number', 0.0],
    slew_timeout: ['number', 240.0],
  },
  slew_to_planet: {
    planet: [Planets, Planets[1]],
    rot_sky: ['angle', 0.0],
    slew_timeout: ['number', 1200.0],
  },
  stop_tracking: {}, //
  close_dome: {
    force: ['boolean', false],
  },
  close_m1_cover: {},
  home_dome: {},
  open_dome_shutter: {},
  open_m1_cover: {},
  slew_dome_to: {
    az: ['number', undefined], // Or str ?
    check: [SimpleNamespace, SimpleNamespace[1]], // types.SimpleNamespace or None
  },
};

export const ATCSCommands = {
  ...BaseTCSMethods,
  close_m1_vent: {},
  focus_offset: {},
  open_m1_vent: {},
  open_valves: {},
  open_valve_instrument: {},
  open_valves_main: {},
};

export const MTCSCommands = {
  ...BaseTCSMethods,
  disable_ccw_following: {},
  disable_compensation_mode: {
    component: ['string', ''], // Name of the component. Must be in `compensation_mode_components`.
  },
  enable_ccw_following: {},
  enable_compensation_mode: {
    component: ['string', ''], // Name of the component. Must be in `compensation_mode_components`.
  },
  enable_m1m3_balance_system: {},
  enable_m2_balance_system: {},
  lower_m1m3: {},
  move_camera_hexapod: {
    x: ['number', 0.0],
    y: ['number', 0.0],
    z: ['number', 0.0],
    u: ['number', 0.0],
    v: ['number', 0.0],
    w: ['number', 0.0],
    sync: ['boolean', true],
  },
  move_m2_hexapod: {
    x: ['number', 0.0],
    y: ['number', 0.0],
    z: ['number', 0.0],
    u: ['number', 0.0],
    v: ['number', 0.0],
    w: ['number', 0.0],
    sync: ['boolean', true],
  },
  raise_m1m3: {},
  reset_camera_hexapod_position: {},
  reset_m1m3_forces: {},
  reset_m2_forces: {},
  reset_m2_hexapod_position: {},
};

export const M1M3ActuatorForces = {
  appliedAberrationForces: ['zForces'],
  appliedAccelerationForces: ['xForces', 'yForces', 'zForces'],
  appliedActiveOpticForces: ['zForces'],
  appliedAzimuthForces: ['xForces', 'yForces', 'zForces'],
  appliedBalanceForces: ['xForces', 'yForces', 'zForces'],
  appliedCylinderForces: ['secondaryCylinderForces', 'primaryCylinderForces'],
  appliedElevationForces: ['xForces', 'yForces', 'zForces'],
  appliedForces: ['xForces', 'yForces', 'zForces'],
  appliedOffsetForces: ['xForces', 'yForces', 'zForces'],
  appliedStaticForces: ['xForces', 'yForces', 'zForces'],
  appliedThermalForces: ['xForces', 'yForces', 'zForces'],
  appliedVelocityForces: ['xForces', 'yForces', 'zForces'],
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

export const M1M3HardpointPositions = [
  { id: 1, actuator: { position: [-5.6794e1, -9.0804e1] }, mini: { position: [45.99, 32.53] } },
  { id: 2, actuator: { position: [-1.0922e2, 0] }, mini: { position: [28.7, 64.05] } },
  { id: 3, actuator: { position: [-5.6794e1, 9.0804e1] }, mini: { position: [45.99, 97.21] } },
  { id: 4, actuator: { position: [5.6794e1, 9.0804e1] }, mini: { position: [80.62, 97.21] } },
  { id: 5, actuator: { position: [1.0922e2, 0] }, mini: { position: [99.19, 64.05] } },
  { id: 6, actuator: { position: [5.6794e1, -9.0804e1] }, mini: { position: [80.62, 32.53] } },
];

export const M2ActuatorPositionsAlpha = [
  { id: 1, position: [1.601, 0] },
  { id: 2, position: [1.566014, 0.332867] },
  { id: 3, position: [1.462585, 0.6511849] },
  { id: 4, position: [1.295237, 0.9410446] },
  { id: 5, position: [1.071278, 1.189774] },
  { id: 6, position: [0.8005013, 1.386507] },
  { id: 7, position: [0.4947361, 1.522641] },
  { id: 8, position: [0.1673502, 1.592229] },
  { id: 9, position: [-0.1673502, 1.592229] },
  { id: 10, position: [-0.4947361, 1.522641] },
  { id: 11, position: [-0.8005013, 1.386507] },
  { id: 12, position: [-1.071278, 1.189774] },
  { id: 13, position: [-1.295237, 0.9410446] },
  { id: 14, position: [-1.462585, 0.6511849] },
  { id: 15, position: [-1.566014, 0.332867] },
  { id: 16, position: [-1.601, 0] },
  { id: 17, position: [-1.566014, -0.332867] },
  { id: 18, position: [-1.462585, -0.6511849] },
  { id: 19, position: [-1.295237, -0.9410446] },
  { id: 20, position: [-1.071278, -1.189774] },
  { id: 21, position: [-0.8005013, -1.386507] },
  { id: 22, position: [-0.4947361, -1.522641] },
  { id: 23, position: [-0.1673502, -1.592229] },
  { id: 24, position: [0.1673502, -1.592229] },
  { id: 25, position: [0.4947361, -1.522641] },
  { id: 26, position: [0.8005013, -1.386507] },
  { id: 27, position: [1.071278, -1.189774] },
  { id: 28, position: [1.295237, -0.9410446] },
  { id: 29, position: [1.462585, -0.6511849] },
  { id: 30, position: [1.566014, -0.332867] },
  { id: 31, position: [1.273, 0.1675856] },
  { id: 32, position: [1.186249, 0.4913528] },
  { id: 33, position: [1.018657, 0.7816342] },
  { id: 34, position: [0.7816469, 1.018647] },
  { id: 35, position: [0.4913655, 1.186244] },
  { id: 36, position: [0.1676011, 1.272997] },
  { id: 37, position: [-0.1675856, 1.273] },
  { id: 38, position: [-0.4913528, 1.186249] },
  { id: 39, position: [-0.7816342, 1.018657] },
  { id: 40, position: [-1.018647, 0.7816469] },
  { id: 41, position: [-1.186244, 0.4913655] },
  { id: 42, position: [-1.272997, 0.1676011] },
  { id: 43, position: [-1.273, -0.1675856] },
  { id: 44, position: [-1.186249, -0.4913528] },
  { id: 45, position: [-1.018657, -0.7816342] },
  { id: 46, position: [-0.7816469, -1.018647] },
  { id: 47, position: [-0.4913655, -1.186244] },
  { id: 48, position: [-0.1676011, -1.272997] },
  { id: 49, position: [0.1675856, -1.273] },
  { id: 50, position: [0.4913528, -1.186249] },
  { id: 51, position: [0.7816342, -1.018657] },
  { id: 52, position: [1.018647, -0.7816469] },
  { id: 53, position: [1.186244, -0.4913655] },
  { id: 54, position: [1.272997, -0.1676011] },
  { id: 55, position: [1.002, 0] },
  { id: 56, position: [0.9415729, 0.3427044] },
  { id: 57, position: [0.7675778, 0.6440729] },
  { id: 58, position: [0.5009998, 0.867758] },
  { id: 59, position: [0.1739956, 0.9867773] },
  { id: 60, position: [-0.1739956, 0.9867773] },
  { id: 61, position: [-0.5009998, 0.867758] },
  { id: 62, position: [-0.7675778, 0.6440729] },
  { id: 63, position: [-0.9415729, 0.3427044] },
  { id: 64, position: [-1.002, 0] },
  { id: 65, position: [-0.9415729, -0.3427044] },
  { id: 66, position: [-0.7675778, -0.6440729] },
  { id: 67, position: [-0.5009998, -0.867758] },
  { id: 68, position: [-0.1739956, -0.9867773] },
  { id: 69, position: [0.1739956, -0.9867773] },
  { id: 70, position: [0.5009998, -0.867758] },
  { id: 71, position: [0.7675778, -0.6440729] },
  { id: 72, position: [0.9415729, -0.3427044] },
];

export const M2ActuatorPositions = M2ActuatorPositionsAlpha.map((x) => ({
  ...x,
  position: [x.position[0] * 100, x.position[1] * 100],
}));

export const M2ActuatorTangentPositionsAlpha = [
  { id: 1, position: [1.566014, 0.332867, 1.295237, 0.9410446] },
  { id: 2, position: [0.8005013, 1.386507, 0.1673502, 1.592229] },
  { id: 3, position: [-1.071278, 1.189774, -1.462585, 0.6511849] },
  { id: 4, position: [-1.566014, -0.332867, -1.295237, -0.9410446] },
  { id: 5, position: [-0.8005013, -1.386507, -0.1673502, -1.592229] },
  { id: 6, position: [1.071278, -1.189774, 1.462585, -0.6511849] },
];

export const M2ActuatorTangentPositions = M2ActuatorTangentPositionsAlpha.map((x) => ({
  ...x,
  position: [x.position[0] * 137, x.position[1] * 137, x.position[2] * 137, x.position[3] * 137],
}));

// Louvers map for MTDome
export const MTDomeLouversMapAF = [
  'A1',
  'A2',
  'B1',
  'B2',
  'B3',
  'C1',
  'C2',
  'C3',
  'D1',
  'D2',
  'D3',
  'E1',
  'E2',
  'E3',
  'F1',
  'F2',
  'F3',
];

export const MTDomeLouversMapGN = [
  'G1',
  'G2',
  'G3',
  'H1',
  'H2',
  'H3',
  'I1',
  'I2',
  'I3',
  'L1',
  'L2',
  'L3',
  'M1',
  'M2',
  'M3',
  'N1',
  'N2',
];

export const MTMountLimits = {
  elevation: {
    min: 5,
    max: 90,
  },
  azimuth: {
    min: -270,
    max: 270,
  },
};
// GIS
export const signals = {
  fireProtectionSystem: {
    fireSignal: ['fireIndication'],
  },
  earthquakeDetectionSystem: {
    catastrophicEarthquakeSignal: [
      'dischargeCapacitorBanks',
      'stoOthersDrives',
      'stoElAndAzDrivesAndEngageTheBrakes',
      'stoCCWDrives',
      'stoHexapodsM2',
      'stoActuatorsM2',
      'stoDrivesShutterDoorsAnsWindscreen',
      'stoCraneDrives',
      'stoRearDoorsDrives',
      'stoDrivesLouversAndLockingPin',
      'stoAzDrivesEngageBrakes',
      'stoRotatorCam',
      'stoHexapodsCam',
      'stoPlatformLift',
      'earthquakeStoActuators',
      'laserCutOffShutterClosed',
      'stoFunctionDrives',
    ],
  },
  globalInterlockSystem: {
    internalFailure: [
      'stoOthersDrives',
      'stoElAndAzDrivesAndEngageTheBrakes',
      'stoCCWDrives',
      'stoHexapodsM2',
      'stoActuatorsM2',
      'stoDrivesShutterDoorsAnsWindscreen',
      'stoCraneDrives',
      'stoRearDoorsDrives',
      'stoDrivesLouversAndLockingPin',
      'stoAzDrivesEngageBrakes',
      'stoRotatorCam',
      'stoHexapodsCam',
      'stoLiftAtToTopFloor',
      'laserCutOffShutterClosed',
      'emergencyStoActuators',
      'stoFunctionDrives',
    ],
    emergencyStop: [
      'stoOthersDrives',
      'stoElAndAzDrivesAndEngageTheBrakes',
      'stoCCWDrives',
      'stoHexapods',
      'stoActuators',
      'stoDrivesShutterDoorsAnsWindscreen',
      'stoRearDoorsDrives',
    ],
    ccwSafetyDevice: ['stoRotatorCam'],
    cameraRotatorPinInserted: ['cameraRotatorPinInserted'],
    manLiftNotParked: ['stoElAndAzDrivesAndEngageTheBrakes', 'stoCraneDrives'],
  },
  domeInterlockSystem: {
    loockingPinRetractedOrRearDoorLouversNotClosed: ['stoLiftAtToTopFloor'],
    rearDoorNotClosed: ['stoPlatformLift'],
    domeEtpbs: [
      'stoOthersDrives',
      'stoElAndAzDrivesAndEngageTheBrakes',
      'stoCCWDrives',
      'stoHexapodsM2',
      'stoActuatorsM2',
      'stoRotatorCam',
      'stoHexapodsCam',
      'stoPlatformLift',
      'earthquakeStoActuators',
      'laserCutOffShutterClosed',
      'stoFunctionDrives',
    ],
    craneBridgeLimitSwitchisReleasedFromParkedPosition: ['stoElAndAzDrivesAndEngageTheBrakes', 'stoFunctionDrives'],
  },
  accessControlSystem: {
    unauthorizedPierAccess: ['stoElAndAzDrivesAndEngageTheBrakes'],
    unauthorizedDomeAccess: [
      'stoElAndAzDrivesAndEngageTheBrakes',
      'stoAzDrivesEngageBrakes',
      'laserCutOffShutterClosed',
    ],
  },
  platformLift: {
    aboveUtilityFloor: ['stoDrivesLouversAndLockingPin'],
    notParkedAtTheTelescopeLevel: ['stoRearDoorsDrives'],
  },
  tmaInterlockSystem: {
    breaksNotEngaged: ['stoCraneDrives'],
    tmaEtpbs: [
      'stoDrivesShutterDoorsAnsWindscreen',
      'stoCraneDrives',
      'stoRearDoorsDrives',
      'stoDrivesLouversAndLockingPin',
      'stoAzDrivesEngageBrakes',
      'stoCCWDrivesM2',
      'stoHexapodsM2',
      'stoPlatformLift',
      'emergencyStoActuators',
      'laserCutOffShutterClosed',
      'stoFunctionDrives',
    ],
  },
  mcs: {
    failedWatchdogOrLossCommunication: ['stoRotatorCam', 'stoHexapodsCam'],
  },
  m1m3SupportSystem: {
    interlock: ['stoElAndAzDrivesAndEngageTheBrakes'],
  },
};

export const effects = {
  globalInterlockSystem: ['fireIndication', 'cameraRotatorPinInserted'],
  tmaInterlockSystem: [
    'dischargeCapacitorBanks',
    'stoOthersDrives',
    'stoElAndAzDrivesAndEngageTheBrakes',
    'stoCCWDrives',
  ],
  m2: ['stoHexapodsM2', 'stoActuatorsM2'],
  domeInterlockSystem: [
    'stoDrivesShutterDoorsAnsWindscreen',
    'stoCraneDrives',
    'stoRearDoorsDrives',
    'stoDrivesLouversAndLockingPin',
    'stoAzDrivesEngageBrakes',
  ],
  camera: ['stoRotatorCam', 'stoHexapodsCam'],
  plowController: ['stoPlatformLift', 'stoLiftAtToTopFloor'],
  m1m3SupportSystem: ['earthquakeStoActuators', 'emergencyStoActuators'],
  laserController: ['laserCutOffShutterClosed'],
  manLift: ['stoFunctionDrives'],
};

export const alertSignalIndexes = {
  fireSignal: [23, 0],
  catastrophicEarthquakeSignal: [23, 1],
  internalFailure: [23, 2],
  emergencyStop: [23, 4],
  ccwSafetyDevice: [23, 7],
  cameraRotatorPinInserted: [23, 13],
  manLiftNotParked: [24, 2],
  loockingPinRetractedOrRearDoorLouversNotClosed: [23, 9],
  rearDoorNotClosed: [23, 10],
  domeEtpbs: [23, 11],
  craneBridgeLimitSwitchisReleasedFromParkedPosition: [23, 12],
  unauthorizedPierAccess: [23, 4],
  unauthorizedDomeAccess: [23, 5],
  aboveUtilityFloor: [23, 14],
  notParkedAtTheTelescopeLevel: [23, 15],
  breaksNotEngaged: [23, 6],
  tmaEtpbs: [23, 8],
  failedWatchdogOrLossCommunication: [24, 0],
  interlock: [24, 1],
};

export const signalBypassIndexes = {
  fireSignal: [25, 0],
  catastrophicEarthquakeSignal: [25, 1],
  internalFailure: [25, 2],
  emergencyStop: [23, 4],
  ccwSafetyDevice: [25, 7],
  cameraRotatorPinInserted: [25, 13],
  manLiftNotParked: [26, 2],
  loockingPinRetractedOrRearDoorLouversNotClosed: [25, 9],
  rearDoorNotClosed: [25, 10],
  domeEtpbs: [25, 11],
  craneBridgeLimitSwitchisReleasedFromParkedPosition: [25, 12],
  unauthorizedPierAccess: [25, 4],
  unauthorizedDomeAccess: [25, 5],
  aboveUtilityFloor: [25, 14],
  notParkedAtTheTelescopeLevel: [25, 15],
  breaksNotEngaged: [25, 6],
  tmaEtpbs: [25, 8],
  failedWatchdogOrLossCommunication: [26, 0],
  interlock: [26, 1],
};
