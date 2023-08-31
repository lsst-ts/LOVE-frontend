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
import { fixedFloat } from 'Utils';
import styles from './Azimuth.module.css';

export default class Limits extends Component {
  static propTypes = {
    /** gauge Size */
    radius: PropTypes.number,

    /** Value origin, from where the gauge fills up */
    valueOrigin: PropTypes.number,
    /** Current value */
    currentValue: PropTypes.number,
    /** Target value */
    targetValue: PropTypes.number,

    /** Option to show labels */
    displayLabels: PropTypes.bool,
  };

  static defaultProps = {
    radius: 200,
    valueOrigin: -90,

    currentValue: 0,
    targetValue: 0,

    displayLabels: true,

    height: 200,
    width: 200,
  };

  render() {
    const { className, height, width, currentValue, targetValue, radius, valueOrigin, displayLabels } = this.props;

    return (
      <svg className={className} height={height} width={width} viewBox={`0 0 ${height} ${height}`}>
        {/* Diagram Group Container, whith translation and origin rotation for the whole svg */}
        <g style={{ translate: `${width / 2}px ${height / 2}px`, transform: `rotate(${valueOrigin}deg)` }}>
          {/* Origin value text */}
          <text
            className={styles.originText}
            transform={`${'translate(' + (radius + 10) + ' 0) rotate(' + valueOrigin * -1 + ')'}`}
          >
            <tspan>0º</tspan>
          </text>

          {/* Azimuth Diagram Group */}
          <g
            style={{
              transformOrigin: `50% 50%`,
              transition: 'transform 1.5s linear 0s',
              transformBox: 'fill-box',
              transform: ` rotate(${currentValue}deg)`,
            }}
          >
            {/* Rotate Center */}
            <circle
              style={{
                fill: 'transparent',
              }}
              r={`${radius * 1.3}`}
              cx={`${0}`}
              cy={`${0}`}
            />

            {/* Current value text*/}
            <g className={styles.targetText}>
              <text
                transform={`${'translate(' + radius + ' 0) rotate(' + (valueOrigin * -1 - currentValue) + ')'}`}
                transition=" transform 1.5s linear 0s"
              >
                <tspan
                  className={[
                    currentValue > 90
                      ? [currentValue > 180 ? [currentValue > 270 ? styles.textQ2 : styles.textQ3] : styles.textQ4]
                      : styles.textQ1,
                  ].join(' ')}
                >{`${fixedFloat(currentValue, 2) + 'º'}`}</tspan>
              </text>
            </g>

            {/* Background */}
            <circle
              style={{
                transition: 'transform 1.5s linear 0s',
                transformBox: 'fill-box',
              }}
              r={`${radius}`}
              cx={`${0}`}
              cy={`${0}`}
              className={styles.bg}
            />

            {/* Gauge */}
            {/* <circle
              style={{
                transition: 'transform 1.5s linear 0s',
                transformBox: 'fill-box',
              }}
              r={`${radius * 0.92}`}
              cx={`${0}`}
              cy={`${0}`}
              className={styles.gaugeL1}
            /> */}

            {/* Target Line */}
            <path
              style={{
                transition: 'transform 1.5s linear 0s',
                transformBox: 'fill-box',
                transform: ` rotate(${targetValue - currentValue}deg)`,
              }}
              d={`${'M 0 0 L ' + radius + ' 0'}`}
              className={styles.targetValue}
            />

            {/* Current Line */}
            <path
              style={{
                transition: 'transform 1.5s linear 0s',
                transformBox: 'fill-box',
              }}
              d={`${'M 0 0 L ' + radius + ' 0'}`}
              className={styles.currentValue}
            />

            {/* Cutout */}
            <circle
              style={{
                transition: 'transform 1.5s linear 0s',
                transformBox: 'fill-box',
              }}
              r={`${radius * 0.9}`}
              cx={`${0}`}
              cy={`${0}`}
              className={styles.cutOut}
            />
          </g>
        </g>
      </svg>
    );
  }
}
