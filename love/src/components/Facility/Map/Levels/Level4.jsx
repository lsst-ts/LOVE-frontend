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
import styles from './Level4.module.css';
import Device from '../Device.jsx';
import * as d3 from 'd3';

export default class Level4 extends Component {
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
    const { manejadoraSblancaP04, manejadoraSlimpiaP04, vex03LowerP04, vex04CargaP04 } = this.props.HVACData;

    return (
      <React.Fragment>
        <Device
          title={'Manejadora Sala Blanca'}
          id={501}
          width={90}
          height={130}
          posX={338}
          posY={20}
          collapsible={true}
          alarms={{
            alarm1: {
              name: 'General',
              state: manejadoraSblancaP04.alarmaGeneral ? manejadoraSblancaP04.alarmaGeneral.value : null,
            },
            alarm2: {
              name: 'Filtro',
              state: manejadoraSblancaP04.alarmaFiltro ? manejadoraSblancaP04.alarmaFiltro.value : null,
            },
            alarm3: {
              name: 'Reset',
              state: manejadoraSblancaP04.resetAlarma ? manejadoraSblancaP04.resetAlarma.value : null,
            },
          }}
          states={{
            command: manejadoraSblancaP04.comandoEncendido ? manejadoraSblancaP04.comandoEncendido.value : null,
            working: manejadoraSblancaP04.estadoFuncionamiento ? manejadoraSblancaP04.estadoFuncionamiento.value : null,
            unit: manejadoraSblancaP04.estadoUnidad ? manejadoraSblancaP04.estadoUnidad.value : null,
            switch: manejadoraSblancaP04.estadoSelector ? manejadoraSblancaP04.estadoSelector.value : null,
          }}
          parameters={{
            estadoDamper: {
              type: 'status',
              name: 'Damper',
              unit: null,
              value: manejadoraSblancaP04.estadoDamper ? manejadoraSblancaP04.estadoDamper.value : null,
            },
            caudalVentiladorImpulsion: {
              type: 'single',
              name: 'Yield Fan Impulse',
              unit: manejadoraSblancaP04.caudalVentiladorImpulsion
                ? manejadoraSblancaP04.caudalVentiladorImpulsion.units
                : null,
              value: manejadoraSblancaP04.caudalVentiladorImpulsion
                ? manejadoraSblancaP04.caudalVentiladorImpulsion.value
                : null,
            },
            estadoValvula: {
              type: 'single',
              name: 'State Valve',
              unit: manejadoraSblancaP04.estadoValvula ? manejadoraSblancaP04.estadoValvula.units : null,
              value: manejadoraSblancaP04.estadoValvula ? manejadoraSblancaP04.estadoValvula.value : null,
            },
            horometro: {
              type: 'single',
              name: 'HOROMETRO',
              unit: manejadoraSblancaP04.horometro ? manejadoraSblancaP04.horometro.units : null,
              value: manejadoraSblancaP04.horometro ? manejadoraSblancaP04.horometro.value : null,
            },
            setpoint: {
              type: 'group',
              name: 'Setpoint',
              unit: manejadoraSblancaP04.valorConsigna ? 'ºC' : null,
              value: manejadoraSblancaP04.valorConsigna ? manejadoraSblancaP04.valorConsigna.value : null,
              params: {
                setpointTrabajo: {
                  type: 'noBox',
                  alarm: null,
                  name: 'Work',
                  state: null,
                  unit: manejadoraSblancaP04.setpointTrabajo ? 'ºC' : null,
                  value: manejadoraSblancaP04.setpointTrabajo ? manejadoraSblancaP04.setpointTrabajo.value : null,
                },
                setpointVentiladorMax: {
                  type: 'noBox',
                  alarm: null,
                  name: 'Fan Max',
                  state: null,
                  unit: manejadoraSblancaP04.setpointVentiladorMax
                    ? manejadoraSblancaP04.setpointVentiladorMax.units
                    : null,
                  value: manejadoraSblancaP04.setpointVentiladorMax
                    ? manejadoraSblancaP04.setpointVentiladorMax.value
                    : null,
                },
                setpointVentiladorMin: {
                  type: 'noBox',
                  alarm: null,
                  name: 'Fan Min',
                  state: null,
                  unit: manejadoraSblancaP04.setpointVentiladorMin
                    ? manejadoraSblancaP04.setpointVentiladorMin.units
                    : null,
                  value: manejadoraSblancaP04.setpointVentiladorMin
                    ? manejadoraSblancaP04.setpointVentiladorMin.value
                    : null,
                },
              },
            },
            temperatura: {
              type: 'group',
              name: 'Temperature',
              unit: null,
              value: null,
              params: {
                estadoTemperaturaAmbiente: {
                  type: 'noBox',
                  alarm: null,
                  name: 'Ambient',
                  state: null,
                  unit: manejadoraSblancaP04.estadoTemperaturaAmbiente ? 'ºC' : null,
                  value: manejadoraSblancaP04.estadoTemperaturaAmbiente
                    ? manejadoraSblancaP04.estadoTemperaturaAmbiente.value
                    : null,
                },
                estadoTemperaturaAnticongelante: {
                  type: 'noBox',
                  alarm: null,
                  name: 'Anti-Freeze',
                  state: null,
                  unit: manejadoraSblancaP04.estadoTemperaturaAnticongelante ? 'ºC' : null,
                  value: manejadoraSblancaP04.estadoTemperaturaAnticongelante
                    ? manejadoraSblancaP04.estadoTemperaturaAnticongelante.value
                    : null,
                },
                estadoTemperaturaExterior: {
                  type: 'noBox',
                  alarm: null,
                  name: 'Exterior',
                  state: null,
                  unit: manejadoraSblancaP04.estadoTemperaturaExterior ? 'ºC' : null,
                  value: manejadoraSblancaP04.estadoTemperaturaExterior
                    ? manejadoraSblancaP04.estadoTemperaturaExterior.value
                    : null,
                },
              },
            },
            states: {
              type: 'group',
              name: 'Heating Stages',
              unit: null,
              value: null,
              params: {
                calefaccionEtapa01: {
                  type: 'box',
                  alarm: 0,
                  name: '01',
                  state: manejadoraSblancaP04.calefaccionEtapa01 ? manejadoraSblancaP04.calefaccionEtapa01.value : null,
                  unit: null,
                  value: null,
                },
                calefaccionEtapa02: {
                  type: 'box',
                  alarm: 0,
                  name: '02',
                  state: manejadoraSblancaP04.calefaccionEtapa01 ? manejadoraSblancaP04.calefaccionEtapa01.value : null,
                  unit: null,
                  value: null,
                },
              },
            },
          }}
        />

        <Device
          title={'Manejadora Sala Limpia'}
          id={502}
          width={90}
          height={130}
          posX={275}
          posY={57}
          collapsible={true}
          alarms={{
            alarm1: {
              name: 'General',
              state: manejadoraSlimpiaP04.alarmaGeneral ? manejadoraSlimpiaP04.alarmaGeneral.value : null,
            },
            alarm2: {
              name: 'Filtro',
              state: manejadoraSlimpiaP04.alarmaFiltro ? manejadoraSlimpiaP04.alarmaFiltro.value : null,
            },
            alarm3: {
              name: 'Reset',
              state: manejadoraSlimpiaP04.resetAlarma ? manejadoraSlimpiaP04.resetAlarma.value : null,
            },
          }}
          states={{
            command: manejadoraSlimpiaP04.comandoEncendido ? manejadoraSlimpiaP04.comandoEncendido.value : null,
            working: manejadoraSlimpiaP04.estadoFuncionamiento ? manejadoraSlimpiaP04.estadoFuncionamiento.value : null,
            unit: manejadoraSlimpiaP04.estadoUnidad ? manejadoraSlimpiaP04.estadoUnidad.value : null,
            switch: manejadoraSlimpiaP04.estadoSelector ? manejadoraSlimpiaP04.estadoSelector.value : null,
          }}
          parameters={{
            estadoDamper: {
              type: 'status',
              name: 'Damper',
              unit: null,
              value: manejadoraSlimpiaP04.estadoDamper ? manejadoraSlimpiaP04.estadoDamper.value : null,
            },
            caudalVentiladorImpulsion: {
              type: 'single',
              name: 'Yield Fan Impulse',
              unit: manejadoraSlimpiaP04.caudalVentiladorImpulsion
                ? manejadoraSlimpiaP04.caudalVentiladorImpulsion.units
                : null,
              value: manejadoraSlimpiaP04.caudalVentiladorImpulsion
                ? manejadoraSlimpiaP04.caudalVentiladorImpulsion.value
                : null,
            },
            estadoValvula: {
              type: 'single',
              name: 'State Valve',
              unit: manejadoraSlimpiaP04.estadoValvula ? manejadoraSlimpiaP04.estadoValvula.units : null,
              value: manejadoraSlimpiaP04.estadoValvula ? manejadoraSlimpiaP04.estadoValvula.value : null,
            },
            horometro: {
              type: 'single',
              name: 'HOROMETRO',
              unit: manejadoraSlimpiaP04.horometro ? manejadoraSlimpiaP04.horometro.units : null,
              value: manejadoraSlimpiaP04.horometro ? manejadoraSlimpiaP04.horometro.value : null,
            },
            setpoint: {
              type: 'group',
              name: 'Setpoint',
              unit: manejadoraSlimpiaP04.valorConsigna ? 'ºC' : null,
              value: manejadoraSlimpiaP04.valorConsigna ? manejadoraSlimpiaP04.valorConsigna.value : null,
              params: {
                setpointTrabajo: {
                  type: 'noBox',
                  alarm: null,
                  name: 'Work',
                  state: null,
                  unit: manejadoraSlimpiaP04.setpointTrabajo ? 'ºC' : null,
                  value: manejadoraSlimpiaP04.setpointTrabajo ? manejadoraSlimpiaP04.setpointTrabajo.value : null,
                },
                setpointVentiladorMax: {
                  type: 'noBox',
                  alarm: null,
                  name: 'Fan Max',
                  state: null,
                  unit: manejadoraSlimpiaP04.setpointVentiladorMax
                    ? manejadoraSlimpiaP04.setpointVentiladorMax.units
                    : null,
                  value: manejadoraSlimpiaP04.setpointVentiladorMax
                    ? manejadoraSlimpiaP04.setpointVentiladorMax.value
                    : null,
                },
                setpointVentiladorMin: {
                  type: 'noBox',
                  alarm: null,
                  name: 'Fan Min',
                  state: null,
                  unit: manejadoraSlimpiaP04.setpointVentiladorMin
                    ? manejadoraSlimpiaP04.setpointVentiladorMin.units
                    : null,
                  value: manejadoraSlimpiaP04.setpointVentiladorMin
                    ? manejadoraSlimpiaP04.setpointVentiladorMin.value
                    : null,
                },
              },
            },
            temperatura: {
              type: 'group',
              name: 'Temperature',
              unit: null,
              value: null,
              params: {
                estadoTemperaturaAmbiente: {
                  type: 'noBox',
                  alarm: null,
                  name: 'Ambient',
                  state: null,
                  unit: manejadoraSlimpiaP04.estadoTemperaturaAmbiente ? 'ºC' : null,
                  value: manejadoraSlimpiaP04.estadoTemperaturaAmbiente
                    ? manejadoraSlimpiaP04.estadoTemperaturaAmbiente.value
                    : null,
                },
                estadoTemperaturaAnticongelante: {
                  type: 'noBox',
                  alarm: null,
                  name: 'Anti-Freeze',
                  state: null,
                  unit: manejadoraSlimpiaP04.estadoTemperaturaAnticongelante ? 'ºC' : null,
                  value: manejadoraSlimpiaP04.estadoTemperaturaAnticongelante
                    ? manejadoraSlimpiaP04.estadoTemperaturaAnticongelante.value
                    : null,
                },
                estadoTemperaturaExterior: {
                  type: 'noBox',
                  alarm: null,
                  name: 'Exterior',
                  state: null,
                  unit: manejadoraSlimpiaP04.estadoTemperaturaExterior ? 'ºC' : null,
                  value: manejadoraSlimpiaP04.estadoTemperaturaExterior
                    ? manejadoraSlimpiaP04.estadoTemperaturaExterior.value
                    : null,
                },
              },
            },
            states: {
              type: 'group',
              name: 'Heating Stages',
              unit: null,
              value: null,
              params: {
                calefaccionEtapa01: {
                  type: 'box',
                  alarm: 0,
                  name: '01',
                  state: manejadoraSlimpiaP04.calefaccionEtapa01 ? manejadoraSlimpiaP04.calefaccionEtapa01.value : null,
                  unit: null,
                  value: null,
                },
                calefaccionEtapa02: {
                  type: 'box',
                  alarm: 0,
                  name: '02',
                  state: manejadoraSlimpiaP04.calefaccionEtapa01 ? manejadoraSlimpiaP04.calefaccionEtapa01.value : null,
                  unit: null,
                  value: null,
                },
              },
            },
          }}
        />

        <Device
          title={'Vex 04 Carga'}
          id={802}
          width={60}
          height={122}
          posX={800}
          posY={90}
          collapsible={false}
          alarms={{
            alarm1: {
              name: 'Thermal Error',
              state: vex04CargaP04.fallaTermica ? vex04CargaP04.fallaTermica.value : null,
            },
          }}
          states={{
            command: vex04CargaP04.comandoEncendido ? vex04CargaP04.comandoEncendido.value : null,
            working: vex04CargaP04.estadoFuncionamiento ? vex04CargaP04.estadoFuncionamiento.value : null,
            unit: vex04CargaP04.estadoUnidad ? vex04CargaP04.estadoUnidad.value : null,
            switch: vex04CargaP04.estadoSelector ? vex04CargaP04.estadoSelector.value : null,
          }}
        />

        <Device
          title={'Vex 03 Lower'}
          id={801}
          width={60}
          height={122}
          posX={800}
          posY={130}
          collapsible={false}
          alarms={{
            alarm1: {
              name: 'Thermal Error',
              state: vex03LowerP04.fallaTermica ? vex03LowerP04.fallaTermica.value : null,
            },
          }}
          states={{
            command: vex03LowerP04.comandoEncendido ? vex03LowerP04.comandoEncendido.value : null,
            working: vex03LowerP04.estadoFuncionamiento ? vex03LowerP04.estadoFuncionamiento.value : null,
            unit: vex03LowerP04.estadoUnidad ? vex03LowerP04.estadoUnidad.value : null,
            switch: vex03LowerP04.estadoSelector ? vex03LowerP04.estadoSelector.value : null,
          }}
        />
      </React.Fragment>
    );
  }

  render() {
    return (
      <React.Fragment>
        <g id={this.mapId}>
          <g id="Building">
            <path
              id="Floor"
              className={styles.cls4}
              d="m810.24,32.98h-40.56v7.44h-21.58v-1.07l-260.93-.28-.19-2.09H225.22l-8,18.05c57.12,24.56,78.33,76.28,78.33,76.28h132.69v-16.19h93.82v-55.4h220.33v58.88l24.6-.14v-3.81h1.4v2.23h70.6V47.49l-28.74-14.51Z"
            />
            <g id="Elevator" className={styles.cls34}>
              <circle className={styles.cls8} cx="375.4" cy="192.69" r="42.09" />
              <path
                className={styles.cls16}
                d="m424.22,140.05c.28,0,.5-.22.5-.5v-5.93c0-.28-.22-.5-.5-.5h-1.82v-.67c0-.39-.31-.7-.7-.7h-1.63c-.39,0-.7.31-.7.7v.67h-1.71c-.28,0-.5.22-.5.5v1.73h-38.44v-1.73c0-.28-.22-.5-.5-.5h-1.82v-.67c0-.39-.31-.7-.7-.7h-1.63c-.39,0-.7.31-.7.7v.67h-1.71c-.28,0-.5.22-.5.5v1.73h-38.44v-1.73c0-.28-.22-.5-.5-.5h-1.82v-.67c0-.39-.31-.7-.7-.7h-1.63c-.39,0-.7.31-.7.7v.67h-1.71c-.28,0-.5.22-.5.5v1.23h-31.71l1.5,3h30.21v1.7c0,.26.21.47.47.49v106.08c-.26.02-.47.23-.47.49v1.06h-32.04l-1.5,3h33.54v1.87c0,.28.22.5.5.5h1.71v14.17c0,.39.31,0,.7,0h1.63c.39,0,.7.39.7,0v-14.17h1.82c.28,0,.5-.22.5-.5v-2.37h38.44v2.37c0,.28.22.5.5.5h1.71v14.17c0,.39.31,0,.7,0h1.63c.39,0,.7.39.7,0v-14.17h1.82c.28,0,.5-.22.5-.5v-2.37h38.44v2.37c0,.28.22.5.5.5h1.71v14.17c0,.39.31,0,.7,0h1.63c.39,0,.7.39.7,0v-14.17h1.82c.28,0,.5-.22.5-.5v-5.93c0-.28-.22-.5-.5-.5h-.03v-106.07h.03Zm-99.29-3.2h-29.36l-.5-1h29.86v1Zm0,112.84h-31.69l.5-1h31.19v1Zm97.48-111.03h.41c.28,0,.5-.22.5-.5v-3.14c0-.28-.22-.5-.5-.5h-.41v-.39h1.32v4.93h-1.32v-.39Zm-2.03-5.04v-.88h1.03v1.77h-1.03v-.89Zm-.81,1.89h2.75v2.14h-2.75v-2.14Zm1.84,3.14v108.86h-1.03v-108.86h1.03Zm-2.03,105.16h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm-1.21-11.91h1.21v.39h-.31c-.28,0-.5.22-.5.5v3.14c0,.28.22.5.5.5h.31v.39h-1.21v-4.93Zm-41.76,4.54h.41c.28,0,.5-.22.5-.5v-3.14c0-.28-.22-.5-.5-.5h-.41v-.39h1.32v4.93h-1.32v-.39Zm1.82,1.39c.28,0,.5-.22.5-.5v-2.2h38.44v2.2c0,.28.22.5.5.5h1.71v.84h-42.97v-.84h1.82Zm-3.85-6.43v-.88h1.03v1.77h-1.03v-.89Zm-.81,1.89h2.75v2.14h-2.75v-2.14Zm1.84,3.14v108.86h-1.03v-108.86h1.03Zm-2.03,105.16h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm-1.21-11.91h1.21v.39h-.31c-.28,0-.5.22-.5.5v3.14c0,.28.22.5.5.5h.31v.39h-1.21v-4.93Zm-41.76,4.54h.41c.28,0,.5-.22.5-.5v-3.14c0-.28-.22-.5-.5-.5h-.41v-.39h1.32v4.93h-1.32v-.39Zm1.82,1.39c.28,0,.5-.22.5-.5v-2.2h38.44v2.2c0,.28.22.5.5.5h1.71v.84h-42.97v-.84h1.82Zm-3.85-6.43v-.88h1.03v1.77h-1.03v-.89Zm-.81,1.89h2.75v2.14h-2.75v-2.14Zm1.84,3.14v108.86h-1.03v-108.86h1.03Zm-3.24-4.54h1.21v.39h-.31c-.28,0-.5.22-.5.5v3.14c0,.28.22.5.5.5h.31v.39h-1.21v-4.93Zm1.21,113.39h-.31c-.28,0-.5.22-.5.5v3.14c0,.28.22.5.5.5h.31v.39h-1.21v-4.93h1.21v.39Zm2.03,5.04v14.67h-1.03v-15.56h1.03v.89Zm.91-1.89h-2.75v-2.14h2.75v2.14Zm1.4,1.39h-1.32v-.39h.41c.28,0,.5-.22.5-.5v-3.14c0-.28-.22-.5-.5-.5h-.41v-.39h1.32v4.93Zm41.65-4.54h-.31c-.28,0-.5.22-.5.5v3.14c0,.28.22.5.5.5h.31v.39h-1.21v-4.93h1.21v.39Zm-1.71-1.39c-.28,0-.5.22-.5.5v1.56h-38.44v-1.56c0-.28-.22-.5-.5-.5h-1.82v-1.3h42.97v1.3h-1.71Zm3.74,6.43v14.67h-1.03v-15.56h1.03v.89Zm.91-1.89h-2.75v-2.14h2.75v2.14Zm1.4,1.39h-1.32v-.39h.41c.28,0,.5-.22.5-.5v-3.14c0-.28-.22-.5-.5-.5h-.41v-.39h1.32v4.93Zm41.65-4.54h-.31c-.28,0-.5.22-.5.5v3.14c0,.28.22.5.5.5h.31v.39h-1.21v-4.93h1.21v.39Zm-1.71-1.39c-.28,0-.5.22-.5.5v1.56h-38.44v-1.56c0-.28-.22-.5-.5-.5h-1.82v-1.3h42.97v1.3h-1.71Zm3.74,6.43v14.67h-1.03v-15.56h1.03v.89Zm.91-1.89h-2.75v-2.14h2.75v2.14Zm1.4,1.39h-1.32v-.39h.41c.28,0,.5-.22.5-.5v-3.14c0-.28-.22-.5-.5-.5h-.41v-.39h1.32v4.93Z"
              />
            </g>
            <g id="Deck">
              <g>
                <polyline className={styles.cls5} points="623.32 325.99 623.32 332.63 712.72 332.63 712.72 283.95" />
                <polyline className={styles.cls5} points="624.32 326.13 624.32 331.63 711.72 331.63 711.72 283.95" />
                <line className={styles.cls5} x1="623.32" y1="282.84" x2="623.32" y2="313.85" />
                <line className={styles.cls5} x1="624.32" y1="282.84" x2="624.32" y2="313.85" />
                <g>
                  <rect className={styles.cls5} x="629.32" y="285.42" width="77.06" height="42.21" />
                  <g>
                    <line className={styles.cls10} x1="630.05" y1="285.76" x2="630.05" y2="327.46" />
                    <line className={styles.cls10} x1="631.52" y1="285.76" x2="631.52" y2="327.46" />
                    <line className={styles.cls10} x1="633.71" y1="285.76" x2="633.71" y2="327.46" />
                    <line className={styles.cls10} x1="635.91" y1="285.76" x2="635.91" y2="327.46" />
                    <line className={styles.cls10} x1="638.11" y1="285.76" x2="638.11" y2="327.46" />
                    <line className={styles.cls10} x1="655.69" y1="285.76" x2="655.69" y2="327.46" />
                    <line className={styles.cls10} x1="673.27" y1="285.76" x2="673.27" y2="327.46" />
                    <line className={styles.cls10} x1="690.85" y1="285.76" x2="690.85" y2="327.46" />
                    <line className={styles.cls10} x1="653.49" y1="285.76" x2="653.49" y2="327.46" />
                    <line className={styles.cls10} x1="671.07" y1="285.76" x2="671.07" y2="327.46" />
                    <line className={styles.cls10} x1="688.65" y1="285.76" x2="688.65" y2="327.46" />
                    <line className={styles.cls10} x1="651.29" y1="285.76" x2="651.29" y2="327.46" />
                    <line className={styles.cls10} x1="668.87" y1="285.76" x2="668.87" y2="327.46" />
                    <line className={styles.cls10} x1="686.45" y1="285.76" x2="686.45" y2="327.46" />
                    <line className={styles.cls10} x1="704.03" y1="285.76" x2="704.03" y2="327.46" />
                    <line className={styles.cls10} x1="649.1" y1="285.76" x2="649.1" y2="327.46" />
                    <line className={styles.cls10} x1="666.67" y1="285.76" x2="666.67" y2="327.46" />
                    <line className={styles.cls10} x1="684.25" y1="285.76" x2="684.25" y2="327.46" />
                    <line className={styles.cls10} x1="701.83" y1="285.76" x2="701.83" y2="327.46" />
                    <line className={styles.cls10} x1="646.9" y1="285.76" x2="646.9" y2="327.46" />
                    <line className={styles.cls10} x1="664.48" y1="285.76" x2="664.48" y2="327.46" />
                    <line className={styles.cls10} x1="682.06" y1="285.76" x2="682.06" y2="327.46" />
                    <line className={styles.cls10} x1="699.63" y1="285.76" x2="699.63" y2="327.46" />
                    <line className={styles.cls10} x1="644.7" y1="285.76" x2="644.7" y2="327.46" />
                    <line className={styles.cls10} x1="662.28" y1="285.76" x2="662.28" y2="327.46" />
                    <line className={styles.cls10} x1="679.86" y1="285.76" x2="679.86" y2="327.46" />
                    <line className={styles.cls10} x1="697.44" y1="285.76" x2="697.44" y2="327.46" />
                    <line className={styles.cls10} x1="642.5" y1="285.76" x2="642.5" y2="327.46" />
                    <line className={styles.cls10} x1="660.08" y1="285.76" x2="660.08" y2="327.46" />
                    <line className={styles.cls10} x1="677.66" y1="285.76" x2="677.66" y2="327.46" />
                    <line className={styles.cls10} x1="695.24" y1="285.76" x2="695.24" y2="327.46" />
                    <line className={styles.cls10} x1="640.31" y1="285.76" x2="640.31" y2="327.46" />
                    <line className={styles.cls10} x1="657.88" y1="285.76" x2="657.88" y2="327.46" />
                    <line className={styles.cls10} x1="675.46" y1="285.76" x2="675.46" y2="327.46" />
                    <line className={styles.cls10} x1="693.04" y1="285.76" x2="693.04" y2="327.46" />
                    <line className={styles.cls10} x1="632.25" y1="285.76" x2="632.25" y2="327.46" />
                    <line className={styles.cls10} x1="634.45" y1="285.76" x2="634.45" y2="327.46" />
                    <line className={styles.cls10} x1="636.64" y1="285.76" x2="636.64" y2="327.46" />
                    <line className={styles.cls10} x1="638.84" y1="285.76" x2="638.84" y2="327.46" />
                    <line className={styles.cls10} x1="656.42" y1="285.76" x2="656.42" y2="327.46" />
                    <line className={styles.cls10} x1="674" y1="285.76" x2="674" y2="327.46" />
                    <line className={styles.cls10} x1="691.58" y1="285.76" x2="691.58" y2="327.46" />
                    <line className={styles.cls10} x1="654.22" y1="285.76" x2="654.22" y2="327.46" />
                    <line className={styles.cls10} x1="671.8" y1="285.76" x2="671.8" y2="327.46" />
                    <line className={styles.cls10} x1="689.38" y1="285.76" x2="689.38" y2="327.46" />
                    <line className={styles.cls10} x1="652.03" y1="285.76" x2="652.03" y2="327.46" />
                    <line className={styles.cls10} x1="669.6" y1="285.76" x2="669.6" y2="327.46" />
                    <line className={styles.cls10} x1="687.18" y1="285.76" x2="687.18" y2="327.46" />
                    <line className={styles.cls10} x1="704.76" y1="285.76" x2="704.76" y2="327.46" />
                    <line className={styles.cls10} x1="649.83" y1="285.76" x2="649.83" y2="327.46" />
                    <line className={styles.cls10} x1="667.41" y1="285.76" x2="667.41" y2="327.46" />
                    <line className={styles.cls10} x1="684.99" y1="285.76" x2="684.99" y2="327.46" />
                    <line className={styles.cls10} x1="702.56" y1="285.76" x2="702.56" y2="327.46" />
                    <line className={styles.cls10} x1="647.63" y1="285.76" x2="647.63" y2="327.46" />
                    <line className={styles.cls10} x1="665.21" y1="285.76" x2="665.21" y2="327.46" />
                    <line className={styles.cls10} x1="682.79" y1="285.76" x2="682.79" y2="327.46" />
                    <line className={styles.cls10} x1="700.37" y1="285.76" x2="700.37" y2="327.46" />
                    <line className={styles.cls10} x1="645.43" y1="285.76" x2="645.43" y2="327.46" />
                    <line className={styles.cls10} x1="663.01" y1="285.76" x2="663.01" y2="327.46" />
                    <line className={styles.cls10} x1="680.59" y1="285.76" x2="680.59" y2="327.46" />
                    <line className={styles.cls10} x1="698.17" y1="285.76" x2="698.17" y2="327.46" />
                    <line className={styles.cls10} x1="643.24" y1="285.76" x2="643.24" y2="327.46" />
                    <line className={styles.cls10} x1="660.81" y1="285.76" x2="660.81" y2="327.46" />
                    <line className={styles.cls10} x1="678.39" y1="285.76" x2="678.39" y2="327.46" />
                    <line className={styles.cls10} x1="695.97" y1="285.76" x2="695.97" y2="327.46" />
                    <line className={styles.cls10} x1="641.04" y1="285.76" x2="641.04" y2="327.46" />
                    <line className={styles.cls10} x1="658.62" y1="285.76" x2="658.62" y2="327.46" />
                    <line className={styles.cls10} x1="676.2" y1="285.76" x2="676.2" y2="327.46" />
                    <line className={styles.cls10} x1="693.77" y1="285.76" x2="693.77" y2="327.46" />
                    <line className={styles.cls10} x1="630.78" y1="285.76" x2="630.78" y2="327.46" />
                    <line className={styles.cls10} x1="632.98" y1="285.76" x2="632.98" y2="327.46" />
                    <line className={styles.cls10} x1="635.18" y1="285.76" x2="635.18" y2="327.46" />
                    <line className={styles.cls10} x1="637.38" y1="285.76" x2="637.38" y2="327.46" />
                    <line className={styles.cls10} x1="654.95" y1="285.76" x2="654.95" y2="327.46" />
                    <line className={styles.cls10} x1="672.53" y1="285.76" x2="672.53" y2="327.46" />
                    <line className={styles.cls10} x1="690.11" y1="285.76" x2="690.11" y2="327.46" />
                    <line className={styles.cls10} x1="652.76" y1="285.76" x2="652.76" y2="327.46" />
                    <line className={styles.cls10} x1="670.34" y1="285.76" x2="670.34" y2="327.46" />
                    <line className={styles.cls10} x1="687.92" y1="285.76" x2="687.92" y2="327.46" />
                    <line className={styles.cls10} x1="705.49" y1="285.76" x2="705.49" y2="327.46" />
                    <line className={styles.cls10} x1="650.56" y1="285.76" x2="650.56" y2="327.46" />
                    <line className={styles.cls10} x1="668.14" y1="285.76" x2="668.14" y2="327.46" />
                    <line className={styles.cls10} x1="685.72" y1="285.76" x2="685.72" y2="327.46" />
                    <line className={styles.cls10} x1="703.3" y1="285.76" x2="703.3" y2="327.46" />
                    <line className={styles.cls10} x1="648.36" y1="285.76" x2="648.36" y2="327.46" />
                    <line className={styles.cls10} x1="665.94" y1="285.76" x2="665.94" y2="327.46" />
                    <line className={styles.cls10} x1="683.52" y1="285.76" x2="683.52" y2="327.46" />
                    <line className={styles.cls10} x1="701.1" y1="285.76" x2="701.1" y2="327.46" />
                    <line className={styles.cls10} x1="646.17" y1="285.76" x2="646.17" y2="327.46" />
                    <line className={styles.cls10} x1="663.74" y1="285.76" x2="663.74" y2="327.46" />
                    <line className={styles.cls10} x1="681.32" y1="285.76" x2="681.32" y2="327.46" />
                    <line className={styles.cls10} x1="698.9" y1="285.76" x2="698.9" y2="327.46" />
                    <line className={styles.cls10} x1="643.97" y1="285.76" x2="643.97" y2="327.46" />
                    <line className={styles.cls10} x1="661.55" y1="285.76" x2="661.55" y2="327.46" />
                    <line className={styles.cls10} x1="679.13" y1="285.76" x2="679.13" y2="327.46" />
                    <line className={styles.cls10} x1="696.7" y1="285.76" x2="696.7" y2="327.46" />
                    <line className={styles.cls10} x1="641.77" y1="285.76" x2="641.77" y2="327.46" />
                    <line className={styles.cls10} x1="659.35" y1="285.76" x2="659.35" y2="327.46" />
                    <line className={styles.cls10} x1="676.93" y1="285.76" x2="676.93" y2="327.46" />
                    <line className={styles.cls10} x1="694.51" y1="285.76" x2="694.51" y2="327.46" />
                    <line className={styles.cls10} x1="639.57" y1="285.76" x2="639.57" y2="327.46" />
                    <line className={styles.cls10} x1="657.15" y1="285.76" x2="657.15" y2="327.46" />
                    <line className={styles.cls10} x1="674.73" y1="285.76" x2="674.73" y2="327.46" />
                    <line className={styles.cls10} x1="692.31" y1="285.76" x2="692.31" y2="327.46" />
                  </g>
                </g>
              </g>
              <rect className={styles.cls5} x="560.29" y="285.97" width="2.51" height="27.08" />
              <rect className={styles.cls5} x="560.29" y="326.51" width="2.51" height="50.49" />
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
                points="766.91 114.42 768.31 114.42 768.31 116.99 838.94 116.99 838.94 118.39 766.91 118.39 766.91 114.42"
              />
              <rect
                className={styles.cls7}
                x="277.24"
                y="54.53"
                width="1.4"
                height="6.58"
                transform="translate(335.76 -220.13) rotate(90)"
              />
              <rect
                className={styles.cls7}
                x="292.99"
                y="55.15"
                width="1.4"
                height="5.34"
                transform="translate(351.51 -235.88) rotate(90)"
              />
              <rect className={styles.cls7} x="768.31" y="32.65" width="1.12" height="6.09" />
              <rect className={styles.cls7} x="747.1" y="32.65" width="1.12" height="6.09" />
              <rect className={styles.cls7} x="743.7" y="32.65" width="1.12" height="6.09" />
              <rect
                className={styles.cls7}
                x="294.82"
                y="71.52"
                width="1.4"
                height="41.28"
                transform="translate(191.19 -199.29) rotate(52.98)"
              />
              <rect className={styles.cls7} x="428.23" y="115.11" width="1.4" height="15.52" />
              <rect className={styles.cls7} x="426.67" y="131.54" width="2.96" height="128.2" />
              <polygon
                className={styles.cls7}
                points="429.63 59.51 337.63 59.51 337.63 59.53 327.32 67.31 328.16 68.43 338.12 60.91 429.63 60.91 429.63 59.51"
              />
              <rect
                className={styles.cls7}
                x="252.82"
                y="37.81"
                width="1.4"
                height="6.58"
                transform="translate(507.04 82.19) rotate(180)"
              />
              <line className={styles.cls7} x1="273.89" y1="44.09" x2="254.29" y2="44.09" />
            </g>
            <g id="DOORS">
              <path
                className={styles.cls16}
                d="m801.1,113.05c-.2,0-.35-.16-.35-.35v-9.63c0-.2.16-.35.35-.35h.1c.2,0,.35.16.35.35v9.26c4.9-.3,8.72-4.33,8.72-9.26,0-.2.16-.35.35-.35s.35.16.35.35c0,5.37-4.21,9.76-9.57,9.99-.04,0-.08,0-.12-.02-.03,0-.06.02-.09.02h-.1.01Z"
              />
              <path
                className={styles.cls16}
                d="m778.38,105.27c0-.2-.16-.35-.35-.35h-9.63c-.2,0-.35.16-.35.35v.1c0,.2.16.35.35.35h9.26c-.3,4.9-4.33,8.72-9.26,8.72-.2,0-.35.16-.35.35s.16.35.35.35c5.37,0,9.76-4.21,9.99-9.57,0-.04,0-.08-.02-.12,0-.03.02-.06.02-.09v-.1h-.01Z"
              />
              <path
                className={styles.cls16}
                d="m321.92,61.12l-.16.12s-.04.03-.05.05c-3.26,2.75-4.28,7.19-2.76,10.98-3.26-2.55-7.87-2.8-11.45-.36-.02.02-.03.05-.05.07-.04,0-.09.03-.13.06l-.16.12c-.15.11-.18.32-.07.48l5.5,7.34c.11.15.32.18.48.07l.16-.12c.15-.11.18-.32.07-.48l-5.28-7.05c3.98-2.62,9.3-1.71,12.17,2.12.11.15.32.18.48.07s.18-.32.07-.48c-2.81-3.75-2.26-8.96,1.17-12.07l5.27,7.04c.11.15.32.18.48.07l.16-.12c.15-.11.18-.32.07-.48l-5.5-7.34c-.11-.15-.32-.18-.48-.07l.02-.02Z"
              />
            </g>
            <g id="STAIRS">
              <g>
                <g>
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
                </g>
                <g>
                  <polygon className={styles.cls12} points="772.47 43.75 772.47 51.42 769.91 47.58 772.47 43.75" />
                  <polyline className={styles.cls6} points="767.56 70.43 807.24 70.43 807.24 47.58 772.53 47.58" />
                </g>
              </g>
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
              <g id="enclosure_stairs" data-name="enclosure stairs">
                <path
                  className={styles.cls16}
                  d="m276.32,81.93s.01,0,.02,0c.14-.13.14-.36.01-.5-4.02-4.24-8.32-8.3-12.79-12.06-3.56-3-7.31-5.89-11.12-8.56-.01,0-.02,0-.04,0-4.6-3.22-9.42-6.24-14.33-8.95-.17-.1-.38-.03-.48.14,0,0,0,.02,0,.02l-5.18,9.32s-.01,0-.02.02c0,.01,0,.03,0,.04-.03.07-.04.15-.02.22,0,0,0,0,0,.01.03.08.08.16.17.21,4.48,2.39,8.88,5.05,13.07,7.92.01,0,.02.02.03.03,3.46,2.35,6.83,4.92,10.01,7.63,0,0,0,0,0,0,0,0,0,0,0,0,4.53,3.67,8.83,7.71,12.79,12,.07.08.17.12.27.11l7.61-7.58Zm-6.96,6.1c-.6-.64-1.21-1.27-1.82-1.9l5.68-5.6c.58.59,1.17,1.18,1.74,1.78l-5.6,5.72Zm-12.68-11.88s-.02,0-.02,0c-.07-.06-.15-.12-.23-.19l5.1-6.17c.28.24.57.47.85.7,0,0,.01,0,.02,0,.34.29.67.59,1.01.88l-5.21,6.06c-.51-.43-1.01-.86-1.52-1.28Zm-11.15-18l-4.34,6.8c-.65-.41-1.31-.81-1.97-1.2l4.21-6.91c.7.43,1.4.87,2.1,1.31Zm.6.38c.7.45,1.39.89,2.08,1.35l-4.46,6.68c-.65-.42-1.3-.83-1.96-1.24l4.33-6.79Zm2.66,1.74c.68.46,1.37.92,2.04,1.38l-4.58,6.57c-.63-.43-1.27-.85-1.92-1.27l4.45-6.68Zm2.63,1.79c.67.47,1.34.95,2.01,1.44l-4.7,6.46c-.63-.45-1.26-.89-1.89-1.32l4.58-6.57Zm2.59,1.85c.66.48,1.32.98,1.97,1.47l-4.82,6.36c-.61-.46-1.23-.92-1.85-1.37l4.7-6.46Zm2.54,1.9c.65.5,1.3,1.01,1.95,1.51l-4.96,6.26c-.6-.48-1.2-.95-1.81-1.42l4.82-6.35Zm2.51,1.95c.65.51,1.28,1.03,1.92,1.56l-5.09,6.17c-.59-.49-1.18-.99-1.78-1.47l4.96-6.26Zm-16.23-11.3l-4.22,6.91c-.66-.39-1.32-.78-1.98-1.16l4.09-7.03c.71.42,1.41.84,2.11,1.27Zm15.92,21.41l5.2-6.05c.62.54,1.24,1.07,1.86,1.62l-5.31,5.93c-.58-.51-1.16-1-1.75-1.5Zm7.58-3.96c.61.55,1.22,1.11,1.83,1.68l-5.43,5.81c-.57-.53-1.14-1.04-1.72-1.56l5.31-5.93Zm-28.38-20.31c.72.4,1.43.82,2.15,1.23l-4.09,7.03c-.67-.38-1.35-.75-2.02-1.12l3.97-7.15Zm25.31,28.27l5.42-5.81c.6.56,1.18,1.13,1.77,1.71l-5.55,5.7c-.55-.54-1.09-1.08-1.65-1.6Zm2.16,2.1l5.55-5.71c.59.58,1.18,1.15,1.76,1.74l-5.67,5.6c-.54-.55-1.09-1.09-1.64-1.63Z"
                />
                <polygon className={styles.cls12} points="268.37 86.77 273.69 81.24 272.87 85.78 268.37 86.77" />
                <path className={styles.cls6} d="m270.93,83.91s-15.21-16.4-35.88-27.03" />
              </g>
              <g id="Stairs">
                <path
                  className={styles.cls16}
                  d="m419.87,295.71-3-.25h-12.5c-.28,0-.5.23-.5.51v78.02c0,.28.22.5.5.5h27c.28,0,.5-.22.5-.5v-77.78c.01-.28-.21-.5-.49-.5h-12.51v65.78h-2v-66.03Zm14.01,12.01h-11.01v-2.01h11.01v2.01Zm0,1v2h-11.01v-2h11.01Zm0,3v2h-11.01v-2h11.01Zm0,3v2h-11.01v-2h11.01Zm0,3v2h-11.01v-2h11.01Zm0,3v2h-11.01v-2h11.01Zm0,3v2h-11.01v-2h11.01Zm0,3v2h-11.01v-2h11.01Zm0,3v2h-11.01v-2h11.01Zm0,3v2.01h-11.01v-2.01h11.01Zm0,3.01v2h-11.01v-2h11.01Zm0,3v2h-11.01v-2h11.01Zm0,3v2h-11.01v-2h11.01Zm0,3v2h-11.01v-2h11.01Zm0,3v2h-11.01v-2h11.01Zm0,3v2h-11.01v-2h11.01Zm0-46.02h-11.01v-2h11.01v2Zm-11.01,49.02h11.01v2h-11.01v-2Zm11.01-52.02h-11.01v-2h11.01v2Zm-11.01,55.02h11.01v2.01h-11.01v-2.01Zm11.01-59.77v1.75h-11.01v-1.75h11.01Zm-11.01,62.78h11.01v2h-11.01v-2Zm-15,2v-2h11v2h-11Zm11-56.02v2h-11v-2h11Zm-11-1v-2h11v2h-11Zm11,4v2h-11v-2h11Zm0,3v2h-11v-2h11Zm0,3v2h-11v-2h11Zm0,3v2h-11v-2h11Zm0,3v2h-11v-2h11Zm0,3v2h-11v-2h11Zm0,3v2.01h-11v-2.01h11Zm0,3.01v2h-11v-2h11Zm0,3v2h-11v-2h11Zm0,3v2h-11v-2h11Zm0,3v2h-11v-2h11Zm0,3v2h-11v-2h11Zm0,3v2h-11v-2h11Zm0,3v2h-11v-2h11Zm0,3v2h-11v-2h11Zm0,3v2.01h-11v-2.01h11Zm0,3.01v2h-11v-2h11Zm0-55.02h-11v-2.01h11v2.01Zm0-5.01v2h-11v-1.99h11Zm-11,66.02h26.01v11h-26.01v-11Z"
                />
                <polygon className={styles.cls12} points="414.21 293.64 406.53 293.64 410.37 291.09 414.21 293.64" />
                <polyline className={styles.cls6} points="410.4 293.71 410.4 367.85 425.56 367.85 425.56 293.9" />
              </g>
            </g>
            <g id="Machines">
              <rect className={styles.cls9} x="280.55" y="43.07" width="10.86" height="13.56" />
              <rect className={styles.cls9} x="440.89" y="71.52" width="12" height="12" />
              <rect id="elev" className={styles.cls9} x="769.73" y="80.72" width="21.7" height="14.86" />
            </g>
            <g id="SolidWall">
              <rect className={styles.cls6} x="669.73" y="336.63" width="39.93" height="87.85" />
              <rect className={styles.cls6} x="667.65" y="333.21" width="44.08" height="93.26" />
              <g>
                <circle className={styles.cls6} cx="689.69" cy="358.42" r="11.16" />
                <circle className={styles.cls6} cx="689.69" cy="402.69" r="11.16" />
              </g>
              <rect className={styles.cls13} x="767.91" y="101.36" width="33.77" height="2.53" />
              <polygon
                className={styles.cls13}
                points="767.91 38.75 767.91 41.23 813.17 41.23 813.17 46.75 814.66 46.75 814.66 76.37 767.91 76.37 767.91 78.79 814.66 78.79 814.66 101.54 810.8 101.54 810.8 103.89 816.75 103.89 816.75 46.75 818.24 46.75 818.24 38.75 767.91 38.75"
              />
              <rect className={styles.cls13} x="743.45" y="38.75" width="5.02" height="8.05" />
              <rect className={styles.cls13} x="693.68" y="38.75" width="4.84" height="8.05" />
              <rect className={styles.cls13} x="643.82" y="38.75" width="4.79" height="8.05" />
              <rect className={styles.cls13} x="693.45" y="258.23" width="5.07" height="8.33" />
              <rect className={styles.cls13} x="743.58" y="258.23" width="5.07" height="8.33" />
              <rect className={styles.cls13} x="593.4" y="258.23" width="5.07" height="8.33" />
              <rect className={styles.cls13} x="643.53" y="258.23" width="5.07" height="8.33" />
              <rect className={styles.cls13} x="813.21" y="258.23" width="5.07" height="8.33" />
              <rect className={styles.cls13} x="593.56" y="38.75" width="4.79" height="8.05" />
              <rect className={styles.cls13} x="543.43" y="38.75" width="4.79" height="8.05" />
              <polygon
                className={styles.cls13}
                points="430.66 258.42 425.91 258.42 425.91 266.66 283.73 266.66 283.73 269.22 430.66 269.22 430.66 258.42"
              />
              <rect className={styles.cls13} x="416.52" y="270.19" width="2.74" height="94.42" />
              <path
                className={styles.cls13}
                d="m429.59,132.89h0v-2.56h-133.54c-15.57-33.7-43.35-60.64-77.63-75.13l7.39-16.6h48.11v19.9h2v-19.9h19.02v19.9h2v-19.9h128.81v7.76h4.67v-7.76h52.59v7.82h4.57v-19.22h-2.28v8.49H223.91s-8.19,18.4-8.19,18.4c0,0,0,0,0,0l-1.22,2.74c35.3,14.07,63.87,41.52,79.42,76.05h135.67Z"
              />
              <rect className={styles.cls13} x="543.43" y="258.23" width="5.07" height="8.33" />
            </g>
            <rect className={styles.cls18} x="428.23" y="60.91" width="1.4" height="54.2" />
            <path
              id="Floor-2"
              data-name="Floor"
              className={styles.cls11}
              d="m810.24,32.98h-40.56v7.44h-1.63v-1.07s-280.88-.28-280.88-.28l-.19-2.09H225.22l-8,18.05c57.12,24.56,78.33,76.28,78.33,76.28h132.69v-16.19h93.82v-55.4h220.33v58.88l24.6-.14v-3.81h1.4v2.23h70.6V47.49l-28.74-14.51Z"
            />
          </g>
          <g id="text">
            <g id="t1">
              <g className={styles.cls40}>
                <text className={styles.cls17} transform="translate(330.36 92.23)">
                  <tspan className={styles.cls32} x="0" y="0">
                    Camera Maintenance
                  </tspan>
                  <tspan className={styles.cls32} x="23.71" y="7.2">
                    HVAC
                  </tspan>
                  <tspan x="23.28" y="14.4">
                    Room
                  </tspan>
                </text>
              </g>
              <g className={styles.cls40}>
                <text className={styles.cls17} transform="translate(636.81 167.58)">
                  <tspan x="0" y="0">
                    Open to
                  </tspan>
                  <tspan x="-15.99" y="7.2">
                    Maintenance Floor
                  </tspan>
                  <tspan x="3.1" y="14.4">
                    below
                  </tspan>
                </text>
              </g>
              <g className={styles.cls40}>
                <text className={styles.cls17} transform="translate(461.56 98.46)">
                  <tspan x="0" y="0">
                    North
                  </tspan>
                  <tspan x="-8.52" y="7.2">
                    Mezzanine
                  </tspan>
                </text>
              </g>
              <g className={styles.cls40}>
                <text className={styles.cls17} transform="translate(756.12 128.11)">
                  <tspan x="0" y="0">
                    South Mezannine
                  </tspan>
                </text>
              </g>
              <g className={styles.cls40}>
                <text className={styles.cls17} transform="translate(366.07 197.01)">
                  <tspan x="0" y="0">
                    80-Ton
                  </tspan>
                  <tspan x="-8.33" y="7.2">
                    Platform Lift
                  </tspan>
                </text>
              </g>
              <g className={styles.cls40}>
                <text className={styles.cls17} transform="translate(657.85 296.73)">
                  <tspan x="0" y="0">
                    Deck
                  </tspan>
                </text>
              </g>
            </g>
            <g id="t2" className={styles.cls36}>
              <g className={styles.cls40}>
                <text className={styles.cls19} transform="translate(774.92 59.94)">
                  <tspan className={styles.cls23} x="0" y="0">
                    Wet Shaft
                  </tspan>
                </text>
              </g>
              <g className={styles.cls40}>
                <text className={styles.cls19} transform="translate(802.06 92.28)">
                  <tspan x="0" y="0">
                    Dry
                  </tspan>
                  <tspan x="-1.69" y="4.8">
                    Shaft
                  </tspan>
                </text>
              </g>
              <g className={styles.cls40}>
                <text className={styles.cls19} transform="translate(774.48 87.54)">
                  <tspan x="0" y="0">
                    Elev. 1
                  </tspan>
                </text>
              </g>
              <g className={styles.cls40}>
                <text className={styles.cls19} transform="translate(614.37 53.07)">
                  <tspan className={styles.cls38} x="0" y="0">
                    Catwalk
                  </tspan>
                </text>
              </g>
              <g className={styles.cls40}>
                <text className={styles.cls19} transform="translate(279.43 50.65)">
                  <tspan x="0" y="0">
                    Elev. 2
                  </tspan>
                </text>
              </g>
            </g>
          </g>
          <g id="Dome">
            <g>
              <line className={styles.cls7} x1="170.53" y1="192.71" x2="150.53" y2="192.71" />
              <line className={styles.cls7} x1="160.53" y1="202.71" x2="160.53" y2="182.71" />
            </g>
            <circle className={styles.cls3} cx="160.53" cy="192.71" r="144.2" />
          </g>
          <g id="Outside">
            <polyline
              className={styles.cls7}
              points="422.01 19.12 526.01 19.12 526.01 12.42 755.49 12.42 856.47 19.26 882.79 35.22 882.79 270.01 856.47 285.97 832.8 285.97"
            />
            <polyline
              className={styles.cls7}
              points="526.01 19.12 832.8 19.12 876.61 44.09 876.61 261.07 832.8 286.19 419.36 286.19"
            />
            <polyline
              className={styles.cls7}
              points="426.05 27.21 811.17 27.21 844.52 43.96 844.52 261.49 812.7 278.09 418.8 278.09 418.8 273.91 811.59 273.91 841.03 259.12 841.03 46.19 810.05 30.84 487.45 30.84 487.45 32.65 810.47 32.65 838.94 47.44 838.94 258.14 811.59 272.65 418.8 272.65"
            />
            <g>
              <line className={styles.cls7} x1="812.7" y1="278.09" x2="832.8" y2="286.19" />
              <line className={styles.cls7} x1="844.52" y1="261.49" x2="876.61" y2="261.07" />
              <line className={styles.cls7} x1="856.47" y1="285.97" x2="842.7" y2="280.61" />
              <line className={styles.cls7} x1="882.79" y1="270.01" x2="864.19" y2="268.47" />
              <line className={styles.cls7} x1="844.52" y1="43.96" x2="876.61" y2="44.09" />
              <line className={styles.cls7} x1="882.79" y1="35.22" x2="864.19" y2="36.84" />
              <line className={styles.cls7} x1="856.47" y1="19.26" x2="842.42" y2="24.84" />
              <line className={styles.cls7} x1="832.8" y1="19.12" x2="811.17" y2="27.21" />
            </g>
          </g>
        </g>
        <rect id={this.overlayId} pointerEvents="all" fill="none" width="882.42" height="461.23" />

        <g id={this.deviceId}>{!this.props.hideHVAC && this.getDevices()}</g>
      </React.Fragment>
    );
  }
}
