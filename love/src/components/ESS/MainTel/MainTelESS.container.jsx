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

import React from 'react';
import { connect } from 'react-redux';
import { addGroup, removeGroup } from 'redux/actions/ws';
import { getStreamsData, getLouversStatus, getApertureShutter, getDomeAzimuth } from 'redux/selectors';
import SubscriptionTableContainer from 'components/GeneralPurpose/SubscriptionTable/SubscriptionTable.container';
import MainTelESS from './MainTelESS';

const ESS_DEVICES = [
  {
    name: 'MTCameraAssembly-ESS01',
    host: 'hexrot-ess01.cp.lsst.org',
    location: 'MT camera hexapod strut 7',
    position: [0, 4, 14],
    telemetry: 'ESS-121-telemetry-temperature-temperatureItem-0',
    configURL: 'https://github.com/lsst-ts/ts_config_ocs/blob/develop/ESS/v8/_init.yaml#L314-L327',
  },
  {
    name: 'MTCameraAssembly-ESS01',
    host: 'hexrot-ess01.cp.lsst.org',
    location: 'MT camera hexapod strut 8',
    position: [3, 5, 16],
    telemetry: 'ESS-121-telemetry-temperature-temperatureItem-1',
    configURL: 'https://github.com/lsst-ts/ts_config_ocs/blob/develop/ESS/v8/_init.yaml#L314-L327',
  },
  {
    name: 'MTCameraAssembly-ESS01',
    host: 'hexrot-ess01.cp.lsst.org',
    location: 'MT camera hexapod strut 9',
    position: [0, 8, 14],
    telemetry: 'ESS-121-telemetry-temperature-temperatureItem-2',
    configURL: 'https://github.com/lsst-ts/ts_config_ocs/blob/develop/ESS/v8/_init.yaml#L314-L327',
  },
  {
    name: 'MTCameraAssembly-ESS01',
    host: 'hexrot-ess01.cp.lsst.org',
    location: 'MT camera hexapod strut 10',
    position: [0, 10, 14],
    telemetry: 'ESS-121-telemetry-temperature-temperatureItem-3',
    configURL: 'https://github.com/lsst-ts/ts_config_ocs/blob/develop/ESS/v8/_init.yaml#L314-L327',
  },
  {
    name: 'MTCameraAssembly-ESS01',
    host: 'hexrot-ess01.cp.lsst.org',
    location: 'MT camera hexapod strut 11',
    position: [0, 12, 14],
    telemetry: 'ESS-121-telemetry-temperature-temperatureItem-4',
    configURL: 'https://github.com/lsst-ts/ts_config_ocs/blob/develop/ESS/v8/_init.yaml#L314-L327',
  },
  {
    name: 'MTCameraAssembly-ESS01',
    host: 'hexrot-ess01.cp.lsst.org',
    location: 'MT camera hexapod strut 12',
    position: [0, 14, 14],
    telemetry: 'ESS-121-telemetry-temperature-temperatureItem-5',
    configURL: 'https://github.com/lsst-ts/ts_config_ocs/blob/develop/ESS/v8/_init.yaml#L314-L327',
  },
  {
    name: 'MTCameraAssembly-ESS01',
    host: 'hexrot-ess01.cp.lsst.org',
    location: 'MT camera rotator motor 1',
    position: [0, 16, 14],
    telemetry: 'ESS-121-telemetry-temperature-temperatureItem-6',
    configURL: 'https://github.com/lsst-ts/ts_config_ocs/blob/develop/ESS/v8/_init.yaml#L314-L327',
  },
  {
    name: 'MTCameraAssembly-ESS01',
    host: 'hexrot-ess01.cp.lsst.org',
    location: 'MT camera rotator motor 2',
    position: [0, 18, 14],
    telemetry: 'ESS-121-telemetry-temperature-temperatureItem-7',
    configURL: 'https://github.com/lsst-ts/ts_config_ocs/blob/develop/ESS/v8/_init.yaml#L314-L327',
  },
];

export const schema = {
  description: 'View of Simonyi Telescope Environmental Awareness System',
  defaultSize: [60, 47],
  props: {
    title: {
      type: 'string',
      description: 'Name diplayed in the title bar (if visible)',
      isPrivate: false,
      default: 'Simonyi ESS',
    },
    hasRawMode: {
      type: 'boolean',
      description: 'Whether the component has a raw mode version',
      isPrivate: false,
      default: false,
    },
    minGradiantLimit: {
      type: 'number',
      description: 'Minimum limit for the limit of gradiant plot',
      isPrivate: false,
      default: 0,
    },
    maxGradiantLimit: {
      type: 'number',
      description: 'Maximum limit for the limit of gradiant plot',
      isPrivate: false,
      default: 40,
    },
    initialCameraPosition: {
      type: 'object',
      description: 'object of the initial position from the camera. Example {x: -12, y: -16.5, z: 26.5}',
      default: { x: 50, y: 0, z: 0 },
    },
    selectedDiagram: {
      type: 'string',
      description: 'selected diagram to be displayed: dome or tma',
      default: 'tma',
    },
    devices: {
      type: 'array',
      description: 'Array with the devices to be displayed and their position',
      default: ESS_DEVICES,
    },
  },
};

const MainTelESSContainer = (props) => {
  if (props.isRaw) {
    return <SubscriptionTableContainer subscriptions={props.subscriptions}></SubscriptionTableContainer>;
  }

  return <MainTelESS {...props} />;
};

// /**
//  *
//  * @param {array} streams
//  * @returns array with the data separate parse of the temperature telemetry
//  */
// const parseTemperature = (streams) => {
//   const temperatures = [];
//   streams.forEach((stream) => {
//     Object.entries(stream).forEach((entry) => {
//       const essData = entry[1];
//       const sensorName = essData?.sensorName?.value ?? '';
//       const numChannels = essData?.numChannels?.value ?? 1;
//       const values = essData?.temperature?.value.slice(0, numChannels) ?? [];
//       const locations = essData?.location?.value.split(',')?.slice(0, numChannels) ?? [];
//       const timestamp = essData?.timestamp?.value;
//       const xPosition = essData?.xPosition?.value;
//       const yPosition = essData?.yPosition?.value;
//       const zPosition = essData?.zPosition?.value;
//       for (let i = 0; i < numChannels; i++) {
//         temperatures.push({
//           sensorName,
//           numChannels,
//           value: +values[i],
//           indexArr: i,
//           location: locations[i],
//           telemetry: entry[0],
//           xPosition: xPosition ?? SensorsPositionESS[sensorName][i]?.xPosition,
//           yPosition: yPosition ?? SensorsPositionESS[sensorName][i]?.yPosition,
//           zPosition: zPosition ?? SensorsPositionESS[sensorName][i]?.zPosition,
//           timestamp: timestamp,
//         });
//       }
//     });
//   });
//   return temperatures;
// };

// /**
//  *
//  * @param {array} streams
//  * @returns array with the data separate parse of the relativeHumidity telemetry
//  */
// const parseHumidity = (streams) => {
//   const humidities = [];
//   streams.forEach((stream) => {
//     Object.entries(stream).forEach((entry) => {
//       const essData = entry[1];
//       const sensorName = essData?.sensorName.value ?? '';
//       const value = essData?.relativeHumidity.value ?? 0;
//       const location = essData?.location.value ?? '';
//       const timestamp = essData?.timestamp?.value;
//       const xPosition = essData?.xPosition?.value;
//       const yPosition = essData?.yPosition?.value;
//       const zPosition = essData?.zPosition?.value;
//       humidities.push({
//         sensorName,
//         value: +value,
//         location: location,
//         telemetry: entry[0],
//         xPosition: xPosition ?? SensorsPositionESS[sensorName][0]?.xPosition,
//         yPosition: yPosition ?? SensorsPositionESS[sensorName][0]?.yPosition,
//         zPosition: zPosition ?? SensorsPositionESS[sensorName][0]?.zPosition,
//         timestamp: timestamp,
//       });
//     });
//   });
//   return humidities;
// };

// /**
//  *
//  * @param {array} streams
//  * @returns array with the data separate parse of the speed telemetry
//  */
// const parseAirflow = (streams) => {
//   const airflows = [];
//   streams.forEach((stream) => {
//     Object.entries(stream).forEach((entry) => {
//       const essData = entry[1];
//       const sensorName = essData?.sensorName.value ?? '';
//       const value = essData?.speed.value ?? 0;
//       const direction = essData?.speed.direction ?? 0;
//       const location = essData?.location.value ?? '';
//       const timestamp = essData?.timestamp?.value;
//       const xPosition = essData?.xPosition?.value;
//       const yPosition = essData?.yPosition?.value;
//       const zPosition = essData?.zPosition?.value;
//       airflows.push({
//         sensorName,
//         value: +value,
//         direction: direction,
//         location: location,
//         telemetry: entry[0],
//         xPosition: xPosition ?? SensorsPositionESS[sensorName][0]?.xPosition,
//         yPosition: yPosition ?? SensorsPositionESS[sensorName][0]?.yPosition,
//         zPosition: zPosition ?? SensorsPositionESS[sensorName][0]?.zPosition,
//         timestamp: timestamp,
//       });
//     });
//   });
//   return airflows;
// };

// /**
//  *
//  * @param {array} streams
//  * @returns array with the data separate parse of the speedMagnitud telemetry
//  */
// const parseAirTurbulence = (streams) => {
//   const airTurbulences = [];
//   streams.forEach((stream) => {
//     Object.entries(stream).forEach((entry) => {
//       const essData = entry[1];
//       const sensorName = essData?.sensorName.value ?? '';
//       const value = essData?.speedMagnitud.value ?? 0;
//       const speed = essData?.speed.value ?? { x: 0, y: 0, z: 0 };
//       const location = essData?.location.value ?? '';
//       const timestamp = essData?.timestamp?.value;
//       const xPosition = essData?.xPosition?.value;
//       const yPosition = essData?.yPosition?.value;
//       const zPosition = essData?.zPosition?.value;
//       airTurbulences.push({
//         sensorName,
//         value: +value,
//         speed: +speed,
//         location: location,
//         telemetry: entry[0],
//         xPosition: xPosition ?? SensorsPositionESS[sensorName][0]?.xPosition,
//         yPosition: yPosition ?? SensorsPositionESS[sensorName][0]?.yPosition,
//         zPosition: zPosition ?? SensorsPositionESS[sensorName][0]?.zPosition,
//         timestamp: timestamp,
//       });
//     });
//   });
//   return airTurbulences;
// };

const arrangeSubscriptionsFromConfiguration = (devices) => {
  const subscriptions = devices.map((device) => {
    const tokens = device.telemetry.split('-');
    return `${tokens[2]}-${tokens[0]}-${tokens[1]}-${tokens[3]}-${tokens[4]}`;
  });
  const uniqueSubscriptions = [...new Set(subscriptions)];
  return uniqueSubscriptions;
};

const mapStateToProps = (state, ownProps) => {
  const louversState = getLouversStatus(state);
  const apertureShutterState = getApertureShutter(state);
  const domeAzimuth = getDomeAzimuth(state);

  const deviceSubscriptions = arrangeSubscriptionsFromConfiguration(ownProps.devices);
  const deviceData = getStreamsData(state, deviceSubscriptions);

  return {
    percentOpenLouvers: louversState.actualPositionLouvers,
    percentOpenShutter: apertureShutterState.positionActualShutter,
    positionActualDomeAz: domeAzimuth.positionActualDomeAz,
    deviceData,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const deviceSubscriptions = arrangeSubscriptionsFromConfiguration(ownProps.devices);
  const subscriptions = [
    'telemetry-MTDome-0-louvers',
    'telemetry-MTDome-0-apertureShutter',
    'telemetry-MTDome-0-azimuth',
    ...deviceSubscriptions,
  ];
  return {
    subscriptions,
    subscribeToStreams: () => {
      subscriptions.forEach((s) => dispatch(addGroup(s)));
    },
    unsubscribeToStreams: () => {
      subscriptions.forEach((s) => dispatch(removeGroup(s)));
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(MainTelESSContainer);
