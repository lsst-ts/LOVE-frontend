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
import { SensorsPositionESS } from 'Config';
import { range } from 'lodash';

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
      default: -20,
    },
    maxGradiantLimit: {
      type: 'number',
      description: 'Maximum limit for the limit of gradiant plot',
      isPrivate: false,
      default: 40,
    },
    salindexList: {
      type: 'string',
      description:
        'Numbers separated by comma(","), and range of numbers separed with hyphen ("-"). For example 1-99,101,102,105',
      isPrivate: false,
      default: '1,2,3,4,5-199',
    },
    option: {
      type: 'string',
      description: 'select option between temperature, relativeHumidity, airFlow or airTurbulence',
      default: 'temperature',
    },
    initialCameraPosition: {
      type: 'object',
      description: 'object of the initial position from the camera. Example {x: -12, y: -16.5, z: 26.5}',
      default: { x: -12, y: -16.5, z: 26.5 },
    },
  },
};

const MainTelESSContainer = (props) => {
  if (props.isRaw) {
    return <SubscriptionTableContainer subscriptions={props.subscriptions}></SubscriptionTableContainer>;
  }

  return <MainTelESS {...props} />;
};

const getGroupNames = (salindexList, option) => {
  const sep = salindexList?.split(',');
  const listSal = sep
    ?.map((s) => {
      if (s.indexOf('-') >= 0) {
        const [init, end] = s.split('-');
        return range(init, end);
      } else {
        return [Number(s)];
      }
    })
    .flat();
  const subscriptions = listSal.map((salindex) => {
    return `telemetry-ESS-${salindex}-${option}`;
  });
  return [...new Set(subscriptions)];
};

const prevParseToArraySensors = (prevParse, option) => {
  const list = Object.values(prevParse[option] ?? {}) ?? [];
  const objs = Object.values(list).map((values) => {
    return Object.values(values);
  });

  const result = Array.prototype.concat.apply([], objs);
  const sorted = result.sort((a, b) => {
    return a.sensorName > b.sensorName ? 1 : (
      a.sensorName < b.sensorName ? -1 : (
        a.sensorName === b.sensorName && a.indexArr > b.indexArr ? 1 : (
          a.indexArr < b.indexArr ? -1 : 0
        )
      )
    );
  });
  return sorted;
};

let prevParse = {};
const parse = (streams, option) => {
  let arr;
  switch (option) {
    case 'temperature':
      arr = parseTemperature(streams);
      break;
    case 'relativeHumidity':
      arr = parseHumidity(streams);
      break;
    case 'airFlow':
      arr = parseAirflow(streams);
      break;
    case 'airTurbulence':
      arr = parseAirTurbulence(streams);
      break;
    default:
      arr = [];
  }
  arr.forEach((parse) => {
    if (!prevParse[option]) prevParse[option] = {};
    if (!prevParse[option][parse.sensorName]) prevParse[option][parse.sensorName] = {};
    if (!prevParse[option][parse.sensorName][parse.indexArr]) prevParse[option][parse.sensorName][parse.indexArr] = {};
    prevParse[option][parse.sensorName][parse.indexArr] = parse;
  })
  const arrSensors = prevParseToArraySensors(prevParse, option);
  return arrSensors;
};

const parseTemperature = (streams) => {
  const temperatures = [];
  streams.forEach((stream) => {
    Object.entries(stream).forEach((entry) => {
      const essData = entry[1];
      const sensorName = essData?.sensorName.value ?? '';
      const numChannels = essData?.numChannels.value ?? 1;
      const values = essData?.temperature.value?.slice(0, numChannels) ?? [];
      const locations = essData?.location.value.split(',')?.slice(0, numChannels) ?? [];
      const timestamp = essData?.timestamp?.value ?? undefined;
      const xPosition = essData?.xPosition?.value ?? undefined;
      const yPosition = essData?.yPosition?.value ?? undefined;
      const zPosition = essData?.zPosition?.value ?? undefined;
      for (let i = 0; i < numChannels; i++) {
        temperatures.push({
          sensorName,
          numChannels,
          value: values[i],
          indexArr: i,
          location: locations[i],
          telemetry: entry[0],
          xPosition: xPosition ?? SensorsPositionESS[sensorName][i]?.xPosition,
          yPosition: yPosition ?? SensorsPositionESS[sensorName][i]?.yPosition,
          zPosition: zPosition ?? SensorsPositionESS[sensorName][i]?.zPosition,
          timestamp: timestamp,
        });
      }
    });
  });
  return temperatures;
};

const parseHumidity = (streams) => {
  const humidities = [];
  streams.forEach((stream) => {
    Object.entries(stream).forEach((entry) => {
      const essData = entry[1];
      const sensorName = essData?.sensorName.value ?? '';
      const value = essData?.relativeHumidity.value ?? 0;
      const location = essData?.location.value ?? '';
      const timestamp = essData?.timestamp?.value ?? undefined;
      const xPosition = essData?.xPosition?.value ?? undefined;
      const yPosition = essData?.yPosition?.value ?? undefined;
      const zPosition = essData?.zPosition?.value ?? undefined;
      humidities.push({
        sensorName,
        value: value,
        location: location,
        telemetry: entry[0],
        xPosition: xPosition ?? SensorsPositionESS[sensorName][0]?.xPosition,
        yPosition: yPosition ?? SensorsPositionESS[sensorName][0]?.yPosition,
        zPosition: zPosition ?? SensorsPositionESS[sensorName][0]?.zPosition,
        timestamp: timestamp,
      });
    });
  });
  return humidities;
};

const parseAirflow = (streams) => {
  const airflows = [];
  streams.forEach((stream) => {
    Object.entries(stream).forEach((entry) => {
      const essData = entry[1];
      const sensorName = essData?.sensorName.value ?? '';
      const value = essData?.speed.value ?? 0;
      const direction = essData?.speed.direction ?? 0;
      const location = essData?.location.value ?? '';
      const timestamp = essData?.timestamp?.value ?? undefined;
      const xPosition = essData?.xPosition?.value ?? undefined;
      const yPosition = essData?.yPosition?.value ?? undefined;
      const zPosition = essData?.zPosition?.value ?? undefined;
      airflows.push({
        sensorName,
        value: value,
        direction: direction,
        location: location,
        telemetry: entry[0],
        xPosition: xPosition ?? SensorsPositionESS[sensorName][0]?.xPosition,
        yPosition: yPosition ?? SensorsPositionESS[sensorName][0]?.yPosition,
        zPosition: zPosition ?? SensorsPositionESS[sensorName][0]?.zPosition,
        timestamp: timestamp,
      });
    });
  });
  return airflows;
};

const parseAirTurbulence = (streams) => {
  const airTurbulences = [];
  streams.forEach((stream) => {
    Object.entries(stream).forEach((entry) => {
      const essData = entry[1];
      const sensorName = essData?.sensorName.value ?? '';
      const value = essData?.speedMagnitud.value ?? 0;
      const speed = essData?.speed.value ?? { x: 0, y: 0, z: 0 };
      const location = essData?.location.value ?? '';
      const timestamp = essData?.timestamp?.value ?? undefined;
      const xPosition = essData?.xPosition?.value ?? undefined;
      const yPosition = essData?.yPosition?.value ?? undefined;
      const zPosition = essData?.zPosition?.value ?? undefined;
      airTurbulences.push({
        sensorName,
        value: value,
        speed: speed,
        location: location,
        telemetry: entry[0],
        xPosition: xPosition ?? SensorsPositionESS[sensorName][0]?.xPosition,
        yPosition: yPosition ?? SensorsPositionESS[sensorName][0]?.yPosition,
        zPosition: zPosition ?? SensorsPositionESS[sensorName][0]?.zPosition,
        timestamp: timestamp,
      });
    });
  });
  return airTurbulences;
};

const mapStateToProps = (state, ownProps) => {
  const salindexList = ownProps.salindexList;
  const option = ownProps.option;

  let map = {};
  const groupNames = getGroupNames(salindexList, option);
  const streams = getStreamsData(state, groupNames);
  const cleanStream = Object.entries(streams)
    .filter((stream) => {
      return stream[1] !== undefined;
    })
    .map((entry) => {
      const result = {};
      result[entry[0]] = entry[1];
      return result;
    });
  map[option] = cleanStream ? parse(cleanStream, option) : [];

  const louversState = getLouversStatus(state);
  const apertureShutterState = getApertureShutter(state);
  const domeAzimuth = getDomeAzimuth(state);

  return {
    ...map,
    percentOpenLouvers: louversState.actualPositionLouvers,
    percentOpenShutter: apertureShutterState.positionActualShutter,
    positionActualDomeAz: domeAzimuth.positionActualDomeAz,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const salindexList = ownProps.salindexList;
  const option = ownProps.option;
  const subscriptions = [
    'telemetry-MTDome-0-louvers',
    'telemetry-MTDome-0-apertureShutter',
    'telemetry-MTDome-0-azimuth',
    ...getGroupNames(salindexList, option),
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
