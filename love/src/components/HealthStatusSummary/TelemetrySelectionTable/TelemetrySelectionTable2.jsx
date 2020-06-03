import React from 'react';
import ActionableTable from '../../GeneralPurpose/ActionableTable/ActionableTable';
import styles from './TelemetrySelectionTable.module.css';
import Button from '../../GeneralPurpose/Button/Button';
import TelemetrySelectionTag from './TelemetrySelectionTag/TelemetrySelectionTag';

const TelemetrySelectionTable = function (props) {
  const selectedRows = [];

  console.log(props);
  const headers = [
    {
      title: 'Position',
      type: 'number',
      render: (value) => (isNaN(value) ? '-' : value.toFixed(3)),
    },
    {
      field: 'description',
      title: 'Descr.',
      type: 'string',
    },
  ];

  const data = new Array(1).fill(1).flatMap(() => [
    { position: NaN, description: 'asdf', level: 0 },
    { position: 1.5, description: 'bsdf', level: 1 },
    { position: 2.2, description: 'csdf', level: 2 },
    { position: 3.213, description: 'dsdf', level: 23 },
    { position: 5.23, description: 'esdf', level: 3 },
    { position: 3.23, description: 'fsdf', level: 4 },
  ]);

  return (
    <>
      <div className={styles.telemetrySelectionTableWrapper}>
        <ActionableTable data={data} headers={headers} />
      </div>
      <div className={styles.selectionContainer}>
        TELEMETRIES:
        <span className={styles.selectionList}>
          {selectedRows.map((telemetryKey) => {
            const telemetryName = telemetryKey.split('-')[2];
            return (
              <TelemetrySelectionTag
                key={telemetryKey}
                telemetryKey={telemetryKey}
                telemetryName={telemetryName}
                remove={() => this.updateSelectedList(false, telemetryKey)}
              />
            );
          })}
        </span>
        <Button title="Set selected telemetries" className={styles.selectionSetButton} onClick={console.log}>
          Set
        </Button>
      </div>
    </>
  );
};

TelemetrySelectionTable.propTypes = {};

export default TelemetrySelectionTable;
