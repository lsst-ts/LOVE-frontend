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

import React, { useEffect, useState, useMemo, useRef, Suspense } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import * as d3 from 'd3';
import * as THREE from 'three';
import { UNITS_MAPPING } from 'Config';

import Scene from './Scene/Scene';
import Info from '../Common/Info/Info';
import Gradiant from '../Common/Gradiant/Gradiant';

import { Sensors } from '../Common/Sensors';
import { Louvers } from './Scene/Louvers';
import { Shutter } from './Scene/Shutter';
import Simonyi from './Scene/Simonyi';

import PlotContainer from 'components/GeneralPurpose/Plot/Plot.container';
import styles from './MainTelESS.module.css';

const parseTelemetrySubscription = (configTelemetry) => {
  if (!configTelemetry) return null;
  const tokens = configTelemetry.split('-');
  return `${tokens[2]}-${tokens[0]}-${tokens[1]}-${tokens[3]}-${tokens[4]}`;
};

const parsePlotInput = (configTelemetry) => {
  if (!configTelemetry) return null;
  const telemetryTokens = configTelemetry?.split('-');
  const topicCSC = telemetryTokens[0];
  const salindex = telemetryTokens[1];
  const topicType = telemetryTokens[2];
  const topicName = telemetryTokens[3];
  const topicItem = telemetryTokens[4];
  const arrayIndex = telemetryTokens[5];
  const isArray = arrayIndex >= 0;
  const accessor = isArray ? `(x) => x[${arrayIndex}]` : '(x) => x';

  const title = isArray ? `${topicItem}[${arrayIndex}]` : topicItem;

  const config = {
    [title]: {
      type: 'line',
      dash: [4, 0],
      values: [
        {
          variable: 'y',
          category: topicType,
          csc: topicCSC,
          salindex: salindex,
          topic: topicName,
          item: topicItem,
          isArray: isArray,
          arrayIndex: arrayIndex,
          accessor: accessor,
        },
      ],
    },
  };

  return config;
};

const getGradiantColorX = (value, minGradiantLimit, maxGradiantLimit) => {
  const colorInterpolate = d3
    .scaleLinear()
    .domain(d3.extent([minGradiantLimit, maxGradiantLimit]))
    .range([0, 1]);
  return Gradiant.COLOR_SCALE(1 - colorInterpolate(value));
};

/**
 *
 * @param {object} prevParse dict data of the sensors
 * @param {string} option string between the values (temperature, relativeHumidity, airFlow, airTurbulence)
 * @returns {array} array of the sensors data sorted
 */
const prevParseToArraySensors = (prevParse, option) => {
  const list = prevParse[option] ? Object.values(prevParse[option]) : [];
  const objs = list.map((values) => {
    return Object.values(values);
  });

  const sorted = objs.flat().sort((a, b) => {
    if (a.sensorName > b.sensorName || (a.sensorName === b.sensorName && a.indexArr > b.indexArr)) {
      return 1;
    } else if (a.sensorName < b.sensorName || (a.sensorName === b.sensorName && a.indexArr < b.indexArr)) {
      return -1;
    } else {
      return 0;
    }
  });
  return sorted;
};

const MainTelESS = ({
  devices,
  deviceData,
  percentOpenLouvers,
  percentOpenShutter,
  positionActualDomeAz,
  minGradiantLimit,
  maxGradiantLimit,
  initialCameraPosition,
  subscribeToStreams,
  unsubscribeToStreams,
  ...props
}) => {
  const [selectedSensor, setSelectedSensor] = useState();
  const [inputsPlot, setInputsPlot] = useState({});

  const plotRef = useRef();
  useEffect(() => {
    subscribeToStreams();
    return () => {
      unsubscribeToStreams();
    };
  }, []);

  const inclination = -45;
  // const radius = 8.4 / 2;
  // const scale = 1.3;
  // // const xOffset = 0;
  // // const yOffset = -1.7;
  // // const zOffset = 6;
  const xOffset = 0;
  const yOffset = -1;
  const zOffset = 6.5;
  // const mirrorBorderPoint1 = {
  //   x: 0,
  //   y: -Math.cos(THREE.MathUtils.degToRad(inclination)) * radius * scale + yOffset,
  //   z: Math.sin(THREE.MathUtils.degToRad(inclination)) * radius * scale + zOffset,
  // }
  // const mirrorBorderPoint2 = {
  //   x: Math.cos(THREE.MathUtils.degToRad(inclination)) * radius * scale + xOffset,
  //   y: 0 + yOffset,
  //   z: -Math.sin(THREE.MathUtils.degToRad(inclination)) * radius * scale + zOffset,
  // }
  // const mirrorBorderPoint3 = {
  //   x: 0,
  //   y: Math.cos(THREE.MathUtils.degToRad(inclination)) * radius * scale + yOffset,
  //   z: -Math.sin(THREE.MathUtils.degToRad(inclination)) * radius * scale + zOffset,
  // }
  // const mirrorBorderPoint4 = {
  //   x: -Math.cos(THREE.MathUtils.degToRad(inclination)) * radius * scale + xOffset,
  //   y: 0 + yOffset,
  //   z: -Math.sin(THREE.MathUtils.degToRad(inclination)) * radius * scale + zOffset,
  // }
  // console.log(mirrorBorderPoint1);

  const R = (8.4 / 2) * 1.3; // radius * scale
  const alpha = THREE.MathUtils.degToRad(inclination);

  const center = new THREE.Vector3(xOffset, yOffset, zOffset);

  // rotate the whole circle by alpha about X (change Euler to tilt about Y/Z if wanted)
  const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(alpha, 0, 0, 'XYZ'));

  const thetas = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2];

  const points = thetas.map((t) => {
    const v = new THREE.Vector3(R * Math.cos(t), R * Math.sin(t), 0);
    v.applyQuaternion(q).add(center);
    return { xPosition: v.x, yPosition: v.y, zPosition: v.z };
  });
  // const sensors = [
  //   {
  //     xPosition: 0.5,
  //     yPosition: 4,
  //     zPosition: 14,
  //   },
  //   {
  //     xPosition: 0.5,
  //     yPosition: 3,
  //     zPosition: 13,
  //   },
  //   {
  //     xPosition: 2.5,
  //     yPosition: 1.5,
  //     zPosition: 16.5,
  //   },
  //   {
  //     xPosition: 3,
  //     yPosition: 1.5,
  //     zPosition: 16,
  //   },
  //   {
  //     xPosition: 4.5,
  //     yPosition: 2.0,
  //     zPosition: 15.2,
  //   },
  //   {
  //     xPosition: 6.2,
  //     yPosition: -3,
  //     zPosition: 11,
  //   },
  //   ...points,
  // ];

  // const positions = [];
  // for (let i = 0; i < sensors.length; i++) {
  //   positions.push({
  //     x: sensors[i].xPosition,
  //     y: sensors[i].yPosition,
  //     z: sensors[i].zPosition,
  //   });
  // }

  const positions = [];
  for (let i = 0; i < devices.length; i++) {
    positions.push({
      x: devices[i].position[0],
      y: devices[i].position[1],
      z: devices[i].position[2],
    });
  }
  const louversIds = Array.from({ length: 34 })
    .fill(0)
    .map((_, index) => index + 1);

  const handleSelectedSensor = (deviceIndex) => {
    const device = devices[deviceIndex];
    console.log(device);
    // const selectedSensorData = {
    //   sensorId: sensorId,
    //   telemetry: sensors[index].telemetry,
    //   sensorName: sensors[index].sensorName,
    //   numChannels: sensors[index].numChannels,
    //   indexArr: sensors[index].indexArr,
    //   value: sensors[index].value,
    //   speed: sensors[index].speed,
    //   direction: sensors[index].direction,
    //   location: sensors[index].location,
    //   position: {
    //     x: sensors[index].xPosition,
    //     y: sensors[index].yPosition,
    //     z: sensors[index].zPosition,
    //   },
    // };
    setSelectedSensor(deviceIndex);

    // const telemetry = selectedSensorData?.telemetry ?? 'telemetry-ESS-1-temperature';
    // const indexArr = selectedSensorData?.indexArr !== undefined ? selectedSensorData?.indexArr : undefined;
    // const [_category, _csc, salindex, _topic] = telemetry.split('-');
    // setInputsPlot(getBasePlot(salindex, topic, item, indexArr));
  };

  // const values = sensors.map((sensor) => (!Number.isNaN(+sensor.value) ? +sensor.value : 0)) ?? [];

  const deviceReading = (telemetry) => {
    if (!telemetry) return null;
    const subscription = parseTelemetrySubscription(telemetry);
    const telemetryTokens = telemetry?.split('-');

    const topicItem = telemetryTokens[4];
    const itemData = deviceData?.[subscription]?.[topicItem];
    const arrayIndex = telemetryTokens[5];

    return {
      value: arrayIndex >= 0 ? itemData?.value[arrayIndex] : itemData?.value,
      units: UNITS_MAPPING[itemData?.units],
    };
  };

  const selectedDevice = devices[selectedSensor];
  const selectedDeviceData = {
    ...selectedDevice,
    payload: deviceReading(selectedDevice?.telemetry),
  };
  // console.log(selectedDeviceData);

  const values = devices.map((device) => {
    const reading = deviceReading(device?.telemetry);
    return reading?.value ?? 0;
  });

  const plotInput = useMemo(() => parsePlotInput(selectedDevice?.telemetry), [selectedDevice?.telemetry]);

  return (
    <div className={styles.sceneAndInfoPlotsContainer}>
      <div className={styles.sceneContainer}>
        <Scene initialCameraPosition={initialCameraPosition}>
          {/* <group rotation-y={THREE.MathUtils.degToRad(90 - positionActualDomeAz)}>
            <Louvers ids={louversIds} percentOpen={percentOpenLouvers} />
            <Shutter name={'shutter 0'} position={{ x: 0, y: -3.3, z: 7 }} openPercent={percentOpenShutter[0] ?? 0} />
            <Shutter name={'shutter 1'} position={{ x: 0, y: 3.3, z: 7 }} openPercent={percentOpenShutter[1] ?? 0} />
          </group> */}
          <Sensors
            selectedSensor={selectedSensor}
            setSensor={(id) => handleSelectedSensor(id)}
            positions={positions}
            values={values}
            getGradiantColorX={(val) => getGradiantColorX(val, minGradiantLimit, maxGradiantLimit)}
          />
          <Suspense fallback={null}>
            <Simonyi />
          </Suspense>
        </Scene>
      </div>
      <div className={styles.infoAndPlotsContainer}>
        <div className={styles.infoContainer}>
          <Info sensor={selectedDeviceData} />
        </div>
        {selectedSensor !== undefined && (
          <>
            <div className={styles.tempContainer}>
              <Gradiant
                selectedId={selectedSensor}
                value={selectedDeviceData?.payload?.value}
                minGradiantLimit={minGradiantLimit}
                maxGradiantLimit={maxGradiantLimit}
                title={selectedDevice?.telemetry}
              />
            </div>
            <div className={styles.plotsContainer}>
              <div className={styles.plots} ref={plotRef}>
                <PlotContainer
                  key={selectedSensor}
                  containerNode={plotRef}
                  xAxisTitle="Time"
                  legendPosition="bottom"
                  inputs={plotInput}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

MainTelESS.propTypes = {
  /** Function to subscribe to streams to receive */
  subscribeToStreams: PropTypes.func,
  /** Function to unsubscribe to streams to stop receiving */
  unsubscribeToStreams: PropTypes.func,
  temperature: PropTypes.arrayOf(
    PropTypes.shape({
      sensorName: PropTypes.string,
      value: PropTypes.number,
      indexArr: PropTypes.number,
      location: PropTypes.string,
      numChannels: PropTypes.number,
      xPosition: PropTypes.number,
      yPosition: PropTypes.number,
      zPosition: PropTypes.number,
      timestamp: PropTypes.number,
    }),
  ),
  relativeHumidity: PropTypes.arrayOf(
    PropTypes.shape({
      sensorName: PropTypes.string,
      value: PropTypes.number,
      location: PropTypes.string,
      xPosition: PropTypes.number,
      yPosition: PropTypes.number,
      zPosition: PropTypes.number,
      timestamp: PropTypes.number,
    }),
  ),
  airFlow: PropTypes.arrayOf(
    PropTypes.shape({
      sensorName: PropTypes.string,
      value: PropTypes.number,
      direction: PropTypes.number,
      location: PropTypes.string,
      xPosition: PropTypes.number,
      yPosition: PropTypes.number,
      zPosition: PropTypes.number,
      timestamp: PropTypes.number,
    }),
  ),
  airTurbulence: PropTypes.arrayOf(
    PropTypes.shape({
      sensorName: PropTypes.string,
      value: PropTypes.number,
      location: PropTypes.string,
      xPosition: PropTypes.number,
      yPosition: PropTypes.number,
      zPosition: PropTypes.number,
      timestamp: PropTypes.number,
    }),
  ),
  minGradiantLimit: PropTypes.number,
  maxGradiantLimit: PropTypes.number,
  option: PropTypes.oneOf(['temperature', 'relativeHumidity', 'airFlow', 'airTurbulence']),
  percentOpenLouvers: PropTypes.arrayOf(PropTypes.number),
  percentOpenShutter: PropTypes.arrayOf(PropTypes.number),
  positionActualDomeAz: PropTypes.number,
};

// MainTelESS.defaultProps = {
//   temperature: [],
//   relativeHumidity: [],
//   airFlow: [],
//   airTurbulence: [],
//   minGradiantLimit: -20,
//   maxGradiantLimit: 40,
//   option: 'temperature',
//   percentOpenLouvers: [],
//   percentOpenShutter: [],
//   positionActualDomeAz: 0,
// };

// const comparator = (prevProps, nextProps) => {
//   return (
//     isEqual(prevProps.subscriptions, nextProps.subscriptions) &&
//     isEqual(prevProps.percentOpenLouvers, nextProps.percentOpenLouvers) &&
//     isEqual(prevProps.percentOpenShutter, nextProps.percentOpenShutter) &&
//     prevProps.positionActualDomeAz === nextProps.positionActualDomeAz &&
//     prevProps.option === nextProps.option &&
//     isEqual(prevProps[nextProps.option], nextProps[nextProps.option])
//   );
// };

// export default React.memo(MainTelESS, comparator);

export default MainTelESS;
