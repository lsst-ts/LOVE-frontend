import React, { Component } from 'react';
import Panel from '../../GeneralPurpose/Panel/Panel';
import styles from './LATISS.module.css';
import StatusText from '../../GeneralPurpose/StatusText/StatusText';
import { stateToStyleLATISS } from '../../../Config';

export default class LATISS extends Component {
  static movingElementStateMap = {
    0: 'HOMING',
    1: 'MOVING',
    2: 'STATIONARY',
    3: 'NOTINPOSITION',
  };

  static raftsStateMap = {
    0: 'NEEDS_CLEAR',
    1: 'CLEARING',
    2: 'INTEGRATING',
    3: 'READING_OUT',
    4: 'QUIESCENT',
  };

  static shutterStateMap = {
    0: 'CLOSED',
    1: 'OPEN',
    2: 'CLOSING',
    3: 'OPENING',
  };

  static FILTER_ANGLE = 5.71;

  static FILTER_ANGLE_RAD = (5.71 * Math.PI) / 180;

  constructor(props) {
    super(props);
    this.state = {
      fwState: 0,
      gwState: 1,
      lsState: 2,
      shutterDetailedState: 0,
      raftsDetailedState: 0,
      reportedLinearStagePosition: 30,
      reportedDisperserPosition: 0,
      reportedFilterPosition: 0,
    };
  }

  componentDidMount = () => {
    setInterval(() => {
      this.setState({
        fwState: [0, 1, 2, 2, 2, 2, 2, 3][~~(Math.random() * 8)],
        gwState: [0, 1, 2, 2, 2, 2, 2, 3][~~(Math.random() * 8)],
        lsState: [0, 1, 2, 2, 2, 2, 2, 3][~~(Math.random() * 8)],
        shutterDetailedState: [0, 1, 2, 3][~~(Math.random() * 4)],
        raftsDetailedState: [0, 1, 2, 3, 4][~~(Math.random() * 5)],
        reportedLinearStagePosition: ~~(Math.random() * 75),
        reportedDisperserPosition: [0, 1, 2, 3][~~(Math.random() * 4)],
        reportedFilterPosition: [0, 1, 2, 3][~~(Math.random() * 4)],
      });
    }, 3000);
  };

  drawLightPath = (slope, index, isReceivingLight, maxX, elementSlope = 0) => {
    let xLimitTop = isReceivingLight ? maxX : 0;
    let xLimitBot = isReceivingLight ? maxX : 0;
    if (xLimitTop < 100 && xLimitTop > 0 && elementSlope !== 0) {
      xLimitTop = maxX + 40 * Math.sin(elementSlope);
      xLimitBot = maxX - 40 * Math.sin(elementSlope);
    }
    return (
      <>
        <polygon
          points={`
          0,${100 - index * slope * 100} 
          ${xLimitBot},${100 - index * slope * 100 - slope * xLimitBot}
          ${xLimitTop},${index * slope * 100 + slope * xLimitTop} 
          0,${index * slope * 100} 
          `}
          fill="white"
          fillOpacity="0.02"
        />
        <line
          x1={0}
          y1={index * slope * 100}
          x2={xLimitTop}
          y2={index * slope * 100 + slope * xLimitTop}
          className={styles.svgLightpath}
        />
        <line
          x1={0}
          y1={100 - index * slope * 100}
          x2={xLimitBot}
          y2={100 - index * slope * 100 - slope * xLimitBot}
          className={styles.svgLightpath}
        />
      </>
    );
  };

  wheelSelector = (title, selected, filterName) => {
    return (
      <div className={styles.wheelSelector}>
        <span />
        <span className={[styles.selectionBoxLabel, selected === 0 ? styles.selected : ''].join(' ')}>0</span>
        <span className={[styles.selectionBoxLabel, selected === 1 ? styles.selected : ''].join(' ')}>1</span>
        <span className={[styles.selectionBoxLabel, selected === 2 ? styles.selected : ''].join(' ')}>2</span>
        <span className={[styles.selectionBoxLabel, selected === 3 ? styles.selected : ''].join(' ')}>3</span>
        <span className={styles.selectionBoxTitle}>{title}</span>
        <div className={[styles.selectionBox, selected === 0 ? styles.selected : ''].join(' ')} />
        <div className={[styles.selectionBox, selected === 1 ? styles.selected : ''].join(' ')} />
        <div className={[styles.selectionBox, selected === 2 ? styles.selected : ''].join(' ')} />
        <div className={[styles.selectionBox, selected === 3 ? styles.selected : ''].join(' ')} />
        <span />
        <span className={[styles.filterName, selected === 0 ? styles.selected : ''].join(' ')}>
          {selected === 0 ? filterName : ''}
        </span>
        <span className={[styles.filterName, selected === 1 ? styles.selected : ''].join(' ')}>
          {selected === 1 ? filterName : ''}
        </span>
        <span className={[styles.filterName, selected === 2 ? styles.selected : ''].join(' ')}>
          {selected === 2 ? filterName : ''}
        </span>
        <span className={[styles.filterName, selected === 3 ? styles.selected : ''].join(' ')}>
          {selected === 3 ? filterName : ''}
        </span>
      </div>
    );
  };

  drawLinearStage = (linearStageValue, linearStagePosition, isMoving) => {
    return (
      <g className={styles.linearStage}>
        <line x1={10} y1={110} x2={90} y2={110} className={styles.backgroundLine} />
        <line x1={10} y1={110} x2={90} y2={110} className={styles.ticks} />
        <line
          x1={linearStagePosition}
          y1={103}
          x2={linearStagePosition}
          y2={110}
          strokeWidth={0.5}
          stroke="white"
          className={[styles.currentPosition, isMoving ? styles.moving : ''].join(' ')}
        />
        {linearStageValue < 60 ? (
          <text
            x={linearStagePosition + 2}
            y={107}
            textAnchor="start"
            className={[styles.valueText, isMoving ? styles.moving : ''].join(' ')}
          >
            {linearStageValue}mm
          </text>
        ) : (
          <text
            x={linearStagePosition - 2}
            y={107}
            textAnchor="end"
            className={[styles.valueText, isMoving ? styles.moving : ''].join(' ')}
          >
            {linearStageValue}mm
          </text>
        )}
        <text x={10} y={115} textAnchor="middle" className={styles.labelText}>
          0mm
        </text>
        <text x={90} y={115} textAnchor="middle" className={styles.labelText}>
          75mm
        </text>
      </g>
    );
  };

  drawShutter = (x, style, state) => {
    const isOpen = state === 'OPEN' || state === 'CLOSING';
    const isMoving = state === 'OPENING' || state === 'CLOSING';
    return (
      <g className={style}>
        <rect
          x={x}
          y={0}
          width={10}
          height={100}
          className={[styles.backgroundRect, isMoving ? styles.moving : ''].join(' ')}
        />
        <rect
          x={x}
          y={isOpen ? 0 : 25}
          width={10}
          height={25}
          className={[styles.shutterRect, isMoving ? styles.moving : ''].join(' ')}
        />
        <rect
          x={x}
          y={isOpen ? 75 : 50}
          width={10}
          height={25}
          className={[styles.shutterRect, isMoving ? styles.moving : ''].join(' ')}
        />
        {isMoving && (
          <>
            <rect
              x={x}
              y={isOpen ? 25 : 0}
              width={10}
              height={25}
              className={[styles.shutterTargetRect, isMoving ? styles.moving : ''].join(' ')}
            />
            <rect
              x={x}
              y={isOpen ? 50 : 75}
              width={10}
              height={25}
              className={[styles.shutterTargetRect, isMoving ? styles.moving : ''].join(' ')}
            />
          </>
        )}
      </g>
    );
  };

  drawLightPathElement = (x, style, isMoving) => {
    return <rect x={x} y={0} width={10} height={100} className={[style, isMoving ? styles.moving : ''].join(' ')} />;
  };

  linearStageValueToPosition = (value) => {
    return 10 + (value / 75) * (90 - 10);
  };

  render() {
    const slope = 0.08;
    const linearStagePosition = this.linearStageValueToPosition(this.state.reportedLinearStagePosition);

    const filterWheelState = LATISS.movingElementStateMap[this.state.fwState];
    const gratingWheelState = LATISS.movingElementStateMap[this.state.gwState];
    const linearStageState = LATISS.movingElementStateMap[this.state.lsState];
    const shutterState = LATISS.shutterStateMap[this.state.shutterDetailedState];
    const ccdState = LATISS.raftsStateMap[this.state.raftsDetailedState];

    const isFilterMoving = filterWheelState === 'MOVING' || filterWheelState === 'HOMING';
    const isLinearStageMoving = linearStageState === 'MOVING' || linearStageState === 'HOMING';
    const isGratingMoving = gratingWheelState === 'MOVING' || gratingWheelState === 'HOMING';

    const isFilterBlocking = filterWheelState !== 'STATIONARY';
    const isGratingBlocking = gratingWheelState !== 'STATIONARY';
    const isShutterBlocking = shutterState === 'CLOSED' || shutterState === 'OPENING';

    return (
      <Panel title="LATISS" className={styles.panel}>
        <div className={styles.latissContainer}>
          <span className={styles.sectionTitle}>FILTER</span>
          <span className={styles.sectionTitle}>GRATING</span>
          <span className={styles.sectionTitle}>SHUTTER</span>
          <span className={styles.sectionTitle}>CCD</span>
          <div className={styles.statusTextWrapper}>
            <span>WHEEL STATE</span>{' '}
            <StatusText status={stateToStyleLATISS[filterWheelState]}>{filterWheelState}</StatusText>
          </div>
          <div className={styles.statusTextWrapper}>
            <span>WHEEL STATE</span>{' '}
            <StatusText status={stateToStyleLATISS[gratingWheelState]}>{gratingWheelState}</StatusText>
          </div>
          <div className={styles.statusTextWrapper}>
            <span>SHUTTER STATE</span> <StatusText status={stateToStyleLATISS[shutterState]}>{shutterState}</StatusText>
          </div>
          <div className={styles.statusTextWrapper}>
            <span>CCD STATE</span> <StatusText status={stateToStyleLATISS[ccdState]}>{ccdState}</StatusText>
          </div>
          {this.wheelSelector('FILTER POSITION', this.state.reportedFilterPosition, 'Filter name')}
          {this.wheelSelector('GRATING POSITION', this.state.reportedDisperserPosition, 'Grating name')}
          <div />
          <div />
          {/** SVGS */}
          <svg className={styles.lightpathElement} viewBox="0 0 100 120">
            <g transform={`rotate(${LATISS.FILTER_ANGLE} 50 50)`}>
              {this.drawLightPathElement(50, styles.movingElement, isFilterMoving)}
            </g>
            {this.drawLightPath(slope, 1, true, isFilterBlocking ? 50 : 100, LATISS.FILTER_ANGLE_RAD)}
          </svg>
          <svg className={styles.lightpathElement} viewBox="0 0 100 120">
            {this.drawLightPathElement(
              linearStagePosition - 5,
              styles.movingElement,
              isLinearStageMoving || isGratingMoving,
            )}
            {this.drawLightPath(slope, 2, !isFilterBlocking, isGratingBlocking ? linearStagePosition - 5 : 100)}
            {this.drawLinearStage(this.state.reportedLinearStagePosition, linearStagePosition, isLinearStageMoving)}
          </svg>
          <svg className={styles.lightpathElement} viewBox="0 0 100 120">
            {this.drawShutter(50, styles.shutter, shutterState)}
            {this.drawLightPath(slope, 3, !(isFilterBlocking || isGratingBlocking), isShutterBlocking ? 50 : 100)}
          </svg>
          <svg className={styles.lightpathElement} viewBox="0 0 100 120">
            {this.drawLightPathElement(50, styles.ccd, isLinearStageMoving)}
            {this.drawLightPath(slope, 4, !(isFilterBlocking || isGratingBlocking || isShutterBlocking), 50)}
          </svg>
          <div />
          <div className={styles.statusTextWrapper}>
            <span>LINEAR STAGE STATE</span>{' '}
            <StatusText status={stateToStyleLATISS[linearStageState]}>{linearStageState}</StatusText>
          </div>
          <div />
          <div />
        </div>
      </Panel>
    );
  }
}
