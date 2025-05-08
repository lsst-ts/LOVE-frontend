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
import { VALUE_TYPES } from 'Constants';

// Scripts empty schema value
// When SAL scripts doesn't have a schema the following value is published instead
export const EMPTY_SCHEMA = '# empty schema';

// SAL parameters
export const TOPIC_TIMESTAMP_ATTRIBUTE = 'private_sndStamp';

// Subpath
export const SUBPATH = process.env.PUBLIC_URL ?? '';

// Commands Configurations
export const hasCommandPrivileges = true;

// Time rate for polling external APIs
export const POLLING_RATE_MS = 10000;

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
export const JIRA_TICKETS_BASE_URL = 'https://rubinobs.atlassian.net/browse';

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

// URL for TimesSquare Night Report > Obs tickets report
// ready to be used by replacing the {DAY} with the desired date in 'YYYY-MM-DD' format
export const TIMES_SQUARE_OBS_TICKETS_REPORT_URL =
  'https://usdf-rsp-dev.slac.stanford.edu/times-square/github/lsst-sqre/times-square-usdf/\
night-reports/obs-tickets?start={DAY}&duration=1&ts_hide_code=1';

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
/***************************Mirrors configurations****************************/
/*****************************************************************************/

export const mirrorsForceGradientcolors = [
  '#2c7bb6',
  '#00a6ca',
  '#00ccbc',
  '#90eb9d',
  '#ffff8c',
  '#f9d057',
  '#f29e2e',
  '#e76818',
  '#d7191c',
];

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
    min: 0,
    max: 90,
  },
  azimuth: {
    min: -270,
    max: 270,
  },
};

export const ATPneumaticsLimits = {
  mainAirSourcePressure: {
    /* Measured in Pa */
    min: 275790,
    max: 413000,
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

export const ALARM_SOUND_THROTLING_TIME_MS = 30000;

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

export const OLE_DEFAULT_SYSTEMS_FILTER_OPTION = 'All systems';

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

/**
 * The following constants:
 * OLE_JIRA_COMPONENTS, OLE_JIRA_PRIMARY_SOFTWARE_COMPONENTS and OLE_JIRA_PRIMARY_HARDWARE_COMPONENTS
 * are used to map the values of the fields in the JIRA OBS project to the values used in the LOVE frontend.
 * References (urls) are provided to get the full list of options for each field using the JIRA REST API.
 * Some endpoints will need authentication on the rubinobs.atlassian.net site.
 * For details on how to use the JIRA REST API, see:
 * - https://developer.atlassian.com/cloud/jira/platform/rest/v3
 * - https://developer.atlassian.com/cloud/jira/platform/basic-auth-for-rest-apis/
 */

/**
 * jira OBS project components field
 * See https://rubinobs.atlassian.net/rest/api/latest/project/OBS
 * for the full list of options
 **/
export const OLE_JIRA_COMPONENTS = {
  ATDome: 11586,
  ATMCS: 11587,
  AuxTel: 11588,
  Calibrations: 11589,
  DIMM: 11590,
  'Environmental Monitoring Systems': 11591,
  Facilities: 11592,
  Facility: 11593,
  Hardware: 11594,
  'Hardware: ATSpectrograph': 11595,
  'Hardware: LATISS': 11596,
  'Hardware: MCS': 11597,
  Infrastructure: 11598,
  'IT Infrastructure': 11599,
  Kubernetes: 11600,
  LOVE: 11601,
  MainTel: 11602,
  MTMount: 11603,
  'Observer Remark': 11604,
  Other: 11605,
  RubinTV: 11606,
  SALScript: 11607,
  Scheduler: 11608,
  ScriptQueue: 11609,
  'Software: Data Production': 11610,
  'Software: LATISS': 11611,
  'Software: Telescope': 11612,
  TCS: 11613,
  Unknown: 11614,
};

/**
 * jira OBS project customfield_10107
 * See https://rubinobs.atlassian.net/rest/api/latest/field/customfield_10107/context/10246/option
 * for the full list of options
 **/
export const OLE_JIRA_PRIMARY_SOFTWARE_COMPONENTS = {
  None: -1,
  'CSC level': 10821,
  'Component Level (EUI)': 10820,
  Visualization: 10826,
  Analysis: 10818,
  Other: 10822,
  'Camera Control Software': 10819,
  TMA_CSC: 10823,
  TMA_EUI: 10824,
  TMA_HDD: 10825,
};

/**
 * jira OBS project customfield_10196
 * See https://rubinobs.atlassian.net/rest/api/latest/field/customfield_10196/context/10368/option
 * for the full list of options
 **/
export const OLE_JIRA_PRIMARY_HARDWARE_COMPONENTS = {
  None: -1,
  Mount: 11041,
  Rotator: 11042,
  Hexapod: 11043,
  M2: 11044,
  'Science Cameras': 11045,
  M1M3: 11046,
  Dome: 11047,
  Utilities: 11048,
  Calibration: 11049,
  Other: 11050,
};

/**
 * jira OBS project customfield_10476
 * See https://rubinobs.atlassian.net/rest/api/latest/app/field/customfield_10476/context/configuration
 * for the full list of options
 **/
export const OLE_OBS_SYSTEMS = {
  Simonyi: {
    id: '0',
    children: ['15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27'],
  },
  LSSTCam: {
    id: '29',
    children: ['30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44'],
  },
  ComCam: {
    id: '3',
    children: ['45', '46', '47', '48', '49', '50', '51', '52', '130'],
  },
  'Simonyi Calibration': {
    id: '4',
    children: ['53', '54', '55', '56', '57', '58', '59', '129'],
  },
  AuxTel: {
    id: '1',
    children: ['60', '61', '62', '63', '64', '430', '128'],
  },
  LATISS: {
    id: '5',
    children: ['65', '66', '67', '68', '69', '70', '127'],
  },
  'AuxTel Calibration': {
    id: '6',
    children: ['71', '72', '73', '74', '75', '76', '77', '126'],
  },
  'Control and Monitoring Software': {
    id: '8',
    children: ['560', '78', '79', '80', '81', '82', '83', '84', '85', '86', '125'],
  },
  'Data Management': {
    id: '10',
    children: ['88', '89', '124'],
  },
  Facilities: {
    id: '11',
    children: ['91', '92', '93', '94', '95', '96', '97', '98', '99', '100', '101', '123'],
  },
  'IT Infrastructure': {
    id: '12',
    children: ['103', '104', '105', '106', '107', '122'],
  },
  'Environmental Awareness Systems': {
    id: '13',
    children: ['109', '110', '111', '112', '113', '114', '115', '116', '117', '118', '119', '120', '121'],
    Other: {
      id: '14',
    },
  },
};

export const OLE_OBS_SUBSYSTEMS = {
  /** Simonyi System */
  TMA: {
    id: '15',
    children: [
      '131',
      '132',
      '133',
      '134',
      '135',
      '136',
      '137',
      '138',
      '139',
      '140',
      '141',
      '142',
      '143',
      '144',
      '145',
      '146',
      '147',
      '148',
      '149',
      '150',
      '151',
      '152',
      '153',
      '154',
      '155',
      '156',
    ],
  },
  'TMA Thermal System': {
    id: '16',
    children: ['157', '158', '159', '160', '161', '162', '163', '164', '165'],
  },
  'S: Dome': {
    id: '17',
    children: ['167', '168', '169', '170', '171', '172', '173', '174', '175', '176', '177', '178', '179', '180'],
  },
  'M1M3 Support System': {
    id: '18',
    children: ['182', '183', '184', '185', '186', '187', '188', '189', '190', '191', '192', '193'],
  },
  'M1M3 Thermal System': {
    id: '19',
    children: ['194', '195', '196', '197', '198', '199'],
  },
  'M2 Systems': {
    id: '20',
    children: ['200', '201', '202', '203', '204', '205', '206', '207'],
  },
  Rotator: {
    id: '21',
    children: ['208', '209', '210', '211', '212'],
  },
  Hexapods: {
    id: '22',
    children: ['214', '215', '216', '217', '218', '219', '220', '221', '222', '223'],
  },
  'Star Trackers': {
    id: '23',
    children: [
      '225',
      '226',
      '227',
      '228',
      '229',
      '230',
      '231',
      '232',
      '233',
      '234',
      '235',
      '236',
      '237',
      '238',
      '239',
      '240',
    ],
  },
  'S: OCS': {
    id: '24',
    children: ['241', '242', '243', '244', '245', '246'],
  },
  'Cable Wraps': {
    id: '25',
    children: ['248', '249', '250', '251', '252', '253', '254', '255'],
  },
  OSS: {
    id: '26',
    children: ['257', '259', '260', '261', '262', '263', '264'],
  },
  'Laser Tracker': {
    id: '27',
    children: ['266', '267', '268', '270', '271'],
  },
  /** LSSTCam System */
  'LC: Focal Plane': {
    id: '30',
    children: ['272', '273', '274', '275', '276', '277'],
  },
  'Image Handlers': {
    id: '31',
    children: ['279', '280'],
  },
  Rebpower: {
    id: '32',
    children: ['281'],
  },
  Shutter: {
    id: '33',
    children: ['282', '283'],
  },
  'Filter Exchange': {
    id: '34',
    children: ['285', '286', '287'],
  },
  'Vacuum Systems': {
    id: '35',
    children: ['289', '290', '291', '292', '293', '296', '297', '298'],
  },
  Quadbox: {
    id: '36',
    children: ['299', '300', '301', '302', '303', '304', '305'],
  },
  'LC: Utility Trunk': {
    id: '37',
    children: ['307', '308', '311'],
  },
  'Cryo Refrigeration': {
    id: '38',
    children: ['313', '314', '315', '317', '318', '319'],
  },
  'PCS Refrigerations': {
    id: '39',
    children: ['321', '322'],
  },
  'Camera Thermal System': {
    id: '40',
    children: ['324', '325', '326', '327'],
  },
  'Master Protection Module': {
    id: '41',
  },
  'LC: Computing': {
    id: '42',
    children: ['329', '330', '331', '332', '333', '334', '335', '336', '337', '338', '339'],
  },
  'Web Services': {
    id: '43',
    children: ['341', '342'],
  },
  'LC: Other': {
    id: '44',
  },
  /** ComCam System */
  'CC: Focal Plane': {
    id: '45',
    children: ['343', '344', '345', '346', '347'],
  },
  'Pathfinder Cryo System': {
    id: '46',
    children: ['348', '349', '350'],
  },
  'ComCam Vacuum System': {
    id: '47',
    children: ['351', '352', '353', '354', '355', '356'],
  },
  'Pathfinder Vacuum System': {
    id: '48',
    children: ['357', '358', '359', '360', '361', '362'],
  },
  'CC: Optical System': {
    id: '49',
    children: ['363', '364', '365', '366', '367'],
  },
  'CC: Utility Trunk': {
    id: '50',
    children: ['368', '369', '370', '371'],
  },
  'CC: Software': {
    id: '51',
    children: ['372', '373', '374', '375', '376', '377', '378'],
  },
  'CC: Computing': {
    id: '52',
    children: ['380', '381', '382', '383', '384', '385', '386', '387', '388'],
  },
  'CC: Other': {
    id: '130',
  },
  /** Simonyi Calibration System */
  'Collimated Beam Projector': {
    id: '53',
  },
  'Flat Field Projector': {
    id: '54',
    children: ['389', '390'],
  },
  Reflector: {
    id: '55',
  },
  'Tunable Laser': {
    id: '56',
    children: ['391', '392'],
  },
  'SC: Fiber Spectrograph': {
    id: '57',
    children: ['393', '394'],
  },
  'SC: Electrometer': {
    id: '58',
    children: ['395', '397', '396'],
  },
  'Flat Field Screen': {
    id: '59',
  },
  'SC: Other': {
    id: '129',
  },
  /** AuxTel System */
  Mount: {
    id: '60',
    children: ['398', '399', '400', '401', '402', '403', '404', '405'],
  },
  'AT: Dome': {
    id: '61',
    children: ['406', '407', '408', '409', '410', '411', '412', '414'],
  },
  'M1 Systems': {
    id: '62',
    children: ['415', '416', '417', '418', '419', '420', '421'],
  },
  'M2 Systems': {
    id: '63',
    children: ['422', '423', '424', '425'],
  },
  'M3 Systems': {
    id: '64',
    children: ['426', '427'],
  },
  'AT: OCS': {
    id: '430',
    children: ['432', '433', '434', '435', '436', '437', '438'],
  },
  'AT: Other': {
    id: '128',
  },
  /** LATISS System */
  'L: Focal Plane': {
    id: '65',
    children: ['439', '440'],
  },
  'Vacuum System': {
    id: '66',
    children: ['441', '442'],
  },
  Refrigeration: {
    id: '67',
    children: ['443'],
  },
  'L: Optical System': {
    id: '68',
    children: ['444', '445', '446', '447', '448', '449', '450'],
  },
  'L: Software': {
    id: '69',
    children: ['451', '452', '453'],
  },
  'L: Computing': {
    id: '70',
    children: ['454'],
  },
  'L: Other': {
    id: '127',
  },
  /** AuxTel Calibration System */
  'ATC: Optical System': {
    id: '71',
    children: ['455', '456'],
  },
  'White Light': {
    id: '72',
    children: ['458', '459'],
  },
  Monochromator: {
    id: '73',
    children: ['460', '461'],
  },
  'ATC: Electrometer': {
    id: '74',
    children: ['463', '464'],
  },
  'ATC: Fiber Spectrograph': {
    id: '75',
    children: ['466', '467', '468'],
  },
  MOSS: {
    id: '76',
  },
  'Electronics Cabinet': {
    id: '77',
  },
  'ATC: Other': {
    id: '126',
  },
  /** Control and Monitoring Software System */
  Middleware: {
    id: '560',
  },
  LOVE: {
    id: '78',
  },
  Scheduler: {
    id: '79',
    children: ['469', '470', '471'],
  },
  'Script Queue': {
    id: '80',
    children: ['472', '473', '474'],
  },
  'SAL Scripts': {
    id: '81',
    children: ['475', '476', '477'],
  },
  Nublado: {
    id: '82',
  },
  Chronograf: {
    id: '83',
  },
  'CCS Tools': {
    id: '84',
  },
  RubinTV: {
    id: '85',
  },
  Grafana: {
    id: '86',
  },
  'CMS: Other': {
    id: '125',
  },
  /** Data Management System */
  Pipelines: {
    id: '88',
    children: ['478', '479'],
  },
  'Data Transfer': {
    id: '89',
    children: ['481', '482', '483', '484'],
  },
  'DT: Other': {
    id: '124',
  },
  /** Facilities System */
  'Interlock Systems': {
    id: '91',
    children: ['485', '486', '487', '488', '489', '490', '491', '492', '493', '494'],
  },
  'Air Compressors': {
    id: '92',
    children: ['495', '496', '497', '498', '499'],
  },
  'Commercial Power': {
    id: '93',
    children: ['500', '501'],
  },
  Generators: {
    id: '94',
    children: ['502', '503', '504'],
  },
  'Electrical Power Monitor': {
    id: '95',
    children: ['505'],
  },
  UPSs: {
    id: '96',
    children: ['507', '508', '509'],
  },
  'Main Service Building WIFI Network': {
    id: '97',
    children: ['510'],
  },
  'Environmental Control System': {
    id: '98',
    children: ['511', '512', '513', '514', '515', '516', '518', '519', '520', '521', '522'],
  },
  'Summit Lodging': {
    id: '99',
    children: ['524', '525'],
  },
  'Summit Logistics': {
    id: '100',
    children: ['527', '528', '529', '530', '531', '532', '533', '534', '535', '536'],
  },
  PDUs: {
    id: '101',
    children: ['537', '538', '539', '540', '541', '542', '543'],
  },
  'F: Other': {
    id: '123',
  },
  /** IT Infrastructure System */
  Network: {
    id: '103',
    children: ['544', '545', '546', '547', '548'],
  },
  Storage: {
    id: '104',
    children: ['549', '550'],
  },
  Infrastructure: {
    id: '105',
    children: ['552', '553', '554', '555'],
  },
  'Control Room Workstations': {
    id: '106',
    children: ['557', '558', '559'],
  },
  'Accounts and Access': {
    id: '107',
  },
  'IT: Other': {
    id: '122',
  },
  /** Environmental Awareness Systems System */
  'DIMM 1': {
    id: '109',
  },
  'DIMM 2': {
    id: '110',
  },
  AllSkyCam: {
    id: '111',
  },
  'Weather Station': {
    id: '112',
  },
  'Weather Forecast': {
    id: '113',
  },
  EAS: {
    id: '114',
  },
  ESS: {
    id: '115',
  },
  'Vibration Monitoring System': {
    id: '116',
  },
  'Earthquake Detection System': {
    id: '117',
  },
  'Fire Alert System': {
    id: '118',
  },
  'NVR Cameras': {
    id: '119',
  },
  'Remote Microphone': {
    id: '120',
  },
  'EAS: Other': {
    id: '121',
  },
};

export const OLE_OBS_SUBSYSTEMS_COMPONENTS = {
  /** TMA Subsystem */
  'TMA El Drives': {
    id: '131',
  },
  'TMA Az Drives': {
    id: '132',
  },
  'TMA Az Encoders': {
    id: '133',
  },
  'TMA El Encoders': {
    id: '134',
  },
  'TMA Locking Pins': {
    id: '135',
  },
  'TMA Mirror Covers': {
    id: '136',
  },
  'TMA Capacitor Banks/Power Supply': {
    id: '137',
  },
  'TMA El Brakes': {
    id: '138',
  },
  'TMA Az Brakes': {
    id: '139',
  },
  'TMA El Limit Switches': {
    id: '140',
  },
  'TMA Az Limit Switches': {
    id: '141',
  },
  'TMA Topple Blocks': {
    id: '142',
  },
  'TMA Bosch Controller': {
    id: '143',
  },
  'TMA Ethercat Drive Line': {
    id: '144',
  },
  'TMA Ethercat I/O Line': {
    id: '145',
  },
  'TMA PXI': {
    id: '146',
  },
  'TMA Axes PXI': {
    id: '147',
  },
  'TMA Aux PXI': {
    id: '148',
  },
  'TMA Azimuth Cable Wrap': {
    id: '149',
  },
  'TMA Az Cable Wrap Drives': {
    id: '150',
  },
  'TMA Az Cable Wrap Limit Switches': {
    id: '151',
  },
  'TMA El Cable Wrap': {
    id: '152',
  },
  'TMA Deployable Platforms': {
    id: '153',
  },
  'MTMount CSC': {
    id: '154',
  },
  'TMA EUI': {
    id: '155',
  },
  'TMA Control Software': {
    id: '156',
  },
  /** TMA Thermal System Subsystem */
  'TMA El Motor Thermal Control': {
    id: '157',
  },
  'TMA Az Motor Thermal Control': {
    id: '158',
  },
  'TMA Main Cabinet Thermal Control': {
    id: '159',
  },
  'TMA Aux Cabinets Thermal Control': {
    id: '160',
  },
  'TMA Top End Thermal Control': {
    id: '161',
  },
  'Top End M2 Cabinet': {
    id: '162',
  },
  'Top End Rotator Cabinet': {
    id: '163',
  },
  'Top End CamHex Cabinet': {
    id: '164',
  },
  'Top End Thermal Control Cabinet': {
    id: '165',
  },
  /** Dome Subsystem */
  'Dome Aperture Shutter': {
    id: '167',
  },
  'Dome Light-Wind Screen': {
    id: '168',
  },
  'Dome Louvers': {
    id: '169',
  },
  'Dome Capacitor Bank': {
    id: '170',
  },
  'Dome Az Drives': {
    id: '171',
  },
  'Dome Az Encoder': {
    id: '172',
  },
  'Dome Az Locking Pin': {
    id: '173',
  },
  'Dome Aperture Shutter Locking Pins': {
    id: '174',
  },
  'Dome Rear Access Door': {
    id: '175',
  },
  'Dome Electronics': {
    id: '176',
  },
  'MTDome CSC': {
    id: '177',
  },
  'MTDomeTrajectory CSC': {
    id: '178',
  },
  'Dome EUI': {
    id: '179',
  },
  'Dome Wifi Network': {
    id: '180',
  },
  /** M1M3 Support System Subsystem */
  'MTM1M3 CSC': {
    id: '182',
  },
  'M1M3 EUI': {
    id: '183',
  },
  'M1M3 Low-level Control Software (cRIO)': {
    id: '184',
  },
  'M1M3 Actuators': {
    id: '185',
  },
  'M1M3 Hardpoints': {
    id: '186',
  },
  'M1M3 Electronics': {
    id: '187',
  },
  'M1M3 Coating': {
    id: '188',
  },
  'M1M3 ILCs': {
    id: '189',
  },
  'M1M3 Air Supply': {
    id: '190',
  },
  'M1M3 IMS': {
    id: '191',
  },
  'M1M3 DC Accelerometers': {
    id: '192',
  },
  'M1M3 Gyroscope Sensors': {
    id: '193',
  },
  /** M1M3 Thermal System Subsystem */
  'M1M3TS Fan Coil Units': {
    id: '194',
  },
  'M1M3TS Fans': {
    id: '195',
  },
  'M1M3TS Heaters': {
    id: '196',
  },
  'M1M3TS CSC': {
    id: '197',
  },
  'M1M3TS Glycol Mixing Control': {
    id: '198',
  },
  'M1M3TS Fan Coil Unit ILCs': {
    id: '199',
  },
  /** M2 Systems Subsystem */
  'M2 Axial Actuators': {
    id: '200',
  },
  'M2 Tangent Links': {
    id: '201',
  },
  'M2 Electronics': {
    id: '202',
  },
  'M2 Coating': {
    id: '203',
  },
  'M2 ILCs': {
    id: '204',
  },
  'MTM2 CSC': {
    id: '205',
  },
  'M2 EUI': {
    id: '206',
  },
  'M2 Control Software': {
    id: '207',
  },
  /** Rotator Subsystem */
  'Rotator Drives': {
    id: '208',
  },
  'Rotator Electronics': {
    id: '209',
  },
  'MTRotator CSC': {
    id: '210',
  },
  'MTRotator EUI': {
    id: '211',
  },
  'MTRotator Control Software': {
    id: '212',
  },
  /** Hexapods Subsystem */
  'CamHex Actuators': {
    id: '214',
  },
  'M2Hex Actuators': {
    id: '215',
  },
  'CamHex Electronics': {
    id: '216',
  },
  'M2Hex Electronics': {
    id: '217',
  },
  'MTHexapod:1 CSC': {
    id: '218',
  },
  'MTHexapod:2 CSC': {
    id: '219',
  },
  'CamHex EUI': {
    id: '220',
  },
  'M2Hex EUI': {
    id: '221',
  },
  'CamHex Control Software': {
    id: '222',
  },
  'M2Hex Control Software': {
    id: '223',
  },
  /** Star Trackers Subsystem */
  'WideTracker Sensor': {
    id: '225',
  },
  'WideTracker Optics': {
    id: '226',
  },
  'GenericCamera.101 CSC': {
    id: '227',
  },
  'GCHeaderService.101 CSC': {
    id: '228',
  },
  'WideTracker Control Software': {
    id: '229',
  },
  'NarrowTracker Sensor': {
    id: '230',
  },
  'NarrowTracker Optics': {
    id: '231',
  },
  'GenericCamera.102 CSC': {
    id: '232',
  },
  'GCHeaderService.102 CSC': {
    id: '233',
  },
  'NarrowTracker Control Software': {
    id: '234',
  },
  'FastTracker Sensor': {
    id: '235',
  },
  'FastTracker Optics': {
    id: '236',
  },
  'FastTracker Focuser Unit': {
    id: '237',
  },
  'GenericCamera.103 CSC': {
    id: '238',
  },
  'GCHeaderService.103 CSC': {
    id: '239',
  },
  'FastTracker Control Software': {
    id: '240',
  },
  /** OCS Subsystem */
  'MTPtg CSC': {
    id: '241',
  },
  'MTAOS CSC': {
    id: '242',
  },
  'Simonyi SAL Scripts': {
    id: '243',
  },
  'Simonyi ScriptQueue': {
    id: '244',
  },
  'Simonyi Scheduler': {
    id: '245',
  },
  'Simonyi OCPS': {
    id: '246',
  },
  /** Cable Wraps Subsystem */
  'TMA Az Drape': {
    id: '248',
  },
  'TMA El Wrap': {
    id: '249',
  },
  CCW: {
    id: '250',
  },
  'CCW Drive': {
    id: '251',
  },
  'CCW Limit Switches': {
    id: '252',
  },
  'CCW-Camera Limit Switch (pull-string)': {
    id: '253',
  },
  'CCW Control Software': {
    id: '254',
  },
  'Pancake Cable Wrap Rotator': {
    id: '255',
  },
  /** OSS Subsystem */
  'OSS Sensors (Pressure, Flow, Temperature)': {
    id: '257',
  },
  'OSS Pumps (main, booster)': {
    id: '259',
  },
  'OSS Circulation System': {
    id: '260',
  },
  'OSS Storage Tank': {
    id: '261',
  },
  'Az Brake System': {
    id: '262',
  },
  'El Brake System': {
    id: '263',
  },
  'OSS Cooling System': {
    id: '264',
  },
  /** Laser Tracker Subsystem */
  'LaserTracker M2 SMR': {
    id: '266',
  },
  'LaserTracker Camera SMRs': {
    id: '267',
  },
  'LaserTracker CSC': {
    id: '268',
  },
  'LaserTracker Power Supply': {
    id: '270',
  },
  'LaserTracker T2SA': {
    id: '271',
  },
  /** Focal Plane Subsystem */
  'LSSTCam Science Sequencer': {
    id: '272',
  },
  'LSSTCam Guider Sequencer': {
    id: '273',
  },
  'LSSTCam ITL Voltage': {
    id: '274',
  },
  'LSSTCam E2V Voltage': {
    id: '275',
  },
  'LSSTCam DAQ': {
    id: '276',
  },
  'LSSTCam RxxRebySzz': {
    id: '277',
  },
  /** Image Handlers Subsystem */
  'LSSTCam fits generation': {
    id: '279',
  },
  'LSSTCam fits header': {
    id: '280',
  },
  /** Rebpower Subsystem */
  'LSSTCam RebPS/Pxx': {
    id: '281',
  },
  /** Shutter Subsystem */
  'LSSTCam Shutter1': {
    id: '282',
  },
  'LSSTCam Shutter2': {
    id: '283',
  },
  /** Filter Exchange Subsystem */
  'LSSTCam Autochanger[12]': {
    id: '285',
  },
  'LSSTCam Carousel': {
    id: '286',
  },
  'LSSTCam Loader[12]': {
    id: '287',
  },
  /** Vacuum Systems Subsystem */
  'LSSTCam Cryostat Turbo Pump': {
    id: '289',
  },
  'LSSTCam Cryostat Pump Cart': {
    id: '290',
  },
  'LSSTCam Cryostat Ion Pump': {
    id: '291',
  },
  'LSSTCam Cryostat Valves': {
    id: '292',
  },
  'LSSTCam Hex (Head Exchanger Vacuum) Turbo Pump': {
    id: '293',
  },
  'LSSTCam Hex Pump Cart': {
    id: '296',
  },
  'LSSTCam Hex Ion Pump': {
    id: '297',
  },
  'LSSTCam Hex Valves': {
    id: '298',
  },
  /** Quadbox Subsystem */
  'LSSTCam BFR': {
    id: '299',
  },
  'LSSTCam REB Bulk PS': {
    id: '300',
  },
  'LSSTCam HCUs': {
    id: '301',
  },
  'LSTCam 5V Clean PDU': {
    id: '302',
  },
  'LSSTCam 48V Dirty PDU': {
    id: '303',
  },
  'LSSTCam 24V Clean PDU': {
    id: '304',
  },
  'LSSTCam 24V Dirty PDU': {
    id: '305',
  },
  /** Utility Trunk Subsystem */
  'LSSTCam UT Cooling Control': {
    id: '307',
  },
  'LSSTCam MPC Control': {
    id: '308',
  },
  'LSSTCam VPC Control': {
    id: '311',
  },
  /** Cryo Refrigeration Subsystem */
  'LSSTCam Cryo1': {
    id: '313',
  },
  'LSSTCam Cryo2': {
    id: '314',
  },
  'LSSTCam Cryo3': {
    id: '315',
  },
  'LSSTCam Cryo4': {
    id: '317',
  },
  'LSSTCam Cryo5': {
    id: '318',
  },
  'LSSTCam Cryo6': {
    id: '319',
  },
  /** PCS Refrigerations Subsystem */
  'LSSTCam Chiller 1': {
    id: '321',
  },
  'LSSTCam Chiller 2': {
    id: '322',
  },
  /** Camera Thermal System Subsystem */
  'LSSTCam Cold +Y': {
    id: '324',
  },
  'LSSTCam Cold Center': {
    id: '325',
  },
  'LSSTCam Cold -Y ': {
    id: '326',
  },
  'LSSTCam Cryo': {
    id: '327',
  },
  /** Computing Subsystem */
  'lsstcam-db01': {
    id: '329',
  },
  'lssctam-dcxx': {
    id: '330',
  },
  'lsstcam-mcm': {
    id: '331',
  },
  'lsstcam-fcs': {
    id: '332',
  },
  'lsstcam-pcs01': {
    id: '333',
  },
  'lsstcam-pcs02': {
    id: '334',
  },
  'lsstcam-quad': {
    id: '335',
  },
  'lsstcam-rebps': {
    id: '336',
  },
  'lsstcam-shutter01': {
    id: '337',
  },
  'lsstcam-shutter02': {
    id: '338',
  },
  'lsstcam-vac': {
    id: '339',
  },
  /** Web Services Subsystem */
  'Image Viewer': {
    id: '341',
  },
  'Trending Viewer': {
    id: '342',
  },
  /** Focal Plane Subsystem */
  'ComCam REB Electronics': {
    id: '343',
  },
  'ComCam REB Power Supply': {
    id: '344',
  },
  'ComCam High-Voltage Bias': {
    id: '345',
  },
  'ComCam Raft Sensor Assembly': {
    id: '346',
  },
  'ComCam CCD Temperature Control': {
    id: '347',
  },
  /** Pathfinder Cryo System Subsystem */
  'Pathfinder Cryo Compressors': {
    id: '348',
  },
  'Pathfinder Cryo Pressure Sensors': {
    id: '349',
  },
  'Pathfinder Cryo Glycol Circulation': {
    id: '350',
  },
  /** ComCam Vacuum System Subsystem */
  'ComCam Ion Pump': {
    id: '351',
  },
  'ComCam Turbo Pump': {
    id: '352',
  },
  'ComCam Roughing Pump': {
    id: '353',
  },
  'ComCam Cryotels': {
    id: '354',
  },
  'ComCam RTD Sensors': {
    id: '355',
  },
  'ComCam VQM Pressure Sensors': {
    id: '356',
  },
  /** Pathfinder Vacuum System Subsystem */
  'Pathfinder Ion Pump': {
    id: '357',
  },
  'Pathfinder Turbo Pump': {
    id: '358',
  },
  'Pathfinder Pump Cart': {
    id: '359',
  },
  'Pathfinder RTD Sensors': {
    id: '360',
  },
  'Pathfinder VQM Pressure Sensors': {
    id: '361',
  },
  'Pathfinder Heat Exchangers': {
    id: '362',
  },
  /** Optical System Subsystem */
  'ComCam Lenses': {
    id: '363',
  },
  'ComCam Filters': {
    id: '364',
  },
  'ComCam L3 Air Knife': {
    id: '365',
  },
  'ComCam L1/L2 Positive Pressure System': {
    id: '366',
  },
  'ComCam Shutter': {
    id: '367',
  },
  /** Utility Trunk Subsystem */
  'ComCam BFR"': {
    id: '368',
  },
  'ComCam PDUs': {
    id: '369',
  },
  'ComCam PLC Protection Modules': {
    id: '370',
  },
  'ComCam Bulk Purge Control System (Temperature, Tachometer, Flow)': {
    id: '371',
  },
  /** Software Subsystem */
  // ["372", "373", "374", "375", "376", "377", "378"]
  'CCS Console': {
    id: '372',
  },
  'CCS Database': {
    id: '373',
  },
  'CCS Subsystems': {
    id: '374',
  },
  'CCS Visualization': {
    id: '375',
  },
  'ComCam Imaging Mode': {
    id: '376',
  },
  'ComCam Guider Mode': {
    id: '377',
  },
  'ComCam Stuttered Mode': {
    id: '378',
  },
  /** Computing Subsystem */
  'ComCam Data Ingestion': {
    id: '380',
  },
  'ComCam Network Transfer': {
    id: '381',
  },
  'CCCamera CSC': {
    id: '382',
  },
  'C: CCOODS CSC': {
    id: '383',
  },
  'CCHeaderService CSC': {
    id: '384',
  },
  'ComCam HCUs': {
    id: '385',
  },
  'ComCam Servers': {
    id: '386',
  },
  'ComCam Network': {
    id: '387',
  },
  'ComCam Data Trending': {
    id: '388',
  },
  /** Flat Field Projector Subsystem */
  LEDProjector: {
    id: '389',
  },
  'LinearStage.101 (Zaber)': {
    id: '390',
  },
  /** Tunable Laser Subsystem */
  TunableLaser: {
    id: '391',
  },
  interlock_monitor: {
    id: '392',
  },
  /** Fiber Spectrograph Subsystem */
  // ["393", "394"]
  'FiberSpectrograph.1 (blue)': {
    id: '393',
  },
  'FiberSpectrograph.2 (red)': {
    id: '394',
  },
  /** Electrometer Subsystem */
  'Electrometer.101': {
    id: '395',
  },
  'Electrometer.103': {
    id: '396',
  },
  'Electrometer.102': {
    id: '397',
  },
  /** Mount Subsystem */
  'AT El Drive': {
    id: '398',
  },
  'AT Az Drive': {
    id: '399',
  },
  'AT El Encoder': {
    id: '400',
  },
  'AT El Limit Switch': {
    id: '401',
  },
  'AT Az Limit Switch': {
    id: '402',
  },
  'AT Az Encoder': {
    id: '403',
  },
  'AT Mount EUI': {
    id: '404',
  },
  'M: ATMCS CSC': {
    id: '405',
  },
  /** Dome Subsystem */
  'AT Upper Shutter': {
    id: '406',
  },
  'AT Lower Shutter': {
    id: '407',
  },
  'AT Vent Gates': {
    id: '408',
  },
  'AT Exhaust Fan': {
    id: '409',
  },
  'AT Azimuth Drives': {
    id: '410',
  },
  'AT Dome EUI': {
    id: '411',
  },
  'ATDome CSC': {
    id: '412',
  },
  'ATDomeTrajectory CSC': {
    id: '414',
  },
  /** M1 Systems Subsystem */
  'AT M1 Mirror Covers': {
    id: '415',
  },
  'AT M1 Support System': {
    id: '416',
  },
  'AT M1 Coating': {
    id: '417',
  },
  'AT M1 Actuators': {
    id: '418',
  },
  'AT M1 Hardpoints': {
    id: '419',
  },
  'M1: ATAOS CSC': {
    id: '420',
  },
  'ATPneumatics CSC': {
    id: '421',
  },
  /** M2 Systems Subsystem */
  'AT Hexapod': {
    id: '422',
  },
  'AT M2 Coating': {
    id: '423',
  },
  'M2: ATAOS CSC': {
    id: '424',
  },
  'ATHexapod CSC': {
    id: '425',
  },
  /** M3 Systems Subsystem */
  'AT Nasmyth 1': {
    id: '426',
  },
  'AT Nasmyth 2': {
    id: '427',
  },
  /** OCS Subsystem */
  'ATPtg CSC': {
    id: '432',
  },
  'OCS: ATAOS CSC': {
    id: '433',
  },
  'OCS: ATMCS CSC': {
    id: '434',
  },
  'AT SAL Scripts': {
    id: '435',
  },
  'ATScriptQueue CSC': {
    id: '436',
  },
  'ATScheduler CSC': {
    id: '437',
  },
  'AT OCPS': {
    id: '438',
  },
  /** Focal Plane Subsystem */
  'FP: LATISS Shutter': {
    id: '439',
  },
  'LATISS Detector': {
    id: '440',
  },
  /** Vacuum System Subsystem */
  'LATISS Turbe Pump': {
    id: '441',
  },
  'LATISS Ion Pump': {
    id: '442',
  },
  /** Refrigeration Subsystem */
  'LATISS Cooling System': {
    id: '443',
  },
  /** Optical System Subsystem */
  'LATISS Filters': {
    id: '444',
  },
  'LATISS Gratings': {
    id: '445',
  },
  'OS: LATISS Shutter': {
    id: '446',
  },
  'LATISS Filter Exchanger': {
    id: '447',
  },
  'LATISS Filter Loader': {
    id: '448',
  },
  'LATISS Carousel': {
    id: '449',
  },
  'LATISS Rotator': {
    id: '450',
  },
  /** Software Subsystem */
  'ATCamera CSC': {
    id: '451',
  },
  'ATHeaderService CSC': {
    id: '452',
  },
  'ATSpectrograph CSC': {
    id: '453',
  },
  /** Computing Subsystem */
  'LATISS Network': {
    id: '454',
  },
  /** Optical System Subsystem */
  'Shutter System': {
    id: '455',
  },
  Lens: {
    id: '456',
  },
  /** White Light Subsystem */
  'White Light Source': {
    id: '458',
  },
  'ATWhiteLight CSC (includes chiller)': {
    id: '459',
  },
  /** Monochromator Subsystem */
  'AT Monochromator': {
    id: '460',
  },
  'ATMonochromator CSC': {
    id: '461',
  },
  /** Electrometer Subsystem */
  Electrometer: {
    id: '463',
  },
  'Electrometer.201 (CSC)': {
    id: '464',
  },
  /** Fiber Spectrograph Subsystem */
  FiberSpectrograph: {
    id: '466',
  },
  'FiberSpectrograph.3 CSC': {
    id: '467',
  },
  'Spectral Cal Lamp': {
    id: '468',
  },
  /** Scheduler Subsystem */
  'AT Scheduler CSC': {
    id: '469',
  },
  'Simonyi Scheduler CSC': {
    id: '470',
  },
  'OCS Scheduler CSC': {
    id: '471',
  },
  /** Script Queue Subsystem */
  'AT Script Queue': {
    id: '472',
  },
  'Simonyi Script Queue': {
    id: '473',
  },
  'OCS Script Queue': {
    id: '474',
  },
  /** SAL Scripts Subsystem */
  ts_standardscripts: {
    id: '475',
  },
  ts_externalscripts: {
    id: '476',
  },
  ts_observatory_control: {
    id: '477',
  },
  /** Pipelines Subsystem */
  'Rapid Analysis at Summit': {
    id: '478',
  },
  'Rapid Analysis at USDF': {
    id: '479',
  },
  /** Data Transfer Subsystem */
  'DT: Long Haul Network': {
    id: '481',
  },
  'ATOODS CSC': {
    id: '482',
  },
  'MTOODS CSC': {
    id: '483',
  },
  'DT: CCOODS CSC': {
    id: '484',
  },
  /** Interlock Systems Subsystem */
  'Global Interlock System': {
    id: '485',
  },
  'Simonyi IS': {
    id: '486',
  },
  'Dome IS': {
    id: '487',
  },
  'AuxTel IS': {
    id: '488',
  },
  'M1M3 IS': {
    id: '489',
  },
  'M2CAM IS': {
    id: '490',
  },
  'Simonyi ETPBs': {
    id: '491',
  },
  'Calibrations IS': {
    id: '492',
  },
  'GIS EUI': {
    id: '493',
  },
  'IS CSC': {
    id: '494',
  },
  /** Air Compressors Subsystem */
  'Main Air Compressor 1': {
    id: '495',
  },
  'Main Air Compressor 2': {
    id: '496',
  },
  'Auxiliary Air Compressor': {
    id: '497',
  },
  'AuxTel Air Compressor': {
    id: '498',
  },
  'Air Compressor CSC': {
    id: '499',
  },
  /** Commercial Power Subsystem */
  'Commercial Grid Transformer': {
    id: '500',
  },
  'Commercial Grid Power Lines': {
    id: '501',
  },
  /** Generators Subsystem */
  'Generator 1MWA': {
    id: '502',
  },
  'Generator 750kWA': {
    id: '503',
  },
  'Generator Transfer Switches': {
    id: '504',
  },
  /** Electrical Power Monitor Subsystem */
  'EPM CSC': {
    id: '505',
  },
  /** UPSs Subsystem */
  'Main UPS': {
    id: '507',
  },
  'AuxTel UPS': {
    id: '508',
  },
  'Computer Room UPS': {
    id: '509',
  },
  /** Main Service Building WIFI Network Subsystem */
  'Main Service Building Router': {
    id: '510',
  },
  /** Environmental Control System Subsystem */
  'Dome Air Handler Units': {
    id: '511',
  },
  'Clean/White Room Air Handler Units': {
    id: '512',
  },
  'Computer Room ACs (CRACs)': {
    id: '513',
  },
  'OSS Chillers': {
    id: '514',
  },
  'Ventilation Fans': {
    id: '515',
  },
  'Downdraft Fan': {
    id: '516',
  },
  'Glycol Chillers': {
    id: '518',
  },
  'Glycol Sensors (Pressure, Flow, Temperature)': {
    id: '519',
  },
  'Dynalene Chillers': {
    id: '520',
  },
  'Dynalene Lines': {
    id: '521',
  },
  'Dynalene Sensors (Pressure, Flow, Temperature)': {
    id: '522',
  },
  /** Summit Lodging Subsystem */
  'Hotel Rooms': {
    id: '524',
  },
  'Hotel Network': {
    id: '525',
  },
  /** Summit Logistics Subsystem */
  'Control Room': {
    id: '527',
  },
  'Offices L2': {
    id: '528',
  },
  'Office Network': {
    id: '529',
  },
  Bus: {
    id: '530',
  },
  Minibus: {
    id: '531',
  },
  Trucks: {
    id: '532',
  },
  'Emergency Radios': {
    id: '533',
  },
  Kitchen: {
    id: '534',
  },
  Bathrooms: {
    id: '535',
  },
  Coffee: {
    id: '536',
  },
  /** PDUs Subsystem */
  'ATMCS Cabinet PDU': {
    id: '537',
  },
  'AT Camera Cabinet PDU 1': {
    id: '538',
  },
  'AT Spectrograph Power Switch Cabinet PDU': {
    id: '539',
  },
  'AT Dome Main Control Box PDU': {
    id: '540',
  },
  'AT Illumintaion System PDU': {
    id: '541',
  },
  'LATISS PDU': {
    id: '542',
  },
  'Simonyi TEA PDU': {
    id: '543',
  },
  /** Network Subsystem */
  'Users Network': {
    id: '544',
  },
  'Control Network': {
    id: '545',
  },
  'Pixel Network': {
    id: '546',
  },
  Internet: {
    id: '547',
  },
  'N: Long Haul Network': {
    id: '548',
  },
  /** Storage Subsystem */
  'S: Summit ': {
    id: '549',
  },
  'S: Base': {
    id: '550',
  },
  /** Infrastructure Subsystem */
  Kubernetes: {
    id: '552',
  },
  'LSSTCam IT Infrastructure': {
    id: '553',
  },
  'AuxTel IT Infrastructure': {
    id: '554',
  },
  'Simonyi IT Infrastructure': {
    id: '555',
  },
  /** Control Room Workstations Subsystem */
  'CRW: Summit': {
    id: '557',
  },
  'CRW: Base': {
    id: '558',
  },
  Tucson: {
    id: '559',
  },
  Middleware: {
    id: '560',
  },
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
    LATISS: [
      { name: 'ATCamera', salindex: 0 },
      { name: 'ATOODS', salindex: 0 },
      { name: 'ATHeaderService', salindex: 0 },
      { name: 'ATSpectrograph', salindex: 0 },
    ],
    'Support & Monitoring': [{ name: 'PMD', salindex: 1 }],
    'Calibration Systems': [
      { name: 'ATMonochromator', salindex: 0 },
      { name: 'FiberSpectrograph', salindex: 3 },
      { name: 'ATWhiteLight', salindex: 0 },
      { name: 'Electrometer', salindex: 201 },
      { name: 'LinearStage', salindex: 1 },
      { name: 'LinearStage', salindex: 2 },
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
    'Support & Monitoring': [
      { name: 'MTAirCompressor', salindex: 1 },
      { name: 'MTAirCompressor', salindex: 2 },
      { name: 'LaserTracker', salindex: 1 },
    ],
    ComCam: [
      { name: 'CCCamera', salindex: 0 },
      { name: 'CCOODS', salindex: 0 },
      { name: 'CCHeaderService', salindex: 0 },
    ],
    'Star Tracker': [
      { name: 'GenericCamera', salindex: 101 },
      { name: 'GCHeaderService', salindex: 101 },
      { name: 'GenericCamera', salindex: 102 },
      { name: 'GCHeaderService', salindex: 102 },
      { name: 'GenericCamera', salindex: 103 },
      { name: 'GCHeaderService', salindex: 103 },
    ],
    'Calibration Systems': [
      { name: 'Electrometer', salindex: 1 },
      { name: 'TunableLaser', salindex: 0 },
    ],
  },
  Observatory: {
    HigherLevel: [
      { name: 'ScriptQueue', salindex: 1 },
      { name: 'ScriptQueue', salindex: 2 },
      { name: 'ScriptQueue', salindex: 3 },
      { name: 'Scheduler', salindex: 1 },
      { name: 'Scheduler', salindex: 2 },
      { name: 'Scheduler', salindex: 3 },
      { name: 'Watcher', salindex: 0 },
      { name: 'OCPS', salindex: 1 },
      { name: 'OCPS', salindex: 2 },
      { name: 'GIS', salindex: 2 },
    ],
    Environment: [
      { name: 'DIMM', salindex: 1 },
      { name: 'DIMM', salindex: 2 },
      { name: 'WeatherStation', salindex: 1 },
      { name: 'WeatherForecast', salindex: 0 },
      { name: 'HVAC', salindex: 0 },
      { name: 'ESS', salindex: 1 },
      { name: 'ESS', salindex: 101 },
      { name: 'ESS', salindex: 102 },
      { name: 'ESS', salindex: 103 },
      { name: 'ESS', salindex: 104 },
      { name: 'ESS', salindex: 105 },
      { name: 'ESS', salindex: 106 },
      { name: 'ESS', salindex: 107 },
      { name: 'ESS', salindex: 108 },
      { name: 'ESS', salindex: 201 },
      { name: 'ESS', salindex: 202 },
      { name: 'ESS', salindex: 203 },
      { name: 'ESS', salindex: 204 },
      { name: 'ESS', salindex: 205 },
      { name: 'ESS', salindex: 301 },
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
  { name: 'ATOODS', salindex: 0 },
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
  { name: 'CCOODS', salindex: 0 },
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
  5: 'WAITING TENSION',
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
  1: 'DISABLED',
  2: 'ENABLED',
  3: 'FAULT',
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
export const M1M3ActuatorForcesOnly = {
  appliedAccelerationForces: ['xForces', 'yForces', 'zForces'],
  appliedActiveOpticForces: ['zForces'],
  appliedAzimuthForces: ['xForces', 'yForces', 'zForces'],
  appliedBalanceForces: ['xForces', 'yForces', 'zForces'],
  appliedCylinderForces: ['primaryCylinderForces', 'secondaryCylinderForces'],
  appliedElevationForces: ['xForces', 'yForces', 'zForces'],
  appliedForces: ['xForces', 'yForces', 'zForces'],
  appliedOffsetForces: ['xForces', 'yForces', 'zForces'],
  appliedStaticForces: ['xForces', 'yForces', 'zForces'],
  appliedThermalForces: ['xForces', 'yForces', 'zForces'],
  appliedVelocityForces: ['xForces', 'yForces', 'zForces'],
  preclippedAccelerationForces: ['xForces', 'yForces', 'zForces'],
  preclippedActiveOpticForces: ['zForces'],
  preclippedAzimuthForces: ['xForces', 'yForces', 'zForces'],
  preclippedBalanceForces: ['xForces', 'yForces', 'zForces'],
  preclippedCylinderForces: ['primaryCylinderForces', 'secondaryCylinderForces'],
  preclippedElevationForces: ['xForces', 'yForces', 'zForces'],
  preclippedForces: ['xForces', 'yForces', 'zForces'],
  preclippedOffsetForces: ['xForces', 'yForces', 'zForces'],
  preclippedStaticForces: ['xForces', 'yForces', 'zForces'],
  preclippedThermalForces: ['xForces', 'yForces', 'zForces'],
  preclippedVelocityForces: ['xForces', 'yForces', 'zForces'],
  // Fix the following for parameters when convenient, to use its plural way
  // see: DM-47126
  faMeasuredForces: ['xForce', 'yForce', 'zForce', 'primaryCylinderForce', 'secondaryCylinderForce'],
};

export const M1M3ActuatorForces = {
  appliedAccelerationForces: ['xForces', 'yForces', 'zForces'],
  appliedActiveOpticForces: ['zForces'],
  appliedAzimuthForces: ['xForces', 'yForces', 'zForces'],
  appliedBalanceForces: ['xForces', 'yForces', 'zForces'],
  appliedCylinderForces: ['primaryCylinderForces', 'secondaryCylinderForces'],
  appliedElevationForces: ['xForces', 'yForces', 'zForces'],
  appliedForces: ['xForces', 'yForces', 'zForces'],
  appliedOffsetForces: ['xForces', 'yForces', 'zForces'],
  appliedStaticForces: ['xForces', 'yForces', 'zForces'],
  appliedThermalForces: ['xForces', 'yForces', 'zForces'],
  appliedVelocityForces: ['xForces', 'yForces', 'zForces'],
  preclippedAccelerationForces: ['xForces', 'yForces', 'zForces'],
  preclippedActiveOpticForces: ['zForces'],
  preclippedAzimuthForces: ['xForces', 'yForces', 'zForces'],
  preclippedBalanceForces: ['xForces', 'yForces', 'zForces'],
  preclippedCylinderForces: ['primaryCylinderForces', 'secondaryCylinderForces'],
  preclippedElevationForces: ['xForces', 'yForces', 'zForces'],
  preclippedForces: ['xForces', 'yForces', 'zForces'],
  preclippedOffsetForces: ['xForces', 'yForces', 'zForces'],
  preclippedStaticForces: ['xForces', 'yForces', 'zForces'],
  preclippedThermalForces: ['xForces', 'yForces', 'zForces'],
  preclippedVelocityForces: ['xForces', 'yForces', 'zForces'],
  // Fix the following for parameters when convenient, to use its plural way
  // see: DM-47126
  faMeasuredForces: ['xForce', 'yForce', 'zForce', 'primaryCylinderForce', 'secondaryCylinderForce'],
  faFollowingError: ['primaryCylinderFollowingError', 'secondaryCylinderFollowingError'],
  faRaisingState: ['waitXForceActuator', 'waitYForceActuator', 'waitZForceActuator'],
  // faInfo: [],
  // faIndices: [],
  // faSettings: [],
  faMainCalibrationInfo: [
    'mainPrimaryCylinderCoefficient',
    'mainPrimaryCylinderLoadCellOffset',
    'mainPrimaryCylinderLoadCellSensitivity',
    'mainSecondaryCylinderCoefficient',
    'mainSecondaryCylinderLoadCellOffset',
    'mainSecondaryCylinderLoadCellSensitivity',
    'mezzaninePrimaryCylinderGain',
    'mezzanineSecondaryCylinderGain',
  ],
  faBackupCalibrationInfo: [
    'backupPrimaryCylinderCoefficient',
    'backupPrimaryCylinderLoadCellOffset',
    'backupPrimaryCylinderLoadCellSensitivity',
    'backupSecondaryCylinderCoefficient',
    'backupSecondaryCylinderLoadCellOffset',
    'backupSecondaryCylinderLoadCellSensitivity',
  ],
  faState: ['ilcState'],
  faWarning: [
    'majorFault',
    'minorFault',
    'faultOverride',
    'mainCalibrationError',
    'backupCalibrationError',
    'mezzanineError',
    'mezzanineBootloaderActive',
    'uniqueIdCRCError',
    'applicationTypeMismatch',
    'applicationMissing',
    'oneWireMissing',
    'oneWire1Mismatch',
    'oneWire2Mismatch',
    'watchdogReset',
    'brownOut',
    'eventTrapReset',
    'ssrPowerFault',
    'auxPowerFault',
    'mezzaninePowerFault',
    'mezzanineCurrentAmp1Fault',
    'mezzanineCurrentAmp2Fault',
    'mezzanineUniqueIdCRCError',
    'mezzanineMainCalibrationError',
    'mezzanineBackupCalibrationError',
    'mezzanineEventTrapReset',
    'mezzanineApplicationMissing',
    'mezzanineApplicationCRCMismatch',
    'ilcFault',
    'broadcastCounterWarning',
  ],
  faForceWarning: [
    'measuredXForceWarning',
    'measuredYForceWarning',
    'measuredZForceWarning',
    'primaryAxisFollowingErrorWarning',
    'secondaryAxisFollowingErrorWarning',
    'primaryAxisFollowingErrorCountingFault',
    'secondaryAxisFollowingErrorCountingFault',
    'primaryAxisFollowingErrorImmediateFault',
    'secondaryAxisFollowingErrorImmediateFault',
  ],
  faFECounters: [
    'primaryAxisFollowingErrorWarningCounter',
    'secondaryAxisFollowingErrorWarningCounter',
    'primaryAxisFollowingErrorCountingCounter',
    'secondaryAxisFollowingErrorCountingCounter',
  ],
  faSetpointWarning: [
    'safetyLimitWarning',
    'nearNeighborWarning',
    'farNeighborWarning',
    'elevationForceWarning',
    'azimuthForceWarning',
    'thermalForceWarning',
    'balanceForceWarning',
    'accelerationForceWarning',
    'activeOpticForceWarning',
    'staticForceWarning',
    'offsetForceWarning',
    'velocityForceWarning',
    'forceWarning',
  ],
  faBumpTest: ['primaryTest', 'secondaryTest', 'primaryTestTimestamps', 'secondaryTestTimestamps'],
  faEnabled: ['forceActuatorEnabled'],
};

export const M1M3ActuatorForcesTopics = {
  appliedAccelerationForces: 'appliedAccelerationForces',
  appliedActiveOpticForces: 'appliedActiveOpticForces',
  appliedAzimuthForces: 'appliedAzimuthForces',
  appliedBalanceForces: 'appliedBalanceForces',
  appliedCylinderForces: 'appliedCylinderForces',
  appliedElevationForces: 'appliedElevationForces',
  appliedForces: 'appliedForces',
  appliedOffsetForces: 'appliedOffsetForces',
  appliedStaticForces: 'appliedStaticForces',
  appliedThermalForces: 'appliedThermalForces',
  appliedVelocityForces: 'appliedVelocityForces',
  preclippedAccelerationForces: 'preclippedAccelerationForces',
  preclippedActiveOpticForces: 'precippedActiveOpticForces',
  preclippedAzimuthForces: 'preclippedAzimuthForces',
  preclippedBalanceForces: 'preclippedBalanceForces',
  preclippedCylinderForces: 'preclippedCylinderForces',
  preclippedElevationForces: 'preclippedElevationForces',
  preclippedForces: 'preclippedForces',
  preclippedOffsetForces: 'preclippedOffsetForces',
  preclippedStaticForces: 'preclippedStaticForces',
  preclippedThermalForces: 'preclippedThermalForces',
  preclippedVelocityForces: 'preclippedVelocityForces',
  faMeasuredForces: 'forceActuatorData',
  faFollowingError: 'forceActuatorData',
  faRaisingState: 'raisingLoweringInfo',
  // faInfo: 'forceActuatorInfo',
  // faIndices: 'forceActuatorInfo',
  // faSettings: 'forceActuatorSettings',
  faMainCalibrationInfo: 'forceActuatorInfo',
  faBackupCalibrationInfo: 'forceActuatorInfo',
  faState: 'forceActuatorState',
  faWarning: 'forceActuatorWarning',
  faForceWarning: 'forceActuatorForceWarning',
  faFECounters: 'forceActuatorFollowingErrorCounter',
  faSetpointWarning: 'forceSetpointWarning',
  faBumpTest: 'forceActuatorBumpTestStatus',
  faEnabled: 'enabledForceActuators',
};

export const M1M3ActuatorForcesLabels = {
  appliedAccelerationForces: 'Applied Acceleration Forces',
  appliedActiveOpticForces: 'Applied Active Optic Forces',
  appliedAzimuthForces: 'Applied Azimuth Forces',
  appliedBalanceForces: 'Applied Balance Forces',
  appliedCylinderForces: 'Applied Cylinder Forces',
  appliedElevationForces: 'Applied Elevations Forces',
  appliedForces: 'Applied Forces',
  appliedOffsetForces: 'Applied Offset Forces',
  appliedStaticForces: 'Applied Static Forces',
  appliedThermalForces: 'Applied Thermal Forces',
  appliedVelocityForces: 'Applied Velocity Forces',
  preclippedAccelerationForces: 'Preclipped Acceleration Forces',
  preclippedActiveOpticForces: 'Preclipped Active Optic Forces',
  preclippedAzimuthForces: 'Preclipped Azimuth Forces',
  preclippedBalanceForces: 'Preclipped Balance Forces',
  preclippedCylinderForces: 'Preclipped Cylinder Forces',
  preclippedElevationForces: 'Preclipped Elevations Forces',
  preclippedForces: 'Preclipped Forces',
  preclippedOffsetForces: 'Preclipped Offset Forces',
  preclippedStaticForces: 'Preclipped Static Forces',
  preclippedThermalForces: 'Preclipped Thermal Forces',
  preclippedVelocityForces: 'Preclipped Velocity Forces',
  faMeasuredForces: 'Measured Forces',
  faFollowingError: 'FA Following Error',
  faRaisingState: 'FA Raising State',
  // faInfo: 'FA Info',
  // faIndices: 'FA Indices',
  // faSettings: 'FA Settings',
  faMainCalibrationInfo: 'FA Main Calibration Info',
  faBackupCalibrationInfo: 'FA Backup Calibration Info',
  faState: 'FA State',
  faWarning: 'FA Warning',
  faForceWarning: 'FA Force Warning',
  faFECounters: 'FA FE Counters',
  faSetpointWarning: 'FA Setpoint Warning',
  faBumpTest: 'FA Bump Test',
  faEnabled: 'FA Enabled',
};

export const M1M3ActuatorForceParametersValueTypes = {
  xForces: VALUE_TYPES.FLOAT,
  yForces: VALUE_TYPES.FLOAT,
  zForces: VALUE_TYPES.FLOAT,
  primaryCylinderForces: VALUE_TYPES.FLOAT,
  secondaryCylinderForces: VALUE_TYPES.FLOAT,
  // Fix the following for parameters when convenient, to use its plural way
  // see: DM-47126
  xForce: VALUE_TYPES.FLOAT,
  yForce: VALUE_TYPES.FLOAT,
  zForce: VALUE_TYPES.FLOAT,
  primaryCylinderForce: VALUE_TYPES.FLOAT,
  secondaryCylinderForce: VALUE_TYPES.FLOAT,
  primaryCylinderFollowingError: VALUE_TYPES.FLOAT,
  secondaryCylinderFollowingError: VALUE_TYPES.FLOAT,
  waitXForceActuator: VALUE_TYPES.BOOLEAN,
  waitYForceActuator: VALUE_TYPES.BOOLEAN,
  waitZForceActuator: VALUE_TYPES.BOOLEAN,
  mainPrimaryCylinderCoefficient: VALUE_TYPES.FLOAT,
  mainPrimaryCylinderLoadCellOffset: VALUE_TYPES.FLOAT,
  mainPrimaryCylinderLoadCellSensitivity: VALUE_TYPES.FLOAT,
  mainSecondaryCylinderCoefficient: VALUE_TYPES.FLOAT,
  mainSecondaryCylinderLoadCellOffset: VALUE_TYPES.FLOAT,
  mainSecondaryCylinderLoadCellSensitivity: VALUE_TYPES.FLOAT,
  mezzaninePrimaryCylinderGain: VALUE_TYPES.FLOAT,
  mezzanineSecondaryCylinderGain: VALUE_TYPES.FLOAT,
  backupPrimaryCylinderCoefficient: VALUE_TYPES.FLOAT,
  backupPrimaryCylinderLoadCellOffset: VALUE_TYPES.FLOAT,
  backupPrimaryCylinderLoadCellSensitivity: VALUE_TYPES.FLOAT,
  backupSecondaryCylinderCoefficient: VALUE_TYPES.FLOAT,
  backupSecondaryCylinderLoadCellOffset: VALUE_TYPES.FLOAT,
  backupSecondaryCylinderLoadCellSensitivity: VALUE_TYPES.FLOAT,
  majorFault: VALUE_TYPES.BOOLEAN,
  minorFault: VALUE_TYPES.BOOLEAN,
  faultOverride: VALUE_TYPES.BOOLEAN,
  mainCalibrationError: VALUE_TYPES.BOOLEAN,
  backupCalibrationError: VALUE_TYPES.BOOLEAN,
  ilcState: VALUE_TYPES.INTEGER,
  mezzanineError: VALUE_TYPES.BOOLEAN,
  mezzanineBootloaderActive: VALUE_TYPES.BOOLEAN,
  uniqueIdCRCError: VALUE_TYPES.BOOLEAN,
  applicationTypeMismatch: VALUE_TYPES.BOOLEAN,
  applicationMissing: VALUE_TYPES.BOOLEAN,
  oneWireMissing: VALUE_TYPES.BOOLEAN,
  oneWire1Mismatch: VALUE_TYPES.BOOLEAN,
  oneWire2Mismatch: VALUE_TYPES.BOOLEAN,
  watchdogReset: VALUE_TYPES.BOOLEAN,
  brownOut: VALUE_TYPES.BOOLEAN,
  eventTrapReset: VALUE_TYPES.BOOLEAN,
  ssrPowerFault: VALUE_TYPES.BOOLEAN,
  auxPowerFault: VALUE_TYPES.BOOLEAN,
  mezzaninePowerFault: VALUE_TYPES.BOOLEAN,
  mezzanineCurrentAmp1Fault: VALUE_TYPES.BOOLEAN,
  mezzanineCurrentAmp2Fault: VALUE_TYPES.BOOLEAN,
  mezzanineUniqueIdCRCError: VALUE_TYPES.BOOLEAN,
  mezzanineMainCalibrationError: VALUE_TYPES.BOOLEAN,
  mezzanineBackupCalibrationError: VALUE_TYPES.BOOLEAN,
  mezzanineEventTrapReset: VALUE_TYPES.BOOLEAN,
  mezzanineApplicationMissing: VALUE_TYPES.BOOLEAN,
  mezzanineApplicationCRCMismatch: VALUE_TYPES.BOOLEAN,
  ilcFault: VALUE_TYPES.BOOLEAN,
  broadcastCounterWarning: VALUE_TYPES.BOOLEAN,
  measuredXForceWarning: VALUE_TYPES.BOOLEAN,
  measuredYForceWarning: VALUE_TYPES.BOOLEAN,
  measuredZForceWarning: VALUE_TYPES.BOOLEAN,
  primaryAxisFollowingErrorWarning: VALUE_TYPES.BOOLEAN,
  secondaryAxisFollowingErrorWarning: VALUE_TYPES.BOOLEAN,
  primaryAxisFollowingErrorCountingFault: VALUE_TYPES.BOOLEAN,
  secondaryAxisFollowingErrorCountingFault: VALUE_TYPES.BOOLEAN,
  primaryAxisFollowingErrorImmediateFault: VALUE_TYPES.BOOLEAN,
  secondaryAxisFollowingErrorImmediateFault: VALUE_TYPES.BOOLEAN,
  primaryAxisFollowingErrorWarningCounter: VALUE_TYPES.INTEGER,
  secondaryAxisFollowingErrorWarningCounter: VALUE_TYPES.INTEGER,
  primaryAxisFollowingErrorCountingCounter: VALUE_TYPES.INTEGER,
  secondaryAxisFollowingErrorCountingCounter: VALUE_TYPES.INTEGER,
  safetyLimitWarning: VALUE_TYPES.BOOLEAN,
  nearNeighborWarning: VALUE_TYPES.BOOLEAN,
  farNeighborWarning: VALUE_TYPES.BOOLEAN,
  elevationForceWarning: VALUE_TYPES.BOOLEAN,
  azimuthForceWarning: VALUE_TYPES.BOOLEAN,
  thermalForceWarning: VALUE_TYPES.BOOLEAN,
  balanceForceWarning: VALUE_TYPES.BOOLEAN,
  accelerationForceWarning: VALUE_TYPES.BOOLEAN,
  activeOpticForceWarning: VALUE_TYPES.BOOLEAN,
  staticForceWarning: VALUE_TYPES.BOOLEAN,
  offsetForceWarning: VALUE_TYPES.BOOLEAN,
  velocityForceWarning: VALUE_TYPES.BOOLEAN,
  forceWarning: VALUE_TYPES.BOOLEAN,
  primaryTest: VALUE_TYPES.INTEGER,
  secondaryTest: VALUE_TYPES.INTEGER,
  primaryTestTimestamps: VALUE_TYPES.INTEGER,
  secondaryTestTimestamps: VALUE_TYPES.INTEGER,
  forceActuatorEnabled: VALUE_TYPES.BOOLEAN,
};

export const M1M3ActuatorForceParametersValueUnits = {
  xForces: 'N',
  yForces: 'N',
  zForces: 'N',
  primaryCylinderForces: 'N',
  secondaryCylinderForces: 'N',
  // Fix the following for parameters when convenient, to use its plural way
  // see: DM-47126
  xForce: 'N',
  yForce: 'N',
  zForce: 'N',
  primaryCylinderForce: 'N',
  secondaryCylinderForce: 'N',
  primaryCylinderFollowingError: 'N',
  secondaryCylinderFollowingError: 'N',
  waitXForceActuator: '',
  waitYForceActuator: '',
  waitZForceActuator: '',
  mainPrimaryCylinderCoefficient: '',
  mainPrimaryCylinderLoadCellOffset: '',
  mainPrimaryCylinderLoadCellSensitivity: '',
  mainSecondaryCylinderCoefficient: '',
  mainSecondaryCylinderLoadCellOffset: '',
  mainSecondaryCylinderLoadCellSensitivity: '',
  mezzaninePrimaryCylinderGain: '',
  mezzanineSecondaryCylinderGain: '',
  backupPrimaryCylinderCoefficient: '',
  backupPrimaryCylinderLoadCellOffset: '',
  backupPrimaryCylinderLoadCellSensitivity: '',
  backupSecondaryCylinderCoefficient: '',
  backupSecondaryCylinderLoadCellOffset: '',
  backupSecondaryCylinderLoadCellSensitivity: '',
  majorFault: '',
  minorFault: '',
  faultOverride: '',
  mainCalibrationError: '',
  backupCalibrationError: '',
  ilcState: '',
  mezzanineError: '',
  mezzanineBootloaderActive: '',
  uniqueIdCRCError: '',
  applicationTypeMismatch: '',
  applicationMissing: '',
  oneWireMissing: '',
  oneWire1Mismatch: '',
  oneWire2Mismatch: '',
  watchdogReset: '',
  brownOut: '',
  eventTrapReset: '',
  ssrPowerFault: '',
  auxPowerFault: '',
  mezzaninePowerFault: '',
  mezzanineCurrentAmp1Fault: '',
  mezzanineCurrentAmp2Fault: '',
  mezzanineUniqueIdCRCError: '',
  mezzanineMainCalibrationError: '',
  mezzanineBackupCalibrationError: '',
  mezzanineEventTrapReset: '',
  mezzanineApplicationMissing: '',
  mezzanineApplicationCRCMismatch: '',
  ilcFault: '',
  broadcastCounterWarning: '',
  measuredXForceWarning: '',
  measuredYForceWarning: '',
  measuredZForceWarning: '',
  primaryAxisFollowingErrorWarning: '',
  secondaryAxisFollowingErrorWarning: '',
  primaryAxisFollowingErrorCountingFault: '',
  secondaryAxisFollowingErrorCountingFault: '',
  primaryAxisFollowingErrorImmediateFault: '',
  secondaryAxisFollowingErrorImmediateFault: '',
  primaryAxisFollowingErrorWarningCounter: '',
  secondaryAxisFollowingErrorWarningCounter: '',
  primaryAxisFollowingErrorCountingCounter: '',
  secondaryAxisFollowingErrorCountingCounter: '',
  safetyLimitWarning: '',
  nearNeighborWarning: '',
  farNeighborWarning: '',
  elevationForceWarning: '',
  azimuthForceWarning: '',
  thermalForceWarning: '',
  balanceForceWarning: '',
  accelerationForceWarning: '',
  activeOpticForceWarning: '',
  staticForceWarning: '',
  offsetForceWarning: '',
  velocityForceWarning: '',
  forceWarning: '',
  primaryTest: '',
  secondaryTest: '',
  primaryTestTimestamps: 's',
  secondaryTestTimestamps: 's',
  forceActuatorEnabled: '',
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

export const M1M3ActuatorForceParametersAxisMapping = {
  xForces: M1M3XActuatorsMapping,
  yForces: M1M3YActuatorsMapping,
  zForces: M1M3ZActuatorsMapping,
  primaryCylinderForces: M1M3ZActuatorsMapping,
  secondaryCylinderForces: M1M3SActuatorsMapping,
  // Fix the following for parameters when convenient, to use its plural way
  // see: DM-47126
  xForce: M1M3XActuatorsMapping,
  yForce: M1M3YActuatorsMapping,
  zForce: M1M3ZActuatorsMapping,
  primaryCylinderForce: M1M3ZActuatorsMapping,
  secondaryCylinderForce: M1M3SActuatorsMapping,
  primaryCylinderFollowingError: M1M3ZActuatorsMapping,
  secondaryCylinderFollowingError: M1M3SActuatorsMapping,
  waitXForceActuator: M1M3XActuatorsMapping,
  waitYForceActuator: M1M3YActuatorsMapping,
  waitZForceActuator: M1M3ZActuatorsMapping,
  mainPrimaryCylinderCoefficient: M1M3ZActuatorsMapping,
  mainPrimaryCylinderLoadCellOffset: M1M3ZActuatorsMapping,
  mainPrimaryCylinderLoadCellSensitivity: M1M3ZActuatorsMapping,
  mainSecondaryCylinderCoefficient: M1M3ZActuatorsMapping,
  mainSecondaryCylinderLoadCellOffset: M1M3ZActuatorsMapping,
  mainSecondaryCylinderLoadCellSensitivity: M1M3ZActuatorsMapping,
  mezzaninePrimaryCylinderGain: M1M3ZActuatorsMapping,
  mezzanineSecondaryCylinderGain: M1M3ZActuatorsMapping,
  backupPrimaryCylinderCoefficient: M1M3ZActuatorsMapping,
  backupPrimaryCylinderLoadCellOffset: M1M3ZActuatorsMapping,
  backupPrimaryCylinderLoadCellSensitivity: M1M3ZActuatorsMapping,
  backupSecondaryCylinderCoefficient: M1M3ZActuatorsMapping,
  backupSecondaryCylinderLoadCellOffset: M1M3ZActuatorsMapping,
  backupSecondaryCylinderLoadCellSensitivity: M1M3ZActuatorsMapping,
  majorFault: M1M3ZActuatorsMapping,
  minorFault: M1M3ZActuatorsMapping,
  faultOverride: M1M3ZActuatorsMapping,
  mainCalibrationError: M1M3ZActuatorsMapping,
  backupCalibrationError: M1M3ZActuatorsMapping,
  ilcState: M1M3ZActuatorsMapping,
  mezzanineError: M1M3ZActuatorsMapping,
  mezzanineBootloaderActive: M1M3ZActuatorsMapping,
  uniqueIdCRCError: M1M3ZActuatorsMapping,
  applicationTypeMismatch: M1M3ZActuatorsMapping,
  applicationMissing: M1M3ZActuatorsMapping,
  oneWireMissing: M1M3ZActuatorsMapping,
  oneWire1Mismatch: M1M3ZActuatorsMapping,
  oneWire2Mismatch: M1M3ZActuatorsMapping,
  watchdogReset: M1M3ZActuatorsMapping,
  brownOut: M1M3ZActuatorsMapping,
  eventTrapReset: M1M3ZActuatorsMapping,
  ssrPowerFault: M1M3ZActuatorsMapping,
  auxPowerFault: M1M3ZActuatorsMapping,
  mezzaninePowerFault: M1M3ZActuatorsMapping,
  mezzanineCurrentAmp1Fault: M1M3ZActuatorsMapping,
  mezzanineCurrentAmp2Fault: M1M3ZActuatorsMapping,
  mezzanineUniqueIdCRCError: M1M3ZActuatorsMapping,
  mezzanineMainCalibrationError: M1M3ZActuatorsMapping,
  mezzanineBackupCalibrationError: M1M3ZActuatorsMapping,
  mezzanineEventTrapReset: M1M3ZActuatorsMapping,
  mezzanineApplicationMissing: M1M3ZActuatorsMapping,
  mezzanineApplicationCRCMismatch: M1M3ZActuatorsMapping,
  ilcFault: M1M3ZActuatorsMapping,
  broadcastCounterWarning: M1M3ZActuatorsMapping,
  measuredXForceWarning: M1M3XActuatorsMapping,
  measuredYForceWarning: M1M3YActuatorsMapping,
  measuredZForceWarning: M1M3ZActuatorsMapping,
  primaryAxisFollowingErrorWarning: M1M3ZActuatorsMapping,
  secondaryAxisFollowingErrorWarning: M1M3SActuatorsMapping,
  primaryAxisFollowingErrorCountingFault: M1M3ZActuatorsMapping,
  secondaryAxisFollowingErrorCountingFault: M1M3SActuatorsMapping,
  primaryAxisFollowingErrorImmediateFault: M1M3ZActuatorsMapping,
  secondaryAxisFollowingErrorImmediateFault: M1M3SActuatorsMapping,
  primaryAxisFollowingErrorWarningCounter: M1M3ZActuatorsMapping,
  secondaryAxisFollowingErrorWarningCounter: M1M3SActuatorsMapping,
  primaryAxisFollowingErrorCountingCounter: M1M3ZActuatorsMapping,
  secondaryAxisFollowingErrorCountingCounter: M1M3SActuatorsMapping,
  safetyLimitWarning: M1M3ZActuatorsMapping,
  nearNeighborWarning: M1M3ZActuatorsMapping,
  farNeighborWarning: M1M3ZActuatorsMapping,
  elevationForceWarning: M1M3ZActuatorsMapping,
  azimuthForceWarning: M1M3ZActuatorsMapping,
  thermalForceWarning: M1M3ZActuatorsMapping,
  balanceForceWarning: M1M3ZActuatorsMapping,
  accelerationForceWarning: M1M3ZActuatorsMapping,
  activeOpticForceWarning: M1M3ZActuatorsMapping,
  staticForceWarning: M1M3ZActuatorsMapping,
  offsetForceWarning: M1M3ZActuatorsMapping,
  velocityForceWarning: M1M3ZActuatorsMapping,
  forceWarning: M1M3ZActuatorsMapping,
  primaryTest: M1M3ZActuatorsMapping,
  secondaryTest: M1M3SActuatorsMapping,
  primaryTestTimestamps: M1M3ZActuatorsMapping,
  secondaryTestTimestamps: M1M3SActuatorsMapping,
  forceActuatorEnabled: M1M3ZActuatorsMapping,
};

/*****************************************************************************/
/************************* MTM2 actuator and forces **************************/
/*****************************************************************************/

export const M2ActuatorForces = {
  actuatorSteps: ['steps'],
  encoderPositions: ['position'],
  forces: ['lutGravity', 'lutTemperature', 'applied', 'measured', 'hardpointCorrection'],
};

export const M2ActuatorForcesTopics = {
  actuatorSteps: ['axialActuatorSteps', 'tangentActuatorSteps'],
  encoderPositions: ['axialEncoderPositions', 'tangentEncoderPositions'],
  forces: ['axialForce', 'tangentForce'],
};

export const M2ActuatorForcesLabels = {
  actuatorSteps: 'Actuator Steps',
  encoderPositions: 'Encoder Positions',
  forces: 'Forces',
};

export const M2ActuatorForceParametersValueTypes = {
  steps: VALUE_TYPES.INTEGER,
  position: VALUE_TYPES.FLOAT,
  lutGravity: VALUE_TYPES.FLOAT,
  lutTemperature: VALUE_TYPES.FLOAT,
  applied: VALUE_TYPES.FLOAT,
  measured: VALUE_TYPES.FLOAT,
  hardpointCorrection: VALUE_TYPES.FLOAT,
};

export const M2ActuatorForceParametersValueUnits = {
  steps: '',
  position: 'µm',
  lutGravity: 'N',
  lutTemperature: 'N',
  applied: 'N',
  measured: 'N',
  hardpointCorrection: 'N',
};

export const M2ActuatorPositionsAlpha = [
  { id: 1, position: [0, 1.601] },
  { id: 2, position: [0.33287, 1.56601] },
  { id: 3, position: [0.65119, 1.46259] },
  { id: 4, position: [0.94104, 1.29524] },
  { id: 5, position: [1.18977, 1.07128] },
  { id: 6, position: [1.38651, 0.8005] },
  { id: 7, position: [1.52264, 0.49474] },
  { id: 8, position: [1.59223, 0.16735] },
  { id: 9, position: [1.59223, -0.16735] },
  { id: 10, position: [1.52264, -0.49474] },
  { id: 11, position: [1.38651, -0.8005] },
  { id: 12, position: [1.18977, -1.07128] },
  { id: 13, position: [0.94104, -1.29524] },
  { id: 14, position: [0.65119, -1.46259] },
  { id: 15, position: [0.33287, -1.56601] },
  { id: 16, position: [0, -1.601] },
  { id: 17, position: [-0.33287, -1.56601] },
  { id: 18, position: [-0.65119, -1.46259] },
  { id: 19, position: [-0.94104, -1.29524] },
  { id: 20, position: [-1.18977, -1.07128] },
  { id: 21, position: [-1.38651, -0.8005] },
  { id: 22, position: [-1.52264, -0.49474] },
  { id: 23, position: [-1.59223, -0.16735] },
  { id: 24, position: [-1.59223, 0.16735] },
  { id: 25, position: [-1.52264, 0.49474] },
  { id: 26, position: [-1.38651, 0.8005] },
  { id: 27, position: [-1.18977, 1.07128] },
  { id: 28, position: [-0.94104, 1.29524] },
  { id: 29, position: [-0.65119, 1.46259] },
  { id: 30, position: [-0.33287, 1.56601] },
  { id: 31, position: [0.1676, 1.27302] },
  { id: 32, position: [0.49137, 1.18626] },
  { id: 33, position: [0.78165, 1.01867] },
  { id: 34, position: [1.01867, 0.78165] },
  { id: 35, position: [1.18626, 0.49137] },
  { id: 36, position: [1.27302, 0.1676] },
  { id: 37, position: [1.27302, -0.1676] },
  { id: 38, position: [1.18626, -0.49137] },
  { id: 39, position: [1.01867, -0.78165] },
  { id: 40, position: [0.78165, -1.01867] },
  { id: 41, position: [0.49137, -1.18626] },
  { id: 42, position: [0.1676, -1.27302] },
  { id: 43, position: [-0.1676, -1.27302] },
  { id: 44, position: [-0.49137, -1.18626] },
  { id: 45, position: [-0.78165, -1.01867] },
  { id: 46, position: [-1.01867, -0.78165] },
  { id: 47, position: [-1.18626, -0.49137] },
  { id: 48, position: [-1.27302, -0.1676] },
  { id: 49, position: [-1.27302, 0.1676] },
  { id: 50, position: [-1.18626, 0.49137] },
  { id: 51, position: [-1.01867, 0.78165] },
  { id: 52, position: [-0.78165, 1.01867] },
  { id: 53, position: [-0.49137, 1.18626] },
  { id: 54, position: [-0.1676, 1.27302] },
  { id: 55, position: [0, 1.002] },
  { id: 56, position: [0.3427, 0.94157] },
  { id: 57, position: [0.64407, 0.76758] },
  { id: 58, position: [0.86776, 0.501] },
  { id: 59, position: [0.98678, 0.174] },
  { id: 60, position: [0.98678, -0.174] },
  { id: 61, position: [0.86776, -0.501] },
  { id: 62, position: [0.64407, -0.76758] },
  { id: 63, position: [0.3427, -0.94157] },
  { id: 64, position: [0, -1.002] },
  { id: 65, position: [-0.3427, -0.94157] },
  { id: 66, position: [-0.64407, -0.76758] },
  { id: 67, position: [-0.86776, -0.501] },
  { id: 68, position: [-0.98678, -0.174] },
  { id: 69, position: [-0.98678, 0.174] },
  { id: 70, position: [-0.86776, 0.501] },
  { id: 71, position: [-0.64407, 0.76758] },
  { id: 72, position: [-0.3427, 0.94157] },
];

export const M2ActuatorPositions = M2ActuatorPositionsAlpha.map((x) => ({
  ...x,
  position: [x.position[0] * 100, x.position[1] * 100],
}));

export const M2ActuatorTangentAngles = [0, 60, 120, 180, 240, 300];

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
