/** This file is part of LOVE-frontend.

Developed for Inria Chile Tech Team.

See the COPYRIGHT file at the top-level directory of this distribution
for details of code ownership.

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.*/

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ManagerInterface from 'Utils';
import moment from 'moment';
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
          startDate={new Date(Date.now() - 24 * 60 * 60 * 1000)}
          endDate={new Date()}
          startDateProps={{ isValidDate: (current) => current.isBefore(moment()) }}
          endDateProps={{ isValidDate: (current) => current.isBefore(moment()) }}
        />
      </div>
      <div className={styles.confirmButton}>
        <Button disabled={!selectedEFDInstance} className={styles.actionButton} onClick={() => queryEFD()}>
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
