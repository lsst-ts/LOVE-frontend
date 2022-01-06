import React, { Component } from 'react';
import * as d3 from 'd3';

import { defaultNumberFormatter } from 'Utils';
import {
  M1M3ActuatorPositions,
  M1M3ActuatorForces,
  m1m3DetailedStateMap,
  m1m3DetailedStateToStyle,
  m1m3HardpointActuatorMotionStateMap,
  m1mActuatorILCStateMap,
  M1M3HardpointPositions,
} from 'Config';
import Select from 'components/GeneralPurpose/Select/Select';
import Toggle from 'components/GeneralPurpose/Toggle/Toggle';
import SummaryPanel from 'components/GeneralPurpose/SummaryPanel/SummaryPanel';
import Title from 'components/GeneralPurpose/SummaryPanel/Title';
import CSCDetail from 'components/CSCSummary/CSCDetail/CSCDetail';
import CSCDetailStyles from 'components/CSCSummary/CSCDetail/CSCDetail.module.css';
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
      selectedForceInput: '',
      selectedForceParameter: '',
      showActuatorsID: true,
      showHardpoints: true,
      actuatorsForce: [],
      selectedActuator: 0,
      selectedHardpoint: 0,
      optionsTree: null,
      forceParameters: [],
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
    const svg = d3.select('#color-scale svg').attr('width', width).attr('height', height);
    svg
      .append('defs')
      .append('linearGradient')
      .attr('id', 'force-gradient')
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
      .style('fill', 'url(#force-gradient)');
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
      name: m1mActuatorILCStateMap[hardpoint.ilcStatus],
      class: M2.statesIlc[hardpoint.ilcStatus].class,
    };
    hardpoint.motionStatus = {
      name: m1m3HardpointActuatorMotionStateMap[hardpoint.motionStatus],
      class: M2.statesMotion[hardpoint.motionStatus].class,
    };
    return hardpoint;
  };

  fillHardpoint = (id) => {
    const { hardpointIlcState, hardpointReferenceId } = this.props;
    const hardpointIndex = hardpointReferenceId.indexOf(id);
    return M2.statesIlc[hardpointIlcState[hardpointIndex] ?? 0].fill;
  };

  forceInputSelected = (input) => {
    const force = input.value;
    // Using SAL info
    // const filteredParameters = Object.keys(this.state.optionsTree[force]).filter((x) => {
    //   return !['timestamp', 'priority'].includes(x);
    // });
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

    // Using SAL info
    // ManagerInterface.getTopicData('event-telemetry').then((data) => {
    //   this.setState({ optionsTree: data.MTM1M3.event_data });
    // });

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
      const actuators = M2.getActuatorsPositions(actuatorReferenceId, { xPosition, yPosition, zPosition });
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

    d3.select('#scatter').attr('transform', d3.event.transform);
    // d3.select('#background-circle').attr('transform', d3.event.transform);
    // d3.select('#plot-axis').attr('transform', d3.event.transform);
    this.setState({
      zoomLevel: d3.event.transform.k,
    });
  };

  render() {
    const { zoomLevel, showActuatorsID, showHardpoints, forceParameters } = this.state;
    const scale = (Math.max(this.state.xRadius, this.state.yRadius) * this.state.width) / 65000;
    const margin = 60;

    const { forceActuatorData } = this.props;
    const { actuatorsForce } = this.state;

    const summaryState = CSCDetail.states[this.props.summaryState];
    const detailedStateValue = {
      name: m1m3DetailedStateMap[this.props.detailedState],
      class: CSCDetailStyles[m1m3DetailedStateToStyle[m1m3DetailedStateMap[this.props.detailedState]]],
    };

    const maxForce = Math.max(...actuatorsForce);
    const minForce = Math.min(...actuatorsForce);

    const selectedActuator = this.getActuator(this.state.selectedActuator);
    const selectedHardpoint = this.getHardpoint(this.state.selectedHardpoint);
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
                <span>Yes</span>
                <Toggle hideLabels={true} isLive={this.state.showActuatorsID} setLiveMode={this.toggleActuatorsID} />
                <span>No</span>
              </div>
            </div>
            <div className={styles.control}>
              <span>Show hardpoints:</span>
              <div className={styles.toggleContainer}>
                <span>Yes</span>
                <Toggle hideLabels={true} isLive={this.state.showHardpoints} setLiveMode={this.toggleHardpoints} />
                <span>No</span>
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
                r={this.state.width / 2 - 30}
              />

              <circle
                id="circle-overlay"
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

              <g id="scatter" className={styles.scatter}>
                {this.state.actuators.map((act, i) => {
                  return (
                    <g key={act.id} className={styles.actuator} onClick={() => this.actuatorSelected(act.id)}>
                      <circle
                        cx={(act.position[0] + this.state.xRadius) * scale + margin}
                        cy={(act.position[1] + this.state.yRadius) * scale + margin}
                        key={act.id}
                        fill={this.state.colormap(
                          Math.sqrt(Math.pow(act.position[0], 2) + Math.pow(act.position[1], 2)) / this.state.maxRadius,
                        )}
                        // fill={actuatorsForce.length > 0 ? this.state.colormap(actuatorsForce[i]) : this.state.colormap(0)}
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
                r={this.state.width / 2 + 40}
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
              <div id="color-scale" className={styles.forceGradient}>
                <svg viewBox={`0 0 10 350`}></svg>
                <div className={styles.forceGradientLabels}>
                  <span>{maxForce} [N]</span>
                  <span>{minForce} [N]</span>
                </div>
              </div>
            </div>

            <div className={styles.gridActuatorInfo}>
              <SummaryPanel className={styles.actuatorInfo}>
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
              </SummaryPanel>
            </div>

            <div class={styles.gridHardpointInfo}>
              <SummaryPanel className={styles.actuatorInfo}>
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
              </SummaryPanel>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
