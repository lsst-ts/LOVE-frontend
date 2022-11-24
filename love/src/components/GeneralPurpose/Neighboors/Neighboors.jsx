import React, { Component } from 'react';
import styles from './Neighboors.module.css';

export default class Neighboors extends Component {
  render() {
    const { children, selectNeighboor } = this.props;
    return (
      <div className={styles.container}>
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 20,
            backgroundColor: 'rgb(255,0,0,.5)',
            transform: 'translate(0, -100%)',
          }}
          onClick={() => selectNeighboor('top')}
        >
          UP
        </div>
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 20,
            backgroundColor: 'rgb(255,50,0,.5)',
            transformOrigin: 'left',
            transform: 'translate(calc(100% + 12px), -8px) rotate(90deg)',
          }}
          onClick={() => selectNeighboor('right')}
        >
          RIGHT
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 20,
            backgroundColor: 'rgb(255,150,50,.5)',
            transform: 'translate(0, calc(100% + 3px))',
          }}
          onClick={() => selectNeighboor('bottom')}
        >
          BOTTOM
        </div>
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 20,
            backgroundColor: 'rgb(50,255,50,.5)',
            transformOrigin: 'left',
            transform: 'translate(-10px, -8px) rotate(90deg)',
          }}
          onClick={() => selectNeighboor('left')}
        >
          LEFT
        </div>
        {children}
      </div>
    );
  }
}
