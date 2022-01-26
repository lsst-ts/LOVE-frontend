import React, { Component } from 'react';
import * as d3 from 'd3';

import { defaultNumberFormatter, fixedFloat } from 'Utils';
import {
  M1M3ActuatorForces,
  m1m3DetailedStateMap,
  m1m3DetailedStateToStyle,
  m1m3HardpointActuatorMotionStateMap,
  m1mActuatorILCStateMap,
  M1M3HardpointPositions,
  M2ActuatorPositions,
} from 'Config';
import Select from 'components/GeneralPurpose/Select/Select';
import Toggle from 'components/GeneralPurpose/Toggle/Toggle';
import SummaryPanel from 'components/GeneralPurpose/SummaryPanel/SummaryPanel';
import Title from 'components/GeneralPurpose/SummaryPanel/Title';
import CSCDetail from 'components/CSCSummary/CSCDetail/CSCDetail';
import CSCDetailStyles from 'components/CSCSummary/CSCDetail/CSCDetail.module.css';
import Inclinometer from './Inclinometer.jsx';
import styles from './M2.module.css';

export default class M2 extends Component {
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
      showActuatorsID: true,
      showCommandedForce: true,
      showMeasuredForce: true,
      actuatorsForce: [],
      selectedActuator: null,
    };
  }

  static statesIlc = {
    0: {
      name: 'WARNING',
      class: styles.warning_summary,
      fill: styles.fill_warning_summary,
    },
    1: {
      name: 'OK',
      class: styles.ok_summary,
      fill: styles.fill_ok_summary,
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
      userReadable: 'Disabled',
      char: 'D',
      class: styles.critical_detail,
    },
    2: {
      name: 'STEPPING',
      userReadable: 'Enabled',
      char: 'E',
      class: styles.ok_detail,
    },
    3: {
      name: 'QUICK POSITIONING',
      userReadable: 'Fault',
      char: 'F',
      class: styles.alert_detail,
    },
    4: {
      name: 'FINE POSITIONING',
      userReadable: 'Offline',
      char: 'O',
      class: styles.running_detail,
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
    // const positionsArray = M2.zip([xPosition, yPosition, zPosition]);
    const positionsArray = M2.zip([
      xPosition.map((x) => x * 39),
      yPosition.map((y) => y * 39),
      zPosition.map((z) => z * 39),
    ]);
    return positionsArray.map((position, i) => ({ id: ids[i], position }));
  };

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

  createColorScale = (values) => {
    const height = 40;
    const width = 300;
    const colours = ['#2c7bb6', '#00a6ca', '#00ccbc', '#90eb9d', '#ffff8c', '#f9d057', '#f29e2e', '#e76818', '#d7191c'];
    const colourRange = d3.range(0, 1, 1.0 / (colours.length - 1));
    colourRange.push(1);

    const colorScale = d3.scaleLinear().domain(colourRange).range(colours).interpolate(d3.interpolateHcl);

    const colorInterpolate = d3.scaleLinear().domain(d3.extent(values)).range([0, 1]);

    this.setState({
      colormap: (val) => colorScale(colorInterpolate(val)),
    });

    //Create the gradient
    const svg = d3.select('#color-scale svg').attr('width', width).attr('height', height);
    svg
      .append('defs')
      .append('linearGradient')
      .attr('id', 'force-gradient')
      .attr('x1', '100%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '0%')
      .selectAll('stop')
      .data(colours)
      .enter()
      .append('stop')
      .attr('offset', (d, i) => i / (colorScale.range().length - 1))
      .attr('stop-color', (d) => d);

    svg
      .append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('rx', 0)
      .attr('ry', 0)
      .attr('width', '100%')
      .attr('height', 40)
      .style('fill', 'url(#force-gradient)');

    const measuredForceX = 100;
    svg
      .append('line')
      .attr('x1', measuredForceX)
      .attr('y1', -10)
      .attr('x2', measuredForceX)
      .attr('y2', 50)
      .style('stroke', 'white')
      .style('stroke-width', 3);

    const textMeasured = svg
      .append('text')
      .attr('x', measuredForceX)
      .attr('y', -10)
      .attr('fill', 'white')
      .style('font-size', '1em');

    textMeasured.append('tspan').attr('x', measuredForceX).attr('y', -45).text('C03');
    textMeasured.append('tspan').attr('x', measuredForceX).attr('y', -30).text('Applied');
    textMeasured.append('tspan').attr('x', measuredForceX).attr('y', -15).text('3.646N ');

    const commandedForceX = 200;
    svg
      .append('line')
      .attr('x1', commandedForceX)
      .attr('y1', -10)
      .attr('x2', commandedForceX)
      .attr('y2', 50)
      .style('stroke', 'white')
      .style('stroke-width', 3);

    const textCommanded = svg
      .append('text')
      .attr('x', commandedForceX)
      .attr('y', 50)
      .attr('fill', 'white')
      .style('font-size', '1em');

    textCommanded.append('tspan').attr('x', commandedForceX).attr('y', 60).text('C03');
    textCommanded.append('tspan').attr('x', commandedForceX).attr('y', 75).text('Commanded');
    textCommanded.append('tspan').attr('x', commandedForceX).attr('y', 90).text('3.646N ');
  };

  actuatorSelected = (id) => {
    this.setState({ selectedActuator: id });
  };

  strokeActuatorSelected = (id) => {
    if (this.state.selectedActuator === id) return 'white';
    return 'none';
  };

  fillActuatorSelected = (id) => {
    if (this.state.selectedActuator === id) return 'white';
    return 'black';
  };

  hardpointSelected = (id) => {
    this.setState({ selectedHardpoint: id });
  };

  strokeHardpointSelected = (id) => {
    if (this.state.selectedHardpoint === id) return 'white';
    return 'gray';
  };

  strokeHardpointActuatorSelected = (id) => {
    if (this.state.selectedHardpoint === id) return 'white';
    return 'gray';
  };

  fillHardpointSelected = (id) => {
    if (this.state.selectedHardpoint === id) return 'white';
    return 'black';
  };

  getActuator = (id) => {
    if (id === 0) return { id: 'None', value: 'None', state: CSCDetail.states[0] };
    const {
      actuatorIlcState,
      actuatorReferenceId,
      axialActuatorSteps,
      axialEncoderPositions,
      axialForceApplied,
      axialForceMeasured,
    } = this.props;
    const { actuatorsForce } = this.state;
    const actuatorIndex = actuatorReferenceId.indexOf(id);
    const actuator = {
      id,
      state: actuatorIlcState[actuatorIndex] ?? 'None',
      // value: actuatorsForce[actuatorIndex] ?? 'None',
      axialActuatorStep: axialActuatorSteps[actuatorIndex] ?? 0,
      axialEncoderPosition: axialEncoderPositions[actuatorIndex] ?? 0,
      axialForceApplied: axialForceApplied[actuatorIndex] ?? 0,
      axialForceMeasured: axialForceMeasured[actuatorIndex] ?? 0,
    };

    actuator.state = CSCDetail.states[actuator.state];
    return actuator;
  };

  toggleActuatorsID = (show) => {
    this.setState({ showActuatorsID: show });
  };

  toggleCommandedForce = (show) => {
    this.setState({ showCommandedForce: show });
  };

  toggleMeasuredForce = (show) => {
    this.setState({ showMeasuredForce: show });
  };

  componentDidMount() {
    this.props.subscribeToStreams();

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
      if (maxRadius < Math.sqrt(Math.pow(act.position[0], 2) + Math.pow(act.position[1], 2))) {
        maxRadius = Math.floor(Math.sqrt(Math.pow(act.position[0], 2) + Math.pow(act.position[1], 2)));
      }
    });
    console.log(M2ActuatorPositions);
    console.log(xMin, xMax, yMin, yMax, maxRadius);
    xMin = -150;
    xMax = 160;
    yMin = -150;
    yMax = 160;
    maxRadius = 160;

    // Using SAL info
    // ManagerInterface.getTopicData('event-telemetry').then((data) => {
    //   this.setState({ optionsTree: data.MTM1M3.event_data });
    // });

    this.setState({
      actuators: M2ActuatorPositions,
      xRadius: (xMax - xMin) / 2,
      yRadius: (yMax - yMin) / 2,
      maxRadius,
    });
  }

  componentWillUnmount() {
    this.props.unsubscribeToStreams();
  }

  componentDidUpdate(prevProps, prevState) {
    d3.select('#circle-overlay').call(d3.zoom().scaleExtent([1, Infinity]).on('zoom', this.zoomed));

    if (
      this.state.selectedForceParameter !== prevState.selectedForceParameter ||
      this.props[this.state.selectedForceInput] !== prevProps[this.state.selectedForceInput]
    ) {
      const forceData = this.props[this.state.selectedForceInput]?.[this.state.selectedForceParameter]?.value ?? [];
      this.setState({ actuatorsForce: forceData });
    }

    if (this.state.actuators !== prevState.actuators) {
      const data = this.state.actuators.map(
        (act) => Math.sqrt(act.position[0] ** 2 + act.position[1] ** 2) / this.state.maxRadius,
      );
      this.createColorScale(data);
    }

    if (this.state.actuatorsForce !== prevState.actuatorsForce) {
      this.createColorScale(this.state.actuatorsForce);
    }

    const { xPosition, yPosition, zPosition, actuatorReferenceId } = this.props;
    if (
      prevProps.xPosition !== xPosition ||
      prevProps.yPosition !== yPosition ||
      prevProps.zPosition !== zPosition ||
      prevProps.actuatorReferenceId !== actuatorReferenceId
    ) {
      // const actuators = M2.getActuatorsPositions(actuatorReferenceId, { xPosition, yPosition, zPosition });
      const actuators = M2ActuatorPositions; // Old implementation

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
      xMin = -150;
      xMax = 160;
      yMin = -150;
      yMax = 160;
      maxRadius = 160;
      this.setState({
        actuators,
        xRadius: Math.floor((xMax - xMin) / 2),
        yRadius: Math.floor((yMax - yMin) / 2),
        maxRadius,
      });
    }
  }

  zoomed = () => {
    const scale = (Math.max(this.state.xRadius, this.state.yRadius) * this.state.width) / 65000;
    const xRadius = this.state.xRadius + 60; // + margin of render
    const yRadius = this.state.yRadius + 60; // + margin of render

    const transformX = Math.min(
      0,
      Math.max(d3.event.transform.x, 2 * xRadius * scale - 2 * xRadius * scale * d3.event.transform.k),
    );
    const transformY = Math.min(
      0,
      Math.max(d3.event.transform.y, 2 * yRadius * scale - 2 * yRadius * scale * d3.event.transform.k),
    );

    d3.event.transform.x = Math.floor(transformX);
    d3.event.transform.y = Math.floor(transformY);

    d3.select('#scatter').attr('transform', d3.event.transform);
    d3.select('#mirror-hole').attr('transform', d3.event.transform);
    // d3.select('#background-circle').attr('transform', d3.event.transform);
    // d3.select('#plot-axis').attr('transform', d3.event.transform);
    this.setState({
      zoomLevel: d3.event.transform.k,
    });
  };

  render() {
    const { zoomLevel, showActuatorsID, showCommandedForce, showMeasuredForce } = this.state;
    const scale = (Math.max(this.state.xRadius, this.state.yRadius) * this.state.width) / 65000;
    const margin = 60;

    const { axialActuatorSteps, zenithAngleMeasured } = this.props;
    const { actuatorsForce } = this.state;

    const summaryState = CSCDetail.states[this.props.summaryState];
    const commandableByDDS = {
      name: this.props.commandableByDDS ? 'CSC' : 'EUI',
      class: CSCDetailStyles[this.props.commandableByDDS ? 'ok' : 'warning'],
    };
    const forceBalanceSystemStatus = {
      name: this.props.forceBalanceSystemStatus ? 'ENABLED' : 'DISABLED',
      class: CSCDetailStyles[this.props.forceBalanceSystemStatus ? 'ok' : 'warning'],
    };
    const m2AssemblyInPosition = {
      name: this.props.m2AssemblyInPosition ? 'InPosition' : 'NotInPosition',
      class: CSCDetailStyles[this.props.m2AssemblyInPosition ? 'ok' : 'warning'],
    };

    const maxForce = Math.max(...actuatorsForce);
    const minForce = Math.min(...actuatorsForce);

    const selectedActuator = this.getActuator(this.state.selectedActuator);

    return (
      <div className={styles.mirrorContainer}>
        <SummaryPanel className={styles.summaryPanelStates}>
          <div className={styles.state}>
            <Title>M2 Status</Title>
            <span className={[summaryState.class, styles.summaryState].join(' ')}>{summaryState.name}</span>
          </div>
          <div className={styles.state}>
            <Title>Command</Title>
            <span className={[commandableByDDS.class, styles.summaryState].join(' ')}>{commandableByDDS.name}</span>
          </div>
          <div className={styles.state}>
            <Title>M2 Assembly</Title>
            <span className={[m2AssemblyInPosition.class, styles.summaryState].join(' ')}>
              {m2AssemblyInPosition.name}
            </span>
          </div>
          <div className={styles.state}>
            <Title>Force Balance</Title>
            <span className={[forceBalanceSystemStatus.class, styles.summaryState].join(' ')}>
              {forceBalanceSystemStatus.name}
            </span>
          </div>
        </SummaryPanel>

        <SummaryPanel className={styles.summaryPanelControls}>
          <h2 className={styles.title}>Actuators</h2>
          <div className={styles.controls}>
            <div className={styles.control}>
              <span>Actuators ID:</span>
              <div className={styles.toggleContainer}>
                <span>Show</span>
                <Toggle hideLabels={true} isLive={showActuatorsID} setLiveMode={this.toggleActuatorsID} />
                <span>Hide</span>
              </div>
            </div>
            <div className={styles.control}>
              <span>Commanded Force:</span>
              <div className={styles.toggleContainer}>
                <span>Show</span>
                <Toggle hideLabels={true} isLive={showCommandedForce} setLiveMode={this.toggleCommandedForce} />
                <span>Hide</span>
              </div>
            </div>
            <div className={styles.control}>
              <span>Measured Force:</span>
              <div className={styles.toggleContainer}>
                <span>Show</span>
                <Toggle hideLabels={true} isLive={showMeasuredForce} setLiveMode={this.toggleMeasuredForce} />
                <span>Hide</span>
              </div>
            </div>
          </div>
        </SummaryPanel>

        <div className={styles.plotSection}>
          <div class={styles.gridWindowM1M3}>
            <svg
              className={styles.svgContainer}
              viewBox={`0 0 ${this.state.width} ${this.state.width}`}
              onMouseEnter={this.disableScroll}
              onMouseLeave={this.enableScroll}
            >
              <circle
                id="background-circle"
                className={this.state.actuators.length > 0 ? styles.circleOverlay : styles.circleOverlayDisabled}
                cx={this.state.width / 2}
                cy={this.state.width / 2}
                key={'background'}
                r={this.state.width / 2}
              />

              <circle
                id="mirror-hole"
                cx={this.state.width / 2}
                cy={this.state.width / 2}
                r={this.state.width / 6}
                stroke="gray"
                strokeWidth="3"
                fill="#111F27"
              />

              <circle
                id="circle-overlay"
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

              <g id="scatter" className={styles.scatter}>
                {this.state.actuators.map((act, i) => {
                  return (
                    <g key={act.id} className={styles.actuator} onClick={() => this.actuatorSelected(act.id)}>
                      <circle
                        cx={(act.position[0] + this.state.xRadius) * scale + margin}
                        cy={(act.position[1] + this.state.yRadius) * scale + margin}
                        key={act.id}
                        fill={
                          showMeasuredForce
                            ? this.state.colormap(
                                Math.sqrt(Math.pow(act.position[0], 2) + Math.pow(act.position[1], 2)) /
                                  this.state.maxRadius,
                              )
                            : 'gray'
                        }
                        // fill={actuatorsForce.length > 0 ? this.state.colormap(actuatorsForce[i]) : this.state.colormap(0)}
                        // stroke={this.strokeActuatorSelected(act.id)}
                        stroke={
                          showCommandedForce
                            ? this.state.colormap(
                                Math.sqrt(Math.pow(act.position[0] + 10, 2) + Math.pow(act.position[1] + 10, 2)) /
                                  this.state.maxRadius,
                              )
                            : 'none'
                        }
                        stroke-width="4"
                        r={(this.state.maxRadius * scale) / 16}
                        pointerEvents="all"
                      />
                      <text
                        x={(act.position[0] + this.state.xRadius) * scale + margin}
                        y={(act.position[1] + this.state.yRadius) * scale + margin}
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
              </g>

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
              <g
                id="tangent-actuators"
                style={{
                  transform: `translate(50%, 50%) rotate(90deg)`,
                }}
              >
                <rect
                  width="50"
                  height="20"
                  style={{
                    fill: '#D7191C',
                    strokeWidth: 3,
                    stroke: '#EC801F',
                  }}
                  x={5}
                  y={-this.state.width / 2 + 5}
                />
                <rect
                  width="50"
                  height="20"
                  style={{
                    fill: '#D7191C',
                    strokeWidth: 3,
                    stroke: '#EC801F',
                    transformBox: 'fill-box',
                    transform: 'rotate(60deg)',
                    transformOrigin: 'bottom left',
                  }}
                  x={(this.state.width / 4) * Math.sqrt(3) - 10}
                  y={-(this.state.width - margin) / 4}
                />
                <rect
                  width="50"
                  height="20"
                  style={{
                    fill: '#D7191C',
                    strokeWidth: 3,
                    stroke: '#EC801F',
                    transformBox: 'fill-box',
                    transform: 'rotate(120deg)',
                    transformOrigin: 'bottom left',
                  }}
                  x={(this.state.width / 4) * Math.sqrt(3) - 30}
                  y={this.state.width / 4 - 10}
                />
                <rect
                  width="50"
                  height="20"
                  style={{
                    fill: '#D7191C',
                    strokeWidth: 3,
                    stroke: '#EC801F',
                    transform: 'rotateY(180deg)',
                  }}
                  x={20}
                  y={this.state.width / 2 - 25}
                />
                <rect
                  width="50"
                  height="20"
                  style={{
                    fill: '#D7191C',
                    strokeWidth: 3,
                    stroke: '#EC801F',
                    transformBox: 'fill-box',
                    transform: 'rotate(240deg)',
                    transformOrigin: 'bottom left',
                  }}
                  x={(-this.state.width / 4) * Math.sqrt(3) + 30}
                  y={this.state.width / 4 - 10}
                />
                <rect
                  width="50"
                  height="20"
                  style={{
                    fill: '#D7191C',
                    strokeWidth: 3,
                    stroke: '#EC801F',
                    transformBox: 'fill-box',
                    transform: 'rotate(300deg)',
                    transformOrigin: 'bottom left',
                  }}
                  x={(-(this.state.width - 30) / 4) * Math.sqrt(3) + 10}
                  y={-this.state.width / 4 - 10}
                />
              </g>
            </svg>
          </div>

          <div className={styles.gridGroupGradientInfo}>
            <div className="inclinometer">
              <p>Inclination</p>
              <Inclinometer inclination={zenithAngleMeasured} />
              <div className={styles.inclinometerValues}>
                <span>Inclination</span>
                <span className={styles.value}>{fixedFloat(zenithAngleMeasured, 2)}°</span>
                <span>Source</span>
                <span className={styles.value}>OnBoard</span>
              </div>
            </div>

            <div className={styles.forceGradientWrapper}>
              <span>Force</span>
              {/* add uniqueid */}
              <div id="color-scale" className={styles.forceGradient}>
                <span style={{ position: 'absolute', bottom: '-2em', left: 0 }}>{minForce} [N]</span>
                <svg className={styles.colorScaleSvg} viewBox={`0 0 350 40`}></svg>
                <span style={{ position: 'absolute', bottom: '-2em', right: 0 }}>{maxForce} [N]</span>
              </div>
            </div>

            <div className={styles.gridActuatorInfo}>
              <SummaryPanel className={styles.actuatorInfo}>
                {this.state.selectedActuator ? (
                  <>
                    <div className={styles.actuatorValue}>
                      <span className={styles.value}>Actuator {selectedActuator.id}</span>
                      <span className={[selectedActuator.state.class, styles.summaryState].join(' ')}>
                        {selectedActuator.state.name}
                      </span>
                    </div>
                    <div className={styles.actuatorValue}>
                      <span>Commanded Force:</span>
                      <span className={styles.value}>
                        {defaultNumberFormatter(selectedActuator.axialForceApplied)} N
                      </span>
                    </div>
                    <div className={styles.actuatorValue}>
                      <span>Measured Force:</span>
                      <span className={styles.value}>
                        {defaultNumberFormatter(selectedActuator.axialForceMeasured)} N
                      </span>
                    </div>
                    <div className={styles.actuatorValue}>
                      <span>Actuator Steps:</span>
                      <span className={styles.value}>{defaultNumberFormatter(selectedActuator.axialActuatorStep)}</span>
                    </div>
                    <div className={styles.actuatorValue}>
                      <span>Position:</span>
                      <span className={styles.value}>
                        {defaultNumberFormatter(selectedActuator.axialEncoderPosition)}°
                      </span>
                    </div>
                  </>
                ) : (
                  <span>No actuator selected</span>
                )}
              </SummaryPanel>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
