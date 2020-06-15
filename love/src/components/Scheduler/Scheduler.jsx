import React, { Component } from 'react';
import GenericCamera from '../GenericCamera/GenericCamera';
import { azel_sample } from '../GenericCamera/CameraUtils';
import styles from './Scheduler.module.css';

export default class Scheduler extends Component {

  constructor(props){
    super(props);
    const data = azel_sample.map((azel) => {
      return {
        azel: azel,
        value: azel[1] > 50 && azel[0] > 180 ? Math.random() : 0,
      };
    });
    const data2 = azel_sample.map((azel) => {
      return {
        azel: azel,
        value: azel[1] > 30 && azel[0] < 120 ? Math.random() : 0,
      };
    });

    this.state = {
      healpixOverlays: [
        { azelData: data, name: 'Overlay one', display: true },
        { azelData: data2, baseColor: 'red', name: 'Overlay one', display: true },
      ],
    }
  }

  render() {
    return (
      <div className={styles.container}>
        <div>
          Layers:
        </div>
        <GenericCamera healpixOverlays={this.state.healpixOverlays}></GenericCamera>
      </div>
    );
  }
}
