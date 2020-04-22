import React from 'react';
import PropTypes from 'prop-types';
import Clock from './Clock/Clock';
import styles from './TimeDisplay.module.css';
import { DateTime } from 'luxon';
import { siderealSecond } from '../../Utils';

export default class TimeDisplay extends React.Component {
  static propTypes = {
    /** Time Data from the server */
    timeData: PropTypes.object,
    /** Locale string used to configure how to display the UTC Offset. en-GB by default (so it is displayed as GMT always).
     * Null or empty to use the browser locale */
    locale: PropTypes.string,
    /** Current time clocks */
    clock: PropTypes.object,
    /**
     * Layout of clocks in JSON format.
        It is a list of horizontalGroups, each of which list of vertically-aligned elements.
        Each clock has the following properties:

        1. name: (string) name of the clock, to be displayed above it.
        2. hideAnalog: (boolean = false) flag to hide the analog clock.
        3. hideDate: (boolean = false) flag to hide the date.
        4. hideOffset: (boolean = false) flag to hide the UTC offset, displayed at the right of the name
        5. timezone: timezone string used to configure which UTC offset to use. Null or empty if current should be used. Null by default.

        The format for the timezone string can be a fixed string (for UTC or TAI); a fixed-offset string (e.g. UTC+5);
        or a location string in the format <Continent>/<City> (use camelcase with underscores instead of spaces, like America/New_York)
        For example:
        - For UTC use UTC
        - For TAI use TAI
        - For Greenwich Sidereal Time use sidereal-greenwich
        - For Summit Sidereal Time use sidereal-summit
        - For a fixed offset (e.g. GMT+5) use <UTC
        - For La Serena use America/Santiago (yes America, not Chile)
        - For Arizona use America/Phoenix
        - For Illinois use America/Chicago
        Note that not every city is available, check the IANA DB documentation for more info: https://www.iana.org/time-zones
        See the default value as an example
    */
    clocks_layout: PropTypes.array,
  };

  static defaultProps = {
    locale: 'en-GB',
    clocks_layout: [],
    timeData: {
      server_time: {
        utc: 0,
        tai: 0,
        mjd: 0,
        sidereal_summit: 0,
        sidereal_greenwich: 0,
        tai_to_utc: 0,
      },
    },
    clock: {
      utc: 0,
      tai: 0,
      mjd: 0,
      sidereal_summit: 0,
      sidereal_greenwich: 0,
    }
  };

  render() {
    return (
      <div className={styles.container}>
        {this.props.clocks_layout.map((horizontalGroup, index) => (
          <div key={index} className={styles.horizontalGroup}>
            {horizontalGroup.map((element, index) => {
              const verticalGroup = element instanceof Array ? element : [element];
              return (
                <div key={index} className={styles.verticalGroup}>
                  {verticalGroup.map((element, index) => {
                    let timestamp = this.props.clock.utc;
                    if (element.timezone === 'sidereal-greenwich') {
                      timestamp = this.props.clock.sidereal_greenwich;
                    } else if (element.timezone === 'sidereal-summit') {
                      timestamp = this.props.clock.sidereal_summit;
                    } else if (element.timezone === 'MJD') {
                      timestamp = this.props.clock.mjd;
                    }
                    return <Clock key={index} {...element} timestamp={timestamp} timeData={this.props.timeData} />;
                  })}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  }
}
