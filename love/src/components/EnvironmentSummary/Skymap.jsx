import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import styles from './Skymap.module.css';
import SkymapGrid from './SkymapGrid';
import Pointing from './Pointing';

export default class Skymap extends Component {
  // static propTypes = {
  //   prop: PropTypes
  // };

  render() {
    const width = 500;
    const height = 500;
    const currentPointing = {
      az: 0,
      el: 20,
    };
    const currentPointing2 = {
      az: 160,
      el: 80,
    };
    const targetPointing = {
      az: 270,
      el: 20,
    };
    const isProjected = false;
    return (
      <div className={styles.skymapContainer}>
        <h2>Skymap</h2>
        <div className={styles.skymapGridContainer}>
          <Pointing
            width={width}
            height={height}
            currentPointing={currentPointing}
            // targetPointing={targetPointing}
            targetPointing={currentPointing}
            isProjected={isProjected}
          />
          <Pointing
            width={width}
            height={height}
            currentPointing={currentPointing2}
            // targetPointing={targetPointing}
            targetPointing={currentPointing2}
            isProjected={isProjected}
          />
          <SkymapGrid width={width} height={height} isProjected={isProjected} />
        </div>
      </div>
    );
  }
}
