/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed by Inria Chile and the Telescope and Site Software team.

Developed for the Vera C. Rubin Observatory Telescope and Site Systems.

This program is free software: you can redistribute it and/or modify it under 
the terms of the GNU General Public License as published by the Free Software 
Foundation, either version 3 of the License, or at your option) any later version.

This program is distributed in the hope that it will be useful,but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR 
 A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with 
this program. If not, see <http://www.gnu.org/licenses/>.
*/

import React, { Component, memo } from 'react';
import PropTypes from 'prop-types';
// import isEqual from 'lodash/isEqual';
import { uniqueId } from 'lodash';
import styles from './SkyMap.module.css';
import Select from 'components/GeneralPurpose/Select/Select';
import CircleIcon from 'components/icons/CircleIcon/CircleIcon';
import PlusIcon from 'components/icons/PlusIcon/PlusIcon';
import { loadScript } from 'Utils';

const STYLES = {
  lineStyle: {
    stroke: 'white',
    fill: 'rgba(255, 255, 255, 0.1)',
    width: 3,
  },
  lineTargetStyle: {
    stroke: 'white',
    fill: 'none',
    width: 1,
  },
  textStyle: {
    fill: 'white',
    font: 'bold 8px Helvetica, Arial, sans-serif',
    align: 'center',
    baseline: 'middle',
  },
  pointStyle: {
    stroke: '#1ecfe8',
    width: 1,
    fill: 'rgba(0, 0, 0, 0.0)',
  },
  pointTextStyle: {
    fill: '#1ecfe8',
    font: 'bold 7.5px Helvetica, Arial, sans-serif',
    align: 'center',
    baseline: 'middle',
  },
};

class SkyMap extends Component {
  static propTypes = {
    /** Dec pointing position of objetive */
    pointingDecl: PropTypes.number,
    /** RA pointing position of objetive */
    pointingRa: PropTypes.number,
    /** Targets, an array with ra and dec coordinates */
    targets: PropTypes.array,
    /** Dark zones, array with the coordinates to draw the polygons */
    darkZones: PropTypes.array,
  };

  static defaultProps = {
    pointingDecl: 0,
    pointingRa: 0,
    targets: [],
    darkZones: [],
  };

  constructor(props) {
    super(props);
    this.Celestial = null;
    this.celestialWaitTimeout = null;
    this.mapId = uniqueId('skymap-');
    this.state = {
      //Config from https://github.com/ofrohn/d3-celestial
      config: {
        width: 0,
        projection: 'aitoff',
        transform: 'equatorial',
        center: null,
        adaptable: true,
        interactive: true,
        form: false,
        location: false,
        controls: false,
        container: this.mapId,
        datapath: '../SkyMap/Data/',
        // STARS
        stars: {
          show: true, // Show stars
          limit: 5, // Show only stars brighter than limit magnitude
          colors: true, // Show stars in spectral colors, if not use "color"
          style: { fill: '#ffffff', opacity: 1 }, // Default style for stars
          names: false, // Show star names (Bayer, Flamsteed, Variable star, Gliese, whichever applies first)
          proper: false, // Show proper name (if present)
          desig: false, // Show all names, including Draper and Hipparcos
          namelimit: 2.5, // Show only names for stars brighter than namelimit
          namestyle: {
            fill: '#ddddbb',
            font: "11px Georgia, Times, 'Times Roman', serif",
            align: 'left',
            baseline: 'top',
          },
          propernamestyle: {
            fill: '#ddddbb',
            font: "11px Georgia, Times, 'Times Roman', serif",
            align: 'right',
            baseline: 'bottom',
          },
          propernamelimit: 1.5, // Show proper names for stars brighter than propernamelimit
          size: 7, // Maximum size (radius) of star circle in pixels
          exponent: -0.4, // Scale exponent for star size, larger = more linear
          data: 'stars.6.json', // Data source for stellar data
          //data: 'stars.8.json' // Alternative deeper data source for stellar data
        },
        planets: {
          show: true,
          which: ['sol', 'ter', 'lun'],
          symbolType: 'disk',
          names: true,
        },
        // DEEP SKY OBJECTS
        dsos: {
          show: false, // Show Deep Space Objects
          limit: 6, // Show only DSOs brighter than limit magnitude
          names: false, // Show DSO names
          desig: true, // Show short DSO names
          namelimit: 4, // Show only names for DSOs brighter than namelimit
          namestyle: { fill: '#cccccc', font: '11px Helvetica, Arial, serif', align: 'left', baseline: 'top' },
          size: null, // Optional seperate scale size for DSOs, null = stars.size
          exponent: 1.4, // Scale exponent for DSO size, larger = more non-linear
          data: 'dsos.bright.json', // Data source for DSOs
          //data: 'dsos.6.json'  // Alternative broader data source for DSOs
          //data: 'dsos.14.json' // Alternative deeper data source for DSOs
          symbols: {
            //DSO symbol styles
            gg: { shape: 'circle', fill: '#ff0000' }, // Galaxy cluster
            g: { shape: 'ellipse', fill: '#ff0000' }, // Generic galaxy
            s: { shape: 'ellipse', fill: '#ff0000' }, // Spiral galaxy
            s0: { shape: 'ellipse', fill: '#ff0000' }, // Lenticular galaxy
            sd: { shape: 'ellipse', fill: '#ff0000' }, // Dwarf galaxy
            e: { shape: 'ellipse', fill: '#ff0000' }, // Elliptical galaxy
            i: { shape: 'ellipse', fill: '#ff0000' }, // Irregular galaxy
            oc: { shape: 'circle', fill: '#ffcc00', stroke: '#ffcc00', width: 1.5 }, // Open cluster
            gc: { shape: 'circle', fill: '#ff9900' }, // Globular cluster
            en: { shape: 'square', fill: '#ff00cc' }, // Emission nebula
            bn: { shape: 'square', fill: '#ff00cc', stroke: '#ff00cc', width: 2 }, // Generic bright nebula
            sfr: { shape: 'square', fill: '#cc00ff', stroke: '#cc00ff', width: 2 }, // Star forming region
            rn: { shape: 'square', fill: '#00ooff' }, // Reflection nebula
            pn: { shape: 'diamond', fill: '#00cccc' }, // Planetary nebula
            snr: { shape: 'diamond', fill: '#ff00cc' }, // Supernova remnant
            dn: { shape: 'square', fill: '#999999', stroke: '#999999', width: 2 }, // Dark nebula grey
            pos: { shape: 'marker', fill: '#cccccc', stroke: '#cccccc', width: 1.5 }, // Generic marker
          },
        },
        // CONSTELLATIONS
        constellations: {
          show: false, // Show constellations
          names: false, // Show constellation names
          desig: false, // Show short constellation names (3 letter designations)
          namestyle: {
            fill: '#cccc99',
            align: 'center',
            baseline: 'middle',
            font: [
              '14px Helvetica, Arial, sans-serif', // Style for constellations
              '12px Helvetica, Arial, sans-serif', // Different fonts for diff.
              '11px Helvetica, Arial, sans-serif',
            ],
          }, // ranked constellations
          lines: false, // Show constellation lines, style below
          linestyle: { stroke: '#cccccc', width: 1, opacity: 0.6 },
          bounds: false, // Show constellation boundaries, style below
          boundstyle: { stroke: '#cccc00', width: 0.5, opacity: 0.8, dash: [2, 4] },
        },
        // MILKY WAY
        mw: {
          show: true,
          data: 'mw.json',
          style: { fill: '#ffffff', opacity: 0.15 },
        },
        // LINES
        lines: {
          graticule: {
            show: true,
            stroke: '#cccccc',
            width: 0.6,
            opacity: 0.8,
            // grid values: "outline", "center", or [lat,...] specific position
            lon: {
              pos: [''],
              fill: '#eee',
              font: '10px Helvetica, Arial, sans-serif',
            },
            // grid values: "outline", "center", or [lon,...] specific position
            lat: {
              pos: [''],
              fill: '#eee',
              font: '10px Helvetica, Arial, sans-serif',
            },
          },
          equatorial: { show: true, stroke: '#aaaaaa', width: 1.3, opacity: 0.7 },
        },
        // BACKGROUND
        background: {
          fill: '#000000', // Area fill
          opacity: 1,
          stroke: '#000000', // Outline
          width: 1.5,
        },
        // HORIZON
        horizon: {
          //Show horizon marker, if location is set and map projection is all-sky
          show: false,
          stroke: '#000099', // Line
          width: 1.0,
          fill: '#000000', // Area below horizon
          opacity: 0.5,
        },
      },
    };
  }

  /**
   * Function to change the transformation to view the skymap
   * @param {*} transformUpdated : the new transform get from select input
   */
  actConfig = (transformUpdated) => {
    this.setState((prevState) => ({
      config: { ...prevState.config, transform: transformUpdated },
    }));
  };

  componentDidUpdate = (prevProps, prevState) => {
    const { targets } = this.props;
    const { config } = this.state;

    if (prevProps.targets !== targets && targets && targets.length > 0 /* && this.Celestial */) {
      if (!this.celestialWaitTimeout) {
        console.log('Updating targets in 5 secs...');
        setTimeout(() => {
          console.log('Calling delayed adding targets...');
          this.addObjects();
          this.Celestial.reload(config);
        }, 5000);
      }
    }

    if (prevState.config.transform !== config.transform && this.Celestial) {
      console.log('Updating transform...');
      // this.Celestial.display(config);
      this.Celestial.reload(config);
    }
  };

  componentDidMount = async () => {
    const { config } = this.state;
    try {
      await loadScript('d3.v3.min.js');
      await loadScript('celestial.min.js');
      await loadScript('d3.geo.projection.v0.min.js');

      if (window.Celestial) {
        this.Celestial = window.Celestial;
        this.Celestial.display(config);
      }
    } catch (err) {
      console.error('Script loading failed:', err);
    }
  };

  componentWillUnmount = () => {
    // Clean up Celestial container
    if (this.Celestial) {
      this.Celestial.container.selectAll('*').remove();
    }
  };

  addObjects = () => {
    const { pointingDecl, pointingRa, targets, darkZones } = this.props;
    const { config } = this.state;
    const { lineStyle, lineTargetStyle, textStyle, pointStyle, pointTextStyle } = STYLES;
    const Celestial = this.Celestial;

    // Generate dic to draw celestial targets as crosses, with a text with the target id next to it.
    const jsonTargets = {
      type: 'FeatureCollection',
      features: targets
        .map(({ id, dec, ra }) => {
          if (isNaN(dec) || isNaN(ra)) return;

          const coords1 = [
            [ra, dec - 1],
            [ra, dec + 1],
          ];
          const coords2 = [
            [ra - 1, dec],
            [ra + 1, dec],
          ];

          return {
            type: 'Feature',
            id,
            properties: {
              n: id,
              // As features are cross shaped, the loc is defined with a shift to position the text next to the center of the cross.
              loc: [ra - 0.5, dec - 0.5],
              style: {},
            },
            geometry: {
              type: 'MultiLineString',
              coordinates: [coords1, coords2],
            },
          };
        })
        .filter((feature) => feature !== undefined),
    };

    // Generate dic to draw dark zones as polygons
    const jsonPolygons = {
      type: 'FeatureCollection',
      features: darkZones.map(({ coordinates }, index) => ({
        type: 'Feature',
        id: `dark-zone-${index}`,
        properties: {
          n: `Dark Zone ${index + 1}`,
          loc: coordinates[0],
          style: {},
        },
        geometry: {
          type: 'Polygon',
          coordinates: [coordinates],
        },
      })),
    };

    // Generate dic to draw the pointing as a point, with a size depending on the magnitude (dim property)
    const jsonPointing = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          id: 'pointing',
          properties: {
            name: 'Pointing',
            mag: 10,
            dim: 250,
          },
          geometry: {
            type: 'Point',
            coordinates: [pointingRa, pointingDecl],
          },
        },
      ],
    };

    //Add the dark zones as polygons
    Celestial.add({
      type: 'line',
      callback: (error) => {
        if (error) return console.warn(error);

        var objects = Celestial.getData(jsonPolygons, config.transform);
        Celestial.container
          .selectAll('.darkZones')
          .data(objects.features)
          .enter()
          .append('path')
          .attr('class', 'darkZone');
        Celestial.redraw();
      },
      redraw: () => {
        Celestial.container.selectAll('.darkZone').each(function (d) {
          // Draw on canvas
          Celestial.setStyle(lineStyle); // Set object styles
          Celestial.map(d); // Project objects on map
          Celestial.context.fill(); // Fill the object path with the prevoiusly set fill color
          Celestial.context.stroke(); // Draw a line along the path with the prevoiusly set stroke color and line width

          if (Celestial.clip(d.properties.loc)) {
            let pt = Celestial.getPoint(d.properties.loc, config.transform);
            pt = Celestial.mapProjection(pt);

            // Draw text on canvas
            Celestial.setTextStyle(textStyle);
            Celestial.context.fillText(d.properties.n, pt[0], pt[1]);
          }
        });
      },
    });

    //Add the targets
    Celestial.add({
      type: 'line',
      callback: (error) => {
        if (error) return console.warn(error);

        var objects = Celestial.getData(jsonTargets, config.transform);
        Celestial.container.selectAll('.targets').data(objects.features).enter().append('path').attr('class', 'target');
        Celestial.redraw();
      },
      redraw: () => {
        Celestial.container.selectAll('.target').each(function (d) {
          // Draw on canvas
          Celestial.setStyle(lineTargetStyle); // Set object styles
          Celestial.map(d); // Project objects on map
          Celestial.context.fill(); // Fill the object path with the prevoiusly set fill color
          Celestial.context.stroke(); // Draw a line along the path with the prevoiusly set stroke color and line width

          if (Celestial.clip(d.properties.loc)) {
            let pt = Celestial.getPoint(d.properties.loc, config.transform);
            pt = Celestial.mapProjection(pt);

            // Draw text on canvas
            Celestial.setTextStyle(textStyle);
            Celestial.context.fillText(d.properties.n, pt[0], pt[1]);
          }
        });
      },
    });

    //Add the pointing
    Celestial.add({
      type: 'line',
      callback: function (error) {
        if (error) return console.warn(error);

        var objects = Celestial.getData(jsonPointing, config.transform);
        Celestial.container
          .selectAll('.pointings')
          .data(objects.features)
          .enter()
          .append('path')
          .attr('class', 'pointing');
        Celestial.redraw();
      },
      redraw: function () {
        Celestial.container.selectAll('.pointing').each(function (d) {
          if (Celestial.clip(d.geometry.coordinates)) {
            var pt = Celestial.mapProjection(d.geometry.coordinates);
            var r = Math.pow(parseInt(d.properties.dim) * 0.25, 0.5);

            // Draw on canvas
            Celestial.setStyle(pointStyle); // Set object styles
            Celestial.context.beginPath(); // Start the drawing path
            Celestial.context.arc(pt[0], pt[1], r, 0, 2 * Math.PI); // Thats a circle in html5 canvas
            Celestial.context.closePath(); // Finish the drawing path
            Celestial.context.fill(); // Fill the object path with the prevoiusly set fill color
            Celestial.context.stroke(); // Draw a line along the path with the prevoiusly set stroke color and line width

            // Draw text on canvas
            Celestial.setTextStyle(pointTextStyle);
            Celestial.context.fillText('POINTING', pt[0], pt[1] - 15);
          }
        });
      },
    });
  };

  render() {
    const selectOptions = ['equatorial', 'ecliptic', 'galactic', 'supergalactic'];
    return (
      <div className={styles.container}>
        <div className={styles.headerDiv}>
          <div className={styles.legend}>
            <div>
              <CircleIcon className={styles.circleIcon} />
              <span>Pointing</span>
            </div>
            <div>
              <PlusIcon className={styles.plusIcon} />
              <span>Targets</span>
            </div>
          </div>
          <div className={styles.selectSystemCoord}>
            <Select options={selectOptions} onChange={(e) => this.actConfig(e.value)} value={'equatorial'}></Select>
          </div>
        </div>
        <div id="map-container">
          <div id={this.mapId}></div>
        </div>
      </div>
    );
  }
}

export default memo(SkyMap);
