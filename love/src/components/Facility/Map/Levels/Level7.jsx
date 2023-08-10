/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed for Inria Chile Tech Team.

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
import lodash from 'lodash';
import PropTypes from 'prop-types';
import styles from './Level7.module.css';
import Device from '../Device.jsx';
import * as d3 from 'd3';

export default class Level7 extends Component {
  constructor(props) {
    super(props);
    this.mapId = lodash.uniqueId('Map-');
    this.overlayId = lodash.uniqueId('Overlay-');
    this.deviceId = lodash.uniqueId('Devices-');
  }

  static propTypes = {
    /** HVAC Telemetru data*/
    HVACData: PropTypes.object,
    /** Function saves current Map Zoom position */
    savePos: PropTypes.func,
    /** The Map Zoom position that was saved */
    transformData: PropTypes.objectOf(PropTypes.number),
  };

  static defaultProps = {
    HVACData: {},
    transformData: { k: 1, x: 0, z: 0 },
  };

  componentDidMount() {
    const deviceId = '#' + this.deviceId;
    const mapId = '#' + this.mapId;
    const overlayId = '#' + this.overlayId;
    const transformData = this.props.transformData;

    const zoom = d3.zoom().scaleExtent([1, 8]).on('zoom', this.zoomMap);

    d3.select(overlayId)
      .call(zoom.transform, d3.zoomIdentity.translate(transformData.x, transformData.y).scale(transformData.k))
      .call(zoom);
  }

  zoomMap = () => {
    const deviceId = '#' + this.deviceId;
    const mapId = '#' + this.mapId;
    const transformData = d3.event.transform;

    d3.select(mapId).attr('transform', transformData);
    d3.select(deviceId).attr('transform', transformData);
    this.props.savePos(transformData);
  };

  getDevices() {
    return <React.Fragment></React.Fragment>;
  }

  render() {
    return (
      <React.Fragment>
        <g id={this.mapId}>
          <g id="TopStairs">
            <g>
              <path
                className={styles.cls17}
                d="m237.72,333.23l-.35-.64c-.55.3-1.09.62-1.64.92l-4.35-8.19c.51-.28,1.01-.57,1.52-.85l-.33-.61c-21.38,11.79-45.94,18.51-72.03,18.51-23.08,0-44.96-5.26-64.51-14.63l-.3.62c.4.19.79.39,1.19.58l-3.92,8.4c-.44-.21-.88-.43-1.32-.65l-.32.66c20.96,10.06,44.42,15.71,69.18,15.71,27.97,0,54.28-7.2,77.19-19.84Zm-6.98-7.58l4.35,8.19c-.61.32-1.22.65-1.83.97l-4.21-8.26c.57-.29,1.12-.59,1.69-.89Zm-2.32,1.21l4.21,8.26c-.61.31-1.23.62-1.85.92l-4.07-8.33c.57-.28,1.14-.56,1.71-.85Zm-2.34,1.17l4.07,8.33c-.62.3-1.24.59-1.87.89l-3.92-8.4c.58-.27,1.15-.54,1.72-.82Zm-2.37,1.12l3.92,8.4c-.63.29-1.25.58-1.88.87l-3.77-8.47c.58-.26,1.16-.53,1.73-.8Zm-2.38,1.08l3.77,8.47c-.63.28-1.26.56-1.9.83l-3.62-8.54c.58-.25,1.17-.51,1.75-.77Zm-2.4,1.05l3.62,8.54c-.63.27-1.28.52-1.92.78l-3.47-8.6c.59-.24,1.18-.48,1.77-.72Zm-2.42.99l3.47,8.6c-.64.26-1.28.51-1.92.76l-3.32-8.66c.59-.23,1.18-.46,1.77-.7Zm-2.44.95l3.32,8.66c-.64.25-1.29.5-1.93.74l-3.17-8.72c.6-.22,1.19-.45,1.78-.68Zm-2.45.92l3.17,8.72c-.65.24-1.3.46-1.95.69l-3.02-8.77c.6-.21,1.2-.42,1.8-.64Zm-2.47.87l3.02,8.77c-.65.22-1.31.44-1.96.65l-2.87-8.82c.6-.2,1.21-.4,1.81-.6Zm-2.49.82l2.87,8.82c-.66.21-1.31.43-1.97.63l-2.71-8.87c.61-.19,1.21-.39,1.82-.58Zm-2.5.78l2.71,8.87c-.66.2-1.32.4-1.98.59l-2.56-8.92c.61-.18,1.22-.36,1.83-.55Zm-2.51.75l2.56,8.92c-.66.19-1.33.36-2,.54l-2.4-8.96c.61-.17,1.23-.33,1.84-.5Zm-2.53.69l2.4,8.96c-.67.18-1.33.35-2,.52l-2.24-9c.62-.16,1.23-.32,1.85-.48Zm-2.54.65l2.24,9c-.67.17-1.34.33-2.01.49l-2.09-9.04c.62-.15,1.24-.3,1.85-.45Zm-2.55.61l2.09,9.04c-.67.15-1.35.3-2.02.44l-1.93-9.07c.62-.13,1.24-.27,1.86-.41Zm-2.56.56l1.93,9.07c-.67.14-1.35.28-2.03.41l-1.77-9.1c.62-.12,1.25-.25,1.87-.38Zm-2.57.51l1.77,9.1c-.68.13-1.35.27-2.03.39l-1.61-9.13c.63-.11,1.25-.24,1.87-.36Zm-2.57.47l1.61,9.13c-.68.12-1.36.23-2.04.34l-1.45-9.16c.63-.1,1.26-.2,1.88-.31Zm-2.58.43l1.45,9.16c-.68.11-1.36.2-2.05.3l-1.29-9.18c.63-.09,1.26-.18,1.89-.27Zm-2.59.37l1.29,9.18c-.68.09-1.37.19-2.05.28l-1.13-9.21c.63-.08,1.26-.17,1.89-.26Zm-2.6.34l1.13,9.21c-.68.08-1.37.16-2.06.24l-.97-9.22c.63-.07,1.26-.14,1.9-.22Zm-84.95-4.35l3.92-8.4c.58.27,1.15.53,1.74.79l-3.77,8.47c-.63-.28-1.26-.57-1.88-.86Zm2.53,1.15l3.77-8.47c.58.26,1.16.52,1.75.77l-3.62,8.54c-.64-.27-1.27-.55-1.9-.83Zm2.55,1.11l3.62-8.54c.59.25,1.18.48,1.77.72l-3.47,8.6c-.64-.26-1.28-.52-1.92-.78Zm2.57,1.05l3.47-8.6c.59.24,1.18.47,1.78.7l-3.32,8.66c-.64-.25-1.29-.5-1.93-.76Zm2.59,1.01l3.32-8.66c.59.23,1.19.46,1.79.68l-3.17,8.72c-.65-.24-1.29-.49-1.94-.73Zm2.61.97l3.17-8.72c.6.22,1.2.43,1.8.64l-3.02,8.77c-.65-.23-1.3-.46-1.95-.69Zm2.62.93l3.02-8.77c.6.21,1.21.4,1.81.6l-2.87,8.82c-.66-.21-1.31-.42-1.97-.65Zm2.64.87l2.87-8.82c.61.19,1.21.39,1.82.58l-2.71,8.87c-.66-.2-1.32-.41-1.97-.63Zm2.66.83l2.71-8.87c.61.18,1.22.37,1.83.55l-2.56,8.92c-.66-.19-1.32-.39-1.98-.59Zm2.67.79l2.56-8.92c.61.17,1.23.33,1.84.5l-2.4,8.96c-.67-.18-1.34-.35-2-.54Zm2.68.73l2.4-8.96c.61.16,1.23.32,1.85.47l-2.24,9c-.67-.17-1.34-.34-2.01-.52Zm2.7.68l2.24-9c.62.15,1.23.31,1.85.45l-2.09,9.04c-.67-.16-1.34-.33-2.01-.49Zm2.71.64l2.09-9.04c.62.14,1.24.27,1.87.41l-1.93,9.07c-.68-.14-1.35-.29-2.02-.44Zm2.72.59l1.93-9.07c.62.13,1.25.25,1.87.37l-1.77,9.1c-.68-.13-1.36-.26-2.03-.4Zm2.73.54l1.77-9.1c.62.12,1.25.24,1.88.35l-1.61,9.13c-.68-.12-1.36-.25-2.03-.38Zm2.74.5l1.61-9.13c.63.11,1.25.21,1.88.31l-1.45,9.16c-.68-.11-1.36-.22-2.04-.34Zm2.74.46l1.45-9.16c.63.1,1.26.18,1.89.27l-1.29,9.18c-.68-.1-1.37-.19-2.05-.29Zm2.75.39l1.29-9.18c.63.09,1.26.17,1.89.25l-1.13,9.21c-.69-.08-1.37-.18-2.05-.27Zm2.76.35l1.13-9.21c.63.07,1.26.15,1.9.22l-.97,9.22c-.69-.07-1.37-.15-2.06-.24Zm3.73-8.91c5,.5,10.07.76,15.2.76s10.37-.27,15.45-.79l.97,9.22c-5.4.55-10.88.84-16.42.84s-10.85-.28-16.17-.81l.97-9.22Z"
              />
              <polygon className={styles.cls9} points="100.12 331.18 96.87 338.14 96.17 333.58 100.12 331.18" />
              <path
                className={styles.cls6}
                d="m97.75,334.46c19.19,8.51,40.43,13.25,62.78,13.25,24.82,0,48.27-5.84,69.06-16.21"
              />
            </g>
            <path
              className={styles.cls16}
              d="m102.79,211.85c.24.71.48,1.41.75,2.11h.76c-2.53-6.67-3.91-13.85-3.91-21.24,0-1.64.08-3.35.24-5.23.02-.2-.13-.37-.32-.38-.21-.02-.37.13-.38.32-.05.6-.09,1.18-.13,1.75l-8.77-.46c.03-.5.07-1,.11-1.53.02-.2-.13-.37-.33-.38-.19,0-.37.13-.38.33-.16,2.06-.24,3.88-.24,5.58,0,7.31,1.11,14.45,3.26,21.24h2.86l6.49-2.11Zm-11.81-22.42l8.77.46c-.04.85-.07,1.67-.07,2.48h-8.79c0-.93.04-1.91.09-2.93Zm-.09,3.64h8.79c0,.83.03,1.65.07,2.47l-8.78.46c-.04-.98-.07-1.95-.08-2.94Zm.12,3.64l8.78-.46c.05.83.11,1.65.2,2.47l-8.75.92c-.1-.97-.17-1.95-.23-2.93Zm.3,3.63l8.75-.92c.09.82.2,1.64.32,2.45l-8.7,1.38c-.15-.97-.27-1.94-.38-2.91Zm.48,3.62l8.71-1.38c.14.82.29,1.63.46,2.43l-8.63,1.84c-.2-.96-.38-1.92-.53-2.89Zm.69,3.58l8.63-1.83c.18.81.37,1.61.58,2.41l-8.53,2.29c-.25-.95-.48-1.9-.68-2.86Zm9.39,1.26c.22.8.45,1.59.7,2.37l-8.4,2.73c-.3-.93-.57-1.87-.83-2.82l8.52-2.28Z"
            />
            <path
              className={styles.cls17}
              d="m139.93,259.25c-.19-.06-.39-.13-.58-.19l.47-1.46v-2.3l-1.15,3.53c-.93-.31-1.85-.64-2.77-.98l3.15-8.2c.22.08.43.17.65.25.04.01.08.02.12.02.15,0,.28-.09.33-.23.07-.18-.03-.39-.21-.46-16.72-6.09-29.55-19.22-35.64-35.28h-.76c.77,2.07,1.65,4.09,2.64,6.05l-7.88,4.01c-1.54-3.05-2.86-6.2-3.93-9.44l1.92-.63h-2.86c2.35,7.45,5.95,14.49,10.75,20.89,8.86,11.83,21.48,20.74,35.53,25.09.04.01.07.02.1.02.15,0,.29-.1.34-.25.06-.19-.05-.39-.23-.44Zm-41.3-34.6l7.89-4.02c.38.73.77,1.46,1.18,2.17l-7.66,4.43c-.49-.85-.95-1.71-1.4-2.58Zm1.77,3.19l7.65-4.42c.42.71.85,1.42,1.29,2.11l-7.41,4.81c-.53-.82-1.05-1.66-1.54-2.5Zm3.6,5.51c-.57-.8-1.13-1.6-1.67-2.42l7.4-4.81c.45.69.92,1.37,1.4,2.04l-7.14,5.19Zm.77,1.07c-.12-.16-.23-.33-.35-.49l7.14-5.19c.49.66.99,1.32,1.5,1.96l-6.86,5.55c-.49-.61-.97-1.22-1.43-1.84Zm1.88,2.39l6.85-5.55c.52.64,1.06,1.26,1.61,1.88l-6.55,5.89c-.65-.73-1.29-1.47-1.91-2.23Zm4.42,4.88c-.69-.69-1.36-1.4-2.02-2.13l6.55-5.89c.55.61,1.12,1.21,1.7,1.8l-6.22,6.22Zm.5.5l6.22-6.22c.59.58,1.18,1.15,1.79,1.71l-5.88,6.53c-.72-.66-1.43-1.33-2.13-2.02Zm2.66,2.5l5.88-6.53c.61.55,1.24,1.08,1.88,1.61l-5.53,6.82c-.76-.62-1.5-1.25-2.24-1.9Zm2.79,2.34l5.52-6.82c.64.52,1.3,1.02,1.96,1.51l-5.16,7.1c-.79-.58-1.56-1.17-2.33-1.79Zm2.9,2.21l5.15-7.09c.67.48,1.35.95,2.04,1.41l-4.77,7.35c-.82-.54-1.62-1.09-2.42-1.67Zm3.01,2.06l4.78-7.36c.69.45,1.4.88,2.11,1.3l-4.39,7.6c-.84-.5-1.68-1.01-2.5-1.54Zm3.12,1.89l4.39-7.6c.72.41,1.44.8,2.17,1.18l-3.98,7.82c-.87-.45-1.73-.92-2.58-1.41Zm3.21,1.73l3.98-7.81c.74.37,1.48.72,2.24,1.07l-3.57,8.02c-.89-.4-1.77-.83-2.65-1.27Zm3.29,1.56l3.57-8.03c.75.33,1.52.65,2.29.95l-3.15,8.21c-.91-.36-1.82-.73-2.71-1.13Z"
            />
            <polygon className={styles.cls9} points="134.22 256.84 137.42 249.86 138.14 254.42 134.22 256.84" />
            <path
              className={styles.cls15}
              d="m136.74,253.46c-18.16-7.12-31.79-21.72-37.89-39.51h-.75c6.13,18.09,19.94,32.94,38.38,40.17.04.02.09.02.13.02.14,0,.28-.09.33-.23.07-.18-.02-.39-.2-.46Z"
            />
            <path
              className={styles.cls20}
              d="m95.33,194.38c0-.2-.18-.35-.36-.35-.2,0-.35.17-.35.36.17,6.78,1.37,13.36,3.47,19.56h.75c-2.13-6.2-3.35-12.78-3.52-19.58Z"
            />
          </g>
          <path
            id="Floor"
            className={styles.cls5}
            d="m160.53,50.71c-78.42,0-142,63.58-142,142s63.58,142,142,142,142-63.58,142-142S238.96,50.71,160.53,50.71ZM46.36,255.54c-3.53,0-6.4-2.86-6.4-6.4s2.86-6.4,6.4-6.4,6.4,2.86,6.4,6.4-2.86,6.4-6.4,6.4Zm2.58-117.44c-3.53,0-6.4-2.86-6.4-6.4s2.86-6.4,6.4-6.4,6.4,2.86,6.4,6.4-2.86,6.4-6.4,6.4Zm91.13,128.38l-31.7-16.53-21.04-36.04h19.42l33.33,33.33v19.24Zm20.46-55.46c-10.11,0-18.31-8.2-18.31-18.31s8.2-18.31,18.31-18.31,18.31,8.2,18.31,18.31-8.2,18.31-18.31,18.31Zm94.75-89.27c0-3.53,2.86-6.4,6.4-6.4s6.4,2.86,6.4,6.4-2.86,6.4-6.4,6.4-6.4-2.86-6.4-6.4Zm8.84,144.68c-3.53,0-6.4-2.86-6.4-6.4s2.86-6.4,6.4-6.4,6.4,2.86,6.4,6.4-2.86,6.4-6.4,6.4Z"
          />
          <rect className={styles.cls11} x="212.61" y="179.42" width="12.14" height="26.3" />
          <g>
            <polyline
              className={styles.cls7}
              points="524.77 20.3 524.77 13.4 752.22 13.4 851.63 20.44 877.8 36.28 877.8 269.44 851.63 285.21 829.03 285.21"
            />
            <polyline
              className={styles.cls7}
              points="193.94 50.09 224.29 20.51 828.33 20.51 872.22 45.28 872.22 260.3 828.33 285.28 274.31 285.28 278.5 279.7 803.15 279.7 848.49 256.82 848.49 48.63 803.15 26.02 218.98 26.02"
            />
            <polyline
              className={styles.cls7}
              points="206.57 37.89 780.82 37.89 696.68 152.3 780.82 268.12 286.23 268.12"
            />
            <polyline className={styles.cls7} points="803.15 279.7 780.82 268.12 848.49 256.82" />
            <polyline className={styles.cls7} points="848.49 48.63 780.82 37.89 803.15 26.02" />
            <line className={styles.cls7} x1="828.33" y1="20.51" x2="807.73" y2="28.05" />
            <line className={styles.cls7} x1="851.63" y1="20.44" x2="838.19" y2="26" />
            <line className={styles.cls7} x1="877.49" y1="36.33" x2="859.22" y2="37.82" />
            <line className={styles.cls7} x1="872.22" y1="260.3" x2="840.26" y2="260.93" />
            <line className={styles.cls7} x1="828.33" y1="285.28" x2="808.1" y2="277.4" />
            <line className={styles.cls7} x1="851.63" y1="285.21" x2="838.17" y2="279.77" />
            <line className={styles.cls7} x1="877.8" y1="269.44" x2="858.75" y2="268.05" />
            <line className={styles.cls7} x1="872.22" y1="45.28" x2="841.24" y2="44.93" />
            <polyline className={styles.cls7} points="207.45 53.91 216.94 44.56 775.87 44.56" />
            <line className={styles.cls7} x1="696.68" y1="152.3" x2="302.05" y2="152.3" />
          </g>
          <g id="Dome">
            <g>
              <line className={styles.cls7} x1="170.53" y1="192.71" x2="150.53" y2="192.71" />
              <line className={styles.cls7} x1="160.53" y1="202.71" x2="160.53" y2="182.71" />
            </g>
            <g id="Solid_Walls" data-name="Solid Walls">
              <circle className={styles.cls15} cx="160.53" cy="192.71" r="8.35" />
              <circle className={styles.cls10} cx="160.53" cy="192.71" r="75.6" />
              <circle className={styles.cls4} cx="160.53" cy="192.71" r="144.15" />
              <circle className={styles.cls7} cx="160.53" cy="192.71" r="146.5" />
              <circle className={styles.cls7} cx="160.53" cy="192.71" r="141.9" />
            </g>
          </g>
          <g id="text">
            <g id="t1">
              <g className={styles.cls26}>
                <text className={styles.cls18} transform="translate(155.37 149.4)">
                  <tspan className={styles.cls13} x="0" y="0">
                    P
                  </tspan>
                  <tspan x="4.17" y="0">
                    ier
                  </tspan>
                  <tspan x="-22.22" y="7.2">
                    In
                  </tspan>
                  <tspan className={styles.cls27} x="-16.35" y="7.2">
                    t
                  </tspan>
                  <tspan x="-14.03" y="7.2">
                    e
                  </tspan>
                  <tspan className={styles.cls23} x="-10.4" y="7.2">
                    r
                  </tspan>
                  <tspan className={styles.cls22} x="-8.05" y="7.2">
                    m
                  </tspan>
                  <tspan x="-1.67" y="7.2">
                    edia
                  </tspan>
                  <tspan className={styles.cls3} x="11.18" y="7.2">
                    t
                  </tspan>
                  <tspan className={styles.cls21} x="13.5" y="7.2">
                    e Floor
                  </tspan>
                </text>
                <text className={styles.cls18} transform="translate(155.37 149.4)">
                  <tspan className={styles.cls13} x="0" y="0">
                    P
                  </tspan>
                  <tspan x="4.17" y="0">
                    ier
                  </tspan>
                  <tspan x="-22.22" y="7.2">
                    In
                  </tspan>
                  <tspan className={styles.cls27} x="-16.35" y="7.2">
                    t
                  </tspan>
                  <tspan x="-14.03" y="7.2">
                    e
                  </tspan>
                  <tspan className={styles.cls23} x="-10.4" y="7.2">
                    r
                  </tspan>
                  <tspan className={styles.cls22} x="-8.05" y="7.2">
                    m
                  </tspan>
                  <tspan x="-1.67" y="7.2">
                    edia
                  </tspan>
                  <tspan className={styles.cls3} x="11.18" y="7.2">
                    t
                  </tspan>
                  <tspan className={styles.cls21} x="13.5" y="7.2">
                    e Floor
                  </tspan>
                </text>
              </g>
            </g>
            <g id="t2" className={styles.cls24}>
              <g className={styles.cls26}>
                <text className={styles.cls19} transform="translate(212.71 193.75)">
                  <tspan x="0" y="0">
                    Ha
                  </tspan>
                  <tspan className={styles.cls2} x="5.61" y="0">
                    t
                  </tspan>
                  <tspan className={styles.cls25} x="7.16" y="0">
                    c
                  </tspan>
                  <tspan x="9.38" y="0">
                    h
                  </tspan>
                </text>
                <text className={styles.cls19} transform="translate(212.71 193.75)">
                  <tspan x="0" y="0">
                    Ha
                  </tspan>
                  <tspan className={styles.cls2} x="5.61" y="0">
                    t
                  </tspan>
                  <tspan className={styles.cls25} x="7.16" y="0">
                    c
                  </tspan>
                  <tspan x="9.38" y="0">
                    h
                  </tspan>
                </text>
              </g>
            </g>
          </g>
          <rect
            className={styles.cls8}
            x="201.64"
            y="74.42"
            width="21.05"
            height="19.23"
            transform="translate(371.8 247.09) rotate(-156)"
          />
          <g id="t2-2" data-name="t2" className={styles.cls24}>
            <g className={styles.cls26}>
              <text className={styles.cls19} transform="translate(206.67 84.73)">
                <tspan x="0" y="0">
                  El
                </tspan>
                <tspan className={styles.cls1} x="3.75" y="0">
                  e
                </tspan>
                <tspan className={styles.cls14} x="6.13" y="0">
                  v
                </tspan>
                <tspan x="8.16" y="0">
                  . 3
                </tspan>
              </text>
              <text className={styles.cls19} transform="translate(206.67 84.73)">
                <tspan x="0" y="0">
                  El
                </tspan>
                <tspan className={styles.cls1} x="3.75" y="0">
                  e
                </tspan>
                <tspan className={styles.cls14} x="6.13" y="0">
                  v
                </tspan>
                <tspan x="8.16" y="0">
                  . 3
                </tspan>
              </text>
            </g>
          </g>
          <path
            className={styles.cls17}
            d="m194.46,83.28c.18.08.25.29.17.47l-4.07,8.73c-.08.18-.29.25-.47.17l-.09-.04c-.18-.08-.25-.29-.17-.47l3.91-8.39c-4.57-1.8-9.73.24-11.82,4.71-.08.18-.29.25-.47.17s-.25-.29-.17-.47c2.27-4.87,7.94-7.07,12.9-5.01.04.02.07.03.1.07.03.01.06,0,.09.02l.09.04h-.01Z"
          />
          <polygon
            className={styles.cls7}
            points="178.48 86.69 178.48 73.04 145.76 73.36 145.76 75.42 177.06 75.42 177.06 86.69 135.08 86.51 135.08 62.37 190.24 62.37 205.17 69.09 203.03 73.9 204.22 74.43 206.35 69.62 232.97 81.6 222.08 106.22 195.36 94.31 199.76 84.43 198.57 83.9 194.17 93.78 190.88 92.32 190.14 93.77 222.61 108.23 234.69 80.94 190.52 61.07 133.77 61.07 133.77 88.14 177.99 88.14 180.58 89.44 181.24 88.02 178.48 86.69"
          />
          <g id="Stairs">
            <polygon
              className={styles.cls11}
              points="144.96 76.14 144.96 72.81 175.57 72.81 175.57 63.13 135.84 63.13 135.84 68.47 135.84 72.81 135.84 76.14 135.84 85.83 144.96 85.83 175.57 85.83 175.57 76.14 144.96 76.14"
            />
            <line className={styles.cls11} x1="172.48" y1="76.26" x2="172.48" y2="85.78" />
            <line className={styles.cls11} x1="169.48" y1="76.26" x2="169.48" y2="85.78" />
            <line className={styles.cls11} x1="166.48" y1="76.26" x2="166.48" y2="85.78" />
            <line className={styles.cls11} x1="163.48" y1="76.26" x2="163.48" y2="85.78" />
            <line className={styles.cls11} x1="160.48" y1="76.26" x2="160.48" y2="85.78" />
            <line className={styles.cls11} x1="157.48" y1="76.26" x2="157.48" y2="85.78" />
            <line className={styles.cls11} x1="154.48" y1="76.26" x2="154.48" y2="85.78" />
            <line className={styles.cls11} x1="151.48" y1="76.26" x2="151.48" y2="85.78" />
            <line className={styles.cls11} x1="148.48" y1="76.26" x2="148.48" y2="85.78" />
            <line className={styles.cls11} x1="145.48" y1="76.26" x2="145.48" y2="85.78" />
            <line className={styles.cls11} x1="148.48" y1="63.26" x2="148.48" y2="72.78" />
            <line className={styles.cls11} x1="151.48" y1="63.26" x2="151.48" y2="72.78" />
            <line className={styles.cls11} x1="154.48" y1="63.26" x2="154.48" y2="72.78" />
            <line className={styles.cls11} x1="157.48" y1="63.26" x2="157.48" y2="72.78" />
            <line className={styles.cls11} x1="160.48" y1="63.26" x2="160.48" y2="72.78" />
            <line className={styles.cls11} x1="163.48" y1="63.26" x2="163.48" y2="72.78" />
            <line className={styles.cls11} x1="166.48" y1="63.26" x2="166.48" y2="72.78" />
            <line className={styles.cls11} x1="169.48" y1="63.26" x2="169.48" y2="72.78" />
            <line className={styles.cls11} x1="172.48" y1="63.26" x2="172.48" y2="72.78" />
            <g id="Arrow">
              <polygon className={styles.cls9} points="173.12 72.02 173.12 64.35 175.68 68.19 173.12 72.02" />
              <polyline className={styles.cls6} points="173.96 68.19 140.57 68.19 140.57 80.98 171.19 80.98" />
            </g>
          </g>
          <g>
            <polyline className={styles.cls12} points="89.73 100.65 121.45 82.51 133.77 78.89" />
            <polyline className={styles.cls12} points="84.94 92.47 116.66 74.33 133.64 69.16" />
            <line className={styles.cls12} x1="85.75" y1="92.21" x2="90.33" y2="100.09" />
            <line className={styles.cls12} x1="88.26" y1="90.68" x2="92.84" y2="98.56" />
            <line className={styles.cls12} x1="90.94" y1="89.12" x2="95.52" y2="97" />
            <line className={styles.cls12} x1="93.45" y1="87.58" x2="98.03" y2="95.47" />
            <line className={styles.cls12} x1="96.31" y1="86.37" x2="100.89" y2="94.26" />
            <line className={styles.cls12} x1="98.82" y1="84.84" x2="103.4" y2="92.72" />
            <line className={styles.cls12} x1="101.5" y1="83.28" x2="106.08" y2="91.16" />
            <line className={styles.cls12} x1="104.01" y1="81.75" x2="108.59" y2="89.63" />
            <line className={styles.cls12} x1="106.5" y1="80.49" x2="111.08" y2="88.37" />
            <line className={styles.cls12} x1="109.01" y1="78.96" x2="113.59" y2="86.84" />
            <line className={styles.cls12} x1="111.68" y1="77.4" x2="116.26" y2="85.28" />
            <line className={styles.cls12} x1="114.19" y1="75.86" x2="118.77" y2="83.75" />
            <line className={styles.cls12} x1="116.66" y1="74.47" x2="121.24" y2="82.35" />
            <line className={styles.cls12} x1="125.66" y1="71.77" x2="128.05" y2="80.44" />
            <line className={styles.cls12} x1="128.52" y1="71.02" x2="130.91" y2="79.7" />
            <line className={styles.cls12} x1="131.36" y1="70.14" x2="133.75" y2="78.82" />
            <g id="Arrow-2" data-name="Arrow">
              <polygon className={styles.cls9} points="129.05 79.39 127.02 71.99 130.5 75.02 129.05 79.39" />
              <polyline className={styles.cls6} points="128.5 75.49 119.36 78.14 89.43 95.23" />
            </g>
          </g>
          <g id="Stairs-2" data-name="Stairs">
            <polyline
              className={styles.cls11}
              points="74.88 276.28 58.17 252.02 40.27 264.49 57.26 289.16 65.81 283.19 54.67 266.94 55.33 266.44 66.19 282.28"
            />
            <line className={styles.cls11} x1="61.4" y1="277" x2="53.21" y2="282.83" />
            <line className={styles.cls11} x1="59.71" y1="274.53" x2="51.52" y2="280.35" />
            <line className={styles.cls11} x1="58.01" y1="272.05" x2="49.82" y2="277.88" />
            <line className={styles.cls11} x1="56.31" y1="269.58" x2="48.12" y2="275.41" />
            <line className={styles.cls11} x1="54.61" y1="267.11" x2="46.42" y2="272.94" />
            <line className={styles.cls11} x1="63.73" y1="260.68" x2="55.21" y2="266.72" />
            <line className={styles.cls11} x1="65.43" y1="263.15" x2="56.9" y2="269.2" />
            <line className={styles.cls11} x1="67.13" y1="265.62" x2="58.6" y2="271.67" />
            <line className={styles.cls11} x1="68.83" y1="268.1" x2="60.3" y2="274.14" />
            <line className={styles.cls11} x1="70.53" y1="270.57" x2="62" y2="276.62" />
            <line className={styles.cls11} x1="72.22" y1="273.04" x2="63.69" y2="279.09" />
            <g id="Arrow-3" data-name="Arrow">
              <polygon className={styles.cls9} points="66.16 279.3 72.49 274.96 70.77 279.24 66.16 279.3" />
              <polyline className={styles.cls6} points="69.8 277.82 56.84 259.22 47.64 265.78 60.38 284.19" />
            </g>
          </g>
        </g>

        <rect id={this.overlayId} pointerEvents="all" fill="none" width="882.42" height="461.23" />

        <g id={this.deviceId}>{!this.props.hideHVAC && this.getDevices()}</g>
      </React.Fragment>
    );
  }
}
