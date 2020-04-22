import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './Limits.module.css';

export default class Limits extends Component {
  static propTypes = {
    lowerLimit: PropTypes.number,
    upperLimit: PropTypes.number,
    currentValue: PropTypes.number,
    targetValue: PropTypes.number,
    displayLabels: PropTypes.bool,
    height: PropTypes.number,
  };

  static defaultProps = {
    lowerLimit: 0,
    upperLimit: 100,
    currentValue: 30,
    targetValue: 60,
    displayLabels: true,
    height: 15,
    limitWarning: 5,
  };

  render() {
    const { lowerLimit, upperLimit, limitWarning } = this.props;
    const { currentValue, targetValue } = this.props;
    const height = this.props.height;
    const barHeight = height / 7;
    const xMargin = 5;
    const currentValueX = xMargin + ((100 - 2 * xMargin) * (currentValue - lowerLimit)) / (upperLimit - lowerLimit);
    const targetValueX = xMargin + ((100 - 2 * xMargin) * (targetValue - lowerLimit)) / (upperLimit - lowerLimit);
    const yOffset = height / 3;
    const limitWarningPixels = (limitWarning / (upperLimit - lowerLimit)) * 100;
    const isInWarningZone = currentValue > upperLimit || currentValue < lowerLimit;

    return (
      <div className={styles.container}>
        <svg version="1.1" x="0px" y="0px" viewBox={`0 0 100 ${height}`} className={styles.container}>
          <line
            className={styles.backgroundBar}
            x1={xMargin}
            y1={height / 2 + yOffset}
            x2={100 - xMargin}
            y2={height / 2 + yOffset}
            strokeWidth={barHeight}
          />
          <line
            className={[styles.warningBar, isInWarningZone ? styles.activeWarning : ''].join(' ')}
            x1={xMargin}
            y1={height / 2 + yOffset}
            x2={xMargin + limitWarningPixels}
            y2={height / 2 + yOffset}
            strokeWidth={barHeight}
          />
          <line
            className={[styles.warningBar, isInWarningZone ? styles.activeWarning : ''].join(' ')}
            x1={-limitWarningPixels + 100 - xMargin}
            y1={height / 2 + yOffset}
            x2={100 - xMargin}
            y2={height / 2 + yOffset}
            strokeWidth={barHeight}
          />
          <rect
            className={styles.currentValue}
            x={currentValueX - 0.5}
            y={height / 3 + yOffset}
            height={height / 3}
            width={1}
            strokeWidth={0}
          />
          <line
            className={styles.targetValue}
            x1={targetValueX}
            y1={height / 3 + yOffset}
            x2={targetValueX}
            y2={(2 * height) / 3 + yOffset}
          />
          {this.props.displayLabels && (
            <>
              <text
                className={[styles.text, styles.bottom].join(' ')}
                x={xMargin}
                y={height / 2 + yOffset + barHeight / 2}
              >
                {lowerLimit}º
              </text>
              <text
                className={[styles.text, styles.bottom].join(' ')}
                x={100 - xMargin}
                y={height / 2 + yOffset + barHeight / 2}
              >
                {upperLimit}º
              </text>
            </>
          )}
        </svg>
      </div>
    );
  }
}
