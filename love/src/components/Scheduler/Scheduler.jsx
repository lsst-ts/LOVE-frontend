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

    this.state = {
      healpixOverlays: [
        { azelData: data, baseColor: 'blue', name: 'Layer one', display: true },
        { azelData: data2, baseColor: 'red', name: 'Layer two', display: true },
      ],
      targetData: [
        { xy: [100, 140], filter: 'u', id: 123 },
        { xy: [140, 160], filter: 'g', id: 124 },
        { xy: [200, 240], filter: 'r', id: 125 },
      ],
      displayTargetLayer: true,
      selectedCell: undefined,
    };
  }

  onLayerClick = (layerName, value, index) => {
    this.setState({
      selectedCell: {
        layerName,
        value,
        index,
      },
    });
  };

  renderCellValue = (cell) => {
    const value = cell.value;
    if (typeof value === 'number')
      return <div className={styles.targetData}>
          <span>Cell value: </span>
          <span className={styles.value}>{Math.round(this.state.selectedCell?.value * 100) / 100}</span>
        </div>
    if (typeof value === 'object')
      return (
        <div className={styles.targetData}>
          {Object.keys(value).map((key, i) => {
            return (
              <>
                <span>{key}: </span>
                <span className={styles.value}>{value[key]}</span>
              </>
            );
          })}
        </div>
      );
    return JSON.stringify(value);
  };

  render() {
    const targetOverlay = {
      display: this.state.displayTargetLayer,
      name: 'Target layer',
      data: this.state.targetData,
    };
    return (
      <div className={styles.container}>
        <div className={styles.selectorContainer}>
          <span className={styles.selectorTitle}>Layers:</span>
          <div>
            <div>
              <label>
                <input
                  onChange={(event) => {
                    this.setState({ displayTargetLayer: !this.state.displayTargetLayer });
                  }}
                  type="checkbox"
                  alt={`toggle target layer`}
                  checked={this.state.displayTargetLayer}
                />
                <span>{targetOverlay.name}</span>
              </label>
            </div>
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
              <div className={styles.selectorTitle}>Selected object:</div>
              <span>{this.state.selectedCell?.layerName}: </span>
              {this.renderCellValue(this.state.selectedCell)}
            </>
          )}
        </div>
        <GenericCamera
          healpixOverlays={this.state.healpixOverlays}
          targetOverlay={targetOverlay}
          selectedCell={this.state.selectedCell}
          onLayerClick={this.onLayerClick}
        ></GenericCamera>
      </div>
    );
  }
}
