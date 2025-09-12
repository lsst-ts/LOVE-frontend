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
import * as d3 from 'd3';
import { uniqueId } from 'lodash';
import { defaultNumberFormatter } from 'Utils';
import styles from './Gradiant.module.css';

export default class Gradiant extends Component {
  static propTypes = {
    /** Id of sensor selected */
    selectedId: PropTypes.number,
    /** Reading of the sensor */
    value: PropTypes.number,
    /** Number of the minimum force limit, used for the gradiant color */
    minGradiantLimit: PropTypes.number,
    /** Number of the maximum force limit, used for the gradiant color */
    maxGradiantLimit: PropTypes.number,
    /** Title for the gradient */
    title: PropTypes.string,
  };

  static defaultProps = {
    selectedId: undefined,
    value: 0,
    minGradiantLimit: -6000,
    maxGradiantLimit: 6000,
    title: 'temperature',
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

  static COLOUR_RANGE = [...d3.range(0, 1, 1.0 / (Gradiant.COLOURS.length - 1)), 1];

  static COLOR_SCALE = d3
    .scaleLinear()
    .domain(Gradiant.COLOUR_RANGE)
    .range(Gradiant.COLOURS)
    .interpolate(d3.interpolateHcl);

  constructor(props) {
    super(props);
    this.state = {
      width: 350,
    };
    this.uniqueColorScale = uniqueId('ess-maintel-temp-gradient-color-scale-');
    this.uniqueTempGradient = uniqueId('ess-maintel-temp-gradient-');
  }

  getUnit() {
    return '°C';
  }

  getSensor = (id) => {
    if (id === null || id === undefined) return { id: undefined };
    const { value, title } = this.props;
    const sensor = {
      id: `${String(id).padStart(3, '0')}`,
      value: value,
      unit: title,
    };
    return sensor;
  };

  componentDidMount() {
    const { selectedId } = this.props;
    this.createColorScale();
    const sensor = this.getSensor(selectedId);
    this.setGradiant(sensor);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.selectedId !== this.props.selectedId || prevProps.value !== this.props.value) {
      const sensor = this.getSensor(this.props.selectedId);
      this.setGradiant(sensor);
    }
  }

  createColorScale = () => {
    const height = 40;
    const width = this.state.width;

    // Create the gradient
    const svg = d3.select(`#${this.uniqueColorScale} svg`);
    const temperatureGradientRect = d3.select(`#${this.uniqueColorScale} svg #${this.uniqueForceGradient}-rect`);

    if (temperatureGradientRect.empty()) {
      svg.attr('width', width).attr('height', height);
      svg
        .append('defs')
        .append('linearGradient')
        .attr('id', `${this.uniqueTempGradient}`)
        .attr('x1', '100%')
        .attr('y1', '0%')
        .attr('x2', '0%')
        .attr('y2', '0%')
        .selectAll('stop')
        .data(Gradiant.COLOURS)
        .enter()
        .append('stop')
        .attr('offset', (d, i) => i / (Gradiant.COLOR_SCALE.range().length - 1))
        .attr('stop-color', (d) => d);

      svg
        .append('rect')
        .attr('id', `${this.uniqueTempGradient}-rect`)
        .attr('x', 0)
        .attr('y', 0)
        .attr('rx', 0)
        .attr('ry', 0)
        .attr('width', width)
        .attr('height', 40)
        .style('fill', `url(#${this.uniqueTempGradient})`);
    }
  };

  static getGradiantPositionX(value, min, max, width) {
    const lerp = (x, y, a) => x * (1 - a) + y * a;
    const clamp = (a, _min = 0, _max = 1) => Math.min(_max, Math.max(_min, a));
    const invlerp = (x, y, a) => clamp((a - x) / (y - x));
    const range = (x1, y1, x2, y2, a) => lerp(x2, y2, invlerp(x1, y1, a));
    return range(min, max, 0, width, value);
  }

  setGradiant = (sensor) => {
    const { minGradiantLimit, maxGradiantLimit, showDifferentialTemp } = this.props;

    const svg = d3.select(`#${this.uniqueColorScale} svg`);
    const absoluteText = d3.select(`#${this.uniqueColorScale} svg #absolute-text`);
    const absoluteLine = d3.select(`#${this.uniqueColorScale} svg #absolute-line`);

    const absoluteGradiantX = Gradiant.getGradiantPositionX(
      sensor.value,
      minGradiantLimit,
      maxGradiantLimit,
      this.state.width,
    );

    if (absoluteText) {
      absoluteText.remove();
      absoluteLine.remove();
    }

    if (sensor.id !== undefined) {
      svg
        .append('line')
        .attr('id', 'absolute-line')
        .attr('x1', absoluteGradiantX)
        .attr('y1', -8)
        .attr('x2', absoluteGradiantX)
        .attr('y2', 43)
        .style('stroke', 'white')
        .style('stroke-width', 3);

      const textAbsolute = svg
        .append('text')
        .attr('id', 'absolute-text')
        .attr('x', absoluteGradiantX)
        .attr('y', -10)
        .attr('fill', !showDifferentialTemp ? 'white' : 'var(--base-font-color)')
        .style('font-size', '1em');

      if (absoluteGradiantX > (this.state.width * 3) / 4) {
        textAbsolute.attr('text-anchor', 'end');
      }
      // textAbsolute.append('tspan').attr('x', absoluteGradiantX).attr('y', -30).text(sensor.id);
      textAbsolute
        .append('tspan')
        .attr('x', absoluteGradiantX)
        .attr('y', -15)
        .text(`${defaultNumberFormatter(sensor.value, 2)} ${this.getUnit()}`);
    }
  };

  render() {
    const { title, maxGradiantLimit, minGradiantLimit } = this.props;
    return (
      <div>
        <div className={styles.container}>
          <span className={styles.title}>{title}</span>
        </div>

        <div className={styles.temperatureGradientWrapper}>
          <div id={this.uniqueColorScale} className={styles.temperatureGradient}>
            <span style={{ position: 'absolute', bottom: '-2em', left: 0 }}>
              {minGradiantLimit} [{this.getUnit()}]
            </span>
            <svg className={styles.colorScaleSvg} viewBox={`0 0 ${this.state.width} 40`}></svg>
            <span style={{ position: 'absolute', bottom: '-2em', right: 0 }}>
              {maxGradiantLimit} [{this.getUnit()}]
            </span>
          </div>
        </div>
      </div>
    );
  }
}
