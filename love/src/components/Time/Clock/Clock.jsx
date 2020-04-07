import React from 'react';
import PropTypes from 'prop-types';
import styles from './Clock.module.css';
import AnalogClock from '../../GeneralPurpose/AnalogClock/AnalogClock';
import DigitalClock from '../../GeneralPurpose/DigitalClock/DigitalClock';
import { DateTime } from 'luxon';
import { parseTimestamp } from '../../../Utils';


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

export default class ClockContainer extends React.Component {

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
    /** Number of seconds to add to a TAI timestamp to convert it in UTC. Only applied if timezone is TAI */
    taiToUtc: PropTypes.number,
  }

  static defaultProps = {
    name: null,
    timestamp: DateTime.local(),
    hideDate: false,
    hideAnalog: false,
    hideOffset: false,
    locale: 'en-GB',
    timezone: null,
    taiToUtc: 0,
  }

  constructor(props) {
    super(props);
    this.state = {
      timestamp: DateTime.local(),
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

  tick() {
    this.setState({
      timestamp: DateTime.local(),
    });
  }

  render() {
    let timestamp = (this.props.timestamp ? this.props.timestamp : this.state.timestamp);
    if (this.props.locale) {
      timestamp = timestamp.setLocale(this.props.locale);
    }
    if (this.props.timezone) {
      if (this.props.timezone === 'TAI') {
        timestamp = timestamp.setZone('UTC').minus({ 'seconds': this.props.taiToUtc })
      }
      else {
        timestamp = timestamp.setZone(this.props.timezone);
      }
    }
    const name = this.props.name;
    const hideAnalog = this.props.hideAnalog;
    const hideDate = this.props.hideDate;
    const offset = this.props.hideOffset ? false : (this.props.timezone === 'TAI' ? 'TAI' : timestamp.offsetNameShort);
    return (
      <div className={styles.container}>
        { (name || offset) && (
          <div className={styles.name}>
            { offset ? `${name} (${offset})` : name }
          </div>
        )}
        <DigitalClock timestamp={timestamp} hideDate={hideDate}/>
        { !hideAnalog && (
          <div className={styles.analog}>
            <AnalogClock timestamp={timestamp}/>
          </div>
        )}
      </div>
    );
  }
}
