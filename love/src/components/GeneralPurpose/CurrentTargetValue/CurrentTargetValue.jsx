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
import PropTypes from 'prop-types';
import styles from './CurrentTargetValue.module.css';
import RightArrowIcon from '../../icons/RightArrowIcon/RightArrowIcon';

export default class CurrentTargetValue extends Component {
  static propTypes = {
    /** Current value */
    currentValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    /** Target value */
    targetValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    /** Whether the value is still reaching the target value */
    isChanging: PropTypes.bool,
  };

  static defaultProps = {
    currentValue: 0,
    targetValue: 0,
  };

  render() {
    const isChanging = this.props.currentValue !== this.props.targetValue;
    return (
      <span className={styles.statusTextWrapper}>
        <span className={styles.telemetryValue}>
          {this.props.currentValue.toFixed ? this.props.currentValue.toFixed(3) : this.props.currentValue}º
        </span>
        {isChanging ? (
          <>
            <span className={styles.arrow}>
              <RightArrowIcon />
            </span>
            <span className={styles.telemetryValue}>
              {this.props.targetValue.toFixed ? this.props.targetValue.toFixed(3) : this.props.targetValue}º
            </span>
          </>
        ) : null}
      </span>
    );
  }
}
