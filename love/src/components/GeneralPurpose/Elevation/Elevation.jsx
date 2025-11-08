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
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import styles from './Elevation.module.css';

export default class Elevation extends Component {
  static propTypes = {
    /** Angle in degrees to fill the arc (0-360) */
    angle: PropTypes.number,
  };

  static defaultProps = {
    angle: 0,
  };

  constructor(props) {
    super(props);
    this.svgRef = React.createRef();
    this.arcData = { endAngle: 0 };
  }

  componentDidMount() {
    this.initializeArc();
    this.updateArc(this.props.angle);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.angle !== this.props.angle) {
      this.updateArc(this.props.angle);
    }
  }

  initializeArc() {
    const width = 100;
    const height = 100;
    const outerRadius = height / 2 - 10;
    const innerRadius = outerRadius * 0.75;
    const tau = 2 * Math.PI;

    const svg = d3.select(this.svgRef.current);

    // Clear any existing content
    svg.selectAll('*').remove();

    svg.attr('viewBox', [-width / 2, -height / 2, width, height]);

    const g = svg.append('g').attr('transform', `translate(${width / 2}, ${height / 2})`);

    // Define the inner arc - start from the right (0 radians in polar coordinates)
    this.arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius).startAngle(0);

    // Create background arc for inner arc
    g.append('path').datum({ endAngle: tau }).style('fill', '#ddd').attr('d', this.arc);

    // Create foreground arc for inner arc
    this.foreground = g.append('path').datum(this.arcData).style('fill', 'orange').attr('d', this.arc);

    // Define the outer concentric arc
    const arcWidth = outerRadius - innerRadius;
    const outerInnerRadius = outerRadius;
    const outerOuterRadius = outerRadius + arcWidth * 5;

    this.outerArc = d3.arc().innerRadius(outerInnerRadius).outerRadius(outerOuterRadius).startAngle(0);

    // Create background arc for outer arc
    g.append('path').datum({ endAngle: tau }).style('fill', '#ccc').attr('d', this.outerArc);

    // Create foreground arc for outer arc
    this.outerForeground = g.append('path').datum(this.arcData).style('fill', 'steelblue').attr('d', this.outerArc);

    // Define the region arc (0° to 10°)
    const regionStartAngle = 0; // 0 degrees in radians (right side)
    const regionEndAngle = -(10 / 360) * tau; // 10 degrees counter-clockwise

    this.regionArc = d3
      .arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
      .startAngle(regionStartAngle)
      .endAngle(regionEndAngle);

    // Create region arc
    g.append('path')
      .datum({ startAngle: regionStartAngle, endAngle: regionEndAngle })
      .style('fill', 'red')
      .attr('d', this.regionArc);

    // Define the second region arc (80° to 90°)
    const region2StartAngle = -(80 / 360) * tau; // 80 degrees counter-clockwise
    const region2EndAngle = -(90 / 360) * tau; // 90 degrees counter-clockwise

    this.region2Arc = d3
      .arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
      .startAngle(region2StartAngle)
      .endAngle(region2EndAngle);

    // Create second region arc
    g.append('path')
      .datum({ startAngle: region2StartAngle, endAngle: region2EndAngle })
      .style('fill', 'green')
      .attr('d', this.region2Arc);

    // Define the third region arc (10° to 20°)
    const region3StartAngle = -(10 / 360) * tau; // 10 degrees counter-clockwise
    const region3EndAngle = -(20 / 360) * tau; // 20 degrees counter-clockwise

    this.region3Arc = d3
      .arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
      .startAngle(region3StartAngle)
      .endAngle(region3EndAngle);

    // Create third region arc
    g.append('path')
      .datum({ startAngle: region3StartAngle, endAngle: region3EndAngle })
      .style('fill', 'yellow')
      .attr('d', this.region3Arc);

    // Define the fourth region arc (70° to 80°)
    const region4StartAngle = -(70 / 360) * tau; // 70 degrees counter-clockwise
    const region4EndAngle = -(80 / 360) * tau; // 80 degrees counter-clockwise

    this.region4Arc = d3
      .arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
      .startAngle(region4StartAngle)
      .endAngle(region4EndAngle);

    // Create fourth region arc
    g.append('path')
      .datum({ startAngle: region4StartAngle, endAngle: region4EndAngle })
      .style('fill', 'purple')
      .attr('d', this.region4Arc);
  }

  updateArc(angleDegrees) {
    const tau = 2 * Math.PI;
    // Negative angle for counter-clockwise
    const newAngle = -(angleDegrees / 360) * tau;

    this.foreground.transition().duration(750).attrTween('d', this.arcTween(newAngle));

    this.outerForeground.transition().duration(750).attrTween('d', this.outerArcTween(newAngle));
  }

  arcTween = (newAngle) => {
    return (d) => {
      const interpolate = d3.interpolate(d.endAngle, newAngle);
      return (t) => {
        d.endAngle = interpolate(t);
        return this.arc(d);
      };
    };
  };

  outerArcTween = (newAngle) => {
    return (d) => {
      const interpolate = d3.interpolate(d.endAngle, newAngle);
      return (t) => {
        d.endAngle = interpolate(t);
        return this.outerArc(d);
      };
    };
  };

  render() {
    return <svg height={300} width={300} ref={this.svgRef} className={styles.svgElevation} />;
  }
}
