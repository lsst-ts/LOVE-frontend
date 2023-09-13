import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import * as d3 from 'd3';
import * as THREE from "three";
import Scene from './Scene/Scene';
import Info from '../Common/Info/Info';
import Gradiant from '../Common/Gradiant/Gradiant';

import { Sensors } from '../Common/Sensors';
import { Louvers } from './Scene/Louvers';
import { Shutter } from './Scene/Shutter';

import PlotContainer from 'components/GeneralPurpose/Plot/Plot.container';
import styles from './MainTelESS.module.css';

const getBasePlot = (salindex, topic, item, indexArr=undefined) => {
  const config = {};
  const accessor = indexArr !== undefined ? `(x) => x[${indexArr}]` : '(x) => x';
  config[`${topic}`] = {
    'type': 'line',
    // 'color': '#ff7f0e',
    'dash': [
      4,
      0
    ],
    'values': [
      {
        'variable': 'x',
        'category': 'telemetry',
        'csc': 'ESS',
        'salindex': salindex,
        'topic': topic,
        'item': 'timestamp',
        'accessor': accessor,
      },
      {
        'variable': 'y',
        'category': 'telemetry',
        'csc': 'ESS',
        'salindex': salindex,
        'topic': topic,
        'item': item,
        'accessor': accessor,
      }
    ]
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

const MainTelESS = (props) => {

  useEffect(() => {
    props.subscribeToStreams();
    return () => {
      props.unsubscribeToStreams();
    };
  }, []);

  const {
    minGradiantLimit, maxGradiantLimit,
    percentOpenLouvers, percentOpenShutter, positionActualDomeAz,
    initialCameraPosition
  } = props;

  const [selectedSensor, setSelectedSensor] = useState(0);
  const [selectedSensorData, setSelectedSensorData] = useState({});
  const [inputsPlot, setInputsPlot] = useState({});
  const plotRef = useRef();

  const option = props.option ?? 'temperature';
  const positions = [];
  for(let i = 0; i < props[option].length; i++) {
    positions.push({
      x: props[option][i].xPosition,
      y: props[option][i].yPosition,
      z: props[option][i].zPosition,
    });
  }
  const referenceIds = Array.from({length: props[option].length}).fill(0).map((_, index) => index + 1);
  const louversIds = Array.from({length: 34}).fill(0).map((_, index) => index + 1);
  const items = {
    'temperature': 'temperature',
    'relativeHumidity': 'relativeHumidity',
    'airFlow': 'speed',
    'airTurbulence' : 'speedMagnitude',
  };
  const setSensor = (sensorId) => {
    const index = referenceIds.indexOf(sensorId);
    const selectedSensorData = {
      sensorId: sensorId,
      telemetry: props[option][index].telemetry,
      sensorName: props[option][index].sensorName,
      numChannels: props[option][index].numChannels,
      indexArr: props[option][index].indexArr,
      value: props[option][index].value,
      speed: props[option][index].speed,
      direction: props[option][index].direction,
      location: props[option][index].location,
      position: {
        x: props[option][index].xPosition,
        y: props[option][index].yPosition,
        z: props[option][index].zPosition,
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

  const sensors = props[option] ?? [];
  const values = sensors.map((sensor) => !Number.isNaN(+sensor.value) ? +sensor.value : 0 ) ?? [];
  const speeds = sensors.map((sensor) => sensor.speed ?? undefined) ?? [];
  const directions = sensors.map((sensor) => sensor.direction ?? undefined) ?? [];

  return (
    <div className={styles.sceneAndInfoPlotsContainer}>

      <div className={styles.sceneContainer}>
        <Scene
          initialCameraPosition={initialCameraPosition}
        >
          <group
            rotation-y={THREE.MathUtils.degToRad(90 - positionActualDomeAz)}
          >
            <Louvers
              ids={louversIds}
              percentOpen={percentOpenLouvers}
            />

            <Shutter
              name={'shutter 0'}
              position={{x: 0, y: -3.3, z: 7}}
              openPercent={percentOpenShutter[0] ?? 0}
            />

            <Shutter
              name={'shutter 1'}
              position={{x: 0, y: 3.3, z: 7}}
              openPercent={percentOpenShutter[1] ?? 0}
            />
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
          <Info
            sensor={selectedSensorData}
          />
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
          <div className={styles.plots} ref={plotRef} >
            <PlotContainer
              containerNode={plotRef?.current}
              xAxisTitle="Time"
              legendPosition="bottom"
              inputs={inputsPlot}
            />
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
   temperature: PropTypes.arrayOf(PropTypes.shape({
     sensorName: PropTypes.string,
     value: PropTypes.number,
     indexArr: PropTypes.number,
     location: PropTypes.string,
     numChannels: PropTypes.number,
     xPosition: PropTypes.number,
     yPosition: PropTypes.number,
     zPosition: PropTypes.number,
   })),
   relativeHumidity: PropTypes.arrayOf(PropTypes.shape({
     sensorName: PropTypes.string,
     value: PropTypes.number,
     location: PropTypes.string,
     xPosition: PropTypes.number,
     yPosition: PropTypes.number,
     zPosition: PropTypes.number,
   })),
   airFlow: PropTypes.arrayOf(PropTypes.shape({
     sensorName: PropTypes.string,
     value: PropTypes.number,
     direction: PropTypes.number,
     location: PropTypes.string,
     xPosition: PropTypes.number,
     yPosition: PropTypes.number,
     zPosition: PropTypes.number,
   })),
   airTurbulence: PropTypes.arrayOf(PropTypes.shape({
     sensorName: PropTypes.string,
     value: PropTypes.number,
     location: PropTypes.string,
     xPosition: PropTypes.number,
     yPosition: PropTypes.number,
     zPosition: PropTypes.number,
   })),
   minGradiantLimit: PropTypes.number,
   maxGradiantLimit: PropTypes.number,
   option: PropTypes.oneOf(['temperature', 'relativeHumidity', 'airFlow', 'airTurbulence']),
   percentOpenLouvers: PropTypes.arrayOf(PropTypes.number),
   percentOpenShutter: PropTypes.arrayOf(PropTypes.number),
   positionActualDomeAz: PropTypes.number,
};

MainTelESS.defaultProps = {
  temperature: [{
    sensorName: '',
    value: 0,
    indexArr: 0,
    numChannels: 0,
    xPosition: 0,
    yPosition: 0,
    zPosition: 0,
  }],
  relativeHumidity: [{
    sensorName: '',
    value: 0,
    xPosition: 0,
    yPosition: 0,
    zPosition: 0,
  }],
  airFlow: [{
    sensorName: '',
    value: 0,
    direction: 0,
    xPosition: 0,
    yPosition: 0,
    zPosition: 0,
  }],
  airTurbulence: [{
    sensorName: '',
    value: 0,
    speed: {x: 0, y:0, z: 0},
    xPosition: 0,
    yPosition: 0,
    zPosition: 0,
  }],
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
