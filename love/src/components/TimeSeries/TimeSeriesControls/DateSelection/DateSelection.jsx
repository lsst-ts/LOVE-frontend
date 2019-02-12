import React, { PureComponent } from 'react';
import Datetime from 'react-datetime';
import styles from './DateSelection.module.css';
import './react-datetime.css';

export default class DateSelection extends PureComponent {
  constructor() {
    super();
    this.state = {
      startDate: null,
      endDate: null,
    };
  }

  onDateSelected = (date, isStartDate) => {
    if (isStartDate)
      this.setState({
        startDate: date,
      });
    else {
      this.setState({
        endDate: date,
      });
    }
  };

  componentDidUpdate = () => {
    if (this.state.startDate !== null && this.state.endDate !== null) {
      this.props.setHistoricalData(this.state.startDate, this.state.endDate);
    }
  };

  render() {
    return (
      <div className={styles.datesContainer}>
        <div className={styles.fromDateContainer}>
          <span className={styles.datetimeDescription}>From:</span>
          <div className={styles.datetimeContainer}>
            <Datetime onBlur={(momentDate) => this.onDateSelected(momentDate, true)} />
          </div>
        </div>
        <div className={styles.toDateContainer}>
          <span className={styles.datetimeDescription}>To:</span>
          <div className={styles.datetimeContainer}>
            <Datetime onBlur={(momentDate) => this.onDateSelected(momentDate, false)} />
          </div>
        </div>
      </div>
    );
  }
}
