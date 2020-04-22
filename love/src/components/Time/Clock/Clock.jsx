import React from 'react';
import PropTypes from 'prop-types';
import styles from './Clock.module.css';
import AnalogClock from '../../GeneralPurpose/AnalogClock/AnalogClock';
import DigitalClock from '../../GeneralPurpose/DigitalClock/DigitalClock';

export default class Clock extends React.Component {
  static propTypes = {
    /** Optional name to display above the clock */
    name: PropTypes.string,
    /** Flag to hide or not the analog clock, false by default */
    hideAnalog: PropTypes.bool,
    /** Flag to hide or not the date, false by default */
    hideDate: PropTypes.bool,
    /** Flag to hide or not the UTC offset displayed beside the name, false by default */
    hideOffset: PropTypes.bool,
    /** Locale string used to configure how to display the UTC Offset. en-GB by default (so it is displayed as GMT always).
     * Null or empty to use the browser locale */
    locale: PropTypes.string,
    /** The timezone to display the timestamps. 'local' if current should be used. 'local' by default.
     * The format for this string must be: <Continent (camelcase)>-<City (camelcase)>.
     * For example:
     * - For local time use local
     * - For UTC use UTC
     * - For TAI use TAI
     * - For 'La Serena' use 'America/Santiago' (yes America, not Chile)
     * - For 'Arizona' use 'America/Phoenix'
     * - For 'Illinois' use 'America/Chicago'
     */
    timezone: PropTypes.string,
    /** 
     * Current time clocks from the server in the following format:
     *  {
          utc: <utc time in seconds>,
          tai: <tai time in seconds>,
          mjd: <modified julian date in days>,
          sidereal_summit: <Local (summit) Apparent Sidereal Time in seconds>,
          sidereal_greenwich: <Greenwich Apparent Sidereal Time (GAST) in seconds>,
        }
    */
    clock: PropTypes.shape({
      utc: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
      tai: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
      mjd: PropTypes.number,
      sidereal_summit: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
      sidereal_greenwich: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
    }),
  };

  static defaultProps = {
    name: null,
    hideDate: false,
    hideAnalog: false,
    hideOffset: false,
    locale: 'en-GB',
    timezone: null,
    clock: {
      utc: 0,
      tai: 0,
      mjd: 0,
      sidereal_summit: 0,
      sidereal_greenwich: 0,
    }
  };

  render() {
    let hideAnalog = this.props.hideAnalog;
    let hideDate = this.props.hideDate;
    let mjd = false;
    let offset = null;
    let timestamp = 0;
    if (this.props.clock.utc !== 0) {
      if (this.props.timezone === 'UTC') {
        timestamp = this.props.clock.utc;
        offset = 'UTC';
      }
      else if (this.props.timezone === 'TAI') {
        timestamp = this.props.clock.tai;
        offset = 'TAI';
      }
      else if (this.props.timezone === 'MJD') {
        timestamp = this.props.clock.mjd;
        hideAnalog = true;
        mjd = true;
        offset = 'MJD';
        hideDate = true;
      }
      else if (this.props.timezone === 'sidereal-summit') {
        timestamp = this.props.clock.sidereal_summit;
        offset = 'Summit-AST';
        hideDate = true;
      }
      else if (this.props.timezone === 'sidereal-greenwich') {
        timestamp = this.props.clock.sidereal_greenwich;
        offset = 'GAST';
        hideDate = true;
      }
      else {
        timestamp = this.props.clock.utc.setZone(this.props.timezone);
        offset = timestamp.offsetNameShort;
      }
      if (!mjd && this.props.locale) {
        timestamp = timestamp.setLocale(this.props.locale);
      }
    }
    const name = this.props.name;
    offset = this.props.hideOffset ? false : offset;
    return (
      <div className={styles.container}>
        <div className={styles.topRow}>
          {(name || offset) && <div className={styles.name}>{offset ? `${name} (${offset})` : name}</div>}
          {mjd ? (
            <div className={styles.mjd}>{timestamp.toFixed(5)}</div>
          ) : (
            <DigitalClock timestamp={timestamp} hideDate={hideDate} />
          )}
        </div>
        {!hideAnalog && (
          <div className={styles.analog}>
            <AnalogClock timestamp={timestamp} />
          </div>
        )}
      </div>
    );
  }
}
