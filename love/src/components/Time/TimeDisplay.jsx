import React from 'react';
import PropTypes from 'prop-types';
import AnalogClock from '../GeneralPurpose/AnalogClock/AnalogClock';
import DigitalClock from '../GeneralPurpose/DigitalClock/DigitalClock';
import styles from './TimeDisplay.module.css';
import * as dayjs from 'dayjs';
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
    const utcTime = this.state.timestamp.toUTC();
    const serenaTime = this.state.timestamp.setZone('America/Santiago');
    const arizonaTime = this.state.timestamp.setZone('America/Phoenix');
    const illinoisTime = this.state.timestamp.setZone('America/Chicago');
    const taiTime = utcTime.minus({ 'seconds': this.props.taiToUtc });
    return (
      <div className={styles.container}>
        <div className={styles.group}>
          <ClockWrapper timestamp={localTime} title='Local Time' showAnalog/>
          <ClockWrapper timestamp={localTime} title='Sidereal Time' showAnalog/>
        </div>
        <div className={styles.group}>
          <div className={styles.column}>
            <ClockWrapper timestamp={serenaTime} title='La Serena'/>
            <ClockWrapper timestamp={arizonaTime} title='Arizona'/>
            <ClockWrapper timestamp={illinoisTime} title='Illinois'/>
          </div>
          <div className={styles.column}>
            <ClockWrapper timestamp={utcTime} title='Universal Time (UTC)'/>
            <ClockWrapper timestamp={taiTime} title='International Atomic Time (TAI)'/>
            <ClockWrapper timestamp={illinoisTime} title='Modified JD:'/>
          </div>
        </div>
      </div>
    );
  }
}

function ClockWrapper ({timestamp, title, showAnalog}) {
  return (
    <div className={styles.clockWrapper}>
      <div className={styles.title}>
        {title}
      </div>
      <DigitalClock timestamp={timestamp}/>
      { showAnalog && (
        <div className={styles.analog}>
          <AnalogClock timestamp={timestamp}/>
        </div>
      )}
    </div>
  );
}