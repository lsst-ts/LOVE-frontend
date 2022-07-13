import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './MTDome.module.css';

export default class MTDomePointing extends Component {
  static propTypes = {
    /** Skyview width */
    width: PropTypes.number,
    /** Skyview height */
    height: PropTypes.number,
    /** Target mount azimuth at the specified time. The allowed range is 0 to 360 */
    targetPointingAz: PropTypes.object,
    /** Target mount elevation at the specified time */
    targetPointingEl: PropTypes.object,
  };

  static defaultProps = {
    targetPointingAz: {},
    targetPointingEl: {},
    currentPointing: {
      el: 90,
      az: 0,
    },
    azelToPixel: () => {},
    width: 300,
    height: 300,
    isProjected: true,
  };

  /** Function to convert az/el to pixels */
  azelToPixel = (pos, isProjected) => {
    const { az, el } = pos;
    const width = 300;
    const height = 300;
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
    const { width, height } = this.props;
    const zenithPixels = this.azelToPixel({ az: 0, el: 90 }, false);
    const el = this.props.currentPointing.el;
    const az = this.props.currentPointing.az;
    return (
      <svg className={styles.svgOverlay} height={height} width={width} viewBox="0 0 300 300">
        {/* pointing */}
        <g className={styles.pointing}>
          <circle
            className={styles.targetPointing}
            r={16}
            strokeWidth={2}
            cx={zenithPixels.x}
            cy={zenithPixels.y}
            style={{
              transform: `rotateZ(${this.props.targetPointing.az}deg) rotateX(${this.props.targetPointing.el - 90}deg)`,
              transformOrigin: `50% 50%`,
            }}
          />

          <g
            style={{
              transform: `rotateZ(${az}deg)`,
              transformOrigin: `50% 50%`,
            }}
          >
            <circle
              className={styles.currentPointing}
              r={16}
              strokeWidth={2}
              cx={zenithPixels.x}
              cy={zenithPixels.y}
              style={{
                transform: `rotateX(${el - 90}deg)`,
              }}
            />
          </g>
        </g>
      </svg>
    );
  }
}
