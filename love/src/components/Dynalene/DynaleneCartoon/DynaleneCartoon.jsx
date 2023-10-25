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
import styles from './DynaleneCartoon.module.css';

export default class DynaleneCartoon extends Component {
  static propTypes = {
    /** Above Mirror Temperature */
    ts1: PropTypes.number,
    /** Inside Mirror Cell Temperature 01 */
    ts2: PropTypes.number,
    /** Inside Mirror Cell Temperature 02 */
    ts3: PropTypes.number,
    /** Inside Mirror Cell Temperature 03 */
    ts4: PropTypes.number,
    /** Temperature of input glycol (flowing from telescope/chillers) */
    ts5: PropTypes.number,
    /** Temperature of returned glycol (returning to chillers) */
    ts6: PropTypes.number,
    /** Temperature of mirror glycol loop supply (measured after mixing valve) */
    ts7: PropTypes.number,
    /** Temperature of mirror glycol loop return (measured before mixing valve) */
    ts8: PropTypes.number,
    /** Min Temperature Limit */
    minTemperatureLimit: PropTypes.number,
    /** Max Temperature Limit */
    maxTemperatureLimit: PropTypes.number,
    /** Array of 9 step hexcolor gradient */
    colours: PropTypes.array,
    /** Glycol Loop svg height, hopefully in em */
    height: PropTypes.string,
    /** Array of 9 step hexcolor gradient */
    rotation: PropTypes.bool,
    /** Array of 9 step hexcolor gradient */
    direction: PropTypes.bool,
  };

  static defaultProps = {
    ts1: 0,
    ts2: 0,
    ts3: 0,
    ts4: 0,
    ts5: 0,
    ts6: 0,
    ts7: 0,
    ts8: 0,
    ts9: 0,
    ts10: 0,
    ts11: 0,
    ts12: 0,
    ts13: 0,
    ts14: 0,
    ts15: 0,
    ts16: 0,
    minTemperatureLimit: 0,
    maxTemperatureLimit: 0,
    colours: 0,
    height: 0,
    chiller01: 0,
    chiller02: 0,
    colours: [],
    height: '54em',
    rotation: true,
    direction: true,
  };

  //function returns us a linear interpolation between two values (value1, value2) based on a weight (t)
  lerp = (value1, value2, t) => {
    return (1 - t) * value1 + t * value2;
  };

  //function returns the weight of a value (value) within a linear interpolation of two values(min, max).
  antiLerp = (value, min, max) => {
    return (value - min) / (max - min);
  };

  /** tempToHex Function */

  // This function returns a hex color based on the temp value within the gradient range.
  tempToHex = (value, minValue, maxValue, colorArray) => {
    //we check if the value escapes the range, so we can clip it.
    if (value >= maxValue) {
      return [colorArray[8], 8];
    } else if (value <= minValue) {
      return [colorArray[0], 1];
    } else {
      //first we get the weight of the value (0.0 - 1.0) and get the gradient stop it corresponds to
      const gradientWeight = this.antiLerp(value, minValue, maxValue);
      const gradientStop = Math.floor(gradientWeight * 8) + 1;
      //we then set the gradient for the section, selecting the corresponding colors from the gradient
      const minColor = colorArray[gradientStop - 1];
      const maxColor = colorArray[gradientStop];
      //we now calculate the weight of the value within the new gradient section, with new min and max temps
      const minTemp = this.lerp(minValue, maxValue, (1 / 8) * (gradientStop - 1));
      const maxTemp = this.lerp(minValue, maxValue, (1 / 8) * gradientStop);
      const t = this.antiLerp(value, minTemp, maxTemp);
      //we then calculate the rgb values using a lerp and hexToRgb
      const r = Math.round(this.lerp(this.hexToRgb(minColor).r, this.hexToRgb(maxColor).r, t));
      const g = Math.round(this.lerp(this.hexToRgb(minColor).g, this.hexToRgb(maxColor).g, t));
      const b = Math.round(this.lerp(this.hexToRgb(minColor).b, this.hexToRgb(maxColor).b, t));
      //the function returns the rgb as a Hex and the gradient Stop
      return [this.rgbToHex(r, g, b), gradientStop];
    }
  };

  //This function recieves a hex, and turns it into rgb
  hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  //This function recieves an rgb, and turns it into a hex
  rgbToHex = (r, g, b) => {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  };

  //This function creates the extra stops for a gradient
  //between two temperature sensors (value1,value2)
  tempsToGradient = (value1, value2, colours, startWeight) => {
    let renderColours = '';
    let newColours = '';
    //First we see how many stops there are
    const stops = Math.abs(value1 - value2) - 1;
    if (stops > 0) {
      if (value1 < value2) {
        var minStop = value1;
        var maxStop = value2;
      } else {
        var minStop = value2;
        var maxStop = value1;
      }
      //we slice the colours array to get the missing stops
      newColours = colours.slice(minStop + 1, maxStop);
      if (value1 > value2) {
        newColours = newColours.reverse();
      }
      //we add the stops to the svg
      renderColours = newColours.map((element, index) => (
        <stop offset={((1 - startWeight) / (stops + 1)) * (index + 1) + startWeight} stop-color={element} />
      ));
    }
    return <>{renderColours}</>;
  };

  //This compromises the svg
  getSvg = () => {
    const {
      ts1,
      ts2,
      ts3,
      ts4,
      ts5,
      ts6,
      ts7,
      ts8,
      ts9,
      ts10,
      ts11,
      ts12,
      ts13,
      ts14,
      ts15,
      ts16,
      minTemperatureLimit,
      maxTemperatureLimit,
      colours,
      width,
      chiller01,
      chiller02,
    } = this.props;

    const [ts1Hex, ts1Stop] = this.tempToHex(ts1, minTemperatureLimit, maxTemperatureLimit, colours);
    const [ts2Hex, ts2Stop] = this.tempToHex(ts2, minTemperatureLimit, maxTemperatureLimit, colours);
    const [ts3Hex, ts3Stop] = this.tempToHex(ts3, minTemperatureLimit, maxTemperatureLimit, colours);
    const [ts4Hex, ts4Stop] = this.tempToHex(ts4, minTemperatureLimit, maxTemperatureLimit, colours);
    const [ts5Hex, ts5Stop] = this.tempToHex(ts5, minTemperatureLimit, maxTemperatureLimit, colours);
    const [ts6Hex, ts6Stop] = this.tempToHex(ts6, minTemperatureLimit, maxTemperatureLimit, colours);
    const [ts7Hex, ts7Stop] = this.tempToHex(ts7, minTemperatureLimit, maxTemperatureLimit, colours);
    const [ts8Hex, ts8Stop] = this.tempToHex(ts8, minTemperatureLimit, maxTemperatureLimit, colours);
    const [ts9Hex, ts9Stop] = this.tempToHex(ts9, minTemperatureLimit, maxTemperatureLimit, colours);
    const [ts10Hex, ts10Stop] = this.tempToHex(ts10, minTemperatureLimit, maxTemperatureLimit, colours);
    const [ts11Hex, ts11Stop] = this.tempToHex(ts11, minTemperatureLimit, maxTemperatureLimit, colours);
    const [ts12Hex, ts12Stop] = this.tempToHex(ts12, minTemperatureLimit, maxTemperatureLimit, colours);
    const [ts13Hex, ts13Stop] = this.tempToHex(ts13, minTemperatureLimit, maxTemperatureLimit, colours);
    const [ts14Hex, ts14Stop] = this.tempToHex(ts14, minTemperatureLimit, maxTemperatureLimit, colours);
    const [ts15Hex, ts15Stop] = this.tempToHex(ts15, minTemperatureLimit, maxTemperatureLimit, colours);
    const [ts16Hex, ts16Stop] = this.tempToHex(ts16, minTemperatureLimit, maxTemperatureLimit, colours);

    const ch01Height = (chiller01 * 110) / 100;
    const ch02Height = (chiller02 * 110) / 100;

    return (
      <>
        <svg className={styles.svgContainer} viewBox="0 0 668.88 345.29" width={width}>
          <defs>
            <linearGradient
              id="grad01to02"
              x1="70"
              y1="-2.94"
              x2="210"
              y2="-2.94"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(296.49 110.56) rotate(180)"
            >
              <stop offset="0" stop-color={ts1Hex} />
              {this.tempsToGradient(ts1Stop, ts2Stop, colours, 0)}
              <stop offset="1" stop-color={ts2Hex} />
            </linearGradient>
            <linearGradient id="grad03to04" x1="80" y1="48.5" x2="220" y2="48.5" gradientUnits="userSpaceOnUse">
              <stop offset="0" stop-color={ts4Hex} />
              {this.tempsToGradient(ts4Stop, ts3Stop, colours, 0)}
              <stop offset="1" stop-color={ts3Hex} />
            </linearGradient>
            <linearGradient
              id="grad05to06"
              x1="220"
              y1="4606.44"
              x2="320"
              y2="4606.44"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(4910.88 490.08) rotate(-90)"
            >
              <stop offset="0" stop-color={ts6Hex} />
              {this.tempsToGradient(ts6Stop, ts5Stop, colours, 0)}
              <stop offset="1" stop-color={ts5Hex} />
            </linearGradient>
            <linearGradient
              id="grad07to08"
              x1="210"
              y1="4656.44"
              x2="322"
              y2="4656.44"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(4910.88 490.08) rotate(-90) scale(1 -1)"
            >
              <stop offset="0" stop-color={ts7Hex} />
              {this.tempsToGradient(ts7Stop, ts8Stop, colours, 0)}
              <stop offset="1" stop-color={ts8Hex} />
            </linearGradient>
            <linearGradient
              id="grad09to10"
              y1="-2.94"
              y2="-2.94"
              x1="83.24"
              x2="213.24"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(648.88) rotate(-180)"
            >
              <stop offset="0" stop-color={ts9Hex} />
              {this.tempsToGradient(ts9Stop, ts10Stop, colours, 0)}
              <stop offset="1" stop-color={ts10Hex} />
            </linearGradient>
            <linearGradient
              id="grad11to12"
              y1="-2.94"
              y2="-2.94"
              x1="83.24"
              x2="213.24"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(352.39 110.56) scale(1 -1)"
            >
              <stop offset="0" stop-color={ts12Hex} />
              {this.tempsToGradient(ts12Stop, ts11Stop, colours, 0)}
              <stop offset="1" stop-color={ts11Hex} />
            </linearGradient>
            <linearGradient
              id="grad13to14"
              x1="208.07"
              y1="4626.44"
              x2="318.07"
              y2="4626.44"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(-4262 490.08) rotate(-90)"
            >
              <stop offset="0" stop-color={ts14Hex} />
              {this.tempsToGradient(ts14Stop, ts13Stop, colours, 0)}
              <stop offset="1" stop-color={ts13Hex} />
            </linearGradient>
            <linearGradient
              id="grad15to16"
              x1="208.07"
              y1="4676.44"
              x2="318.07"
              y2="4676.44"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(-4262 490.08) rotate(-90)"
            >
              <stop offset="0" stop-color={ts16Hex} />
              {this.tempsToGradient(ts16Stop, ts15Stop, colours, 0)}
              <stop offset="1" stop-color={ts15Hex} />
            </linearGradient>
          </defs>
          <g>
            <g>
              <path
                className={styles.pipeBorder}
                d="m233.24,21.72v20h-65v33.56h-20v-33.56h-65v-20h150m10-10H73.24v40h65v33.56h40v-33.56h65V11.72h0Z"
              />
              <polygon
                className={styles.grad03to04}
                points="233.24 21.72 83.24 21.72 83.24 41.72 148.24 41.72 148.24 75.28 168.24 75.28 168.24 41.72 233.24 41.72 233.24 21.72"
              />
            </g>
            <g>
              <path
                className={styles.pipeBorder}
                d="m168.24,81.72v43.56h65v20H83.24v-20h65v-43.56h20m10-10h-40v43.56h-65v40h170v-40h-65v-43.56h0Z"
              />
              <polygon
                className={styles.grad01to02}
                points="83.24 145.28 233.24 145.28 233.24 125.28 168.24 125.28 168.24 81.72 148.24 81.72 148.24 125.28 83.24 125.28 83.24 145.28"
              />
            </g>
          </g>
          <g>
            <rect className={styles.cls16} x="3.5" y="3.5" width="80" height="160" rx="8" ry="8" />
            <text className={styles.systemTitle} transform="translate(29.63 87.01)">
              <tspan x="0" y="0">
                TMA
              </tspan>
            </text>
          </g>
          <g>
            <g>
              <rect className={styles.grad05to06} x="294.44" y="142.01" width="20" height="140" />
              <path className={styles.pipeBorder} d="m314.44,142.01v140h-20v-140h20m10-10h-40v160h40v-160h0Z" />
            </g>
            <g>
              <rect className={styles.grad07to08} x="244.44" y="142.01" width="20" height="140" />
              <path className={styles.pipeBorder} d="m264.44,142.01v140h-20v-140h20m10-10h-40v160h40v-160h0Z" />
            </g>
          </g>
          <text className={styles.cls18} transform="translate(206.42 139.42)">
            <tspan className={styles.cls25} x="0" y="0">
              0
            </tspan>
            <tspan x="8.02" y="0">
              1
            </tspan>
          </text>
          <text className={styles.cls18} transform="translate(96.94 139.42)">
            <tspan className={styles.cls25} x="0" y="0">
              0
            </tspan>
            <tspan x="8.02" y="0">
              2
            </tspan>
          </text>
          <text className={styles.cls18} transform="translate(96.97 34.81)">
            <tspan className={styles.cls22} x="0" y="0">
              0
            </tspan>
            <tspan x="7.96" y="0">
              3
            </tspan>
          </text>
          <text className={styles.cls18} transform="translate(204.6 34.81)">
            <tspan x="0" y="0">
              04
            </tspan>
          </text>
          <text className={styles.cls18} transform="translate(296.38 184.01)">
            <tspan x="0" y="0">
              05
            </tspan>
          </text>
          <text className={styles.cls18} transform="translate(296.13 266.62)">
            <tspan x="0" y="0">
              06
            </tspan>
          </text>
          <text className={styles.cls18} transform="translate(246.34 184.01)">
            <tspan x="0" y="0">
              08
            </tspan>
          </text>
          <text className={styles.cls18} transform="translate(246.63 266.62)">
            <tspan className={styles.cls25} x="0" y="0">
              0
            </tspan>
            <tspan x="8.02" y="0">
              7
            </tspan>
          </text>
          <g>
            <rect className={styles.cls16} x="124.24" y="58.5" width="68" height="50" rx="8" ry="8" />
            <text className={styles.systemTitle} transform="translate(137.3 79.83)">
              <tspan x="0" y="0">
                Mixing
              </tspan>
              <tspan className={styles.cls20} x="-3.54" y="14.4">
                Valve 01
              </tspan>
            </text>
          </g>
          <rect className={styles.cls16} x="234.44" y="3.5" width="90" height="160" rx="8" ry="8" />
          <text className={styles.systemTitle} transform="translate(251.56 27.6)">
            <tspan x="0" y="0">
              Chiller 01
            </tspan>
          </text>
          <rect className={styles.cls14} x="249.44" y="38.5" width="60" height="110" />
          <rect className={styles.cls15} x="249.44" y={38.5 + (110 - ch01Height)} width="60" height={ch01Height} />
          <text className={styles.tankLevel} transform="translate(279.44 97.01)" text-anchor="middle">
            <tspan x="0" y="0">
              {chiller01 + '%'}
            </tspan>
          </text>
          <polygon
            className={styles.cls11}
            points="168.91 31.3 159.07 25.3 159.07 28.15 148.91 28.15 148.91 34.44 159.07 34.44 159.07 37.3 168.91 31.3"
          />
          <polygon
            className={styles.cls11}
            points="148.91 135.9 158.75 129.9 158.75 132.75 168.91 132.75 168.91 139.04 158.75 139.04 158.75 141.9 148.91 135.9"
          />
          <polygon
            className={styles.cls11}
            points="304.44 232.01 298.44 222.17 301.3 222.17 301.3 212.01 307.59 212.01 307.59 222.17 310.44 222.17 304.44 232.01"
          />
          <polygon
            className={styles.cls11}
            points="254.44 212.01 248.44 221.85 251.3 221.85 251.3 232.01 257.59 232.01 257.59 221.85 260.44 221.85 254.44 212.01"
          />
          <g>
            <g>
              <path
                className={styles.pipeBorder}
                d="m585.64,21.72v20h-65v33.56h-20v-33.56h-65v-20h150m10-10h-170v40h65v33.56h40v-33.56h65V11.72h0Z"
              />
              <polygon
                className={styles.grad11to12}
                points="435.64 21.72 585.64 21.72 585.64 41.72 520.64 41.72 520.64 75.28 500.64 75.28 500.64 41.72 435.64 41.72 435.64 21.72"
              />
            </g>
            <g>
              <path
                className={styles.pipeBorder}
                d="m520.64,81.72v43.56h65v20h-150v-20h65v-43.56h20m10-10h-40v43.56h-65v40h170v-40h-65v-43.56h0Z"
              />
              <polygon
                className={styles.grad09to10}
                points="585.64 145.28 435.64 145.28 435.64 125.28 500.64 125.28 500.64 81.72 520.64 81.72 520.64 125.28 585.64 125.28 585.64 145.28"
              />
            </g>
          </g>
          <g>
            <rect
              className={styles.cls16}
              x="585.38"
              y="3.5"
              width="80"
              height="160"
              rx="8"
              ry="8"
              transform="translate(1250.76 167) rotate(180)"
            />
            <text className={styles.systemTitle} transform="translate(612.7 79.81)">
              <tspan className={styles.cls20} x="0" y="0">
                T
              </tspan>
              <tspan x="6.56" y="0">
                est
              </tspan>
              <tspan x="-1.59" y="14.4">
                A
              </tspan>
              <tspan className={styles.cls1} x="7.4" y="14.4">
                r
              </tspan>
              <tspan className={styles.cls12} x="12.32" y="14.4">
                e
              </tspan>
              <tspan x="19.6" y="14.4">
                a
              </tspan>
            </text>
          </g>
          <g>
            <g>
              <rect className={styles.grad13to14} x="354.44" y="142.01" width="20" height="140" />
              <path className={styles.pipeBorder} d="m374.44,142.01v140h-20v-140h20m10-10h-40v160h40v-160h0Z" />
            </g>
            <g>
              <rect className={styles.grad15to16} x="404.44" y="142.01" width="20" height="140" />
              <path className={styles.pipeBorder} d="m424.44,142.01v140h-20v-140h20m10-10h-40v160h40v-160h0Z" />
            </g>
          </g>
          <text className={styles.cls18} transform="translate(448.37 139.42)">
            <tspan x="0" y="0">
              09
            </tspan>
          </text>
          <text className={styles.cls18} transform="translate(558.11 139.42)">
            <tspan x="0" y="0">
              10
            </tspan>
          </text>
          <text className={styles.cls18} transform="translate(559.87 34.81)">
            <tspan x="0" y="0">
              11
            </tspan>
          </text>
          <text className={styles.cls18} transform="translate(450.39 34.81)">
            <tspan x="0" y="0">
              12
            </tspan>
          </text>
          <text className={styles.cls18} transform="translate(359.18 184.01)">
            <tspan x="0" y="0">
              13
            </tspan>
          </text>
          <text className={styles.cls18} transform="translate(358.6 266.62)">
            <tspan x="0" y="0">
              14
            </tspan>
          </text>
          <text className={styles.cls18} transform="translate(408.8 184.01)">
            <tspan x="0" y="0">
              15
            </tspan>
          </text>
          <text className={styles.cls18} transform="translate(408.55 266.62)">
            <tspan x="0" y="0">
              16
            </tspan>
          </text>
          <g>
            <rect className={styles.cls16} x="476.64" y="58.5" width="68" height="50" rx="8" ry="8" />
            <text className={styles.systemTitle} transform="translate(489.76 79.83)">
              <tspan x="0" y="0">
                Mixi
              </tspan>
              <tspan className={styles.cls24} x="25.27" y="0">
                n
              </tspan>
              <tspan x="33.55" y="0">
                g
              </tspan>
              <tspan className={styles.cls20} x="-4.75" y="14.4">
                V
              </tspan>
              <tspan x="3.34" y="14.4">
                al
              </tspan>
              <tspan className={styles.cls23} x="14.09" y="14.4">
                v
              </tspan>
              <tspan x="20.85" y="14.4">
                e{' '}
              </tspan>
              <tspan className={styles.cls25} x="31.62" y="14.4">
                0
              </tspan>
              <tspan x="39.64" y="14.4">
                2
              </tspan>
            </text>
          </g>
          <rect
            className={styles.cls16}
            x="344.44"
            y="3.5"
            width="90"
            height="160"
            rx="8"
            ry="8"
            transform="translate(778.88 167) rotate(180)"
          />
          <text className={styles.systemTitle} transform="translate(360.36 27.6)">
            <tspan x="0" y="0">
              Chiller{' '}
            </tspan>
            <tspan className={styles.cls25} x="43.16" y="0">
              0
            </tspan>
            <tspan x="51.18" y="0">
              2
            </tspan>
          </text>
          <rect
            className={styles.cls14}
            x="359.44"
            y="38.5"
            width="60"
            height="110"
            transform="translate(778.88 187) rotate(180)"
          />
          <rect className={styles.cls15} x="359.44" y={38.5 + (110 - ch02Height)} width="60" height={ch02Height} />
          <text className={styles.tankLevel} transform="translate(389.44 97.01)" text-anchor="middle">
            <tspan x="0" y="0">
              {chiller02 + '%'}
            </tspan>
          </text>
          <polygon
            className={styles.cls11}
            points="499.97 31.3 509.82 25.3 509.82 28.15 519.97 28.15 519.97 34.44 509.82 34.44 509.82 37.3 499.97 31.3"
          />
          <polygon
            className={styles.cls11}
            points="519.97 135.9 510.13 129.9 510.13 132.75 499.97 132.75 499.97 139.04 510.13 139.04 510.13 141.9 519.97 135.9"
          />
          <polygon
            className={styles.cls11}
            points="364.44 232.01 370.44 222.17 367.59 222.17 367.59 212.01 361.3 212.01 361.3 222.17 358.44 222.17 364.44 232.01"
          />
          <polygon
            className={styles.cls11}
            points="414.44 212.01 420.44 221.85 417.59 221.85 417.59 232.01 411.3 232.01 411.3 221.85 408.44 221.85 414.44 212.01"
          />
          <g>
            <rect className={styles.cls16} x="219.69" y="281.79" width="228" height="60" rx="8" ry="8" />
            <text className={styles.systemTitle} transform="translate(311.63 315.3)">
              <tspan className={styles.cls26} x="0" y="0">
                F
              </tspan>
              <tspan className={styles.cls27} x="7.44" y="0">
                a
              </tspan>
              <tspan className={styles.cls19} x="14.78" y="0">
                cili
              </tspan>
              <tspan className={styles.cls22} x="32.16" y="0">
                t
              </tspan>
              <tspan className={styles.cls21} x="37.13" y="0">
                y
              </tspan>
            </text>
          </g>
          {/* <g>
            <rect className={styles.grad01to02} x="80" y="10" width="520" height="270"/>
          </g> */}
        </svg>
      </>
    );
  };

  render() {
    return <div className={styles.container}>{this.getSvg()}</div>;
  }
}
