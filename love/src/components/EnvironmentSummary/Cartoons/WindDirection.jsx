import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ArrowIcon from 'components/icons/ArrowIcon/ArrowIcon';
import styles from './WindDirection.module.css';

export class WindDirection extends Component {
  static propTypes = {};

  render() {
    // TODO: calcular con escala
    const minSpeed = 0;
    const maxSpeed = 100;
    const currentSpeed = 50;
    const maxArrowHeight = 500;
    const arrowHeight = (currentSpeed / maxSpeed) * maxArrowHeight;

    // Desde telemetria
    const windDirection = 145;
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className={styles.svgContainer} viewBox="-40 -40 676 676">
        <defs>
          <radialGradient id="a">
            <stop offset={0} stopColor="#fff" stopOpacity={0} />
            <stop offset={0.7} stopColor="#fff" stopOpacity={0} />
            <stop offset={0.8} stopColor="#fff" stopOpacity={0} />
            <stop offset={1} stopColor="#fff" stopOpacity={0.4} />
          </radialGradient>
          <mask id="b">
            <circle cx={298} cy={298} r={333} fill="url(#a)" />
          </mask>
        </defs>

        <rect width="100%" height="100%" fill="none" className="PolarPlot_backgroundRect__fbFoV" />
        <circle cx={298} cy={298} r={295} className="PolarPlot_backgroundCircle__KlR4Y" />
        <text x={288} y={-10} className={styles.cardinalPoints}>
          {'N'}
        </text>
        <text x={288} y={650} className={styles.cardinalPoints}>
          {'S'}
        </text>
        <text x={-80} y={310} className={styles.cardinalPoints}>
          {'W'}
        </text>
        <text x={620} y={310} className={styles.cardinalPoints}>
          {'E'}
        </text>

        <foreignObject
          height={arrowHeight}
          width={arrowHeight}
          className={styles.arrowIconContainer}
          transform={`translate(${298 - arrowHeight / 2}, ${298 - arrowHeight / 2}) rotate(${windDirection})`}
        >
          <ArrowIcon up={true} style={styles.arrowIcon} />
        </foreignObject>
      </svg>
    );
  }
}

export default WindDirection;
