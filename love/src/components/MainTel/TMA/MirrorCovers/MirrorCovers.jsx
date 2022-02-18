import React, { Component } from 'react';
import PropTypes from 'prop-types';

import WindRose from '../../../icons/WindRose/WindRose';
import styles from './MirrorCovers.module.css';


export default class MirrorCovers extends Component {
  static propTypes = {
    /** Mirror Covers view width */
    width: PropTypes.number,
    /** Mirror Covers view height */
    height: PropTypes.number,
    /** Azimuth position */
    azimuthPosition: PropTypes.number,
  };

  static defaultProps = {
    azelToPixel: () => {},
    width: 385,
    height: 385,
    azimuthPosition: 0,
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

getSvg = (props) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 385 385" {...props}>
            <g id="Layer_2" data-name="Layer 2">
            <circle
                cx={192.5}
                cy={192.5}
                r={170}
                style={{
                    strokeWidth: 2,
                    strokeMiterlimit: 10,
                    fill: "#15242d",
                    stroke: "#182e39",
                }}
            />
            
            
            <path
                className={styles.cls3}
                d="M19.95 168.14h48.69v48.71H19.95zM316.36 168.14h48.69v48.71h-48.69zM302.63 40.57H82.37L38.31 87.89l-3.25 19.02 47.31 15.66h220.26l47.31-15.66-2.44-19.02-44.87-47.32z"
            />
            <path
                className={styles.cls3}
                d="M323.24 97.41 289 62.6H96L61.76 97.41l-11.28 60.28v69.62l11.28 60.28L96 322.4h193l34.26-34.81 11.28-60.28v-69.62ZM192.5 298A105.54 105.54 0 1 1 298 192.5 105.52 105.52 0 0 1 192.5 298Z"
            />
            <g
                style={{
                    opacity: 0.3,
                }}
            >
                <path
                    className={styles.cls5}
                    d="M304.55 237.91v-91l-66.17-66.2a92.56 92.56 0 0 0 66.17 157.23Z"
                />
                <path
                    className={styles.cls5}
                    d="M147.39 304.32h91l66.17-66.2a92.5 92.5 0 0 0-157.16 66.2Z"
                />
                <path
                    className={styles.cls5}
                    d="M80.45 147.09v91l66.17 66.2a92.56 92.56 0 0 0-66.17-157.2Z"
                />
                <path
                    className={styles.cls5}
                    d="M237.61 80.68h-91l-66.17 66.2a92.5 92.5 0 0 0 157.16-66.2Z"
                />
                <path
                    className={styles.cls5}
                    d="m304.55 146.88-66.17-66.2A92.23 92.23 0 0 0 212 145.35"
                />
            </g>
            <path
                className={styles.cls6}
                d="M212 145.35a92.54 92.54 0 0 0 92.51 92.56v-91l-66.17-66.2"
            />
            <path
                className={styles.cls6}
                d="M239.91 211.77a92.53 92.53 0 0 0-92.52 92.55h91l66.17-66.2"
            />
            <path
                className={styles.cls6}
                d="M173 239.65a92.54 92.54 0 0 0-92.51-92.56v91l66.17 66.2"
            />
            <path
                className={styles.cls6}
                d="M145.09 173.23a92.53 92.53 0 0 0 92.52-92.55h-91l-66.17 66.2"
            />
            <rect
                className={styles.cls7}
                x={108.65}
                y={78.17}
                width={178.54}
                height={6.49}
                rx={3.25}
                transform="rotate(10 197.971 81.443)"
            />
            <rect
                className={styles.cls7}
                x={97.81}
                y={78.17}
                width={178.54}
                height={6.49}
                rx={3.25}
                transform="rotate(-10 187.175 81.45)"
            />
            <rect
                className={styles.cls7}
                x={33.43}
                y={132.33}
                width={81.18}
                height={6.49}
                rx={3.25}
                transform="rotate(-60.01 74.014 135.57)"
            />
            <rect
                className={styles.cls7}
                x={270.39}
                y={132.33}
                width={81.18}
                height={6.49}
                rx={3.25}
                transform="rotate(60.01 310.984 135.573)"
            />
            <path
                className={styles.cls3}
                d="m275.45 126.81-16.72-16.73 36.23-41.83 22.3 22.31-41.81 36.25z"
            />
            <rect
                className={styles.cls3}
                x={287.25}
                y={82.04}
                width={16.23}
                height={16.23}
                rx={8.12}
                transform="rotate(45.01 295.378 90.168)"
            />
            <path
                className={styles.cls3}
                d="m125.93 110.08-16.72 16.73L67.4 90.56l22.3-22.31 36.23 41.83z"
            />
            <rect
                className={styles.cls3}
                x={81.18}
                y={82.04}
                width={16.23}
                height={16.23}
                rx={8.12}
                transform="rotate(-45.01 89.299 90.149)"
            />
            <rect
                className={styles.cls7}
                x={97.81}
                y={300.33}
                width={178.54}
                height={6.49}
                rx={3.25}
                transform="rotate(-170 187.064 303.584)"
            />
            <rect
                className={styles.cls7}
                x={108.65}
                y={300.33}
                width={178.54}
                height={6.49}
                rx={3.25}
                transform="rotate(170 197.931 303.571)"
            />
            <rect
                className={styles.cls7}
                x={270.39}
                y={246.18}
                width={81.18}
                height={6.49}
                rx={3.25}
                transform="rotate(119.99 310.982 249.429)"
            />
            <rect
                className={styles.cls7}
                x={33.43}
                y={246.18}
                width={81.18}
                height={6.49}
                rx={3.25}
                transform="rotate(-119.99 74.016 249.428)"
            />
            <path
                className={styles.cls3}
                d="m109.55 258.19 16.72 16.73-36.23 41.83-22.3-22.31 41.81-36.25z"
            />
            <rect
                className={styles.cls3}
                x={81.52}
                y={286.73}
                width={16.23}
                height={16.23}
                rx={8.12}
                transform="rotate(-134.99 89.63 294.848)"
            />
            <path
                className={styles.cls3}
                d="m259.07 274.92 16.72-16.73 41.81 36.25-22.3 22.31-36.23-41.83z"
            />
            <rect
                className={styles.cls3}
                x={287.59}
                y={286.73}
                width={16.23}
                height={16.23}
                rx={8.12}
                transform="rotate(134.99 295.71 294.839)"
            />
            <path
                className={styles.cls8}
                d="m337.32 118.31-9.19 1.78M340.41 134.25l-9.18 1.78M333.67 119.32l2.97 15.28M53.77 136.03l-9.18-1.78M56.87 120.09l-9.19-1.78M50.13 135.02l2.96-15.28"
            />

            <circle className={styles.cls3} cx={192.5} cy={192.5} r={26} />

            /** Dotpoint */
            <path
                d="M365.05 168.14h-30.53v-10.45l-8-43 23.47-7.77-2.44-19-44.92-47.35H82.37L38.31 87.89l-3.25 19 23.47 7.77-8.05 43v10.45H20v48.72h30.48v10.45l11.28 60.28 6.39 6.5-.41.35L90 316.75l.19-.23L96 322.4h193l6-6.06.35.41 22.3-22.31-.59-.51 6.23-6.34 11.28-60.28v-10.45h30.53Z"
                style={{
                    stroke: "#e4e4e7",
                    strokeWidth: ".5px",
                    strokeDasharray: 6,
                    fill: "none",
                    strokeMiterlimit: 10,
                }}
            />

            </g>
        </svg>
    );
}

  render() {
    const { width, height } = this.props;
    const offset = 10;
    const viewBoxSize = 385 - 2 * offset;
    const x0 = viewBoxSize / 2 + offset;
    const y0 = viewBoxSize / 2 + offset;
    const r = viewBoxSize / 2;
    const extraApperture = r / 4;
    const alpha = Math.PI / 12;
    const rSinAlpha = r * Math.sin(alpha);
    const rCosAlpha = r * Math.cos(alpha);
    const equivalentAzimuth = this.closestEquivalentAngle(this.prevAzimuth, this.props.azimuthPosition);
    return (
        <div className={styles.container}>    
            <div className={styles.windRoseContainer}>
                <WindRose />
            </div>
            { this.getSvg(this.props) }
        </div>
    );
    }
}