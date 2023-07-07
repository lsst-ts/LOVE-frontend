import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import { uniqueId } from 'lodash';
import { defaultNumberFormatter } from 'Utils';
import styles from './TemperatureGradiant.module.css';

export default class TemperatureGradiant extends Component {
  static propTypes = {
    /** Array for the identify of the position in array with an index */
    sensorReferenceId: PropTypes.arrayOf(PropTypes.number),
    /** Thermal status response data. Absolute temperature. */
    absoluteTemperature: PropTypes.arrayOf(PropTypes.number),
    /** Id of sensor selected */
    selectedId: PropTypes.number,
    /** Applied setpoint. */
    setpoint: PropTypes.number,
    /** Number of the minimum force limit, used for the gradiant color */
    minTemperatureLimit: PropTypes.number,
    /** Number of the maximum force limit, used for the gradiant color */
    maxTemperatureLimit: PropTypes.number,
  };

  static defaultProps = {
    sensorReferenceId: [],
    absoluteTemperature: [],
    selectedId: undefined,
    setpoint: 0,
    minTemperatureLimit: -6000,
    maxTemperatureLimit: 6000,
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

  static COLOUR_RANGE = [...d3.range(0, 1, 1.0 / (TemperatureGradiant.COLOURS.length - 1)), 1];

  static COLOR_SCALE = d3
    .scaleLinear()
    .domain(TemperatureGradiant.COLOUR_RANGE)
    .range(TemperatureGradiant.COLOURS)
    .interpolate(d3.interpolateHcl);

  constructor(props) {
    super(props);
    this.state = {
      width: 350,
    };
    this.uniqueColorScale = uniqueId('ess-maintel-temp-gradient-color-scale-');
    this.uniqueTempGradient = uniqueId('ess-maintel-temp-gradient-');
  }

  getSensor = (id) => {
    if (id === 0 || id === null || id === undefined) return { id: undefined };
    const { sensorReferenceId, absoluteTemperature, differentialTemperature } = this.props;
    const sensorIndex = sensorReferenceId.indexOf(id);

    const sensor = {
      id: `${String(id).padStart(3, '0')}`,
      absolute: absoluteTemperature[sensorIndex] ?? 0,
    };
    return sensor;
  };

  componentDidUpdate(prevProps) {
    if (
      prevProps.absoluteTemperature !== this.props.absoluteTemperature
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
        .data(TemperatureGradiant.COLOURS)
        .enter()
        .append('stop')
        .attr('offset', (d, i) => i / (TemperatureGradiant.COLOR_SCALE.range().length - 1))
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

  setTemperature = (sensor) => {
    const { minTemperatureLimit, maxTemperatureLimit, setpoint, showDifferentialTemp } = this.props;

    const svg = d3.select(`#${this.uniqueColorScale} svg`);
    const absoluteText = d3.select(`#${this.uniqueColorScale} svg #absolute-text`);
    const absoluteLine = d3.select(`#${this.uniqueColorScale} svg #absolute-line`);

    const absoluteTemperatureX = TemperatureGradiant.getGradiantPositionX(
      sensor.absolute,
      minTemperatureLimit,
      maxTemperatureLimit,
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
        .attr('x1', absoluteTemperatureX)
        .attr('y1', -8)
        .attr('x2', absoluteTemperatureX)
        .attr('y2', 43)
        .style('stroke', 'white')
        .style('stroke-width', 3);

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
      textAbsolute.append('tspan').attr('x', absoluteTemperatureX).attr('y', -30).text(sensor.id);
      textAbsolute.append('tspan').attr('x', absoluteTemperatureX).attr('y', -15).text(`${defaultNumberFormatter(sensor.absolute, 2)} C°`);
    }

    const setpointLine = d3.select(`#${this.uniqueColorScale} svg #setpoint-line`);

    if (setpointLine) {
      setpointLine.remove();
    }

    if (sensor.id !== undefined) {
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
        </div>

        <div className={styles.temperatureGradientWrapper}>
          <div id={this.uniqueColorScale}className={styles.temperatureGradient}>
            <span style={{ position: 'absolute', bottom: '-2em', left: 0 }}>{minTemperatureLimit} [°C]</span>
            <svg className={styles.colorScaleSvg} viewBox={`0 0 ${this.state.width} 40`}></svg>
            <span style={{ position: 'absolute', bottom: '-2em', right: 0 }}>{maxTemperatureLimit} [°C]</span>
          </div>
        </div>
      </div>
    );
  }
}
