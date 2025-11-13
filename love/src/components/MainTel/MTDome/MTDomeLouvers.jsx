/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed by Inria Chile and the Telescope and Site Software team.

Developed for the Vera C. Rubin Observatory Telescope and Site Systems.

This program is free software: you can redistribute it and/or modify it under 
the terms of the GNU General Public License as published by the Free Software 
Foundation, either version 3 of the License, or at your option) any later version.

This program is distributed in the hope that it will be useful,but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR 
 A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with 
this program. If not, see <http://www.gnu.org/licenses/>.
*/

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import StatusText from 'components/GeneralPurpose/StatusText/StatusText';
import { MTDomeLouversIndexMap, mtDomeMotionStateMap, mtDomeMotionStatetoStyle } from 'Config';
import styles from './MTDome.module.css';

const heightsLouvers = [
  35, 19, 35, 35, 19, 35, 35, 35, 35, 35, 35, 35, 35, 19, 35, 19, 19, 35, 19, 19, 35, 35, 19, 35, 35, 35, 35, 35, 35,
  35, 35, 19, 35, 19,
];

const DISABLED_LOUVERS_STATE = 52;

function parsedPercentage(value) {
  let parsedPercentage = 0;
  if (!isNaN(value) && value >= 0 && value <= 100) {
    parsedPercentage = value / 100;
  }
  return parsedPercentage;
}

function LouversHover({
  x,
  y,
  louverName,
  openPercentage,
  openCommandedPercentage,
  inPosition,
  motionState,
  orientation = 'right',
}) {
  const hoverWidth = 240;
  const hoverHeight = 150;

  const getPosition = () => {
    if (orientation === 'right') {
      return [x + 27 + 14, y - hoverHeight / 2];
    }
    return [x - hoverWidth - 14, y - hoverHeight / 2];
  };

  const parsedOpenPercentage = !isNaN(openPercentage) ? openPercentage.toFixed(1) : 'NaN';
  const parsedOpenCommandedPercentage = !isNaN(openCommandedPercentage) ? openCommandedPercentage.toFixed(1) : 'NaN';

  const renderInPosition = () => {
    let label = 'UNKNOWN';
    if (inPosition === true) label = 'YES';
    else if (inPosition === false) label = 'NO';

    const stateToStyle = {
      YES: 'ok',
      NO: 'warning',
      UNKNOWN: 'invalid',
    };

    return <StatusText status={stateToStyle[label]}>{label}</StatusText>;
  };

  const renderMotionState = () => {
    const label = mtDomeMotionStateMap[motionState ?? 0];
    const style = mtDomeMotionStatetoStyle[label];
    return <StatusText status={style}>{label}</StatusText>;
  };

  return (
    <foreignObject
      x={getPosition()[0]}
      y={getPosition()[1]}
      width={hoverWidth}
      height={hoverHeight}
      textAnchor="middle"
    >
      <div className={styles.louversHover}>
        <div className={styles.title}>{louverName} Louver</div>
        <div>Open %:</div>
        <div className={styles.value}>{parsedOpenPercentage}</div>
        <div>Cmd Open %:</div>
        <div className={styles.value}>{parsedOpenCommandedPercentage}</div>
        <div>In Position:</div>
        <div>{renderInPosition()}</div>
        <div>Motion State:</div>
        <div>{renderMotionState()}</div>
      </div>
    </foreignObject>
  );
}

function TimesIcon({ x, y, width, height }) {
  const iconSize = 8;
  const posX = x + width / 2 - iconSize / 2;
  const posY = y + height / 2 - iconSize / 2;
  return (
    <g className={styles.timesIcon}>
      <line x1={posX} y1={posY} x2={posX + iconSize} y2={posY + iconSize} strokeWidth="3" strokeLinecap="round" />
      <line x1={posX + iconSize} y1={posY} x2={posX} y2={posY + iconSize} strokeWidth="3" strokeLinecap="round" />
    </g>
  );
}

function Louver({
  className,
  x,
  y,
  width,
  height,
  louverName,
  openPercentage,
  openCommandedPercentage,
  inPosition,
  motionState,
  handleLouversHover = () => {},
  orientation = 'right',
}) {
  const isLouverEnabled = motionState != null && motionState !== DISABLED_LOUVERS_STATE;
  return (
    <g
      onMouseEnter={() => {
        handleLouversHover(true, {
          x,
          y,
          louverName,
          openPercentage,
          openCommandedPercentage,
          inPosition,
          motionState,
          orientation,
        });
      }}
      onMouseLeave={() => handleLouversHover(false)}
    >
      <rect className={styles.louver3} x={x} y={y} width={width} height={height} />

      {isLouverEnabled ? (
        <rect
          className={className}
          x={x}
          y={y}
          width={width}
          height={height}
          style={{
            transformOrigin: 'top center',
            transformBox: 'fill-box',
            transform: `scaleY(${1 - parsedPercentage(openPercentage)})`,
          }}
        />
      ) : (
        <TimesIcon x={x} y={y} width={width} height={height} />
      )}
    </g>
  );
}

function LouverCommanded({ className, x1, y1, x2, y2, height, openPercentage }) {
  return (
    <line
      className={className}
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      style={{
        transformOrigin: 'top center',
        transformBox: 'fill-box',
        transform: `translateY(${height * (1 - parsedPercentage(openPercentage))}px)`,
      }}
    />
  );
}

export default class MTDomeLouvers extends Component {
  static propTypes = {
    /** Measured position of each louver (percent open) */
    actualPositionLouvers: PropTypes.array,
    /** Commanded position of each louver (percent open) */
    commandedPositionLouvers: PropTypes.array,
    /** Motion state of each louver */
    louversMotionState: PropTypes.array,
    /** Indicates if each louver is in position */
    louversInPosition: PropTypes.array,
  };

  static defaultProps = {
    actualPositionLouvers: [],
    commandedPositionLouvers: [],
    louversMotionState: [],
    louversInPosition: [],
  };

  constructor(props) {
    super(props);
    this.state = {
      hoveredLouver: null,
    };
  }

  render() {
    const { actualPositionLouvers, commandedPositionLouvers, louversMotionState, louversInPosition } = this.props;

    const { hoveredLouver } = this.state;

    const isPositionActualEqualsCommanded = (index) => {
      return !actualPositionLouvers[index] === commandedPositionLouvers[index];
    };

    const handleLouversHover = (isHovered, louver = {}) => {
      if (!isHovered) {
        this.setState({ hoveredLouver: null });
      } else {
        this.setState({ hoveredLouver: louver });
      }
    };

    const parsedActualPositionLouvers = {};
    const parsedCommandedPositionLouvers = {};
    const parsedLouversInPosition = {};
    const parsedLouversMotionState = {};

    Object.keys(MTDomeLouversIndexMap).forEach((louver) => {
      const index = MTDomeLouversIndexMap[louver];
      parsedActualPositionLouvers[louver] = actualPositionLouvers[index];
      parsedCommandedPositionLouvers[louver] = commandedPositionLouvers[index];
      parsedLouversInPosition[louver] = louversInPosition[index];
      parsedLouversMotionState[louver] = louversMotionState[index];
    });

    return (
      <div className={styles.svgLouversContainer}>
        <svg className={styles.svgLouvers} viewBox="0 0 560 192">
          {/* horizontal labels */}
          <g className={styles.louver6}>
            <text className={styles.louver7} transform="translate(44.18 189.34)">
              A
            </text>
            <text className={styles.louver7} transform="translate(82.93 189.34)">
              B
            </text>
            <text className={styles.louver7} transform="translate(122.09 189.34)">
              C
            </text>
            <text className={styles.louver7} transform="translate(160.63 189.34)">
              D
            </text>
            <text className={styles.louver7} transform="translate(204.91 189.34)">
              E
            </text>
            <text className={styles.louver7} transform="translate(249.81 189.34)">
              F
            </text>
            <text className={styles.louver7} transform="translate(303.65 189.34)">
              G
            </text>
            <text className={styles.louver7} transform="translate(348.22 189.34)">
              H
            </text>
            <text className={styles.louver7} transform="translate(394.12 189.34)">
              I
            </text>
            <text className={styles.louver7} transform="translate(431.74 189.34)">
              L
            </text>
            <text className={styles.louver7} transform="translate(468.98 189.34)">
              M
            </text>
            <text className={styles.louver7} transform="translate(508.47 189.34)">
              N
            </text>
          </g>
          {/* vertical labels */}
          <g className={styles.louver6}>
            <text className={styles.louver7} transform="translate(0.01 156.34)">
              1
            </text>
            <text className={styles.louver7} transform="translate(0.01 109.57)">
              2
            </text>
            <text className={styles.louver7} transform="translate(0.01 64.57)">
              3
            </text>
          </g>

          {/* dome background */}
          <g>
            {/* A */}
            <polygon
              className={styles.louver2}
              points="14.27 173.15 67.27 173.15 67.27 49.15 14.27 126.15 14.27 173.15"
            />
            {/* B */}
            <polygon
              className={styles.louver1}
              points="106.27 173.15 67.27 173.15 67.27 49.15 106.27 32.15 106.27 173.15"
            />
            {/* C */}
            <polygon
              className={styles.louver2}
              points="106.27 173.15 145.27 173.15 145.27 19.15 106.27 32.15 106.27 173.15"
            />
            {/* D */}
            <polygon
              className={styles.louver2}
              points="184.27 173.15 145.27 173.15 145.27 19.15 184.27 35.15 184.27 173.15"
            />
            {/* E */}
            <polygon
              className={styles.louver1}
              points="184.27 173.15 232.27 173.15 232.27 53.15 184.27 35.15 184.27 173.15"
            />
            {/* F & G */}
            <rect className={styles.louver1} x="232.27" y="53.15" width="96" height="120" />

            {/* H */}
            <polygon
              className={styles.louver1}
              points="376.27 173.15 328.27 173.15 328.27 53.15 376.27 35.15 376.27 173.15"
            />

            {/* I */}
            <polygon
              className={styles.louver1}
              points="376.27 173.15 415.27 173.15 415.27 19.15 376.27 35.15 376.27 173.15"
            />

            {/* L */}
            <polygon
              className={styles.louver2}
              points="454.27 173.15 415.27 173.15 415.27 19.15 454.27 32.15 454.27 173.15"
            />

            {/* M */}
            <polygon
              className={styles.louver1}
              points="454.27 173.15 493.27 173.15 493.27 49.15 454.27 32.15 454.27 173.15"
            />

            {/* N */}
            <polygon
              className={styles.louver2}
              points="546.27 173.15 493.27 173.15 493.27 49.15 546.27 126.15 546.27 173.15"
            />

            {/* back doors */}
            <rect
              className={styles.louver3}
              x="278.6"
              y="37.15"
              width="4"
              height="184"
              transform="translate(409.75 -151.45) rotate(90)"
            />
          </g>

          {/* N1, N2 */}
          <g>
            {/* N2 */}
            <Louver
              className={styles.louver4}
              x={499.02}
              y={105.15}
              width={27}
              height={19}
              louverName="N2"
              openPercentage={parsedActualPositionLouvers.N2}
              openCommandedPercentage={parsedCommandedPositionLouvers.N2}
              inPosition={parsedLouversInPosition.N2}
              motionState={parsedLouversMotionState.N2}
              handleLouversHover={handleLouversHover}
              orientation="left"
            />
            {!isPositionActualEqualsCommanded(MTDomeLouversIndexMap.N2) && (
              <LouverCommanded
                className={styles.louver5}
                x1={526.02}
                y1={105.15}
                x2={499.02}
                y2={105.15}
                height={heightsLouvers[MTDomeLouversIndexMap.N2]}
                openPercentage={parsedCommandedPositionLouvers.N2}
              />
            )}

            {/* N1 */}
            <Louver
              className={styles.louver4}
              x={499.02}
              y={134.15}
              width={27}
              height={35}
              louverName="N1"
              openPercentage={parsedActualPositionLouvers.N1}
              openCommandedPercentage={parsedCommandedPositionLouvers.N1}
              inPosition={parsedLouversInPosition.N1}
              motionState={parsedLouversMotionState.N1}
              handleLouversHover={handleLouversHover}
              orientation="left"
            />
            {!isPositionActualEqualsCommanded(MTDomeLouversIndexMap.N1) && (
              <LouverCommanded
                className={styles.louver5}
                x1={526.02}
                y1={134.15}
                x2={499.02}
                y2={134.15}
                height={heightsLouvers[MTDomeLouversIndexMap.N1]}
                openPercentage={parsedCommandedPositionLouvers.N1}
              />
            )}
          </g>

          {/* M1, M2, M3 */}
          <g>
            {/* M3 */}
            <Louver
              className={styles.louver4}
              x={460.27}
              y={60.15}
              width={27}
              height={19}
              louverName="M3"
              openPercentage={parsedActualPositionLouvers.M3}
              openCommandedPercentage={parsedCommandedPositionLouvers.M3}
              inPosition={parsedLouversInPosition.M3}
              motionState={parsedLouversMotionState.M3}
              handleLouversHover={handleLouversHover}
              orientation="left"
            />
            {!isPositionActualEqualsCommanded(MTDomeLouversIndexMap.M3) && (
              <LouverCommanded
                className={styles.louver5}
                x1={487.27}
                y1={60.15}
                x2={460.27}
                y2={60.15}
                height={heightsLouvers[MTDomeLouversIndexMap.M3]}
                openPercentage={parsedCommandedPositionLouvers.M3}
              />
            )}

            {/* M2 */}
            <Louver
              className={styles.louver4}
              x={460.27}
              y={89.15}
              width={27}
              height={35}
              louverName="M2"
              openPercentage={parsedActualPositionLouvers.M2}
              openCommandedPercentage={parsedCommandedPositionLouvers.M2}
              inPosition={parsedLouversInPosition.M2}
              motionState={parsedLouversMotionState.M2}
              handleLouversHover={handleLouversHover}
              orientation="left"
            />
            {!isPositionActualEqualsCommanded(MTDomeLouversIndexMap.M2) && (
              <LouverCommanded
                className={styles.louver5}
                x1={487.27}
                y1={89.15}
                x2={460.27}
                y2={89.15}
                height={heightsLouvers[MTDomeLouversIndexMap.M2]}
                openPercentage={parsedCommandedPositionLouvers.M2}
              />
            )}

            {/* M1 */}
            <Louver
              className={styles.louver4}
              x={460.27}
              y={134.15}
              width={27}
              height={35}
              louverName="M1"
              openPercentage={parsedActualPositionLouvers.M1}
              openCommandedPercentage={parsedCommandedPositionLouvers.M1}
              inPosition={parsedLouversInPosition.M1}
              motionState={parsedLouversMotionState.M1}
              handleLouversHover={handleLouversHover}
              orientation="left"
            />
            {!isPositionActualEqualsCommanded(MTDomeLouversIndexMap.M1) && (
              <LouverCommanded
                className={styles.louver5}
                x1={487.27}
                y1={134.15}
                x2={460.27}
                y2={134.15}
                height={heightsLouvers[MTDomeLouversIndexMap.M1]}
                openPercentage={parsedCommandedPositionLouvers.M1}
              />
            )}
          </g>

          {/* L1, L2, L3 */}
          <g>
            {/* L3 */}
            <Louver
              className={styles.louver4}
              x={421.27}
              y={44.15}
              width={27}
              height={35}
              louverName="L3"
              openPercentage={parsedActualPositionLouvers.L3}
              openCommandedPercentage={parsedCommandedPositionLouvers.L3}
              inPosition={parsedLouversInPosition.L3}
              motionState={parsedLouversMotionState.L3}
              handleLouversHover={handleLouversHover}
              orientation="left"
            />
            {!isPositionActualEqualsCommanded(MTDomeLouversIndexMap.L3) && (
              <LouverCommanded
                className={styles.louver5}
                x1={448.27}
                y1={44.15}
                x2={421.27}
                y2={44.15}
                height={heightsLouvers[MTDomeLouversIndexMap.L3]}
                openPercentage={parsedCommandedPositionLouvers.L3}
              />
            )}

            {/* L2 */}
            <Louver
              className={styles.louver4}
              x={421.27}
              y={89.15}
              width={27}
              height={35}
              louverName="L2"
              openPercentage={parsedActualPositionLouvers.L2}
              openCommandedPercentage={parsedCommandedPositionLouvers.L2}
              inPosition={parsedLouversInPosition.L2}
              motionState={parsedLouversMotionState.L2}
              handleLouversHover={handleLouversHover}
              orientation="left"
            />
            {!isPositionActualEqualsCommanded(MTDomeLouversIndexMap.L2) && (
              <LouverCommanded
                className={styles.louver5}
                x1={448.27}
                y1={89.15}
                x2={421.27}
                y2={89.15}
                height={heightsLouvers[MTDomeLouversIndexMap.L2]}
                openPercentage={parsedCommandedPositionLouvers.L2}
              />
            )}

            {/* L1 */}
            <Louver
              className={styles.louver4}
              x={421.27}
              y={134.15}
              width={27}
              height={35}
              louverName="L1"
              openPercentage={parsedActualPositionLouvers.L1}
              openCommandedPercentage={parsedCommandedPositionLouvers.L1}
              inPosition={parsedLouversInPosition.L1}
              motionState={parsedLouversMotionState.L1}
              handleLouversHover={handleLouversHover}
              orientation="left"
            />
            {!isPositionActualEqualsCommanded(MTDomeLouversIndexMap.L1) && (
              <LouverCommanded
                className={styles.louver5}
                x1={448.27}
                y1={134.15}
                x2={421.27}
                y2={134.15}
                height={heightsLouvers[MTDomeLouversIndexMap.L1]}
                openPercentage={parsedCommandedPositionLouvers.L1}
              />
            )}
          </g>

          {/* I1, I2, I3 */}
          <g>
            {/* I3 */}
            <Louver
              className={styles.louver4}
              x={382.27}
              y={44.15}
              width={27}
              height={35}
              louverName="I3"
              openPercentage={parsedActualPositionLouvers.I3}
              openCommandedPercentage={parsedCommandedPositionLouvers.I3}
              inPosition={parsedLouversInPosition.I3}
              motionState={parsedLouversMotionState.I3}
              handleLouversHover={handleLouversHover}
              orientation="left"
            />
            {!isPositionActualEqualsCommanded(MTDomeLouversIndexMap.I3) && (
              <LouverCommanded
                className={styles.louver5}
                x1={409.27}
                y1={44.15}
                x2={382.27}
                y2={44.15}
                height={heightsLouvers[MTDomeLouversIndexMap.I3]}
                openPercentage={parsedCommandedPositionLouvers.I3}
              />
            )}

            {/* I2 */}
            <Louver
              className={styles.louver4}
              x={382.27}
              y={89.15}
              width={27}
              height={35}
              louverName="I2"
              openPercentage={parsedActualPositionLouvers.I2}
              openCommandedPercentage={parsedCommandedPositionLouvers.I2}
              inPosition={parsedLouversInPosition.I2}
              motionState={parsedLouversMotionState.I2}
              handleLouversHover={handleLouversHover}
              orientation="left"
            />
            {!isPositionActualEqualsCommanded(MTDomeLouversIndexMap.I2) && (
              <LouverCommanded
                className={styles.louver5}
                x1={409.27}
                y1={89.15}
                x2={382.27}
                y2={89.15}
                height={heightsLouvers[MTDomeLouversIndexMap.I2]}
                openPercentage={parsedCommandedPositionLouvers.I2}
              />
            )}
            {/* I1 */}
            <Louver
              className={styles.louver4}
              x={382.27}
              y={134.15}
              width={27}
              height={35}
              louverName="I1"
              openPercentage={parsedActualPositionLouvers.I1}
              openCommandedPercentage={parsedCommandedPositionLouvers.I1}
              inPosition={parsedLouversInPosition.I1}
              motionState={parsedLouversMotionState.I1}
              handleLouversHover={handleLouversHover}
              orientation="left"
            />
            {!isPositionActualEqualsCommanded(MTDomeLouversIndexMap.I1) && (
              <LouverCommanded
                className={styles.louver5}
                x1={409.27}
                y1={134.15}
                x2={382.27}
                y2={134.15}
                height={heightsLouvers[MTDomeLouversIndexMap.I1]}
                openPercentage={parsedCommandedPositionLouvers.I1}
              />
            )}
          </g>

          {/* H1, H2, H3 */}
          <g>
            {/* H3 */}
            <Louver
              className={styles.louver4}
              x={339.27}
              y={60.15}
              width={26}
              height={19}
              louverName="H3"
              openPercentage={parsedActualPositionLouvers.H3}
              openCommandedPercentage={parsedCommandedPositionLouvers.H3}
              inPosition={parsedLouversInPosition.H3}
              motionState={parsedLouversMotionState.H3}
              handleLouversHover={handleLouversHover}
              orientation="left"
            />
            {!isPositionActualEqualsCommanded(MTDomeLouversIndexMap.H3) && (
              <LouverCommanded
                className={styles.louver5}
                x1={365.27}
                y1={60.15}
                x2={339.27}
                y2={60.15}
                height={heightsLouvers[MTDomeLouversIndexMap.H3]}
                openPercentage={parsedCommandedPositionLouvers.H3}
              />
            )}

            {/* H2 */}
            <Louver
              className={styles.louver4}
              x={338.77}
              y={89.15}
              width={27}
              height={35}
              louverName="H2"
              openPercentage={parsedActualPositionLouvers.H2}
              openCommandedPercentage={parsedCommandedPositionLouvers.H2}
              inPosition={parsedLouversInPosition.H2}
              motionState={parsedLouversMotionState.H2}
              handleLouversHover={handleLouversHover}
              orientation="left"
            />
            {!isPositionActualEqualsCommanded(MTDomeLouversIndexMap.H2) && (
              <LouverCommanded
                className={styles.louver5}
                x1={365.77}
                y1={89.15}
                x2={338.77}
                y2={89.15}
                height={heightsLouvers[MTDomeLouversIndexMap.H2]}
                openPercentage={parsedCommandedPositionLouvers.H2}
              />
            )}

            {/* H1 */}
            <Louver
              className={styles.louver4}
              x={338.77}
              y={134.15}
              width={27}
              height={35}
              louverName="H1"
              openPercentage={parsedActualPositionLouvers.H1}
              openCommandedPercentage={parsedCommandedPositionLouvers.H1}
              inPosition={parsedLouversInPosition.H1}
              motionState={parsedLouversMotionState.H1}
              handleLouversHover={handleLouversHover}
              orientation="left"
            />
            {!isPositionActualEqualsCommanded(MTDomeLouversIndexMap.H1) && (
              <LouverCommanded
                className={styles.louver5}
                x1={365.77}
                y1={134.15}
                x2={338.77}
                y2={134.15}
                height={heightsLouvers[MTDomeLouversIndexMap.H1]}
                openPercentage={parsedCommandedPositionLouvers.H1}
              />
            )}
          </g>

          {/* G1, G2, G3 */}
          <g>
            {/* G3 */}
            <Louver
              className={styles.louver4}
              x={289.02}
              y={60.15}
              width={27}
              height={19}
              louverName="G3"
              openPercentage={parsedActualPositionLouvers.G3}
              openCommandedPercentage={parsedCommandedPositionLouvers.G3}
              inPosition={parsedLouversInPosition.G3}
              motionState={parsedLouversMotionState.G3}
              handleLouversHover={handleLouversHover}
              orientation="left"
            />
            {!isPositionActualEqualsCommanded(MTDomeLouversIndexMap.G3) && (
              <LouverCommanded
                className={styles.louver5}
                x1={316.02}
                y1={60.15}
                x2={289.02}
                y2={60.15}
                height={heightsLouvers[MTDomeLouversIndexMap.G3]}
                openPercentage={parsedCommandedPositionLouvers.G3}
              />
            )}

            {/* G2 */}
            <Louver
              className={styles.louver4}
              x={289.02}
              y={93.15}
              width={27}
              height={19}
              louverName="G2"
              openPercentage={parsedActualPositionLouvers.G2}
              openCommandedPercentage={parsedCommandedPositionLouvers.G2}
              inPosition={parsedLouversInPosition.G2}
              motionState={parsedLouversMotionState.G2}
              handleLouversHover={handleLouversHover}
              orientation="left"
            />
            {!isPositionActualEqualsCommanded(MTDomeLouversIndexMap.G2) && (
              <LouverCommanded
                className={styles.louver5}
                x1={316.02}
                y1={93.15}
                x2={289.02}
                y2={93.15}
                height={heightsLouvers[MTDomeLouversIndexMap.G2]}
                openPercentage={parsedCommandedPositionLouvers.G2}
              />
            )}

            {/* G1 */}
            <Louver
              className={styles.louver4}
              x={294.02}
              y={134.15}
              width={27}
              height={35}
              louverName="G1"
              openPercentage={parsedActualPositionLouvers.G1}
              openCommandedPercentage={parsedCommandedPositionLouvers.G1}
              inPosition={parsedLouversInPosition.G1}
              motionState={parsedLouversMotionState.G1}
              handleLouversHover={handleLouversHover}
              orientation="left"
            />
            {!isPositionActualEqualsCommanded(MTDomeLouversIndexMap.G1) && (
              <LouverCommanded
                className={styles.louver5}
                x1={321.02}
                y1={134.15}
                x2={294.02}
                y2={134.15}
                height={heightsLouvers[MTDomeLouversIndexMap.G1]}
                openPercentage={parsedCommandedPositionLouvers.G1}
              />
            )}
          </g>

          {/* F1, F2, F3 */}
          <g>
            {/* F3 */}
            <Louver
              className={styles.louver4}
              x={244.52}
              y={60.15}
              width={27}
              height={19}
              louverName="F3"
              openPercentage={parsedActualPositionLouvers.F3}
              openCommandedPercentage={parsedCommandedPositionLouvers.F3}
              inPosition={parsedLouversInPosition.F3}
              motionState={parsedLouversMotionState.F3}
              handleLouversHover={handleLouversHover}
            />
            {!isPositionActualEqualsCommanded(MTDomeLouversIndexMap.F3) && (
              <LouverCommanded
                className={styles.louver5}
                x1={244.52}
                y1={60.15}
                x2={271.52}
                y2={60.15}
                height={heightsLouvers[MTDomeLouversIndexMap.F3]}
                openPercentage={parsedCommandedPositionLouvers.F3}
              />
            )}

            {/* F2 */}
            <Louver
              className={styles.louver4}
              x={244.52}
              y={93.15}
              width={27}
              height={19}
              louverName="F2"
              openPercentage={parsedActualPositionLouvers.F2}
              openCommandedPercentage={parsedCommandedPositionLouvers.F2}
              inPosition={parsedLouversInPosition.F2}
              motionState={parsedLouversMotionState.F2}
              handleLouversHover={handleLouversHover}
            />
            {!isPositionActualEqualsCommanded(MTDomeLouversIndexMap.F2) && (
              <LouverCommanded
                className={styles.louver5}
                x1={244.52}
                y1={93.15}
                x2={271.52}
                y2={93.15}
                height={heightsLouvers[MTDomeLouversIndexMap.F2]}
                openPercentage={parsedCommandedPositionLouvers.F2}
              />
            )}

            {/* F1 */}
            <Louver
              className={styles.louver4}
              x={239.52}
              y={134.15}
              width={27}
              height={35}
              louverName="F1"
              openPercentage={parsedActualPositionLouvers.F1}
              openCommandedPercentage={parsedCommandedPositionLouvers.F1}
              inPosition={parsedLouversInPosition.F1}
              motionState={parsedLouversMotionState.F1}
              handleLouversHover={handleLouversHover}
            />
            {!isPositionActualEqualsCommanded(MTDomeLouversIndexMap.F1) && (
              <LouverCommanded
                className={styles.louver5}
                x1={239.52}
                y1={134.15}
                x2={266.52}
                y2={134.15}
                height={heightsLouvers[MTDomeLouversIndexMap.F1]}
                openPercentage={parsedCommandedPositionLouvers.F1}
              />
            )}
          </g>

          {/* E1, E2, E3 */}
          <g>
            {/* E3 */}
            <Louver
              className={styles.louver4}
              x={194.77}
              y={60.15}
              width={27}
              height={19}
              louverName="E3"
              openPercentage={parsedActualPositionLouvers.E3}
              openCommandedPercentage={parsedCommandedPositionLouvers.E3}
              inPosition={parsedLouversInPosition.E3}
              motionState={parsedLouversMotionState.E3}
              handleLouversHover={handleLouversHover}
            />
            {!isPositionActualEqualsCommanded(MTDomeLouversIndexMap.E3) && (
              <LouverCommanded
                className={styles.louver5}
                x1={194.77}
                y1={60.15}
                x2={221.77}
                y2={60.15}
                height={heightsLouvers[MTDomeLouversIndexMap.E3]}
                openPercentage={parsedCommandedPositionLouvers.E3}
              />
            )}

            {/* E2 */}
            <Louver
              className={styles.louver4}
              x={194.77}
              y={89.15}
              width={27}
              height={35}
              louverName="E2"
              openPercentage={parsedActualPositionLouvers.E2}
              openCommandedPercentage={parsedCommandedPositionLouvers.E2}
              inPosition={parsedLouversInPosition.E2}
              motionState={parsedLouversMotionState.E2}
              handleLouversHover={handleLouversHover}
            />
            {!isPositionActualEqualsCommanded(MTDomeLouversIndexMap.E2) && (
              <LouverCommanded
                className={styles.louver5}
                x1={194.77}
                y1={89.15}
                x2={221.77}
                y2={89.15}
                height={heightsLouvers[MTDomeLouversIndexMap.E2]}
                openPercentage={parsedCommandedPositionLouvers.E2}
              />
            )}

            {/* E1 */}
            <Louver
              className={styles.louver4}
              x={194.77}
              y={134.15}
              width={27}
              height={35}
              louverName="E1"
              openPercentage={parsedActualPositionLouvers.E1}
              openCommandedPercentage={parsedCommandedPositionLouvers.E1}
              inPosition={parsedLouversInPosition.E1}
              motionState={parsedLouversMotionState.E1}
              handleLouversHover={handleLouversHover}
            />
            {!isPositionActualEqualsCommanded(MTDomeLouversIndexMap.E1) && (
              <LouverCommanded
                className={styles.louver5}
                x1={194.77}
                y1={134.15}
                x2={221.77}
                y2={134.15}
                height={heightsLouvers[MTDomeLouversIndexMap.E1]}
                openPercentage={parsedCommandedPositionLouvers.E1}
              />
            )}
          </g>

          {/* D1, D2, D3 */}
          <g>
            {/* D3 */}
            <Louver
              className={styles.louver4}
              x={151.27}
              y={44.15}
              width={27}
              height={35}
              louverName="D3"
              openPercentage={parsedActualPositionLouvers.D3}
              openCommandedPercentage={parsedCommandedPositionLouvers.D3}
              inPosition={parsedLouversInPosition.D3}
              motionState={parsedLouversMotionState.D3}
              handleLouversHover={handleLouversHover}
            />
            {!isPositionActualEqualsCommanded(MTDomeLouversIndexMap.D3) && (
              <LouverCommanded
                className={styles.louver5}
                x1={151.27}
                y1={44.15}
                x2={178.27}
                y2={44.15}
                height={heightsLouvers[MTDomeLouversIndexMap.D3]}
                openPercentage={parsedCommandedPositionLouvers.D3}
              />
            )}

            {/* D2 */}
            <Louver
              className={styles.louver4}
              x={151.27}
              y={89.15}
              width={27}
              height={35}
              louverName="D2"
              openPercentage={parsedActualPositionLouvers.D2}
              openCommandedPercentage={parsedCommandedPositionLouvers.D2}
              inPosition={parsedLouversInPosition.D2}
              motionState={parsedLouversMotionState.D2}
              handleLouversHover={handleLouversHover}
            />
            {!isPositionActualEqualsCommanded(MTDomeLouversIndexMap.D2) && (
              <LouverCommanded
                className={styles.louver5}
                x1={151.27}
                y1={89.15}
                x2={178.27}
                y2={89.15}
                height={heightsLouvers[MTDomeLouversIndexMap.D2]}
                openPercentage={parsedCommandedPositionLouvers.D2}
              />
            )}

            {/* D1 */}
            <Louver
              className={styles.louver4}
              x={151.27}
              y={134.15}
              width={27}
              height={35}
              louverName="D1"
              openPercentage={parsedActualPositionLouvers.D1}
              openCommandedPercentage={parsedCommandedPositionLouvers.D1}
              inPosition={parsedLouversInPosition.D1}
              motionState={parsedLouversMotionState.D1}
              handleLouversHover={handleLouversHover}
            />
            {!isPositionActualEqualsCommanded(MTDomeLouversIndexMap.D1) && (
              <LouverCommanded
                className={styles.louver5}
                x1={151.27}
                y1={134.15}
                x2={178.27}
                y2={134.15}
                height={heightsLouvers[MTDomeLouversIndexMap.D1]}
                openPercentage={parsedCommandedPositionLouvers.D1}
              />
            )}
          </g>

          {/* C1, C2, C3 */}
          <g>
            {/* C3 */}
            <Louver
              className={styles.louver4}
              x={112.27}
              y={44.15}
              width={27}
              height={35}
              louverName="C3"
              openPercentage={parsedActualPositionLouvers.C3}
              openCommandedPercentage={parsedCommandedPositionLouvers.C3}
              inPosition={parsedLouversInPosition.C3}
              motionState={parsedLouversMotionState.C3}
              handleLouversHover={handleLouversHover}
            />
            {!isPositionActualEqualsCommanded(MTDomeLouversIndexMap.C3) && (
              <LouverCommanded
                className={styles.louver5}
                x1={112.27}
                y1={44.15}
                x2={139.27}
                y2={44.15}
                height={heightsLouvers[MTDomeLouversIndexMap.C3]}
                openPercentage={parsedCommandedPositionLouvers.C3}
              />
            )}

            {/* C2 */}
            <Louver
              className={styles.louver4}
              x={112.27}
              y={89.15}
              width={27}
              height={35}
              louverName="C2"
              openPercentage={parsedActualPositionLouvers.C2}
              openCommandedPercentage={parsedCommandedPositionLouvers.C2}
              inPosition={parsedLouversInPosition.C2}
              motionState={parsedLouversMotionState.C2}
              handleLouversHover={handleLouversHover}
            />
            {!isPositionActualEqualsCommanded(MTDomeLouversIndexMap.C2) && (
              <LouverCommanded
                className={styles.louver5}
                x1={112.27}
                y1={89.15}
                x2={139.27}
                y2={89.15}
                height={heightsLouvers[MTDomeLouversIndexMap.C2]}
                openPercentage={parsedCommandedPositionLouvers.C2}
              />
            )}

            {/* C1 */}
            <Louver
              className={styles.louver4}
              x={112.27}
              y={134.15}
              width={27}
              height={35}
              louverName="C1"
              openPercentage={parsedActualPositionLouvers.C1}
              openCommandedPercentage={parsedCommandedPositionLouvers.C1}
              inPosition={parsedLouversInPosition.C1}
              motionState={parsedLouversMotionState.C1}
              handleLouversHover={handleLouversHover}
            />
            {!isPositionActualEqualsCommanded(MTDomeLouversIndexMap.C1) && (
              <LouverCommanded
                className={styles.louver5}
                x1={112.27}
                y1={134.15}
                x2={139.27}
                y2={134.15}
                height={heightsLouvers[MTDomeLouversIndexMap.C1]}
                openPercentage={parsedCommandedPositionLouvers.C1}
              />
            )}
          </g>

          {/* B1, B2, B3 */}
          <g>
            {/* B3 */}
            <Louver
              className={styles.louver4}
              x={73.27}
              y={60.15}
              width={27}
              height={19}
              louverName="B3"
              openPercentage={parsedActualPositionLouvers.B3}
              openCommandedPercentage={parsedCommandedPositionLouvers.B3}
              inPosition={parsedLouversInPosition.B3}
              motionState={parsedLouversMotionState.B3}
              handleLouversHover={handleLouversHover}
            />
            {!isPositionActualEqualsCommanded(MTDomeLouversIndexMap.B3) && (
              <LouverCommanded
                className={styles.louver5}
                x1={73.27}
                y1={60.15}
                x2={100.27}
                y2={60.15}
                height={heightsLouvers[MTDomeLouversIndexMap.B3]}
                openPercentage={parsedCommandedPositionLouvers.B3}
              />
            )}

            {/* B2 */}
            <Louver
              className={styles.louver4}
              x={73.27}
              y={89.15}
              width={27}
              height={35}
              louverName="B2"
              openPercentage={parsedActualPositionLouvers.B2}
              openCommandedPercentage={parsedCommandedPositionLouvers.B2}
              inPosition={parsedLouversInPosition.B2}
              motionState={parsedLouversMotionState.B2}
              handleLouversHover={handleLouversHover}
            />
            {!isPositionActualEqualsCommanded(MTDomeLouversIndexMap.B2) && (
              <LouverCommanded
                className={styles.louver5}
                x1={73.27}
                y1={89.15}
                x2={100.27}
                y2={89.15}
                height={heightsLouvers[MTDomeLouversIndexMap.B2]}
                openPercentage={parsedCommandedPositionLouvers.B2}
              />
            )}

            {/* B1 */}
            <Louver
              className={styles.louver4}
              x={73.27}
              y={134.15}
              width={27}
              height={35}
              louverName="B1"
              openPercentage={parsedActualPositionLouvers.B1}
              openCommandedPercentage={parsedCommandedPositionLouvers.B1}
              inPosition={parsedLouversInPosition.B1}
              motionState={parsedLouversMotionState.B1}
              handleLouversHover={handleLouversHover}
            />
            {!isPositionActualEqualsCommanded(MTDomeLouversIndexMap.B1) && (
              <LouverCommanded
                className={styles.louver5}
                x1={73.27}
                y1={134.15}
                x2={100.27}
                y2={134.15}
                height={heightsLouvers[MTDomeLouversIndexMap.B1]}
                openPercentage={parsedCommandedPositionLouvers.B1}
              />
            )}
          </g>

          {/* A1, A2 */}
          <g>
            {/* A2 */}
            <Louver
              className={styles.louver4}
              x={34.52}
              y={105.15}
              width={27}
              height={19}
              louverName="A2"
              openPercentage={parsedActualPositionLouvers.A2}
              openCommandedPercentage={parsedCommandedPositionLouvers.A2}
              inPosition={parsedLouversInPosition.A2}
              motionState={parsedLouversMotionState.A2}
              handleLouversHover={handleLouversHover}
            />
            {!isPositionActualEqualsCommanded(MTDomeLouversIndexMap.A2) && (
              <LouverCommanded
                className={styles.louver5}
                x1={34.52}
                y1={105.15}
                x2={61.52}
                y2={105.15}
                height={heightsLouvers[MTDomeLouversIndexMap.A2]}
                openPercentage={parsedCommandedPositionLouvers.A2}
              />
            )}

            {/* A1 */}
            <Louver
              className={styles.louver4}
              x={34.52}
              y={134.15}
              width={27}
              height={35}
              louverName="A1"
              openPercentage={parsedActualPositionLouvers.A1}
              openCommandedPercentage={parsedCommandedPositionLouvers.A1}
              inPosition={parsedLouversInPosition.A1}
              motionState={parsedLouversMotionState.A1}
              handleLouversHover={handleLouversHover}
            />
            {!isPositionActualEqualsCommanded(MTDomeLouversIndexMap.A1) && (
              <LouverCommanded
                className={styles.louver5}
                x1={34.52}
                y1={134.15}
                x2={61.52}
                y2={134.15}
                height={heightsLouvers[MTDomeLouversIndexMap.A1]}
                openPercentage={parsedCommandedPositionLouvers.A1}
              />
            )}
          </g>

          {hoveredLouver && (
            <LouversHover
              x={hoveredLouver.x}
              y={hoveredLouver.y}
              louverName={hoveredLouver.louverName}
              openPercentage={hoveredLouver.openPercentage}
              openCommandedPercentage={hoveredLouver.openCommandedPercentage}
              inPosition={hoveredLouver.inPosition}
              motionState={hoveredLouver.motionState}
              orientation={hoveredLouver.orientation}
            />
          )}
        </svg>
      </div>
    );
  }
}
