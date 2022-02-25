import React, { Component } from 'react';
import PropTypes from 'prop-types';

import WindRose from '../../../icons/WindRose/WindRose';
import {
  mtMountMirrorCoversStateMap,
  // stateToStyleMTMountMirrorCoversState,
} from '../../../../Config';
import styles from './MirrorCovers.module.css';

export default class MirrorCovers extends Component {
  static propTypes = {
    /** Azimuth actual position */
    azimuthActualPosition: PropTypes.number,
    /** Azimuth demand position */
    azimuthDemandPosition: PropTypes.number,
    /** Mirror Covers Motion State */
    mirrorCovers: PropTypes.number,
  };

  static defaultProps = {
    azimuthActualPosition: 0,
    azimuthDemandPosition: 0,
    mirrorCovers: 0,
  };

  constructor(props) {
    super(props);
    this.state = { 
        prevAzimuthActual: 0,
        prevAzimuthDemand: 0,
    }
    
  }

  componentDidUpdate(prevProps) {
      console.log('componetDidUpdate', prevProps, this.props);
    if (prevProps.azimuthActualPosition !== this.props.azimuthActualPosition) {
      /* this.prevAzimuthActual = this.closesEquivalentAngle(
        prevProps.prevAzimuthActual, this.props.azimuthActualPosition
      ); */
      this.setState((prevState) => ({
        prevAzimuthActual: this.closesEquivalentAngle(prevState.prevAzimuthActual, this.props.azimuthActualPosition)
      }));
    }
    if (prevProps.azimuthDemandPosition !== this.props.azimuthDemandPosition) {
      /* this.prevAzimuthDemand = this.closesEquivalentAngle(
        prevProps.prevAzimuthDemand, this.props.azimuthDemandPosition
      ); */
      this.setState((prevState) => ({
        prevAzimuthDemand: this.closesEquivalentAngle(prevState.prevAzimuthDemand, this.props.azimuthDemandPosition)
      }));
    }
  }

  // move to Utils
  closestEquivalentAngle = (from, to) => {
    const delta = ((((to - from) % 360) + 540) % 360) - 180;
    return from + delta;
  };

  render() {
    return (
        <div className={styles.container}>    
            <div className={styles.windRoseContainer}>
                <WindRose />
            </div>
            { this.getSvg(this.props) }
        </div>
    );
  }

  getAngleClosedCoverMirror() {
      const stateToClosedMTMountMirrorCoversState = {
        'RETRACTED': Math.PI / 12,
        'DEPLOYED': Math.PI / 2 + Math.PI / 4,
        'RETRACTING': Math.PI / 2,
        'DEPLOYING': Math.PI / 2 - Math.PI / 6,
        'LOST': - Math.PI / 36,
      };
      const mirrorCoversValue = this.props.mirrorCovers ? mtMountMirrorCoversStateMap[this.props.mirrorCovers] : mtMountMirrorCoversStateMap[0];
      return stateToClosedMTMountMirrorCoversState[mirrorCoversValue];
  }

  getAngleClosedCoverMirrorBorder() {
    const stateToClosedMTMountMirrorCoversState = {
      'RETRACTED': 3 * Math.PI/2 - Math.PI / 12,
      'DEPLOYED': Math.PI,
      'RETRACTING': Math.PI,
      'DEPLOYING': Math.PI + Math.PI / 6,
      'LOST': 3 * Math.PI/2 + Math.PI / 36,
    };
    const mirrorCoversValue = this.props.mirrorCovers ? mtMountMirrorCoversStateMap[this.props.mirrorCovers] : mtMountMirrorCoversStateMap[0];
    return stateToClosedMTMountMirrorCoversState[mirrorCoversValue];
  }

  getSvg = (props) => {
    const offset = 10;
    const viewBoxSize = 385 - 2 * offset;
    const x0 = viewBoxSize / 2 + offset;
    const y0 = viewBoxSize / 2 + offset;

    const angleClosed = this.getAngleClosedCoverMirror();
    const angleClosedBorder = this.getAngleClosedCoverMirrorBorder();
    
    const equivalentAzimuthActual = this.closestEquivalentAngle(this.state.prevAzimuthActual, this.props.azimuthActualPosition);
    const equivalentAzimuthDemand = this.closestEquivalentAngle(this.state.prevAzimuthDemand, this.props.azimuthDemandPosition);

    return (
        <svg
            id="mirrorCoverSvg"
            data-name="mirrorCoverSvg"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 385 385"
        >
          <g>
            <circle
                cx={x0}
                cy={y0}
                r={170}
                style={{
                    strokeWidth: 2,
                    strokeMiterlimit: 10,
                    fill: "#15242d",
                    stroke: "#182e39",
                }}
            />
            <g
                style={{transform: `rotateZ(${equivalentAzimuthActual}deg)`, transformOrigin: `50% 50%`}}
            >
                <path
                    className={styles.cls3}
                    d="M19.95 168.14h48.69v48.71H19.95zM316.36 168.14h48.69v48.71h-48.69zM302.63 40.57H82.37L38.31 87.89l-3.25 19.02 47.31 15.66h220.26l47.31-15.66-2.44-19.02-44.87-47.32z"
                />
                <path
                    className={styles.cls3}
                    d="M323.24 97.41 289 62.6H96L61.76 97.41l-11.28 60.28v69.62l11.28 60.28L96 322.4h193l34.26-34.81 11.28-60.28v-69.62ZM192.5 298A105.54 105.54 0 1 1 298 192.5 105.52 105.52 0 0 1 192.5 298Z"
                />
                { this.getMirrorCover(angleClosed, angleClosedBorder, viewBoxSize) }
                { this.getMount() }
            </g>
            
            <circle className={styles.cls3} cx={x0} cy={y0} r={26} />

            /** azimuth Demand */
            <path
                d="M365.05 168.14h-30.53v-10.45l-8-43 23.47-7.77-2.44-19-44.92-47.35H82.37L38.31 87.89l-3.25 19 23.47 7.77-8.05 43v10.45H20v48.72h30.48v10.45l11.28 60.28 6.39 6.5-.41.35L90 316.75l.19-.23L96 322.4h193l6-6.06.35.41 22.3-22.31-.59-.51 6.23-6.34 11.28-60.28v-10.45h30.53Z"
                style={{
                    stroke: "#e4e4e7",
                    strokeWidth: ".5px",
                    strokeDasharray: 6,
                    fill: "none",
                    strokeMiterlimit: 10,
                    transform: `rotateZ(${equivalentAzimuthDemand}deg)`, transformOrigin: `50% 50%`
                }}
            />
          </g>
        </svg>
    );
  }

  getMirrorCover = (angleClosed, angleClosedBorder, viewBoxSize) => {
    const offset = 10;
    const x0 = viewBoxSize / 2 + offset;
    const y0 = viewBoxSize / 2 + offset;

    const r = viewBoxSize / 4;

    const alpha1 = 3 * Math.PI / 2;
    const rSinAlpha1 = r * Math.sin(alpha1);
    const rCosAlpha1 = r * Math.cos(alpha1);

    const alpha2 = angleClosed;
    const rSinAlpha2 = r * Math.sin(alpha2);
    const rCosAlpha2 = r * Math.cos(alpha2);

    const alpha3 = angleClosedBorder;
    const rSinAlpha3 = r * Math.sin(alpha3);
    const rCosAlpha3 = r * Math.cos(alpha3);

    return (
        <>
        <g style={{opacity: 0.45}} >
            <path
                className={styles.cls4}
                d={`
                    M ${x0} ${y0}
                    L ${x0 + rCosAlpha1} ${y0 - rSinAlpha1}
                    A ${r} ${r} 0 0 1 ${x0 - rSinAlpha2} ${y0 + rCosAlpha2}
                `}
                style={{ transformOrigin: `50% 50%`, transform: `translate(110px, -45px)` }}
            />
            <path
                className={styles.cls4}
                d={`
                    M ${x0} ${y0}
                    L ${x0 + rCosAlpha1} ${y0 - rSinAlpha1}
                    A ${r} ${r} 0 0 1 ${x0 - rSinAlpha2} ${y0 + rCosAlpha2}
                `}
                style={{ transformOrigin: `50% 50%`, transform: `translate(45px, 110px) rotateZ(90deg)`,}}
            />
            <path
                className={styles.cls4}
                d={`
                    M ${x0} ${y0}
                    L ${x0 + rCosAlpha1} ${y0 - rSinAlpha1}
                    A ${r} ${r} 0 0 1 ${x0 - rSinAlpha2} ${y0 + rCosAlpha2}
                `}
                style={{ transformOrigin: `50% 50%`, transform: `translate(-110px, 45px) rotateZ(180deg)`,}}
            />
            <path
                className={styles.cls4}
                d={`
                    M ${x0} ${y0}
                    L ${x0 + rCosAlpha1} ${y0 - rSinAlpha1}
                    A ${r} ${r} 0 0 1 ${x0 - rSinAlpha2} ${y0 + rCosAlpha2}
                `}
                style={{ transformOrigin: `50% 50%`, transform: `translate(-45px, -110px) rotateZ(270deg)`,}}
            />
        </g>

        <g style={{opacity: 0.45}} >
            <path
                className={styles.cls6}
                d={`
                    M ${x0} ${y0}
                    L ${x0 + rCosAlpha1} ${y0 - rSinAlpha1}
                    A ${r} ${r} 0 0 1 ${x0 + rCosAlpha3} ${y0 - rSinAlpha3}
                    M ${x0} ${y0}
                    L ${x0 - rSinAlpha2} ${y0 + rCosAlpha2}
                `}
                style={{ transformOrigin: `50% 50%`, transform: `translate(110px, -45px)` }}
            />
            <path
                className={styles.cls6}
                d={`
                    M ${x0} ${y0}
                    L ${x0 + rCosAlpha1} ${y0 - rSinAlpha1}
                    A ${r} ${r} 0 0 1 ${x0 + rCosAlpha3} ${y0 - rSinAlpha3}
                    M ${x0} ${y0}
                    L ${x0 - rSinAlpha2} ${y0 + rCosAlpha2}
                `}
                style={{ transformOrigin: `50% 50%`, transform: `translate(45px, 110px) rotateZ(90deg)`,}}
            />
            <path
                className={styles.cls6}
                d={`
                    M ${x0} ${y0}
                    L ${x0 + rCosAlpha1} ${y0 - rSinAlpha1}
                    A ${r} ${r} 0 0 1 ${x0 + rCosAlpha3} ${y0 - rSinAlpha3}
                    M ${x0} ${y0}
                    L ${x0 - rSinAlpha2} ${y0 + rCosAlpha2}
                `}
                style={{ transformOrigin: `50% 50%`, transform: `translate(-110px, 45px) rotateZ(180deg)`,}}
            />
            <path
                className={styles.cls6}
                d={`
                    M ${x0} ${y0}
                    L ${x0 + rCosAlpha1} ${y0 - rSinAlpha1}
                    A ${r} ${r} 0 0 1 ${x0 + rCosAlpha3} ${y0 - rSinAlpha3}
                    M ${x0} ${y0}
                    L ${x0 - rSinAlpha2} ${y0 + rCosAlpha2}
                `}
                style={{ transformOrigin: `50% 50%`, transform: `translate(-45px, -110px) rotateZ(270deg)`,}}
            />
        </g>
        </>
    );
  }

  getMount = () => {
    return (
        <>
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
        </>
    );
  }
}