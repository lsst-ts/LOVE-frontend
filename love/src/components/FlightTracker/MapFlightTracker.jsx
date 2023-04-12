import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './FlightTracker.module.css';
import * as d3 from 'd3';
import CoquimboURL from './Maps/Coquimbo.geojson';
import ValparaisoURL from './Maps/Valparaiso.geojson';
import AtacamaURL from './Maps/Atacama.geojson';
import { ReactComponent as Map200 } from './Maps/Map200.svg';
import { ReactComponent as Map160 } from './Maps/Map160.svg';
import { ReactComponent as Map100 } from './Maps/Map100.svg';

export default class MapFlightTracker extends Component {
  static propTypes = {
    /* Planes data with the distance to the center */
    planes: PropTypes.object,
    /* Level of maps zoom*/
    zoom: PropTypes.string,
  };

  constructor(props) {
    super(props);
  }

  componentDidMount = () => {
    this.insertTooltip();
    this.addTooltipSerena();
  };

  componentDidUpdate = (prevProps) => {
    const { zoom } = this.props;
    if (zoom !== prevProps.zoom) {
      this.insertTooltip();
      const { planes } = this.props;
      planes.map((airCraft) => {
        this.addPlanes(airCraft);
      });
    }
    if (this.props.planes !== prevProps.planes) {
      const { planes } = this.props;
      planes.map((airCraft) => {
        this.addPlanes(airCraft);
      });
    }
    this.addTooltipSerena();
  };

  /**
   * @param {string} latitude
   * @param {string} longitude
   * @param {string} zoom: the zoom that represent the actual map rendering
   * @returns the coordinates for the svg of the map according to its latitude and longitude
   */
  cordsPlaneInMap(latitude, longitude, zoom) {
    const width = 500;
    const height = 500;
    let scale = 13;
    if (zoom === '160') scale = 16.05;
    else if (zoom === '100') scale = 25.2;

    let projection = d3
      .geoMercator()
      .center([-70.73709442008416, -30.240476801377167])
      .scale(width * scale) // scale; 13 - 200 km,  16.05 -160 km and 25.2 -100 km.
      .translate([width / 2, height / 2]);

    return projection([latitude, longitude]);
  }

  /**
   * Function to generate the svg map with geojson entry (USE ONLY TO CHANGE THE SVGs)
   */
  getRegionSvg() {
    const width = 500;
    const height = 500;
    const telescopeCoords = [-70.73709442008416, -30.240476801377167];

    const projection = d3
      .geoMercator()
      .center(telescopeCoords)
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
          // const long_lat_1 = [-69.72640645677438, -28.671508190008392,];
          // const coords_1 = projection(long_lat_1)
          // console.log("rad1:",coords_1)
          // console.log(Math.sqrt((coords_1[0]-250)**2 + (coords_1[1]-250)**2))
          //returns [364.65891235520394, 60.57129669433607]
          // radius_1 = 234.3880562607948 with Euclidian distance.

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
          // const long_lat_2 = [-69.80730130824585, -29.056574125505087]
          // const coords_2 = projection(long_lat_2)
          // console.log(coords_2) //returns [357.00061695433305, 110.5181751002815], [382.104607855159, 74.27436233534718]
          // console.log(Math.sqrt((coords_2[0]-250)**2 + (coords_2[1]-250)**2))
          // // radius2 = 187.11298329859903, 231.0125678417318 with Euclidian distance.

          svg
            .append('circle')
            .attr('id', 'middle_circle')
            .attr('cx', '50%')
            .attr('cy', '50%')
            .attr('r', '231.0125678417318')
            // .attr('stroke', '#bcd8e2')
            // .attr('stroke-width', '1')
            .attr('fill', 'none');

          // third zone : 100 km area.
          // const long_lat_3 = [ -70.45824123940402, -31.108020979254803 ];
          // const coords_3 = projection(long_lat_3);
          // console.log(coords_3); //returns [341.3675737065496, 190.66005738475087], [362.80381215308626, 173.21876315578902], [427.11252749269624, 120.89488046890165]
          // console.log(Math.sqrt((coords_3[0]-250)**2 + (coords_3[1]-250)**2))
          // radius3 = 118.72482058439441, 146.57949002919514, 230.1434983635952 with Euclidian distance.

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

          // telescope icon.
          const pathTelescope =
            'm.12,19.45v1.14h.31v1.66s.62.01,1.58.03v20.68h17.78c1.55,3.17,7.66,12.94,9.69,16.18h-.02l.5.87.5.87.5-.87.5-.87h-.02c2.03-3.23,8.14-13.01,9.69-16.18h21.78v-9.33l-18.26-11.01-17.45-.07v-.31c.11,0,.17,0,.17,0v-4.5h1.23l2.2-.32v-2.74l-3.03-10.21-.74-.55-.19-.6-3.06-2.08h-.42l-1.6-1.11h-5.62l-.02.55H7.8l-.78-.55H1.12l.02.46h.55v.55l-1.57.09';

          svg
            .append('g')
            .attr('id', 'telescopeIconG')
            // .attr('transform', `translate(${width / 2}, ${height / 2})  scale(0.5)`)
            .append('path')
            .attr('id', 'telescopeIconP')
            .attr('d', pathTelescope)
            .style('fill', '#bcd8e2')
            .style('stroke', '#bcd8e2');

          const sizeSVG = svg.node().getBoundingClientRect().width,
            scaleToPixels = sizeSVG / 500;

          const sizeTel = svg.select(`#telescopeIconG`).node().getBoundingClientRect(),
            heightTel = sizeTel.height / scaleToPixels,
            widthTel = sizeTel.width / scaleToPixels;

          const scale = 0.33;
          svg
            .select('#telescopeIconG')
            .attr(
              'transform',
              `translate(${width / 2 - (widthTel * scale) / 2}, ${height / 2 - heightTel * scale})  scale(${scale})`,
            );

          // La Serena.
          const long_lat_serena = [-71.25715298618236, -29.89192170340795];
          const coords_serena = projection(long_lat_serena);

          svg
            .append('circle')
            .attr('id', 'circle_serena')
            .attr('cx', `${coords_serena[0]}`)
            .attr('cy', `${coords_serena[1]}`)
            .attr('r', '4')
            .classed(styles.laSerena, true);

          const coordsTel = projection(telescopeCoords);

          // svg
          //   .append('circle')
          //   .attr('id', 'circle_serena')
          //   .attr('cx', `${coordsTel[0]}`)
          //   .attr('cy', `${coordsTel[1]}`)
          //   .attr('r', '5')
          //   .classed(styles.laSerena, true);
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
    const { id, distance, loc } = airCraft;
    const scale = 0.75; //The Planes size

    /* Planes out of zoom */
    if (zoom === '160' && distance[0] > 160) return;
    else if (zoom === '100' && distance[0] > 100) return;

    const [longitude, latitude] = loc;
    const [cordx, cordy] = this.cordsPlaneInMap(latitude, longitude, this.props.zoom);

    /* Define plane's color by zone */
    let color = '#bcd8e2',
      opacity = '0.33';
    const status = distance[1];
    if (status !== 'running') {
      opacity = status === 'warning' ? '0.66' : '1';
    }

    var rotateRandom = Math.floor(Math.random() * 360);
    /* Path plane */
    const svg = d3.select('#mapTelescope');
    const pathBorderPlane =
      'm8.59.66l4.06,9.97,4.15,10.19h-1.16l-6.89-6.1-.17-.15-.17.15-6.89,6.1H.37l4.15-10.19L8.59.66m0-.66l-4.29,10.54L0,21.08h1.63l6.96-6.17,6.96,6.17h1.63l-4.29-10.54L8.59,0h0Z';
    const pointsFillPlane = '.18 20.95 8.59 .33 16.98 20.95 15.54 20.95 8.59 14.74 1.55 20.98 .18 20.95';

    /* Color of circles if some plane is inside the radius*/
    if (distance[0] < 100) {
      svg.select('#intern_circle').style('stroke', '#df5601');
    } else if (distance[0] < 160) {
      svg.select('#middle_circle').style('stroke', '#d9cd03');
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
      .style('fill', color)
      .style('opacity', opacity)
      .on('mouseover', function () {
        return tooltip
          .style('visibility', 'visible')
          .attr('transform', `translate(${cordx + 10}, ${cordy})`) //change tootlip position according to the plane
          .select('#textTool') //change tootlip text according to the plane id
          .text(`${id}`);
      })
      .on('mouseout', function () {
        return tooltip.style('visibility', 'hidden');
      });

    /* Add plane in map part 2*/
    svg
      .select(`#g${id}`)
      .append('path')
      .classed('pathPlane', true)
      .attr('d', pathBorderPlane)
      .attr('class', styles.pathPlane)
      .style('fill', color)
      .style('opacity', opacity)
      .style('opacity', '100%')
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
      .style('rotate', `${rotateRandom}deg`);
  }

  /**
   * Function to insert the tooltip to use by planes
   */
  insertTooltip() {
    const map = d3.select('#mapTelescope');
    const [width, height] = [4, 3];
    map
      .append('g')
      .attr('id', 'tooltip')
      .style('visibility', 'hidden')
      .append('rect')
      .attr('width', `${width}em`)
      .attr('height', `${height}%`)
      .attr('fill', '#bcd8e2');

    map
      .select('#tooltip')
      .append('text')
      .attr('id', 'textTool')
      .attr('x', `${width / 1.5}em`)
      .attr('y', `${height / 2}%`)
      .attr('font-size', '75%')
      .attr('alignment-baseline', 'middle')
      .attr('text-anchor', 'middle');
  }

  /**
   * Add the tootip to the point associated to La Serena
   */
  addTooltipSerena() {
    const svg = d3.select('#mapTelescope');
    var tooltip = d3.select('#tooltip');
    const long_lat_serena = [-71.25715298618236, -29.89192170340795];
    const coords_serena = this.cordsPlaneInMap(long_lat_serena[0], long_lat_serena[1], this.props.zoom);
    svg
      .select('#circle_serena')
      .on('mouseover', function () {
        return tooltip
          .style('visibility', 'visible')
          .attr('transform', `translate(${coords_serena[0] + 10}, ${coords_serena[1]})`) //change tootlip position according to the plane
          .select('#textTool') //change tootlip text according to the plane id
          .text('La Serena');
      })
      .on('mouseout', function () {
        return tooltip.style('visibility', 'hidden');
      });
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

        {/* This is for generate the static map */}
        {/* <div>{this.getRegionSvg()}</div> */}
        {/* <div id="telescopeDiv">
          <svg id="Paths" className={styles.CoquimboSvg}></svg>
        </div> */}
      </>
    );
  }
}
