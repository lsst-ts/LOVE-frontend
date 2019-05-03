import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import styles from './Skymap.module.css';
import SkymapGrid from './SkymapGrid';
import Pointing from './Pointing';

export default class Skymap extends Component {
  // static propTypes = {
  //   prop: PropTypes
  // };

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
    const width = 500;
    const height = 500;
    const currentPointing = {
      az: 0,
      el: 20,
    };
    const targetPointing = {
      az: 0,
      el: 50,
    };
    const isProjected = false;
    return (
      <div className={styles.skymapContainer}>
        <h2>Skymap</h2>
      <div className={styles.skymapGridContainer}>
        <Pointing
          width={width}
          height={height}
          azelToPixel={this.azelToPixel}
          currentPointing={currentPointing}
          targetPointing={targetPointing}
          isProjected={isProjected}
        />
        <SkymapGrid width={width} height={height} isProjected={isProjected}/>
      </div>
      </div>
    );
  }
}
