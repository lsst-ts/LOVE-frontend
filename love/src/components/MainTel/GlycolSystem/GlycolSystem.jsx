import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { uniqueId } from 'lodash';
import SimpleTable from 'components/GeneralPurpose/SimpleTable/SimpleTable';
import StatusText from 'components/GeneralPurpose/StatusText/StatusText';
import PlotContainer from 'components/GeneralPurpose/Plot/Plot.container';
import { COLORS } from 'components/GeneralPurpose/Plot/VegaTimeSeriesPlot/VegaTimeSeriesPlot.jsx';
import TrendValue from 'components/GeneralPurpose/TrendValue/TrendValue';
import EyeIcon from 'components/icons/EyeIcon/EyeIcon';
import Map from 'components/MainTel/GlycolSystem/Map/Map';
import { summaryStateMap, summaryStateToStyle } from 'Config';
import { defaultNumberFormatter } from 'Utils';
import styles from './GlycolSystem.module.css';

const dummySummaryState = 2;

const flowPlotInputs = {
  CH01: {
    type: 'line',
    color: COLORS[0],
    values: [
      {
        variable: 'y',
        category: 'telemetry',
        csc: 'HVAC',
        salindex: '0',
        topic: 'glycolSensor',
        item: 'supplyFlowChiller01',
        accessor: '(x) => x',
      },
    ],
  },
  CH02: {
    type: 'line',
    color: COLORS[1],
    values: [
      {
        variable: 'y',
        category: 'telemetry',
        csc: 'HVAC',
        salindex: '0',
        topic: 'glycolSensor',
        item: 'supplyFlowChiller02',
        accessor: '(x) => x',
      },
    ],
  },
  CH03: {
    type: 'line',
    color: COLORS[2],
    values: [
      {
        variable: 'y',
        category: 'telemetry',
        csc: 'HVAC',
        salindex: '0',
        topic: 'glycolSensor',
        item: 'supplyFlowChiller03',
        accessor: '(x) => x',
      },
    ],
  },
};

const temperatureSupplyPlotInputs = {
  CH01: {
    type: 'line',
    color: COLORS[0],
    values: [
      {
        variable: 'y',
        category: 'telemetry',
        csc: 'HVAC',
        salindex: '0',
        topic: 'glycolSensor',
        item: 'supplyTempChiller01',
        accessor: '(x) => x',
      },
    ],
  },
  CH02: {
    type: 'line',
    color: COLORS[1],
    values: [
      {
        variable: 'y',
        category: 'telemetry',
        csc: 'HVAC',
        salindex: '0',
        topic: 'glycolSensor',
        item: 'supplyTempChiller02',
        accessor: '(x) => x',
      },
    ],
  },
  CH03: {
    type: 'line',
    color: COLORS[2],
    values: [
      {
        variable: 'y',
        category: 'telemetry',
        csc: 'HVAC',
        salindex: '0',
        topic: 'glycolSensor',
        item: 'supplyTempChiller03',
        accessor: '(x) => x',
      },
    ],
  },
};

const temperatureReturnPlotInputs = {
  CH01: {
    type: 'line',
    color: COLORS[0],
    values: [
      {
        variable: 'y',
        category: 'telemetry',
        csc: 'HVAC',
        salindex: '0',
        topic: 'glycolSensor',
        item: 'retTempChiller01',
        accessor: '(x) => x',
      },
    ],
  },
  CH02: {
    type: 'line',
    color: COLORS[1],
    values: [
      {
        variable: 'y',
        category: 'telemetry',
        csc: 'HVAC',
        salindex: '0',
        topic: 'glycolSensor',
        item: 'retTempChiller02',
        accessor: '(x) => x',
      },
    ],
  },
  CH03: {
    type: 'line',
    color: COLORS[2],
    values: [
      {
        variable: 'y',
        category: 'telemetry',
        csc: 'HVAC',
        salindex: '0',
        topic: 'glycolSensor',
        item: 'retTempChiller03',
        accessor: '(x) => x',
      },
    ],
  },
};

const pressureSupplyPlotInputs = {
  CH01: {
    type: 'line',
    color: COLORS[0],
    values: [
      {
        variable: 'y',
        category: 'telemetry',
        csc: 'HVAC',
        salindex: '0',
        topic: 'glycolSensor',
        item: 'supplyPressChiller01',
        accessor: '(x) => x',
      },
    ],
  },
  CH02: {
    type: 'line',
    color: COLORS[1],
    values: [
      {
        variable: 'y',
        category: 'telemetry',
        csc: 'HVAC',
        salindex: '0',
        topic: 'glycolSensor',
        item: 'supplyPressChiller02',
        accessor: '(x) => x',
      },
    ],
  },
  CH03: {
    type: 'line',
    color: COLORS[2],
    values: [
      {
        variable: 'y',
        category: 'telemetry',
        csc: 'HVAC',
        salindex: '0',
        topic: 'glycolSensor',
        item: 'supplyPressChiller03',
        accessor: '(x) => x',
      },
    ],
  },
};

const pressureReturnPlotInputs = {
  CH01: {
    type: 'line',
    color: COLORS[0],
    values: [
      {
        variable: 'y',
        category: 'telemetry',
        csc: 'HVAC',
        salindex: '0',
        topic: 'glycolSensor',
        item: 'retPressChiller01',
        accessor: '(x) => x',
      },
    ],
  },
  CH02: {
    type: 'line',
    color: COLORS[1],
    values: [
      {
        variable: 'y',
        category: 'telemetry',
        csc: 'HVAC',
        salindex: '0',
        topic: 'glycolSensor',
        item: 'retPressChiller02',
        accessor: '(x) => x',
      },
    ],
  },
  CH03: {
    type: 'line',
    color: COLORS[2],
    values: [
      {
        variable: 'y',
        category: 'telemetry',
        csc: 'HVAC',
        salindex: '0',
        topic: 'glycolSensor',
        item: 'retPressChiller03',
        accessor: '(x) => x',
      },
    ],
  },
};

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
  MRCR: {
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
  'LOC 10': {
    flow: 'glycolLOC10flow',
    tempIn: 'glycolLOC10temperatureIn',
    tempOut: 'glycolLOC10temperatureOut',
    pressIn: 'glycolLOC10pressureIn',
    pressOut: 'glycolLOC10pressureOut',
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
  'Cable Wrap': {
    flow: 'glycolCableWrapflow',
    tempIn: 'glycolCableWraptemperatureIn',
    tempOut: 'glycolCableWraptemperatureOut',
    pressIn: 'glycolCableWrappressureIn',
    pressOut: 'glycolCableWrappressureOut',
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
};

const devicesPipesMapping = {
  'Chiller 1': 1,
  'Chiller 2': 2,
  'Chiller 3': 3,
  OSS: 4,
  MRCR: 5,
  'L2 CRACS': 6,
  'L2 Fan Coils': 7,
  'AHU CR': 8,
  'AHU WR': 9,
  'LOC 10': 10,
  'DOME AHU 1': 11,
  'DOME AHU 2': 12,
  'DOME AHU 3': 13,
  'DOME AHU 4': 14,
  'Cable Wrap': 15,
  'Dynalene 1': 16,
  'Dynalene 2': 17,
  TMA: 18,
};

const devicesLevelMapping = {
  'Chiller 1': 1,
  'Chiller 2': 1,
  'Chiller 3': 1,
  OSS: 1,
  MRCR: 1,
  'L2 CRACS': 2,
  'L2 Fan Coils': 2,
  'AHU CR': 4,
  'AHU WR': 4,
  'LOC 10': 5,
  'DOME AHU 1': 5,
  'DOME AHU 2': 5,
  'DOME AHU 3': 5,
  'DOME AHU 4': 5,
  'Cable Wrap': 5,
  'Dynalene 1': 5,
  'Dynalene 2': 5,
  TMA: 5,
};

const devicesHeatThresholds = {
  'Chiller 1': 183,
  'Chiller 2': 183,
  'Chiller 3': 183,
  OSS: 1000,
  MRCR: 1000,
  'L2 CRACS': 1000,
  'L2 Fan Coils': 1000,
  'AHU CR': 1000,
  'AHU WR': 1000,
  'LOC 10': 1000,
  'DOME AHU 1': 1000,
  'DOME AHU 2': 1000,
  'DOME AHU 3': 1000,
  'DOME AHU 4': 1000,
  'Cable Wrap': 1000,
  'Dynalene 1': 1000,
  'Dynalene 2': 1000,
  TMA: 1000,
};

const devicesQuerySelectorMapping = {
  'Chiller 1': '#Machines > :nth-child(3)',
  'Chiller 2': '#Machines > :nth-child(2)',
  'Chiller 3': '#Machines > :nth-child(1)',
  OSS: '#Machines > :nth-child(4) > :first-child',
  MRCR: '#Building > #camera-maintenance-room',
  'L2 CRACS': '#Building #computer-room',
  'L2 Fan Coils': '#Building #open-office-space',
  'AHU CR': '#Building > #camera-maintenance-room',
  'AHU WR': '#Building > #camera-maintenance-room',
  'LOC 10': '#Dome > #underneath-tma',
  'DOME AHU 1': '#Dome > #ahu-zone',
  'DOME AHU 2': '#Dome > #ahu-zone',
  'DOME AHU 3': '#Dome > #ahu-zone',
  'DOME AHU 4': '#Dome > #ahu-zone',
  'Cable Wrap': '#Dome > #underneath-tma',
  'Dynalene 1': '#Dome > #underneath-tma',
  'Dynalene 2': '#Dome > #underneath-tma',
  TMA: '#Dome > #underneath-tma',
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
  const prevData = useRef();

  useEffect(() => {
    prevData.current = data;
  }, [data]);

  const stateName = summaryStateMap[summaryState];
  const stateStyle = summaryStateToStyle[stateName];

  const chiller1Heat = calculateHeatExchange(
    data[telemetriesMapping['Chiller 1']?.flow],
    data[telemetriesMapping['Chiller 1']?.tempIn],
    data[telemetriesMapping['Chiller 1']?.tempOut],
  );
  const prevChiller1Heat = prevData.current
    ? calculateHeatExchange(
        prevData.current[telemetriesMapping['Chiller 1']?.flow],
        prevData.current[telemetriesMapping['Chiller 1']?.tempIn],
        prevData.current[telemetriesMapping['Chiller 1']?.tempOut],
      )
    : 0;

  const chiller2Heat = calculateHeatExchange(
    data[telemetriesMapping['Chiller 2']?.flow],
    data[telemetriesMapping['Chiller 2']?.tempIn],
    data[telemetriesMapping['Chiller 2']?.tempOut],
  );
  const prevChiller2Heat = prevData.current
    ? calculateHeatExchange(
        prevData.current[telemetriesMapping['Chiller 2']?.flow],
        prevData.current[telemetriesMapping['Chiller 2']?.tempIn],
        prevData.current[telemetriesMapping['Chiller 2']?.tempOut],
      )
    : 0;

  const chiller3Heat = calculateHeatExchange(
    data[telemetriesMapping['Chiller 3']?.flow],
    data[telemetriesMapping['Chiller 3']?.tempIn],
    data[telemetriesMapping['Chiller 3']?.tempOut],
  );
  const prevChiller3Heat = prevData.current
    ? calculateHeatExchange(
        prevData.current[telemetriesMapping['Chiller 3']?.flow],
        prevData.current[telemetriesMapping['Chiller 3']?.tempIn],
        prevData.current[telemetriesMapping['Chiller 3']?.tempOut],
      )
    : 0;

  const LTChillerTotalHeat = chiller1Heat + chiller2Heat;
  const prevLTChillerTotalHeat = prevChiller1Heat + prevChiller2Heat;
  const GPChillerTotalHeat = chiller3Heat;
  const prevGPChillerTotalHeat = prevChiller3Heat;

  const heatChangeLTChiller = LTChillerTotalHeat - prevLTChillerTotalHeat;
  const heatChangeGPChiller = GPChillerTotalHeat - prevGPChillerTotalHeat;

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
          {!isNaN(LTChillerTotalHeat) ? (
            <TrendValue change={heatChangeLTChiller}>{`${defaultNumberFormatter(
              LTChillerTotalHeat,
              2,
            )} kW`}</TrendValue>
          ) : (
            '-'
          )}
        </div>
      </div>
      <div className={styles.chillerInfo}>
        <div className={styles.highlight}>GP Chiller</div>
        <div>Total</div>
        <div className={highLightBiggerClassName}>
          {!isNaN(GPChillerTotalHeat) ? (
            <TrendValue change={heatChangeGPChiller}>{`${defaultNumberFormatter(
              GPChillerTotalHeat,
              2,
            )} kW`}</TrendValue>
          ) : (
            '-'
          )}
        </div>
      </div>
    </div>
  );
}

HVACStatus.propTypes = {
  /** Dict with telemetries parameters */
  data: PropTypes.object,
  /** Summary state of the HVAC system */
  summaryState: PropTypes.number.isRequired,
};

function GlycolSummary({ data = {}, selectedDevice, selectDevice }) {
  const prevData = useRef();

  useEffect(() => {
    prevData.current = data;
  }, [data]);

  const devicesHeats = Object.keys(telemetriesMapping).map((device) => ({
    device,
    heat: calculateHeatExchange(
      data[telemetriesMapping[device]?.flow],
      data[telemetriesMapping[device]?.tempIn],
      data[telemetriesMapping[device]?.tempOut],
    ),
    prevHeat: prevData.current
      ? calculateHeatExchange(
          prevData.current[telemetriesMapping[device]?.flow],
          prevData.current[telemetriesMapping[device]?.tempIn],
          prevData.current[telemetriesMapping[device]?.tempOut],
        )
      : 0,
  }));

  return (
    <div className={styles.summaryContainer}>
      <div className={styles.devicesBoxes}>
        {devicesHeats.map(({ device, heat, prevHeat }) => {
          const overThreshold = deviceHeatSurpassThreshold(device, heat);
          const roundedHeat = Math.round(heat * 100) / 100;
          const roundedPrevHeat = Math.round(prevHeat * 100) / 100;
          const heatChange = roundedHeat - roundedPrevHeat;
          return (
            <div
              key={device}
              className={[styles.deviceBox, overThreshold ? styles.heatWarningBackground : ''].join(' ')}
            >
              <div className={styles.highlightTitle}>{device}</div>
              <div className={[styles.highlight, styles.bigger].join(' ')}>
                {!isNaN(heat) ? (
                  <TrendValue change={heatChange}>{`${defaultNumberFormatter(heat, 2)} kW`}</TrendValue>
                ) : (
                  '-'
                )}
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
  data: PropTypes.object,
  /** Device selected */
  selectedDevice: PropTypes.string,
  /** Function to select a device */
  selectDevice: PropTypes.func.isRequired,
};

function GlycolMap({ data = {}, device }) {
  const [showMap, setShowMap] = useState(true);
  const componentId = uniqueId('glycol-system-map-');

  useEffect(() => {
    const heat = calculateHeatExchange(
      data[telemetriesMapping[device]?.flow],
      data[telemetriesMapping[device]?.tempIn],
      data[telemetriesMapping[device]?.tempOut],
    );
    const overThreshold = deviceHeatSurpassThreshold(device, heat);
    const selector = '#' + componentId + ' ' + devicesQuerySelectorMapping[device];
    const deviceDOMNodes = document.querySelectorAll(selector);
    if (deviceDOMNodes) {
      deviceDOMNodes.forEach((dom) => {
        dom.classList.add(styles.highlightFill);

        if (overThreshold) {
          dom.classList.add(styles.alert);
        }
      });

      return () => {
        deviceDOMNodes.forEach((dom) => {
          dom.classList.remove(styles.highlightFill);
          dom.classList.remove(styles.alert);
        });
      };
    }
  }, [device, showMap]);

  const level = devicesLevelMapping[device];

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
        <div id={componentId} className={styles.mapContainer}>
          <Map level={level} />
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
      field: 'number',
      title: '#',
    },
    {
      field: 'device',
      title: 'Device',
    },
    {
      field: 'pressureIn',
      title: 'Pressure In [Bar]',
      render: (value) => (!isNaN(value) ? defaultNumberFormatter(value / 100000, 2) : '-'),
    },
    {
      field: 'pressureOut',
      title: 'Pressure Out [Bar]',
      render: (value) => (!isNaN(value) ? defaultNumberFormatter(value / 100000, 2) : '-'),
    },
    {
      field: 'temperatureIn',
      title: 'Temperature In [°C]',
      render: (value) => (!isNaN(value) ? defaultNumberFormatter(value, 2) : '-'),
    },
    {
      field: 'temperatureOut',
      title: 'Temperature Out [°C]',
      render: (value) => (!isNaN(value) ? defaultNumberFormatter(value, 2) : '-'),
    },
    {
      field: 'flowRate',
      title: 'Flow Rate [L/min]',
      render: (value) => (!isNaN(value) ? defaultNumberFormatter(value, 2) : '-'),
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
    number: devicesPipesMapping[device],
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

  return (
    <div className={styles.glycolTableContainer}>
      <SimpleTable headers={headers} data={device ? dataWithSelectedDevice : devicesData} />
    </div>
  );
}

GlycolTable.propTypes = {
  /** Dict with telemetries parameters */
  data: PropTypes.object.isRequired,
  /** Device selected */
  device: PropTypes.string,
};

function GlycolPlots({ data }) {
  return (
    <div className={styles.glycolPlotsContainer}>
      <div className={styles.plotContainer}>
        <div className={styles.highlight}>Glycol Temperature In</div>
        <div className={styles.plot}>
          <PlotContainer
            inputs={temperatureSupplyPlotInputs}
            controls={false}
            legendPosition="bottom"
            xAxisTitle="Time"
          />
        </div>
      </div>
      <div className={styles.plotContainer}>
        <div className={styles.highlight}>Glycol Temperature Out</div>
        <div className={styles.plot}>
          <PlotContainer
            inputs={temperatureReturnPlotInputs}
            controls={false}
            legendPosition="bottom"
            xAxisTitle="Time"
          />
        </div>
      </div>
      <div className={styles.plotContainer}>
        <div className={styles.highlight}>Glycol Pressure In</div>
        <div className={styles.plot}>
          <PlotContainer inputs={pressureSupplyPlotInputs} controls={false} legendPosition="bottom" xAxisTitle="Time" />
        </div>
      </div>
      <div className={styles.plotContainer}>
        <div className={styles.highlight}>Glycol Pressure Out</div>
        <div className={styles.plot}>
          <PlotContainer inputs={pressureReturnPlotInputs} controls={false} legendPosition="bottom" xAxisTitle="Time" />
        </div>
      </div>
      <div className={styles.plotContainer}>
        <div className={styles.highlight}>Glycol Flow</div>
        <div className={styles.plot}>
          <PlotContainer inputs={flowPlotInputs} controls={false} legendPosition="bottom" xAxisTitle="Time" />
        </div>
      </div>
    </div>
  );
}

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
      {selectedDevice && <GlycolMap data={props} device={selectedDevice} />}
      <GlycolTable data={props} device={selectedDevice} />
      <GlycolPlots data={props} />
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
