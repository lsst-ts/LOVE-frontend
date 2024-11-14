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
  M1M3ActuatorForces,
  M1M3ActuatorForcesLabels,
  M1M3ActuatorForcesTopics,
  M1M3ActuatorForceParametersValueTypes,
  M1M3ActuatorForceParametersValueUnits,
  M1M3ActuatorForceParametersAxisMapping,
  mirrorsForceGradientcolors as colors,
} from 'Config';
import { VALUE_TYPES } from 'Constants';
import { defaultNumberFormatter, swapKeysAndValues } from 'Utils';
import M1M3 from './M1M3';
import styles from './M1M3Compact.module.css';

const colorRange = d3.range(0, 1, 1.0 / (colors.length - 1));
colorRange.push(1);
const colorScale = d3.scaleLinear().domain(colorRange).range(colors).interpolate(d3.interpolateHcl);

const BIG_NUMBER_FORCE_PARAMETERS = [
  'primaryTestTimestamps',
  'secondaryTestTimestamps',
  'primaryAxisFollowingErrorWarningCounter',
  'secondaryAxisFollowingErrorWarningCounter',
  'primaryAxisFollowingErrorCountingCounter',
  'secondaryAxisFollowingErrorCountingCounter',
];

const POSITIVE_TRUE_FORCE_PARAMETERS = ['forceActuatorEnabled'];

function getColorMap(values) {
  const colorInterpolate = d3.scaleLinear().domain(d3.extent(values)).range([0, 1]);
  return (value) => colorScale(colorInterpolate(value));
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
      <div className={styles.forceGradientLimits}>
        <span>
          {maxForce} {unitText}
        </span>
        <span>
          {midForce} {unitText}
        </span>
        <span>
          {minForce} {unitText}
        </span>
      </div>
    </>
  );
}

LinearGradient.propTypes = {
  /** All force data values */
  forceData: PropTypes.array,
  /** Force data values unit */
  unit: PropTypes.string,
};

function M1M3Compact({
  actuatorReferenceId,
  actuatorEnabled,
  xPosition,
  yPosition,
  zPosition,
  showForcesSelector,
  preSelectedForce,
  preSelectedForceParameter,
  showActuatorsForces,
  subscribeToStreams,
  unsubscribeToStreams,
  ...props
}) {
  const preselectedForceKey = swapKeysAndValues(M1M3ActuatorForcesLabels)[preSelectedForce];

  const [selectedForce, setSelectedForce] = useState(preselectedForceKey);
  const [selectedForceParameter, setSelectedForceParameter] = useState(preSelectedForceParameter);

  const actuators = M1M3.getActuatorsPositions(actuatorReferenceId, { xPosition, yPosition, zPosition });
  const forceInputs = Object.keys(M1M3ActuatorForces);
  const forceInputTopic = M1M3ActuatorForcesTopics[selectedForce];
  const forceParameters = selectedForce ? M1M3ActuatorForces[selectedForce] : [];
  const forceParameterValueType = M1M3ActuatorForceParametersValueTypes[selectedForceParameter];
  const forceParameterValueUnit = M1M3ActuatorForceParametersValueUnits[selectedForceParameter];
  const forceData = props[forceInputTopic]?.[selectedForceParameter]?.value ?? [];
  const forceParameterIsScalar = forceParameterValueType !== VALUE_TYPES.BOOLEAN;
  const forceParameterHasBigNumbers = BIG_NUMBER_FORCE_PARAMETERS.includes(selectedForceParameter);

  useEffect(() => {
    subscribeToStreams();
    return () => unsubscribeToStreams();
  }, []);

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
  const xRadius = Math.floor((xMax - xMin) / 2);
  const yRadius = Math.floor((yMax - yMin) / 2);

  const width = xMax - xMin + margin * 2;
  const height = yMax - yMin + margin * 2;

  const getActuatorForceByParameter = (forceParameter, index) => {
    if (!forceParameter) return NaN;
    const actuatorsMapping = M1M3ActuatorForceParametersAxisMapping[forceParameter];
    return forceData[actuatorsMapping[index]];
  };

  const fillActuator = (index) => {
    const actuatorForce = getActuatorForceByParameter(selectedForceParameter, index);
    if (actuatorForce == undefined) return 'black';
    if (selectedForce !== 'faEnabled' && !actuatorEnabled[index]) return 'url(#disabledPattern)';

    if (!forceParameterIsScalar) {
      if (POSITIVE_TRUE_FORCE_PARAMETERS.includes(selectedForceParameter)) {
        return getActuatorForceByParameter(selectedForceParameter, index)
          ? 'var(--status-ok-color)'
          : 'var(--status-alert-color)';
      } else {
        return getActuatorForceByParameter(selectedForceParameter, index)
          ? 'var(--status-alert-color)'
          : 'var(--status-ok-color)';
      }
    }

    const colormap = getColorMap(forceData);
    return forceData.length > 0 ? colormap(actuatorForce) : colormap(0);
  };

  const showForceGradient = selectedForce && selectedForceParameter && forceParameterIsScalar;

  return (
    <div className={styles.container}>
      {!showForcesSelector && (
        <div className={styles.selectedForce}>
          Selected parameters: {selectedForce} - {selectedForceParameter}
        </div>
      )}
      <div className={styles.diagrams}>
        <svg viewBox={`0 0 ${width} ${height}`}>
          <defs>
            <pattern id="disabledPattern" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="6" y2="6" stroke="var(--status-alert-color)" strokeWidth="0.2" />
              <line x1="6" y1="0" x2="0" y2="6" stroke="var(--status-alert-color)" strokeWidth="0.2" />
            </pattern>
          </defs>

          <g>
            {actuators.map((act, i) => {
              const actuatorForce = getActuatorForceByParameter(selectedForceParameter, i);
              const actuatorForceText = defaultNumberFormatter(actuatorForce, 2);
              return (
                <g key={act.id}>
                  <circle
                    cx={act.position[0] + xRadius + margin}
                    cy={act.position[1] + yRadius + margin}
                    fill={fillActuator(i)}
                    stroke="black"
                    r={maxRadius / 16}
                  />
                  <text
                    className={styles.actuatorId}
                    x={act.position[0] + xRadius + margin}
                    y={act.position[1] + yRadius + margin}
                    textAnchor="middle"
                    alignmentBaseline="middle"
                  >
                    {act.id}
                  </text>
                  {showActuatorsForces && forceParameterIsScalar && !forceParameterHasBigNumbers && (
                    <text
                      className={styles.actuatorForce}
                      x={act.position[0] + xRadius + margin}
                      y={act.position[1] + yRadius + margin + 5}
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
        </svg>
        <div className={styles.forceGradientContainer}>
          {showForceGradient && <LinearGradient forceData={forceData} unit={forceParameterValueUnit} />}
        </div>
        {showForcesSelector && (
          <div className={[styles.forcesSelector, 'nonDraggable'].join(' ')}>
            <div>
              {forceInputs.map((force) => (
                <div key={force}>
                  <input
                    type="radio"
                    id={force}
                    name="force"
                    value={force}
                    checked={selectedForce === force}
                    onChange={() => {
                      setSelectedForce(force);
                      setSelectedForceParameter();
                    }}
                  />
                  <label htmlFor={force}>{M1M3ActuatorForcesLabels[force]}</label>
                </div>
              ))}
            </div>
            <div>
              {forceParameters.map((forceParameter) => (
                <div key={forceParameter}>
                  <input
                    type="radio"
                    id={forceParameter}
                    name="forceParameter"
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
    </div>
  );
}

M1M3Compact.propTypes = {
  /** Force Actuator reference ID. */
  actuatorReferenceId: PropTypes.array,
  /** Actuator enabled status. */
  actuatorEnabled: PropTypes.array,
  /** X position of the actuator. */
  xPosition: PropTypes.array,
  /** Y position of the actuator. */
  yPosition: PropTypes.array,
  /** Z position of the actuator. */
  zPosition: PropTypes.array,
  /** Whether to show the forces selector. */
  showForcesSelector: PropTypes.bool,
  /** The force to show by default. */
  preSelectedForce: PropTypes.string,
  /** The force parameter to show by default. */
  preSelectedForceParameter: PropTypes.string,
  /** Whether to show the actuators forces. */
  showActuatorsForces: PropTypes.bool,
  /** Function to subscribe to streams. */
  subscribeToStreams: PropTypes.func,
  /** Function to unsubscribe to streams. */
  unsubscribeToStreams: PropTypes.func,
};

export default M1M3Compact;
