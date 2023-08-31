/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed by Inria Chile.

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
import PropTypes from 'prop-types';
import styles from './Process.module.css';

export default class Process extends Component {
  static propTypes = {
    activeFilterDialog: PropTypes.string,
    className: PropTypes.string,
  };

  render() {
    return (
      <div className={this.props.className}>
        <span className={styles.processName}>{this.props.name}</span>
        <div className={styles.processBody}>
          <div className={styles.inQueue}>
            <span>12</span>
          </div>
          <div className={styles.processBodyElement}>
            <ul>
              <li>OCS-DM-COM-ICD-0031</li>
              <li>OCS-DM-COM-ICD-0033</li>
              <li>OCS-DM-COM-ICD-0034</li>
              <li>OCS-DM-COM-ICD-0035</li>
              <li className={styles.extraImagesText}>+21</li>
            </ul>
          </div>
          <div className={styles.outQueue}>
            <span>321</span>
          </div>
        </div>
        <div className={styles.processBodyFooter}>
          <div className={styles.inQueueFooter}>
            <span>IN</span>
          </div>
          <div className={styles.processBodyElementFooter}>
            <span>Processing</span>
          </div>
          <div className={styles.outQueueFooter}>
            <span>OUT</span>
          </div>
        </div>
      </div>
    );
  }
}

Process.propTypes = {
  name: PropTypes.string.isRequired,
};
