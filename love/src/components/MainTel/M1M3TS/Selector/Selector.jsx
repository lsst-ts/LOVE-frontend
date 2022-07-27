import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import TemperatureGradiant from '../Temperature/TemperatureGradiant';
import { M2ActuatorPositions } from 'Config';
import styles from './Selector.module.css';
import WarningIcon from 'components/icons/WarningIcon/WarningIcon';

export default class Selector extends Component {
  static propTypes = {
    sensorReferenceId: PropTypes.arrayOf(PropTypes.number),
    selectedSensor: PropTypes.number,
    sensorSelect: PropTypes.func,
    showFcuIDs: PropTypes.bool,
    showDifferentialTemp: PropTypes.bool,
    showWarnings: PropTypes.bool,
    absoluteTemperature: PropTypes.arrayOf(PropTypes.number),
    differentialTemperature: PropTypes.arrayOf(PropTypes.number),
    /** Number of the minimum temperature limit, used for the gradiant color */
    minTemperatureLimit: PropTypes.number,
    /** Number of the maximum temperature limit, used for the gradiant color */
    maxTemperatureLimit: PropTypes.number,
  };

  static defaultProps = {
    sensorReferenceId: [],
    selectedSensor: undefined,
    sensorSelect: () => { console.log('Selector.defaultProps.sensorSelect()')},
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
    const colorInterpolate = d3.scaleLinear().domain(d3.extent([minTemperatureLimit, maxTemperatureLimit])).range([0, 1]);
    return TemperatureGradiant.COLOR_SCALE(1 - colorInterpolate(value));
  }

  getThermalWarnings = (sensorIndex) => {
    const {
      thermalWarnings={},
    } = this.props;

    const warnings = Object.keys(thermalWarnings).map((key, _) => {
      const result = {
        name: key,
        value: thermalWarnings[key][sensorIndex],
      };
      return result;
    }).some((warning) => warning.value === true);

    return warnings;
  }

  getWarningIcon(id) {
    return (
      <>
        <title>{id}</title>
        <g transform-origin={`1.4% -1.4%`}
            transform={`scale(0.035) rotate(180)`}
        >
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
    const {
      sensorReferenceId,
      differentialTemperature,
      absoluteTemperature,
    } = this.props;

    const sensorIndex = sensorReferenceId.indexOf(id) >= 0 ? sensorReferenceId.indexOf(id) : undefined;
    const warning = this.getThermalWarnings(sensorIndex);

    const sensor = {
      id,
      differentialTemperature: differentialTemperature[sensorIndex ?? 0] ?? 0,
      absoluteTemperature: absoluteTemperature[sensorIndex ?? 0] ?? 0,
      colorDifferentialTemperature: this.getGradiantColorX(differentialTemperature[sensorIndex ?? 0]),
      colorAbsoluteTemperature: this.getGradiantColorX(absoluteTemperature[sensorIndex ?? 0]),
      warning,
    };
    return sensor;
  }

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
    /* console.log(M2ActuatorPositions);
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
      sensors: M2ActuatorPositions,
      xRadius: (xMax - xMin) / 2,
      yRadius: (yMax - yMin) / 2,
      maxRadius,
    });
  }

  componentDidUpdate() {
    d3.select('#circle-overlay').call(d3.zoom().scaleExtent([1, Infinity]).on('zoom', this.zoomed));
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
    const { showFcuIDs, showDifferentialTemp, showWarnings,
      sensorSelect, selectedSensor,
    } = this.props;

    const { zoomLevel } = this.state;

    return (
      <div className={styles.container}>
        {this.getSvg(showFcuIDs, showDifferentialTemp, showWarnings,
      sensorSelect, selectedSensor, zoomLevel)}
      </div>
    );
  }

  getSvg(showFcuIDs, showDifferentialTemp, showWarning,
    sensorSelect, selectedSensor, zoomLevel) {

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
          {this.getScatter(scale, margin, zoomLevel,
            showFcuIDs, showDifferentialTemp, showWarning,
            sensorSelect, selectedSensor)}
          {this.getAxis(margin, sensorSelect)}
        </svg>
    );
  }

  getScatter(
    scale, margin, zoomLevel,
    showFcuIDs, showDifferentialTemp, showWarning,
    sensorSelect, selectedSensor,
  ) {

    return (
      <g id="scatter" className={styles.scatter}>
        {this.state.sensors.map((act) => {
          return (
            <g key={act.id} className={styles.sensor} onClick={() => sensorSelect(act.id)}>
              <circle
                cx={(act.position[0] + this.state.xRadius) * scale + margin}
                cy={(act.position[1] + this.state.yRadius) * scale + margin}
                key={act.id}
                fill={
                  showDifferentialTemp
                    ? ( this.getSensor(act.id)?.colorDifferentialTemperature ?? 'gray' )
                    : ( this.getSensor(act.id)?.colorAbsoluteTemperature ?? 'gray' )
                }
                stroke={
                  selectedSensor === act.id
                    ? this.strokeSensorSelected(act.id)
                    : 'none'
                }
                strokeWidth={
                  act.id === selectedSensor ? 6 : 4
                }
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
                { act.id }
              </text>
              { showWarning && this.getSensor(act.id)?.warning  ?
                  <g
                    transform-origin={`0% 0%`}
                    transform={`translate(${(act.position[0] + this.state.xRadius) * scale + margin} ${(act.position[1] + this.state.yRadius) * scale + margin})`}
                  >
                    {this.getWarningIcon(act.id)}
                  </g>
                : <></>
              }
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
