import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './Azimuth.module.css';

export default class Limits extends Component {
  static propTypes = {
    /** POSITIVE SIDE */
    /** Maximum limit 3, start of fault gauge */
    maxL3: PropTypes.number,
    /** Maximum limit 2, start of warning gauge */
    maxL2: PropTypes.number,
    /** Maximum limit 1, start of nominal gauge */
    maxL1: PropTypes.number,

    /** NEGATIVE SIDE */
    /** Maximum limit 1, end of nominal gauge */
    minL1: PropTypes.number,
    /** Maximum limit 2, end of warning gauge */
    minL2: PropTypes.number,
    /** Maximum limit 3, end of fault gauge */
    minL3: PropTypes.number,

    /** Azimuth Radius */
    radius: PropTypes.number,

    /** Rotation offset for gauge origin */
    rotationOffset: PropTypes.number,

    /** Current value */
    currentValue: PropTypes.number,
    /** Target value */
    targetValue: PropTypes.number,

    /** Option to show labels */
    displayLabels: PropTypes.bool,
  };

  static defaultProps = {
    maxL3: 270,
    maxL2: 265,
    maxL1: 260,
    minL1: -260,
    minL2: -265,
    minL3: -270,

    radius: 344.4,

    rotationOffset: -90,

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
      rotationOffset,
      displayLabels,
    } = this.props;

    {
      /* Convert Angles to pie % */
    }

    const percMaxL2 = (maxL2 / 360) * (radius * 3.142) + ' ' + radius * 3.142;
    const percMaxL1 = (maxL1 / 360) * (radius * 3.142) + ' ' + radius * 3.142;

    const percTarget = Math.abs((targetValue / 360) * (radius * 3.142)) + ' ' + radius * 3.142;
    const percCurrent = Math.abs((currentValue / 360) * (radius * 3.142)) + ' ' + radius * 3.142;

    const rad = Math.PI / 180;

    const currentText_X = radius * Math.cos(currentValue * rad);
    const currentText_Y = -1 * radius * Math.sin(currentValue * rad);

    const gaugeRotation = 'rotate(' + -minL3 + ') scale(1, -1)';
    const rotMinL3 = 'rotate(' + -minL3 + ')';
    const rotMinL2 = 'rotate(' + (-1 * minL3 + minL2) + ')';
    const rotMinL1 = 'rotate(' + (-1 * minL3 + minL1) + ')';

    const posCurrentValue = currentValue > 0;
    const negCurrentValue = currentValue < 0;

    const radiusBack = radius * 0.58;

    {
      /* Check if current or target value is within danger or warning zone */
    }
    const isInWarningZone = currentValue > maxL1 || currentValue < minL1;
    const isInDangerZone = currentValue > maxL2 || currentValue < minL2;
    const isTargetWarningZone = targetValue > maxL1 || targetValue < minL1;
    const isTargetDangerZone = targetValue > maxL2 || targetValue < minL2;

    return (
      <svg viewBox={`${'0 0 ' + radius * 2 + ' ' + radius * 2}`}>
        {/* Cartoon background */}
        <circle r={`${radiusBack}`} cx={`${radius}`} cy={`${radius}`} className={styles.bg} />

        {/* Current value */}
        <text
          className={styles.originText}
          transform={`${'translate(' + radius + ' ' + (radius - radiusBack - 10) + ')'}`}
        >
          <tspan>0º</tspan>
        </text>

        <g
          className={styles.targetText}
          transform={`${'translate(' + radius + ' ' + radius + ') rotate(' + currentValue + ')'}`}
        >
          <text
            transform={`${'translate(0 ' + (radiusBack * -1 - 10) + ') rotate(' + currentValue * -1 + ')'}`}
            transition=" transform 1.5s linear 0s"
          >
            <tspan
              transition=" transform 1.5s linear 0s"
              className={[
                currentText_X < 0
                  ? [currentText_Y < 0 ? styles.textQ4 : styles.textQ3]
                  : [currentText_Y < 1 ? styles.textQ1 : styles.textQ2],
              ].join(' ')}
            >
              {`${currentValue.toFixed(2) + 'º'}`}
            </tspan>
          </text>
        </g>

        {/* Target & Current Background */}
        <g transform-origin="50% 50%" transform={`${'rotate(' + rotationOffset + ')'}`}>
          {/* Target background */}
          <circle
            r={`${radiusBack / 2}`}
            cx={`${radius}`}
            cy={`${radius}`}
            className={styles.bgTarget}
            stroke-width={`${radiusBack}`}
            stroke-dasharray={`${(targetValue / 360) * (radiusBack * 3.142) + ' ' + radius * 3.142}`}
            transition=" transform 1.5s linear 0s"
          />

          {/* Current background POS */}
          <circle
            visibility={[posCurrentValue ? 'visible' : 'hidden']}
            r={`${radiusBack / 2}`}
            cx={`${radius}`}
            cy={`${radius}`}
            className={styles.bgCurrent}
            stroke-width={`${radiusBack}`}
            stroke-dasharray={`${(Math.abs(currentValue) / 360) * (radiusBack * 3.142) + ' ' + radius * 3.142}`}
            transition=" transform 1.5s linear 0s"
          />
        </g>
        <g transform={`${'rotate(' + rotationOffset + ') scale(1 -1)'}`} transform-origin="50% 50%">
          {/* Current background NEG */}
          <circle
            visibility={[negCurrentValue ? 'visible' : 'hidden']}
            r={`${radiusBack / 2}`}
            cx={`${radius}`}
            cy={`${radius}`}
            className={styles.bgCurrent}
            stroke-width={`${radiusBack}`}
            stroke-dasharray={`${(Math.abs(currentValue) / 360) * (radiusBack * 3.142) + ' ' + radius * 3.142}`}
            transition=" transform 1.5s linear 0s"
          />
        </g>

        <g className={styles.clipPathPos}>
          <g transform={`${'rotate(' + rotationOffset + ')'}`} transform-origin="50% 50%">
            {/* L3 Gauge */}
            <circle r={`${radius}`} cx={`${radius}`} cy={`${radius}`} className={styles.gaugeL3} />

            {/* L2 Gauge */}
            <circle
              r={`${radius / 2}`}
              cx={`${radius}`}
              cy={`${radius}`}
              className={styles.gaugeL2}
              stroke-width={`${radius / 10}`}
              stroke-dasharray={`${percMaxL2}`}
              transform={`${rotationOffset}`}
            />

            {/* L1 Gauge */}
            <circle
              r={`${radius / 2}`}
              cx={`${radius}`}
              cy={`${radius}`}
              className={styles.gaugeL1}
              stroke-width={`${radius / 10}`}
              stroke-dasharray={`${percMaxL1}`}
              transform={`${rotationOffset}`}
            />

            {/* Current Gauge */}

            <circle
              visibility={[posCurrentValue ? 'visible' : 'hidden']}
              className={[isInDangerZone ? styles.fillL3 : [isInWarningZone ? styles.fillL2 : styles.fillL1]]}
              r={`${radius / 2}`}
              cx={`${radius}`}
              cy={`${radius}`}
              stroke-width={`${radius / 10}`}
              stroke-dasharray={`${percCurrent}`}
              transform={`${rotationOffset}`}
            />
          </g>
        </g>

        <g className={styles.clipPathNeg}>
          <g transform={`${'rotate(' + rotationOffset + ') scale(1 -1)'}`} transform-origin="50% 50%">
            {/* L3 Gauge */}
            <circle r={`${radius}`} cx={`${radius}`} cy={`${radius}`} className={styles.gaugeL3} />

            {/* L2 Gauge */}
            <circle
              r={`${radius / 2}`}
              cx={`${radius}`}
              cy={`${radius}`}
              className={styles.gaugeL2}
              stroke-width={`${radius / 10}`}
              stroke-dasharray={`${percMaxL2}`}
              transform={`${rotationOffset}`}
            />

            {/* L1 Gauge */}
            <circle
              r={`${radius / 2}`}
              cx={`${radius}`}
              cy={`${radius}`}
              className={styles.gaugeL1}
              stroke-width={`${radius / 10}`}
              stroke-dasharray={`${percMaxL1}`}
              transform={`${rotationOffset}`}
            />

            {/* Current Gauge */}
            <circle
              visibility={[negCurrentValue ? 'visible' : 'hidden']}
              className={[isInDangerZone ? styles.fillL3 : [isInWarningZone ? styles.fillL2 : styles.fillL1]]}
              r={`${radius / 2}`}
              cx={`${radius}`}
              cy={`${radius}`}
              stroke-width={`${radius / 10}`}
              stroke-dasharray={`${percCurrent}`}
              transform={`${rotationOffset}`}
            />
          </g>
        </g>

        {/* Target Value line */}
        <path
          className={[
            isTargetDangerZone
              ? styles.targetValueDanger
              : [isTargetWarningZone ? styles.targetValueWarning : styles.targetValue],
          ]}
          d={`${'M 0 0 L ' + radiusBack + ' 0'}`}
          transform={`${'translate(' + radius + ' ' + radius + ') rotate(' + (targetValue - minL3) + ') scale(1, 1)'}`}
        />

        {/* Front Mask */}
        <circle r={`${radiusBack * 0.8}`} cx={`${radius}`} cy={`${radius}`} className={styles.cutOut} />
      </svg>
    );
  }
}
