import React from 'react';
import ActionableTable from '../../GeneralPurpose/ActionableTable/ActionableTable';
import styles from './TelemetrySelectionTable.module.css';
import Button from '../../GeneralPurpose/Button/Button';
import TelemetrySelectionTag from './TelemetrySelectionTag/TelemetrySelectionTag';
import ManagerInterface from '../../../Utils';

const TelemetrySelectionTable = function (props) {
  const selectedRows = [];
  const [topicsData, setTopicsData] = React.useState([]);

  React.useEffect(() => {
    ManagerInterface.getTopicData('event-telemetry').then((data) => {
      let tableData = [];
      for (const [cscKey, cscValue] of Object.entries(data)) {
        for (const category of ['event', 'telemetry']) {
          const categoryKey = `${category}_data`;
          for (const [streamKey, streamValue] of Object.entries(cscValue[categoryKey])) {
            for (const [paramKey, paramValue] of Object.entries(streamValue)) {
              tableData.push({
                category,
                component: cscKey,
                stream: streamKey,
                param_name: paramKey,
                data_type: paramValue?.type_name,
                units: paramValue?.units,
              });
            }
          }
        }
      }
      setTopicsData(tableData);
    });
  }, []);

  // {
  //   "category": "event",
  //   "component": "Watcher",
  //   "stream": "alarm",
  //   "param_name": "WatcherID",
  //   "data_type": "long",
  //   "units": null
  // }

  const headers = [
    {
      title: 'Component',
      field: 'component',
    },
    {
      title: 'Topic',
      field: 'stream',
    },
    {
      title: 'Item',
      field: 'param_name',
    },
  ];

  return (
    <>
      <ActionableTable data={topicsData} headers={headers} paginationOptions={[10, 15, 25, 50]}/>
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
