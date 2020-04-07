import React from 'react';
import PropTypes from 'prop-types';
import Clock from './Clock/Clock';
import styles from './TimeDisplay.module.css';
import { DateTime } from "luxon"; 


export default class TimeDisplay extends React.Component {

  static propTypes = {
    /** Number of seconds to add to a TAI timestamp to convert it in UTC */
    taiToUtc: PropTypes.number,
  }

  constructor(props) {
    super(props);
    this.state = {
      timestamp: DateTime.local(),
    };
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({
      timestamp: DateTime.local(),
    });
  }

  render () {
    const localTime = this.state.timestamp;
    const utcTime = this.state.timestamp.setZone('UTC');
    const serenaTime = this.state.timestamp.setZone('America/Santiago');
    const arizonaTime = this.state.timestamp.setZone('America/Phoenix');
    const illinoisTime = this.state.timestamp.setZone('America/Chicago');
    const taiTime = utcTime.minus({ 'seconds': this.props.taiToUtc });
    return (
      <div className={styles.container}>
        <div className={styles.group}>
          <Clock timestamp={localTime} name='Local Time'/>
          <Clock timestamp={localTime} name='Sidereal Time' hideOffset timezone='America/Phoenix'/>
        </div>
        <div className={styles.group}>
          <div className={styles.column}>
            <Clock timestamp={localTime} name='La Serena' hideAnalog timezone='America/Santiago'/>
            <Clock timestamp={localTime} name='Arizona' hideAnalog timezone='America/Phoenix'/>
            <Clock timestamp={localTime} name='Illinois' hideAnalog timezone='America/Chicago'/>
          </div>
          <div className={styles.column}>
            <Clock timestamp={localTime} name='Universal Time' hideAnalog timezone='UTC'/>
            <Clock timestamp={taiTime} name='International Atomic Time (TAI)' hideOffset hideAnalog/>
            <Clock timestamp={localTime} name='Modified JD' hideOffset hideAnalog/>
          </div>
        </div>
      </div>
    );
  }
}