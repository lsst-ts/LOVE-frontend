import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './MTDome.module.css';

export default class DomeShutter extends Component {
  static propTypes = {
    /** Skyview width */
    width: PropTypes.number,
    /** Skyview height */
    height: PropTypes.number,
    /** Azimuth position */
    azimuthPosition: PropTypes.number,
    /** Main door opening percentage */
    mainDoorOpeningPercentage: PropTypes.number,
    /** Droupout door opening percentage */
    dropoutDoorOpeningPercentage: PropTypes.number,
  };

  static defaultProps = {
    azelToPixel: () => {},
    width: 596,
    height: 596,
    azimuthPosition: 0,
    mainDoorOpeningPercentage: 0,
    dropoutDoorOpeningPercentage: 0,
  };

  constructor(props) {
    super(props);
    this.prevAzimuth = 0;
  }

  componentDidUpdate(prevProps) {
    if (prevProps.azimuthPosition !== this.props.azimuthPosition)
      this.prevAzimuth = this.closestEquivalentAngle(this.prevAzimuth, prevProps.azimuthPosition);
  }

  closestEquivalentAngle = (from, to) => {
    const delta = ((((to - from) % 360) + 540) % 360) - 180;
    return from + delta;
  };

  render() {
    const { width, height } = this.props;
    const offset = 10;
    const viewBoxSize = 596 - 2 * offset;
    const x0 = viewBoxSize / 2 + offset;
    const y0 = viewBoxSize / 2 + offset;
    const r = viewBoxSize / 2;
    const extraApperture = r / 4;
    const alpha = Math.PI / 12;
    const rSinAlpha = r * Math.sin(alpha);
    const rCosAlpha = r * Math.cos(alpha);
    const dropoutDoorWidth = (rCosAlpha + extraApperture) * 0.4;
    const mainDoorWidth = (rCosAlpha + extraApperture) * 0.6;
    const equivalentAzimuth = this.closestEquivalentAngle(this.prevAzimuth, this.props.azimuthPosition);
    return (
      <svg height={height} width={width} viewBox="0 0 560 192">
        {/* from left to right (1) */}
        <g>
          <polygon
            className={styles.louver2}
            points="14.27 173.15 67.27 173.15 67.27 49.15 14.27 126.15 14.27 173.15"
          />
          <rect className={styles.louver3} x="34.52" y="134.15" width="27" height="35" />
          <rect className={styles.louver3} x="34.52" y="105.15" width="27" height="19" />

          <rect className={styles.louver4} x="34.52" y="105.15" width="27" height="19" />
          <rect className={styles.louver4} x="34.52" y="134.15" width="27" height="35" />

          <line className={styles.louver5} x1="34.52" y1="105.15" x2="61.52" y2="105.15" />
          <line className={styles.louver5} x1="34.52" y1="134.15" x2="61.52" y2="134.15" />
        </g>

        {/* from left to right (2) */}
        <g>
          <polygon
            className={styles.louver1}
            points="106.27 173.15 67.27 173.15 67.27 49.15 106.27 32.15 106.27 173.15"
          />

          <rect className={styles.louver3} x="73.27" y="60.15" width="27" height="19" />
          <rect className={styles.louver3} x="73.27" y="89.15" width="27" height="35" />
          <rect className={styles.louver3} x="73.27" y="134.15" width="27" height="35" />

          <rect className={styles.louver4} x="73.27" y="60.15" width="27" height="19" />
          <rect className={styles.louver4} x="73.27" y="89.15" width="27" height="35" />
          <rect className={styles.louver4} x="73.27" y="134.15" width="27" height="35" />

          <line className={styles.louver5} x1="73.27" y1="60.15" x2="100.27" y2="60.15" />
          <line className={styles.louver5} x1="73.27" y1="89.15" x2="100.27" y2="89.15" />
          <line className={styles.louver5} x1="73.27" y1="134.15" x2="100.27" y2="134.15" />
        </g>

        {/* from left to right (3) */}
        <g>
          <polygon
            className={styles.louver2}
            points="106.27 173.15 145.27 173.15 145.27 19.15 106.27 32.15 106.27 173.15"
          />

          <rect className={styles.louver3} x="112.27" y="44.15" width="27" height="35" />
          <rect className={styles.louver3} x="112.27" y="89.15" width="27" height="35" />
          <rect className={styles.louver3} x="112.27" y="134.15" width="27" height="35" />

          <rect className={styles.louver4} x="112.27" y="44.15" width="27" height="35" />
          <rect className={styles.louver4} x="112.27" y="89.15" width="27" height="35" />
          <rect className={styles.louver4} x="112.27" y="134.15" width="27" height="35" />

          <line className={styles.louver5} x1="112.27" y1="44.15" x2="139.27" y2="44.15" />
          <line className={styles.louver5} x1="112.27" y1="89.15" x2="139.27" y2="89.15" />
          <line className={styles.louver5} x1="112.27" y1="134.15" x2="139.27" y2="134.15" />
        </g>

        {/* from left to right (4) */}
        <g>
          <polygon
            className={styles.louver2}
            points="184.27 173.15 145.27 173.15 145.27 19.15 184.27 35.15 184.27 173.15"
          />

          <rect className={styles.louver3} x="151.27" y="44.15" width="27" height="35" />
          <rect className={styles.louver3} x="151.27" y="89.15" width="27" height="35" />
          <rect className={styles.louver3} x="151.27" y="134.15" width="27" height="35" />

          <rect className={styles.louver4} x="151.27" y="44.15" width="27" height="35" />
          <rect className={styles.louver4} x="151.27" y="89.15" width="27" height="35" />
          <rect className={styles.louver4} x="151.27" y="134.15" width="27" height="35" />

          <line className={styles.louver5} x1="151.27" y1="44.15" x2="178.27" y2="44.15" />
          <line className={styles.louver5} x1="151.27" y1="89.15" x2="178.27" y2="89.15" />
          <line className={styles.louver5} x1="151.27" y1="134.15" x2="178.27" y2="134.15" />
        </g>

        {/* from left to right (5) */}
        <g>
          <polygon
            className={styles.louver1}
            points="184.27 173.15 232.27 173.15 232.27 53.15 184.27 35.15 184.27 173.15"
          />

          <rect className={styles.louver3} x="194.77" y="60.15" width="27" height="19" />
          <rect className={styles.louver3} x="194.77" y="89.15" width="27" height="35" />
          <rect className={styles.louver3} x="194.77" y="134.15" width="27" height="35" />

          <rect className={styles.louver4} x="194.77" y="60.15" width="27" height="19" />
          <rect className={styles.louver4} x="194.77" y="89.15" width="27" height="35" />
          <rect className={styles.louver4} x="194.77" y="134.15" width="27" height="35" />

          <line className={styles.louver5} x1="194.77" y1="60.15" x2="221.77" y2="60.15" />
          <line className={styles.louver5} x1="194.77" y1="89.15" x2="221.77" y2="89.15" />
          <line className={styles.louver5} x1="194.77" y1="134.15" x2="221.77" y2="134.15" />
        </g>

        {/* from left to right (6) (the middle) */}
        <g>
          <rect className={styles.louver1} x="232.27" y="53.15" width="96" height="120" />

          <rect className={styles.louver3} x="244.52" y="60.15" width="27" height="19" />
          <rect className={styles.louver3} x="244.52" y="93.15" width="27" height="19" />
          <rect className={styles.louver3} x="239.52" y="134.15" width="27" height="35" />

          <rect
            className={styles.louver3}
            x="289.02"
            y="60.15"
            width="27"
            height="19"
            transform="translate(605.03 139.3) rotate(-180)"
          />
          <rect
            className={styles.louver3}
            x="289.02"
            y="93.15"
            width="27"
            height="19"
            transform="translate(605.03 205.3) rotate(-180)"
          />
          <rect
            className={styles.louver3}
            x="294.02"
            y="134.15"
            width="27"
            height="35"
            transform="translate(615.03 303.3) rotate(-180)"
          />

          <rect className={styles.louver4} x="244.52" y="60.15" width="27" height="19" />
          <rect className={styles.louver4} x="244.52" y="93.15" width="27" height="19" />
          <rect className={styles.louver4} x="239.52" y="134.15" width="27" height="35" />

          <rect
            className={styles.louver4}
            x="289.02"
            y="60.15"
            width="27"
            height="19"
            transform="translate(605.03 139.3) rotate(-180)"
          />
          <rect
            className={styles.louver4}
            x="289.02"
            y="93.15"
            width="27"
            height="19"
            transform="translate(605.03 205.3) rotate(-180)"
          />
          <rect
            className={styles.louver4}
            x="294.02"
            y="134.15"
            width="27"
            height="35"
            transform="translate(615.03 303.3) rotate(-180)"
          />

          <line className={styles.louver5} x1="244.52" y1="60.15" x2="271.52" y2="60.15" />
          <line className={styles.louver5} x1="244.52" y1="93.15" x2="271.52" y2="93.15" />
          <line className={styles.louver5} x1="239.52" y1="134.15" x2="266.52" y2="134.15" />

          <line className={styles.louver5} x1="316.02" y1="60.15" x2="289.02" y2="60.15" />
          <line className={styles.louver5} x1="316.02" y1="93.15" x2="289.02" y2="93.15" />
          <line className={styles.louver5} x1="321.02" y1="134.15" x2="294.02" y2="134.15" />
        </g>

        {/* from left to right (7) */}
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
            transform="translate(791.53 303.3) rotate(-180)"
          />
          <rect
            className={styles.louver3}
            x="338.77"
            y="89.15"
            width="27"
            height="35"
            transform="translate(704.53 213.3) rotate(-180)"
          />
          <rect
            className={styles.louver3}
            x="338.77"
            y="134.15"
            width="27"
            height="35"
            transform="translate(704.53 303.3) rotate(-180)"
          />

          <rect
            className={styles.louver4}
            x="339.27"
            y="60.15"
            width="26"
            height="19"
            transform="translate(704.53 139.3) rotate(-180)"
          />
          <rect
            className={styles.louver4}
            x="338.77"
            y="89.15"
            width="27"
            height="35"
            transform="translate(704.53 213.3) rotate(-180)"
          />
          <rect
            className={styles.louver4}
            x="338.77"
            y="134.15"
            width="27"
            height="35"
            transform="translate(704.53 303.3) rotate(-180)"
          />

          <line className={styles.louver5} x1="365.27" y1="60.15" x2="339.27" y2="60.15" />
          <line className={styles.louver5} x1="365.77" y1="89.15" x2="338.77" y2="89.15" />
          <line className={styles.louver5} x1="365.77" y1="134.15" x2="338.77" y2="134.15" />
        </g>

        {/* from left to right (8) */}
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

          <rect
            className={styles.louver4}
            x="382.27"
            y="44.15"
            width="27"
            height="35"
            transform="translate(791.53 123.3) rotate(-180)"
          />
          <rect
            className={styles.louver4}
            x="382.27"
            y="89.15"
            width="27"
            height="35"
            transform="translate(791.53 213.3) rotate(-180)"
          />
          <rect
            className={styles.louver4}
            x="382.27"
            y="134.15"
            width="27"
            height="35"
            transform="translate(791.53 303.3) rotate(-180)"
          />

          <line className={styles.louver5} x1="409.27" y1="44.15" x2="382.27" y2="44.15" />
          <line className={styles.louver5} x1="409.27" y1="89.15" x2="382.27" y2="89.15" />
          <line className={styles.louver5} x1="409.27" y1="134.15" x2="382.27" y2="134.15" />
        </g>

        {/* from left to right (9) */}
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

          <rect
            className={styles.louver4}
            x="421.27"
            y="44.15"
            width="27"
            height="35"
            transform="translate(869.53 123.3) rotate(-180)"
          />
          <rect
            className={styles.louver4}
            x="421.27"
            y="89.15"
            width="27"
            height="35"
            transform="translate(869.53 213.3) rotate(-180)"
          />
          <rect
            className={styles.louver4}
            x="421.27"
            y="134.15"
            width="27"
            height="35"
            transform="translate(869.53 303.3) rotate(-180)"
          />

          <line className={styles.louver5} x1="448.27" y1="44.15" x2="421.27" y2="44.15" />
          <line className={styles.louver5} x1="448.27" y1="89.15" x2="421.27" y2="89.15" />
          <line className={styles.louver5} x1="448.27" y1="134.15" x2="421.27" y2="134.15" />
        </g>

        {/* from left to right (10) */}
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

          <rect
            className={styles.louver4}
            x="460.27"
            y="60.15"
            width="27"
            height="19"
            transform="translate(947.53 139.3) rotate(-180)"
          />
          <rect
            className={styles.louver4}
            x="460.27"
            y="89.15"
            width="27"
            height="35"
            transform="translate(947.53 213.3) rotate(-180)"
          />
          <rect
            className={styles.louver4}
            x="460.27"
            y="134.15"
            width="27"
            height="35"
            transform="translate(947.53 303.3) rotate(-180)"
          />

          <line className={styles.louver5} x1="487.27" y1="60.15" x2="460.27" y2="60.15" />
          <line className={styles.louver5} x1="487.27" y1="89.15" x2="460.27" y2="89.15" />
          <line className={styles.louver5} x1="487.27" y1="134.15" x2="460.27" y2="134.15" />
        </g>

        {/* from left to right (11) */}
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

          <rect
            className={styles.louver4}
            x="499.02"
            y="105.15"
            width="27"
            height="19"
            transform="translate(1025.03 229.3) rotate(-180)"
          />
          <rect
            className={styles.louver4}
            x="499.02"
            y="134.15"
            width="27"
            height="35"
            transform="translate(1025.03 303.3) rotate(-180)"
          />

          <line className={styles.louver5} x1="526.02" y1="105.15" x2="499.02" y2="105.15" />
          <line className={styles.louver5} x1="526.02" y1="134.15" x2="499.02" y2="134.15" />
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
