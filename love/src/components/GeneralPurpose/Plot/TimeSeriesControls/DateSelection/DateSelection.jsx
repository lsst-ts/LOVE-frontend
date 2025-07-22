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

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Datetime from 'react-datetime';
import moment from 'moment';
import TextField from 'components/TextField/TextField';
import Button from 'components/GeneralPurpose/Button/Button';
import InfoIcon from 'components/icons/InfoIcon/InfoIcon';
import styles from './DateSelection.module.css';

const MAX_TIME_WINDOW = 60; // Maximum time window in minutes
const TIME_WINDOW_TOOLTIP =
  'The time window will be set at the middle of the selected UTC date time.' +
  ' E.g. if you select a date of 2025-01-01 12:00:00 UTC and a time window of 60 minutes,' +
  ' the time window will be set from 2025-01-01 11:30:00 UTC to 2025-01-01 12:30:00 UTC.' +
  ` Note the maximum time window is ${MAX_TIME_WINDOW} minutes.`;
export default class DateSelection extends PureComponent {
  static propTypes = {
    /** Function to set historical data */
    setHistoricalData: PropTypes.func,
    /** Array of dates for the date selector */
    dateSelectorDates: PropTypes.array,
    /** Whether the submit button should be disabled */
    submitDisabled: PropTypes.bool,
  };

  static defaultProps = {
    setHistoricalData: () => {},
    dateSelectorDates: [null, null],
    submitDisabled: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      startDate: props.dateSelectorDates[0],
      timeWindow: MAX_TIME_WINDOW,
    };
  }

  isDateValid = (date) => {
    const d = new Date(date);
    return d instanceof Date && !Number.isNaN(d.getTime());
  };

  onDateSelected = (date) => {
    if (!this.isDateValid(date)) return;
    this.setState({
      startDate: date,
    });
  };

  onTimeWindowChange = (minutes) => {
    this.setState({
      timeWindow: minutes <= MAX_TIME_WINDOW ? minutes : MAX_TIME_WINDOW,
    });
  };

  onSubmitQuery = () => {
    const { startDate, timeWindow } = this.state;
    this.props.setHistoricalData(startDate, timeWindow);
  };

  render() {
    const { dateSelectorDates, submitDisabled } = this.props;
    const { timeWindow } = this.state;
    const currentMoment = moment();
    return (
      <div className={styles.datesContainer}>
        <div className={styles.fromDateContainer}>
          <span>From (UTC):</span>
          <div className={styles.datetimeContainer}>
            <Datetime
              inputProps={{ placeholder: 'Click to set initial date', readOnly: true }}
              onChange={this.onDateSelected}
              initialViewMode="time"
              initialValue={dateSelectorDates[0]}
              isValidDate={(currentDate) => currentDate.isBefore(currentMoment)}
              dateFormat="YYYY/MM/DD"
              utc={true}
            />
          </div>
        </div>
        <div className={styles.toDateContainer}>
          <span>Time window:</span>
          <div className={styles.datetimeContainer}>
            <TextField
              className={styles.customTimeWindowInput}
              type="text"
              value={timeWindow}
              onChange={(event) => this.onTimeWindowChange(parseInt(event.target.value))}
              onFocus={(event) => event.target.select()}
            />
          </div>
          <span>minutes</span>
          <div className={styles.infoIcon}>
            <InfoIcon title={TIME_WINDOW_TOOLTIP} />
          </div>
        </div>
        <Button disabled={submitDisabled} onClick={this.onSubmitQuery}>
          Submit
        </Button>
      </div>
    );
  }
}
