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
        {this.props.clocks.map( (horizontalGroup, index) => (
          <div key={index} className={styles.horizontalGroup}>
            {horizontalGroup.map( (element, index) => {
              const verticalGroup = element instanceof Array ? element : [element];
              return (
                <div key={index} className={styles.verticalGroup}>
                  {verticalGroup.map( (element, index) => (
                    <Clock key={index} {...element} timestamp={localTime} />
                  ))}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    );
  }
}
