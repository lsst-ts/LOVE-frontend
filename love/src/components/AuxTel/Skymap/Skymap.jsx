import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './Skymap.module.css';
import SkymapGrid from './SkymapGrid';
import Pointing from './Pointing';

export default class Skymap extends Component {
  static propTypes = {
    // prop: PropTypes
  };

  azelToPixel = (pos) => {
    const { az, el } = pos;
    const width = 596;
    const height = 596;
    const offset = 5;
    const center = [width / 2, height / 2];
    // const r = (Math.cos((el * Math.PI) / 180) * width) / 2 - offset;
    const r = (((90-el) / 90) * width) / 2 - offset;
    const x = center[0] + r * Math.cos((az * Math.PI) / 180);
    const y = center[1] - r * Math.sin((az * Math.PI) / 180);
    return {
      x,
      y,
    };
  };

  render() {
    let width = 1000;
    let height = 1000;
    let currentPointing = {
      az: 45,
      el: 0,
    };
    let targetPointing = {
      az: 45,
      el: 45,
    };
    const pixel = this.azelToPixel(currentPointing);
    return (
      <div className={styles.skymapContainer}>
        <Pointing
          width={width}
          height={height}
          azelToPixel={this.azelToPixel}
          currentPointing={currentPointing}
          targetPointing={targetPointing}
        />
        <SkymapGrid width={width} height={height} />
      </div>
    );
  }
}
