import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './FlightTracker.module.css';
import { isEqual } from 'lodash';
import * as d3 from 'd3';
import CoquimboURL from './Maps/Coquimbo.geojson';
import ValparaisoURL from './Maps/Valparaiso.geojson';
import AtacamaURL from './Maps/Atacama.geojson';
import { ReactComponent as Map200 } from './Maps/Map200.svg';
import { ReactComponent as Map160 } from './Maps/Map160.svg';
import { ReactComponent as Map100 } from './Maps/Map100.svg';

const LON_LAT_TELESCOPE = [-70.73709442008416, -30.240476801377167];

export default class MapFlightTracker extends Component {
  static propTypes = {
    /* Planes data with the distance to the center */
    planes: PropTypes.arrayOf(PropTypes.objectOf({
      id: PropTypes.string,
      latitude: PropTypes.number,
      longitude: PropTypes.number,
      altitude: PropTypes.number,
      track: PropTypes.number,
      distance: PropTypes.number,
      speed: PropTypes.number,
    })),
    /* Level of maps zoom*/
    zoom: PropTypes.string,
    /** Function to determine the status of the aircraft, from the distance to the radar */
    distanceStatus: PropTypes.func,
  };

  static defaultProps = {
    zoom: '200',
    planes: [],
    distanceStatus: () => {},
  };

  constructor(props) {
    super(props);
  }

  componentDidMount = () => {
    const { planes } = this.props;
    planes.map((airCraft) => {
      this.addPlanes(airCraft);
    });
  };

  componentDidUpdate = (prevProps) => {
    const { zoom, planes } = this.props;
    if (!isEqual(zoom, prevProps.zoom) || !isEqual(planes, prevProps.planes)) {
      planes.forEach((airCraft) => {
        this.addPlanes(airCraft);
      });
    }
  };

  /**
   * @param {string} latitude
   * @param {string} longitude
   * @param {string} zoom: the zoom that represent the actual map rendering
   * @returns the coordinates for the svg of the map according to its latitude and longitude
   */
  coordsPlaneInMap(latitude, longitude, zoom) {
    const width = 500;
    const height = 500;
    let scale = 13;
    if (zoom === '160') scale = 16.05;
    else if (zoom === '100') scale = 25.2;

    let projection = d3
      .geoMercator()
      .center(LON_LAT_TELESCOPE)
      .scale(width * scale) // scale; 13 - 200 km,  16.05 -160 km and 25.2 -100 km.
      .translate([width / 2, height / 2]);

    const position = projection([longitude, latitude]);
    return position;
  }

  /**
   * Function to generate the svg map with geojson entry (USE ONLY TO CHANGE THE SVGs)
   */
  getRegionSvg() {
    const width = 500;
    const height = 500;

    const projection = d3
      .geoMercator()
      .center(LON_LAT_TELESCOPE)
      .scale(width * 25.2) // scale; 13 - 200 km,  16.05 -160 km and 25.2 -100 km.
      .translate([width / 2, height / 2]);

    let geoGenerator = d3.geoPath().projection(projection);

    const url_coquimbo = CoquimboURL;
    const url_valparaiso = ValparaisoURL;
    const url_atacama = AtacamaURL;

    d3.json(url_coquimbo).then(function (Coquimbo) {
      d3.json(url_valparaiso).then(function (Valparaiso) {
        d3.json(url_atacama).then(function (Atacama) {
          d3.select('#telescopeDiv #Paths').selectAll('*').remove();

          const svg = d3
            .select('#telescopeDiv #Paths')
            .attr('width', `${100}%`)
            .attr('height', `${100}%`)
            .attr('min-width', '5%')
            .attr('viewBox', `0 0 ${width} ${height}`);

          Coquimbo.features.map((feature) => {
            svg
              .append('path')
              .attr('id', feature.properties['NOM_COM'])
              .attr('d', geoGenerator(feature))
              .style('fill', '#2e3e47')
              .style('stroke', '#4c606a');
          });

          Atacama.features.map((feature) => {
            svg
              .append('path')
              .attr('id', feature.properties['NOM_COM'])
              .attr('d', geoGenerator(feature))
              .style('fill', '#2e3e47')
              .style('stroke', '#4c606a');
          });

          Valparaiso.features.map((feature) => {
            svg
              .append('path')
              .attr('id', feature.properties['NOM_COM'])
              .attr('d', geoGenerator(feature))
              .style('fill', '#2e3e47')
              .style('stroke', '#4c606a');
          });

          // first zone : 200 km area.
          const mask = svg.append('mask').attr('id', 'Mask');
          mask.append('rect').attr('width', '100%').attr('height', '100%').attr('fill', 'white');
          mask
            .append('circle')
            .attr('cx', '50%')
            .attr('cy', '50%')
            .attr('r', '230.1434983635952') // this radius let encloses the last radius in map. For scales (222, 220).
            .attr('fill', 'black');

          svg
            .append('rect')
            .attr('mask', 'url(#Mask)')
            .classed(styles.rect, true)
            .attr('width', '100%')
            .attr('height', '104%');

          // second zone : 160 km area.
          svg
            .append('circle')
            .attr('id', 'middle_circle')
            .attr('cx', '50%')
            .attr('cy', '50%')
            .attr('r', '231.0125678417318')
            .attr('fill', 'none');

          // third zone : 100 km area.
          svg
            .append('circle')
            .attr('id', 'intern_circle')
            .attr('cx', '50%')
            .style('opacity', opacity)

            .attr('stroke-width', '1')
            .attr('fill', 'none');

          // this circle depends on external circle.
          svg
            .append('circle')
            .attr('id', 'external_circle')
            .attr('cx', '50%')
            .attr('cy', '50%')
            .attr('r', '230.1434983635952')
            .attr('fill', '#bcd8e2')
            .style('opacity', '10%');
        });
      });
    });
  }

  /**
   * Function to draw an aircraft on the map
   * @param {string} cordx: positon on the map
   * @param {string} cordy: positon on the map
   * @param {number} id: plane id
   */
  addPlanes(airCraft) {
    const { zoom } = this.props;
    const { id, distance, latitude, longitude, track } = airCraft;
    const scale = 0.75; //The Planes size

    /* Planes out of zoom */
    if (zoom === '160' && distance > 160) return;
    else if (zoom === '100' && distance > 100) return;

    const [cordx, cordy] = this.coordsPlaneInMap(latitude, longitude, this.props.zoom);

    /* Define plane's color by zone */
    let color = '#bcd8e2',
      opacity = '0.33';
    const status = this.props.distanceStatus(distance);
    if (status !== 'running') {
      if (status === 'warning') {
        opacity = '0.66';
      }
      opacity = status === 'warning' ? '0.66' : '1';
    }

    /* Path plane */
    const svg = d3.select('#mapTelescope');
    const pathBorderPlane =
      'm8.59.66l4.06,9.97,4.15,10.19h-1.16l-6.89-6.1-.17-.15-.17.15-6.89,6.1H.37l4.15-10.19L8.59.66m0-.66l-4.29,10.54L0,21.08h1.63l6.96-6.17,6.96,6.17h1.63l-4.29-10.54L8.59,0h0Z';
    const pointsFillPlane = '.18 20.95 8.59 .33 16.98 20.95 15.54 20.95 8.59 14.74 1.55 20.98 .18 20.95';

    /* Color of circles if some plane is inside the radius*/
    if (distance < 100) {
      svg.select('#intern_circle').attr('class', styles.alertStroke);
    } else if (distance < 160) {
      svg.select('#middle_circle').attr('class', styles.warningStroke);
    }

    /* Remove the g airCraft previous.*/
    svg.select(`#id${id}`).remove();
    svg.select('point').remove();

    var tooltip = d3.select('#tooltip');

    /* Add plane in map part 1*/
    svg
      .append('g')
      .attr('id', `id${id}`)
      .append('g')
      .attr('id', `g${id}`)
      .append('polygon')
      .attr('id', `polyggon${id}`)
      .attr('points', pointsFillPlane)
      .attr('class', status === 'warning' ? styles.warningFill : (status === 'alert' ? styles.alertFill : styles.runningFill) )
      .style('opacity', opacity);

    svg
      .append('rect')
      .attr('id', `rect-id${id}`)
      .attr('x', `${cordx + 20}`)
      .attr('y', `${cordy - 20}`)
      .attr("width", '60px')
      .attr("height", '1.25em')
      .attr('class', styles.rect);

    svg
      .append('text')
      .attr('id', `text-id${id}`)
      .attr('x', `${cordx + 50}`)
      .attr('y', `${cordy - 10}`)
      .attr('font-size', '75%')
      .attr('alignment-baseline', 'middle')
      .attr('text-anchor', 'middle')
      .attr('class', styles.textPlane)
      .text(`${id}`);

    /* Add plane in map part 2*/
    svg
      .select(`#g${id}`)
      .append('path')
      .classed('pathPlane', true)
      .attr('d', pathBorderPlane)
      .attr('class', styles.pathPlane)
      .style('fill', color)
      .style('opacity', opacity)
      .style('stroke', 'none');

    // Get the size in pixels of svg
    const sizeSVG = svg.node().getBoundingClientRect().width,
      scaleToPixels = sizeSVG / 500; //get the value on pixels of the viewbox metric

    // Get plane size in pixels (path element)
    const sizePlane = svg.select(`#polyggon${id}`).node().getBoundingClientRect(),
      heightPlane = sizePlane.height / scaleToPixels,
      widthPlane = sizePlane.width / scaleToPixels;

    // Plane positioning on map according of his coords, and his size
    svg
      .select(`#id${id}`)
      .attr(
        'transform',
        `translate(${cordx - (widthPlane * scale) / 2}, ${cordy - (heightPlane * scale) / 2}) scale(${scale}) `,
      );

    // Draw the plane line direction
    svg
      .select(`#g${id}`)
      .append('line')
      .attr('x1', `${widthPlane / 2}`)
      .attr('y1', '0')
      .attr('x2', `${widthPlane / 2}`)
      .attr('y2', `${-widthPlane * 1.5}`)
      .attr('stroke-dasharray', '9, 1.5')
      .style('stroke', 'white')
      .style('stroke-width', '1');

    // Get the height of plane with the line
    const heightTotalPlane = svg.select(`#g${id}`).node().getBoundingClientRect().height / scaleToPixels;

    // Set the rotation of plane considering his center to origin
    svg
      .select(`#g${id}`)
      .style('transform-box', 'fill-box')
      .style('transform-origin', `center ${heightTotalPlane / scale - heightPlane / 2}px`)
      .style('rotate', `${track}deg`);
  }

  /**
   * Function to select the svg map according to zoom.
   * @param {*} zoom
   * @returns component svg
   */
  renderMap(zoom) {
    if (zoom === '200') return <Map200 id="mapTelescope"></Map200>;
    if (zoom === '160') return <Map160 id="mapTelescope"></Map160>;
    return <Map100 id="mapTelescope"></Map100>;
  }

  render() {
    const { zoom } = this.props;

    return (
      <>
        <div className={styles.divMap}>{this.renderMap(zoom)}</div>
      </>
    );
  }
}
