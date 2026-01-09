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
import {
  mtMountDeployableMotionStateMap,
  stateToStyleMTMountMirrorCoversState,
  hexapodMTInPositionStateMap,
  hexapodMTInPositionStatetoStyle,
  m1m3DetailedStateMap,
  m1m3DetailedStateToStyle,
  ccCameraImageReadinessDetailedStateMap,
  ccCameraImageReadinessDetailedStateToStyle,
  ccCameraShutterDetailedStateMap,
  ccCameraShutterDetailedStateToStyle,
  ccCameraFilterChangerDetailedStateMap,
  ccCameraFilterChangerDetailedStateToStyle,
} from '../../../Config';

import styles from './SimonyiLightPath.module.css';
import InfoPanel from '../../GeneralPurpose/InfoPanel/InfoPanel';
import SummaryPanel from '../../GeneralPurpose/SummaryPanel/SummaryPanel';
import Label from '../../GeneralPurpose/SummaryPanel/Label';
import Value from '../../GeneralPurpose/SummaryPanel/Value';
import StatusText from '../../GeneralPurpose/StatusText/StatusText';

export default class SimonyiLightPath extends Component {
  static propTypes = {
    /** Function to subscribe to streams to receive */
    subscribeToStreams: PropTypes.func,
    /** Function to unsubscribe to streams to stop receiving */
    unsubscribeToStreams: PropTypes.func,
    /** Name of the ComCam filter once it's in its final position */
    cCameraFilter: PropTypes.string,
    /** Enum of detailed state for the ComCam Filter Changer  */
    cCameraFilterState: PropTypes.number,
    /** Enum of detailed state for the ComCam Image Readiness State */
    cCameraImageState: PropTypes.number,
    /** Enum of detailed state for the ComCam Shutter */
    cCameraShutterState: PropTypes.number,
    /** Does the component display the Light Path or not */
    lightPath: PropTypes.bool,
    /** Enum of M1M3 Detailed State */
    m1m3DetailedState: PropTypes.number,
    /** Is the M2 in the correct position or not */
    m2AssemblyInPosition: PropTypes.bool,
    /** Array of 4 Enum State of each Mirror Cover */
    mirrorCoversState: PropTypes.array,
  };

  static defaultProps = {
    mirrorCoversState: [4, 4, 4, 4],
  };

  constructor(props) {
    super(props);
    this.state = {
      showM1M3Info: false,
      showM1M3CoverInfo: false,
      showM2Info: false,
      showCameraInfo: false,
    };
  }

  componentDidMount() {
    this.props.subscribeToStreams();
  }

  componentWillUnmount() {
    this.props.unsubscribeToStreams();
  }

  drawBackground = () => {
    return (
      <>
        <g>
          <rect className={styles.solid2} x="143.02" y="30.83" width="49.54" height="29.13" />
          <g>
            <rect
              className={styles.solid2}
              x="25"
              y="171.25"
              width="164.71"
              height="11.25"
              transform="translate(203.67 -6.25) rotate(59)"
            />
            <rect
              className={styles.solid2}
              x="145.87"
              y="171.25"
              width="164.71"
              height="11.25"
              transform="translate(497.37 72.34) rotate(121)"
            />
          </g>
          <g>
            <path
              className={styles.solid2}
              d="m333.69,228.69h0s-48.85-104.77-48.85-104.77l-10.2,4.76,48.85,104.77,3.97,8.52,1.68-.78c4.71-2.19,6.74-7.79,4.55-12.5Z"
            />
            <rect
              className={styles.solid2}
              x="-26.19"
              y="173.06"
              width="115.6"
              height="11.25"
              transform="translate(-143.7 131.82) rotate(-65)"
            />
            <path
              className={styles.solid2}
              d="m1.88,228.69c-2.2,4.71-.16,10.3,4.55,12.5l1.68.78,3.97-8.52-10.2-4.76h0Z"
            />
          </g>
        </g>
        <polygon
          className={styles.solid3}
          points="102.79 47.65 102.79 137.65 147.79 137.65 147.79 111.23 187.79 111.23 187.79 137.65 232.79 137.65 232.79 47.65 102.79 47.65"
        />
        <g>
          <path
            className={styles.solid1}
            d="m317.79,72.63H17.79l-4,24h308l-4-24ZM37.29,93.63c-2.76,0-5-4.03-5-9s2.24-9,5-9c2.76,0,5,4.03,5,9,0,4.97-2.24,9-5,9Zm69.8,0c-4.97,0-9-4.03-9-9s4.03-9,9-9c4.97,0,9,4.03,9,9,0,4.97-4.03,9-9,9Zm24,0c-4.97,0-9-4.03-9-9s4.03-9,9-9,9,4.03,9,9-4.03,9-9,9Zm24,0c-4.97,0-9-4.03-9-9s4.03-9,9-9c4.97,0,9,4.03,9,9s-4.03,9-9,9Zm26,0c-4.97,0-9-4.03-9-9,0-4.97,4.03-9,9-9,4.97,0,9,4.03,9,9,0,4.97-4.03,9-9,9Zm24,0c-4.97,0-9-4.03-9-9s4.03-9,9-9,9,4.03,9,9c0,4.97-4.03,9-9,9Zm24,0c-4.97,0-9-4.03-9-9,0-4.97,4.03-9,9-9s9,4.03,9,9-4.03,9-9,9Zm69.2,0c-2.76,0-5-4.03-5-9,0-4.97,2.24-9,5-9,2.76,0,5,4.03,5,9s-2.24,9-5,9Z"
          />
          <polygon
            className={styles.solid1}
            points="69.09 85.75 55.79 85.75 52.79 96.86 52.79 107.28 26.79 235.12 66.09 235.12 72.79 235.12 72.79 107.28 72.79 96.86 72.79 85.75 69.09 85.75"
          />
          <polygon
            className={styles.solid1}
            points="282.79 107.28 282.79 96.86 279.79 85.75 266.48 85.75 262.79 85.75 262.79 96.86 262.79 107.28 262.79 235.12 269.48 235.12 308.79 235.12 282.79 107.28"
          />
          <polygon
            className={styles.solid1}
            points="276.9 291.86 276.9 314.65 58.67 314.65 58.67 291.86 27.79 291.86 27.79 339.99 47.79 399.26 287.79 399.26 307.79 339.99 307.79 291.86 276.9 291.86"
          />
          <path
            className={styles.solid1}
            d="m262.08,267.06c-3.19,49.3-44.19,88.3-94.29,88.3-50.11,0-91.1-39-94.29-88.3h-30.55c3.23,66.15,57.89,118.8,124.85,118.8,66.96,0,121.61-52.64,124.85-118.8h-30.55Z"
          />
          <polygon
            className={styles.solid1}
            points="327.79 225.86 327.79 285.02 307.79 291.86 27.79 291.86 7.79 285.02 7.79 225.86 327.79 225.86"
          />
        </g>
      </>
    );
  };

  handleMouseEnter = (ctx) => {
    switch (ctx) {
      case 'M1M3':
        if (this.state.showM1M3Info !== true) {
          this.setState({
            showM1M3Info: true,
          });
        }
        break;
      case 'M1M3Cover':
        if (this.state.showM1M3CoverInfo !== true) {
          this.setState({
            showM1M3CoverInfo: true,
          });
        }
        break;
      case 'M2':
        if (this.state.showM2Info !== true) {
          this.setState({
            showM2Info: true,
          });
        }
        break;
      case 'Camera':
        if (this.state.showCameraInfo !== true) {
          this.setState({
            showCameraInfo: true,
          });
        }
        break;
    }
  };

  handleMouseLeave = (ctx) => {
    switch (ctx) {
      case 'M1M3':
        if (this.state.showM1M3Info !== false) {
          this.setState({
            showM1M3Info: false,
          });
        }
        break;
      case 'M1M3Cover':
        if (this.state.showM1M3CoverInfo !== false) {
          this.setState({
            showM1M3CoverInfo: false,
          });
        }
        break;
      case 'M2':
        if (this.state.showM2Info !== false) {
          this.setState({
            showM2Info: false,
          });
        }
        break;
      case 'Camera':
        if (this.state.showCameraInfo !== false) {
          this.setState({
            showCameraInfo: false,
          });
        }
        break;
    }
  };

  drawM1M3 = (props) => {
    const m1m3StateValue = m1m3DetailedStateMap[props.m1m3DetailedState];
    const m1m3StateStyle = m1m3DetailedStateToStyle[m1m3StateValue];
    return (
      <path
        className={[styles.highlighted, styles[m1m3StateStyle]].join(' ')}
        d="m297.79,278.1H37.79v-19.66c0-1.65,2.04-2.77,3.8-2.05,29.58,12.12,222.82,12.12,252.41,0,1.76-.72,3.8.4,3.8,2.05v19.66Z"
        onMouseEnter={() => {
          this.handleMouseEnter('M1M3');
        }}
        onMouseLeave={() => {
          this.handleMouseLeave('M1M3');
        }}
      />
    );
  };

  drawM1M3Info = (props) => {
    const m1m3StateValue = m1m3DetailedStateMap[props.m1m3DetailedState];
    const m1m3StateStyle = m1m3DetailedStateToStyle[m1m3StateValue];
    return (
      <InfoPanel title="M1M3" className={this.state.showM1M3Info === false ? styles.hide : styles.show}>
        <SummaryPanel className={[styles.summaryPanel, styles.m1Panel].join(' ')}>
          <Label>Detailed State</Label>
          <StatusText status={m1m3StateStyle}>{m1m3StateValue}</StatusText>
        </SummaryPanel>
      </InfoPanel>
    );
  };

  drawM1M3Cover = (props) => {
    const mirrorCoverState = Math.max(...props.mirrorCoversState);
    const mirrorCoversValue = mtMountDeployableMotionStateMap[mirrorCoverState];
    const mirrorCoverStyle = stateToStyleMTMountMirrorCoversState[mirrorCoversValue];

    let mirrorWidth = 150;

    if (mirrorCoverState === 1 || mirrorCoverState === 4) mirrorWidth = 150; // CLOSED
    if (mirrorCoverState === 0) mirrorWidth = 20; // OPENED
    if (mirrorCoverState === 2 || mirrorCoverState === 3) mirrorWidth = 80; // IN MOTION

    return (
      <g
        onMouseEnter={() => {
          this.handleMouseEnter('M1M3Cover');
        }}
        onMouseLeave={() => {
          this.handleMouseLeave('M1M3Cover');
        }}
      >
        <rect
          className={[styles.highlighted, styles[mirrorCoverStyle]].join(' ')}
          x="17.79"
          y="221.1"
          width={mirrorWidth}
          height="10"
          style={{
            transformOrigin: `left`,
          }}
        />
        <rect
          className={[styles.highlighted, styles[mirrorCoverStyle]].join(' ')}
          x={317.79 - mirrorWidth}
          y="221.1"
          width={mirrorWidth}
          height="10"
          style={{
            transformOrigin: `right`,
          }}
        />
      </g>
    );
  };

  drawM1M3CoverInfo = () => {
    const index = [0, 1, 2, 3];
    const mirrorCoversValue = this.props.mirrorCoversState.map((state) => mtMountDeployableMotionStateMap[state]);
    const mirrorCoversState = mirrorCoversValue.map((value) => stateToStyleMTMountMirrorCoversState[value]);
    return (
      <InfoPanel title="Mirror Covers" className={this.state.showM1M3CoverInfo === false ? styles.hide : styles.show}>
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
  };

  drawM2 = (props) => {
    const inPosition = hexapodMTInPositionStateMap[props.m2AssemblyInPosition];
    const hexapodClass = hexapodMTInPositionStatetoStyle[inPosition];
    return (
      <g
        onMouseEnter={() => {
          this.handleMouseEnter('M2');
        }}
        onMouseLeave={() => {
          this.handleMouseLeave('M2');
        }}
      >
        <rect
          className={[styles.highlighted, styles[hexapodClass]].join(' ')}
          x="102.29"
          y="132.1"
          width="44"
          height="10"
        />
        <rect
          className={[styles.highlighted, styles[hexapodClass]].join(' ')}
          x="189.29"
          y="132.1"
          width="44"
          height="10"
        />
      </g>
    );
  };

  drawM2Info = (props) => {
    const inPosition = hexapodMTInPositionStateMap[props.m2AssemblyInPosition];
    return (
      <InfoPanel title="M2" className={this.state.showM2Info === false ? styles.hide : styles.show}>
        <SummaryPanel className={[styles.summaryPanel, styles.m1Panel].join(' ')}>
          <Label>Position State</Label>
          <StatusText status={hexapodMTInPositionStatetoStyle[inPosition]}>{inPosition}</StatusText>
        </SummaryPanel>
      </InfoPanel>
    );
  };

  drawCamera = (props) => {
    const camImgReadyValue = ccCameraImageReadinessDetailedStateMap[props.cCameraImageState];
    const camImgReadyStyle = ccCameraImageReadinessDetailedStateToStyle[camImgReadyValue];
    return (
      <rect
        onMouseEnter={() => {
          this.handleMouseEnter('Camera');
        }}
        onMouseLeave={() => {
          this.handleMouseLeave('Camera');
        }}
        className={[styles.highlighted, styles[camImgReadyStyle]].join(' ')}
        x="147.79"
        y="111.23"
        width="40"
        height="74.7"
      />
    );
  };

  drawCameraInfo = (props) => {
    const camImgReadyValue = ccCameraImageReadinessDetailedStateMap[props.cCameraImageState];
    const camImgReadyStyle = ccCameraImageReadinessDetailedStateToStyle[camImgReadyValue];
    const camShutterValue = ccCameraShutterDetailedStateMap[props.cCameraShutterState];
    const camShutterStyle = ccCameraShutterDetailedStateToStyle[camShutterValue];
    const camFilterValue = ccCameraFilterChangerDetailedStateMap[props.cCameraFilterState];
    const camFilterStyle = ccCameraFilterChangerDetailedStateToStyle[camFilterValue];
    return (
      <InfoPanel title="Camera" className={this.state.showCameraInfo === false ? styles.hide : styles.show}>
        <SummaryPanel className={[styles.summaryPanel, styles.m1Panel].join(' ')}>
          <Label>Ready</Label>
          <StatusText status={camImgReadyStyle}>{camImgReadyValue}</StatusText>
          <Label>Shutter</Label>
          <StatusText status={camShutterStyle}>{camShutterValue}</StatusText>
          <Label>FilterChanger</Label>
          <StatusText status={camFilterStyle}>{camFilterValue}</StatusText>
          <Label>Filter</Label>
          <Value>{props.cCameraFilter}</Value>
        </SummaryPanel>
      </InfoPanel>
    );
  };

  drawLightPath1 = (ctx) => {
    let height = 221;

    if (ctx) {
      height = 278;
    }

    return <rect className={styles.lightpath} x="37.79" y=".1" width="260" height={height}></rect>;
  };

  drawLightPath2 = () => {
    return (
      <path
        className={styles.lightpath}
        d="m233.79,142.1h-46v43.84h-40v-43.84h-46l-56.44,115.53c37.89,10.46,206.99,10.46,244.88,0l-56.44-115.53Z"
      />
    );
  };

  drawLightPath3 = () => {
    return (
      <path
        className={styles.lightpath}
        d="m233.79,263.93v-121.83h-46v43.84h-40v-43.84h-46v121.83c40.18,2.06,91.82,2.06,132,0Z"
      />
    );
  };

  drawLightPath4 = () => {
    return <polygon className={styles.lightpath} points="233.79 265.1 102 265.1 148 186.1 188 186.1 233.79 265.1" />;
  };

  render() {
    const showLightPath = this.props.lightPath;
    const isM1M3CoverOpen = Math.max(...this.props.mirrorCoversState) === 0;

    return (
      <div className={styles.container}>
        <svg x={0} y={0} viewBox="0 0 335.58 400.26" xmlSpace="preserve">
          {/* Background */}
          {this.drawBackground()}

          {/* LightPath 1 */}
          {showLightPath && this.drawLightPath1(isM1M3CoverOpen)}

          {/* LightPath 2 */}
          {showLightPath && isM1M3CoverOpen && this.drawLightPath2()}

          {/* LightPath 3 */}
          {showLightPath && isM1M3CoverOpen && this.drawLightPath3()}

          {/* LightPath 4 */}
          {showLightPath && isM1M3CoverOpen && this.drawLightPath4()}

          {/* M1M3 */}
          {this.drawM1M3(this.props)}

          {/* M1M3 cover */}
          {this.drawM1M3Cover(this.props)}

          {/* M2 */}
          {this.drawM2(this.props)}

          {/* Camera */}
          {this.drawCamera(this.props)}
        </svg>
        <div style={{ transform: 'translate(-50%,-50%)', position: 'absolute', top: `50%`, left: `50%`, zIndex: 1000 }}>
          {this.drawM1M3Info(this.props)}
        </div>
        <div style={{ transform: 'translate(-50%,-50%)', position: 'absolute', top: `35%`, left: `50%`, zIndex: 1000 }}>
          {this.drawM1M3CoverInfo()}
        </div>
        <div
          style={{ transform: 'translate(-50%,-50%)', position: 'absolute', bottom: `20%`, left: `50%`, zIndex: 1000 }}
        >
          {this.drawM2Info(this.props)}
        </div>
        <div
          style={{ transform: 'translate(-50%,-50%)', position: 'absolute', bottom: `15%`, left: `50%`, zIndex: 1000 }}
        >
          {this.drawCameraInfo(this.props)}
        </div>
      </div>
    );
  }
}
