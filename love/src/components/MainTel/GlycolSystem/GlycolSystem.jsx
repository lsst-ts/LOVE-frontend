import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import SimpleTable from 'components/GeneralPurpose/SimpleTable/SimpleTable';
import StatusText from 'components/GeneralPurpose/StatusText/StatusText';
import EyeIcon from 'components/icons/EyeIcon/EyeIcon';
import Map from 'components/MainTel/GlycolSystem/Map/Map';
import { summaryStateMap, summaryStateToStyle } from 'Config';
import { defaultNumberFormatter } from 'Utils';
import styles from './GlycolSystem.module.css';

const dummySummaryState = 2;

const telemetriesMapping = {
  'Chiller 1': {
    flow: 'glycolCH01flow',
    tempIn: 'glycolCH01temperatureIn',
    tempOut: 'glycolCH01temperatureOut',
    pressIn: 'glycolCH01pressureIn',
    pressOut: 'glycolCH01pressureOut',
  },
  'Chiller 2': {
    flow: 'glycolCH02flow',
    tempIn: 'glycolCH02temperatureIn',
    tempOut: 'glycolCH02temperatureOut',
    pressIn: 'glycolCH02pressureIn',
    pressOut: 'glycolCH02pressureOut',
  },
  'Chiller 3': {
    flow: 'glycolCH03flow',
    tempIn: 'glycolCH03temperatureIn',
    tempOut: 'glycolCH03temperatureOut',
    pressIn: 'glycolCH03pressureIn',
    pressOut: 'glycolCH03pressureOut',
  },
  OSS: {
    flow: 'glycolOSSflow',
    tempIn: 'glycolOSStemperatureIn',
    tempOut: 'glycolOSStemperatureOut',
    pressIn: 'glycolOSSpressureIn',
    pressOut: 'glycolOSSpressureOut',
  },
  SLAC: {
    flow: 'glycolSLACflow',
    tempIn: 'glycolSLACtemperatureIn',
    tempOut: 'glycolSLACtemperatureOut',
    pressIn: 'glycolSLACpressureIn',
    pressOut: 'glycolSLACpressureOut',
  },
  'L2 CRACS': {
    flow: 'glycoL2CRACSflow',
    tempIn: 'glycoL2CRACStemperatureIn',
    tempOut: 'glycoL2CRACStemperatureOut',
    pressIn: 'glycoL2CRACSpressureIn',
    pressOut: 'glycoL2CRACSpressureOut',
  },
  'L2 Fan Coils': {
    flow: 'glycoL2FCflow',
    tempIn: 'glycoL2FCtemperatureIn',
    tempOut: 'glycoL2FCtemperatureOut',
    pressIn: 'glycoL2FCpressureIn',
    pressOut: 'glycoL2FCpressureOut',
  },
  'AHU CR': {
    flow: 'glycolAHUCRflow',
    tempIn: 'glycolAHUCRtemperatureIn',
    tempOut: 'glycolAHUCRtemperatureOut',
    pressIn: 'glycolAHUCRpressureIn',
    pressOut: 'glycolAHUCRpressureOut',
  },
  'AHU WR': {
    flow: 'glycolAHUWRflow',
    tempIn: 'glycolAHUWRtemperatureIn',
    tempOut: 'glycolAHUWRtemperatureOut',
    pressIn: 'glycolAHUWRpressureIn',
    pressOut: 'glycolAHUWRpressureOut',
  },
  'DOME AHU 1': {
    flow: 'glycolDOMEAHU01flow',
    tempIn: 'glycolDOMEAHU01temperatureIn',
    tempOut: 'glycolDOMEAHU01temperatureOut',
    pressIn: 'glycolDOMEAHU01pressureIn',
    pressOut: 'glycolDOMEAHU01pressureOut',
  },
  'DOME AHU 2': {
    flow: 'glycolDOMEAHU02flow',
    tempIn: 'glycolDOMEAHU02temperatureIn',
    tempOut: 'glycolDOMEAHU02temperatureOut',
    pressIn: 'glycolDOMEAHU02pressureIn',
    pressOut: 'glycolDOMEAHU02pressureOut',
  },
  'DOME AHU 3': {
    flow: 'glycolDOMEAHU03flow',
    tempIn: 'glycolDOMEAHU03temperatureIn',
    tempOut: 'glycolDOMEAHU03temperatureOut',
    pressIn: 'glycolDOMEAHU03pressureIn',
    pressOut: 'glycolDOMEAHU03pressureOut',
  },
  'DOME AHU 4': {
    flow: 'glycolDOMEAHU04flow',
    tempIn: 'glycolDOMEAHU04temperatureIn',
    tempOut: 'glycolDOMEAHU04temperatureOut',
    pressIn: 'glycolDOMEAHU04pressureIn',
    pressOut: 'glycolDOMEAHU04pressureOut',
  },
  'Dynalene 1': {
    flow: 'glycolDynalene01flow',
    tempIn: 'glycolDynalene01temperatureIn',
    tempOut: 'glycolDynalene01temperatureOut',
    pressIn: 'glycolDynalene01pressureIn',
    pressOut: 'glycolDynalene01pressureOut',
  },
  'Dynalene 2': {
    flow: 'glycolDynalene02flow',
    tempIn: 'glycolDynalene02temperatureIn',
    tempOut: 'glycolDynalene02temperatureOut',
    pressIn: 'glycolDynalene02pressureIn',
    pressOut: 'glycolDynalene02pressureOut',
  },
  TMA: {
    flow: 'glycolTMAflow',
    tempIn: 'glycolTMAtemperatureIn',
    tempOut: 'glycolTMAtemperatureOut',
    pressIn: 'glycolTMApressureIn',
    pressOut: 'glycolTMApressureOut',
  },
  'LOC 10': {
    flow: 'glycolLOC10flow',
    tempIn: 'glycolLOC10temperatureIn',
    tempOut: 'glycolLOC10temperatureOut',
    pressIn: 'glycolLOC10pressureIn',
    pressOut: 'glycolLOC10pressureOut',
  },
  'Cable Wrap': {
    flow: 'glycolCableWrapflow',
    tempIn: 'glycolCableWraptemperatureIn',
    tempOut: 'glycolCableWraptemperatureOut',
    pressIn: 'glycolCableWrappressureIn',
    pressOut: 'glycolCableWrappressureOut',
  },
};

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

const devicesHeatThresholds = {
  'Chiller 1': 183,
  'Chiller 2': 183,
  'Chiller 3': 183,
  OSS: 1000,
  SLAC: 1000,
  'L2 CRACS': 1000,
  'L2 Fan Coils': 1000,
  'AHU CR': 1000,
  'AHU WR': 1000,
  'DOME AHU 1': 1000,
  'DOME AHU 2': 1000,
  'DOME AHU 3': 1000,
  'DOME AHU 4': 1000,
  'Dynalene 1': 1000,
  'Dynalene 2': 1000,
  TMA: 1000,
  'LOC 10': 1000,
  'Cable Wrap': 1000,
};

const deviceHeatSurpassThreshold = (device, heat) => {
  return heat >= devicesHeatThresholds[device];
};

/**
 * Calculate heat exchange
 * @param {number} flowRate
 * @param {number} tempIn
 * @param {number} tempOut
 * @returns {number} Heat exchange in kW
 * @returns {undefined} If any of the parameters is undefined
 */
const calculateHeatExchange = (flowRate, tempIn, tempOut) => {
  if (flowRate === undefined || tempIn === undefined || tempOut === undefined) {
    return;
  }
  // const cp = 3807; // EGW Sp. Heat
  // const density = 1050; // EGW Density
  // const vdot = (flowRate * 0.001) / 60; // L/min to m^3/s
  // return (cp * density * vdot * (tempOut - tempIn)) / 1000;
  return flowRate * 0.067 * (tempOut - tempIn);
};

function HVACStatus({ data = {}, summaryState = 0 }) {
  const stateName = summaryStateMap[summaryState];
  const stateStyle = summaryStateToStyle[stateName];

  const chiller1Heat = calculateHeatExchange(
    data[telemetriesMapping['Chiller 1']?.flow],
    data[telemetriesMapping['Chiller 1']?.tempIn],
    data[telemetriesMapping['Chiller 1']?.tempOut],
  );

  const chiller2Heat = calculateHeatExchange(
    data[telemetriesMapping['Chiller 2']?.flow],
    data[telemetriesMapping['Chiller 2']?.tempIn],
    data[telemetriesMapping['Chiller 2']?.tempOut],
  );

  const chiller3Heat = calculateHeatExchange(
    data[telemetriesMapping['Chiller 3']?.flow],
    data[telemetriesMapping['Chiller 3']?.tempIn],
    data[telemetriesMapping['Chiller 3']?.tempOut],
  );

  const LTChillerTotalHeat = chiller1Heat + chiller2Heat;
  const LTChillerErrorHeat = 5;
  const GPChillerTotalHeat = chiller3Heat;
  const GPChillerErrorHeat = 5;

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
        <div className={highLightBiggerClassName}>
          {!isNaN(LTChillerTotalHeat) ? `${defaultNumberFormatter(LTChillerTotalHeat, 2)} kW` : '-'}
        </div>
        <div>Error</div>
        <div title="Total LT Chillers Capacity / Total LT Chillers Heat Exchange" className={highLightBiggerClassName}>
          {!isNaN(LTChillerErrorHeat) ? `${defaultNumberFormatter(LTChillerErrorHeat, 2)} %` : '-'}
        </div>
      </div>
      <div className={styles.chillerInfo}>
        <div className={styles.highlight}>GP Chiller</div>
        <div>Total</div>
        <div className={highLightBiggerClassName}>
          {!isNaN(GPChillerTotalHeat) ? `${defaultNumberFormatter(GPChillerTotalHeat, 2)} kW` : '-'}
        </div>
        <div>Error</div>
        <div title="Total GP Chillers Capacity / Total GP Chillers Heat Exchange" className={highLightBiggerClassName}>
          {!isNaN(GPChillerErrorHeat) ? `${defaultNumberFormatter(GPChillerErrorHeat, 2)} %` : '-'}
        </div>
      </div>
    </div>
  );
}

HVACStatus.propTypes = {
  /** Dict with telemetries parameters */
  data: PropTypes.array,
  /** Summary state of the HVAC system */
  summaryState: PropTypes.number.isRequired,
};

function GlycolSummary({ data = {}, selectedDevice, selectDevice }) {
  const devicesHeats = Object.keys(telemetriesMapping).map((device) => ({
    device,
    heat: calculateHeatExchange(
      data[telemetriesMapping[device]?.flow],
      data[telemetriesMapping[device]?.tempIn],
      data[telemetriesMapping[device]?.tempOut],
    ),
  }));

  return (
    <div className={styles.summaryContainer}>
      <div className={styles.devicesBoxes}>
        {devicesHeats.map(({ device, heat }) => {
          const overThreshold = deviceHeatSurpassThreshold(device, heat);
          return (
            <div
              key={device}
              className={[styles.deviceBox, overThreshold ? styles.heatWarningBackground : ''].join(' ')}
            >
              <div className={styles.highlight}>{device}</div>
              <div className={[styles.highlight, styles.bigger].join(' ')}>
                {!isNaN(heat) ? `${defaultNumberFormatter(heat, 2)} kW` : '-'}
              </div>
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
  /** Dict with telemetries parameters */
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

function GlycolTable({ data = {}, device }) {
  const headers = [
    {
      field: 'device',
      title: 'Device',
    },
    {
      field: 'pressureIn',
      title: 'Pressure In [Pa]',
      render: (value) => (!isNaN(value) ? defaultNumberFormatter(value) : '-'),
    },
    {
      field: 'pressureOut',
      title: 'Pressure Out [Pa]',
      render: (value) => (!isNaN(value) ? defaultNumberFormatter(value) : '-'),
    },
    {
      field: 'temperatureIn',
      title: 'Temperature In [°C]',
      render: (value) => (!isNaN(value) ? defaultNumberFormatter(value) : '-'),
    },
    {
      field: 'temperatureOut',
      title: 'Temperature Out [°C]',
      render: (value) => (!isNaN(value) ? defaultNumberFormatter(value) : '-'),
    },
    {
      field: 'flowRate',
      title: 'Flow Rate [L/min]',
      render: (value) => (!isNaN(value) ? defaultNumberFormatter(value) : '-'),
    },
    {
      field: 'heatExchange',
      title: 'Heat Exchange (Q) [kW]',
      render: (value, row) => {
        if (isNaN(value)) {
          return '-';
        }
        const overThreshold = deviceHeatSurpassThreshold(row.device, value);
        return <span className={overThreshold ? styles.heatWarningText : ''}>{defaultNumberFormatter(value)}</span>;
      },
    },
  ];

  const devicesData = Object.keys(telemetriesMapping).map((device) => ({
    device,
    pressureIn: data[telemetriesMapping[device]?.pressIn],
    pressureOut: data[telemetriesMapping[device]?.pressOut],
    temperatureIn: data[telemetriesMapping[device]?.tempIn],
    temperatureOut: data[telemetriesMapping[device]?.tempOut],
    flowRate: data[telemetriesMapping[device]?.flow],
    heatExchange: calculateHeatExchange(
      data[telemetriesMapping[device]?.flow],
      data[telemetriesMapping[device]?.tempIn],
      data[telemetriesMapping[device]?.tempOut],
    ),
  }));

  const dataWithSelectedDevice = devicesData.map((row) => {
    return {
      ...row,
      rowClass: row.device === device ? styles.selectedRow : '',
    };
  });

  return <SimpleTable headers={headers} data={device ? dataWithSelectedDevice : devicesData} />;
}

GlycolTable.propTypes = {
  /** Dict with telemetries parameters */
  data: PropTypes.array.isRequired,
  /** Device selected */
  device: PropTypes.string,
};

function GlycolSystem({ subscribeToStreams, unsubscribeToStreams, ...props }) {
  const [selectedDevice, setSelectedDevice] = useState();

  useEffect(() => {
    subscribeToStreams();
    return () => {
      unsubscribeToStreams();
    };
  }, []);

  return (
    <div className={styles.container}>
      <HVACStatus data={props} summaryState={dummySummaryState} />
      <GlycolSummary data={props} selectedDevice={selectedDevice} selectDevice={setSelectedDevice} />
      {selectedDevice && <GlycolMap device={selectedDevice} />}
      <GlycolTable data={props} device={selectedDevice} />
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
