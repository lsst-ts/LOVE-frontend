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
import { M1M3TSFanCoilPositions } from 'Config';
import Button from 'components/GeneralPurpose/Button/Button';
import styles from './Selector.module.css';

const colors = ['#d7191c', '#e76818', '#f29e2e', '#f9d057', '#ffff8c', '#90eb9d', '#00ccbc', '#00a6ca', '#2c7bb6'];
const colorRange = [...d3.range(0, 1, 1.0 / (colors.length - 1)), 1];
const colorScale = d3.scaleLinear().domain(colorRange).range(colors).interpolate(d3.interpolateHcl);

export default class Selector extends Component {
  static propTypes = {
    /** Array for the identify of the position in array with an index */
    sensorReferenceId: PropTypes.arrayOf(PropTypes.number),
    /** Id of sensor selected */
    selectedSensor: PropTypes.number,
    /** Function for the notify of select sensor. */
    sensorSelect: PropTypes.func,
    /** Define wether or not the button is actived for show the ids of FCU. **/
    showFcuIDs: PropTypes.bool,
    /** Define wether or not the button is actived for show the differential temperature or absolute. **/
    showDifferentialTemp: PropTypes.bool,
    /** Define wether or not the button is actived for show the warnings. **/
    showWarnings: PropTypes.bool,
    /** Thermal status response data. Absolute temperature. */
    absoluteTemperature: PropTypes.arrayOf(PropTypes.number),
    /** Thermal status response data.  Differential temperature. */
    differentialTemperature: PropTypes.arrayOf(PropTypes.number),
    /** Number of the minimum temperature limit, used for the gradiant color */
    minTemperatureLimit: PropTypes.number,
    /** Number of the maximum temperature limit, used for the gradiant color */
    maxTemperatureLimit: PropTypes.number,
  };

  static defaultProps = {
    sensorReferenceId: [],
    selectedSensor: undefined,
    sensorSelect: () => {
      console.log('Selector.defaultProps.sensorSelect()');
    },
    showFcuIDs: true,
    showDifferentialTemp: true,
    showWarnings: true,
    absoluteTemperature: [],
    differentialTemperature: [],
    minTemperatureLimit: 0,
    maxTemperatureLimit: 100,
  };

  constructor(props) {
    super(props);
    this.state = {
      sensors: [],
      xRadius: 0,
      yRadius: 0,
      maxRadius: 0,
      colormap: () => '#fff',
      width: 480,
      zoomLevel: 1,
    };
    this.uniqueCircleOverlay = uniqueId('m1m3ts-selector-circle-overlay-');
    this.uniqueScatter = uniqueId('m1m3ts-selector-scatter-');
    this.zoom = null;
  }

  preventDefault(e) {
    e = e || window.event;
    if (e.preventDefault) {
      e.preventDefault();
    }
    e.returnValue = false;
  }

  disableScroll = () => {
    document.addEventListener('wheel', this.preventDefault, {
      passive: false,
    });
  };

  enableScroll = () => {
    document.removeEventListener('wheel', this.preventDefault, false);
  };

  static zip = (arrays) => {
    return arrays[0].map((_, i) => {
      return arrays.map((array) => {
        return array[i];
      });
    });
  };

  strokeSensorSelected = (id) => {
    if (this.props.selectedSensor === id) return 'white';
    return 'none';
  };

  getGradiantColorX = (value) => {
    const { minTemperatureLimit, maxTemperatureLimit } = this.props;
    const colorInterpolate = d3
      .scaleLinear()
      .domain(d3.extent([minTemperatureLimit, maxTemperatureLimit]))
      .range([0, 1]);
    return colorScale(1 - colorInterpolate(value));
  };

  getThermalWarnings = (sensorIndex) => {
    const { thermalWarnings } = this.props;

    const warnings = Object.keys(thermalWarnings)
      .map((key, _) => ({
        name: key,
        value: thermalWarnings[key][sensorIndex],
      }))
      .some((warning) => warning.value === true);

    return warnings;
  };

  getWarningIcon(id) {
    return (
      <>
        <title>{id}</title>
        <g transform-origin={`1.4% -1.4%`} transform={`scale(0.035) rotate(180)`}>
          <path
            transform-origin={`40% -45%`}
            transform={`scale(1.25)`}
            style={{ fill: '#231F20' }}
            d="M24.374-357.857c-20.958,0-30.197,15.223-20.548,33.826L181.421,17.928
    c9.648,18.603,25.463,18.603,35.123,0L394.14-324.031c9.671-18.603,0.421-33.826-20.548-33.826H24.374z"
          />
          <path
            style={{ fill: '#FFCC4D' }}
            d="M24.374-357.857c-20.958,0-30.197,15.223-20.548,33.826L181.421,17.928
    c9.648,18.603,25.463,18.603,35.123,0L394.14-324.031c9.671-18.603,0.421-33.826-20.548-33.826H24.374z"
          />
          <path
            style={{ fill: '#231F20' }}
            d="M173.605-80.922c0,14.814,10.934,23.984,25.395,23.984c14.12,0,25.407-9.512,25.407-23.984
    V-216.75c0-14.461-11.287-23.984-25.407-23.984c-14.461,0-25.395,9.182-25.395,23.984V-80.922z M171.489-289.056
    c0,15.167,12.345,27.511,27.511,27.511c15.167,0,27.523-12.345,27.523-27.511c0-15.178-12.356-27.523-27.523-27.523
    C183.834-316.579,171.489-304.234,171.489-289.056"
          />
        </g>
      </>
    );
  }

  getSensor = (id) => {
    if (id === 0 || id === null) {
      return {
        id: undefined,
        colorDifferentialTemperature: '#FFF',
        colorAbsoluteTemperature: '#FFF',
      };
    }
    const { sensorReferenceId, differentialTemperature, absoluteTemperature } = this.props;

    const fcuIndex = M1M3TSFanCoilPositions.findIndex((fcu) => fcu.id === id);
    const sensorIndex = sensorReferenceId[fcuIndex];

    const differentialValue = differentialTemperature[sensorIndex] ?? 0;
    const absoluteValue = absoluteTemperature[sensorIndex] ?? 0;
    const warning = this.getThermalWarnings(sensorIndex);

    const sensor = {
      id,
      differentialTemperature: differentialValue,
      absoluteTemperature: absoluteValue,
      colorDifferentialTemperature: this.getGradiantColorX(differentialValue),
      colorAbsoluteTemperature: this.getGradiantColorX(absoluteValue),
      warning,
    };
    return sensor;
  };

  componentDidMount() {
    let yMax = -Infinity;
    let xMax = -Infinity;
    let yMin = Infinity;
    let xMin = Infinity;
    let maxRadius = 0;
    M1M3TSFanCoilPositions.forEach((act) => {
      if (xMax < act.position[0]) xMax = act.position[0];
      if (xMin > act.position[0]) xMin = act.position[0];
      if (yMax < act.position[1]) yMax = act.position[1];
      if (yMin > act.position[1]) yMin = act.position[1];
      if (maxRadius < Math.sqrt(act.position[0] * act.position[0] + act.position[1] * act.position[1])) {
        maxRadius = Math.floor(Math.sqrt(act.position[0] * act.position[0] + act.position[1] * act.position[1]));
      }
    });

    const margin = 6;
    xMin += margin;
    xMax -= margin;
    yMin -= margin;
    yMax += margin;

    this.setState({
      sensors: M1M3TSFanCoilPositions,
      xRadius: (xMax - xMin) / 2,
      yRadius: (yMax - yMin) / 2,
      maxRadius,
    });
  }

  componentDidUpdate() {
    this.zoom = d3.zoom().scaleExtent([1, Infinity]).on('zoom', this.zoomed);
    d3.select(`#${this.uniqueCircleOverlay}`).call(this.zoom);
  }

  zoomOut = (event) => {
    d3.select(`#${this.uniqueCircleOverlay}`).call(this.zoom.transform, d3.zoomIdentity.scale(1)).call(this.zoom);
    this.setState({
      zoomLevel: event.transform.k,
    });
  };

  zoomed = (event) => {
    const scale = (Math.max(this.state.xRadius, this.state.yRadius) * this.state.width) / 65000;
    const xRadius = this.state.xRadius + 60; // + margin of render
    const yRadius = this.state.yRadius + 60; // + margin of render

    const transformX = Math.min(
      0,
      Math.max(event.transform.x, 2 * xRadius * scale - 2 * xRadius * scale * event.transform.k),
    );
    const transformY = Math.min(
      0,
      Math.max(event.transform.y, 2 * yRadius * scale - 2 * yRadius * scale * event.transform.k),
    );

    event.transform.x = Math.floor(transformX);
    event.transform.y = Math.floor(transformY);

    d3.select(`#${this.uniqueScatter}`).attr('transform', event.transform);
    this.setState({
      zoomLevel: event.transform.k,
    });
  };

  render() {
    const { showFcuIDs, showDifferentialTemp, showWarnings, sensorSelect, selectedSensor } = this.props;

    const { zoomLevel } = this.state;

    return (
      <div className={styles.container}>
        {this.getSvg(showFcuIDs, showDifferentialTemp, showWarnings, sensorSelect, selectedSensor, zoomLevel)}
      </div>
    );
  }

  getSvg(showFcuIDs, showDifferentialTemp, showWarning, sensorSelect, selectedSensor, zoomLevel) {
    const scale = (Math.max(this.state.xRadius, this.state.yRadius) * this.state.width) / 65000;
    const margin = 60;

    return (
      <>
        {zoomLevel > 1 && (
          <div className={styles.zoomOut}>
            <Button onClick={this.zoomOut}>Zoom out</Button>
          </div>
        )}
        <svg
          className={styles.svgContainer}
          viewBox={`0 0 ${this.state.width} ${this.state.width}`}
          onMouseEnter={this.disableScroll}
          onMouseLeave={this.enableScroll}
        >
          {this.getBackground()}
          {this.getScatter(
            scale,
            margin,
            zoomLevel,
            showFcuIDs,
            showDifferentialTemp,
            showWarning,
            sensorSelect,
            selectedSensor,
          )}
          {this.getAxis(margin, sensorSelect)}
        </svg>
      </>
    );
  }

  getScatter(scale, margin, zoomLevel, showFcuIDs, showDifferentialTemp, showWarning, sensorSelect, selectedSensor) {
    return (
      <g id={this.uniqueScatter} className={styles.scatter}>
        {this.state.sensors.map((act) => {
          const sensorData = this.getSensor(act.id);
          return (
            <g key={act.id} className={styles.sensor} onClick={() => sensorSelect(act.id)}>
              <circle
                cx={(act.position[0] + this.state.xRadius) * scale + margin}
                cy={(act.position[1] + this.state.yRadius) * scale + margin}
                key={act.id}
                fill={
                  showDifferentialTemp
                    ? sensorData?.colorDifferentialTemperature ?? 'gray'
                    : sensorData?.colorAbsoluteTemperature ?? 'gray'
                }
                stroke={selectedSensor === act.id ? this.strokeSensorSelected(act.id) : 'none'}
                strokeWidth={act.id === selectedSensor ? 6 : 4}
                r={(this.state.maxRadius * scale) / 16}
                pointerEvents="all"
              />
              <text
                x={(act.position[0] + this.state.xRadius) * scale + margin}
                y={(act.position[1] + this.state.yRadius) * scale + margin}
                textAnchor="middle"
                alignmentBaseline="middle"
                className={selectedSensor === act.id || (zoomLevel > 1 && showFcuIDs) ? '' : styles.hidden}
                pointerEvents="none"
              >
                {act.id}
              </text>
              {showWarning && sensorData?.warning ? (
                <g
                  transform-origin={`0% 0%`}
                  transform={`translate(${(act.position[0] + this.state.xRadius) * scale + margin} ${
                    (act.position[1] + this.state.yRadius) * scale + margin
                  })`}
                >
                  {this.getWarningIcon(act.id)}
                </g>
              ) : (
                <></>
              )}
            </g>
          );
        })}
      </g>
    );
  }

  getBackground() {
    return (
      <>
        <circle
          id="background-circle"
          className={this.state.sensors.length > 0 ? styles.circleOverlay : styles.circleOverlayDisabled}
          cx={this.state.width / 2}
          cy={this.state.width / 2}
          key={'background'}
          r={this.state.width / 2}
        />

        <circle
          id={this.uniqueCircleOverlay}
          className={this.state.sensors.length > 0 ? styles.cursorMove : styles.circleOverlayDisabled}
          cx={this.state.width / 2}
          cy={this.state.width / 2}
          key={'overlay'}
          fill={'none'}
          r={this.state.width / 2}
          pointerEvents="all"
          onMouseEnter={this.enableScroll}
          onMouseLeave={this.disableScroll}
        />
      </>
    );
  }

  getAxis(margin, sensorSelect) {
    return (
      <>
        <circle
          className={styles.borderCircleOverlay}
          cx={this.state.width / 2}
          cy={this.state.width / 2}
          fill={'none'}
          r={this.state.width / 2 - 30}
        />

        <circle
          className={styles.hiddenCircleOverlay}
          cx={this.state.width / 2}
          cy={this.state.width / 2}
          fill={'none'}
          r={this.state.width / 2 + 50}
          onClick={() => sensorSelect(null)}
        />

        <g id="plot-axis">
          <text
            className={styles.axisLabel}
            x={this.state.width / 2 - 5}
            y={margin / 2 - 12}
            textAnchor="middle"
            alignmentBaseline="middle"
          >
            +Y
          </text>
          <text
            className={styles.axisLabel}
            x={this.state.width - 12}
            y={this.state.width / 2 - 5}
            textAnchor="middle"
            alignmentBaseline="middle"
          >
            +X
          </text>
          <text
            className={styles.axisLabel}
            x={this.state.width / 2 - 5}
            y={this.state.width - margin / 2 + 16}
            textAnchor="middle"
            alignmentBaseline="middle"
          >
            -Y
          </text>
          <text
            className={styles.axisLabel}
            x={12}
            y={this.state.width / 2 - 5}
            textAnchor="middle"
            alignmentBaseline="middle"
          >
            -X
          </text>
        </g>
      </>
    );
  }
}
