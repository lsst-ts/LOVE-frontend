import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './GIS.module.css';

export default class GISContainerDetectionSignals extends Component {
  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const alertSignals = this.props.alertSignals;
    const signalIndexes = this.props.signalIndexes;

    return (
      <div className={styles.div2}>
        <h3 className={styles.h3}>Detection Signals</h3>
        {/* <h3>Detection Signals</h3> */}
        {this.props.signals.map(([system, signals]) => (
          <div className={styles.system}>
            <h3>{system}</h3>
            {Object.keys(signals).map((signal) => {
              // el después de la pizarra
              let systemIndex = signalIndexes[signal][0];
              let bitIndex = signalIndexes[signal][1];
              let bitArray = rawStatus[systemIndex].toString(2);
              let activeAlert = bitArray[bitIndex] === 1;
              return (
                <div
                  onMouseEnter={() => this.props.onHoverIn(signals[signal])}
                  onMouseLeave={() => this.props.onHoverOut()}
                  className={[styles.signal, activeAlert ? styles.alert : styles.signal].join(' ')}
                >
                  {signal}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  }
}
