import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './Skymap.module.css';

export default class Pointing extends Component {
  static propTypes = {
    /** Function to convert az/el to pixels */
    azelToPixel: PropTypes.func,
    /** Skyview width */
    width: PropTypes.number,
    /** Skyview height */
    height: PropTypes.number,
  };

  static defaultProps = {
    azelToPixel: () => {},
    width: 596,
    height: 596,
  };

  render() {
    const { width, height } = this.props;
    const currentPixels = this.props.azelToPixel(this.props.currentPointing);
    const targetPixels = this.props.azelToPixel(this.props.targetPointing);

    return (
      <svg className={styles.svgOverlay} height={height} width={width} viewBox="0 0 596 596">
        <circle r={4} cx={currentPixels.x} cy={currentPixels.y} fill="white" />
        <circle r={4} cx={targetPixels.x} cy={targetPixels.y} fill="gray" />
        <line
          x1={currentPixels.x}
          y1={currentPixels.y}
          x2={targetPixels.x}
          y2={targetPixels.y}
          stroke="white"
          strokeDasharray="6"
        />
      </svg>
    );
  }
}
