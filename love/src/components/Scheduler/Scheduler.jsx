import React, { Component } from 'react';
import GenericCamera from '../GenericCamera/GenericCamera';
import { azel_sample } from '../GenericCamera/CameraUtils';
import styles from './Scheduler.module.css';

export default class Scheduler extends Component {
  constructor(props) {
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
        { azelData: data, name: 'Layer one', display: true },
        { azelData: data2, baseColor: 'red', name: 'Layer two', display: true },
      ],
    };
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.selectorContainer}>
          <span className={styles.selectorTitle}>
            Layers:
          </span>
          <div>
            {this.state.healpixOverlays.map((overlay, index) => {
              return (
                <div key={overlay.name}>
                  <label>
                    <input
                      onChange={(event) => {
                        const newOverlays = [...this.state.healpixOverlays];
                        newOverlays[index] = {...newOverlays[index], display: !overlay.display}
                        this.setState({
                          healpixOverlays: newOverlays,
                        })
                      }}
                      type="checkbox"
                      alt={`toggle ${overlay.name}`}
                      checked={overlay.display}
                    />
                    <span>{overlay.name}</span>
                  </label>
                </div>
              );
            })}
          </div>
        </div>
        <GenericCamera healpixOverlays={this.state.healpixOverlays}></GenericCamera>
      </div>
    );
  }
}
