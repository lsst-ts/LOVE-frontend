import React, { Component } from 'react';
import Panel from '../../GeneralPurpose/Panel/Panel';
import styles from './LATISS.module.css';

export default class LATISS extends Component {
  lightPathSVG = (slope, index, maxX) => {
    return (
      <>
        <line
          x1={0}
          y1={index * slope * 100}
          x2={maxX}
          y2={index * slope * 100 + slope * maxX}
          className={styles.svgLightpath}
        />
        <line
          x1={0}
          y1={100 - index * slope * 100}
          x2={maxX}
          y2={100 - index * slope * 100 - slope * maxX}
          className={styles.svgLightpath}
        />
      </>
    );
  };

  wheelSelector = (title, selected, filterName) => {
    return (
      <div className={styles.wheelSelector}>
        <span />
        <span className={[styles.selectionBoxLabel, selected == 0 ? styles.selected : ''].join(' ')}>0</span>
        <span className={[styles.selectionBoxLabel, selected == 1 ? styles.selected : ''].join(' ')}>1</span>
        <span className={[styles.selectionBoxLabel, selected == 2 ? styles.selected : ''].join(' ')}>2</span>
        <span className={[styles.selectionBoxLabel, selected == 3 ? styles.selected : ''].join(' ')}>3</span>
        <span>{title}</span>
        <div className={[styles.selectionBox, selected == 0 ? styles.selected : ''].join(' ')} />
        <div className={[styles.selectionBox, selected == 1 ? styles.selected : ''].join(' ')} />
        <div className={[styles.selectionBox, selected == 2 ? styles.selected : ''].join(' ')} />
        <div className={[styles.selectionBox, selected == 3 ? styles.selected : ''].join(' ')} />
        <span />
        <span className={[styles.filterName, selected == 0 ? styles.selected : ''].join(' ')}>{selected == 0 ? filterName : ''}</span>
        <span className={[styles.filterName, selected == 1 ? styles.selected : ''].join(' ')}>{selected == 1 ? filterName : ''}</span>
        <span className={[styles.filterName, selected == 2 ? styles.selected : ''].join(' ')}>{selected == 2 ? filterName : ''}</span>
        <span className={[styles.filterName, selected == 3 ? styles.selected : ''].join(' ')}>{selected == 3 ? filterName : ''}</span>
      </div>
    );
  };

  render() {
    const slope = 0.08;
    return (
      <Panel title="LATISS" className={styles.panel}>
        <div className={styles.latissContainer}>
          <div className={styles.filterContainer}>
            <span className={styles.sectionTitle}>FILTER</span>
            <svg className={styles.lightpathElement} width={'100%'} viewBox="0 0 100 100">
              <g transform="rotate(5.71 30 50)">
                <rect x={50} y={-50} width={10} height={150} />
              </g>
              {this.lightPathSVG(slope, 1, 100)}
            </svg>
            {this.wheelSelector('FILTERS', 1, 'Filter ndsaddsadsaame')}
          </div>
          <div className={styles.gratingContainer}>
            <span className={styles.sectionTitle}>GRATING</span>
            <svg className={styles.lightpathElement} width={'100%'} viewBox="0 0 100 100">
              <rect x={45} y={-50} width={10} height={150} />
              {this.lightPathSVG(slope, 2, 100)}
            </svg>
          </div>
          <div className={styles.shutterContainer}>
            <span className={styles.sectionTitle}>SHUTTER</span>
            <svg className={styles.lightpathElement} width={'100%'} viewBox="0 0 100 100">
              <rect x={45} y={-50} width={10} height={150} />
              {this.lightPathSVG(slope, 3, 100)}
            </svg>
          </div>
          <div className={styles.ccdContainer}>
            <span className={styles.sectionTitle}>CCD</span>
            <svg className={styles.lightpathElement} width={'100%'} viewBox="0 0 100 100">
              <rect x={45} y={-50} width={10} height={150} />
              {this.lightPathSVG(slope, 4, 45)}
            </svg>
          </div>
        </div>
      </Panel>
    );
  }
}
