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
import styles from './Level3.module.css';
import Device from '../Device.jsx';
import * as d3 from 'd3';

export default class Level3 extends Component {
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
          <g id="Building">
            <path
              className={styles.cls6}
              d="m849.61,31.12h-362.44l-.19,5.86H225.22l-8,18.05c57.12,24.56,78.33,76.28,78.33,76.28h133.23v135.26h131.42v8.05h289.58l15.53-7.33V38.48l-15.7-7.36Z"
            />
            <g id="Elevator" className={styles.cls41}>
              <circle className={styles.cls12} cx="375.4" cy="192.69" r="42.09" />
              <path
                className={styles.cls22}
                d="m424.22,140.05c.28,0,.5-.22.5-.5v-5.93c0-.28-.22-.5-.5-.5h-1.82v-.67c0-.39-.31-.7-.7-.7h-1.63c-.39,0-.7.31-.7.7v.67h-1.71c-.28,0-.5.22-.5.5v1.73h-38.44v-1.73c0-.28-.22-.5-.5-.5h-1.82v-.67c0-.39-.31-.7-.7-.7h-1.63c-.39,0-.7.31-.7.7v.67h-1.71c-.28,0-.5.22-.5.5v1.73h-38.44v-1.73c0-.28-.22-.5-.5-.5h-1.82v-.67c0-.39-.31-.7-.7-.7h-1.63c-.39,0-.7.31-.7.7v.67h-1.71c-.28,0-.5.22-.5.5v1.23h-31.71l1.5,3h30.21v1.7c0,.26.21.47.47.49v106.08c-.26.02-.47.23-.47.49v1.06h-32.04l-1.5,3h33.54v1.87c0,.28.22.5.5.5h1.71v14.17c0,.39.31,0,.7,0h1.63c.39,0,.7.39.7,0v-14.17h1.82c.28,0,.5-.22.5-.5v-2.37h38.44v2.37c0,.28.22.5.5.5h1.71v14.17c0,.39.31,0,.7,0h1.63c.39,0,.7.39.7,0v-14.17h1.82c.28,0,.5-.22.5-.5v-2.37h38.44v2.37c0,.28.22.5.5.5h1.71v14.17c0,.39.31,0,.7,0h1.63c.39,0,.7.39.7,0v-14.17h1.82c.28,0,.5-.22.5-.5v-5.93c0-.28-.22-.5-.5-.5h-.03v-106.07h.03Zm-99.29-3.2h-29.36l-.5-1h29.86v1Zm0,112.84h-31.69l.5-1h31.19v1Zm97.48-111.03h.41c.28,0,.5-.22.5-.5v-3.14c0-.28-.22-.5-.5-.5h-.41v-.39h1.32v4.93h-1.32v-.39Zm-2.03-5.04v-.88h1.03v1.77h-1.03v-.89Zm-.81,1.89h2.75v2.14h-2.75v-2.14Zm1.84,3.14v108.86h-1.03v-108.86h1.03Zm-2.03,105.16h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm-1.21-11.91h1.21v.39h-.31c-.28,0-.5.22-.5.5v3.14c0,.28.22.5.5.5h.31v.39h-1.21v-4.93Zm-41.76,4.54h.41c.28,0,.5-.22.5-.5v-3.14c0-.28-.22-.5-.5-.5h-.41v-.39h1.32v4.93h-1.32v-.39Zm1.82,1.39c.28,0,.5-.22.5-.5v-2.2h38.44v2.2c0,.28.22.5.5.5h1.71v.84h-42.97v-.84h1.82Zm-3.85-6.43v-.88h1.03v1.77h-1.03v-.89Zm-.81,1.89h2.75v2.14h-2.75v-2.14Zm1.84,3.14v108.86h-1.03v-108.86h1.03Zm-2.03,105.16h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm-1.21-11.91h1.21v.39h-.31c-.28,0-.5.22-.5.5v3.14c0,.28.22.5.5.5h.31v.39h-1.21v-4.93Zm-41.76,4.54h.41c.28,0,.5-.22.5-.5v-3.14c0-.28-.22-.5-.5-.5h-.41v-.39h1.32v4.93h-1.32v-.39Zm1.82,1.39c.28,0,.5-.22.5-.5v-2.2h38.44v2.2c0,.28.22.5.5.5h1.71v.84h-42.97v-.84h1.82Zm-3.85-6.43v-.88h1.03v1.77h-1.03v-.89Zm-.81,1.89h2.75v2.14h-2.75v-2.14Zm1.84,3.14v108.86h-1.03v-108.86h1.03Zm-3.24-4.54h1.21v.39h-.31c-.28,0-.5.22-.5.5v3.14c0,.28.22.5.5.5h.31v.39h-1.21v-4.93Zm1.21,113.39h-.31c-.28,0-.5.22-.5.5v3.14c0,.28.22.5.5.5h.31v.39h-1.21v-4.93h1.21v.39Zm2.03,5.04v14.67h-1.03v-15.56h1.03v.89Zm.91-1.89h-2.75v-2.14h2.75v2.14Zm1.4,1.39h-1.32v-.39h.41c.28,0,.5-.22.5-.5v-3.14c0-.28-.22-.5-.5-.5h-.41v-.39h1.32v4.93Zm41.65-4.54h-.31c-.28,0-.5.22-.5.5v3.14c0,.28.22.5.5.5h.31v.39h-1.21v-4.93h1.21v.39Zm-1.71-1.39c-.28,0-.5.22-.5.5v1.56h-38.44v-1.56c0-.28-.22-.5-.5-.5h-1.82v-1.3h42.97v1.3h-1.71Zm3.74,6.43v14.67h-1.03v-15.56h1.03v.89Zm.91-1.89h-2.75v-2.14h2.75v2.14Zm1.4,1.39h-1.32v-.39h.41c.28,0,.5-.22.5-.5v-3.14c0-.28-.22-.5-.5-.5h-.41v-.39h1.32v4.93Zm41.65-4.54h-.31c-.28,0-.5.22-.5.5v3.14c0,.28.22.5.5.5h.31v.39h-1.21v-4.93h1.21v.39Zm-1.71-1.39c-.28,0-.5.22-.5.5v1.56h-38.44v-1.56c0-.28-.22-.5-.5-.5h-1.82v-1.3h42.97v1.3h-1.71Zm3.74,6.43v14.67h-1.03v-15.56h1.03v.89Zm.91-1.89h-2.75v-2.14h2.75v2.14Zm1.4,1.39h-1.32v-.39h.41c.28,0,.5-.22.5-.5v-3.14c0-.28-.22-.5-.5-.5h-.41v-.39h1.32v4.93Z"
              />
            </g>
            <g id="Deck">
              <g>
                <polyline className={styles.cls8} points="623.32 325.99 623.32 332.63 712.72 332.63 712.72 283.95" />
                <polyline className={styles.cls8} points="624.32 326.13 624.32 331.63 711.72 331.63 711.72 283.95" />
                <line className={styles.cls8} x1="623.32" y1="282.84" x2="623.32" y2="313.85" />
                <line className={styles.cls8} x1="624.32" y1="282.84" x2="624.32" y2="313.85" />
                <g>
                  <rect className={styles.cls8} x="629.32" y="285.42" width="77.06" height="42.21" />
                  <g>
                    <line className={styles.cls15} x1="630.05" y1="285.76" x2="630.05" y2="327.46" />
                    <line className={styles.cls15} x1="631.52" y1="285.76" x2="631.52" y2="327.46" />
                    <line className={styles.cls15} x1="633.71" y1="285.76" x2="633.71" y2="327.46" />
                    <line className={styles.cls15} x1="635.91" y1="285.76" x2="635.91" y2="327.46" />
                    <line className={styles.cls15} x1="638.11" y1="285.76" x2="638.11" y2="327.46" />
                    <line className={styles.cls15} x1="655.69" y1="285.76" x2="655.69" y2="327.46" />
                    <line className={styles.cls15} x1="673.27" y1="285.76" x2="673.27" y2="327.46" />
                    <line className={styles.cls15} x1="690.85" y1="285.76" x2="690.85" y2="327.46" />
                    <line className={styles.cls15} x1="653.49" y1="285.76" x2="653.49" y2="327.46" />
                    <line className={styles.cls15} x1="671.07" y1="285.76" x2="671.07" y2="327.46" />
                    <line className={styles.cls15} x1="688.65" y1="285.76" x2="688.65" y2="327.46" />
                    <line className={styles.cls15} x1="651.29" y1="285.76" x2="651.29" y2="327.46" />
                    <line className={styles.cls15} x1="668.87" y1="285.76" x2="668.87" y2="327.46" />
                    <line className={styles.cls15} x1="686.45" y1="285.76" x2="686.45" y2="327.46" />
                    <line className={styles.cls15} x1="704.03" y1="285.76" x2="704.03" y2="327.46" />
                    <line className={styles.cls15} x1="649.1" y1="285.76" x2="649.1" y2="327.46" />
                    <line className={styles.cls15} x1="666.67" y1="285.76" x2="666.67" y2="327.46" />
                    <line className={styles.cls15} x1="684.25" y1="285.76" x2="684.25" y2="327.46" />
                    <line className={styles.cls15} x1="701.83" y1="285.76" x2="701.83" y2="327.46" />
                    <line className={styles.cls15} x1="646.9" y1="285.76" x2="646.9" y2="327.46" />
                    <line className={styles.cls15} x1="664.48" y1="285.76" x2="664.48" y2="327.46" />
                    <line className={styles.cls15} x1="682.06" y1="285.76" x2="682.06" y2="327.46" />
                    <line className={styles.cls15} x1="699.63" y1="285.76" x2="699.63" y2="327.46" />
                    <line className={styles.cls15} x1="644.7" y1="285.76" x2="644.7" y2="327.46" />
                    <line className={styles.cls15} x1="662.28" y1="285.76" x2="662.28" y2="327.46" />
                    <line className={styles.cls15} x1="679.86" y1="285.76" x2="679.86" y2="327.46" />
                    <line className={styles.cls15} x1="697.44" y1="285.76" x2="697.44" y2="327.46" />
                    <line className={styles.cls15} x1="642.5" y1="285.76" x2="642.5" y2="327.46" />
                    <line className={styles.cls15} x1="660.08" y1="285.76" x2="660.08" y2="327.46" />
                    <line className={styles.cls15} x1="677.66" y1="285.76" x2="677.66" y2="327.46" />
                    <line className={styles.cls15} x1="695.24" y1="285.76" x2="695.24" y2="327.46" />
                    <line className={styles.cls15} x1="640.31" y1="285.76" x2="640.31" y2="327.46" />
                    <line className={styles.cls15} x1="657.88" y1="285.76" x2="657.88" y2="327.46" />
                    <line className={styles.cls15} x1="675.46" y1="285.76" x2="675.46" y2="327.46" />
                    <line className={styles.cls15} x1="693.04" y1="285.76" x2="693.04" y2="327.46" />
                    <line className={styles.cls15} x1="632.25" y1="285.76" x2="632.25" y2="327.46" />
                    <line className={styles.cls15} x1="634.45" y1="285.76" x2="634.45" y2="327.46" />
                    <line className={styles.cls15} x1="636.64" y1="285.76" x2="636.64" y2="327.46" />
                    <line className={styles.cls15} x1="638.84" y1="285.76" x2="638.84" y2="327.46" />
                    <line className={styles.cls15} x1="656.42" y1="285.76" x2="656.42" y2="327.46" />
                    <line className={styles.cls15} x1="674" y1="285.76" x2="674" y2="327.46" />
                    <line className={styles.cls15} x1="691.58" y1="285.76" x2="691.58" y2="327.46" />
                    <line className={styles.cls15} x1="654.22" y1="285.76" x2="654.22" y2="327.46" />
                    <line className={styles.cls15} x1="671.8" y1="285.76" x2="671.8" y2="327.46" />
                    <line className={styles.cls15} x1="689.38" y1="285.76" x2="689.38" y2="327.46" />
                    <line className={styles.cls15} x1="652.03" y1="285.76" x2="652.03" y2="327.46" />
                    <line className={styles.cls15} x1="669.6" y1="285.76" x2="669.6" y2="327.46" />
                    <line className={styles.cls15} x1="687.18" y1="285.76" x2="687.18" y2="327.46" />
                    <line className={styles.cls15} x1="704.76" y1="285.76" x2="704.76" y2="327.46" />
                    <line className={styles.cls15} x1="649.83" y1="285.76" x2="649.83" y2="327.46" />
                    <line className={styles.cls15} x1="667.41" y1="285.76" x2="667.41" y2="327.46" />
                    <line className={styles.cls15} x1="684.99" y1="285.76" x2="684.99" y2="327.46" />
                    <line className={styles.cls15} x1="702.56" y1="285.76" x2="702.56" y2="327.46" />
                    <line className={styles.cls15} x1="647.63" y1="285.76" x2="647.63" y2="327.46" />
                    <line className={styles.cls15} x1="665.21" y1="285.76" x2="665.21" y2="327.46" />
                    <line className={styles.cls15} x1="682.79" y1="285.76" x2="682.79" y2="327.46" />
                    <line className={styles.cls15} x1="700.37" y1="285.76" x2="700.37" y2="327.46" />
                    <line className={styles.cls15} x1="645.43" y1="285.76" x2="645.43" y2="327.46" />
                    <line className={styles.cls15} x1="663.01" y1="285.76" x2="663.01" y2="327.46" />
                    <line className={styles.cls15} x1="680.59" y1="285.76" x2="680.59" y2="327.46" />
                    <line className={styles.cls15} x1="698.17" y1="285.76" x2="698.17" y2="327.46" />
                    <line className={styles.cls15} x1="643.24" y1="285.76" x2="643.24" y2="327.46" />
                    <line className={styles.cls15} x1="660.81" y1="285.76" x2="660.81" y2="327.46" />
                    <line className={styles.cls15} x1="678.39" y1="285.76" x2="678.39" y2="327.46" />
                    <line className={styles.cls15} x1="695.97" y1="285.76" x2="695.97" y2="327.46" />
                    <line className={styles.cls15} x1="641.04" y1="285.76" x2="641.04" y2="327.46" />
                    <line className={styles.cls15} x1="658.62" y1="285.76" x2="658.62" y2="327.46" />
                    <line className={styles.cls15} x1="676.2" y1="285.76" x2="676.2" y2="327.46" />
                    <line className={styles.cls15} x1="693.77" y1="285.76" x2="693.77" y2="327.46" />
                    <line className={styles.cls15} x1="630.78" y1="285.76" x2="630.78" y2="327.46" />
                    <line className={styles.cls15} x1="632.98" y1="285.76" x2="632.98" y2="327.46" />
                    <line className={styles.cls15} x1="635.18" y1="285.76" x2="635.18" y2="327.46" />
                    <line className={styles.cls15} x1="637.38" y1="285.76" x2="637.38" y2="327.46" />
                    <line className={styles.cls15} x1="654.95" y1="285.76" x2="654.95" y2="327.46" />
                    <line className={styles.cls15} x1="672.53" y1="285.76" x2="672.53" y2="327.46" />
                    <line className={styles.cls15} x1="690.11" y1="285.76" x2="690.11" y2="327.46" />
                    <line className={styles.cls15} x1="652.76" y1="285.76" x2="652.76" y2="327.46" />
                    <line className={styles.cls15} x1="670.34" y1="285.76" x2="670.34" y2="327.46" />
                    <line className={styles.cls15} x1="687.92" y1="285.76" x2="687.92" y2="327.46" />
                    <line className={styles.cls15} x1="705.49" y1="285.76" x2="705.49" y2="327.46" />
                    <line className={styles.cls15} x1="650.56" y1="285.76" x2="650.56" y2="327.46" />
                    <line className={styles.cls15} x1="668.14" y1="285.76" x2="668.14" y2="327.46" />
                    <line className={styles.cls15} x1="685.72" y1="285.76" x2="685.72" y2="327.46" />
                    <line className={styles.cls15} x1="703.3" y1="285.76" x2="703.3" y2="327.46" />
                    <line className={styles.cls15} x1="648.36" y1="285.76" x2="648.36" y2="327.46" />
                    <line className={styles.cls15} x1="665.94" y1="285.76" x2="665.94" y2="327.46" />
                    <line className={styles.cls15} x1="683.52" y1="285.76" x2="683.52" y2="327.46" />
                    <line className={styles.cls15} x1="701.1" y1="285.76" x2="701.1" y2="327.46" />
                    <line className={styles.cls15} x1="646.17" y1="285.76" x2="646.17" y2="327.46" />
                    <line className={styles.cls15} x1="663.74" y1="285.76" x2="663.74" y2="327.46" />
                    <line className={styles.cls15} x1="681.32" y1="285.76" x2="681.32" y2="327.46" />
                    <line className={styles.cls15} x1="698.9" y1="285.76" x2="698.9" y2="327.46" />
                    <line className={styles.cls15} x1="643.97" y1="285.76" x2="643.97" y2="327.46" />
                    <line className={styles.cls15} x1="661.55" y1="285.76" x2="661.55" y2="327.46" />
                    <line className={styles.cls15} x1="679.13" y1="285.76" x2="679.13" y2="327.46" />
                    <line className={styles.cls15} x1="696.7" y1="285.76" x2="696.7" y2="327.46" />
                    <line className={styles.cls15} x1="641.77" y1="285.76" x2="641.77" y2="327.46" />
                    <line className={styles.cls15} x1="659.35" y1="285.76" x2="659.35" y2="327.46" />
                    <line className={styles.cls15} x1="676.93" y1="285.76" x2="676.93" y2="327.46" />
                    <line className={styles.cls15} x1="694.51" y1="285.76" x2="694.51" y2="327.46" />
                    <line className={styles.cls15} x1="639.57" y1="285.76" x2="639.57" y2="327.46" />
                    <line className={styles.cls15} x1="657.15" y1="285.76" x2="657.15" y2="327.46" />
                    <line className={styles.cls15} x1="674.73" y1="285.76" x2="674.73" y2="327.46" />
                    <line className={styles.cls15} x1="692.31" y1="285.76" x2="692.31" y2="327.46" />
                  </g>
                </g>
              </g>
              <rect className={styles.cls8} x="560.29" y="285.97" width="2.51" height="27.08" />
              <rect className={styles.cls8} x="560.29" y="326.51" width="2.51" height="50.49" />
            </g>
            <g id="Wall">
              <line className={styles.cls10} x1="813.26" y1="46.56" x2="813.26" y2="76.51" />
              <polygon
                className={styles.cls10}
                points="767.91 54.32 800.25 54.32 800.25 63.25 767.91 63.25 767.91 64.43 801.4 64.43 801.4 53.02 767.91 53.02 767.91 54.32"
              />
              <rect className={styles.cls10} x="767.91" y="77.26" width="1.12" height="5.39" />
              <rect className={styles.cls10} x="767.91" y="94.57" width="1.12" height="8.26" />
              <rect className={styles.cls10} x="795.92" y="78.47" width="1.81" height="23.67" />
              <rect className={styles.cls10} x="744.48" y="46.36" width="2.43" height="54" />
              <rect className={styles.cls10} x="817.15" y="31.12" width="1.12" height="7.63" />
              <polygon
                className={styles.cls10}
                points="865.03 130.42 849.3 130.42 849.3 115.01 847.9 115.01 847.9 130.42 847.9 131.82 847.9 136.37 849.3 136.37 849.3 131.82 865.03 131.82 865.03 130.42"
              />
              <polygon
                className={styles.cls10}
                points="865.03 102.58 847.9 102.58 847.9 103.25 847.9 103.98 847.9 105.01 849.3 105.01 849.3 103.98 865.03 103.98 865.03 102.58"
              />
              <rect
                className={styles.cls10}
                x="400.29"
                y="92.55"
                width="1.4"
                height="44.17"
                transform="translate(286.35 515.62) rotate(-90)"
              />
              <polygon
                className={styles.cls10}
                points="427.89 44.99 424.22 44.99 424.22 37.67 422.82 37.67 422.82 52.39 424.22 52.39 424.22 46.39 427.89 46.39 427.89 44.99"
              />
              <polygon
                className={styles.cls10}
                points="422.82 90.49 422.82 91.84 377.91 91.84 377.91 94.43 422.82 94.43 422.82 95.27 424.22 95.27 424.22 90.49 422.82 90.49"
              />
              <polygon
                className={styles.cls10}
                points="362.07 94.43 362.07 91.84 305.42 91.84 305.42 94.43 308 94.43 308 115.33 308.97 115.33 309.4 115.33 360.87 115.33 360.87 113.93 309.4 113.93 309.4 94.43 362.07 94.43"
              />
              <rect
                className={styles.cls10}
                x="277.24"
                y="54.53"
                width="1.4"
                height="6.58"
                transform="translate(335.76 -220.13) rotate(90)"
              />
              <polygon
                className={styles.cls10}
                points="294.88 53.38 294.88 57.12 290.69 57.12 290.69 58.52 294.88 58.52 294.88 81.6 296.95 81.6 296.95 53.38 294.88 53.38"
              />
              <g id="Windows">
                <rect
                  className={styles.cls10}
                  x="422.6"
                  y="78.62"
                  width="1.84"
                  height="1.4"
                  transform="translate(502.83 -344.2) rotate(90)"
                />
              </g>
              <polyline
                className={styles.cls10}
                points="560.19 274.61 849.77 274.61 865.31 267.28 865.31 38.48 849.61 31.12 487.17 31.12"
              />
              <rect className={styles.cls10} x="768.31" y="31.12" width="1.12" height="7.63" />
              <rect className={styles.cls10} x="747.1" y="31.12" width="1.12" height="7.63" />
              <rect className={styles.cls10} x="743.7" y="31.12" width="1.12" height="7.63" />
            </g>
            <g id="DOORS">
              <path
                className={styles.cls22}
                d="m801.1,113.05c-.2,0-.35-.16-.35-.35v-9.63c0-.2.16-.35.35-.35h.1c.2,0,.35.16.35.35v9.26c4.9-.3,8.72-4.33,8.72-9.26,0-.2.16-.35.35-.35s.35.16.35.35c0,5.37-4.21,9.76-9.57,9.99-.04,0-.08,0-.12-.02-.03,0-.06.02-.09.02h-.1.01Z"
              />
              <path
                className={styles.cls22}
                d="m858.06,105.27c0-.2-.16-.35-.35-.35h-9.63c-.2,0-.35.16-.35.35v.1c0,.2.16.35.35.35h9.26c-.3,4.9-4.33,8.72-9.26,8.72-.2,0-.35.16-.35.35s.16.35.35.35c5.37,0,9.76-4.21,9.99-9.57,0-.04,0-.08-.02-.12,0-.03.02-.06.02-.09v-.1h-.01Z"
              />
              <g>
                <path className={styles.cls11} d="m759,101.46h0c.01,4.48-3.61,8.13-8.09,8.14h0s-.03-8.11-.03-8.11" />
                <path className={styles.cls11} d="m759,101.46h0c-.01,4.48,3.61,8.13,8.09,8.14h0s.03-8.11.03-8.11" />
              </g>
              <path
                className={styles.cls22}
                d="m437.79,117.24c0-.2-.16-.35-.35-.35h-9.63c-.2,0-.35.16-.35.35v.1c0,.2.16.35.35.35h9.26c-.3,4.9-4.33,8.72-9.26,8.72-.2,0-.35.16-.35.35s.16.35.35.35c5.37,0,9.76-4.21,9.99-9.57,0-.04,0-.08-.02-.12,0-.03.02-.06.02-.09v-.1h0Z"
              />
              <path
                className={styles.cls22}
                d="m379.9,104.14h-.2s-.05,0-.07.01c-4.26.25-7.73,3.19-8.79,7.13-1.08-3.99-4.62-6.96-8.95-7.15-.03,0-.05.02-.08.03-.04-.02-.09-.03-.14-.03h-.2c-.19,0-.34.15-.34.34v9.17c0,.19.15.34.34.34h.2c.19,0,.34-.15.34-.34v-8.81c4.76.29,8.47,4.2,8.47,8.99,0,.19.15.34.34.34s.34-.15.34-.34c0-4.69,3.56-8.53,8.17-8.96v8.79c0,.19.15.34.34.34h.2c.19,0,.34-.15.34-.34v-9.17c0-.19-.15-.34-.34-.34h.03Z"
              />
              <path
                className={styles.cls22}
                d="m287.16,91.28c0,.2.16.35.35.35h9.63c.2,0,.35-.16.35-.35v-.1c0-.2-.16-.35-.35-.35h-9.26c.3-4.9,4.33-8.72,9.26-8.72.2,0,.35-.16.35-.35s-.16-.35-.35-.35c-5.37,0-9.76,4.21-9.99,9.57,0,.04,0,.08.02.12,0,.03-.02.06-.02.09v.1h0Z"
              />
              <path
                className={styles.cls22}
                d="m434.02,111.7v-.18s0-.05-.01-.07c-.23-3.95-2.96-7.17-6.61-8.15,3.7-1,6.46-4.28,6.63-8.3,0-.03-.02-.04-.03-.07.02-.04.03-.08.03-.13v-.18c0-.18-.14-.32-.32-.32h-8.5c-.18,0-.32.14-.32.32v.18c0,.18.14.32.32.32h8.17c-.26,4.42-3.89,7.85-8.33,7.85-.18,0-.32.14-.32.32s.14.32.32.32c4.35,0,7.91,3.3,8.31,7.58h-8.15c-.18,0-.32.14-.32.32v.18c0,.18.14.32.32.32h8.5c.18,0,.32-.14.32-.32h-.01Z"
              />
              <path
                className={styles.cls22}
                d="m431.06,276.65c-.2,0-.35-.16-.35-.35v-9.63c0-.2.16-.35.35-.35h.1c.2,0,.35.16.35.35v9.26c4.9-.3,8.72-4.33,8.72-9.26,0-.2.16-.35.35-.35s.35.16.35.35c0,5.37-4.21,9.76-9.57,9.99-.04,0-.08,0-.12-.02-.03,0-.06.02-.09.02h-.1.01Z"
              />
              <path
                className={styles.cls22}
                d="m835.93,93.23h-.2s-.05,0-.07.01c-4.26.25-7.73,3.19-8.79,7.13-1.08-3.99-4.62-6.96-8.95-7.15-.03,0-.05.02-.08.03-.04-.02-.09-.03-.14-.03h-.2c-.19,0-.34.15-.34.34v9.17c0,.19.15.34.34.34h.2c.19,0,.34-.15.34-.34v-8.81c4.76.29,8.47,4.2,8.47,8.99,0,.19.15.34.34.34s.34-.15.34-.34c0-4.69,3.56-8.53,8.17-8.96v8.79c0,.19.15.34.34.34h.2c.19,0,.34-.15.34-.34v-9.17c0-.19-.15-.34-.34-.34h.03Z"
              />
            </g>
            <g id="STAIRS">
              <g>
                <g id="LINE-10326">
                  <line className={styles.cls21} x1="263.29" y1="49.08" x2="232.44" y2="49.08" />
                </g>
                <g id="LINE-10327">
                  <line className={styles.cls21} x1="260.29" y1="49.08" x2="260.29" y2="39.02" />
                </g>
                <g id="LINE-10328">
                  <line className={styles.cls21} x1="257.29" y1="49.08" x2="257.29" y2="39.02" />
                </g>
                <g id="LINE-10329">
                  <line className={styles.cls21} x1="254.29" y1="49.08" x2="254.29" y2="39.02" />
                </g>
                <g id="LINE-10330">
                  <line className={styles.cls21} x1="251.29" y1="49.08" x2="251.29" y2="39.02" />
                </g>
                <g id="LINE-10331">
                  <line className={styles.cls21} x1="248.29" y1="49.08" x2="248.29" y2="39.02" />
                </g>
                <g id="LINE-10332">
                  <line className={styles.cls21} x1="245.28" y1="49.08" x2="245.28" y2="39.02" />
                </g>
                <g id="LINE-10333">
                  <line className={styles.cls21} x1="242.28" y1="49.08" x2="242.28" y2="39.02" />
                </g>
                <g id="LINE-10334">
                  <line className={styles.cls21} x1="239.28" y1="49.08" x2="239.28" y2="39.02" />
                </g>
                <g id="LINE-10335">
                  <line className={styles.cls21} x1="236.28" y1="49.08" x2="236.28" y2="39.02" />
                </g>
                <g id="LINE-10337">
                  <line className={styles.cls21} x1="231.64" y1="49.25" x2="252.4" y2="61.36" />
                </g>
                <g id="LINE-10343">
                  <line className={styles.cls21} x1="232.73" y1="62.13" x2="237.74" y2="53.09" />
                </g>
                <g id="LINE-10344">
                  <line className={styles.cls21} x1="235.36" y1="63.58" x2="240.51" y2="54.66" />
                </g>
                <g id="LINE-10345">
                  <line className={styles.cls21} x1="237.95" y1="65.09" x2="243.25" y2="56.29" />
                </g>
                <g id="LINE-10346">
                  <line className={styles.cls21} x1="240.52" y1="66.65" x2="245.96" y2="57.98" />
                </g>
                <g id="LINE-10347">
                  <line className={styles.cls21} x1="251.95" y1="61.36" x2="242.41" y2="66.77" />
                </g>
                <g id="LINE-10348">
                  <line className={styles.cls21} x1="244.86" y1="65.37" x2="248.63" y2="59.72" />
                </g>
                <line className={styles.cls21} x1="231.49" y1="49.08" x2="263.29" y2="49.08" />
                <polygon className={styles.cls16} points="240.05 64.81 244.12 58.3 244.26 62.91 240.05 64.81" />
                <polyline className={styles.cls9} points="244.26 62.91 225.19 51.63 228.3 43.68 263.45 43.68" />
              </g>
              <g>
                <g>
                  <polygon
                    className={styles.cls20}
                    points="768.82 64.47 768.82 76.4 812.8 76.4 812.8 42.23 770.52 42.23 770.52 52.93 801.49 52.93 801.49 64.47 768.82 64.47"
                  />
                  <line className={styles.cls20} x1="771.82" y1="64.47" x2="771.82" y2="76.4" />
                  <line className={styles.cls20} x1="795.86" y1="64.47" x2="795.86" y2="76.4" />
                  <line className={styles.cls20} x1="774.83" y1="64.47" x2="774.83" y2="76.4" />
                  <line className={styles.cls20} x1="777.83" y1="64.47" x2="777.83" y2="76.4" />
                  <line className={styles.cls20} x1="786.85" y1="64.47" x2="786.85" y2="76.4" />
                  <line className={styles.cls20} x1="780.84" y1="64.47" x2="780.84" y2="76.4" />
                  <line className={styles.cls20} x1="783.84" y1="64.47" x2="783.84" y2="76.4" />
                  <line className={styles.cls20} x1="789.85" y1="64.47" x2="789.85" y2="76.4" />
                  <line className={styles.cls20} x1="792.85" y1="64.47" x2="792.85" y2="76.4" />
                  <line className={styles.cls20} x1="798.86" y1="64.47" x2="798.86" y2="76.4" />
                  <line className={styles.cls20} x1="801.87" y1="64.47" x2="801.87" y2="76.4" />
                  <line className={styles.cls20} x1="773.52" y1="42.23" x2="773.52" y2="52.93" />
                  <line className={styles.cls20} x1="797.56" y1="42.23" x2="797.56" y2="52.93" />
                  <line className={styles.cls20} x1="776.53" y1="42.23" x2="776.53" y2="52.93" />
                  <line className={styles.cls20} x1="779.53" y1="42.23" x2="779.53" y2="52.93" />
                  <line className={styles.cls20} x1="788.54" y1="42.23" x2="788.54" y2="52.93" />
                  <line className={styles.cls20} x1="782.53" y1="42.23" x2="782.53" y2="52.93" />
                  <line className={styles.cls20} x1="785.54" y1="42.23" x2="785.54" y2="52.93" />
                  <line className={styles.cls20} x1="791.55" y1="42.23" x2="791.55" y2="52.93" />
                  <line className={styles.cls20} x1="794.55" y1="42.23" x2="794.55" y2="52.93" />
                  <line className={styles.cls20} x1="800.56" y1="42.23" x2="800.56" y2="52.93" />
                  <line className={styles.cls20} x1="812.98" y1="64.84" x2="801.49" y2="64.84" />
                  <line className={styles.cls20} x1="812.98" y1="61.86" x2="801.49" y2="61.86" />
                  <line className={styles.cls20} x1="812.98" y1="58.89" x2="801.49" y2="58.89" />
                  <line className={styles.cls20} x1="812.98" y1="55.91" x2="801.49" y2="55.91" />
                  <line className={styles.cls20} x1="801.49" y1="52.93" x2="812.98" y2="52.93" />
                </g>
                <g>
                  <polygon className={styles.cls16} points="772.47 43.75 772.47 51.42 769.91 47.58 772.47 43.75" />
                  <polyline className={styles.cls9} points="767.56 70.43 807.24 70.43 807.24 47.58 772.53 47.58" />
                </g>
              </g>
              <g>
                <line className={styles.cls8} x1="565.92" y1="325.77" x2="565.92" y2="313.76" />
                <line className={styles.cls8} x1="568.92" y1="325.77" x2="568.92" y2="313.76" />
                <line className={styles.cls8} x1="571.93" y1="325.77" x2="571.93" y2="313.76" />
                <line className={styles.cls8} x1="574.93" y1="325.77" x2="574.93" y2="313.76" />
                <line className={styles.cls8} x1="577.93" y1="325.77" x2="577.93" y2="313.76" />
                <line className={styles.cls8} x1="580.93" y1="325.77" x2="580.93" y2="313.76" />
                <line className={styles.cls8} x1="583.93" y1="325.77" x2="583.93" y2="313.76" />
                <line className={styles.cls8} x1="586.93" y1="325.77" x2="586.93" y2="313.76" />
                <line className={styles.cls8} x1="589.93" y1="325.77" x2="589.93" y2="313.76" />
                <line className={styles.cls8} x1="592.93" y1="325.77" x2="592.93" y2="313.76" />
                <line className={styles.cls8} x1="595.93" y1="325.77" x2="595.93" y2="313.76" />
                <line className={styles.cls8} x1="598.94" y1="325.77" x2="598.94" y2="313.76" />
                <line className={styles.cls8} x1="601.94" y1="325.77" x2="601.94" y2="313.76" />
                <line className={styles.cls8} x1="604.94" y1="325.77" x2="604.94" y2="313.76" />
                <line className={styles.cls8} x1="607.94" y1="325.77" x2="607.94" y2="313.76" />
                <line className={styles.cls8} x1="610.94" y1="325.77" x2="610.94" y2="313.76" />
                <line className={styles.cls8} x1="613.94" y1="325.77" x2="613.94" y2="313.76" />
                <line className={styles.cls8} x1="616.94" y1="325.77" x2="616.94" y2="313.76" />
                <line className={styles.cls8} x1="619.94" y1="325.77" x2="619.94" y2="313.76" />
                <line className={styles.cls8} x1="622.94" y1="325.77" x2="622.94" y2="313.76" />
                <line className={styles.cls8} x1="625.95" y1="325.77" x2="625.95" y2="313.76" />
                <line className={styles.cls8} x1="628.95" y1="325.77" x2="628.95" y2="313.76" />
                <line className={styles.cls8} x1="562.92" y1="325.77" x2="562.92" y2="313.76" />
                <line className={styles.cls8} x1="628.97" y1="325.77" x2="560.92" y2="325.77" />
                <line className={styles.cls8} x1="628.97" y1="313.76" x2="560.92" y2="313.76" />
                <polygon className={styles.cls16} points="564.9 315.93 564.9 323.6 562.34 319.77 564.9 315.93" />
                <line className={styles.cls9} x1="564.97" y1="319.77" x2="627.16" y2="319.77" />
              </g>
              <g>
                <line className={styles.cls8} x1="431.99" y1="336.56" x2="419.98" y2="343.37" />
                <line className={styles.cls8} x1="422.8" y1="341.71" x2="419.98" y2="341.71" />
                <line className={styles.cls8} x1="428.08" y1="338.71" x2="419.98" y2="338.71" />
                <line className={styles.cls8} x1="431.99" y1="335.71" x2="419.98" y2="335.71" />
                <line className={styles.cls8} x1="431.99" y1="332.71" x2="419.98" y2="332.71" />
                <line className={styles.cls8} x1="431.99" y1="329.71" x2="419.98" y2="329.71" />
                <line className={styles.cls8} x1="431.99" y1="326.7" x2="419.98" y2="326.7" />
                <line className={styles.cls8} x1="431.99" y1="323.7" x2="419.98" y2="323.7" />
                <line className={styles.cls8} x1="431.99" y1="320.7" x2="419.98" y2="320.7" />
                <line className={styles.cls8} x1="431.99" y1="317.7" x2="419.98" y2="317.7" />
                <line className={styles.cls8} x1="431.99" y1="314.7" x2="419.98" y2="314.7" />
                <line className={styles.cls8} x1="431.99" y1="311.7" x2="419.98" y2="311.7" />
                <line className={styles.cls8} x1="431.99" y1="308.7" x2="419.98" y2="308.7" />
                <line className={styles.cls8} x1="431.99" y1="305.7" x2="419.98" y2="305.7" />
                <line className={styles.cls8} x1="431.99" y1="302.7" x2="419.98" y2="302.7" />
                <line className={styles.cls8} x1="431.99" y1="299.69" x2="419.98" y2="299.69" />
                <line className={styles.cls8} x1="431.99" y1="296.69" x2="419.98" y2="296.69" />
                <line className={styles.cls8} x1="431.99" y1="296.67" x2="431.99" y2="336.54" />
                <line className={styles.cls8} x1="419.98" y1="296.67" x2="419.98" y2="343.26" />
                <polygon className={styles.cls16} points="422.15 333.74 429.82 333.74 425.98 336.3 422.15 333.74" />
                <line className={styles.cls9} x1="425.98" y1="333.68" x2="425.98" y2="298.49" />
              </g>
            </g>
            <g id="Windows-2" data-name="Windows">
              <rect
                className={styles.cls19}
                x="473.9"
                y="106.24"
                width="2.91"
                height="15.27"
                transform="translate(361.47 589.23) rotate(-90)"
              />
            </g>
            <g id="Windows-3" data-name="Windows">
              <rect className={styles.cls19} x="519.7" y="99.3" width="2.91" height="10.88" />
            </g>
            <g id="Windows-4" data-name="Windows">
              <rect
                className={styles.cls19}
                x="368.69"
                y="85.22"
                width="2.59"
                height="15.84"
                transform="translate(276.85 463.12) rotate(-90)"
              />
            </g>
            <g id="Windows-5" data-name="Windows">
              <rect
                className={styles.cls19}
                x="418.39"
                y="84.66"
                width="10.26"
                height="1.4"
                transform="translate(338.16 508.88) rotate(-90)"
              />
            </g>
            <g id="stages">
              <g id="Strip">
                <g>
                  <path className={styles.cls18} d="m563.13,142.62v100h100v-100h-100Z" />
                  <rect className={styles.cls18} x="565.63" y="145.12" width="95" height="95" />
                  <polygon
                    className={styles.cls18}
                    points="646.77 147.62 579.49 147.62 568.13 158.98 568.13 226.26 579.49 237.62 646.77 237.62 658.13 226.26 658.13 158.98 646.77 147.62"
                  />
                  <rect className={styles.cls18} x="573.83" y="153.32" width="78.6" height="78.6" />
                  <rect className={styles.cls18} x="577.13" y="156.62" width="72" height="72" />
                  <circle className={styles.cls18} cx="613.13" cy="192.62" r="45" />
                  <g>
                    <line className={styles.cls18} x1="613.13" y1="191.01" x2="613.13" y2="194.23" />
                    <line className={styles.cls18} x1="611.52" y1="192.62" x2="614.74" y2="192.62" />
                  </g>
                </g>
              </g>
              <g id="Receiving">
                <g>
                  <polygon
                    className={styles.cls18}
                    points="511.77 147.62 474.49 147.62 448.13 173.98 448.13 211.26 474.49 237.62 511.77 237.62 538.13 211.26 538.13 173.98 511.77 147.62"
                  />
                  <circle className={styles.cls18} cx="493.13" cy="192.62" r="45" />
                  <g>
                    <line className={styles.cls18} x1="493.13" y1="191.01" x2="493.13" y2="194.23" />
                    <line className={styles.cls18} x1="491.52" y1="192.62" x2="494.74" y2="192.62" />
                  </g>
                </g>
              </g>
              <g id="Coating">
                <g>
                  <polygon
                    className={styles.cls18}
                    points="753.93 147.62 686.66 147.62 675.29 158.98 675.29 226.26 686.66 237.62 753.93 237.62 765.29 226.26 765.29 158.98 753.93 147.62"
                  />
                  <polygon
                    className={styles.cls18}
                    points="692.37 242.96 699.64 224.97 697.78 224.22 691.41 240 681.46 209.38 679.56 210 690.53 243.78 691.8 243.37 692.14 243.52 692.26 243.22 692.44 243.17 692.37 242.96"
                  />
                  <polygon
                    className={styles.cls18}
                    points="748.22 242.96 740.95 224.97 742.81 224.22 749.18 240 759.13 209.38 761.03 210 750.05 243.78 748.79 243.37 748.45 243.52 748.33 243.22 748.15 243.17 748.22 242.96"
                  />
                  <polygon
                    className={styles.cls18}
                    points="692.37 142.28 699.64 160.27 697.78 161.02 691.41 145.24 681.46 175.86 679.56 175.24 690.53 141.45 691.8 141.86 692.14 141.72 692.26 142.02 692.44 142.07 692.37 142.28"
                  />
                  <polygon
                    className={styles.cls18}
                    points="748.22 142.28 740.95 160.27 742.81 161.02 749.18 145.24 759.13 175.86 761.03 175.24 750.05 141.45 748.79 141.86 748.45 141.72 748.33 142.02 748.15 142.07 748.22 142.28"
                  />
                  <rect className={styles.cls18} x="686.44" y="239.48" width="10" height="7" />
                  <rect className={styles.cls18} x="744.15" y="239.48" width="10" height="7" />
                  <rect className={styles.cls18} x="686.44" y="138.76" width="10" height="7" />
                  <rect className={styles.cls18} x="744.15" y="138.76" width="10" height="7" />
                  <circle className={styles.cls18} cx="720.29" cy="192.62" r="45" />
                  <g>
                    <line className={styles.cls18} x1="720.29" y1="191.01" x2="720.29" y2="194.23" />
                    <line className={styles.cls18} x1="718.68" y1="192.62" x2="721.9" y2="192.62" />
                  </g>
                </g>
              </g>
              <g id="Storage">
                <g>
                  <circle className={styles.cls18} cx="815.6" cy="192.62" r="45" />
                  <g>
                    <line className={styles.cls18} x1="815.6" y1="191.01" x2="815.6" y2="194.23" />
                    <line className={styles.cls18} x1="813.99" y1="192.62" x2="817.21" y2="192.62" />
                  </g>
                </g>
              </g>
            </g>
            <g id="Rails" className={styles.cls42}>
              <line className={styles.cls13} x1="426.96" y1="147.62" x2="754.68" y2="147.62" />
              <line className={styles.cls13} x1="426.96" y1="237.62" x2="754.68" y2="237.62" />
              <line className={styles.cls13} x1="591.96" y1="162.62" x2="838.68" y2="162.62" />
              <line className={styles.cls13} x1="591.96" y1="222.62" x2="838.68" y2="222.62" />
            </g>
            <polygon
              className={styles.cls7}
              points="801.07 102.56 801.07 111.98 767.55 111.98 767.55 102.56 744.49 102.56 744.49 115.43 430.12 115.43 430.12 126.14 430.12 131.75 430.12 266.46 441.93 266.46 441.93 131.75 847.77 131.75 847.77 123.21 847.77 115.43 847.77 102.56 801.07 102.56"
            />
            <g id="Machines">
              <rect className={styles.cls14} x="817.89" y="52.31" width="5.98" height="25.21" />
              <polygon
                className={styles.cls14}
                points="849.68 31.19 818.27 31.19 818.27 38.86 857.77 38.86 857.77 93.58 847.91 93.58 847.91 101.26 865.31 101.26 865.31 95.26 865.31 93.58 865.31 38.86 849.68 31.19"
              />
              <rect className={styles.cls14} x="280.55" y="43.07" width="10.86" height="13.56" />
              <rect className={styles.cls14} x="298.13" y="57.88" width="7.74" height="13.65" />
              <rect className={styles.cls14} x="298.13" y="44.09" width="7.74" height="13.79" />
              <rect className={styles.cls14} x="318.65" y="104.07" width="12.01" height="6" />
              <rect className={styles.cls14} x="318.65" y="97.94" width="12.01" height="6.13" />
              <rect className={styles.cls14} x="491.67" y="33.24" width="24.24" height="9.93" />
              <path
                className={styles.cls14}
                d="m632.62,67.93h-6.19v-4.19l-2.88-2v4.02h-12.6v4.45h-11.08v-.51c0-.19-.16-.35-.35-.35h-.74v.86h-4.59v-.76h-22.26v16.6h22.26v-.76h4.59v.86h.74c.19,0,.35-.16.35-.35v-.51h11.08v4.45h12.6v4.02l2.88-2v-4.19h6.19v-19.66Z"
              />
              <rect id="elev" className={styles.cls14} x="769.73" y="80.72" width="21.7" height="14.86" />
            </g>
            <g id="SolidWall">
              <rect className={styles.cls17} x="864.14" y="181.07" width="3" height="3" />
              <rect className={styles.cls17} x="741.95" y="98.58" width="8.16" height="8.37" />
              <rect className={styles.cls9} x="669.73" y="336.63" width="39.93" height="87.85" />
              <rect className={styles.cls9} x="667.65" y="333.21" width="44.08" height="93.26" />
              <g>
                <circle className={styles.cls9} cx="689.69" cy="358.42" r="11.16" />
                <circle className={styles.cls9} cx="689.69" cy="402.69" r="11.16" />
              </g>
              <rect className={styles.cls17} x="767.91" y="101.36" width="33.77" height="2.53" />
              <polygon
                className={styles.cls17}
                points="767.91 38.75 767.91 41.23 813.17 41.23 813.17 46.75 814.66 46.75 814.66 76.37 767.91 76.37 767.91 78.79 814.66 78.79 814.66 101.54 810.8 101.54 810.8 103.89 816.75 103.89 816.75 46.75 818.24 46.75 818.24 38.75 767.91 38.75"
              />
              <rect className={styles.cls17} x="864.19" y="38.75" width="2.95" height="5.6" />
              <rect className={styles.cls17} x="743.45" y="38.75" width="5.02" height="8.05" />
              <rect className={styles.cls17} x="864.14" y="101.27" width="3" height="3" />
              <rect className={styles.cls17} x="693.68" y="38.75" width="4.84" height="8.05" />
              <rect className={styles.cls17} x="643.82" y="38.75" width="4.79" height="8.05" />
              <rect className={styles.cls17} x="864.19" y="260.9" width="2.95" height="5.66" />
              <rect className={styles.cls17} x="693.45" y="258.23" width="5.07" height="8.33" />
              <rect className={styles.cls17} x="743.58" y="258.23" width="5.07" height="8.33" />
              <rect className={styles.cls17} x="593.4" y="258.23" width="5.07" height="8.33" />
              <rect className={styles.cls17} x="643.53" y="258.23" width="5.07" height="8.33" />
              <rect className={styles.cls17} x="813.21" y="258.23" width="5.07" height="8.33" />
              <rect className={styles.cls17} x="593.56" y="38.75" width="4.79" height="8.05" />
              <rect className={styles.cls17} x="543.43" y="38.75" width="4.79" height="8.05" />
              <rect className={styles.cls17} x="519.7" y="29.35" width="2.91" height="23.26" />
              <rect className={styles.cls17} x="519.7" y="86.56" width="2.91" height="12.74" />
              <polygon
                className={styles.cls17}
                points="482.98 115.33 482.98 112.43 519.7 112.43 519.7 110.19 522.61 110.19 522.61 115.33 482.98 115.33"
              />
              <rect className={styles.cls17} x="422.89" y="112.43" width="44.83" height="2.91" />
              <rect className={styles.cls17} x="294.94" y="91.71" width="14.65" height="2.91" />
              <polygon
                className={styles.cls17}
                points="429.59 269.22 283.73 269.22 283.73 266.66 426.84 266.66 426.84 255.77 429.59 255.77 429.59 269.22"
              />
              <polygon
                className={styles.cls17}
                points="560.15 281.57 558.66 281.57 558.66 268.66 543.31 268.66 543.31 258.23 548.38 258.23 548.38 267.17 560.15 267.17 560.15 281.57"
              />
              <path
                className={styles.cls17}
                d="m223.91,35.71h0s261.39,0,261.39,0v-8.49h2.28v19.22h-4.57v-7.82h-52.59v7.76h-4.67v-7.76h-128.81v19.9h-2v-19.9h-19.02v19.9h-2v-19.9h-48.11l-7.39,16.6c34.28,14.49,62.06,41.43,77.63,75.13h130.8v-1.13h2.74v13.16h-2.74v-9.48h-132.92c-15.55-34.53-44.11-61.98-79.42-76.05l9.41-21.14"
              />
              <polygon
                className={styles.cls17}
                points="416.52 377 416.52 270.19 419.26 270.19 419.26 374.26 431.99 374.26 431.99 377 416.52 377"
              />
            </g>
            <g id="Doors2">
              <line className={styles.cls24} x1="421.94" y1="51.56" x2="421.94" y2="79.33" />
              <rect className={styles.cls24} x="523.1" y="48.56" width=".42" height="38.44" />
              <rect
                className={styles.cls24}
                x="490.92"
                y="217.26"
                width="3.1"
                height="100.12"
                transform="translate(225.16 759.79) rotate(-90)"
              />
            </g>
          </g>
          <g id="text">
            <g id="t1">
              <g className={styles.cls48}>
                <text className={styles.cls23} transform="translate(681.5 79.96)">
                  <tspan className={styles.cls33} x="0" y="0">
                    T
                  </tspan>
                  <tspan x="3.11" y="0">
                    eles
                  </tspan>
                  <tspan className={styles.cls26} x="14.91" y="0">
                    c
                  </tspan>
                  <tspan className={styles.cls34} x="18.23" y="0">
                    ope
                  </tspan>
                  <tspan x="-1.62" y="7.2">
                    Utili
                  </tspan>
                  <tspan className={styles.cls1} x="10.41" y="7.2">
                    t
                  </tspan>
                  <tspan x="12.78" y="7.2">
                    y A
                  </tspan>
                  <tspan className={styles.cls55} x="21.91" y="7.2">
                    r
                  </tspan>
                  <tspan className={styles.cls43} x="24.24" y="7.2">
                    e
                  </tspan>
                  <tspan x="27.77" y="7.2">
                    a
                  </tspan>
                </text>
                <text className={styles.cls23} transform="translate(681.5 79.96)">
                  <tspan className={styles.cls33} x="0" y="0">
                    T
                  </tspan>
                  <tspan x="3.11" y="0">
                    eles
                  </tspan>
                  <tspan className={styles.cls26} x="14.91" y="0">
                    c
                  </tspan>
                  <tspan className={styles.cls34} x="18.23" y="0">
                    ope
                  </tspan>
                  <tspan x="-1.62" y="7.2">
                    Utili
                  </tspan>
                  <tspan className={styles.cls1} x="10.41" y="7.2">
                    t
                  </tspan>
                  <tspan x="12.78" y="7.2">
                    y A
                  </tspan>
                  <tspan className={styles.cls55} x="21.91" y="7.2">
                    r
                  </tspan>
                  <tspan className={styles.cls43} x="24.24" y="7.2">
                    e
                  </tspan>
                  <tspan x="27.77" y="7.2">
                    a
                  </tspan>
                </text>
              </g>
              <g className={styles.cls48}>
                <text className={styles.cls23} transform="translate(554.35 79.96)">
                  <tspan x="0" y="0">
                    St
                  </tspan>
                  <tspan className={styles.cls52} x="6.13" y="0">
                    a
                  </tspan>
                  <tspan className={styles.cls32} x="9.68" y="0">
                    gi
                  </tspan>
                  <tspan className={styles.cls52} x="15.41" y="0">
                    n
                  </tspan>
                  <tspan className={styles.cls32} x="19.48" y="0">
                    g &amp;{' '}
                  </tspan>
                  <tspan className={styles.cls29} x="30.76" y="0">
                    T
                  </tspan>
                  <tspan className={styles.cls34} x="33.87" y="0">
                    est
                  </tspan>
                  <tspan x="14.58" y="7.2">
                    A
                  </tspan>
                  <tspan className={styles.cls55} x="18.88" y="7.2">
                    r
                  </tspan>
                  <tspan className={styles.cls28} x="21.21" y="7.2">
                    e
                  </tspan>
                  <tspan x="24.74" y="7.2">
                    a
                  </tspan>
                </text>
                <text className={styles.cls23} transform="translate(554.35 79.96)">
                  <tspan x="0" y="0">
                    St
                  </tspan>
                  <tspan className={styles.cls52} x="6.13" y="0">
                    a
                  </tspan>
                  <tspan className={styles.cls32} x="9.68" y="0">
                    gi
                  </tspan>
                  <tspan className={styles.cls52} x="15.41" y="0">
                    n
                  </tspan>
                  <tspan className={styles.cls32} x="19.48" y="0">
                    g &amp;{' '}
                  </tspan>
                  <tspan className={styles.cls29} x="30.76" y="0">
                    T
                  </tspan>
                  <tspan className={styles.cls34} x="33.87" y="0">
                    est
                  </tspan>
                  <tspan x="14.58" y="7.2">
                    A
                  </tspan>
                  <tspan className={styles.cls55} x="18.88" y="7.2">
                    r
                  </tspan>
                  <tspan className={styles.cls28} x="21.21" y="7.2">
                    e
                  </tspan>
                  <tspan x="24.74" y="7.2">
                    a
                  </tspan>
                </text>
              </g>
              <g className={styles.cls48}>
                <text className={styles.cls23} transform="translate(466.54 75.87)">
                  <tspan x="0" y="0">
                    Whi
                  </tspan>
                  <tspan className={styles.cls49} x="12.34" y="0">
                    t
                  </tspan>
                  <tspan x="14.66" y="0">
                    e
                  </tspan>
                  <tspan x="2.29" y="7.2">
                    A
                  </tspan>
                  <tspan className={styles.cls55} x="6.59" y="7.2">
                    r
                  </tspan>
                  <tspan className={styles.cls28} x="8.92" y="7.2">
                    e
                  </tspan>
                  <tspan x="12.46" y="7.2">
                    a
                  </tspan>
                </text>
                <text className={styles.cls23} transform="translate(466.54 75.87)">
                  <tspan x="0" y="0">
                    Whi
                  </tspan>
                  <tspan className={styles.cls49} x="12.34" y="0">
                    t
                  </tspan>
                  <tspan x="14.66" y="0">
                    e
                  </tspan>
                  <tspan x="2.29" y="7.2">
                    A
                  </tspan>
                  <tspan className={styles.cls55} x="6.59" y="7.2">
                    r
                  </tspan>
                  <tspan className={styles.cls28} x="8.92" y="7.2">
                    e
                  </tspan>
                  <tspan x="12.46" y="7.2">
                    a
                  </tspan>
                </text>
              </g>
              <g className={styles.cls48}>
                <text className={styles.cls23} transform="translate(317.75 105.91)">
                  <tspan x="0" y="0">
                    An
                  </tspan>
                  <tspan className={styles.cls2} x="8.36" y="0">
                    t
                  </tspan>
                  <tspan className={styles.cls34} x="10.69" y="0">
                    e Room
                  </tspan>
                </text>
                <text className={styles.cls23} transform="translate(317.75 105.91)">
                  <tspan x="0" y="0">
                    An
                  </tspan>
                  <tspan className={styles.cls2} x="8.36" y="0">
                    t
                  </tspan>
                  <tspan className={styles.cls34} x="10.69" y="0">
                    e Room
                  </tspan>
                </text>
              </g>
              <g className={styles.cls48}>
                <text className={styles.cls23} transform="translate(334.31 69.01)">
                  <tspan x="0" y="0">
                    Cl
                  </tspan>
                  <tspan className={styles.cls28} x="5.93" y="0">
                    e
                  </tspan>
                  <tspan x="9.46" y="0">
                    anRoom
                  </tspan>
                </text>
                <text className={styles.cls23} transform="translate(334.31 69.01)">
                  <tspan x="0" y="0">
                    Cl
                  </tspan>
                  <tspan className={styles.cls28} x="5.93" y="0">
                    e
                  </tspan>
                  <tspan x="9.46" y="0">
                    anRoom
                  </tspan>
                </text>
              </g>
              <g className={styles.cls48}>
                <text className={styles.cls23} transform="translate(366.07 197.01)">
                  <tspan x="0" y="0">
                    8
                  </tspan>
                  <tspan className={styles.cls46} x="3.83" y="0">
                    0
                  </tspan>
                  <tspan className={styles.cls53} x="7.85" y="0">
                    -
                  </tspan>
                  <tspan className={styles.cls33} x="9.95" y="0">
                    T
                  </tspan>
                  <tspan x="13.06" y="0">
                    on
                  </tspan>
                  <tspan x="-8.33" y="7.2">
                    Plat
                  </tspan>
                  <tspan className={styles.cls31} x="3.56" y="7.2">
                    f
                  </tspan>
                  <tspan className={styles.cls34} x="5.54" y="7.2">
                    o
                  </tspan>
                  <tspan className={styles.cls39} x="9.31" y="7.2">
                    r
                  </tspan>
                  <tspan className={styles.cls32} x="11.66" y="7.2">
                    m Lift
                  </tspan>
                </text>
                <text className={styles.cls23} transform="translate(366.07 197.01)">
                  <tspan x="0" y="0">
                    8
                  </tspan>
                  <tspan className={styles.cls46} x="3.83" y="0">
                    0
                  </tspan>
                  <tspan className={styles.cls53} x="7.85" y="0">
                    -
                  </tspan>
                  <tspan className={styles.cls33} x="9.95" y="0">
                    T
                  </tspan>
                  <tspan x="13.06" y="0">
                    on
                  </tspan>
                  <tspan x="-8.33" y="7.2">
                    Plat
                  </tspan>
                  <tspan className={styles.cls31} x="3.56" y="7.2">
                    f
                  </tspan>
                  <tspan className={styles.cls34} x="5.54" y="7.2">
                    o
                  </tspan>
                  <tspan className={styles.cls39} x="9.31" y="7.2">
                    r
                  </tspan>
                  <tspan className={styles.cls32} x="11.66" y="7.2">
                    m Lift
                  </tspan>
                </text>
              </g>
              <g className={styles.cls48}>
                <text className={styles.cls23} transform="translate(800.95 202.05)">
                  <tspan x="0" y="0">
                    M2{' '}
                  </tspan>
                  <tspan className={styles.cls33} x="10.71" y="0">
                    V
                  </tspan>
                  <tspan x="14.57" y="0">
                    essel
                  </tspan>
                  <tspan x="2.94" y="7.2">
                    S
                  </tspan>
                  <tspan className={styles.cls49} x="6.63" y="7.2">
                    t
                  </tspan>
                  <tspan x="8.95" y="7.2">
                    o
                  </tspan>
                  <tspan className={styles.cls26} x="12.71" y="7.2">
                    r
                  </tspan>
                  <tspan className={styles.cls52} x="15.07" y="7.2">
                    a
                  </tspan>
                  <tspan className={styles.cls32} x="18.62" y="7.2">
                    ge
                  </tspan>
                </text>
                <text className={styles.cls23} transform="translate(800.95 202.05)">
                  <tspan x="0" y="0">
                    M2{' '}
                  </tspan>
                  <tspan className={styles.cls33} x="10.71" y="0">
                    V
                  </tspan>
                  <tspan x="14.57" y="0">
                    essel
                  </tspan>
                  <tspan x="2.94" y="7.2">
                    S
                  </tspan>
                  <tspan className={styles.cls49} x="6.63" y="7.2">
                    t
                  </tspan>
                  <tspan x="8.95" y="7.2">
                    o
                  </tspan>
                  <tspan className={styles.cls26} x="12.71" y="7.2">
                    r
                  </tspan>
                  <tspan className={styles.cls52} x="15.07" y="7.2">
                    a
                  </tspan>
                  <tspan className={styles.cls32} x="18.62" y="7.2">
                    ge
                  </tspan>
                </text>
              </g>
              <g className={styles.cls48}>
                <text className={styles.cls23} transform="translate(711.2 202.05)">
                  <tspan x="0" y="0">
                    Mi
                  </tspan>
                  <tspan className={styles.cls39} x="7.34" y="0">
                    r
                  </tspan>
                  <tspan className={styles.cls55} x="9.7" y="0">
                    r
                  </tspan>
                  <tspan x="12.03" y="0">
                    or
                  </tspan>
                  <tspan className={styles.cls3} x="-2.75" y="7.2">
                    C
                  </tspan>
                  <tspan className={styles.cls30} x="1.42" y="7.2">
                    o
                  </tspan>
                  <tspan x="5.17" y="7.2">
                    ati
                  </tspan>
                  <tspan className={styles.cls36} x="12.76" y="7.2">
                    n
                  </tspan>
                  <tspan x="16.83" y="7.2">
                    g
                  </tspan>
                </text>
                <text className={styles.cls23} transform="translate(711.2 202.05)">
                  <tspan x="0" y="0">
                    Mi
                  </tspan>
                  <tspan className={styles.cls39} x="7.34" y="0">
                    r
                  </tspan>
                  <tspan className={styles.cls55} x="9.7" y="0">
                    r
                  </tspan>
                  <tspan x="12.03" y="0">
                    or
                  </tspan>
                  <tspan className={styles.cls3} x="-2.75" y="7.2">
                    C
                  </tspan>
                  <tspan className={styles.cls30} x="1.42" y="7.2">
                    o
                  </tspan>
                  <tspan x="5.17" y="7.2">
                    ati
                  </tspan>
                  <tspan className={styles.cls36} x="12.76" y="7.2">
                    n
                  </tspan>
                  <tspan x="16.83" y="7.2">
                    g
                  </tspan>
                </text>
              </g>
              <g className={styles.cls48}>
                <text className={styles.cls23} transform="translate(832.4 65.87)">
                  <tspan x="0" y="0">
                    Offi
                  </tspan>
                  <tspan className={styles.cls26} x="11.2" y="0">
                    c
                  </tspan>
                  <tspan className={styles.cls34} x="14.52" y="0">
                    e
                  </tspan>
                  <tspan className={styles.cls3} x="-2.78" y="7.2">
                    C
                  </tspan>
                  <tspan className={styles.cls30} x="1.4" y="7.2">
                    o
                  </tspan>
                  <tspan x="5.14" y="7.2">
                    ati
                  </tspan>
                  <tspan className={styles.cls36} x="12.73" y="7.2">
                    n
                  </tspan>
                  <tspan x="16.81" y="7.2">
                    g
                  </tspan>
                  <tspan className={styles.cls3} x="-2" y="14.4">
                    C
                  </tspan>
                  <tspan x="2.18" y="14.4">
                    ont
                  </tspan>
                  <tspan className={styles.cls54} x="12.44" y="14.4">
                    r
                  </tspan>
                  <tspan x="14.77" y="14.4">
                    ol
                  </tspan>
                </text>
                <text className={styles.cls23} transform="translate(832.4 65.87)">
                  <tspan x="0" y="0">
                    Offi
                  </tspan>
                  <tspan className={styles.cls26} x="11.2" y="0">
                    c
                  </tspan>
                  <tspan className={styles.cls34} x="14.52" y="0">
                    e
                  </tspan>
                  <tspan className={styles.cls3} x="-2.78" y="7.2">
                    C
                  </tspan>
                  <tspan className={styles.cls30} x="1.4" y="7.2">
                    o
                  </tspan>
                  <tspan x="5.14" y="7.2">
                    ati
                  </tspan>
                  <tspan className={styles.cls36} x="12.73" y="7.2">
                    n
                  </tspan>
                  <tspan x="16.81" y="7.2">
                    g
                  </tspan>
                  <tspan className={styles.cls3} x="-2" y="14.4">
                    C
                  </tspan>
                  <tspan x="2.18" y="14.4">
                    ont
                  </tspan>
                  <tspan className={styles.cls54} x="12.44" y="14.4">
                    r
                  </tspan>
                  <tspan x="14.77" y="14.4">
                    ol
                  </tspan>
                </text>
              </g>
              <g className={styles.cls48}>
                <text className={styles.cls23} transform="translate(596.67 202.05)">
                  <tspan className={styles.cls33} x="0" y="0">
                    W
                  </tspan>
                  <tspan x="6.34" y="0">
                    ash
                  </tspan>
                  <tspan className={styles.cls4} x="16.87" y="0">
                    /
                  </tspan>
                  <tspan x="18.76" y="0">
                    St
                  </tspan>
                  <tspan className={styles.cls39} x="24.89" y="0">
                    r
                  </tspan>
                  <tspan className={styles.cls32} x="27.25" y="0">
                    ip
                  </tspan>
                  <tspan x="9.61" y="7.2">
                    A
                  </tspan>
                  <tspan className={styles.cls55} x="13.91" y="7.2">
                    r
                  </tspan>
                  <tspan className={styles.cls28} x="16.24" y="7.2">
                    e
                  </tspan>
                  <tspan x="19.78" y="7.2">
                    a
                  </tspan>
                </text>
                <text className={styles.cls23} transform="translate(596.67 202.05)">
                  <tspan className={styles.cls33} x="0" y="0">
                    W
                  </tspan>
                  <tspan x="6.34" y="0">
                    ash
                  </tspan>
                  <tspan className={styles.cls4} x="16.87" y="0">
                    /
                  </tspan>
                  <tspan x="18.76" y="0">
                    St
                  </tspan>
                  <tspan className={styles.cls39} x="24.89" y="0">
                    r
                  </tspan>
                  <tspan className={styles.cls32} x="27.25" y="0">
                    ip
                  </tspan>
                  <tspan x="9.61" y="7.2">
                    A
                  </tspan>
                  <tspan className={styles.cls55} x="13.91" y="7.2">
                    r
                  </tspan>
                  <tspan className={styles.cls28} x="16.24" y="7.2">
                    e
                  </tspan>
                  <tspan x="19.78" y="7.2">
                    a
                  </tspan>
                </text>
              </g>
              <g className={styles.cls48}>
                <text className={styles.cls23} transform="translate(478.34 205.65)">
                  <tspan x="0" y="0">
                    Re
                  </tspan>
                  <tspan className={styles.cls26} x="7.96" y="0">
                    c
                  </tspan>
                  <tspan className={styles.cls34} x="11.29" y="0">
                    eivi
                  </tspan>
                  <tspan className={styles.cls36} x="21.39" y="0">
                    n
                  </tspan>
                  <tspan x="25.46" y="0">
                    g
                  </tspan>
                </text>
                <text className={styles.cls23} transform="translate(478.34 205.65)">
                  <tspan x="0" y="0">
                    Re
                  </tspan>
                  <tspan className={styles.cls26} x="7.96" y="0">
                    c
                  </tspan>
                  <tspan className={styles.cls34} x="11.29" y="0">
                    eivi
                  </tspan>
                  <tspan className={styles.cls36} x="21.39" y="0">
                    n
                  </tspan>
                  <tspan x="25.46" y="0">
                    g
                  </tspan>
                </text>
              </g>
              <g className={styles.cls48}>
                <text className={styles.cls23} transform="translate(657.85 296.73)">
                  <tspan x="0" y="0">
                    De
                  </tspan>
                  <tspan className={styles.cls45} x="8.58" y="0">
                    c
                  </tspan>
                  <tspan x="11.91" y="0">
                    k
                  </tspan>
                </text>
                <text className={styles.cls23} transform="translate(657.85 296.73)">
                  <tspan x="0" y="0">
                    De
                  </tspan>
                  <tspan className={styles.cls45} x="8.58" y="0">
                    c
                  </tspan>
                  <tspan x="11.91" y="0">
                    k
                  </tspan>
                </text>
              </g>
            </g>
            <g id="t2" className={styles.cls42}>
              <g className={styles.cls48}>
                <text className={styles.cls25} transform="translate(774.92 59.94)">
                  <tspan className={styles.cls29} x="0" y="0">
                    W
                  </tspan>
                  <tspan x="4.22" y="0">
                    et Shaft
                  </tspan>
                </text>
                <text className={styles.cls25} transform="translate(774.92 59.94)">
                  <tspan className={styles.cls29} x="0" y="0">
                    W
                  </tspan>
                  <tspan x="4.22" y="0">
                    et Shaft
                  </tspan>
                </text>
              </g>
              <g className={styles.cls48}>
                <text className={styles.cls25} transform="translate(802.06 92.28)">
                  <tspan x="0" y="0">
                    D
                  </tspan>
                  <tspan className={styles.cls38} x="3.3" y="0">
                    r
                  </tspan>
                  <tspan x="4.97" y="0">
                    y
                  </tspan>
                  <tspan x="-1.69" y="4.8">
                    Shaft
                  </tspan>
                </text>
                <text className={styles.cls25} transform="translate(802.06 92.28)">
                  <tspan x="0" y="0">
                    D
                  </tspan>
                  <tspan className={styles.cls38} x="3.3" y="0">
                    r
                  </tspan>
                  <tspan x="4.97" y="0">
                    y
                  </tspan>
                  <tspan x="-1.69" y="4.8">
                    Shaft
                  </tspan>
                </text>
              </g>
              <g className={styles.cls48}>
                <text className={styles.cls25} transform="translate(774.48 87.54)">
                  <tspan x="0" y="0">
                    El
                  </tspan>
                  <tspan className={styles.cls1} x="3.75" y="0">
                    e
                  </tspan>
                  <tspan className={styles.cls27} x="6.13" y="0">
                    v
                  </tspan>
                  <tspan className={styles.cls40} x="8.16" y="0">
                    . 1
                  </tspan>
                </text>
                <text className={styles.cls25} transform="translate(774.48 87.54)">
                  <tspan x="0" y="0">
                    El
                  </tspan>
                  <tspan className={styles.cls1} x="3.75" y="0">
                    e
                  </tspan>
                  <tspan className={styles.cls27} x="6.13" y="0">
                    v
                  </tspan>
                  <tspan className={styles.cls40} x="8.16" y="0">
                    . 1
                  </tspan>
                </text>
              </g>
              <g className={styles.cls48}>
                <text className={styles.cls25} transform="translate(630.36 125.28)">
                  <tspan className={styles.cls29} x="0" y="0">
                    W
                  </tspan>
                  <tspan x="4.22" y="0">
                    al
                  </tspan>
                  <tspan className={styles.cls35} x="7.66" y="0">
                    k
                  </tspan>
                  <tspan className={styles.cls37} x="9.96" y="0">
                    w
                  </tspan>
                  <tspan className={styles.cls1} x="13.41" y="0">
                    a
                  </tspan>
                  <tspan x="15.73" y="0">
                    y{' '}
                  </tspan>
                  <tspan className={styles.cls47} x="18.94" y="0">
                    Z
                  </tspan>
                  <tspan className={styles.cls44} x="21.49" y="0">
                    o
                  </tspan>
                  <tspan className={styles.cls52} x="24" y="0">
                    n
                  </tspan>
                  <tspan x="26.71" y="0">
                    e
                  </tspan>
                </text>
                <text className={styles.cls25} transform="translate(630.36 125.28)">
                  <tspan className={styles.cls29} x="0" y="0">
                    W
                  </tspan>
                  <tspan x="4.22" y="0">
                    al
                  </tspan>
                  <tspan className={styles.cls35} x="7.66" y="0">
                    k
                  </tspan>
                  <tspan className={styles.cls37} x="9.96" y="0">
                    w
                  </tspan>
                  <tspan className={styles.cls1} x="13.41" y="0">
                    a
                  </tspan>
                  <tspan x="15.73" y="0">
                    y{' '}
                  </tspan>
                  <tspan className={styles.cls47} x="18.94" y="0">
                    Z
                  </tspan>
                  <tspan className={styles.cls44} x="21.49" y="0">
                    o
                  </tspan>
                  <tspan className={styles.cls52} x="24" y="0">
                    n
                  </tspan>
                  <tspan x="26.71" y="0">
                    e
                  </tspan>
                </text>
              </g>
              <g className={styles.cls48}>
                <text className={styles.cls25} transform="translate(279.43 50.65)">
                  <tspan x="0" y="0">
                    El
                  </tspan>
                  <tspan className={styles.cls1} x="3.75" y="0">
                    e
                  </tspan>
                  <tspan className={styles.cls27} x="6.13" y="0">
                    v
                  </tspan>
                  <tspan className={styles.cls40} x="8.16" y="0">
                    . 2
                  </tspan>
                </text>
                <text className={styles.cls25} transform="translate(279.43 50.65)">
                  <tspan x="0" y="0">
                    El
                  </tspan>
                  <tspan className={styles.cls1} x="3.75" y="0">
                    e
                  </tspan>
                  <tspan className={styles.cls27} x="6.13" y="0">
                    v
                  </tspan>
                  <tspan className={styles.cls40} x="8.16" y="0">
                    . 2
                  </tspan>
                </text>
              </g>
              <g className={styles.cls48}>
                <text className={styles.cls25} transform="translate(326.56 124.01)">
                  <tspan x="0" y="0">
                    Hall
                  </tspan>
                  <tspan className={styles.cls51} x="7.76" y="0">
                    w
                  </tspan>
                  <tspan className={styles.cls50} x="11.22" y="0">
                    a
                  </tspan>
                  <tspan x="13.54" y="0">
                    y
                  </tspan>
                </text>
                <text className={styles.cls25} transform="translate(326.56 124.01)">
                  <tspan x="0" y="0">
                    Hall
                  </tspan>
                  <tspan className={styles.cls51} x="7.76" y="0">
                    w
                  </tspan>
                  <tspan className={styles.cls50} x="11.22" y="0">
                    a
                  </tspan>
                  <tspan x="13.54" y="0">
                    y
                  </tspan>
                </text>
              </g>
            </g>
          </g>
          <g id="Dome">
            <g>
              <line className={styles.cls10} x1="170.53" y1="192.71" x2="150.53" y2="192.71" />
              <line className={styles.cls10} x1="160.53" y1="202.71" x2="160.53" y2="182.71" />
            </g>
            <circle className={styles.cls5} cx="160.53" cy="192.71" r="144.2" />
          </g>
          <g id="Shell">
            <line className={styles.cls10} x1="575.66" y1="29.07" x2="575.66" y2="24.87" />
            <line className={styles.cls10} x1="635.68" y1="29.07" x2="635.68" y2="24.87" />
            <line className={styles.cls10} x1="605.67" y1="24.87" x2="605.67" y2="29.07" />
            <line className={styles.cls10} x1="545.65" y1="29.07" x2="545.65" y2="24.87" />
            <line className={styles.cls10} x1="695.7" y1="29.07" x2="695.7" y2="24.87" />
            <line className={styles.cls10} x1="665.69" y1="24.87" x2="665.69" y2="29.07" />
            <line className={styles.cls10} x1="755.73" y1="29.07" x2="755.73" y2="24.87" />
            <line className={styles.cls10} x1="725.72" y1="24.87" x2="725.72" y2="29.07" />
            <line className={styles.cls10} x1="815.75" y1="29.07" x2="815.75" y2="24.87" />
            <line className={styles.cls10} x1="785.74" y1="24.87" x2="785.74" y2="29.07" />
            <line className={styles.cls10} x1="575.66" y1="276.16" x2="575.66" y2="280.36" />
            <line className={styles.cls10} x1="635.68" y1="276.16" x2="635.68" y2="280.36" />
            <line className={styles.cls10} x1="605.67" y1="280.36" x2="605.67" y2="276.16" />
            <line className={styles.cls10} x1="695.7" y1="276.16" x2="695.7" y2="280.36" />
            <line className={styles.cls10} x1="665.69" y1="280.36" x2="665.69" y2="276.16" />
            <line className={styles.cls10} x1="755.73" y1="276.16" x2="755.73" y2="280.36" />
            <line className={styles.cls10} x1="725.72" y1="280.36" x2="725.72" y2="276.16" />
            <line className={styles.cls10} x1="815.75" y1="276.16" x2="815.75" y2="280.36" />
            <line className={styles.cls10} x1="785.74" y1="280.36" x2="785.74" y2="276.16" />
            <line className={styles.cls10} x1="870.52" y1="182.38" x2="867.52" y2="182.38" />
            <line className={styles.cls10} x1="870.52" y1="102.35" x2="867.52" y2="102.35" />
            <line className={styles.cls10} x1="870.52" y1="212.39" x2="867.52" y2="212.39" />
            <line className={styles.cls10} x1="870.52" y1="242.4" x2="867.52" y2="242.4" />
            <line className={styles.cls10} x1="860.07" y1="273.5" x2="859.45" y2="272.17" />
            <line className={styles.cls10} x1="870.52" y1="157.37" x2="867.52" y2="157.37" />
            <line className={styles.cls10} x1="870.52" y1="127.36" x2="867.52" y2="127.36" />
            <line className={styles.cls10} x1="870.52" y1="72.33" x2="867.52" y2="72.33" />
            <line className={styles.cls10} x1="870.52" y1="42.32" x2="867.52" y2="42.32" />
            <line className={styles.cls10} x1="859.62" y1="31.52" x2="859" y2="32.85" />
            <line className={styles.cls10} x1="575.66" y1="276.16" x2="575.66" y2="280.36" />
            <line className={styles.cls10} x1="635.68" y1="276.16" x2="635.68" y2="280.36" />
            <line className={styles.cls10} x1="605.67" y1="280.36" x2="605.67" y2="276.16" />
            <line className={styles.cls10} x1="695.7" y1="276.16" x2="695.7" y2="280.36" />
            <line className={styles.cls10} x1="665.69" y1="280.36" x2="665.69" y2="276.16" />
            <polyline className={styles.cls10} points="845.41 28.7 845.41 23.87 856.47 19.26" />
            <line className={styles.cls10} x1="871.69" y1="36.19" x2="882.79" y2="35.22" />
            <line className={styles.cls10} x1="871.52" y1="269.12" x2="882.79" y2="270.01" />
            <polyline className={styles.cls10} points="845.41 275.72 845.41 281.36 856.47 285.97" />
            <polyline
              className={styles.cls10}
              points="487.03 24.87 845.41 24.87 870.52 36.63 870.52 268.6 845.45 280.36 558.9 280.36 558.9 275.66 850.82 275.66 867.02 268.07 867.02 37.16 849.53 29.07 486.98 29.07 485.31 27.21 490.97 19.26 856.47 19.26 882.79 35.22 882.79 270.01 856.47 285.97 558.9 285.97 558.9 281.36 845.41 281.36 871.52 269.12 871.52 36.11 845.37 23.87 487.73 23.87"
            />
          </g>
        </g>

        <rect id={this.overlayId} pointerEvents="all" fill="none" width="882.42" height="461.23" />

        <g id={this.deviceId}>{!this.props.hideHVAC && this.getDevices()}</g>
      </React.Fragment>
    );
  }
}
