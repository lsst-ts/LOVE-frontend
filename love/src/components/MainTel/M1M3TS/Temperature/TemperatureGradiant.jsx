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
import { uniqueId } from 'lodash';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import { M1M3TSFanCoilPositions } from 'Config';
import { defaultNumberFormatter } from 'Utils';
import styles from './TemperatureGradiant.module.css';

const colors = ['#d7191c', '#e76818', '#f29e2e', '#f9d057', '#ffff8c', '#90eb9d', '#00ccbc', '#00a6ca', '#2c7bb6'];
const colorRange = [...d3.range(0, 1, 1.0 / (colors.length - 1)), 1];
const colorScale = d3.scaleLinear().domain(colorRange).range(colors).interpolate(d3.interpolateHcl);

export default class TemperatureGradiant extends Component {
  static propTypes = {
    /** Array for the identify of the position in array with an index */
    sensorReferenceId: PropTypes.arrayOf(PropTypes.number),
    /** Thermal status response data. Absolute temperature. */
    absoluteTemperature: PropTypes.arrayOf(PropTypes.number),
    /** Thermal status response data.  Differential temperature. */
    differentialTemperature: PropTypes.arrayOf(PropTypes.number),
    /** Id of sensor selected */
    selectedId: PropTypes.number,
    /** Applied setpoint. */
    setpoint: PropTypes.number,
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

  constructor(props) {
    super(props);
    this.state = {
      width: 350,
    };
    this.colorScaleId = uniqueId('color-scale-');
  }

  getSensor = (id) => {
    if (id === 0 || id === null || id === undefined) return { id: undefined };
    const { sensorReferenceId, absoluteTemperature, differentialTemperature } = this.props;
    const fcuIndex = M1M3TSFanCoilPositions.findIndex((fc) => fc.id === id);
    const sensorIndex = sensorReferenceId[fcuIndex];
    const absoluteValue = defaultNumberFormatter(absoluteTemperature[sensorIndex], 2) ?? 0;
    const differentialValue = defaultNumberFormatter(differentialTemperature[sensorIndex], 2) ?? 0;

    const sensor = {
      id: `${String(id).padStart(2, '0')}`,
      absolute: absoluteValue,
      differential: differentialValue,
    };
    return sensor;
  };

  componentDidUpdate(prevProps) {
    if (
      prevProps.absoluteTemperature !== this.props.absoluteTemperature ||
      prevProps.differentialTemperature !== this.props.differentialTemperature
    ) {
      this.createColorScale();
      const sensor = this.getSensor(this.props.selectedId ?? TemperatureGradiant.defaultProps.selectedId);
      this.setTemperature(sensor, this.props.minTemperatureLimit, this.maxTemperatureLimit);
    }

    if (prevProps.selectedId !== this.props.selectedId) {
      const sensor = this.getSensor(this.props.selectedId ?? TemperatureGradiant.defaultProps.selectedId);
      this.setTemperature(sensor, this.props.minTemperatureLimit, this.maxTemperatureLimit);
    }
  }

  createColorScale = () => {
    const height = 40;
    const width = this.state.width;
    const colorScaleId = '#' + this.colorScaleId;

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
        .data(colors)
        .enter()
        .append('stop')
        .attr('offset', (d, i) => i / (colorScale.range().length - 1))
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

  setTemperature = (sensor) => {
    const { minTemperatureLimit, maxTemperatureLimit, setpoint, showDifferentialTemp } = this.props;
    const svg = d3.select('#' + this.colorScaleId + ' svg');

    const absoluteText = d3.select('#' + this.colorScaleId + ' svg #absolute-text');
    const absoluteLine = d3.select('#' + this.colorScaleId + ' svg #absolute-line');
    if (absoluteText) {
      absoluteText.remove();
      absoluteLine.remove();
    }

    if (sensor.id !== undefined && !isNaN(sensor.absolute)) {
      const absoluteTemperatureX = TemperatureGradiant.getGradiantPositionX(
        sensor.absolute,
        minTemperatureLimit,
        maxTemperatureLimit,
        this.state.width,
      );

      svg
        .append('line')
        .attr('id', 'absolute-line')
        .attr('x1', absoluteTemperatureX)
        .attr('y1', -8)
        .attr('x2', absoluteTemperatureX)
        .attr('y2', 43)
        .style('stroke', 'white')
        .style('stroke-width', !showDifferentialTemp ? 5 : 3);

      const textAbsolute = svg
        .append('text')
        .attr('id', 'absolute-text')
        .attr('x', absoluteTemperatureX)
        .attr('y', -10)
        .attr('fill', !showDifferentialTemp ? 'white' : 'var(--base-font-color)')
        .style('font-size', '1em');
      /* .style('font-weight', !showDifferentialTemp ? '600' : 'normal'); */

      if (absoluteTemperatureX > (this.state.width * 3) / 4) {
        textAbsolute.attr('text-anchor', 'end');
      }
      textAbsolute.append('tspan').attr('x', absoluteTemperatureX).attr('y', -45).text(sensor.id);
      textAbsolute.append('tspan').attr('x', absoluteTemperatureX).attr('y', -30).text('Absolute');
      textAbsolute.append('tspan').attr('x', absoluteTemperatureX).attr('y', -15).text(`${sensor.absolute} C°`);
    }

    const differentialText = d3.select('#' + this.colorScaleId + ' svg #differential-text');
    const differentialLine = d3.select('#' + this.colorScaleId + ' svg #differential-line');
    if (differentialText) {
      differentialText.remove();
      differentialLine.remove();
    }

    if (sensor.id !== undefined && !isNaN(sensor.differential)) {
      const differentialTemperatureX = TemperatureGradiant.getGradiantPositionX(
        sensor.differential,
        minTemperatureLimit,
        maxTemperatureLimit,
        this.state.width,
      );

      svg
        .append('line')
        .attr('id', 'differential-line')
        .attr('x1', differentialTemperatureX)
        .attr('y1', -3)
        .attr('x2', differentialTemperatureX)
        .attr('y2', 47)
        .style('stroke', 'white')
        .style('stroke-width', showDifferentialTemp ? 5 : 3);

      const textDifferential = svg
        .append('text')
        .attr('id', 'differential-text')
        .attr('x', differentialTemperatureX)
        .attr('y', 52)
        .attr('fill', showDifferentialTemp ? 'white' : 'var(--base-font-color)')
        .style('font-size', '1em');
      /* .style('font-weight', showDifferentialTemp ? '600' : 'normal'); */

      if (differentialTemperatureX > (this.state.width * 3) / 4) {
        textDifferential.attr('text-anchor', 'end');
      }

      textDifferential.append('tspan').attr('x', differentialTemperatureX).attr('y', 60).text(sensor.id);
      textDifferential.append('tspan').attr('x', differentialTemperatureX).attr('y', 75).text('Differential');
      textDifferential
        .append('tspan')
        .attr('x', differentialTemperatureX)
        .attr('y', 90)
        .text(`${sensor.differential} °C`);
    }

    const setpointLine = d3.select('#' + this.colorScaleId + ' svg #setpoint-line');
    if (setpointLine) {
      setpointLine.remove();
    }

    if (sensor.id !== undefined && !isNaN(setpoint)) {
      const setpointTemperatureX = TemperatureGradiant.getGradiantPositionX(
        setpoint,
        minTemperatureLimit,
        maxTemperatureLimit,
        this.state.width,
      );

      svg
        .append('line')
        .attr('id', 'setpoint-line')
        .attr('x1', setpointTemperatureX)
        .attr('y1', -5)
        .attr('x2', setpointTemperatureX)
        .attr('y2', 45)
        .style('stroke', 'white')
        .style('stroke-width', 3)
        .style('stroke-dasharray', 4);
    }
  };

  render() {
    const { maxTemperatureLimit, minTemperatureLimit, setpoint } = this.props;
    return (
      <div>
        <div className={styles.container}>
          <span className={styles.title}>Temperature</span>
          <span className={styles.value}></span>
          <span className={styles.label}>Set Point</span>
          <span className={styles.value}>{`${defaultNumberFormatter(setpoint, 1)} C°`}</span>
        </div>

        <div className={styles.temperatureGradientWrapper}>
          <div id={this.colorScaleId} className={styles.temperatureGradient}>
            <span style={{ position: 'absolute', bottom: '-2em', left: 0 }}>{minTemperatureLimit} [°C]</span>
            <span style={{ position: 'absolute', top: '-2em', left: 0 }}>{minTemperatureLimit} [°C]</span>
            <svg className={styles.colorScaleSvg} viewBox={`0 0 ${this.state.width} 40`}></svg>
            <span style={{ position: 'absolute', bottom: '-2em', right: 0 }}>{maxTemperatureLimit} [°C]</span>
            <span style={{ position: 'absolute', top: '-2em', right: 0 }}>{maxTemperatureLimit} [°C]</span>
          </div>
        </div>
      </div>
    );
  }
}
