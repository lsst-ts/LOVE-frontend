import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './Skymap.module.css';

export default class Pointing extends Component {
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
    const offset = 30;
    const center = [width / 2, height / 2];
    let r;
    if (isProjected) {
      r = Math.cos((el * Math.PI) / 180) * (width / 2 - offset);
    } else {
      r = ((90 - el) / 90) * (width / 2 - offset);
    }
    const x = center[0] + r * Math.cos((az * Math.PI) / 180);
    const y = center[1] - r * Math.sin((az * Math.PI) / 180);
    return {
      x,
      y,
    };
  };

  render() {
    const { width, height } = this.props;
    const currentPixels = this.azelToPixel(this.props.currentPointing, this.props.isProjected);
    const targetPixels = this.azelToPixel(this.props.targetPointing, this.props.isProjected);

    return (
      <svg className={styles.svgOverlay} height={height} width={width} viewBox="0 0 596 596">
        <line
          x1={currentPixels.x}
          y1={currentPixels.y}
          x2={targetPixels.x}
          y2={targetPixels.y}
          stroke="white"
          strokeDasharray="5"
        />
        <circle r={8} stroke="white" strokeWidth={2} cx={currentPixels.x} cy={currentPixels.y} fill="#132631" />
        {/* <circle r={4} cx={targetPixels.x} cy={targetPixels.y} fill="gray" /> */}
      </svg>
    );
  }
}
