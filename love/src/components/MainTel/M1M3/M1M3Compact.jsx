import React, { useState, useEffect, useRef, memo } from 'react';
import PropTypes from 'prop-types';
import { uniqueId } from 'lodash';
import * as d3 from 'd3';
import {
  M1M3ActuatorForces,
  M1M3ActuatorForcesLabels,
  M1M3ActuatorForcesTopics,
  M1M3ActuatorForceParametersAxisMapping,
} from 'Config';
import { swapKeysAndValues } from 'Utils';
import M1M3 from './M1M3';
import styles from './M1M3Compact.module.css';

const forceData = Array.from({ length: 156 }, () => Math.floor(Math.random() * 1001));

const colors = ['#2c7bb6', '#00a6ca', '#00ccbc', '#90eb9d', '#ffff8c', '#f9d057', '#f29e2e', '#e76818', '#d7191c'];
const colorRange = d3.range(0, 1, 1.0 / (colors.length - 1));
colorRange.push(1);
const colorScale = d3.scaleLinear().domain(colorRange).range(colors).interpolate(d3.interpolateHcl);

function getColorMap(values) {
  const colorInterpolate = d3.scaleLinear().domain(d3.extent(values)).range([0, 1]);
  return (value) => colorScale(colorInterpolate(value));
}

function LinearGradient({ forceData }) {
  const svgRef = useRef();
  const gradientId = uniqueId('m1m3-force-gradient-color-scale-');

  const FORCE_GRADIENT_WIDTH = 4;
  const FORCE_GRADIENT_HEIGHT = 100;

  const maxForce = Math.floor(Math.max(...forceData));
  const minForce = Math.floor(Math.min(...forceData));
  const midForce = Math.floor((maxForce - minForce) / 2);

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
      <svg className={styles.forceGradientLimits} viewBox={`0 0 ${FORCE_GRADIENT_WIDTH * 2} ${FORCE_GRADIENT_HEIGHT}`}>
        <text x={0} y={3}>
          {maxForce}
        </text>
        <text x={0} y={FORCE_GRADIENT_HEIGHT / 2}>
          {midForce}
        </text>
        <text x={0} y={FORCE_GRADIENT_HEIGHT}>
          {minForce}
        </text>
      </svg>
    </>
  );
}

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
  // const [xRadius, setXRadius] = useState();
  // const [yRadius, setYRadius] = useState();
  // const [maxRadius, setMaxRadius] = useState();
  const preselectedForceKey = swapKeysAndValues(M1M3ActuatorForcesLabels)[preSelectedForce];
  const [selectedForce, setSelectedForce] = useState(preselectedForceKey);
  const [selectedForceParameter, setSelectedForceParameter] = useState(preSelectedForceParameter);

  const actuators = M1M3.getActuatorsPositions(actuatorReferenceId, { xPosition, yPosition, zPosition });

  const forceInputs = Object.keys(M1M3ActuatorForces);
  const forceParameters = selectedForce ? M1M3ActuatorForces[selectedForce] : [];
  // const forceData = props[selectedForce]?.[selectedForceParameter]?.value ?? [];

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
    if (!actuatorEnabled[index]) return 'black';
    const colormap = getColorMap(forceData);
    const actuatorForce = getActuatorForceByParameter(selectedForceParameter, index);
    const actuator = actuators[index];
    return forceData.length > 0 ? colormap(actuatorForce) : colormap(0);
  };

  return (
    <div className={styles.container}>
      <svg
        // className={styles.svgContainer}
        viewBox={`0 0 ${width} ${height}`}
      >
        {/* <circle
          // className={actuators.length > 0 ? styles.circleOverlay : styles.circleOverlayDisabled}
          className={styles.circleOverlay}
          cx={width / 2}
          cy={width / 2}
          r={100} /> */}

        {/* <circle
          // className={actuators.length > 0 ? styles.cursorMove : styles.circleOverlayDisabled}
          cx={width / 2}
          cy={width / 2}
          fill={'none'}
          r={width / 2 - 30} /> */}

        <g>
          {actuators.map((act, i) => {
            const actuatorForce = getActuatorForceByParameter(selectedForceParameter, i);
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
                {showActuatorsForces && (
                  <text
                    className={styles.actuatorForce}
                    x={act.position[0] + xRadius + margin}
                    y={act.position[1] + yRadius + margin + 5}
                    textAnchor="middle"
                    alignmentBaseline="middle"
                  >
                    {actuatorForce}
                  </text>
                )}
              </g>
            );
          })}
        </g>

        {/* <circle
          className={styles.borderCircleOverlay}
          cx={width / 2}
          cy={width / 2}
          fill={'none'}
          r={width / 2 - 30}
        /> */}

        {/* <circle
          className={styles.hiddenCircleOverlay}
          cx={width / 2}
          cy={width / 2}
          fill={'none'}
          r={width * 0.7}
        /> */}
      </svg>
      <div className={styles.forceGradientContainer}>
        <LinearGradient forceData={forceData} />
      </div>
      {showForcesSelector && (
        <div className={styles.forcesSelector}>
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
