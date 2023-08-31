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
import styles from './LoadingBar.module.css';

export default class LoadingBar extends Component {
  static propTypes = {
    /** Percentage of Loading bar to display as progress */
    percentage: PropTypes.number,
    /** Title of Loading bar to display when hovering */
    title: PropTypes.string,
    /** Wheter to display percentage inside bar */
    displayPercentage: PropTypes.bool,
    /** Wheter to display percentage inside bar */
    isNarrow: PropTypes.bool,
    /** Wheter to display percentage inside bar */
    backgroundClass: PropTypes.string,
    /** Time in seconds to take for animating loading process */
    animationDuration: PropTypes.number,
  };

  static defaultProps = {
    percentage: 0,
    title: 'Completion percentage',
    displayPercentage: true,
    isNarrow: false,
    backgroundClass: '',
    animationDuration: 0,
  };

  render() {
    const narrowClass = this.props.isNarrow ? styles.narrow : '';
    const delayedScriptProgressClass = this.props.percentage > 100 ? styles.delayedScriptProgress : '';
    return (
      <div className={[styles.backgroundBar, this.props.backgroundClass].join(' ')} title={this.props.title}>
        <span className={[styles.percentage, this.props.percentage > 50 ? styles.dark : ''].join(' ')}>
          {this.props.displayPercentage ? `${this.props.percentage.toFixed(0)}%` : null}
        </span>
        <div
          style={{
            width: `${Math.min(this.props.percentage, 100)}%`,
            animationDuration: `${this.props.animationDuration}s`,
          }}
          className={[styles.loadedBar, narrowClass, delayedScriptProgressClass].join(' ')}
        />
      </div>
    );
  }
}
