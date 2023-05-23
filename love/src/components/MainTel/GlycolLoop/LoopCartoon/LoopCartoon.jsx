import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './LoopCartoon.module.css';
import { fixedFloat } from 'Utils';

export default class LoopCartoon extends Component {
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
    minTemperatureLimit: -15,
    maxTemperatureLimit: 15,
    colours: [],
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return <div className={styles.container}>{this.getSvg()}</div>;
  }

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

  tempsToGradient = (value1, value2, colours, reverse) => {
    let renderColours = '';
    let newColours = '';
    const stops = Math.abs(value1 - value2) - 1;
    if (value1 < value2) {
      var minStop = value1;
      var maxStop = value2;
    } else {
      var minStop = value2;
      var maxStop = value1;
    }

    if (stops > 0) {
      newColours = colours.slice(minStop + 1, maxStop);
      if (!reverse) {
        newColours = newColours.reverse();
      }
      renderColours = newColours.map((element, index) => (
        <stop offset={(1 / (stops + 1)) * (index + 1)} stop-color={element} />
      ));
    }

    return <>{renderColours}</>;
  };

  getSvg = () => {
    const { ts1, ts2, ts3, ts4, ts5, ts6, ts7, ts8, minTemperatureLimit, maxTemperatureLimit, colours } = this.props;

    const [ts1Hex, ts1Stop] = this.tempToHex(ts1, minTemperatureLimit, maxTemperatureLimit, colours);
    const [ts2Hex, ts2Stop] = this.tempToHex(ts2, minTemperatureLimit, maxTemperatureLimit, colours);
    const [ts3Hex, ts3Stop] = this.tempToHex(ts3, minTemperatureLimit, maxTemperatureLimit, colours);
    const [ts4Hex, ts4Stop] = this.tempToHex(ts4, minTemperatureLimit, maxTemperatureLimit, colours);
    const [ts5Hex, ts5Stop] = this.tempToHex(ts5, minTemperatureLimit, maxTemperatureLimit, colours);
    const [ts6Hex, ts6Stop] = this.tempToHex(ts6, minTemperatureLimit, maxTemperatureLimit, colours);
    const [ts7Hex, ts7Stop] = this.tempToHex(ts7, minTemperatureLimit, maxTemperatureLimit, colours);
    const [ts8Hex, ts8Stop] = this.tempToHex(ts8, minTemperatureLimit, maxTemperatureLimit, colours);

    return (
      <>
        <svg className={styles.svgContainer} cviewBox="0 0 425.25 851.69">
          <defs>
            <linearGradient
              id="gradChillTs5"
              x1="1879.55"
              y1="-796.97"
              x2="1970.78"
              y2="-796.97"
              gradientTransform="translate(-553.79 -1259.1) rotate(90)"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0" stop-color={ts5Hex} />
              <stop offset="1" stop-color={ts5Hex} />
            </linearGradient>
            <linearGradient
              id="gradTs5Ts7"
              x1="-5609.4"
              y1="-796.97"
              x2="-5421.88"
              y2="-796.97"
              gradientTransform="translate(-553.79 -4988.95) rotate(-90)"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0" stop-color={ts5Hex} />
              {this.tempsToGradient(ts5Stop, ts7Stop, colours)}
              <stop offset="1" stop-color={ts7Hex} />
            </linearGradient>
            <linearGradient
              id="gradTs7Ts2"
              x1="1525.95"
              y1="-830.93"
              x2="1692.02"
              y2="-830.93"
              gradientTransform="translate(-553.79 -1259.1) rotate(90)"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0" stop-color={ts2Hex} />
              {this.tempsToGradient(ts2Stop, ts7Stop, colours)}
              <stop offset="1" stop-color={ts7Hex} />
            </linearGradient>
            <linearGradient
              id="gradTs2Ts3"
              x1="1346.96"
              y1="-829.31"
              x2="1534.39"
              y2="-829.31"
              gradientTransform="translate(-553.79 -1259.1) rotate(90)"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset=".20" stop-color={ts3Hex} />
              {this.tempsToGradient(ts2Stop, ts3Stop, colours, true)}
              <stop offset="1" stop-color={ts2Hex} />
            </linearGradient>
            <linearGradient
              id="gradTs3Ts4"
              x1="1346.96"
              y1="-704.44"
              x2="1534.42"
              y2="-704.44"
              gradientTransform="translate(-553.79 -1259.1) rotate(90)"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset=".20" stop-color={ts3Hex} />
              {this.tempsToGradient(ts3Stop, ts4Stop, colours, false)}
              <stop offset="1" stop-color={ts4Hex} />
            </linearGradient>
            <linearGradient
              id="gradTs4Ts8"
              x1="1525.99"
              y1="-701.77"
              x2="1692.02"
              y2="-701.77"
              gradientTransform="translate(-553.79 -1259.1) rotate(90)"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0" stop-color={ts4Hex} />
              {this.tempsToGradient(ts4Stop, ts8Stop, colours)}
              <stop offset="1" stop-color={ts8Hex} />
            </linearGradient>
            <linearGradient
              id="gradTs8Ts6"
              x1="-5599.4"
              y1="-762.58"
              x2="-5411.88"
              y2="-762.58"
              gradientTransform="translate(-553.79 -4978.95) rotate(-90)"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0" stop-color={ts6Hex} />
              {this.tempsToGradient(ts6Stop, ts8Stop, colours, true)}
              <stop offset="1" stop-color={ts8Hex} />
            </linearGradient>
            <linearGradient
              id="gradTs6Chill"
              x1="1879.55"
              y1="-734.73"
              x2="1970.78"
              y2="-734.73"
              gradientTransform="translate(-553.79 -1259.1) rotate(90)"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0" stop-color={ts6Hex} />
              <stop offset="1" stop-color={ts6Hex} />
            </linearGradient>
          </defs>
          <circle className={styles.cls20} cx="212.63" cy="212.63" r="207.63" />
          <g>
            <g>
              <path
                className={styles.cls6}
                d="m123.26,266.9c-10.72-17.76-15.96-38.36-14.91-59.35,1.31-26.07,12.21-50.57,30.69-68.98l.15-.15c19.59-19.52,45.61-30.37,73.26-30.56.21,0,.43,0,.64,0v-20c-.26,0-.52,0-.78,0-32.93.22-63.91,13.15-87.23,36.38l-.15.15c-22.02,21.94-35,51.11-36.56,82.16-.11,2.1-.16,4.2-.16,6.3,0,22.06,5.83,43.57,16.8,62.49l18.25-8.43Z"
              />
              <path
                className={styles.cls25}
                d="m213.08,107.86c27.42-.02,53.33,10.46,73.02,29.56,35.4,34.33,41.48,88.39,16.71,129.43l18.28,8.44c12.02-20.67,17.89-44.42,16.7-68.7-1.54-31.74-14.96-61.41-37.77-83.53-23.45-22.75-54.31-35.22-86.95-35.2v20Z"
              />
              <path
                className={styles.cls23}
                d="m253.17,358.38l55.13-64.98c4.83-5.69,9.1-11.75,12.79-18.1l-18.28-8.44c-2.85,4.72-6.09,9.28-9.76,13.61l-57.51,67.78c-1.53,1.81-2.38,4.1-2.38,6.47v78.22h20v-74.55Z"
              />
              <rect className={styles.cls24} x="233.17" y="432.93" width="20" height="187.52" />
              <rect className={styles.cls28} x="233.17" y="620.45" width="20" height="91.24" />
              <rect className={styles.cls26} x="170.94" y="620.45" width="20" height="91.24" />
              <path
                className={styles.cls27}
                d="m190.94,432.93v-78.22c0-2.31-.8-4.55-2.27-6.34l-56.69-69.11c-3.22-3.93-6.14-8.06-8.73-12.36l-18.25,8.43c3.36,5.8,7.2,11.36,11.52,16.62l54.42,66.34v74.65h20Z"
              />
              <polygon
                className={styles.cls22}
                points="190.94 521.69 246.63 521.69 246.63 541.69 190.94 541.69 190.94 620.45 170.94 620.45 170.94 432.93 190.94 432.93 190.94 521.69"
              />
            </g>
            <path
              className={styles.cls10}
              d="m213.17,87.86c32.61,0,63.43,12.48,86.86,35.21,22.81,22.12,36.23,51.79,37.77,83.53,1.55,31.74-8.93,62.57-29.49,86.8l-55.13,64.98v349.31h-20v-166h-42.23v166h-20v-349.41l-54.42-66.34c-18.38-22.4-28.31-50.28-28.31-79.1,0-2.09.05-4.19.16-6.3,1.56-31.04,14.54-60.22,36.56-82.16l.15-.15c23.32-23.23,54.3-36.15,87.23-36.38.29,0,.58,0,.86,0m-22.23,433.83h42.23v-166.99c0-2.37.84-4.66,2.38-6.47l57.51-67.78c35.57-41.93,32.52-104.76-6.95-143.03-19.68-19.08-45.56-29.57-72.94-29.57-.24,0-.48,0-.73,0-27.65.19-53.67,11.04-73.26,30.56l-.15.15c-18.48,18.41-29.38,42.91-30.69,68.98-1.3,26.07,7.09,51.54,23.64,71.72l56.69,69.11c1.47,1.79,2.27,4.03,2.27,6.34v166.99m22.23-443.83h0c-.31,0-.62,0-.93,0-35.57.24-69.03,14.19-94.22,39.29l-.14.14c-23.79,23.71-37.82,55.22-39.5,88.75-.11,2.26-.17,4.55-.17,6.8,0,31.06,10.86,61.41,30.58,85.45l52.15,63.58v355.83h40v-166h22.23v166h40v-355.64l52.76-62.18c22.21-26.18,33.53-59.48,31.85-93.76-1.67-34.28-16.16-66.33-40.8-90.22-25.29-24.52-58.61-38.03-93.82-38.03h0Zm-12.23,433.83v-156.99c0-4.61-1.61-9.12-4.54-12.68l-56.69-69.11c-14.97-18.25-22.56-41.29-21.39-64.87,1.18-23.58,11.04-45.74,27.76-62.39l.16-.16c17.71-17.64,41.24-27.46,66.25-27.63h.66c24.76,0,48.19,9.5,65.98,26.74,35.71,34.63,38.47,91.46,6.29,129.39l-57.51,67.78c-3.06,3.61-4.75,8.2-4.75,12.94v156.99h-22.23Z"
            />
            <g>
              <text className={styles.cls1} transform="translate(270.19 428.76)">
                <tspan>TS7-G</tspan>
              </text>
              <text className={styles.cls2} transform="translate(267.53 450.74)">
                <tspan>{fixedFloat(ts7, 2)} ºC</tspan>
              </text>
            </g>
            <g>
              <text className={styles.cls1} transform="translate(109.17 428.76)">
                <tspan>TS8-G</tspan>
              </text>
              <text className={styles.cls2} transform="translate(107.66 450.74)">
                <tspan>{fixedFloat(ts8, 2)} ºC</tspan>
              </text>
            </g>
            <g>
              <text className={styles.cls1} transform="translate(269.94 616.78)">
                <tspan>TS5-G</tspan>
              </text>
              <text className={styles.cls2} transform="translate(266.13 638.76)">
                <tspan>{fixedFloat(ts5, 2)} ºC</tspan>
              </text>
            </g>
            <g>
              <text className={styles.cls1} transform="translate(109.34 616.78)">
                <tspan>TS6-G</tspan>
              </text>
              <text className={styles.cls2} transform="translate(108.41 638.76)">
                <tspan>{fixedFloat(ts6, 2)} ºC</tspan>
              </text>
            </g>
            <g>
              <text className={styles.cls1} transform="translate(323.71 292.47)">
                <tspan>TS2-MC</tspan>
              </text>
              <text className={styles.cls2} transform="translate(323.25 314.45)">
                <tspan>{fixedFloat(ts2, 2)} ºC</tspan>
              </text>
            </g>
            <g>
              <text className={styles.cls1} transform="translate(47.58 292.47)">
                <tspan>TS4-MC</tspan>
              </text>
              <text className={styles.cls2} transform="translate(50.45 314.45)">
                <tspan>{fixedFloat(ts4, 2)} ºC</tspan>
              </text>
            </g>
            <g>
              <text className={styles.cls1} transform="translate(187.22 46.77)">
                <tspan>TS3-MC</tspan>
              </text>
              <text className={styles.cls2} transform="translate(190.07 68.75)">
                <tspan>{fixedFloat(ts3, 2)} ºC</tspan>
              </text>
            </g>
            <circle className={styles.cls19} fill={ts1Hex} cx="212.63" cy="212.63" r="25" />
            <g>
              <text className={styles.cls1} transform="translate(194.34 263.21)">
                <tspan>TS1-A</tspan>
              </text>
              <text className={styles.cls2} transform="translate(190.2 285.19)">
                <tspan>{fixedFloat(ts1, 2)} ºC</tspan>
              </text>
            </g>
          </g>
          <g>
            <rect
              className={styles.cls18}
              x="211.17"
              y="499.69"
              width="64"
              height="64"
              rx="7.55"
              ry="7.55"
              transform="translate(774.86 288.52) rotate(90)"
            />
            <text className={styles.cls1} transform="translate(219.43 525.84)">
              <tspan x="0" y="0">
                Mixi
              </tspan>
              <tspan class="cls-11" x="28.6" y="0">
                n
              </tspan>
              <tspan x="38.18" y="0">
                g
              </tspan>
              <tspan class="cls-15" x="5.35" y="20">
                V
              </tspan>
              <tspan x="14.43" y="20">
                al
              </tspan>
              <tspan class="cls-32" x="26.55" y="20">
                v
              </tspan>
              <tspan class="cls-33" x="33.98" y="20">
                e
              </tspan>
            </text>
          </g>
          <g>
            <rect
              className={styles.cls18}
              x="173.18"
              y="680.38"
              width="78.89"
              height="136.24"
              rx="7.55"
              ry="7.55"
              transform="translate(961.13 535.88) rotate(90)"
            />
            <text className={styles.cls1} transform="translate(186.78 752.65)">
              <tspan x="0" y="0">
                Chille
              </tspan>
              <tspan class="cls-34" x="39.6" y="0">
                r
              </tspan>
              <tspan x="45.2" y="0">
                s
              </tspan>
            </text>
          </g>
        </svg>
      </>
    );
  };
}
