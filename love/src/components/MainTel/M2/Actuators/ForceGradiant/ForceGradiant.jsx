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
import { isEqual, uniqueId } from 'lodash';
import { defaultNumberFormatter } from 'Utils';

import styles from './ForceGradiant.module.css';

export default class ForceGradiant extends Component {
  static propTypes = {
    /** Array for the identify of the position in array with an index */
    actuatorReferenceId: PropTypes.arrayOf(PropTypes.number),
    /** Array for the identify of the position in array with an index */
    actuatorTangentReferenceId: PropTypes.arrayOf(PropTypes.number),
    /** Force applied by SAL command or script for each actuator in sequence. */
    axialForceApplied: PropTypes.arrayOf(PropTypes.number),
    /** Force measurement by load cell for each actuator in sequence. */
    axialForceMeasured: PropTypes.arrayOf(PropTypes.number),
    /** Force applied by SAL command or script for each actuator in sequence. */
    tangentForceApplied: PropTypes.arrayOf(PropTypes.number),
    /** Force measurement by load cell for each actuator in sequence. */
    tangentForceMeasured: PropTypes.arrayOf(PropTypes.number),
    /** Id of actuator selected */
    selectedActuator: PropTypes.number,
    /** Id of actuator tangent selected */
    selectedActuatorTangent: PropTypes.number,
    /** Number of the minimum force limit, used for the gradiant color */
    minForceLimit: PropTypes.number,
    /** Number of the maximum force limit, used for the gradiant color */
    maxForceLimit: PropTypes.number,
  };

  static defaultProps = {
    actuatorReferenceId: [],
    actuatorTangentReferenceId: [],
    axialForceApplied: [],
    axialForceMeasured: [],
    tangentForceApplied: [],
    tangentForceMeasured: [],
    selectedActuator: undefined,
    selectedActuatorTangent: undefined,
    minForceLimit: 0,
    maxForceLimit: 1000,
  };

  static COLOURS = ['#2c7bb6', '#00a6ca', '#00ccbc', '#90eb9d', '#ffff8c', '#f9d057', '#f29e2e', '#e76818', '#d7191c'];

  static COLOUR_RANGE = [...d3.range(0, 1, 1.0 / (ForceGradiant.COLOURS.length - 1)), 1];

  static COLOR_SCALE = d3
    .scaleLinear()
    .domain(ForceGradiant.COLOUR_RANGE)
    .range(ForceGradiant.COLOURS)
    .interpolate(d3.interpolateHcl);

  constructor(props) {
    super(props);
    this.state = {
      width: 350,
    };
    this.uniqueColorScale = uniqueId('m2-forcegradient-color-scale-');
    this.uniqueForceGradient = uniqueId('m2-forcegradient-');
  }

  getActuator = (id) => {
    if (id === 0 || id === null) return { id: undefined };
    const { actuatorReferenceId, axialForceApplied, axialForceMeasured } = this.props;

    const actuatorIndex = actuatorReferenceId.indexOf(id);

    const actuator = {
      id: `C${String(id).padStart(2, '0')}`,
      commanded: axialForceApplied[actuatorIndex] ?? 0,
      measured: axialForceMeasured[actuatorIndex] ?? 0,
    };
    return actuator;
  };

  getActuatorTangent = (id) => {
    if (id === 0 || id === null) return { id: undefined };
    const { actuatorTangentReferenceId, tangentForceApplied, tangentForceMeasured } = this.props;

    const actuatorIndex = actuatorTangentReferenceId.indexOf(id);

    const actuator = {
      id: `A${id}`,
      commanded: tangentForceApplied[actuatorIndex] ?? 0,
      measured: tangentForceMeasured[actuatorIndex] ?? 0,
    };
    return actuator;
  };

  componentDidMount() {
    this.createColorScale();
    if (this.props.selectedActuator) {
      const actuator = this.getActuator(this.props.selectedActuator);
      this.setForce(actuator, this.props.minForceLimit, this.props.maxForceLimit);
    }
    if (this.props.selectedActuatorTangent) {
      const actuator = this.getActuatorTangent(this.props.selectedActuatorTangent);
      this.setForce(actuator, this.props.minForceLimit, this.props.maxForceLimit);
    }
  }

  componentDidUpdate(prevProps) {
    if (
      !isEqual(prevProps.axialForceApplied, this.props.axialForceApplied) ||
      !isEqual(prevProps.axialForceMeasured, this.props.axialForceMeasured) ||
      !isEqual(prevProps.tangentForceApplied, this.props.tangentForceApplied) ||
      !isEqual(prevProps.tangentForceMeasured, this.props.tangentForceMeasured) ||
      prevProps.selectedActuator !== this.props.selectedActuator ||
      prevProps.selectedActuatorTangent !== this.props.selectedActuatorTangent
    ) {
      this.createColorScale();
      if (this.props.selectedActuator) {
        const actuator = this.getActuator(this.props.selectedActuator);
        this.setForce(actuator, this.props.minForceLimit, this.props.maxForceLimit);
      }
      if (this.props.selectedActuatorTangent) {
        const actuator = this.getActuatorTangent(this.props.selectedActuatorTangent);
        this.setForce(actuator, this.props.minForceLimit, this.props.maxForceLimit);
      }
    }
  }

  createColorScale = () => {
    const height = 40;
    const width = this.state.width;

    // Create the gradient
    const svg = d3.select(`#${this.uniqueColorScale} svg`);
    const forceGradientRect = d3.select(`#${this.uniqueColorScale} svg #${this.uniqueForceGradient}-rect`);

    if (forceGradientRect.empty()) {
      svg.attr('width', width).attr('height', height);
      svg
        .append('defs')
        .append('linearGradient')
        .attr('id', `${this.uniqueForceGradient}`)
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '100%')
        .attr('y2', '0%')
        .selectAll('stop')
        .data(ForceGradiant.COLOURS)
        .enter()
        .append('stop')
        .attr('offset', (d, i) => i / (ForceGradiant.COLOR_SCALE.range().length - 1))
        .attr('stop-color', (d) => d);

      svg
        .append('rect')
        .attr('id', `${this.uniqueForceGradient}-rect`)
        .attr('x', 0)
        .attr('y', 0)
        .attr('rx', 0)
        .attr('ry', 0)
        .attr('width', width)
        .attr('height', 40)
        .style('fill', `url(#${this.uniqueForceGradient})`);
    }
  };

  static getGradiantPositionX(value, min, max, width) {
    const lerp = (x, y, a) => x * (1 - a) + y * a;
    const clamp = (a, _min = 0, _max = 1) => Math.min(_max, Math.max(_min, a));
    const invlerp = (x, y, a) => clamp((a - x) / (y - x));
    const range = (x1, y1, x2, y2, a) => lerp(x2, y2, invlerp(x1, y1, a));
    return range(min, max, 0, width, value);
  }

  setForce = (actuator) => {
    const { minForceLimit, maxForceLimit } = this.props;

    const svg = d3.select(`#${this.uniqueColorScale} svg`);
    svg.style('z-index', 999);
    const measuredText = d3.select(`#${this.uniqueColorScale} svg #measured-text`);
    const measuredLine = d3.select(`#${this.uniqueColorScale} svg #measured-line`);
    const measuredForceX = ForceGradiant.getGradiantPositionX(
      actuator.measured,
      minForceLimit,
      maxForceLimit,
      this.state.width,
    );

    if (measuredText) {
      measuredText.remove();
      measuredLine.remove();
    }

    if (actuator.id !== undefined) {
      svg
        .append('line')
        .attr('id', 'measured-line')
        .attr('x1', measuredForceX)
        .attr('y1', -10)
        .attr('x2', measuredForceX)
        .attr('y2', 50)
        .style('stroke', 'white')
        .style('stroke-width', 3);

      svg
        .append('rect')
        .attr('width', 100)
        .attr('height', 60)
        .attr('fill', 'var(--second-primary-background-color)')
        .attr('x', measuredForceX - 5)
        .attr('y', -65);

      const textMeasured = svg
        .append('text')
        .attr('id', 'measured-text')
        .attr('x', measuredForceX)
        .attr('y', -10)
        .attr('fill', 'white')
        .style('font-size', '1em');

      if (measuredForceX > (this.state.width * 3) / 4) {
        textMeasured.attr('text-anchor', 'end');
      }
      textMeasured.append('tspan').attr('x', measuredForceX).attr('y', -45).text(actuator.id);
      textMeasured.append('tspan').attr('x', measuredForceX).attr('y', -30).text('Measured');
      textMeasured
        .append('tspan')
        .attr('x', measuredForceX)
        .attr('y', -15)
        .text(`${defaultNumberFormatter(actuator.measured, 2)} N`);
    }

    const commandedText = d3.select(`#${this.uniqueColorScale} svg #commanded-text`);
    const commandedLine = d3.select(`#${this.uniqueColorScale} svg #commanded-line`);

    if (commandedText) {
      commandedText.remove();
      commandedLine.remove();
    }

    if (actuator.id !== undefined) {
      const commandedForceX = ForceGradiant.getGradiantPositionX(
        actuator.commanded,
        minForceLimit,
        maxForceLimit,
        this.state.width,
      );
      svg
        .append('line')
        .attr('id', 'commanded-line')
        .attr('x1', commandedForceX)
        .attr('y1', -10)
        .attr('x2', commandedForceX)
        .attr('y2', 50)
        .style('stroke', 'white')
        .style('stroke-width', 3);

      svg
        .append('rect')
        .attr('width', 100)
        .attr('height', 60)
        .attr('fill', 'var(--second-primary-background-color)')
        .attr('x', commandedForceX - 5)
        .attr('y', 45);

      const textCommanded = svg
        .append('text')
        .attr('id', 'commanded-text')
        .attr('x', commandedForceX)
        .attr('y', 50)
        .attr('fill', 'white')
        .style('font-size', '1em');

      if (commandedForceX > (this.state.width * 3) / 4) {
        textCommanded.attr('text-anchor', 'end');
      }

      textCommanded.append('tspan').attr('x', commandedForceX).attr('y', 60).text(actuator.id);
      textCommanded.append('tspan').attr('x', commandedForceX).attr('y', 75).text('Commanded');
      textCommanded
        .append('tspan')
        .attr('x', commandedForceX)
        .attr('y', 90)
        .text(`${defaultNumberFormatter(actuator.commanded, 2)} N`);
    }
  };

  render() {
    const { maxForceLimit, minForceLimit } = this.props;
    return (
      <>
        <p className={styles.title}>Force</p>
        <div id={this.uniqueColorScale} className={styles.forceGradient}>
          <div style={{ width: this.state.width, marginBottom: '0.5em' }}>
            <span style={{ float: 'left' }}>{defaultNumberFormatter(minForceLimit, 2)} [N]</span>
            <span style={{ float: 'right' }}>{defaultNumberFormatter(maxForceLimit, 2)} [N]</span>
          </div>
          <svg className={styles.colorScaleSvg} viewBox={`0 0 ${this.state.width} 40`}></svg>
          <div style={{ width: this.state.width, marginTop: '0.5em' }}>
            <span style={{ float: 'left' }}>{defaultNumberFormatter(minForceLimit, 2)} [N]</span>
            <span style={{ float: 'right' }}>{defaultNumberFormatter(maxForceLimit, 2)} [N]</span>
          </div>
        </div>
      </>
    );
  }
}
