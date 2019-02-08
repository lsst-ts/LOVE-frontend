import React, { Component } from 'react'
import DateSelection from './DateSelection/DateSelection';
import TimeWindow from './TimeWindow/TimeWindow';

export default class TimeSeriesControls extends Component {
  render() {
    return (
      <div>
        <DateSelection></DateSelection>
        <TimeWindow></TimeWindow>
      </div>
    )
  }
}
