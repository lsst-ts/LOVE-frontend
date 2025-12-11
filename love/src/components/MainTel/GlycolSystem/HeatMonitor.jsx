import React, { useState, useEffect, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { uniqueId } from 'lodash';
import StatusText from 'components/GeneralPurpose/StatusText/StatusText';
import TrendValue from 'components/GeneralPurpose/TrendValue/TrendValue';
import ProgressBar from 'components/GeneralPurpose/ProgressBar/ProgressBar';
import EyeIcon from 'components/icons/EyeIcon/EyeIcon';
import BackArrowIcon from 'components/icons/BackArrowIcon/BackArrowIcon';
import InfoIcon from 'components/icons/InfoIcon/InfoIcon';
import Map from 'components/MainTel/GlycolSystem/Map/Map';
import { summaryStateMap, summaryStateToStyle } from 'Config';
import { defaultNumberFormatter } from 'Utils';
import styles from './GlycolSystem.module.css';

const dummySummaryState = 2;

export const telemetriesMapping = {
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
  // 'Cable Wrap': {
  //   flow: 'glycolCableWrapflow',
  //   tempIn: 'glycolCableWraptemperatureIn',
  //   tempOut: 'glycolCableWraptemperatureOut',
  //   pressIn: 'glycolCableWrappressureIn',
  //   pressOut: 'glycolCableWrappressureOut',
  // },
  // 'Dynalene 1': {
  //   flow: 'glycolDynalene01flow',
  //   tempIn: 'glycolDynalene01temperatureIn',
  //   tempOut: 'glycolDynalene01temperatureOut',
  //   pressIn: 'glycolDynalene01pressureIn',
  //   pressOut: 'glycolDynalene01pressureOut',
  // },
  // 'Dynalene 2': {
  //   flow: 'glycolDynalene02flow',
  //   tempIn: 'glycolDynalene02temperatureIn',
  //   tempOut: 'glycolDynalene02temperatureOut',
  //   pressIn: 'glycolDynalene02pressureIn',
  //   pressOut: 'glycolDynalene02pressureOut',
  // },
  // TMA: {
  //   flow: 'glycolTMAflow',
  //   tempIn: 'glycolTMAtemperatureIn',
  //   tempOut: 'glycolTMAtemperatureOut',
  //   pressIn: 'glycolTMApressureIn',
  //   pressOut: 'glycolTMApressureOut',
  // },
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
  'DOME AHU 1': 5,
  'DOME AHU 2': 5,
  'DOME AHU 3': 5,
  'DOME AHU 4': 5,
  // 'Cable Wrap': 5,
  // 'Dynalene 1': 5,
  // 'Dynalene 2': 5,
  // TMA: 5,
};

const devicesQuerySelectorMapping = {
  'Chiller 1': '#Machines > :nth-child(1)',
  'Chiller 2': '#Machines > :nth-child(2)',
  'Chiller 3': '#Machines > :nth-child(3)',
  OSS: '#Machines > :nth-child(4) > :first-child',
  MRCR: '#Building > #camera-maintenance-room',
  'L2 CRACS': '#Building #computer-room',
  'L2 Fan Coils':
    '#Building #open-office-space, ' +
    '#Building #computer-lab, ' +
    '#Building #break-room, ' +
    '#Building #control-room, ' +
    '#Building #office-rooms, ' +
    '#Building #conference-room',
  'AHU CR': '#Building > #camera-maintenance-room',
  'AHU WR': '#Building > #camera-maintenance-room',
  'DOME AHU 1': '#Dome > #ahu-zone',
  'DOME AHU 2': '#Dome > #ahu-zone',
  'DOME AHU 3': '#Dome > #ahu-zone',
  'DOME AHU 4': '#Dome > #ahu-zone',
  // 'Cable Wrap': '#Dome > #underneath-tma',
  // 'Dynalene 1': '#Dome > #underneath-tma',
  // 'Dynalene 2': '#Dome > #underneath-tma',
  // TMA: '#Dome > #underneath-tma',
};

const devicesWideMapping = {
  'Chiller 1': 'wide3',
  'Chiller 2': 'wide3',
  'Chiller 3': 'wide3',
  OSS: 'wide2',
  MRCR: 'wide2',
  'L2 CRACS': 'wide2',
  'L2 Fan Coils': 'wide2',
  'AHU CR': 'wide2',
  'AHU WR': 'wide2',
  'DOME AHU 1': 'wide4',
  'DOME AHU 2': 'wide4',
  'DOME AHU 3': 'wide4',
  'DOME AHU 4': 'wide4',
  // 'Cable Wrap': '',
  // 'Dynalene 1': '',
  // 'Dynalene 2': '',
  // TMA: '',
};

export const deviceHeatSurpassThreshold = (device, heat, devicesHeatThresholds) => {
  return heat >= devicesHeatThresholds[device] * 0.8;
};

export const deviceEnergyPercentage = (device, heat, devicesHeatThresholds) => {
  const percent = (heat / devicesHeatThresholds[device]) * 100;
  return Math.max(0, Math.min(100, percent));
};

const deviceEnergyProgressBarClassName = (percent) => {
  if (percent >= 80) {
    return styles.progressBarHigh;
  }
  if (percent >= 50) {
    return styles.progressBarMedium;
  }

  return styles.progressBarLow;
};

/**
 * Calculate heat exchange
 * @param {number} flowRate
 * @param {number} tempIn
 * @param {number} tempOut
 * @returns {number} Heat exchange in kW
 * @returns {undefined} If any of the parameters is undefined
 */
export const calculateHeatExchange = (flowRate, tempIn, tempOut) => {
  if (flowRate === undefined || tempIn === undefined || tempOut === undefined) {
    return;
  }
  // const cp = 3807; // EGW Sp. Heat
  // const density = 1050; // EGW Density
  // const vdot = (flowRate * 0.001) / 60; // L/min to m^3/s
  // return (cp * density * vdot * (tempOut - tempIn)) / 1000;
  return flowRate * 0.067 * (tempOut - tempIn);
};

/**
 * Calculate historical heats for a device from historical data
 * @param {Array} historicalData - Array of historical data objects
 * @param {string} device - Device name
 * @returns {Array} Array of historical heat exchange values for the device
 */
function calculateHistoricalHeats(historicalData, device) {
  return historicalData
    .map((data) => {
      return (
        Math.round(
          calculateHeatExchange(
            data[telemetriesMapping[device]?.flow],
            data[telemetriesMapping[device]?.tempIn],
            data[telemetriesMapping[device]?.tempOut],
          ) * 100,
        ) / 100
      );
    })
    .filter((h) => h !== undefined && !isNaN(h));
}

/**
 * Calculate cummulative momentum of heat changes
 * @param {Array} historicalHeats - Array of historical heat exchange values
 * @returns {number} Cummulative momentum of heat changes
 */
function calculateHeatCummulativeMomentum(historicalHeats) {
  return historicalHeats.reduce((acc, h, index) => {
    if (index === 0) return acc;
    const prevH = historicalHeats[index - 1];
    return acc + (h - prevH);
  }, 0);
}

function HVACStatus({ data = {}, summaryState = 0 }) {
  const [historicalData, setHistoricalData] = useState([]);

  useEffect(() => {
    setHistoricalData((prev) => {
      const next = [...prev, data];
      return next.length > 10 ? next.slice(-10) : next;
    });
  }, [data]);

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
  const GPChillerTotalHeat = chiller3Heat;

  let devicesTotalHeat = 0;
  Object.keys(telemetriesMapping).forEach((device) => {
    if (device === 'Chiller 1' || device === 'Chiller 2' || device === 'Chiller 3') {
      return;
    }
    const heat = calculateHeatExchange(
      data[telemetriesMapping[device]?.flow],
      data[telemetriesMapping[device]?.tempIn],
      data[telemetriesMapping[device]?.tempOut],
    );

    devicesTotalHeat += heat;
  });

  // Calculate a cummulative momentum indicator for heat change
  const chiller1HistoricalHeats = calculateHistoricalHeats(historicalData, 'Chiller 1');
  const chiller2HistoricalHeats = calculateHistoricalHeats(historicalData, 'Chiller 2');
  const chiller3HistoricalHeats = calculateHistoricalHeats(historicalData, 'Chiller 3');

  const devicesHistoricalHeats = Object.keys(telemetriesMapping).reduce((acc, device) => {
    if (device === 'Chiller 1' || device === 'Chiller 2' || device === 'Chiller 3') {
      return acc;
    }
    acc[device] = calculateHistoricalHeats(historicalData, device);
    return acc;
  }, {});

  const chiller1RoundedHeat = Math.round(chiller1Heat * 100) / 100;
  const chiller2RoundedHeat = Math.round(chiller2Heat * 100) / 100;
  const chiller3RoundedHeat = Math.round(chiller3Heat * 100) / 100;
  const chiller1RoundedPrevHeat =
    chiller1HistoricalHeats.length > 1 ? chiller1HistoricalHeats[chiller1HistoricalHeats.length - 1] : 0;
  const chiller2RoundedPrevHeat =
    chiller2HistoricalHeats.length > 1 ? chiller2HistoricalHeats[chiller2HistoricalHeats.length - 1] : 0;
  const chiller3RoundedPrevHeat =
    chiller3HistoricalHeats.length > 1 ? chiller3HistoricalHeats[chiller3HistoricalHeats.length - 1] : 0;

  const chiller1HeatCummulativeMomentum =
    calculateHeatCummulativeMomentum(chiller1HistoricalHeats) + (chiller1RoundedHeat - chiller1RoundedPrevHeat);
  const chiller2HeatCummulativeMomentum =
    calculateHeatCummulativeMomentum(chiller2HistoricalHeats) + (chiller2RoundedHeat - chiller2RoundedPrevHeat);
  const chiller3HeatCummulativeMomentum =
    calculateHeatCummulativeMomentum(chiller3HistoricalHeats) + (chiller3RoundedHeat - chiller3RoundedPrevHeat);

  const devicesHeatCummulativeMomentums = Object.keys(devicesHistoricalHeats).reduce((acc, device) => {
    const historicalHeats = devicesHistoricalHeats[device];
    const roundedPrevHeat = historicalHeats.length > 0 ? historicalHeats[historicalHeats.length - 1] : 0;
    const roundedCurrentHeat =
      Math.round(
        calculateHeatExchange(
          data[telemetriesMapping[device]?.flow],
          data[telemetriesMapping[device]?.tempIn],
          data[telemetriesMapping[device]?.tempOut],
        ) * 100,
      ) / 100;
    acc += calculateHeatCummulativeMomentum(historicalHeats) + (roundedCurrentHeat - roundedPrevHeat);
    return acc;
  }, 0);

  const heatChangeLTChiller = chiller1HeatCummulativeMomentum + chiller2HeatCummulativeMomentum;
  const heatChangeGPChiller = chiller3HeatCummulativeMomentum;
  const heatChangeDevices = devicesHeatCummulativeMomentums;

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
      <div className={styles.chillerInfo}>
        <div className={styles.highlight}>Devices</div>
        <div>Total</div>
        <div className={highLightBiggerClassName}>
          {!isNaN(devicesTotalHeat) ? (
            <TrendValue change={heatChangeDevices}>{`${defaultNumberFormatter(devicesTotalHeat, 2)} kW`}</TrendValue>
          ) : (
            '-'
          )}
        </div>
      </div>
      <div className={styles.infoIcon}>
        <InfoIcon
          title={
            'This components displays heat exchange of devices by calculating the heat balance equation.\n' +
            'The heat exchange values for Chiller 1 and Chiller 2 are combined to represent the Low Temperature (LT) Chiller total.\n' +
            'The heat exchange for Chiller 3 represents the General Purpose (GP) Chiller total.\n' +
            'The Devices total sums the heat exchange of all other glycol system devices.\n' +
            'Each device heat exchange is displayed too, additionally showing: a cumulative momentum trend indicator that tracks heat change patterns over the last 10 data points, ' +
            "a progress bar showing the energy consumption as a percentage of the device's maximum power capacity (defined in component configurations), and " +
            'an eye icon button to highlight the device location in the Facilities Map and its detailed glycol sensors measurements.\n' +
            "If a device's heat exchange surpasses 80% of its max capacity, it is highlighted in the map and device box. " +
            'The progress bar also changes color accordingly: at 50% (yellow) and at 80% (red).'
          }
        />
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

function GlycolSummary({
  data = {},
  selectedDevice,
  selectDevice,
  deviceHeatSurpassThreshold,
  deviceEnergyPercentage,
}) {
  const [historicalData, setHistoricalData] = useState([]);

  useEffect(() => {
    setHistoricalData((prev) => {
      const next = [...prev, data];
      return next.length > 10 ? next.slice(-10) : next;
    });
  }, [data]);

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
        {devicesHeats.map(({ device, heat, prevHeat }) => {
          const overThreshold = deviceHeatSurpassThreshold(device, heat);
          const roundedHeat = Math.round(heat * 100) / 100;

          // Calculate a cummulative momentum indicator for heat change
          const deviceHistoricalHeats = calculateHistoricalHeats(historicalData, device);
          const roundedPrevHeat =
            deviceHistoricalHeats.length > 0 ? deviceHistoricalHeats[deviceHistoricalHeats.length - 1] : 0;
          const heatCummulativeMomentum =
            calculateHeatCummulativeMomentum(deviceHistoricalHeats) + (roundedHeat - roundedPrevHeat);

          const wideClass = styles[devicesWideMapping[device]];
          const energyPercent = deviceEnergyPercentage(device, heat);
          return (
            <div
              key={device}
              className={[styles.deviceBox, wideClass, overThreshold ? styles.heatWarningBackground : ''].join(' ')}
            >
              <div className={styles.highlightTitle}>{device}</div>
              <div className={[styles.highlight, styles.bigger].join(' ')}>
                {!isNaN(heat) ? (
                  <TrendValue change={heatCummulativeMomentum}>{`${defaultNumberFormatter(heat, 2)} kW`}</TrendValue>
                ) : (
                  '-'
                )}
              </div>
              <div>
                <ProgressBar
                  completed={energyPercent}
                  height={5}
                  containerClassName={styles.progressBar}
                  fillerClassName={deviceEnergyProgressBarClassName(energyPercent)}
                  hideCompleted
                />
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
  /** Function to check if device heat surpasses threshold */
  deviceHeatSurpassThreshold: PropTypes.func.isRequired,
  /** Function to get device energy percentage */
  deviceEnergyPercentage: PropTypes.func.isRequired,
};

function GlycolMap({ data = {}, device, deviceHeatSurpassThreshold }) {
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
  }, [device]);

  const level = devicesLevelMapping[device];

  return (
    <div id={componentId} className={styles.mapContainer}>
      <Map level={level} />
    </div>
  );
}

GlycolMap.propTypes = {
  /** Dict with telemetries parameters */
  data: PropTypes.object,
  /** Device selected */
  device: PropTypes.string,
  /** Function to check if device heat surpasses threshold */
  deviceHeatSurpassThreshold: PropTypes.func.isRequired,
};

function DeviceTelemetriesSummary({ data }) {
  return (
    <div className={styles.telemetries}>
      <div>
        <span>Flow:</span> <span>{data.flow}</span> <span>L/min</span>
      </div>
      <div>
        <span>Temperature In:</span> <span>{data.tempIn}</span> <span>°C</span>
      </div>
      <div>
        <span>Temperature Out:</span> <span>{data.tempOut}</span> <span>°C</span>
      </div>
      <div>
        <span>Pressure In:</span> <span>{data.pressIn}</span> <span>bar</span>
      </div>
      <div>
        <span>Pressure Out:</span> <span>{data.pressOut}</span> <span>bar</span>
      </div>
    </div>
  );
}

function HeatMonitor({ subscribeToStreams, unsubscribeToStreams, devicesHeatThresholds, ...props }) {
  const [selectedDevice, setSelectedDevice] = useState();

  useEffect(() => {
    subscribeToStreams();
    return () => {
      unsubscribeToStreams();
    };
  }, []);

  const deviceHeatSurpassThresholdCallback = useCallback(
    (device, heat) => {
      return deviceHeatSurpassThreshold(device, heat, devicesHeatThresholds);
    },
    [devicesHeatThresholds],
  );

  const deviceEnergyPercentageCallback = useCallback(
    (device, heat) => {
      return deviceEnergyPercentage(device, heat, devicesHeatThresholds);
    },
    [devicesHeatThresholds],
  );

  const selectedDeviceFields = selectedDevice ? telemetriesMapping[selectedDevice] : null;
  const selectedDeviceTelemetries = selectedDevice
    ? {
        flow: defaultNumberFormatter(props[selectedDeviceFields.flow], 2),
        tempIn: defaultNumberFormatter(props[selectedDeviceFields.tempIn], 2),
        tempOut: defaultNumberFormatter(props[selectedDeviceFields.tempOut], 2),
        pressIn: defaultNumberFormatter(props[selectedDeviceFields.pressIn] / 100000, 2),
        pressOut: defaultNumberFormatter(props[selectedDeviceFields.pressOut] / 100000, 2),
      }
    : null;

  return (
    <div className={styles.container}>
      <HVACStatus data={props} summaryState={dummySummaryState} />
      {!selectedDevice ? (
        <GlycolSummary
          data={props}
          selectedDevice={selectedDevice}
          selectDevice={setSelectedDevice}
          deviceHeatSurpassThreshold={deviceHeatSurpassThresholdCallback}
          deviceEnergyPercentage={deviceEnergyPercentageCallback}
        />
      ) : (
        <>
          <div className={styles.breadcrumbs}>
            <div onClick={() => setSelectedDevice(null)}>
              <div className={styles.backArrow}>
                <BackArrowIcon />
              </div>
              <div>Devices</div>
            </div>
            <div>&gt;</div>
            <div>Location {selectedDevice}</div>
            <DeviceTelemetriesSummary data={selectedDeviceTelemetries} />
          </div>
          <GlycolMap
            data={props}
            device={selectedDevice}
            deviceHeatSurpassThreshold={deviceHeatSurpassThresholdCallback}
          />
        </>
      )}
    </div>
  );
}

HeatMonitor.propTypes = {
  /** Devices heat thresholds or max power capacity in Kw per device */
  devicesHeatThresholds: PropTypes.object.isRequired,
  /** Function to subscribe to streams */
  subscribeToStreams: PropTypes.func.isRequired,
  /** Function to unsubscribe to streams */
  unsubscribeToStreams: PropTypes.func.isRequired,
};

export default HeatMonitor;
