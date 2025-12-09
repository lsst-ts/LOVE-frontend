import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import SimpleTable from 'components/GeneralPurpose/SimpleTable/SimpleTable';
import { defaultNumberFormatter } from 'Utils';
import { telemetriesMapping, calculateHeatExchange, deviceHeatSurpassThreshold } from './HeatMonitor';
import styles from './GlycolSystem.module.css';

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
  'DOME AHU 1': 11,
  'DOME AHU 2': 12,
  'DOME AHU 3': 13,
  'DOME AHU 4': 14,
  // 'Cable Wrap': 15,
  // 'Dynalene 1': 16,
  // 'Dynalene 2': 17,
  // TMA: 18,
};

const deviceTemperatureDifferenceIsValid = (diff) => {
  return diff >= 0;
};

const devicePressureDifferenceIsValid = (diff) => {
  return diff >= 0;
};

function GlycolDeviceTable({ data = {}, showTableDifferences, subscribeToStreams, unsubscribeToStreams }) {
  const selectedDevice = useState();

  useEffect(() => {
    subscribeToStreams();
    return () => {
      unsubscribeToStreams();
    };
  }, []);

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
      title: 'Pressure Supply [Bar]',
      render: (value) => (!isNaN(value) ? defaultNumberFormatter(value / 100000, 2) : '-'),
    },
    {
      field: 'pressureOut',
      title: 'Pressure Return [Bar]',
      render: (value) => (!isNaN(value) ? defaultNumberFormatter(value / 100000, 2) : '-'),
    },
    ...(showTableDifferences
      ? [
          {
            field: 'pressureDiff',
            title: 'Pressure Diff [Bar]',
            render: (value) => {
              if (isNaN(value)) return '-';
              const formattedValue = defaultNumberFormatter(value / 100000, 2);
              const diffIsValid = devicePressureDifferenceIsValid(value);
              if (!diffIsValid) {
                return <div className={styles.pressureDiffWarning}>{formattedValue}</div>;
              }
              return formattedValue;
            },
          },
        ]
      : []),
    {
      field: 'temperatureIn',
      title: 'Temperature Supply [°C]',
      render: (value) => (!isNaN(value) ? defaultNumberFormatter(value, 2) : '-'),
    },
    {
      field: 'temperatureOut',
      title: 'Temperature Return [°C]',
      render: (value) => (!isNaN(value) ? defaultNumberFormatter(value, 2) : '-'),
    },
    ...(showTableDifferences
      ? [
          {
            field: 'temperatureDiff',
            title: 'Temperature Diff [°C]',
            render: (value) => {
              if (isNaN(value)) return '-';
              const formattedValue = defaultNumberFormatter(value, 2);
              const diffIsValid = deviceTemperatureDifferenceIsValid(value);
              if (!diffIsValid) {
                return <div className={styles.temperatureDiffWarning}>{formattedValue}</div>;
              }
              return formattedValue;
            },
          },
        ]
      : []),
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
    pressureDiff: data[telemetriesMapping[device]?.pressIn] - data[telemetriesMapping[device]?.pressOut],
    temperatureIn: data[telemetriesMapping[device]?.tempIn],
    temperatureOut: data[telemetriesMapping[device]?.tempOut],
    temperatureDiff: data[telemetriesMapping[device]?.tempOut] - data[telemetriesMapping[device]?.tempIn],
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
      rowClass: row.device === selectedDevice ? styles.selectedRow : '',
    };
  });

  return (
    <div className={styles.glycolTableContainer}>
      <SimpleTable headers={headers} data={selectedDevice ? dataWithSelectedDevice : devicesData} />
    </div>
  );
}

GlycolDeviceTable.propTypes = {
  /** Dict with telemetries parameters */
  data: PropTypes.object.isRequired,
  /** Show table differences
   * If true, it will show the difference between supply and return pressure and temperature
   */
  showTableDifferences: PropTypes.bool,
};

export default GlycolDeviceTable;
