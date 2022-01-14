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
      <svg className={styles.svgOverlay} height={height} width={width} viewBox="0 0 301.98 301.98">
        {/* */}
        <g class="dome" style="transform-origin: 50% 50%;/*transform: rotate(45deg);*/">
          <polygon
            class="shutter-commanded"
            points="198.99 268.49 263.08 184.54 264.7 130.71 243.34 78.25 192.51 33.49 109.48 33.49 58.65 78.25 37.28 130.71 38.91 184.54 102.99 268.49 198.99 268.49"
          />
          <rect class="shutter-commanded" x="110.69" y="38.59" width="81.08" height="145.13" />
        </g>

        {/* rest of dome */}

        <rect
          class="cls-2"
          x="148.97"
          y="-50.78"
          width="4.05"
          height="173.5"
          transform="translate(186.96 -115.02) rotate(90)"
        />
        <polygon
          class="cls-2"
          points="198.99 268.49 263.08 184.54 264.7 130.71 243.34 78.25 192.51 33.49 109.48 33.49 58.65 78.25 37.28 130.71 38.91 184.54 102.99 268.49 198.99 268.49"
        />
        <rect class="cls-2" x="110.69" y="38.59" width="81.08" height="145.13" />
        <rect class="cls-3" x="110.69" y="38.59" width="81.08" height="145.13" />
        <rect
          class="cls-2"
          x="148.97"
          y="73.67"
          width="4.05"
          height="219.72"
          transform="translate(334.52 32.54) rotate(90)"
        />
        <rect
          class="cls-2"
          x="148.56"
          y="187.18"
          width="4.86"
          height="154.05"
          transform="translate(415.19 113.21) rotate(90)"
        />

        {/* pointing */}
        <g class="pointing" style="transform-origin: 50% 50%; transform: translate(0, -30px);">
          <rect class="cls-4" x="110.69" y="114.81" width="81.08" height="64.86" />
          <circle class="cls-6" cx="151.22" cy="147.24" r="5.68" />
        </g>
        {/* Shutter commanded right */}
        <g class="shutter-commanded-right" style="display: none;">
          <polygon
            class="shutter-commanded"
            points="201.8 188.53 151.53 188.53 151.53 72.59 200.18 72.59 201.8 188.53"
          />
          <polygon
            class="shutter-commanded"
            points="200.18 72.59 151.53 72.59 151.53 28.81 196.93 28.81 200.18 72.59"
          />
          <rect class="shutter-commanded" x="151.53" y="188.53" width="50.27" height="12.97" />
        </g>
        {/* Shutter commanded left */}
        <g class="shutter-commanded-left" style="display: none">
          <polygon
            class="shutter-commanded"
            points="100.19 188.53 150.45 188.53 150.45 72.59 101.81 72.59 100.19 188.53"
          />
          <polygon
            class="shutter-commanded"
            points="101.81 72.59 150.45 72.59 150.45 28.81 105.05 28.81 101.81 72.59"
          />
          <rect class="shutter-commanded" x="100.19" y="188.53" width="50.27" height="12.97" />
        </g>
        {/* Shutter rigth */}
        <g class="shutter-right" style="transform-origin: 50% 50%; transform: translate(40px, 0);">
          <polygon class="shutter" points="201.8 188.53 151.53 188.53 151.53 72.59 200.18 72.59 201.8 188.53" />
          <polygon class="shutter" points="200.18 72.59 151.53 72.59 151.53 28.81 196.93 28.81 200.18 72.59" />
          <rect class="shutter" x="151.53" y="188.53" width="50.27" height="12.97" />
        </g>
        {/* Shutter left */}
        <g class="shutter-left" style="">
          <polygon class="shutter" points="100.19 188.53 150.45 188.53 150.45 72.59 101.81 72.59 100.19 188.53" />
          <polygon class="shutter" points="101.81 72.59 150.45 72.59 150.45 28.81 105.05 28.81 101.81 72.59" />
          <rect class="shutter" x="100.19" y="188.53" width="50.27" height="12.97" />
        </g>
      </svg>
    );
  }
}
