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
import * as d3 from 'd3';
import { uniqueId, isEqual } from 'lodash';
import { defaultNumberFormatter } from 'Utils';
import {
  summaryStateMap,
  summaryStateToStyle,
  M1M3ActuatorPositions,
  M1M3ActuatorForcesOnly,
  M1M3ActuatorForcesTopics,
  m1m3DetailedStateMap,
  m1m3DetailedStateToStyle,
  M1M3HardpointPositions,
  M1M3ActuatorForceParametersAxisMapping,
  alignedStateMap,
  alignedStateToStyle,
  mirrorsForceGradientcolors as colors,
} from 'Config';
import ArrowIcon from 'components/icons/ArrowIcon/ArrowIcon';
import StatusText from 'components/GeneralPurpose/StatusText/StatusText';
import Button from 'components/GeneralPurpose/Button/Button';
import Select from 'components/GeneralPurpose/Select/Select';
import Toggle from 'components/GeneralPurpose/Toggle/Toggle';
import SummaryPanel from 'components/GeneralPurpose/SummaryPanel/SummaryPanel';
import Title from 'components/GeneralPurpose/SummaryPanel/Title';
import styles from './M1M3.module.css';

const FORCE_GRADIENT_WIDTH = 400;
const FORCE_GRADIENT_HEIGHT = 20;

const colorRange = d3.range(0, 1, 1.0 / (colors.length - 1));
colorRange.push(1);
const colorScale = d3.scaleLinear().domain(colorRange).range(colors).interpolate(d3.interpolateHcl);

export default class M1M3 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      actuators: [],
      xRadius: 0,
      yRadius: 0,
      maxRadius: 0,
      colormap: () => null,
      width: 480,
      zoomLevel: 1,
      selectedForceInput: null,
      selectedForceParameter: null,
      showActuatorsID: true,
      showHardpoints: true,
      actuatorsForce: [],
      selectedActuatorId: 0,
      selectedHardpointId: 0,
    };
    this.uniqueGradient = uniqueId('m1m3-force-gradient-color-scale-');
    this.uniqueScatter = uniqueId('m1m3-scatter-');
    this.uniqueCircleOverlay = uniqueId('m1m3-circle-overlay-');
    this.uniqueForceGradient = uniqueId('m1m3-force-gradient');
    this.zoom = null;
  }

  static statesIlc = {
    0: {
      name: 'STANDBY',
      class: styles.warning_summary,
      fill: styles.fill_warning_summary,
    },
    1: {
      name: 'DISABLED',
      class: styles.offline_summary,
      fill: styles.fill_offline_summary,
    },
    2: {
      name: 'ENABLED',
      class: styles.ok_summary,
      fill: styles.fill_ok_summary,
    },
    3: {
      name: 'FIRMWAREUPDATE',
      class: styles.warning_summary,
      fill: styles.fill_warning_summary,
    },
    4: {
      name: 'FAULT',
      class: styles.alert_summary,
      fill: styles.fill_alert_summary,
    },
  };

  static statesForceActuator = {
    true: {
      name: 'ENABLED',
      class: styles.ok_detail,
    },
    false: {
      name: 'DISABLED',
      class: styles.offline_detail,
    },
  };

  static statesMotion = {
    0: {
      name: 'STANDBY',
      userReadable: 'Standby',
      char: 'S',
      class: styles.warning_detail,
    },
    1: {
      name: 'CHASING',
      userReadable: 'Chasing',
      char: 'C',
      class: styles.ok_detail,
    },
    2: {
      name: 'STEPPING',
      userReadable: 'Stepping',
      char: 'S',
      class: styles.ok_detail,
    },
    3: {
      name: 'QUICK POSITIONING',
      userReadable: 'Quick Positioning',
      char: 'QP',
      class: styles.ok_detail,
    },
    4: {
      name: 'FINE POSITIONING',
      userReadable: 'Fine Positioning',
      char: 'FP',
      class: styles.ok_detail,
    },
    5: {
      name: 'WAITING TENSION',
      userReadable: 'Waiting Tension',
      char: 'WT',
      class: styles.warning_detail,
    },
  };

  static zip = (arrays) => {
    return arrays[0].map((_, i) => {
      return arrays.map((array) => {
        return array[i];
      });
    });
  };

  static getActuatorsPositions = (ids, positions) => {
    const { xPosition, yPosition, zPosition } = positions;
    const positionsArray = M1M3.zip([
      xPosition.map((x) => x * 39),
      yPosition.map((x) => x * -39),
      zPosition.map((x) => x * 39),
    ]);
    return positionsArray.map((position, i) => ({ id: ids[i], position }));
  };

  preventDefault(e) {
    if (e.preventDefault) e.preventDefault();
    e.returnValue = false;
  }

  disableScroll = () => {
    document.addEventListener('wheel', this.preventDefault, { passive: false });
  };

  enableScroll = () => {
    document.removeEventListener('wheel', this.preventDefault, false);
  };

  createColorScale = (values) => {
    const colorInterpolate = d3.scaleLinear().domain(d3.extent(values)).range([0, 1]);

    this.setState({
      colormap: (val) => colorScale(colorInterpolate(val)),
    });

    const svg = d3.select(`#${this.uniqueGradient} svg`).html('');

    svg
      .append('defs')
      .append('linearGradient')
      .attr('id', this.uniqueForceGradient)
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
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
      .attr('width', '100%')
      .attr('height', '40')
      .style('fill', `url(#${this.uniqueForceGradient})`);
  };

  actuatorSelected = (id) => {
    this.setState({ selectedActuatorId: id });
  };

  strokeActuatorSelected = (id) => {
    if (this.state.selectedActuatorId === id) return 'white';
    return 'none';
  };

  fillActuatorSelected = (id) => {
    if (this.state.selectedActuatorId === id) return 'white';
    return 'black';
  };

  hardpointSelected = (id) => {
    this.setState({ selectedHardpointId: id });
  };

  strokeHardpointSelected = (id) => {
    if (this.state.selectedHardpointId === id) return 'white';
    return 'gray';
  };

  strokeHardpointActuatorSelected = (id) => {
    if (this.state.selectedHardpointId === id) return 'white';
    return 'gray';
  };

  fillHardpointSelected = (id) => {
    if (this.state.selectedHardpointId === id) return 'white';
    return 'black';
  };

  getActuatorForceByParameter(forceParameter, index) {
    if (!forceParameter) return NaN;
    const { actuatorsForce } = this.state;
    const actuatorsMapping = M1M3ActuatorForceParametersAxisMapping[forceParameter];
    return actuatorsForce[actuatorsMapping[index]];
  }

  getActuator = (id) => {
    if (id === 0) {
      return {
        id: 'None',
        forceValue: 'None',
        type: 'None',
        orientation: 'None',
        modbusSubnet: 'None',
        modbusAddress: 'None',
        ilcUniqueId: 'None',
        ilcApplicationType: 'None',
        ilcSelectedOptions: 'None',
        networkNodeType: 'None',
        majorRevision: 'None',
        minorRevision: 'None',
        adcScanRate: 'None',
        mezzanineUniqueId: 'None',
        mezzanineFirmwareType: 'None',
        mezzanineMajorRevision: 'None',
        mezzanineMinorRevision: 'None',
      };
    }

    const {
      actuatorIlcState,
      actuatorReferenceId,
      actuatorType,
      actuatorOrientation,
      actuatorModbusSubnet,
      actuatorModbusAddress,
      actuatorIlcUniqueId,
      actuatorIlcApplicationType,
      actuatorIlcSelectedOptions,
      actuatorNetworkNodeType,
      actuatorMayorRevision,
      actuatorMinorRevision,
      actuatorAdcScanRate,
      actuatorMezzanineUniqueId,
      actuatorMezzanineFirmwareType,
      actuatorMezzanineMajorRevision,
      actuatorMezzanineMinorRevision,
      actuatorEnabled,
    } = this.props;

    const { selectedForceParameter } = this.state;
    const actuatorIndex = actuatorReferenceId.indexOf(id);
    const actuatorforce = this.getActuatorForceByParameter(selectedForceParameter, actuatorIndex);

    const actuator = {
      id,
      state: actuatorIlcState[actuatorIndex],
      forceEnabled: actuatorEnabled[actuatorIndex],
      forceValue: actuatorforce ?? 'None',
      type: actuatorType[actuatorIndex] ?? 'None',
      orientation: actuatorOrientation[actuatorIndex] ?? 'None',
      modbusSubnet: actuatorModbusSubnet[actuatorIndex] ?? 'None',
      modbusAddress: actuatorModbusAddress[actuatorIndex] ?? 'None',
      ilcUniqueId: actuatorIlcUniqueId[actuatorIndex] ?? 'None',
      ilcApplicationType: actuatorIlcApplicationType[actuatorIndex] ?? 'None',
      ilcSelectedOptions: actuatorIlcSelectedOptions[actuatorIndex] ?? 'None',
      networkNodeType: actuatorNetworkNodeType[actuatorIndex] ?? 'None',
      majorRevision: actuatorMayorRevision[actuatorIndex] ?? 'None',
      minorRevision: actuatorMinorRevision[actuatorIndex] ?? 'None',
      adcScanRate: actuatorAdcScanRate[actuatorIndex] ?? 'None',
      mezzanineUniqueId: actuatorMezzanineUniqueId[actuatorIndex] ?? 'None',
      mezzanineFirmwareType: actuatorMezzanineFirmwareType[actuatorIndex] ?? 'None',
      mezzanineMajorRevision: actuatorMezzanineMajorRevision[actuatorIndex] ?? 'None',
      mezzanineMinorRevision: actuatorMezzanineMinorRevision[actuatorIndex] ?? 'None',
    };

    return actuator;
  };

  getHardpoint = (id) => {
    if (id === 0) {
      return {
        id: 'None',
        ilcUniqueId: 'None',
        motionStatus: 'None',
        breakawayLVDT: 'None',
        displacementLVDT: 'None',
        breakawayPressure: 'None',
        majorRevision: 'None',
        minorRevision: 'None',
      };
    }

    const {
      hardpointIlcState,
      hardpointIlcUniqueId,
      hardpointMotionState,
      hardpointReferenceId,
      hardpointsBreakawayLVDT,
      hardpointsDisplacementLVDT,
      hardpointsBreakawayPressure,
      hardpointMinorRevision,
      hardpointMayorRevision,
    } = this.props;

    const hardpointIndex = hardpointReferenceId.indexOf(id);

    const hardpoint = {
      id,
      state: hardpointIlcState[hardpointIndex],
      motionState: hardpointMotionState[hardpointIndex],
      ilcUniqueId: hardpointIlcUniqueId[hardpointIndex] ?? 'None',
      breakawayLVDT: hardpointsBreakawayLVDT[hardpointIndex] ?? 'None',
      displacementLVDT: hardpointsDisplacementLVDT[hardpointIndex] ?? 'None',
      breakawayPressure: hardpointsBreakawayPressure[hardpointIndex] ?? 'None',
      majorRevision: hardpointMayorRevision[hardpointIndex] ?? 'None',
      minorRevision: hardpointMinorRevision[hardpointIndex] ?? 'None',
    };

    return hardpoint;
  };

  fillActuator = (id) => {
    const { actuatorEnabled } = this.props;
    const { actuatorsForce, selectedForceParameter } = this.state;

    if (!actuatorEnabled[id]) return 'black';
    return actuatorsForce.length > 0
      ? this.state.colormap(this.getActuatorForceByParameter(selectedForceParameter, id))
      : this.state.colormap(0);
  };

  fillHardpoint = (id) => {
    const { hardpointIlcState, hardpointReferenceId } = this.props;
    const hardpointIndex = hardpointReferenceId.indexOf(id);
    const hardpointState = hardpointIlcState[hardpointIndex];
    return M1M3.statesIlc[hardpointState]?.fill;
  };

  forceInputSelected = (value) => {
    this.setState({
      selectedForceInput: value,
      selectedForceParameter: null,
    });
  };

  forceParameterSelected = (value) => {
    this.setState({
      selectedForceParameter: value,
    });
  };

  toggleActuatorsID = (show) => {
    this.setState({ showActuatorsID: show });
  };

  toggleHardpoints = (show) => {
    this.setState({ showHardpoints: show });
  };

  zoomOut = () => {
    d3.select(`#${this.uniqueCircleOverlay}`).call(this.zoom.transform, d3.zoomIdentity.scale(1)).call(this.zoom);
  };

  componentDidMount() {
    this.props.subscribeToStreams();

    this.zoom = d3.zoom().scaleExtent([1, Infinity]).on('zoom', this.zoomed);
    d3.select(`#${this.uniqueCircleOverlay}`).call(this.zoom);

    let yMax = -Infinity;
    let xMax = -Infinity;
    let yMin = Infinity;
    let xMin = Infinity;
    let maxRadius = 0;
    M1M3ActuatorPositions.forEach((act) => {
      if (xMax < act.position[0]) xMax = act.position[0];
      if (xMin > act.position[0]) xMin = act.position[0];
      if (yMax < act.position[1]) yMax = act.position[1];
      if (yMin > act.position[1]) yMin = act.position[1];
      if (maxRadius < Math.sqrt(Math.pow(act.position[0], 2) + Math.pow(act.position[1], 2))) {
        maxRadius = Math.floor(Math.sqrt(Math.pow(act.position[0], 2) + Math.pow(act.position[1], 2)));
      }
    });

    this.setState({
      actuators: M1M3ActuatorPositions,
      xRadius: (xMax - xMin) / 2,
      yRadius: (yMax - yMin) / 2,
      maxRadius,
    });
  }

  componentWillUnmount() {
    this.props.unsubscribeToStreams();
  }

  componentDidUpdate(prevProps, prevState) {
    const { xPosition, yPosition, zPosition, actuatorReferenceId } = this.props;
    const { selectedForceInput, selectedForceParameter, actuatorsForce } = this.state;

    const forceTopic = M1M3ActuatorForcesTopics[selectedForceInput];
    if (
      selectedForceParameter !== prevState.selectedForceParameter ||
      !isEqual(
        this.props[forceTopic]?.[selectedForceParameter]?.value,
        prevProps[forceTopic]?.[selectedForceParameter]?.value,
      )
    ) {
      const forceData = this.props[forceTopic]?.[selectedForceParameter]?.value ?? [];
      this.setState({ actuatorsForce: forceData });
    }

    if (!isEqual(actuatorsForce, prevState.actuatorsForce)) {
      this.createColorScale(actuatorsForce);
    }

    if (
      xPosition !== prevProps.xPosition ||
      yPosition !== prevProps.yPosition ||
      zPosition !== prevProps.zPosition ||
      !isEqual(actuatorReferenceId, prevProps.actuatorReferenceId)
    ) {
      const actuators = M1M3.getActuatorsPositions(actuatorReferenceId, { xPosition, yPosition, zPosition });

      let yMax = -Infinity;
      let xMax = -Infinity;
      let yMin = Infinity;
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
      this.setState({
        actuators,
        xRadius: Math.floor((xMax - xMin) / 2),
        yRadius: Math.floor((yMax - yMin) / 2),
        maxRadius,
      });
    }
  }

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
    const { summaryState, detailedState, alignment } = this.props;

    const {
      actuators,
      actuatorsForce,
      zoomLevel,
      showActuatorsID,
      showHardpoints,
      selectedForceInput,
      selectedForceParameter,
      selectedActuatorId,
      selectedHardpointId,
      xRadius,
      yRadius,
      maxRadius,
      width,
    } = this.state;

    const scale = (Math.max(xRadius, yRadius) * width) / 65000;
    const margin = 60;

    const summaryStateName = summaryStateMap[summaryState];
    const summaryStateStatus = summaryStateToStyle[summaryStateName];

    const detailedStateName = m1m3DetailedStateMap[detailedState];
    const detailedStateStatus = m1m3DetailedStateToStyle[detailedStateName];

    const alignedStateName = alignedStateMap[alignment];
    const alignedStateStatus = alignedStateToStyle[alignedStateName];

    const maxForce = Math.max(...actuatorsForce);
    const minForce = Math.min(...actuatorsForce);
    const maxForceText = defaultNumberFormatter(maxForce, 2);
    const minForceText = defaultNumberFormatter(minForce, 2);

    const selectedActuator = this.getActuator(selectedActuatorId);
    const selectedHardpoint = this.getHardpoint(selectedHardpointId);

    const forceInputs = Object.keys(M1M3ActuatorForcesOnly);
    const forceParameters = M1M3ActuatorForcesOnly[selectedForceInput];

    const forcesAreSelected = selectedForceInput && selectedForceParameter;
    const selectedForceText = forcesAreSelected ? `${selectedForceInput} - ${selectedForceParameter}` : '';
    const showForceGradient =
      forcesAreSelected && !isNaN(maxForce) && !isNaN(minForce) && isFinite(maxForce) && isFinite(minForce);

    return (
      <div className={styles.mirrorContainer}>
        <SummaryPanel className={styles.summaryPanelStates}>
          <div className={styles.state}>
            <Title>State</Title>
            <StatusText status={summaryStateStatus}>{summaryStateName}</StatusText>
          </div>
          <div className={styles.state}>
            <Title>Detailed State</Title>
            <StatusText status={detailedStateStatus}>{detailedStateName}</StatusText>
          </div>
          <div className={styles.state}>
            <Title>M2 Alignement</Title>
            <StatusText status={alignedStateStatus}>{alignedStateName}</StatusText>
          </div>
        </SummaryPanel>

        <SummaryPanel className={styles.summaryPanelControls}>
          <div className={styles.controls}>
            <div
              style={{ width: '12em', paddingRight: '1em', borderRight: '1px solid gray' }}
              className={styles.control}
            >
              <span>Select force input:</span>
              <Select
                options={forceInputs}
                option={selectedForceInput}
                onChange={({ value }) => this.forceInputSelected(value)}
              />
            </div>
            <div className={styles.control}>
              <span>Select force parameter:</span>
              <Select
                options={forceParameters}
                option={selectedForceParameter}
                onChange={({ value }) => this.forceParameterSelected(value)}
              />
            </div>
            <div className={styles.control}>
              <span>Show actuators ID:</span>
              <div className={styles.toggleContainer}>
                <Toggle labels={['No', 'Yes']} toggled={showActuatorsID} onToggle={this.toggleActuatorsID} />
              </div>
            </div>
            <div className={styles.control}>
              <span>Show hardpoints:</span>
              <div className={styles.toggleContainer}>
                <Toggle labels={['No', 'Yes']} toggled={showHardpoints} onToggle={this.toggleHardpoints} />
              </div>
            </div>
          </div>
        </SummaryPanel>

        <div className={styles.plotSection}>
          <div className={styles.gridHardpoint}>
            <div className={styles.hardpoints}>
              <span>Hardpoints</span>
              <svg width={134} height={134}>
                <circle className={styles.borderCircleHardpoint} cx={64} cy={64} fill={'none'} r={64} />

                {M1M3HardpointPositions.map((hardpoint) => {
                  return (
                    <g
                      key={hardpoint.id}
                      className={styles.gHardpoint}
                      onClick={() => this.hardpointSelected(hardpoint.id)}
                    >
                      <circle
                        className={styles.circleHardpoint + ' ' + this.fillHardpoint(hardpoint.id)}
                        cx={hardpoint.mini.position[0]}
                        cy={hardpoint.mini.position[1]}
                        r="14.82"
                        pointerEvents="all"
                        stroke={this.strokeHardpointSelected(hardpoint.id)}
                      />
                      <text
                        className={styles.textHardpoint}
                        transform={
                          'translate(' +
                          (hardpoint.mini.position[0] - 6.11) +
                          ' ' +
                          (hardpoint.mini.position[1] + 6.11) +
                          ')'
                        }
                        pointerEvents="none"
                        fill={this.fillHardpointSelected(hardpoint.id)}
                      >
                        {hardpoint.id}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          <div className={styles.gridWindowM1M3}>
            {showForceGradient && (
              <div className={styles.forceGradientWrapper}>
                <div id={this.uniqueGradient}>
                  <svg viewBox={`0 0 ${FORCE_GRADIENT_WIDTH} ${FORCE_GRADIENT_HEIGHT}`}></svg>
                </div>
                <div>
                  <div>{minForceText} [N]</div>
                  <div>{maxForceText} [N]</div>
                </div>
              </div>
            )}
            {zoomLevel > 1 && (
              <div className={styles.zoomOut}>
                <Button onClick={this.zoomOut}>Zoom out</Button>
              </div>
            )}
            <svg
              className={styles.svgContainer}
              viewBox={`0 0 ${width} ${width}`}
              onMouseEnter={this.disableScroll}
              onMouseLeave={this.enableScroll}
            >
              <circle
                id="background-circle"
                className={actuators.length > 0 ? styles.circleOverlay : styles.circleOverlayDisabled}
                cx={width / 2}
                cy={width / 2}
                key={'background'}
                r={width / 2 - 30}
              />

              <circle
                id={this.uniqueCircleOverlay}
                className={actuators.length > 0 ? styles.cursorMove : styles.circleOverlayDisabled}
                cx={width / 2}
                cy={width / 2}
                key={'overlay'}
                fill={'none'}
                r={width / 2 - 30}
                pointerEvents="all"
                onMouseEnter={this.enableScroll}
                onMouseLeave={this.disableScroll}
              />

              <g id={this.uniqueScatter} className={styles.scatter}>
                {actuators.map((act, i) => {
                  return (
                    <g key={act.id} className={styles.actuator} onClick={() => this.actuatorSelected(act.id)}>
                      <circle
                        cx={(act.position[0] + xRadius) * scale + margin}
                        cy={(act.position[1] + yRadius) * scale + margin}
                        key={act.id}
                        fill={this.fillActuator(i)}
                        stroke={this.strokeActuatorSelected(act.id)}
                        r={(maxRadius * scale) / 21}
                        pointerEvents="all"
                      />
                      <text
                        x={(act.position[0] + xRadius) * scale + margin}
                        y={(act.position[1] + yRadius) * scale + margin}
                        textAnchor="middle"
                        alignmentBaseline="middle"
                        fill={this.fillActuatorSelected(act.id)}
                        className={zoomLevel > 1 && showActuatorsID ? '' : styles.hidden}
                        pointerEvents="none"
                      >
                        {act.id}
                      </text>
                    </g>
                  );
                })}
                {M1M3HardpointPositions.map((hardpoint) => {
                  return (
                    <circle
                      key={hardpoint.id}
                      className={showHardpoints ? styles.circleHardpointActuator : styles.hidden}
                      cx={(hardpoint.actuator.position[0] + xRadius) * scale + margin}
                      cy={(hardpoint.actuator.position[1] + yRadius) * scale + margin}
                      fill="none"
                      stroke={showHardpoints ? this.strokeHardpointActuatorSelected(hardpoint.id) : 'none'}
                      r={50 * scale}
                      pointerEvents="none"
                    />
                  );
                })}
              </g>

              <circle
                className={styles.borderCircleOverlay}
                cx={width / 2}
                cy={width / 2}
                fill={'none'}
                r={width / 2 - 30}
              />

              <circle
                className={styles.hiddenCircleOverlay}
                cx={width / 2}
                cy={width / 2}
                fill={'none'}
                r={width * 0.7}
              />

              <g id="doors" className={styles.doors}>
                <title>M1M3 Entrance</title>
                <rect x={width / 2 - 15} y={margin / 2 - 8} width={30} height={20} />
                <foreignObject x={width / 2 - 15} y={margin / 2 - 8} width={30} height={20}>
                  <ArrowIcon style={styles.arrowIcon} active={true} />
                </foreignObject>
              </g>

              <g id="plot-axis">
                <text
                  className={styles.axisLabel}
                  x={width / 2 - 5}
                  y={margin / 2 - 15}
                  textAnchor="middle"
                  alignmentBaseline="middle"
                >
                  +Y
                </text>
                <text
                  className={styles.axisLabel}
                  x={width - 12}
                  y={width / 2 - 5}
                  textAnchor="middle"
                  alignmentBaseline="middle"
                >
                  +X
                </text>
                <text
                  className={styles.axisLabel}
                  x={width / 2 - 5}
                  y={width - margin / 2 + 16}
                  textAnchor="middle"
                  alignmentBaseline="middle"
                >
                  -Y
                </text>
                <text
                  className={styles.axisLabel}
                  x={12}
                  y={width / 2 - 5}
                  textAnchor="middle"
                  alignmentBaseline="middle"
                >
                  -X
                </text>
              </g>
            </svg>
          </div>

          <div className={styles.gridGroupGradiantInfo}>
            <div className={styles.gridActuatorInfo}>
              <SummaryPanel className={styles.actuatorInfo}>
                {selectedActuatorId !== 0 ? (
                  <>
                    <div className={styles.actuatorValue}>
                      <Title>Actuator {selectedActuator.id}</Title>
                      <span
                        title={`ILC Status: ${selectedActuator.state}`}
                        className={[M1M3.statesIlc[selectedActuator.state].class, styles.summaryState].join(' ')}
                      >
                        {M1M3.statesIlc[selectedActuator.state].name}
                      </span>
                    </div>
                    <div className={styles.actuatorValue}>
                      <span>Force actuator state</span>
                      <span>{selectedActuator.forceEnabled ? 'Enabled' : 'Disabled'}</span>
                    </div>
                    <div className={styles.actuatorValue}>
                      <span>Applied force:</span>
                      <span title={selectedForceText}>{defaultNumberFormatter(selectedActuator.forceValue)} [N]</span>
                    </div>
                    <div className={styles.actuatorValue}>
                      <span>Type:</span>
                      <span>{selectedActuator.type}</span>
                    </div>
                    <div className={styles.actuatorValue}>
                      <span>Orientation:</span>
                      <span>{selectedActuator.orientation}</span>
                    </div>
                    <div className={styles.actuatorValue}>
                      <span>Modbus subnet:</span>
                      <span>{selectedActuator.modbusSubnet}</span>
                    </div>
                    <div className={styles.actuatorValue}>
                      <span>Modbus address:</span>
                      <span>{selectedActuator.modbusAddress}</span>
                    </div>
                    <div className={styles.actuatorValue}>
                      <span>ILC unique id:</span>
                      <span>{selectedActuator.ilcUniqueId}</span>
                    </div>
                    <div className={styles.actuatorValue}>
                      <span>ILC application type:</span>
                      <span>{selectedActuator.ilcApplicationType}</span>
                    </div>
                    <div className={styles.actuatorValue}>
                      <span>ILC selected options:</span>
                      <span>{selectedActuator.ilcSelectedOptions}</span>
                    </div>
                    <div className={styles.actuatorValue}>
                      <span>Network node type:</span>
                      <span>{selectedActuator.networkNodeType}</span>
                    </div>
                    <div className={styles.actuatorValue}>
                      <span>Major revision:</span>
                      <span>{selectedActuator.majorRevision}</span>
                    </div>
                    <div className={styles.actuatorValue}>
                      <span>Minor revision:</span>
                      <span>{selectedActuator.minorRevision}</span>
                    </div>
                    <div className={styles.actuatorValue}>
                      <span>ADC scan rate:</span>
                      <span>{selectedActuator.adcScanRate}</span>
                    </div>
                    <div className={styles.actuatorValue}>
                      <span>Mezzanine unique id:</span>
                      <span>{selectedActuator.mezzanineUniqueId}</span>
                    </div>
                    <div className={styles.actuatorValue}>
                      <span>Mezzanine firmware type:</span>
                      <span>{selectedActuator.mezzanineFirmwareType}</span>
                    </div>
                    <div className={styles.actuatorValue}>
                      <span>Mezzanine major revision:</span>
                      <span>{selectedActuator.mezzanineMajorRevision}</span>
                    </div>
                    <div className={styles.actuatorValue}>
                      <span>Mezzanine minor revision:</span>
                      <span>{selectedActuator.mezzanineMinorRevision}</span>
                    </div>
                  </>
                ) : (
                  <div>No Actuator has been selected</div>
                )}
              </SummaryPanel>
            </div>

            <div className={styles.gridHardpointInfo}>
              <SummaryPanel className={styles.actuatorInfo}>
                {selectedHardpointId !== 0 ? (
                  <>
                    <div className={styles.actuatorValue}>
                      <Title>Hardpoint {selectedHardpoint.id}</Title>
                      <span
                        title={`ILC Status: ${selectedHardpoint.state}`}
                        className={[M1M3.statesIlc[selectedHardpoint.state].class, styles.summaryState].join(' ')}
                      >
                        {M1M3.statesIlc[selectedHardpoint.state].name}
                      </span>
                    </div>
                    <div className={styles.actuatorValue}>
                      <span>Motion status:</span>
                      <span
                        className={[M1M3.statesMotion[selectedHardpoint.motionState].class, styles.detailState].join(
                          ' ',
                        )}
                      >
                        {M1M3.statesMotion[selectedHardpoint.motionState].name}
                      </span>
                    </div>
                    <div className={styles.actuatorValue}>
                      <span>ILC unique id:</span>
                      <span>{selectedHardpoint.ilcUniqueId}</span>
                    </div>
                    <div className={styles.actuatorValue}>
                      <span>Breakaway LVDT:</span>
                      <span>{defaultNumberFormatter(selectedHardpoint.breakawayLVDT)}</span>
                    </div>
                    <div className={styles.actuatorValue}>
                      <span>Displacement LVDT:</span>
                      <span>{defaultNumberFormatter(selectedHardpoint.displacementLVDT)}</span>
                    </div>
                    <div className={styles.actuatorValue}>
                      <span>Breakaway Pressure:</span>
                      <span>{defaultNumberFormatter(selectedHardpoint.breakawayPressure)}</span>
                    </div>
                    <div className={styles.actuatorValue}>
                      <span>Minor revision:</span>
                      <span>{selectedHardpoint.minorRevision}</span>
                    </div>
                    <div className={styles.actuatorValue}>
                      <span>Major revision:</span>
                      <span>{selectedHardpoint.majorRevision}</span>
                    </div>
                  </>
                ) : (
                  <div>No Hardpoint has been selected</div>
                )}
              </SummaryPanel>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
