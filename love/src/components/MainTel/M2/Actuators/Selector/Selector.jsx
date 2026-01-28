/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed by Inria Chile and the Telescope and Site Software team.

Developed for the Vera C. Rubin Observatory Telescope and Site Systems.

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
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import { uniqueId } from 'lodash';
import { M2ActuatorPositions, M2ActuatorTangentAngles } from 'Config';
import { radians } from 'Utils';
import ForceGradient from '../ForceGradient/ForceGradient';
import Button from 'components/GeneralPurpose/Button/Button';
import styles from './Selector.module.css';

export default class Selector extends Component {
  static propTypes = {
    /** Array for the identify of the position in array with an index */
    actuatorReferenceId: PropTypes.arrayOf(PropTypes.number),
    /** Array for the identify of the position in array with an index */
    actuatorTangentReferenceId: PropTypes.arrayOf(PropTypes.number),
    /** Id of actuator selected */
    selectedActuator: PropTypes.number,
    /** Id of actuator tangent selected */
    selectedActuatorTangent: PropTypes.number,
    /** Function for change the actuator selected */
    actuatorSelect: PropTypes.func,
    /** Function for change the actuator tangent selected */
    actuatorTangentSelect: PropTypes.func,
    /** Force applied by SAL command or script for each actuator in sequence. */
    axialForceApplied: PropTypes.arrayOf(PropTypes.number),
    /** Force measurement by load cell for each actuator in sequence. */
    axialForceMeasured: PropTypes.arrayOf(PropTypes.number),
    /** Force applied by SAL command or script for each actuator in sequence. */
    tangentForceApplied: PropTypes.arrayOf(PropTypes.number),
    /** Force measurement by load cell for each actuator in sequence. */
    tangentForceMeasured: PropTypes.arrayOf(PropTypes.number),
    /** Number of the minimum force limit, used for the gradiant color */
    minForceLimit: PropTypes.number,
    /** Number of the maximum force limit, used for the gradiant color */
    maxForceLimit: PropTypes.number,
    /** Boolean value about if show the actuators id */
    showActuatorsID: PropTypes.bool,
    /** Boolean value about if show color of commanded force */
    showCommandedForce: PropTypes.bool,
    /** Boolean value about if show color of measured force */
    showMeasuredForce: PropTypes.bool,
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
    actuatorSelect: () => {},
    actuatorTangentSelect: () => {},
    showActuatorsID: false,
    showCommandedForce: false,
    showMeasuredForce: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      actuators: [],
      xRadius: 0,
      yRadius: 0,
      maxRadius: 0,
      colormap: () => '#fff',
      width: 480,
      zoomLevel: 1,
    };
    this.uniqueCircleOverlay = uniqueId('m2-selector-circle-overlay-');
    this.uniqueScatter = uniqueId('m2-selector-scatter-');
    this.uniqueMirrorHole = uniqueId('m2-selector-mirror-hole-');
    this.uniqueAxes = uniqueId('m2-selector-axes-');

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

  strokeActuatorSelected = (id) => {
    if (this.props.selectedActuator === id) return 'white';
    return 'none';
  };

  strokeActuatorTangentSelected = (id) => {
    if (this.props.selectedActuatorTangent === id) return 'white';
    return 'none';
  };

  getGradiantColorX = (value) => {
    const { minForceLimit, maxForceLimit } = this.props;
    const colorInterpolate = d3
      .scaleLinear()
      .domain(d3.extent([minForceLimit, maxForceLimit]))
      .range([0, 1]);
    return ForceGradient.COLOR_SCALE(colorInterpolate(value));
  };

  getActuator = (id) => {
    if (id === 0 || id === null) {
      return {
        id: undefined,
        colorForceApplied: '#FFF',
        colorForceMeasured: '#FFF',
      };
    }
    const { actuatorReferenceId, axialForceApplied, axialForceMeasured } = this.props;

    const actuatorIndex = actuatorReferenceId.indexOf(id);
    const actuator = {
      id,
      axialForceApplied: axialForceApplied[actuatorIndex] ?? 0,
      axialForceMeasured: axialForceMeasured[actuatorIndex] ?? 0,
      colorForceApplied: this.getGradiantColorX(axialForceApplied[actuatorIndex]),
      colorForceMeasured: this.getGradiantColorX(axialForceMeasured[actuatorIndex]),
    };
    return actuator;
  };

  getActuatorTangent = (id) => {
    if (id === 0 || id === null) {
      return {
        id: undefined,
        colorForceApplied: '#FFF',
        colorForceMeasured: '#FFF',
      };
    }
    const { actuatorTangentReferenceId, tangentForceApplied, tangentForceMeasured } = this.props;

    const actuatorIndex = actuatorTangentReferenceId.indexOf(id);
    const actuator = {
      id,
      tangentForceApplied: tangentForceApplied[actuatorIndex] ?? 0,
      tangentForceMeasured: tangentForceMeasured[actuatorIndex] ?? 0,
      colorForceApplied: this.getGradiantColorX(tangentForceApplied[actuatorIndex]),
      colorForceMeasured: this.getGradiantColorX(tangentForceMeasured[actuatorIndex]),
    };
    return actuator;
  };

  componentDidMount() {
    let yMax = -Infinity;
    let xMax = -Infinity;
    let yMin = Infinity;
    let xMin = Infinity;
    let maxRadius = 0;

    M2ActuatorPositions.forEach((act) => {
      if (xMax < act.position[0]) xMax = act.position[0];
      if (xMin > act.position[0]) xMin = act.position[0];
      if (yMax < act.position[1]) yMax = act.position[1];
      if (yMin > act.position[1]) yMin = act.position[1];
      if (maxRadius < Math.sqrt(act.position[0] * act.position[0] + act.position[1] * act.position[1])) {
        maxRadius = Math.floor(Math.sqrt(act.position[0] * act.position[0] + act.position[1] * act.position[1]));
      }
    });

    xMin = -150;
    xMax = 160;
    yMin = -150;
    yMax = 160;
    maxRadius = 160;

    this.setState({
      actuators: M2ActuatorPositions,
      xRadius: (xMax - xMin) / 2,
      yRadius: (yMax - yMin) / 2,
      maxRadius,
    });
  }

  componentDidUpdate() {
    this.zoom = d3.zoom().scaleExtent([1, Infinity]).on('zoom', this.zoomed);
    d3.select(`#${this.uniqueCircleOverlay}`).call(this.zoom);
  }

  zoomOut = () => {
    d3.select(`#${this.uniqueCircleOverlay}`).call(this.zoom.transform, d3.zoomIdentity.scale(1)).call(this.zoom);
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
    d3.select(`#${this.uniqueMirrorHole}`).attr('transform', event.transform);
    d3.select(`#${this.uniqueAxes}`).attr('transform', event.transform);
    this.setState({
      zoomLevel: event.transform.k,
    });
  };

  render() {
    return <div className={styles.container}>{this.getSvg()}</div>;
  }

  getSvg() {
    const {
      showActuatorsID,
      showCommandedForce,
      showMeasuredForce,
      actuatorSelect,
      selectedActuator,
      actuatorTangentSelect,
      selectedActuatorTangent,
    } = this.props;

    const { zoomLevel } = this.state;

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
          <clipPath id="cut">
            <circle cx="240" cy="240" r="210"></circle>
          </clipPath>
          <g clip-path="url(#cut)">
            {this.getBackground()}
            {this.getScatter(
              scale,
              margin,
              showActuatorsID,
              showMeasuredForce,
              showCommandedForce,
              zoomLevel,
              actuatorSelect,
              selectedActuator,
            )}
            {this.getAxis()}
          </g>

          {this.getTangentActuators(
            showActuatorsID,
            showMeasuredForce,
            showCommandedForce,
            actuatorTangentSelect,
            selectedActuatorTangent,
          )}
        </svg>
      </>
    );
  }

  getScatter(
    scale,
    margin,
    showActuatorsID,
    showMeasuredForce,
    showCommandedForce,
    zoomLevel,
    actuatorSelect,
    selectedActuator,
  ) {
    return (
      <g id={this.uniqueScatter} className={styles.scatter}>
        {this.state.actuators.map((act) => {
          const positionX = (act.position[0] + this.state.xRadius) * scale + margin;
          const positionY = (-act.position[1] + this.state.yRadius) * scale + margin;
          return (
            <g key={act.id} className={styles.actuator} onClick={() => actuatorSelect(act.id)}>
              <circle
                cx={positionX}
                cy={positionY}
                key={act.id}
                fill={showMeasuredForce ? this.getActuator(act.id)?.colorForceMeasured : 'gray'}
                stroke={
                  selectedActuator === act.id
                    ? this.strokeActuatorSelected(act.id)
                    : showCommandedForce
                      ? this.getActuator(act.id)?.colorForceApplied
                      : 'none'
                }
                strokeWidth={act.id === selectedActuator ? 6 : 4}
                r={(this.state.maxRadius * scale) / 16}
                pointerEvents="all"
              />
              <text
                x={positionX}
                y={positionY}
                textAnchor="middle"
                alignmentBaseline="middle"
                className={selectedActuator === act.id || (zoomLevel > 1 && showActuatorsID) ? '' : styles.hidden}
                pointerEvents="none"
              >
                {act.id}
              </text>
            </g>
          );
        })}
      </g>
    );
  }

  getTangentActuators(
    showActuatorsID,
    showMeasuredForce,
    showCommandedForce,
    actuatorTangentSelect,
    selectedActuatorTangent,
  ) {
    const x0 = this.state.width / 2;
    const y0 = this.state.width / 2;

    const circleRadius = this.state.width / 2;

    const rectangleWidth = 20;
    const rectangleHeight = 60;

    const svgPadding = 16;
    const commandedStrokeWidth = 4;

    return (
      <g id="tangent-actuators" transform={`translate(${x0}, ${y0}) scale(1, -1)`}>
        {M2ActuatorTangentAngles.map((degrees, i) => {
          const actuatorID = i + 1;
          const currentForceColor = showMeasuredForce
            ? this.getActuatorTangent(actuatorID)?.colorForceMeasured
            : 'gray';
          const commandedForceColor =
            selectedActuatorTangent === actuatorID
              ? this.strokeActuatorTangentSelected(actuatorID)
              : showCommandedForce
                ? this.getActuatorTangent(actuatorID)?.colorForceApplied
                : 'none';
          return (
            <g
              key={actuatorID}
              onClick={() => actuatorTangentSelect(actuatorID)}
              className={styles.actuatorTangent}
              transform={`rotate(${degrees})`}
            >
              <rect
                fill={currentForceColor}
                stroke={commandedForceColor}
                strokeWidth={commandedStrokeWidth}
                width={rectangleWidth}
                height={rectangleHeight}
                x={circleRadius - svgPadding - rectangleWidth / 2}
                y={-rectangleHeight / 2}
              />
            </g>
          );
        })}
        {M2ActuatorTangentAngles.map((degrees, i) => {
          const actuatorID = i + 1;
          const positionX = Math.cos(radians(degrees)) * (circleRadius - svgPadding);
          const positionY = -Math.sin(radians(degrees)) * (circleRadius - svgPadding);
          return (
            <text
              x={positionX}
              y={positionY}
              textAnchor="middle"
              alignmentBaseline="middle"
              className={showActuatorsID || selectedActuatorTangent === actuatorID ? '' : styles.hidden}
              pointerEvents="none"
              transform={`scale(1,-1)`}
            >
              {actuatorID}
            </text>
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
          className={this.state.actuators.length > 0 ? styles.circleOverlay : styles.circleOverlayDisabled}
          cx={this.state.width / 2}
          cy={this.state.width / 2}
          key={'background'}
          r={this.state.width / 2}
        />

        <circle
          id={this.uniqueMirrorHole}
          cx={this.state.width / 2}
          cy={this.state.width / 2}
          r={this.state.width / 6}
          stroke="gray"
          strokeWidth="3"
          fill="#111F27"
        />

        <circle
          id={this.uniqueCircleOverlay}
          className={this.state.actuators.length > 0 ? styles.cursorMove : styles.circleOverlayDisabled}
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

  getAxis() {
    return (
      <>
        <circle
          className={styles.borderCircleOverlay}
          cx={this.state.width / 2}
          cy={this.state.width / 2}
          fill={'none'}
          r={this.state.width / 2 - 30}
        />
        <g id={this.uniqueAxes}>
          <text
            className={styles.axisLabel}
            x={this.state.width / 2}
            y={this.state.width / 2 - 50}
            textAnchor="middle"
            alignmentBaseline="middle"
          >
            +Y
          </text>
          <text
            className={styles.axisLabel}
            x={this.state.width / 2 + 50}
            y={this.state.width / 2}
            textAnchor="middle"
            alignmentBaseline="middle"
          >
            +X
          </text>
          <text
            className={styles.axisLabel}
            x={this.state.width / 2}
            y={this.state.width / 2 + 50}
            textAnchor="middle"
            alignmentBaseline="middle"
          >
            -Y
          </text>
          <text
            className={styles.axisLabel}
            x={this.state.width / 2 - 50}
            y={this.state.width / 2}
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
