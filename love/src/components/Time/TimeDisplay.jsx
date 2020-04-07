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
    const utcTime = this.state.timestamp.toUTC().setLocale('en-GB');
    const serenaTime = this.state.timestamp.setZone('America/Santiago').setLocale('en-GB');
    const arizonaTime = this.state.timestamp.setZone('America/Phoenix').setLocale('en-GB');
    const illinoisTime = this.state.timestamp.setZone('America/Chicago').setLocale('en-GB');
    const taiTime = utcTime.minus({ 'seconds': this.props.taiToUtc });
    return (
      <div className={styles.container}>
        <div className={styles.group}>
          <Clock timestamp={localTime} title='Local Time'/>
          <Clock timestamp={localTime} title='Sidereal Time' hideOffset/>
        </div>
        <div className={styles.group}>
          <div className={styles.column}>
            <Clock timestamp={serenaTime} title='La Serena' hideAnalog/>
            <Clock timestamp={arizonaTime} title='Arizona' hideAnalog/>
            <Clock timestamp={illinoisTime} title='Illinois' hideAnalog/>
          </div>
          <div className={styles.column}>
            <Clock timestamp={utcTime} title='Universal Time' hideAnalog/>
            <Clock timestamp={taiTime} title='International Atomic Time (TAI)' hideOffset hideAnalog/>
            <Clock timestamp={illinoisTime} title='Modified JD' hideOffset hideAnalog/>
          </div>
        </div>
      </div>
    );
  }
}