import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './SkymapGrid.module.css';

export default class SkymapGrid extends Component {
  static propTypes = {
    /** Skyview width */
    width: PropTypes.number,
    /** Skyview height */
    height: PropTypes.number,
    /** Whether the radial distances are projected or equidistant */
    isProjected: PropTypes.bool,
  };

  static defaultProps = {
    width: 596,
    height: 596,
    isProjected: true,
  };

  getAngles = (angleStep) => {
    const angles = [];
    for (let i = 0; i * angleStep < 360; i += 1) angles.push(angleStep * i);
    return angles;
  };

  getRadii = (radiusStep, projected) => {
    const radii = [];
    if (projected) {
      for (let i = 0; i * radiusStep < 90; i += 1) {
        const el = radiusStep * i;
        radii.unshift(90 - Math.cos((el * Math.PI) / 180) * 90);
      }
    } else {
      for (let i = 0; i * radiusStep < 90; i += 1) radii.unshift(radiusStep * i);
    }
    return radii;
  };

  getTicks = (angles, w, h, margin) => {
    return angles.map((angle) => {
      const r1 = w / 2 - margin;
      const r2 = w / 2;
      const xComp = Math.cos((angle / 180) * Math.PI);
      const yComp = Math.sin((angle / 180) * Math.PI);

      return (
        <line
          key={`tick ${angle}`}
          className={styles['cls-27']}
          x1={w / 2 + xComp * r1}
          y1={h / 2 + yComp * r1}
          x2={w / 2 + xComp * r2}
          y2={h / 2 + yComp * r2}
        />
      );
    });
  };

  getRadialLines = (angles, w, h) => {
    return angles.map((angle) => {
      const r1 = 0;
      const r2 = w / 2;
      const xComp = Math.cos((angle / 180) * Math.PI);
      const yComp = Math.sin((angle / 180) * Math.PI);

      return (
        <line
          key={`radius ${angle}`}
          className={styles['cls-27']}
          x1={w / 2 + xComp * r1}
          y1={h / 2 + yComp * r1}
          x2={w / 2 + xComp * r2}
          y2={h / 2 + yComp * r2}
        />
      );
    });
  };

  getCircles = (radii, w, h, margin) => {
    return radii.map((radius) => {
      return (
        <circle
          key={`circle ${radius}`}
          className={styles['cls-27']}
          cx={w / 2}
          cy={h / 2}
          r={((90 - radius) / 90) * (w / 2 - margin)}
        />
      );
    });
  };

  getElevationMarkers = (radii, radiusLabels, w, h, margin) => {
    let lastX = 0;
    return radii.map((radius, index) => {
      const label = radiusLabels[index];
      const r = ((90 - radius) / 90) * (w / 2 - margin);
      const angle = -Math.PI / 80;
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r;
      if (Math.abs(x - lastX) < 30) return null;
      lastX = x;
      return (
        <text key={`text ${radius}`} className={styles.label} x={w / 2 + x} y={h / 2 + y}>
          {label}
          {'º'}
        </text>
      );
    });
  };

  polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;

    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  describeArc = (x, y, radius, startAngle, endAngle) => {
    const start = this.polarToCartesian(x, y, radius, endAngle);
    const end = this.polarToCartesian(x, y, radius, startAngle);

    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

    const d = ['M', start.x, start.y, 'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y].join(' ');

    return d;
  };

  render() {
    const w = 596;
    const h = 596;
    const margin = 3;
    const viewboxMargin = 40;

    const tickAngles = this.getAngles(5);
    const radialLinesAngles = this.getAngles(15);
    const radii = this.getRadii(15, this.props.isProjected);
    const radiusLabels = this.getRadii(15, false);

    const ticks = this.getTicks(tickAngles, w, h, margin * 2);
    const radialLines = this.getRadialLines(radialLinesAngles, w, h, margin);
    const circles = this.getCircles(radii, w, h, margin);
    const elevationMarkers = this.getElevationMarkers(radii, radiusLabels, w, h, margin);

    return (
      <svg
        className={styles.grid}
        xmlns="http://www.w3.org/2000/svg"
        width={this.props.width}
        height={this.props.width}
        viewBox={`-${viewboxMargin} -${viewboxMargin} ${w + 2 * viewboxMargin} ${h + 2 * viewboxMargin}`}
      >
        <rect className={styles.backgroundRect} width="100%" height="100%" fill="none" />
        <circle className={styles.backgroundCircle} cx={w / 2} cy={h / 2} r={w / 2 - margin} />
        {/* <circle className={styles.domeCircle} cx={w / 2} cy={h / 2} r={w / 2 + viewboxMargin - 5} /> */}
        <path className={styles.domeCircle} d={this.describeArc(w / 2, h / 2, w / 2 + viewboxMargin - 5, -260, 80)}>
          <title>Dome</title>
        </path>
        <g>
          <text className={styles.text} y={-10} x={w / 2}>
            N
          </text>
          <text className={styles.text} y={h + 15} x={w / 2}>
            S
          </text>
          <text className={styles.text} y={h / 2} x={-15}>
            E
          </text>
          <text className={styles.text} y={h / 2} x={w + 15}>
            W
          </text>
        </g>
        <g className={styles.currentLayer}>
          {ticks}
          <g className={styles.innerGrid} id="svg_144">
            {radialLines}
            {circles}
            {elevationMarkers}
          </g>
        </g>
      </svg>
    );
  }
}
