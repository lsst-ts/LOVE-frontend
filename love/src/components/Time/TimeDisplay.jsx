import React from 'react';
import PropTypes from 'prop-types';
import AnalogClock from '../GeneralPurpose/AnalogClock/AnalogClock';
import DigitalClock from '../GeneralPurpose/DigitalClock/DigitalClock';
import styles from './TimeDisplay.module.css';
import * as dayjs from 'dayjs';


export default class TimeDisplay extends React.Component {

  static propTypes = {
    /** Number of seconds to add to a TAI timestamp to convert it in UTC */
    taiToUtc: PropTypes.number,
  }

  constructor(props) {
    super(props);
    this.state = {
      timestamp: dayjs(),
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
      timestamp: dayjs(),
    });
  }

  render () {
    const localTime = this.state.timestamp
    return (
      <div className={styles.container}>
        <div className={styles.group}>
          <ClockWrapper timestamp={localTime} title='Local Time' showAnalog/>
          <ClockWrapper timestamp={localTime} title='Sidereal Time' showAnalog/>
        </div>
        <div className={styles.group}>
          <div className={styles.column}>
            <ClockWrapper timestamp={localTime} title='La Serena'/>
            <ClockWrapper timestamp={localTime} title='Arizona'/>
            <ClockWrapper timestamp={localTime} title='Illinois'/>
          </div>
          <div className={styles.column}>
            <ClockWrapper timestamp={localTime} title='Universal Time (UTC)'/>
            <ClockWrapper timestamp={localTime} title='International Atomic Time (TAI)'/>
            <ClockWrapper timestamp={localTime} title='Modified JD:'/>
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