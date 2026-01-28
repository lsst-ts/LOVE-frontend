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

import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import * as d3 from 'd3';
import * as THREE from 'three';
import Scene from './Scene/Scene';
import Info from '../Common/Info/Info';
import Gradiant from '../Common/Gradiant/Gradiant';
import { Sensors } from '../Common/Sensors';
import { Door } from './Scene/Door';
import { Fan } from './Scene/Fan';
import PlotContainer from 'components/GeneralPurpose/Plot/Plot.container';
import styles from './AuxTelESS.module.css';

const getBasePlot = (salindex, topic, item, indexArr = undefined) => {
  const config = {};
  const accessor = indexArr !== undefined ? `(x) => x[${indexArr}]` : '(x) => x';
  config[`${topic}`] = {
    type: 'line',
    // 'color': '#ff7f0e',
    dash: [4, 0],
    values: [
      {
        variable: 'x',
        category: 'telemetry',
        csc: 'ESS',
        salindex: salindex,
        topic: topic,
        item: 'timestamp',
        accessor: accessor,
      },
      {
        variable: 'y',
        category: 'telemetry',
        csc: 'ESS',
        salindex: salindex,
        topic: topic,
        item: item,
        accessor: accessor,
      },
    ],
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

const AuxTelESS = ({
  subscribeToStreams = () => console.log('default subscribeToStreams'),
  unsubscribeToStreams = () => console.log('default unsubscribeToStreams'),
  temperature = [],
  relativeHumidity = [],
  airFlow = [],
  airTurbulence = [],
  minGradiantLimit = -20,
  maxGradiantLimit = 40,
  option = 'temperature',
  percentOpenDropoutDoor = 0,
  percentOpenMainDoor = 0,
  azimuthPosition = 0,
  initialCameraPosition,
  ...props
}) => {
  const [selectedSensor, setSelectedSensor] = useState(0);
  const [selectedSensorData, setSelectedSensorData] = useState({});
  const [inputsPlot, setInputsPlot] = useState({});
  const [prevParseSensors, setPrevParseSensors] = useState({});
  const [sensors, setSensors] = useState([]);
  const plotRef = useRef();

  useEffect(() => {
    subscribeToStreams();
    return () => {
      unsubscribeToStreams();
    };
  }, []);

  const optionData = { temperature, relativeHumidity, airFlow, airTurbulence };

  useEffect(() => {
    optionData[option].forEach((parse) => {
      if (!prevParseSensors[option]) {
        const opt = {};
        opt[option] = {};
        setPrevParseSensors({ ...prevParseSensors, ...opt });
      }
      if (prevParseSensors[option] && !prevParseSensors[option][parse.sensorName]) {
        const opt = {};
        opt[option] = prevParseSensors[option];
        opt[option][parse.sensorName] = {};
        setPrevParseSensors({ ...prevParseSensors, ...opt });
      }
      if (prevParseSensors[option] && prevParseSensors[option][parse.sensorName]) {
        const opt = {};
        opt[option] = prevParseSensors[option];
        opt[option][parse.sensorName] = prevParseSensors[option][parse.sensorName];
        opt[option][parse.sensorName][parse.indexArr] = parse;
        setPrevParseSensors({ ...prevParseSensors, ...opt });
      }
    });
    setSensors(prevParseToArraySensors(prevParseSensors, option));
    return () => {};
  }, [option, optionData[option]]);

  const fans = [
    {
      position: {
        x: Math.sin(THREE.MathUtils.degToRad(315)) * 4.47,
        y: Math.cos(THREE.MathUtils.degToRad(315)) * 4.47,
        z: -1.15 - 0.8 - 1,
      },
      angle: 315,
      percentOpen: 50,
      width: 1.93,
      height: 1.5,
    },
    {
      position: {
        x: Math.sin(THREE.MathUtils.degToRad(26)) * 4.47,
        y: Math.cos(THREE.MathUtils.degToRad(26)) * 4.47,
        z: -1.15 - 0.8 - 1,
      },
      angle: 26,
      percentOpen: 70,
      width: 1.93,
      height: 1.5,
    },
    {
      position: {
        x: Math.sin(THREE.MathUtils.degToRad(97)) * 4.47,
        y: Math.cos(THREE.MathUtils.degToRad(97)) * 4.47,
        z: -1.15 - 0.8 - 1,
      },
      angle: 97,
      percentOpen: 30,
      width: 1.93,
      height: 1.5,
    },
    {
      position: {
        x: Math.sin(THREE.MathUtils.degToRad(172)) * 4.47,
        y: Math.cos(THREE.MathUtils.degToRad(172)) * 4.47,
        z: -1.15 - 0.8 - 1,
      },
      angle: 172,
      percentOpen: 100,
      width: 1.93,
      height: 1.5,
    },
  ];

  const positions = [];
  for (let i = 0; i < sensors.length; i++) {
    positions.push({
      x: sensors[i].xPosition,
      y: sensors[i].yPosition,
      z: sensors[i].zPosition,
    });
  }
  const referenceIds = Array.from({ length: sensors.length })
    .fill(0)
    .map((_, index) => index + 1);

  const items = {
    temperature: 'temperature',
    relativeHumidity: 'relativeHumidity',
    airFlow: 'speed',
    airTurbulence: 'speedMagnitude',
  };
  const setSensor = (sensorId) => {
    const index = referenceIds.indexOf(sensorId);
    const selectedSensorData = {
      sensorId: sensorId,
      telemetry: sensors[index].telemetry,
      sensorName: sensors[index].sensorName,
      numChannels: sensors[index].numChannels,
      indexArr: sensors[index].indexArr,
      value: sensors[index].value,
      speed: sensors[index].speed,
      direction: sensors[index].direction,
      location: sensors[index].location,
      position: {
        x: sensors[index].xPosition,
        y: sensors[index].yPosition,
        z: sensors[index].zPosition,
      },
    };
    setSelectedSensor(sensorId);
    setSelectedSensorData(selectedSensorData);
    const telemetry = selectedSensorData?.telemetry ?? 'telemetry-ESS-1-temperature';
    const indexArr = selectedSensorData?.indexArr !== undefined ? selectedSensorData?.indexArr : undefined;
    const [_category, _csc, salindex, _topic] = telemetry.split('-');

    const topic = option;
    const item = items[option] ?? option;
    setInputsPlot(getBasePlot(salindex, topic, item, indexArr));
  };

  const values = sensors.map((sensor) => (!Number.isNaN(+sensor.value) ? +sensor.value : 0)) ?? [];
  const speeds = sensors.map((sensor) => sensor.speed) ?? [];
  const directions = sensors.map((sensor) => sensor.direction) ?? [];

  return (
    <div className={styles.sceneAndInfoPlotsContainer}>
      <div className={styles.sceneContainer}>
        <Scene initialCameraPosition={initialCameraPosition}>
          <group rotation-y={THREE.MathUtils.degToRad(-1 * azimuthPosition)}>
            {/** Main Door */}
            <Door isMainDoor={true} thetaStart={28} thetaLength={84} openPercent={percentOpenMainDoor ?? 0} />

            {/** Dropout Door */}
            <Door isMainDoor={false} thetaStart={0} thetaLength={27.9} openPercent={percentOpenDropoutDoor ?? 0} />
          </group>

          {/** Windows */}
          {fans.map((fan) => {
            return (
              <Fan
                key={`fan-${fan.angle}`}
                position={fan.position}
                percentOpen={fan.percentOpen}
                angle={fan.angle}
                width={fan.width}
                height={fan.height}
              />
            );
          })}

          <Sensors
            selectedSensor={selectedSensor}
            setSensor={(id) => setSensor(id)}
            positions={positions}
            values={values}
            speeds={speeds}
            directions={directions}
            getGradiantColorX={(val) => getGradiantColorX(val, minGradiantLimit, maxGradiantLimit)}
          />
        </Scene>
      </div>

      <div className={styles.infoAndPlotsContainer}>
        <div className={styles.infoContainer}>
          <Info sensor={selectedSensorData} />
        </div>

        <div className={styles.tempContainer}>
          <Gradiant
            sensorReferenceId={referenceIds}
            selectedId={selectedSensor}
            setpoint={selectedSensorData?.value}
            absoluteGradiant={values}
            minGradiantLimit={minGradiantLimit}
            maxGradiantLimit={maxGradiantLimit}
            option={option}
          />
        </div>

        <div>
          <div className={styles.title}>Plot</div>
          <div className={styles.plots} ref={plotRef}>
            <PlotContainer containerNode={plotRef} xAxisTitle="Time" legendPosition="bottom" inputs={inputsPlot} />
          </div>
        </div>
      </div>
    </div>
  );
};

AuxTelESS.propTypes = {
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
  percentOpenDropoutDoor: PropTypes.number,
  percentOpenMainDoor: PropTypes.number,
  azimuthPosition: PropTypes.number,
};

const comparator = (prevProps, nextProps) => {
  return (
    isEqual(prevProps.subscriptions, nextProps.subscriptions) &&
    prevProps.percentOpenDropoutDoor === nextProps.percentOpenDropoutDoor &&
    prevProps.percentOpenMainDoor === nextProps.percentOpenMainDoor &&
    prevProps.azimuthPosition === nextProps.azimuthPosition &&
    prevProps.option === nextProps.option &&
    isEqual(prevProps[nextProps.option], nextProps[nextProps.option])
  );
};

export default React.memo(AuxTelESS, comparator);
