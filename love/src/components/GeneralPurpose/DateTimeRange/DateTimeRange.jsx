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

import React, { useState, useEffect, useCallback, memo } from 'react';
import PropTypes from 'prop-types';
import Moment from 'moment';
import DateTime from 'components/GeneralPurpose/DateTime/DateTime';
import styles from './DateTimeRange.module.css';

const DateTimeRange = ({
  label = '',
  className,
  startDate,
  endDate,
  startDateProps,
  endDateProps,
  onChange = () => {},
}) => {
  const [dateStart, setDateStart] = useState(startDate ?? new Date(Date.now() - 24 * 60 * 60 * 1000 + 37 * 1000)); // Add 37 seconds to comply with TAI
  const [dateEnd, setDateEnd] = useState(endDate ?? new Date(Date.now() + 37 * 1000)); // Add 37 seconds to comply with TAI

  // Effect used to update startDate and endDate
  // When first pased, the arguments could be undefined
  useEffect(() => {
    onChange(dateStart, 'start');
    onChange(dateEnd, 'end');
  }, []);

  // Effect used to update startDate and endDate
  useEffect(() => {
    if (startDate) {
      setDateStart(startDate);
    }
    if (endDate) {
      setDateEnd(endDate);
    }
  }, [startDate, endDate]);

  const handleChangeStart = useCallback((changeEvent) => {
    setDateStart(changeEvent);
    onChange(changeEvent, 'start');
  }, []);

  const handleChangeEnd = useCallback((changeEvent) => {
    setDateEnd(changeEvent);
    onChange(changeEvent, 'end');
  }, []);

  return (
    <div className={[styles.horizontalFilter, className].join(' ')}>
      {label !== '' && <span className={styles.label}>{label}</span>}
      <DateTime
        inputProps={{ placeholder: 'Initial date' }}
        viewMode="time"
        value={dateStart}
        onChange={handleChangeStart}
        dateFormat="YYYY/MM/DD"
        timeFormat="HH:mm:ss"
        closeOnSelect={true}
        {...startDateProps}
      />
      <span className={styles.to}>to</span>
      <DateTime
        inputProps={{ placeholder: 'Final date' }}
        viewMode="time"
        value={dateEnd}
        onChange={handleChangeEnd}
        dateFormat="YYYY/MM/DD"
        timeFormat="HH:mm:ss"
        closeOnSelect={true}
        {...endDateProps}
      />
    </div>
  );
};

DateTimeRange.propTypes = {
  /** Label to be appended at the beginning of the datetime range component */
  label: PropTypes.string,
  /** Classname of the component */
  className: PropTypes.string,
  /** Date for the datetime range start */
  startDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date), PropTypes.instanceOf(Moment)]),
  /** Date for the datetime range end */
  endtDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date), PropTypes.instanceOf(Moment)]),
  /** Properties to add to the start DateTime component */
  startDateProps: PropTypes.object,
  /** Properties to add to the end DateTime component */
  endDateProps: PropTypes.object,
  /** Function used to change the values of the dateTimeRange */
  onChange: PropTypes.func,
};

const arePropsEqual = (prevProps, nextProps) => {
  return (
    prevProps.label === nextProps.label &&
    prevProps.className === nextProps.className &&
    Moment(prevProps.startDate).isSame(nextProps.startDate) &&
    Moment(prevProps.endDate).isSame(nextProps.endDate)
  );
};

export default memo(DateTimeRange, arePropsEqual);
