import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { fixedFloat } from 'Utils';
import styles from './Elevation.module.css';

export default class Limits extends Component {
  static propTypes = {
    /** Maximum limit 3, start of fault gauge */
    maxL3: PropTypes.number,
    /** Maximum limit 2, start of warning gauge */
    maxL2: PropTypes.number,
    /** Maximum limit 1, start of nominal gauge */
    maxL1: PropTypes.number,
    /** Maximum limit 1, end of nominal gauge */
    minL1: PropTypes.number,
    /** Maximum limit 2, end of warning gauge */
    minL2: PropTypes.number,
    /** Maximum limit 3, end of fault gauge */
    minL3: PropTypes.number,

    /** gauge Size */
    radius: PropTypes.number,

    /** Value origin, from where the gauge fills up */
    valueOrigin: PropTypes.number,
    /** Current value */
    currentValue: PropTypes.number,
    /** Target value */
    targetValue: PropTypes.number,

    /** Option to show labels */
    displayLabels: PropTypes.bool,
  };

  static defaultProps = {
    height: 75,
    maxL3: 90,
    maxL2: 80,
    maxL1: 70,
    minL1: 10,
    minL2: 5,
    minL3: 0,

    radius: 10,

    valueOrigin: 0,
    currentValue: 0,
    targetValue: 0,

    displayLabels: true,
  };

  render() {
    const {
      currentValue,
      targetValue,
      height,
      maxL3,
      maxL2,
      maxL1,
      minL1,
      minL2,
      minL3,
      radius,
      valueOrigin,
      displayLabels,
    } = this.props;

    {
      /* Convert Angles to pie % */
    }
    const percMaxL3 = (maxL3 / 360) * (radius * 3.142) - (minL3 / 360) * (radius * 3.142) + ' ' + radius * 3.142;
    const percMaxL2 = (maxL2 / 360) * (radius * 3.142) - (minL2 / 360) * (radius * 3.142) + ' ' + radius * 3.142;
    const percMaxL1 = (maxL1 / 360) * (radius * 3.142) - (minL1 / 360) * (radius * 3.142) + ' ' + radius * 3.142;
    const percTarget = Math.abs((targetValue / 360) * (radius * 3.142)) + ' ' + radius * 3.142;
    const percCurrent = Math.abs((currentValue / 360) * (radius * 3.142)) + ' ' + radius * 3.142;

    const rad = Math.PI / 180;

    const currentText_X = radius * Math.cos(currentValue * rad);
    const currentText_Y = -1 * radius * Math.sin(currentValue * rad);

    const rotTarget = 'rotate(' + (targetValue - minL3) + ') scale(1, 1)';

    const gaugeRotation = 'rotate(' + -minL3 + ') scale(1, -1)';
    const rotMinL3 = 'rotate(' + -minL3 + ')';
    const rotMinL2 = 'rotate(' + (-1 * minL3 + minL2) + ')';
    const rotMinL1 = 'rotate(' + (-1 * minL3 + minL1) + ')';

    {
      /* Check if current or target value is within danger or warning zone */
    }
    const isInWarningZone = currentValue > maxL1 || currentValue < minL1;
    const isInDangerZone = currentValue > maxL2 || currentValue < minL2;
    const isTargetWarningZone = targetValue > maxL1 || targetValue < minL1;
    const isTargetDangerZone = targetValue > maxL2 || targetValue < minL2;

    console.log(minL3);

    return (
      <svg className={styles.svgElevation} height={height / 2} viewBox={`0 0 ${height} ${height}`}>
        {/* Current value */}
        <text className={styles.originText} transform={`${'translate(' + (radius + 1) + ' 0)'}`}>
          <tspan>0º</tspan>
        </text>

        <g className={styles.targetText} transform={`${'rotate(' + currentValue * -1 + ')'}`}>
          <text
            transform={`${'translate(' + radius + ' 0) rotate(' + currentValue + ')'}`}
            transition=" transform 1.5s linear 0s"
          >
            <tspan
              className={[
                currentText_X < 0
                  ? [currentText_Y < 0 ? styles.textQ2 : styles.textQ3]
                  : [currentText_Y < 0 ? styles.textQ1 : styles.textQ4],
              ].join(' ')}
            >{`${fixedFloat(currentValue, 2) + 'º'}`}</tspan>
          </text>
        </g>

        <g transform={`${gaugeRotation}`}>
          {/* Cartoon background */}
          <circle
            r={`${radius / 2}`}
            cx="0"
            cy="0"
            className={styles.bg}
            stroke-width={`${radius}`}
            stroke-dasharray={`${percMaxL3}`}
          />

          {/* Target background */}
          <circle
            r={`${radius / 2}`}
            cx="0"
            cy="0"
            className={styles.bgTarget}
            stroke-width={`${radius}`}
            stroke-dasharray={`${percTarget}`}
            transform={`${'rotate(' + (0 - minL3) + ') scale(1, ' + [targetValue < 0 ? -1 : 1] + ')'}`}
          />

          {/* Current background */}
          <circle
            r={`${radius / 2}`}
            cx="0"
            cy="0"
            className={styles.bgCurrent}
            stroke-width={`${radius}`}
            stroke-dasharray={`${percCurrent}`}
            transform={`${'rotate(' + (0 - minL3) + ') scale(1, ' + [currentValue < 0 ? -1 : 1] + ')'}`}
            transition=" transform 1.5s linear 0s"
          />

          {/* L3 Gauge */}
          <circle
            r={`${radius / 2}`}
            cx="0"
            cy="0"
            className={styles.gaugeL3}
            stroke-width={`${radius / 10}`}
            stroke-dasharray={`${percMaxL3}`}
          />

          {/* L2 Gauge */}
          <circle
            r={`${radius / 2}`}
            cx="0"
            cy="0"
            className={styles.gaugeL2}
            stroke-width={`${radius / 10}`}
            stroke-dasharray={`${percMaxL2}`}
            transform={`${rotMinL2}`}
          />

          {/* L1 Gauge */}
          <circle
            r={`${radius / 2}`}
            cx="0"
            cy="0"
            className={styles.gaugeL1}
            stroke-width={`${radius / 10}`}
            stroke-dasharray={`${percMaxL1}`}
            transform={`${rotMinL1}`}
          />

          {/* Current Gauge */}
          <circle
            className={[isInDangerZone ? styles.fillL3 : [isInWarningZone ? styles.fillL2 : styles.fillL1]]}
            r={`${radius / 2}`}
            cx="0"
            cy="0"
            stroke-width={`${radius / 10}`}
            stroke-dasharray={`${percCurrent}`}
            transform={`${'rotate(' + (0 - minL3) + ') scale(1, ' + [currentValue < 0 ? -1 : 1] + ')'}`}
            transition=" transform 1.5s linear 0s"
          />

          {/* Target Value line */}
          <path
            className={[
              isTargetDangerZone
                ? styles.targetValueDanger
                : [isTargetWarningZone ? styles.targetValueWarning : styles.targetValue],
            ]}
            d={`M 0 0 L ${radius} 0`}
            transform={`${rotTarget}`}
          />

          {/* Front Mask */}
          <circle r={`${radius / 2}`} cx="0" cy="0" className={styles.cutOut} />
        </g>
      </svg>
    );
  }
}
