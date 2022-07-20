import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import { defaultNumberFormatter } from 'Utils';
import Title from 'components/GeneralPurpose/SummaryPanel/Title';
import Label from 'components/GeneralPurpose/SummaryPanel/Label';
import Value from 'components/GeneralPurpose/SummaryPanel/Value';

import styles from './TemperatureGradiant.module.css';

export default class TemperatureGradiant extends Component {
  static propTypes = {
    /** Array for the identify of the position in array with an index */
    sensorReferenceId: PropTypes.arrayOf(PropTypes.number),

    absoluteTemperature: PropTypes.arrayOf(PropTypes.number),
    differentialTemperature: PropTypes.arrayOf(PropTypes.number),

    selectedId: PropTypes.number,
    setpoint: PropTypes.number,

    /** Number of the minimum force limit, used for the gradiant color */
    minTemperatureLimit: PropTypes.number,
    /** Number of the maximum force limit, used for the gradiant color */
    maxTemperatureLimit: PropTypes.number,
  }

  static defaultProps = {
    sensorReferenceId: [],
    absoluteTemperature: [],
    differentialTemperature: [],

    selectedId: 2,

    setpoint: 18.9,

    minTemperatureLimit: 0,
    maxTemperatureLimit: 1000,
  }

  static COLOURS_INV = ['#2c7bb6', '#00a6ca', '#00ccbc', '#90eb9d', '#ffff8c', '#f9d057', '#f29e2e', '#e76818', '#d7191c'];
  static COLOURS = ['#d7191c', '#e76818', '#f29e2e', '#f9d057', '#ffff8c', '#90eb9d', '#00ccbc', '#00a6ca', '#2c7bb6'];

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

  getSensor = (id) => {
    if (id === 0 || id === null || id === undefined) return { id: undefined };
    const {
      sensorReferenceId,
      absoluteTemperature,
      differentialTemperature,
    } = this.props;
    const sensorIndex = sensorReferenceId.indexOf(id);
    console.log('sensorReferenceId',sensorReferenceId,'sensorIndex', sensorIndex);
    console.log('absoluteTemperature[sensorIndex]', absoluteTemperature[sensorIndex]);

    const sensor = {
      id: `${String(id).padStart(2, '0')}`,
      absolute: absoluteTemperature[sensorIndex] ?? 0,
      differential: differentialTemperature[sensorIndex] ?? 0,
    };
    return sensor;
  }

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
    const { minTemperatureLimit, maxTemperatureLimit } = this.props;

    const svg = d3.select('#color-scale svg');
    const absoluteText = d3.select('#color-scale svg #absolute-text');
    const absoluteLine = d3.select('#color-scale svg #absolute-line');
    
    const absoluteTemperatureX = TemperatureGradiant.getGradiantPositionX(sensor.absolute,
      minTemperatureLimit, maxTemperatureLimit, this.state.width);

    if (absoluteText) {
      absoluteText.remove();
      absoluteLine.remove();
    }

    if (sensor.id !== undefined) {
      svg
        .append('line')
        .attr('id', 'absolute-line')
        .attr('x1', absoluteTemperatureX)
        .attr('y1', -10)
        .attr('x2', absoluteTemperatureX)
        .attr('y2', 50)
        .style('stroke', 'white')
        .style('stroke-width', 3);

      const textAbsolute = svg
        .append('text')
        .attr('id', 'absolute-text')
        .attr('x', absoluteTemperatureX)
        .attr('y', -10)
        .attr('fill', 'white')
        .style('font-size', '1em');

      if (absoluteTemperatureX > ((this.state.width * 3) / 4)) {
        textAbsolute.attr('text-anchor', 'end');
      }
      textAbsolute.append('tspan').attr('x', absoluteTemperatureX).attr('y', -45).text(sensor.id);
      textAbsolute.append('tspan').attr('x', absoluteTemperatureX).attr('y', -30).text('Absolute');
      textAbsolute.append('tspan').attr('x', absoluteTemperatureX).attr('y', -15)
        .text(`${sensor.absolute} C°`);
    }

    const differentialText = d3.select('#color-scale svg #differential-text');
    const differentialLine = d3.select('#color-scale svg #differential-line');

    if (differentialText) {
      differentialText.remove();
      differentialLine.remove();
    }

    if (sensor.id !== undefined) {
      const differentialTemperatureX = TemperatureGradiant.getGradiantPositionX(sensor.differential,
        minTemperatureLimit, maxTemperatureLimit, this.state.width);
      svg
        .append('line')
        .attr('id', 'differential-line')
        .attr('x1', differentialTemperatureX)
        .attr('y1', -10)
        .attr('x2', differentialTemperatureX)
        .attr('y2', 50)
        .style('stroke', 'white')
        .style('stroke-width', 3);

      const textDifferential = svg
        .append('text')
        .attr('id', 'differential-text')
        .attr('x', differentialTemperatureX)
        .attr('y', 50)
        .attr('fill', 'white')
        .style('font-size', '1em');

      if (differentialTemperatureX > ((this.state.width * 3) / 4)) {
        textDifferential.attr('text-anchor', 'end');
      }

      textDifferential.append('tspan').attr('x', differentialTemperatureX).attr('y', 60).text(sensor.id);
      textDifferential.append('tspan').attr('x', differentialTemperatureX).attr('y', 75).text('Differential');
      textDifferential.append('tspan').attr('x', differentialTemperatureX).attr('y', 90)
        .text(`${sensor.differential} °C`);
    } 
  }

  render() {
    const {
      maxTemperatureLimit,
      minTemperatureLimit,
      setpoint,
    } = this.props;
    return (
            <div>
              <div className={styles.container}>
                <span className={styles.title}>Temperature</span>
                <span className={styles.value}></span>
                <span className={styles.label}>Set Point</span>
                <span className={styles.value}>{`${defaultNumberFormatter(setpoint, 1)} C°`}</span>
              </div>

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
