import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

import styles from './TemperatureGradiant.module.css';

export default class TemperatureGradiant extends Component {
  static propTypes = {
    /** Array for the identify of the position in array with an index */
    sensorReferenceId: PropTypes.arrayOf(PropTypes.number),

    /**  */
    termalSystemFan: PropTypes.arrayOf(PropTypes.number),
    /**   */
    termalSystemCoil: PropTypes.arrayOf(PropTypes.number),
    /** Force applied by SAL command or script for each actuator in sequence. */
    /** Id of sensor selected */
    selectedId: PropTypes.number,

    /** Number of the minimum force limit, used for the gradiant color */
    minTemperatureLimit: PropTypes.number,
    /** Number of the maximum force limit, used for the gradiant color */
    maxTemperatureLimit: PropTypes.number,
  }

  static defaultProps = {
    sensorReferenceId: [],

    termalSystemFan: [],
    termalSystemCoil: [],

    selectedId: undefined,

    minTemperatureLimit: 0,
    maxTemperatureLimit: 1000,
  }

  static COLOURS = ['#2c7bb6', '#00a6ca', '#00ccbc', '#90eb9d', '#ffff8c', '#f9d057', '#f29e2e', '#e76818', '#d7191c'];

  static COLOUR_RANGE = [...d3.range(0, 1, 1.0 / (TemperatureGradiant.COLOURS.length - 1)), 1];

  static COLOR_SCALE = d3.scaleLinear()
    .domain(TemperatureGradiant.COLOUR_RANGE)
    .range(TemperatureGradiant.COLOURS)
    .interpolate(d3.interpolateHcl);

  constructor(props) {
    super(props);
    this.state = {
      width: 350,
    };
  }

/*   getActuator = (id) => {
    if (id === 0 || id === null) return { id: undefined };
    const {
      actuatorReferenceId,
      axialForceApplied,
      axialForceMeasured,
    } = this.props;

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
    const {
      actuatorTangentReferenceId,
      tangentForceApplied,
      tangentForceMeasured,
    } = this.props;

    const actuatorIndex = actuatorTangentReferenceId.indexOf(id);

    const actuator = {
      id: `A${id}`,
      commanded: tangentForceApplied[actuatorIndex] ?? 0,
      measured: tangentForceMeasured[actuatorIndex] ?? 0,
    };
    return actuator;
  } */

  componentDidUpdate(prevProps) {
/*     if (
      prevProps.axialForceApplied !== this.props.axialForceApplied ||
      prevProps.axialForceMeasured !== this.props.axialForceMeasured ||
      prevProps.tangentForceApplied !== this.props.tangentForceApplied ||
      prevProps.tangentForceMeasured !== this.props.tangentForceMeasured
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

    if (prevProps.selectedActuator !== this.props.selectedActuator) {
      const actuator = this.getActuator(this.props.selectedActuator);
      this.setForce(actuator, this.props.minForceLimit, this.props.maxForceLimit);
    }

    if (prevProps.selectedActuatorTangent !== this.props.selectedActuatorTangent) {
      const actuator = this.getActuatorTangent(this.props.selectedActuatorTangent);
      this.setForce(actuator, this.props.minForceLimit, this.props.maxForceLimit);
    } */
  }

  createColorScale = () => {
    const height = 40;
    const width = this.state.width;

    // Create the gradient
    const svg = d3.select('#color-scale svg');
    const temperatureGradientRect = d3.select('#color-scale svg #temperature-gradient-rect');

    if (temperatureGradientRect.empty()) {
      svg
        .attr('width', width)
        .attr('height', height);
      svg
        .append('defs')
        .append('linearGradient')
        .attr('id', 'temperature-gradient')
        .attr('x1', '100%')
        .attr('y1', '0%')
        .attr('x2', '0%')
        .attr('y2', '0%')
        .selectAll('stop')
        .data(TemperatureGradiant.COLOURS)
        .enter()
        .append('stop')
        .attr('offset', (d, i) => i / (TemperatureGradiant.COLOR_SCALE.range().length - 1))
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
/*     const { minTemperatureLimit, maxTemperatureLimit } = this.props;

    const svg = d3.select('#color-scale svg');
    const measuredText = d3.select('#color-scale svg #measured-text');
    const measuredLine = d3.select('#color-scale svg #measured-line');
    const measuredTemperatureX = TemperatureGradiant.getGradiantPositionX(actuator.measured,
      minTemperatureLimit, maxTemperatureLimit, this.state.width);

    if (measuredText) {
      measuredText.remove();
      measuredLine.remove();
    }

    if (actuator.id !== undefined) {
      svg
        .append('line')
        .attr('id', 'measured-line')
        .attr('x1', measuredTemperatureX)
        .attr('y1', -10)
        .attr('x2', measuredTemperatureX)
        .attr('y2', 50)
        .style('stroke', 'white')
        .style('stroke-width', 3);

      const textMeasured = svg
        .append('text')
        .attr('id', 'measured-text')
        .attr('x', measuredTemperatureX)
        .attr('y', -10)
        .attr('fill', 'white')
        .style('font-size', '1em');

      if (measuredTemperatureX > ((this.state.width * 3) / 4)) {
        textMeasured.attr('text-anchor', 'end');
      }
      textMeasured.append('tspan').attr('x', measuredTemperatureX).attr('y', -45).text(actuator.id);
      textMeasured.append('tspan').attr('x', measuredTemperatureX).attr('y', -30).text('Measured');
      textMeasured.append('tspan').attr('x', measuredTemperatureX).attr('y', -15)
        .text(`${actuator.measured}N`);
    }

    const commandedText = d3.select('#color-scale svg #commanded-text');
    const commandedLine = d3.select('#color-scale svg #commanded-line');

    if (commandedText) {
      commandedText.remove();
      commandedLine.remove();
    }

    if (actuator.id !== undefined) {
      const commandedTemperatureX = TemperatureGradiant.getGradiantPositionX(actuator.commanded,
        minTemperatureLimit, maxTemperatureLimit, this.state.width);
      svg
        .append('line')
        .attr('id', 'commanded-line')
        .attr('x1', commandedTemperatureX)
        .attr('y1', -10)
        .attr('x2', commandedTemperatureX)
        .attr('y2', 50)
        .style('stroke', 'white')
        .style('stroke-width', 3);

      const textCommanded = svg
        .append('text')
        .attr('id', 'commanded-text')
        .attr('x', commandedTemperatureX)
        .attr('y', 50)
        .attr('fill', 'white')
        .style('font-size', '1em');

      if (commandedTemperatureX > ((this.state.width * 3) / 4)) {
        textCommanded.attr('text-anchor', 'end');
      }

      textCommanded.append('tspan').attr('x', commandedTemperatureX).attr('y', 60).text(actuator.id);
      textCommanded.append('tspan').attr('x', commandedTemperatureX).attr('y', 75).text('Commanded');
      textCommanded.append('tspan').attr('x', commandedTemperatureX).attr('y', 90)
        .text(`${actuator.commanded}N`);
    } */
  }

  render() {
    const { maxTemperatureLimit, minTemperatureLimit } = this.props;
    return (
            <div>
              <p className={styles.title}>Temperature</p>
              <div className={styles.temperatureGradientWrapper}>
                <div id="color-scale" className={styles.temperatureGradient}>
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
