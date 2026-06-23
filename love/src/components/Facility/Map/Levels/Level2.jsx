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
import lodash from 'lodash';
import PropTypes from 'prop-types';
import styles from './Level2.module.css';
import Device from '../Device.jsx';
import * as d3 from 'd3';
import { operatingModeStateMap, unitStateMap, unitStateBooleanMap } from 'Config';

export default class Level2 extends Component {
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

  getDevices() {
    const {
      crac01,
      crac02,
      fancoilUnit01ITOffice,
      fancoilUnit02BreakRoom,
      fancoilUnit03ControlRoom,
      fancoilUnit04ControlRoom,
      fancoilUnit05ControlRoom,
      fancoilUnit06ManagersOffice,
      fancoilUnit07SafetyOffice,
      fancoilUnit08ElectricalOffice,
      fancoilUnit09MeetingRoom,
      fancoilUnit10WorkRoom,
      fancoilUnit11WorkRoom,
    } = this.props.HVACData;

    return (
      <React.Fragment>
        <Device
          title={'Fancoil 02'}
          temp={fancoilUnit02BreakRoom.roomTemperature ? fancoilUnit02BreakRoom.roomTemperature.value : null}
          width={84}
          height={112}
          posX={620}
          posY={146}
          collapsible={true}
          states={{
            command: fancoilUnit02BreakRoom.switchedOn ? fancoilUnit02BreakRoom.switchedOn.value : null,
            working: fancoilUnit02BreakRoom.workingState ? fancoilUnit02BreakRoom.workingState.value : null,
            unit: fancoilUnit02BreakRoom.unitState ? fancoilUnit02BreakRoom.unitState.value : null,
            switch: fancoilUnit02BreakRoom.selectorState ? fancoilUnit02BreakRoom.selectorState.value : null,
          }}
          parameters={{
            heatingState: {
              type: 'status',
              name: 'Heater',
              unit: null,
              value: fancoilUnit02BreakRoom.heatingState ? fancoilUnit02BreakRoom.heatingState.value : null,
            },
            operationalState: {
              type: 'status',
              name: 'Operation',
              unit: null,
              value: fancoilUnit02BreakRoom.operationalState ? fancoilUnit02BreakRoom.operationalState.value : null,
            },
            fanState: {
              type: 'status',
              name: 'Fan',
              unit: null,
              value: fancoilUnit02BreakRoom.fanState ? fancoilUnit02BreakRoom.fanState.value : null,
            },
            coldValveOpening: {
              type: 'single',
              name: 'Opening Valve Cold',
              unit: fancoilUnit02BreakRoom.coldValveOpening ? fancoilUnit02BreakRoom.coldValveOpening.units : null,
              value: fancoilUnit02BreakRoom.coldValveOpening ? fancoilUnit02BreakRoom.coldValveOpening.value : null,
            },
            roomTemperature: {
              type: 'single',
              name: 'Temperature Room',
              unit: fancoilUnit02BreakRoom.roomTemperature ? 'ºC' : null,
              value: fancoilUnit02BreakRoom.roomTemperature ? fancoilUnit02BreakRoom.roomTemperature.value : null,
            },
            setpointDay: {
              type: 'group',
              name: 'Setpoint Day',
              unit: null,
              value: null,
              params: {
                dayCoolingSetpoint: {
                  type: 'noBox',
                  alarm: null,
                  name: 'Cooling',
                  state: null,
                  unit: fancoilUnit02BreakRoom.dayCoolingSetpoint ? 'ºC' : null,
                  value: fancoilUnit02BreakRoom.dayCoolingSetpoint
                    ? fancoilUnit02BreakRoom.dayCoolingSetpoint.value
                    : null,
                },
                dayHeatingSetpoint: {
                  type: 'noBox',
                  alarm: null,
                  name: 'Heating',
                  state: null,
                  unit: fancoilUnit02BreakRoom.dayHeatingSetpoint ? 'ºC' : null,
                  value: fancoilUnit02BreakRoom.dayHeatingSetpoint
                    ? fancoilUnit02BreakRoom.dayHeatingSetpoint.value
                    : null,
                },
              },
            },
            setpointNight: {
              type: 'group',
              name: 'Setpoint Night',
              unit: null,
              value: null,
              params: {
                nightCoolingSetpoint: {
                  type: 'noBox',
                  alarm: null,
                  name: 'Cooling',
                  state: null,
                  unit: fancoilUnit02BreakRoom.nightCoolingSetpoint ? 'ºC' : null,
                  value: fancoilUnit02BreakRoom.nightCoolingSetpoint
                    ? fancoilUnit02BreakRoom.nightCoolingSetpoint.value
                    : null,
                },
                nightHeatingSetpoint: {
                  type: 'noBox',
                  alarm: null,
                  name: 'Heating',
                  state: null,
                  unit: fancoilUnit02BreakRoom.nightHeatingSetpoint ? 'ºC' : null,
                  value: fancoilUnit02BreakRoom.nightHeatingSetpoint
                    ? fancoilUnit02BreakRoom.nightHeatingSetpoint.value
                    : null,
                },
              },
            },
          }}
        />

        <Device
          title={'Fancoil 01'}
          temp={fancoilUnit01ITOffice.roomTemperature ? fancoilUnit01ITOffice.roomTemperature.value : null}
          width={84}
          height={112}
          posX={632}
          posY={92}
          collapsible={true}
          states={{
            command: fancoilUnit01ITOffice.switchedOn ? fancoilUnit01ITOffice.switchedOn.value : null,
            working: fancoilUnit01ITOffice.workingState ? fancoilUnit01ITOffice.workingState.value : null,
            unit: fancoilUnit01ITOffice.unitState ? fancoilUnit01ITOffice.unitState.value : null,
            switch: fancoilUnit01ITOffice.selectorState ? fancoilUnit01ITOffice.selectorState.value : null,
          }}
          parameters={{
            heatingState: {
              type: 'status',
              name: 'Heater',
              unit: null,
              value: fancoilUnit01ITOffice.heatingState ? fancoilUnit01ITOffice.heatingState.value : null,
            },
            operationalState: {
              type: 'status',
              name: 'Operation',
              unit: null,
              value: fancoilUnit01ITOffice.operationalState ? fancoilUnit01ITOffice.operationalState.value : null,
            },
            fanState: {
              type: 'status',
              name: 'Fan',
              unit: null,
              value: fancoilUnit01ITOffice.fanState ? fancoilUnit01ITOffice.fanState.value : null,
            },
            coldValveOpening: {
              type: 'single',
              name: 'Opening Valve Cold',
              unit: fancoilUnit01ITOffice.coldValveOpening ? fancoilUnit01ITOffice.coldValveOpening.units : null,
              value: fancoilUnit01ITOffice.coldValveOpening ? fancoilUnit01ITOffice.coldValveOpening.value : null,
            },
            roomTemperature: {
              type: 'single',
              name: 'Temperature Room',
              unit: fancoilUnit01ITOffice.roomTemperature ? 'ºC' : null,
              value: fancoilUnit01ITOffice.roomTemperature ? fancoilUnit01ITOffice.roomTemperature.value : null,
            },
            setpointDay: {
              type: 'group',
              name: 'Setpoint Day',
              unit: null,
              value: null,
              params: {
                dayCoolingSetpoint: {
                  type: 'noBox',
                  alarm: null,
                  name: 'Cooling',
                  state: null,
                  unit: fancoilUnit01ITOffice.dayCoolingSetpoint ? 'ºC' : null,
                  value: fancoilUnit01ITOffice.dayCoolingSetpoint
                    ? fancoilUnit01ITOffice.dayCoolingSetpoint.value
                    : null,
                },
                dayHeatingSetpoint: {
                  type: 'noBox',
                  alarm: null,
                  name: 'Heating',
                  state: null,
                  unit: fancoilUnit01ITOffice.dayHeatingSetpoint ? 'ºC' : null,
                  value: fancoilUnit01ITOffice.dayHeatingSetpoint
                    ? fancoilUnit01ITOffice.dayHeatingSetpoint.value
                    : null,
                },
              },
            },
            setpointNight: {
              type: 'group',
              name: 'Setpoint Night',
              unit: null,
              value: null,
              params: {
                nightCoolingSetpoint: {
                  type: 'noBox',
                  alarm: null,
                  name: 'Cooling',
                  state: null,
                  unit: fancoilUnit01ITOffice.nightCoolingSetpoint ? 'ºC' : null,
                  value: fancoilUnit01ITOffice.nightCoolingSetpoint
                    ? fancoilUnit01ITOffice.nightCoolingSetpoint.value
                    : null,
                },
                nightHeatingSetpoint: {
                  type: 'noBox',
                  alarm: null,
                  name: 'Heating',
                  state: null,
                  unit: fancoilUnit01ITOffice.nightHeatingSetpoint ? 'ºC' : null,
                  value: fancoilUnit01ITOffice.nightHeatingSetpoint
                    ? fancoilUnit01ITOffice.nightHeatingSetpoint.value
                    : null,
                },
              },
            },
          }}
        />

        <Device
          title={'CRAC 02'}
          width={110}
          height={130}
          posX={612}
          posY={45}
          collapsible={true}
          alarms={{
            alarm1: {
              name: 'State Presence',
              state: crac02.alarmPresentState ? crac02.alarmPresentState.value : null,
            },
          }}
          states={{
            command: crac02.switchedOn ? crac02.switchedOn.value : null,
            working: crac02.workingState ? crac02.workingState.value : null,
            unit: crac02.unitState ? unitStateBooleanMap[unitStateMap[crac02.unitState.value]] : null,
            switch: null,
          }}
          parameters={{
            unitOperationalMode: {
              type: 'text',
              name: 'Mode of Operation',
              unit: null,
              value: crac02.operationalMode ? operatingModeStateMap[crac02.operationalMode.value] : null,
            },
            valveOpening: {
              type: 'single',
              name: 'Opening Valve',
              unit: crac02.valveOpening ? crac02.valveOpening.units : null,
              value: crac02.valveOpening ? crac02.valveOpening.value : null,
            },
            roomHumidity: {
              type: 'single',
              name: 'Room Humidity',
              unit: crac02.roomHumidity ? crac02.roomHumidity.units : null,
              value: crac02.roomHumidity ? crac02.roomHumidity.value : null,
            },
            humidifierRequirement: {
              type: 'single',
              name: 'Requirement Humidifier',
              unit: crac02.humidifierRequirement ? crac02.humidifierRequirement.units : null,
              value: crac02.humidifierRequirement ? crac02.humidifierRequirement.value : null,
            },
            hourMeasure: {
              type: 'single',
              name: 'Running Hours',
              unit: crac02.hourMeasure ? crac02.hourMeasure.units : null,
              value: crac02.hourMeasure ? crac02.hourMeasure.value : null,
            },
            numberOfCircuits: {
              type: 'single',
              name: 'Number Circuits',
              unit: null,
              value: crac02.numberOfCircuits ? crac02.numberOfCircuits.value : null,
            },
            setpoint: {
              type: 'group',
              name: 'Setpoint Temperature',
              unit: null,
              value: null,
              params: {
                coolingSetpoint: {
                  type: 'noBox',
                  alarm: null,
                  name: 'Cooling',
                  state: null,
                  unit: crac02.coolingSetpoint ? '°C' : null,
                  value: crac02.coolingSetpoint ? crac02.coolingSetpoint.value : null,
                },
                heatingSetpoint: {
                  type: 'noBox',
                  alarm: null,
                  name: 'Heating',
                  state: null,
                  unit: crac02.heatingSetpoint ? '°C' : null,
                  value: crac02.heatingSetpoint ? crac02.heatingSetpoint.value : null,
                },
                humidifierSetpoint: {
                  type: 'noBox',
                  alarm: null,
                  name: 'Humidifier',
                  state: null,
                  unit: crac02.humidifierSetpoint ? '%' : null,
                  value: crac02.humidifierSetpoint ? crac02.humidifierSetpoint.value : null,
                },
                dehumidifierSetpoint: {
                  type: 'noBox',
                  alarm: null,
                  name: 'Dehumidifier',
                  state: null,
                  unit: crac02.dehumidifierSetpoint ? '%' : null,
                  value: crac02.dehumidifierSetpoint ? crac02.dehumidifierSetpoint.value : null,
                },
              },
            },
            temperatura: {
              type: 'group',
              name: 'Temperature',
              unit: null,
              value: null,
              params: {
                supplyTemperature: {
                  type: 'badge',
                  alarm: null,
                  name: 'Cooling',
                  state: null,
                  unit: crac02.supplyTemperature ? '°C Supply' : null,
                  value: crac02.supplyTemperature ? crac02.supplyTemperature.value : null,
                },
                returnTemperature: {
                  type: 'badge',
                  alarm: null,
                  name: '02',
                  state: null,
                  unit: crac02.returnTemperature ? '°C Return' : null,
                  value: crac02.returnTemperature ? crac02.returnTemperature.value : null,
                },
              },
            },
          }}
        />

        <Device
          title={'CRAC 01'}
          width={110}
          height={130}
          posX={612}
          posY={12}
          collapsible={true}
          alarms={{
            alarm1: {
              name: 'State Presence',
              state: crac01.alarmPresentState ? crac01.alarmPresentState.value : null,
            },
          }}
          states={{
            command: crac01.switchedOn ? crac01.switchedOn.value : null,
            working: crac01.workingState ? crac01.workingState.value : null,
            unit: crac01.unitState ? unitStateBooleanMap[unitStateMap[crac01.unitState.value]] : null,
            switch: null,
          }}
          parameters={{
            unitOperationalMode: {
              type: 'text',
              name: 'Mode of Operation',
              unit: null,
              value: crac01.operationalMode ? operatingModeStateMap[crac01.operationalMode.value] : null,
            },
            valveOpening: {
              type: 'single',
              name: 'Opening Valve',
              unit: crac01.valveOpening ? crac01.valveOpening.units : null,
              value: crac01.valveOpening ? crac01.valveOpening.value : null,
            },
            roomHumidity: {
              type: 'single',
              name: 'Room Humidity',
              unit: crac01.roomHumidity ? crac01.roomHumidity.units : null,
              value: crac01.roomHumidity ? crac01.roomHumidity.value : null,
            },
            humidifierRequirement: {
              type: 'single',
              name: 'Requirement Humidifier',
              unit: crac01.humidifierRequirement ? crac01.humidifierRequirement.units : null,
              value: crac01.humidifierRequirement ? crac01.humidifierRequirement.value : null,
            },
            hourMeasure: {
              type: 'single',
              name: 'Running Hours',
              unit: crac01.hourMeasure ? crac01.hourMeasure.units : null,
              value: crac01.hourMeasure ? crac01.hourMeasure.value : null,
            },
            numberOfCircuits: {
              type: 'single',
              name: 'Number Circuits',
              unit: null,
              value: crac01.numberOfCircuits ? crac01.numberOfCircuits.value : null,
            },
            setpoint: {
              type: 'group',
              name: 'Setpoint Temperature',
              unit: null,
              value: null,
              params: {
                coolingSetpoint: {
                  type: 'noBox',
                  alarm: null,
                  name: 'Cooling',
                  state: null,
                  unit: crac01.coolingSetpoint ? '°C' : null,
                  value: crac01.coolingSetpoint ? crac01.coolingSetpoint.value : null,
                },
                heatingSetpoint: {
                  type: 'noBox',
                  alarm: null,
                  name: 'Heating',
                  state: null,
                  unit: crac01.heatingSetpoint ? '°C' : null,
                  value: crac01.heatingSetpoint ? crac01.heatingSetpoint.value : null,
                },
                humidifierSetpoint: {
                  type: 'noBox',
                  alarm: null,
                  name: 'Humidifier',
                  state: null,
                  unit: crac01.humidifierSetpoint ? '%' : null,
                  value: crac01.humidifierSetpoint ? crac01.humidifierSetpoint.value : null,
                },
                dehumidifierSetpoint: {
                  type: 'noBox',
                  alarm: null,
                  name: 'Dehumidifier',
                  state: null,
                  unit: crac01.dehumidifierSetpoint ? '%' : null,
                  value: crac01.dehumidifierSetpoint ? crac01.dehumidifierSetpoint.value : null,
                },
              },
            },
            temperatura: {
              type: 'group',
              name: 'Temperature',
              unit: null,
              value: null,
              params: {
                supplyTemperature: {
                  type: 'badge',
                  alarm: null,
                  name: 'Cooling',
                  state: null,
                  unit: crac01.supplyTemperature ? '°C Supply' : null,
                  value: crac01.supplyTemperature ? crac01.supplyTemperature.value : null,
                },
                returnTemperature: {
                  type: 'badge',
                  alarm: null,
                  name: '02',
                  state: null,
                  unit: crac01.returnTemperature ? '°C Return' : null,
                  value: crac01.returnTemperature ? crac01.returnTemperature.value : null,
                },
              },
            },
          }}
        />

        <Device
          title={'Fancoil 05'}
          temp={fancoilUnit05ControlRoom.roomTemperature ? fancoilUnit05ControlRoom.roomTemperature.value : null}
          width={84}
          height={112}
          posX={800}
          posY={165}
          alarm={0}
          collapsible={true}
          states={{
            command: fancoilUnit05ControlRoom.switchedOn ? fancoilUnit05ControlRoom.switchedOn.value : null,
            working: fancoilUnit05ControlRoom.workingState ? fancoilUnit05ControlRoom.workingState.value : null,
            unit: fancoilUnit05ControlRoom.unitState ? fancoilUnit05ControlRoom.unitState.value : null,
            switch: fancoilUnit05ControlRoom.selectorState ? fancoilUnit05ControlRoom.selectorState.value : null,
          }}
          parameters={{
            heatingState: {
              type: 'status',
              name: 'Heater',
              unit: null,
              value: fancoilUnit05ControlRoom.heatingState ? fancoilUnit05ControlRoom.heatingState.value : null,
            },
            operationalState: {
              type: 'status',
              name: 'Operation',
              unit: null,
              value: fancoilUnit05ControlRoom.operationalState ? fancoilUnit05ControlRoom.operationalState.value : null,
            },
            fanState: {
              type: 'status',
              name: 'Fan',
              unit: null,
              value: fancoilUnit05ControlRoom.fanState ? fancoilUnit05ControlRoom.fanState.value : null,
            },
            coldValveOpening: {
              type: 'single',
              name: 'Opening Valve Cold',
              unit: fancoilUnit05ControlRoom.coldValveOpening ? fancoilUnit05ControlRoom.coldValveOpening.units : null,
              value: fancoilUnit05ControlRoom.coldValveOpening ? fancoilUnit05ControlRoom.coldValveOpening.value : null,
            },
            roomTemperature: {
              type: 'single',
              name: 'Temperature Room',
              unit: fancoilUnit05ControlRoom.roomTemperature ? 'ºC' : null,
              value: fancoilUnit05ControlRoom.roomTemperature ? fancoilUnit05ControlRoom.roomTemperature.value : null,
            },
            setpointDay: {
              type: 'group',
              name: 'Setpoint Day',
              unit: null,
              value: null,
              params: {
                dayCoolingSetpoint: {
                  type: 'noBox',
                  alarm: null,
                  name: 'Cooling',
                  state: null,
                  unit: fancoilUnit05ControlRoom.dayCoolingSetpoint ? 'ºC' : null,
                  value: fancoilUnit05ControlRoom.dayCoolingSetpoint
                    ? fancoilUnit05ControlRoom.dayCoolingSetpoint.value
                    : null,
                },
                dayHeatingSetpoint: {
                  type: 'noBox',
                  alarm: null,
                  name: 'Heating',
                  state: null,
                  unit: fancoilUnit05ControlRoom.dayHeatingSetpoint ? 'ºC' : null,
                  value: fancoilUnit05ControlRoom.dayHeatingSetpoint
                    ? fancoilUnit05ControlRoom.dayHeatingSetpoint.value
                    : null,
                },
              },
            },
            setpointNight: {
              type: 'group',
              name: 'Setpoint Night',
              unit: null,
              value: null,
              params: {
                nightCoolingSetpoint: {
                  type: 'noBox',
                  alarm: null,
                  name: 'Cooling',
                  state: null,
                  unit: fancoilUnit05ControlRoom.nightCoolingSetpoint ? 'ºC' : null,
                  value: fancoilUnit05ControlRoom.nightCoolingSetpoint
                    ? fancoilUnit05ControlRoom.nightCoolingSetpoint.value
                    : null,
                },
                nightHeatingSetpoint: {
                  type: 'noBox',
                  alarm: null,
                  name: 'Heating',
                  state: null,
                  unit: fancoilUnit05ControlRoom.nightHeatingSetpoint ? 'ºC' : null,
                  value: fancoilUnit05ControlRoom.nightHeatingSetpoint
                    ? fancoilUnit05ControlRoom.nightHeatingSetpoint.value
                    : null,
                },
              },
            },
          }}
        />

        <Device
          title={'Fancoil 08'}
          temp={
            fancoilUnit08ElectricalOffice.roomTemperature ? fancoilUnit08ElectricalOffice.roomTemperature.value : null
          }
          width={84}
          height={112}
          posX={800}
          posY={145}
          alarm={0}
          collapsible={true}
          states={{
            command: fancoilUnit08ElectricalOffice.switchedOn ? fancoilUnit08ElectricalOffice.switchedOn.value : null,
            working: fancoilUnit08ElectricalOffice.workingState
              ? fancoilUnit08ElectricalOffice.workingState.value
              : null,
            unit: fancoilUnit08ElectricalOffice.unitState ? fancoilUnit08ElectricalOffice.unitState.value : null,
            switch: fancoilUnit08ElectricalOffice.selectorState
              ? fancoilUnit08ElectricalOffice.selectorState.value
              : null,
          }}
          parameters={{
            heatingState: {
              type: 'status',
              name: 'Heater',
              unit: null,
              value: fancoilUnit08ElectricalOffice.heatingState
                ? fancoilUnit08ElectricalOffice.heatingState.value
                : null,
            },
            operationalState: {
              type: 'status',
              name: 'Operation',
              unit: null,
              value: fancoilUnit08ElectricalOffice.operationalState
                ? fancoilUnit08ElectricalOffice.operationalState.value
                : null,
            },
            fanState: {
              type: 'status',
              name: 'Fan',
              unit: null,
              value: fancoilUnit08ElectricalOffice.fanState ? fancoilUnit08ElectricalOffice.fanState.value : null,
            },
            coldValveOpening: {
              type: 'single',
              name: 'Opening Valve Cold',
              unit: fancoilUnit08ElectricalOffice.coldValveOpening
                ? fancoilUnit08ElectricalOffice.coldValveOpening.units
                : null,
              value: fancoilUnit08ElectricalOffice.coldValveOpening
                ? fancoilUnit08ElectricalOffice.coldValveOpening.value
                : null,
            },
            roomTemperature: {
              type: 'single',
              name: 'Temperature Room',
              unit: fancoilUnit08ElectricalOffice.roomTemperature ? 'ºC' : null,
              value: fancoilUnit08ElectricalOffice.roomTemperature
                ? fancoilUnit08ElectricalOffice.roomTemperature.value
                : null,
            },
            setpointDay: {
              type: 'group',
              name: 'Setpoint Day',
              unit: null,
              value: null,
              params: {
                dayCoolingSetpoint: {
                  type: 'noBox',
                  alarm: null,
                  name: 'Cooling',
                  state: null,
                  unit: fancoilUnit08ElectricalOffice.dayCoolingSetpoint ? 'ºC' : null,
                  value: fancoilUnit08ElectricalOffice.dayCoolingSetpoint
                    ? fancoilUnit08ElectricalOffice.dayCoolingSetpoint.value
                    : null,
                },
                dayHeatingSetpoint: {
                  type: 'noBox',
                  alarm: null,
                  name: 'Heating',
                  state: null,
                  unit: fancoilUnit08ElectricalOffice.dayHeatingSetpoint ? 'ºC' : null,
                  value: fancoilUnit08ElectricalOffice.dayHeatingSetpoint
                    ? fancoilUnit08ElectricalOffice.dayHeatingSetpoint.value
                    : null,
                },
              },
            },
            setpointNight: {
              type: 'group',
              name: 'Setpoint Night',
              unit: null,
              value: null,
              params: {
                nightCoolingSetpoint: {
                  type: 'noBox',
                  alarm: null,
                  name: 'Cooling',
                  state: null,
                  unit: fancoilUnit08ElectricalOffice.nightCoolingSetpoint ? 'ºC' : null,
                  value: fancoilUnit08ElectricalOffice.nightCoolingSetpoint
                    ? fancoilUnit08ElectricalOffice.nightCoolingSetpoint.value
                    : null,
                },
                nightHeatingSetpoint: {
                  type: 'noBox',
                  alarm: null,
                  name: 'Heating',
                  state: null,
                  unit: fancoilUnit08ElectricalOffice.nightHeatingSetpoint ? 'ºC' : null,
                  value: fancoilUnit08ElectricalOffice.nightHeatingSetpoint
                    ? fancoilUnit08ElectricalOffice.nightHeatingSetpoint.value
                    : null,
                },
              },
            },
          }}
        />

        <Device
          title={'Fancoil 07'}
          temp={fancoilUnit07SafetyOffice.roomTemperature ? fancoilUnit07SafetyOffice.roomTemperature.value : null}
          width={84}
          height={122}
          posX={800}
          posY={110}
          alarm={0}
          collapsible={true}
          states={{
            command: fancoilUnit07SafetyOffice.switchedOn ? fancoilUnit07SafetyOffice.switchedOn.value : null,
            working: fancoilUnit07SafetyOffice.workingState ? fancoilUnit07SafetyOffice.workingState.value : null,
            unit: fancoilUnit07SafetyOffice.unitState ? fancoilUnit07SafetyOffice.unitState.value : null,
            switch: fancoilUnit07SafetyOffice.selectorState ? fancoilUnit07SafetyOffice.selectorState.value : null,
          }}
          parameters={{
            heatingState: {
              type: 'status',
              name: 'Heater',
              unit: null,
              value: fancoilUnit07SafetyOffice.heatingState ? fancoilUnit07SafetyOffice.heatingState.value : null,
            },
            operationalState: {
              type: 'status',
              name: 'Operation',
              unit: null,
              value: fancoilUnit07SafetyOffice.operationalState
                ? fancoilUnit07SafetyOffice.operationalState.value
                : null,
            },
            fanState: {
              type: 'status',
              name: 'Fan',
              unit: null,
              value: fancoilUnit07SafetyOffice.fanState ? fancoilUnit07SafetyOffice.fanState.value : null,
            },
            coldValveOpening: {
              type: 'single',
              name: 'Opening Valve Cold',
              unit: fancoilUnit07SafetyOffice.coldValveOpening
                ? fancoilUnit07SafetyOffice.coldValveOpening.units
                : null,
              value: fancoilUnit07SafetyOffice.coldValveOpening
                ? fancoilUnit07SafetyOffice.coldValveOpening.value
                : null,
            },
            roomTemperature: {
              type: 'single',
              name: 'Temperature Room',
              unit: fancoilUnit07SafetyOffice.roomTemperature ? 'ºC' : null,
              value: fancoilUnit07SafetyOffice.roomTemperature ? fancoilUnit07SafetyOffice.roomTemperature.value : null,
            },
            setpointDay: {
              type: 'group',
              name: 'Setpoint Day',
              unit: null,
              value: null,
              params: {
                dayCoolingSetpoint: {
                  type: 'noBox',
                  alarm: null,
                  name: 'Cooling',
                  state: null,
                  unit: fancoilUnit07SafetyOffice.dayCoolingSetpoint ? 'ºC' : null,
                  value: fancoilUnit07SafetyOffice.dayCoolingSetpoint
                    ? fancoilUnit07SafetyOffice.dayCoolingSetpoint.value
                    : null,
                },
                dayHeatingSetpoint: {
                  type: 'noBox',
                  alarm: null,
                  name: 'Heating',
                  state: null,
                  unit: fancoilUnit07SafetyOffice.dayHeatingSetpoint ? 'ºC' : null,
                  value: fancoilUnit07SafetyOffice.dayHeatingSetpoint
                    ? fancoilUnit07SafetyOffice.dayHeatingSetpoint.value
                    : null,
                },
              },
            },
            setpointNight: {
              type: 'group',
              name: 'Setpoint Night',
              unit: null,
              value: null,
              params: {
                nightCoolingSetpoint: {
                  type: 'noBox',
                  alarm: null,
                  name: 'Cooling',
                  state: null,
                  unit: fancoilUnit07SafetyOffice.nightCoolingSetpoint ? 'ºC' : null,
                  value: fancoilUnit07SafetyOffice.nightCoolingSetpoint
                    ? fancoilUnit07SafetyOffice.nightCoolingSetpoint.value
                    : null,
                },
                nightHeatingSetpoint: {
                  type: 'noBox',
                  alarm: null,
                  name: 'Heating',
                  state: null,
                  unit: fancoilUnit07SafetyOffice.nightHeatingSetpoint ? 'ºC' : null,
                  value: fancoilUnit07SafetyOffice.nightHeatingSetpoint
                    ? fancoilUnit07SafetyOffice.nightHeatingSetpoint.value
                    : null,
                },
              },
            },
          }}
        />

        <Device
          title={'Fancoil 03'}
          temp={fancoilUnit03ControlRoom.roomTemperature ? fancoilUnit03ControlRoom.roomTemperature.value : null}
          width={84}
          height={112}
          posX={682}
          posY={165}
          alarm={0}
          collapsible={true}
          states={{
            command: fancoilUnit03ControlRoom.switchedOn ? fancoilUnit03ControlRoom.switchedOn.value : null,
            working: fancoilUnit03ControlRoom.workingState ? fancoilUnit03ControlRoom.workingState.value : null,
            unit: fancoilUnit03ControlRoom.unitState ? fancoilUnit03ControlRoom.unitState.value : null,
            switch: fancoilUnit03ControlRoom.selectorState ? fancoilUnit03ControlRoom.selectorState.value : null,
          }}
          parameters={{
            heatingState: {
              type: 'status',
              name: 'Heater',
              unit: null,
              value: fancoilUnit03ControlRoom.heatingState ? fancoilUnit03ControlRoom.heatingState.value : null,
            },
            operationalState: {
              type: 'status',
              name: 'Operation',
              unit: null,
              value: fancoilUnit03ControlRoom.operationalState ? fancoilUnit03ControlRoom.operationalState.value : null,
            },
            fanState: {
              type: 'status',
              name: 'Fan',
              unit: null,
              value: fancoilUnit03ControlRoom.fanState ? fancoilUnit03ControlRoom.fanState.value : null,
            },
            coldValveOpening: {
              type: 'single',
              name: 'Opening Valve Cold',
              unit: fancoilUnit03ControlRoom.coldValveOpening ? fancoilUnit03ControlRoom.coldValveOpening.units : null,
              value: fancoilUnit03ControlRoom.coldValveOpening ? fancoilUnit03ControlRoom.coldValveOpening.value : null,
            },
            roomTemperature: {
              type: 'single',
              name: 'Temperature Room',
              unit: fancoilUnit03ControlRoom.roomTemperature ? 'ºC' : null,
              value: fancoilUnit03ControlRoom.roomTemperature ? fancoilUnit03ControlRoom.roomTemperature.value : null,
            },
            setpointDay: {
              type: 'group',
              name: 'Setpoint Day',
              unit: null,
              value: null,
              params: {
                dayCoolingSetpoint: {
                  type: 'noBox',
                  alarm: null,
                  name: 'Cooling',
                  state: null,
                  unit: fancoilUnit03ControlRoom.dayCoolingSetpoint ? 'ºC' : null,
                  value: fancoilUnit03ControlRoom.dayCoolingSetpoint
                    ? fancoilUnit03ControlRoom.dayCoolingSetpoint.value
                    : null,
                },
                dayHeatingSetpoint: {
                  type: 'noBox',
                  alarm: null,
                  name: 'Heating',
                  state: null,
                  unit: fancoilUnit03ControlRoom.dayHeatingSetpoint ? 'ºC' : null,
                  value: fancoilUnit03ControlRoom.dayHeatingSetpoint
                    ? fancoilUnit03ControlRoom.dayHeatingSetpoint.value
                    : null,
                },
              },
            },
            setpointNight: {
              type: 'group',
              name: 'Setpoint Night',
              unit: null,
              value: null,
              params: {
                nightCoolingSetpoint: {
                  type: 'noBox',
                  alarm: null,
                  name: 'Cooling',
                  state: null,
                  unit: fancoilUnit03ControlRoom.nightCoolingSetpoint ? 'ºC' : null,
                  value: fancoilUnit03ControlRoom.nightCoolingSetpoint
                    ? fancoilUnit03ControlRoom.nightCoolingSetpoint.value
                    : null,
                },
                nightHeatingSetpoint: {
                  type: 'noBox',
                  alarm: null,
                  name: 'Heating',
                  state: null,
                  unit: fancoilUnit03ControlRoom.nightHeatingSetpoint ? 'ºC' : null,
                  value: fancoilUnit03ControlRoom.nightHeatingSetpoint
                    ? fancoilUnit03ControlRoom.nightHeatingSetpoint.value
                    : null,
                },
              },
            },
          }}
        />

        <Device
          title={'Fancoil 04'}
          temp={fancoilUnit04ControlRoom.roomTemperature ? fancoilUnit04ControlRoom.roomTemperature.value : null}
          width={84}
          height={112}
          posX={736}
          posY={165}
          alarm={0}
          collapsible={true}
          states={{
            command: fancoilUnit04ControlRoom.switchedOn ? fancoilUnit04ControlRoom.switchedOn.value : null,
            working: fancoilUnit04ControlRoom.workingState ? fancoilUnit04ControlRoom.workingState.value : null,
            unit: fancoilUnit04ControlRoom.unitState ? fancoilUnit04ControlRoom.unitState.value : null,
            switch: fancoilUnit04ControlRoom.selectorState ? fancoilUnit04ControlRoom.selectorState.value : null,
          }}
          parameters={{
            heatingState: {
              type: 'status',
              name: 'Heater',
              unit: null,
              value: fancoilUnit04ControlRoom.heatingState ? fancoilUnit04ControlRoom.heatingState.value : null,
            },
            operationalState: {
              type: 'status',
              name: 'Operation',
              unit: null,
              value: fancoilUnit04ControlRoom.operationalState ? fancoilUnit04ControlRoom.operationalState.value : null,
            },
            fanState: {
              type: 'status',
              name: 'Fan',
              unit: null,
              value: fancoilUnit04ControlRoom.fanState ? fancoilUnit04ControlRoom.fanState.value : null,
            },
            coldValveOpening: {
              type: 'single',
              name: 'Opening Valve Cold',
              unit: fancoilUnit04ControlRoom.coldValveOpening ? fancoilUnit04ControlRoom.coldValveOpening.units : null,
              value: fancoilUnit04ControlRoom.coldValveOpening ? fancoilUnit04ControlRoom.coldValveOpening.value : null,
            },
            roomTemperature: {
              type: 'single',
              name: 'Temperature Room',
              unit: fancoilUnit04ControlRoom.roomTemperature ? 'ºC' : null,
              value: fancoilUnit04ControlRoom.roomTemperature ? fancoilUnit04ControlRoom.roomTemperature.value : null,
            },
            setpointDay: {
              type: 'group',
              name: 'Setpoint Day',
              unit: null,
              value: null,
              params: {
                dayCoolingSetpoint: {
                  type: 'noBox',
                  alarm: null,
                  name: 'Cooling',
                  state: null,
                  unit: fancoilUnit04ControlRoom.dayCoolingSetpoint ? 'ºC' : null,
                  value: fancoilUnit04ControlRoom.dayCoolingSetpoint
                    ? fancoilUnit04ControlRoom.dayCoolingSetpoint.value
                    : null,
                },
                dayHeatingSetpoint: {
                  type: 'noBox',
                  alarm: null,
                  name: 'Heating',
                  state: null,
                  unit: fancoilUnit04ControlRoom.dayHeatingSetpoint ? 'ºC' : null,
                  value: fancoilUnit04ControlRoom.dayHeatingSetpoint
                    ? fancoilUnit04ControlRoom.dayHeatingSetpoint.value
                    : null,
                },
              },
            },
            setpointNight: {
              type: 'group',
              name: 'Setpoint Night',
              unit: null,
              value: null,
              params: {
                nightCoolingSetpoint: {
                  type: 'noBox',
                  alarm: null,
                  name: 'Cooling',
                  state: null,
                  unit: fancoilUnit04ControlRoom.nightCoolingSetpoint ? 'ºC' : null,
                  value: fancoilUnit04ControlRoom.nightCoolingSetpoint
                    ? fancoilUnit04ControlRoom.nightCoolingSetpoint.value
                    : null,
                },
                nightHeatingSetpoint: {
                  type: 'noBox',
                  alarm: null,
                  name: 'Heating',
                  state: null,
                  unit: fancoilUnit04ControlRoom.nightHeatingSetpoint ? 'ºC' : null,
                  value: fancoilUnit04ControlRoom.nightHeatingSetpoint
                    ? fancoilUnit04ControlRoom.nightHeatingSetpoint.value
                    : null,
                },
              },
            },
          }}
        />

        <Device
          title={'Fancoil 10'}
          temp={fancoilUnit10WorkRoom.roomTemperature ? fancoilUnit10WorkRoom.roomTemperature.value : null}
          width={84}
          height={112}
          posX={692}
          posY={71}
          alarm={0}
          collapsible={true}
          states={{
            command: fancoilUnit10WorkRoom.switchedOn ? fancoilUnit10WorkRoom.switchedOn.value : null,
            working: fancoilUnit10WorkRoom.workingState ? fancoilUnit10WorkRoom.workingState.value : null,
            unit: fancoilUnit10WorkRoom.unitState ? fancoilUnit10WorkRoom.unitState.value : null,
            switch: fancoilUnit10WorkRoom.selectorState ? fancoilUnit10WorkRoom.selectorState.value : null,
          }}
          parameters={{
            heatingState: {
              type: 'status',
              name: 'Heater',
              unit: null,
              value: fancoilUnit10WorkRoom.heatingState ? fancoilUnit10WorkRoom.heatingState.value : null,
            },
            operationalState: {
              type: 'status',
              name: 'Operation',
              unit: null,
              value: fancoilUnit10WorkRoom.operationalState ? fancoilUnit10WorkRoom.operationalState.value : null,
            },
            fanState: {
              type: 'status',
              name: 'Fan',
              unit: null,
              value: fancoilUnit10WorkRoom.fanState ? fancoilUnit10WorkRoom.fanState.value : null,
            },
            coldValveOpening: {
              type: 'single',
              name: 'Opening Valve Cold',
              unit: fancoilUnit10WorkRoom.coldValveOpening ? fancoilUnit10WorkRoom.coldValveOpening.units : null,
              value: fancoilUnit10WorkRoom.coldValveOpening ? fancoilUnit10WorkRoom.coldValveOpening.value : null,
            },
            roomTemperature: {
              type: 'single',
              name: 'Temperature Room',
              unit: fancoilUnit10WorkRoom.roomTemperature ? 'ºC' : null,
              value: fancoilUnit10WorkRoom.roomTemperature ? fancoilUnit10WorkRoom.roomTemperature.value : null,
            },
            setpointDay: {
              type: 'group',
              name: 'Setpoint Day',
              unit: null,
              value: null,
              params: {
                dayCoolingSetpoint: {
                  type: 'noBox',
                  alarm: null,
                  name: 'Cooling',
                  state: null,
                  unit: fancoilUnit10WorkRoom.dayCoolingSetpoint ? 'ºC' : null,
                  value: fancoilUnit10WorkRoom.dayCoolingSetpoint
                    ? fancoilUnit10WorkRoom.dayCoolingSetpoint.value
                    : null,
                },
                dayHeatingSetpoint: {
                  type: 'noBox',
                  alarm: null,
                  name: 'Heating',
                  state: null,
                  unit: fancoilUnit10WorkRoom.dayHeatingSetpoint ? 'ºC' : null,
                  value: fancoilUnit10WorkRoom.dayHeatingSetpoint
                    ? fancoilUnit10WorkRoom.dayHeatingSetpoint.value
                    : null,
                },
              },
            },
            setpointNight: {
              type: 'group',
              name: 'Setpoint Night',
              unit: null,
              value: null,
              params: {
                nightCoolingSetpoint: {
                  type: 'noBox',
                  alarm: null,
                  name: 'Cooling',
                  state: null,
                  unit: fancoilUnit10WorkRoom.nightCoolingSetpoint ? 'ºC' : null,
                  value: fancoilUnit10WorkRoom.nightCoolingSetpoint
                    ? fancoilUnit10WorkRoom.nightCoolingSetpoint.value
                    : null,
                },
                nightHeatingSetpoint: {
                  type: 'noBox',
                  alarm: null,
                  name: 'Heating',
                  state: null,
                  unit: fancoilUnit10WorkRoom.nightHeatingSetpoint ? 'ºC' : null,
                  value: fancoilUnit10WorkRoom.nightHeatingSetpoint
                    ? fancoilUnit10WorkRoom.nightHeatingSetpoint.value
                    : null,
                },
              },
            },
          }}
        />

        <Device
          title={'Fancoil 11'}
          temp={fancoilUnit11WorkRoom.roomTemperature ? fancoilUnit11WorkRoom.roomTemperature.value : null}
          width={84}
          height={112}
          posX={742}
          posY={71}
          alarm={0}
          collapsible={true}
          states={{
            command: fancoilUnit11WorkRoom.switchedOn ? fancoilUnit11WorkRoom.switchedOn.value : null,
            working: fancoilUnit11WorkRoom.workingState ? fancoilUnit11WorkRoom.workingState.value : null,
            unit: fancoilUnit11WorkRoom.unitState ? fancoilUnit11WorkRoom.unitState.value : null,
            switch: fancoilUnit11WorkRoom.selectorState ? fancoilUnit11WorkRoom.selectorState.value : null,
          }}
          parameters={{
            heatingState: {
              type: 'status',
              name: 'Heater',
              unit: null,
              value: fancoilUnit11WorkRoom.heatingState ? fancoilUnit11WorkRoom.heatingState.value : null,
            },
            operationalState: {
              type: 'status',
              name: 'Operation',
              unit: null,
              value: fancoilUnit11WorkRoom.operationalState ? fancoilUnit11WorkRoom.operationalState.value : null,
            },
            fanState: {
              type: 'status',
              name: 'Fan',
              unit: null,
              value: fancoilUnit11WorkRoom.fanState ? fancoilUnit11WorkRoom.fanState.value : null,
            },
            coldValveOpening: {
              type: 'single',
              name: 'Opening Valve Cold',
              unit: fancoilUnit11WorkRoom.coldValveOpening ? fancoilUnit11WorkRoom.coldValveOpening.units : null,
              value: fancoilUnit11WorkRoom.coldValveOpening ? fancoilUnit11WorkRoom.coldValveOpening.value : null,
            },
            roomTemperature: {
              type: 'single',
              name: 'Temperature Room',
              unit: fancoilUnit11WorkRoom.roomTemperature ? 'ºC' : null,
              value: fancoilUnit11WorkRoom.roomTemperature ? fancoilUnit11WorkRoom.roomTemperature.value : null,
            },
            setpointDay: {
              type: 'group',
              name: 'Setpoint Day',
              unit: null,
              value: null,
              params: {
                dayCoolingSetpoint: {
                  type: 'noBox',
                  alarm: null,
                  name: 'Cooling',
                  state: null,
                  unit: fancoilUnit11WorkRoom.dayCoolingSetpoint ? 'ºC' : null,
                  value: fancoilUnit11WorkRoom.dayCoolingSetpoint
                    ? fancoilUnit11WorkRoom.dayCoolingSetpoint.value
                    : null,
                },
                dayHeatingSetpoint: {
                  type: 'noBox',
                  alarm: null,
                  name: 'Heating',
                  state: null,
                  unit: fancoilUnit11WorkRoom.dayHeatingSetpoint ? 'ºC' : null,
                  value: fancoilUnit11WorkRoom.dayHeatingSetpoint
                    ? fancoilUnit11WorkRoom.dayHeatingSetpoint.value
                    : null,
                },
              },
            },
            setpointNight: {
              type: 'group',
              name: 'Setpoint Night',
              unit: null,
              value: null,
              params: {
                nightCoolingSetpoint: {
                  type: 'noBox',
                  alarm: null,
                  name: 'Cooling',
                  state: null,
                  unit: fancoilUnit11WorkRoom.nightCoolingSetpoint ? 'ºC' : null,
                  value: fancoilUnit11WorkRoom.nightCoolingSetpoint
                    ? fancoilUnit11WorkRoom.nightCoolingSetpoint.value
                    : null,
                },
                nightHeatingSetpoint: {
                  type: 'noBox',
                  alarm: null,
                  name: 'Heating',
                  state: null,
                  unit: fancoilUnit11WorkRoom.nightHeatingSetpoint ? 'ºC' : null,
                  value: fancoilUnit11WorkRoom.nightHeatingSetpoint
                    ? fancoilUnit11WorkRoom.nightHeatingSetpoint.value
                    : null,
                },
              },
            },
          }}
        />

        <Device
          title={'Fancoil 06'}
          temp={fancoilUnit06ManagersOffice.roomTemperature ? fancoilUnit06ManagersOffice.roomTemperature.value : null}
          width={84}
          height={112}
          posX={800}
          posY={81}
          alarm={0}
          collapsible={true}
          states={{
            command: fancoilUnit06ManagersOffice.switchedOn ? fancoilUnit06ManagersOffice.switchedOn.value : null,
            working: fancoilUnit06ManagersOffice.workingState ? fancoilUnit06ManagersOffice.workingState.value : null,
            unit: fancoilUnit06ManagersOffice.unitState ? fancoilUnit06ManagersOffice.unitState.value : null,
            switch: fancoilUnit06ManagersOffice.selectorState ? fancoilUnit06ManagersOffice.selectorState.value : null,
          }}
          parameters={{
            heatingState: {
              type: 'status',
              name: 'Heater',
              unit: null,
              value: fancoilUnit06ManagersOffice.heatingState ? fancoilUnit06ManagersOffice.heatingState.value : null,
            },
            operationalState: {
              type: 'status',
              name: 'Operation',
              unit: null,
              value: fancoilUnit06ManagersOffice.operationalState
                ? fancoilUnit06ManagersOffice.operationalState.value
                : null,
            },
            fanState: {
              type: 'status',
              name: 'Fan',
              unit: null,
              value: fancoilUnit06ManagersOffice.fanState ? fancoilUnit06ManagersOffice.fanState.value : null,
            },
            coldValveOpening: {
              type: 'single',
              name: 'Opening Valve Cold',
              unit: fancoilUnit06ManagersOffice.coldValveOpening
                ? fancoilUnit06ManagersOffice.coldValveOpening.units
                : null,
              value: fancoilUnit06ManagersOffice.coldValveOpening
                ? fancoilUnit06ManagersOffice.coldValveOpening.value
                : null,
            },
            roomTemperature: {
              type: 'single',
              name: 'Temperature Room',
              unit: fancoilUnit06ManagersOffice.roomTemperature ? 'ºC' : null,
              value: fancoilUnit06ManagersOffice.roomTemperature
                ? fancoilUnit06ManagersOffice.roomTemperature.value
                : null,
            },
            setpointDay: {
              type: 'group',
              name: 'Setpoint Day',
              unit: null,
              value: null,
              params: {
                dayCoolingSetpoint: {
                  type: 'noBox',
                  alarm: null,
                  name: 'Cooling',
                  state: null,
                  unit: fancoilUnit06ManagersOffice.dayCoolingSetpoint ? 'ºC' : null,
                  value: fancoilUnit06ManagersOffice.dayCoolingSetpoint
                    ? fancoilUnit06ManagersOffice.dayCoolingSetpoint.value
                    : null,
                },
                dayHeatingSetpoint: {
                  type: 'noBox',
                  alarm: null,
                  name: 'Heating',
                  state: null,
                  unit: fancoilUnit06ManagersOffice.dayHeatingSetpoint ? 'ºC' : null,
                  value: fancoilUnit06ManagersOffice.dayHeatingSetpoint
                    ? fancoilUnit06ManagersOffice.dayHeatingSetpoint.value
                    : null,
                },
              },
            },
            setpointNight: {
              type: 'group',
              name: 'Setpoint Night',
              unit: null,
              value: null,
              params: {
                nightCoolingSetpoint: {
                  type: 'noBox',
                  alarm: null,
                  name: 'Cooling',
                  state: null,
                  unit: fancoilUnit06ManagersOffice.nightCoolingSetpoint ? 'ºC' : null,
                  value: fancoilUnit06ManagersOffice.nightCoolingSetpoint
                    ? fancoilUnit06ManagersOffice.nightCoolingSetpoint.value
                    : null,
                },
                nightHeatingSetpoint: {
                  type: 'noBox',
                  alarm: null,
                  name: 'Heating',
                  state: null,
                  unit: fancoilUnit06ManagersOffice.nightHeatingSetpoint ? 'ºC' : null,
                  value: fancoilUnit06ManagersOffice.nightHeatingSetpoint
                    ? fancoilUnit06ManagersOffice.nightHeatingSetpoint.value
                    : null,
                },
              },
            },
          }}
        />

        <Device
          title={'Fancoil 09'}
          temp={fancoilUnit09MeetingRoom.roomTemperature ? fancoilUnit09MeetingRoom.roomTemperature.value : null}
          width={84}
          height={112}
          posX={800}
          posY={45}
          alarm={0}
          collapsible={true}
          states={{
            command: fancoilUnit09MeetingRoom.switchedOn ? fancoilUnit09MeetingRoom.switchedOn.value : null,
            working: fancoilUnit09MeetingRoom.workingState ? fancoilUnit09MeetingRoom.workingState.value : null,
            unit: fancoilUnit09MeetingRoom.unitState ? fancoilUnit09MeetingRoom.unitState.value : null,
            switch: fancoilUnit09MeetingRoom.selectorState ? fancoilUnit09MeetingRoom.selectorState.value : null,
          }}
          parameters={{
            heatingState: {
              type: 'status',
              name: 'Heater',
              unit: null,
              value: fancoilUnit09MeetingRoom.heatingState ? fancoilUnit09MeetingRoom.heatingState.value : null,
            },
            operationalState: {
              type: 'status',
              name: 'Operation',
              unit: null,
              value: fancoilUnit09MeetingRoom.operationalState ? fancoilUnit09MeetingRoom.operationalState.value : null,
            },
            fanState: {
              type: 'status',
              name: 'Fan',
              unit: null,
              value: fancoilUnit09MeetingRoom.fanState ? fancoilUnit09MeetingRoom.fanState.value : null,
            },
            coldValveOpening: {
              type: 'single',
              name: 'Opening Valve Cold',
              unit: fancoilUnit09MeetingRoom.coldValveOpening ? fancoilUnit09MeetingRoom.coldValveOpening.units : null,
              value: fancoilUnit09MeetingRoom.coldValveOpening ? fancoilUnit09MeetingRoom.coldValveOpening.value : null,
            },
            roomTemperature: {
              type: 'single',
              name: 'Temperature Room',
              unit: fancoilUnit09MeetingRoom.roomTemperature ? 'ºC' : null,
              value: fancoilUnit09MeetingRoom.roomTemperature ? fancoilUnit09MeetingRoom.roomTemperature.value : null,
            },
            setpointDay: {
              type: 'group',
              name: 'Setpoint Day',
              unit: null,
              value: null,
              params: {
                dayCoolingSetpoint: {
                  type: 'noBox',
                  alarm: null,
                  name: 'Cooling',
                  state: null,
                  unit: fancoilUnit09MeetingRoom.dayCoolingSetpoint ? 'ºC' : null,
                  value: fancoilUnit09MeetingRoom.dayCoolingSetpoint
                    ? fancoilUnit09MeetingRoom.dayCoolingSetpoint.value
                    : null,
                },
                dayHeatingSetpoint: {
                  type: 'noBox',
                  alarm: null,
                  name: 'Heating',
                  state: null,
                  unit: fancoilUnit09MeetingRoom.dayHeatingSetpoint ? 'ºC' : null,
                  value: fancoilUnit09MeetingRoom.dayHeatingSetpoint
                    ? fancoilUnit09MeetingRoom.dayHeatingSetpoint.value
                    : null,
                },
              },
            },
            setpointNight: {
              type: 'group',
              name: 'Setpoint Night',
              unit: null,
              value: null,
              params: {
                nightCoolingSetpoint: {
                  type: 'noBox',
                  alarm: null,
                  name: 'Cooling',
                  state: null,
                  unit: fancoilUnit09MeetingRoom.nightCoolingSetpoint ? 'ºC' : null,
                  value: fancoilUnit09MeetingRoom.nightCoolingSetpoint
                    ? fancoilUnit09MeetingRoom.nightCoolingSetpoint.value
                    : null,
                },
                nightHeatingSetpoint: {
                  type: 'noBox',
                  alarm: null,
                  name: 'Heating',
                  state: null,
                  unit: fancoilUnit09MeetingRoom.nightHeatingSetpoint ? 'ºC' : null,
                  value: fancoilUnit09MeetingRoom.nightHeatingSetpoint
                    ? fancoilUnit09MeetingRoom.nightHeatingSetpoint.value
                    : null,
                },
              },
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
          <g id="Building">
            <polygon
              id="Floor"
              className={styles.cls4}
              points="633.77 38.75 633.77 266.56 648.56 266.56 648.56 279.21 628.66 279.21 628.66 328.33 707.22 328.33 707.22 282.56 693.82 282.56 693.82 266.56 707.22 266.56 717.82 266.56 867.14 266.56 867.14 38.75 633.77 38.75"
            />
            <g id="Ourside_Deck" data-name="Ourside Deck">
              <g>
                <line className={styles.cls5} x1="565.92" y1="325.77" x2="565.92" y2="313.76" />
                <line className={styles.cls5} x1="568.92" y1="325.77" x2="568.92" y2="313.76" />
                <line className={styles.cls5} x1="571.93" y1="325.77" x2="571.93" y2="313.76" />
                <line className={styles.cls5} x1="574.93" y1="325.77" x2="574.93" y2="313.76" />
                <line className={styles.cls5} x1="577.93" y1="325.77" x2="577.93" y2="313.76" />
                <line className={styles.cls5} x1="580.93" y1="325.77" x2="580.93" y2="313.76" />
                <line className={styles.cls5} x1="583.93" y1="325.77" x2="583.93" y2="313.76" />
                <line className={styles.cls5} x1="586.93" y1="325.77" x2="586.93" y2="313.76" />
                <line className={styles.cls5} x1="589.93" y1="325.77" x2="589.93" y2="313.76" />
                <line className={styles.cls5} x1="592.93" y1="325.77" x2="592.93" y2="313.76" />
                <line className={styles.cls5} x1="595.93" y1="325.77" x2="595.93" y2="313.76" />
                <line className={styles.cls5} x1="598.94" y1="325.77" x2="598.94" y2="313.76" />
                <line className={styles.cls5} x1="601.94" y1="325.77" x2="601.94" y2="313.76" />
                <line className={styles.cls5} x1="604.94" y1="325.77" x2="604.94" y2="313.76" />
                <line className={styles.cls5} x1="607.94" y1="325.77" x2="607.94" y2="313.76" />
                <line className={styles.cls5} x1="610.94" y1="325.77" x2="610.94" y2="313.76" />
                <line className={styles.cls5} x1="613.94" y1="325.77" x2="613.94" y2="313.76" />
                <line className={styles.cls5} x1="616.94" y1="325.77" x2="616.94" y2="313.76" />
                <line className={styles.cls5} x1="619.94" y1="325.77" x2="619.94" y2="313.76" />
                <line className={styles.cls5} x1="622.94" y1="325.77" x2="622.94" y2="313.76" />
                <line className={styles.cls5} x1="625.95" y1="325.77" x2="625.95" y2="313.76" />
                <line className={styles.cls5} x1="628.95" y1="325.77" x2="628.95" y2="313.76" />
                <line className={styles.cls5} x1="562.92" y1="325.77" x2="562.92" y2="313.76" />
                <line className={styles.cls5} x1="628.97" y1="325.77" x2="560.92" y2="325.77" />
                <line className={styles.cls5} x1="628.97" y1="313.76" x2="560.92" y2="313.76" />
                <polygon className={styles.cls12} points="564.9 315.93 564.9 323.6 562.34 319.77 564.9 315.93" />
                <line className={styles.cls6} x1="564.97" y1="319.77" x2="627.16" y2="319.77" />
              </g>
              <g>
                <polyline className={styles.cls5} points="623.32 325.99 623.32 332.63 712.72 332.63 712.72 283.95" />
                <polyline className={styles.cls5} points="624.32 326.13 624.32 331.63 711.72 331.63 711.72 283.95" />
                <line className={styles.cls5} x1="623.32" y1="282.84" x2="623.32" y2="313.85" />
                <line className={styles.cls5} x1="624.32" y1="282.84" x2="624.32" y2="313.85" />
                <g>
                  <rect className={styles.cls5} x="629.32" y="285.42" width="77.06" height="42.21" />
                  <g>
                    <line className={styles.cls11} x1="630.05" y1="285.76" x2="630.05" y2="327.46" />
                    <line className={styles.cls11} x1="631.52" y1="285.76" x2="631.52" y2="327.46" />
                    <line className={styles.cls11} x1="633.71" y1="285.76" x2="633.71" y2="327.46" />
                    <line className={styles.cls11} x1="635.91" y1="285.76" x2="635.91" y2="327.46" />
                    <line className={styles.cls11} x1="638.11" y1="285.76" x2="638.11" y2="327.46" />
                    <line className={styles.cls11} x1="655.69" y1="285.76" x2="655.69" y2="327.46" />
                    <line className={styles.cls11} x1="673.27" y1="285.76" x2="673.27" y2="327.46" />
                    <line className={styles.cls11} x1="690.85" y1="285.76" x2="690.85" y2="327.46" />
                    <line className={styles.cls11} x1="653.49" y1="285.76" x2="653.49" y2="327.46" />
                    <line className={styles.cls11} x1="671.07" y1="285.76" x2="671.07" y2="327.46" />
                    <line className={styles.cls11} x1="688.65" y1="285.76" x2="688.65" y2="327.46" />
                    <line className={styles.cls11} x1="651.29" y1="285.76" x2="651.29" y2="327.46" />
                    <line className={styles.cls11} x1="668.87" y1="285.76" x2="668.87" y2="327.46" />
                    <line className={styles.cls11} x1="686.45" y1="285.76" x2="686.45" y2="327.46" />
                    <line className={styles.cls11} x1="704.03" y1="285.76" x2="704.03" y2="327.46" />
                    <line className={styles.cls11} x1="649.1" y1="285.76" x2="649.1" y2="327.46" />
                    <line className={styles.cls11} x1="666.67" y1="285.76" x2="666.67" y2="327.46" />
                    <line className={styles.cls11} x1="684.25" y1="285.76" x2="684.25" y2="327.46" />
                    <line className={styles.cls11} x1="701.83" y1="285.76" x2="701.83" y2="327.46" />
                    <line className={styles.cls11} x1="646.9" y1="285.76" x2="646.9" y2="327.46" />
                    <line className={styles.cls11} x1="664.48" y1="285.76" x2="664.48" y2="327.46" />
                    <line className={styles.cls11} x1="682.06" y1="285.76" x2="682.06" y2="327.46" />
                    <line className={styles.cls11} x1="699.63" y1="285.76" x2="699.63" y2="327.46" />
                    <line className={styles.cls11} x1="644.7" y1="285.76" x2="644.7" y2="327.46" />
                    <line className={styles.cls11} x1="662.28" y1="285.76" x2="662.28" y2="327.46" />
                    <line className={styles.cls11} x1="679.86" y1="285.76" x2="679.86" y2="327.46" />
                    <line className={styles.cls11} x1="697.44" y1="285.76" x2="697.44" y2="327.46" />
                    <line className={styles.cls11} x1="642.5" y1="285.76" x2="642.5" y2="327.46" />
                    <line className={styles.cls11} x1="660.08" y1="285.76" x2="660.08" y2="327.46" />
                    <line className={styles.cls11} x1="677.66" y1="285.76" x2="677.66" y2="327.46" />
                    <line className={styles.cls11} x1="695.24" y1="285.76" x2="695.24" y2="327.46" />
                    <line className={styles.cls11} x1="640.31" y1="285.76" x2="640.31" y2="327.46" />
                    <line className={styles.cls11} x1="657.88" y1="285.76" x2="657.88" y2="327.46" />
                    <line className={styles.cls11} x1="675.46" y1="285.76" x2="675.46" y2="327.46" />
                    <line className={styles.cls11} x1="693.04" y1="285.76" x2="693.04" y2="327.46" />
                    <line className={styles.cls11} x1="632.25" y1="285.76" x2="632.25" y2="327.46" />
                    <line className={styles.cls11} x1="634.45" y1="285.76" x2="634.45" y2="327.46" />
                    <line className={styles.cls11} x1="636.64" y1="285.76" x2="636.64" y2="327.46" />
                    <line className={styles.cls11} x1="638.84" y1="285.76" x2="638.84" y2="327.46" />
                    <line className={styles.cls11} x1="656.42" y1="285.76" x2="656.42" y2="327.46" />
                    <line className={styles.cls11} x1="674" y1="285.76" x2="674" y2="327.46" />
                    <line className={styles.cls11} x1="691.58" y1="285.76" x2="691.58" y2="327.46" />
                    <line className={styles.cls11} x1="654.22" y1="285.76" x2="654.22" y2="327.46" />
                    <line className={styles.cls11} x1="671.8" y1="285.76" x2="671.8" y2="327.46" />
                    <line className={styles.cls11} x1="689.38" y1="285.76" x2="689.38" y2="327.46" />
                    <line className={styles.cls11} x1="652.03" y1="285.76" x2="652.03" y2="327.46" />
                    <line className={styles.cls11} x1="669.6" y1="285.76" x2="669.6" y2="327.46" />
                    <line className={styles.cls11} x1="687.18" y1="285.76" x2="687.18" y2="327.46" />
                    <line className={styles.cls11} x1="704.76" y1="285.76" x2="704.76" y2="327.46" />
                    <line className={styles.cls11} x1="649.83" y1="285.76" x2="649.83" y2="327.46" />
                    <line className={styles.cls11} x1="667.41" y1="285.76" x2="667.41" y2="327.46" />
                    <line className={styles.cls11} x1="684.99" y1="285.76" x2="684.99" y2="327.46" />
                    <line className={styles.cls11} x1="702.56" y1="285.76" x2="702.56" y2="327.46" />
                    <line className={styles.cls11} x1="647.63" y1="285.76" x2="647.63" y2="327.46" />
                    <line className={styles.cls11} x1="665.21" y1="285.76" x2="665.21" y2="327.46" />
                    <line className={styles.cls11} x1="682.79" y1="285.76" x2="682.79" y2="327.46" />
                    <line className={styles.cls11} x1="700.37" y1="285.76" x2="700.37" y2="327.46" />
                    <line className={styles.cls11} x1="645.43" y1="285.76" x2="645.43" y2="327.46" />
                    <line className={styles.cls11} x1="663.01" y1="285.76" x2="663.01" y2="327.46" />
                    <line className={styles.cls11} x1="680.59" y1="285.76" x2="680.59" y2="327.46" />
                    <line className={styles.cls11} x1="698.17" y1="285.76" x2="698.17" y2="327.46" />
                    <line className={styles.cls11} x1="643.24" y1="285.76" x2="643.24" y2="327.46" />
                    <line className={styles.cls11} x1="660.81" y1="285.76" x2="660.81" y2="327.46" />
                    <line className={styles.cls11} x1="678.39" y1="285.76" x2="678.39" y2="327.46" />
                    <line className={styles.cls11} x1="695.97" y1="285.76" x2="695.97" y2="327.46" />
                    <line className={styles.cls11} x1="641.04" y1="285.76" x2="641.04" y2="327.46" />
                    <line className={styles.cls11} x1="658.62" y1="285.76" x2="658.62" y2="327.46" />
                    <line className={styles.cls11} x1="676.2" y1="285.76" x2="676.2" y2="327.46" />
                    <line className={styles.cls11} x1="693.77" y1="285.76" x2="693.77" y2="327.46" />
                    <line className={styles.cls11} x1="630.78" y1="285.76" x2="630.78" y2="327.46" />
                    <line className={styles.cls11} x1="632.98" y1="285.76" x2="632.98" y2="327.46" />
                    <line className={styles.cls11} x1="635.18" y1="285.76" x2="635.18" y2="327.46" />
                    <line className={styles.cls11} x1="637.38" y1="285.76" x2="637.38" y2="327.46" />
                    <line className={styles.cls11} x1="654.95" y1="285.76" x2="654.95" y2="327.46" />
                    <line className={styles.cls11} x1="672.53" y1="285.76" x2="672.53" y2="327.46" />
                    <line className={styles.cls11} x1="690.11" y1="285.76" x2="690.11" y2="327.46" />
                    <line className={styles.cls11} x1="652.76" y1="285.76" x2="652.76" y2="327.46" />
                    <line className={styles.cls11} x1="670.34" y1="285.76" x2="670.34" y2="327.46" />
                    <line className={styles.cls11} x1="687.92" y1="285.76" x2="687.92" y2="327.46" />
                    <line className={styles.cls11} x1="705.49" y1="285.76" x2="705.49" y2="327.46" />
                    <line className={styles.cls11} x1="650.56" y1="285.76" x2="650.56" y2="327.46" />
                    <line className={styles.cls11} x1="668.14" y1="285.76" x2="668.14" y2="327.46" />
                    <line className={styles.cls11} x1="685.72" y1="285.76" x2="685.72" y2="327.46" />
                    <line className={styles.cls11} x1="703.3" y1="285.76" x2="703.3" y2="327.46" />
                    <line className={styles.cls11} x1="648.36" y1="285.76" x2="648.36" y2="327.46" />
                    <line className={styles.cls11} x1="665.94" y1="285.76" x2="665.94" y2="327.46" />
                    <line className={styles.cls11} x1="683.52" y1="285.76" x2="683.52" y2="327.46" />
                    <line className={styles.cls11} x1="701.1" y1="285.76" x2="701.1" y2="327.46" />
                    <line className={styles.cls11} x1="646.17" y1="285.76" x2="646.17" y2="327.46" />
                    <line className={styles.cls11} x1="663.74" y1="285.76" x2="663.74" y2="327.46" />
                    <line className={styles.cls11} x1="681.32" y1="285.76" x2="681.32" y2="327.46" />
                    <line className={styles.cls11} x1="698.9" y1="285.76" x2="698.9" y2="327.46" />
                    <line className={styles.cls11} x1="643.97" y1="285.76" x2="643.97" y2="327.46" />
                    <line className={styles.cls11} x1="661.55" y1="285.76" x2="661.55" y2="327.46" />
                    <line className={styles.cls11} x1="679.13" y1="285.76" x2="679.13" y2="327.46" />
                    <line className={styles.cls11} x1="696.7" y1="285.76" x2="696.7" y2="327.46" />
                    <line className={styles.cls11} x1="641.77" y1="285.76" x2="641.77" y2="327.46" />
                    <line className={styles.cls11} x1="659.35" y1="285.76" x2="659.35" y2="327.46" />
                    <line className={styles.cls11} x1="676.93" y1="285.76" x2="676.93" y2="327.46" />
                    <line className={styles.cls11} x1="694.51" y1="285.76" x2="694.51" y2="327.46" />
                    <line className={styles.cls11} x1="639.57" y1="285.76" x2="639.57" y2="327.46" />
                    <line className={styles.cls11} x1="657.15" y1="285.76" x2="657.15" y2="327.46" />
                    <line className={styles.cls11} x1="674.73" y1="285.76" x2="674.73" y2="327.46" />
                    <line className={styles.cls11} x1="692.31" y1="285.76" x2="692.31" y2="327.46" />
                  </g>
                </g>
              </g>
            </g>
            <g id="SolidWall">
              <rect className={styles.cls13} x="692.09" y="98.58" width="8.16" height="8.37" />
              <rect className={styles.cls13} x="692.09" y="178.49" width="8.16" height="8.16" />
              <rect className={styles.cls13} x="741.95" y="178.49" width="8.16" height="8.16" />
              <rect className={styles.cls13} x="811.72" y="178.49" width="8.16" height="8.16" />
              <rect className={styles.cls13} x="858.98" y="98.58" width="8.16" height="8.37" />
              <rect className={styles.cls13} x="858.98" y="178.49" width="8.16" height="8.16" />
              <rect className={styles.cls13} x="741.95" y="98.58" width="8.16" height="8.37" />
              <rect className={styles.cls6} x="669.73" y="336.63" width="39.93" height="87.85" />
              <rect className={styles.cls6} x="667.65" y="333.21" width="44.08" height="93.26" />
              <g>
                <circle className={styles.cls6} cx="689.69" cy="358.42" r="11.16" />
                <circle className={styles.cls6} cx="689.69" cy="402.69" r="11.16" />
              </g>
              <rect className={styles.cls13} x="767.91" y="101.36" width="33.77" height="2.53" />
              <g>
                <polygon
                  className={styles.cls13}
                  points="867.14 38.75 867.14 44.35 864.19 44.35 864.19 41.23 818.24 41.23 818.24 46.75 816.75 46.75 816.75 103.89 810.8 103.89 810.8 101.54 814.66 101.54 814.66 78.79 767.91 78.79 767.91 76.37 814.66 76.37 814.66 46.75 813.17 46.75 813.17 41.23 767.91 41.23 767.91 38.75 867.14 38.75"
                />
                <rect className={styles.cls13} x="743.45" y="38.75" width="5.02" height="8.05" />
              </g>
              <polygon
                className={styles.cls13}
                points="633.77 38.75 633.77 264 602.49 264 602.49 266.56 648.56 266.56 648.56 258.23 643.59 258.23 643.59 264 636.75 264 636.75 242.45 642.33 242.45 642.33 233.95 636.75 233.95 636.75 227.86 642.33 227.86 642.33 219.18 636.75 219.18 636.75 165.87 642.33 165.87 642.33 157.08 636.75 157.08 636.75 151.08 642.33 151.08 642.33 142.64 636.75 142.64 636.75 41.37 643.82 41.37 643.82 46.79 648.61 46.79 648.61 41.37 693.68 41.37 693.68 46.79 698.52 46.79 698.52 38.75 633.77 38.75"
              />
              <polygon
                className={styles.cls13}
                points="693.45 266.56 693.45 258.23 698.52 258.23 698.52 264 743.44 264 743.44 258.27 748.78 258.27 748.78 264 813.07 264 813.07 258.27 818.41 258.27 818.41 264 864.19 264 864.19 260.9 867.14 260.9 867.14 266.56 693.45 266.56"
              />
              <rect
                className={styles.cls13}
                x="727.14"
                y="245.42"
                width="5.54"
                height="72.93"
                transform="translate(448.03 1011.8) rotate(-90)"
              />
              <rect
                className={styles.cls13}
                x="622.68"
                y="258.77"
                width="5.54"
                height="46.23"
                transform="translate(343.56 907.33) rotate(-90)"
              />
            </g>
            <g id="Wall">
              <line className={styles.cls7} x1="813.26" y1="46.56" x2="813.26" y2="76.51" />
              <polygon
                className={styles.cls7}
                points="767.91 54.32 800.25 54.32 800.25 63.25 767.91 63.25 767.91 64.43 801.4 64.43 801.4 53.02 767.91 53.02 767.91 54.32"
              />
              <rect className={styles.cls7} x="767.91" y="77.26" width="1.12" height="5.39" />
              <rect className={styles.cls7} x="767.91" y="94.57" width="1.12" height="8.26" />
              <rect className={styles.cls7} x="795.92" y="78.47" width="1.81" height="23.67" />
              <polygon
                className={styles.cls7}
                points="746.7 44.09 746.7 82.69 744.26 82.69 744.26 84.09 746.7 84.09 748.1 84.09 748.1 82.69 748.1 44.09 746.7 44.09"
              />
              <polygon
                className={styles.cls7}
                points="698.42 82.69 695.99 82.69 695.99 44.09 694.59 44.09 694.59 82.69 694.59 84.09 694.59 99.09 695.99 99.09 695.99 84.09 698.42 84.09 698.42 82.69"
              />
              <polygon
                className={styles.cls7}
                points="724.16 82.69 724.16 41.07 721.16 41.07 721.16 82.69 708.54 82.69 708.54 84.09 721.16 84.09 724.16 84.09 734.54 84.09 734.54 82.69 724.16 82.69"
              />
              <rect
                className={styles.cls7}
                x="643.74"
                y="120.21"
                width="1.4"
                height="16.61"
                transform="translate(515.93 772.96) rotate(-90)"
              />
              <polygon
                className={styles.cls7}
                points="698.76 106.96 702.68 106.96 702.68 127.81 676.67 127.81 676.67 129.21 702.68 129.21 704.08 129.21 704.08 127.81 704.08 106.96 704.08 105.09 728.68 105.09 730.08 105.09 742.07 105.09 742.07 103.69 730.08 103.69 730.08 96.33 728.68 96.33 728.68 103.69 698.76 103.69 698.76 106.96"
              />
              <polygon
                className={styles.cls7}
                points="704.08 146.28 694.47 146.28 693.07 146.28 693.07 147.68 693.07 179.05 694.47 179.05 694.47 147.68 704.08 147.68 704.08 146.28"
              />
              <rect
                className={styles.cls7}
                x="663.31"
                y="151.11"
                width="1.4"
                height="57.32"
                transform="translate(484.24 843.78) rotate(-90)"
              />
              <polygon
                className={styles.cls7}
                points="704.08 203.81 695.54 203.81 694.14 203.81 694.14 205.21 694.14 260.79 695.54 260.79 695.54 205.21 704.08 205.21 704.08 203.81"
              />
              <rect
                className={styles.cls7}
                x="697.88"
                y="180.26"
                width="1.4"
                height="11"
                transform="translate(512.81 884.34) rotate(-90)"
              />
              <rect
                className={styles.cls7}
                x="839.63"
                y="91.63"
                width="1.4"
                height="51.63"
                transform="translate(722.89 957.77) rotate(-90)"
              />
              <rect
                className={styles.cls7}
                x="839.63"
                y="120.47"
                width="1.4"
                height="51.63"
                transform="translate(694.05 986.61) rotate(-90)"
              />
              <rect
                className={styles.cls7}
                x="839.63"
                y="149.49"
                width="1.4"
                height="51.63"
                transform="translate(665.03 1015.64) rotate(-90)"
              />
              <rect
                className={styles.cls7}
                x="839.63"
                y="178.7"
                width="1.4"
                height="51.63"
                transform="translate(635.82 1044.84) rotate(-90)"
              />
              <rect className={styles.cls7} x="675.44" y="244.49" width="1.4" height="21.77" />
              <rect className={styles.cls7} x="646.95" y="264.85" width="1.4" height="14.81" />
              <rect className={styles.cls7} x="693.83" y="265.44" width="1.4" height="14.22" />
              <polygon
                className={styles.cls7}
                points="865.35 44.28 865.35 42.48 870.62 42.48 870.62 38.75 633.68 38.75 633.68 36.29 872.42 36.29 872.42 44.28 865.35 44.28"
              />
              <polygon
                className={styles.cls7}
                points="870.62 260.56 870.62 266.75 695.23 266.75 695.23 268.55 872.42 268.55 872.42 267.63 872.42 266.75 872.42 260.56 870.62 260.56"
              />
              <rect className={styles.cls7} x="748" y="94.54" width="1.4" height="7.37" />
              <rect
                className={styles.cls7}
                x="647.99"
                y="263.82"
                width="1.4"
                height="3.47"
                transform="translate(383.13 914.24) rotate(-90)"
              />
            </g>
            <g id="Doors">
              <path
                className={styles.cls15}
                d="m801.1,113.05c-.2,0-.35-.16-.35-.35v-9.63c0-.2.16-.35.35-.35h.1c.2,0,.35.16.35.35v9.26c4.9-.3,8.72-4.33,8.72-9.26,0-.2.16-.35.35-.35s.35.16.35.35c0,5.37-4.21,9.76-9.57,9.99-.04,0-.08,0-.12-.02-.03,0-.06.02-.09.02h-.1.01Z"
              />
              <path
                className={styles.cls15}
                d="m744.11,73.99c.2,0,.35.16.35.35v9.63c0,.2-.16.35-.35.35h-.1c-.2,0-.35-.16-.35-.35v-9.26c-4.9.3-8.72,4.33-8.72,9.26,0,.2-.16.35-.35.35s-.35-.16-.35-.35c0-5.37,4.21-9.76,9.57-9.99.04,0,.08,0,.12.02.03,0,.06-.02.09-.02h.1-.01Z"
              />
              <path
                className={styles.cls15}
                d="m698.76,73.99c-.2,0-.35.16-.35.35v9.63c0,.2.16.35.35.35h.1c.2,0,.35-.16.35-.35v-9.26c4.9.3,8.72,4.33,8.72,9.26,0,.2.16.35.35.35s.35-.16.35-.35c0-5.37-4.21-9.76-9.57-9.99-.04,0-.08,0-.12.02-.03,0-.06-.02-.09-.02h-.1.01Z"
              />
              <path
                className={styles.cls15}
                d="m825.06,115.83c0,.2-.16.35-.35.35h-9.63c-.2,0-.35-.16-.35-.35v-.1c0-.2.16-.35.35-.35h9.26c-.3-4.9-4.33-8.72-9.26-8.72-.2,0-.35-.16-.35-.35s.16-.35.35-.35c5.37,0,9.76,4.21,9.99,9.57,0,.04,0,.08-.02.12,0,.03.02.06.02.09v.1h-.01Z"
              />
              <path
                className={styles.cls15}
                d="m825.06,143.92c0,.2-.16.35-.35.35h-9.63c-.2,0-.35-.16-.35-.35v-.1c0-.2.16-.35.35-.35h9.26c-.3-4.9-4.33-8.72-9.26-8.72-.2,0-.35-.16-.35-.35s.16-.35.35-.35c5.37,0,9.76,4.21,9.99,9.57,0,.04,0,.08-.02.12,0,.03.02.06.02.09v.1h-.01Z"
              />
              <path
                className={styles.cls15}
                d="m825.06,201.41c0,.2-.16.35-.35.35h-9.63c-.2,0-.35-.16-.35-.35v-.1c0-.2.16-.35.35-.35h9.26c-.3-4.9-4.33-8.72-9.26-8.72-.2,0-.35-.16-.35-.35s.16-.35.35-.35c5.37,0,9.76,4.21,9.99,9.57,0,.04,0,.08-.02.12,0,.03.02.06.02.09v.1h-.01Z"
              />
              <path
                className={styles.cls15}
                d="m825.06,148.53c0-.2-.16-.35-.35-.35h-9.63c-.2,0-.35.16-.35.35v.1c0,.2.16.35.35.35h9.26c-.3,4.9-4.33,8.72-9.26,8.72-.2,0-.35.16-.35.35s.16.35.35.35c5.37,0,9.76-4.21,9.99-9.57,0-.04,0-.08-.02-.12,0-.03.02-.06.02-.09v-.1h-.01Z"
              />
              <path
                className={styles.cls15}
                d="m801.03,214.91c.2,0,.35-.16.35-.35v-9.63c0-.2-.16-.35-.35-.35h-.1c-.2,0-.35.16-.35.35v9.26c-4.9-.3-8.72-4.33-8.72-9.26,0-.2-.16-.35-.35-.35s-.35.16-.35.35c0,5.37,4.21,9.76,9.57,9.99.04,0,.08,0,.12-.02.03,0,.06.02.09.02h.1-.01Z"
              />
              <path
                className={styles.cls15}
                d="m715.12,214.91c-.2,0-.35-.16-.35-.35v-9.63c0-.2.16-.35.35-.35h.1c.2,0,.35.16.35.35v9.26c4.9-.3,8.72-4.33,8.72-9.26,0-.2.16-.35.35-.35s.35.16.35.35c0,5.37-4.21,9.76-9.57,9.99-.04,0-.08,0-.12-.02-.03,0-.06.02-.09.02h-.1.01Z"
              />
              <path
                className={styles.cls15}
                d="m653.26,138.54c-.2,0-.35-.16-.35-.35v-9.63c0-.2.16-.35.35-.35h.1c.2,0,.35.16.35.35v9.26c4.9-.3,8.72-4.33,8.72-9.26,0-.2.16-.35.35-.35s.35.16.35.35c0,5.37-4.21,9.76-9.57,9.99-.04,0-.08,0-.12-.02-.03,0-.06.02-.09.02h-.1.01Z"
              />
              <path className={styles.cls8} d="m693.76,137.74h0c4.29-.01,7.77,3.45,7.79,7.74h0s-7.76.03-7.76.03" />
              <path className={styles.cls8} d="m693.76,137.74h0c4.29.01,7.77-3.45,7.79-7.74h0s-7.76-.03-7.76-.03" />
              <g>
                <path className={styles.cls8} d="m703.68,195.05h0c-4.43.01-8.04-3.57-8.06-8h0s8.03-.03,8.03-.03" />
                <path className={styles.cls8} d="m703.68,195.05h0c-4.43-.01-8.04,3.57-8.06,8h0s8.03.03,8.03.03" />
              </g>
              <g>
                <path className={styles.cls8} d="m759,101.46h0c.01,4.48-3.61,8.13-8.09,8.14h0s-.03-8.11-.03-8.11" />
                <path className={styles.cls8} d="m759,101.46h0c-.01,4.48,3.61,8.13,8.09,8.14h0s.03-8.11.03-8.11" />
              </g>
              <g>
                <path className={styles.cls8} d="m685.56,252.7h0c-.01-4.42,3.56-8.01,7.98-8.03h0s.03,8,.03,8" />
                <path className={styles.cls8} d="m685.56,252.7h0c.01-4.42-3.56-8.01-7.98-8.03h0s-.03,8-.03,8" />
              </g>
              <g>
                <path className={styles.cls8} d="m685.56,266.81h0c.01,4.42-3.56,8.01-7.98,8.03h0s-.03-8-.03-8" />
                <path className={styles.cls8} d="m685.56,266.81h0c-.01,4.42,3.56,8.01,7.98,8.03h0s.03-8,.03-8" />
              </g>
            </g>
            <g id="Stairs">
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
              <polygon className={styles.cls12} points="772.47 43.75 772.47 51.42 769.91 47.58 772.47 43.75" />
              <polyline className={styles.cls6} points="767.56 70.43 807.24 70.43 807.24 47.58 772.53 47.58" />
            </g>
            <g id="Glass">
              <g>
                <line className={styles.cls7} x1="704.15" y1="204.79" x2="714.29" y2="204.79" />
                <line className={styles.cls7} x1="714.29" y1="204.29" x2="714.29" y2="205.29" />
              </g>
              <g id="Glass-2" data-name="Glass">
                <line className={styles.cls7} x1="725.4" y1="204.79" x2="790.98" y2="204.79" />
                <line className={styles.cls7} x1="790.98" y1="204.29" x2="790.98" y2="205.29" />
                <line className={styles.cls7} x1="725.4" y1="204.29" x2="725.4" y2="205.29" />
              </g>
              <g>
                <line className={styles.cls7} x1="814.52" y1="204.79" x2="801.68" y2="204.79" />
                <line className={styles.cls7} x1="801.68" y1="205.29" x2="801.68" y2="204.29" />
              </g>
              <g>
                <line className={styles.cls7} x1="814.49" y1="178.61" x2="814.49" y2="158.58" />
                <line className={styles.cls7} x1="813.99" y1="158.58" x2="814.99" y2="158.58" />
              </g>
              <g>
                <line className={styles.cls7} x1="814.49" y1="118.19" x2="814.49" y2="134.23" />
                <line className={styles.cls7} x1="814.99" y1="134.23" x2="813.99" y2="134.23" />
              </g>
              <g>
                <line className={styles.cls7} x1="814.49" y1="145.44" x2="814.49" y2="144.14" />
                <line className={styles.cls7} x1="813.99" y1="144.14" x2="814.99" y2="144.14" />
              </g>
              <g>
                <line className={styles.cls7} x1="814.49" y1="146.7" x2="814.49" y2="148" />
                <line className={styles.cls7} x1="814.99" y1="148" x2="813.99" y2="148" />
              </g>
              <g>
                <line className={styles.cls7} x1="814.49" y1="183.54" x2="814.49" y2="191.41" />
                <line className={styles.cls7} x1="814.99" y1="191.41" x2="813.99" y2="191.41" />
              </g>
              <g>
                <line className={styles.cls7} x1="814.49" y1="103.68" x2="814.49" y2="106.17" />
                <line className={styles.cls7} x1="814.99" y1="106.17" x2="813.99" y2="106.17" />
              </g>
              <g>
                <line className={styles.cls7} x1="814.49" y1="204.79" x2="814.49" y2="202" />
                <line className={styles.cls7} x1="813.99" y1="202" x2="814.99" y2="202" />
              </g>
              <g>
                <line className={styles.cls7} x1="814.49" y1="117.3" x2="814.49" y2="116" />
                <line className={styles.cls7} x1="813.99" y1="116" x2="814.99" y2="116" />
              </g>
              <line className={styles.cls7} x1="663.33" y1="128.51" x2="676.67" y2="128.51" />
            </g>
            <g id="Windows">
              <rect
                className={styles.cls14}
                x="731.38"
                y="3.04"
                width="2.28"
                height="73.68"
                transform="translate(692.64 772.41) rotate(-90)"
              />
              <rect className={styles.cls14} x="865.03" y="38.75" width="2.11" height="227.81" />
              <rect
                className={styles.cls14}
                x="662.23"
                y="253.05"
                width="1.4"
                height="25.02"
                transform="translate(397.38 928.49) rotate(-90)"
              />
            </g>
            <g id="Machines">
              <rect id="elev" className={styles.cls10} x="769.73" y="80.72" width="21.7" height="14.86" />
              <g id="Machines-2" data-name="Machines">
                <rect
                  id="elev-2"
                  data-name="elev"
                  className={styles.cls10}
                  x="649.06"
                  y="54.25"
                  width="10.85"
                  height="59.9"
                />
              </g>
              <g id="Machines-3" data-name="Machines">
                <rect
                  id="elev-3"
                  data-name="elev"
                  className={styles.cls10}
                  x="671.81"
                  y="54.25"
                  width="10.85"
                  height="59.9"
                />
              </g>
              <g id="Machines-4" data-name="Machines">
                <rect
                  id="elev-4"
                  data-name="elev"
                  className={styles.cls10}
                  x="647.91"
                  y="180.42"
                  width="43.8"
                  height="5.86"
                />
              </g>
            </g>
          </g>
          <g id="Dome">
            <line className={styles.cls7} x1="170.53" y1="192.71" x2="150.53" y2="192.71" />
            <line className={styles.cls7} x1="160.53" y1="202.71" x2="160.53" y2="182.71" />
            <path
              className={styles.cls9}
              d="m621.96,266.24l-328.92.47c-37.56,67.25-119.54,95.7-190.68,66.18C24.94,300.76-11.78,211.96,20.35,134.54,52.48,57.12,141.28,20.4,218.7,52.53l5.44-13.94h407.81"
            />
          </g>
          <g id="text">
            <g id="t1">
              <g>
                <text className={styles.svgText} transform="translate(649.42 81.67)">
                  <tspan className={styles.cls3} x="0" y="0">
                    Computer
                  </tspan>
                  <tspan x="6.27" y="7.2">
                    Room
                  </tspan>
                </text>
              </g>
              <g>
                <text className={styles.svgText} transform="translate(755.06 234.13)">
                  <tspan className={styles.cls3} x="0" y="0">
                    Control Room
                  </tspan>
                </text>
              </g>
              <g>
                <text className={styles.svgText} transform="translate(749.6 144.61)">
                  <tspan x="0" y="0">
                    Open
                  </tspan>
                  <tspan x="-10.58" y="7.2">
                    Office Space
                  </tspan>
                </text>
              </g>
              <g>
                <text className={styles.svgText} transform="translate(823.54 77.69)">
                  <tspan className={styles.cls3} x="0" y="0">
                    Conference
                  </tspan>
                  <tspan x="8.18" y="7.2">
                    Room
                  </tspan>
                </text>
              </g>
              <g>
                <text className={styles.svgText} transform="translate(829.58 133.44)">
                  <tspan x="0" y="0">
                    Office 1
                  </tspan>
                </text>
              </g>
              <g>
                <text className={styles.svgText} transform="translate(828.96 162.18)">
                  <tspan x="0" y="0">
                    Office 2
                  </tspan>
                </text>
              </g>
              <g>
                <text className={styles.svgText} transform="translate(828.97 191.69)">
                  <tspan x="0" y="0">
                    Office 3
                  </tspan>
                </text>
              </g>
              <g>
                <text className={styles.svgText} transform="translate(652.87 157.69)">
                  <tspan className={styles.cls3} x="0" y="0">
                    Computer
                  </tspan>
                  <tspan className={styles.cls36} x="9.8" y="7.2">
                    Lab
                  </tspan>
                </text>
              </g>
              <g>
                <text className={styles.svgText} transform="translate(654.04 213.18)">
                  <tspan x="0" y="0">
                    Break
                  </tspan>
                  <tspan x="-.35" y="7.2">
                    Room
                  </tspan>
                </text>
              </g>
              <g>
                <text className={styles.svgText} transform="translate(657.85 296.73)">
                  <tspan x="0" y="0">
                    Deck
                  </tspan>
                </text>
              </g>
            </g>
            <g id="t2" className={styles.opacity50}>
              <g>
                <text className={styles.svgTextSmall} transform="translate(774.92 59.94)">
                  <tspan className={styles.cls21} x="0" y="0">
                    Wet Shaft
                  </tspan>
                </text>
              </g>
              <g>
                <text className={styles.svgTextSmall} transform="translate(802.06 92.28)">
                  <tspan x="0" y="0">
                    Dry
                  </tspan>
                  <tspan x="-1.69" y="4.8">
                    Shaft
                  </tspan>
                </text>
              </g>
              <g>
                <text className={styles.svgTextSmall} transform="translate(774.48 87.54)">
                  <tspan x="0" y="0">
                    Elev. 1
                  </tspan>
                </text>
              </g>
              <g>
                <text className={styles.svgTextSmall} transform="translate(733.96 91.3)">
                  <tspan x="0" y="0">
                    Hallway
                  </tspan>
                </text>
              </g>
              <g>
                <text className={styles.svgTextSmall} transform="translate(697.97 60.77)">
                  <tspan x="0" y="0">
                    Bathroom
                  </tspan>
                </text>
              </g>
              <g>
                <text className={styles.svgTextSmall} transform="translate(725.18 60.77)">
                  <tspan x="0" y="0">
                    Bathroom
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
