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
      crac01P02,
      crac02P02,
      fancoil01P02,
      fancoil02P02,
      fancoil03P02,
      fancoil04P02,
      fancoil05P02,
      fancoil06P02,
      fancoil07P02,
      fancoil08P02,
      fancoil09P02,
      fancoil10P02,
      fancoil11P02,
      fancoil12P02,
    } = this.props.HVACData;

    return (
      <React.Fragment>
        <Device
          title={'Fancoil 02'}
          temp={fancoil02P02.roomTemperature ? fancoil02P02.roomTemperature.value : null}
          width={84}
          height={112}
          posX={620}
          posY={146}
          collapsible={true}
          states={{
            command: fancoil02P02.switchedOn ? fancoil02P02.switchedOn.value : null,
            working: fancoil02P02.workingState ? fancoil02P02.workingState.value : null,
            unit: fancoil02P02.unitState ? fancoil02P02.unitState.value : null,
            switch: fancoil02P02.selectorState ? fancoil02P02.selectorState.value : null,
          }}
          parameters={{
            heatingState: {
              type: 'status',
              name: 'Heater',
              unit: null,
              value: fancoil02P02.heatingState ? fancoil02P02.heatingState.value : null,
            },
            operationalState: {
              type: 'status',
              name: 'Operation',
              unit: null,
              value: fancoil02P02.operationalState ? fancoil02P02.operationalState.value : null,
            },
            fanState: {
              type: 'status',
              name: 'Fan',
              unit: null,
              value: fancoil02P02.fanState ? fancoil02P02.fanState.value : null,
            },
            coldValveOpening: {
              type: 'single',
              name: 'Opening Valve Cold',
              unit: fancoil02P02.coldValveOpening ? fancoil02P02.coldValveOpening.units : null,
              value: fancoil02P02.coldValveOpening ? fancoil02P02.coldValveOpening.value : null,
            },
            roomTemperature: {
              type: 'single',
              name: 'Temperature Room',
              unit: fancoil02P02.roomTemperature ? 'ºC' : null,
              value: fancoil02P02.roomTemperature ? fancoil02P02.roomTemperature.value : null,
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
                  unit: fancoil02P02.dayCoolingSetpoint ? 'ºC' : null,
                  value: fancoil02P02.dayCoolingSetpoint ? fancoil02P02.dayCoolingSetpoint.value : null,
                },
                dayHeatingSetpoint: {
                  type: 'noBox',
                  alarm: null,
                  name: 'Heating',
                  state: null,
                  unit: fancoil02P02.dayHeatingSetpoint ? 'ºC' : null,
                  value: fancoil02P02.dayHeatingSetpoint ? fancoil02P02.dayHeatingSetpoint.value : null,
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
                  unit: fancoil02P02.nightCoolingSetpoint ? 'ºC' : null,
                  value: fancoil02P02.nightCoolingSetpoint ? fancoil02P02.nightCoolingSetpoint.value : null,
                },
                nightHeatingSetpoint: {
                  type: 'noBox',
                  alarm: null,
                  name: 'Heating',
                  state: null,
                  unit: fancoil02P02.nightHeatingSetpoint ? 'ºC' : null,
                  value: fancoil02P02.nightHeatingSetpoint ? fancoil02P02.nightHeatingSetpoint.value : null,
                },
              },
            },
          }}
        />

        <Device
          title={'Fancoil 01'}
          temp={fancoil01P02.roomTemperature ? fancoil01P02.roomTemperature.value : null}
          width={84}
          height={112}
          posX={632}
          posY={92}
          collapsible={true}
          states={{
            command: fancoil01P02.switchedOn ? fancoil01P02.switchedOn.value : null,
            working: fancoil01P02.workingState ? fancoil01P02.workingState.value : null,
            unit: fancoil01P02.unitState ? fancoil01P02.unitState.value : null,
            switch: fancoil01P02.selectorState ? fancoil01P02.selectorState.value : null,
          }}
          parameters={{
            heatingState: {
              type: 'status',
              name: 'Heater',
              unit: null,
              value: fancoil01P02.heatingState ? fancoil01P02.heatingState.value : null,
            },
            operationalState: {
              type: 'status',
              name: 'Operation',
              unit: null,
              value: fancoil01P02.operationalState ? fancoil01P02.operationalState.value : null,
            },
            fanState: {
              type: 'status',
              name: 'Fan',
              unit: null,
              value: fancoil01P02.fanState ? fancoil01P02.fanState.value : null,
            },
            coldValveOpening: {
              type: 'single',
              name: 'Opening Valve Cold',
              unit: fancoil01P02.coldValveOpening ? fancoil01P02.coldValveOpening.units : null,
              value: fancoil01P02.coldValveOpening ? fancoil01P02.coldValveOpening.value : null,
            },
            roomTemperature: {
              type: 'single',
              name: 'Temperature Room',
              unit: fancoil01P02.roomTemperature ? 'ºC' : null,
              value: fancoil01P02.roomTemperature ? fancoil01P02.roomTemperature.value : null,
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
                  unit: fancoil01P02.dayCoolingSetpoint ? 'ºC' : null,
                  value: fancoil01P02.dayCoolingSetpoint ? fancoil01P02.dayCoolingSetpoint.value : null,
                },
                dayHeatingSetpoint: {
                  type: 'noBox',
                  alarm: null,
                  name: 'Heating',
                  state: null,
                  unit: fancoil01P02.dayHeatingSetpoint ? 'ºC' : null,
                  value: fancoil01P02.dayHeatingSetpoint ? fancoil01P02.dayHeatingSetpoint.value : null,
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
                  unit: fancoil01P02.nightCoolingSetpoint ? 'ºC' : null,
                  value: fancoil01P02.nightCoolingSetpoint ? fancoil01P02.nightCoolingSetpoint.value : null,
                },
                nightHeatingSetpoint: {
                  type: 'noBox',
                  alarm: null,
                  name: 'Heating',
                  state: null,
                  unit: fancoil01P02.nightHeatingSetpoint ? 'ºC' : null,
                  value: fancoil01P02.nightHeatingSetpoint ? fancoil01P02.nightHeatingSetpoint.value : null,
                },
              },
            },
          }}
        />

        <Device
          title={'Crack 02'}
          width={110}
          height={130}
          posX={612}
          posY={45}
          collapsible={true}
          alarms={{
            alarm1: {
              name: 'State Presense',
              state: crac02P02.alarmPresentState ? crac02P02.alarmPresentState.value : null,
            },
          }}
          states={{
            command: crac02P02.switchedOn ? crac02P02.switchedOn.value : null,
            working: crac02P02.workingState ? crac02P02.workingState.value : null,
            unit: crac02P02.unitState ? crac02P02.unitState.value : null,
            switch: crac02P02.selectorState ? crac02P02.selectorState.value : null,
          }}
          parameters={{
            unitOperationalMode: {
              type: 'single',
              name: 'Mode of Operation',
              unit: null,
              value: crac02P02.unitOperationalMode ? crac02P02.unitOperationalMode.value : null,
            },
            valveOpening: {
              type: 'single',
              name: 'Opening Valve',
              unit: crac02P02.valveOpening ? crac02P02.valveOpening.units : null,
              value: crac02P02.valveOpening ? crac02P02.valveOpening.value : null,
            },
            roomHumidity: {
              type: 'single',
              name: 'Room Humidity',
              unit: crac02P02.roomHumidity ? crac02P02.roomHumidity.units : null,
              value: crac02P02.roomHumidity ? crac02P02.roomHumidity.value : null,
            },
            hourMeasure: {
              type: 'single',
              name: 'HOROMETRO',
              unit: crac02P02.hourMeasure ? crac02P02.hourMeasure.units : null,
              value: crac02P02.hourMeasure ? crac02P02.hourMeasure.value : null,
            },
            numberOfCircuits: {
              type: 'single',
              name: 'Number Circuits',
              unit: null,
              value: crac02P02.numberOfCircuits ? crac02P02.numberOfCircuits.value : null,
            },
            humidifierRequirement: {
              type: 'single',
              name: 'Requirement Humidifier',
              unit: crac02P02.humidifierRequirement ? crac02P02.humidifierRequirement.units : null,
              value: crac02P02.humidifierRequirement ? crac02P02.humidifierRequirement.value : null,
            },
            activeSetpoint: {
              type: 'single',
              name: 'Setpoint Active',
              unit: crac02P02.activeSetpoint ? 'ºC' : null,
              value: crac02P02.activeSetpoint ? crac02P02.activeSetpoint.value : null,
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
                  unit: crac02P02.coolingSetpoint ? 'ºC' : null,
                  value: crac02P02.coolingSetpoint ? crac02P02.coolingSetpoint.value : null,
                },
                heatingSetpoint: {
                  type: 'noBox',
                  alarm: null,
                  name: 'Heating',
                  state: null,
                  unit: crac02P02.heatingSetpoint ? 'ºC' : null,
                  value: crac02P02.heatingSetpoint ? crac02P02.heatingSetpoint.value : null,
                },
                humidifierSetpoint: {
                  type: 'noBox',
                  alarm: null,
                  name: 'Humidifier',
                  state: null,
                  unit: crac02P02.humidifierSetpoint ? '%' : null,
                  value: crac02P02.humidifierSetpoint ? crac02P02.humidifierSetpoint.value : null,
                },
                dehumidifierSetpoint: {
                  type: 'noBox',
                  alarm: null,
                  name: 'Dehumidifier',
                  state: null,
                  unit: crac02P02.dehumidifierSetpoint ? '%' : null,
                  value: crac02P02.dehumidifierSetpoint ? crac02P02.dehumidifierSetpoint.value : null,
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
                  unit: crac02P02.supplyTemperature ? 'ºC Injection' : null,
                  value: crac02P02.supplyTemperature ? crac02P02.supplyTemperature.value : null,
                },
                returnTemperature: {
                  type: 'badge',
                  alarm: null,
                  name: '02',
                  state: null,
                  unit: crac02P02.returnTemperature ? '% Return' : null,
                  value: crac02P02.returnTemperature ? crac02P02.returnTemperature.value : null,
                },
              },
            },
          }}
        />

        <Device
          title={'Crack 01'}
          width={110}
          height={130}
          posX={612}
          posY={12}
          collapsible={true}
          alarms={{
            alarm1: {
              name: 'State Presense',
              state: crac01P02.alarmPresentState ? crac01P02.alarmPresentState.value : null,
            },
          }}
          states={{
            command: crac01P02.switchedOn ? crac01P02.switchedOn.value : null,
            working: crac01P02.workingState ? crac01P02.workingState.value : null,
            unit: crac01P02.unitState ? crac01P02.unitState.value : null,
            switch: crac01P02.selectorState ? crac01P02.selectorState.value : null,
          }}
          parameters={{
            unitOperationalMode: {
              type: 'single',
              name: 'Mode of Operation',
              unit: null,
              value: crac01P02.unitOperationalMode ? crac01P02.unitOperationalMode.value : null,
            },
            valveOpening: {
              type: 'single',
              name: 'Opening Valve',
              unit: crac01P02.valveOpening ? crac01P02.valveOpening.units : null,
              value: crac01P02.valveOpening ? crac01P02.valveOpening.value : null,
            },
            roomHumidity: {
              type: 'single',
              name: 'Room Humidity',
              unit: crac01P02.roomHumidity ? crac01P02.roomHumidity.units : null,
              value: crac01P02.roomHumidity ? crac01P02.roomHumidity.value : null,
            },
            hourMeasure: {
              type: 'single',
              name: 'HOROMETRO',
              unit: crac01P02.hourMeasure ? crac01P02.hourMeasure.units : null,
              value: crac01P02.hourMeasure ? crac01P02.hourMeasure.value : null,
            },
            numberOfCircuits: {
              type: 'single',
              name: 'Number Circuits',
              unit: null,
              value: crac01P02.numberOfCircuits ? crac01P02.numberOfCircuits.value : null,
            },
            humidifierRequirement: {
              type: 'single',
              name: 'Requirement Humidifier',
              unit: crac01P02.humidifierRequirement ? crac01P02.humidifierRequirement.units : null,
              value: crac01P02.humidifierRequirement ? crac01P02.humidifierRequirement.value : null,
            },
            activeSetpoint: {
              type: 'single',
              name: 'Setpoint Active',
              unit: crac01P02.activeSetpoint ? 'ºC' : null,
              value: crac01P02.activeSetpoint ? crac01P02.activeSetpoint.value : null,
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
                  unit: crac01P02.coolingSetpoint ? 'ºC' : null,
                  value: crac01P02.coolingSetpoint ? crac01P02.coolingSetpoint.value : null,
                },
                heatingSetpoint: {
                  type: 'noBox',
                  alarm: null,
                  name: 'Heating',
                  state: null,
                  unit: crac01P02.heatingSetpoint ? 'ºC' : null,
                  value: crac01P02.heatingSetpoint ? crac01P02.heatingSetpoint.value : null,
                },
                humidifierSetpoint: {
                  type: 'noBox',
                  alarm: null,
                  name: 'Humidifier',
                  state: null,
                  unit: crac01P02.humidifierSetpoint ? '%' : null,
                  value: crac01P02.humidifierSetpoint ? crac01P02.humidifierSetpoint.value : null,
                },
                dehumidifierSetpoint: {
                  type: 'noBox',
                  alarm: null,
                  name: 'Dehumidifier',
                  state: null,
                  unit: crac01P02.dehumidifierSetpoint ? '%' : null,
                  value: crac01P02.dehumidifierSetpoint ? crac01P02.dehumidifierSetpoint.value : null,
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
                  unit: crac01P02.supplyTemperature ? 'ºC Injection' : null,
                  value: crac01P02.supplyTemperature ? crac01P02.supplyTemperature.value : null,
                },
                returnTemperature: {
                  type: 'badge',
                  alarm: null,
                  name: '02',
                  state: null,
                  unit: crac01P02.returnTemperature ? '% Return' : null,
                  value: crac01P02.returnTemperature ? crac01P02.returnTemperature.value : null,
                },
              },
            },
          }}
        />

        <Device
          title={'Fancoil 05'}
          temp={fancoil05P02.roomTemperature ? fancoil05P02.roomTemperature.value : null}
          width={84}
          height={112}
          posX={800}
          posY={165}
          alarm={0}
          collapsible={true}
          states={{
            command: fancoil05P02.switchedOn ? fancoil05P02.switchedOn.value : null,
            working: fancoil05P02.workingState ? fancoil05P02.workingState.value : null,
            unit: fancoil05P02.unitState ? fancoil05P02.unitState.value : null,
            switch: fancoil05P02.selectorState ? fancoil05P02.selectorState.value : null,
          }}
          parameters={{
            heatingState: {
              type: 'status',
              name: 'Heater',
              unit: null,
              value: fancoil05P02.heatingState ? fancoil05P02.heatingState.value : null,
            },
            operationalState: {
              type: 'status',
              name: 'Operation',
              unit: null,
              value: fancoil05P02.operationalState ? fancoil05P02.operationalState.value : null,
            },
            fanState: {
              type: 'status',
              name: 'Fan',
              unit: null,
              value: fancoil05P02.fanState ? fancoil05P02.fanState.value : null,
            },
            coldValveOpening: {
              type: 'single',
              name: 'Opening Valve Cold',
              unit: fancoil05P02.coldValveOpening ? fancoil05P02.coldValveOpening.units : null,
              value: fancoil05P02.coldValveOpening ? fancoil05P02.coldValveOpening.value : null,
            },
            roomTemperature: {
              type: 'single',
              name: 'Temperature Room',
              unit: fancoil05P02.roomTemperature ? 'ºC' : null,
              value: fancoil05P02.roomTemperature ? fancoil05P02.roomTemperature.value : null,
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
                  unit: fancoil05P02.dayCoolingSetpoint ? 'ºC' : null,
                  value: fancoil05P02.dayCoolingSetpoint ? fancoil05P02.dayCoolingSetpoint.value : null,
                },
                dayHeatingSetpoint: {
                  type: 'noBox',
                  alarm: null,
                  name: 'Heating',
                  state: null,
                  unit: fancoil05P02.dayHeatingSetpoint ? 'ºC' : null,
                  value: fancoil05P02.dayHeatingSetpoint ? fancoil05P02.dayHeatingSetpoint.value : null,
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
                  unit: fancoil05P02.nightCoolingSetpoint ? 'ºC' : null,
                  value: fancoil05P02.nightCoolingSetpoint ? fancoil05P02.nightCoolingSetpoint.value : null,
                },
                nightHeatingSetpoint: {
                  type: 'noBox',
                  alarm: null,
                  name: 'Heating',
                  state: null,
                  unit: fancoil05P02.nightHeatingSetpoint ? 'ºC' : null,
                  value: fancoil05P02.nightHeatingSetpoint ? fancoil05P02.nightHeatingSetpoint.value : null,
                },
              },
            },
          }}
        />

        <Device
          title={'Fancoil 08'}
          temp={fancoil08P02.roomTemperature ? fancoil08P02.roomTemperature.value : null}
          width={84}
          height={112}
          posX={800}
          posY={145}
          alarm={0}
          collapsible={true}
          states={{
            command: fancoil08P02.switchedOn ? fancoil08P02.switchedOn.value : null,
            working: fancoil08P02.workingState ? fancoil08P02.workingState.value : null,
            unit: fancoil08P02.unitState ? fancoil08P02.unitState.value : null,
            switch: fancoil08P02.selectorState ? fancoil08P02.selectorState.value : null,
          }}
          parameters={{
            heatingState: {
              type: 'status',
              name: 'Heater',
              unit: null,
              value: fancoil08P02.heatingState ? fancoil08P02.heatingState.value : null,
            },
            operationalState: {
              type: 'status',
              name: 'Operation',
              unit: null,
              value: fancoil08P02.operationalState ? fancoil08P02.operationalState.value : null,
            },
            fanState: {
              type: 'status',
              name: 'Fan',
              unit: null,
              value: fancoil08P02.fanState ? fancoil08P02.fanState.value : null,
            },
            coldValveOpening: {
              type: 'single',
              name: 'Opening Valve Cold',
              unit: fancoil08P02.coldValveOpening ? fancoil08P02.coldValveOpening.units : null,
              value: fancoil08P02.coldValveOpening ? fancoil08P02.coldValveOpening.value : null,
            },
            roomTemperature: {
              type: 'single',
              name: 'Temperature Room',
              unit: fancoil08P02.roomTemperature ? 'ºC' : null,
              value: fancoil08P02.roomTemperature ? fancoil08P02.roomTemperature.value : null,
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
                  unit: fancoil08P02.dayCoolingSetpoint ? 'ºC' : null,
                  value: fancoil08P02.dayCoolingSetpoint ? fancoil08P02.dayCoolingSetpoint.value : null,
                },
                dayHeatingSetpoint: {
                  type: 'noBox',
                  alarm: null,
                  name: 'Heating',
                  state: null,
                  unit: fancoil08P02.dayHeatingSetpoint ? 'ºC' : null,
                  value: fancoil08P02.dayHeatingSetpoint ? fancoil08P02.dayHeatingSetpoint.value : null,
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
                  unit: fancoil08P02.nightCoolingSetpoint ? 'ºC' : null,
                  value: fancoil08P02.nightCoolingSetpoint ? fancoil08P02.nightCoolingSetpoint.value : null,
                },
                nightHeatingSetpoint: {
                  type: 'noBox',
                  alarm: null,
                  name: 'Heating',
                  state: null,
                  unit: fancoil08P02.nightHeatingSetpoint ? 'ºC' : null,
                  value: fancoil08P02.nightHeatingSetpoint ? fancoil08P02.nightHeatingSetpoint.value : null,
                },
              },
            },
          }}
        />

        <Device
          title={'Fancoil 07'}
          temp={fancoil07P02.roomTemperature ? fancoil07P02.roomTemperature.value : null}
          width={84}
          height={122}
          posX={800}
          posY={110}
          alarm={0}
          collapsible={true}
          states={{
            command: fancoil07P02.switchedOn ? fancoil07P02.switchedOn.value : null,
            working: fancoil07P02.workingState ? fancoil07P02.workingState.value : null,
            unit: fancoil07P02.unitState ? fancoil07P02.unitState.value : null,
            switch: fancoil07P02.selectorState ? fancoil07P02.selectorState.value : null,
          }}
          parameters={{
            heatingState: {
              type: 'status',
              name: 'Heater',
              unit: null,
              value: fancoil07P02.heatingState ? fancoil07P02.heatingState.value : null,
            },
            operationalState: {
              type: 'status',
              name: 'Operation',
              unit: null,
              value: fancoil07P02.operationalState ? fancoil07P02.operationalState.value : null,
            },
            fanState: {
              type: 'status',
              name: 'Fan',
              unit: null,
              value: fancoil07P02.fanState ? fancoil07P02.fanState.value : null,
            },
            coldValveOpening: {
              type: 'single',
              name: 'Opening Valve Cold',
              unit: fancoil07P02.coldValveOpening ? fancoil07P02.coldValveOpening.units : null,
              value: fancoil07P02.coldValveOpening ? fancoil07P02.coldValveOpening.value : null,
            },
            roomTemperature: {
              type: 'single',
              name: 'Temperature Room',
              unit: fancoil07P02.roomTemperature ? 'ºC' : null,
              value: fancoil07P02.roomTemperature ? fancoil07P02.roomTemperature.value : null,
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
                  unit: fancoil07P02.dayCoolingSetpoint ? 'ºC' : null,
                  value: fancoil07P02.dayCoolingSetpoint ? fancoil07P02.dayCoolingSetpoint.value : null,
                },
                dayHeatingSetpoint: {
                  type: 'noBox',
                  alarm: null,
                  name: 'Heating',
                  state: null,
                  unit: fancoil07P02.dayHeatingSetpoint ? 'ºC' : null,
                  value: fancoil07P02.dayHeatingSetpoint ? fancoil07P02.dayHeatingSetpoint.value : null,
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
                  unit: fancoil07P02.nightCoolingSetpoint ? 'ºC' : null,
                  value: fancoil07P02.nightCoolingSetpoint ? fancoil07P02.nightCoolingSetpoint.value : null,
                },
                nightHeatingSetpoint: {
                  type: 'noBox',
                  alarm: null,
                  name: 'Heating',
                  state: null,
                  unit: fancoil07P02.nightHeatingSetpoint ? 'ºC' : null,
                  value: fancoil07P02.nightHeatingSetpoint ? fancoil07P02.nightHeatingSetpoint.value : null,
                },
              },
            },
          }}
        />

        <Device
          title={'Fancoil 03'}
          temp={fancoil03P02.roomTemperature ? fancoil03P02.roomTemperature.value : null}
          width={84}
          height={112}
          posX={682}
          posY={165}
          alarm={0}
          collapsible={true}
          states={{
            command: fancoil03P02.switchedOn ? fancoil03P02.switchedOn.value : null,
            working: fancoil03P02.workingState ? fancoil03P02.workingState.value : null,
            unit: fancoil03P02.unitState ? fancoil03P02.unitState.value : null,
            switch: fancoil03P02.selectorState ? fancoil03P02.selectorState.value : null,
          }}
          parameters={{
            heatingState: {
              type: 'status',
              name: 'Heater',
              unit: null,
              value: fancoil03P02.heatingState ? fancoil03P02.heatingState.value : null,
            },
            operationalState: {
              type: 'status',
              name: 'Operation',
              unit: null,
              value: fancoil03P02.operationalState ? fancoil03P02.operationalState.value : null,
            },
            fanState: {
              type: 'status',
              name: 'Fan',
              unit: null,
              value: fancoil03P02.fanState ? fancoil03P02.fanState.value : null,
            },
            coldValveOpening: {
              type: 'single',
              name: 'Opening Valve Cold',
              unit: fancoil03P02.coldValveOpening ? fancoil03P02.coldValveOpening.units : null,
              value: fancoil03P02.coldValveOpening ? fancoil03P02.coldValveOpening.value : null,
            },
            roomTemperature: {
              type: 'single',
              name: 'Temperature Room',
              unit: fancoil03P02.roomTemperature ? 'ºC' : null,
              value: fancoil03P02.roomTemperature ? fancoil03P02.roomTemperature.value : null,
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
                  unit: fancoil03P02.dayCoolingSetpoint ? 'ºC' : null,
                  value: fancoil03P02.dayCoolingSetpoint ? fancoil03P02.dayCoolingSetpoint.value : null,
                },
                dayHeatingSetpoint: {
                  type: 'noBox',
                  alarm: null,
                  name: 'Heating',
                  state: null,
                  unit: fancoil03P02.dayHeatingSetpoint ? 'ºC' : null,
                  value: fancoil03P02.dayHeatingSetpoint ? fancoil03P02.dayHeatingSetpoint.value : null,
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
                  unit: fancoil03P02.nightCoolingSetpoint ? 'ºC' : null,
                  value: fancoil03P02.nightCoolingSetpoint ? fancoil03P02.nightCoolingSetpoint.value : null,
                },
                nightHeatingSetpoint: {
                  type: 'noBox',
                  alarm: null,
                  name: 'Heating',
                  state: null,
                  unit: fancoil03P02.nightHeatingSetpoint ? 'ºC' : null,
                  value: fancoil03P02.nightHeatingSetpoint ? fancoil03P02.nightHeatingSetpoint.value : null,
                },
              },
            },
          }}
        />

        <Device
          title={'Fancoil 04'}
          temp={fancoil04P02.roomTemperature ? fancoil04P02.roomTemperature.value : null}
          width={84}
          height={112}
          posX={736}
          posY={165}
          alarm={0}
          collapsible={true}
          states={{
            command: fancoil04P02.switchedOn ? fancoil04P02.switchedOn.value : null,
            working: fancoil04P02.workingState ? fancoil04P02.workingState.value : null,
            unit: fancoil04P02.unitState ? fancoil04P02.unitState.value : null,
            switch: fancoil04P02.selectorState ? fancoil04P02.selectorState.value : null,
          }}
          parameters={{
            heatingState: {
              type: 'status',
              name: 'Heater',
              unit: null,
              value: fancoil04P02.heatingState ? fancoil04P02.heatingState.value : null,
            },
            operationalState: {
              type: 'status',
              name: 'Operation',
              unit: null,
              value: fancoil04P02.operationalState ? fancoil04P02.operationalState.value : null,
            },
            fanState: {
              type: 'status',
              name: 'Fan',
              unit: null,
              value: fancoil04P02.fanState ? fancoil04P02.fanState.value : null,
            },
            coldValveOpening: {
              type: 'single',
              name: 'Opening Valve Cold',
              unit: fancoil04P02.coldValveOpening ? fancoil04P02.coldValveOpening.units : null,
              value: fancoil04P02.coldValveOpening ? fancoil04P02.coldValveOpening.value : null,
            },
            roomTemperature: {
              type: 'single',
              name: 'Temperature Room',
              unit: fancoil04P02.roomTemperature ? 'ºC' : null,
              value: fancoil04P02.roomTemperature ? fancoil04P02.roomTemperature.value : null,
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
                  unit: fancoil04P02.dayCoolingSetpoint ? 'ºC' : null,
                  value: fancoil04P02.dayCoolingSetpoint ? fancoil04P02.dayCoolingSetpoint.value : null,
                },
                dayHeatingSetpoint: {
                  type: 'noBox',
                  alarm: null,
                  name: 'Heating',
                  state: null,
                  unit: fancoil04P02.dayHeatingSetpoint ? 'ºC' : null,
                  value: fancoil04P02.dayHeatingSetpoint ? fancoil04P02.dayHeatingSetpoint.value : null,
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
                  unit: fancoil04P02.nightCoolingSetpoint ? 'ºC' : null,
                  value: fancoil04P02.nightCoolingSetpoint ? fancoil04P02.nightCoolingSetpoint.value : null,
                },
                nightHeatingSetpoint: {
                  type: 'noBox',
                  alarm: null,
                  name: 'Heating',
                  state: null,
                  unit: fancoil04P02.nightHeatingSetpoint ? 'ºC' : null,
                  value: fancoil04P02.nightHeatingSetpoint ? fancoil04P02.nightHeatingSetpoint.value : null,
                },
              },
            },
          }}
        />

        <Device
          title={'Fancoil 10'}
          temp={fancoil10P02.roomTemperature ? fancoil10P02.roomTemperature.value : null}
          width={84}
          height={112}
          posX={692}
          posY={71}
          alarm={0}
          collapsible={true}
          states={{
            command: fancoil10P02.switchedOn ? fancoil10P02.switchedOn.value : null,
            working: fancoil10P02.workingState ? fancoil10P02.workingState.value : null,
            unit: fancoil10P02.unitState ? fancoil10P02.unitState.value : null,
            switch: fancoil10P02.selectorState ? fancoil10P02.selectorState.value : null,
          }}
          parameters={{
            heatingState: {
              type: 'status',
              name: 'Heater',
              unit: null,
              value: fancoil10P02.heatingState ? fancoil10P02.heatingState.value : null,
            },
            operationalState: {
              type: 'status',
              name: 'Operation',
              unit: null,
              value: fancoil10P02.operationalState ? fancoil10P02.operationalState.value : null,
            },
            fanState: {
              type: 'status',
              name: 'Fan',
              unit: null,
              value: fancoil10P02.fanState ? fancoil10P02.fanState.value : null,
            },
            coldValveOpening: {
              type: 'single',
              name: 'Opening Valve Cold',
              unit: fancoil10P02.coldValveOpening ? fancoil10P02.coldValveOpening.units : null,
              value: fancoil10P02.coldValveOpening ? fancoil10P02.coldValveOpening.value : null,
            },
            roomTemperature: {
              type: 'single',
              name: 'Temperature Room',
              unit: fancoil10P02.roomTemperature ? 'ºC' : null,
              value: fancoil10P02.roomTemperature ? fancoil10P02.roomTemperature.value : null,
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
                  unit: fancoil10P02.dayCoolingSetpoint ? 'ºC' : null,
                  value: fancoil10P02.dayCoolingSetpoint ? fancoil10P02.dayCoolingSetpoint.value : null,
                },
                dayHeatingSetpoint: {
                  type: 'noBox',
                  alarm: null,
                  name: 'Heating',
                  state: null,
                  unit: fancoil10P02.dayHeatingSetpoint ? 'ºC' : null,
                  value: fancoil10P02.dayHeatingSetpoint ? fancoil10P02.dayHeatingSetpoint.value : null,
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
                  unit: fancoil10P02.nightCoolingSetpoint ? 'ºC' : null,
                  value: fancoil10P02.nightCoolingSetpoint ? fancoil10P02.nightCoolingSetpoint.value : null,
                },
                nightHeatingSetpoint: {
                  type: 'noBox',
                  alarm: null,
                  name: 'Heating',
                  state: null,
                  unit: fancoil10P02.nightHeatingSetpoint ? 'ºC' : null,
                  value: fancoil10P02.nightHeatingSetpoint ? fancoil10P02.nightHeatingSetpoint.value : null,
                },
              },
            },
          }}
        />

        <Device
          title={'Fancoil 11'}
          temp={fancoil11P02.roomTemperature ? fancoil11P02.roomTemperature.value : null}
          width={84}
          height={112}
          posX={742}
          posY={71}
          alarm={0}
          collapsible={true}
          states={{
            command: fancoil11P02.switchedOn ? fancoil11P02.switchedOn.value : null,
            working: fancoil11P02.workingState ? fancoil11P02.workingState.value : null,
            unit: fancoil11P02.unitState ? fancoil11P02.unitState.value : null,
            switch: fancoil11P02.selectorState ? fancoil11P02.selectorState.value : null,
          }}
          parameters={{
            heatingState: {
              type: 'status',
              name: 'Heater',
              unit: null,
              value: fancoil11P02.heatingState ? fancoil11P02.heatingState.value : null,
            },
            operationalState: {
              type: 'status',
              name: 'Operation',
              unit: null,
              value: fancoil11P02.operationalState ? fancoil11P02.operationalState.value : null,
            },
            fanState: {
              type: 'status',
              name: 'Fan',
              unit: null,
              value: fancoil11P02.fanState ? fancoil11P02.fanState.value : null,
            },
            coldValveOpening: {
              type: 'single',
              name: 'Opening Valve Cold',
              unit: fancoil11P02.coldValveOpening ? fancoil11P02.coldValveOpening.units : null,
              value: fancoil11P02.coldValveOpening ? fancoil11P02.coldValveOpening.value : null,
            },
            roomTemperature: {
              type: 'single',
              name: 'Temperature Room',
              unit: fancoil11P02.roomTemperature ? 'ºC' : null,
              value: fancoil11P02.roomTemperature ? fancoil11P02.roomTemperature.value : null,
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
                  unit: fancoil11P02.dayCoolingSetpoint ? 'ºC' : null,
                  value: fancoil11P02.dayCoolingSetpoint ? fancoil11P02.dayCoolingSetpoint.value : null,
                },
                dayHeatingSetpoint: {
                  type: 'noBox',
                  alarm: null,
                  name: 'Heating',
                  state: null,
                  unit: fancoil11P02.dayHeatingSetpoint ? 'ºC' : null,
                  value: fancoil11P02.dayHeatingSetpoint ? fancoil11P02.dayHeatingSetpoint.value : null,
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
                  unit: fancoil11P02.nightCoolingSetpoint ? 'ºC' : null,
                  value: fancoil11P02.nightCoolingSetpoint ? fancoil11P02.nightCoolingSetpoint.value : null,
                },
                nightHeatingSetpoint: {
                  type: 'noBox',
                  alarm: null,
                  name: 'Heating',
                  state: null,
                  unit: fancoil11P02.nightHeatingSetpoint ? 'ºC' : null,
                  value: fancoil11P02.nightHeatingSetpoint ? fancoil11P02.nightHeatingSetpoint.value : null,
                },
              },
            },
          }}
        />

        <Device
          title={'Fancoil 06'}
          temp={fancoil06P02.roomTemperature ? fancoil06P02.roomTemperature.value : null}
          width={84}
          height={112}
          posX={800}
          posY={81}
          alarm={0}
          collapsible={true}
          states={{
            command: fancoil06P02.switchedOn ? fancoil06P02.switchedOn.value : null,
            working: fancoil06P02.workingState ? fancoil06P02.workingState.value : null,
            unit: fancoil06P02.unitState ? fancoil06P02.unitState.value : null,
            switch: fancoil06P02.selectorState ? fancoil06P02.selectorState.value : null,
          }}
          parameters={{
            heatingState: {
              type: 'status',
              name: 'Heater',
              unit: null,
              value: fancoil06P02.heatingState ? fancoil06P02.heatingState.value : null,
            },
            operationalState: {
              type: 'status',
              name: 'Operation',
              unit: null,
              value: fancoil06P02.operationalState ? fancoil06P02.operationalState.value : null,
            },
            fanState: {
              type: 'status',
              name: 'Fan',
              unit: null,
              value: fancoil06P02.fanState ? fancoil06P02.fanState.value : null,
            },
            coldValveOpening: {
              type: 'single',
              name: 'Opening Valve Cold',
              unit: fancoil06P02.coldValveOpening ? fancoil06P02.coldValveOpening.units : null,
              value: fancoil06P02.coldValveOpening ? fancoil06P02.coldValveOpening.value : null,
            },
            roomTemperature: {
              type: 'single',
              name: 'Temperature Room',
              unit: fancoil06P02.roomTemperature ? 'ºC' : null,
              value: fancoil06P02.roomTemperature ? fancoil06P02.roomTemperature.value : null,
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
                  unit: fancoil06P02.dayCoolingSetpoint ? 'ºC' : null,
                  value: fancoil06P02.dayCoolingSetpoint ? fancoil06P02.dayCoolingSetpoint.value : null,
                },
                dayHeatingSetpoint: {
                  type: 'noBox',
                  alarm: null,
                  name: 'Heating',
                  state: null,
                  unit: fancoil06P02.dayHeatingSetpoint ? 'ºC' : null,
                  value: fancoil06P02.dayHeatingSetpoint ? fancoil06P02.dayHeatingSetpoint.value : null,
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
                  unit: fancoil06P02.nightCoolingSetpoint ? 'ºC' : null,
                  value: fancoil06P02.nightCoolingSetpoint ? fancoil06P02.nightCoolingSetpoint.value : null,
                },
                nightHeatingSetpoint: {
                  type: 'noBox',
                  alarm: null,
                  name: 'Heating',
                  state: null,
                  unit: fancoil06P02.nightHeatingSetpoint ? 'ºC' : null,
                  value: fancoil06P02.nightHeatingSetpoint ? fancoil06P02.nightHeatingSetpoint.value : null,
                },
              },
            },
          }}
        />

        <Device
          title={'Fancoil 09'}
          temp={fancoil09P02.roomTemperature ? fancoil09P02.roomTemperature.value : null}
          width={84}
          height={112}
          posX={800}
          posY={45}
          alarm={0}
          collapsible={true}
          states={{
            command: fancoil09P02.switchedOn ? fancoil09P02.switchedOn.value : null,
            working: fancoil09P02.workingState ? fancoil09P02.workingState.value : null,
            unit: fancoil09P02.unitState ? fancoil09P02.unitState.value : null,
            switch: fancoil09P02.selectorState ? fancoil09P02.selectorState.value : null,
          }}
          parameters={{
            heatingState: {
              type: 'status',
              name: 'Heater',
              unit: null,
              value: fancoil09P02.heatingState ? fancoil09P02.heatingState.value : null,
            },
            operationalState: {
              type: 'status',
              name: 'Operation',
              unit: null,
              value: fancoil09P02.operationalState ? fancoil09P02.operationalState.value : null,
            },
            fanState: {
              type: 'status',
              name: 'Fan',
              unit: null,
              value: fancoil09P02.fanState ? fancoil09P02.fanState.value : null,
            },
            coldValveOpening: {
              type: 'single',
              name: 'Opening Valve Cold',
              unit: fancoil09P02.coldValveOpening ? fancoil09P02.coldValveOpening.units : null,
              value: fancoil09P02.coldValveOpening ? fancoil09P02.coldValveOpening.value : null,
            },
            roomTemperature: {
              type: 'single',
              name: 'Temperature Room',
              unit: fancoil09P02.roomTemperature ? 'ºC' : null,
              value: fancoil09P02.roomTemperature ? fancoil09P02.roomTemperature.value : null,
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
                  unit: fancoil09P02.dayCoolingSetpoint ? 'ºC' : null,
                  value: fancoil09P02.dayCoolingSetpoint ? fancoil09P02.dayCoolingSetpoint.value : null,
                },
                dayHeatingSetpoint: {
                  type: 'noBox',
                  alarm: null,
                  name: 'Heating',
                  state: null,
                  unit: fancoil09P02.dayHeatingSetpoint ? 'ºC' : null,
                  value: fancoil09P02.dayHeatingSetpoint ? fancoil09P02.dayHeatingSetpoint.value : null,
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
                  unit: fancoil09P02.nightCoolingSetpoint ? 'ºC' : null,
                  value: fancoil09P02.nightCoolingSetpoint ? fancoil09P02.nightCoolingSetpoint.value : null,
                },
                nightHeatingSetpoint: {
                  type: 'noBox',
                  alarm: null,
                  name: 'Heating',
                  state: null,
                  unit: fancoil09P02.nightHeatingSetpoint ? 'ºC' : null,
                  value: fancoil09P02.nightHeatingSetpoint ? fancoil09P02.nightHeatingSetpoint.value : null,
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
