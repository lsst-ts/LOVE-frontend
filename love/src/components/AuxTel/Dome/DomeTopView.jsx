import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './DomeTopView.module.css';

export default class DomeTopView extends Component {
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
      // <svg
      //   className={styles.grid}
      //   xmlns="http://www.w3.org/2000/svg"
      //   width={this.props.width}
      //   height={this.props.width}
      //   viewBox={`-${viewboxMargin} -${viewboxMargin} ${w + 2 * viewboxMargin} ${h + 2 * viewboxMargin}`}
      // >
      //   <rect className={styles.backgroundRect} width="100%" height="100%" fill="none" />
      //   <circle className={styles.backgroundCircle} cx={w / 2} cy={h / 2} r={w / 2 - margin} />
      //   {/* <circle className={styles.domeCircle} cx={w / 2} cy={h / 2} r={w / 2 + viewboxMargin - 5} /> */}
      //   <path className={styles.domeCircle} d={this.describeArc(w / 2, h / 2, w / 2 + viewboxMargin - 5, -260, 80)}>
      //     <title>Dome</title>
      //   </path>
      //   <g>
      //     <text className={styles.text} y={-10} x={w / 2}>
      //       N
      //     </text>
      //     <text className={styles.text} y={h + 15} x={w / 2}>
      //       S
      //     </text>
      //     <text className={styles.text} y={h / 2} x={-15}>
      //       E
      //     </text>
      //     <text className={styles.text} y={h / 2} x={w + 15}>
      //       W
      //     </text>
      //   </g>
      //   <g className={styles.currentLayer}>
      //     {ticks}
      //     <g className={styles.innerGrid} id="svg_144">
      //       {radialLines}
      //       {circles}
      //       {elevationMarkers}
      //     </g>
      //   </g>
      // </svg>

      <svg
        id="building"
        xmlns="http://www.w3.org/2000/svg"
        width={this.props.width*1.3}
        height={this.props.height*1.3}
        viewBox="0 0 697.6 598.49"
      >
        <circle className={styles.background} cx="348.8" cy="294.74" r="276.09" />
        <path
          className={styles.background}
          d="M599.45,180A276.09,276.09,0,0,1,493.57,529L532,589A349,349,0,0,0,696.43,293.61c0-44.43-10.92-102.69-31.55-143.35Z"
          transform="translate(.67 .67)"
        />
        <rect
          className={styles.foreground}
          x="163.54"
          y="25.01"
          width="120.49"
          height="28.25"
          transform="rotate(-26.04 225.578 38.039)"
        />
        <rect
          className={styles.foreground}
          x="294.48"
          y="514.76"
          width="28.1"
          height="120.49"
          transform="rotate(-82.05 309.256 574.959)"
        />
        <rect
          className={styles.foreground}
          x="533.45"
          y="31.94"
          width="28.25"
          height="120.49"
          transform="rotate(-44.85 548.738 91.708)"
        />
        <rect
          className={styles.foreground}
          x="51.45"
          y="262.8"
          width="28.1"
          height="120.49"
          transform="rotate(-5.8 72.414 316.86)"
        />
      </svg>
    );
  }
}
