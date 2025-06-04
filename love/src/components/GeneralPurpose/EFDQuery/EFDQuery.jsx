/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed by Inria Chile.

This program is free software: you can redistribute it and/or modify it under 
the terms of the GNU General Public License as published by the Free Software 
Foundation, either version 3 of the License, or at your option) any later version.

This program is distributed in the hope that it will be useful,but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR 
 A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with 
this program. If not, see <http://www.gnu.org/licenses/>.
*/

import React, { useState, useMemo, memo } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Button from 'components/GeneralPurpose/Button/Button';
import DateTimeRange from 'components/GeneralPurpose/DateTimeRange/DateTimeRange';
import styles from './EFDQuery.module.css';

const EFDQuery = ({ managerInterface = () => Promise.resolve() }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDateTimeChange = (date, type) => {
    if (type === 'start') setStartDate(date);
    else if (type === 'end') setEndDate(date);
  };

  const mountDate = useMemo(() => {
    const now = moment().utc();
    const yesterday = moment().utc().subtract(1, 'day');
    return {
      startDate: yesterday,
      endDate: now,
    };
  }, []);

  const queryEFD = () => {
    setIsLoading(true);
    managerInterface(startDate, endDate).finally(() => {
      setIsLoading(false);
    });
  };

  return (
    <div className={styles.queryContainer}>
      <DateTimeRange
        onChange={handleDateTimeChange}
        label="From (UTC)"
        startDate={mountDate.startDate}
        endDate={mountDate.endDate}
        startDateProps={{ isValidDate: (current) => current.isBefore(moment()) }}
        endDateProps={{ isValidDate: (current) => current.isBefore(moment()) }}
      />
      <Button disabled={isLoading} className={styles.actionButton} onClick={() => queryEFD()}>
        Query
      </Button>
    </div>
  );
};

EFDQuery.propTypes = {
  /** Function to interact with the manager interface
   * The component expects a function that takes two parameters: startDate and endDate,
   */
  managerInterface: PropTypes.func.isRequired,
};

export default memo(EFDQuery);
