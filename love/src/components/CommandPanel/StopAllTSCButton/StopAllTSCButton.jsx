/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed for Inria Chile.

This program is free software: you can redistribute it and/or modify it under 
the terms of the GNU General Public License as published by the Free Software 
Foundation, either version 3 of the License, or at your option) any later version.

This program is distributed in the hope that it will be useful,but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR 
 A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with 
this program. If not, see <http://www.gnu.org/licenses/>.
*/

import React, { Component } from 'react';
import styles from './StopAllTSCButton.module.css';
import ManagerInterface from 'Utils';
// import { TCSCommands } from 'Config.js';

export default class StopAllTSCButton extends Component {
  constructor(props) {
    super(props);
  }

  callTSCStopAll() {
    this.props.command();
  }

  static defaultProps = {
    title: 'TSC STOP ALL',
  };

  render() {
    const { title, commandExecutePermission, queueState } = this.props;
    const isAvailable = commandExecutePermission && queueState.state !== 'Running';
    return (
      <div className={styles.buttonWrapper}>
        <button
          className={styles.button}
          title={
            isAvailable
              ? title
              : "Command is not allowed while queue is running either you don't have command execution permissions"
          }
          disabled={!isAvailable}
          onClick={(e) => this.callTSCStopAll()}
        >
          <svg className={styles.svg} viewBox="0 0 108.5 130">
            <path
              className={styles['cls-1']}
              d="M50.57.64c-4,.28-7.16,4.08-7.16,8V56.3a3.09,3.09,0,0,1-2.68,3.13,3,3,0,0,1-3.55-3.07V14.81c0-4-3.2-7.74-7.14-8a7.7,7.7,0,0,0-8.3,7.73v41.7A3.15,3.15,0,0,1,19,59.43a3,3,0,0,1-3.5-3.07V33.45c0-4-3.22-7.8-7.21-8.06A7.64,7.64,0,0,0,.08,33.12V96.87c0,10.75,6.25,33.75,28.75,33.75H59.52a21,21,0,0,0,15-6.34l.17.17,30.64-31.27A10.71,10.71,0,1,0,90.17,78l-9.6,9.59V18c0-4-3.21-7.77-7.16-8a7.69,7.69,0,0,0-8.33,7.73V56.29a3.09,3.09,0,0,1-2.72,3.14,3,3,0,0,1-3.46-3.07v-48A7.69,7.69,0,0,0,50.57.64Zm9.66,75.52a4.18,4.18,0,0,1,0,5.91L49.4,92.9l10.83,10.83a4.18,4.18,0,0,1-5.91,5.91L43.5,98.81,32.67,109.64a4.18,4.18,0,0,1-5.91-5.91L37.59,92.9,26.76,82.07a4.18,4.18,0,0,1,5.91-5.91L43.5,87,54.32,76.16A4.18,4.18,0,0,1,60.23,76.16Z"
              transform="translate(-0.08 -0.62)"
            />
          </svg>
          <span className={styles.buttonLabel}>{title}</span>
        </button>
      </div>
    );
  }
}
