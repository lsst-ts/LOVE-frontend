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
import { getStreamsData, getDomeState } from 'redux/selectors';
import SubscriptionTableContainer from 'components/GeneralPurpose/SubscriptionTable/SubscriptionTable.container';
import AuxTelESS from './AuxTelESS';
import { range } from 'lodash';

export const schema = {
  description: 'View of Auxiliary Telescope Environmental Awareness System',
  defaultSize: [60, 47],
  props: {
    title: {
      type: 'string',
      description: 'Name diplayed in the title bar (if visible)',
      isPrivate: false,
      default: 'Auxiliary Telescope ESS',
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
      default: '201-299',
    },
    option: {
      type: 'string',
      description: 'select option between temperature, relativeHumidity, airFlow or airTurbulence',
      default: 'temperature',
    },
    initialCameraPosition: {
      type: 'object',
      description: 'object of the initial position from the camera. Example {x: -2.8, y: -6, z: 9.5}',
      default: { x: -2.8, y: -6, z: 9.5 },
    },
  },
};

const AuxTelESSContainer = (props) => {
  if (props.isRaw) {
    return <SubscriptionTableContainer subscriptions={props.subscriptions}></SubscriptionTableContainer>;
  }

  return <AuxTelESS {...props} />;
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

const parse = (streams, option) => {
  switch (option) {
    case 'temperature':
      return parseTemperature(streams);
    case 'relativeHumidity':
      return parseHumidity(streams);
    case 'airFlow':
      return parseAirflow(streams);
    case 'airTurbulence':
      return parseAirTurbulence(streams);
    default:
      return [];
  }
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
      for (let i = 0; i < numChannels; i++) {
        temperatures.push({
          sensorName,
          numChannels,
          value: values[i],
          indexArr: i,
          location: locations[i],
          telemetry: entry[0],
          xPosition: i,
          yPosition: temperatures.length,
          zPosition: i + temperatures.length,
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
      humidities.push({
        sensorName,
        value: value,
        location: location,
        telemetry: entry[0],
        xPosition: humidities.length,
        yPosition: 5,
        zPosition: 5 + humidities.length,
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
      airflows.push({
        sensorName,
        value: value,
        direction: direction,
        location: location,
        telemetry: entry[0],
        xPosition: 5 - airflows.length,
        yPosition: 2,
        zPosition: airflows.length,
      });
    });
  });
  airflows.push({
    sensorName: 'test 1',
    value: 30,
    direction: 90,
    location: 'location test',
    telemetry: 'telemetry-ESS-402-airFlow',
    xPosition: 0,
    yPosition: 0,
    zPosition: 0,
  });
  airflows.push({
    sensorName: 'test 2',
    value: 10,
    direction: 180,
    location: 'location test',
    telemetry: 'telemetry-ESS-402-airFlow',
    xPosition: 0,
    yPosition: 0,
    zPosition: 0,
  });
  airflows.push({
    sensorName: 'test 3',
    value: 10,
    direction: 270,
    location: 'location test',
    telemetry: 'telemetry-ESS-402-airFlow',
    xPosition: 0,
    yPosition: 0,
    zPosition: 0,
  });
  airflows.push({
    sensorName: 'test 4',
    value: 20,
    direction: 0,
    location: 'location test',
    telemetry: 'telemetry-ESS-402-airFlow',
    xPosition: 0,
    yPosition: 0,
    zPosition: 0,
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
      airTurbulences.push({
        sensorName,
        value: value,
        speed: speed,
        location: location,
        telemetry: entry[0],
        xPosition: 5 - airTurbulences.length,
        yPosition: 2,
        zPosition: airTurbulences.length,
      });
    });
  });
  airTurbulences.push({
    sensorName: 'test',
    value: 2,
    speed: { x: 1, y: 1, z: 2 },
    location: 'location test',
    telemetry: 'telemetry-ESS-402-airTurbulence',
    xPosition: 1,
    yPosition: 1,
    zPosition: 1,
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

  const domeState = getDomeState(state);
  return {
    ...map,
    percentOpenMainDoor: domeState.mainDoorOpeningPercentage,
    percentOpenDropoutDoor: domeState.dropoutDoorOpeningPercentage,
    azimuthPosition: domeState.azimuthPosition,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const salindexList = ownProps.salindexList;
  const option = ownProps.option;
  const subscriptions = ['telemetry-ATDome-0-position', ...getGroupNames(salindexList, option)];

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
export default connect(mapStateToProps, mapDispatchToProps)(AuxTelESSContainer);