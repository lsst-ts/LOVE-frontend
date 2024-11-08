/** 
This file is part of LOVE-frontend.

Developed for the LSST Telescope and Site Systems.
This product includes software developed by the LSST Project
 (https://www.lsst.org).

This program is free software: you can redistribute it and/or modify it under 
the terms of the GNU General Public License as published by the Free Software 
Foundation, either version 3 of the License, or at your option) any later version.

This program is distributed in the hope that it will be useful,but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR 
 A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with 
this program. If not, see <http://www.gnu.org/licenses/>.
*/

import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { uniqueId } from 'lodash';
import * as d3 from 'd3';
import {
  M2ActuatorPositions,
  M2ActuatorTangentAngles,
  M2ActuatorForces,
  M2ActuatorForcesTopics,
  M2ActuatorForcesLabels,
  M2ActuatorForceParametersValueUnits,
  mirrorsForceGradientcolors as colors,
} from 'Config';
import { radians, defaultNumberFormatter, swapKeysAndValues } from 'Utils';
import styles from './M2Compact.module.css';

const colorRange = d3.range(0, 1, 1.0 / (colors.length - 1));
colorRange.push(1);
const colorScale = d3.scaleLinear().domain(colorRange).range(colors).interpolate(d3.interpolateHcl);

function getColorMap(values) {
  const colorInterpolate = d3.scaleLinear().domain(d3.extent(values)).range([0, 1]);
  return (value) => colorScale(colorInterpolate(value));
}

function getSizes() {
  const actuators = M2ActuatorPositions;
  let yMax = -Infinity;
  let yMin = Infinity;
  let xMax = -Infinity;
  let xMin = Infinity;
  let maxRadius = 0;
  actuators.forEach((act) => {
    if (xMax < act.position[0]) xMax = act.position[0];
    if (xMin > act.position[0]) xMin = act.position[0];
    if (yMax < act.position[1]) yMax = act.position[1];
    if (yMin > act.position[1]) yMin = act.position[1];
    if (maxRadius < Math.sqrt(Math.pow(act.position[0], 2) + Math.pow(act.position[1], 2))) {
      maxRadius = Math.floor(Math.sqrt(Math.pow(act.position[0], 2) + Math.pow(act.position[1], 2)));
    }
  });

  const margin = 10;
  const width = xMax - xMin + margin * 2;
  const height = yMax - yMin + margin * 2;
  const xRadius = Math.floor((xMax - xMin) / 2);
  const yRadius = Math.floor((yMax - yMin) / 2);

  return [width, height, xRadius, yRadius, maxRadius];
}

function LinearGradient({ forceData, unit }) {
  const svgRef = useRef();
  const gradientId = uniqueId('m1m3-force-gradient-color-scale-');

  const FORCE_GRADIENT_WIDTH = 4;
  const FORCE_GRADIENT_HEIGHT = 100;

  const maxForce = Math.floor(Math.max(...forceData));
  const minForce = Math.floor(Math.min(...forceData));
  const midForce = Math.floor((maxForce + minForce) / 2);

  const unitText = unit ? `[${unit}]` : '';

  const svg = d3.select(svgRef.current).html('');

  svg
    .append('defs')
    .append('linearGradient')
    .attr('id', gradientId)
    .attr('x1', '0%')
    .attr('y1', '100%')
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
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', FORCE_GRADIENT_WIDTH)
    .attr('height', FORCE_GRADIENT_HEIGHT)
    .style('fill', `url(#${gradientId})`);

  return (
    <>
      <svg
        ref={svgRef}
        className={styles.forceGradient}
        viewBox={`0 0 ${FORCE_GRADIENT_WIDTH} ${FORCE_GRADIENT_HEIGHT}`}
      />
      <svg
        className={styles.forceGradientLimits}
        viewBox={`0 0 ${FORCE_GRADIENT_WIDTH * 2.2} ${FORCE_GRADIENT_HEIGHT}`}
      >
        <text x={0} y={2}>
          {maxForce} {unitText}
        </text>
        <text x={0} y={FORCE_GRADIENT_HEIGHT / 2}>
          {midForce} {unitText}
        </text>
        <text x={0} y={FORCE_GRADIENT_HEIGHT - 1}>
          {minForce} {unitText}
        </text>
      </svg>
    </>
  );
}

LinearGradient.propTypes = {
  /** All force data values */
  forceData: PropTypes.array,
  /** Force data values unit */
  unit: PropTypes.string,
};

function AxialActuators({ forceData, showActuatorsForces, colorMap }) {
  const margin = 10;
  const [width, height, xRadius, yRadius, maxRadius] = getSizes();
  const actuators = M2ActuatorPositions;

  return (
    <g className={styles.scatter}>
      {actuators.map((act, i) => {
        const positionX = act.position[0] + xRadius + margin;
        const positionY = -act.position[1] + yRadius + margin;
        const force = forceData[i];
        const color = colorMap(force);
        const actuatorForceText = defaultNumberFormatter(force, 2);
        return (
          <g key={act.id} className={styles.actuator}>
            <circle cx={positionX} cy={positionY} fill={color} stroke="black" r={maxRadius / 14} pointerEvents="all" />
            <text x={positionX} y={positionY} textAnchor="middle" alignmentBaseline="middle" pointerEvents="all">
              {act.id}
            </text>
            {showActuatorsForces && (
              <text
                className={styles.actuatorForce}
                x={positionX}
                y={positionY + 5}
                textAnchor="middle"
                alignmentBaseline="middle"
              >
                {actuatorForceText}
              </text>
            )}
          </g>
        );
      })}
    </g>
  );
}

AxialActuators.propTypes = {
  /** Force data values for each axial actuator */
  forceData: PropTypes.array,
  /** Whether to show the actuators forces */
  showActuatorsForces: PropTypes.bool,
  /** Color map function */
  colorMap: PropTypes.func,
};

function TangentActuators({ forceData, colorMap }) {
  const [width, height] = getSizes();

  const x0 = width / 2;
  const y0 = height / 2;
  const circleRadius = (width + 60) / 2;
  const rectangleWidth = 15;
  const rectangleHeight = 45;
  const svgPadding = 16;

  return (
    <g className={styles.tangentActuators} transform={`translate(${x0}, ${y0}) scale(1, -1)`}>
      {M2ActuatorTangentAngles.map((degrees, i) => {
        const actuatorID = i + 1;
        const force = forceData[i];
        const color = colorMap(force);
        return (
          <g key={actuatorID} className={styles.actuatorTangent} transform={`rotate(${degrees})`}>
            <rect
              fill={color}
              stroke="black"
              width={rectangleWidth}
              height={rectangleHeight}
              x={circleRadius - svgPadding - rectangleWidth / 2}
              y={-rectangleHeight / 2}
            >
              <title>Value: {defaultNumberFormatter(force, 2)}</title>
            </rect>
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

TangentActuators.propTypes = {
  /** Force data values for each tangent actuator */
  forceData: PropTypes.array,
  /** Color map function */
  colorMap: PropTypes.func,
};

function M2Compact({
  showForcesSelector,
  preSelectedForce,
  preSelectedForceParameter,
  showActuatorsForces,
  subscribeToStreams,
  unsubscribeToStreams,
  ...props
}) {
  const preselectedForceKey = swapKeysAndValues(M2ActuatorForcesLabels)[preSelectedForce];

  const [selectedForce, setSelectedForce] = useState(preselectedForceKey);
  const [selectedForceParameter, setSelectedForceParameter] = useState(preSelectedForceParameter);

  const forceInputId = uniqueId('force-input-');
  const forceParameterId = uniqueId('force-parameter-');

  useEffect(() => {
    subscribeToStreams();
    return () => unsubscribeToStreams();
  }, []);

  const [width, height] = getSizes();

  const forceInputs = Object.keys(M2ActuatorForces);
  const forceInputTopic = M2ActuatorForcesTopics[selectedForce];
  const forceParameters = selectedForce ? M2ActuatorForces[selectedForce] : [];
  const forceParameterValueUnit = M2ActuatorForceParametersValueUnits[selectedForceParameter];

  const axialForceTopic = forceInputTopic?.[0];
  const tangentForceTopic = forceInputTopic?.[1];

  const forceDataAxial = props[axialForceTopic]?.[selectedForceParameter]?.value ?? [];
  const forceDataTangent = props[tangentForceTopic]?.[selectedForceParameter]?.value ?? [];
  const forceDataAll = [...forceDataAxial, ...forceDataTangent];

  const colorMap = getColorMap(forceDataAll);

  return (
    <div className={styles.container}>
      <svg viewBox={`-20 -20 ${width + 48} ${height + 48}`}>
        <AxialActuators forceData={forceDataAxial} showActuatorsForces={showActuatorsForces} colorMap={colorMap} />
        <TangentActuators forceData={forceDataTangent} showActuatorsForces={showActuatorsForces} colorMap={colorMap} />
      </svg>
      <div className={styles.forceGradientContainer}>
        <LinearGradient forceData={forceDataAll} unit={forceParameterValueUnit} />
      </div>
      {showForcesSelector && (
        <div className={[styles.forcesSelector, 'nonDraggable'].join(' ')}>
          <div>
            {forceInputs.map((force) => (
              <div key={force}>
                <input
                  type="radio"
                  id={forceInputId + '-' + force}
                  name={forceInputId}
                  value={force}
                  checked={selectedForce === force}
                  onChange={() => {
                    setSelectedForce(force);
                    setSelectedForceParameter();
                  }}
                />
                <label htmlFor={force}>{M2ActuatorForcesLabels[force]}</label>
              </div>
            ))}
          </div>
          <div>
            {forceParameters.map((forceParameter) => (
              <div key={forceParameter}>
                <input
                  type="radio"
                  id={forceParameterId + '-' + forceParameter}
                  name={forceParameterId}
                  value={forceParameter}
                  checked={selectedForceParameter === forceParameter}
                  onChange={() => setSelectedForceParameter(forceParameter)}
                />
                <label htmlFor={forceParameter}>{forceParameter}</label>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

M2Compact.propTypes = {
  /** Whether to show the forces selector. */
  showForcesSelector: PropTypes.bool,
  /** The force to show by default. */
  preSelectedForce: PropTypes.string,
  /** The force parameter to show by default. */
  preSelectedForceParameter: PropTypes.string,
  /** Whether to show the actuators forces. */
  showActuatorsForces: PropTypes.bool,
  /** Function to subscribe to streams to receive */
  subscribeToStreams: PropTypes.func,
  /** Function to unsubscribe to streams to stop receiving */
  unsubscribeToStreams: PropTypes.func,
};

export default M2Compact;
