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
    clocks: PropTypes.array,
  };

  static defaultProps = {
    locale: 'en-GB',
    taiToUtc: 0,
    clocks: [],
    timeData: {
      server_time: {
        utc: 0,
        tai: 0,
        mjd: 0,
        sidereal_summit: 0,
        sidereal_greenwich: 0,
        tai_to_utc: 0,
      }
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      local: DateTime.local(),
      mjd: 0,
      sidereal_greenwich: 0,
      sidereal_summit: 0,
    };
  }

  componentDidMount() {
    this.timerID = setInterval(() => this.tick(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.timeData.server_time.utc !== this.props.timeData.server_time.utc || this.state.sidereal_greenwich === 0) {
      const diffSecs = this.props.timeData.server_time.utc - (this.props.timeData.receive_time + this.props.timeData.request_time) / 2;
      this.setState({
        local: DateTime.local().plus({seconds: diffSecs}),
        sidereal_greenwich: DateTime.fromSeconds(this.props.timeData.server_time.sidereal_greenwich * 3600 + diffSecs * siderealSecond),
        sidereal_summit: DateTime.fromSeconds(this.props.timeData.server_time.sidereal_summit * 3600 + diffSecs * siderealSecond),
      });
    }
  }

  tick() {
    this.setState({
      local: this.state.local.plus({seconds: 1}),
      sidereal_greenwich: this.state.sidereal_greenwich ? this.state.sidereal_greenwich.plus({milliseconds: siderealSecond * 1000}) : 0,
      sidereal_summit: this.state.sidereal_summit ? this.state.sidereal_summit.plus({milliseconds: siderealSecond * 1000}) : 0,
    });
  }

  render() {
    return (
      <div className={styles.container}>
        {this.props.clocks.map( (horizontalGroup, index) => (
          <div key={index} className={styles.horizontalGroup}>
            {horizontalGroup.map( (element, index) => {
              const verticalGroup = element instanceof Array ? element : [element];
              return (
                <div key={index} className={styles.verticalGroup}>
                  {verticalGroup.map( (element, index) => {
                    let timestamp = this.state.local;
                    if (element.timezone === 'sidereal-greenwich') {
                      timestamp = this.state.sidereal_greenwich;
                    }
                    else if(element.timezone === 'sidereal-summit') {
                      timestamp = this.state.sidereal_summit;
                    }
                    return (
                      <Clock key={index} {...element} timestamp={timestamp} timeData={this.props.timeData}/>
                    )
                  })}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    );
  }
}
