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

import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import * as d3 from 'd3';
import * as THREE from 'three';
import Scene from './Scene/Scene';
import Info from '../Common/Info/Info';
import Gradiant from '../Common/Gradiant/Gradiant';

import { Sensors } from '../Common/Sensors';
import { Louvers } from './Scene/Louvers';
import { Shutter } from './Scene/Shutter';

import PlotContainer from 'components/GeneralPurpose/Plot/Plot.container';
import styles from './MainTelESS.module.css';

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

const MainTelESS = (props) => {
  const [selectedSensor, setSelectedSensor] = useState(0);
  const [selectedSensorData, setSelectedSensorData] = useState({});
  const [inputsPlot, setInputsPlot] = useState({});
  const [prevParseSensors, setPrevParseSensors] = useState({});
  const [sensors, setSensors] = useState([]);

  const plotRef = useRef();
  useEffect(() => {
    props.subscribeToStreams();
    return () => {
      props.unsubscribeToStreams();
    };
  }, []);

  useEffect(() => {
    const option = props.option;
    props[option].forEach((parse) => {
      if (!prevParseSensors[option]) {
        const opt = {};
        opt[option] = {};
        setPrevParseSensors({...prevParseSensors, ...opt});
      }
      if (prevParseSensors[option] && !prevParseSensors[option][parse.sensorName]) {
        const opt = {};
        opt[option] = prevParseSensors[option];
        opt[option][parse.sensorName] = {};
        setPrevParseSensors({...prevParseSensors, ...opt});
      }
      if (prevParseSensors[option] &&
          prevParseSensors[option][parse.sensorName]
      ) {
        const opt = {};
        opt[option] = prevParseSensors[option];
        opt[option][parse.sensorName] = prevParseSensors[option][parse.sensorName];
        opt[option][parse.sensorName][parse.indexArr] = parse;
        setPrevParseSensors({...prevParseSensors, ...opt});
      }
    });
    setSensors(prevParseToArraySensors(prevParseSensors, option));
    return () => {};
  }, [props.option, props[props.option]]);

  const {
    minGradiantLimit,
    maxGradiantLimit,
    percentOpenLouvers,
    percentOpenShutter,
    positionActualDomeAz,
    initialCameraPosition,
  } = props;

  const option = props.option ?? 'temperature';
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
  const louversIds = Array.from({ length: 34 })
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
          <group rotation-y={THREE.MathUtils.degToRad(90 - positionActualDomeAz)}>
            <Louvers ids={louversIds} percentOpen={percentOpenLouvers} />

            <Shutter name={'shutter 0'} position={{ x: 0, y: -3.3, z: 7 }} openPercent={percentOpenShutter[0] ?? 0} />

            <Shutter name={'shutter 1'} position={{ x: 0, y: 3.3, z: 7 }} openPercent={percentOpenShutter[1] ?? 0} />
          </group>
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

        <div className={styles.plotsContainer}>
          <div className={styles.title}>Plot</div>
          <div className={styles.plots} ref={plotRef}>
            <PlotContainer containerNode={plotRef} xAxisTitle="Time" legendPosition="bottom" inputs={inputsPlot} />
          </div>
        </div>
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

MainTelESS.defaultProps = {
  temperature: [],
  relativeHumidity: [],
  airFlow: [],
  airTurbulence: [],
  minGradiantLimit: -20,
  maxGradiantLimit: 40,
  option: 'temperature',
  percentOpenLouvers: [],
  percentOpenShutter: [],
  positionActualDomeAz: 0,
};

const comparator = (prevProps, nextProps) => {
  return (
    isEqual(prevProps.subscriptions, nextProps.subscriptions) &&
    isEqual(prevProps.percentOpenLouvers, nextProps.percentOpenLouvers) &&
    isEqual(prevProps.percentOpenShutter, nextProps.percentOpenShutter) &&
    prevProps.positionActualDomeAz === nextProps.positionActualDomeAz &&
    prevProps.option === nextProps.option &&
    isEqual(prevProps[nextProps.option], nextProps[nextProps.option])
  );
};

export default React.memo(MainTelESS, comparator);