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
import styles from './DomeCloseButton.module.css';

export default class DomeCloseButton extends Component {
  render() {
    return (
      <div className={styles.buttonWrapper}>
        <button className={styles.button}>
          <svg className={styles.svg} viewBox="0 0 134.53 131.6">
            <path
              className={styles['cls-1']}
              d="M132.52,128.32H116.09V83.93H18.28v44.39H1.86a1.94,1.94,0,1,0,0,3.87H132.52a1.94,1.94,0,0,0,0-3.87Zm-51.13,0H53V94a1.93,1.93,0,0,1,1.93-1.93H79.46A1.94,1.94,0,0,1,81.39,94Z"
              transform="translate(0.08 -0.59)"
            />
            <path
              className={styles['cls-1']}
              d="M113.43,59.06V41.82A46.36,46.36,0,0,0,82,.69a1.19,1.19,0,0,0-1.56,1.14l0,27.68a1.18,1.18,0,0,1-1.19,1.18H55.11a1.18,1.18,0,0,1-1.18-1.19L54,1.79A1.2,1.2,0,0,0,52.48.65,46.23,46.23,0,0,0,21,41.82V59.51a1.43,1.43,0,0,0,1.42,1.43h89.15A1.88,1.88,0,0,0,113.43,59.06Z"
              transform="translate(0.08 -0.59)"
            />
            <path
              className={styles['cls-1']}
              d="M14.3,80.06H120.07a2.58,2.58,0,0,0,2.58-2.58V67.38a2.57,2.57,0,0,0-2.58-2.57H14.3a2.58,2.58,0,0,0-2.58,2.57v10.1A2.59,2.59,0,0,0,14.3,80.06Z"
              transform="translate(0.08 -0.59)"
            />
            <circle className={styles['cls-1']} cx="67.69" cy="16.41" r="10.04" />
          </svg>
          <span className={styles.buttonLabel}>EMERGENCY CLOSE</span>
        </button>
      </div>
    );
  }
}
