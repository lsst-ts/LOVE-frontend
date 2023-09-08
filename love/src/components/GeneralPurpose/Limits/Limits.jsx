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
import styles from './Limits.module.css';

export default class Limits extends Component {
  static propTypes = {
    /** Minimum possible value, start of the limit bar */
    lowerLimit: PropTypes.number,
    /** Maximum possible value, end of the limit bar */
    upperLimit: PropTypes.number,
    /** Current value */
    currentValue: PropTypes.number,
    /** Target value */
    targetValue: PropTypes.number,
    /** Option to show labels */
    displayLabels: PropTypes.bool,
    /** Display Label Units */
    displayLabelsUnit: PropTypes.string,
    /** Height of the limit bar */
    height: PropTypes.number,
    /** Size of the warning zone in the same scale as lowerLimit and upperLimit */
    limitWarning: PropTypes.number,
  };

  static defaultProps = {
    lowerLimit: 0,
    upperLimit: 100,
    currentValue: 30,
    targetValue: 60,
    displayLabels: true,
    displayLabelsUnit: 'º',
    height: 15,
    limitWarning: 5,
  };

  render() {
    const { lowerLimit, upperLimit, limitWarning, currentValue, targetValue, height, displayLabelsUnit } = this.props;
    const barHeight = height / 7;
    const xMargin = 5;
    const currentValueX = ((100 - 2 * xMargin) * (currentValue - lowerLimit)) / (upperLimit - lowerLimit);
    const targetValueX = ((100 - 2 * xMargin) * (targetValue - lowerLimit)) / (upperLimit - lowerLimit);
    const yOffset = height / 3;
    const limitWarningPixels = (limitWarning / (upperLimit - lowerLimit)) * (100 - 2 * xMargin);
    const isInWarningZone = currentValue > upperLimit - limitWarning || currentValue < lowerLimit + limitWarning;

    return (
      <div className={styles.container}>
        <svg version="1.1" x="0px" y="0px" viewBox={`0 0 100 ${height + 1}`} className={styles.container}>
          <line
            className={styles.backgroundBar}
            x1={xMargin}
            y1={height / 2 + yOffset}
            x2={100 - xMargin}
            y2={height / 2 + yOffset}
            strokeWidth={barHeight}
          />
          <line
            className={[styles.warningBar, isInWarningZone ? styles.activeWarning : ''].join(' ')}
            x1={xMargin}
            y1={height / 2 + yOffset}
            x2={xMargin + limitWarningPixels}
            y2={height / 2 + yOffset}
            strokeWidth={barHeight}
          />
          <line
            className={[styles.warningBar, isInWarningZone ? styles.activeWarning : ''].join(' ')}
            x1={-limitWarningPixels + 100 - xMargin}
            y1={height / 2 + yOffset}
            x2={100 - xMargin}
            y2={height / 2 + yOffset}
            strokeWidth={barHeight}
          />
          {this.props.currentValue !== 'Unknown' && (
            <rect
              className={styles.currentValue}
              x={currentValueX + xMargin}
              y={height / 3 + yOffset}
              height={height / 3}
              width={1}
              strokeWidth={0}
            />
          )}

          {this.props.targetValue !== 'Unknown' && (
            <line
              className={styles.targetValue}
              x1={targetValueX + xMargin}
              y1={height / 3 + yOffset}
              x2={targetValueX + xMargin}
              y2={(2 * height) / 3 + yOffset}
            />
          )}

          {this.props.displayLabels && (
            <>
              <text
                className={[styles.text, styles.bottom, styles.bottomLeft].join(' ')}
                x={xMargin}
                y={height / 2 + yOffset + barHeight / 2}
              >
                {lowerLimit}
                {displayLabelsUnit}
              </text>
              <text
                className={[styles.text, styles.bottom, styles.bottomRight].join(' ')}
                x={100 - xMargin}
                y={height / 2 + yOffset + barHeight / 2}
              >
                {upperLimit}
                {displayLabelsUnit}
              </text>
            </>
          )}
        </svg>
      </div>
    );
  }
}
