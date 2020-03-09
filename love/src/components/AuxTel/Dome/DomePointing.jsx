import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './Dome.module.css';

export default class DomePointing extends Component {
  static propTypes = {
    /** Skyview width */
    width: PropTypes.number,
    /** Skyview height */
    height: PropTypes.number,
    /** Whether the radial distances are projected or equidistant */
    isProjected: PropTypes.bool,
    /** Coordinates of current pointing */
    currentPointing: PropTypes.object,
    /** Coordinates of target pointing */
    targetPointing: PropTypes.object,
  };

  static defaultProps = {
    azelToPixel: () => {},
    width: 596,
    height: 596,
    isProjected: true,
  };

  /** Function to convert az/el to pixels */
  azelToPixel = (pos, isProjected) => {
    const { az, el } = pos;
    const width = 596;
    const height = 596;
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
      <svg className={styles.svgOverlay} height={height} width={width} viewBox="0 0 596 596">

        <circle
          className={styles.targetPointing}
          r={32}
          strokeWidth={2}
          cx={zenithPixels.x}
          cy={zenithPixels.y}
          style={{
            transform: `rotateZ(${this.props.targetPointing.az}deg) rotateX(${this.props.targetPointing.el-90}deg)`,
            transformOrigin: `50% 50% ${280}px`,
          }}
        />
        <circle
          className={styles.currentPointing}
          r={32}
          strokeWidth={2}
          cx={zenithPixels.x}
          cy={zenithPixels.y}
          style={{
            transform: `rotateZ(${az}deg) rotateX(${el-90}deg)`,
            transformOrigin: `50% 50% ${280}px`,
          }}
        />
        {/* <circle r={4} cx={targetPixels.x} cy={targetPixels.y} fill="gray" /> */}
      </svg>
    );
  }
}
