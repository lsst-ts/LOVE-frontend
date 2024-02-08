/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed by Inria Chile.

This program is free software: you can redistribute it and/or modify it under 
the terms of the GNU General Public License as published by the Free Software 
Foundation, either version 3 of the License, or at your option) any later version.

This program is distributed in the hope that it will be useful,but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR 
 A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with 
this program. If not, see <http://www.gnu.org/licenses/>.
*/

import InfoIcon from 'components/icons/CSCExpanded/InfoIcon/InfoIcon';
import WarningIcon from 'components/icons/CSCExpanded/WarningIcon/WarningIcon';

// Subpath
export const SUBPATH = process.env.PUBLIC_URL ?? '';

// Commands Configurations
export const hasCommandPrivileges = true;

// LOVE components to monitor heartbeats
export const HEARTBEAT_COMPONENTS = {
  MANAGER: 'Manager',
  COMMANDER: 'Commander',
};

// Whether to simulate websocket messages
export const WEBSOCKET_SIMULATION = false;
// File located in public/websocket-simulations containing a
// set of websocket messages
export const WEBSOCKET_SIMULATION_FILE = 'test.json';

// Base URL prefix for LSST JIRA tickets
export const JIRA_TICKETS_BASE_URL = 'https://jira.lsstcorp.org/browse';

// Base URL for ScriptQueue scripts' documentation
export const SCRIPT_DOCUMENTATION_BASE_URL = 'https://ts-standardscripts.lsst.io/py-api';

// URL for external Cloud Map Service
export const CLOUD_MAP_SERVICE = {
  url: 'https://www.meteoblue.com/en/weather/maps/widget/-30.245N-70.749E2605_America%2FSantiago?windAnimation=0&gust=0&satellite=0&cloudsAndPrecipitation=0&cloudsAndPrecipitation=1&temperature=0&sunshine=0&extremeForecastIndex=0&geoloc=fixed&tempunit=C&windunit=km%252Fh&lengthunit=metric&zoom=9&autowidth=auto',
  copyrigth:
    'https://www.meteoblue.com/en/weather/maps/-30.245N-70.749E2605_America%2FSantiago?utm_source=weather_widget&utm_medium=linkus&utm_content=map&utm_campaign=Weather%2BWidget',
};

// URLs for Component EUIs
export const EUIs = {
  M1M3: 'https://ls.st/m1m3-dev',
  M2: 'https://ls.st/hexrot-vm01',
  ROTATOR: 'https://ls.st/hexrot-vm01',
  HEXAPOD: 'https://ls.st/hexrot-vm01',
  TMA: 'https://confluence.lsstcorp.org/pages/viewpage.action?pageId=214147380',
  ATDOME: 'https://atmcs-dev.cp.lsst.org',
};

// Types of sorting
export const SORT_ASCENDING = 'ascending';
export const SORT_DESCENDING = 'descending';
export const SORT_UNSORTED = 'unsorted';

// Moment formats
export const ISO_STRING_DATE_TIME_FORMAT = 'YYYY-MM-DDTHH:mm:ss';
export const ISO_STRING_DATE_FORMAT = 'YYYY-MM-DD';
export const ISO_DATE_FORMAT = 'YYYY/MM/DD';
export const ISO_INTEGER_DATE_FORMAT = 'YYYYMMDD';
export const TIME_FORMAT = 'HH:mm:ss';
export const DATE_TIME_FORMAT = 'YYYY/MM/DD, HH:mm:ss';

// Regex
export const URL_REGEX =
  /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;

/*****************************************************************************/
/*************************ScriptQueue configurations**************************/
/*****************************************************************************/

export const SCRIPTQUEUE_SCRIPT_LOCATION = {
  FIRST: 1,
  LAST: 2,
  BEFORE: 3,
  AFTER: 4,
};

/*****************************************************************************/
/****************************Limits configurations****************************/
/*****************************************************************************/

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

export const ATPneumaticsLimits = {
  cellLoad: {
    min: 3.83,
    max: 117.8,
  },
  pressure: {
    min: 47160.14,
    max: 182159.49,
  },
};

/*****************************************************************************/
/****************************Watcher configurations***************************/
/*****************************************************************************/

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

export const ALARM_SOUND_THROTLING_TIME_MS = 6000;

/*****************************************************************************/
/******************************TCS configurations*****************************/
/*****************************************************************************/

// TCS Configurations
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

/**
 * Available commands in the TCS and their parameters. Each command is represented
 * as a dictionary key and their parameters as the values of said dictionary.
 * Within each dictionary value, each parameter is represented in a separate dictionary.
 * Each key in this new dictionary contains the parameter name and each corresponding
 * value contains a 2 item array with its first element being the param type, e.g.
 * 'string', 'angle', 'number', 'boolean', 'time', 'dict'. The second element contains the default
 * value.
 */
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

/*****************************************************************************/
/******************************OLE configurations*****************************/
/*****************************************************************************/
export const AUTO_HYPERLINK_JIRA_PROJECTS = ['BLOCK', 'LOVE', 'OBS', 'DM'];

export const LOG_REFRESH_INTERVAL_MS = 60000;

export const OLE_COMMENT_TYPE_OPTIONS = [
  { label: 'All priorities', value: 'all' },
  { label: 'Urgent', value: 100 },
  { label: 'Non urgent', value: 0 },
];

export const EXPOSURE_FLAG_OPTIONS = ['none', 'junk', 'questionable'];

export const exposureFlagStateToStyle = {
  none: 'ok',
  junk: 'alert',
  questionable: 'warning',
};

export const iconLevelOLE = {
  info: <InfoIcon />,
  urgent: <WarningIcon />,
};

// jira OBS project components field
export const OLE_JIRA_COMPONENTS = {
  AuxTel: 20710,
  Calibrations: 20714,
  'Environmental Monitoring Systems': 20711,
  Facilities: 20712,
  'IT Infrastricture': 20718,
  MainTel: 20709,
  'Observer Remark': 20717,
  Other: 20713,
  Unknown: 19507,
};

// jira OBS project customfield_17204
export const OLE_JIRA_PRIMARY_SOFTWARE_COMPONENTS = {
  None: -1,
  'CSC level': 16810,
  'Component Level (EUI)': 16811,
  Visualization: 16812,
  Analysis: 16813,
  Other: 16814,
  'Camera Control Software': 16815,
  TMA_CSC: 16860,
  TMA_EUI: 16859,
  TMA_HDD: 16861,
};

// jira OBS project customfield_17205
export const OLE_JIRA_PRIMARY_HARDWARE_COMPONENTS = {
  None: -1,
  Mount: 16816,
  Rotator: 16817,
  Hexapod: 16818,
  M2: 16819,
  'Science Cameras': 16820,
  M1M3: 16821,
  Dome: 16822,
  Utilities: 16825,
  Calibration: 16826,
  Other: 16827,
};
/*****************************************************************************/
/**************************CSC Summary configurations*************************/
/*****************************************************************************/

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
  'Simonyi Telescope': {
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

/*****************************************************************************/
/***************************STATE TO STYLE MAPPINGS***************************/
/*****************************************************************************/

// Generic
export const summaryStateToStyle = {
  UNKNOWN: 'undefined',
  DISABLED: 'invalid',
  ENABLED: 'ok',
  FAULT: 'alert',
  OFFLINE: 'invalid',
  STANDBY: 'warning',
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
  TRACKINGDISABLED: 'warning',
  TRACKINGENABLED: 'ok',
  STOPPING: 'warning',
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

// CCCAmera
export const ccCameraImageReadinessDetailedStateToStyle = {
  READY: 'ok',
  'NOT READY': 'warning',
  'GETTING READY': 'warning',
  UNKNOWN: 'invalid',
};

export const ccCameraShutterDetailedStateToStyle = {
  CLOSED: 'ok',
  OPEN: 'ok',
  CLOSING: 'warning',
  OPENING: 'warning',
  UNKNOWN: 'invalid',
};

export const ccCameraFilterChangerDetailedStateToStyle = {
  UNLOADING: 'warning',
  LOADING: 'warning',
  LOADED: 'ok',
  UNLOADED: 'warning',
  ROTATING: 'warning',
  UNKNOWN: 'invalid',
};

// Optical Alignment Alarm
export const alignedStateToStyle = {
  ALIGNED: 'ok',
  'NOT ALIGNED': 'warning',
};

//DM Flow
export const dmFlowStatusMap = {
  1: 'INTEGRATING',
  2: 'FORDWARDED',
  3: 'STOPPED',
  4: 'DROPPED',
  5: 'COMPLETE',
  6: 'COPYING',
  7: 'PROCESSED',
  0: 'UNKNOWN',
};

export const stateToStyleDMFlow = {
  INTEGRATING: 'warning',
  FORDWARDED: 'warning',
  STOPPED: 'ok',
  DROPPED: 'alert',
  COMPLETE: 'running',
  COPYING: 'warning',
  PROCESSED: 'running',
  UNKNOWN: 'invalid',
};

//  MTM1M3
export const m1m3DetailedStateToStyle = {
  'DISABLED STATE': 'warning',
  'FAULT STATE': 'alert',
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

export const m1m3ILCStateToStyle = {
  ON: 'ok',
  OFF: 'warning',
};

// MTM2
export const m2PowerTypeStateToStyle = {
  UNKNOWN: 'invalid',
  ACTUATOR: 'ok',
  ILC: 'ok',
};

export const m2PowerStateToStyle = {
  UNKNOWN: 'invalid',
  INITIALIZATION: 'ok',
  ON: 'ok',
  OFF: 'warning',
  POWERING_ON: 'running',
  RESETTING_BREAKS: 'running',
  POWERING_OFF: 'running',
};

export const m2ActuatorILCStateToStyle = {
  OPERATIVE: 'ok',
  FAULT: 'warning',
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

export const stateToStyleMTMountCommander = {
  NONE: 'invalid',
  CSC: 'ok',
  EUI: 'warning',
  HHD: 'warning',
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

export const stateToStyleMTMountAxisMotionState = {
  STOPPING: 'warning',
  STOPPED: 'ok',
  'MOVING POINT TO POINT': 'warning',
  JOGGING: 'warning',
  TRACKING: 'warning',
  TRACKING_PAUSED: 'warning',
  UNKNOWN: 'invalid',
};

export const stateToStyleMotorDrive = {
  DISABLED: 'ok',
  ENABLED: 'running',
};

export const stateToStyleMotorBrake = {
  DISENGAGED: 'running',
  ENGAGED: 'ok',
};

export const hexapodStatusStatetoStyle = {
  UNKNOWN: 'undefined',
  DISABLED: 'disabled',
  ENABLED: 'enabled',
  FAULT: 'fault',
  OFFLINE: 'offline',
  STANDBY: 'standby',
};

export const hexapodCommandableByDDSStatetoStyle = {
  'NOT COMMANDABLE': 'alert',
  COMMANDABLE: 'ok',
};

export const hexapodCompensationModeStatetoStyle = {
  DISABLED: 'undefined',
  ENABLED: 'ok',
};

export const hexapodControllerStatetoStyle = {
  STANDBY: 'ok',
  DISABLED: 'undefined',
  ENABLED: 'ok',
  OFFLINE: 'undefined',
  FAULT: 'alert',
};

export const hexapodMTInPositionStatetoStyle = {
  'NOT READY': 'warning',
  'IN POSITION': 'ok',
};

export const hexapodConnectedStatetoStyle = {
  DISCONNECTED: 'alert',
  CONNECTED: 'ok',
};

export const mtdomeStatusStatetoStyle = {
  UNKNOWN: 'undefined',
  DISABLED: 'invalid',
  ENABLED: 'enabled',
  FAULT: 'fault',
  OFFLINE: 'invalid',
  STANDBY: 'standby',
};

export const mtDomeModeStatetoStyle = {
  DEGRADED: 'warning',
  NORMAL: 'ok',
};

export const mtDomeAzimuthEnabledStatetoStyle = {
  DISABLED: 'undefined',
  ENABLED: 'ok',
  FAULT: 'fault',
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

export const mtdomeElevationEnabledStatetoStyle = {
  DISABLED: 'undefined',
  ENABLED: 'ok',
  FAULT: 'fault',
};

export const mtDomeTrackingStatetoStyle = {
  UNKNOWN: 'invalid',
};

export const atDomeTrackingStatetoStyle = {
  UNKNOWN: 'invalid',
};

export const ataosCorrectionsStateToStyle = {
  DISABLED: 'warning',
  ENABLED: 'ok',
  UNKNOWN: 'invalid',
};

//Observatory
export const telescopeTrackingStateToStyle = {
  UNKNOWN: 'invalid',
  'NOT TRACKING': 'warning',
  TRACKING: 'ok',
};

export const telescopeTrackingModeStateToStyle = {
  UNKNOWN: 'invalid',
  FKS: 'ok',
  ICRS: 'ok',
};

// MTM1M3TS
export const m1m3tsEnabledStateToStyle = {
  ENABLED: 'ok',
  DISABLED: 'warning',
};

export const m1m3tsSummaryStateToStyle = {
  DISABLED: 'warning',
  ENABLED: 'ok',
  FAULT: 'warning',
  OFFLINE: 'warning',
  STANDBY: 'warning',
};

export const m1m3tsILCStateToStyle = {
  ON: 'ok',
  OFF: 'warning',
};

export const mtm1m3tsFanBreakerStateToStyle = {
  ON: 'ok',
  OFF: 'warning',
};

export const mtm1m3tsHeaterDisabledStateToStyle = {
  ON: 'ok',
  OFF: 'warning',
};

//MTM1M3TS Glycol Loop
export const stateToStyleGlycolLoopPumpStateMap = {
  UNKNOWN: 'invalid',
  FAULT: 'fault',
  RUNNING: 'ok',
  READY: 'ok',
  'NOT READY': 'invalid',
};

export const stateToStyleGlycolLoopCommandStateMap = {
  UNKNOWN: 'invalid',
  CONTROLLED: 'ok',
  DISABLED: 'invalid',
};

export const stateToStyleGlycolLoopMainFreqStateMap = {
  UNKNOWN: 'invalid',
  CONTROLLED: 'ok',
  'NOT CONTROLLED': 'invalid',
};

export const stateToStyleGlycolLoopParametersStateMap = {
  UNKNOWN: 'invalid',
  LOCKED: 'ok',
  UNLOCKED: 'warning',
};

export const stateToStyleGlycolLoopDirectionStateMap = {
  UNKNOWN: 'invalid',
  FORWARD: 'ok',
  BACKWARD: 'ok',
};

export const stateToStyleGlycolLoopRotationStateMap = {
  UNKNOWN: 'invalid',
  FORWARD: 'ok',
  BACKWARD: 'ok',
};

export const stateToStyleGlycolLoopSpeedStateMap = {
  UNKNOWN: 'invalid',
  ACCELERATING: 'ok',
  DECELERATING: 'ok',
};

// MTCamera
export const mtCameraRaftDetailedStateToStyle = {
  GOOD: 'ok',
  REGULAR: 'warning',
  BAD: 'alert',
  UNKNOWN: 'invalid',
};

// CCCamera
export const ccCameraRaftDetailedStateToStyle = {
  GOOD: 'ok',
  REGULAR: 'warning',
  BAD: 'alert',
  UNKNOWN: 'invalid',
};

// Aircraft tracker
export const aircraftTrackerStatetoStyle = {
  DISCONNECTED: 'warning',
  CONNECTED: 'running',
};

// Scheduler
export const schedulerTrackingStateToStyle = {
  'NO TRACKING': 'undefined',
  TRACKING: 'ok',
};

// Scheduler
export const schedulerDetailedStateToStyle = {
  UNKNOWN: 'undefined',
  IDLE: 'invalid',
  RUNNING: 'ok',
  WAITING_NEXT_TARGET_TIMER_TASK: 'running',
  GENERATING_TARGET_QUEUE: 'runnin',
  COMPUTING_PREDICTED_SCHEDULE: 'running',
  QUEUEING_TARGET: 'running',
};

// Scheduler
export const schedulerBlocksStateToStyle = {
  INVALID: 'invalid',
  AVAILABLE: 'ok',
  STARTED: 'warning',
  EXECUTING: 'ok',
  COMPLETED: 'ok',
  ERROR: 'alert',
  INTERRUPTED: 'alert',
};

/*****************************************************************************/
/*******************************STATE MAPPINGS********************************/
/*****************************************************************************/

// Generic
export const summaryStateMap = {
  0: 'UNKNOWN',
  1: 'DISABLED',
  2: 'ENABLED',
  3: 'FAULT',
  4: 'OFFLINE',
  5: 'STANDBY',
};

// ATCamera
export const cameraStates = {
  raftsDetailedState: {
    1: 'NEEDS_CLEAR',
    2: 'CLEARING',
    3: 'INTEGRATING',
    4: 'READING_OUT',
    5: 'QUIESCENT',
  },
  imageReadinessDetailedState: {
    1: 'READY',
    2: 'NOT_READY',
    3: 'GETTING_READY',
  },
  calibrationDetailedState: {
    1: 'DISABLED',
    2: 'ENABLED',
    3: 'INTEGRATING',
  },
  shutterDetailedState: {
    1: 'CLOSED',
    2: 'OPEN',
    3: 'CLOSING',
    4: 'OPENING',
  },
};

// CCCAmera
export const ccCameraImageReadinessDetailedStateMap = {
  1: 'READY',
  2: 'NOT READY',
  3: 'GETTING READY',
  0: 'UNKNOWN',
};

export const ccCameraShutterDetailedStateMap = {
  1: 'CLOSED',
  2: 'OPEN',
  3: 'CLOSING',
  4: 'OPENING',
  0: 'UNKNOWN',
};

export const ccCameraFilterChangerDetailedStateMap = {
  1: 'UNLOADING',
  2: 'LOADING',
  3: 'LOADED',
  4: 'UNLOADED',
  5: 'ROTATING',
  0: 'UNKNOWN',
};

// Optical Alignment Alarm
export const alignedStateMap = {
  1: 'ALIGNED',
  2: 'NOT ALIGNED',
  0: 'UNKNOWN',
};

// MTM2
export const m2PowerTypeStateMap = {
  0: 'UNKNOWN',
  1: 'ACTUATOR',
  2: 'ILC',
};

export const m2PowerStateMap = {
  0: 'UNKNOWN',
  1: 'INITIALIZATION',
  2: 'OFF',
  3: 'POWERING_ON',
  4: 'RESETTING_BREAKS',
  5: 'ON',
  6: 'POWERING_OFF',
};

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

export const m1m3ActuatorILCStateMap = {
  1: 'ON',
  0: 'OFF',
};

export const m1m3tsActuatorILCStateMap = {
  true: 'ON',
  false: 'OFF',
};

export const m1m3HardpointActuatorMotionStateMap = {
  1: 'CHASING',
  2: 'STEPPING',
  3: 'QUICK POSITIONING',
  4: 'FINE POSITIONING',
  0: 'STANDBY',
};

// MTDome
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

export const mtDomeTrackingStateMap = {
  0: 'UNKNOWN',
};

export const atDomeTrackingStateMap = {
  0: 'UNKNOWN',
};

export const mountTrackingStateMap = {
  0: 'UNKNOWN',
  6: 'REMOTECONTROL',
  7: 'HANDPADDLECONTROL',
  8: 'TRACKINGDISABLED',
  9: 'TRACKINGENABLED',
  10: 'STOPPING',
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
  1: 'NASMYTH1',
  2: 'NASMYTH2',
  3: 'PORT3',
  0: 'UNKNOWN',
};

export const m3InPositionStateMap = {
  1: 'NOT READY',
  2: 'IN POSITION',
  0: 'UNKNOWN',
};

export const ataosCorrectionsStateMap = {
  false: 'DISABLED',
  true: 'ENABLED',
  undefined: 'UNKNOWN',
};

// MTCamera
export const mtCameraRaftDetailedStateMap = {
  1: 'GOOD',
  2: 'REGULAR',
  3: 'BAD',
  0: 'UNKNOWN',
};

// CCCamera
export const ccCameraRaftDetailedStateMap = {
  1: 'GOOD',
  2: 'REGULAR',
  3: 'BAD',
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

export const mainValveStateMap = {
  1: 'OPEN',
  2: 'CLOSED',
  0: 'UNKNOWN',
};

export const instrumentStateMap = {
  1: 'OPEN',
  2: 'CLOSED',
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

export const hexapodInPositionStateMap = {
  1: 'IN POSITION',
  2: 'NOT READY',
  0: 'UNKNOWN',
};

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

export const m2ActuatorLimitSwitchStateMap = {
  1: 'CLOSED',
  0: 'OPEN',
};

export const motorDriveStateMap = {
  false: 'DISABLED',
  true: 'ENABLED',
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

export const mtMountPowerStateMap = {
  0: 'OFF',
  1: 'ON',
  2: 'FAULT',
  3: 'TURNING_ON',
  4: 'TURNING_OFF',
  15: 'UNKNOWN',
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

export const stateToStyleMTMountMirrorCoversState = {
  UNKNOWN: 'undefined',
  RETRACTED: 'ok',
  DEPLOYED: 'ok',
  RETRACTING: 'warning',
  DEPLOYING: 'warning',
  LOST: 'alert',
};

export const motorBrakeStateMap = {
  false: 'DISENGAGED',
  true: 'ENGAGED',
};

export const hexapodCommandableByDDSStateMap = {
  false: 'NOT COMMANDABLE',
  true: 'COMMANDABLE',
};

export const hexapodCompensationModeStateMap = {
  false: 'DISABLED',
  true: 'ENABLED',
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

export const hexapodConnectedStateMap = {
  false: 'DISCONNECTED',
  true: 'CONNECTED',
};

export const mtDomeModeStateMap = {
  0: 'DEGRADED',
  1: 'NORMAL',
};

export const mtDomeAzimuthEnabledStateMap = {
  0: 'DISABLED',
  1: 'ENABLED',
  2: 'FAULT',
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

// Aircraft Tracker
export const aircraftTrackerStateToMap = {
  0: 'DISCONNECTED',
  1: 'CONNECTED',
};

export const mtdomeElevationEnabledStateToMap = {
  0: 'DISABLED',
  1: 'ENABLED',
  2: 'FAULT',
};

//Observatory
export const telescopeTrackingStateMap = {
  0: 'UNKNOWN',
  false: 'NOT TRACKING',
  true: 'TRACKING',
};

export const telescopeTrackingModeStateMap = {
  0: 'UNKNOWN',
  1: 'FKS',
  2: 'ICRS',
};

//MTM1M3TS
export const m1m3tsEnabledStateMap = {
  true: 'ENABLED',
  false: 'DISABLED',
};

export const m1m3tsSummaryStates = {
  1: 'DISABLED',
  2: 'ENABLED',
  3: 'FAULT',
  4: 'OFFLINE',
  5: 'STANDBY',
};

export const mtm1m3tsFanBreakerStateMap = {
  false: 'OFF',
  true: 'ON',
};

export const mtm1m3HeaterDisabledStateMap = {
  false: 'OFF',
  true: 'ON',
};

// Scheduler
export const schedulerTrackingStateToMap = {
  false: 'NO TRACKING',
  true: 'TRACKING',
};

// Scheduler
export const schedulerDetailedStateToMap = {
  0: 'UNKNOWN',
  1: 'IDLE',
  2: 'RUNNING',
  3: 'WAITING_NEXT_TARGET_TIMER_TASK',
  4: 'GENERATING_TARGET_QUEUE',
  5: 'COMPUTING_PREDICTED_SCHEDULE',
  6: 'QUEUEING_TARGET',
};

//MTM1M3TS Glycol Loop
export const glycolLoopFaultStateMap = {
  undefined: false,
  true: true,
  false: false,
};

export const glycolLoopRunningStateMap = {
  undefined: false,
  true: true,
  false: false,
};

export const glycolLoopReadyStateMap = {
  undefined: 'UNKNOWN',
  true: 'READY',
  false: 'NOT READY',
};

export const glycolLoopCommandStateMap = {
  undefined: 'UNKNOWN',
  true: 'CONTROLLED',
  false: 'DISABLED',
};

export const glycolLoopMainFreqStateMap = {
  undefined: 'UNKNOWN',
  true: 'CONTROLLED',
  false: 'NOT CONTROLLED',
};

export const glycolLoopParametersStateMap = {
  undefined: 'UNKNOWN',
  true: 'LOCKED',
  false: 'UNLOCKED',
};

export const glycolLoopDirectionStateMap = {
  undefined: 'UNKNOWN',
  true: 'FORWARD',
  false: 'BACKWARD',
};

export const glycolLoopAcceleratingStateMap = {
  undefined: false,
  true: 'ACCELERATING',
  false: false,
};

export const glycolLoopDeceleratingStateMap = {
  undefined: false,
  true: 'DECELERATING',
  false: false,
};

/*****************************************************************************/
/**************************MTM3 actuator and forces***************************/
/*****************************************************************************/

// Components configurations
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

export const M1M3XActuatorsMapping = [
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  0,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  1,
  null,
  null,
  null,
  null,
  null,
  null,
  2,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  3,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  4,
  null,
  null,
  null,
  null,
  null,
  null,
  5,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  6,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  7,
  null,
  null,
  null,
  null,
  null,
  null,
  8,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  9,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  10,
  null,
  null,
  null,
  null,
  null,
  null,
  11,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
];
export const M1M3YActuatorsMapping = [
  null,
  0,
  1,
  2,
  3,
  null,
  null,
  4,
  5,
  6,
  7,
  null,
  8,
  9,
  10,
  11,
  12,
  13,
  null,
  14,
  15,
  16,
  17,
  18,
  null,
  19,
  20,
  null,
  21,
  22,
  null,
  23,
  24,
  25,
  null,
  null,
  26,
  27,
  null,
  null,
  null,
  null,
  null,
  null,
  28,
  29,
  30,
  31,
  null,
  32,
  33,
  34,
  35,
  36,
  null,
  37,
  38,
  39,
  40,
  41,
  null,
  42,
  null,
  43,
  44,
  null,
  45,
  46,
  47,
  null,
  null,
  48,
  49,
  null,
  null,
  null,
  null,
  null,
  null,
  50,
  51,
  52,
  53,
  null,
  null,
  54,
  55,
  56,
  57,
  null,
  58,
  59,
  60,
  61,
  62,
  63,
  null,
  64,
  65,
  66,
  67,
  68,
  null,
  69,
  70,
  null,
  71,
  72,
  null,
  73,
  74,
  75,
  null,
  null,
  76,
  77,
  null,
  null,
  null,
  null,
  null,
  null,
  78,
  79,
  80,
  81,
  null,
  82,
  83,
  84,
  85,
  86,
  null,
  87,
  88,
  89,
  90,
  91,
  null,
  92,
  null,
  93,
  94,
  null,
  95,
  96,
  97,
  null,
  null,
  98,
  99,
  null,
  null,
  null,
  null,
  null,
];

export const M1M3ZActuatorsMapping = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
  32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60,
  61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89,
  90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114,
  115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137,
  138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155,
];

export const M1M3SActuatorsMapping = [
  null,
  0,
  1,
  2,
  3,
  null,
  null,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  null,
  15,
  16,
  17,
  18,
  19,
  null,
  20,
  21,
  22,
  23,
  24,
  null,
  25,
  26,
  27,
  28,
  null,
  29,
  30,
  null,
  null,
  null,
  null,
  null,
  null,
  31,
  32,
  33,
  34,
  35,
  36,
  37,
  38,
  39,
  40,
  null,
  41,
  42,
  43,
  44,
  45,
  null,
  46,
  47,
  48,
  49,
  null,
  50,
  51,
  52,
  53,
  null,
  54,
  55,
  null,
  null,
  null,
  null,
  null,
  null,
  56,
  57,
  58,
  59,
  null,
  null,
  60,
  61,
  62,
  63,
  64,
  65,
  66,
  67,
  68,
  69,
  70,
  null,
  71,
  72,
  73,
  74,
  75,
  null,
  76,
  77,
  78,
  79,
  80,
  null,
  81,
  82,
  83,
  84,
  null,
  85,
  86,
  null,
  null,
  null,
  null,
  null,
  null,
  87,
  88,
  89,
  90,
  91,
  92,
  93,
  94,
  95,
  96,
  null,
  97,
  98,
  99,
  100,
  101,
  null,
  102,
  103,
  104,
  105,
  null,
  106,
  107,
  108,
  109,
  null,
  110,
  111,
  null,
  null,
  null,
  null,
  null,
];

/*****************************************************************************/
/***************************MTM2 actuator positions***************************/
/*****************************************************************************/

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

/*****************************************************************************/
/***************************MTDome louvers mappings***************************/
/*****************************************************************************/
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

/*****************************************************************************/
/***********************GIS alerts and signals mappings***********************/
/*****************************************************************************/

export const signals = {
  fireProtectionSystem: {
    fireSignal: [
      /** GIS */
      'fireIndication',
    ],
  },
  earthquakeDetectionSystem: {
    catastrophicEarthquakeSignal: [
      /** TMA IS */
      'dischargeCapacitorBanks',
      'stoOthersDrives',
      'stoElAndAzDrivesAndEngageTheBrakes',
      'stoCCWDrives',
      /** DOME IS */
      'stoDrivesShutterDoorsAnsWindscreen',
      'stoDrivesLouversAndLockingPin',
      'stoRearDoorsDrives',
      'stoAzDrivesEngageBrakes',
      /** M2 IS */
      'stoHexapodsM2',
      'stoActuatorsM2',
      /** CAMERA IS */
      'stoRotatorCam',
      'stoHexapodsCam',
      /** PLFOW IS */
      'stoPlatformLift',
      /** M3 IS */
      'earthquakeStoActuators',
      /** LASER IS */
      'laserCutOffShutterClosed',
    ],
  },
  globalInterlockSystem: {
    internalFailure: [
      /** TMA IS */
      'stoOthersDrives',
      'stoElAndAzDrivesAndEngageTheBrakes',
      'stoCCWDrives',
      /** DOME IS */
      'stoDrivesShutterDoorsAnsWindscreen',
      'stoDrivesLouversAndLockingPin',
      'stoRearDoorsDrives',
      'stoAzDrivesEngageBrakes',
      /** M2 IS */
      'stoHexapodsM2',
      'stoActuatorsM2',
      /** CAMERA IS */
      'stoRotatorCam',
      'stoHexapodsCam',
      /** PLFOW IS */
      'stoLiftAtToTopFloor',
      /** M3 IS */
      'emergencyStoActuators',
      /** LASER IS */
      'laserCutOffShutterClosed',
    ],
    emergencyStop: [
      /** TMA IS */
      'stoOthersDrives',
      'stoElAndAzDrivesAndEngageTheBrakes',
      'stoCCWDrives',
      /** DOME IS */
      'stoDrivesShutterDoorsAnsWindscreen',
      'stoCraneDrives',
      'stoRearDoorsDrives',
      'stoDrivesLouversAndLockingPin',
      'stoAzDrivesEngageBrakes',
      /** M2 IS */
      'stoHexapods',
      'stoActuators',
      /** CAMERA IS */
      'stoRotatorCam',
      'stoHexapodsCam',
      /** PLFOW IS */
      'stoLiftAtToTopFloor',
      /** M3 IS */
      'emergencyStoActuators',
      /** LASER IS */
      'laserCutOffShutterClosed',
      /** MAN-LIFT IS */
      'stoFunctionDrives',
    ],
  },
  accessControlSystem: {
    unauthorizedPierAccess: [
      /** TMA IS */
      'stoElAndAzDrivesAndEngageTheBrakes',
    ],
    unauthorizedDomeAccess: [
      /** TMA IS */
      'stoElAndAzDrivesAndEngageTheBrakes',
      /** DOME IS */
      'stoAzDrivesEngageBrakes',
      /** LASER IS */
      'laserCutOffShutterClosed',
    ],
  },
  tmaInterlockSystem: {
    brakesNotEngaged: [
      /** DOME IS */
      'stoCraneDrives',
      /** MAN-LIFT IS */
      'stoFunctionDrives',
    ],
    ccwSafetyDevice: [
      /** CAMERA IS */
      'stoRotatorCam',
    ],
    tmaEtpbs: [
      /** DOME IS */
      'stoDrivesShutterDoorsAnsWindscreen',
      'stoCraneDrives',
      'stoRearDoorsDrives',
      'stoDrivesLouversAndLockingPin',
      'stoAzDrivesEngageBrakes',
      /** M2 IS */
      'stoHexapods',
      'stoActuators',
      /** CAMERA IS */
      'stoRotatorCam',
      'stoHexapodsCam',
      /** PFLOW IS */
      'stoPlatformLift',
      /** M1M3 IS */
      'emergencyStoActuators',
      /** LASER IS */
      'laserCutOffShutterClosed',
      /** MAN-LIFT IS */
      'stoFunctionDrives',
    ],
    failedWatchdogOrLossCommunication: [
      /** CAMERA IS */
      'stoRotatorCam',
      'stoHexapodsCam',
    ],
  },
  domeInterlockSystem: {
    loockingPinRetractedOrRearDoorLouversNotClosed: [
      /** PFLOW IS */
      'stoLiftAtToTopFloor',
    ],
    rearDoorNotClosed: [
      /** PFLOW IS */
      'stoPlatformLift',
    ],
    domeEtpbs: [
      /** TMA IS */
      'stoOthersDrives',
      'stoElAndAzDrivesAndEngageTheBrakes',
      'stoCCWDrives',
      /** M2 IS */
      'stoHexapodsM2',
      'stoActuatorsM2',
      /** CAMERA IS */
      'stoRotatorCam',
      'stoHexapodsCam',
      /** PFLOW IS */
      'stoLiftAtToTopFloor',
      /** M3 IS */
      'emergencyStoActuators',
      /** LASER IS */
      'laserCutOffShutterClosed',
      /** MAN-LIFT IS */
      'stoFunctionDrives',
    ],
    craneBridgeLimitSwitchisReleasedFromParkedPosition: [
      /** TMA IS */
      'stoElAndAzDrivesAndEngageTheBrakes',
      /** MAN-LIFT IS */
      'stoFunctionDrives',
    ],
  },
  camera: {
    cameraRotatorPinInserted: [
      /** GIS */
      'cameraRotatorPinInserted',
    ],
  },
  platformLift: {
    aboveUtilityFloor: [
      /** TMA IS */
      'stoDrivesLouversAndLockingPin',
    ],
    notParkedAtTheTelescopeLevel: [
      /** TMA IS */
      'stoRearDoorsDrives',
    ],
  },
  m1m3SupportSystem: {
    interlock: [
      /** TMA IS */
      'stoElAndAzDrivesAndEngageTheBrakes',
    ],
  },
  manLift: {
    manLiftNotParked: [
      /** TMA IS */
      'stoElAndAzDrivesAndEngageTheBrakes',
      /** DOME IS */
      'stoCraneDrives',
    ],
  },
};

export const effects = {
  globalInterlockSystem: ['fireIndication', 'cameraRotatorPinInserted'],
  m1m3SupportSystem: ['earthquakeStoActuators', 'emergencyStoActuators'],
  tmaInterlockSystem: [
    'dischargeCapacitorBanks',
    'stoOthersDrives',
    'stoElAndAzDrivesAndEngageTheBrakes',
    'stoCCWDrives',
  ],
  domeInterlockSystem: [
    'stoDrivesShutterDoorsAnsWindscreen',
    'stoCraneDrives',
    'stoRearDoorsDrives',
    'stoDrivesLouversAndLockingPin',
    'stoAzDrivesEngageBrakes',
  ],
  camera: ['stoRotatorCam', 'stoHexapodsCam'],
  pflowController: ['stoPlatformLift', 'stoLiftAtToTopFloor'],
  m2: ['stoHexapodsM2', 'stoActuatorsM2'],
  laserController: ['laserCutOffShutterClosed'],
  manLift: ['stoFunctionDrives'],
};

export const alertSignalIndexes = {
  fireSignal: [23, 0],
  catastrophicEarthquakeSignal: [23, 1],
  internalFailure: [23, 2],
  emergencyStop: [23, 3],
  unauthorizedPierAccess: [23, 4],
  unauthorizedDomeAccess: [23, 5],
  brakesNotEngaged: [23, 6],
  ccwSafetyDevice: [23, 7],
  tmaEtpbs: [23, 8],
  failedWatchdogOrLossCommunication: [24, 0],
  loockingPinRetractedOrRearDoorLouversNotClosed: [23, 9],
  rearDoorNotClosed: [23, 10],
  domeEtpbs: [23, 11],
  craneBridgeLimitSwitchisReleasedFromParkedPosition: [23, 12],
  cameraRotatorPinInserted: [23, 13],
  aboveUtilityFloor: [23, 14],
  notParkedAtTheTelescopeLevel: [23, 15],
  interlock: [24, 1],
  manLiftNotParked: [24, 2],
};

export const signalBypassIndexes = {
  fireSignal: [25, 0],
  catastrophicEarthquakeSignal: [25, 1],
  internalFailure: [25, 2],
  emergencyStop: [25, 3],
  unauthorizedPierAccess: [25, 4],
  unauthorizedDomeAccess: [25, 5],
  brakesNotEngaged: [25, 6],
  ccwSafetyDevice: [25, 7],
  tmaEtpbs: [25, 8],
  failedWatchdogOrLossCommunication: [26, 0],
  loockingPinRetractedOrRearDoorLouversNotClosed: [25, 9],
  rearDoorNotClosed: [25, 10],
  domeEtpbs: [25, 11],
  craneBridgeLimitSwitchisReleasedFromParkedPosition: [25, 12],
  cameraRotatorPinInserted: [25, 13],
  aboveUtilityFloor: [25, 14],
  notParkedAtTheTelescopeLevel: [25, 15],
  interlock: [26, 1],
  manLiftNotParked: [26, 2],
};

/***************************************************************************/
/***************************** Dynalenel System ***************************/
/*************************************************************************/

export const dynaleneDetailedStateMap = {
  0: 'Initialized',
  1: 'ShuttingDown',
  2: 'PoweringOn',
  3: 'PoweredOn',
  4: 'PoweringOff',
  5: 'PoweredOff',
  6: 'Warning',
  7: 'Alarm',
  8: 'ShutOff',
  9: 'Unknown',
};

export const dynaleneDetailedStateToStyle = {
  Initialized: 'ok',
  ShuttingDown: 'warning',
  PoweringOn: 'warning',
  PoweredOn: 'warning',
  PoweringOff: 'warning',
  PoweredOff: 'undefined',
  Warning: 'warning',
  Alarm: 'alert',
  ShutOff: 'undefined',
  Unknown: 'undefined',
};

export const dynaleneTankLevelDetailedStateMap = {
  0: 'Ok',
  1: 'Warning',
  2: 'Alarm',
  9: 'Unknown',
};

export const dynaleneTankLevelToStyle = {
  Ok: 'ok',
  Warning: 'warning',
  Alarm: 'alert',
  Unknown: 'invalid',
};

/*****************************************************************************/
/***************************** M1M3 Thermal System ***************************/
/*****************************************************************************/

export const M1M3TSFanCoilPositions = [
  { id: 'F1', position: [32.127, 153.134] },
  { id: 'F4', position: [-32.127, 153.134] },
  { id: 'F31', position: [67.781, 41.744] },
  { id: 'F32', position: [43.573, 37.789] },
  { id: 'F35', position: [-43.574, 37.789] },
  { id: 'F36', position: [-67.781, 41.744] },
  { id: 'F58', position: [56.568, -30.23] },
  { id: 'F63', position: [-56.568, -30.23] },
  { id: 'F67', position: [122.212, -53.015] },
  { id: 'F69', position: [43.688, -52.969] },
  { id: 'F70', position: [-43.688, -52.969] },
  { id: 'F72', position: [-122.212, -53.015] },
  { id: 'F75', position: [56.795, -75.661] },
  { id: 'F79', position: [-56.795, -75.661] },
  { id: 'F83', position: [43.574, -98.417] },
  { id: 'F86', position: [-43.574, -98.417] },
  { id: 'F9', position: [30.582, 105.947] },
  { id: 'F11', position: [-30.582, 105.947] },
  { id: 'F12', position: [95.999, 83.191] },
  { id: 'F14', position: [17.361, 83.191] },
  { id: 'F15', position: [-17.361, 83.191] },
  { id: 'F17', position: [-95.999, 83.191] },
  { id: 'F18', position: [135.433, 60.545] },
  { id: 'F19', position: [109.22, 60.545] },
  { id: 'F20', position: [83.007, 60.545] },
  { id: 'F23', position: [2.256, 64.281] },
  { id: 'F26', position: [-83.007, 60.545] },
  { id: 'F27', position: [-109.22, 60.545] },
  { id: 'F28', position: [-135.433, 60.545] },
  { id: 'F30', position: [95.999, 37.789] },
  { id: 'F33', position: [17.361, 37.789] },
  { id: 'F34', position: [-17.361, 37.789] },
  { id: 'F37', position: [-95.999, 37.789] },
  { id: 'F40', position: [109.22, 15.143] },
  { id: 'F41', position: [-83.007, 15.143] },
  { id: 'F44', position: [-83.007, 15.143] },
  { id: 'F45', position: [-109.22, 15.143] },
  { id: 'F49', position: [95.999, -7.613] },
  { id: 'F50', position: [69.787, -7.613] },
  { id: 'F51', position: [-69.787, -7.613] },
  { id: 'F52', position: [-95.999, -7.613] },
  { id: 'F55', position: [135.433, -30.259] },
  { id: 'F56', position: [109.22, -30.259] },
  { id: 'F57', position: [83.007, -30.259] },
  { id: 'F59', position: [30.582, -30.259] },
  { id: 'F62', position: [-30.582, -30.259] },
  { id: 'F64', position: [-83.007, -30.259] },
  { id: 'F65', position: [-109.22, -30.259] },
  { id: 'F66', position: [-135.433, -30.259] },
  { id: 'F68', position: [69.787, -53.015] },
  { id: 'F71', position: [-69.787, -53.015] },
  { id: 'F74', position: [83.007, -75.661] },
  { id: 'F77', position: [-2.142, -71.747] },
  { id: 'F80', position: [-83.007, -75.661] },
  { id: 'F82', position: [95.999, -98.417] },
  { id: 'F84', position: [17.361, -98.417] },
  { id: 'F85', position: [-17.361, -98.417] },
  { id: 'F87', position: [-95.999, -98.417] },
  { id: 'F91', position: [-30.572, -113.475] },
  { id: 'F5', position: [43.574, 128.593] },
  { id: 'F6', position: [17.361, 128.593] },
  { id: 'F7', position: [-17.361, 128.593] },
  { id: 'F8', position: [-43.574, 128.593] },
  { id: 'F21', position: [61.133, 60.527] },
  { id: 'F22', position: [35.013, 60.603] },
  { id: 'F24', position: [-35.013, 60.603] },
  { id: 'F25', position: [-61.133, 60.527] },
  { id: 'F29', position: [122.407, 45.27] },
  { id: 'F38', position: [-122.407, 45.27] },
  { id: 'F39', position: [148.061, 11.244] },
  { id: 'F42', position: [35.08, 15.221] },
  { id: 'F43', position: [-35.08, 15.221] },
  { id: 'F46', position: [-148.061, 11.244] },
  { id: 'F48', position: [148.063, -11.318] },
  { id: 'F53', position: [-147.988, -11.351] },
  { id: 'F60', position: [15.481, -34.351] },
  { id: 'F61', position: [-15.481, -34.351] },
  { id: 'F73', position: [137.048, -75.565] },
  { id: 'F76', position: [29.098, -78.299] },
  { id: 'F78', position: [-29.098, -78.299] },
  { id: 'F81', position: [-137.048, -75.565] },
  { id: 'F92', position: [71.398, -138.476] },
  { id: 'F94', position: [17.5, -143.444] },
  { id: 'F95', position: [-17.5, -143.444] },
  { id: 'F96', position: [-71.398, -138.476] },
  { id: 'F2', position: [15.197, 148.083] },
  { id: 'F3', position: [-15.197, 148.083] },
  { id: 'F10', position: [-2.114, 102.079] },
  { id: 'F13', position: [69.787, 83.191] },
  { id: 'F16', position: [-69.787, 83.191] },
  { id: 'F47', position: [162.09, -11.03] },
  { id: 'F54', position: [-162.09, -11.03] },
  { id: 'F88', position: [30.572, -113.475] },
  { id: 'F89', position: [8.76, -121.101] },
  { id: 'F90', position: [-8.76, -121.101] },
  { id: 'F93', position: [43.574, -143.819] },
].map((unit) => ({ ...unit, position: [unit.position[0] * -1, unit.position[1] * -1] }));

export const MessagesWarningM1M3ThermalSystem = {
  majorFault: 'Thermal fan unit warning major Fault.',
  minorFault: 'Thermal fan unit warning minor Fault.',
  faultOverride: 'Thermal fan unit warning fault Override.',
  refResistorError: 'Thermal fan unit Ref Resistor Error.',
  rtdError: 'Thermal fan unit RTD Error.',
  breakerHeater1Error: 'Thermal fan unit Breaker Heater 1 Error.',
  breakerFan2Error: 'Thermal fan unit Breaker Fan 2 Error.',
  uniqueIdCRCError: 'Thermal fan unit warning unique Id CRC Error.',
  applicationTypeMismatch: 'Thermal fan unit warning application Type Mismatch.',
  applicationMissing: 'Thermal fan unit warning application Missing.',
  applicationCRCMismatch: 'Thermal fan unit warning application CRC Mismatch.',
  oneWireMissing: 'Thermal fan unit warning oneWire Missing.',
  oneWire1Mismatch: 'Thermal fan unit warning oneWire1 Mismatch.',
  oneWire2Mismatch: 'Thermal fan unit warning oneWire2 Mismatch.',
  watchdogReset: 'Thermal fan unit warning watchdog Reset.',
  brownOut: 'Thermal fan unit warning brownout.',
  eventTrapReset: 'Thermal fan unit warning event Trap Reset.',
  ssrPowerFault: 'Thermal fan unit warning SSR Power Fault.',
  auxPowerFault: 'Thermal fan unit warning aux Power Fault.',
  ilcFault: 'Force actuator warning ILC Fault.',
  broadcastWarning: 'Force actuator warning broadcast counter Warning.',
};

// MTCamera

/** Considering rafts from 1 to 25, from top-left to bottom-righ */
export const mtcameraRaftsNeighborsMapping = {
  1: { top: null, right: 2, bottom: 6, left: null },
  2: { top: null, right: 3, bottom: 7, left: 1 },
  3: { top: null, right: 4, bottom: 8, left: 2 },
  4: { top: null, right: 5, bottom: 9, left: 3 },
  5: { top: null, right: null, bottom: 10, left: 4 },

  6: { top: 1, right: 7, bottom: 11, left: null },
  7: { top: 2, right: 8, bottom: 12, left: 6 },
  8: { top: 3, right: 9, bottom: 13, left: 7 },
  9: { top: 4, right: 10, bottom: 14, left: 8 },
  10: { top: 5, right: null, bottom: 15, left: 9 },

  11: { top: 6, right: 12, bottom: 16, left: null },
  12: { top: 7, right: 13, bottom: 17, left: 11 },
  13: { top: 8, right: 14, bottom: 18, left: 12 },
  14: { top: 9, right: 15, bottom: 19, left: 13 },
  15: { top: 10, right: null, bottom: 20, left: 14 },

  16: { top: 11, right: 17, bottom: 21, left: null },
  17: { top: 12, right: 18, bottom: 22, left: 16 },
  18: { top: 13, right: 19, bottom: 23, left: 17 },
  19: { top: 14, right: 20, bottom: 24, left: 18 },
  20: { top: 15, right: null, bottom: 25, left: 19 },

  21: { top: 16, right: 22, bottom: null, left: null },
  22: { top: 17, right: 23, bottom: null, left: 21 },
  23: { top: 18, right: 24, bottom: null, left: 22 },
  24: { top: 19, right: 25, bottom: null, left: 23 },
  25: { top: 20, right: null, bottom: null, left: 24 },
};

export const mtcameraRaftTempControlState = {
  0: 'NON ACTIVE',
  1: 'ACTIVE',
};

export const mtcameraRaftTempControlStateToStyle = {
  'NON ACTIVE': 'warning',
  ACTIVE: 'ok',
};

export const mtcameraCcsCommandStateMap = {
  0: 'IDLE',
  1: 'BUSY',
};

export const mtcameaCcsCommandStateToStyle = {
  IDLE: 'undefined',
  BUSY: 'ok',
};

export const mtcameraCalibrationDetailedStateMap = {
  0: 'DISABLED',
  1: 'ENABLED',
  2: 'INTEGRATING',
};

export const mtcameraCalibrationDetailedStateToStyle = {
  DISABLED: 'undefined',
  ENABLED: 'ok',
  INTEGRATING: 'ok',
};

export const mtcameraOffLineDetailedStateMap = {
  0: 'OFFLINE_AVAILABLE',
  1: 'OFFLINE_PUBLISH_ONLY',
};

export const mtcameraOffLineDetailedStateToStyle = {
  OFFLINE_AVAILABLE: 'undefined',
  OFFLINE_PUBLISH_ONLY: 'ok',
};

export const mtcameraImageReadlinessDetailedStateMap = {
  0: 'READY',
  1: 'NOT_READY',
  2: 'GETTING_READY',
};

export const mtcameraImageReadlinessDetailedStateToStyle = {
  READY: 'ok',
  NOT_READY: 'undefined',
  GETTING_READY: 'ok',
};

export const mtcameraShutterDetailedStateMap = {
  0: 'CLOSED',
  1: 'OPEN',
  2: 'CLOSING',
  3: 'OPENING',
};

export const mtcameraShutterDetailedStateToStyle = {
  CLOSED: 'undefined',
  OPEN: 'ok',
  CLOSING: 'ok',
  OPENING: 'ok',
};

export const mtcameraFilterChangerDetailedStateMap = {
  0: 'UNLOADING',
  1: 'LOADING',
  2: 'LOADED',
  3: 'UNLOADED',
  4: 'ROTATING',
};

export const mtcameraFilterChangerDetailedStateToStyle = {
  UNLOADING: 'undefined',
  LOADING: 'ok',
  LOADED: 'ok',
  UNLOADED: 'undefined',
  ROTATING: 'ok',
};

export const mtCameraRaftsDetailedStateMap = {
  0: 'NEEDS_CLEAR',
  1: 'CLEARING',
  2: 'INTEGRATING',
  3: 'READING_OUT',
  4: 'QUIESCENT',
  5: 'DISCARDING',
};

export const mtCameraRaftsDetailedStateToSTyle = {
  NEEDS_CLEAR: 'warning',
  CLEARING: 'ok',
  INTEGRATING: 'ok',
  READING_OUT: 'warning',
  QUIESCENT: 'undefined',
  DISCARDING: 'undefined',
};

// CCCamera
export const cccameraRaftTempControlState = {
  0: 'NON ACTIVE',
  1: 'ACTIVE',
};

export const cccameraRaftTempControlStateToStyle = {
  'NON ACTIVE': 'warning',
  ACTIVE: 'ok',
};

export const cccameraCcsCommandStateMap = {
  0: 'IDLE',
  1: 'BUSY',
};

export const cccameaCcsCommandStateToStyle = {
  IDLE: 'undefined',
  BUSY: 'ok',
};

export const cccameraCalibrationDetailedStateMap = {
  0: 'DISABLED',
  1: 'ENABLED',
  2: 'INTEGRATING',
};

export const cccameraCalibrationDetailedStateToStyle = {
  DISABLED: 'undefined',
  ENABLED: 'ok',
  INTEGRATING: 'ok',
};

export const cccameraOffLineDetailedStateMap = {
  0: 'OFFLINE_AVAILABLE',
  1: 'OFFLINE_PUBLISH_ONLY',
};

export const cccameraOffLineDetailedStateToStyle = {
  OFFLINE_AVAILABLE: 'undefined',
  OFFLINE_PUBLISH_ONLY: 'ok',
};

export const cccameraImageReadlinessDetailedStateMap = {
  0: 'READY',
  1: 'NOT_READY',
  2: 'GETTING_READY',
};

export const cccameraImageReadlinessDetailedStateToStyle = {
  READY: 'ok',
  NOT_READY: 'undefined',
  GETTING_READY: 'ok',
};

export const cccameraShutterDetailedStateMap = {
  0: 'CLOSED',
  1: 'OPEN',
  2: 'CLOSING',
  3: 'OPENING',
};

export const cccameraShutterDetailedStateToStyle = {
  CLOSED: 'undefined',
  OPEN: 'ok',
  CLOSING: 'ok',
  OPENING: 'ok',
};

export const cccameraFilterChangerDetailedStateMap = {
  0: 'UNLOADING',
  1: 'LOADING',
  2: 'LOADED',
  3: 'UNLOADED',
  4: 'ROTATING',
};

export const cccameraFilterChangerDetailedStateToStyle = {
  UNLOADING: 'undefined',
  LOADING: 'ok',
  LOADED: 'ok',
  UNLOADED: 'undefined',
  ROTATING: 'ok',
};

export const ccCameraRaftsDetailedStateMap = {
  0: 'NEEDS_CLEAR',
  1: 'CLEARING',
  2: 'INTEGRATING',
  3: 'READING_OUT',
  4: 'QUIESCENT',
  5: 'DISCARDING',
};

export const ccCameraRaftsDetailedStateToSTyle = {
  NEEDS_CLEAR: 'warning',
  CLEARING: 'ok',
  INTEGRATING: 'ok',
  READING_OUT: 'warning',
  QUIESCENT: 'undefined',
  DISCARDING: 'undefined',
};

export const LouversPositionESS = [
  {
    id: 1,
    name: 'A1',
    position: {
      x: -11.595,
      y: -9.563,
      z: 4.958,
    },
    angle: 229.6,
    type: 'I',
  },
  {
    id: 2,
    name: 'B1',
    position: {
      x: -5.572,
      y: -13.452,
      z: 5.538,
    },
    angle: 202.5,
    type: 'I',
  },
  {
    id: 3,
    name: 'A2',
    position: {
      x: -10.465,
      y: -10.463,
      z: 11.128,
    },
    angle: 225.7,
    type: 'II',
  },
  {
    id: 4,
    name: 'B2',
    position: {
      x: -5.572,
      y: -13.452,
      z: 11.128,
    },
    angle: 202.5,
    type: 'I',
  },
  {
    id: 5,
    name: 'B3',
    position: {
      x: -5.572,
      y: -13.452,
      z: 16.913,
    },
    angle: 202.5,
    type: 'II',
  },
  {
    id: 6,
    name: 'N1',
    position: {
      x: -12.323,
      y: 8.963,
      z: 4.958,
    },
    angle: 310.4,
    type: 'I',
  },
  {
    id: 7,
    name: 'M1',
    position: {
      x: -7.522,
      y: 12.664,
      z: 5.538,
    },
    angle: 337.5,
    type: 'I',
  },
  {
    id: 8,
    name: 'N2',
    position: {
      x: -12.323,
      y: 9.536,
      z: 11.128,
    },
    angle: 314.5,
    type: 'II',
  },
  {
    id: 9,
    name: 'M2',
    position: {
      x: -7.522,
      y: 12.664,
      z: 11.913,
    },
    angle: 337.5,
    type: 'I',
  },
  {
    id: 10,
    name: 'M3',
    position: {
      x: -7.522,
      y: 12.664,
      z: 16.913,
    },
    angle: 337.5,
    type: 'II',
  },
  {
    id: 11,
    name: 'C1',
    position: {
      x: 1.395,
      y: -14.493,
      z: 5.538,
    },
    angle: 174.5,
    type: 'I',
  },
  {
    id: 12,
    name: 'C2',
    position: {
      x: 1.395,
      y: -14.493,
      z: 11.913,
    },
    angle: 174.5,
    type: 'I',
  },
  {
    id: 13,
    name: 'C3',
    position: {
      x: 1.395,
      y: -14.493,
      z: 17.955,
    },
    angle: 174.5,
    type: 'I',
  },
  {
    id: 14,
    name: 'L1',
    position: {
      x: 1.395,
      y: 14.493,
      z: 5.538,
    },
    angle: 5.5,
    type: 'I',
  },
  {
    id: 15,
    name: 'L2',
    position: {
      x: 1.395,
      y: 14.493,
      z: 11.913,
    },
    angle: 5.5,
    type: 'I',
  },
  {
    id: 16,
    name: 'L3',
    position: {
      x: 1.395,
      y: 14.493,
      z: 17.955,
    },
    angle: 5.5,
    type: 'I',
  },
  {
    id: 17,
    name: 'E1',
    position: {
      x: 12.323,
      y: -9.536,
      z: 5.538,
    },
    angle: 127.7,
    type: 'I',
  },
  {
    id: 18,
    name: 'D2',
    position: {
      x: 7.522,
      y: -12.664,
      z: 11.913,
    },
    angle: 149.3,
    type: 'I',
  },
  {
    id: 19,
    name: 'E2',
    position: {
      x: 12.323,
      y: -9.536,
      z: 11.913,
    },
    angle: 127.7,
    type: 'I',
  },
  {
    id: 20,
    name: 'D3',
    position: {
      x: 7.522,
      y: -12.664,
      z: 17.955,
    },
    angle: 149.3,
    type: 'I',
  },
  {
    id: 21,
    name: 'E3',
    position: {
      x: 12.323,
      y: -9.536,
      z: 17.295,
    },
    angle: 127.7,
    type: 'II',
  },
  {
    id: 22,
    name: 'I1',
    position: {
      x: 7.522,
      y: 12.664,
      z: 5.538,
    },
    angle: 30.7,
    type: 'I',
  },
  {
    id: 23,
    name: 'H1',
    position: {
      x: 12.323,
      y: 9.536,
      z: 5.538,
    },
    angle: 52.3,
    type: 'I',
  },
  {
    id: 24,
    name: 'I2',
    position: {
      x: 7.522,
      y: 12.664,
      z: 11.913,
    },
    angle: 30.7,
    type: 'I',
  },
  {
    id: 25,
    name: 'H2',
    position: {
      x: 12.323,
      y: 9.536,
      z: 11.913,
    },
    angle: 52.3,
    type: 'I',
  },
  {
    id: 26,
    name: 'I3',
    position: {
      x: 7.522,
      y: 12.664,
      z: 17.955,
    },
    angle: 30.7,
    type: 'I',
  },
  {
    id: 27,
    name: 'H3',
    position: {
      x: 12.323,
      y: 9.536,
      z: 17.295,
    },
    angle: 52.3,
    type: 'II',
  },
  {
    id: 28,
    name: 'F1',
    position: {
      x: 16.652,
      y: -3.285,
      z: 4.971,
    },
    angle: 101.2,
    type: 'II',
  },
  {
    id: 29,
    name: 'G1',
    position: {
      x: 16.652,
      y: 3.285,
      z: 4.971,
    },
    angle: 78.8,
    type: 'II',
  },
  {
    id: 30,
    name: 'F2',
    position: {
      x: 16.652,
      y: -3.285,
      z: 11.913,
    },
    angle: 101.2,
    type: 'I',
  },
  {
    id: 31,
    name: 'G2',
    position: {
      x: 16.652,
      y: 3.285,
      z: 11.913,
    },
    angle: 78.8,
    type: 'I',
  },
  {
    id: 32,
    name: 'F3',
    position: {
      x: 16.652,
      y: -3.285,
      z: 16.575,
    },
    angle: 101.2,
    type: 'II',
  },
  {
    id: 33,
    name: 'G3',
    position: {
      x: 16.652,
      y: 3.285,
      z: 16.575,
    },
    angle: 78.8,
    type: 'II',
  },
  {
    id: 34,
    name: 'D1',
    position: {
      x: 7.522,
      y: -12.664,
      z: 5.538,
    },
    angle: 149.3,
    type: 'I',
  },
];

export const SensorsPositionESS = {
  'AuxTel-ESS01': [
    {
      xPosition: 1,
      yPosition: 1,
      zPosition: 1,
    },
    {
      xPosition: 1,
      yPosition: 1,
      zPosition: 2,
    },
    {
      xPosition: 1,
      yPosition: 1,
      zPosition: 3,
    },
    {
      xPosition: 1,
      yPosition: 1,
      zPosition: 4,
    },
    {
      xPosition: 1,
      yPosition: 1,
      zPosition: 5,
    },
    {
      xPosition: 1,
      yPosition: 1,
      zPosition: 6,
    },
    {
      xPosition: 1,
      yPosition: 1,
      zPosition: 7,
    },
    {
      xPosition: 1,
      yPosition: 1,
      zPosition: 8,
    },
  ],
  'AuxTel-ESS02': [
    {
      xPosition: 0,
      yPosition: 0,
      zPosition: 4,
    },
  ],
  'AuxTel-ESS03': [
    {
      xPosition: 2,
      yPosition: 2,
      zPosition: 1,
    },
    {
      xPosition: 2,
      yPosition: 2,
      zPosition: 2,
    },
    {
      xPosition: 2,
      yPosition: 2,
      zPosition: 3,
    },
    {
      xPosition: 2,
      yPosition: 2,
      zPosition: 4,
    },
    {
      xPosition: 2,
      yPosition: 2,
      zPosition: 5,
    },
  ],
  'MTDome-ESS01': [
    {
      xPosition: 3.2,
      yPosition: 3.2,
      zPosition: 0,
    },
  ],
  'MTDome-ESS02': [
    {
      xPosition: 13.2,
      yPosition: 3.2,
      zPosition: 3,
    },
  ],
  'MTDome-ESS03': [
    {
      xPosition: 5.2,
      yPosition: 3.2,
      zPosition: 6,
    },
  ],
};
