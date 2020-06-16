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
        value: azel[1] > 50 && azel[0] > 60 ? Math.random() : 0,
      };
    });
    const data2 = azel_sample.map((azel) => {
      return {
        azel: azel,
        value: azel[1] > 30 && azel[0] < 120 ? Math.random() : 0,
      };
    });

    const onCellClick = (layerName, value, index) => {
      this.setState({
        selectedCell: {
          layerName,
          value,
          index,
        },
      });
    };

    this.state = {
      healpixOverlays: [
        { azelData: data, baseColor: 'blue', name: 'Layer one', display: true, onCellClick },
        { azelData: data2, baseColor: 'red', name: 'Layer two', display: true, onCellClick },
      ],
      selectedCell: undefined,
    };
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.selectorContainer}>
          <span className={styles.selectorTitle}>Layers:</span>
          <div>
            {this.state.healpixOverlays.map((overlay, index) => {
              return (
                <div key={overlay.name}>
                  <label>
                    <input
                      onChange={(event) => {
                        const newOverlays = [...this.state.healpixOverlays];
                        newOverlays[index] = { ...newOverlays[index], display: !overlay.display };
                        this.setState({
                          healpixOverlays: newOverlays,
                        });
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
          {this.state.selectedCell && (
            <>
              <div className={styles.selectorTitle}>Selected cell:</div>
              <span>{this.state.selectedCell?.layerName}: </span>
              <span className={styles.value}>{Math.round(this.state.selectedCell?.value * 100) / 100}</span>
            </>
          )}
        </div>
        <GenericCamera
          healpixOverlays={this.state.healpixOverlays}
          selectedCell={this.state.selectedCell}
        ></GenericCamera>
      </div>
    );
  }
}
