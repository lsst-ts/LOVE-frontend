import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Datetime from 'react-datetime';
import moment from 'moment';
import TextField from 'components/TextField/TextField';
import styles from './DateSelection.module.css';

export default class DateSelection extends PureComponent {
  static propTypes = {
    setHistoricalData: PropTypes.func,
    dateSelectorDates: PropTypes.array,
    submitDisabled: PropTypes.bool,
  };

  constructor() {
    super();
    this.state = {
      startDate: null,
      endDate: null,
      timeWindow: 60,
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
      timeWindow: minutes <= 60 ? minutes : 60,
    });
  };

  onSubmitQuery = () => {
    const { startDate, timeWindow } = this.state;
    this.props.setHistoricalData?.(startDate, timeWindow);
  };

  componentDidMount() {
    this.setState({
      startDate: this.props?.dateSelectorDates?.[0],
      endDate: this.props?.dateSelectorDates?.[1],
    });
  }

  render() {
    const { timeWindow } = this.state;
    const currentMoment = moment();
    return (
      <div className={styles.datesContainer}>
        <div className={styles.fromDateContainer}>
          <span className={styles.datetimeDescription}>From:</span>
          <div className={styles.datetimeContainer}>
            <Datetime
              inputProps={{ placeholder: 'Click to set initial date', readOnly: true }}
              onChange={(date) => this.onDateSelected(date, true)}
              initialViewMode="time"
              initialValue={this.props?.dateSelectorDates?.[0]}
              isValidDate={(currentDate) => currentDate.isBefore(currentMoment)}
              dateFormat="YYYY/MM/DD"
            />
          </div>
        </div>
        <div className={styles.toDateContainer}>
          <span className={styles.datetimeDescription}>Time window:</span>
          <div className={styles.datetimeContainer}>
            <TextField
              className={styles.customTimeWindowInput}
              type="text"
              value={timeWindow}
              onChange={(event) => this.onTimeWindowChange(parseInt(event.target.value))}
              onFocus={(event) => event.target.select()}
            />
          </div>
        </div>
        <button disabled={this.props.submitDisabled} className={styles.queryButton} onClick={this.onSubmitQuery}>
          Submit
        </button>
      </div>
    );
  }
}
