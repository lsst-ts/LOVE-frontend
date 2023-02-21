import React, { Component } from 'react';
import PropTypes from 'prop-types';
import celestial from 'd3-celestial';
import styles from './SkyMap.module.css';
import Select from 'components/GeneralPurpose/Select/Select';
import CircleIcon from 'components/icons/CircleIcon/CircleIcon';
import PlusIcon from 'components/icons/PlusIcon/PlusIcon';

const Celestial = celestial.Celestial();
window.Celestial = Celestial;

export default class SkyMap extends Component {
  static propTypes = {
    /** Function to subscribe to streams to receive */
    subscribeToStreams: PropTypes.func,
    /** Pointing position of objetive */
    pointing: PropTypes.array,
    /** Targets */
    targets: PropTypes.array,
    /** Dark zones, with the coords to draw the polygons */
    darkZones: PropTypes.array,
  };

  static defaultProps = {
    subscribeToStreams: (value) => console.log(value),
    pointing: [-82.7653, 30.7837],
    targets: [{ id: 'actualTarget', position: [] }],
    darkZones: [],
  };

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
        datapath: '../SkyMap/Data/',
        // STARS
        stars: {
          show: true, // Show stars
          limit: 3, // Show only stars brighter than limit magnitude
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
          exponent: -0.58, // Scale exponent for star size, larger = more linear
          data: 'stars.6.json', // Data source for stellar data
          //data: 'stars.8.json' // Alternative deeper data source for stellar data
        },
        planets: {
          show: true,
          symbolType: 'disk',
        },
        // DEEP SKY OBJECTS
        dsos: {
          show: false, // Show Deep Space Objects
          limit: 6, // Show only DSOs brighter than limit magnitude
          names: true, // Show DSO names
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

  // Asterisms canvas style properties for lines, text and pointing
  lineStyle = {
    stroke: '#f00',
    fill: 'rgba(255, 204, 204, 0.4)',
    width: 3,
  };
  textStyle = {
    fill: '#f00',
    font: 'bold 15px Helvetica, Arial, sans-serif',
    align: 'center',
    baseline: 'middle',
  };
  pointStyle = {
    stroke: '#1ecfe8',
    width: 1,
    fill: 'rgba(0, 0, 0, 0.0)',
  };

  // JSON structure of the object to be displayed, in this case
  // the Summer Triangle between Vega, Deneb and Altair
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
          // the line object as an array of point coordinates
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
      {
        // target
        type: 'Feature',
        id: 'Target',
        properties: {
          // Name
          n: 'Target',
          // Location of name text on the map
          loc: [-69.5, 52],
        },
        geometry: {
          // the line object as an array of point coordinates
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

  //JSON with the pointing position
  jsonSnr = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        id: 'SomeDesignator',
        properties: {
          name: 'Some Name',
          mag: 10,
          dim: 250,
        },
        geometry: {
          type: 'Point',
          coordinates: this.props.pointing,
        },
      },
    ],
  };

  //targets features
  features = [];

  //JSON with the targets position
  jsonTargets = {};

  /**
   * Function to change the transformation to view the skymap
   * @param {*} transformUpdated : the new transform get from select input
   */
  actConfig = (transformUpdated) => {
    const changeTransform = (prevState) => {
      let { config } = prevState;
      config.transform = transformUpdated;
      return { config: config };
    };
    this.setState((prevState) => changeTransform(prevState));
  };

  componentDidUpdate = () => {
    const config = this.state.config;
    Celestial.display(config);
  };

  componentDidMount = () => {
    const config = this.state.config;
    this.addObjects(config);
    Celestial.display(config);
  };

  addObjects = (config) => {
    let jsonLine = this.jsonLine,
      jsonSnr = this.jsonSnr,
      jsonTargets = this.jsonTargets,
      lineStyle = this.lineStyle,
      textStyle = this.textStyle,
      pointStyle = this.pointStyle,
      features = this.features;

    this.props.targets.map((t) => {
      features.push({
        type: 'Feature',
        id: 'SomeDesignator',
        properties: {
          name: 'Some Name',
          mag: 10,
          dim: 250,
        },
        geometry: {
          type: 'Point',
          coordinates: t.loc,
        },
      });
    });

    jsonTargets = {
      type: 'FeatureCollection',
      features: features,
    };
    //Add the polygons
    Celestial.add({
      type: 'line',

      callback: (error, json) => {
        if (error) return console.warn(error);

        // Load the geoJSON file and transform to correct coordinate system, if necessary
        let jsonLineCopy = structuredClone(jsonLine);
        var asterism = Celestial.getData(jsonLineCopy, config.transform);

        // Add to celestial objects container in d3
        Celestial.container.selectAll('.asterisms').data(asterism.features).enter().append('path').attr('class', 'ast');
        // Trigger redraw to display changes
        Celestial.redraw();
      },
      redraw: () => {
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
            let pt = Celestial.getPoint(d.properties.loc, config.transform);
            pt = Celestial.mapProjection(pt);
            // Set text styles
            Celestial.setTextStyle(textStyle);
            // and draw text on canvas
            Celestial.context.fillText(d.properties.n, pt[0], pt[1]);
          }
        });
      },
    });

    //Add the pointing
    Celestial.add({
      type: 'line',

      callback: function (error, json) {
        if (error) return console.warn(error);
        // Load the geoJSON file and transform to correct coordinate system, if necessary
        let jsonSnrCopy = structuredClone(jsonSnr);
        var dsos = Celestial.getData(jsonSnrCopy, config.transform);
        // Add to celestiasl objects container in d3
        Celestial.container.selectAll('.snrs').data(dsos.features).enter().append('path').attr('class', 'snr');
        // Trigger redraw to display changes
        Celestial.redraw();
      },

      redraw: function () {
        // Select the added objects by class name as given previously
        Celestial.container.selectAll('.snr').each(function (d) {
          // If point is visible (this doesn't work automatically for points)
          if (Celestial.clip(d.geometry.coordinates)) {
            // get point coordinates
            var pt = Celestial.mapProjection(d.geometry.coordinates);
            // object radius in pixel, could be varable depending on e.g. magnitude
            var r = Math.pow(parseInt(d.properties.dim) * 0.25, 0.5);

            // draw on canvas
            // Set object styles
            Celestial.setStyle(pointStyle);
            // Start the drawing path
            Celestial.context.beginPath();
            // Thats a circle in html5 canvas
            Celestial.context.arc(pt[0], pt[1], r, 0, 2 * Math.PI);
            // Finish the drawing path
            Celestial.context.closePath();
            // Draw a line along the path with the prevoiusly set stroke color and line width
            Celestial.context.stroke();
            // Fill the object path with the prevoiusly set fill color
            Celestial.context.fill();
          }
        });
      },
    });
  };

  render() {
    console.log("render Skymap")
    const selectOptions = ['equatorial', 'ecliptic', 'galactic', 'supergalactic'];
    return (
      <div className={styles.container}>
        <div className={styles.headerDiv}>
          <div className={styles.legend}>
              <span><CircleIcon className={styles.circleIcon}/>Pointing</span>
              <span><PlusIcon className={styles.plusIcon} /> Targets</span>
          </div>
          <div className={styles.selectSystemCoord}>
            <Select
              options={selectOptions}
              onChange={(e) => {
                e.value ? this.actConfig(e.value) : true;
              }}
              value={'equatorial'}
            ></Select>
          </div>
        </div>
        <div id="map-container">
          <div id="map"></div>
        </div>
      </div>
    );
  }
}