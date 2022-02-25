import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  relativeTime,
  closestEquivalentAngle,
} from 'Utils';
import TimeSeriesControls from 'components/GeneralPurpose/Plot/TimeSeriesControls/TimeSeriesControls';
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

  componentDidUpdate(prevProps) {
    const azimuthPosition = this.props.domeAzimuth?.azimuthPosition?.value ?? 0;
    const prevAzimuth = prevProps.domeAzimuth?.azimuthPosition?.value ?? 0;
    if (prevAzimuth !== azimuthPosition) this.prevAzimuth = closestEquivalentAngle(this.prevAzimuth, prevAzimuth);
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

    const data = this.props.data;
    const groups = [];
    this.props.marksStyles.forEach((ms) => {
      groups[ms.group] = { ...groups[ms?.group], [ms?.encoding]: ms?.name };
    });
    const tripletGroups = groups.map((g, i) => {
      if (g === undefined) {
        return undefined;
      }
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

    const offset = 10;
    const viewBoxSize = 596 - 2 * offset;
    const x0 = viewBoxSize / 2 + offset;
    const y0 = viewBoxSize / 2 + offset;
    const r = w / 2 + viewboxMargin - 5;
    const alpha = Math.PI / 12;
    const rSinAlpha = r * Math.sin(alpha);
    const rCosAlpha = r * Math.cos(alpha);
    const azimuthPosition = this.props.domeAzimuth?.azimuthPosition?.value ?? 0;
    const equivalentAzimuth = closestEquivalentAngle(this.prevAzimuth, azimuthPosition);

    const { controls, setTimeWindow, timeWindow, setIsLive, isLive, setHistoricalData } = this.props;
    return (
      <div>
        {controls && (
          <TimeSeriesControls
            setTimeWindow={setTimeWindow}
            timeWindow={timeWindow}
            setLiveMode={setIsLive}
            isLive={isLive}
            setHistoricalData={setHistoricalData}
          />
        )}
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
                </g>
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
              const rgb = colorInterpolation(maxColorValue, minColorValue, maxColorValue, triplets?.[0]?.group);
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
      </div>
    );
  }
}
