import React, { Component } from 'react';
import GenericCamera from '../GenericCamera/GenericCamera';
import { azel_sample } from '../GenericCamera/CameraUtils';
import styles from './Scheduler.module.css';

export default class Scheduler extends Component {
  render() {
    const data = azel_sample.map((azel) => {
      return {
        azel: azel,
        value: azel[1] > 50 && azel[0] > 180 ? Math.random() : 0,
      };
    });
    return (
      <div className={styles.container}>
        <GenericCamera healpixOverlays={[{ azelData: data }]}></GenericCamera>
      </div>
    );
  }
}
