import React, { Component } from 'react';
import * as d3 from 'd3';
import { uniqueId, isEqual } from 'lodash';
import { defaultNumberFormatter } from 'Utils';
import {
  M1M3ActuatorPositions,
  M1M3ActuatorForces,
  m1m3DetailedStateMap,
  m1m3DetailedStateToStyle,
  m1m3HardpointActuatorMotionStateMap,
  M1M3HardpointPositions,
} from 'Config';
import Button from 'components/GeneralPurpose/Button/Button';
import Select from 'components/GeneralPurpose/Select/Select';
import Toggle from 'components/GeneralPurpose/Toggle/Toggle';
import SummaryPanel from 'components/GeneralPurpose/SummaryPanel/SummaryPanel';
import Title from 'components/GeneralPurpose/SummaryPanel/Title';
import CSCDetail from 'components/CSCSummary/CSCDetail/CSCDetail';
import CSCDetailStyles from './CSCDetail.module.css';
import styles from './M1M3.module.css';

export default class M1M3 extends Component {
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
      selectedForceInput: '',
      selectedForceParameter: '',
      showActuatorsID: true,
      showHardpoints: true,
      actuatorsForce: [],
      selectedActuatorId: 0,
      selectedHardpointId: 0,
      forceParameters: [],
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
      name: 'OK',
      class: styles.alert_summary,
      fill: styles.fill_alert_summary,
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
    // const positionsArray = M1M3.zip([xPosition, yPosition, zPosition]);
    const positionsArray = M1M3.zip([
      xPosition.map((x) => x * 39),
      yPosition.map((x) => x * 39),
      zPosition.map((x) => x * 39),
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
    const height = 300;
    const width = 10;
    const colours = ['#2c7bb6', '#00a6ca', '#00ccbc', '#90eb9d', '#ffff8c', '#f9d057', '#f29e2e', '#e76818', '#d7191c'];
    const colourRange = d3.range(0, 1, 1.0 / (colours.length - 1));
    colourRange.push(1);

    const colorScale = d3.scaleLinear().domain(colourRange).range(colours).interpolate(d3.interpolateHcl);

    const colorInterpolate = d3.scaleLinear().domain(d3.extent(values)).range([0, 1]);

    this.setState({
      colormap: (val) => colorScale(colorInterpolate(val)),
    });

    //Create the gradient
    const svg = d3.select(`#${this.uniqueGradient} svg`).attr('width', width).attr('height', height);
    svg
      .append('defs')
      .append('linearGradient')
      .attr('id', this.uniqueForceGradient)
      .attr('x1', '0%')
      .attr('y1', '100%')
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
      .attr('rx', 5)
      .attr('ry', 5)
      .attr('width', 10)
      .attr('height', '100%')
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

  getActuator = (id) => {
    if (id === 0) return { id: 'None', value: 'None', state: CSCDetail.states[0] };
    const { actuatorIlcState, actuatorReferenceId } = this.props;
    const { actuatorsForce } = this.state;
    const actuatorIndex = actuatorReferenceId.indexOf(id);
    const actuator = {
      id,
      state: actuatorIlcState[actuatorIndex] ?? 'None',
      value: actuatorsForce[actuatorIndex] ?? 'None',
    };

    actuator.state = CSCDetail.states[actuator.state];
    return actuator;
  };

  getHardpoint = (id) => {
    if (id === 0)
      return {
        id: 'None',
        ilcStatus: CSCDetail.states[0],
        motionStatus: CSCDetail.states[0],
        breakawayLVDT: { value: 'None' },
        displacementLVDT: { value: 'None' },
        breakawayPressure: { value: 'None' },
      };
    const {
      hardpointIlcState,
      hardpointMotionState,
      hardpointReferenceId,
      hardpointsBreakawayLVDT,
      hardpointsDisplacementLVDT,
      hardpointsBreakawayPressure,
    } = this.props;
    const hardpointIndex = hardpointReferenceId.indexOf(id);

    const hardpoint = {
      id,
      ilcStatus: hardpointIlcState[hardpointIndex] ?? 'None',
      motionStatus: hardpointMotionState[hardpointIndex] ?? 'None',
      breakawayLVDT: { value: hardpointsBreakawayLVDT[hardpointIndex] ?? 'None' },
      displacementLVDT: { value: hardpointsDisplacementLVDT[hardpointIndex] ?? 'None' },
      breakawayPressure: { value: hardpointsBreakawayPressure[hardpointIndex] ?? 'None' },
    };

    hardpoint.ilcStatus = {
      name: M1M3.statesIlc[hardpoint.ilcStatus].name,
      class: M1M3.statesIlc[hardpoint.ilcStatus].class,
    };
    hardpoint.motionStatus = {
      name: m1m3HardpointActuatorMotionStateMap[hardpoint.motionStatus],
      class: M1M3.statesMotion[hardpoint.motionStatus].class,
    };
    return hardpoint;
  };

  fillHardpoint = (id) => {
    const { hardpointIlcState, hardpointReferenceId } = this.props;
    const hardpointIndex = hardpointReferenceId.indexOf(id);
    return M1M3.statesIlc[hardpointIlcState[hardpointIndex] ?? 0].fill;
  };

  forceInputSelected = (input) => {
    const force = input.value;
    const filteredParameters = M1M3ActuatorForces[force];
    this.setState({
      selectedForceInput: force,
      forceParameters: filteredParameters,
    });
  };

  forceParameterSelected = (input) => {
    const force = input.value;
    this.setState({
      selectedForceParameter: force,
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
    this.zoom = d3.zoom().scaleExtent([1, Infinity]).on('zoom', this.zoomed);
    d3.select(`#${this.uniqueCircleOverlay}`).call(this.zoom);

    if (
      this.state.selectedForceParameter !== prevState.selectedForceParameter ||
      !isEqual(this.props[this.state.selectedForceInput], prevProps[this.state.selectedForceInput])
    ) {
      const forceData = this.props[this.state.selectedForceInput]?.[this.state.selectedForceParameter]?.value ?? [];
      this.setState({ actuatorsForce: forceData });
    }

    if (!isEqual(this.state.actuators, prevState.actuators)) {
      const data = this.state.actuators.map(
        (act) => Math.sqrt(act.position[0] ** 2 + act.position[1] ** 2) / this.state.maxRadius,
      );
      this.createColorScale(data);
    }

    if (!isEqual(this.state.actuatorsForce, prevState.actuatorsForce)) {
      this.createColorScale(this.state.actuatorsForce);
    }

    const { xPosition, yPosition, zPosition, actuatorReferenceId } = this.props;
    if (
      prevProps.xPosition !== xPosition ||
      prevProps.yPosition !== yPosition ||
      prevProps.zPosition !== zPosition ||
      !isEqual(prevProps.actuatorReferenceId, actuatorReferenceId)
    ) {
      const actuators = M1M3.getActuatorsPositions(actuatorReferenceId, { xPosition, yPosition, zPosition });
      // const actuators = M1M3ActuatorPositions; // Old implementation

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

    d3.select(`#${this.uniqueScatter}`).attr('transform', d3.event.transform);
    // d3.select('#background-circle').attr('transform', d3.event.transform);
    // d3.select('#plot-axis').attr('transform', d3.event.transform);
    this.setState({
      zoomLevel: d3.event.transform.k,
    });
  };

  render() {
    const {
      actuatorsForce,
      zoomLevel,
      showActuatorsID,
      showHardpoints,
      forceParameters,
      selectedActuatorId,
      selectedHardpointId,
    } = this.state;
    const { forceActuatorData } = this.props;

    const scale = (Math.max(this.state.xRadius, this.state.yRadius) * this.state.width) / 65000;
    const margin = 60;

    const summaryState = CSCDetail.states[this.props.summaryState];
    const detailedStateValue = {
      name: m1m3DetailedStateMap[this.props.detailedState],
      class: CSCDetailStyles[m1m3DetailedStateToStyle[m1m3DetailedStateMap[this.props.detailedState]]],
    };

    const maxForce = defaultNumberFormatter(Math.max(...actuatorsForce));
    const minForce = defaultNumberFormatter(Math.min(...actuatorsForce));

    const selectedActuator = this.getActuator(selectedActuatorId);
    const selectedHardpoint = this.getHardpoint(selectedHardpointId);
    const forceInputs = Object.keys(M1M3ActuatorForces);

    return (
      <div className={styles.mirrorContainer}>
        <SummaryPanel className={styles.summaryPanelStates}>
          <div className={styles.state}>
            <Title>STATE</Title>
            <span className={[summaryState.class, styles.summaryState].join(' ')}>{summaryState.name}</span>
          </div>
          <div className={styles.state}>
            <Title>DETAILED STATE</Title>
            <span className={[detailedStateValue.class, styles.summaryState].join(' ')}>{detailedStateValue.name}</span>
          </div>
        </SummaryPanel>

        <SummaryPanel className={styles.summaryPanelControls}>
          <h2 className={styles.title}>Actuators</h2>
          <div className={styles.controls}>
            <div
              style={{ width: '12em', paddingRight: '1em', borderRight: '1px solid gray' }}
              className={styles.control}
            >
              <span>Select force input:</span>
              <Select
                options={forceInputs}
                option={null}
                onChange={(selection) => this.forceInputSelected(selection)}
              />
            </div>
            <div className={styles.control}>
              <span>Select force parameter:</span>
              <Select
                options={forceParameters}
                option={null}
                onChange={(selection) => this.forceParameterSelected(selection)}
              />
            </div>
            <div className={styles.control}>
              <span>Show actuators ID:</span>
              <div className={styles.toggleContainer}>
                <Toggle
                  labels={['No', 'Yes']}
                  isLive={this.state.showActuatorsID}
                  setLiveMode={this.toggleActuatorsID}
                />
              </div>
            </div>
            <div className={styles.control}>
              <span>Show hardpoints:</span>
              <div className={styles.toggleContainer}>
                <Toggle labels={['No', 'Yes']} isLive={this.state.showHardpoints} setLiveMode={this.toggleHardpoints} />
              </div>
            </div>
          </div>
        </SummaryPanel>

        <div className={styles.plotSection}>
          {/* <svg className={styles.svgContainer} width={this.state.width} height={this.state.width}> */}

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
              {/* <svg className={styles.svgContainer} viewBox={`0 0 ${this.state.xRadius * scale * 2} ${this.state.yRadius * scale * 2}`}> */}
              {/* <text x='0' y="10">-X</text>
              <text x="20" y="10">+X</text>
              <text x="10" y="20">+Y</text> */}

              <circle
                id="background-circle"
                className={this.state.actuators.length > 0 ? styles.circleOverlay : styles.circleOverlayDisabled}
                cx={this.state.width / 2}
                cy={this.state.width / 2}
                key={'background'}
                r={this.state.width / 2 - 30}
              />

              <circle
                id={this.uniqueCircleOverlay}
                className={this.state.actuators.length > 0 ? styles.cursorMove : styles.circleOverlayDisabled}
                cx={this.state.width / 2}
                cy={this.state.width / 2}
                key={'overlay'}
                fill={'none'}
                r={this.state.width / 2 - 30}
                pointerEvents="all"
                onMouseEnter={this.enableScroll}
                onMouseLeave={this.disableScroll}
              />

              <g id={this.uniqueScatter} className={styles.scatter}>
                {this.state.actuators.map((act, i) => {
                  return (
                    <g key={act.id} className={styles.actuator} onClick={() => this.actuatorSelected(act.id)}>
                      <circle
                        cx={(act.position[0] + this.state.xRadius) * scale + margin}
                        cy={(act.position[1] + this.state.yRadius) * scale + margin}
                        key={act.id}
                        // fill={this.state.colormap(
                        //   Math.sqrt(Math.pow(act.position[0], 2) + Math.pow(act.position[1], 2)) / this.state.maxRadius,
                        // )}
                        fill={
                          actuatorsForce.length > 0 ? this.state.colormap(actuatorsForce[i]) : this.state.colormap(0)
                        }
                        stroke={this.strokeActuatorSelected(act.id)}
                        r={(this.state.maxRadius * scale) / 21}
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
                {M1M3HardpointPositions.map((hardpoint) => {
                  return (
                    <circle
                      key={hardpoint.id}
                      className={showHardpoints ? styles.circleHardpointActuator : styles.hidden}
                      cx={(hardpoint.actuator.position[0] + this.state.xRadius) * scale + margin}
                      cy={(hardpoint.actuator.position[1] + this.state.yRadius) * scale + margin}
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
                r={this.state.width * 0.7}
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
            </svg>
          </div>

          <div className={styles.gridGroupGradiantInfo}>
            <div className={styles.forceGradientWrapper}>
              <span>Force</span>
              <div id={this.uniqueGradient} className={styles.forceGradient}>
                <svg viewBox={`0 0 10 350`}></svg>
                <div className={styles.forceGradientLabels}>
                  <span>{maxForce} [N]</span>
                  <span>{minForce} [N]</span>
                </div>
              </div>
            </div>

            <div className={styles.gridActuatorInfo}>
              <SummaryPanel className={styles.actuatorInfo}>
                {selectedActuatorId !== 0 ? (
                  <>
                    <div className={styles.actuatorValue}>
                      <Title>Actuator {selectedActuator.id}</Title>
                    </div>
                    <div className={styles.actuatorValue}>
                      <span>Actuator status:</span>
                      <span className={[selectedActuator.state.class, styles.summaryState].join(' ')}>
                        {selectedActuator.state.name}
                      </span>
                    </div>
                    <div className={styles.actuatorValue}>
                      <span>Applied force:</span>
                      <span>{defaultNumberFormatter(selectedActuator.value)}</span>
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
                    </div>
                    <div className={styles.actuatorValue}>
                      <span>ILC status:</span>
                      <span className={[selectedHardpoint.ilcStatus.class, styles.summaryState].join(' ')}>
                        {selectedHardpoint.ilcStatus.name}
                      </span>
                    </div>
                    <div className={styles.actuatorValue}>
                      <span>Motion status:</span>
                      <span className={[selectedHardpoint.motionStatus.class, styles.detailState].join(' ')}>
                        {selectedHardpoint.motionStatus.name}
                      </span>
                    </div>
                    <div className={styles.actuatorValue}>
                      <span>Breakaway LVDT:</span>
                      <span>{defaultNumberFormatter(selectedHardpoint.breakawayLVDT.value)}</span>
                    </div>
                    <div className={styles.actuatorValue}>
                      <span>Displacement LVDT:</span>
                      <span>{defaultNumberFormatter(selectedHardpoint.displacementLVDT.value)}</span>
                    </div>
                    <div className={styles.actuatorValue}>
                      <span>Breakaway Pressure:</span>
                      <span>{defaultNumberFormatter(selectedHardpoint.breakawayPressure.value)}</span>
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
