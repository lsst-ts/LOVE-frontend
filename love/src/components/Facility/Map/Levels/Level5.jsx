import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './Level5.module.css';
import Device from '../Device.jsx';

export default class Level5 extends Component {

  static propTypes = {
  };

  static defaultProps = {
  };

  getDevices(){
    return(
  <React.Fragment>

    <Device
      title={'Manejadora Lower 01'}
      id={401}
      
      width={108}
      height={130}
      posX={0}
      posY={70}

      alarm={1}
      collapsible={1}

      states={{
        'command':'2',
        'working':'1',
        'unit':null,
        'switch':null,
      }}

      parameters={{
        'estadoDamper':{
          'type':'status',
          'name':'Damper',
          'unit':null,
          'value':'ENABLED'
        },
        'caudalVentiladorImpulsion':{
          'type':'single',
          'name':'Yield Fan Impulse',
          'unit':'%',
          'value':32.63
        },
        'estadoValvula':{
          'type':'single',
          'name':'State Valve',
          'unit':'%',
          'value':21.34
        },
        'horometro':{
          'type':'single',
          'name':'HOROMETRO',
          'unit':'h',
          'value':18
        },
        'setpoint':{
          'type':'group',
          'name':'Setpoint',
          'unit':'ºC',
          'value':18.3,
          'params':{
            'setpointTrabajo':{
              'type':'noBox',
              'alarm':null,
              'name':'Work',
              'state':null,
              'unit':'ºC',
              'value':23.04,
            },
            'setpointVentiladorMax':{
              'type':'noBox',
              'alarm':null,
              'name':'Fan Max',
              'state':null,
              'unit':'%',
              'value':23.04,
            },
            'setpointVentiladorMin':{
              'type':'noBox',
              'alarm':null,
              'name':'Fan Min',
              'state':null,
              'unit':'%',
              'value':23.04,
            }
          }
        },
        'temperatura':{
          'type':'group',
          'name':'Temperature',
          'unit':null,
          'value':null,
          'params':{
            'estadoTemperaturaAmbiente':{
              'type':'noBox',
              'alarm':null,
              'name':'Ambient',
              'state':null,
              'unit':'ºC',
              'value':23.04,
            },
            'estadoTemperaturaAnticongelante':{
              'type':'noBox',
              'alarm':null,
              'name':'Anti-Freeze',
              'state':null,
              'unit':'ºC',
              'value':12.03,
            },
            'estadoTemperaturaExterior':{
              'type':'noBox',
              'alarm':null,
              'name':'Exterior',
              'state':null,
              'unit':'ºC',
              'value':21.52,
            },
          }
        },
        'states':{
          'type':'group',
          'name':'Heating Stages',
          'unit':null,
          'value':null,
          'params':{
            'calefaccionEtapa01':{
              'type':'box',
              'alarm':0,
              'name':'01',
              'state':'ok',
              'unit':null,
              'value':null,
            },
            'calefaccionEtapa02':{
              'type':'box',
              'alarm':0,
              'name':'02',
              'state':'ok',
              'unit':null,
              'value':null,
            },
          }
        },
      }}
    />

    <Device
      title={'Manejadora Lower 02'}
      id={402}
      
      width={108}
      height={130}
      posX={190}
      posY={40}

      alarm={1}
      collapsible={1}

      states={{
        'command':'1',
        'working':'1',
        'unit':null,
        'switch':null,
      }}

      parameters={{
        'estadoDamper':{
          'type':'status',
          'name':'Damper',
          'unit':null,
          'value':'ENABLED'
        },
        'caudalVentiladorImpulsion':{
          'type':'single',
          'name':'Yield Fan Impulse',
          'unit':'%',
          'value':32.63
        },
        'estadoValvula':{
          'type':'single',
          'name':'State Valve',
          'unit':'%',
          'value':21.34
        },
        'horometro':{
          'type':'single',
          'name':'HOROMETRO',
          'unit':'h',
          'value':18
        },
        'setpoint':{
          'type':'group',
          'name':'Setpoint',
          'unit':'ºC',
          'value':18.3,
          'params':{
            'setpointTrabajo':{
              'type':'noBox',
              'alarm':null,
              'name':'Work',
              'state':null,
              'unit':'ºC',
              'value':23.04,
            },
            'setpointVentiladorMax':{
              'type':'noBox',
              'alarm':null,
              'name':'Fan Max',
              'state':null,
              'unit':'%',
              'value':23.04,
            },
            'setpointVentiladorMin':{
              'type':'noBox',
              'alarm':null,
              'name':'Fan Min',
              'state':null,
              'unit':'%',
              'value':23.04,
            }
          }
        },
        'temperatura':{
          'type':'group',
          'name':'Temperature',
          'unit':null,
          'value':null,
          'params':{
            'estadoTemperaturaAmbiente':{
              'type':'noBox',
              'alarm':null,
              'name':'Ambient',
              'state':null,
              'unit':'ºC',
              'value':23.04,
            },
            'estadoTemperaturaAnticongelante':{
              'type':'noBox',
              'alarm':null,
              'name':'Anti-Freeze',
              'state':null,
              'unit':'ºC',
              'value':12.03,
            },
            'estadoTemperaturaExterior':{
              'type':'noBox',
              'alarm':null,
              'name':'Exterior',
              'state':null,
              'unit':'ºC',
              'value':21.52,
            },
          }
        },
        'states':{
          'type':'group',
          'name':'Heating Stages',
          'unit':null,
          'value':null,
          'params':{
            'calefaccionEtapa01':{
              'type':'box',
              'alarm':0,
              'name':'01',
              'state':'ok',
              'unit':null,
              'value':null,
            },
            'calefaccionEtapa02':{
              'type':'box',
              'alarm':0,
              'name':'02',
              'state':'ok',
              'unit':null,
              'value':null,
            },
          }
        },
      }}
    />

    <Device
      title={'Manejadora Lower 03'}
      id={403}
      
      width={108}
      height={130}
      posX={0}
      posY={200}

      alarm={1}
      collapsible={1}

      states={{
        'command':'4',
        'working':'3',
        'unit':null,
        'switch':null,
      }}

      parameters={{
        'estadoDamper':{
          'type':'status',
          'name':'Damper',
          'unit':null,
          'value':'ENABLED'
        },
        'caudalVentiladorImpulsion':{
          'type':'single',
          'name':'Yield Fan Impulse',
          'unit':'%',
          'value':32.63
        },
        'estadoValvula':{
          'type':'single',
          'name':'State Valve',
          'unit':'%',
          'value':21.34
        },
        'horometro':{
          'type':'single',
          'name':'HOROMETRO',
          'unit':'h',
          'value':18
        },
        'setpoint':{
          'type':'group',
          'name':'Setpoint',
          'unit':'ºC',
          'value':18.3,
          'params':{
            'setpointTrabajo':{
              'type':'noBox',
              'alarm':null,
              'name':'Work',
              'state':null,
              'unit':'ºC',
              'value':23.04,
            },
            'setpointVentiladorMax':{
              'type':'noBox',
              'alarm':null,
              'name':'Fan Max',
              'state':null,
              'unit':'%',
              'value':23.04,
            },
            'setpointVentiladorMin':{
              'type':'noBox',
              'alarm':null,
              'name':'Fan Min',
              'state':null,
              'unit':'%',
              'value':23.04,
            }
          }
        },
        'temperatura':{
          'type':'group',
          'name':'Temperature',
          'unit':null,
          'value':null,
          'params':{
            'estadoTemperaturaAmbiente':{
              'type':'noBox',
              'alarm':null,
              'name':'Ambient',
              'state':null,
              'unit':'ºC',
              'value':23.04,
            },
            'estadoTemperaturaAnticongelante':{
              'type':'noBox',
              'alarm':null,
              'name':'Anti-Freeze',
              'state':null,
              'unit':'ºC',
              'value':12.03,
            },
            'estadoTemperaturaExterior':{
              'type':'noBox',
              'alarm':null,
              'name':'Exterior',
              'state':null,
              'unit':'ºC',
              'value':21.52,
            },
          }
        },
        'states':{
          'type':'group',
          'name':'Heating Stages',
          'unit':null,
          'value':null,
          'params':{
            'calefaccionEtapa01':{
              'type':'box',
              'alarm':0,
              'name':'01',
              'state':'ok',
              'unit':null,
              'value':null,
            },
            'calefaccionEtapa02':{
              'type':'box',
              'alarm':0,
              'name':'02',
              'state':'ok',
              'unit':null,
              'value':null,
            },
          }
        },
      }}
    />

    <Device
      title={'Manejadora Lower 04'}
      id={404}
      
      width={108}
      height={130}
      posX={210}
      posY={200}

      alarm={1}
      collapsible={1}

      states={{
        'command':'1',
        'working':'1',
        'unit':null,
        'switch':null,
      }}

      parameters={{
        'estadoDamper':{
          'type':'status',
          'name':'Damper',
          'unit':null,
          'value':'ENABLED'
        },
        'caudalVentiladorImpulsion':{
          'type':'single',
          'name':'Yield Fan Impulse',
          'unit':'%',
          'value':32.63
        },
        'estadoValvula':{
          'type':'single',
          'name':'State Valve',
          'unit':'%',
          'value':21.34
        },
        'horometro':{
          'type':'single',
          'name':'HOROMETRO',
          'unit':'h',
          'value':18
        },
        'setpoint':{
          'type':'group',
          'name':'Setpoint',
          'unit':'ºC',
          'value':18.3,
          'params':{
            'setpointTrabajo':{
              'type':'noBox',
              'alarm':null,
              'name':'Work',
              'state':null,
              'unit':'ºC',
              'value':23.04,
            },
            'setpointVentiladorMax':{
              'type':'noBox',
              'alarm':null,
              'name':'Fan Max',
              'state':null,
              'unit':'%',
              'value':23.04,
            },
            'setpointVentiladorMin':{
              'type':'noBox',
              'alarm':null,
              'name':'Fan Min',
              'state':null,
              'unit':'%',
              'value':23.04,
            }
          }
        },
        'temperatura':{
          'type':'group',
          'name':'Temperature',
          'unit':null,
          'value':null,
          'params':{
            'estadoTemperaturaAmbiente':{
              'type':'noBox',
              'alarm':null,
              'name':'Ambient',
              'state':null,
              'unit':'ºC',
              'value':23.04,
            },
            'estadoTemperaturaAnticongelante':{
              'type':'noBox',
              'alarm':null,
              'name':'Anti-Freeze',
              'state':null,
              'unit':'ºC',
              'value':12.03,
            },
            'estadoTemperaturaExterior':{
              'type':'noBox',
              'alarm':null,
              'name':'Exterior',
              'state':null,
              'unit':'ºC',
              'value':21.52,
            },
          }
        },
        'states':{
          'type':'group',
          'name':'Heating Stages',
          'unit':null,
          'value':null,
          'params':{
            'calefaccionEtapa01':{
              'type':'box',
              'alarm':0,
              'name':'01',
              'state':'ok',
              'unit':null,
              'value':null,
            },
            'calefaccionEtapa02':{
              'type':'box',
              'alarm':0,
              'name':'02',
              'state':'ok',
              'unit':null,
              'value':null,
            },
          }
        },
      }}
    />

    <Device
      title={'Vea 01'}
      id={601}

      width={54}
      height={0}
      posX={280}
      posY={20}

      alarm={1}
      collapsible={0}

      states={{
        'command':'1',
        'working':'1',
        'unit':null,
        'switch':null,
      }}
    />

    <Device
      title={'Vea 08'}
      id={602}

      width={54}
      height={45}
      posX={70}
      posY={120}

      alarm={1}
      collapsible={0}

      states={{
        'command':'1',
        'working':'1',
        'unit':null,
        'switch':null,
      }}
    />

    <Device
      title={'Vea 09'}
      id={603}

      width={54}
      height={45}
      posX={125}
      posY={88}

      alarm={1}
      collapsible={0}

      states={{
        'command':'1',
        'working':'1',
        'unit':null,
        'switch':null,
      }}
    />

    <Device
      title={'Vea 10'}
      id={604}

      width={54}
      height={45}
      posX={176}
      posY={98}

      alarm={1}
      collapsible={0}

      states={{
        'command':'1',
        'working':'1',
        'unit':null,
        'switch':null,
      }}
    />

    <Device
      title={'Vea 11'}
      id={605}

      width={54}
      height={45}
      posX={210}
      posY={160}

      alarm={1}
      collapsible={0}

      states={{
        'command':'1',
        'working':'1',
        'unit':null,
        'switch':null,
      }}
    />

    <Device
      title={'Vea 12'}
      id={606}

      width={54}
      height={45}
      posX={193}
      posY={212}

      alarm={1}
      collapsible={0}

      states={{
        'command':'1',
        'working':'1',
        'unit':null,
        'switch':null,
      }}
    />

    <Device
      title={'Vea 13'}
      id={607}

      width={54}
      height={0}
      posX={133}
      posY={250}

      alarm={1}
      collapsible={0}

      states={{
        'command':'1',
        'working':'1',
        'unit':null,
        'switch':null,
      }}
    />

    <Device
      title={'Vea 14'}
      id={608}

      width={54}
      height={45}
      posX={80}
      posY={217}

      alarm={1}
      collapsible={0}

      states={{
        'command':'1',
        'working':'1',
        'unit':null,
        'switch':null,
      }}
    />

    <Device
      title={'Vea 15'}
      id={609}

     width={54}
      height={45}
      posX={58}
      posY={170}

      alarm={1}
      collapsible={0}

      states={{
        'command':'1',
        'working':'1',
        'unit':null,
        'switch':null,
      }}
    />

    <Device
      title={'Vea 16'}
      id={610}

      width={54}
      height={0}
      posX={305}
      posY={20}

      alarm={1}
      collapsible={0}

      states={{
        'command':'1',
        'working':'1',
        'unit':null,
        'switch':null,
      }}
    />

    <Device
      title={'Vea 17'}
      id={611}

      width={54}
      height={0}
      posX={380}
      posY={20}

      alarm={1}
      collapsible={0}

      states={{
        'command':'1',
        'working':'1',
        'unit':null,
        'switch':null,
      }}
    />

   
  </React.Fragment>

    );
  }

  render() {

    return (

  <g id="Level5">
    <path id="Floor" className={styles.cls6} d="m293.52,131.4h136l.04-79.53h-4.05v-13.81l-199.25-.09-8.6,19.81c27.52,11.83,46.13,29.36,58.03,44.34l-3.98,2.69c-25.98-32.8-66.16-53.85-111.25-53.85-78.34,0-141.85,63.51-141.85,141.85,0,69.79,50.4,127.81,116.8,139.64h50.09c57.99-10.33,103.79-55.89,114.46-113.77h23.87v-51.69h-23.86c-2.98-16.19-8.7-31.42-16.67-45.18l4.03-2.72c4.33,7.44,6.2,12.31,6.2,12.31Z"/>
    <g id="Outside">
      <polyline className={styles.cls8} points="217.66 57.77 229.73 29.44 781.52 29.44 817.31 44.79 817.31 260.93 781.52 276.28 280.94 276.28 279.33 278.72 781.87 278.72 819.82 262.61 819.82 42.84 781.87 26.65 229.03 26.65 216.33 57.21 215.36 56.79 228.47 25.12 594.75 25.12 789.4 21.91 851.22 46.47 851.22 258.98 789.4 283.68 594.75 280.61 277.87 280.61"/>
      <polyline className={styles.cls8} points="224.47 34.79 224.47 22.75 404.58 22.75 823.62 16.02 876.91 34.72 876.91 271.13 823.62 289.76 546.63 285.3 419.47 285.3"/>
      <polyline className={styles.cls8} points="832.62 286.64 836.21 286.64 884.26 270.16 884.26 35.6 836.21 18.68 831.3 18.68"/>
      <line className={styles.cls8} x1="789.4" y1="283.68" x2="781.87" y2="278.72"/>
      <line className={styles.cls8} x1="851.22" y1="258.98" x2="819.82" y2="262.61"/>
      <line className={styles.cls8} x1="851.22" y1="46.47" x2="819.82" y2="42.84"/>
      <line className={styles.cls8} x1="789.4" y1="21.91" x2="781.87" y2="26.65"/>
      <line className={styles.cls8} x1="823.62" y1="16.02" x2="797.89" y2="25.08"/>
      <line className={styles.cls8} x1="876.91" y1="34.72" x2="848.14" y2="45.16"/>
      <line className={styles.cls8} x1="836.21" y1="18.68" x2="834.81" y2="19.73"/>
      <line className={styles.cls8} x1="884.26" y1="35.6" x2="876.98" y2="40.87"/>
      <line className={styles.cls8} x1="884.26" y1="270.16" x2="877.07" y2="264.63"/>
      <line className={styles.cls8} x1="876.91" y1="271.13" x2="847.96" y2="260.42"/>
      <line className={styles.cls8} x1="823.62" y1="289.76" x2="797.81" y2="280.33"/>
      <line className={styles.cls8} x1="836.21" y1="286.64" x2="835.07" y2="285.94"/>
    </g>
    <g id="Building">
      <g id="Elevator">
        <path className={styles.cls15} d="m424.22,140.05c.28,0,.5-.22.5-.5v-5.93c0-.28-.22-.5-.5-.5h-1.82v-.67c0-.39-.31-.7-.7-.7h-1.63c-.39,0-.7.31-.7.7v.67h-1.71c-.28,0-.5.22-.5.5v1.73h-38.44v-1.73c0-.28-.22-.5-.5-.5h-1.82v-.67c0-.39-.31-.7-.7-.7h-1.63c-.39,0-.7.31-.7.7v.67h-1.71c-.28,0-.5.22-.5.5v1.73h-38.44v-1.73c0-.28-.22-.5-.5-.5h-1.82v-.67c0-.39-.31-.7-.7-.7h-1.63c-.39,0-.7.31-.7.7v.67h-1.71c-.28,0-.5.22-.5.5v1.23h-31.71l1.5,3h30.21v1.7c0,.26.21.47.47.49v106.08c-.26.02-.47.23-.47.49v1.06h-32.04l-1.5,3h33.54v1.87c0,.28.22.5.5.5h1.71v14.17c0,.39.31,0,.7,0h1.63c.39,0,.7.39.7,0v-14.17h1.82c.28,0,.5-.22.5-.5v-2.37h38.44v2.37c0,.28.22.5.5.5h1.71v14.17c0,.39.31,0,.7,0h1.63c.39,0,.7.39.7,0v-14.17h1.82c.28,0,.5-.22.5-.5v-2.37h38.44v2.37c0,.28.22.5.5.5h1.71v14.17c0,.39.31,0,.7,0h1.63c.39,0,.7.39.7,0v-14.17h1.82c.28,0,.5-.22.5-.5v-5.93c0-.28-.22-.5-.5-.5h-.03v-106.07h.03Zm-99.29-3.2h-29.36l-.5-1h29.86v1Zm0,112.84h-31.69l.5-1h31.19v1Zm97.48-111.03h.41c.28,0,.5-.22.5-.5v-3.14c0-.28-.22-.5-.5-.5h-.41v-.39h1.32v4.93h-1.32v-.39Zm-2.03-5.04v-.88h1.03v1.77h-1.03v-.89Zm-.81,1.89h2.75v2.14h-2.75v-2.14Zm1.84,3.14v108.86h-1.03v-108.86h1.03Zm-2.03,105.16h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm-1.21-11.91h1.21v.39h-.31c-.28,0-.5.22-.5.5v3.14c0,.28.22.5.5.5h.31v.39h-1.21v-4.93Zm-41.76,4.54h.41c.28,0,.5-.22.5-.5v-3.14c0-.28-.22-.5-.5-.5h-.41v-.39h1.32v4.93h-1.32v-.39Zm1.82,1.39c.28,0,.5-.22.5-.5v-2.2h38.44v2.2c0,.28.22.5.5.5h1.71v.84h-42.97v-.84h1.82Zm-3.85-6.43v-.88h1.03v1.77h-1.03v-.89Zm-.81,1.89h2.75v2.14h-2.75v-2.14Zm1.84,3.14v108.86h-1.03v-108.86h1.03Zm-2.03,105.16h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm0-5.15h-42.97v-4.15h42.97v4.15Zm-1.21-11.91h1.21v.39h-.31c-.28,0-.5.22-.5.5v3.14c0,.28.22.5.5.5h.31v.39h-1.21v-4.93Zm-41.76,4.54h.41c.28,0,.5-.22.5-.5v-3.14c0-.28-.22-.5-.5-.5h-.41v-.39h1.32v4.93h-1.32v-.39Zm1.82,1.39c.28,0,.5-.22.5-.5v-2.2h38.44v2.2c0,.28.22.5.5.5h1.71v.84h-42.97v-.84h1.82Zm-3.85-6.43v-.88h1.03v1.77h-1.03v-.89Zm-.81,1.89h2.75v2.14h-2.75v-2.14Zm1.84,3.14v108.86h-1.03v-108.86h1.03Zm-3.24-4.54h1.21v.39h-.31c-.28,0-.5.22-.5.5v3.14c0,.28.22.5.5.5h.31v.39h-1.21v-4.93Zm1.21,113.39h-.31c-.28,0-.5.22-.5.5v3.14c0,.28.22.5.5.5h.31v.39h-1.21v-4.93h1.21v.39Zm2.03,5.04v14.67h-1.03v-15.56h1.03v.89Zm.91-1.89h-2.75v-2.14h2.75v2.14Zm1.4,1.39h-1.32v-.39h.41c.28,0,.5-.22.5-.5v-3.14c0-.28-.22-.5-.5-.5h-.41v-.39h1.32v4.93Zm41.65-4.54h-.31c-.28,0-.5.22-.5.5v3.14c0,.28.22.5.5.5h.31v.39h-1.21v-4.93h1.21v.39Zm-1.71-1.39c-.28,0-.5.22-.5.5v1.56h-38.44v-1.56c0-.28-.22-.5-.5-.5h-1.82v-1.3h42.97v1.3h-1.71Zm3.74,6.43v14.67h-1.03v-15.56h1.03v.89Zm.91-1.89h-2.75v-2.14h2.75v2.14Zm1.4,1.39h-1.32v-.39h.41c.28,0,.5-.22.5-.5v-3.14c0-.28-.22-.5-.5-.5h-.41v-.39h1.32v4.93Zm41.65-4.54h-.31c-.28,0-.5.22-.5.5v3.14c0,.28.22.5.5.5h.31v.39h-1.21v-4.93h1.21v.39Zm-1.71-1.39c-.28,0-.5.22-.5.5v1.56h-38.44v-1.56c0-.28-.22-.5-.5-.5h-1.82v-1.3h42.97v1.3h-1.71Zm3.74,6.43v14.67h-1.03v-15.56h1.03v.89Zm.91-1.89h-2.75v-2.14h2.75v2.14Zm1.4,1.39h-1.32v-.39h.41c.28,0,.5-.22.5-.5v-3.14c0-.28-.22-.5-.5-.5h-.41v-.39h1.32v4.93Z"/>
      </g>
      <g id="Wall">
        <rect className={styles.cls8} x="277.24" y="54.53" width="1.4" height="6.58" transform="translate(335.76 -220.13) rotate(90)"/>
        <rect className={styles.cls8} x="292.99" y="55.15" width="1.4" height="5.34" transform="translate(351.51 -235.88) rotate(90)"/>
        <rect className={styles.cls8} x="426.67" y="131.54" width="2.96" height="128.2"/>
        <polygon className={styles.cls8} points="429.63 130.63 428.23 130.63 428.23 53.17 424.18 53.17 424.18 37.96 425.58 37.96 425.58 51.77 429.63 51.77 429.63 130.63"/>
        <rect className={styles.cls8} x="369.09" y="-15.74" width="1.4" height="108.78" transform="translate(408.45 -331.14) rotate(90)"/>
        <rect className={styles.cls8} x="297.4" y="57.68" width="6.88" height="1.4"/>
        <polygon className={styles.cls8} points="297.4 37.96 297.4 39.36 314 39.36 314 57.68 311.82 57.68 311.82 59.08 314 59.08 314 75.77 315.4 75.77 315.4 37.96 297.4 37.96"/>
        <polygon className={styles.cls8} points="226.33 37.86 217.66 57.77 219.22 58.42 224.64 45.54 227.17 45.54 227.17 44.19 225.2 44.19 227.26 39.26 263.31 39.26 263.31 45.54 265.31 45.54 265.31 39.21 274.19 39.21 274.19 37.86 226.33 37.86"/>
        <polygon className={styles.cls8} points="386.43 130.63 385.03 130.63 385.03 98.28 315.41 98.28 315.41 99.28 314.01 99.28 314.01 95.72 315.41 95.72 315.41 96.88 386.43 96.88 386.43 130.63"/>
        <polygon className={styles.cls8} points="314.01 117.07 314.01 117.94 301.48 117.94 301.48 119.34 314.01 119.34 314.01 130.47 315.41 130.47 315.41 119.34 315.41 117.94 315.41 117.07 314.01 117.07"/>
        <polygon className={styles.cls8} points="288.66 121.61 291.73 119.34 293.5 119.34 293.5 117.94 291.03 117.94 287.88 120.16 288.66 121.61"/>
      </g>
      <g id="DOORS">
        <path className={styles.cls15} d="m294.08,125.12c-.14,0-.25-.11-.25-.25v-6.91c0-.14.11-.25.25-.25h.07c.14,0,.25.11.25.25v6.65c3.52-.22,6.26-3.11,6.26-6.65,0-.14.11-.25.25-.25s.25.11.25.25c0,3.85-3.02,7.01-6.87,7.17-.03,0-.06,0-.09-.01-.02,0-.04.01-.06.01h-.07,0Z"/>
        <path className={styles.cls15} d="m304.38,76.7v.2s0,.05.01.07c.25,4.26,3.19,7.73,7.13,8.79-3.99,1.08-6.96,4.62-7.15,8.95,0,.03.02.05.03.08-.02.04-.03.09-.03.14v.2c0,.19.15.34.34.34h9.17c.19,0,.34-.15.34-.34v-.2c0-.19-.15-.34-.34-.34h-8.81c.29-4.76,4.2-8.47,8.99-8.47.19,0,.34-.15.34-.34s-.15-.34-.34-.34c-4.69,0-8.53-3.56-8.96-8.17h8.79c.19,0,.34-.15.34-.34v-.2c0-.19-.15-.34-.34-.34h-9.17c-.19,0-.34.15-.34.34v-.03Z"/>
        <g id="DOORS-2" data-name="DOORS">
          <path className={styles.cls15} d="m304.38,99.77v.18s0,.05.01.06c.25,3.9,3.19,7.08,7.13,8.05-3.99.99-6.96,4.23-7.15,8.19,0,.03.02.05.03.07-.02.04-.03.08-.03.13v.18c0,.17.15.31.34.31h9.17c.19,0,.34-.14.34-.31v-.18c0-.17-.15-.31-.34-.31h-8.81c.29-4.36,4.2-7.75,8.99-7.75.19,0,.34-.14.34-.31s-.15-.31-.34-.31c-4.69,0-8.53-3.26-8.96-7.48h8.79c.19,0,.34-.14.34-.31v-.18c0-.17-.15-.31-.34-.31h-9.17c-.19,0-.34.14-.34.31v-.03Z"/>
        </g>
      </g>
      <g id="STAIRS">
        <g id="enclosure_stairs" data-name="enclosure stairs">
          <path className={styles.cls15} d="m276.32,81.93s.01,0,.02,0c.14-.13.14-.36.01-.5-4.02-4.24-8.32-8.3-12.79-12.06-3.56-3-7.31-5.89-11.12-8.56-.01,0-.02,0-.04,0-4.6-3.22-9.42-6.24-14.33-8.95-.17-.1-.38-.03-.48.14,0,0,0,.02,0,.02l-5.18,9.32s-.01,0-.02.02c0,.01,0,.03,0,.04-.03.07-.04.15-.02.22,0,0,0,0,0,.01.03.08.08.16.17.21,4.48,2.39,8.88,5.05,13.07,7.92.01,0,.02.02.03.03,3.46,2.35,6.83,4.92,10.01,7.63,0,0,0,0,0,0,0,0,0,0,0,0,4.53,3.67,8.83,7.71,12.79,12,.07.08.17.12.27.11l7.61-7.58Zm-6.96,6.1c-.6-.64-1.21-1.27-1.82-1.9l5.68-5.6c.58.59,1.17,1.18,1.74,1.78l-5.6,5.72Zm-12.68-11.88s-.02,0-.02,0c-.07-.06-.15-.12-.23-.19l5.1-6.17c.28.24.57.47.85.7,0,0,.01,0,.02,0,.34.29.67.59,1.01.88l-5.21,6.06c-.51-.43-1.01-.86-1.52-1.28Zm-11.15-18l-4.34,6.8c-.65-.41-1.31-.81-1.97-1.2l4.21-6.91c.7.43,1.4.87,2.1,1.31Zm.6.38c.7.45,1.39.89,2.08,1.35l-4.46,6.68c-.65-.42-1.3-.83-1.96-1.24l4.33-6.79Zm2.66,1.74c.68.46,1.37.92,2.04,1.38l-4.58,6.57c-.63-.43-1.27-.85-1.92-1.27l4.45-6.68Zm2.63,1.79c.67.47,1.34.95,2.01,1.44l-4.7,6.46c-.63-.45-1.26-.89-1.89-1.32l4.58-6.57Zm2.59,1.85c.66.48,1.32.98,1.97,1.47l-4.82,6.36c-.61-.46-1.23-.92-1.85-1.37l4.7-6.46Zm2.54,1.9c.65.5,1.3,1.01,1.95,1.51l-4.96,6.26c-.6-.48-1.2-.95-1.81-1.42l4.82-6.35Zm2.51,1.95c.65.51,1.28,1.03,1.92,1.56l-5.09,6.17c-.59-.49-1.18-.99-1.78-1.47l4.96-6.26Zm-16.23-11.3l-4.22,6.91c-.66-.39-1.32-.78-1.98-1.16l4.09-7.03c.71.42,1.41.84,2.11,1.27Zm15.92,21.41l5.2-6.05c.62.54,1.24,1.07,1.86,1.62l-5.31,5.93c-.58-.51-1.16-1-1.75-1.5Zm7.58-3.96c.61.55,1.22,1.11,1.83,1.68l-5.43,5.81c-.57-.53-1.14-1.04-1.72-1.56l5.31-5.93Zm-28.38-20.31c.72.4,1.43.82,2.15,1.23l-4.09,7.03c-.67-.38-1.35-.75-2.02-1.12l3.97-7.15Zm25.31,28.27l5.42-5.81c.6.56,1.18,1.13,1.77,1.71l-5.55,5.7c-.55-.54-1.09-1.08-1.65-1.6Zm2.16,2.1l5.55-5.71c.59.58,1.18,1.15,1.76,1.74l-5.67,5.6c-.54-.55-1.09-1.09-1.64-1.63Z"/>
          <polygon className={styles.cls11} points="268.37 86.77 273.69 81.24 272.87 85.78 268.37 86.77"/>
          <path className={styles.cls7} d="m270.93,83.91s-15.21-16.4-35.88-27.03"/>
        </g>
        <g id="Stairs">
          <path className={styles.cls15} d="m419.87,295.71-3-.25h-12.5c-.28,0-.5.23-.5.51v78.02c0,.28.22.5.5.5h27c.28,0,.5-.22.5-.5v-77.78c.01-.28-.21-.5-.49-.5h-12.51v65.78h-2v-66.03Zm14.01,12.01h-11.01v-2.01h11.01v2.01Zm0,1v2h-11.01v-2h11.01Zm0,3v2h-11.01v-2h11.01Zm0,3v2h-11.01v-2h11.01Zm0,3v2h-11.01v-2h11.01Zm0,3v2h-11.01v-2h11.01Zm0,3v2h-11.01v-2h11.01Zm0,3v2h-11.01v-2h11.01Zm0,3v2h-11.01v-2h11.01Zm0,3v2.01h-11.01v-2.01h11.01Zm0,3.01v2h-11.01v-2h11.01Zm0,3v2h-11.01v-2h11.01Zm0,3v2h-11.01v-2h11.01Zm0,3v2h-11.01v-2h11.01Zm0,3v2h-11.01v-2h11.01Zm0,3v2h-11.01v-2h11.01Zm0-46.02h-11.01v-2h11.01v2Zm-11.01,49.02h11.01v2h-11.01v-2Zm11.01-52.02h-11.01v-2h11.01v2Zm-11.01,55.02h11.01v2.01h-11.01v-2.01Zm11.01-59.77v1.75h-11.01v-1.75h11.01Zm-11.01,62.78h11.01v2h-11.01v-2Zm-15,2v-2h11v2h-11Zm11-56.02v2h-11v-2h11Zm-11-1v-2h11v2h-11Zm11,4v2h-11v-2h11Zm0,3v2h-11v-2h11Zm0,3v2h-11v-2h11Zm0,3v2h-11v-2h11Zm0,3v2h-11v-2h11Zm0,3v2h-11v-2h11Zm0,3v2.01h-11v-2.01h11Zm0,3.01v2h-11v-2h11Zm0,3v2h-11v-2h11Zm0,3v2h-11v-2h11Zm0,3v2h-11v-2h11Zm0,3v2h-11v-2h11Zm0,3v2h-11v-2h11Zm0,3v2h-11v-2h11Zm0,3v2h-11v-2h11Zm0,3v2.01h-11v-2.01h11Zm0,3.01v2h-11v-2h11Zm0-55.02h-11v-2.01h11v2.01Zm0-5.01v2h-11v-1.99h11Zm-11,66.02h26.01v11h-26.01v-11Z"/>
          <polygon className={styles.cls11} points="414.21 293.64 406.53 293.64 410.37 291.09 414.21 293.64"/>
          <polyline className={styles.cls7} points="410.4 293.71 410.4 367.85 425.56 367.85 425.56 293.9"/>
        </g>
      </g>
      <g id="Machines">
        <rect className={styles.cls10} x="280.55" y="43.07" width="10.86" height="13.56"/>
        <rect className={styles.cls10} x="344.43" y="40.05" width="13.53" height="8.23"/>
        <rect className={styles.cls10} x="357.96" y="40.05" width="14.11" height="8.23" transform="translate(730.03 88.33) rotate(180)"/>
        <rect className={styles.cls10} x="383.08" y="40.05" width="27.13" height="8.23"/>
        <rect className={styles.cls10} x="348.05" y="61.54" width="6.38" height="13"/>
        <rect className={styles.cls10} x="354.43" y="61.54" width="26.86" height="13" transform="translate(735.73 136.08) rotate(180)"/>
        <rect className={styles.cls10} x="397.19" y="61.54" width="26.05" height="13"/>
        <rect className={styles.cls10} x="389.95" y="61.54" width="7.24" height="13" transform="translate(787.14 136.08) rotate(180)"/>
        <rect className={styles.cls10} x="414.55" y="78.97" width="8.15" height="17.08" transform="translate(837.25 175.01) rotate(180)"/>
        <rect className={styles.cls10} x="340.63" y="107.58" width="30.31" height="12.6" transform="translate(711.56 227.77) rotate(180)"/>
        <rect className={styles.cls10} x="325.56" y="48.14" width="10.12" height="5.77" transform="translate(661.24 102.05) rotate(180)"/>
        <rect className={styles.cls10} x="325.56" y="53.91" width="10.12" height="6.22" transform="translate(661.24 114.03) rotate(180)"/>
        <rect className={styles.cls10} x="325.56" y="60.13" width="10.12" height="5.89" transform="translate(661.24 126.14) rotate(180)"/>
        <g id="Crane">
          <g id="Rails">
            <rect className={styles.cls13} x="425.22" y="253.91" width="321.86" height="4.58"/>
            <rect className={styles.cls13} x="425.22" y="46.84" width="321.86" height="4.58"/>
            <rect className={styles.cls13} x="625.9" y="47.71" width="4.1" height="207.27"/>
            <rect className={styles.cls13} x="595.64" y="47.71" width="41.37" height="2.43"/>
            <path className={styles.cls13} d="m597.33,50.14h1.66v4.63c0,.46-.37.83-.83.83h0c-.46,0-.83-.37-.83-.83v-4.63h0Z"/>
            <path className={styles.cls13} d="m598.16,249.96h0c.46,0,.83.37.83.83v3.27h-1.66v-3.27c0-.46.37-.83.83-.83Z"/>
            <polygon className={styles.cls13} points="606.55 254.98 606.55 50.14 596.36 50.14 596.36 53.7 601.06 53.7 601.06 251.86 596.36 251.86 596.36 254.98 606.55 254.98"/>
            <rect className={styles.cls13} x="595.64" y="254.98" width="41.37" height="2.43"/>
            <rect className={styles.cls13} x="631.63" y="50.14" width="2.16" height="204.84"/>
          </g>
          <g id="CraneBody">
            <g>
              <g>
                <rect className={styles.cls13} x="624.73" y="196.36" width="3.42" height="19.04"/>
                <path className={styles.cls13} d="m625.3,215.4h2.28v2.45c0,.63-.51,1.14-1.14,1.14h0c-.63,0-1.14-.51-1.14-1.14v-2.45h0Z"/>
              </g>
              <rect className={styles.cls13} x="604.26" y="214.52" width="5.05" height="2.51"/>
              <rect className={styles.cls13} x="604.26" y="218.38" width="5.05" height="2.51"/>
            </g>
            <rect className={styles.cls13} x="609.15" y="196.36" width="14.1" height="5.96"/>
            <rect className={styles.cls13} x="605.91" y="202.33" width="20.58" height="1.88"/>
            <rect className={styles.cls13} x="605.91" y="211.54" width="20.58" height="1.88"/>
            <rect className={styles.cls13} x="609.15" y="190.09" width="14.1" height="6.27"/>
            <rect className={styles.cls13} x="612.2" y="196.36" width="8.02" height="5.96"/>
            <rect className={styles.cls13} x="604.62" y="196.36" width="6.18" height="3.23"/>
            <rect className={styles.cls13} x="609.15" y="220.47" width="14.1" height="6.27"/>
            <rect className={styles.cls13} x="609.15" y="213.42" width="14.1" height="7.05"/>
            <rect className={styles.cls13} x="609.18" y="204.21" width="14.05" height="7.33"/>
            <rect className={styles.cls13} x="615.11" y="204.76" width="2.19" height="2.9" rx=".59" ry=".59"/>
          </g>
        </g>
        <rect className={styles.cls10} x="201.64" y="74.42" width="21.05" height="19.23" transform="translate(371.8 247.09) rotate(-156)"/>
      </g>
      <g id="SolidWall">
        <rect className={styles.cls12} x="693.68" y="38.75" width="4.84" height="6.05"/>
        <rect className={styles.cls12} x="643.82" y="38.75" width="4.79" height="6.05"/>
        <rect className={styles.cls12} x="693.45" y="260.23" width="5.07" height="6.33"/>
        <rect className={styles.cls12} x="593.4" y="260.23" width="5.07" height="6.33"/>
        <rect className={styles.cls12} x="643.53" y="260.23" width="5.07" height="6.33"/>
        <rect className={styles.cls12} x="593.56" y="38.75" width="4.79" height="6.05"/>
        <rect className={styles.cls12} x="543.43" y="38.75" width="4.79" height="6.05"/>
        <rect className={styles.cls12} x="425.91" y="260.42" width="4.74" height="6.24"/>
        <rect className={styles.cls12} x="416.52" y="281.02" width="2.74" height="83.58"/>
        <polygon className={styles.cls12} points="294.38 132.89 429.59 132.89 429.59 132.89 429.59 130.34 429.59 130.34 293.21 130.34 294.38 132.89"/>
        <rect className={styles.cls12} x="483.02" y="38.61" width="4.57" height="7.82"/>
        <rect className={styles.cls12} x="425.75" y="38.61" width="4.67" height="7.76"/>
        <rect className={styles.cls12} x="543.43" y="260.23" width="5.07" height="6.33"/>
        <polygon className={styles.cls12} points="793.03 38.75 793.03 41.68 746.75 41.68 746.75 44.79 741.73 44.79 741.73 38.75 793.03 38.75"/>
        <polygon className={styles.cls12} points="793.03 266.56 793.03 263.63 746.75 263.63 746.75 260.51 741.73 260.51 741.73 266.56 793.03 266.56"/>
        <polygon className={styles.cls12} points="295.31 29.44 295.31 35.37 276.82 35.37 276.82 29.44 274.45 29.44 274.45 59.01 276.82 59.01 276.82 39.03 295.31 39.03 295.31 59.01 297.68 59.01 297.68 39.03 297.68 35.37 297.68 29.44 295.31 29.44"/>
      </g>
    </g>
    <g id="text">
      <g id="t1">
        <g className={styles.cls32}>
          <text className={styles.cls16} transform="translate(395.02 107.49)"><tspan x="0" y="0">Ge</tspan><tspan className={styles.cls25} x="8.26" y="0">n</tspan><tspan x="12.34" y="0">e</tspan><tspan className={styles.cls21} x="15.96" y="0">r</tspan><tspan x="18.31" y="0">al</tspan><tspan x="2.9" y="7.2">Utili</tspan><tspan className={styles.cls1} x="14.93" y="7.2">t</tspan><tspan x="17.31" y="7.2">y</tspan><tspan x="2.62" y="14.4">Room</tspan></text>
          <text className={styles.cls16} transform="translate(395.02 107.49)"><tspan x="0" y="0">Ge</tspan><tspan className={styles.cls25} x="8.26" y="0">n</tspan><tspan x="12.34" y="0">e</tspan><tspan className={styles.cls21} x="15.96" y="0">r</tspan><tspan x="18.31" y="0">al</tspan><tspan x="2.9" y="7.2">Utili</tspan><tspan className={styles.cls1} x="14.93" y="7.2">t</tspan><tspan x="17.31" y="7.2">y</tspan><tspan x="2.62" y="14.4">Room</tspan></text>
        </g>
        <g className={styles.cls32}>
          <text className={styles.cls16} transform="translate(320.5 114.33)"><tspan x="0" y="0">Optics Main</tspan><tspan className={styles.cls3} x="35.98" y="0">t</tspan><tspan className={styles.cls24} x="38.3" y="0">ena</tspan><tspan className={styles.cls33} x="49.53" y="0">n</tspan><tspan className={styles.cls18} x="53.6" y="0">c</tspan><tspan x="56.93" y="0">e</tspan><tspan x="21.16" y="7.2">Room</tspan></text>
          <text className={styles.cls16} transform="translate(320.5 114.33)"><tspan x="0" y="0">Optics Main</tspan><tspan className={styles.cls3} x="35.98" y="0">t</tspan><tspan className={styles.cls24} x="38.3" y="0">ena</tspan><tspan className={styles.cls33} x="49.53" y="0">n</tspan><tspan className={styles.cls18} x="53.6" y="0">c</tspan><tspan x="56.93" y="0">e</tspan><tspan x="21.16" y="7.2">Room</tspan></text>
        </g>
        <g className={styles.cls32}>
          <text className={styles.cls16} transform="translate(366.07 197.01)"><tspan x="0" y="0">8</tspan><tspan className={styles.cls31} x="3.83" y="0">0</tspan><tspan className={styles.cls34} x="7.85" y="0">-</tspan><tspan className={styles.cls23} x="9.95" y="0">T</tspan><tspan x="13.06" y="0">on</tspan><tspan x="-8.33" y="7.2">Plat</tspan><tspan className={styles.cls21} x="3.56" y="7.2">f</tspan><tspan className={styles.cls24} x="5.54" y="7.2">o</tspan><tspan className={styles.cls26} x="9.31" y="7.2">r</tspan><tspan className={styles.cls22} x="11.66" y="7.2">m Lift</tspan></text>
          <text className={styles.cls16} transform="translate(366.07 197.01)"><tspan x="0" y="0">8</tspan><tspan className={styles.cls31} x="3.83" y="0">0</tspan><tspan className={styles.cls34} x="7.85" y="0">-</tspan><tspan className={styles.cls23} x="9.95" y="0">T</tspan><tspan x="13.06" y="0">on</tspan><tspan x="-8.33" y="7.2">Plat</tspan><tspan className={styles.cls21} x="3.56" y="7.2">f</tspan><tspan className={styles.cls24} x="5.54" y="7.2">o</tspan><tspan className={styles.cls26} x="9.31" y="7.2">r</tspan><tspan className={styles.cls22} x="11.66" y="7.2">m Lift</tspan></text>
        </g>
        <g className={styles.cls32}>
          <text className={styles.cls16} transform="translate(243.52 175.26)"><tspan className={styles.cls26} x="0" y="0">L</tspan><tspan className={styles.cls29} x="3.49" y="0">ow</tspan><tspan x="12.34" y="0">er E</tspan><tspan className={styles.cls25} x="23.96" y="0">n</tspan><tspan className={styles.cls26} x="28.03" y="0">c</tspan><tspan x="31.36" y="0">losu</tspan><tspan className={styles.cls36} x="43.71" y="0">r</tspan><tspan x="46.04" y="0">e</tspan><tspan x="4.92" y="7.2">G</tspan><tspan className={styles.cls35} x="9.56" y="7.2">r</tspan><tspan x="11.89" y="7.2">ou</tspan><tspan className={styles.cls33} x="19.69" y="7.2">n</tspan><tspan x="23.76" y="7.2">d Floor</tspan></text>
          <text className={styles.cls16} transform="translate(243.52 175.26)"><tspan className={styles.cls26} x="0" y="0">L</tspan><tspan className={styles.cls29} x="3.49" y="0">ow</tspan><tspan x="12.34" y="0">er E</tspan><tspan className={styles.cls25} x="23.96" y="0">n</tspan><tspan className={styles.cls26} x="28.03" y="0">c</tspan><tspan x="31.36" y="0">losu</tspan><tspan className={styles.cls36} x="43.71" y="0">r</tspan><tspan x="46.04" y="0">e</tspan><tspan x="4.92" y="7.2">G</tspan><tspan className={styles.cls35} x="9.56" y="7.2">r</tspan><tspan x="11.89" y="7.2">ou</tspan><tspan className={styles.cls33} x="19.69" y="7.2">n</tspan><tspan x="23.76" y="7.2">d Floor</tspan></text>
        </g>
        <g className={styles.cls32}>
          <text className={styles.cls16} transform="translate(170.45 221.96)"><tspan className={styles.cls4} x="0" y="0">P</tspan><tspan x="4.17" y="0">ier</tspan><tspan x="-14" y="7.2">G</tspan><tspan className={styles.cls35} x="-9.37" y="7.2">r</tspan><tspan x="-7.04" y="7.2">ou</tspan><tspan className={styles.cls33} x=".76" y="7.2">n</tspan><tspan x="4.84" y="7.2">d Floor</tspan></text>
          <text className={styles.cls16} transform="translate(170.45 221.96)"><tspan className={styles.cls4} x="0" y="0">P</tspan><tspan x="4.17" y="0">ier</tspan><tspan x="-14" y="7.2">G</tspan><tspan className={styles.cls35} x="-9.37" y="7.2">r</tspan><tspan x="-7.04" y="7.2">ou</tspan><tspan className={styles.cls33} x=".76" y="7.2">n</tspan><tspan x="4.84" y="7.2">d Floor</tspan></text>
        </g>
        <g className={styles.cls32}>
          <text className={styles.cls16} transform="translate(36.14 177.61)"><tspan x="0" y="0">M</tspan><tspan className={styles.cls33} x="5.73" y="0">a</tspan><tspan className={styles.cls26} x="9.28" y="0">c</tspan><tspan x="12.61" y="0">hi</tspan><tspan className={styles.cls25} x="18.29" y="0">n</tspan><tspan x="22.36" y="0">e</tspan><tspan x="5.2" y="7.2">S</tspan><tspan className={styles.cls33} x="8.89" y="7.2">h</tspan><tspan x="12.96" y="7.2">op</tspan></text>
          <text className={styles.cls16} transform="translate(36.14 177.61)"><tspan x="0" y="0">M</tspan><tspan className={styles.cls33} x="5.73" y="0">a</tspan><tspan className={styles.cls26} x="9.28" y="0">c</tspan><tspan x="12.61" y="0">hi</tspan><tspan className={styles.cls25} x="18.29" y="0">n</tspan><tspan x="22.36" y="0">e</tspan><tspan x="5.2" y="7.2">S</tspan><tspan className={styles.cls33} x="8.89" y="7.2">h</tspan><tspan x="12.96" y="7.2">op</tspan></text>
        </g>
      </g>
      <g id="t2" className={styles.cls28}>
        <g className={styles.cls32}>
          <text className={styles.cls17} transform="translate(279.43 50.65)"><tspan x="0" y="0">El</tspan><tspan className={styles.cls1} x="3.75" y="0">e</tspan><tspan className={styles.cls19} x="6.13" y="0">v</tspan><tspan className={styles.cls27} x="8.16" y="0">. 2</tspan></text>
          <text className={styles.cls17} transform="translate(279.43 50.65)"><tspan x="0" y="0">El</tspan><tspan className={styles.cls1} x="3.75" y="0">e</tspan><tspan className={styles.cls19} x="6.13" y="0">v</tspan><tspan className={styles.cls27} x="8.16" y="0">. 2</tspan></text>
        </g>
      </g>
      <g id="t2-2" data-name="t2" className={styles.cls28}>
        <g className={styles.cls32}>
          <text className={styles.cls17} transform="translate(206.67 84.73)"><tspan x="0" y="0">El</tspan><tspan className={styles.cls1} x="3.75" y="0">e</tspan><tspan className={styles.cls5} x="6.13" y="0">v</tspan><tspan x="8.16" y="0">. 3</tspan></text>
          <text className={styles.cls17} transform="translate(206.67 84.73)"><tspan x="0" y="0">El</tspan><tspan className={styles.cls1} x="3.75" y="0">e</tspan><tspan className={styles.cls5} x="6.13" y="0">v</tspan><tspan x="8.16" y="0">. 3</tspan></text>
        </g>
      </g>
      <g className={styles.cls32}>
        <text className={styles.cls17} transform="translate(300.74 111.41)"><tspan x="0" y="0">Ha</tspan><tspan className={styles.cls2} x="5.61" y="0">t</tspan><tspan className={styles.cls30} x="7.16" y="0">c</tspan><tspan x="9.38" y="0">h</tspan></text>
        <text className={styles.cls17} transform="translate(300.74 111.41)"><tspan x="0" y="0">Ha</tspan><tspan className={styles.cls2} x="5.61" y="0">t</tspan><tspan className={styles.cls30} x="7.16" y="0">c</tspan><tspan x="9.38" y="0">h</tspan></text>
      </g>
    </g>
    <g id="Dome">
      <g>
        <line className={styles.cls8} x1="170.53" y1="192.71" x2="150.53" y2="192.71"/>
        <line className={styles.cls8} x1="160.53" y1="202.71" x2="160.53" y2="182.71"/>
      </g>
      <rect className={styles.cls10} x="300.02" y="166.9" width="23.87" height="51.69"/>
      <g id="Solid_Walls" data-name="Solid Walls">
        <path className={styles.cls14} d="m230.58,157.34l-10.82,7.44c4.01,8.48,6.27,17.95,6.27,27.93,0,36.12-29.38,65.5-65.5,65.5s-65.5-29.38-65.5-65.5,29.38-65.5,65.5-65.5c18.93,0,35.99,8.08,47.96,20.96l10.8-7.43c-14.39-16.26-35.39-26.53-58.76-26.53-43.29,0-78.5,35.21-78.5,78.5s35.21,78.5,78.5,78.5,78.5-35.21,78.5-78.5c0-12.72-3.06-24.73-8.45-35.37Z"/>
        <circle className={styles.cls14} cx="160.53" cy="192.71" r="8.35"/>
        <path className={styles.cls14} d="m303.92,166.9c-3.05-16.97-9.03-32.93-17.42-47.33l-2.48,1.7c8.07,13.9,13.85,29.28,16.85,45.63h3.05Z"/>
        <path className={styles.cls14} d="m300.87,218.59c-9.64,52.39-47.98,94.85-98.06,110.42l.81,2.89c51.34-15.93,90.62-59.54,100.3-113.31h-3.05Z"/>
        <path className={styles.cls14} d="m185.89,333.14v3.05c2.82-.5,5.62-1.08,8.38-1.73l-.81-2.89c-2.5.59-5.02,1.11-7.57,1.57Z"/>
        <g>
          <path className={styles.cls14} d="m160.53,47.01c-23.42,0-45.56,5.56-65.19,15.42l1.41,2.65c19.21-9.64,40.87-15.07,63.78-15.07,45.48,0,86.06,21.39,112.21,54.63l2.48-1.7c-26.69-34.03-68.18-55.93-114.68-55.93Z"/>
          <path className={styles.cls14} d="m17.83,192.71c0-52.32,28.31-98.14,70.4-122.98l-1.41-2.65C43.78,92.43,14.83,139.25,14.83,192.71c0,71.8,52.2,131.63,120.65,143.54v-3.04c-66.78-11.88-117.65-70.36-117.65-140.5Z"/>
        </g>
        <path className={styles.cls8} d="m88.61,70.43c-41.84,24.67-69.93,70.19-69.93,122.28,0,69.79,50.4,127.81,116.8,139.64"/>
        <path className={styles.cls8} d="m272.07,105.08c-25.97-33.01-66.27-54.22-111.54-54.22-22.79,0-44.32,5.38-63.4,14.93"/>
        <path className={styles.cls8} d="m300.03,166.9c-2.98-16.21-8.72-31.44-16.7-45.22"/>
        <path className={styles.cls8} d="m86.43,66.32C43.11,91.77,14.03,138.84,14.03,192.71c0,72.37,52.47,132.47,121.45,144.36"/>
        <path className={styles.cls8} d="m276.01,102.57c-26.81-34.3-68.57-56.36-115.48-56.36-23.58,0-45.85,5.58-65.58,15.47"/>
        <path className={styles.cls8} d="m304.76,166.9c-3.04-17.12-9.06-33.21-17.5-47.72"/>
        <g>
          <path className={styles.cls8} d="m185.89,337.02c2.92-.51,5.8-1.13,8.65-1.81"/>
          <path className={styles.cls8} d="m203.85,332.67c51.74-16,91.24-59.87,100.9-114.08"/>
        </g>
        <path className={styles.cls8} d="m185.89,332.3c2.48-.45,4.93-.98,7.37-1.56"/>
        <path className={styles.cls8} d="m202.56,328.22c49.79-15.43,87.85-57.54,97.46-109.63"/>
      </g>
      <g id="Doors">
        <path className={styles.cls15} d="m228.22,135.2l.12.17s.03.04.03.07c2.27,3.86,1.73,8.61-1.08,11.83,4.11-1.39,8.77-.04,11.47,3.63.02.03.01.06.02.09.04.02.08.06.11.1l.12.17c.11.17.07.38-.1.5l-8,5.36c-.17.11-.38.07-.5-.1l-.12-.17c-.11-.17-.07-.38.1-.5l7.68-5.15c-3.03-3.98-8.61-4.93-12.79-2.13-.17.11-.38.07-.5-.1s-.07-.38.1-.5c4.09-2.74,5.36-8.09,3.04-12.36l-7.67,5.14c-.17.11-.38.07-.5-.1l-.12-.17c-.11-.17-.07-.38.1-.5l8-5.36c.17-.11.38-.07.5.1l-.02-.03Z"/>
        <path className={styles.cls15} d="m285.52,96.5l.12.17s.03.04.03.07c2.27,3.86,1.73,8.61-1.08,11.83,4.11-1.39,8.77-.04,11.47,3.63.02.03.01.06.02.09.04.02.08.06.11.1l.12.17c.11.17.07.38-.1.5l-8,5.36c-.17.11-.38.07-.5-.1l-.12-.17c-.11-.17-.07-.38.1-.5l7.68-5.15c-3.03-3.98-8.61-4.93-12.79-2.13-.17.11-.38.07-.5-.1s-.07-.38.1-.5c4.09-2.74,5.36-8.09,3.04-12.36l-7.67,5.14c-.17.11-.38.07-.5-.1l-.12-.17c-.11-.17-.07-.38.1-.5l8-5.36c.17-.11.38-.07.5.1l-.02-.03Z"/>
        <path className={styles.cls15} d="m89.38,51.84c.17-.1.38-.03.48.14l4.67,8.42c.1.17.03.38-.14.48l-.09.05c-.17.1-.38.03-.48-.14l-4.49-8.1c-4.14,2.64-5.53,8.01-3.14,12.33.1.17.03.38-.14.48s-.38.03-.48-.14c-2.6-4.7-1.05-10.58,3.53-13.38.03-.02.07-.04.11-.04.03-.01.04-.05.07-.06l.09-.05h0Z"/>
        <path className={styles.cls15} d="m206.41,343.87c.2-.05.29-.28.23-.5l-3.04-11.35c-.06-.24-.27-.37-.45-.32l-.1.03c-.2.05-.29.28-.23.5l2.92,10.91c-4.88.93-9.89-2.82-11.45-8.63-.06-.24-.27-.37-.45-.32s-.29.28-.23.5c1.7,6.33,7.2,10.4,12.51,9.27.04-.01.08-.02.11-.05.03,0,.06,0,.09,0l.1-.03h-.01Z"/>
        <path className={styles.cls15} d="m194.46,83.28c.18.08.25.29.17.47l-4.07,8.73c-.08.18-.29.25-.47.17l-.09-.04c-.18-.08-.25-.29-.17-.47l3.91-8.39c-4.57-1.8-9.73.24-11.82,4.71-.08.18-.29.25-.47.17s-.25-.29-.17-.47c2.27-4.87,7.94-7.07,12.9-5.01.04.02.07.03.1.07.03.01.06,0,.09.02l.09.04h-.01Z"/>
        <line className={styles.cls9} x1="135.54" y1="332.37" x2="185.64" y2="332.37"/>
        <line className={styles.cls9} x1="299.91" y1="167.02" x2="299.91" y2="218.37"/>
      </g>
      <polygon className={styles.cls8} points="190.52 61.07 133.77 61.07 133.77 88.14 177.99 88.14 180.58 89.44 181.24 88.02 178.59 86.7 135.08 86.51 135.08 62.37 177.06 62.37 177.06 73.36 145.76 73.36 145.76 75.42 177.06 75.42 178.48 75.42 178.48 73.36 178.48 62.37 190.24 62.37 205.17 69.09 203.03 73.9 204.22 74.43 206.35 69.62 232.97 81.6 222.08 106.22 195.36 94.31 199.76 84.43 198.57 83.9 194.17 93.78 190.88 92.32 190.14 93.77 222.61 108.23 234.69 80.94 190.52 61.07"/>
      <g id="Stairs-2" data-name="Stairs">
        <polygon className={styles.cls20} points="144.96 76.14 144.96 72.81 175.57 72.81 175.57 63.13 135.84 63.13 135.84 68.47 135.84 72.81 135.84 76.14 135.84 85.83 144.96 85.83 178.52 85.83 178.52 76.14 144.96 76.14"/>
        <line className={styles.cls20} x1="175.48" y1="76.26" x2="175.48" y2="85.78"/>
        <line className={styles.cls20} x1="172.48" y1="76.26" x2="172.48" y2="85.78"/>
        <line className={styles.cls20} x1="169.48" y1="76.26" x2="169.48" y2="85.78"/>
        <line className={styles.cls20} x1="166.48" y1="76.26" x2="166.48" y2="85.78"/>
        <line className={styles.cls20} x1="163.48" y1="76.26" x2="163.48" y2="85.78"/>
        <line className={styles.cls20} x1="160.48" y1="76.26" x2="160.48" y2="85.78"/>
        <line className={styles.cls20} x1="157.48" y1="76.26" x2="157.48" y2="85.78"/>
        <line className={styles.cls20} x1="154.48" y1="76.26" x2="154.48" y2="85.78"/>
        <line className={styles.cls20} x1="151.48" y1="76.26" x2="151.48" y2="85.78"/>
        <line className={styles.cls20} x1="148.48" y1="76.26" x2="148.48" y2="85.78"/>
        <line className={styles.cls20} x1="145.48" y1="76.26" x2="145.48" y2="85.78"/>
        <line className={styles.cls20} x1="148.48" y1="63.26" x2="148.48" y2="72.78"/>
        <line className={styles.cls20} x1="151.48" y1="63.26" x2="151.48" y2="72.78"/>
        <line className={styles.cls20} x1="154.48" y1="63.26" x2="154.48" y2="72.78"/>
        <line className={styles.cls20} x1="157.48" y1="63.26" x2="157.48" y2="72.78"/>
        <line className={styles.cls20} x1="160.48" y1="63.26" x2="160.48" y2="72.78"/>
        <line className={styles.cls20} x1="163.48" y1="63.26" x2="163.48" y2="72.78"/>
        <line className={styles.cls20} x1="166.48" y1="63.26" x2="166.48" y2="72.78"/>
        <line className={styles.cls20} x1="169.48" y1="63.26" x2="169.48" y2="72.78"/>
        <line className={styles.cls20} x1="172.48" y1="63.26" x2="172.48" y2="72.78"/>
        <g id="Arrow">
          <polygon className={styles.cls11} points="173.12 72.02 173.12 64.35 175.68 68.19 173.12 72.02"/>
          <polyline className={styles.cls7} points="173.96 68.19 140.57 68.19 140.57 80.98 178.75 80.98"/>
        </g>
      </g>
    </g>
    <g id="Stairs-3" data-name="Stairs">
      <path className={styles.cls15} d="m253.68,322.26c-.47.34-.94.69-1.41,1.03l-5.32-7.59c.42-.3.83-.6,1.24-.9l-.41-.56c-7.14,5.14-14.75,9.67-22.75,13.51l.32.62c.24-.12.49-.23.73-.34l4.07,8.33c-.19.09-.39.18-.58.27l.33.64c8.52-4.1,16.61-8.94,24.21-14.43l-.43-.58Zm-22.9,13.78l-4.07-8.33c.57-.28,1.14-.56,1.71-.85l4.21,8.26c-.61.31-1.23.62-1.85.92Zm2.49-1.24l-4.21-8.26c.57-.29,1.12-.59,1.69-.89l4.35,8.19c-.61.32-1.22.65-1.83.97Zm2.46-1.3l-4.35-8.19c.56-.3,1.12-.61,1.67-.91l4.5,8.11c-.6.33-1.21.66-1.82.99Zm2.44-1.34l-4.5-8.11c.55-.31,1.11-.61,1.66-.93l4.64,8.03c-.6.34-1.2.68-1.8,1.01Zm2.42-1.37l-4.64-8.03c.55-.32,1.1-.64,1.64-.97l4.78,7.95c-.59.35-1.18.71-1.78,1.05Zm2.39-1.42l-4.78-7.95c.54-.33,1.08-.67,1.62-1l4.91,7.86c-.59.36-1.17.73-1.76,1.09Zm2.36-1.47l-4.91-7.86c.54-.34,1.08-.68,1.61-1.02l5.05,7.78c-.58.37-1.16.74-1.75,1.11Zm2.34-1.5l-5.05-7.78c.53-.35,1.06-.69,1.59-1.05l5.18,7.69c-.57.38-1.15.76-1.73,1.14Zm2.32-1.54l-5.18-7.69c.53-.36,1.05-.72,1.57-1.09l5.32,7.59c-.57.39-1.13.79-1.7,1.18Z"/>
      <path className={styles.cls15} d="m111.52,153.43l.68.29c.63-.78,1.28-1.55,1.95-2.31l6.53,5.88s-.05.06-.08.09l.68.3c6.93-7.76,16.11-13.45,26.52-16.05l-.19-.68c-.18.04-.36.08-.54.12l-2.27-8.49c.16-.04.32-.08.48-.12l-.19-.69c-13.43,3.41-25.14,11.15-33.57,21.65Zm32.59-20.64l2.27,8.49c-.67.18-1.34.38-2,.59l-2.72-8.36c.81-.26,1.62-.49,2.44-.72Zm-3.11.94l2.72,8.36c-.66.22-1.32.45-1.96.69l-3.15-8.2c.79-.3,1.59-.58,2.4-.85Zm-3.06,1.11l3.15,8.2c-.65.25-1.29.52-1.92.8l-3.57-8.03c.77-.34,1.56-.66,2.35-.97Zm-3,1.27l3.57,8.03c-.63.29-1.26.59-1.88.9l-3.99-7.83c.76-.38,1.52-.75,2.29-1.1Zm-2.93,1.42l3.99,7.83c-.62.32-1.23.65-1.83,1l-4.39-7.61c.73-.42,1.48-.83,2.23-1.22Zm-2.85,1.57l4.39,7.61c-.6.35-1.19.72-1.77,1.09l-4.78-7.37c.71-.46,1.43-.9,2.16-1.33Zm-2.76,1.72l4.78,7.37c-.58.38-1.15.78-1.71,1.19l-5.16-7.11c.69-.49,1.38-.98,2.09-1.45Zm-2.67,1.86l5.16,7.11c-.56.41-1.1.84-1.65,1.27l-5.53-6.83c.66-.53,1.33-1.05,2.01-1.55Zm-2.57,1.99l5.53,6.83c-.54.44-1.06.9-1.58,1.36l-5.88-6.53c.63-.56,1.27-1.12,1.93-1.66Zm-2.46,2.13l5.88,6.53c-.51.47-1.01.95-1.51,1.44l-6.21-6.21c.6-.6,1.21-1.18,1.84-1.75Zm3.87,8.47c-.49.49-.97.99-1.44,1.51l-6.53-5.88c.57-.63,1.16-1.24,1.75-1.84l6.21,6.21Z"/>
      <polygon className={styles.cls11} points="111.09 156.24 117.37 160.65 112.76 160.54 111.09 156.24"/>
      <polygon className={styles.cls11} points="225.1 329.34 228.43 336.25 224.46 333.91 225.1 329.34"/>
      <path className={styles.cls7} d="m113.22,159.56s10.4-16.95,32.37-22.88"/>
      <path className={styles.cls7} d="m226.66,332.93s16.26-7.95,24.35-14.51"/>
    </g>
    <rect className={styles.cls20} x="300.8" y="103.95" width="12.14" height="12.05"/>
    {this.getDevices()}
  </g>
    );
  }
}