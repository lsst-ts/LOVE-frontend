import React from 'react';
import PropTypes from 'prop-types';
import styles from './Clock.module.css';
import AnalogClock from '../../GeneralPurpose/AnalogClock/AnalogClock';
import DigitalClock from '../../GeneralPurpose/DigitalClock/DigitalClock';
import { DateTime } from 'luxon';
import { parseTimestamp, siderealSecond } from '../../../Utils';


/**
 * Component that displays time, date and an analog clock, with options to display only some of those elements.
 */
// Clock.propTypes = {
//   /** Optional name to display above the clock */
//   name: PropTypes.string,
//   /** Date-able object or float, if float it must be in milliseconds */
//   timestamp: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
//   /** Flag to hide or not the analog clock, false by default */
//   hideAnalog: PropTypes.bool,
//   /** Flag to hide or not the date, false by default */
//   hideDate: PropTypes.bool,
//   /** Flag to hide or not the UTC offset besides the name, false by default */
//   hideOffset: PropTypes.bool,
// }

// Clock.defaultProps = {
//   name: null,
//   timestamp: DateTime.local(),
//   hideDate: false,
//   hideAnalog: false,
//   hideOffset: false,
// }

export default class Clock extends React.Component {

  static propTypes = {
    /** Optional name to display above the clock */
    name: PropTypes.string,
    /** Date-able object or float, if float it must be in milliseconds. If null, an internal clock will be defined by the component*/
    timestamp: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
    /** Flag to hide or not the analog clock, false by default */
    hideAnalog: PropTypes.bool,
    /** Flag to hide or not the date, false by default */
    hideDate: PropTypes.bool,
    /** Flag to hide or not the UTC offset displayed beside the name, false by default */
    hideOffset: PropTypes.bool,
    /** Locale string used to configure how to display the UTC Offset. en-GB by default (so it is displayed as GMT always).
     * Null or empty to use the browser locale */
    locale: PropTypes.string,
    /** The timezone to display the timestamps. Null or empty if current should be used 'UTC' for UTC. Null by default.
     * The format for this string must be: <Continent (camelcase)>-<City (camelcase)>.
     * For example:
     * - For UTC use UTC
     * - For TAI use TAI
     * - For 'La Serena' use 'America/Santiago' (yes America, not Chile)
     * - For 'Arizona' use 'America/Phoenix'
     * - For 'Illinois' use 'America/Chicago'
     */
    timezone: PropTypes.string,
    /** Time Data from the server */
    timeData: PropTypes.object,
  }

  static defaultProps = {
    name: null,
    timestamp: null,
    hideDate: false,
    hideAnalog: false,
    hideOffset: false,
    locale: 'en-GB',
    timezone: null,
    timeData: {
      request_time: 0,
      receive_time: 0,
      server_time: {
        utc: 0,
        tai: 0,
        mjd: 0,
        sidereal_summit: 0,
        sidereal_greenwhich: 0,
        tai_to_utc: 0,
      }
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      timestamp: 0,
    };
  }

  componentDidMount() {
    if (this.props.timestamp) return;
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }

  componentWillUnmount() {
    if (this.props.timestamp) return;
    clearInterval(this.timerID);
  }

  componentDidUpdate(prevProps) {
    if (!this.props.timestamp && prevProps.timeData.server_time.utc !== this.props.timeData.server_time.utc || !this.state.timestamp) {
      const diffSecs = this.props.timeData.server_time.utc - (this.props.timeData.receive_time + this.props.timeData.request_time) / 2;
      let timestamp = 0;
      if (this.props.timezone === 'sidereal-summit') {
        timestamp = DateTime.fromSeconds(this.props.timeData.server_time.sidereal_summit * 3600 + diffSecs * siderealSecond);
      } else if (this.props.timezone === 'sidereal-greenwich') {
        timestamp = DateTime.fromSeconds(this.props.timeData.server_time.sidereal_greenwich * 3600 + diffSecs * siderealSecond);
      } else if (this.props.timezone === 'MJD') {
        timestamp = this.props.timeData.server_time.mjd + diffSecs / (3600*24) ;
      } else {
        timestamp = DateTime.local().plus({seconds: diffSecs});
      }
      this.setState({timestamp});
    }
  }

  tick() {
    if (!this.state.timestamp) return;
    let timestamp = 0;
    if (this.props.timezone === 'sidereal-summit' || this.props.timezone === 'sidereal-greenwich') {
      timestamp = this.state.timestamp.plus({milliseconds: siderealSecond * 1000});
    }
    else if (this.props.timezone === 'MJD') {
      timestamp = this.state.timestamp + 1 / (3600*24);
    } else {
      timestamp = this.state.timestamp.plus({seconds: 1})
    }
    this.setState({ timestamp });
  }

  render() {
    let timestamp = (this.props.timestamp ? this.props.timestamp : this.state.timestamp);
    let hideAnalog = this.props.hideAnalog;
    let mjd = false;
    let offset = timestamp.offsetNameShort;
    let hideDate = this.props.hideDate;
    if (timestamp) {
      if (this.props.timezone) {
        if (this.props.timezone === 'TAI') {
          timestamp = timestamp.setZone('UTC').minus({ 'seconds': this.props.timeData.server_time.tai_to_utc });
          offset = 'TAI';
        }
        else if(this.props.timezone === 'MJD') {
          hideAnalog = true;
          mjd = true;
          offset = 'MJD';
          hideDate = true;
        }
        else if (this.props.timezone === 'sidereal-summit' || this.props.timezone === 'sidereal-greenwich') {
          timestamp = timestamp.setZone('UTC');
          offset = this.props.timezone === 'sidereal-greenwich' ? 'GAST' : 'Summit-AST';
          hideDate = true;
        }
        else {
          timestamp = timestamp.setZone(this.props.timezone);
        }
      }
      if (!mjd && this.props.locale) {
        timestamp = timestamp.setLocale(this.props.locale);
      }
    }
    const name = this.props.name;
    offset = this.props.hideOffset || offset;
    return (
      <div className={styles.container}>
        <div className={styles.topRow}>
          { (name || offset) && (
            <div className={styles.name}>
              { offset ? `${name} (${offset})` : name }
            </div>
          )}
          {mjd ? (
            <div className={styles.mjd}>
              {timestamp.toFixed(5)}
            </div>
          ) : (
            <DigitalClock timestamp={timestamp} hideDate={hideDate}/>
          )}
        </div>
        { !hideAnalog && (
          <div className={styles.analog}>
            <AnalogClock timestamp={timestamp}/>
          </div>
        )}
      </div>
    );
  }
}
