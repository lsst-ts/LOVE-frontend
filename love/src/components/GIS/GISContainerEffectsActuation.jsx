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
    const { activeEffects, redEffects } = this.props;
    return (
      <div className={styles.div2}>
        <h3 className={styles.h3}>Effects/Actuation</h3>
        {/* <div className={[styles.signal, activeEffects.includes("fireIndication") ? '' : styles.inactive].join(" ")}>fireIndication</div> */}
        {this.props.effects.map(([system, effects]) => (
          <div className={styles.system}>
            <h3>{system}</h3>
            {effects.map((effect) => (
              <div
                className={[
                  styles.signal,
                  activeEffects.includes(effect) ? '' : activeEffects.length > 0 ? styles.inactive : '',
                  redEffects.includes(effect) ? styles.alert : '',
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
