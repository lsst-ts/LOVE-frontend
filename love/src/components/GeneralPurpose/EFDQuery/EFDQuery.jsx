import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ManagerInterface from 'Utils';
import Select from 'components/GeneralPurpose/Select/Select';
import Button from 'components/GeneralPurpose/Button/Button';
import DateTimeRange from 'components/GeneralPurpose/DateTimeRange/DateTimeRange';
import styles from './EFDQuery.module.css';

const EFDQuery = ({ efdConfigFile = null, onResponse = () => {}, managerInterface = () => Promise.resolve() }) => {
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
    if (type === 'start') setStartDate(date);
    else if (type === 'end') setEndDate(date);
  };

  const queryEFD = () => {
    managerInterface(startDate, endDate, selectedEFDInstance).then((response) => {
      onResponse(response);
    });
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
        <Button disabled={!!selectedEFDInstance} className={styles.actionButton} onClick={() => queryEFD()}>
          Query
        </Button>
      </div>
    </div>
  );
};

EFDQuery.propTypes = {
  efdConfigFile: PropTypes.string,
  onResponse: PropTypes.func.isRequired,
  managerInterface: PropTypes.func.isRequired,
};

export default EFDQuery;
