import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

import styles from './ForceGradiant.module.css';

export default class ForceGradiant extends Component {
  static propTypes = {
    actuatorReferenceId: PropTypes.arrayOf(PropTypes.number),
    actuatorTangentReferenceId: PropTypes.arrayOf(PropTypes.number),
    axialForceApplied: PropTypes.arrayOf(PropTypes.number),
    axialForceMeasured: PropTypes.arrayOf(PropTypes.number),
    tangentForceApplied: PropTypes.arrayOf(PropTypes.number),
    tangentForceMeasured: PropTypes.arrayOf(PropTypes.number),
    actuatorTangentSelect: PropTypes.number,
    selectedActuatorTangent: PropTypes.number,
  }

  constructor(props) {
    super(props);
    this.state = {
      colormap: () => '#fff',
      actuatorsForce: [],
      scaleColorSvg: undefined,
    };
  }

  getActuator = (id) => {
    if (id === 0) return { id: 'None', value: 'None' };
    const {
      actuatorReferenceId,
      axialForceApplied,
      axialForceMeasured,
    } = this.props;

    const actuatorIndex = actuatorReferenceId.indexOf(id);

    const actuator = {
      id: `C${String(id).padStart(2, '0')}`,
      axialForceApplied: axialForceApplied[actuatorIndex] ?? 0,
      axialForceMeasured: axialForceMeasured[actuatorIndex] ?? 0,
    };
    return actuator;
  };

  getActuatorTangent = (id) => {
    const {
      actuatorTangentReferenceId,
      tangentForceApplied,
      tangentForceMeasured,
    } = this.props;

    const actuatorIndex = actuatorTangentReferenceId.indexOf(id);
    
    const actuator = {
      id: `A${id}`,
      tangentForceApplied: tangentForceApplied[actuatorIndex] ?? 0,
      tangentForceMeasured: tangentForceMeasured[actuatorIndex] ?? 0,
    };
    return actuator;
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.axialForceApplied !== this.props.axialForceApplied  ||
      prevProps.axialForceMeasured !== this.props.axialForceMeasured  ||
      prevProps.tangentForceApplied !== this.props.tangentForceApplied  ||
      prevProps.tangentForceMeasured !== this.props.tangentForceMeasured
    ) {
      this.setState({ actuatorsForce: [
        ...this.props.axialForceApplied, ...this.props.axialForceMeasured,
        ...this.props.tangentForceApplied, ...this.props.tangentForceMeasured
      ]});    
      this.createColorScale(this.state.actuatorsForce);

    }
  }

  createColorScale = (values) => {
    const height = 40;
    const width = 300;
    const colours = ['#2c7bb6', '#00a6ca', '#00ccbc', '#90eb9d', '#ffff8c', '#f9d057', '#f29e2e', '#e76818', '#d7191c'];
    const colourRange = d3.range(0, 1, 1.0 / (colours.length - 1));
    colourRange.push(1);

    const colorScale = d3.scaleLinear().domain(colourRange).range(colours).interpolate(d3.interpolateHcl);

    const colorInterpolate = d3.scaleLinear().domain(d3.extent(values)).range([0, 1]);

    // const selectedActuatorValue = this.getActuator(this.props.selectedActuator);

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

  };

  setForce = (actuator) => {
    const svg = d3.select('#color-scale svg');
    
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
  }


  render() {

    const { selectedActuator, selectedActuatorTangent } = this.props;

    const { actuatorsForce } = this.state;

    const maxForce = Math.max(...actuatorsForce);
    const minForce = Math.min(...actuatorsForce);

    this.setForce(actuatorsForce[0]); // Pending

    return (
        <>
          <p className={styles.title}>Force</p>
          <div className={styles.forceGradientWrapper}>
            
            {/* add uniqueid */}
            <div id="color-scale" className={styles.forceGradient}>
              <span style={{ position: 'absolute', bottom: '-2em', left: 0 }}>{minForce} [N]</span>
              <span style={{ position: 'absolute', top: '-2em', left: 0 }}>{minForce} [N]</span>
              <svg className={styles.colorScaleSvg} style={{width: '100%'}} viewBox={`0 0 350 40`}></svg>
              <span style={{ position: 'absolute', bottom: '-2em', right: 0 }}>{maxForce} [N]</span>
              <span style={{ position: 'absolute', top: '-2em', right: 0 }}>{maxForce} [N]</span>
            </div>
          </div>
        </>
    );
  }
}