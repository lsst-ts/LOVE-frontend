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
import lodash, { isArray } from 'lodash';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import { defaultNumberFormatterm, fixedFloat } from 'Utils';
import styles from './TemperatureGradient.module.css';

export default class TemperatureGradient extends Component {
  static propTypes = {
    /** Number of the minimum force limit, used for the gradiant color */
    minTemperatureLimit: PropTypes.number,
    /** Number of the maximum force limit, used for the gradiant color */
    maxTemperatureLimit: PropTypes.number,
    /** Define wether or not the button is actived for show the differential temperature or absolute. **/
    showDifferentialTemp: PropTypes.bool,
  };

  static defaultProps = {
    sensorReferenceId: [],
    absoluteTemperature: [],
    differentialTemperature: [],
    selectedId: undefined,
    setpoint: 0,
    minTemperatureLimit: -6000,
    maxTemperatureLimit: 6000,
    showDifferentialTemp: true,
  };

  static COLOURS_INV = [
    '#2c7bb6',
    '#00a6ca',
    '#00ccbc',
    '#90eb9d',
    '#ffff8c',
    '#f9d057',
    '#f29e2e',
    '#e76818',
    '#d7191c',
  ];
  static COLOURS = ['#d7191c', '#e76818', '#f29e2e', '#f9d057', '#ffff8c', '#90eb9d', '#00ccbc', '#00a6ca', '#2c7bb6'];

  static COLOUR_RANGE = [...d3.range(0, 1, 1.0 / (TemperatureGradient.COLOURS.length - 1)), 1];

  static COLOR_SCALE = d3
    .scaleLinear()
    .domain(TemperatureGradient.COLOUR_RANGE)
    .range(TemperatureGradient.COLOURS)
    .interpolate(d3.interpolateHcl);

  constructor(props) {
    super(props);
    this.state = {
      width: 350,
    };
    this.colorScaleId = lodash.uniqueId('color-scale-');
  }

  componentDidMount() {
    this.createColorScale();
  }

  getSensor = (id) => {
    if (id === 0 || id === null || id === undefined) return { id: undefined };
    const { sensorReferenceId, absoluteTemperature, differentialTemperature } = this.props;
    const sensorIndex = sensorReferenceId.indexOf(id);

    const sensor = {
      id: `${String(id).padStart(2, '0')}`,
      absolute: absoluteTemperature[sensorIndex] ?? 0,
      differential: differentialTemperature[sensorIndex] ?? 0,
    };
    return sensor;
  };

  componentDidUpdate(prevProps) {
    if (
      prevProps.absoluteTemperature !== this.props.absoluteTemperature ||
      prevProps.differentialTemperature !== this.props.differentialTemperature
    ) {
      this.createColorScale();
      const sensor = this.getSensor(this.props.selectedId ?? TemperatureGradient.defaultProps.selectedId);
      this.setTemperature(sensor, this.props.minTemperatureLimit, this.maxTemperatureLimit);
    }

    if (prevProps.selectedId !== this.props.selectedId) {
      const sensor = this.getSensor(this.props.selectedId ?? TemperatureGradient.defaultProps.selectedId);
      this.setTemperature(sensor, this.props.minTemperatureLimit, this.maxTemperatureLimit);
    }
  }

  createColorScale = () => {
    const colorScaleId = '#' + this.colorScaleId;
    const height = 44;
    const width = this.state.width;

    // Create the gradient
    const svg = d3.select(colorScaleId + ' svg');
    const temperatureGradientRect = d3.select(colorScaleId + ' svg #temperature-gradient-rect');

    if (temperatureGradientRect.empty()) {
      svg.attr('width', width).attr('height', height);
      svg
        .append('defs')
        .append('linearGradient')
        .attr('id', 'temperature-gradient')
        .attr('x1', '100%')
        .attr('y1', '0%')
        .attr('x2', '0%')
        .attr('y2', '0%')
        .selectAll('stop')
        .data(TemperatureGradient.COLOURS)
        .enter()
        .append('stop')
        .attr('offset', (d, i) => i / (TemperatureGradient.COLOR_SCALE.range().length - 1))
        .attr('stop-color', (d) => d);

      svg
        .append('rect')
        .attr('id', 'temperature-gradient-rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('rx', 0)
        .attr('ry', 0)
        .attr('width', width)
        .attr('height', 40)
        .style('fill', 'url(#temperature-gradient)');
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
    const colorScaleId = this.colorScaleId;

    return (
      <div>
        <div className={styles.container}>
          <span className={styles.title}>Temperature</span>
          <span className={styles.value}></span>
        </div>

        <div className={styles.temperatureGradientWrapper}>
          <div id={colorScaleId} className={styles.temperatureGradient}>
            <span style={{ position: 'absolute', bottom: '-2em', left: 0 }}>
              {fixedFloat(minTemperatureLimit, 2)} [°C]
            </span>
            <svg className={styles.colorScaleSvg} viewBox={`0 0 ${this.state.width} 40`}></svg>
            <span style={{ position: 'absolute', bottom: '-2em', right: 0 }}>
              {fixedFloat(maxTemperatureLimit, 2)} [°C]
            </span>
          </div>
        </div>
      </div>
    );
  }
}
