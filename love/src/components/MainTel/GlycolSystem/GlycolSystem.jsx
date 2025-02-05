import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import SimpleTable from 'components/GeneralPurpose/SimpleTable/SimpleTable';
import StatusText from 'components/GeneralPurpose/StatusText/StatusText';
import EyeIcon from 'components/icons/EyeIcon/EyeIcon';
import Map from 'components/MainTel/GlycolSystem/Map/Map';
import { summaryStateMap, summaryStateToStyle } from 'Config';
import styles from './GlycolSystem.module.css';

const dummySummaryState = 2;

const dummyGlycolTableData = [
  {
    device: 'Chiller 1',
    pressureIn: 100,
    pressureOut: 200,
    temperatureIn: 20,
    temperatureOut: 30,
    flowRate: 1,
    heatExchange: 1000,
  },
  {
    device: 'Chiller 2',
    pressureIn: 200,
    pressureOut: 300,
    temperatureIn: 30,
    temperatureOut: 40,
    flowRate: 2,
    heatExchange: 2000,
  },
  {
    device: 'Chiller 3',
    pressureIn: 300,
    pressureOut: 400,
    temperatureIn: 40,
    temperatureOut: 50,
    flowRate: 3,
    heatExchange: 3000,
  },
  {
    device: 'OSS',
    pressureIn: 400,
    pressureOut: 500,
    temperatureIn: 50,
    temperatureOut: 60,
    flowRate: 4,
    heatExchange: 4000,
  },
  {
    device: 'SLAC',
    pressureIn: 500,
    pressureOut: 600,
    temperatureIn: 60,
    temperatureOut: 70,
    flowRate: 5,
    heatExchange: 5000,
  },
  {
    device: 'CRAC 1',
    pressureIn: 600,
    pressureOut: 700,
    temperatureIn: 70,
    temperatureOut: 80,
    flowRate: 6,
    heatExchange: 6000,
  },
  {
    device: 'CRAC 2',
    pressureIn: 700,
    pressureOut: 800,
    temperatureIn: 80,
    temperatureOut: 90,
    flowRate: 7,
    heatExchange: 7000,
  },
  {
    device: 'AHU CR',
    pressureIn: 800,
    pressureOut: 900,
    temperatureIn: 90,
    temperatureOut: 100,
    flowRate: 8,
    heatExchange: 8000,
  },
  {
    device: 'AHU WR',
    pressureIn: 900,
    pressureOut: 1000,
    temperatureIn: 100,
    temperatureOut: 110,
    flowRate: 9,
    heatExchange: 9000,
  },
  {
    device: 'DOME AHU 1',
    pressureIn: 1200,
    pressureOut: 1300,
    temperatureIn: 130,
    temperatureOut: 140,
    flowRate: 12,
    heatExchange: 12000,
  },
  {
    device: 'DOME AHU 2',
    pressureIn: 1200,
    pressureOut: 1300,
    temperatureIn: 130,
    temperatureOut: 140,
    flowRate: 12,
    heatExchange: 12000,
  },
  {
    device: 'DOME AHU 3',
    pressureIn: 1200,
    pressureOut: 1300,
    temperatureIn: 130,
    temperatureOut: 140,
    flowRate: 12,
    heatExchange: 12000,
  },
  {
    device: 'DOME AHU 4',
    pressureIn: 1200,
    pressureOut: 1300,
    temperatureIn: 130,
    temperatureOut: 140,
    flowRate: 12,
    heatExchange: 12000,
  },
  {
    device: 'LOC 10',
    pressureIn: 1200,
    pressureOut: 1300,
    temperatureIn: 130,
    temperatureOut: 140,
    flowRate: 12,
    heatExchange: 12000,
  },
  {
    device: 'Dynalene 1',
    pressureIn: 1000,
    pressureOut: 1100,
    temperatureIn: 110,
    temperatureOut: 120,
    flowRate: 10,
    heatExchange: 10000,
  },
  {
    device: 'Dynalene 2',
    pressureIn: 1200,
    pressureOut: 1300,
    temperatureIn: 130,
    temperatureOut: 140,
    flowRate: 12,
    heatExchange: 12000,
  },
  {
    device: 'TMA',
    pressureIn: 1100,
    pressureOut: 1200,
    temperatureIn: 120,
    temperatureOut: 130,
    flowRate: 11,
    heatExchange: 11000,
  },
  {
    device: 'Cable Wrap',
    pressureIn: 1200,
    pressureOut: 1300,
    temperatureIn: 130,
    temperatureOut: 140,
    flowRate: 12,
    heatExchange: 12000,
  },
];

const devicesLevelMapping = {
  'Chiller 1': 1,
  'Chiller 2': 1,
  'Chiller 3': 1,
  OSS: 1,
  SLAC: 1,
  'L2 CRACS': 2,
  'L2 Fan Coils': 2,
  'AHU CR': 4,
  'AHU WR': 4,
  'DOME AHU 1': 5,
  'DOME AHU 2': 5,
  'DOME AHU 3': 5,
  'DOME AHU 4': 5,
  'Dynalene 1': 5,
  'Dynalene 2': 5,
  TMA: 5,
  'LOC 10': 5,
  'Cable Wrap': 5,
};

const devicesCoordinatesMapping = {
  'Chiller 1': { x: 810, y: 50 },
  'Chiller 2': { x: 810, y: 110 },
  'Chiller 3': { x: 810, y: 190 },
  OSS: { x: 600, y: 190 },
  SLAC: { x: 600, y: 120 },
  'CRAC 1': { x: 635, y: 20 },
  'CRAC 2': { x: 635, y: 80 },
  'AHU CR': { x: 300, y: 80 },
  'AHU WR': { x: 360, y: 50 },
  'DOME AHU 1': { x: 20, y: 80 },
  'DOME AHU 2': { x: 200, y: 60 },
  'DOME AHU 3': { x: 25, y: 220 },
  'DOME AHU 4': { x: 230, y: 220 },
  'Dynalene 1': { x: 130, y: 160 },
  'Dynalene 2': { x: 130, y: 160 },
  TMA: { x: 130, y: 160 },
  'LOC 10': { x: 130, y: 160 },
  'Cable Wrap': { x: 130, y: 160 },
};

function HVACStatus({ summaryState = 0 }) {
  const stateName = summaryStateMap[summaryState];
  const stateStyle = summaryStateToStyle[stateName];
  const LTChillerTotalHeat = 100;
  const LTChillerErrorHeat = 5;
  const GPChillerTotalHeat = 200;
  const GPChillerErrorHeat = 10;

  const highLightBiggerClassName = [styles.highlight, styles.bigger].join(' ');
  return (
    <div className={styles.hvacStatusContainer}>
      <div className={styles.summaryState}>
        <div className={styles.highlight}>HVAC Status</div>
        <StatusText status={stateStyle}>{stateName}</StatusText>
      </div>
      <div className={styles.chillerInfo}>
        <div className={styles.highlight}>LT Chiller</div>
        <div>Total</div>
        <div className={highLightBiggerClassName}>{LTChillerTotalHeat} kW</div>
        <div>Error</div>
        <div className={highLightBiggerClassName}>{LTChillerErrorHeat} %</div>
      </div>
      <div className={styles.chillerInfo}>
        <div className={styles.highlight}>GP Chiller</div>
        <div>Total</div>
        <div className={highLightBiggerClassName}>{GPChillerTotalHeat} kW</div>
        <div>Error</div>
        <div className={highLightBiggerClassName}>{GPChillerErrorHeat} %</div>
      </div>
    </div>
  );
}

HVACStatus.propTypes = {
  /** Summary state of the HVAC system */
  summaryState: PropTypes.number.isRequired,
};

function GlycolSummary({ data, selectedDevice, selectDevice }) {
  const devicesHeats = [
    {
      device: 'Chiller 1',
      heat: 10,
    },
    {
      device: 'Chiller 2',
      heat: 20,
    },
    {
      device: 'Chiller 3',
      heat: 30,
    },
    {
      device: 'OSS',
      heat: 40,
    },
    {
      device: 'SLAC',
      heat: 50,
    },
    {
      device: 'CRAC 1',
      heat: 50,
    },
    {
      device: 'CRAC 2',
      heat: 50,
    },
    {
      device: 'AHU CR',
      heat: 50,
    },
    {
      device: 'AHU WR',
      heat: 50,
    },
    {
      device: 'DOME AHU 1',
      heat: 50,
    },
    {
      device: 'DOME AHU 2',
      heat: 50,
    },
    {
      device: 'DOME AHU 3',
      heat: 50,
    },
    {
      device: 'DOME AHU 4',
      heat: 50,
    },
    {
      device: 'Dynalene 1',
      heat: 50,
    },
    {
      device: 'Dynalene 2',
      heat: 100,
    },
    {
      device: 'TMA',
      heat: 50,
    },
    {
      device: 'LOC 10',
      heat: 50,
    },
    {
      device: 'Cable Wrap',
      heat: 50,
    },
  ];

  const heatThreshold = 100;

  return (
    <div className={styles.summaryContainer}>
      <div className={styles.devicesBoxes}>
        {devicesHeats.map(({ device, heat }) => {
          const overThreshold = heat >= heatThreshold;
          return (
            <div key={device} className={[styles.deviceBox, overThreshold ? styles.heatWarning : ''].join(' ')}>
              <div className={styles.highlightTitle}>{device}</div>
              <div className={[styles.highlight, styles.bigger].join(' ')}>{heat} W</div>
              <div title="Show device location" onClick={() => selectDevice(device)}>
                <EyeIcon className={styles.selectDeviceButton} active={selectedDevice === device} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

GlycolSummary.propTypes = {
  /** Data to show in the summary */
  data: PropTypes.array,
  /** Device selected */
  selectedDevice: PropTypes.string,
  /** Function to select a device */
  selectDevice: PropTypes.func.isRequired,
};

function GlycolMap({ device }) {
  const [showMap, setShowMap] = useState(true);

  const level = devicesLevelMapping[device];
  const coordinates = devicesCoordinatesMapping[device];

  return (
    <>
      {device && (
        <div
          title={!showMap ? 'Show Map' : 'Hide Map'}
          className={styles.showMapButtonContainer}
          onClick={() => setShowMap(!showMap)}
        >
          <div>{!showMap ? 'Show Map' : 'Hide Map'}</div>
          <div className={showMap ? '' : styles.hidden}>▲</div>
        </div>
      )}
      {showMap && (
        <div className={styles.mapContainer}>
          <Map level={level} />
          <svg className={styles.deviceOverlay} viewBox="0 0 882.42 461.23">
            <rect x={coordinates.x} y={coordinates.y} width="64" height="64" fill="transparent" stroke="red" />
          </svg>
        </div>
      )}
    </>
  );
}

GlycolMap.propTypes = {
  /** Device selected */
  device: PropTypes.string,
};

function GlycolTable({ data, device }) {
  const headers = [
    {
      field: 'device',
      title: 'Device',
    },
    {
      field: 'pressureIn',
      title: 'Pressure In [Pa]',
    },
    {
      field: 'pressureOut',
      title: 'Pressure Out [Pa]',
    },
    {
      field: 'temperatureIn',
      title: 'Temperature In [°C]',
    },
    {
      field: 'temperatureOut',
      title: 'Temperature Out [°C]',
    },
    {
      field: 'flowRate',
      title: 'Flow Rate [L/min]',
    },
    {
      field: 'heatExchange',
      title: 'Heat Exchange (Q) [W]',
    },
  ];

  const dataWithSelectedDevice = data.map((row) => {
    return {
      ...row,
      rowClass: row.device === device ? styles.selectedRow : '',
    };
  });

  return <SimpleTable headers={headers} data={device ? dataWithSelectedDevice : data} />;
}

GlycolTable.propTypes = {
  /** Data to show in the table */
  data: PropTypes.array.isRequired,
  /** Device selected */
  device: PropTypes.string,
};

function GlycolSystem({ subscribeToStreams, unsubscribeToStreams }) {
  const [selectedDevice, setSelectedDevice] = useState();

  useEffect(() => {
    subscribeToStreams();
    return () => {
      unsubscribeToStreams();
    };
  }, []);

  return (
    <div className={styles.container}>
      <HVACStatus summaryState={dummySummaryState} />
      <GlycolSummary selectedDevice={selectedDevice} selectDevice={setSelectedDevice} />
      {selectedDevice && <GlycolMap device={selectedDevice} />}
      <GlycolTable data={dummyGlycolTableData} device={selectedDevice} />
    </div>
  );
}

GlycolSystem.propTypes = {
  /** Function to subscribe to streams */
  subscribeToStreams: PropTypes.func.isRequired,
  /** Function to unsubscribe to streams */
  unsubscribeToStreams: PropTypes.func.isRequired,
};

export default GlycolSystem;
