import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './GIS.module.css';

export default class GISContainerDetectionSignals extends Component {
  static propTypes = {
    /** Array of signals to be rendered */
    signals: PropTypes.array,
    /** Array of triggered signals (alarms) */
    alertSignals: PropTypes.array,
    /** Callback for hover on specific signal */
    onHoverIn: PropTypes.func,
    /** Callback for hover out of any signal */
    onHoverOut: PropTypes.func,
  };

  render() {
    const { alertSignals } = this.props;

    return (
      <div className={styles.div2}>
        <h3 className={styles.h3}>Detection Signals</h3>
        {this.props.signals.map(([system, signals]) => {
          const systemSignals = Object.keys(signals);
          return (
            <div
              key={`system-${system}`}
              className={[
                styles.system,
                systemSignals.some((signal) => alertSignals.includes(signal)) ? styles.alertSystem : '',
              ].join(' ')}
            >
              <h3>{system}</h3>
              {Object.keys(signals).map((signal) => {
                return (
                  <div
                    key={`signal-${signal}`}
                    onMouseEnter={() => this.props.onHoverIn(signals[signal])}
                    onMouseLeave={() => this.props.onHoverOut()}
                    className={[styles.signal, alertSignals.includes(signal) ? styles.alert : ''].join(' ')}
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
