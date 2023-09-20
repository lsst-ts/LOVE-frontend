/** This file is part of LOVE-frontend.

Developed for Inria Chile Tech Team.

See the COPYRIGHT file at the top-level directory of this distribution
for details of code ownership.

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.*/

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { closestEquivalentAngle, fixedFloat } from 'Utils';
import WindRose from '../../../icons/WindRose/WindRose';
import { mtMountMirrorCoversStateMap, stateToStyleMTMountMirrorCoversState } from 'Config';
import InfoPanel from 'components/GeneralPurpose/InfoPanel/InfoPanel';
import SummaryPanel from 'components/GeneralPurpose/SummaryPanel/SummaryPanel';
import Label from 'components/GeneralPurpose/SummaryPanel/Label';
import Value from 'components/GeneralPurpose/SummaryPanel/Value';
import StatusText from 'components/GeneralPurpose/StatusText/StatusText';
import styles from './MirrorCovers.module.css';
import { uniqueId } from 'lodash';

export default class MirrorCovers extends Component {
  static propTypes = {
    /** Azimuth Position measured by the encoders */
    azimuthActualPosition: PropTypes.number,
    /** Azimuth Position computed by the path generator. */
    azimuthDemandPosition: PropTypes.number,
    /** Mirror Covers Motion Deployment State */
    mirrorCoversState: PropTypes.arrayOf(PropTypes.number),
    /** Array data of position about the mirror cover */
    mirrorCoversPosition: PropTypes.arrayOf(PropTypes.number),
  };

  static defaultProps = {
    azimuthActualPosition: 0,
    azimuthDemandPosition: 0,
    mirrorCoversState: [0, 0, 0, 0],
    mirrorCoversPosition: [0, 0, 0, 0],
  };

  constructor(props) {
    super(props);
    this.state = {
      prevAzimuthActual: 0,
      prevAzimuthDemand: 0,
      showMirrorCoverInfo: false,
    };
    this.uniqueMirrorCover = uniqueId('mirror-cover-');
  }

  componentDidUpdate(prevProps) {
    if (prevProps.azimuthActualPosition !== this.props.azimuthActualPosition) {
      this.setState((prevState) => ({
        prevAzimuthActual: closestEquivalentAngle(prevState.prevAzimuthActual, this.props.azimuthActualPosition),
      }));
    }
    if (prevProps.azimuthDemandPosition !== this.props.azimuthDemandPosition) {
      this.setState((prevState) => ({
        prevAzimuthDemand: closestEquivalentAngle(prevState.prevAzimuthDemand, this.props.azimuthDemandPosition),
      }));
    }
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.windRoseContainer}>
          <WindRose />
        </div>
        {this.getSvg()}
      </div>
    );
  }

  getInfoMirrorCover() {
    const index = [0, 1, 2, 3];
    const mirrorCoversValue = this.props.mirrorCoversState.map((state) => mtMountMirrorCoversStateMap[state]);
    const mirrorCoversState = mirrorCoversValue.map((value) => stateToStyleMTMountMirrorCoversState[value]);
    return (
      <InfoPanel title="Mirror Covers" className={this.state.showMirrorCoverInfo === false ? styles.hide : styles.show}>
        <SummaryPanel className={[styles.summaryPanel, styles.m1Panel].join(' ')}>
          {index.map((i) => {
            return (
              <>
                <Label key={`mirror-cover-status-label-${i}`}>{`Mirror cover ${i + 1}`}</Label>
                <Value key={`mirror-cover-status-value-${i}`}>
                  <StatusText status={mirrorCoversState[i]}>{mirrorCoversValue[i]}</StatusText>
                </Value>
              </>
            );
          })}
        </SummaryPanel>
      </InfoPanel>
    );
  }

  getSvg = () => {
    const offset = 35;
    const viewBoxSize = 385 - 2 * offset;
    const x0 = viewBoxSize / 2 + offset;
    const y0 = viewBoxSize / 2 + offset;

    const angleClosed = this.props.mirrorCoversPosition.map((value) => value);
    const statesStyle = this.props.mirrorCoversState?.map((state) => {
      return {
        //'ok': styles.ok,
        //'warning': styles.warning,
        alert: styles.alert, // Only this representation for the color in mirror cover
      }[stateToStyleMTMountMirrorCoversState[mtMountMirrorCoversStateMap[state]]];
    });

    const equivalentAzimuthActual = closestEquivalentAngle(
      this.state.prevAzimuthActual,
      this.props.azimuthActualPosition,
    );
    const equivalentAzimuthDemand = closestEquivalentAngle(
      this.state.prevAzimuthDemand,
      this.props.azimuthDemandPosition,
    );

    return (
      <>
        <svg data-name="mirrorCoverSvg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 385 385">
          <g transform="scale(0.94 0.94) translate(15, 15)">
            {this.getAzimuthChart(
              x0,
              y0,
              viewBoxSize,
              this.props.azimuthActualPosition,
              this.props.azimuthDemandPosition,
            )}
          </g>
          <g transform="scale(0.59 0.59) translate(138, 138)">
            {this.getBase(x0, y0, equivalentAzimuthActual)}
            <g
              style={{
                transition: 'transform 1.5s linear 0s',
                transform: `rotateZ(${equivalentAzimuthActual}deg)`,
                transformOrigin: `50% 50%`,
              }}
            >
              {this.getMount(x0, y0)}
              {this.getMirrorCover(angleClosed, statesStyle, x0, y0, viewBoxSize)}
            </g>
            {equivalentAzimuthDemand !== equivalentAzimuthActual ?? this.getDemand(equivalentAzimuthDemand)}
          </g>
        </svg>
        <div
          style={{ position: 'absolute', top: `${viewBoxSize / 3}px`, left: `${viewBoxSize + offset}px`, zIndex: 1000 }}
        >
          {this.getInfoMirrorCover()}
        </div>
      </>
    );
  };

  getArcLengthPixel(angle, radius) {
    return `${(angle / 360) * radius * Math.PI + ' ' + radius * Math.PI}`;
  }

  getBackgrownAzimuthChart(x0, y0, radius, rotationOffset) {
    return (
      <>
        <circle cx={x0} cy={y0} r={radius + 4} className={styles.bg} />

        <g style={{ translate: `${x0}px ${y0}px`, transform: `rotate(${rotationOffset}deg)` }}>
          {/* Origin value text */}
          <text
            className={styles.originText}
            transform={`${'translate(' + (radius + 10) + ' -4) rotate(' + rotationOffset * -1 + ')'}`}
          >
            <tspan>0º</tspan>
          </text>
        </g>
      </>
    );
  }

  getTextAzimuthPosition(x0, y0, radius, azimuthActualPosition) {
    const rad = Math.PI / 180;
    const azimuthActualPositionText_X = radius * Math.cos(azimuthActualPosition * rad);
    const azimuthActualPositionText_Y = -1 * radius * Math.sin(azimuthActualPosition * rad);
    return (
      <>
        <g
          className={styles.targetText}
          transform={`${'translate(' + x0 + ' ' + y0 + ') rotate(' + azimuthActualPosition + ')'}`}
        >
          <text
            transform={`${'translate(0 ' + (radius * -1 - 4) + ') rotate(' + azimuthActualPosition * -1 + ')'}`}
            transition=" transform 1.5s linear 0s"
          >
            <tspan
              transition=" transform 1.5s linear 0s"
              className={[
                azimuthActualPositionText_X < 0
                  ? [azimuthActualPositionText_Y < 0 ? styles.textQ4 : styles.textQ3]
                  : [azimuthActualPositionText_Y < 0 ? styles.textQ1 : styles.textQ2],
              ].join(' ')}
            >
              {`${fixedFloat(azimuthActualPosition, 1) + '°'}`}
            </tspan>
          </text>
        </g>
      </>
    );
  }

  getAzimuthPositionBacklight(x0, y0, radius, rotationOffset, azimuthActualPosition) {
    return (
      <>
        <g transform-origin="50% 50%" transform={`${'rotate(' + rotationOffset + ')'}`}>
          {/* Target background */}
          <circle
            r={`${radius / 2 + 4}`}
            cx={`${x0}`}
            cy={`${y0}`}
            className={styles.bgTarget}
            stroke-width={`${radius + 8}`}
            transition=" transform 1s linear 0s"
          />

          {/* Current background POS */}
          <circle
            visibility={[azimuthActualPosition >= 0 ? 'visible' : 'hidden']}
            r={`${radius / 2 + 3}`}
            cx={`${x0}`}
            cy={`${y0}`}
            className={styles.bgCurrent}
            stroke-width={`${radius + 8}`}
            stroke-dasharray={this.getArcLengthPixel(azimuthActualPosition, radius + 6)}
            transition=" transform 1.7s linear 0s"
          />
        </g>
        <g transform-origin="50% 50%" transform={`${'rotate(' + rotationOffset + ') scale(1 -1)'}`}>
          {/* Current background NEG */}
          <circle
            visibility={[azimuthActualPosition < 0 ? 'visible' : 'hidden']}
            r={`${radius / 2 + 3}`}
            cx={`${x0}`}
            cy={`${y0}`}
            className={styles.bgCurrent}
            stroke-width={`${radius + 8}`}
            stroke-dasharray={this.getArcLengthPixel(Math.abs(azimuthActualPosition), radius + 6)}
            transition=" transform 1.7s linear 0s"
          />
        </g>
      </>
    );
  }

  getAzimuthPositionLight(x0, y0, radius, rotationOffset, azimuthActualPosition) {
    return (
      <>
        <g transform-origin="50% 50%" transform={`${'rotate(' + rotationOffset + ')'}`}>
          {/* Current background POS */}
          <circle
            visibility={[azimuthActualPosition >= 0 ? 'visible' : 'hidden']}
            r={`${radius / 2 + 3}`}
            cx={`${x0}`}
            cy={`${y0}`}
            className={styles.lightCurrent}
            stroke-width={`${radius + 8}`}
            stroke-dasharray={this.getArcLengthPixel(azimuthActualPosition, radius + 6)}
            transition=" transform 1.7s linear 0s"
          />
        </g>
        <g transform-origin="50% 50%" transform={`${'rotate(' + rotationOffset + ') scale(1 -1)'}`}>
          {/* Current background NEG */}
          <circle
            visibility={[azimuthActualPosition < 0 ? 'visible' : 'hidden']}
            r={`${radius / 2 + 3}`}
            cx={`${x0}`}
            cy={`${y0}`}
            className={styles.lightCurrent}
            stroke-width={`${radius + 8}`}
            stroke-dasharray={this.getArcLengthPixel(Math.abs(azimuthActualPosition), radius + 6)}
            transition=" transform 1.7s linear 0s"
          />
        </g>
      </>
    );
  }

  getLimitsGauge(x0, y0, radius, radiusInner, rotationOffset, azimuthActualPosition, azimuthDemandPosition) {
    const maxL3 = 270;
    const maxL2 = 265;
    const maxL1 = 260;
    const minL1 = -260;
    const minL2 = -265;
    const minL3 = -270;

    /* Check if current or target value is within danger or warning zone */
    const isInWarningZone = azimuthActualPosition > maxL1 || azimuthActualPosition < minL1;
    const isInDangerZone = azimuthActualPosition > maxL2 || azimuthActualPosition < minL2;

    const radiusWidth = (radius - radiusInner) / 7;
    const radiusWithoutBorder = radius - radiusWidth;
    const radiusInnerWithoutBorder = radiusInner + radiusWidth * 4;

    return (
      <>
        {/** Path Positive */}
        <g transform-origin="50% 50%" transform={`${'rotate(' + rotationOffset + ')'}`}>
          {/* L3 Gauge */}
          <circle
            r={`${radiusWithoutBorder / 2}`}
            cx={`${x0 - radiusWidth}`}
            cy={`${y0}`}
            className={styles.gaugeL3}
            stroke-width={`${radiusWithoutBorder}`}
            stroke-dasharray={this.getArcLengthPixel(maxL3, radiusWithoutBorder)}
          />

          {/* L2 Gauge */}
          <circle
            r={`${radiusWithoutBorder / 2}`}
            cx={`${x0 - radiusWidth}`}
            cy={`${y0}`}
            className={styles.gaugeL2}
            stroke-width={`${radiusWithoutBorder}`}
            stroke-dasharray={this.getArcLengthPixel(maxL2, radiusWithoutBorder)}
          />

          {/* L1 Gauge */}
          <circle
            r={`${radiusWithoutBorder / 2}`}
            cx={`${x0 - radiusWidth}`}
            cy={`${y0}`}
            className={styles.gaugeL1}
            stroke-width={`${radiusWithoutBorder}`}
            stroke-dasharray={this.getArcLengthPixel(maxL1, radiusWithoutBorder)}
          />

          {/* Current Gauge */}
          <circle
            visibility={[azimuthActualPosition >= 0 ? 'visible' : 'hidden']}
            className={[isInDangerZone ? styles.fillL3 : [isInWarningZone ? styles.fillL2 : styles.fillL1]]}
            r={`${radiusWithoutBorder / 2}`}
            cx={`${x0 - radiusWidth}`}
            cy={`${y0}`}
            stroke-width={`${radiusWithoutBorder}`}
            stroke-dasharray={this.getArcLengthPixel(
              azimuthActualPosition - (radiusWidth / 2) * Math.sin((azimuthActualPosition * Math.PI) / 180),
              radiusWithoutBorder,
            )}
          />
          {/* border */}
          <circle cx={x0 - radiusWidth} cy={y0} r={radiusWithoutBorder - radiusWidth * 1.5} className={styles.bg} />
        </g>

        {/** Path Negative */}
        <g transform-origin="50% 50%" transform={`${'rotate(' + rotationOffset + ') scale(1 -1)'}`}>
          {/* L3 Gauge */}
          <circle
            r={`${radiusInnerWithoutBorder / 2}`}
            cx={`${x0 + radiusWidth}`}
            cy={`${y0}`}
            className={styles.gaugeL3}
            stroke-width={`${radiusInnerWithoutBorder}`}
            stroke-dasharray={this.getArcLengthPixel(Math.abs(minL3), radiusInnerWithoutBorder)}
          />

          {/* L2 Gauge */}
          <circle
            r={`${radiusInnerWithoutBorder / 2}`}
            cx={`${x0 + radiusWidth}`}
            cy={`${y0}`}
            className={styles.gaugeL2}
            stroke-width={`${radiusInnerWithoutBorder}`}
            stroke-dasharray={this.getArcLengthPixel(Math.abs(minL2), radiusInnerWithoutBorder)}
          />

          {/* L1 Gauge */}
          <circle
            r={`${radiusInnerWithoutBorder / 2}`}
            cx={`${x0 + radiusWidth}`}
            cy={`${y0}`}
            className={styles.gaugeL1}
            stroke-width={`${radiusInnerWithoutBorder}`}
            stroke-dasharray={this.getArcLengthPixel(Math.abs(minL1), radiusInnerWithoutBorder)}
          />

          {/* Current Gauge */}
          <circle
            visibility={[azimuthActualPosition < 0 ? 'visible' : 'hidden']}
            className={[isInDangerZone ? styles.fillL3 : [isInWarningZone ? styles.fillL2 : styles.fillL1]]}
            r={`${radiusInnerWithoutBorder / 2}`}
            cx={`${x0 + radiusWidth}`}
            cy={`${y0}`}
            stroke-width={`${radiusInnerWithoutBorder}`}
            stroke-dasharray={this.getArcLengthPixel(
              Math.abs(azimuthActualPosition),
              Math.abs(azimuthActualPosition) < 180
                ? radiusInnerWithoutBorder + radiusWidth / 4
                : radiusInnerWithoutBorder - radiusWidth / 4,
            )}
          />

          {/* border */}
          <circle
            cx={x0 + radiusWidth}
            cy={y0}
            r={radiusInnerWithoutBorder - radiusWidth * 1.5}
            className={styles.bg}
          />
        </g>

        <g transform-origin="50% 50%" transform={`${'rotate(' + rotationOffset + ')'}`}>
          {/* Current background POS */}
          <circle
            visibility={[azimuthActualPosition >= 0 ? 'visible' : 'hidden']}
            r={`${radiusInnerWithoutBorder / 2 - 8}`}
            cx={`${x0}`}
            cy={`${y0}`}
            className={styles.bgCurrent}
            stroke-width={`${radiusInnerWithoutBorder - 16}`}
            stroke-dasharray={this.getArcLengthPixel(azimuthActualPosition, radiusInnerWithoutBorder - 16)}
            transition=" transform 1.7s linear 0s"
          />
        </g>

        <g transform-origin="50% 50%" transform={`${'rotate(' + rotationOffset + ') scale(1 -1)'}`}>
          {/* Current background NEG */}
          <circle
            visibility={[azimuthActualPosition < 0 ? 'visible' : 'hidden']}
            r={`${radiusInnerWithoutBorder / 2 - 8}`}
            cx={`${x0}`}
            cy={`${y0}`}
            className={styles.bgCurrent}
            stroke-width={`${radiusInnerWithoutBorder - 16}`}
            stroke-dasharray={this.getArcLengthPixel(Math.abs(azimuthActualPosition), radiusInnerWithoutBorder - 16)}
            transition=" transform 1.5s linear 0s"
          />
        </g>
      </>
    );
  }

  getAzimuthChart(x0, y0, viewBoxSize, azimuthActualPosition, azimuthDemandPosition) {
    const radius = viewBoxSize / 2 - 4;
    const radiusInner = radius * 0.78;
    const rotationOffset = -90;

    const maxL3 = 270;
    const maxL2 = 265;
    const maxL1 = 260;
    const minL1 = -260;
    const minL2 = -265;
    const minL3 = -270;

    const isTargetWarningZone = azimuthDemandPosition > maxL1 || azimuthDemandPosition < minL1;
    const isTargetDangerZone = azimuthDemandPosition > maxL2 || azimuthDemandPosition < minL2;

    return (
      <g>
        {this.getAzimuthPositionBacklight(x0, y0, radius, rotationOffset, azimuthActualPosition)}
        {this.getBackgrownAzimuthChart(x0, y0, radius, rotationOffset)}
        {this.getLimitsGauge(x0, y0, radius, radiusInner, rotationOffset, azimuthActualPosition, azimuthDemandPosition)}
        {this.getAzimuthPositionLight(x0, y0, radius, rotationOffset, azimuthActualPosition)}

        {/* Target Value line */}
        <g transform-origin="50% 50%" transform={`${'rotate(' + rotationOffset + ')'}`}>
          {azimuthDemandPosition <= 90 && azimuthDemandPosition >= -90 ? (
            <>
              <path
                className={styles.targetBg}
                d={`${'M 0 0 L ' + (radius + 8) + ' 0'}`}
                transform={`${'translate(' + x0 + ' ' + y0 + ') rotate(' + azimuthDemandPosition + ')'}`}
              />
              <path
                className={[
                  isTargetDangerZone
                    ? styles.targetValueDanger
                    : [isTargetWarningZone ? styles.targetValueWarning : styles.targetValue],
                ]}
                d={`${'M 0 0 L ' + (radius + 8) + ' 0'}`}
                transform={`${'translate(' + x0 + ' ' + y0 + ') rotate(' + azimuthDemandPosition + ')'}`}
              />
            </>
          ) : (
            <></>
          )}
          {azimuthDemandPosition > 90 ? (
            <>
              <path
                className={styles.targetBg}
                d={`${'M 0 0 L ' + 22 + ' 0'}`}
                transform={`${
                  'translate(' +
                  (x0 + (radius - 14) * Math.cos((azimuthDemandPosition * Math.PI) / 180)) +
                  ' ' +
                  (y0 + (radius - 14) * Math.sin((azimuthDemandPosition * Math.PI) / 180)) +
                  ') rotate(' +
                  azimuthDemandPosition +
                  ')'
                }`}
              />
              <path
                className={[
                  isTargetDangerZone
                    ? styles.targetValueDanger
                    : [isTargetWarningZone ? styles.targetValueWarning : styles.targetValue],
                ]}
                d={`${'M 0 0 L ' + 22 + ' 0'}`}
                transform={`${
                  'translate(' +
                  (x0 + (radius - 14) * Math.cos((azimuthDemandPosition * Math.PI) / 180)) +
                  ' ' +
                  (y0 + (radius - 14) * Math.sin((azimuthDemandPosition * Math.PI) / 180)) +
                  ') rotate(' +
                  azimuthDemandPosition +
                  ')'
                }`}
              />
            </>
          ) : (
            <></>
          )}
          {azimuthDemandPosition < -90 ? (
            <>
              <path
                className={styles.targetBg}
                d={`${'M 0 0 L ' + (radius - 12) + ' 0'}`}
                transform={`${'translate(' + x0 + ' ' + y0 + ') rotate(' + azimuthDemandPosition + ')'}`}
              />
              <path
                className={[
                  isTargetDangerZone
                    ? styles.targetValueDanger
                    : [isTargetWarningZone ? styles.targetValueWarning : styles.targetValue],
                ]}
                d={`${'M 0 0 L ' + (radius - 12) + ' 0'}`}
                transform={`${'translate(' + x0 + ' ' + y0 + ') rotate(' + azimuthDemandPosition + ')'}`}
              />
            </>
          ) : (
            <></>
          )}
        </g>

        {this.getTextAzimuthPosition(x0, y0, radius, azimuthActualPosition)}

        {/* Front Mask */}
        <circle r={`${radiusInner}`} cx={`${x0}`} cy={`${y0}`} className={styles.cutOut} />
      </g>
    );
  }

  getBase(x0, y0, equivalentAzimuthActual) {
    return (
      <>
        <circle
          cx={x0}
          cy={y0}
          r={165}
          style={{
            strokeWidth: 2,
            strokeMiterlimit: 10,
            fill: '#15242d',
            stroke: '#182e39',
          }}
        />
        <g
          style={{
            transition: 'transform 1.5s linear 0s',
            transform: `rotateZ(${equivalentAzimuthActual}deg)`,
            transformOrigin: `50% 50%`,
          }}
        >
          <path
            className={styles.cls3}
            d="M19.95 168.14h48.69v48.71H19.95zM316.36 168.14h48.69v48.71h-48.69zM302.63 40.57H82.37L38.31 87.89l-3.25 19.02 47.31 15.66h220.26l47.31-15.66-2.44-19.02-44.87-47.32z"
          />
          <path
            className={styles.cls3}
            d="M323.24 97.41 289 62.6H96L61.76 97.41l-11.28 60.28v69.62l11.28 60.28L96 322.4h193l34.26-34.81 11.28-60.28v-69.62ZM192.5 298A105.54 105.54 0 1 1 298 192.5 105.52 105.52 0 0 1 192.5 298Z"
          />
        </g>
      </>
    );
  }

  getDemand(equivalentAzimuthDemand) {
    return (
      <path
        d="M365.05 168.14h-30.53v-10.45l-8-43 23.47-7.77-2.44-19-44.92-47.35H82.37L38.31 87.89l-3.25 19 23.47 7.77-8.05 43v10.45H20v48.72h30.48v10.45l11.28 60.28 6.39 6.5-.41.35L90 316.75l.19-.23L96 322.4h193l6-6.06.35.41 22.3-22.31-.59-.51 6.23-6.34 11.28-60.28v-10.45h30.53Z"
        style={{
          stroke: '#e4e4e7',
          strokeWidth: '.5px',
          strokeDasharray: 6,
          fill: 'none',
          strokeMiterlimit: 10,
          transition: 'transform 1.5s linear 0s',
          transform: `rotateZ(${equivalentAzimuthDemand}deg)`,
          transformOrigin: `50% 50%`,
        }}
      />
    );
  }

  handleMouseEnter = () => {
    if (this.state.showMirrorCoverInfo !== true) {
      this.setState({
        showMirrorCoverInfo: true,
      });
    }
  };

  handleMouseLeave = () => {
    if (this.state.showMirrorCoverInfo !== false) {
      this.setState({
        showMirrorCoverInfo: false,
      });
    }
  };

  getMirrorCover = (angleClosed, statesStyle, x0, y0, viewBoxSize) => {
    const r = viewBoxSize / 4;
    const alpha1 = (3 * Math.PI) / 2 + (5 * Math.PI) / 180.0; // Displace initial angle for always showing
    const rSinAlpha1 = r * Math.sin(alpha1);
    const rCosAlpha1 = r * Math.cos(alpha1);
    const index = [0, 1, 2, 3];

    const transforms = [
      `translate(110px, -45px)`,
      `translate(45px, 110px) rotateZ(90deg)`,
      `translate(-110px, 45px) rotateZ(180deg)`,
      `translate(-45px, -110px) rotateZ(270deg)`,
    ];

    const alpha2 = angleClosed.map((angle) => (angle * Math.PI) / 180.0);
    const rSinAlpha2 = alpha2.map((a2) => r * Math.sin(a2));
    const rCosAlpha2 = alpha2.map((a2) => r * Math.cos(a2));

    return (
      <>
        {index.map((i) => {
          return (
            <>
              <path
                key={`mirror-cover-${i}`}
                className={[styles.cls4, statesStyle ? statesStyle[i] : ''].join(' ')}
                d={`
                  M ${x0} ${y0}
                  L ${x0 + rCosAlpha1} ${y0 - rSinAlpha1}
                  A ${r} ${r} 0 0 1 ${x0 - rSinAlpha2[i]} ${y0 + rCosAlpha2[i]}
                  L ${x0 - rSinAlpha2[i]} ${y0 + rCosAlpha2[i]}
                  L ${x0} ${y0}z
                `}
                style={{ transformOrigin: `50% 50%`, transform: transforms[i] }}
                onMouseEnter={() => {
                  this.handleMouseEnter();
                }}
                onMouseLeave={() => {
                  this.handleMouseLeave();
                }}
              />
            </>
          );
        })}
      </>
    );
  };

  getMount = (x0, y0) => {
    return (
      <g>
        <rect
          className={styles.cls7}
          x={108.65}
          y={78.17}
          width={178.54}
          height={6.49}
          rx={3.25}
          transform="rotate(10 197.971 81.443)"
        />
        <rect
          className={styles.cls7}
          x={97.81}
          y={78.17}
          width={178.54}
          height={6.49}
          rx={3.25}
          transform="rotate(-10 187.175 81.45)"
        />
        <rect
          className={styles.cls7}
          x={33.43}
          y={132.33}
          width={81.18}
          height={6.49}
          rx={3.25}
          transform="rotate(-60.01 74.014 135.57)"
        />
        <rect
          className={styles.cls7}
          x={270.39}
          y={132.33}
          width={81.18}
          height={6.49}
          rx={3.25}
          transform="rotate(60.01 310.984 135.573)"
        />

        <path className={styles.cls3} d="m275.45 126.81-16.72-16.73 36.23-41.83 22.3 22.31-41.81 36.25z" />
        <rect
          className={styles.cls3}
          x={287.25}
          y={82.04}
          width={16.23}
          height={16.23}
          rx={8.12}
          transform="rotate(45.01 295.378 90.168)"
        />
        <path className={styles.cls3} d="m125.93 110.08-16.72 16.73L67.4 90.56l22.3-22.31 36.23 41.83z" />
        <rect
          className={styles.cls3}
          x={81.18}
          y={82.04}
          width={16.23}
          height={16.23}
          rx={8.12}
          transform="rotate(-45.01 89.299 90.149)"
        />
        <rect
          className={styles.cls7}
          x={97.81}
          y={300.33}
          width={178.54}
          height={6.49}
          rx={3.25}
          transform="rotate(-170 187.064 303.584)"
        />
        <rect
          className={styles.cls7}
          x={108.65}
          y={300.33}
          width={178.54}
          height={6.49}
          rx={3.25}
          transform="rotate(170 197.931 303.571)"
        />
        <rect
          className={styles.cls7}
          x={270.39}
          y={246.18}
          width={81.18}
          height={6.49}
          rx={3.25}
          transform="rotate(119.99 310.982 249.429)"
        />
        <rect
          className={styles.cls7}
          x={33.43}
          y={246.18}
          width={81.18}
          height={6.49}
          rx={3.25}
          transform="rotate(-119.99 74.016 249.428)"
        />
        <path className={styles.cls3} d="m109.55 258.19 16.72 16.73-36.23 41.83-22.3-22.31 41.81-36.25z" />
        <rect
          className={styles.cls3}
          x={81.52}
          y={286.73}
          width={16.23}
          height={16.23}
          rx={8.12}
          transform="rotate(-134.99 89.63 294.848)"
        />
        <path className={styles.cls3} d="m259.07 274.92 16.72-16.73 41.81 36.25-22.3 22.31-36.23-41.83z" />
        <rect
          className={styles.cls3}
          x={287.59}
          y={286.73}
          width={16.23}
          height={16.23}
          rx={8.12}
          transform="rotate(134.99 295.71 294.839)"
        />

        <path
          className={styles.cls8}
          d="m337.32 118.31-9.19 1.78M340.41 134.25l-9.18 1.78M333.67 119.32l2.97 15.28M53.77 136.03l-9.18-1.78M56.87 120.09l-9.19-1.78M50.13 135.02l2.96-15.28"
        />

        <circle className={styles.cls3} cx={x0} cy={y0} r={26} />
      </g>
    );
  };
}
