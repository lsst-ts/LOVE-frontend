import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './PolarPlot.module.css';

export default class PolarPlot extends Component {
  static propTypes = {
    /** Skyview width */
    width: PropTypes.number,
    /** Skyview height */
    height: PropTypes.number,
  };

  static defaultProps = {
    width: 596,
    height: 596,
  };

  static WIDTH = 596;
  static HEIGHT = 596;
  static MARGIN = 3;
  static VIEWBOXMARGIN = 40;

  getAngles = (angleStep) => {
    const angles = [];
    for (let i = 0; i * angleStep < 360; i += 1) angles.push(angleStep * i);
    return angles;
  };

  getRadii = (radiusStep) => {
    const radii = [];
    for (let i = 0; i * radiusStep < 90; i += 1) radii.unshift(radiusStep * i);
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

//   getRadialMarkers = (radii, radiusLabels, w, h, margin) => {
//     let lastX = 0;
//     return radii.map((radius, index) => {
//       const label = radiusLabels[index];
//       const r = ((90 - radius) / 90) * (w / 2 - margin);
//       const angle = -Math.PI / 80;
//       const x = Math.cos(angle) * r;
//       const y = Math.sin(angle) * r;
//       if (Math.abs(x - lastX) < 30) return null;
//       lastX = x;
//       return (
//         <text key={`text ${radius}`} className={styles.label} x={w / 2 + x} y={h / 2 + y}>
//           {label}
//           {'º'}
//         </text>
//       );
//     });
//   };

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

  getRadialMarkers = (radialMarkers, radialMarkersUnits, maxRadialValue, minRadialValue) => {
    const w = PolarPlot.WIDTH;
    const h = PolarPlot.HEIGHT;
    const margin = PolarPlot.MARGIN;

    return [...new Array(radialMarkers)].map((v, i) => {
      const value = (minRadialValue + (maxRadialValue - minRadialValue)/ radialMarkers * (i + 1));
      const r = value * (w / 2 - margin)/(maxRadialValue - minRadialValue);
      console.log(value, r)
      return (
        <g key={`circle ${i}`}>
          <circle className={styles['cls-27']} cx={w / 2} cy={h / 2} r={r} />
          <text className={styles.label} x={w / 2 + r} y={h / 2}>
            {value}
            {radialMarkersUnits}
          </text>
        </g>
      );
    });
  };

  render() {
    const w = PolarPlot.WIDTH;
    const h = PolarPlot.HEIGHT;
    const margin = PolarPlot.MARGIN;
    const viewboxMargin = PolarPlot.VIEWBOXMARGIN;

    const tickAngles = this.getAngles(5);
    const radialLinesAngles = this.getAngles(15);
    const radii = this.getRadii(15, false);
    const radiusLabels = this.getRadii(15, false);

    const ticks = this.getTicks(tickAngles, w, h, margin * 2);
    const radialLines = this.getRadialLines(radialLinesAngles, w, h, margin);
    // const circles = this.getCircles(radii, w, h, margin);
    // const elevationMarkers = this.getRadialMarkers(radii, radiusLabels, w, h, margin);

    const radialMarkers = 4;
    const radialMarkersUnits = 'km/s';
    const maxRadialValue = 100;
    const minRadialValue = 0;
    const circles = this.getRadialMarkers(radialMarkers, radialMarkersUnits, maxRadialValue, minRadialValue);

    return (
      <svg
        className={styles.grid}
        xmlns="http://www.w3.org/2000/svg"
        width={'100%'}
        height={'100%'}
        viewBox={`-${viewboxMargin} -${viewboxMargin} ${w + 2 * viewboxMargin} ${h + 2 * viewboxMargin}`}
      >
        <rect className={styles.backgroundRect} width="100%" height="100%" fill="none" />
        <circle className={styles.backgroundCircle} cx={w / 2} cy={h / 2} r={w / 2 - margin} />
        <circle className={styles.domeCircle} cx={w / 2} cy={h / 2} r={w / 2 + viewboxMargin - 5} />
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
            {/* {elevationMarkers} */}
          </g>
        </g>
      </svg>
    );
  }
}
