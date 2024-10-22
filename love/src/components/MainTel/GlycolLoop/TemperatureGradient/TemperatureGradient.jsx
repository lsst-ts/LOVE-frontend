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
import lodash from 'lodash';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import styles from './TemperatureGradient.module.css';

const GRADIENT_WIDTH = 40;
const GRADIENT_HEIGHT = 1000;

const colors = ['#d7191c', '#e76818', '#f29e2e', '#f9d057', '#ffff8c', '#90eb9d', '#00ccbc', '#00a6ca', '#2c7bb6'];
const colorRange = [...d3.range(0, 1, 1.0 / (colors.length - 1)), 1];
const colorScale = d3.scaleLinear().domain(colorRange).range(colors).interpolate(d3.interpolateHcl);

export default class TemperatureGradient extends Component {
  static propTypes = {
    /** Number of the minimum force limit, used for the gradient color */
    minTemperatureLimit: PropTypes.number,
    /** Number of the maximum force limit, used for the gradient color */
    maxTemperatureLimit: PropTypes.number,
  };

  static defaultProps = {
    minTemperatureLimit: -100,
    maxTemperatureLimit: 100,
  };

  constructor(props) {
    super(props);
    this.colorScaleId = lodash.uniqueId('color-scale-');
    this.gradientId = lodash.uniqueId('gradient-');
  }

  componentDidMount() {
    this.createColorScale();
  }

  createColorScale = () => {
    const colorScaleId = '#' + this.colorScaleId;
    const svg = d3.select(colorScaleId);

    if (!svg.node().hasChildNodes()) {
      svg
        .append('defs')
        .append('linearGradient')
        .attr('id', this.gradientId)
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '0%')
        .attr('y2', '100%')
        .selectAll('stop')
        .data(colors)
        .enter()
        .append('stop')
        .attr('offset', (d, i) => i / (colorScale.range().length - 1))
        .attr('stop-color', (d) => d);

      svg
        .append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', GRADIENT_WIDTH)
        .attr('height', GRADIENT_HEIGHT)
        .style('fill', `url(#${this.gradientId})`);
    }
  };

  static getGradiantPositionX(value, min, max, width) {
    const lerp = (x, y, a) => x * (1 - a) + y * a;
    const clamp = (a, _min = 0, _max = 1) => Math.min(_max, Math.max(_min, a));
    const invlerp = (x, y, a) => clamp((a - x) / (y - x));
    const range = (x1, y1, x2, y2, a) => lerp(x2, y2, invlerp(x1, y1, a));
    return range(min, max, 0, width, value);
  }

  render() {
    const { maxTemperatureLimit, minTemperatureLimit } = this.props;
    return (
      <>
        <svg
          id={this.colorScaleId}
          className={styles.colorScaleSvg}
          viewBox={`0 0 ${GRADIENT_WIDTH} ${GRADIENT_HEIGHT}`}
        ></svg>
        <svg className={styles.colorScaleTextSvg} viewBox={`0 0 ${GRADIENT_WIDTH * 1.5} ${GRADIENT_HEIGHT}`}>
          <text x={0} y={16} fontSize="16">
            {maxTemperatureLimit} °C
          </text>
          <text x={0} y={GRADIENT_HEIGHT / 2} fontSize="16">
            {(maxTemperatureLimit + minTemperatureLimit) / 2} °C
          </text>
          <text x={0} y={GRADIENT_HEIGHT} fontSize="16">
            {minTemperatureLimit} °C
          </text>
        </svg>
      </>
    );
  }
}
