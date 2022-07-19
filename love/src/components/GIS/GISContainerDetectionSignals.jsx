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
    return (
      <div className={styles.div2}>
        {this.props.signals.map(([system, signals]) => (
          <div className={styles.system}>
            <h3>{system}</h3>
            {Object.keys(signals).map((signal) => (
              <div
                onMouseEnter={this.props.onHoverIn(signals[signal])}
                onMouseLeave={this.props.onHoverOut}
                className={styles.signal}
              >
                {signal}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }
}
