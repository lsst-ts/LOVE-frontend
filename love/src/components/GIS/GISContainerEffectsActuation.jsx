import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './GIS.module.css';

export default class GISContainerEffectsActuation extends Component {
  static propTypes = {};

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className={styles.div2}>
        {/* <div className={[styles.signal, activeEffects.includes("fireIndication") ? '' : styles.inactive].join(" ")}>fireIndication</div> */}
        {effectsArray.map(([system, effects]) => (
          <div className={styles.system}>
            <h4>{system}</h4>
            {effects.map((effect) => (
              <div
                className={[
                  styles.signal,
                  activeEffects.includes(effect) ? '' : activeEffects.length > 0 ? styles.inactive : '',
                ].join(' ')}
              >
                {effect}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }
}
