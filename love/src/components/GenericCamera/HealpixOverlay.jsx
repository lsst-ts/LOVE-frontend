import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styles from './HealpixOverlay.module.css';
import { xy_sample, azel_sample } from './CameraUtils';
import { geoVoronoi } from 'd3-geo-voronoi';
import * as d3 from 'd3';

export default class HealpixOverlay extends PureComponent {
  constructor(props) {
    super(props);
    this.svgRef = React.createRef();
    this.state = {
      selectedCell: undefined,
    };
  }

  componentDidMount() {
    const props = this.props;
    const self = this;
    const points = {
      type: 'FeatureCollection',
      features:
        props.azelData?.map((data, index) => {
          return {
            type: 'Point',
            coordinates: data.azel,
            value: data.value ?? 0,
          };
        }) ?? [],
    };
    const v = geoVoronoi()(points);
    const projection = d3.geoOrthographic();
    projection.rotate([0, -90]);
    const path = d3.geoPath().projection(projection);
    let svg = d3.select(this.svgRef.current);
    // svg.append('path').attr('id', 'sphere').datum({ type: 'Sphere' }).attr('d', path);
    const filteredPolygons = v.polygons().features.filter((poly) => {
      return (poly?.properties?.site?.value ?? 0) !== 0;
    });
    const nodes = svg.append('g').attr('class', styles.polygons).selectAll('path').data(filteredPolygons);
    nodes
      .enter()
      .append('path')
      .attr('d', path)
      .attr('fill', function (d, i) {
        return props.baseColor ?? 'white';
      })
      .attr('fill-opacity', function (d, i) {
        return d?.properties?.site?.value ?? 0;
      })
      .attr('stroke', function (d, i) {
        const selectedCell = props.selectedCell;
        return selectedCell?.index === i && selectedCell?.layerName === props.name ? 'white' : 'none';
      })
      .on('click', (d, i) => {
        const value = d?.properties?.site?.value;
        props.onCellClick(props.name, value, i);
        self.redraw();
      });
    this.nodes = nodes;
    // d3.interval(function (elapsed) {
    //   projection.rotate([elapsed / 150, 0]);
    //   svg.selectAll('path').attr('d', path);
    // }, 50);
  }

  componentDidUpdate(prevState, prevProps){
    if(prevProps.selectedCell?.layerName !== this.props.selectedCell?.layerName)
      this.redraw();
  }

  redraw = () => {
    const self = this;
    const props = this.props;
    if (!self.nodes) return;
    self.nodes
      .enter()
      .selectAll('path')
      .attr('stroke', function (d, i) {
        const selectedCell = props.selectedCell;
        return selectedCell?.index === i && selectedCell?.layerName === props.name ? 'white' : 'none';
      })
      .attr('stroke-width', function (d, i) {
        const selectedCell = props.selectedCell;
        return selectedCell?.index === i && selectedCell?.layerName === props.name ? 3 : 0;
      });
  };

  render() {
    const { width, height } = this.props;
    return (
      <svg ref={this.svgRef} className={styles.svg} width={width} height={height} viewBox="0 0 500 500">
        {xy_sample.map((xy, i) => {
          return <circle key={i} cx={xy[0]} cy={xy[1]} r="3" stroke="black" strokeWidth="1" fill="red" />;
        })}
      </svg>
    );
  }
}

HealpixOverlay.propTypes = {
  /** Azimuth elevation data array, containing objects with the following keys:
   * azel: Az and El coordinates
   * value: Value for the coordinate
   */
  azelData: PropTypes.array,
  /** Base RGB color for each cell. Cell values will then modify the opacity of this color */
  baseColor: PropTypes.string,
  /** Function to be called when a cell is clicked */
  onCellClick: PropTypes.func,
};

HealpixOverlay.defaultProps = {
  azelData: [],
  baseColor: 'white',
  onCellClick: () => {},
};
