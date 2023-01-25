import React, { Component } from 'react';
import celestial from "d3-celestial";
import styles from "./SkyMap.module.css";

const Celestial = celestial.Celestial();
window.Celestial = Celestial;

export default class SkyMap extends Component {

  config = {
    width: 0,
    projection: "aitoff",
    transform: "equatorial",
    center: null, // TODO : Fix it to const ID
    adaptable: true,
    interactive: true,
    form: false,
    location: false,
    controls: false,
    container: "map",
    // datapath: "build/data/",
    // STARS
    stars: {
      colors: false,
      names: false,
      style: { fill: "#000", opacity: 1 },
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
        gg: { shape: "circle", fill: "#ff0000" }, // Galaxy cluster
        g: { shape: "ellipse", fill: "#ff0000" }, // Generic galaxy
        s: { shape: "ellipse", fill: "#ff0000" }, // Spiral galaxy
        s0: { shape: "ellipse", fill: "#ff0000" }, // Lenticular galaxy
        sd: { shape: "ellipse", fill: "#ff0000" }, // Dwarf galaxy
        e: { shape: "ellipse", fill: "#ff0000" }, // Elliptical galaxy
        i: { shape: "ellipse", fill: "#ff0000" }, // Irregular galaxy
        oc: { shape: "circle", fill: "#ffcc00", stroke: "#ffcc00", width: 1.5 }, // Open cluster
        gc: { shape: "circle", fill: "#ff9900" }, // Globular cluster
        en: { shape: "square", fill: "#ff00cc" }, // Emission nebula
        bn: { shape: "square", fill: "#ff00cc", stroke: "#ff00cc", width: 2 }, // Generic bright nebula
        sfr: { shape: "square", fill: "#cc00ff", stroke: "#cc00ff", width: 2 }, // Star forming region
        rn: { shape: "square", fill: "#00ooff" }, // Reflection nebula
        pn: { shape: "diamond", fill: "#00cccc" }, // Planetary nebula
        snr: { shape: "diamond", fill: "#ff00cc" }, // Supernova remnant
        dn: { shape: "square", fill: "#999999", stroke: "#999999", width: 2 }, // Dark nebula grey
        pos: { shape: "marker", fill: "#cccccc", stroke: "#cccccc", width: 1.5 } // Generic marker
      }
    },
    // CONSTELLATIONS
    constellations: {
      show: true, // Show constellations
      names: true, // Show constellation names
      desig: true, // Show short constellation names (3 letter designations)
      namestyle: {
        fill: "#cccc99",
        align: "center",
        baseline: "middle",
        font: [
          "14px Helvetica, Arial, sans-serif", // Style for constellations
          "12px Helvetica, Arial, sans-serif", // Different fonts for diff.
          "11px Helvetica, Arial, sans-serif"
        ]
      }, // ranked constellations
      lines: true, // Show constellation lines, style below
      linestyle: { stroke: "#cccccc", width: 1, opacity: 0.6 },
      bounds: false, // Show constellation boundaries, style below
      boundstyle: { stroke: "#cccc00", width: 0.5, opacity: 0.8, dash: [2, 4] }
    },
    // MILKY WAY
    mw: {
      show: true,
      // data: "mw.json",
      style: { fill: "#ffffff", opacity: 0.15 }
    },
    // LINES
    lines: {
      graticule: {
        show: true,
        stroke: "#cccccc",
        width: 0.6,
        opacity: 0.8,
        // grid values: "outline", "center", or [lat,...] specific position
        lon: {
          pos: [""],
          fill: "#eee",
          font: "10px Helvetica, Arial, sans-serif"
        },
        // grid values: "outline", "center", or [lon,...] specific position
        lat: {
          pos: [""],
          fill: "#eee",
          font: "10px Helvetica, Arial, sans-serif"
        }
      },
      equatorial: { show: true, stroke: "#aaaaaa", width: 1.3, opacity: 0.7 }
    },
    // BACKGROUND
    background: {
      fill: "#3e3d40", // Area fill
      opacity: 1,
      stroke: "#3e3d40", // Outline
      width: 1.5
    },
    // HORIZON
    horizon: {
      //Show horizon marker, if location is set and map projection is all-sky
      show: false,
      stroke: "#000099", // Line
      width: 1.0,
      fill: "#000000", // Area below horizon
      opacity: 0.5
    }
  };

  componentDidMount = () => {
    Celestial.display(this.config);
  };
  
  render() {
    return(
      <div className={styles.container}>
        <h2>SkyMap component</h2>
        <div id="map-container">
          <div id="map"></div>
        </div>
      </div>
    );
  }
}