import React, { Component } from 'react';
import styles from './HealpixOverlay.module.css';
import { xy_sample, azel_sample } from './CameraUtils';
import { geoVoronoi } from 'd3-geo-voronoi';
import * as d3 from 'd3';

export default class HealpixOverlay extends Component {
  constructor(props) {
    super(props);
    this.svgRef = React.createRef();
  }

  componentDidMount() {
    const props = this.props;
    const points = {
      type: 'FeatureCollection',
      features:
        props.azelData?.map((data, index) => {
          return {
            type: 'Point',
            coordinates: data.azel,
            value: data.value ?? 0.5,
          };
        }) ?? [],
    };
    const v = geoVoronoi()(points);
    const projection = d3.geoOrthographic();
    projection.rotate([0, -90]);
    const path = d3.geoPath().projection(projection);
    let svg = d3.select(this.svgRef.current);
    // svg.append('path').attr('id', 'sphere').datum({ type: 'Sphere' }).attr('d', path);
    svg
      .append('g')
      .attr('class', styles.polygons)
      .selectAll('path')
      .data(v.polygons().features)
      .enter()
      .append('path')
      .attr('d', path)
      .attr('fill', function (d, i) {
        return props.baseColor ?? 'white';
      })
      .attr('opacity', function (d, i) {
        return d?.properties?.site?.value ?? 0;
      });
    // d3.interval(function (elapsed) {
    //   projection.rotate([elapsed / 150, 0]);
    //   svg.selectAll('path').attr('d', path);
    // }, 50);
  }

  render() {
    const { width, height } = this.props;

    return (
      <svg ref={this.svgRef} className={styles.svg} width={width} height={height} viewBox="0 0 500 500">
        {xy_sample.map((xy) => {
          return <circle cx={xy[0]} cy={xy[1]} r="3" stroke="black" strokeWidth="1" fill="red" />;
        })}
      </svg>
    );
  }
}
