import React, { Component } from 'react';
import lodash from 'lodash';
import PropTypes from 'prop-types';
import styles from './Level8.module.css';
import Device from '../Device.jsx';
import * as d3 from 'd3';

export default class Level8 extends Component {
  constructor(props) {
    super(props);
    this.mapId = lodash.uniqueId('Map-');
    this.overlayId = lodash.uniqueId('Overlay-');
    this.deviceId = lodash.uniqueId('Devices-');
  }

  static propTypes = {
    /** HVAC Telemetru data*/
    HVACData: PropTypes.object,
    /** Function saves current Map Zoom position */
    savePos: PropTypes.func,
    /** The Map Zoom position that was saved */
    transformData: PropTypes.objectOf(PropTypes.number),
  };

  static defaultProps = {
    HVACData: {},
    transformData: { k: 1, x: 0, z: 0 },
  };

  componentDidMount() {
    const deviceId = '#' + this.deviceId;
    const mapId = '#' + this.mapId;
    const overlayId = '#' + this.overlayId;
    const transformData = this.props.transformData;

    const zoom = d3.zoom().scaleExtent([1, 8]).on('zoom', this.zoomMap);

    d3.select(overlayId)
      .call(zoom.transform, d3.zoomIdentity.translate(transformData.x, transformData.y).scale(transformData.k))
      .call(zoom);
  }

  zoomMap = () => {
    const deviceId = '#' + this.deviceId;
    const mapId = '#' + this.mapId;
    const transformData = d3.event.transform;

    d3.select(mapId).attr('transform', transformData);
    d3.select(deviceId).attr('transform', transformData);
    this.props.savePos(transformData);
  };

  getDevices() {
    return <React.Fragment></React.Fragment>;
  }

  render() {
    return (
      <React.Fragment>
        <g id={this.mapId}>
          <g id="Box">
            <path
              className={styles.cls11}
              d="m158.39,88.02h-24.49v-26.82h24.49v-.25h-24.62c-.07,0-.12.06-.12.12v27.07c0,.07.06.12.12.12h24.62v-.25Z"
            />
            <path
              className={styles.cls14}
              d="m222.56,108.35s.03.01.05.01c.02,0,.03,0,.04,0,.03-.01.06-.04.07-.07l12.08-27.3c.03-.06,0-.14-.06-.16l-44.17-19.87s-.03-.01-.05-.01h-32.12v.25h32.1l44.03,19.8-11.98,27.07-44.44-20.04s-.03-.01-.05-.01h-19.67v.25h19.64l44.53,20.08Z"
            />
          </g>
          <g id="Floor">
            <path
              className={styles.cls1}
              d="m160.53,93.61c-54.73,0-99.1,44.37-99.1,99.1s44.37,99.1,99.1,99.1,99.1-44.37,99.1-99.1-44.37-99.1-99.1-99.1Zm0,179c-44.13,0-79.9-35.77-79.9-79.9s35.77-79.9,79.9-79.9,79.9,35.77,79.9,79.9-35.77,79.9-79.9,79.9Z"
            />
            <path
              className={styles.cls1}
              d="m160.53,53.71c-.72,0-1.42.03-2.14.04v38.3c.71-.01,1.42-.04,2.14-.04,55.62,0,100.7,45.08,100.7,100.7,0,45.6-30.32,84.12-71.89,96.51l10.96,36.71c57.39-17.11,99.24-70.27,99.24-133.22,0-76.77-62.23-139-139-139Zm94.75,68.03c0-3.53,2.86-6.4,6.4-6.4s6.4,2.86,6.4,6.4-2.86,6.4-6.4,6.4-6.4-2.86-6.4-6.4Zm8.84,144.68c-3.53,0-6.4-2.86-6.4-6.4s2.86-6.4,6.4-6.4,6.4,2.86,6.4,6.4-2.86,6.4-6.4,6.4Z"
            />
            <path
              className={styles.cls1}
              d="m77.45,90.18l-26.45,28.36,24.65,22.99c6.76-11.18,15.66-20.92,26.14-28.64l-24.35-22.7Zm8.66,33.85l-3.88,1.95c-5.02,2.52-11.13.5-13.65-4.51h0c-2.52-5.02-.5-11.13,4.51-13.65l3.88-1.95c3-1.51,6.65-.3,8.16,2.7l3.67,7.3c1.51,3,.3,6.66-2.7,8.16Z"
            />
          </g>
          <path
            className={styles.cls8}
            d="m274.05,285.28h554.28l.47-.27.23.2h22.6l26.16-15.77V36.28l-26.16-15.84-99.42-7.05h-227.44v6.91l.24.21H224.29l-30.35,29.58c78.35,20.09,113.05,85.95,113.05,143.07s-32.93,92.12-32.93,92.12Z"
          />
          <g id="Stairs">
            <polygon
              className={styles.cls17}
              points="57.26 289.16 65.81 283.19 54.67 266.94 55.33 266.44 66.19 282.28 74.88 276.28 58.17 252.02 40.27 264.49 57.26 289.16"
            />
            <line className={styles.cls17} x1="61.4" y1="277" x2="53.21" y2="282.83" />
            <line className={styles.cls17} x1="59.71" y1="274.53" x2="51.52" y2="280.35" />
            <line className={styles.cls17} x1="58.01" y1="272.05" x2="49.82" y2="277.88" />
            <line className={styles.cls17} x1="56.31" y1="269.58" x2="48.12" y2="275.41" />
            <line className={styles.cls17} x1="54.61" y1="267.11" x2="46.42" y2="272.94" />
            <line className={styles.cls17} x1="63.73" y1="260.68" x2="55.21" y2="266.72" />
            <line className={styles.cls17} x1="65.43" y1="263.15" x2="56.9" y2="269.2" />
            <line className={styles.cls17} x1="67.13" y1="265.62" x2="58.6" y2="271.67" />
            <line className={styles.cls17} x1="68.83" y1="268.1" x2="60.3" y2="274.14" />
            <line className={styles.cls17} x1="70.53" y1="270.57" x2="62" y2="276.62" />
            <line className={styles.cls17} x1="72.22" y1="273.04" x2="63.69" y2="279.09" />
            <g id="Arrow">
              <polygon className={styles.cls9} points="66.16 279.3 72.49 274.96 70.77 279.24 66.16 279.3" />
              <polyline className={styles.cls2} points="69.8 277.82 56.84 259.22 47.64 265.78 60.38 284.19" />
            </g>
          </g>
          <g id="Machines">
            <g>
              <g>
                <g>
                  <polyline className={styles.cls10} points="105.68 147.77 100.17 156.49 98.29 185.93" />
                  <polyline className={styles.cls10} points="89.77 185.65 91.87 153.3 98.71 143.12" />
                  <line className={styles.cls10} x1="103.68" y1="150.75" x2="96.61" y2="146.28" />
                  <line className={styles.cls10} x1="102.57" y1="152.37" x2="95.5" y2="147.91" />
                  <line className={styles.cls10} x1="101.22" y1="154.05" x2="94.15" y2="149.58" />
                  <line className={styles.cls10} x1="100.43" y1="155.91" x2="93.36" y2="151.44" />
                  <line className={styles.cls10} x1="100.01" y1="157.49" x2="91.64" y2="157.16" />
                  <line className={styles.cls10} x1="99.87" y1="159.4" x2="91.5" y2="159.07" />
                  <line className={styles.cls10} x1="99.64" y1="161.44" x2="91.26" y2="161.12" />
                  <line className={styles.cls10} x1="99.68" y1="163.54" x2="91.31" y2="163.21" />
                  <line className={styles.cls10} x1="99.54" y1="165.44" x2="91.17" y2="165.12" />
                  <line className={styles.cls10} x1="99.31" y1="167.49" x2="90.94" y2="167.16" />
                  <line className={styles.cls10} x1="99.4" y1="169.58" x2="91.03" y2="169.26" />
                  <line className={styles.cls10} x1="99.26" y1="171.49" x2="90.89" y2="171.16" />
                  <line className={styles.cls10} x1="99.03" y1="173.54" x2="90.66" y2="173.21" />
                  <line className={styles.cls10} x1="99.17" y1="175.68" x2="90.8" y2="175.35" />
                  <line className={styles.cls10} x1="99.03" y1="177.58" x2="90.66" y2="177.26" />
                  <line className={styles.cls10} x1="98.8" y1="179.63" x2="90.43" y2="179.3" />
                  <line className={styles.cls10} x1="98.8" y1="181.72" x2="90.43" y2="181.4" />
                  <line className={styles.cls10} x1="98.66" y1="183.63" x2="90.29" y2="183.3" />
                  <line className={styles.cls10} x1="98.43" y1="185.68" x2="90.05" y2="185.35" />
                </g>
                <polygon
                  className={styles.cls7}
                  points="102.43 203.12 98.52 186.47 88.75 186 86.05 186.75 61.87 207.12 70.61 239.49 80.66 252.14 101.68 246.75 95.82 223.86 76.47 228.88 71.64 211.77 102.43 203.12"
                />
              </g>
              <g>
                <g>
                  <polyline className={styles.cls10} points="185.63 126.45 194.77 131.24 211.12 155.8" />
                  <polyline className={styles.cls10} points="218.35 151.3 200.36 124.33 189.35 118.93" />
                  <line className={styles.cls10} x1="188.85" y1="128.03" x2="192.74" y2="120.62" />
                  <line className={styles.cls10} x1="190.64" y1="128.88" x2="194.53" y2="121.48" />
                  <line className={styles.cls10} x1="192.64" y1="129.65" x2="196.53" y2="122.25" />
                  <line className={styles.cls10} x1="194.26" y1="130.87" x2="198.15" y2="123.47" />
                  <line className={styles.cls10} x1="195.41" y1="132.03" x2="202.5" y2="127.56" />
                  <line className={styles.cls10} x1="196.48" y1="133.61" x2="203.57" y2="129.14" />
                  <line className={styles.cls10} x1="197.71" y1="135.27" x2="204.8" y2="130.8" />
                  <line className={styles.cls10} x1="198.71" y1="137.1" x2="205.8" y2="132.64" />
                  <line className={styles.cls10} x1="199.79" y1="138.68" x2="206.88" y2="134.22" />
                  <line className={styles.cls10} x1="201.01" y1="140.34" x2="208.1" y2="135.87" />
                  <line className={styles.cls10} x1="201.98" y1="142.2" x2="209.07" y2="137.73" />
                  <line className={styles.cls10} x1="203.05" y1="143.78" x2="210.14" y2="139.31" />
                  <line className={styles.cls10} x1="204.28" y1="145.44" x2="211.37" y2="140.97" />
                  <line className={styles.cls10} x1="205.23" y1="147.36" x2="212.31" y2="142.89" />
                  <line className={styles.cls10} x1="206.3" y1="148.94" x2="213.39" y2="144.47" />
                  <line className={styles.cls10} x1="207.53" y1="150.6" x2="214.61" y2="146.13" />
                  <line className={styles.cls10} x1="208.57" y1="152.41" x2="215.66" y2="147.94" />
                  <line className={styles.cls10} x1="209.65" y1="153.99" x2="216.73" y2="149.52" />
                  <line className={styles.cls10} x1="210.87" y1="155.65" x2="217.96" y2="151.18" />
                </g>
                <polygon
                  className={styles.cls7}
                  points="216.13 172.75 211.19 156.38 219.41 151.09 222.12 150.39 253.25 155.94 261.87 188.35 259.49 204.33 238.59 210.16 232.22 187.42 251.49 182.09 247.12 164.85 216.13 172.75"
                />
              </g>
            </g>
            <g>
              <path
                className={styles.cls6}
                d="m221.12,228.08c-19.33,33.47-62.13,44.94-95.61,25.62l-31.94-42.68,133.87-35.87-6.32,52.93Z"
              />
              <path
                className={styles.cls6}
                d="m221.91,217.12l-4.33,9.68c-18.12,31.39-58.26,42.14-89.64,24.02l-8.03-7.19,10.59,4.13c29.18,16.85,66.49,6.85,83.34-22.33l-3.53-1.28c-15.65,27.1-50.3,36.38-77.4,20.74l2.82-3.36c24.67,14.24,56.21,5.79,70.45-18.88l15.73-5.53Z"
              />
              <g>
                <rect
                  className={styles.cls6}
                  x="83.17"
                  y="210.53"
                  width="10.73"
                  height="7.92"
                  transform="translate(-52.5 30.22) rotate(-15)"
                />
                <rect
                  className={styles.cls6}
                  x="229.3"
                  y="171.38"
                  width="10.73"
                  height="7.92"
                  transform="translate(506.72 283.96) rotate(165)"
                />
                <polygon
                  className={styles.cls6}
                  points="214.54 157.78 209.54 158.9 199.96 139.78 186.3 132.03 108.77 152.81 100.82 166.34 102.07 187.69 97.19 189.23 70.9 204.62 77.1 227.76 91.07 224.02 86.89 208.41 106.24 203.23 107.78 208.99 109.86 216.78 112.51 226.65 122.1 245.76 135.75 253.51 213.28 232.73 221.24 219.2 219.98 197.85 217.34 187.98 215.25 180.19 213.71 174.43 233.05 169.25 237.23 184.86 251.21 181.11 245 157.97 214.54 157.78"
                />
              </g>
              <polygon
                className={styles.cls6}
                points="160 192.58 199.11 215.16 221.14 177.01 144.04 132.49 99.52 209.6 137.51 231.53 160 192.58"
              />
              <polygon
                className={styles.cls6}
                points="160 192.58 196.75 213.8 217.42 178.01 145.03 136.22 103.24 208.6 138.87 229.17 160 192.58"
              />
              <circle className={styles.cls6} cx="160.51" cy="193.09" r="44" />
              <circle className={styles.cls6} cx="160.51" cy="193.09" r="52.48" />
              <g>
                <polygon
                  className={styles.cls6}
                  points="116.09 161.96 111.34 170.18 101.74 166.95 108.49 155.27 116.09 161.96"
                />
                <polygon
                  className={styles.cls6}
                  points="219.22 219.2 212.47 230.88 204.87 224.18 209.62 215.96 219.22 219.2"
                />
                <polygon
                  className={styles.cls6}
                  points="191.59 148.68 183.37 143.93 186.61 134.33 198.29 141.08 191.59 148.68"
                />
                <polygon
                  className={styles.cls6}
                  points="134.36 251.81 122.68 245.06 129.37 237.46 137.59 242.21 134.36 251.81"
                />
              </g>
              <circle className={styles.cls6} cx="160.51" cy="193.09" r="42.51" />
              <circle className={styles.cls6} cx="160.51" cy="193.09" r="43.5" />
              <rect
                className={styles.cls6}
                x="147.08"
                y="179.65"
                width="26.87"
                height="26.87"
                transform="translate(-44.51 48.12) rotate(-15)"
              />
              <rect
                className={styles.cls6}
                x="148.85"
                y="181.42"
                width="23.33"
                height="23.33"
                transform="translate(-44.51 48.12) rotate(-15)"
              />
              <path
                className={styles.cls6}
                d="m186.69,139.38l-27.71,47.99-47.99-27.71c-2-1.16-4.56-.47-5.72,1.53h0c-1.16,2-.47,4.56,1.53,5.72l47.99,27.71-27.71,47.99c-1.16,2-.47,4.56,1.53,5.72h0c2,1.16,4.56.47,5.72-1.53l27.71-47.99,47.99,27.71c2,1.16,4.56.47,5.72-1.53h0c1.16-2,.47-4.56-1.53-5.72l-47.99-27.71,27.71-47.99c1.16-2,.47-4.56-1.53-5.72h0c-2-1.16-4.56-.47-5.72,1.53Z"
              />
              <g>
                <circle className={styles.cls6} cx="108.69" cy="163.17" r="3" />
                <circle className={styles.cls6} cx="212.33" cy="223.01" r="3" />
              </g>
              <g>
                <circle className={styles.cls6} cx="190.43" cy="141.27" r="3" />
                <circle className={styles.cls6} cx="130.59" cy="244.91" r="3" />
              </g>
              <rect
                className={styles.cls6}
                x="112.9"
                y="163.87"
                width="9.49"
                height="8.93"
                transform="translate(-86.96 186.05) rotate(-60)"
              />
              <rect
                className={styles.cls6}
                x="198.58"
                y="213.34"
                width="9.49"
                height="8.93"
                transform="translate(-86.96 284.98) rotate(-60)"
              />
              <rect
                className={styles.cls6}
                x="180.47"
                y="145.77"
                width="9.49"
                height="8.93"
                transform="translate(99.93 -72.48) rotate(30)"
              />
              <rect
                className={styles.cls6}
                x="131"
                y="231.44"
                width="9.49"
                height="8.93"
                transform="translate(136.14 -36.27) rotate(30)"
              />
              <circle className={styles.cls6} cx="160.51" cy="193.09" r="25.5" />
              <circle className={styles.cls6} cx="160.51" cy="193.09" r="23" />
              <path
                className={styles.cls6}
                d="m144.92,184.09c-4.97,8.61-2.02,19.62,6.59,24.59s19.62,2.02,24.59-6.59c4.97-8.61,2.02-19.62-6.59-24.59s-19.62-2.02-24.59,6.59Zm30.31,17.5c-4.69,8.13-15.09,10.92-23.22,6.22s-10.92-15.09-6.22-23.22c4.69-8.13,15.09-10.92,23.22-6.22s10.92,15.09,6.22,23.22Z"
              />
              <circle className={styles.cls6} cx="160.51" cy="193.09" r="10" />
              <path
                className={styles.cls6}
                d="m107.3,213.51h9.65v46.49c0,2.66-2.16,4.83-4.83,4.83h0c-2.66,0-4.83-2.16-4.83-4.83v-46.49h0Z"
                transform="translate(-112.17 99.65) rotate(-33)"
              />
              <path
                className={styles.cls6}
                d="m225.39,183.37h0c2.66,0,4.83,2.16,4.83,4.83v46.49h-9.65v-46.49c0-2.66,2.16-4.83,4.83-4.83Z"
                transform="translate(439.53 429.58) rotate(-177)"
              />
              <rect
                className={styles.cls6}
                x="79.11"
                y="232.63"
                width="35.5"
                height="14.93"
                transform="translate(-58.84 33.25) rotate(-15)"
              />
              <rect
                className={styles.cls6}
                x="221.52"
                y="194.58"
                width="35.63"
                height="15.01"
                transform="translate(-44.15 68.83) rotate(-15)"
              />
              <rect
                className={styles.cls6}
                x="90.44"
                y="204.52"
                width="16.01"
                height="16.55"
                transform="translate(-51.72 32.73) rotate(-15)"
              />
              <rect
                className={styles.cls6}
                x="216.57"
                y="170.9"
                width="16.01"
                height="16.55"
                transform="translate(-38.72 64.23) rotate(-15)"
              />
              <circle className={styles.cls6} cx="105.12" cy="178.05" r="2.93" />
              <circle className={styles.cls6} cx="119.91" cy="233.16" r="2.93" />
              <circle className={styles.cls6} cx="216.05" cy="207.63" r="2.93" />
              <circle className={styles.cls6} cx="200.98" cy="152.51" r="2.93" />
              <g>
                <rect
                  className={styles.cls6}
                  x="70.99"
                  y="112.06"
                  width="15.92"
                  height="7.82"
                  transform="translate(-39.62 40.98) rotate(-23.44)"
                />
                <rect
                  className={styles.cls6}
                  x="68.82"
                  y="100.72"
                  width="86.68"
                  height="1.7"
                  transform="translate(-31.15 53.01) rotate(-23.44)"
                />
                <rect className={styles.cls6} x="150.05" y="74.16" width="7.6" height="18.14" rx="1.13" ry="1.13" />
                <path
                  className={styles.cls6}
                  d="m149.6,81.25h.45v3.96h-.45c-1.09,0-1.98-.89-1.98-1.98h0c0-1.09.89-1.98,1.98-1.98Z"
                />
              </g>
              <g>
                <g>
                  <g>
                    <polygon
                      className={styles.cls6}
                      points="142.88 333.3 142.26 336.02 132.86 336.71 122.4 334.3 114.26 329.55 114.89 326.84 142.88 333.3"
                    />
                    <polygon
                      className={styles.cls6}
                      points="131.02 330.56 131.32 334.52 130.69 337.24 124.12 335.72 124.74 333 126.75 329.58 131.02 330.56"
                    />
                    <rect
                      className={styles.cls6}
                      x="133.16"
                      y="328.5"
                      width="15.14"
                      height="1.69"
                      transform="translate(77.69 -23.22) rotate(13)"
                    />
                    <rect
                      className={styles.cls6}
                      x="110.93"
                      y="323.09"
                      width="12.73"
                      height="1.69"
                      transform="translate(75.88 -18.08) rotate(13)"
                    />
                    <rect
                      className={styles.cls6}
                      x="113.76"
                      y="321.98"
                      width="14.14"
                      height="5.55"
                      transform="translate(76.15 -18.86) rotate(13)"
                    />
                    <polygon
                      className={styles.cls6}
                      points="145.88 327.69 147.61 329.11 146.81 332.57 144.64 333.09 145.88 327.69"
                    />
                    <polygon
                      className={styles.cls6}
                      points="112.39 320.98 114.56 320.46 113.31 325.86 111.59 324.44 112.39 320.98"
                    />
                    <path
                      className={styles.cls6}
                      d="m127.1,328.2h3.72v1.26c0,1.03-.83,1.86-1.86,1.86h0c-1.03,0-1.86-.83-1.86-1.86v-1.26h0Z"
                      transform="translate(77.49 -20.56) rotate(13)"
                    />
                    <circle className={styles.cls6} cx="128.96" cy="329.76" r=".81" />
                    <rect
                      className={styles.cls6}
                      x="131.3"
                      y="326.03"
                      width="14.14"
                      height="5.55"
                      transform="translate(77.51 -22.7) rotate(13)"
                    />
                  </g>
                  <g>
                    <polygon
                      className={styles.cls6}
                      points="178.18 52.28 178.81 49.56 188.2 48.87 198.66 51.28 206.81 56.03 206.18 58.74 178.18 52.28"
                    />
                    <polygon
                      className={styles.cls6}
                      points="190.05 55.02 189.74 51.06 190.37 48.34 196.95 49.86 196.32 52.58 194.31 56 190.05 55.02"
                    />
                    <path
                      className={styles.cls6}
                      d="m190.25,54.26h3.72v1.26c0,1.03-.83,1.86-1.86,1.86h0c-1.03,0-1.86-.83-1.86-1.86v-1.26h0Z"
                      transform="translate(366.74 153.42) rotate(-167)"
                    />
                    <circle className={styles.cls6} cx="192.11" cy="55.82" r=".81" />
                  </g>
                </g>
                <g>
                  <g>
                    <polygon
                      className={styles.cls6}
                      points="205.56 327.05 206.18 329.77 198.01 334.47 187.54 336.83 178.14 336.09 177.53 333.37 205.56 327.05"
                    />
                    <polygon
                      className={styles.cls6}
                      points="193.68 329.73 195.67 333.17 196.29 335.89 189.7 337.37 189.09 334.65 189.41 330.69 193.68 329.73"
                    />
                    <path
                      className={styles.cls6}
                      d="m189.62,328.35h3.72v1.26c0,1.03-.83,1.86-1.86,1.86h0c-1.03,0-1.86-.83-1.86-1.86v-1.26h0Z"
                      transform="translate(-67.84 50.17) rotate(-12.7)"
                    />
                    <circle className={styles.cls6} cx="191.48" cy="329.91" r=".81" />
                  </g>
                  <g>
                    <polygon
                      className={styles.cls6}
                      points="115.5 58.53 114.89 55.81 123.05 51.11 133.53 48.75 142.92 49.49 143.53 52.21 115.5 58.53"
                    />
                    <polygon
                      className={styles.cls6}
                      points="127.38 55.85 125.39 52.41 124.78 49.69 131.36 48.21 131.98 50.93 131.65 54.89 127.38 55.85"
                    />
                    <rect
                      className={styles.cls6}
                      x="111.59"
                      y="60.31"
                      width="15.14"
                      height="1.69"
                      transform="translate(248.84 94.62) rotate(167.3)"
                    />
                    <rect
                      className={styles.cls6}
                      x="136.26"
                      y="55.03"
                      width="12.73"
                      height="1.69"
                      transform="translate(294.04 79.01) rotate(167.3)"
                    />
                    <rect
                      className={styles.cls6}
                      x="132.01"
                      y="53.89"
                      width="14.14"
                      height="5.55"
                      transform="translate(287.22 81.37) rotate(167.3)"
                    />
                    <polygon
                      className={styles.cls6}
                      points="115.23 64.88 113.06 64.35 112.28 60.89 114.01 59.47 115.23 64.88"
                    />
                    <polygon
                      className={styles.cls6}
                      points="148.32 56.4 146.59 57.82 145.37 52.41 147.54 52.94 148.32 56.4"
                    />
                    <path
                      className={styles.cls6}
                      d="m127.73,54.12h3.72v1.26c0,1.03-.83,1.86-1.86,1.86h0c-1.03,0-1.86-.83-1.86-1.86v-1.26h0Z"
                      transform="translate(268.24 81.5) rotate(167.3)"
                    />
                    <circle className={styles.cls6} cx="129.59" cy="55.67" r=".81" />
                    <rect
                      className={styles.cls6}
                      x="114.45"
                      y="57.85"
                      width="14.14"
                      height="5.55"
                      transform="translate(253.4 93.05) rotate(167.3)"
                    />
                  </g>
                </g>
                <g>
                  <g>
                    <polygon
                      className={styles.cls6}
                      points="142.88 333.3 142.26 336.02 132.86 336.71 122.4 334.3 114.26 329.55 114.89 326.84 142.88 333.3"
                    />
                    <polygon
                      className={styles.cls6}
                      points="131.02 330.56 131.32 334.52 130.69 337.24 124.12 335.72 124.74 333 126.75 329.58 131.02 330.56"
                    />
                    <rect
                      className={styles.cls6}
                      x="133.16"
                      y="328.5"
                      width="15.14"
                      height="1.69"
                      transform="translate(77.69 -23.22) rotate(13)"
                    />
                    <rect
                      className={styles.cls6}
                      x="110.93"
                      y="323.09"
                      width="12.73"
                      height="1.69"
                      transform="translate(75.88 -18.08) rotate(13)"
                    />
                    <rect
                      className={styles.cls6}
                      x="113.76"
                      y="321.98"
                      width="14.14"
                      height="5.55"
                      transform="translate(76.15 -18.86) rotate(13)"
                    />
                    <polygon
                      className={styles.cls6}
                      points="145.88 327.69 147.61 329.11 146.81 332.57 144.64 333.09 145.88 327.69"
                    />
                    <polygon
                      className={styles.cls6}
                      points="112.39 320.98 114.56 320.46 113.31 325.86 111.59 324.44 112.39 320.98"
                    />
                    <path
                      className={styles.cls6}
                      d="m127.1,328.2h3.72v1.26c0,1.03-.83,1.86-1.86,1.86h0c-1.03,0-1.86-.83-1.86-1.86v-1.26h0Z"
                      transform="translate(77.49 -20.56) rotate(13)"
                    />
                    <circle className={styles.cls6} cx="128.96" cy="329.76" r=".81" />
                    <rect
                      className={styles.cls6}
                      x="131.3"
                      y="326.03"
                      width="14.14"
                      height="5.55"
                      transform="translate(77.51 -22.7) rotate(13)"
                    />
                  </g>
                  <g>
                    <polygon
                      className={styles.cls6}
                      points="178.18 52.28 178.81 49.56 188.2 48.87 198.66 51.28 206.81 56.03 206.18 58.74 178.18 52.28"
                    />
                    <polygon
                      className={styles.cls6}
                      points="190.05 55.02 189.74 51.06 190.37 48.34 196.95 49.86 196.32 52.58 194.31 56 190.05 55.02"
                    />
                    <path
                      className={styles.cls6}
                      d="m190.25,54.26h3.72v1.26c0,1.03-.83,1.86-1.86,1.86h0c-1.03,0-1.86-.83-1.86-1.86v-1.26h0Z"
                      transform="translate(366.74 153.42) rotate(-167)"
                    />
                    <circle className={styles.cls6} cx="192.11" cy="55.82" r=".81" />
                  </g>
                </g>
                <g>
                  <g>
                    <polygon
                      className={styles.cls6}
                      points="142.88 333.3 142.26 336.02 132.86 336.71 122.4 334.3 114.26 329.55 114.89 326.84 142.88 333.3"
                    />
                    <polygon
                      className={styles.cls6}
                      points="131.02 330.56 131.32 334.52 130.69 337.24 124.12 335.72 124.74 333 126.75 329.58 131.02 330.56"
                    />
                    <rect
                      className={styles.cls6}
                      x="133.16"
                      y="328.5"
                      width="15.14"
                      height="1.69"
                      transform="translate(77.69 -23.22) rotate(13)"
                    />
                    <rect
                      className={styles.cls6}
                      x="110.93"
                      y="323.09"
                      width="12.73"
                      height="1.69"
                      transform="translate(75.88 -18.08) rotate(13)"
                    />
                    <rect
                      className={styles.cls6}
                      x="113.76"
                      y="321.98"
                      width="14.14"
                      height="5.55"
                      transform="translate(76.15 -18.86) rotate(13)"
                    />
                    <polygon
                      className={styles.cls6}
                      points="145.88 327.69 147.61 329.11 146.81 332.57 144.64 333.09 145.88 327.69"
                    />
                    <polygon
                      className={styles.cls6}
                      points="112.39 320.98 114.56 320.46 113.31 325.86 111.59 324.44 112.39 320.98"
                    />
                    <path
                      className={styles.cls6}
                      d="m127.1,328.2h3.72v1.26c0,1.03-.83,1.86-1.86,1.86h0c-1.03,0-1.86-.83-1.86-1.86v-1.26h0Z"
                      transform="translate(77.49 -20.56) rotate(13)"
                    />
                    <circle className={styles.cls6} cx="128.96" cy="329.76" r=".81" />
                    <rect
                      className={styles.cls6}
                      x="131.3"
                      y="326.03"
                      width="14.14"
                      height="5.55"
                      transform="translate(77.51 -22.7) rotate(13)"
                    />
                  </g>
                  <g>
                    <polygon
                      className={styles.cls6}
                      points="178.18 52.28 178.81 49.56 188.2 48.87 198.66 51.28 206.81 56.03 206.18 58.74 178.18 52.28"
                    />
                    <polygon
                      className={styles.cls6}
                      points="190.05 55.02 189.74 51.06 190.37 48.34 196.95 49.86 196.32 52.58 194.31 56 190.05 55.02"
                    />
                    <path
                      className={styles.cls6}
                      d="m190.25,54.26h3.72v1.26c0,1.03-.83,1.86-1.86,1.86h0c-1.03,0-1.86-.83-1.86-1.86v-1.26h0Z"
                      transform="translate(366.74 153.42) rotate(-167)"
                    />
                    <circle className={styles.cls6} cx="192.11" cy="55.82" r=".81" />
                  </g>
                </g>
                <g>
                  <g>
                    <polygon
                      className={styles.cls6}
                      points="142.88 333.3 142.26 336.02 132.86 336.71 122.4 334.3 114.26 329.55 114.89 326.84 142.88 333.3"
                    />
                    <polygon
                      className={styles.cls6}
                      points="131.02 330.56 131.32 334.52 130.69 337.24 124.12 335.72 124.74 333 126.75 329.58 131.02 330.56"
                    />
                    <rect
                      className={styles.cls6}
                      x="133.16"
                      y="328.5"
                      width="15.14"
                      height="1.69"
                      transform="translate(77.69 -23.22) rotate(13)"
                    />
                    <rect
                      className={styles.cls6}
                      x="110.93"
                      y="323.09"
                      width="12.73"
                      height="1.69"
                      transform="translate(75.88 -18.08) rotate(13)"
                    />
                    <rect
                      className={styles.cls6}
                      x="113.76"
                      y="321.98"
                      width="14.14"
                      height="5.55"
                      transform="translate(76.15 -18.86) rotate(13)"
                    />
                    <polygon
                      className={styles.cls6}
                      points="145.88 327.69 147.61 329.11 146.81 332.57 144.64 333.09 145.88 327.69"
                    />
                    <polygon
                      className={styles.cls6}
                      points="112.39 320.98 114.56 320.46 113.31 325.86 111.59 324.44 112.39 320.98"
                    />
                    <path
                      className={styles.cls6}
                      d="m127.1,328.2h3.72v1.26c0,1.03-.83,1.86-1.86,1.86h0c-1.03,0-1.86-.83-1.86-1.86v-1.26h0Z"
                      transform="translate(77.49 -20.56) rotate(13)"
                    />
                    <circle className={styles.cls6} cx="128.96" cy="329.76" r=".81" />
                    <rect
                      className={styles.cls6}
                      x="131.3"
                      y="326.03"
                      width="14.14"
                      height="5.55"
                      transform="translate(77.51 -22.7) rotate(13)"
                    />
                  </g>
                  <g>
                    <polygon
                      className={styles.cls6}
                      points="178.18 52.28 178.81 49.56 188.2 48.87 198.66 51.28 206.81 56.03 206.18 58.74 178.18 52.28"
                    />
                    <polygon
                      className={styles.cls6}
                      points="190.05 55.02 189.74 51.06 190.37 48.34 196.95 49.86 196.32 52.58 194.31 56 190.05 55.02"
                    />
                    <path
                      className={styles.cls6}
                      d="m190.25,54.26h3.72v1.26c0,1.03-.83,1.86-1.86,1.86h0c-1.03,0-1.86-.83-1.86-1.86v-1.26h0Z"
                      transform="translate(366.74 153.42) rotate(-167)"
                    />
                    <circle className={styles.cls6} cx="192.11" cy="55.82" r=".81" />
                  </g>
                </g>
                <g>
                  <g>
                    <polygon
                      className={styles.cls6}
                      points="237.57 73.97 239.32 71.79 248.08 75.26 256.45 81.99 261.72 89.8 259.97 91.97 237.57 73.97"
                    />
                    <polygon
                      className={styles.cls6}
                      points="247.07 81.6 248.52 77.9 250.26 75.73 255.52 79.96 253.78 82.13 250.48 84.34 247.07 81.6"
                    />
                    <rect
                      className={styles.cls6}
                      x="230.22"
                      y="77.62"
                      width="15.14"
                      height="1.69"
                      transform="translate(373.95 288.62) rotate(-141.2)"
                    />
                    <rect
                      className={styles.cls6}
                      x="250.17"
                      y="92.69"
                      width="12.73"
                      height="1.69"
                      transform="translate(397.86 327.18) rotate(-141.2)"
                    />
                    <rect
                      className={styles.cls6}
                      x="246.64"
                      y="88.49"
                      width="14.14"
                      height="5.55"
                      transform="translate(394.25 321.36) rotate(-141.2)"
                    />
                    <polygon
                      className={styles.cls6}
                      points="232.43 77.71 231.5 75.68 233.72 72.92 235.91 73.39 232.43 77.71"
                    />
                    <polygon
                      className={styles.cls6}
                      points="259.67 98.33 257.48 97.86 260.96 93.53 261.89 95.57 259.67 98.33"
                    />
                    <path
                      className={styles.cls6}
                      d="m246.72,81.66h3.72v1.26c0,1.03-.83,1.86-1.86,1.86h0c-1.03,0-1.86-.83-1.86-1.86v-1.26h0Z"
                      transform="translate(390.16 303.83) rotate(-141.2)"
                    />
                    <circle className={styles.cls6} cx="248.58" cy="83.21" r=".81" />
                    <rect
                      className={styles.cls6}
                      x="232.61"
                      y="77.21"
                      width="14.14"
                      height="5.55"
                      transform="translate(376.36 292.51) rotate(-141.2)"
                    />
                  </g>
                  <g>
                    <polygon
                      className={styles.cls6}
                      points="83.49 311.61 81.74 313.79 72.98 310.32 64.61 303.59 59.35 295.78 61.09 293.61 83.49 311.61"
                    />
                    <polygon
                      className={styles.cls6}
                      points="74 303.98 72.55 307.68 70.8 309.85 65.54 305.62 67.29 303.45 70.59 301.24 74 303.98"
                    />
                    <path
                      className={styles.cls6}
                      d="m70.63,300.81h3.72v1.26c0,1.03-.83,1.86-1.86,1.86h0c-1.03,0-1.86-.83-1.86-1.86v-1.26h0Z"
                      transform="translate(205.46 21.3) rotate(38.8)"
                    />
                    <circle className={styles.cls6} cx="72.49" cy="302.37" r=".81" />
                  </g>
                </g>
                <g>
                  <g>
                    <polygon
                      className={styles.cls6}
                      points="301.46 178.87 304.25 178.88 307.01 187.89 306.97 198.62 304.15 207.61 301.36 207.6 301.46 178.87"
                    />
                    <polygon
                      className={styles.cls6}
                      points="301.42 191.05 305.21 189.87 308 189.88 307.98 196.64 305.19 196.63 301.4 195.42 301.42 191.05"
                    />
                    <rect
                      className={styles.cls6}
                      x="290.51"
                      y="181"
                      width="15.14"
                      height="1.69"
                      transform="translate(115.2 479.29) rotate(-89.8)"
                    />
                    <rect
                      className={styles.cls6}
                      x="291.63"
                      y="205.06"
                      width="12.73"
                      height="1.69"
                      transform="translate(91.06 503.18) rotate(-89.8)"
                    />
                    <rect
                      className={styles.cls6}
                      x="290.94"
                      y="199.5"
                      width="14.14"
                      height="5.55"
                      transform="translate(94.7 499.57) rotate(-89.8)"
                    />
                    <polygon
                      className={styles.cls6}
                      points="295.32 177.19 296.33 175.19 299.88 175.2 300.87 177.21 295.32 177.19"
                    />
                    <polygon
                      className={styles.cls6}
                      points="296.2 211.34 295.21 209.33 300.76 209.35 299.75 211.35 296.2 211.34"
                    />
                    <path
                      className={styles.cls6}
                      d="m299.24,191.68h3.72v1.26c0,1.03-.83,1.86-1.86,1.86h0c-1.03,0-1.86-.83-1.86-1.86v-1.26h0Z"
                      transform="translate(106.81 493.66) rotate(-89.8)"
                    />
                    <circle className={styles.cls6} cx="301.1" cy="193.24" r=".81" />
                    <rect
                      className={styles.cls6}
                      x="291"
                      y="181.5"
                      width="14.14"
                      height="5.55"
                      transform="translate(112.76 481.7) rotate(-89.8)"
                    />
                  </g>
                  <g>
                    <polygon
                      className={styles.cls6}
                      points="19.6 206.71 16.82 206.7 14.06 197.69 14.09 186.96 16.92 177.97 19.7 177.98 19.6 206.71"
                    />
                    <polygon
                      className={styles.cls6}
                      points="19.65 194.53 15.85 195.7 13.06 195.7 13.09 188.94 15.88 188.95 19.66 190.16 19.65 194.53"
                    />
                    <path
                      className={styles.cls6}
                      d="m18.11,190.79h3.72v1.26c0,1.03-.83,1.86-1.86,1.86h0c-1.03,0-1.86-.83-1.86-1.86v-1.26h0Z"
                      transform="translate(212.38 173.05) rotate(90.2)"
                    />
                    <circle className={styles.cls6} cx="19.97" cy="192.34" r=".81" />
                  </g>
                </g>
                <g>
                  <g>
                    <polygon
                      className={styles.cls6}
                      points="293.56 241.36 296.07 242.58 294.64 251.89 289.95 261.55 283.51 268.43 281 267.21 293.56 241.36"
                    />
                    <polygon
                      className={styles.cls6}
                      points="288.24 252.32 292.16 252.9 294.67 254.12 291.72 260.2 289.21 258.98 286.32 256.25 288.24 252.32"
                    />
                    <path
                      className={styles.cls6}
                      d="m285.14,252.59h3.72v1.26c0,1.03-.83,1.86-1.86,1.86h0c-1.03,0-1.86-.83-1.86-1.86v-1.26h0Z"
                      transform="translate(-66.98 401.31) rotate(-64.1)"
                    />
                    <circle className={styles.cls6} cx="287" cy="254.15" r=".81" />
                  </g>
                  <g>
                    <polygon
                      className={styles.cls6}
                      points="27.51 144.22 25 143 26.42 133.69 31.11 124.03 37.55 117.15 40.06 118.37 27.51 144.22"
                    />
                    <polygon
                      className={styles.cls6}
                      points="32.83 133.26 28.9 132.68 26.39 131.46 29.34 125.38 31.85 126.6 34.74 129.33 32.83 133.26"
                    />
                    <rect
                      className={styles.cls6}
                      x="24.27"
                      y="142.16"
                      width="15.14"
                      height="1.69"
                      transform="translate(174.39 176.82) rotate(115.9)"
                    />
                    <rect
                      className={styles.cls6}
                      x="35.99"
                      y="120.52"
                      width="12.73"
                      height="1.69"
                      transform="translate(170.02 136.28) rotate(115.9)"
                    />
                    <rect
                      className={styles.cls6}
                      x="33.69"
                      y="121.86"
                      width="14.14"
                      height="5.55"
                      transform="translate(170.68 142.4) rotate(115.9)"
                    />
                    <polygon
                      className={styles.cls6}
                      points="32.31 148.39 30.54 149.76 27.35 148.21 27.32 145.97 32.31 148.39"
                    />
                    <polygon
                      className={styles.cls6}
                      points="46.32 117.24 46.35 119.48 41.36 117.06 43.13 115.69 46.32 117.24"
                    />
                    <path
                      className={styles.cls6}
                      d="m32.21,129.87h3.72v1.26c0,1.03-.83,1.86-1.86,1.86h0c-1.03,0-1.86-.83-1.86-1.86v-1.26h0Z"
                      transform="translate(167.18 158.2) rotate(115.9)"
                    />
                    <circle className={styles.cls6} cx="34.07" cy="131.43" r=".81" />
                    <rect
                      className={styles.cls6}
                      x="25.83"
                      y="138.05"
                      width="14.14"
                      height="5.55"
                      transform="translate(173.95 172.73) rotate(115.9)"
                    />
                  </g>
                </g>
                <g>
                  <g>
                    <polygon
                      className={styles.cls6}
                      points="259.33 294.24 261.07 296.43 255.75 304.21 247.33 310.87 238.55 314.28 236.81 312.09 259.33 294.24"
                    />
                    <polygon
                      className={styles.cls6}
                      points="249.79 301.81 253.07 304.04 254.8 306.23 249.51 310.42 247.78 308.23 246.36 304.53 249.79 301.81"
                    />
                    <rect
                      className={styles.cls6}
                      x="247.33"
                      y="292.62"
                      width="15.14"
                      height="1.69"
                      transform="translate(-127.15 221.81) rotate(-38.4)"
                    />
                    <rect
                      className={styles.cls6}
                      x="229.68"
                      y="307.56"
                      width="12.73"
                      height="1.69"
                      transform="translate(-140.5 213.33) rotate(-38.4)"
                    />
                    <rect
                      className={styles.cls6}
                      x="231.82"
                      y="303.37"
                      width="14.14"
                      height="5.55"
                      transform="translate(-138.49 214.61) rotate(-38.4)"
                    />
                    <polygon
                      className={styles.cls6}
                      points="256.82 288.4 259.01 287.94 261.21 290.72 260.26 292.75 256.82 288.4"
                    />
                    <polygon
                      className={styles.cls6}
                      points="230.68 310.39 231.63 308.37 235.07 312.71 232.88 313.17 230.68 310.39"
                    />
                    <path
                      className={styles.cls6}
                      d="m246.02,301.36h3.72v1.26c0,1.03-.83,1.86-1.86,1.86h0c-1.03,0-1.86-.83-1.86-1.86v-1.26h0Z"
                      transform="translate(-134.54 219.49) rotate(-38.4)"
                    />
                    <circle className={styles.cls6} cx="247.88" cy="302.92" r=".81" />
                    <rect
                      className={styles.cls6}
                      x="245.93"
                      y="292.19"
                      width="14.14"
                      height="5.55"
                      transform="translate(-128.49 220.95) rotate(-38.4)"
                    />
                  </g>
                  <g>
                    <polygon
                      className={styles.cls6}
                      points="61.73 91.34 60 89.15 65.32 81.37 73.73 74.71 82.52 71.3 84.25 73.49 61.73 91.34"
                    />
                    <polygon
                      className={styles.cls6}
                      points="71.28 83.77 67.99 81.54 66.26 79.35 71.55 75.16 73.28 77.35 74.71 81.05 71.28 83.77"
                    />
                    <path
                      className={styles.cls6}
                      d="m71.33,81.1h3.72v1.26c0,1.03-.83,1.86-1.86,1.86h0c-1.03,0-1.86-.83-1.86-1.86v-1.26h0Z"
                      transform="translate(181.88 101.98) rotate(141.6)"
                    />
                    <circle className={styles.cls6} cx="73.19" cy="82.66" r=".81" />
                  </g>
                </g>
                <g>
                  <g>
                    <polygon
                      className={styles.cls6}
                      points="281.48 119.13 284 117.93 290.39 124.85 295.01 134.54 296.37 143.87 293.85 145.07 281.48 119.13"
                    />
                    <polygon
                      className={styles.cls6}
                      points="286.73 130.13 289.63 127.42 292.15 126.22 295.06 132.31 292.54 133.52 288.61 134.07 286.73 130.13"
                    />
                    <path
                      className={styles.cls6}
                      d="m285.52,130.68h3.72v1.26c0,1.03-.83,1.86-1.86,1.86h0c-1.03,0-1.86-.83-1.86-1.86v-1.26h0Z"
                      transform="translate(291.75 448.55) rotate(-115.5)"
                    />
                    <circle className={styles.cls6} cx="287.38" cy="132.23" r=".81" />
                  </g>
                  <g>
                    <polygon
                      className={styles.cls6}
                      points="39.58 266.45 37.06 267.65 30.67 260.73 26.05 251.04 24.69 241.71 27.21 240.51 39.58 266.45"
                    />
                    <polygon
                      className={styles.cls6}
                      points="34.34 255.45 31.43 258.16 28.91 259.36 26.01 253.27 28.52 252.06 32.45 251.51 34.34 255.45"
                    />
                    <rect
                      className={styles.cls6}
                      x="33.77"
                      y="261.46"
                      width="15.14"
                      height="1.69"
                      transform="translate(260.29 112.07) rotate(64.5)"
                    />
                    <rect
                      className={styles.cls6}
                      x="24.62"
                      y="239.75"
                      width="12.73"
                      height="1.69"
                      transform="translate(234.8 109.05) rotate(64.5)"
                    />
                    <rect
                      className={styles.cls6}
                      x="25.47"
                      y="241.09"
                      width="14.14"
                      height="5.55"
                      transform="translate(238.64 109.51) rotate(64.5)"
                    />
                    <polygon
                      className={styles.cls6}
                      points="45.84 265.3 45.8 267.54 42.6 269.06 40.83 267.69 45.84 265.3"
                    />
                    <polygon
                      className={styles.cls6}
                      points="30.24 234.91 32 236.29 27 238.68 27.04 236.44 30.24 234.91"
                    />
                    <path
                      className={styles.cls6}
                      d="m31.82,251.79h3.72v1.26c0,1.03-.83,1.86-1.86,1.86h0c-1.03,0-1.86-.83-1.86-1.86v-1.26h0Z"
                      transform="translate(247.85 113.88) rotate(64.5)"
                    />
                    <circle className={styles.cls6} cx="33.68" cy="253.34" r=".81" />
                    <rect
                      className={styles.cls6}
                      x="33.22"
                      y="257.34"
                      width="14.14"
                      height="5.55"
                      transform="translate(257.72 111.76) rotate(64.5)"
                    />
                  </g>
                </g>
              </g>
            </g>
          </g>
          <g id="text">
            <g id="t1">
              <g className={styles.cls23}>
                <text className={styles.cls13} transform="translate(143.45 126.27)">
                  <tspan className={styles.cls19} x="0" y="0">
                    T
                  </tspan>
                  <tspan x="3.11" y="0">
                    eles
                  </tspan>
                  <tspan className={styles.cls15} x="14.91" y="0">
                    c
                  </tspan>
                  <tspan className={styles.cls20} x="18.23" y="0">
                    ope
                  </tspan>
                </text>
                <text className={styles.cls13} transform="translate(143.45 126.27)">
                  <tspan className={styles.cls19} x="0" y="0">
                    T
                  </tspan>
                  <tspan x="3.11" y="0">
                    eles
                  </tspan>
                  <tspan className={styles.cls15} x="14.91" y="0">
                    c
                  </tspan>
                  <tspan className={styles.cls20} x="18.23" y="0">
                    ope
                  </tspan>
                </text>
              </g>
            </g>
          </g>
          <g id="text-2" data-name="text">
            <g id="t1-2" data-name="t1">
              <g className={styles.cls23}>
                <text className={styles.cls13} transform="translate(30.29 189.03)">
                  <tspan x="0" y="0">
                    Do
                  </tspan>
                  <tspan className={styles.cls21} x="8.72" y="0">
                    m
                  </tspan>
                  <tspan x="15.1" y="0">
                    e
                  </tspan>
                  <tspan x="1.69" y="7.2">
                    Floor
                  </tspan>
                  <tspan x=".23" y="14.4">
                    bel
                  </tspan>
                  <tspan className={styles.cls16} x="9.54" y="14.4">
                    o
                  </tspan>
                  <tspan x="13.21" y="14.4">
                    w
                  </tspan>
                </text>
                <text className={styles.cls13} transform="translate(30.29 189.03)">
                  <tspan x="0" y="0">
                    Do
                  </tspan>
                  <tspan className={styles.cls21} x="8.72" y="0">
                    m
                  </tspan>
                  <tspan x="15.1" y="0">
                    e
                  </tspan>
                  <tspan x="1.69" y="7.2">
                    Floor
                  </tspan>
                  <tspan x=".23" y="14.4">
                    bel
                  </tspan>
                  <tspan className={styles.cls16} x="9.54" y="14.4">
                    o
                  </tspan>
                  <tspan x="13.21" y="14.4">
                    w
                  </tspan>
                </text>
              </g>
            </g>
          </g>
          <g id="text-3" data-name="text">
            <g id="t1-3" data-name="t1">
              <g className={styles.cls23}>
                <text className={styles.cls13} transform="translate(262.36 215.63)">
                  <tspan className={styles.cls19} x="0" y="0">
                    T
                  </tspan>
                  <tspan x="3.11" y="0">
                    eles
                  </tspan>
                  <tspan className={styles.cls15} x="14.91" y="0">
                    c
                  </tspan>
                  <tspan className={styles.cls20} x="18.23" y="0">
                    ope
                  </tspan>
                  <tspan x="-4.91" y="7.2">
                    Main
                  </tspan>
                  <tspan className={styles.cls24} x="10.03" y="7.2">
                    t
                  </tspan>
                  <tspan x="12.35" y="7.2">
                    ena
                  </tspan>
                  <tspan className={styles.cls25} x="23.58" y="7.2">
                    n
                  </tspan>
                  <tspan className={styles.cls15} x="27.65" y="7.2">
                    c
                  </tspan>
                  <tspan x="30.98" y="7.2">
                    e
                  </tspan>
                  <tspan x="1.66" y="14.4">
                    Plat
                  </tspan>
                  <tspan className={styles.cls15} x="13.56" y="14.4">
                    f
                  </tspan>
                  <tspan className={styles.cls20} x="15.54" y="14.4">
                    o
                  </tspan>
                  <tspan className={styles.cls22} x="19.3" y="14.4">
                    r
                  </tspan>
                  <tspan className={styles.cls18} x="21.66" y="14.4">
                    m
                  </tspan>
                </text>
                <text className={styles.cls13} transform="translate(262.36 215.63)">
                  <tspan className={styles.cls19} x="0" y="0">
                    T
                  </tspan>
                  <tspan x="3.11" y="0">
                    eles
                  </tspan>
                  <tspan className={styles.cls15} x="14.91" y="0">
                    c
                  </tspan>
                  <tspan className={styles.cls20} x="18.23" y="0">
                    ope
                  </tspan>
                  <tspan x="-4.91" y="7.2">
                    Main
                  </tspan>
                  <tspan className={styles.cls24} x="10.03" y="7.2">
                    t
                  </tspan>
                  <tspan x="12.35" y="7.2">
                    ena
                  </tspan>
                  <tspan className={styles.cls25} x="23.58" y="7.2">
                    n
                  </tspan>
                  <tspan className={styles.cls15} x="27.65" y="7.2">
                    c
                  </tspan>
                  <tspan x="30.98" y="7.2">
                    e
                  </tspan>
                  <tspan x="1.66" y="14.4">
                    Plat
                  </tspan>
                  <tspan className={styles.cls15} x="13.56" y="14.4">
                    f
                  </tspan>
                  <tspan className={styles.cls20} x="15.54" y="14.4">
                    o
                  </tspan>
                  <tspan className={styles.cls22} x="19.3" y="14.4">
                    r
                  </tspan>
                  <tspan className={styles.cls18} x="21.66" y="14.4">
                    m
                  </tspan>
                </text>
              </g>
            </g>
          </g>
          <g id="staris">
            <polyline className={styles.cls10} points="89.73 100.65 121.45 82.51 158.33 72.05" />
            <polyline className={styles.cls10} points="84.94 92.47 116.66 74.33 158.19 62.33" />
            <line className={styles.cls10} x1="85.75" y1="92.21" x2="90.33" y2="100.09" />
            <line className={styles.cls10} x1="88.26" y1="90.68" x2="92.84" y2="98.56" />
            <line className={styles.cls10} x1="90.94" y1="89.12" x2="95.52" y2="97" />
            <line className={styles.cls10} x1="93.45" y1="87.58" x2="98.03" y2="95.47" />
            <line className={styles.cls10} x1="96.31" y1="86.37" x2="100.89" y2="94.26" />
            <line className={styles.cls10} x1="98.82" y1="84.84" x2="103.4" y2="92.72" />
            <line className={styles.cls10} x1="101.5" y1="83.28" x2="106.08" y2="91.16" />
            <line className={styles.cls10} x1="104.01" y1="81.75" x2="108.59" y2="89.63" />
            <line className={styles.cls10} x1="106.5" y1="80.49" x2="111.08" y2="88.37" />
            <line className={styles.cls10} x1="109.01" y1="78.96" x2="113.59" y2="86.84" />
            <line className={styles.cls10} x1="111.68" y1="77.4" x2="116.26" y2="85.28" />
            <line className={styles.cls10} x1="114.19" y1="75.86" x2="118.77" y2="83.75" />
            <line className={styles.cls10} x1="116.66" y1="74.47" x2="121.24" y2="82.35" />
            <line className={styles.cls10} x1="125.66" y1="71.77" x2="128.05" y2="80.44" />
            <line className={styles.cls10} x1="128.52" y1="71.02" x2="130.91" y2="79.7" />
            <line className={styles.cls10} x1="131.36" y1="70.14" x2="133.75" y2="78.82" />
            <line className={styles.cls10} x1="134.08" y1="69.54" x2="136.47" y2="78.21" />
            <line className={styles.cls10} x1="136.94" y1="68.79" x2="139.33" y2="77.47" />
            <line className={styles.cls10} x1="139.77" y1="67.91" x2="142.17" y2="76.58" />
            <line className={styles.cls10} x1="142.87" y1="67.05" x2="145.26" y2="75.72" />
            <line className={styles.cls10} x1="145.73" y1="66.3" x2="148.12" y2="74.98" />
            <line className={styles.cls10} x1="148.57" y1="65.42" x2="150.96" y2="74.09" />
            <line className={styles.cls10} x1="151.43" y1="64.4" x2="153.82" y2="73.07" />
            <line className={styles.cls10} x1="154.29" y1="63.65" x2="156.68" y2="72.33" />
            <line className={styles.cls10} x1="157.12" y1="62.77" x2="158.4" y2="67.58" />
            <g id="Arrow-2" data-name="Arrow">
              <polygon className={styles.cls9} points="157.75 71.39 155.72 63.99 159.2 67.02 157.75 71.39" />
              <polyline className={styles.cls2} points="158.52 67.4 119.68 77.86 89.43 95.23" />
            </g>
          </g>
          <g id="stairs2">
            <g>
              <path
                className={styles.cls12}
                d="m100.02,329.83c-.22-.1-.43-.19-.65-.29l-4.06,9.13c.22.1.43.19.65.29l4.06-9.13Z"
              />
              <path
                className={styles.cls12}
                d="m102.42,330.86c-.22-.09-.43-.19-.65-.28l-3.91,9.22c.22.09.43.19.65.28l3.91-9.22Z"
              />
              <path
                className={styles.cls12}
                d="m104.83,331.86c-.22-.09-.44-.17-.66-.26l-3.74,9.26c.22.09.44.18.66.27l3.75-9.27Z"
              />
              <path
                className={styles.cls12}
                d="m109.71,333.72c-.22-.08-.45-.16-.67-.24l-3.42,9.39c.22.08.44.17.67.25l3.42-9.4Z"
              />
              <path
                className={styles.cls12}
                d="m97.65,328.74c-.21-.1-.43-.2-.64-.3l-4.23,9.07c.21.1.43.21.64.31l4.23-9.08Z"
              />
              <path
                className={styles.cls12}
                d="m107.26,332.81c-.22-.08-.44-.17-.66-.26l-3.59,9.35c.22.09.44.16.67.25l3.58-9.34Z"
              />
              <path
                className={styles.cls12}
                d="m92.95,326.46c-.21-.11-.42-.21-.63-.32l-4.54,8.91c.21.11.42.22.63.33l4.54-8.92Z"
              />
              <path
                className={styles.cls12}
                d="m86.07,322.74c-.21-.12-.41-.24-.61-.36l-5,8.67c.2.12.41.25.61.36l5.01-8.67Z"
              />
              <path
                className={styles.cls12}
                d="m95.28,327.64c-.21-.1-.42-.22-.63-.32l-4.38,8.99c.21.1.43.2.64.31l4.38-8.98Z"
              />
              <path
                className={styles.cls12}
                d="m88.34,324.02c-.21-.11-.42-.22-.62-.34l-4.85,8.74c.21.12.41.23.62.34l4.85-8.75Z"
              />
              <path
                className={styles.cls12}
                d="m83.82,321.42c-.2-.12-.41-.24-.61-.36l-5.15,8.56c.2.12.41.24.61.36l5.15-8.57Z"
              />
              <path
                className={styles.cls12}
                d="m112.17,334.59c-.22-.08-.45-.16-.67-.24l-3.26,9.46c.22.08.45.15.67.23l3.25-9.45Z"
              />
              <path
                className={styles.cls12}
                d="m90.63,325.27c-.21-.11-.41-.23-.62-.34l-4.7,8.84c.21.11.42.22.63.33l4.69-8.83Z"
              />
              <path
                className={styles.cls12}
                d="m127.22,338.86c-.23-.05-.46-.1-.69-.15l-2.25,9.73c.23.05.46.11.69.16l2.25-9.74Z"
              />
              <path
                className={styles.cls12}
                d="m132.33,339.92c-.23-.04-.47-.08-.7-.13l-1.91,9.81c.23.05.46.1.7.14l1.91-9.83Z"
              />
              <path
                className={styles.cls12}
                d="m134.9,340.39c-.23-.04-.47-.09-.7-.13l-1.74,9.85c.23.04.47.08.7.12l1.74-9.84Z"
              />
              <path
                className={styles.cls12}
                d="m140.06,341.19c-.23-.03-.47-.07-.7-.1l-1.39,9.9c.23.03.47.07.7.1l1.39-9.9Z"
              />
              <path
                className={styles.cls12}
                d="m137.48,340.81c-.23-.04-.47-.07-.7-.1l-1.57,9.88c.23.04.47.07.7.11l1.57-9.89Z"
              />
              <path
                className={styles.cls12}
                d="m142.65,341.51c-.23-.03-.47-.05-.71-.08l-1.22,9.94c.23.03.47.05.71.08l1.22-9.93Z"
              />
              <path
                className={styles.cls12}
                d="m145.24,341.81c-.24-.02-.47-.06-.71-.08l-1.04,9.94c.24.02.47.05.71.08l1.04-9.94Z"
              />
              <path
                className={styles.cls12}
                d="m117.13,336.19c-.23-.07-.45-.15-.68-.22l-2.92,9.56c.23.07.45.14.68.21l2.92-9.55Z"
              />
              <path
                className={styles.cls12}
                d="m119.64,336.91c-.23-.06-.46-.13-.68-.19l-2.76,9.63c.23.07.46.13.68.19l2.76-9.63Z"
              />
              <path
                className={styles.cls12}
                d="m114.65,335.4c-.23-.07-.45-.14-.68-.22l-3.09,9.52c.23.07.45.15.67.23l3.1-9.53Z"
              />
              <path
                className={styles.cls12}
                d="m124.69,338.25c-.23-.06-.46-.11-.69-.17l-2.42,9.72c.23.06.46.11.69.16l2.42-9.71Z"
              />
              <path
                className={styles.cls12}
                d="m122.15,337.62c-.23-.06-.46-.12-.69-.19l-2.59,9.65c.23.06.46.12.69.19l2.59-9.65Z"
              />
              <path
                className={styles.cls12}
                d="m129.77,339.41c-.23-.05-.46-.1-.69-.15l-2.08,9.79c.23.05.46.09.7.14l2.08-9.78Z"
              />
            </g>
            <path className={styles.cls10} d="m47.29,286.26l-10.6,7.36c29.24,35.98,73.85,58.97,123.83,58.97" />
            <path className={styles.cls10} d="m160.51,342.59c-39.63,0-75.65-15.43-102.41-40.6l11.16-12.73-3.56-6.07" />
            <g id="TopStairs">
              <polygon className={styles.cls9} points="81.24 321.28 77.27 327.84 77.06 323.23 81.24 321.28" />
            </g>
            <path className={styles.cls2} d="m78.16,323.76s31.24,21.03,73.76,23.36" />
          </g>
          <g id="Dome">
            <g>
              <line className={styles.cls3} x1="170.53" y1="192.79" x2="150.53" y2="192.79" />
              <line className={styles.cls3} x1="160.53" y1="202.79" x2="160.53" y2="182.79" />
            </g>
            <g id="Solid_Walls" data-name="Solid Walls">
              <circle className={styles.cls4} cx="160.53" cy="192.79" r="146.5" />
              <circle
                className={styles.cls5}
                cx="160.53"
                cy="192.79"
                r="134.53"
                transform="translate(-89.3 169.98) rotate(-45)"
              />
            </g>
          </g>
        </g>

        <rect id={this.overlayId} pointerEvents="all" fill="none" width="882.42" height="461.23" />

        <g id={this.deviceId}>{!this.props.hideHVAC && this.getDevices()}</g>
      </React.Fragment>
    );
  }
}
