import React, { Component } from 'react';
import { relativeTime } from '../../../../Utils';
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

  constructor(props) {
    super(props);
    this.prevAzimuth = 0;
  }

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

    const largeArcFlag = '1';

    const d = ['M', start.x, start.y, 'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y].join(' ');

    return d;
  };

  getRadialMarkers = (radialMarkers, radialMarkersUnits, minRadialValue, maxRadialValue) => {
    const w = PolarPlot.WIDTH;
    const h = PolarPlot.HEIGHT;
    const margin = PolarPlot.MARGIN;
    const temporalRadius = this.props.temporalEncoding === 'radial';
    let r;
    if (maxRadialValue === minRadialValue) {
      r = w / 2 - margin;
      return (
        <g>
          <circle className={styles['cls-27']} cx={w / 2} cy={h / 2} r={r} />
          <text className={styles.label} x={w / 2 + r} y={(h * (1 + 0.05)) / 2}>
            {temporalRadius ? relativeTime(maxRadialValue, this.props.taiToUtc) : maxRadialValue}
            {temporalRadius ? '' : radialMarkersUnits}
          </text>
        </g>
      );
    }
    return [...new Array(radialMarkers)].map((v, i) => {
      const value = minRadialValue + ((maxRadialValue - minRadialValue) / radialMarkers) * (i + 1);
      if (maxRadialValue === minRadialValue) r = 1;
      else r = ((value - minRadialValue) / (maxRadialValue - minRadialValue)) * (w / 2 - margin);
      return (
        <g key={`circle ${i}`}>
          <circle className={styles['cls-27']} cx={w / 2} cy={h / 2} r={r} />
          <text className={styles.label} x={w / 2 + r} y={(h * (1 + (i % 2 === 0 ? 0.03 : -0.03))) / 2}>
            {temporalRadius ? relativeTime(value, this.props.taiToUtc) : Math.round(100 * value) / 100}
            {temporalRadius ? '' : radialMarkersUnits}
          </text>
        </g>
      );
    });
  };

  getCartesianCoordinates = (triplet, minRadialValue, maxRadialValue) => {
    const w = PolarPlot.WIDTH;
    const h = PolarPlot.HEIGHT;
    const margin = PolarPlot.MARGIN;

    const centerX = w / 2;
    const centerY = h / 2;
    let radius;
    if (maxRadialValue === minRadialValue) radius = w / 2 - margin;
    else radius = ((triplet.r - minRadialValue) / (maxRadialValue - minRadialValue)) * (w / 2 - margin);
    const angleInRadians = (triplet.theta * Math.PI) / 180.0;

    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  closestEquivalentAngle = (from, to) => {
    const delta = ((((to - from) % 360) + 540) % 360) - 180;
    return from + delta;
  };

  componentDidUpdate(prevProps) {
    const azimuthPosition = this.props.domeAzimuth?.azimuthPosition?.value ?? 0;
    const prevAzimuth = prevProps.domeAzimuth?.azimuthPosition?.value ?? 0;
    if (prevAzimuth !== azimuthPosition) this.prevAzimuth = this.closestEquivalentAngle(this.prevAzimuth, prevAzimuth);
  }

  // zip two array into one
  zip = (...arrays) => {
    const length = Math.min(...arrays.map((arr) => arr?.length ?? 1000));
    return Array.from({ length }, (value, index) => arrays.map((array) => array?.[index]));
  };

  render() {
    const w = PolarPlot.WIDTH;
    const h = PolarPlot.HEIGHT;
    const margin = PolarPlot.MARGIN;
    const viewboxMargin = PolarPlot.VIEWBOXMARGIN;

    const tickAngles = this.getAngles(5);
    const radialLinesAngles = this.getAngles(15);

    const ticks = this.getTicks(tickAngles, w, h, margin * 2);
    const radialLines = this.getRadialLines(radialLinesAngles, w, h, margin);

    const data = {
      WindSpeed: [
        {
          name: 'WindSpeed',
          time: '2020-07-24T16:29:37.992-04:00',
          value: 0.05,
        },
        {
          name: 'WindSpeed',
          time: '2020-07-24T16:29:40.034-04:00',
          value: 0.15,
        },
        {
          name: 'WindSpeed',
          time: '2020-07-24T16:29:42.098-04:00',
          value: 0.25,
        },
        {
          name: 'WindSpeed',
          time: '2020-07-24T16:29:44.090-04:00',
          value: 0.35,
        },
        {
          name: 'WindSpeed',
          time: '2020-07-24T16:29:46.134-04:00',
          value: 0.45,
        },
        {
          name: 'WindSpeed',
          time: '2020-07-24T16:29:48.215-04:00',
          value: 0.55,
        },
        {
          name: 'WindSpeed',
          time: '2020-07-24T16:29:50.280-04:00',
          value: 0.65,
        },
        {
          name: 'WindSpeed',
          time: '2020-07-24T16:29:52.318-04:00',
          value: 0.75,
        },
        {
          name: 'WindSpeed',
          time: '2020-07-24T16:29:54.313-04:00',
          value: 0.85,
        },
        {
          name: 'WindSpeed',
          time: '2020-07-24T16:29:56.385-04:00',
          value: 0.95,
        },
        {
          name: 'WindSpeed',
          time: '2020-07-24T16:29:58.504-04:00',
          value: 1.05,
        },
        {
          name: 'WindSpeed',
          time: '2020-07-24T16:30:00.519-04:00',
          value: 0.9,
        },
        {
          name: 'WindSpeed',
          time: '2020-07-24T16:30:02.618-04:00',
          value: 0.8,
        },
        {
          name: 'WindSpeed',
          time: '2020-07-24T16:30:04.618-04:00',
          value: 0.7,
        },
        {
          name: 'WindSpeed',
          time: '2020-07-24T16:30:06.678-04:00',
          value: 0.6,
        },
        {
          name: 'WindSpeed',
          time: '2020-07-24T16:30:08.713-04:00',
          value: 0.5,
        },
        {
          name: 'WindSpeed',
          time: '2020-07-24T16:30:10.780-04:00',
          value: 0.4,
        },
      ],
      WindDirection: [
        {
          name: 'WindDirection',
          time: '2020-07-24T16:29:37.988-04:00',
          value: 203,
        },
        {
          name: 'WindDirection',
          time: '2020-07-24T16:29:40.031-04:00',
          value: 213,
        },
        {
          name: 'WindDirection',
          time: '2020-07-24T16:29:42.098-04:00',
          value: 223,
        },
        {
          name: 'WindDirection',
          time: '2020-07-24T16:29:44.089-04:00',
          value: 233,
        },
        {
          name: 'WindDirection',
          time: '2020-07-24T16:29:46.130-04:00',
          value: 243,
        },
        {
          name: 'WindDirection',
          time: '2020-07-24T16:29:48.212-04:00',
          value: 253,
        },
        {
          name: 'WindDirection',
          time: '2020-07-24T16:29:50.277-04:00',
          value: 263,
        },
        {
          name: 'WindDirection',
          time: '2020-07-24T16:29:52.317-04:00',
          value: 273,
        },
        {
          name: 'WindDirection',
          time: '2020-07-24T16:29:54.310-04:00',
          value: 283,
        },
        {
          name: 'WindDirection',
          time: '2020-07-24T16:29:56.383-04:00',
          value: 293,
        },
        {
          name: 'WindDirection',
          time: '2020-07-24T16:29:58.502-04:00',
          value: 303,
        },
        {
          name: 'WindDirection',
          time: '2020-07-24T16:30:00.519-04:00',
          value: 313,
        },
        {
          name: 'WindDirection',
          time: '2020-07-24T16:30:02.618-04:00',
          value: 323,
        },
        {
          name: 'WindDirection',
          time: '2020-07-24T16:30:04.616-04:00',
          value: 333,
        },
        {
          name: 'WindDirection',
          time: '2020-07-24T16:30:06.673-04:00',
          value: 343,
        },
        {
          name: 'WindDirection',
          time: '2020-07-24T16:30:08.708-04:00',
          value: 353,
        },
        {
          name: 'WindDirection',
          time: '2020-07-24T16:30:10.775-04:00',
          value: 363,
        },
      ],
      GustDirection: [
        {
          name: 'GustDirection',
          time: '2020-07-24T16:29:37.988-04:00',
          value: 203,
        },
        {
          name: 'GustDirection',
          time: '2020-07-24T16:29:40.031-04:00',
          value: 213,
        },
        {
          name: 'GustDirection',
          time: '2020-07-24T16:29:42.098-04:00',
          value: 223,
        },
        {
          name: 'GustDirection',
          time: '2020-07-24T16:29:44.089-04:00',
          value: 233,
        },
        {
          name: 'GustDirection',
          time: '2020-07-24T16:29:46.130-04:00',
          value: 143,
        },
        {
          name: 'GustDirection',
          time: '2020-07-24T16:29:48.212-04:00',
          value: 253,
        },
        {
          name: 'GustDirection',
          time: '2020-07-24T16:29:50.277-04:00',
          value: 263,
        },
        {
          name: 'GustDirection',
          time: '2020-07-24T16:29:52.317-04:00',
          value: 273,
        },
        {
          name: 'GustDirection',
          time: '2020-07-24T16:29:54.310-04:00',
          value: 283,
        },
        {
          name: 'GustDirection',
          time: '2020-07-24T16:29:56.383-04:00',
          value: 293,
        },
        {
          name: 'GustDirection',
          time: '2020-07-24T16:29:58.502-04:00',
          value: 303,
        },
        {
          name: 'GustDirection',
          time: '2020-07-24T16:30:00.519-04:00',
          value: 313,
        },
        {
          name: 'GustDirection',
          time: '2020-07-24T16:30:02.618-04:00',
          value: 323,
        },
        {
          name: 'GustDirection',
          time: '2020-07-24T16:30:04.616-04:00',
          value: 333,
        },
        {
          name: 'GustDirection',
          time: '2020-07-24T16:30:06.673-04:00',
          value: 343,
        },
        {
          name: 'GustDirection',
          time: '2020-07-24T16:30:08.708-04:00',
          value: 353,
        },
        {
          name: 'GustDirection',
          time: '2020-07-24T16:30:10.775-04:00',
          value: 363,
        },
      ],
      GustSpeed: [
        {
          name: 'GustSpeed',
          time: '2020-07-24T16:29:37.992-04:00',
          value: 0.05,
        },
        {
          name: 'GustSpeed',
          time: '2020-07-24T16:29:40.034-04:00',
          value: 0.15,
        },
        {
          name: 'GustSpeed',
          time: '2020-07-24T16:29:42.098-04:00',
          value: 0.25,
        },
        {
          name: 'GustSpeed',
          time: '2020-07-24T16:29:44.090-04:00',
          value: 0.35,
        },
        {
          name: 'GustSpeed',
          time: '2020-07-24T16:29:46.134-04:00',
          value: 0.45,
        },
        {
          name: 'GustSpeed',
          time: '2020-07-24T16:29:48.215-04:00',
          value: 0.55,
        },
        {
          name: 'GustSpeed',
          time: '2020-07-24T16:29:50.280-04:00',
          value: 0.65,
        },
        {
          name: 'GustSpeed',
          time: '2020-07-24T16:29:52.318-04:00',
          value: 0.75,
        },
        {
          name: 'GustSpeed',
          time: '2020-07-24T16:29:54.313-04:00',
          value: 0.85,
        },
        {
          name: 'GustSpeed',
          time: '2020-07-24T16:29:56.385-04:00',
          value: 0.95,
        },
        {
          name: 'GustSpeed',
          time: '2020-07-24T16:29:58.504-04:00',
          value: 1.35,
        },
        {
          name: 'GustSpeed',
          time: '2020-07-24T16:30:00.519-04:00',
          value: 0.9,
        },
        {
          name: 'GustSpeed',
          time: '2020-07-24T16:30:02.618-04:00',
          value: 0.8,
        },
        {
          name: 'GustSpeed',
          time: '2020-07-24T16:30:04.618-04:00',
          value: 0.7,
        },
        {
          name: 'GustSpeed',
          time: '2020-07-24T16:30:06.678-04:00',
          value: 0.6,
        },
        {
          name: 'GustSpeed',
          time: '2020-07-24T16:30:08.713-04:00',
          value: 0.5,
        },
        {
          name: 'GustSpeed',
          time: '2020-07-24T16:30:10.780-04:00',
          value: 0.4,
        },
      ],
    };

    const groups = [];
    this.props.marksStyles.forEach((ms) => {
      groups[ms.group] = { ...groups[ms?.group], [ms?.encoding]: ms?.name };
    });
    const tripletGroups = groups.map((g, i) => {
      if (g === undefined) return;
      const radialData = data?.[g.radial];
      const angularData = data?.[g.angular];
      const colorData = data?.[g.color];
      const tripletArrays = this.zip(radialData, angularData, colorData);
      const triplets = tripletArrays.map((t) => {
        const timestamps = t.map((datum) => {
          return new Date(datum?.time ?? 0);
        });
        const ts = Math.max(...timestamps);
        return {
          r: t[0]?.value ?? ts,
          theta: t[1]?.value ?? ts,
          color: t[2]?.value ?? ts,
          group: i,
        };
      });
      return triplets;
    });

    const radiiValues = tripletGroups.flatMap((triplets) => triplets.map((t) => t.r));
    const maxRadialValue = radiiValues.length > 0 ? Math.max(...radiiValues) : 0;
    const minRadialValue = radiiValues.length > 0 ? Math.min(...radiiValues) : 0;

    const opacityInterpolation = this.props.opacityInterpolation;
    const colorInterpolation = this.props.colorInterpolation;

    const radialMarkers = 4;
    const radialMarkersUnits = this.props.radialUnits ?? '';
    const circles = this.getRadialMarkers(radialMarkers, radialMarkersUnits, minRadialValue, maxRadialValue);

    const domeAngle = 90;
    const offset = 10;
    const viewBoxSize = 596 - 2 * offset;
    const x0 = viewBoxSize / 2 + offset;
    const y0 = viewBoxSize / 2 + offset;
    const r = w / 2 + viewboxMargin - 5;
    const extraApperture = r / 4;
    const alpha = Math.PI / 12;
    const rSinAlpha = r * Math.sin(alpha);
    const rCosAlpha = r * Math.cos(alpha);
    const azimuthPosition = this.props.domeAzimuth?.azimuthPosition?.value ?? 0;
    const equivalentAzimuth = this.closestEquivalentAngle(this.prevAzimuth, azimuthPosition);
    return (
      <div className={styles.plotContainer}>
        <svg
          className={styles.grid}
          xmlns="http://www.w3.org/2000/svg"
          width={'100%'}
          height={'100%'}
          viewBox={`-${viewboxMargin} -${viewboxMargin} ${w + 2 * viewboxMargin} ${h + 2 * viewboxMargin}`}
        >
          <defs>
            <radialGradient id="radGrad">
              <stop offset="0" stopColor="white" stopOpacity="0" />
              <stop offset="0.7" stopColor="white" stopOpacity="0" />
              <stop offset="0.8" stopColor="white" stopOpacity="0.0" />
              <stop offset="1" stopColor="white" stopOpacity="0.4" />
            </radialGradient>
            <mask id="mask">
              <circle id="c" cx={w / 2} cy={h / 2} r={r} fill="url(#radGrad)" />
            </mask>
          </defs>

          {this.props.displayDome && (
            <>
              <g
                className={styles.rotatingDome}
                style={{
                  transform: `rotateZ(${270 + equivalentAzimuth}deg)`,
                  transformOrigin: `${w / 2}px ${w / 2}px`,
                }}
                mask="url(#mask)"
              >
                {/* Dome */}
                {/* <path
                className={styles.innerDome}
                d={`
                M ${x0 + rCosAlpha} ${y0 + rSinAlpha}
                A ${r} ${r} 0 0 1 ${x0 - rCosAlpha} ${y0 + rSinAlpha}
                A ${r} ${r} 0 0 1 ${x0 - rCosAlpha} ${y0 - rSinAlpha}
                A ${r} ${r} 0 0 1 ${x0 + rCosAlpha} ${y0 - rSinAlpha}
                L ${x0} ${y0}
                L ${x0 + rCosAlpha} ${y0 + rSinAlpha}
              `}
              /> */}
                <path
                  id="curve"
                  className={styles.innerDome}
                  d={`
                M ${x0 + rCosAlpha} ${y0 + rSinAlpha}
                A ${r} ${r} 0 0 0 ${x0 + rCosAlpha} ${y0 - rSinAlpha}
                L ${x0} ${y0}
                L ${x0 + rCosAlpha} ${y0 + rSinAlpha}
              `}
                />
                {/* <text width="50" >
                <textPath textAnchor="middle" href="#curve">
                  Dome
                </textPath>
              </text> */}
              </g>
              {/* <g
              className={styles.rotatingDome}
              style={{ transform: `rotateZ(${270 + equivalentAzimuth}deg)`, transformOrigin: `${w / 2}px ${w / 2}px` }}
            >
              <path
                className={styles.domeCircle}
                d={this.describeArc(w / 2, h / 2, w / 2 + viewboxMargin - 5, domeAngle + 15, domeAngle - 15)}
              >
                <title>Dome</title>
              </path>
            </g> */}
            </>
          )}

          <rect className={styles.backgroundRect} width="100%" height="100%" fill="none" />
          <circle className={styles.backgroundCircle} cx={w / 2} cy={h / 2} r={w / 2 - margin} />

          <g>
            <text className={styles.text} y={-10} x={w / 2}>
              N
            </text>
            <text className={styles.text} y={h + 15} x={w / 2}>
              S
            </text>
            <text className={styles.text} y={h / 2} x={-15}>
              W
            </text>
            <text className={styles.text} y={h / 2} x={w + 15}>
              E
            </text>
          </g>
          <g className={styles.currentLayer}>
            {ticks}
            <g className={styles.innerGrid} id="svg_144">
              {radialLines}
              {circles}
            </g>
          </g>
          {tripletGroups.map((triplets, layerIndex) => {
            const colorValues = triplets.map((t) => t.color);
            const maxColorValue = Math.max(...colorValues);
            const minColorValue = Math.min(...colorValues);

            return (
              <g key={`layer-${layerIndex}`} className={styles.dataLayer}>
                {triplets.map((triplet, i) => {
                  if (triplet.theta === undefined || triplet.r === undefined) return null;
                  const nextTriplet = i < triplets.length - 1 ? triplets[i + 1] : undefined;
                  const cart = this.getCartesianCoordinates(triplet, minRadialValue, maxRadialValue);
                  const nextCart = nextTriplet
                    ? this.getCartesianCoordinates(nextTriplet, minRadialValue, maxRadialValue)
                    : undefined;
                  const rgb = colorInterpolation(triplet.color, minColorValue, maxColorValue, triplet.group);
                  const opacity = opacityInterpolation(triplet.color, minColorValue, maxColorValue, triplet.group);
                  const color = `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
                  return (
                    <React.Fragment key={`datapoint${i}`}>
                      <circle
                        className={styles.dataPoint}
                        cx={cart.x}
                        cy={cart.y}
                        r={5}
                        fill={color}
                        fillOpacity={opacity}
                        strokeOpacity={opacity}
                      />
                      {nextCart !== undefined && (
                        <line
                          x1={cart.x}
                          y1={cart.y}
                          x2={nextCart.x}
                          y2={nextCart.y}
                          stroke={color}
                          fillOpacity={opacity}
                          strokeOpacity={opacity}
                        />
                      )}
                    </React.Fragment>
                  );
                })}
              </g>
            );
          })}
        </svg>
        <span className={styles.legend}>
          {tripletGroups.map((triplets, layerIndex) => {
            const colorValues = triplets.map((t) => t.color);
            const maxColorValue = Math.max(...colorValues);
            const minColorValue = Math.min(...colorValues);
            const rgb = colorInterpolation(maxColorValue, minColorValue, maxColorValue, triplets[0].group);
            const color = `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
            return (
              <div key={`legend-item-${layerIndex}`} className={styles.legendItem}>
                <svg width={10} height={10}>
                  <circle
                    className={styles.dataPoint}
                    cx={5}
                    cy={5}
                    r={5}
                    fill={color}
                    fillOpacity={1}
                    strokeOpacity={1}
                  />
                </svg>
                <span>{this.props.groupTitles?.[layerIndex] ?? `Group ${layerIndex}`}</span>
              </div>
            );
          })}
        </span>
      </div>
    );
  }
}
