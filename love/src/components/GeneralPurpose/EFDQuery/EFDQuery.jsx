import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ManagerInterface from 'Utils';
import Select from 'components/GeneralPurpose/Select/Select';
import Button from 'components/GeneralPurpose/Button/Button';
import DateTimeRange from 'components/GeneralPurpose/DateTimeRange/DateTimeRange';
import styles from './EFDQuery.module.css';

const queryDataDummy = [
  {
    csc: 'ScriptQueue',
    salindex: 1,
    name: { value: 'ScriptQueue', dataType: 'String', units: 'unitless' },
    level: { value: 20, dataType: 'Int', units: 'unitless' },
    message: { value: 'Read historical data in 0.00 sec', dataType: 'String', units: 'unitless' },
    traceback: { value: '', dataType: 'String', units: 'unitless' },
    filePath: {
      value: '/opt/lsst/tssw/ts_salobj/python/lsst/ts/salobj/sal_info.py',
      dataType: 'String',
      units: 'unitless',
    },
    functionName: { value: 'start', dataType: 'String', units: 'unitless' },
    lineNumber: { value: 649, dataType: 'Int', units: 'unitless' },
    process: { value: 561, dataType: 'Int', units: 'unitless' },
    timestamp: { value: 0, dataType: 'Float', units: 'second' },
    priority: { value: 0, dataType: 'Int', units: 'unitless' },
    private_rcvStamp: { value: 1648750554.2980216, dataType: 'Float', units: 'seconds' },
  },
];

// const queryCSCDummy = {
//   ATDome: {
//     0: { position: ["azimuthPosition"] },
//   },
// };

const queryCSCDummy = {
  ATDome: {
    0: { logMessage: ['message'] },
  },
};

const EFDQuery = ({ efdConfigFile, onResponse, managerInterface }) => {
  const [efdInstances, setEFDInstance] = useState([]);
  const [selectedEFDInstance, setSelectedEFDInstance] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    ManagerInterface.getEFDClients().then(({ instances }) => {
      setEFDInstance(instances);
      const { defaultEfdInstance } = efdConfigFile ?? {};
      if (defaultEfdInstance) {
        setSelectedEFDInstance(defaultEfdInstance);
      }
    });
  }, []);

  const handleDateTimeChange = (date, type) => {
    console.log('Handling time change', date, type);
    if (type === 'start') setStartDate(date);
    else if (type === 'end') setEndDate(date);
  };

  const queryEFD = () => {
    managerInterface(startDate, 60, queryCSCDummy, '1min', 'summit_efd').then((response) => {
      console.log(response);
    });
    onResponse(queryDataDummy);
  };

  return (
    <div className={styles.queryContainer}>
      <div className={styles.instanceSelector}>
        <Select
          options={efdInstances}
          option={selectedEFDInstance}
          onChange={({ value }) => setSelectedEFDInstance(value)}
          className={styles.efdInstances}
          placeholder="Select EFD Instance"
        />
      </div>
      <div className={styles.timeRangeSelector}>
        <DateTimeRange
          onChange={handleDateTimeChange}
          label="From"
          startDate={new Date() - 24 * 60 * 60 * 1000 * 5}
          endDate={new Date(Date.now() + 24 * 60 * 60 * 1000)}
        />
      </div>
      <div className={styles.confirmButton}>
        <Button className={styles.actionButton} onClick={() => queryEFD()}>
          Query
        </Button>
      </div>
    </div>
  );
};

EFDQuery.propTypes = {
  efdConfigFile: PropTypes.string,
  onResponse: PropTypes.func,
  managerInterface: PropTypes.func.isRequired,
};

export default EFDQuery;
