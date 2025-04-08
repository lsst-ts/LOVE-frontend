/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed by Inria Chile.

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
import lodash, { isArray } from 'lodash';
import PropTypes from 'prop-types';
import styles from './Level1.module.css';
import Device from '../Device.jsx';
import * as d3 from 'd3';

export default class Level1 extends Component {
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

  zoomMap = (event) => {
    const deviceId = '#' + this.deviceId;
    const mapId = '#' + this.mapId;
    const transformData = event.transform;

    d3.select(mapId).attr('transform', transformData);
    d3.select(deviceId).attr('transform', transformData);
    this.props.savePos(transformData);
  };

  zoomOut = () => {
    const overlayId = '#' + this.overlayId;

    const zoom = d3.zoom().scaleExtent([1, 8]).on('zoom', this.zoomMap);

    d3.select(overlayId).call(zoom.transform, d3.zoomIdentity.translate(0, 0).scale(1)).call(zoom);
  };

  checkArray(ctx) {
    if (isArray(ctx)) {
      return ctx[0];
    } else {
      return ctx;
    }
  }

  getAirCompressorStarted = (obj) => {
    for (let key in obj) {
      if (obj[key] === true) {
        return key;
      }
    }

    return 'Unknown';
  };

  getDevices() {
    const compressorInfo1 = this.checkArray(this.props.HVACData.compressorInfo1);
    const connectionStatus1 = this.checkArray(this.props.HVACData.connectionStatus1);
    const errors1 = this.checkArray(this.props.HVACData.errors1);
    const status1 = this.checkArray(this.props.HVACData.status1);
    const warnings1 = this.checkArray(this.props.HVACData.warnings1);
    const timerInfo1 = this.checkArray(this.props.HVACData.timerInfo1);
    const analogData1 = this.checkArray(this.props.HVACData.analogData1);

    const compressorInfo2 = this.checkArray(this.props.HVACData.compressorInfo2);
    const connectionStatus2 = this.checkArray(this.props.HVACData.connectionStatus2);
    const errors2 = this.checkArray(this.props.HVACData.errors2);
    const status2 = this.checkArray(this.props.HVACData.status2);
    const warnings2 = this.checkArray(this.props.HVACData.warnings2);
    const timerInfo2 = this.checkArray(this.props.HVACData.timerInfo2);
    const analogData2 = this.checkArray(this.props.HVACData.analogData2);

    const {
      coldWaterPump01,
      chiller01P01,
      chiller02P01,
      chiller03P01,
      generalP01,
      valveP01,
      airInletFan01P01,
      centrifugalExtractionFan01P01,
      centrifugalSupplyFan01P01,
    } = this.props.HVACData;

    const data01 = {
      Remote: status1?.startByRemote?.value ?? false,
      TimeControl: status1?.startWithTimerControl?.value ?? false,
      PressureRequirement: status1?.startWithPressureRequirement?.value ?? false,
      DePressurise: status1?.startAfterDePressurise?.value ?? false,
      PowerLoss: status1?.startAfterPowerLoss?.value ?? false,
      DryerPreRun: status1?.startAfterDryerPreRun?.value ?? false,
    };

    const data02 = {
      Remote: status2?.startByRemote?.value ?? false,
      TimeControl: status2?.startWithTimerControl?.value ?? false,
      PressureRequirement: status2?.startWithPressureRequirement?.value ?? false,
      DePressurise: status2?.startAfterDePressurise?.value ?? false,
      PowerLoss: status2?.startAfterPowerLoss?.value ?? false,
      DryerPreRun: status2?.startAfterDryerPreRun?.value ?? false,
    };

    const startedBy01 = this.getAirCompressorStarted(data01);
    const startedBy02 = this.getAirCompressorStarted(data02);

    return (
      <React.Fragment>
        <Device
          title={'Vec 1'}
          id={702}
          width={54}
          height={45}
          posX={823}
          posY={148}
          collapsible={false}
          states={{
            command: centrifugalExtractionFan01P01.switchedOn ? centrifugalExtractionFan01P01.switchedOn.value : null,
            working: centrifugalExtractionFan01P01.workingState
              ? centrifugalExtractionFan01P01.workingState.value
              : null,
            unit: centrifugalExtractionFan01P01.unitState ? centrifugalExtractionFan01P01.unitState.value : null,
            switch: centrifugalExtractionFan01P01.selectorState
              ? centrifugalExtractionFan01P01.selectorState.value
              : null,
          }}
        />

        <Device
          title={'Vea 1'}
          id={701}
          width={54}
          height={45}
          posX={690}
          posY={235}
          collapsible={false}
          states={{
            command: airInletFan01P01.switchedOn ? airInletFan01P01.switchedOn.value : null,
            working: airInletFan01P01.workingState ? airInletFan01P01.workingState.value : null,
            unit: airInletFan01P01.unitState ? airInletFan01P01.unitState.value : null,
            switch: airInletFan01P01.selectorState ? airInletFan01P01.selectorState.value : null,
          }}
        />

        <Device
          title={'Vin 1'}
          id={703}
          width={54}
          height={45}
          posX={810}
          posY={24}
          collapsible={false}
          states={{
            command: centrifugalSupplyFan01P01.switchedOn ? centrifugalSupplyFan01P01.switchedOn.value : null,
            working: centrifugalSupplyFan01P01.workingState ? centrifugalSupplyFan01P01.workingState.value : null,
            unit: centrifugalSupplyFan01P01.unitState ? centrifugalSupplyFan01P01.unitState.value : null,
            switch: centrifugalSupplyFan01P01.selectorState ? centrifugalSupplyFan01P01.selectorState.value : null,
          }}
        />

        <Device
          title={'Cold Water Pump'}
          id={1}
          width={70}
          height={0}
          posX={762}
          posY={237}
          collapsible={false}
          states={{
            command: coldWaterPump01.switchedOn ? coldWaterPump01.switchedOn.value : null,
            working: coldWaterPump01.workingState ? coldWaterPump01.workingState.value : null,
            unit: coldWaterPump01.unitState ? coldWaterPump01.unitState.value : null,
            switch: coldWaterPump01.selectorState ? coldWaterPump01.selectorState.value : null,
          }}
        />

        <Device
          title={'General'}
          id={2}
          temp={25.21 + 'ºC'}
          width={70}
          height={0}
          posX={685}
          posY={210}
          collapsible={false}
          states={{
            command: generalP01.switchedOn ? generalP01.switchedOn.value : null,
            working: generalP01.workingState ? generalP01.workingState.value : null,
            unit: generalP01.unitState ? generalP01.unitState.value : null,
            switch: generalP01.selectorState ? generalP01.selectorState.value : null,
          }}
        />

        <Device
          title={'Valves'}
          id={3}
          width={70}
          height={54}
          posX={762}
          posY={237}
          collapsible={true}
          states={{
            command: valveP01.switchedOn ? valveP01.switchedOn.value : null,
            working: valveP01.workingState ? valveP01.workingState.value : null,
            unit: valveP01.unitState ? valveP01.unitState.value : null,
            switch: valveP01.selectorState ? valveP01.selectorState.value : null,
          }}
          parameters={{
            valve03State: {
              type: 'status',
              name: 'State Valve 03',
              unit: null,
              value: valveP01.valve03State ? valveP01.valve03State.value : null,
            },
            valve04State: {
              type: 'status',
              name: 'State Valve 04',
              unit: null,
              value: valveP01.valve04State ? valveP01.valve04State.value : null,
            },
            valve05State: {
              type: 'status',
              name: 'State Valve 05',
              unit: null,
              value: valveP01.valve05State ? valveP01.valve05State.value : null,
            },
            valve06State: {
              type: 'status',
              name: 'State Valve 06',
              unit: null,
              value: valveP01.valve06State ? valveP01.valve06State.value : null,
            },
            valve12State: {
              type: 'status',
              name: 'State Valve 12',
              unit: null,
              value: valveP01.valve12State ? valveP01.valve12State.value : null,
            },
          }}
        />

        <Device
          title={'Chiller 01'}
          id={101}
          width={108}
          height={133}
          posX={800}
          posY={20}
          collapsible={true}
          alarms={{
            alarm1: {
              name: 'General',
              state: chiller01P01.generalAlarm ? chiller01P01.generalAlarm.value : null,
            },
            alarm2: {
              name: 'Compresor 01',
              state: chiller01P01.compressor01Alarm ? chiller01P01.compressor01Alarm.value : null,
            },
            alarm3: {
              name: 'Compresor 02',
              state: chiller01P01.compressor02Alarm ? chiller01P01.compressor02Alarm.value : null,
            },
            alarm4: {
              name: 'Compresor 03',
              state: chiller01P01.compressor03Alarm ? chiller01P01.compressor03Alarm.value : null,
            },
            alarm5: {
              name: 'Compresor 04',
              state: chiller01P01.compressor04Alarm ? chiller01P01.compressor04Alarm.value : null,
            },
          }}
          states={{
            command: chiller01P01.switchedOn ? chiller01P01.switchedOn.value : null,
            working: chiller01P01.workingState ? chiller01P01.workingState.value : null,
            unit: chiller01P01.unitState ? chiller01P01.unitState.value : null,
            switch: chiller01P01.selectorState ? chiller01P01.selectorState.value : null,
          }}
          parameters={{
            operationalMode: {
              type: 'single',
              name: 'Mode Operation',
              unit: null,
              value: chiller01P01.operationalMode ? chiller01P01.operationalMode.value : null,
            },
            workingCapacity: {
              type: 'single',
              name: 'Power Work',
              unit: chiller01P01.workingCapacity ? chiller01P01.workingCapacity.units : null,
              value: chiller01P01.workingCapacity ? chiller01P01.workingCapacity.value : null,
            },
            availableChillerCapacity: {
              type: 'single',
              name: 'Power Available',
              unit: chiller01P01.availableChillerCapacity ? chiller01P01.availableChillerCapacity.units : null,
              value: chiller01P01.availableChillerCapacity ? chiller01P01.availableChillerCapacity.value : null,
            },
            activeSetpoint: {
              type: 'single',
              name: 'Setpoint Active',
              unit: chiller01P01.activeSetpoint ? 'Cº' : null,
              value: chiller01P01.activeSetpoint ? chiller01P01.activeSetpoint.value : null,
            },
            presionBajaCto: {
              type: 'group',
              name: 'Pressure Low CTO',
              unit: null,
              value: null,
              params: {
                cto1LowerPressure: {
                  type: 'box',
                  alarm: null,
                  name: '01',
                  state: null,
                  unit: chiller01P01.cto1LowerPressure ? chiller01P01.cto1LowerPressure.units : null,
                  value: chiller01P01.cto1LowerPressure ? chiller01P01.cto1LowerPressure.value : null,
                },
                cto2LowerPressure: {
                  type: 'box',
                  alarm: null,
                  name: '02',
                  state: null,
                  unit: chiller01P01.cto2LowerPressure ? chiller01P01.cto2LowerPressure.units : null,
                  value: chiller01P01.cto2LowerPressure ? chiller01P01.cto2LowerPressure.value : null,
                },
              },
            },
            WaterEvaporator: {
              type: 'group',
              name: 'Water Evaporator',
              unit: null,
              value: null,
              params: {
                waterEvaporatorSupplyTemp: {
                  type: 'badge',
                  alarm: null,
                  name: '01',
                  state: null,
                  unit: chiller01P01.waterEvaporatorReturnTemp ? 'ºC Impulse' : null,
                  value: chiller01P01.waterEvaporatorSupplyTemp ? chiller01P01.waterEvaporatorSupplyTemp.value : null,
                },
                waterEvaporatorReturnTemp: {
                  type: 'badge',
                  alarm: null,
                  name: '02',
                  state: null,
                  unit: chiller01P01.waterEvaporatorReturnTemp ? 'ºC Return' : null,
                  value: chiller01P01.waterEvaporatorReturnTemp ? chiller01P01.waterEvaporatorReturnTemp.value : null,
                },
              },
            },
            Compressors: {
              type: 'group',
              name: 'Compressors',
              unit: chiller01P01.averageCompressorHours ? 'h mean' : null,
              value: chiller01P01.averageCompressorHours ? chiller01P01.averageCompressorHours.value : null,
              params: {
                compresor01: {
                  type: 'box',
                  alarm: 0,
                  name: '01',
                  state: chiller01P01.compressor01Working ? chiller01P01.compressor01Working.value : null,
                  unit: chiller01P01.compressor01Hours ? chiller01P01.compressor01Hours.units : null,
                  value: chiller01P01.compressor01Hours ? chiller01P01.compressor01Hours.value : null,
                },
                compresor02: {
                  type: 'box',
                  alarm: 0,
                  name: '02',
                  state: chiller01P01.compressor02Working ? chiller01P01.compressor02Working.value : null,
                  unit: chiller01P01.compressor02Hours ? chiller01P01.compressor02Hours.units : null,
                  value: chiller01P01.compressor02Hours ? chiller01P01.compressor02Hours.value : null,
                },
                compresor03: {
                  type: 'box',
                  alarm: 0,
                  name: '02',
                  state: chiller01P01.compressor03Working ? chiller01P01.compressor03Working.value : null,
                  unit: chiller01P01.compressor03Hours ? chiller01P01.compressor03Hours.units : null,
                  value: chiller01P01.compressor03Hours ? chiller01P01.compressor03Hours.value : null,
                },
                compresor04: {
                  type: 'box',
                  alarm: 0,
                  name: '02',
                  state: chiller01P01.compressor04Working ? chiller01P01.compressor04Working.value : null,
                  unit: chiller01P01.compressor04Hours ? chiller01P01.compressor04Hours.units : null,
                  value: chiller01P01.compressor04Hours ? chiller01P01.compressor04Hours.value : null,
                },
              },
            },
          }}
        />

        <Device
          title={'Chiller 02'}
          id={102}
          width={108}
          height={133}
          posX={800}
          posY={86}
          collapsible={true}
          alarms={{
            alarm1: {
              name: 'General',
              state: chiller02P01.generalAlarm ? chiller02P01.generalAlarm.value : null,
            },
            alarm2: {
              name: 'Compresor 01',
              state: chiller02P01.compressor01Alarm ? chiller02P01.compressor01Alarm.value : null,
            },
            alarm3: {
              name: 'Compresor 02',
              state: chiller02P01.compressor02Alarm ? chiller02P01.compressor02Alarm.value : null,
            },
            alarm4: {
              name: 'Compresor 03',
              state: chiller02P01.compressor03Alarm ? chiller02P01.compressor03Alarm.value : null,
            },
            alarm5: {
              name: 'Compresor 04',
              state: chiller02P01.compressor04Alarm ? chiller02P01.compressor04Alarm.value : null,
            },
          }}
          states={{
            command: chiller02P01.switchedOn ? chiller02P01.switchedOn.value : null,
            working: chiller02P01.workingState ? chiller02P01.workingState.value : null,
            unit: chiller02P01.unitState ? chiller02P01.unitState.value : null,
            switch: chiller02P01.selectorState ? chiller02P01.selectorState.value : null,
          }}
          parameters={{
            operationalMode: {
              type: 'single',
              name: 'Mode Operation',
              unit: null,
              value: chiller02P01.operationalMode ? chiller02P01.operationalMode.value : null,
            },
            workingCapacity: {
              type: 'single',
              name: 'Power Work',
              unit: chiller02P01.workingCapacity ? chiller02P01.workingCapacity.units : null,
              value: chiller02P01.workingCapacity ? chiller02P01.workingCapacity.value : null,
            },
            availableChillerCapacity: {
              type: 'single',
              name: 'Power Available',
              unit: chiller02P01.availableChillerCapacity ? chiller02P01.availableChillerCapacity.units : null,
              value: chiller02P01.availableChillerCapacity ? chiller02P01.availableChillerCapacity.value : null,
            },
            activeSetpoint: {
              type: 'single',
              name: 'Setpoint Active',
              unit: chiller02P01.activeSetpoint ? 'Cº' : null,
              value: chiller02P01.activeSetpoint ? chiller02P01.activeSetpoint.value : null,
            },
            presionBajaCto: {
              type: 'group',
              name: 'Pressure Low CTO',
              unit: null,
              value: null,
              params: {
                cto1LowerPressure: {
                  type: 'box',
                  alarm: null,
                  name: '01',
                  state: null,
                  unit: chiller02P01.cto1LowerPressure ? chiller02P01.cto1LowerPressure.units : null,
                  value: chiller02P01.cto1LowerPressure ? chiller02P01.cto1LowerPressure.value : null,
                },
                cto2LowerPressure: {
                  type: 'box',
                  alarm: null,
                  name: '02',
                  state: null,
                  unit: chiller02P01.cto2LowerPressure ? chiller02P01.cto2LowerPressure.units : null,
                  value: chiller02P01.cto2LowerPressure ? chiller02P01.cto2LowerPressure.value : null,
                },
              },
            },
            WaterEvaporator: {
              type: 'group',
              name: 'Water Evaporator',
              unit: null,
              value: null,
              params: {
                waterEvaporatorSupplyTemp: {
                  type: 'badge',
                  alarm: null,
                  name: '01',
                  state: null,
                  unit: chiller02P01.waterEvaporatorReturnTemp ? 'ºC Impulse' : null,
                  value: chiller02P01.waterEvaporatorSupplyTemp ? chiller02P01.waterEvaporatorSupplyTemp.value : null,
                },
                waterEvaporatorReturnTemp: {
                  type: 'badge',
                  alarm: null,
                  name: '02',
                  state: null,
                  unit: chiller02P01.waterEvaporatorReturnTemp ? 'ºC Return' : null,
                  value: chiller02P01.waterEvaporatorReturnTemp ? chiller02P01.waterEvaporatorReturnTemp.value : null,
                },
              },
            },
            Compressors: {
              type: 'group',
              name: 'Compressors',
              unit: chiller02P01.averageCompressorHours ? 'h mean' : null,
              value: chiller02P01.averageCompressorHours ? chiller02P01.averageCompressorHours.value : null,
              params: {
                compresor01: {
                  type: 'box',
                  alarm: 0,
                  name: '01',
                  state: chiller02P01.compressor01Working ? chiller02P01.compressor01Working.value : null,
                  unit: chiller02P01.compressor01Hours ? chiller02P01.compressor01Hours.units : null,
                  value: chiller02P01.compressor01Hours ? chiller02P01.compressor01Hours.value : null,
                },
                compresor02: {
                  type: 'box',
                  alarm: 0,
                  name: '02',
                  state: chiller02P01.compressor02Working ? chiller02P01.compressor02Working.value : null,
                  unit: chiller02P01.compressor02Hours ? chiller02P01.compressor02Hours.units : null,
                  value: chiller02P01.compressor02Hours ? chiller02P01.compressor02Hours.value : null,
                },
                compresor03: {
                  type: 'box',
                  alarm: 0,
                  name: '02',
                  state: chiller02P01.compressor03Working ? chiller02P01.compressor03Working.value : null,
                  unit: chiller02P01.compressor03Hours ? chiller02P01.compressor03Hours.units : null,
                  value: chiller02P01.compressor03Hours ? chiller02P01.compressor03Hours.value : null,
                },
                compresor04: {
                  type: 'box',
                  alarm: 0,
                  name: '02',
                  state: chiller02P01.compressor04Working ? chiller02P01.compressor04Working.value : null,
                  unit: chiller02P01.compressor04Hours ? chiller02P01.compressor04Hours.units : null,
                  value: chiller02P01.compressor04Hours ? chiller02P01.compressor04Hours.value : null,
                },
              },
            },
          }}
        />

        <Device
          title={'Chiller 03'}
          id={103}
          width={108}
          height={133}
          posX={800}
          posY={162}
          collapsible={true}
          alarms={{
            alarm1: {
              name: 'General',
              state: chiller03P01.generalAlarm ? chiller03P01.generalAlarm.value : null,
            },
            alarm2: {
              name: 'Compresor 01',
              state: chiller03P01.compressor01Alarm ? chiller03P01.compressor01Alarm.value : null,
            },
            alarm3: {
              name: 'Compresor 02',
              state: chiller03P01.compressor02Alarm ? chiller03P01.compressor02Alarm.value : null,
            },
            alarm4: {
              name: 'Compresor 03',
              state: chiller03P01.compressor03Alarm ? chiller03P01.compressor03Alarm.value : null,
            },
            alarm5: {
              name: 'Compresor 04',
              state: chiller03P01.compressor04Alarm ? chiller03P01.compressor04Alarm.value : null,
            },
          }}
          states={{
            command: chiller03P01.switchedOn ? chiller03P01.switchedOn.value : null,
            working: chiller03P01.workingState ? chiller03P01.workingState.value : null,
            unit: chiller03P01.unitState ? chiller03P01.unitState.value : null,
            switch: chiller03P01.selectorState ? chiller03P01.selectorState.value : null,
          }}
          parameters={{
            operationalMode: {
              type: 'single',
              name: 'Mode Operation',
              unit: null,
              value: chiller03P01.operationalMode ? chiller03P01.operationalMode.value : null,
            },
            workingCapacity: {
              type: 'single',
              name: 'Power Work',
              unit: chiller03P01.workingCapacity ? chiller03P01.workingCapacity.units : null,
              value: chiller03P01.workingCapacity ? chiller03P01.workingCapacity.value : null,
            },
            availableChillerCapacity: {
              type: 'single',
              name: 'Power Available',
              unit: chiller03P01.availableChillerCapacity ? chiller03P01.availableChillerCapacity.units : null,
              value: chiller03P01.availableChillerCapacity ? chiller03P01.availableChillerCapacity.value : null,
            },
            activeSetpoint: {
              type: 'single',
              name: 'Setpoint Active',
              unit: chiller03P01.activeSetpoint ? 'Cº' : null,
              value: chiller03P01.activeSetpoint ? chiller03P01.activeSetpoint.value : null,
            },
            presionBajaCto: {
              type: 'group',
              name: 'Pressure Low CTO',
              unit: null,
              value: null,
              params: {
                cto1LowerPressure: {
                  type: 'box',
                  alarm: null,
                  name: '01',
                  state: null,
                  unit: chiller03P01.cto1LowerPressure ? chiller03P01.cto1LowerPressure.units : null,
                  value: chiller03P01.cto1LowerPressure ? chiller03P01.cto1LowerPressure.value : null,
                },
                cto2LowerPressure: {
                  type: 'box',
                  alarm: null,
                  name: '02',
                  state: null,
                  unit: chiller03P01.cto2LowerPressure ? chiller03P01.cto2LowerPressure.units : null,
                  value: chiller03P01.cto2LowerPressure ? chiller03P01.cto2LowerPressure.value : null,
                },
              },
            },
            WaterEvaporator: {
              type: 'group',
              name: 'Water Evaporator',
              unit: null,
              value: null,
              params: {
                waterEvaporatorSupplyTemp: {
                  type: 'badge',
                  alarm: null,
                  name: '01',
                  state: null,
                  unit: chiller03P01.waterEvaporatorReturnTemp ? 'ºC Impulse' : null,
                  value: chiller03P01.waterEvaporatorSupplyTemp ? chiller03P01.waterEvaporatorSupplyTemp.value : null,
                },
                waterEvaporatorReturnTemp: {
                  type: 'badge',
                  alarm: null,
                  name: '02',
                  state: null,
                  unit: chiller03P01.waterEvaporatorReturnTemp ? 'ºC Return' : null,
                  value: chiller03P01.waterEvaporatorReturnTemp ? chiller03P01.waterEvaporatorReturnTemp.value : null,
                },
              },
            },
            Compressors: {
              type: 'group',
              name: 'Compressors',
              unit: chiller03P01.averageCompressorHours ? 'h mean' : null,
              value: chiller03P01.averageCompressorHours ? chiller03P01.averageCompressorHours.value : null,
              params: {
                compresor01: {
                  type: 'box',
                  alarm: 0,
                  name: '01',
                  state: chiller03P01.compressor01Working ? chiller03P01.compressor01Working.value : null,
                  unit: chiller03P01.compressor01Hours ? chiller03P01.compressor01Hours.units : null,
                  value: chiller03P01.compressor01Hours ? chiller03P01.compressor01Hours.value : null,
                },
                compresor02: {
                  type: 'box',
                  alarm: 0,
                  name: '02',
                  state: chiller03P01.compressor02Working ? chiller03P01.compressor02Working.value : null,
                  unit: chiller03P01.compressor02Hours ? chiller03P01.compressor02Hours.units : null,
                  value: chiller03P01.compressor02Hours ? chiller03P01.compressor02Hours.value : null,
                },
                compresor03: {
                  type: 'box',
                  alarm: 0,
                  name: '02',
                  state: chiller03P01.compressor03Working ? chiller03P01.compressor03Working.value : null,
                  unit: chiller03P01.compressor03Hours ? chiller03P01.compressor03Hours.units : null,
                  value: chiller03P01.compressor03Hours ? chiller03P01.compressor03Hours.value : null,
                },
                compresor04: {
                  type: 'box',
                  alarm: 0,
                  name: '02',
                  state: chiller03P01.compressor04Working ? chiller03P01.compressor04Working.value : null,
                  unit: chiller03P01.compressor04Hours ? chiller03P01.compressor04Hours.units : null,
                  value: chiller03P01.compressor04Hours ? chiller03P01.compressor04Hours.value : null,
                },
              },
            },
          }}
        />

        <Device
          title={'Air Compressor 02'}
          width={108}
          height={244}
          posX={755}
          posY={125}
          collapsible={true}
          alarms={{
            alarm1: {
              name: 'Service Required',
              state: status2?.serviceRequired?.value,
            },
            alarm400: {
              name: 'E400',
              state: errors2?.powerSupplyFailureE400?.value,
            },
            alarm401: {
              name: 'E401',
              state: errors2?.emergencyStopActivatedE401?.value,
            },
            alarm402: {
              name: 'E402',
              state: errors2?.highMotorTemperatureM1E402?.value,
            },
            alarm403: {
              name: 'E403',
              state: errors2?.compressorDischargeTemperatureE403?.value,
            },
            alarm404: {
              name: 'E404',
              state: errors2?.startTemperatureLowE404?.value,
            },
            alarm405: {
              name: 'E405',
              state: errors2?.dischargeOverPressureE405?.value,
            },
            alarm406: {
              name: 'E406',
              state: errors2?.linePressureSensorB1E406?.value,
            },
            alarm407: {
              name: 'E407',
              state: errors2?.dischargePressureSensorB2E407?.value,
            },
            alarm408: {
              name: 'E408',
              state: errors2?.dischargeTemperatureSensorR2E408?.value,
            },
            alarm409: {
              name: 'E409',
              state: errors2?.controllerHardwareE409?.value,
            },
            alarm410: {
              name: 'E410',
              state: errors2?.coolingE410?.value,
            },
            alarm411: {
              name: 'E411',
              state: errors2?.oilPressureLowE411?.value,
            },
            alarm412: {
              name: 'E412',
              state: errors2?.externalFaultE412?.value,
            },
            alarm413: {
              name: 'E413',
              state: errors2?.dryerE413?.value,
            },
            alarm414: {
              name: 'E414',
              state: errors2?.condensateDrainE414?.value,
            },
            alarm415: {
              name: 'E415',
              state: errors2?.noPressureBuildUpE415?.value,
            },
            alarm416: {
              name: 'E416',
              state: errors2?.heavyStartupE416?.value,
            },
            alarm500: {
              name: 'E4500',
              state: errors2?.preAdjustmentVSDE500?.value,
            },
            alarm501: {
              name: 'E501',
              state: errors2?.preAdjustmentE501?.value,
            },
            alarm502: {
              name: 'E502',
              state: errors2?.lockedVSDE502?.value,
            },
            alarm503: {
              name: 'E503',
              state: errors2?.writeFaultVSDE503?.value,
            },
            alarm504: {
              name: 'E504',
              state: errors2?.communicationVSDE504?.value,
            },
            alarm505: {
              name: 'E505',
              state: errors2?.stopPressedVSDE505?.value,
            },
            alarm506: {
              name: 'E506',
              state: errors2?.stopInputEMVSDE506?.value,
            },
            alarm507: {
              name: 'E507',
              state: errors2?.readFaultVSDE507?.value,
            },
            alarm508: {
              name: 'E508',
              state: errors2?.stopInputVSDEME508?.value,
            },
            alarm509: {
              name: 'E509',
              state: errors2?.seeVSDDisplayE509?.value,
            },
            alarm510: {
              name: 'E510',
              state: errors2?.speedBelowMinLimitE510?.value,
            },
            alarm600: {
              name: 'E600',
              state: warnings2?.serviceDueA600?.value,
            },
            alarm601: {
              name: 'E601',
              state: warnings2?.dischargeOverPressureA601?.value,
            },
            alarm602: {
              name: 'E602',
              state: warnings2?.compressorDischargeTemperatureA602?.value,
            },
            alarm606: {
              name: 'E606',
              state: warnings2?.linePressureHighA606?.value,
            },
            alarm607: {
              name: 'E607',
              state: warnings2?.controllerBatteryEmptyA607?.value,
            },
            alarm608: {
              name: 'E5608',
              state: warnings2?.dryerA608?.value,
            },
            alarm609: {
              name: 'E609',
              state: warnings2?.condensateDrainA609?.value,
            },
            alarm610: {
              name: 'E610',
              state: warnings2?.fineSeparatorA610?.value,
            },
            alarm611: {
              name: 'E611',
              state: warnings2?.airFilterA611?.value,
            },
            alarm612: {
              name: 'E612',
              state: warnings2?.oilFilterA612?.value,
            },
            alarm615: {
              name: 'E615',
              state: warnings2?.oilLevelLowA613?.value,
            },
            alarm614: {
              name: 'E614',
              state: warnings2?.oilTemperatureHighA614?.value,
            },
            alarm616: {
              name: 'E616',
              state: warnings2?.externalWarningA615?.value,
            },
            alarm616: {
              name: 'E616',
              state: warnings2?.motorLuricationSystemA616?.value,
            },
            alarm617: {
              name: 'E617',
              state: warnings2?.input1A617?.value,
            },
            alarm618: {
              name: 'E618',
              state: warnings2?.input2A618?.value,
            },
            alarm619: {
              name: 'E619',
              state: warnings2?.input3A619?.value,
            },
            alarm620: {
              name: 'E620',
              state: warnings2?.input4A620?.value,
            },
            alarm621: {
              name: 'E621',
              state: warnings2?.input5A621?.value,
            },
            alarm622: {
              name: 'E622',
              state: warnings2?.input6A622?.value,
            },
            alarm623: {
              name: 'E623',
              state: warnings2?.fullSDCardA623?.value,
            },
            alarm700: {
              name: 'E700',
              state: warnings2?.temperatureHighVSDA700?.value,
            },
          }}
          states={{
            command: status2?.readyToStart?.value,
            working: status2?.operating?.value,
            command: null,
            working: null,
            unit: null,
            switch: null,
          }}
          parameters={{
            startedBy: {
              type: 'text',
              name: 'Started By',
              unit: null,
              value: startedBy02,
            },
            runOnTimerBool: {
              type: 'status',
              name: 'Power managed by Timer',
              unit: null,
              value: status2.runOnTimer ? (status2.runOnTimer.value ? true : false) : null,
            },
            waterLevel: {
              type: 'single',
              name: 'Water Level',
              unit: analogData2.waterLevel ? ' ' + analogData2.waterLevel.units : null,
              value: analogData2.waterLevel ? analogData2.waterLevel.value : null,
            },
            speedStatus: {
              type: 'status',
              name: 'Speed Status',
              unit: null,
              value: status2.minAllowedSpeedAchieved
                ? 'Max Speed'
                : status2.minAllowedSpeedAchieved
                ? 'Min Speed'
                : 'Nominal',
            },
            limitSpeed: {
              type: 'single',
              name: 'Speed Target',
              unit: analogData2.targetSpeed ? ' min-1' : null,
              value: analogData2.targetSpeed ? analogData2.targetSpeed.value : null,
            },
            MotorSpeed1: {
              type: 'group',
              name: 'Motor Speed',
              unit: null,
              value: null,
              params: {
                motorCurrent1: {
                  type: 'noBox',
                  alarm: null,
                  name: 'Current',
                  state: null,
                  unit: analogData2.motorCurrent ? ' ' + analogData2.motorCurrent.units : null,
                  value: analogData2.motorCurrent ? analogData2.motorCurrent.value : null,
                },
                motorInput1: {
                  type: 'noBox',
                  alarm: null,
                  name: 'Input',
                  state: null,
                  unit: analogData2.motorInput ? ' ' + analogData2.motorInput.units : null,
                  value: analogData2.motorInput ? analogData2.motorInput.value : null,
                },
              },
            },
            MotorPower1: {
              type: 'group',
              name: 'Motor Power',
              unit: null,
              value: null,
              params: {
                motorSpeedPercentage1: {
                  type: 'noBox',
                  alarm: null,
                  name: 'Speed %',
                  state: null,
                  unit: analogData2.motorSpeedPercentage ? ' ' + analogData2.motorSpeedPercentage.units : null,
                  value: analogData2.motorSpeedPercentage ? analogData2.motorSpeedPercentage.value : null,
                },
                motorSpeedRPM1: {
                  type: 'noBox',
                  alarm: null,
                  name: 'Speed RPM',
                  state: null,
                  unit: analogData2.motorSpeedRPM ? ' ' + analogData2.motorSpeedRPM.units : null,
                  value: analogData2.motorSpeedRPM ? analogData2.motorSpeedRPM.value : null,
                },
              },
            },
            Volume1: {
              type: 'group',
              name: 'Volume',
              unit: null,
              value: null,
              params: {
                compressorVolumePercentage: {
                  type: 'noBox',
                  alarm: null,
                  name: 'Compressor',
                  state: null,
                  unit: analogData2.compressorVolumePercentage
                    ? ' ' + analogData2.compressorVolumePercentage.units
                    : null,
                  value: analogData2.compressorVolumePercentage ? analogData2.compressorVolumePercentage.value : null,
                },
                compressorVolume: {
                  type: 'noBox',
                  alarm: null,
                  name: 'Compressor',
                  state: null,
                  unit: analogData2.compressorVolume ? ' ' + analogData2.compressorVolume.units : null,
                  value: analogData2.compressorVolume ? analogData2.compressorVolume.value : null,
                },
                groupVolume: {
                  type: 'noBox',
                  alarm: null,
                  name: 'Group',
                  state: null,
                  unit: analogData2.groupVolume ? ' ' + analogData2.groupVolume.units : null,
                  value: analogData2.groupVolume ? analogData2.groupVolume.value : null,
                },
              },
            },
            Stage11: {
              type: 'group',
              name: 'Stage 01',
              unit: null,
              value: null,
              params: {
                stage1OutputPressure: {
                  type: 'noBox',
                  alarm: null,
                  name: 'Compressor',
                  state: null,
                  unit: analogData2.stage1OutputPressure ? ' ' + analogData2.stage1OutputPressure.units : null,
                  value: analogData2.stage1OutputPressure ? analogData2.stage1OutputPressure.value : null,
                },
                compressorVolume: {
                  type: 'noBox',
                  alarm: null,
                  name: 'Compressor',
                  state: null,
                  unit: analogData2.stage1OutputTemperature ? ' ºC' : null,
                  value: analogData2.stage1OutputTemperature ? analogData2.stage1OutputTemperature.value : null,
                },
              },
            },
            linePressure: {
              type: 'single',
              name: 'Line Pressure',
              unit: analogData2.linePressure ? ' ' + analogData2.linePressure.units : null,
              value: analogData2.linePressure ? analogData2.linePressure.value : null,
            },
            heatsinkTemperature: {
              type: 'single',
              name: 'Heatsink Temperature',
              unit: analogData2.heatsinkTemperature ? ' ºC' : null,
              value: analogData2.heatsinkTemperature ? analogData2.heatsinkTemperature.value : null,
            },
            dclinkVoltage: {
              type: 'single',
              name: 'DC Link Voltage',
              unit: analogData2.dclinkVoltage ? ' ' + analogData2.dclinkVoltage.units : null,
              value: analogData2.dclinkVoltage ? analogData2.dclinkVoltage.value : null,
            },
            runningHours: {
              type: 'single',
              name: 'Time Running',
              unit: timerInfo2.runningHours ? ' ' + timerInfo2.runningHours.units : null,
              value: timerInfo2.runningHours ? timerInfo2.runningHours.value : null,
            },
            loadedHours: {
              type: 'single',
              name: 'Time Loaded',
              unit: timerInfo2.loadedHours ? ' ' + timerInfo2.loadedHours.units : null,
              value: timerInfo2.loadedHours ? timerInfo2.loadedHours.value : null,
            },
            lowestServiceCounter: {
              type: 'single',
              name: 'Lowes service counter',
              unit: timerInfo2.lowestServiceCounter ? ' ' + timerInfo2.lowestServiceCounter.units : null,
              value: timerInfo2.lowestServiceCounter ? timerInfo2.lowestServiceCounter.value : null,
            },
            runOnTimer: {
              type: 'single',
              name: 'Run-on timer',
              unit: timerInfo2.runOnTimer ? ' ' + timerInfo2.runOnTimer.units : null,
              value: timerInfo2.runOnTimer ? timerInfo2.runOnTimer.value : null,
            },
          }}
        />

        <Device
          title={'Air Compressor 01'}
          width={108}
          height={244}
          posX={755}
          posY={104}
          collapsible={true}
          alarms={{
            alarm1: {
              name: 'Service Required',
              state: status1?.serviceRequired?.value,
            },
            alarm400: {
              name: 'E400',
              state: errors1?.powerSupplyFailureE400?.value,
            },
            alarm401: {
              name: 'E401',
              state: errors1?.emergencyStopActivatedE401?.value,
            },
            alarm402: {
              name: 'E402',
              state: errors1?.highMotorTemperatureM1E402?.value,
            },
            alarm403: {
              name: 'E403',
              state: errors1?.compressorDischargeTemperatureE403?.value,
            },
            alarm404: {
              name: 'E404',
              state: errors1?.startTemperatureLowE404?.value,
            },
            alarm405: {
              name: 'E405',
              state: errors1?.dischargeOverPressureE405?.value,
            },
            alarm406: {
              name: 'E406',
              state: errors1?.linePressureSensorB1E406?.value,
            },
            alarm407: {
              name: 'E407',
              state: errors1?.dischargePressureSensorB2E407?.value,
            },
            alarm408: {
              name: 'E408',
              state: errors1?.dischargeTemperatureSensorR2E408?.value,
            },
            alarm409: {
              name: 'E409',
              state: errors1?.controllerHardwareE409?.value,
            },
            alarm410: {
              name: 'E410',
              state: errors1?.coolingE410?.value,
            },
            alarm411: {
              name: 'E411',
              state: errors1?.oilPressureLowE411?.value,
            },
            alarm412: {
              name: 'E412',
              state: errors1?.externalFaultE412?.value,
            },
            alarm413: {
              name: 'E413',
              state: errors1?.dryerE413?.value,
            },
            alarm414: {
              name: 'E414',
              state: errors1?.condensateDrainE414?.value,
            },
            alarm415: {
              name: 'E415',
              state: errors1?.noPressureBuildUpE415?.value,
            },
            alarm416: {
              name: 'E416',
              state: errors1?.heavyStartupE416?.value,
            },
            alarm500: {
              name: 'E4500',
              state: errors1?.preAdjustmentVSDE500?.value,
            },
            alarm501: {
              name: 'E501',
              state: errors1?.preAdjustmentE501?.value,
            },
            alarm502: {
              name: 'E502',
              state: errors1?.lockedVSDE502?.value,
            },
            alarm503: {
              name: 'E503',
              state: errors1?.writeFaultVSDE503?.value,
            },
            alarm504: {
              name: 'E504',
              state: errors1?.communicationVSDE504?.value,
            },
            alarm505: {
              name: 'E505',
              state: errors1?.stopPressedVSDE505?.value,
            },
            alarm506: {
              name: 'E506',
              state: errors1?.stopInputEMVSDE506?.value,
            },
            alarm507: {
              name: 'E507',
              state: errors1?.readFaultVSDE507?.value,
            },
            alarm508: {
              name: 'E508',
              state: errors1?.stopInputVSDEME508?.value,
            },
            alarm509: {
              name: 'E509',
              state: errors1?.seeVSDDisplayE509?.value,
            },
            alarm510: {
              name: 'E510',
              state: errors1?.speedBelowMinLimitE510?.value,
            },
            alarm600: {
              name: 'E600',
              state: warnings1?.serviceDueA600?.value,
            },
            alarm601: {
              name: 'E601',
              state: warnings1?.dischargeOverPressureA601?.value,
            },
            alarm602: {
              name: 'E602',
              state: warnings1?.compressorDischargeTemperatureA602?.value,
            },
            alarm606: {
              name: 'E606',
              state: warnings1?.linePressureHighA606?.value,
            },
            alarm607: {
              name: 'E607',
              state: warnings1?.controllerBatteryEmptyA607?.value,
            },
            alarm608: {
              name: 'E5608',
              state: warnings1?.dryerA608?.value,
            },
            alarm609: {
              name: 'E609',
              state: warnings1?.condensateDrainA609?.value,
            },
            alarm610: {
              name: 'E610',
              state: warnings1?.fineSeparatorA610?.value,
            },
            alarm611: {
              name: 'E611',
              state: warnings1?.airFilterA611?.value,
            },
            alarm612: {
              name: 'E612',
              state: warnings1?.oilFilterA612?.value,
            },
            alarm615: {
              name: 'E615',
              state: warnings1?.oilLevelLowA613?.value,
            },
            alarm614: {
              name: 'E614',
              state: warnings1?.oilTemperatureHighA614?.value,
            },
            alarm616: {
              name: 'E616',
              state: warnings1?.externalWarningA615?.value,
            },
            alarm616: {
              name: 'E616',
              state: warnings1?.motorLuricationSystemA616?.value,
            },
            alarm617: {
              name: 'E617',
              state: warnings1?.input1A617?.value,
            },
            alarm618: {
              name: 'E618',
              state: warnings1?.input2A618?.value,
            },
            alarm619: {
              name: 'E619',
              state: warnings1?.input3A619?.value,
            },
            alarm620: {
              name: 'E620',
              state: warnings1?.input4A620?.value,
            },
            alarm621: {
              name: 'E621',
              state: warnings1?.input5A621?.value,
            },
            alarm622: {
              name: 'E622',
              state: warnings1?.input6A622?.value,
            },
            alarm623: {
              name: 'E623',
              state: warnings1?.fullSDCardA623?.value,
            },
            alarm700: {
              name: 'E700',
              state: warnings1?.temperatureHighVSDA700?.value,
            },
          }}
          states={{
            command: status1?.readyToStart?.value,
            working: status1?.operating?.value,
            command: null,
            working: null,
            unit: null,
            switch: null,
          }}
          parameters={{
            startedBy: {
              type: 'text',
              name: 'Started By',
              unit: null,
              value: startedBy01,
            },
            runOnTimerBool: {
              type: 'status',
              name: 'Power managed by Timer',
              unit: null,
              value: status1.runOnTimer ? (status1.runOnTimer.value ? true : false) : null,
            },
            waterLevel: {
              type: 'single',
              name: 'Water Level',
              unit: analogData1.waterLevel ? ' ' + analogData1.waterLevel.units : null,
              value: analogData1.waterLevel ? analogData1.waterLevel.value : null,
            },
            speedStatus: {
              type: 'status',
              name: 'Speed Status',
              unit: null,
              value: status1.minAllowedSpeedAchieved
                ? 'Max Speed'
                : status1.minAllowedSpeedAchieved
                ? 'Min Speed'
                : 'Nominal',
            },
            limitSpeed: {
              type: 'single',
              name: 'Speed Target',
              unit: analogData1.targetSpeed ? ' min-1' : null,
              value: analogData1.targetSpeed ? analogData1.targetSpeed.value : null,
            },
            MotorSpeed1: {
              type: 'group',
              name: 'Motor Speed',
              unit: null,
              value: null,
              params: {
                motorCurrent1: {
                  type: 'noBox',
                  alarm: null,
                  name: 'Current',
                  state: null,
                  unit: analogData1.motorCurrent ? ' ' + analogData1.motorCurrent.units : null,
                  value: analogData1.motorCurrent ? analogData1.motorCurrent.value : null,
                },
                motorInput1: {
                  type: 'noBox',
                  alarm: null,
                  name: 'Input',
                  state: null,
                  unit: analogData1.motorInput ? ' ' + analogData1.motorInput.units : null,
                  value: analogData1.motorInput ? analogData1.motorInput.value : null,
                },
              },
            },
            MotorPower1: {
              type: 'group',
              name: 'Motor Power',
              unit: null,
              value: null,
              params: {
                motorSpeedPercentage1: {
                  type: 'noBox',
                  alarm: null,
                  name: 'Speed %',
                  state: null,
                  unit: analogData1.motorSpeedPercentage ? ' ' + analogData1.motorSpeedPercentage.units : null,
                  value: analogData1.motorSpeedPercentage ? analogData1.motorSpeedPercentage.value : null,
                },
                motorSpeedRPM1: {
                  type: 'noBox',
                  alarm: null,
                  name: 'Speed RPM',
                  state: null,
                  unit: analogData1.motorSpeedRPM ? ' ' + analogData1.motorSpeedRPM.units : null,
                  value: analogData1.motorSpeedRPM ? analogData1.motorSpeedRPM.value : null,
                },
              },
            },
            Volume1: {
              type: 'group',
              name: 'Volume',
              unit: null,
              value: null,
              params: {
                compressorVolumePercentage: {
                  type: 'noBox',
                  alarm: null,
                  name: 'Compressor',
                  state: null,
                  unit: analogData1.compressorVolumePercentage
                    ? ' ' + analogData1.compressorVolumePercentage.units
                    : null,
                  value: analogData1.compressorVolumePercentage ? analogData1.compressorVolumePercentage.value : null,
                },
                compressorVolume: {
                  type: 'noBox',
                  alarm: null,
                  name: 'Compressor',
                  state: null,
                  unit: analogData1.compressorVolume ? ' ' + analogData1.compressorVolume.units : null,
                  value: analogData1.compressorVolume ? analogData1.compressorVolume.value : null,
                },
                groupVolume: {
                  type: 'noBox',
                  alarm: null,
                  name: 'Group',
                  state: null,
                  unit: analogData1.groupVolume ? ' ' + analogData1.groupVolume.units : null,
                  value: analogData1.groupVolume ? analogData1.groupVolume.value : null,
                },
              },
            },
            Stage11: {
              type: 'group',
              name: 'Stage 01',
              unit: null,
              value: null,
              params: {
                stage1OutputPressure: {
                  type: 'noBox',
                  alarm: null,
                  name: 'Compressor',
                  state: null,
                  unit: analogData1.stage1OutputPressure ? ' ' + analogData1.stage1OutputPressure.units : null,
                  value: analogData1.stage1OutputPressure ? analogData1.stage1OutputPressure.value : null,
                },
                compressorVolume: {
                  type: 'noBox',
                  alarm: null,
                  name: 'Compressor',
                  state: null,
                  unit: analogData1.stage1OutputTemperature ? ' ºC' : null,
                  value: analogData1.stage1OutputTemperature ? analogData1.stage1OutputTemperature.value : null,
                },
              },
            },
            linePressure: {
              type: 'single',
              name: 'Line Pressure',
              unit: analogData1.linePressure ? ' ' + analogData1.linePressure.units : null,
              value: analogData1.linePressure ? analogData1.linePressure.value : null,
            },
            heatsinkTemperature: {
              type: 'single',
              name: 'Heatsink Temperature',
              unit: analogData1.heatsinkTemperature ? ' ºC' : null,
              value: analogData1.heatsinkTemperature ? analogData1.heatsinkTemperature.value : null,
            },
            dclinkVoltage: {
              type: 'single',
              name: 'DC Link Voltage',
              unit: analogData1.dclinkVoltage ? ' ' + analogData1.dclinkVoltage.units : null,
              value: analogData1.dclinkVoltage ? analogData1.dclinkVoltage.value : null,
            },
            runningHours: {
              type: 'single',
              name: 'Time Running',
              unit: timerInfo1.runningHours ? ' ' + timerInfo1.runningHours.units : null,
              value: timerInfo1.runningHours ? timerInfo1.runningHours.value : null,
            },
            loadedHours: {
              type: 'single',
              name: 'Time Loaded',
              unit: timerInfo1.loadedHours ? ' ' + timerInfo1.loadedHours.units : null,
              value: timerInfo1.loadedHours ? timerInfo1.loadedHours.value : null,
            },
            lowestServiceCounter: {
              type: 'single',
              name: 'Lowes service counter',
              unit: timerInfo1.lowestServiceCounter ? ' ' + timerInfo1.lowestServiceCounter.units : null,
              value: timerInfo1.lowestServiceCounter ? timerInfo1.lowestServiceCounter.value : null,
            },
            runOnTimer: {
              type: 'single',
              name: 'Run-on timer',
              unit: timerInfo1.runOnTimer ? ' ' + timerInfo1.runOnTimer.units : null,
              value: timerInfo1.runOnTimer ? timerInfo1.runOnTimer.value : null,
            },
          }}
        />
      </React.Fragment>
    );
  }

  render() {
    const zoomLevel = this.props.transformData.k;
    return (
      <React.Fragment>
        <g id={this.mapId}>
          <rect className={styles.background} width="882.42" height="461.23" />
          <g id="Building">
            <polygon
              id="Floor"
              className={styles.cls2}
              points="711.73 331.68 711.73 266.56 867.14 266.56 867.14 38.75 755.22 38.75 755.22 12.77 676.94 12.77 676.94 38.75 633.77 38.75 633.77 264 622.84 264 622.84 331.12 711.73 331.68"
            />
            <rect id="Hatchs" className={styles.cls8} x="836.17" y="62.89" width="2.96" height="179.32" />
            <g id="SolidWall">
              <polygon
                className={styles.cls13}
                points="643.82 41.37 643.82 46.79 648.61 46.79 648.61 41.37 693.68 41.37 693.68 46.79 698.52 46.79 698.52 38.75 678.8 38.75 678.8 12.84 675.91 12.84 675.91 38.75 633.77 38.75 633.77 264 622.84 264 622.84 333.21 711.73 333.21 711.73 330 626.52 330 626.52 266.56 636.75 266.56 636.75 242.45 642.33 242.45 642.33 233.95 636.75 233.95 636.75 227.86 642.33 227.86 642.33 219.18 636.75 219.18 636.75 165.87 642.33 165.87 642.33 157.08 636.75 157.08 636.75 151.08 642.33 151.08 642.33 142.64 636.75 142.64 636.75 106.95 642.33 106.95 642.33 98.58 636.75 98.58 636.75 41.37 643.82 41.37"
              />
              <rect className={styles.cls13} x="692.09" y="98.58" width="8.16" height="8.37" />
              <rect className={styles.cls13} x="692.09" y="178.49" width="8.16" height="8.16" />
              <rect className={styles.cls13} x="741.95" y="178.49" width="8.16" height="8.16" />
              <rect className={styles.cls13} x="811.72" y="178.49" width="8.16" height="8.16" />
              <rect className={styles.cls13} x="858.98" y="98.58" width="8.16" height="8.37" />
              <rect className={styles.cls13} x="858.98" y="178.49" width="8.16" height="8.16" />
              <polygon
                className={styles.cls13}
                points="643.59 266.56 643.59 258.23 648.56 258.23 648.56 263.86 693.45 263.86 693.45 258.23 698.52 258.23 698.52 263.86 716.84 263.86 716.84 266.56 711.87 266.56 711.87 280.09 709.45 280.09 709.45 266.56 643.59 266.56"
              />
              <rect className={styles.cls13} x="724.8" y="263.86" width="7.3" height="2.7" />
              <polygon
                className={styles.cls13}
                points="813.07 258.27 813.07 263.86 786.3 263.86 786.3 266.56 818.41 266.56 818.41 264.35 818.41 263.86 818.41 258.27 813.07 258.27"
              />
              <polygon
                className={styles.cls13}
                points="748.78 263.86 748.78 258.27 743.44 258.27 743.44 263.86 741.96 263.86 741.96 266.56 753.59 266.56 753.59 263.86 748.78 263.86"
              />
              <polygon
                className={styles.cls13}
                points="743.45 46.79 743.45 38.75 818.24 38.75 818.24 46.75 816.75 46.75 816.75 104.56 810.8 104.56 810.8 101.54 814.66 101.54 814.66 78.79 767.91 78.79 767.91 76.37 814.66 76.37 814.66 46.75 813.17 46.75 813.17 42.19 748.47 42.19 748.47 46.79 743.45 46.79"
              />
              <polygon
                className={styles.cls13}
                points="801.45 101.54 750.12 101.54 750.12 98.58 741.95 98.58 741.95 106.95 750.12 106.95 750.12 104.56 801.45 104.56 801.45 101.54"
              />
              <rect className={styles.cls13} x="864.19" y="38.75" width="2.95" height="5.6" />
              <rect className={styles.cls13} x="864.19" y="260.9" width="2.95" height="5.66" />
              <rect className={styles.cls4} x="669.73" y="336.63" width="39.93" height="87.85" />
              <rect className={styles.cls4} x="667.65" y="333.21" width="44.08" height="93.26" />
              <g>
                <circle className={styles.cls4} cx="689.69" cy="358.42" r="11.16" />
                <circle className={styles.cls4} cx="689.69" cy="402.69" r="11.16" />
              </g>
            </g>
            <g id="MoveableWall" className={styles.opacity50}>
              <g>
                <polyline className={styles.cls10} points="747.25 259.28 747.25 260.78 744.61 260.78 744.61 259.28" />
                <line className={styles.cls11} x1="744.61" y1="256.82" x2="744.61" y2="105.28" />
                <polyline className={styles.cls10} points="744.61 105.28 744.61 103.78 747.25 103.78 747.25 105.28" />
                <line className={styles.cls11} x1="747.25" y1="107.74" x2="747.25" y2="259.28" />
              </g>
              <g>
                <polyline className={styles.cls10} points="697.51 259.28 697.51 260.78 694.87 260.78 694.87 259.28" />
                <line className={styles.cls6} x1="694.87" y1="256.76" x2="694.87" y2="46.24" />
                <polyline className={styles.cls10} points="694.87 46.24 694.87 44.74 697.51 44.74 697.51 46.24" />
                <line className={styles.cls6} x1="697.51" y1="48.76" x2="697.51" y2="259.28" />
              </g>
              <g>
                <polyline className={styles.cls10} points="636.37 183.9 634.87 183.9 634.87 181.25 636.37 181.25" />
                <line className={styles.cls1} x1="638.89" y1="181.25" x2="860.37" y2="181.25" />
                <polyline className={styles.cls10} points="860.37 181.25 861.87 181.25 861.87 183.9 860.37 183.9" />
                <line className={styles.cls1} x1="857.86" y1="183.9" x2="636.37" y2="183.9" />
              </g>
              <g>
                <polyline className={styles.cls10} points="636.37 104.09 634.87 104.09 634.87 101.45 636.37 101.45" />
                <line className={styles.cls1} x1="638.89" y1="101.45" x2="860.37" y2="101.45" />
                <polyline className={styles.cls10} points="860.37 101.45 861.87 101.45 861.87 104.09 860.37 104.09" />
                <line className={styles.cls1} x1="857.86" y1="104.09" x2="636.37" y2="104.09" />
              </g>
              <g>
                <polyline className={styles.cls10} points="817.13 259.28 817.13 260.78 814.48 260.78 814.48 259.28" />
                <line className={styles.cls3} x1="814.48" y1="256.8" x2="814.48" y2="104.06" />
                <polyline className={styles.cls10} points="814.48 104.06 814.48 102.56 817.13 102.56 817.13 104.06" />
                <line className={styles.cls3} x1="817.13" y1="106.54" x2="817.13" y2="259.28" />
              </g>
            </g>
            <g id="Wall">
              <polygon
                className={styles.cls5}
                points="867.14 38.75 829.52 38.75 829.52 40.89 865.03 40.89 865.03 264.19 817.91 264.19 817.91 266.56 867.14 266.56 867.14 38.75"
              />
              <polygon
                className={styles.cls5}
                points="698.19 38.75 718.72 38.75 718.72 36.47 720.1 36.47 720.1 45.37 722.29 45.37 722.29 46.79 718.72 46.79 718.72 40.56 698.19 40.56 698.19 38.75"
              />
              <polygon
                className={styles.cls5}
                points="718.72 12.77 718.72 14.06 718.72 15.21 718.72 16.82 720.1 16.82 720.1 15.21 754.1 15.21 754.1 38.79 755.35 38.79 755.35 12.77 718.72 12.77"
              />
              <line className={styles.cls5} x1="813.26" y1="46.56" x2="813.26" y2="76.51" />
              <polygon
                className={styles.cls5}
                points="801.4 64.43 767.91 64.43 767.91 63.25 800.25 63.25 800.25 54.32 769.06 54.32 769.06 55.33 767.91 55.33 767.91 49.99 769.06 49.99 769.06 53.02 813.26 53.02 813.26 54.32 801.4 54.32 801.4 64.43"
              />
              <rect className={styles.cls5} x="767.91" y="77.26" width="1.12" height="5.39" />
              <rect className={styles.cls5} x="767.91" y="94.57" width="1.12" height="8.26" />
              <rect
                className={styles.cls5}
                x="765.91"
                y="76.37"
                width="2"
                height="2.42"
                transform="translate(1533.83 155.17) rotate(180)"
              />
              <rect className={styles.cls5} x="795.92" y="78.47" width="1.81" height="23.67" />
            </g>
            <g id="ClosedSection" className={styles.opacity50}>
              <path className={styles.cls18} d="m692.47,181.25h-56.19v2.64h56.19v-2.64Z" />
              <path className={styles.cls18} d="m721.03,101.45h-80.79v2.64h80.79v-2.64Z" />
              <path className={styles.cls18} d="m694.85,83.93v49.23h2.64v-49.23h-2.64Z" />
              <path className={styles.cls18} d="m694.85,180.14v-28h2.64v28h-2.64Z" />
              <path className={styles.cls18} d="m745.1,101.45h-5.02v2.64h5.02v-2.64Z" />
              <path className={styles.cls18} d="m694.85,65.26v-20.37h2.64v20.37h-2.64Z" />
            </g>
            <g id="Machines">
              <rect className={styles.cls9} x="844.52" y="190.52" width="12.7" height="55.9" />
              <rect className={styles.cls9} x="844.52" y="114.71" width="12.7" height="55.9" />
              <rect className={styles.cls9} x="844.52" y="48.89" width="12.7" height="55.9" />
              <g>
                <rect className={styles.cls9} x="760.36" y="122.12" width="60.64" height="48.48" />
                <rect className={styles.cls9} x="760.36" y="146.75" width="4.73" height="23.86" />
                <rect className={styles.cls9} x="760.36" y="122.12" width="14.88" height="6.69" />
                <rect className={styles.cls9} x="760.36" y="128.82" width="14.88" height="7.93" />
                <rect className={styles.cls9} x="760.36" y="136.75" width="14.88" height="6.47" />
                <rect
                  className={styles.cls9}
                  x="775.24"
                  y="124.92"
                  width="17.93"
                  height="22.37"
                  transform="translate(1568.42 272.2) rotate(180)"
                />
                <rect
                  className={styles.cls9}
                  x="765.1"
                  y="152.94"
                  width="34.18"
                  height="17.67"
                  transform="translate(1564.37 323.54) rotate(180)"
                />
                <rect className={styles.cls9} x="800.36" y="122.12" width="20.65" height="48.48" />
              </g>
              <g>
                <rect className={styles.cls9} x="664.59" y="253.75" width="27.56" height="9.49" />
                <rect
                  className={styles.cls9}
                  x="656.79"
                  y="253.75"
                  width="7.79"
                  height="9.49"
                  transform="translate(1321.38 516.98) rotate(180)"
                />
                <rect className={styles.cls9} x="649.3" y="253.75" width="7.49" height="9.49" />
                <rect className={styles.cls9} x="682.03" y="209.93" width="11.16" height="8.93" />
                <rect className={styles.cls9} x="670.52" y="209.93" width="11.51" height="8.93" />
                <rect
                  className={styles.cls9}
                  x="659.08"
                  y="209.93"
                  width="11.44"
                  height="8.93"
                  transform="translate(1329.61 428.79) rotate(180)"
                />
                <rect className={styles.cls9} x="647.72" y="209.93" width="11.36" height="8.93" />
                <rect className={styles.cls9} x="648.36" y="201.16" width="44.84" height="8.77" />
                <rect className={styles.cls9} x="679.38" y="231.84" width="9.28" height="10.05" />
                <rect
                  className={styles.cls9}
                  x="658.6"
                  y="231.84"
                  width="18.81"
                  height="10.05"
                  transform="translate(1336.02 473.72) rotate(180)"
                />
                <rect
                  className={styles.cls9}
                  x="647.72"
                  y="235.96"
                  width="9.04"
                  height="5.93"
                  transform="translate(1304.49 477.84) rotate(180)"
                />
                <rect
                  className={styles.cls9}
                  x="647.72"
                  y="184.05"
                  width="11.86"
                  height="6.35"
                  transform="translate(1307.3 374.45) rotate(180)"
                />
                <rect className={styles.cls9} x="661.68" y="184.05" width="5" height="6.93" />
                <rect className={styles.cls9} x="683.86" y="184.05" width="7.81" height="5.13" />
              </g>
              <g>
                <rect className={styles.cls9} x="698.08" y="168.56" width="8.72" height="4.67" />
                <path
                  className={styles.cls9}
                  d="m699.15,173.23h6.56c0,.92-.75,1.66-1.66,1.66h-3.24c-.92,0-1.66-.75-1.66-1.66h0Z"
                />
                <rect className={styles.cls9} x="699.15" y="165.2" width="6.74" height="3.36" />
                <rect className={styles.cls9} x="698.74" y="158.31" width="8.23" height="6.89" />
                <path
                  className={styles.cls9}
                  d="m701.38,156.22h2.25c1.16,0,2.09.94,2.09,2.09h-6.43c0-1.16.94-2.09,2.09-2.09Z"
                />
              </g>
              <rect id="elev" className={styles.cls9} x="769.73" y="80.72" width="21.7" height="14.86" />
            </g>
            <g id="DOORS">
              <path
                className={styles.cls19}
                d="m741.81,277.05c.2,0,.35-.16.35-.35v-9.63c0-.2-.16-.35-.35-.35h-.1c-.2,0-.35.16-.35.35v9.26c-4.9-.3-8.72-4.33-8.72-9.26,0-.2-.16-.35-.35-.35s-.35.16-.35.35c0,5.37,4.21,9.76,9.57,9.99.04,0,.08,0,.12-.02.03,0,.06.02.09.02h.1-.01Z"
              />
              <path
                className={styles.cls19}
                d="m742.06,36.37h-.2s-.05,0-.08.02c-4.39.25-7.96,3.29-9.06,7.35-1.11-4.11-4.76-7.18-9.22-7.37-.03,0-.05.02-.08.03-.04-.02-.09-.03-.14-.03h-.2c-.2,0-.35.16-.35.35v9.45c0,.2.16.35.35.35h.2c.2,0,.35-.16.35-.35v-9.08c4.91.29,8.73,4.33,8.73,9.26,0,.2.16.35.35.35s.35-.16.35-.35c0-4.83,3.67-8.8,8.42-9.23v9.05c0,.2.16.35.35.35h.2c.2,0,.35-.16.35-.35v-9.45c0-.2-.16-.35-.35-.35h.03Z"
              />
              <path
                className={styles.cls19}
                d="m708.88,17.12v.2s0,.05.02.08c.25,4.39,3.29,7.96,7.35,9.06-4.11,1.11-7.18,4.76-7.37,9.22,0,.03.02.05.03.08-.02.04-.03.09-.03.14v.2c0,.2.16.35.35.35h9.45c.2,0,.35-.16.35-.35v-.2c0-.2-.16-.35-.35-.35h-9.08c.29-4.91,4.33-8.73,9.26-8.73.2,0,.35-.16.35-.35s-.16-.35-.35-.35c-4.83,0-8.8-3.67-9.23-8.42h9.05c.2,0,.35-.16.35-.35v-.2c0-.2-.16-.35-.35-.35h-9.45c-.2,0-.35.16-.35.35v-.03Z"
              />
              <path
                className={styles.cls19}
                d="m739.59,92.8h-.2s-.05,0-.08.02c-4.39.25-7.96,3.29-9.06,7.35-1.11-4.11-4.76-7.18-9.22-7.37-.03,0-.05.02-.08.03-.04-.02-.09-.03-.14-.03h-.2c-.2,0-.35.16-.35.35v9.45c0,.2.16.35.35.35h.2c.2,0,.35-.16.35-.35v-9.08c4.91.29,8.73,4.33,8.73,9.26,0,.2.16.35.35.35s.35-.16.35-.35c0-4.83,3.67-8.8,8.42-9.23v9.05c0,.2.16.35.35.35h.2c.2,0,.35-.16.35-.35v-9.45c0-.2-.16-.35-.35-.35h.03Z"
              />
              <path
                className={styles.cls19}
                d="m705.73,151.94v-.2s0-.05-.02-.08c-.25-4.39-3.29-7.96-7.35-9.06,4.11-1.11,7.18-4.76,7.37-9.22,0-.03-.02-.05-.03-.08.02-.04.03-.09.03-.14v-.2c0-.2-.16-.35-.35-.35h-9.45c-.2,0-.35.16-.35.35v.2c0,.2.16.35.35.35h9.08c-.29,4.91-4.33,8.73-9.26,8.73-.2,0-.35.16-.35.35s.16.35.35.35c4.83,0,8.8,3.67,9.23,8.42h-9.05c-.2,0-.35.16-.35.35v.2c0,.2.16.35.35.35h9.45c.2,0,.35-.16.35-.35v.03Z"
              />
              <path
                className={styles.cls19}
                d="m705.8,84.04v-.2s0-.05-.02-.08c-.25-4.39-3.29-7.96-7.35-9.06,4.11-1.11,7.18-4.76,7.37-9.22,0-.03-.02-.05-.03-.08.02-.04.03-.09.03-.14v-.2c0-.2-.16-.35-.35-.35h-9.45c-.2,0-.35.16-.35.35v.2c0,.2.16.35.35.35h9.08c-.29,4.91-4.33,8.73-9.26,8.73-.2,0-.35.16-.35.35s.16.35.35.35c4.83,0,8.8,3.67,9.23,8.42h-9.05c-.2,0-.35.16-.35.35v.2c0,.2.16.35.35.35h9.45c.2,0,.35-.16.35-.35v.03Z"
              />
              <path
                className={styles.cls19}
                d="m801.1,113.05c-.2,0-.35-.16-.35-.35v-9.63c0-.2.16-.35.35-.35h.1c.2,0,.35.16.35.35v9.26c4.9-.3,8.72-4.33,8.72-9.26,0-.2.16-.35.35-.35s.35.16.35.35c0,5.37-4.21,9.76-9.57,9.99-.04,0-.08,0-.12-.02-.03,0-.06.02-.09.02h-.1.01Z"
              />
            </g>
            <g id="Stairs">
              <polygon
                className={styles.cls14}
                points="768.82 64.47 768.82 76.4 812.8 76.4 812.8 42.23 770.52 42.23 770.52 52.93 801.49 52.93 801.49 64.47 768.82 64.47"
              />
              <line className={styles.cls14} x1="771.82" y1="64.47" x2="771.82" y2="76.4" />
              <line className={styles.cls14} x1="795.86" y1="64.47" x2="795.86" y2="76.4" />
              <line className={styles.cls14} x1="774.83" y1="64.47" x2="774.83" y2="76.4" />
              <line className={styles.cls14} x1="777.83" y1="64.47" x2="777.83" y2="76.4" />
              <line className={styles.cls14} x1="786.85" y1="64.47" x2="786.85" y2="76.4" />
              <line className={styles.cls14} x1="780.84" y1="64.47" x2="780.84" y2="76.4" />
              <line className={styles.cls14} x1="783.84" y1="64.47" x2="783.84" y2="76.4" />
              <line className={styles.cls14} x1="789.85" y1="64.47" x2="789.85" y2="76.4" />
              <line className={styles.cls14} x1="792.85" y1="64.47" x2="792.85" y2="76.4" />
              <line className={styles.cls14} x1="798.86" y1="64.47" x2="798.86" y2="76.4" />
              <line className={styles.cls14} x1="801.87" y1="64.47" x2="801.87" y2="76.4" />
              <line className={styles.cls14} x1="773.52" y1="42.23" x2="773.52" y2="52.93" />
              <line className={styles.cls14} x1="797.56" y1="42.23" x2="797.56" y2="52.93" />
              <line className={styles.cls14} x1="776.53" y1="42.23" x2="776.53" y2="52.93" />
              <line className={styles.cls14} x1="779.53" y1="42.23" x2="779.53" y2="52.93" />
              <line className={styles.cls14} x1="788.54" y1="42.23" x2="788.54" y2="52.93" />
              <line className={styles.cls14} x1="782.53" y1="42.23" x2="782.53" y2="52.93" />
              <line className={styles.cls14} x1="785.54" y1="42.23" x2="785.54" y2="52.93" />
              <line className={styles.cls14} x1="791.55" y1="42.23" x2="791.55" y2="52.93" />
              <line className={styles.cls14} x1="794.55" y1="42.23" x2="794.55" y2="52.93" />
              <line className={styles.cls14} x1="800.56" y1="42.23" x2="800.56" y2="52.93" />
              <line className={styles.cls14} x1="812.98" y1="64.84" x2="801.49" y2="64.84" />
              <line className={styles.cls14} x1="812.98" y1="61.86" x2="801.49" y2="61.86" />
              <line className={styles.cls14} x1="812.98" y1="58.89" x2="801.49" y2="58.89" />
              <line className={styles.cls14} x1="812.98" y1="55.91" x2="801.49" y2="55.91" />
              <line className={styles.cls14} x1="801.49" y1="52.93" x2="812.98" y2="52.93" />
              <polygon className={styles.cls12} points="772.47 43.75 772.47 51.42 769.91 47.58 772.47 43.75" />
              <polyline className={styles.cls4} points="767.56 70.43 807.24 70.43 807.24 47.58 772.53 47.58" />
            </g>
          </g>
          <g id="Dome">
            <line className={styles.cls5} x1="170.53" y1="192.71" x2="150.53" y2="192.71" />
            <line className={styles.cls5} x1="160.53" y1="202.71" x2="160.53" y2="182.71" />
            <path
              className={styles.cls7}
              d="m621.96,266.24l-328.92.47c-37.56,67.25-119.54,95.7-190.68,66.18C24.94,300.76-11.78,211.96,20.35,134.54,52.48,57.12,141.28,20.4,218.7,52.53l5.44-13.94h407.81"
            />
          </g>
          <g id="text">
            <g id="t1">
              <g>
                <text className={styles.smallText} transform="translate(655.89 60.51)">
                  <tspan x="0" y="0">
                    Camera
                  </tspan>
                  <tspan x="-7.91" y="7.2">
                    Maintenance
                  </tspan>
                  <tspan x="-8.13" y="14.4">
                    Refrigeration
                  </tspan>
                  <tspan x="-6.33" y="21.6">
                    Compressor
                  </tspan>
                  <tspan x="2.74" y="28.8">
                    Room
                  </tspan>
                </text>
              </g>
              <g>
                <text className={styles.smallText} transform="translate(751.25 193.67)">
                  <tspan x="0" y="0">
                    Mechanical
                  </tspan>
                  <tspan className={styles.cls46} x=".12" y="7.2">
                    Equipment
                  </tspan>
                  <tspan x="10.39" y="14.4">
                    Area
                  </tspan>
                </text>
              </g>
              <g>
                <text className={styles.smallText} transform="translate(721.67 68.98)">
                  <tspan x="0" y="0">
                    Entry
                  </tspan>
                  <tspan x="1.28" y="7.2">
                    Area
                  </tspan>
                </text>
              </g>
              <g>
                <text className={styles.smallText} transform="translate(658.91 128.19)">
                  <tspan x="0" y="0">
                    Utility
                  </tspan>
                  <tspan x="1.03" y="7.2">
                    Shop
                  </tspan>
                </text>
              </g>
              <g>
                <text className={styles.smallText} transform="translate(655.67 223.64)">
                  <tspan x="0" y="0">
                    Electrical
                  </tspan>
                  <tspan className={styles.cls46} x="-3.32" y="7.2">
                    Equipment
                  </tspan>
                  <tspan x="6.95" y="14.4">
                    Area
                  </tspan>
                </text>
              </g>
              <g>
                <text className={styles.smallText} transform="translate(647.23 296.73)">
                  <tspan className={styles.cls38} x="0" y="0">
                    Transformer
                  </tspan>
                  <tspan x="3.52" y="7.2">
                    Enclosure
                  </tspan>
                </text>
              </g>
              <g>
                <text className={styles.smallText} transform="translate(632.94 373.41)">
                  <tspan x="0" y="0">
                    Coatingg
                  </tspan>
                  <tspan className={styles.cls46} x="-5.28" y="7.2">
                    Equipment
                  </tspan>
                  <tspan className={styles.cls49} x="5.17" y="14.4">
                    Yard
                  </tspan>
                </text>
              </g>
              <g>
                <text className={styles.smallText} transform="translate(722.96 28.63)">
                  <tspan x="0" y="0">
                    Vestibule
                  </tspan>
                </text>
              </g>
            </g>
            <g id="t2" className={styles.opacity50}>
              <g>
                <text className={styles.text} transform="translate(852.29 228.04) rotate(-90)">
                  <tspan x="0" y="0">
                    Chiller 3
                  </tspan>
                </text>
                <text className={styles.text} transform="translate(852.29 228.04) rotate(-90)">
                  <tspan x="0" y="0">
                    Chiller 3
                  </tspan>
                </text>
              </g>
              <g>
                <text className={styles.text} transform="translate(792.82 211.19)">
                  <tspan x="0" y="0">
                    Process Air
                  </tspan>
                  <tspan x="-2.1" y="4.8">
                    Compressors
                  </tspan>
                </text>
              </g>
              <g>
                <text className={styles.text} transform="translate(774.92 59.94)">
                  <tspan x="0" y="0">
                    Wet Shaft
                  </tspan>
                </text>
              </g>
              <g>
                <text className={styles.text} transform="translate(771.05 162.47)">
                  <tspan x="0" y="0">
                    OSS Equip
                  </tspan>
                </text>
              </g>
              <g>
                <text className={styles.text} transform="translate(852.29 85.68) rotate(-90)">
                  <tspan x="0" y="0">
                    Chiller 1
                  </tspan>
                </text>
                <text className={styles.text} transform="translate(852.29 85.68) rotate(-90)">
                  <tspan x="0" y="0">
                    Chiller 1
                  </tspan>
                </text>
              </g>
              <g>
                <text className={styles.text} transform="translate(802.06 92.28)">
                  <tspan x="0" y="0">
                    Dry
                  </tspan>
                  <tspan x="-1.69" y="4.8">
                    Shaft
                  </tspan>
                </text>
              </g>
              <g>
                <text className={styles.text} transform="translate(774.48 87.54)">
                  <tspan x="0" y="0">
                    Elev. 1
                  </tspan>
                </text>
              </g>
              <g>
                <text className={styles.text} transform="translate(711.54 176.07) rotate(-90)">
                  <tspan x="0" y="0">
                    Service Air
                  </tspan>
                  <tspan x="-1.61" y="4.8">
                    Compressor
                  </tspan>
                </text>
              </g>
              <g>
                <text className={styles.text} transform="translate(852.29 152.06) rotate(-90)">
                  <tspan x="0" y="0">
                    Chiller 2
                  </tspan>
                </text>
                <text className={styles.text} transform="translate(852.29 152.06) rotate(-90)">
                  <tspan x="0" y="0">
                    Chiller 2
                  </tspan>
                </text>
              </g>
            </g>
          </g>
        </g>

        <rect id={this.overlayId} pointerEvents="all" fill="none" width="882.42" height="461.23" />

        <g id={this.deviceId}>{!this.props.hideHVAC && this.getDevices()}</g>
        {zoomLevel > 1 && (
          <g className={styles.zoomOut} transform="translate(808 10)">
            <rect onClick={this.zoomOut} className={styles.zoomOutButton} width="64" height="21" rx="4" />
            <text onClick={this.zoomOut} className={styles.zoomOutText}>
              <tspan x="10" y="13">
                Zoom out
              </tspan>
            </text>
          </g>
        )}
      </React.Fragment>
    );
  }
}
