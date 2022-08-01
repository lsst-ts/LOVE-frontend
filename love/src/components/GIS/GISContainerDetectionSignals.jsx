import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './GIS.module.css';
import { thresholdScott } from 'd3';

export default class GISContainerDetectionSignals extends Component {
  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const rawStatus = this.props?.rawStatus;
    const alertSignalIndexes = this.props?.alertSignalIndexes;
    const alertSignals = this.props.alertSignals;

    return (
      <div className={styles.div2}>
        <h3 className={styles.h3}>Detection Signals</h3>
        {/* <h3>Detection Signals</h3> */}
        {this.props.signals.map(([system, signals]) => {
          const systemSignals = Object.keys(signals);
          return (
            <div
              className={[
                styles.system,
                systemSignals.some((signal) => alertSignals.includes(signal)) ? styles.alertSystem : '',
              ].join(' ')}
            >
              <h3>{system}</h3>
              {Object.keys(signals).map((signal) => {
                let systemIndex = alertSignalIndexes[signal][0];
                let bitIndex = alertSignalIndexes[signal][1];
                let bitArray = rawStatus[systemIndex].toString(2);
                let activeAlert = bitArray[bitIndex] === '1';
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
          );
        })}
      </div>
    );
  }
}
