/** This file is part of LOVE-frontend.

Developed for Inria Chile Tech Team.

See the COPYRIGHT file at the top-level directory of this distribution
for details of code ownership.

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.*/

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './GIS.module.css';

export default class GISContainerEffectsActuation extends Component {
  static propTypes = {
    /** Array of effects to be rendered */
    effects: PropTypes.array,
    /** Array of effects to be highlighted */
    activeEffects: PropTypes.array,
    /** Array of triggered effects */
    alertEffects: PropTypes.array,
  };

  render() {
    const { activeEffects, alertEffects } = this.props;
    return (
      <div className={styles.div2}>
        <h3 className={styles.h3}>Effects/Actuation</h3>
        {this.props.effects.map(([system, effects]) => (
          <div
            key={`system-${system}`}
            className={[
              styles.system,
              effects.some((effect) => alertEffects.includes(effect)) ? styles.alertSystem : '',
            ].join(' ')}
          >
            <h3>{system}</h3>
            {effects.map((effect) => (
              <div
                key={`effect-${effect}`}
                className={[
                  styles.signal,
                  activeEffects.includes(effect) ? '' : activeEffects.length > 0 ? styles.inactive : '',
                  alertEffects.includes(effect) ? styles.alert : '',
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
