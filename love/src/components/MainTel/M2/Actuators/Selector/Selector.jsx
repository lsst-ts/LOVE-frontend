import React, { Component } from 'react';
import * as d3 from 'd3';
import PropTypes from 'prop-types';
import {
  M2ActuatorPositions,
  M2ActuatorTangentPositions,
} from 'Config';
import ForceGradiant from '../ForceGradiant/ForceGradiant';
import styles from './Selector.module.css';

export default class Selector extends Component {
  static propTypes = {
    actuatorReferenceId: PropTypes.arrayOf(PropTypes.number),
    actuatorTangentReferenceId: PropTypes.arrayOf(PropTypes.number),
    axialForceApplied: PropTypes.arrayOf(PropTypes.number),
    axialForceMeasured: PropTypes.arrayOf(PropTypes.number),
    tangentForceApplied: PropTypes.arrayOf(PropTypes.number),
    tangentForceMeasured: PropTypes.arrayOf(PropTypes.number),
    selectedActuator: PropTypes.number,
    selectedActuatorTangent: PropTypes.number,
    actuatorSelect: PropTypes.func,
    actuatorTangentSelect: PropTypes.func,
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
  };

  constructor(props) {
    super(props);
    this.state = {
      actuators: [],
      actuatorsTangent: [],
      xRadius: 0,
      yRadius: 0,
      maxRadius: 0,
      colormap: () => '#fff',
      width: 480,
      zoomLevel: 1,
    };

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

  /* static getActuatorsPositions = (ids, positions) => {
    console.log('getActuatorsPositions(', ids, positions);
    const { xPosition, yPosition, zPosition } = positions;
    // const positionsArray = M2.zip([xPosition, yPosition, zPosition]);
    const positionsArray = M2.zip([
      xPosition.map((x) => x * 39),
      yPosition.map((y) => y * 39),
      zPosition.map((z) => z * 39),
    ]);
    return positionsArray.map((position, i) => ({ id: ids[i], position }));
  }; */

  strokeActuatorSelected = (id) => {
    if (this.props.selectedActuator === id) return 'white';
    return 'none';
  };

  fillActuatorSelected = (id) => {
    if (this.props.selectedActuator === id) return 'white';
    return 'black';
  };

  strokeActuatorTangentSelected = (id) => {
    if (this.props.selectedActuatorTangent === id) return 'white';
    return 'none';
  };

  fillActuatorTangentSelected = (id) => {
    if (this.props.selectedActuatorTangent === id) return 'white';
    return 'black';
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
      if (maxRadius < Math.sqrt(Math.pow(act.position[0], 2) + Math.pow(act.position[1], 2))) {
        maxRadius = Math.floor(Math.sqrt(Math.pow(act.position[0], 2) + Math.pow(act.position[1], 2)));
      }
    });
/*     console.log(M2ActuatorPositions);
    console.log(xMin, xMax, yMin, yMax, maxRadius); */
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
      actuatorsTangent: M2ActuatorTangentPositions,
      xRadius: (xMax - xMin) / 2,
      yRadius: (yMax - yMin) / 2,
      maxRadius,
    });
  }

  componentWillUnmount() {
  }

  componentDidUpdate(prevProps) {
    d3.select('#circle-overlay').call(d3.zoom().scaleExtent([1, Infinity]).on('zoom', this.zoomed));

    if (
      prevProps.axialForceApplied !== this.props.axialForceApplied  ||
      prevProps.axialForceMeasured !== this.props.axialForceMeasured  ||
      prevProps.tangentForceApplied !== this.props.tangentForceApplied  ||
      prevProps.tangentForceMeasured !== this.props.tangentForceMeasured
    ) {

      const actuatorsForceCommanded = [
        ...this.props.axialForceApplied,
        ...this.props.tangentForceApplied,
      ];

      const actuatorsForceMeasured = [
        ...this.props.axialForceMeasured,
        ...this.props.tangentForceMeasured
      ];

      const maxForce = Math.max(...actuatorsForceCommanded, ...actuatorsForceMeasured);
      const minForce = Math.min(...actuatorsForceCommanded, ...actuatorsForceMeasured);

      this.setState({
        maxForce: maxForce,
        minForce: minForce,
        colormap: (val) => ForceGradiant.getGradiantColorX(val, minForce, maxForce)
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
    return (
      <div className={styles.container}>
        {this.getSvg()}
      </div>
    );
  }

  getSvg() {
    const { showActuatorsID, showCommandedForce, showMeasuredForce,
            actuatorSelect, selectedActuator,
            actuatorTangentSelect, selectedActuatorTangent } = this.props;
    /* const { actuatorReferenceId, actuatorTangentReferenceId } = this.props; */
    
    const { zoomLevel } = this.state;

    const scale = (Math.max(this.state.xRadius, this.state.yRadius) * this.state.width) / 65000;
    const margin = 60;

    return (
        <svg
          className={styles.svgContainer}
          viewBox={`0 0 ${this.state.width} ${this.state.width}`}
          onMouseEnter={this.disableScroll}
          onMouseLeave={this.enableScroll}
        >
          {this.getBackground()}
          {this.getScatter(scale, margin, showActuatorsID, showMeasuredForce, showCommandedForce, zoomLevel, actuatorSelect, selectedActuator)}
          {this.getAxis(margin, actuatorSelect)}
          {this.getTangentActuators(showActuatorsID, showMeasuredForce, showCommandedForce, actuatorTangentSelect, selectedActuatorTangent)}
        </svg>
    );
  }

  getScatter(scale, margin, showActuatorsID, showMeasuredForce, showCommandedForce, zoomLevel, actuatorSelect, selectedActuator) {
    const actuatorsForceMeasured = this.props.axialForceMeasured;
    const actuatorsForceCommanded = this.props.axialForceApplied;
    /* const { actuatorReferenceId } = this.props;
    console.log('actuatorReferenceId', actuatorReferenceId); */

    return (
      <g id="scatter" className={styles.scatter}>
        {this.state.actuators.map((act, i) => {
          return (
            <g key={act.id} className={styles.actuator} onClick={() => actuatorSelect(act.id)}>
              <circle
                cx={(act.position[0] + this.state.xRadius) * scale + margin}
                cy={(act.position[1] + this.state.yRadius) * scale + margin}
                key={act.id}
                fill={
                  showMeasuredForce
                    ? this.state.colormap(
                        actuatorsForceMeasured[i] ?? this.state.minForce
                      )
                    : 'gray'
                }
                stroke={
                  act.id === selectedActuator ?
                    this.strokeActuatorSelected(act.id)
                  :
                    showCommandedForce
                      ? this.state.colormap(
                          actuatorsForceCommanded[i] ?? this.state.minForce
                        )
                      : 'none'
                }
                strokeWidth={
                  act.id === selectedActuator ?
                    6
                  :
                    4
                }
                r={(this.state.maxRadius * scale) / 16}
                pointerEvents="all"
              />
              <text
                x={(act.position[0] + this.state.xRadius) * scale + margin}
                y={(act.position[1] + this.state.yRadius) * scale + margin}
                textAnchor="middle"
                alignmentBaseline="middle"
                className={zoomLevel > 1 && showActuatorsID || selectedActuator === act.id ? '' : styles.hidden}
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

  getTangentActuators(showActuatorsID, showMeasuredForce, showCommandedForce, actuatorTangentSelect, selectedActuatorTangent) {
    const x0 = this.state.width/2;
    const y0 = this.state.width/2;

    const actuatorsTangentForceCommanded = this.props.tangentForceApplied;
    const actuatorsTangentForceMeasured = this.props.tangentForceMeasured;
    const { actuatorTangentReferenceId } = this.props;

    return (
      <g
        id="tangent-actuators"
      >
        {this.state.actuatorsTangent.map((act, i) => {
          
          const x1 = x0 + act.position[0];
          const y1 = y0 + act.position[1];

          const x2 = x0 + act.position[2];
          const y2 = y0 + act.position[3];

          let x3 = x0 + act.position[2] * 1.1;
          let y3 = y0 + act.position[3] * 1.1;

          let x4 = x0 + act.position[0] * 1.1;
          let y4 = y0 + act.position[1] * 1.1;

          const centerX1 = (x1 + x2) / 2;
          const centerY1 = (y1 + y2) / 2;

          const centerX2 = (x3 + x4) / 2;
          const centerY2 = (y3 + y4) / 2;

          const difX1 = centerX1 - x1;
          const difY1 = centerY1 - y1;

          x4 = centerX2 - difX1;
          y4 = centerY2 - difY1;

          x3 = centerX2 + difX1;
          y3 = centerY2 + difY1;

          const centerX = (centerX1 + centerX2) / 2;
          const centerY = (centerY1 + centerY2) / 2;

          return (
            <g
              key={act.id}
              className={styles.actuatorTangent}
              onClick={() => actuatorTangentSelect(act.id)}
            >

              <path
                d={`
                  M ${x1} ${y1}
                  L ${x2} ${y2}
                  L ${x3} ${y3}
                  L ${x4} ${y4}
                  z
                `}
                strokeWidth={
                  act.id === selectedActuatorTangent ?
                    6
                  :
                    4
                }
                fill={
                  showMeasuredForce
                    ? this.state.colormap(
                        actuatorsTangentForceMeasured[i] ?? this.state.minForce
                      )
                    : 'gray'
                }
                stroke={
                  act.id === selectedActuatorTangent ?
                    this.strokeActuatorTangentSelected(act.id)
                  :
                    showCommandedForce
                      ? this.state.colormap(
                          actuatorsTangentForceCommanded[i] ?? this.state.minForce
                        )
                      : 'none'
                }
              />

              <text
                x={centerX}
                y={centerY}
                textAnchor="middle"
                alignmentBaseline="middle"
                className={showActuatorsID || selectedActuatorTangent === act.id ? '' : styles.hidden}
                pointerEvents="none"
              >
                {act.id}
              </text>

            </g>
          );
        })}
      </g>
    )
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
      </>
    );
  }

  getAxis(margin, actuatorSelect) {
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
          onClick={() => actuatorSelect(null)}
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