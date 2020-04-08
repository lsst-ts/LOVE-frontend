import React from 'react';
import PropTypes from 'prop-types';
import Clock from './Clock/Clock';
import styles from './TimeDisplay.module.css';
import { DateTime } from 'luxon';

export default class TimeDisplay extends React.Component {
  static propTypes = {
    /** Number of seconds to add to a TAI timestamp to convert it in UTC */
    taiToUtc: PropTypes.number,
    /** Locale string used to configure how to display the UTC Offset. en-GB by default (so it is displayed as GMT always).
    * Null or empty to use the browser locale */
    locale: PropTypes.string,
    clocks: PropTypes.array,
  };

  static defaultProps = {
    locale: 'en-GB',
    taiToUtc: 0,
    clocks: [],
  }

  constructor(props) {
    super(props);
    this.state = {
      timestamp: DateTime.local(),
    };
  }

  componentDidMount() {
    this.timerID = setInterval(() => this.tick(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({
      timestamp: DateTime.local(),
    });
  }

  render() {
    const localTime = this.state.timestamp;
    return (
      <div className={styles.container}>
        <div className={styles.horizontalGroup}>
          <Clock timestamp={localTime} locale={this.props.locale} name="Local Time" />
          <Clock timestamp={localTime} locale={this.props.locale} name="Sidereal Time" hideOffset timezone="America/Phoenix" />
        </div>
        <div className={styles.horizontalGroup}>
          <div className={styles.verticalGroup}>
            <Clock timestamp={localTime} locale={this.props.locale} name="La Serena" hideAnalog timezone="America/Santiago" />
            <Clock timestamp={localTime} locale={this.props.locale} name="Arizona" hideAnalog timezone="America/Phoenix" />
            <Clock timestamp={localTime} locale={this.props.locale} name="Illinois" hideAnalog timezone="America/Chicago" />
          </div>
          <div className={styles.verticalGroup}>
            <Clock timestamp={localTime} locale={this.props.locale} name="Universal Time" hideAnalog timezone="UTC" />
            <Clock
              timestamp={localTime}
              locale={this.props.locale}
              name="International Atomic Time"
              hideAnalog
              timezone="TAI"
              taiToUtc={this.props.taiToUtc}
            />
            <Clock timestamp={localTime} locale={this.props.locale} name="Modified JD" hideOffset hideAnalog />
          </div>
        </div>
      </div>
    );
  }
}
