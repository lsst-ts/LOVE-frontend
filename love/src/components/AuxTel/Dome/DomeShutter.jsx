import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { closestEquivalentAngle } from 'Utils';
import { uniqueId } from 'lodash';
import styles from './Dome.module.css';

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
    this.uniqueDomeMask = uniqueId('dome-mask-');
  }

  componentDidUpdate(prevProps) {
    if (prevProps.azimuthPosition !== this.props.azimuthPosition)
      this.prevAzimuth = closestEquivalentAngle(this.prevAzimuth, prevProps.azimuthPosition);
  }

  render() {
    const { width, height } = this.props;
    const offset = 10;
    const viewBoxSize = 596 - 2 * offset;
    const x0 = viewBoxSize / 2 + offset;
    const y0 = viewBoxSize / 2 + offset;
    const r = viewBoxSize / 2;
    const extraApperture = r / 5;
    const alpha = Math.PI / 12;
    const rSinAlpha = r * Math.sin(alpha);
    const rCosAlpha = r * Math.cos(alpha);
    const dropoutDoorWidth = (rCosAlpha + extraApperture) * 0.09;
    const mainDoorWidth = (rCosAlpha + extraApperture) * 0.91;
    const equivalentAzimuth = closestEquivalentAngle(this.prevAzimuth, this.props.azimuthPosition);

    return (
      <svg className={styles.svgOverlay} height={height} width={width} viewBox="0 0 596 596">
        <defs>
          <mask x="0" y="0" width="596" height="596" id={this.uniqueDomeMask}>
            <circle cx={x0} cy={y0} r={r} fill="#fff" stroke="#" strokeWidth="2" />
          </mask>
        </defs>
        {/* Dome target*/}
        <path
          style={{ transform: `rotateZ(${270 + this.props.targetAzimuthPosition}deg)`, transformOrigin: `50% 50%` }}
          fill="none"
          strokeDasharray="10"
          strokeOpacity="0.3"
          stroke="white"
          strokeWidth="2"
          d={`
            M ${x0 + rCosAlpha} ${y0 + rSinAlpha}
            L ${x0 - extraApperture} ${y0 + rSinAlpha}
            L ${x0 - extraApperture} ${y0 - rSinAlpha}
            L ${x0 + rCosAlpha} ${y0 - rSinAlpha}
          `}
        />
        <g
          className={styles.rotatingDome}
          style={{ transform: `rotateZ(${270 + equivalentAzimuth}deg)`, transformOrigin: `50% 50%` }}
        >
          {/* Dome */}
          <path
            className={styles.innerDome}
            d={`
              M ${x0 + rCosAlpha} ${y0 + rSinAlpha}
              A ${r} ${r} 0 0 1 ${x0 - rCosAlpha} ${y0 + rSinAlpha}
              A ${r} ${r} 0 0 1 ${x0 - rCosAlpha} ${y0 - rSinAlpha}
              A ${r} ${r} 0 0 1 ${x0 + rCosAlpha} ${y0 - rSinAlpha}
              L ${x0 - extraApperture} ${y0 - rSinAlpha}
              L ${x0 - extraApperture} ${y0 + rSinAlpha}
              L ${x0 + rCosAlpha} ${y0 + rSinAlpha}
            `}
          />
          <rect
            x={x0 - rCosAlpha - 10}
            y={y0 + rSinAlpha}
            width={2 * r - 2}
            height={10}
            fill="#fff"
            fillOpacity="0.1"
            stroke="#152228"
          />
          <rect
            x={x0 - rCosAlpha - 10}
            y={y0 - rSinAlpha - 10}
            width={2 * r - 2}
            height={10}
            fill="#fff"
            fillOpacity="0.1"
            stroke="#152228"
          />
          {/* Dropout door */}
          <g clipPath={`circle(${r}px at center)`} style={{ mask: `url(#${this.uniqueDomeMask})` }}>
            <circle cx={x0} cy={y0} r={r} fill="none" stroke="none" />
            <path
              fill="none"
              stroke="white"
              strokeWidth="2"
              d={`
                M ${x0 + rCosAlpha} ${y0 - rSinAlpha}
                A ${r} ${r} 0 0 1 ${x0 + rCosAlpha} ${y0 + rSinAlpha}
                M ${x0 + rCosAlpha} ${y0 - rSinAlpha}
              `}
            />
            <rect
              x={
                x0 + mainDoorWidth - extraApperture + (dropoutDoorWidth * this.props.dropoutDoorOpeningPercentage) / 100
              }
              y={y0 - rSinAlpha}
              width={r - rCosAlpha + (dropoutDoorWidth * (100 - this.props.dropoutDoorOpeningPercentage)) / 100}
              height={2 * rSinAlpha}
              fill="white"
              fillOpacity={0.2 + (0.1 * this.props.dropoutDoorOpeningPercentage) / 100}
              stroke="white"
              strokeWidth="2"
            />
          </g>

          {/* Main door */}
          <g clipPath={`circle(${r}px at center)`} style={{ mask: `url(#${this.uniqueDomeMask})` }}>
            <circle cx={x0} cy={y0} r={r} fill="none" stroke="none" />
            <rect
              x={x0 - extraApperture - (mainDoorWidth * this.props.mainDoorOpeningPercentage) / 100}
              y={y0 - rSinAlpha}
              width={mainDoorWidth}
              height={2 * rSinAlpha}
              fill="white"
              fillOpacity="0.2"
              stroke="white"
              strokeWidth="2"
            />
            { this.props.mainDoorOpeningPercentage > 74 ? (
              <path
              fill="none"
              stroke="white"
              strokeWidth="2"
              d={`
                M ${x0 - rCosAlpha} ${y0 + rSinAlpha}
                A ${r} ${r} 0 0 1 ${x0 - rCosAlpha} ${y0 - rSinAlpha}
                M ${x0 - rCosAlpha} ${y0 + rSinAlpha}
              `}
            />
            ) : <></>}
          </g>
        </g>
      </svg>
    );
  }
}
