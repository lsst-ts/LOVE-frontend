import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './MTDome.module.css';

const heightsLouvers = [
  19,
  35,
  19,
  35,
  35,
  35,
  35,
  35,
  35,
  35,
  35,
  19,
  35,
  35,
  19,
  19,
  35,
  19,
  19,
  35,
  19,
  35,
  35,
  35,
  35,
  35,
  35,
  35,
  35,
  19,
  35,
  35,
  19,
  35,
];

export default class MTDomeLouvers extends Component {
  constructor(props) {
    super(props);
  }

  componentDidUpdate(prevProps) {}

  render() {
    const actualPositionLouvers = this.props?.actualPositionLouvers;
    const commandedPositionLouvers = this.props?.commandedPositionLouvers;
    console.log(actualPositionLouvers);

    return (
      <svg className={styles.svgLouvers} height={240} width={240} viewBox="0 0 560 192">
        {/* from left to right (1) */}
        {/* A1, A2, A3 */}
        <g>
          <polygon
            className={styles.louver2}
            points="14.27 173.15 67.27 173.15 67.27 49.15 14.27 126.15 14.27 173.15"
          />
          <rect className={styles.louver3} x="34.52" y="134.15" width="27" height="35" />
          <rect className={styles.louver3} x="34.52" y="105.15" width="27" height="19" />

          {/* A2 */}
          <rect
            className={styles.louver4}
            x="34.52"
            y="105.15"
            width="27"
            height="19"
            style={{
              transformOrigin: 'top center',
              transformBox: 'fill-box',
              transform: `scaleY(${1 - actualPositionLouvers[0] / 100})`,
            }}
          />
          {/* A1 */}
          <rect
            className={styles.louver4}
            x="34.52"
            y="134.15"
            width="27"
            height="35"
            style={{
              transformOrigin: 'top center',
              transformBox: 'fill-box',
              transform: `scaleY(${1 - actualPositionLouvers[1] / 100})`,
            }}
          />
          {/* A2 */}
          <line
            className={styles.louver5}
            x1="34.52"
            y1="105.15"
            x2="61.52"
            y2="105.15"
            style={{
              transformOrigin: 'top center',
              transformBox: 'fill-box',
              transform: `translateY(${(heightsLouvers[0] / 100) * commandedPositionLouvers[0]}px)`,
            }}
          />
          {/* A1 */}
          <line
            className={styles.louver5}
            x1="34.52"
            y1="134.15"
            x2="61.52"
            y2="134.15"
            style={{
              transformOrigin: 'top center',
              transformBox: 'fill-box',
              transform: `translateY(${(heightsLouvers[1] / 100) * commandedPositionLouvers[1]}px)`,
            }}
          />
        </g>

        {/* from left to right (2) */}
        {/* B1, B2, B3 */}
        <g>
          <polygon
            className={styles.louver1}
            points="106.27 173.15 67.27 173.15 67.27 49.15 106.27 32.15 106.27 173.15"
          />

          <rect className={styles.louver3} x="73.27" y="60.15" width="27" height="19" />
          <rect className={styles.louver3} x="73.27" y="89.15" width="27" height="35" />
          <rect className={styles.louver3} x="73.27" y="134.15" width="27" height="35" />

          {/* B3 */}
          <rect
            className={styles.louver4}
            x="73.27"
            y="60.15"
            width="27"
            height="19"
            style={{
              transformOrigin: 'top center',
              transformBox: 'fill-box',
              transform: `scaleY(${1 - actualPositionLouvers[2] / 100})`,
            }}
          />
          {/* B2 */}
          <rect
            className={styles.louver4}
            x="73.27"
            y="89.15"
            width="27"
            height="35"
            style={{
              transformOrigin: 'top center',
              transformBox: 'fill-box',
              transform: `scaleY(${1 - actualPositionLouvers[3] / 100})`,
            }}
          />
          {/* B1 */}
          <rect
            className={styles.louver4}
            x="73.27"
            y="134.15"
            width="27"
            height="35"
            style={{
              transformOrigin: 'top center',
              transformBox: 'fill-box',
              transform: `scaleY(${1 - actualPositionLouvers[4] / 100})`,
            }}
          />

          {/* B3 */}
          <line
            className={styles.louver5}
            x1="73.27"
            y1="60.15"
            x2="100.27"
            y2="60.15"
            style={{
              transformOrigin: 'top center',
              transformBox: 'fill-box',
              transform: `translateY(${(heightsLouvers[2] / 100) * commandedPositionLouvers[2]}px)`,
            }}
          />
          {/* B2 */}
          <line
            className={styles.louver5}
            x1="73.27"
            y1="89.15"
            x2="100.27"
            y2="89.15"
            style={{
              transformOrigin: 'top center',
              transformBox: 'fill-box',
              transform: `translateY(${(heightsLouvers[3] / 100) * commandedPositionLouvers[3]}px)`,
            }}
          />
          {/* B1 */}
          <line
            className={styles.louver5}
            x1="73.27"
            y1="134.15"
            x2="100.27"
            y2="134.15"
            style={{
              transformOrigin: 'top center',
              transformBox: 'fill-box',
              transform: `translateY(${(heightsLouvers[4] / 100) * commandedPositionLouvers[4]}px)`,
            }}
          />
        </g>

        {/* from left to right (3) */}
        {/* C1, C2, C3 */}
        <g>
          <polygon
            className={styles.louver2}
            points="106.27 173.15 145.27 173.15 145.27 19.15 106.27 32.15 106.27 173.15"
          />

          <rect className={styles.louver3} x="112.27" y="44.15" width="27" height="35" />
          <rect className={styles.louver3} x="112.27" y="89.15" width="27" height="35" />
          <rect className={styles.louver3} x="112.27" y="134.15" width="27" height="35" />

          {/* C3 */}
          <rect
            className={styles.louver4}
            x="112.27"
            y="44.15"
            width="27"
            height="35"
            style={{
              transformOrigin: 'top center',
              transformBox: 'fill-box',
              transform: `scaleY(${1 - actualPositionLouvers[5] / 100})`,
            }}
          />
          {/* C3 */}
          <rect
            className={styles.louver4}
            x="112.27"
            y="89.15"
            width="27"
            height="35"
            style={{
              transformOrigin: 'top center',
              transformBox: 'fill-box',
              transform: `scaleY(${1 - actualPositionLouvers[6] / 100})`,
            }}
          />
          {/* C1 */}
          <rect
            className={styles.louver4}
            x="112.27"
            y="134.15"
            width="27"
            height="35"
            style={{
              transformOrigin: 'top center',
              transformBox: 'fill-box',
              transform: `scaleY(${1 - actualPositionLouvers[7] / 100})`,
            }}
          />
          {/* C3 */}
          <line
            className={styles.louver5}
            x1="112.27"
            y1="44.15"
            x2="139.27"
            y2="44.15"
            style={{
              transformOrigin: 'top center',
              transformBox: 'fill-box',
              transform: `translateY(${(heightsLouvers[5] / 100) * commandedPositionLouvers[5]}px)`,
            }}
          />
          {/* C2 */}
          <line
            className={styles.louver5}
            x1="112.27"
            y1="89.15"
            x2="139.27"
            y2="89.15"
            style={{
              transformOrigin: 'top center',
              transformBox: 'fill-box',
              transform: `translateY(${(heightsLouvers[6] / 100) * commandedPositionLouvers[6]}px)`,
            }}
          />
          {/* C1 */}
          <line
            className={styles.louver5}
            x1="112.27"
            y1="134.15"
            x2="139.27"
            y2="134.15"
            style={{
              transformOrigin: 'top center',
              transformBox: 'fill-box',
              transform: `translateY(${(heightsLouvers[7] / 100) * commandedPositionLouvers[7]}px)`,
            }}
          />
        </g>

        {/* from left to right (4) */}
        {/* D1, D2, D3 */}
        <g>
          <polygon
            className={styles.louver2}
            points="184.27 173.15 145.27 173.15 145.27 19.15 184.27 35.15 184.27 173.15"
          />

          <rect className={styles.louver3} x="151.27" y="44.15" width="27" height="35" />
          <rect className={styles.louver3} x="151.27" y="89.15" width="27" height="35" />
          <rect className={styles.louver3} x="151.27" y="134.15" width="27" height="35" />

          {/* D3 */}
          <rect
            className={styles.louver4}
            x="151.27"
            y="44.15"
            width="27"
            height="35"
            style={{
              transformOrigin: 'top center',
              transformBox: 'fill-box',
              transform: `scaleY(${1 - actualPositionLouvers[8] / 100})`,
            }}
          />
          {/* D2 */}
          <rect
            className={styles.louver4}
            x="151.27"
            y="89.15"
            width="27"
            height="35"
            style={{
              transformOrigin: 'top center',
              transformBox: 'fill-box',
              transform: `scaleY(${1 - actualPositionLouvers[9] / 100})`,
            }}
          />
          {/* D1 */}
          <rect
            className={styles.louver4}
            x="151.27"
            y="134.15"
            width="27"
            height="35"
            style={{
              transformOrigin: 'top center',
              transformBox: 'fill-box',
              transform: `scaleY(${1 - actualPositionLouvers[10] / 100})`,
            }}
          />
          {/* D3 */}
          <line
            className={styles.louver5}
            x1="151.27"
            y1="44.15"
            x2="178.27"
            y2="44.15"
            style={{
              transformOrigin: 'top center',
              transformBox: 'fill-box',
              transform: `translateY(${(heightsLouvers[8] / 100) * commandedPositionLouvers[8]}px)`,
            }}
          />
          {/* D2 */}
          <line
            className={styles.louver5}
            x1="151.27"
            y1="89.15"
            x2="178.27"
            y2="89.15"
            style={{
              transformOrigin: 'top center',
              transformBox: 'fill-box',
              transform: `translateY(${(heightsLouvers[9] / 100) * commandedPositionLouvers[9]}px)`,
            }}
          />
          {/* D1 */}
          <line
            className={styles.louver5}
            x1="151.27"
            y1="134.15"
            x2="178.27"
            y2="134.15"
            style={{
              transformOrigin: 'top center',
              transformBox: 'fill-box',
              transform: `translateY(${(heightsLouvers[10] / 100) * commandedPositionLouvers[10]}px)`,
            }}
          />
        </g>

        {/* from left to right (5) */}
        {/* E1, E2, E3 */}
        <g>
          <polygon
            className={styles.louver1}
            points="184.27 173.15 232.27 173.15 232.27 53.15 184.27 35.15 184.27 173.15"
          />

          <rect className={styles.louver3} x="194.77" y="60.15" width="27" height="19" />
          <rect className={styles.louver3} x="194.77" y="89.15" width="27" height="35" />
          <rect className={styles.louver3} x="194.77" y="134.15" width="27" height="35" />

          {/* E3 */}
          <rect
            className={styles.louver4}
            x="194.77"
            y="60.15"
            width="27"
            height="19"
            style={{
              transformOrigin: 'top center',
              transformBox: 'fill-box',
              transform: `scaleY(${1 - actualPositionLouvers[11] / 100})`,
            }}
          />
          {/* E2 */}
          <rect
            className={styles.louver4}
            x="194.77"
            y="89.15"
            width="27"
            height="35"
            style={{
              transformOrigin: 'top center',
              transformBox: 'fill-box',
              transform: `scaleY(${1 - actualPositionLouvers[12] / 100})`,
            }}
          />
          {/* E1 */}
          <rect
            className={styles.louver4}
            x="194.77"
            y="134.15"
            width="27"
            height="35"
            style={{
              transformOrigin: 'top center',
              transformBox: 'fill-box',
              transform: `scaleY(${1 - actualPositionLouvers[13] / 100})`,
            }}
          />
          {/* E3 */}
          <line
            className={styles.louver5}
            x1="194.77"
            y1="60.15"
            x2="221.77"
            y2="60.15"
            style={{
              transformOrigin: 'top center',
              transformBox: 'fill-box',
              transform: `translateY(${(heightsLouvers[11] / 100) * commandedPositionLouvers[11]}px)`,
            }}
          />
          {/* E2 */}
          <line
            className={styles.louver5}
            x1="194.77"
            y1="89.15"
            x2="221.77"
            y2="89.15"
            style={{
              transformOrigin: 'top center',
              transformBox: 'fill-box',
              transform: `translateY(${(heightsLouvers[12] / 100) * commandedPositionLouvers[12]}px)`,
            }}
          />
          {/* E1 */}
          <line
            className={styles.louver5}
            x1="194.77"
            y1="134.15"
            x2="221.77"
            y2="134.15"
            style={{
              transformOrigin: 'top center',
              transformBox: 'fill-box',
              transform: `translateY(${(heightsLouvers[13] / 100) * commandedPositionLouvers[13]}px)`,
            }}
          />
        </g>

        {/* from left to right (6) (the middle) */}
        {/* F1,F2,F3,G1,G2,G3 */}
        <g>
          <rect className={styles.louver1} x="232.27" y="53.15" width="96" height="120" />

          <rect className={styles.louver3} x="244.52" y="60.15" width="27" height="19" />
          <rect className={styles.louver3} x="244.52" y="93.15" width="27" height="19" />
          <rect className={styles.louver3} x="239.52" y="134.15" width="27" height="35" />

          {/* F3 */}
          <rect
            className={styles.louver3}
            x="289.02"
            y="60.15"
            width="27"
            height="19"
            // transform="translate(605.03 139.3) rotate(-180)"
            style={{
              transformOrigin: 'top center',
              transformBox: 'fill-box',
              transform: `scaleY(${1 - actualPositionLouvers[14] / 100})`,
            }}
          />
          {/* F2 */}
          <rect
            className={styles.louver3}
            x="289.02"
            y="93.15"
            width="27"
            height="19"
            // transform="translate(605.03 205.3) rotate(-180)"
            style={{
              transformOrigin: 'top center',
              transformBox: 'fill-box',
              transform: `scaleY(${1 - actualPositionLouvers[15] / 100})`,
            }}
          />
          {/* F1 */}
          <rect
            className={styles.louver3}
            x="294.02"
            y="134.15"
            width="27"
            height="35"
            // transform="translate(615.03 303.3) rotate(-180)"
            style={{
              transformOrigin: 'top center',
              transformBox: 'fill-box',
              transform: `scaleY(${1 - actualPositionLouvers[16] / 100})`,
            }}
          />

          <rect className={styles.louver4} x="244.52" y="60.15" width="27" height="19" />
          <rect className={styles.louver4} x="244.52" y="93.15" width="27" height="19" />
          <rect className={styles.louver4} x="239.52" y="134.15" width="27" height="35" />

          {/* G3 */}
          <rect
            className={styles.louver4}
            x="289.02"
            y="60.15"
            width="27"
            height="19"
            // transform="translate(605.03 139.3) rotate(-180)"
            style={{
              transformOrigin: 'top center',
              transformBox: 'fill-box',
              transform: `scaleY(${1 - actualPositionLouvers[17] / 100})`,
            }}
          />
          {/* G2 */}
          <rect
            className={styles.louver4}
            x="289.02"
            y="93.15"
            width="27"
            height="19"
            // transform="translate(605.03 205.3) rotate(-180)"
            style={{
              transformOrigin: 'top center',
              transformBox: 'fill-box',
              transform: `scaleY(${1 - actualPositionLouvers[18] / 100})`,
            }}
          />
          {/* G1 */}
          <rect
            className={styles.louver4}
            x="294.02"
            y="134.15"
            width="27"
            height="35"
            // transform="translate(615.03 303.3) rotate(-180)"
            style={{
              transformOrigin: 'top center',
              transformBox: 'fill-box',
              transform: `scaleY(${1 - actualPositionLouvers[19] / 100})`,
            }}
          />
          {/* F3 */}
          <line
            className={styles.louver5}
            x1="244.52"
            y1="60.15"
            x2="271.52"
            y2="60.15"
            style={{
              transformOrigin: 'top center',
              transformBox: 'fill-box',
              transform: `translateY(${(heightsLouvers[14] / 100) * commandedPositionLouvers[14]}px)`,
              stroke: 'violet',
            }}
          />
          {/* F2 */}
          <line
            className={styles.louver5}
            x1="244.52"
            y1="93.15"
            x2="271.52"
            y2="93.15"
            style={{
              transformOrigin: 'top center',
              transformBox: 'fill-box',
              transform: `translateY(${(heightsLouvers[15] / 100) * commandedPositionLouvers[15]}px)`,
            }}
          />
          {/* F1 */}
          <line
            className={styles.louver5}
            x1="239.52"
            y1="134.15"
            x2="266.52"
            y2="134.15"
            style={{
              transformOrigin: 'top center',
              transformBox: 'fill-box',
              transform: `translateY(${(heightsLouvers[16] / 100) * commandedPositionLouvers[16]}px)`,
            }}
          />
          {/* G3 */}
          <line
            className={styles.louver5}
            x1="316.02"
            y1="60.15"
            x2="289.02"
            y2="60.15"
            style={{
              transformOrigin: 'top center',
              transformBox: 'fill-box',
              transform: `translateY(${(heightsLouvers[17] / 100) * commandedPositionLouvers[17]}px)`,
              stroke: 'green',
            }}
          />
          {/* G2 */}
          <line
            className={styles.louver5}
            x1="316.02"
            y1="93.15"
            x2="289.02"
            y2="93.15"
            style={{
              transformOrigin: 'top center',
              transformBox: 'fill-box',
              transform: `translateY(${(heightsLouvers[18] / 100) * commandedPositionLouvers[18]}px)`,
            }}
          />
          {/* G1 */}
          <line
            className={styles.louver5}
            x1="321.02"
            y1="134.15"
            x2="294.02"
            y2="134.15"
            style={{
              transformOrigin: 'top center',
              transformBox: 'fill-box',
              transform: `translateY(${(heightsLouvers[19] / 100) * commandedPositionLouvers[19]}px)`,
            }}
          />
        </g>

        {/* from left to right (7) */}
        {/* H1, H2, H3 */}
        <g>
          <polygon
            className={styles.louver1}
            points="376.27 173.15 328.27 173.15 328.27 53.15 376.27 35.15 376.27 173.15"
          />

          <rect
            className={styles.louver3}
            x="382.27"
            y="134.15"
            width="27"
            height="35"
            // transform="translate(791.53 303.3) rotate(-180)"
          />
          <rect
            className={styles.louver3}
            x="338.77"
            y="89.15"
            width="27"
            height="35"
            // transform="translate(704.53 213.3) rotate(-180)"
          />
          <rect
            className={styles.louver3}
            x="338.77"
            y="134.15"
            width="27"
            height="35"
            // transform="translate(704.53 303.3) rotate(-180)"
          />
          {/* H3 */}
          <rect
            className={styles.louver4}
            x="339.27"
            y="60.15"
            width="26"
            height="19"
            // transform="translate(704.53 139.3) rotate(-180)"
            style={{
              transformOrigin: 'top center',
              transformBox: 'fill-box',
              transform: `scaleY(${1 - actualPositionLouvers[20] / 100})`,
            }}
          />
          {/* H2 */}
          <rect
            className={styles.louver4}
            x="338.77"
            y="89.15"
            width="27"
            height="35"
            // transform="translate(704.53 213.3) rotate(-180)"
            style={{
              transformOrigin: 'top center',
              transformBox: 'fill-box',
              transform: `scaleY(${1 - actualPositionLouvers[21] / 100})`,
            }}
          />
          {/* H1 */}
          <rect
            className={styles.louver4}
            x="338.77"
            y="134.15"
            width="27"
            height="35"
            // transform="translate(704.53 303.3) rotate(-180)"
            style={{
              transformOrigin: 'top center',
              transformBox: 'fill-box',
              transform: `scaleY(${1 - actualPositionLouvers[22] / 100})`,
            }}
          />
          {/* H3 */}
          <line
            className={styles.louver5}
            x1="365.27"
            y1="60.15"
            x2="339.27"
            y2="60.15"
            style={{
              transformOrigin: 'top center',
              transformBox: 'fill-box',
              transform: `translateY(${(heightsLouvers[20] / 100) * commandedPositionLouvers[20]}px)`,
            }}
          />
          {/* H2 */}
          <line
            className={styles.louver5}
            x1="365.77"
            y1="89.15"
            x2="338.77"
            y2="89.15"
            style={{
              transformOrigin: 'top center',
              transformBox: 'fill-box',
              transform: `translateY(${(heightsLouvers[21] / 100) * commandedPositionLouvers[21]}px)`,
            }}
          />
          {/* H1 */}
          <line
            className={styles.louver5}
            x1="365.77"
            y1="134.15"
            x2="338.77"
            y2="134.15"
            style={{
              transformOrigin: 'top center',
              transformBox: 'fill-box',
              transform: `translateY(${(heightsLouvers[22] / 100) * commandedPositionLouvers[22]}px)`,
            }}
          />
        </g>

        {/* from left to right (8) */}
        {/* I1, I2, I3 */}
        <g>
          <polygon
            className={styles.louver2}
            points="376.27 173.15 415.27 173.15 415.27 19.15 376.27 35.15 376.27 173.15"
          />

          <rect
            className={styles.louver3}
            x="382.27"
            y="44.15"
            width="27"
            height="35"
            transform="translate(791.53 123.3) rotate(-180)"
          />
          <rect
            className={styles.louver3}
            x="382.27"
            y="89.15"
            width="27"
            height="35"
            transform="translate(791.53 213.3) rotate(-180)"
          />
          <rect
            className={styles.louver3}
            x="421.27"
            y="134.15"
            width="27"
            height="35"
            transform="translate(869.53 303.3) rotate(-180)"
          />
          {/* I3 */}
          <rect
            className={styles.louver4}
            x="382.27"
            y="44.15"
            width="27"
            height="35"
            // transform="translate(791.53 123.3) rotate(-180)"
            style={{
              transformOrigin: 'top center',
              transformBox: 'fill-box',
              transform: `scaleY(${1 - actualPositionLouvers[23] / 100})`,
            }}
          />
          {/* I2 */}
          <rect
            className={styles.louver4}
            x="382.27"
            y="89.15"
            width="27"
            height="35"
            // transform="translate(791.53 213.3) rotate(-180)"
            style={{
              transformOrigin: 'top center',
              transformBox: 'fill-box',
              transform: `scaleY(${1 - actualPositionLouvers[24] / 100})`,
            }}
          />
          {/* I1 */}
          <rect
            className={styles.louver4}
            x="382.27"
            y="134.15"
            width="27"
            height="35"
            // transform="translate(791.53 303.3) rotate(-180)"
            style={{
              transformOrigin: 'top center',
              transformBox: 'fill-box',
              transform: `scaleY(${1 - actualPositionLouvers[25] / 100})`,
            }}
          />
          {/* I3 */}
          <line
            className={styles.louver5}
            x1="409.27"
            y1="44.15"
            x2="382.27"
            y2="44.15"
            style={{
              transformOrigin: 'top center',
              transformBox: 'fill-box',
              transform: `translateY(${(heightsLouvers[23] / 100) * commandedPositionLouvers[23]}px)`,
            }}
          />
          {/* I2 */}
          <line
            className={styles.louver5}
            x1="409.27"
            y1="89.15"
            x2="382.27"
            y2="89.15"
            style={{
              transformOrigin: 'top center',
              transformBox: 'fill-box',
              transform: `translateY(${(heightsLouvers[24] / 100) * commandedPositionLouvers[24]}px)`,
            }}
          />
          {/* I3 */}
          <line
            className={styles.louver5}
            x1="409.27"
            y1="134.15"
            x2="382.27"
            y2="134.15"
            style={{
              transformOrigin: 'top center',
              transformBox: 'fill-box',
              transform: `translateY(${(heightsLouvers[25] / 100) * commandedPositionLouvers[25]}px)`,
              stroke: 'yellow',
            }}
          />
        </g>

        {/* from left to right (9) */}
        {/* L1, L2, L3 */}
        <g>
          <polygon
            className={styles.louver2}
            points="454.27 173.15 415.27 173.15 415.27 19.15 454.27 32.15 454.27 173.15"
          />

          <rect
            className={styles.louver3}
            x="421.27"
            y="44.15"
            width="27"
            height="35"
            transform="translate(869.53 123.3) rotate(-180)"
          />
          <rect
            className={styles.louver3}
            x="421.27"
            y="89.15"
            width="27"
            height="35"
            transform="translate(869.53 213.3) rotate(-180)"
          />
          {/* L3 */}
          <rect
            className={styles.louver4}
            x="421.27"
            y="44.15"
            width="27"
            height="35"
            // transform="translate(869.53 123.3) rotate(-180)"
            style={{
              transformOrigin: 'top center',
              transformBox: 'fill-box',
              transform: `scaleY(${1 - actualPositionLouvers[26] / 100})`,
            }}
          />
          {/* L2 */}
          <rect
            className={styles.louver4}
            x="421.27"
            y="89.15"
            width="27"
            height="35"
            // transform="translate(869.53 213.3) rotate(-180)"
            style={{
              transformOrigin: 'top center',
              transformBox: 'fill-box',
              transform: `scaleY(${1 - actualPositionLouvers[27] / 100})`,
            }}
          />
          {/* L1 */}
          <rect
            className={styles.louver4}
            x="421.27"
            y="134.15"
            width="27"
            height="35"
            // transform="translate(869.53 303.3) rotate(-180)"
            style={{
              transformOrigin: 'top center',
              transformBox: 'fill-box',
              transform: `scaleY(${1 - actualPositionLouvers[28] / 100})`,
            }}
          />
          {/* L3 */}
          <line
            className={styles.louver5}
            x1="448.27"
            y1="44.15"
            x2="421.27"
            y2="44.15"
            style={{
              transformOrigin: 'top center',
              transformBox: 'fill-box',
              transform: `translateY(${(heightsLouvers[26] / 100) * commandedPositionLouvers[26]}px)`,
            }}
          />
          {/* L2 */}
          <line
            className={styles.louver5}
            x1="448.27"
            y1="89.15"
            x2="421.27"
            y2="89.15"
            style={{
              transformOrigin: 'top center',
              transformBox: 'fill-box',
              transform: `translateY(${(heightsLouvers[27] / 100) * commandedPositionLouvers[27]}px)`,
            }}
          />
          {/* L1 */}
          <line
            className={styles.louver5}
            x1="448.27"
            y1="134.15"
            x2="421.27"
            y2="134.15"
            style={{
              transformOrigin: 'top center',
              transformBox: 'fill-box',
              transform: `translateY(${(heightsLouvers[28] / 100) * commandedPositionLouvers[28]}px)`,
            }}
          />
        </g>

        {/* from left to right (10) */}
        {/* M1, M2, M3 */}
        <g>
          <polygon
            className={styles.louver1}
            points="454.27 173.15 493.27 173.15 493.27 49.15 454.27 32.15 454.27 173.15"
          />

          <rect
            className={styles.louver3}
            x="460.27"
            y="60.15"
            width="27"
            height="19"
            style={{ fill: 'red' }}
            transform="translate(947.53 139.3) rotate(-180)"
          />
          <rect
            className={styles.louver3}
            x="460.27"
            y="89.15"
            width="27"
            height="35"
            transform="translate(947.53 213.3) rotate(-180)"
          />
          <rect
            className={styles.louver3}
            x="460.27"
            y="134.15"
            width="27"
            height="35"
            transform="translate(947.53 303.3) rotate(-180)"
          />
          {/* M3 */}
          <rect
            className={styles.louver4}
            x="460.27"
            y="60.15"
            width="27"
            height="19"
            // transform="translate(947.53 139.3) rotate(-180)"
            style={{
              transformOrigin: 'top center',
              transformBox: 'fill-box',
              transform: `scaleY(${1 - actualPositionLouvers[29] / 100})`,
            }}
          />
          {/* M2 */}
          <rect
            className={styles.louver4}
            x="460.27"
            y="89.15"
            width="27"
            height="35"
            // transform="translate(947.53 213.3) rotate(-180)"
            style={{
              transformOrigin: 'top center',
              transformBox: 'fill-box',
              transform: `scaleY(${1 - actualPositionLouvers[30] / 100})`,
            }}
          />
          {/* M1 */}
          <rect
            className={styles.louver4}
            x="460.27"
            y="134.15"
            width="27"
            height="35"
            // transform="translate(947.53 303.3) rotate(-180)"
            style={{
              transformOrigin: 'top center',
              transformBox: 'fill-box',
              transform: `scaleY(${1 - actualPositionLouvers[31] / 100})`,
            }}
          />
          {/* M3 */}
          <line
            className={styles.louver5}
            x1="487.27"
            y1="60.15"
            x2="460.27"
            y2="60.15"
            style={{
              transformOrigin: 'top center',
              transformBox: 'fill-box',
              transform: `translateY(${(heightsLouvers[29] / 100) * commandedPositionLouvers[29]}px)`,
              stroke: 'green',
            }}
          />
          {/* M2 */}
          <line
            className={styles.louver5}
            x1="487.27"
            y1="89.15"
            x2="460.27"
            y2="89.15"
            style={{
              transformOrigin: 'top center',
              transformBox: 'fill-box',
              transform: `translateY(${(heightsLouvers[30] / 100) * commandedPositionLouvers[30]}px)`,
            }}
          />
          {/* M1 */}
          <line
            className={styles.louver5}
            x1="487.27"
            y1="134.15"
            x2="460.27"
            y2="134.15"
            style={{
              transformOrigin: 'top center',
              transformBox: 'fill-box',
              transform: `translateY(${(heightsLouvers[31] / 100) * commandedPositionLouvers[31]}px)`,
            }}
          />
        </g>

        {/* from left to right (11) */}
        {/* N1, N2 */}
        <g>
          <polygon
            className={styles.louver2}
            points="546.27 173.15 493.27 173.15 493.27 49.15 546.27 126.15 546.27 173.15"
          />

          <rect
            className={styles.louver3}
            x="499.02"
            y="105.15"
            width="27"
            height="19"
            transform="translate(1025.03 229.3) rotate(-180)"
          />
          <rect
            className={styles.louver3}
            x="499.02"
            y="134.15"
            width="27"
            height="35"
            transform="translate(1025.03 303.3) rotate(-180)"
          />
          {/* N2 */}
          <rect
            className={styles.louver4}
            x="499.02"
            y="105.15"
            width="27"
            height="19"
            // transform="translate(1025.03 229.3) rotate(-180)"
            style={{
              transformOrigin: 'top center',
              transformBox: 'fill-box',
              transform: `scaleY(${1 - actualPositionLouvers[32] / 100})`,
            }}
          />
          {/* N1 */}
          <rect
            className={styles.louver4}
            x="499.02"
            y="134.15"
            width="27"
            height="35"
            // transform="translate(1025.03 303.3) rotate(-180)"
            style={{
              transformOrigin: 'top center',
              transformBox: 'fill-box',
              transform: `scaleY(${1 - actualPositionLouvers[33] / 100})`,
            }}
          />
          {/* N2 */}
          <line
            className={styles.louver5}
            x1="526.02"
            y1="105.15"
            x2="499.02"
            y2="105.15"
            style={{
              transformOrigin: 'top center',
              transformBox: 'fill-box',
              transform: `translateY(${(heightsLouvers[32] / 100) * commandedPositionLouvers[32]}px)`,
            }}
          />
          {/* N1 */}
          <line
            className={styles.louver5}
            x1="526.02"
            y1="134.15"
            x2="499.02"
            y2="134.15"
            style={{
              transformOrigin: 'top center',
              transformBox: 'fill-box',
              transform: `translateY(${(heightsLouvers[33] / 100) * commandedPositionLouvers[33]}px)`,
            }}
          />
        </g>
        {/* horizontal labels */}
        <g className={styles.louver6}>
          <text className={styles.louver7} transform="translate(44.18 189.34)">
            A
          </text>
          <text className={styles.louver7} transform="translate(82.93 189.34)">
            B
          </text>
          <text className={styles.louver7} transform="translate(122.09 189.34)">
            C
          </text>
          <text className={styles.louver7} transform="translate(160.63 189.34)">
            D
          </text>
          <text className={styles.louver7} transform="translate(204.91 189.34)">
            E
          </text>
          <text className={styles.louver7} transform="translate(249.81 189.34)">
            F
          </text>
          <text className={styles.louver7} transform="translate(303.65 189.34)">
            G
          </text>
          <text className={styles.louver7} transform="translate(348.22 189.34)">
            H
          </text>
          <text className={styles.louver7} transform="translate(394.12 189.34)">
            I
          </text>
          <text className={styles.louver7} transform="translate(431.74 189.34)">
            L
          </text>
          <text className={styles.louver7} transform="translate(468.98 189.34)">
            M
          </text>
          <text className={styles.louver7} transform="translate(508.47 189.34)">
            N
          </text>
        </g>
        {/* vertical labels */}
        <g className={styles.louver6}>
          <text className={styles.louver7} transform="translate(0.01 156.34)">
            1
          </text>
          <text className={styles.louver7} transform="translate(0.01 109.57)">
            2
          </text>
          <text className={styles.louver7} transform="translate(0.01 64.57)">
            3
          </text>
        </g>
        {/* back doors */}
        <g>
          <rect
            className={styles.louver3}
            x="278.6"
            y="37.15"
            width="4"
            height="184"
            transform="translate(409.75 -151.45) rotate(90)"
          />
          <rect className={styles.louver8} x="231.52" y="124.15" width="3" height="6" />
          <rect className={styles.louver8} x="271.52" y="124.15" width="3" height="6" />
          <rect
            className={styles.louver9}
            x="280.52"
            y="129.15"
            width="54"
            height="44"
            transform="translate(615.03 302.3) rotate(-180)"
          />
          <rect
            className={styles.louver8}
            x="326.02"
            y="124.15"
            width="3"
            height="6"
            transform="translate(655.03 254.3) rotate(-180)"
          />
          <rect
            className={styles.louver8}
            x="286.02"
            y="124.15"
            width="3"
            height="6"
            transform="translate(575.03 254.3) rotate(-180)"
          />
          <rect className={styles.louver9} x="226.02" y="129.15" width="54" height="44" />
        </g>
      </svg>
    );
  }
}
