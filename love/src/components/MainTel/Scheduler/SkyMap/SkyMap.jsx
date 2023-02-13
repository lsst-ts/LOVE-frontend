import React, { Component } from 'react';
import PropTypes from 'prop-types';
import celestial from 'd3-celestial';
import styles from './SkyMap.module.css';
import Select from 'components/GeneralPurpose/Select/Select';

const Celestial = celestial.Celestial();
window.Celestial = Celestial;

export default class SkyMap extends Component {
  constructor(props) {
    super(props);

    this.state = {
      config: {
        width: 0,
        projection: 'aitoff',
        transform: 'equatorial',
        center: [-65, 0], // TODO : Fix it to const ID
        adaptable: true,
        interactive: true,
        form: false,
        location: false,
        controls: false,
        container: 'map',
        datapath: '../skyMap/',
        // STARS
        stars: {
          show: true,
          colors: true,
          names: false,
          style: { fill: '#000', opacity: 1 },
          limit: 6,
          size: 5,
          // data: "stars.6.json"
        },
        // DEEP SKY OBJECTS
        dsos: {
          names: true,
          show: true,
          size: null,
          exponent: 1.4,
          symbols: {
            //DSO symbol styles, 'stroke'-parameter present = outline
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
          show: true, // Show constellations
          names: true, // Show constellation names
          desig: true, // Show short constellation names (3 letter designations)
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
          lines: true, // Show constellation lines, style below
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
          fill: '#3e3d40', // Area fill
          opacity: 1,
          stroke: '#3e3d40', // Outline
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

  static propTypes = {
    /** MT azimuth actual position telemetry */
    az: PropTypes.number,
    /** MT elevation actual position telemetry */
    el: PropTypes.number,
  };

  jsonLine = {
    type: 'FeatureCollection',
    // this is an array, add as many objects as you want
    features: [
      {
        type: 'Feature',
        id: 'SummerTriangle',
        properties: {
          // Name
          n: 'Summer Triangle',
          // Location of name text on the map
          loc: [-67.5, 52],
        },
        geometry: {
          // the line object as an array of point coordinates,
          // always as [ra -180..180 degrees, dec -90..90 degrees]
          type: 'MultiLineString',
          coordinates: [
            [
              [-80.7653, 38.7837],
              [-62.3042, 8.8683],
              [-49.642, 45.2803],
              [-80.7653, 38.7837],
            ],
          ],
        },
      },
    ],
  };

  lineStyle = {
    stroke: '#f00',
    fill: 'rgba(255, 204, 204, 0.4)',
    width: 3,
  };

  textStyle = {
    fill: '#f00',
    font: 'bold 15px Helvetica, Arial, sans-serif',
    align: 'center',
    baseline: 'bottom',
  };

  actConfig = (transformUpdated) => {
    const configUpdated = {
      width: 0,
      projection: 'aitoff',
      transform: `${transformUpdated}`,
      center: [-65, 0], // TODO : Fix it to const ID
      adaptable: true,
      interactive: true,
      form: false,
      location: false,
      controls: false,
      container: 'map',
      datapath: '../skyMap/',
      // STARS
      stars: {
        show: false,
        colors: true,
        names: false,
        style: { fill: '#000', opacity: 1 },
        limit: 6,
        size: 5,
        // data: "stars.6.json"
      },
      // DEEP SKY OBJECTS
      dsos: {
        names: true,
        show: true,
        size: null,
        exponent: 1.4,
        symbols: {
          //DSO symbol styles, 'stroke'-parameter present = outline
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
        show: true, // Show constellations
        names: true, // Show constellation names
        desig: true, // Show short constellation names (3 letter designations)
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
        lines: true, // Show constellation lines, style below
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
        fill: '#3e3d40', // Area fill
        opacity: 1,
        stroke: '#3e3d40', // Outline
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
    };
    this.setState({ config: configUpdated });
  };

  componentDidUpdate = () => {
    Celestial.display(this.state.config);
  };

  componentDidMount = () => {
    const jsonLine = this.jsonLine,
      config = this.state.config,
      lineStyle = this.lineStyle,
      textStyle = this.textStyle;

    Celestial.add({
      type: 'line',
      callback: function (error, json) {
        if (error) return console.warn(error);
        // Load the geoJSON file and transform to correct coordinate system, if necessary
        var asterism = Celestial.getData(jsonLine, config.transform);

        // Add to celestial objects container in d3
        Celestial.container.selectAll('.asterisms').data(asterism.features).enter().append('path').attr('class', 'ast');
        // Trigger redraw to display changes
        Celestial.redraw();
      },
      redraw: function () {
        // Select the added objects by class name as given previously
        Celestial.container.selectAll('.ast').each(function (d) {
          // Set line styles
          Celestial.setStyle(lineStyle);
          // Project objects on map
          Celestial.map(d);
          // draw on canvas
          Celestial.context.fill();
          Celestial.context.stroke();

          // If point is visible (this doesn't work automatically for points)
          if (Celestial.clip(d.properties.loc)) {
            // get point coordinates
            let pt = Celestial.mapProjection(d.properties.loc);
            // Set text styles
            Celestial.setTextStyle(textStyle);
            // and draw text on canvas
            Celestial.context.fillText(d.properties.n, pt[0], pt[1]);
          }
        });
      },
    });

    Celestial.display(config);
  };

  render() {
    const selectOptions = ['equatorial', 'ecliptic', 'galactic', 'supergalactic'];
    return (
      <div className={styles.container}>
        <br></br>
        <div className={styles.selectSystemCoord}>
          <Select
            options={selectOptions}
            onChange={(e) => {
              e.value ? this.actConfig(e?.value) : true;
            }}
            value={'equatorial'}
          ></Select>
        </div>
        <div id="map-container">
          <div id="map"></div>
        </div>
      </div>
    );
  }
}