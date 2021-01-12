import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Datetime from 'react-datetime';
import styles from './DateSelection.module.css';
import './react-datetime.css';

export default class DateSelection extends PureComponent {
  static propTypes = {
    setHistoricalData: PropTypes.func,
    dateSelectorDates: PropTypes.array,
  }

  constructor() {
    super();
    this.state = {
      startDate: null,
      endDate: null,
    };
  }

  isDateValid = (date) => {
    const d = new Date(date);
    return d instanceof Date && !Number.isNaN(d.getTime());
  };

  onDateSelected = (date, isStartDate) => {
    if (!this.isDateValid(date)) return;
    if (isStartDate) {
      this.setState({
        startDate: date,
      }, () => {
        this.props.setHistoricalData([this.state.startDate, this.state.endDate]);
      });
    } else {
      this.setState({
        endDate: date,
      }, () => {
        this.props.setHistoricalData([this.state.startDate, this.state.endDate]);
      });
    }
  };

  componentDidMount() {
    this.setState({
      startDate: this.props?.dateSelectorDates?.[0],
      endDate: this.props?.dateSelectorDates?.[1],
    }, () => {
      this.props.setHistoricalData?.([this.state.startDate, this.state.endDate]);
    });
  }

  render() {
    return (
      <div className={styles.datesContainer}>
        <div className={styles.fromDateContainer}>
          <span className={styles.datetimeDescription}>From:</span>
          <div className={styles.datetimeContainer}>
            <Datetime
              inputProps={{ placeholder: 'Click to set initial date' }}
              onChange={(date) => this.onDateSelected(date, true)}
              initialViewMode="time"
              initialValue={this.props?.dateSelectorDates?.[0]}
              isValidDate={(currentDate) => {
                // TODO: datetime constraints
                // return currentDate.isBefore(moment(maxDate)) && currentDate.isAfter(moment(minDate))
                return true;
              }}
            />
          </div>
        </div>
        <div className={styles.toDateContainer}>
          <span className={styles.datetimeDescription}>To:</span>
          <div className={styles.datetimeContainer}>
            <Datetime
              inputProps={{ placeholder: 'Click to set final date' }}
              onChange={(date) => this.onDateSelected(date, false)}
              initialViewMode="time"
              initialValue={this.props?.dateSelectorDates?.[1]}
              isValidDate={(currentDate) => {
                // TODO: datetime constraints
                // return currentDate.isBefore(moment(maxDate)) && currentDate.isAfter(moment(minDate))
                return true;
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}
