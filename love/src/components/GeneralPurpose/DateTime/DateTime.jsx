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

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import Datetime from 'react-datetime';
import Moment from 'moment';
import styles from './DateTime.module.css';

/**
 * A react-datetime with LOVE styles.
 * It passes down props directly to the Datetime object.
 */
const DateTime = (props) => {
  const { value, label = '', inputProps, minDate, maxDate, className: inputClassName, ...otherProps } = props;
  return (
    <>
      {label !== '' && <span className={styles.label}>{label}</span>}
      <Datetime
        utc={true}
        value={value}
        inputProps={{
          className: [styles.date, inputClassName].join(' '),
          ...props.inputProps,
        }}
        isValidDate={(currentDate) => {
          if (!minDate && !maxDate) {
            return true;
          }

          if (minDate && !maxDate) {
            return currentDate.isAfter(minDate);
          }

          if (maxDate && !minDate) {
            return currentDate.isBefore(maxDate);
          }

          if (maxDate && minDate) {
            return currentDate.isBefore(maxDate) && currentDate.isAfter(minDate);
          }
        }}
        {...otherProps}
      />
    </>
  );
};

DateTime.propTypes = {
  /** Value of the input */
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date), PropTypes.instanceOf(Moment)]),
  /** Label to add at the beginning of the datetime picker */
  label: PropTypes.string,
  /** Classname of the component */
  className: PropTypes.string,
  /** Properties to add to the input */
  inputProps: PropTypes.object,
  /** Minimum date allowed */
  minDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date), PropTypes.instanceOf(Moment)]),
  /** Maximum date allowed */
  maxDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date), PropTypes.instanceOf(Moment)]),
};

export default memo(DateTime);
