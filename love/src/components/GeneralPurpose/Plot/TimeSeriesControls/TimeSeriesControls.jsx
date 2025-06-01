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

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Toggle from 'components/GeneralPurpose/Toggle/Toggle';
import DateSelection from './DateSelection/DateSelection';
import TimeWindow from './TimeWindow/TimeWindow';
import styles from './TimeSeriesControls.module.css';

export default class TimeSeriesControls extends Component {
  static propTypes = {
    /** Wether the live mode is active or not
     * If true, then the controls will show the time window selector
     * If false, then the controls will show the date selection inputs
     */
    isLive: PropTypes.bool,
    /** Function to change to live mode */
    setLiveMode: PropTypes.func,
    /** Time window to look back in minutes */
    timeWindow: PropTypes.number,
    /** Function to be called when changing the time window */
    setTimeWindow: PropTypes.func.isRequired,
    /** Function to set historical data */
    setHistoricalData: PropTypes.func,
  };

  static defaultProps = {
    liveMode: true,
    setLiveMode: () => {},
    timeWindow: 60,
    setTimeWindow: () => {},
    setHistoricalData: () => {},
  };

  constructor(props) {
    super(props);
    this.containerRef = React.createRef();
    this.state = {
      dateSelectorDates: null,
    };
  }

  componentDidMount() {
    this.setState({ dateSelectorDates: [moment().subtract(30, 'minutes'), moment()] });
  }

  render() {
    const { isLive, setLiveMode, timeWindow, setTimeWindow, setHistoricalData } = this.props;
    const { dateSelectorDates } = this.state;

    return (
      <div ref={this.containerRef} className={styles.timeseriesControlsContainer}>
        <div className={styles.switchContainer}>
          <Toggle labels={['Live', 'Historical']} toggled={!isLive} onToggle={(show) => setLiveMode(!show)} />
        </div>
        {isLive ? (
          <TimeWindow setTimeWindow={setTimeWindow} timeWindow={timeWindow} />
        ) : (
          <DateSelection dateSelectorDates={dateSelectorDates} setHistoricalData={setHistoricalData} />
        )}
      </div>
    );
  }
}
