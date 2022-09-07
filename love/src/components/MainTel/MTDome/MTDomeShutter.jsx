import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './MTDome.module.css';

const widthShutters = [-50, 50];
export default class MTDomeShutter extends Component {
  static propTypes = {
    /** Measured position of the aperture shutter (percent open) */
    positionActualShutter: PropTypes.number,
    /** Commanded position of the aperture shutter (percent open) */
    positionCommandedShutter: PropTypes.number,
    /** Measured azimuth axis position */
    positionActualDomeAz: PropTypes.number,
    /** Commanded azimuth position */
    positionCommandedDomeAz: PropTypes.number,
    /** Measured position of the light/wind screen */
    positionActualLightWindScreen: PropTypes.number,
  };

  static defaultProps = {
    positionActualShutter: 0,
    positionCommandedShutter: 0,
    positionActualDomeAz: 0,
    positionCommandedDomeAz: 0,
    positionActualLightWindScreen: 0,
    targetPointingAz: 0,
    targetPointingEl: 0,
    azelToPixel: () => {},
    width: 400,
    height: 400,
    isProjected: true,
  };

  /** Function to convert az/el to pixels */
  azelToPixel = (pos, isProjected) => {
    const { az, el } = pos;
    const width = 235;
    const height = 235;
    const offset = 20;
    const center = [width / 2, height / 2];
    let r;
    if (isProjected) {
      r = Math.cos((el * Math.PI) / 180) * (width / 2 - offset);
    } else {
      r = ((90 - el) / 90) * (width / 2 - offset);
    }
    const x = center[0] + r * Math.sin((az * Math.PI) / 180);
    const y = center[1] - r * Math.cos((az * Math.PI) / 180);
    return {
      x,
      y,
    };
  };

  render() {
    const width = this.props.width;
    const height = this.props.height;
    return (
      <svg className={styles.svgOverlay} height={height} width={width} viewBox="0 0 235 235">
        {/* rest of dome */}
        <g
          style={{
            transition: 'transform 1.5s linear 0s',
            transformOrigin: `50% 50%`,
            transform: `translate(-16%, -11%) rotate(${this.props.positionActualDomeAz}deg)`,
            transformBox: 'fill-box',
          }}
        >
          <rect
            className={styles.shutter2}
            x="148.97"
            y="-50.78"
            width="4.05"
            height="173.5"
            transform="translate(186.96 -115.02) rotate(90)"
          />
          <polygon
            className={styles.shutter2}
            points="198.99 268.49 263.08 184.54 264.7 130.71 243.34 78.25 192.51 33.49 109.48 33.49 58.65 78.25 37.28 130.71 38.91 184.54 102.99 268.49 198.99 268.49"
          />
          <rect className={styles.shutter2} x="110.69" y="38.59" width="81.08" height="145.13" />
          <rect className={styles.shutter3} x="110.69" y="38.59" width="81.08" height="145.13" />
          <rect
            className={styles.shutter2}
            x="148.97"
            y="73.67"
            width="4.05"
            height="219.72"
            transform="translate(334.52 32.54) rotate(90)"
          />
          <rect
            className={styles.shutter2}
            x="148.56"
            y="187.18"
            width="4.86"
            height="154.05"
            transform="translate(415.19 113.21) rotate(90)"
          />
          {/* black hole behing the pointing */}
          <rect
            className={styles.shutter4}
            x="110.69"
            y="114.81"
            width="81.08"
            height="64.86"
            style={{
              transformOrigin: `50% 50%`,
              transform: `rotateX(${this.props.positionActualLightWindScreen}deg`,
            }}
          />
          {/* Shutter commanded right */}
          <g
            className={styles.shutterCommanded}
            style={{
              transformOrigin: `50% 50%`,
              transform: `translate(${(this.props.positionCommandedShutter * widthShutters[1]) / 100}px, 0)`,
              visibility: 'hidden',
            }}
          >
            <polygon
              className={styles.shutterCommanded}
              points="201.8 188.53 151.53 188.53 151.53 72.59 200.18 72.59 201.8 188.53"
            />
            <polygon
              className={styles.shutterCommanded}
              points="200.18 72.59 151.53 72.59 151.53 28.81 196.93 28.81 200.18 72.59"
            />
            <rect className={styles.shutterCommanded} x="151.53" y="188.53" width="50.27" height="12.97" />
          </g>
          {/* Shutter commanded left */}
          <g
            className={styles.shutterCommanded}
            style={{
              transformOrigin: `50% 50%`,
              transform: `translate(${(this.props.positionCommandedShutter * widthShutters[0]) / 100}px, 0)`,
              visibility: 'hidden',
            }}
          >
            <polygon
              className={styles.shutterCommanded}
              points="100.19 188.53 150.45 188.53 150.45 72.59 101.81 72.59 100.19 188.53"
            />
            <polygon
              className={styles.shutterCommanded}
              points="101.81 72.59 150.45 72.59 150.45 28.81 105.05 28.81 101.81 72.59"
            />
            <rect className={styles.shutterCommanded} x="100.19" y="188.53" width="50.27" height="12.97" />
          </g>
          {/* Shutter rigth */}
          <g
            className={styles.shutter}
            style={{
              transformOrigin: `50% 50%`,
              transform: `translate(${(this.props.positionActualShutter * widthShutters[1]) / 100}px, 0)`,
            }}
          >
            <polygon
              className={styles.shutter}
              points="201.8 188.53 151.53 188.53 151.53 72.59 200.18 72.59 201.8 188.53"
            />
            <polygon
              className={styles.shutter}
              points="200.18 72.59 151.53 72.59 151.53 28.81 196.93 28.81 200.18 72.59"
            />
            <rect className={styles.shutter} x="151.53" y="188.53" width="50.27" height="12.97" />
          </g>
          {/* Shutter left */}
          <g
            className={styles.shutter}
            style={{
              transformOrigin: `50% 50%`,
              transform: `translate(${(this.props.positionActualShutter * widthShutters[0]) / 100}px, 0)`,
            }}
          >
            <polygon
              className={styles.shutter}
              points="100.19 188.53 150.45 188.53 150.45 72.59 101.81 72.59 100.19 188.53"
            />
            <polygon
              className={styles.shutter}
              points="101.81 72.59 150.45 72.59 150.45 28.81 105.05 28.81 101.81 72.59"
            />
            <rect className={styles.shutter} x="100.19" y="188.53" width="50.27" height="12.97" />
          </g>
        </g>

        <g
          style={{
            transformOrigin: `50% 50%`,
            transform: `rotate(0deg)`,
            transformBox: 'fill-box',
          }}
        >
          <path
            style={{ stroke: '#788e9b', strokeDasharray: '4 6', fill: 'none', strokeMiterlimit: 10, visibility: 'hidden' }}
            d="M72.99,6.09H28.26v4.05h40.12L22.67,50.39,1.3,102.86l1.62,53.83,58.95,77.23h-23.89v4.86h27.6l1.42,1.86h96l1.42-1.86h27.6v-4.86h-23.89l58.95-77.23,1.62-53.83-21.37-52.47L161.65,10.14h40.12V6.09h-44.72l-.51-.45H73.5l-.51,.45Zm83.8,3.65V156.87H73.71V9.74h83.08Z"
          />
        </g>
      </svg>
    );
  }
}
