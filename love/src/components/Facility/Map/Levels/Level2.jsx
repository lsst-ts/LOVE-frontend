import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './Level2.module.css';
import Device from '../Device.jsx';

export default class Level2 extends Component {

  static propTypes = {
  };

  static defaultProps = {
  };

  getDevices(){
    return(

<React.Fragment>

    <Device
      title={'Fancoil 02'}
      temp={18.21+'ºC'}
      
      width={108}
      height={114}
      posX={620}
      posY={145}

      alarm={1}
      collapsible={1}

      states={{
        'command':'1',
        'working':null,
        'unit':null,
        'switch':null,
      }}

      parameters={{
        'aperturaValvulaFrio':{
          'type':'single',
          'name':'Opening Valve Cold',
          'unit':'%',
          'value':85,
        },
        'temperaturaSala':{
          'type':'single',
          'name':'Temperature Room',
          'unit':'ºC',
          'value':18.21,
        },
        'setpointDay':{
          'type':'group',
          'name':'Setpoint Day',
          'unit':null,
          'value':null,
          'params':{
            'setpointCoolingDay':{
              'type':'noBox',
              'alarm':null,
              'name':'Cooling',
              'state':null,
              'unit':'ºC',
              'value':23.04,
            },
            'setpointHeatingDay':{
              'type':'noBox',
              'alarm':null,
              'name':'Heating',
              'state':null,
              'unit':'ºC',
              'value':23.04,
            }
          }
        },
        'setpointNight':{
          'type':'group',
          'name':'Setpoint Night',
          'unit':null,
          'value':null,
          'params':{
            'setpointCoolingNight':{
              'type':'noBox',
              'alarm':null,
              'name':'Cooling',
              'state':null,
              'unit':'ºC',
              'value':23.04,
            },
            'setpointHeatingNight':{
              'type':'noBox',
              'alarm':null,
              'name':'Heating',
              'state':null,
              'unit':'ºC',
              'value':23.04,
            }
          }
        },
        'state':{
          'type':'group',
          'name':'States',
          'unit':null,
          'value':null,
          'params':{
            'estadoCalefactor':{
              'type':'box',
              'alarm':null,
              'name':null,
              'state':null,
              'unit':'',
              'value':'Heater',
            },
            'estadoOperacion':{
              'type':'box',
              'alarm':null,
              'name':null,
              'state':null,
              'unit':'',
              'value':'Operation',
            },
            'estadoVentilador':{
              'type':'box',
              'alarm':null,
              'name':null,
              'state':null,
              'unit':'',
              'value':'Fan',
            },
          }
        }
      }}
    />

    <Device
      title={'Fancoil 01'}
      temp={18.21+'ºC'}
      
      width={108}
      height={114}
      posX={620}
      posY={91}

      alarm={1}
      collapsible={1}

      states={{
        'command':'1',
        'working':null,
        'unit':null,
        'switch':null,
      }}

      parameters={{
        'aperturaValvulaFrio':{
          'type':'single',
          'name':'Opening Valve Cold',
          'unit':'%',
          'value':85,
        },
        'temperaturaSala':{
          'type':'single',
          'name':'Temperature Room',
          'unit':'ºC',
          'value':18.21,
        },
        'setpointDay':{
          'type':'group',
          'name':'Setpoint Day',
          'unit':null,
          'value':null,
          'params':{
            'setpointCoolingDay':{
              'type':'noBox',
              'alarm':null,
              'name':'Cooling',
              'state':null,
              'unit':'ºC',
              'value':23.04,
            },
            'setpointHeatingDay':{
              'type':'noBox',
              'alarm':null,
              'name':'Heating',
              'state':null,
              'unit':'ºC',
              'value':23.04,
            }
          }
        },
        'setpointNight':{
          'type':'group',
          'name':'Setpoint Night',
          'unit':null,
          'value':null,
          'params':{
            'setpointCoolingNight':{
              'type':'noBox',
              'alarm':null,
              'name':'Cooling',
              'state':null,
              'unit':'ºC',
              'value':23.04,
            },
            'setpointHeatingNight':{
              'type':'noBox',
              'alarm':null,
              'name':'Heating',
              'state':null,
              'unit':'ºC',
              'value':23.04,
            }
          }
        },
        'state':{
          'type':'group',
          'name':'States',
          'unit':null,
          'value':null,
          'params':{
            'estadoCalefactor':{
              'type':'box',
              'alarm':null,
              'name':null,
              'state':null,
              'unit':'',
              'value':'Heater',
            },
            'estadoOperacion':{
              'type':'box',
              'alarm':null,
              'name':null,
              'state':null,
              'unit':'',
              'value':'Operation',
            },
            'estadoVentilador':{
              'type':'box',
              'alarm':null,
              'name':null,
              'state':null,
              'unit':'',
              'value':'Fan',
            },
          }
        }
      }}
    />

    <Device
      title={'Crack 02'}
      
      width={108}
      height={122}
      posX={612}
      posY={45}

      alarm={1}
      collapsible={1}

      states={{
        'command':'2',
        'working':'2',
        'unit':'1',
        'switch':null,
      }}

      parameters={{
        'aperturaValvula':{
          'type':'single',
          'name':'State of unit',
          'unit':null,
          'value':'ENABLED',
        },
        'modoOperacionUnidad':{
          'type':'single',
          'name':'Mode of Operation',
          'unit':null,
          'value':'Manual',
        },
        'aperturaValvula':{
          'type':'single',
          'name':'Opening Valve',
          'unit':'%',
          'value':42,
        },
        'humedadSala':{
          'type':'single',
          'name':'Room Humidity',
          'unit':'%',
          'value':0.21,
        },
        'horometro':{
          'type':'single',
          'name':'HOROMETRO',
          'unit':'h',
          'value':32,
        },
        'numeroCircuitos':{
          'type':'single',
          'name':'Number Circuits',
          'unit':null,
          'value':18,
        },
        'requerimientoHumidificador':{
          'type':'single',
          'name':'Requirement Humidifier',
          'unit':'%',
          'value':18,
        },
        'numeroCircuitos':{
          'type':'single',
          'name':'Setpoint Active',
          'unit':'ºC',
          'value':18,
        },
        'setpoint':{
          'type':'group',
          'name':'Setpoint',
          'unit':null,
          'value':null,
          'params':{
            'setpointCooling':{
              'type':'noBox',
              'alarm':null,
              'name':'Cooling',
              'state':null,
              'unit':'ºC',
              'value':23.04,
            },
            'setpointDeshumidificador':{
              'type':'noBox',
              'alarm':null,
              'name':'Dehumidifier',
              'state':null,
              'unit':'%',
              'value':23.04,
            },
            'setpointHeating':{
              'type':'noBox',
              'alarm':null,
              'name':'Heating',
              'state':null,
              'unit':'ºC',
              'value':23.04,
            },
            'setpointHumidificador':{
              'type':'noBox',
              'alarm':null,
              'name':'Humidifier',
              'state':null,
              'unit':'%',
              'value':23.04,
            },
            'setpointDeshumidificador':{
              'type':'noBox',
              'alarm':null,
              'name':'Dehumidifier',
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
            'temperaturaInyeccion':{
              'type':'badge',
              'alarm':null,
              'name':'Cooling',
              'state':null,
              'unit':'ºC Injection',
              'value':23.04,
            },
            'temperaturaRetorno':{
              'type':'badge',
              'alarm':null,
              'name':'02',
              'state':null,
              'unit':'% Return',
              'value':23.04,
            }
          }
        }
      }}
    />

    <Device
      title={'Crack 01'}

      width={108}
      height={122}
      posX={612}
      posY={12}

      alarm={1}
      collapsible={1}

      states={{
        'command':'2',
        'working':'2',
        'unit':'1',
        'switch':null,
      }}

      parameters={{
        'aperturaValvula':{
          'type':'single',
          'name':'State of unit',
          'unit':null,
          'value':'ENABLED',
        },
        'modoOperacionUnidad':{
          'type':'single',
          'name':'Mode of Operation',
          'unit':null,
          'value':'Manual',
        },
        'aperturaValvula':{
          'type':'single',
          'name':'Opening Valve',
          'unit':'%',
          'value':42,
        },
        'humedadSala':{
          'type':'single',
          'name':'Room Humidity',
          'unit':'%',
          'value':0.21,
        },
        'horometro':{
          'type':'single',
          'name':'HOROMETRO',
          'unit':'h',
          'value':32,
        },
        'numeroCircuitos':{
          'type':'single',
          'name':'Number Circuits',
          'unit':null,
          'value':18,
        },
        'requerimientoHumidificador':{
          'type':'single',
          'name':'Requirement Humidifier',
          'unit':'%',
          'value':18,
        },
        'numeroCircuitos':{
          'type':'single',
          'name':'Setpoint Active',
          'unit':'ºC',
          'value':18,
        },
        'setpoint':{
          'type':'group',
          'name':'Setpoint',
          'unit':null,
          'value':null,
          'params':{
            'setpointCooling':{
              'type':'noBox',
              'alarm':null,
              'name':'Cooling',
              'state':null,
              'unit':'ºC',
              'value':23.04,
            },
            'setpointDeshumidificador':{
              'type':'noBox',
              'alarm':null,
              'name':'Dehumidifier',
              'state':null,
              'unit':'%',
              'value':23.04,
            },
            'setpointHeating':{
              'type':'noBox',
              'alarm':null,
              'name':'Heating',
              'state':null,
              'unit':'ºC',
              'value':23.04,
            },
            'setpointHumidificador':{
              'type':'noBox',
              'alarm':null,
              'name':'Humidifier',
              'state':null,
              'unit':'%',
              'value':23.04,
            },
            'setpointDeshumidificador':{
              'type':'noBox',
              'alarm':null,
              'name':'Dehumidifier',
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
            'temperaturaInyeccion':{
              'type':'badge',
              'alarm':null,
              'name':'Cooling',
              'state':null,
              'unit':'ºC Injection',
              'value':23.04,
            },
            'temperaturaRetorno':{
              'type':'badge',
              'alarm':null,
              'name':'02',
              'state':null,
              'unit':'% Return',
              'value':23.04,
            }
          }
        }
      }}
    />

    <Device
      title={'Fancoil 05'}
      temp={18.21+'ºC'}
      
      width={108}
      height={122}
      posX={788}
      posY={160}

      alarm={1}
      collapsible={1}

      states={{
        'command':'1',
        'working':null,
        'unit':null,
        'switch':null,
      }}

      parameters={{
        'aperturaValvulaFrio':{
          'type':'single',
          'name':'Opening Valve Cold',
          'unit':'%',
          'value':85,
        },
        'temperaturaSala':{
          'type':'single',
          'name':'Temperature Room',
          'unit':'ºC',
          'value':18.21,
        },
        'setpointDay':{
          'type':'group',
          'name':'Setpoint Day',
          'unit':null,
          'value':null,
          'params':{
            'setpointCoolingDay':{
              'type':'noBox',
              'alarm':null,
              'name':'Cooling',
              'state':null,
              'unit':'ºC',
              'value':23.04,
            },
            'setpointHeatingDay':{
              'type':'noBox',
              'alarm':null,
              'name':'Heating',
              'state':null,
              'unit':'ºC',
              'value':23.04,
            }
          }
        },
        'setpointNight':{
          'type':'group',
          'name':'Setpoint Night',
          'unit':null,
          'value':null,
          'params':{
            'setpointCoolingNight':{
              'type':'noBox',
              'alarm':null,
              'name':'Cooling',
              'state':null,
              'unit':'ºC',
              'value':23.04,
            },
            'setpointHeatingNight':{
              'type':'noBox',
              'alarm':null,
              'name':'Heating',
              'state':null,
              'unit':'ºC',
              'value':23.04,
            }
          }
        },
        'state':{
          'type':'group',
          'name':'States',
          'unit':null,
          'value':null,
          'params':{
            'estadoCalefactor':{
              'type':'box',
              'alarm':null,
              'name':null,
              'state':null,
              'unit':'',
              'value':'Heater',
            },
            'estadoOperacion':{
              'type':'box',
              'alarm':null,
              'name':null,
              'state':null,
              'unit':'',
              'value':'Operation',
            },
            'estadoVentilador':{
              'type':'box',
              'alarm':null,
              'name':null,
              'state':null,
              'unit':'',
              'value':'Fan',
            },
          }
        }
      }}
    />

    <Device
      title={'Fancoil 08'}
      temp={18.21+'ºC'}
      
      width={108}
      height={122}
      posX={788}
      posY={140}

      alarm={1}
      collapsible={1}

      states={{
        'command':'1',
        'working':null,
        'unit':null,
        'switch':null,
      }}

      parameters={{
        'aperturaValvulaFrio':{
          'type':'single',
          'name':'Opening Valve Cold',
          'unit':'%',
          'value':85,
        },
        'temperaturaSala':{
          'type':'single',
          'name':'Temperature Room',
          'unit':'ºC',
          'value':18.21,
        },
        'setpointDay':{
          'type':'group',
          'name':'Setpoint Day',
          'unit':null,
          'value':null,
          'params':{
            'setpointCoolingDay':{
              'type':'noBox',
              'alarm':null,
              'name':'Cooling',
              'state':null,
              'unit':'ºC',
              'value':23.04,
            },
            'setpointHeatingDay':{
              'type':'noBox',
              'alarm':null,
              'name':'Heating',
              'state':null,
              'unit':'ºC',
              'value':23.04,
            }
          }
        },
        'setpointNight':{
          'type':'group',
          'name':'Setpoint Night',
          'unit':null,
          'value':null,
          'params':{
            'setpointCoolingNight':{
              'type':'noBox',
              'alarm':null,
              'name':'Cooling',
              'state':null,
              'unit':'ºC',
              'value':23.04,
            },
            'setpointHeatingNight':{
              'type':'noBox',
              'alarm':null,
              'name':'Heating',
              'state':null,
              'unit':'ºC',
              'value':23.04,
            }
          }
        },
        'state':{
          'type':'group',
          'name':'States',
          'unit':null,
          'value':null,
          'params':{
            'estadoCalefactor':{
              'type':'box',
              'alarm':null,
              'name':null,
              'state':null,
              'unit':'',
              'value':'Heater',
            },
            'estadoOperacion':{
              'type':'box',
              'alarm':null,
              'name':null,
              'state':null,
              'unit':'',
              'value':'Operation',
            },
            'estadoVentilador':{
              'type':'box',
              'alarm':null,
              'name':null,
              'state':null,
              'unit':'',
              'value':'Fan',
            },
          }
        }
      }}
    />

    <Device
      title={'Fancoil 07'}
      temp={18.21+'ºC'}
      
      width={108}
      height={122}
      posX={788}
      posY={110}

      alarm={1}
      collapsible={1}

      states={{
        'command':'1',
        'working':null,
        'unit':null,
        'switch':null,
      }}

      parameters={{
        'aperturaValvulaFrio':{
          'type':'single',
          'name':'Opening Valve Cold',
          'unit':'%',
          'value':85,
        },
        'temperaturaSala':{
          'type':'single',
          'name':'Temperature Room',
          'unit':'ºC',
          'value':18.21,
        },
        'setpointDay':{
          'type':'group',
          'name':'Setpoint Day',
          'unit':null,
          'value':null,
          'params':{
            'setpointCoolingDay':{
              'type':'noBox',
              'alarm':null,
              'name':'Cooling',
              'state':null,
              'unit':'ºC',
              'value':23.04,
            },
            'setpointHeatingDay':{
              'type':'noBox',
              'alarm':null,
              'name':'Heating',
              'state':null,
              'unit':'ºC',
              'value':23.04,
            }
          }
        },
        'setpointNight':{
          'type':'group',
          'name':'Setpoint Night',
          'unit':null,
          'value':null,
          'params':{
            'setpointCoolingNight':{
              'type':'noBox',
              'alarm':null,
              'name':'Cooling',
              'state':null,
              'unit':'ºC',
              'value':23.04,
            },
            'setpointHeatingNight':{
              'type':'noBox',
              'alarm':null,
              'name':'Heating',
              'state':null,
              'unit':'ºC',
              'value':23.04,
            }
          }
        },
        'state':{
          'type':'group',
          'name':'States',
          'unit':null,
          'value':null,
          'params':{
            'estadoCalefactor':{
              'type':'box',
              'alarm':null,
              'name':null,
              'state':null,
              'unit':'',
              'value':'Heater',
            },
            'estadoOperacion':{
              'type':'box',
              'alarm':null,
              'name':null,
              'state':null,
              'unit':'',
              'value':'Operation',
            },
            'estadoVentilador':{
              'type':'box',
              'alarm':null,
              'name':null,
              'state':null,
              'unit':'',
              'value':'Fan',
            },
          }
        }
      }}
    />

    <Device
      title={'Fancoil 03'}
      temp={18.21+'ºC'}
      
      width={108}
      height={122}
      posX={670}
      posY={160}

      alarm={1}
      collapsible={1}

      states={{
        'command':'1',
        'working':null,
        'unit':null,
        'switch':null,
      }}

      parameters={{
        'aperturaValvulaFrio':{
          'type':'single',
          'name':'Opening Valve Cold',
          'unit':'%',
          'value':85,
        },
        'temperaturaSala':{
          'type':'single',
          'name':'Temperature Room',
          'unit':'ºC',
          'value':18.21,
        },
        'setpointDay':{
          'type':'group',
          'name':'Setpoint Day',
          'unit':null,
          'value':null,
          'params':{
            'setpointCoolingDay':{
              'type':'noBox',
              'alarm':null,
              'name':'Cooling',
              'state':null,
              'unit':'ºC',
              'value':23.04,
            },
            'setpointHeatingDay':{
              'type':'noBox',
              'alarm':null,
              'name':'Heating',
              'state':null,
              'unit':'ºC',
              'value':23.04,
            }
          }
        },
        'setpointNight':{
          'type':'group',
          'name':'Setpoint Night',
          'unit':null,
          'value':null,
          'params':{
            'setpointCoolingNight':{
              'type':'noBox',
              'alarm':null,
              'name':'Cooling',
              'state':null,
              'unit':'ºC',
              'value':23.04,
            },
            'setpointHeatingNight':{
              'type':'noBox',
              'alarm':null,
              'name':'Heating',
              'state':null,
              'unit':'ºC',
              'value':23.04,
            }
          }
        },
        'state':{
          'type':'group',
          'name':'States',
          'unit':null,
          'value':null,
          'params':{
            'estadoCalefactor':{
              'type':'box',
              'alarm':null,
              'name':null,
              'state':null,
              'unit':'',
              'value':'Heater',
            },
            'estadoOperacion':{
              'type':'box',
              'alarm':null,
              'name':null,
              'state':null,
              'unit':'',
              'value':'Operation',
            },
            'estadoVentilador':{
              'type':'box',
              'alarm':null,
              'name':null,
              'state':null,
              'unit':'',
              'value':'Fan',
            },
          }
        }
      }}
    />

    <Device
      title={'Fancoil 04'}
      temp={18.21+'ºC'}
      
      width={108}
      height={122}
      posX={724}
      posY={160}

      alarm={1}
      collapsible={1}

      states={{
        'command':'1',
        'working':null,
        'unit':null,
        'switch':null,
      }}

      parameters={{
        'aperturaValvulaFrio':{
          'type':'single',
          'name':'Opening Valve Cold',
          'unit':'%',
          'value':85,
        },
        'temperaturaSala':{
          'type':'single',
          'name':'Temperature Room',
          'unit':'ºC',
          'value':18.21,
        },
        'setpointDay':{
          'type':'group',
          'name':'Setpoint Day',
          'unit':null,
          'value':null,
          'params':{
            'setpointCoolingDay':{
              'type':'noBox',
              'alarm':null,
              'name':'Cooling',
              'state':null,
              'unit':'ºC',
              'value':23.04,
            },
            'setpointHeatingDay':{
              'type':'noBox',
              'alarm':null,
              'name':'Heating',
              'state':null,
              'unit':'ºC',
              'value':23.04,
            }
          }
        },
        'setpointNight':{
          'type':'group',
          'name':'Setpoint Night',
          'unit':null,
          'value':null,
          'params':{
            'setpointCoolingNight':{
              'type':'noBox',
              'alarm':null,
              'name':'Cooling',
              'state':null,
              'unit':'ºC',
              'value':23.04,
            },
            'setpointHeatingNight':{
              'type':'noBox',
              'alarm':null,
              'name':'Heating',
              'state':null,
              'unit':'ºC',
              'value':23.04,
            }
          }
        },
        'state':{
          'type':'group',
          'name':'States',
          'unit':null,
          'value':null,
          'params':{
            'estadoCalefactor':{
              'type':'box',
              'alarm':null,
              'name':null,
              'state':null,
              'unit':'',
              'value':'Heater',
            },
            'estadoOperacion':{
              'type':'box',
              'alarm':null,
              'name':null,
              'state':null,
              'unit':'',
              'value':'Operation',
            },
            'estadoVentilador':{
              'type':'box',
              'alarm':null,
              'name':null,
              'state':null,
              'unit':'',
              'value':'Fan',
            },
          }
        }
      }}
    />

    <Device
      title={'Fancoil 10'}
      temp={18.21+'ºC'}
      
      width={108}
      height={122}
      posX={680}
      posY={66}

      alarm={1}
      collapsible={1}

      states={{
        'command':'1',
        'working':null,
        'unit':null,
        'switch':null,
      }}

      parameters={{
        'aperturaValvulaFrio':{
          'type':'single',
          'name':'Opening Valve Cold',
          'unit':'%',
          'value':85,
        },
        'temperaturaSala':{
          'type':'single',
          'name':'Temperature Room',
          'unit':'ºC',
          'value':18.21,
        },
        'setpointDay':{
          'type':'group',
          'name':'Setpoint Day',
          'unit':null,
          'value':null,
          'params':{
            'setpointCoolingDay':{
              'type':'noBox',
              'alarm':null,
              'name':'Cooling',
              'state':null,
              'unit':'ºC',
              'value':23.04,
            },
            'setpointHeatingDay':{
              'type':'noBox',
              'alarm':null,
              'name':'Heating',
              'state':null,
              'unit':'ºC',
              'value':23.04,
            }
          }
        },
        'setpointNight':{
          'type':'group',
          'name':'Setpoint Night',
          'unit':null,
          'value':null,
          'params':{
            'setpointCoolingNight':{
              'type':'noBox',
              'alarm':null,
              'name':'Cooling',
              'state':null,
              'unit':'ºC',
              'value':23.04,
            },
            'setpointHeatingNight':{
              'type':'noBox',
              'alarm':null,
              'name':'Heating',
              'state':null,
              'unit':'ºC',
              'value':23.04,
            }
          }
        },
        'state':{
          'type':'group',
          'name':'States',
          'unit':null,
          'value':null,
          'params':{
            'estadoCalefactor':{
              'type':'box',
              'alarm':null,
              'name':null,
              'state':null,
              'unit':'',
              'value':'Heater',
            },
            'estadoOperacion':{
              'type':'box',
              'alarm':null,
              'name':null,
              'state':null,
              'unit':'',
              'value':'Operation',
            },
            'estadoVentilador':{
              'type':'box',
              'alarm':null,
              'name':null,
              'state':null,
              'unit':'',
              'value':'Fan',
            },
          }
        }
      }}
    />

    <Device
      title={'Fancoil 11'}
      temp={18.21+'ºC'}
      
      width={108}
      height={122}
      posX={730}
      posY={66}

      alarm={1}
      collapsible={1}

      states={{
        'command':'1',
        'working':null,
        'unit':null,
        'switch':null,
      }}

      parameters={{
        'aperturaValvulaFrio':{
          'type':'single',
          'name':'Opening Valve Cold',
          'unit':'%',
          'value':85,
        },
        'temperaturaSala':{
          'type':'single',
          'name':'Temperature Room',
          'unit':'ºC',
          'value':18.21,
        },
        'setpointDay':{
          'type':'group',
          'name':'Setpoint Day',
          'unit':null,
          'value':null,
          'params':{
            'setpointCoolingDay':{
              'type':'noBox',
              'alarm':null,
              'name':'Cooling',
              'state':null,
              'unit':'ºC',
              'value':23.04,
            },
            'setpointHeatingDay':{
              'type':'noBox',
              'alarm':null,
              'name':'Heating',
              'state':null,
              'unit':'ºC',
              'value':23.04,
            }
          }
        },
        'setpointNight':{
          'type':'group',
          'name':'Setpoint Night',
          'unit':null,
          'value':null,
          'params':{
            'setpointCoolingNight':{
              'type':'noBox',
              'alarm':null,
              'name':'Cooling',
              'state':null,
              'unit':'ºC',
              'value':23.04,
            },
            'setpointHeatingNight':{
              'type':'noBox',
              'alarm':null,
              'name':'Heating',
              'state':null,
              'unit':'ºC',
              'value':23.04,
            }
          }
        },
        'state':{
          'type':'group',
          'name':'States',
          'unit':null,
          'value':null,
          'params':{
            'estadoCalefactor':{
              'type':'box',
              'alarm':null,
              'name':null,
              'state':null,
              'unit':'',
              'value':'Heater',
            },
            'estadoOperacion':{
              'type':'box',
              'alarm':null,
              'name':null,
              'state':null,
              'unit':'',
              'value':'Operation',
            },
            'estadoVentilador':{
              'type':'box',
              'alarm':null,
              'name':null,
              'state':null,
              'unit':'',
              'value':'Fan',
            },
          }
        }
      }}
    />

    <Device
      title={'Fancoil 06'}
      temp={18.21+'ºC'}
      
      width={108}
      height={122}
      posX={788}
      posY={76}

      alarm={1}
      collapsible={1}

      states={{
        'command':'1',
        'working':null,
        'unit':null,
        'switch':null,
      }}

      parameters={{
        'aperturaValvulaFrio':{
          'type':'single',
          'name':'Opening Valve Cold',
          'unit':'%',
          'value':85,
        },
        'temperaturaSala':{
          'type':'single',
          'name':'Temperature Room',
          'unit':'ºC',
          'value':18.21,
        },
        'setpointDay':{
          'type':'group',
          'name':'Setpoint Day',
          'unit':null,
          'value':null,
          'params':{
            'setpointCoolingDay':{
              'type':'noBox',
              'alarm':null,
              'name':'Cooling',
              'state':null,
              'unit':'ºC',
              'value':23.04,
            },
            'setpointHeatingDay':{
              'type':'noBox',
              'alarm':null,
              'name':'Heating',
              'state':null,
              'unit':'ºC',
              'value':23.04,
            }
          }
        },
        'setpointNight':{
          'type':'group',
          'name':'Setpoint Night',
          'unit':null,
          'value':null,
          'params':{
            'setpointCoolingNight':{
              'type':'noBox',
              'alarm':null,
              'name':'Cooling',
              'state':null,
              'unit':'ºC',
              'value':23.04,
            },
            'setpointHeatingNight':{
              'type':'noBox',
              'alarm':null,
              'name':'Heating',
              'state':null,
              'unit':'ºC',
              'value':23.04,
            }
          }
        },
        'state':{
          'type':'group',
          'name':'States',
          'unit':null,
          'value':null,
          'params':{
            'estadoCalefactor':{
              'type':'box',
              'alarm':null,
              'name':null,
              'state':null,
              'unit':'',
              'value':'Heater',
            },
            'estadoOperacion':{
              'type':'box',
              'alarm':null,
              'name':null,
              'state':null,
              'unit':'',
              'value':'Operation',
            },
            'estadoVentilador':{
              'type':'box',
              'alarm':null,
              'name':null,
              'state':null,
              'unit':'',
              'value':'Fan',
            },
          }
        }
      }}
    />

    <Device
      title={'Fancoil 09'}
      temp={18.21+'ºC'}
      
      width={108}
      height={122}
      posX={788}
      posY={40}

      alarm={1}
      collapsible={1}

      states={{
        'command':'1',
        'working':null,
        'unit':null,
        'switch':null,
      }}

      parameters={{
        'aperturaValvulaFrio':{
          'type':'single',
          'name':'Opening Valve Cold',
          'unit':'%',
          'value':85,
        },
        'temperaturaSala':{
          'type':'single',
          'name':'Temperature Room',
          'unit':'ºC',
          'value':18.21,
        },
        'setpointDay':{
          'type':'group',
          'name':'Setpoint Day',
          'unit':null,
          'value':null,
          'params':{
            'setpointCoolingDay':{
              'type':'noBox',
              'alarm':null,
              'name':'Cooling',
              'state':null,
              'unit':'ºC',
              'value':23.04,
            },
            'setpointHeatingDay':{
              'type':'noBox',
              'alarm':null,
              'name':'Heating',
              'state':null,
              'unit':'ºC',
              'value':23.04,
            }
          }
        },
        'setpointNight':{
          'type':'group',
          'name':'Setpoint Night',
          'unit':null,
          'value':null,
          'params':{
            'setpointCoolingNight':{
              'type':'noBox',
              'alarm':null,
              'name':'Cooling',
              'state':null,
              'unit':'ºC',
              'value':23.04,
            },
            'setpointHeatingNight':{
              'type':'noBox',
              'alarm':null,
              'name':'Heating',
              'state':null,
              'unit':'ºC',
              'value':23.04,
            }
          }
        },
        'state':{
          'type':'group',
          'name':'States',
          'unit':null,
          'value':null,
          'params':{
            'estadoCalefactor':{
              'type':'box',
              'alarm':null,
              'name':null,
              'state':null,
              'unit':'',
              'value':'Heater',
            },
            'estadoOperacion':{
              'type':'box',
              'alarm':null,
              'name':null,
              'state':null,
              'unit':'',
              'value':'Operation',
            },
            'estadoVentilador':{
              'type':'box',
              'alarm':null,
              'name':null,
              'state':null,
              'unit':'',
              'value':'Fan',
            },
          }
        }
      }}
    />

</React.Fragment>
    );
  }

  render() {

    return (

  <g id="Level2">
    <g id="Building">
      <polygon id="Floor" className={styles.cls4} points="633.77 38.75 633.77 266.56 648.56 266.56 648.56 279.21 628.66 279.21 628.66 328.33 707.22 328.33 707.22 282.56 693.82 282.56 693.82 266.56 707.22 266.56 717.82 266.56 867.14 266.56 867.14 38.75 633.77 38.75"/>
      <g id="Ourside_Deck" data-name="Ourside Deck">
        <g>
          <line className={styles.cls5} x1="565.92" y1="325.77" x2="565.92" y2="313.76"/>
          <line className={styles.cls5} x1="568.92" y1="325.77" x2="568.92" y2="313.76"/>
          <line className={styles.cls5} x1="571.93" y1="325.77" x2="571.93" y2="313.76"/>
          <line className={styles.cls5} x1="574.93" y1="325.77" x2="574.93" y2="313.76"/>
          <line className={styles.cls5} x1="577.93" y1="325.77" x2="577.93" y2="313.76"/>
          <line className={styles.cls5} x1="580.93" y1="325.77" x2="580.93" y2="313.76"/>
          <line className={styles.cls5} x1="583.93" y1="325.77" x2="583.93" y2="313.76"/>
          <line className={styles.cls5} x1="586.93" y1="325.77" x2="586.93" y2="313.76"/>
          <line className={styles.cls5} x1="589.93" y1="325.77" x2="589.93" y2="313.76"/>
          <line className={styles.cls5} x1="592.93" y1="325.77" x2="592.93" y2="313.76"/>
          <line className={styles.cls5} x1="595.93" y1="325.77" x2="595.93" y2="313.76"/>
          <line className={styles.cls5} x1="598.94" y1="325.77" x2="598.94" y2="313.76"/>
          <line className={styles.cls5} x1="601.94" y1="325.77" x2="601.94" y2="313.76"/>
          <line className={styles.cls5} x1="604.94" y1="325.77" x2="604.94" y2="313.76"/>
          <line className={styles.cls5} x1="607.94" y1="325.77" x2="607.94" y2="313.76"/>
          <line className={styles.cls5} x1="610.94" y1="325.77" x2="610.94" y2="313.76"/>
          <line className={styles.cls5} x1="613.94" y1="325.77" x2="613.94" y2="313.76"/>
          <line className={styles.cls5} x1="616.94" y1="325.77" x2="616.94" y2="313.76"/>
          <line className={styles.cls5} x1="619.94" y1="325.77" x2="619.94" y2="313.76"/>
          <line className={styles.cls5} x1="622.94" y1="325.77" x2="622.94" y2="313.76"/>
          <line className={styles.cls5} x1="625.95" y1="325.77" x2="625.95" y2="313.76"/>
          <line className={styles.cls5} x1="628.95" y1="325.77" x2="628.95" y2="313.76"/>
          <line className={styles.cls5} x1="562.92" y1="325.77" x2="562.92" y2="313.76"/>
          <line className={styles.cls5} x1="628.97" y1="325.77" x2="560.92" y2="325.77"/>
          <line className={styles.cls5} x1="628.97" y1="313.76" x2="560.92" y2="313.76"/>
          <polygon className={styles.cls12} points="564.9 315.93 564.9 323.6 562.34 319.77 564.9 315.93"/>
          <line className={styles.cls6} x1="564.97" y1="319.77" x2="627.16" y2="319.77"/>
        </g>
        <g>
          <polyline className={styles.cls5} points="623.32 325.99 623.32 332.63 712.72 332.63 712.72 283.95"/>
          <polyline className={styles.cls5} points="624.32 326.13 624.32 331.63 711.72 331.63 711.72 283.95"/>
          <line className={styles.cls5} x1="623.32" y1="282.84" x2="623.32" y2="313.85"/>
          <line className={styles.cls5} x1="624.32" y1="282.84" x2="624.32" y2="313.85"/>
          <g>
            <rect className={styles.cls5} x="629.32" y="285.42" width="77.06" height="42.21"/>
            <g>
              <line className={styles.cls11} x1="630.05" y1="285.76" x2="630.05" y2="327.46"/>
              <line className={styles.cls11} x1="631.52" y1="285.76" x2="631.52" y2="327.46"/>
              <line className={styles.cls11} x1="633.71" y1="285.76" x2="633.71" y2="327.46"/>
              <line className={styles.cls11} x1="635.91" y1="285.76" x2="635.91" y2="327.46"/>
              <line className={styles.cls11} x1="638.11" y1="285.76" x2="638.11" y2="327.46"/>
              <line className={styles.cls11} x1="655.69" y1="285.76" x2="655.69" y2="327.46"/>
              <line className={styles.cls11} x1="673.27" y1="285.76" x2="673.27" y2="327.46"/>
              <line className={styles.cls11} x1="690.85" y1="285.76" x2="690.85" y2="327.46"/>
              <line className={styles.cls11} x1="653.49" y1="285.76" x2="653.49" y2="327.46"/>
              <line className={styles.cls11} x1="671.07" y1="285.76" x2="671.07" y2="327.46"/>
              <line className={styles.cls11} x1="688.65" y1="285.76" x2="688.65" y2="327.46"/>
              <line className={styles.cls11} x1="651.29" y1="285.76" x2="651.29" y2="327.46"/>
              <line className={styles.cls11} x1="668.87" y1="285.76" x2="668.87" y2="327.46"/>
              <line className={styles.cls11} x1="686.45" y1="285.76" x2="686.45" y2="327.46"/>
              <line className={styles.cls11} x1="704.03" y1="285.76" x2="704.03" y2="327.46"/>
              <line className={styles.cls11} x1="649.1" y1="285.76" x2="649.1" y2="327.46"/>
              <line className={styles.cls11} x1="666.67" y1="285.76" x2="666.67" y2="327.46"/>
              <line className={styles.cls11} x1="684.25" y1="285.76" x2="684.25" y2="327.46"/>
              <line className={styles.cls11} x1="701.83" y1="285.76" x2="701.83" y2="327.46"/>
              <line className={styles.cls11} x1="646.9" y1="285.76" x2="646.9" y2="327.46"/>
              <line className={styles.cls11} x1="664.48" y1="285.76" x2="664.48" y2="327.46"/>
              <line className={styles.cls11} x1="682.06" y1="285.76" x2="682.06" y2="327.46"/>
              <line className={styles.cls11} x1="699.63" y1="285.76" x2="699.63" y2="327.46"/>
              <line className={styles.cls11} x1="644.7" y1="285.76" x2="644.7" y2="327.46"/>
              <line className={styles.cls11} x1="662.28" y1="285.76" x2="662.28" y2="327.46"/>
              <line className={styles.cls11} x1="679.86" y1="285.76" x2="679.86" y2="327.46"/>
              <line className={styles.cls11} x1="697.44" y1="285.76" x2="697.44" y2="327.46"/>
              <line className={styles.cls11} x1="642.5" y1="285.76" x2="642.5" y2="327.46"/>
              <line className={styles.cls11} x1="660.08" y1="285.76" x2="660.08" y2="327.46"/>
              <line className={styles.cls11} x1="677.66" y1="285.76" x2="677.66" y2="327.46"/>
              <line className={styles.cls11} x1="695.24" y1="285.76" x2="695.24" y2="327.46"/>
              <line className={styles.cls11} x1="640.31" y1="285.76" x2="640.31" y2="327.46"/>
              <line className={styles.cls11} x1="657.88" y1="285.76" x2="657.88" y2="327.46"/>
              <line className={styles.cls11} x1="675.46" y1="285.76" x2="675.46" y2="327.46"/>
              <line className={styles.cls11} x1="693.04" y1="285.76" x2="693.04" y2="327.46"/>
              <line className={styles.cls11} x1="632.25" y1="285.76" x2="632.25" y2="327.46"/>
              <line className={styles.cls11} x1="634.45" y1="285.76" x2="634.45" y2="327.46"/>
              <line className={styles.cls11} x1="636.64" y1="285.76" x2="636.64" y2="327.46"/>
              <line className={styles.cls11} x1="638.84" y1="285.76" x2="638.84" y2="327.46"/>
              <line className={styles.cls11} x1="656.42" y1="285.76" x2="656.42" y2="327.46"/>
              <line className={styles.cls11} x1="674" y1="285.76" x2="674" y2="327.46"/>
              <line className={styles.cls11} x1="691.58" y1="285.76" x2="691.58" y2="327.46"/>
              <line className={styles.cls11} x1="654.22" y1="285.76" x2="654.22" y2="327.46"/>
              <line className={styles.cls11} x1="671.8" y1="285.76" x2="671.8" y2="327.46"/>
              <line className={styles.cls11} x1="689.38" y1="285.76" x2="689.38" y2="327.46"/>
              <line className={styles.cls11} x1="652.03" y1="285.76" x2="652.03" y2="327.46"/>
              <line className={styles.cls11} x1="669.6" y1="285.76" x2="669.6" y2="327.46"/>
              <line className={styles.cls11} x1="687.18" y1="285.76" x2="687.18" y2="327.46"/>
              <line className={styles.cls11} x1="704.76" y1="285.76" x2="704.76" y2="327.46"/>
              <line className={styles.cls11} x1="649.83" y1="285.76" x2="649.83" y2="327.46"/>
              <line className={styles.cls11} x1="667.41" y1="285.76" x2="667.41" y2="327.46"/>
              <line className={styles.cls11} x1="684.99" y1="285.76" x2="684.99" y2="327.46"/>
              <line className={styles.cls11} x1="702.56" y1="285.76" x2="702.56" y2="327.46"/>
              <line className={styles.cls11} x1="647.63" y1="285.76" x2="647.63" y2="327.46"/>
              <line className={styles.cls11} x1="665.21" y1="285.76" x2="665.21" y2="327.46"/>
              <line className={styles.cls11} x1="682.79" y1="285.76" x2="682.79" y2="327.46"/>
              <line className={styles.cls11} x1="700.37" y1="285.76" x2="700.37" y2="327.46"/>
              <line className={styles.cls11} x1="645.43" y1="285.76" x2="645.43" y2="327.46"/>
              <line className={styles.cls11} x1="663.01" y1="285.76" x2="663.01" y2="327.46"/>
              <line className={styles.cls11} x1="680.59" y1="285.76" x2="680.59" y2="327.46"/>
              <line className={styles.cls11} x1="698.17" y1="285.76" x2="698.17" y2="327.46"/>
              <line className={styles.cls11} x1="643.24" y1="285.76" x2="643.24" y2="327.46"/>
              <line className={styles.cls11} x1="660.81" y1="285.76" x2="660.81" y2="327.46"/>
              <line className={styles.cls11} x1="678.39" y1="285.76" x2="678.39" y2="327.46"/>
              <line className={styles.cls11} x1="695.97" y1="285.76" x2="695.97" y2="327.46"/>
              <line className={styles.cls11} x1="641.04" y1="285.76" x2="641.04" y2="327.46"/>
              <line className={styles.cls11} x1="658.62" y1="285.76" x2="658.62" y2="327.46"/>
              <line className={styles.cls11} x1="676.2" y1="285.76" x2="676.2" y2="327.46"/>
              <line className={styles.cls11} x1="693.77" y1="285.76" x2="693.77" y2="327.46"/>
              <line className={styles.cls11} x1="630.78" y1="285.76" x2="630.78" y2="327.46"/>
              <line className={styles.cls11} x1="632.98" y1="285.76" x2="632.98" y2="327.46"/>
              <line className={styles.cls11} x1="635.18" y1="285.76" x2="635.18" y2="327.46"/>
              <line className={styles.cls11} x1="637.38" y1="285.76" x2="637.38" y2="327.46"/>
              <line className={styles.cls11} x1="654.95" y1="285.76" x2="654.95" y2="327.46"/>
              <line className={styles.cls11} x1="672.53" y1="285.76" x2="672.53" y2="327.46"/>
              <line className={styles.cls11} x1="690.11" y1="285.76" x2="690.11" y2="327.46"/>
              <line className={styles.cls11} x1="652.76" y1="285.76" x2="652.76" y2="327.46"/>
              <line className={styles.cls11} x1="670.34" y1="285.76" x2="670.34" y2="327.46"/>
              <line className={styles.cls11} x1="687.92" y1="285.76" x2="687.92" y2="327.46"/>
              <line className={styles.cls11} x1="705.49" y1="285.76" x2="705.49" y2="327.46"/>
              <line className={styles.cls11} x1="650.56" y1="285.76" x2="650.56" y2="327.46"/>
              <line className={styles.cls11} x1="668.14" y1="285.76" x2="668.14" y2="327.46"/>
              <line className={styles.cls11} x1="685.72" y1="285.76" x2="685.72" y2="327.46"/>
              <line className={styles.cls11} x1="703.3" y1="285.76" x2="703.3" y2="327.46"/>
              <line className={styles.cls11} x1="648.36" y1="285.76" x2="648.36" y2="327.46"/>
              <line className={styles.cls11} x1="665.94" y1="285.76" x2="665.94" y2="327.46"/>
              <line className={styles.cls11} x1="683.52" y1="285.76" x2="683.52" y2="327.46"/>
              <line className={styles.cls11} x1="701.1" y1="285.76" x2="701.1" y2="327.46"/>
              <line className={styles.cls11} x1="646.17" y1="285.76" x2="646.17" y2="327.46"/>
              <line className={styles.cls11} x1="663.74" y1="285.76" x2="663.74" y2="327.46"/>
              <line className={styles.cls11} x1="681.32" y1="285.76" x2="681.32" y2="327.46"/>
              <line className={styles.cls11} x1="698.9" y1="285.76" x2="698.9" y2="327.46"/>
              <line className={styles.cls11} x1="643.97" y1="285.76" x2="643.97" y2="327.46"/>
              <line className={styles.cls11} x1="661.55" y1="285.76" x2="661.55" y2="327.46"/>
              <line className={styles.cls11} x1="679.13" y1="285.76" x2="679.13" y2="327.46"/>
              <line className={styles.cls11} x1="696.7" y1="285.76" x2="696.7" y2="327.46"/>
              <line className={styles.cls11} x1="641.77" y1="285.76" x2="641.77" y2="327.46"/>
              <line className={styles.cls11} x1="659.35" y1="285.76" x2="659.35" y2="327.46"/>
              <line className={styles.cls11} x1="676.93" y1="285.76" x2="676.93" y2="327.46"/>
              <line className={styles.cls11} x1="694.51" y1="285.76" x2="694.51" y2="327.46"/>
              <line className={styles.cls11} x1="639.57" y1="285.76" x2="639.57" y2="327.46"/>
              <line className={styles.cls11} x1="657.15" y1="285.76" x2="657.15" y2="327.46"/>
              <line className={styles.cls11} x1="674.73" y1="285.76" x2="674.73" y2="327.46"/>
              <line className={styles.cls11} x1="692.31" y1="285.76" x2="692.31" y2="327.46"/>
            </g>
          </g>
        </g>
      </g>
      <g id="SolidWall">
        <rect className={styles.cls13} x="692.09" y="98.58" width="8.16" height="8.37"/>
        <rect className={styles.cls13} x="692.09" y="178.49" width="8.16" height="8.16"/>
        <rect className={styles.cls13} x="741.95" y="178.49" width="8.16" height="8.16"/>
        <rect className={styles.cls13} x="811.72" y="178.49" width="8.16" height="8.16"/>
        <rect className={styles.cls13} x="858.98" y="98.58" width="8.16" height="8.37"/>
        <rect className={styles.cls13} x="858.98" y="178.49" width="8.16" height="8.16"/>
        <rect className={styles.cls13} x="741.95" y="98.58" width="8.16" height="8.37"/>
        <rect className={styles.cls6} x="669.73" y="336.63" width="39.93" height="87.85"/>
        <rect className={styles.cls6} x="667.65" y="333.21" width="44.08" height="93.26"/>
        <g>
          <circle className={styles.cls6} cx="689.69" cy="358.42" r="11.16"/>
          <circle className={styles.cls6} cx="689.69" cy="402.69" r="11.16"/>
        </g>
        <rect className={styles.cls13} x="767.91" y="101.36" width="33.77" height="2.53"/>
        <g>
          <polygon className={styles.cls13} points="867.14 38.75 867.14 44.35 864.19 44.35 864.19 41.23 818.24 41.23 818.24 46.75 816.75 46.75 816.75 103.89 810.8 103.89 810.8 101.54 814.66 101.54 814.66 78.79 767.91 78.79 767.91 76.37 814.66 76.37 814.66 46.75 813.17 46.75 813.17 41.23 767.91 41.23 767.91 38.75 867.14 38.75"/>
          <rect className={styles.cls13} x="743.45" y="38.75" width="5.02" height="8.05"/>
        </g>
        <polygon className={styles.cls13} points="633.77 38.75 633.77 264 602.49 264 602.49 266.56 648.56 266.56 648.56 258.23 643.59 258.23 643.59 264 636.75 264 636.75 242.45 642.33 242.45 642.33 233.95 636.75 233.95 636.75 227.86 642.33 227.86 642.33 219.18 636.75 219.18 636.75 165.87 642.33 165.87 642.33 157.08 636.75 157.08 636.75 151.08 642.33 151.08 642.33 142.64 636.75 142.64 636.75 41.37 643.82 41.37 643.82 46.79 648.61 46.79 648.61 41.37 693.68 41.37 693.68 46.79 698.52 46.79 698.52 38.75 633.77 38.75"/>
        <polygon className={styles.cls13} points="693.45 266.56 693.45 258.23 698.52 258.23 698.52 264 743.44 264 743.44 258.27 748.78 258.27 748.78 264 813.07 264 813.07 258.27 818.41 258.27 818.41 264 864.19 264 864.19 260.9 867.14 260.9 867.14 266.56 693.45 266.56"/>
        <rect className={styles.cls13} x="727.14" y="245.42" width="5.54" height="72.93" transform="translate(448.03 1011.8) rotate(-90)"/>
        <rect className={styles.cls13} x="622.68" y="258.77" width="5.54" height="46.23" transform="translate(343.56 907.33) rotate(-90)"/>
      </g>
      <g id="Wall">
        <line className={styles.cls7} x1="813.26" y1="46.56" x2="813.26" y2="76.51"/>
        <polygon className={styles.cls7} points="767.91 54.32 800.25 54.32 800.25 63.25 767.91 63.25 767.91 64.43 801.4 64.43 801.4 53.02 767.91 53.02 767.91 54.32"/>
        <rect className={styles.cls7} x="767.91" y="77.26" width="1.12" height="5.39"/>
        <rect className={styles.cls7} x="767.91" y="94.57" width="1.12" height="8.26"/>
        <rect className={styles.cls7} x="795.92" y="78.47" width="1.81" height="23.67"/>
        <polygon className={styles.cls7} points="746.7 44.09 746.7 82.69 744.26 82.69 744.26 84.09 746.7 84.09 748.1 84.09 748.1 82.69 748.1 44.09 746.7 44.09"/>
        <polygon className={styles.cls7} points="698.42 82.69 695.99 82.69 695.99 44.09 694.59 44.09 694.59 82.69 694.59 84.09 694.59 99.09 695.99 99.09 695.99 84.09 698.42 84.09 698.42 82.69"/>
        <polygon className={styles.cls7} points="724.16 82.69 724.16 41.07 721.16 41.07 721.16 82.69 708.54 82.69 708.54 84.09 721.16 84.09 724.16 84.09 734.54 84.09 734.54 82.69 724.16 82.69"/>
        <rect className={styles.cls7} x="643.74" y="120.21" width="1.4" height="16.61" transform="translate(515.93 772.96) rotate(-90)"/>
        <polygon className={styles.cls7} points="698.76 106.96 702.68 106.96 702.68 127.81 676.67 127.81 676.67 129.21 702.68 129.21 704.08 129.21 704.08 127.81 704.08 106.96 704.08 105.09 728.68 105.09 730.08 105.09 742.07 105.09 742.07 103.69 730.08 103.69 730.08 96.33 728.68 96.33 728.68 103.69 698.76 103.69 698.76 106.96"/>
        <polygon className={styles.cls7} points="704.08 146.28 694.47 146.28 693.07 146.28 693.07 147.68 693.07 179.05 694.47 179.05 694.47 147.68 704.08 147.68 704.08 146.28"/>
        <rect className={styles.cls7} x="663.31" y="151.11" width="1.4" height="57.32" transform="translate(484.24 843.78) rotate(-90)"/>
        <polygon className={styles.cls7} points="704.08 203.81 695.54 203.81 694.14 203.81 694.14 205.21 694.14 260.79 695.54 260.79 695.54 205.21 704.08 205.21 704.08 203.81"/>
        <rect className={styles.cls7} x="697.88" y="180.26" width="1.4" height="11" transform="translate(512.81 884.34) rotate(-90)"/>
        <rect className={styles.cls7} x="839.63" y="91.63" width="1.4" height="51.63" transform="translate(722.89 957.77) rotate(-90)"/>
        <rect className={styles.cls7} x="839.63" y="120.47" width="1.4" height="51.63" transform="translate(694.05 986.61) rotate(-90)"/>
        <rect className={styles.cls7} x="839.63" y="149.49" width="1.4" height="51.63" transform="translate(665.03 1015.64) rotate(-90)"/>
        <rect className={styles.cls7} x="839.63" y="178.7" width="1.4" height="51.63" transform="translate(635.82 1044.84) rotate(-90)"/>
        <rect className={styles.cls7} x="675.44" y="244.49" width="1.4" height="21.77"/>
        <rect className={styles.cls7} x="646.95" y="264.85" width="1.4" height="14.81"/>
        <rect className={styles.cls7} x="693.83" y="265.44" width="1.4" height="14.22"/>
        <polygon className={styles.cls7} points="865.35 44.28 865.35 42.48 870.62 42.48 870.62 38.75 633.68 38.75 633.68 36.29 872.42 36.29 872.42 44.28 865.35 44.28"/>
        <polygon className={styles.cls7} points="870.62 260.56 870.62 266.75 695.23 266.75 695.23 268.55 872.42 268.55 872.42 267.63 872.42 266.75 872.42 260.56 870.62 260.56"/>
        <rect className={styles.cls7} x="748" y="94.54" width="1.4" height="7.37"/>
        <rect className={styles.cls7} x="647.99" y="263.82" width="1.4" height="3.47" transform="translate(383.13 914.24) rotate(-90)"/>
      </g>
      <g id="Doors">
        <path className={styles.cls15} d="m801.1,113.05c-.2,0-.35-.16-.35-.35v-9.63c0-.2.16-.35.35-.35h.1c.2,0,.35.16.35.35v9.26c4.9-.3,8.72-4.33,8.72-9.26,0-.2.16-.35.35-.35s.35.16.35.35c0,5.37-4.21,9.76-9.57,9.99-.04,0-.08,0-.12-.02-.03,0-.06.02-.09.02h-.1.01Z"/>
        <path className={styles.cls15} d="m744.11,73.99c.2,0,.35.16.35.35v9.63c0,.2-.16.35-.35.35h-.1c-.2,0-.35-.16-.35-.35v-9.26c-4.9.3-8.72,4.33-8.72,9.26,0,.2-.16.35-.35.35s-.35-.16-.35-.35c0-5.37,4.21-9.76,9.57-9.99.04,0,.08,0,.12.02.03,0,.06-.02.09-.02h.1-.01Z"/>
        <path className={styles.cls15} d="m698.76,73.99c-.2,0-.35.16-.35.35v9.63c0,.2.16.35.35.35h.1c.2,0,.35-.16.35-.35v-9.26c4.9.3,8.72,4.33,8.72,9.26,0,.2.16.35.35.35s.35-.16.35-.35c0-5.37-4.21-9.76-9.57-9.99-.04,0-.08,0-.12.02-.03,0-.06-.02-.09-.02h-.1.01Z"/>
        <path className={styles.cls15} d="m825.06,115.83c0,.2-.16.35-.35.35h-9.63c-.2,0-.35-.16-.35-.35v-.1c0-.2.16-.35.35-.35h9.26c-.3-4.9-4.33-8.72-9.26-8.72-.2,0-.35-.16-.35-.35s.16-.35.35-.35c5.37,0,9.76,4.21,9.99,9.57,0,.04,0,.08-.02.12,0,.03.02.06.02.09v.1h-.01Z"/>
        <path className={styles.cls15} d="m825.06,143.92c0,.2-.16.35-.35.35h-9.63c-.2,0-.35-.16-.35-.35v-.1c0-.2.16-.35.35-.35h9.26c-.3-4.9-4.33-8.72-9.26-8.72-.2,0-.35-.16-.35-.35s.16-.35.35-.35c5.37,0,9.76,4.21,9.99,9.57,0,.04,0,.08-.02.12,0,.03.02.06.02.09v.1h-.01Z"/>
        <path className={styles.cls15} d="m825.06,201.41c0,.2-.16.35-.35.35h-9.63c-.2,0-.35-.16-.35-.35v-.1c0-.2.16-.35.35-.35h9.26c-.3-4.9-4.33-8.72-9.26-8.72-.2,0-.35-.16-.35-.35s.16-.35.35-.35c5.37,0,9.76,4.21,9.99,9.57,0,.04,0,.08-.02.12,0,.03.02.06.02.09v.1h-.01Z"/>
        <path className={styles.cls15} d="m825.06,148.53c0-.2-.16-.35-.35-.35h-9.63c-.2,0-.35.16-.35.35v.1c0,.2.16.35.35.35h9.26c-.3,4.9-4.33,8.72-9.26,8.72-.2,0-.35.16-.35.35s.16.35.35.35c5.37,0,9.76-4.21,9.99-9.57,0-.04,0-.08-.02-.12,0-.03.02-.06.02-.09v-.1h-.01Z"/>
        <path className={styles.cls15} d="m801.03,214.91c.2,0,.35-.16.35-.35v-9.63c0-.2-.16-.35-.35-.35h-.1c-.2,0-.35.16-.35.35v9.26c-4.9-.3-8.72-4.33-8.72-9.26,0-.2-.16-.35-.35-.35s-.35.16-.35.35c0,5.37,4.21,9.76,9.57,9.99.04,0,.08,0,.12-.02.03,0,.06.02.09.02h.1-.01Z"/>
        <path className={styles.cls15} d="m715.12,214.91c-.2,0-.35-.16-.35-.35v-9.63c0-.2.16-.35.35-.35h.1c.2,0,.35.16.35.35v9.26c4.9-.3,8.72-4.33,8.72-9.26,0-.2.16-.35.35-.35s.35.16.35.35c0,5.37-4.21,9.76-9.57,9.99-.04,0-.08,0-.12-.02-.03,0-.06.02-.09.02h-.1.01Z"/>
        <path className={styles.cls15} d="m653.26,138.54c-.2,0-.35-.16-.35-.35v-9.63c0-.2.16-.35.35-.35h.1c.2,0,.35.16.35.35v9.26c4.9-.3,8.72-4.33,8.72-9.26,0-.2.16-.35.35-.35s.35.16.35.35c0,5.37-4.21,9.76-9.57,9.99-.04,0-.08,0-.12-.02-.03,0-.06.02-.09.02h-.1.01Z"/>
        <path className={styles.cls8} d="m693.76,137.74h0c4.29-.01,7.77,3.45,7.79,7.74h0s-7.76.03-7.76.03"/>
        <path className={styles.cls8} d="m693.76,137.74h0c4.29.01,7.77-3.45,7.79-7.74h0s-7.76-.03-7.76-.03"/>
        <g>
          <path className={styles.cls8} d="m703.68,195.05h0c-4.43.01-8.04-3.57-8.06-8h0s8.03-.03,8.03-.03"/>
          <path className={styles.cls8} d="m703.68,195.05h0c-4.43-.01-8.04,3.57-8.06,8h0s8.03.03,8.03.03"/>
        </g>
        <g>
          <path className={styles.cls8} d="m759,101.46h0c.01,4.48-3.61,8.13-8.09,8.14h0s-.03-8.11-.03-8.11"/>
          <path className={styles.cls8} d="m759,101.46h0c-.01,4.48,3.61,8.13,8.09,8.14h0s.03-8.11.03-8.11"/>
        </g>
        <g>
          <path className={styles.cls8} d="m685.56,252.7h0c-.01-4.42,3.56-8.01,7.98-8.03h0s.03,8,.03,8"/>
          <path className={styles.cls8} d="m685.56,252.7h0c.01-4.42-3.56-8.01-7.98-8.03h0s-.03,8-.03,8"/>
        </g>
        <g>
          <path className={styles.cls8} d="m685.56,266.81h0c.01,4.42-3.56,8.01-7.98,8.03h0s-.03-8-.03-8"/>
          <path className={styles.cls8} d="m685.56,266.81h0c-.01,4.42,3.56,8.01,7.98,8.03h0s.03-8,.03-8"/>
        </g>
      </g>
      <g id="Stairs">
        <polygon className={styles.cls20} points="768.82 64.47 768.82 76.4 812.8 76.4 812.8 42.23 770.52 42.23 770.52 52.93 801.49 52.93 801.49 64.47 768.82 64.47"/>
        <line className={styles.cls20} x1="771.82" y1="64.47" x2="771.82" y2="76.4"/>
        <line className={styles.cls20} x1="795.86" y1="64.47" x2="795.86" y2="76.4"/>
        <line className={styles.cls20} x1="774.83" y1="64.47" x2="774.83" y2="76.4"/>
        <line className={styles.cls20} x1="777.83" y1="64.47" x2="777.83" y2="76.4"/>
        <line className={styles.cls20} x1="786.85" y1="64.47" x2="786.85" y2="76.4"/>
        <line className={styles.cls20} x1="780.84" y1="64.47" x2="780.84" y2="76.4"/>
        <line className={styles.cls20} x1="783.84" y1="64.47" x2="783.84" y2="76.4"/>
        <line className={styles.cls20} x1="789.85" y1="64.47" x2="789.85" y2="76.4"/>
        <line className={styles.cls20} x1="792.85" y1="64.47" x2="792.85" y2="76.4"/>
        <line className={styles.cls20} x1="798.86" y1="64.47" x2="798.86" y2="76.4"/>
        <line className={styles.cls20} x1="801.87" y1="64.47" x2="801.87" y2="76.4"/>
        <line className={styles.cls20} x1="773.52" y1="42.23" x2="773.52" y2="52.93"/>
        <line className={styles.cls20} x1="797.56" y1="42.23" x2="797.56" y2="52.93"/>
        <line className={styles.cls20} x1="776.53" y1="42.23" x2="776.53" y2="52.93"/>
        <line className={styles.cls20} x1="779.53" y1="42.23" x2="779.53" y2="52.93"/>
        <line className={styles.cls20} x1="788.54" y1="42.23" x2="788.54" y2="52.93"/>
        <line className={styles.cls20} x1="782.53" y1="42.23" x2="782.53" y2="52.93"/>
        <line className={styles.cls20} x1="785.54" y1="42.23" x2="785.54" y2="52.93"/>
        <line className={styles.cls20} x1="791.55" y1="42.23" x2="791.55" y2="52.93"/>
        <line className={styles.cls20} x1="794.55" y1="42.23" x2="794.55" y2="52.93"/>
        <line className={styles.cls20} x1="800.56" y1="42.23" x2="800.56" y2="52.93"/>
        <line className={styles.cls20} x1="812.98" y1="64.84" x2="801.49" y2="64.84"/>
        <line className={styles.cls20} x1="812.98" y1="61.86" x2="801.49" y2="61.86"/>
        <line className={styles.cls20} x1="812.98" y1="58.89" x2="801.49" y2="58.89"/>
        <line className={styles.cls20} x1="812.98" y1="55.91" x2="801.49" y2="55.91"/>
        <line className={styles.cls20} x1="801.49" y1="52.93" x2="812.98" y2="52.93"/>
        <polygon className={styles.cls12} points="772.47 43.75 772.47 51.42 769.91 47.58 772.47 43.75"/>
        <polyline className={styles.cls6} points="767.56 70.43 807.24 70.43 807.24 47.58 772.53 47.58"/>
      </g>
      <g id="Glass">
        <g>
          <line className={styles.cls7} x1="704.15" y1="204.79" x2="714.29" y2="204.79"/>
          <line className={styles.cls7} x1="714.29" y1="204.29" x2="714.29" y2="205.29"/>
        </g>
        <g id="Glass-2" data-name="Glass">
          <line className={styles.cls7} x1="725.4" y1="204.79" x2="790.98" y2="204.79"/>
          <line className={styles.cls7} x1="790.98" y1="204.29" x2="790.98" y2="205.29"/>
          <line className={styles.cls7} x1="725.4" y1="204.29" x2="725.4" y2="205.29"/>
        </g>
        <g>
          <line className={styles.cls7} x1="814.52" y1="204.79" x2="801.68" y2="204.79"/>
          <line className={styles.cls7} x1="801.68" y1="205.29" x2="801.68" y2="204.29"/>
        </g>
        <g>
          <line className={styles.cls7} x1="814.49" y1="178.61" x2="814.49" y2="158.58"/>
          <line className={styles.cls7} x1="813.99" y1="158.58" x2="814.99" y2="158.58"/>
        </g>
        <g>
          <line className={styles.cls7} x1="814.49" y1="118.19" x2="814.49" y2="134.23"/>
          <line className={styles.cls7} x1="814.99" y1="134.23" x2="813.99" y2="134.23"/>
        </g>
        <g>
          <line className={styles.cls7} x1="814.49" y1="145.44" x2="814.49" y2="144.14"/>
          <line className={styles.cls7} x1="813.99" y1="144.14" x2="814.99" y2="144.14"/>
        </g>
        <g>
          <line className={styles.cls7} x1="814.49" y1="146.7" x2="814.49" y2="148"/>
          <line className={styles.cls7} x1="814.99" y1="148" x2="813.99" y2="148"/>
        </g>
        <g>
          <line className={styles.cls7} x1="814.49" y1="183.54" x2="814.49" y2="191.41"/>
          <line className={styles.cls7} x1="814.99" y1="191.41" x2="813.99" y2="191.41"/>
        </g>
        <g>
          <line className={styles.cls7} x1="814.49" y1="103.68" x2="814.49" y2="106.17"/>
          <line className={styles.cls7} x1="814.99" y1="106.17" x2="813.99" y2="106.17"/>
        </g>
        <g>
          <line className={styles.cls7} x1="814.49" y1="204.79" x2="814.49" y2="202"/>
          <line className={styles.cls7} x1="813.99" y1="202" x2="814.99" y2="202"/>
        </g>
        <g>
          <line className={styles.cls7} x1="814.49" y1="117.3" x2="814.49" y2="116"/>
          <line className={styles.cls7} x1="813.99" y1="116" x2="814.99" y2="116"/>
        </g>
        <line className={styles.cls7} x1="663.33" y1="128.51" x2="676.67" y2="128.51"/>
      </g>
      <g id="Windows">
        <rect className={styles.cls14} x="731.38" y="3.04" width="2.28" height="73.68" transform="translate(692.64 772.41) rotate(-90)"/>
        <rect className={styles.cls14} x="865.03" y="38.75" width="2.11" height="227.81"/>
        <rect className={styles.cls14} x="662.23" y="253.05" width="1.4" height="25.02" transform="translate(397.38 928.49) rotate(-90)"/>
      </g>
      <g id="Machines">
        <rect id="elev" className={styles.cls10} x="769.73" y="80.72" width="21.7" height="14.86"/>
        <g id="Machines-2" data-name="Machines">
          <rect id="elev-2" data-name="elev" className={styles.cls10} x="649.06" y="54.25" width="10.85" height="59.9"/>
        </g>
        <g id="Machines-3" data-name="Machines">
          <rect id="elev-3" data-name="elev" className={styles.cls10} x="671.81" y="54.25" width="10.85" height="59.9"/>
        </g>
        <g id="Machines-4" data-name="Machines">
          <rect id="elev-4" data-name="elev" className={styles.cls10} x="647.91" y="180.42" width="43.8" height="5.86"/>
        </g>
      </g>
    </g>
    <g id="Dome">
      <line className={styles.cls7} x1="170.53" y1="192.71" x2="150.53" y2="192.71"/>
      <line className={styles.cls7} x1="160.53" y1="202.71" x2="160.53" y2="182.71"/>
      <path className={styles.cls9} d="m621.96,266.24l-328.92.47c-37.56,67.25-119.54,95.7-190.68,66.18C24.94,300.76-11.78,211.96,20.35,134.54,52.48,57.12,141.28,20.4,218.7,52.53l5.44-13.94h407.81"/>
    </g>
    <g id="text">
      <g id="t1">
        <g className={styles.cls33}>
          <text className={styles.cls16} transform="translate(649.42 81.67)"><tspan className={styles.cls3} x="0" y="0">C</tspan><tspan x="4.18" y="0">ompu</tspan><tspan className={styles.cls2} x="22.41" y="0">t</tspan><tspan className={styles.cls24} x="24.73" y="0">er</tspan><tspan x="6.27" y="7.2">Room</tspan></text>
          <text className={styles.cls16} transform="translate(649.42 81.67)"><tspan className={styles.cls3} x="0" y="0">C</tspan><tspan x="4.18" y="0">ompu</tspan><tspan className={styles.cls2} x="22.41" y="0">t</tspan><tspan className={styles.cls24} x="24.73" y="0">er</tspan><tspan x="6.27" y="7.2">Room</tspan></text>
        </g>
        <g className={styles.cls33}>
          <text className={styles.cls16} transform="translate(755.06 234.13)"><tspan className={styles.cls3} x="0" y="0">C</tspan><tspan x="4.18" y="0">ont</tspan><tspan className={styles.cls37} x="14.44" y="0">r</tspan><tspan x="16.76" y="0">ol Room</tspan></text>
          <text className={styles.cls16} transform="translate(755.06 234.13)"><tspan className={styles.cls3} x="0" y="0">C</tspan><tspan x="4.18" y="0">ont</tspan><tspan className={styles.cls37} x="14.44" y="0">r</tspan><tspan x="16.76" y="0">ol Room</tspan></text>
        </g>
        <g className={styles.cls33}>
          <text className={styles.cls16} transform="translate(749.6 144.61)"><tspan x="0" y="0">Open</tspan><tspan x="-10.58" y="7.2">Offi</tspan><tspan className={styles.cls18} x=".61" y="7.2">c</tspan><tspan className={styles.cls24} x="3.94" y="7.2">e S</tspan><tspan className={styles.cls22} x="12.82" y="7.2">p</tspan><tspan className={styles.cls26} x="16.87" y="7.2">a</tspan><tspan className={styles.cls23} x="20.42" y="7.2">c</tspan><tspan x="23.75" y="7.2">e</tspan></text>
          <text className={styles.cls16} transform="translate(749.6 144.61)"><tspan x="0" y="0">Open</tspan><tspan x="-10.58" y="7.2">Offi</tspan><tspan className={styles.cls18} x=".61" y="7.2">c</tspan><tspan className={styles.cls24} x="3.94" y="7.2">e S</tspan><tspan className={styles.cls22} x="12.82" y="7.2">p</tspan><tspan className={styles.cls26} x="16.87" y="7.2">a</tspan><tspan className={styles.cls23} x="20.42" y="7.2">c</tspan><tspan x="23.75" y="7.2">e</tspan></text>
        </g>
        <g className={styles.cls33}>
          <text className={styles.cls16} transform="translate(823.54 77.69)"><tspan className={styles.cls3} x="0" y="0">C</tspan><tspan x="4.18" y="0">on</tspan><tspan className={styles.cls18} x="12" y="0">f</tspan><tspan x="13.98" y="0">e</tspan><tspan className={styles.cls37} x="17.6" y="0">r</tspan><tspan x="19.93" y="0">e</tspan><tspan className={styles.cls26} x="23.56" y="0">n</tspan><tspan className={styles.cls23} x="27.63" y="0">c</tspan><tspan x="30.95" y="0">e</tspan><tspan x="8.18" y="7.2">Room</tspan></text>
          <text className={styles.cls16} transform="translate(823.54 77.69)"><tspan className={styles.cls3} x="0" y="0">C</tspan><tspan x="4.18" y="0">on</tspan><tspan className={styles.cls18} x="12" y="0">f</tspan><tspan x="13.98" y="0">e</tspan><tspan className={styles.cls37} x="17.6" y="0">r</tspan><tspan x="19.93" y="0">e</tspan><tspan className={styles.cls26} x="23.56" y="0">n</tspan><tspan className={styles.cls23} x="27.63" y="0">c</tspan><tspan x="30.95" y="0">e</tspan><tspan x="8.18" y="7.2">Room</tspan></text>
        </g>
        <g className={styles.cls33}>
          <text className={styles.cls16} transform="translate(829.58 133.44)"><tspan x="0" y="0">Offi</tspan><tspan className={styles.cls18} x="11.2" y="0">c</tspan><tspan className={styles.cls24} x="14.52" y="0">e 1</tspan></text>
          <text className={styles.cls16} transform="translate(829.58 133.44)"><tspan x="0" y="0">Offi</tspan><tspan className={styles.cls18} x="11.2" y="0">c</tspan><tspan className={styles.cls24} x="14.52" y="0">e 1</tspan></text>
        </g>
        <g className={styles.cls33}>
          <text className={styles.cls16} transform="translate(828.96 162.18)"><tspan x="0" y="0">Offi</tspan><tspan className={styles.cls18} x="11.2" y="0">c</tspan><tspan className={styles.cls24} x="14.52" y="0">e 2</tspan></text>
          <text className={styles.cls16} transform="translate(828.96 162.18)"><tspan x="0" y="0">Offi</tspan><tspan className={styles.cls18} x="11.2" y="0">c</tspan><tspan className={styles.cls24} x="14.52" y="0">e 2</tspan></text>
        </g>
        <g className={styles.cls33}>
          <text className={styles.cls16} transform="translate(828.97 191.69)"><tspan x="0" y="0">Offi</tspan><tspan className={styles.cls18} x="11.2" y="0">c</tspan><tspan className={styles.cls24} x="14.52" y="0">e 3</tspan></text>
          <text className={styles.cls16} transform="translate(828.97 191.69)"><tspan x="0" y="0">Offi</tspan><tspan className={styles.cls18} x="11.2" y="0">c</tspan><tspan className={styles.cls24} x="14.52" y="0">e 3</tspan></text>
        </g>
        <g className={styles.cls33}>
          <text className={styles.cls16} transform="translate(652.87 157.69)"><tspan className={styles.cls3} x="0" y="0">C</tspan><tspan x="4.18" y="0">ompu</tspan><tspan className={styles.cls2} x="22.41" y="0">t</tspan><tspan className={styles.cls24} x="24.73" y="0">er</tspan><tspan className={styles.cls36} x="9.8" y="7.2">L</tspan><tspan x="13.35" y="7.2">ab</tspan></text>
          <text className={styles.cls16} transform="translate(652.87 157.69)"><tspan className={styles.cls3} x="0" y="0">C</tspan><tspan x="4.18" y="0">ompu</tspan><tspan className={styles.cls2} x="22.41" y="0">t</tspan><tspan className={styles.cls24} x="24.73" y="0">er</tspan><tspan className={styles.cls36} x="9.8" y="7.2">L</tspan><tspan x="13.35" y="7.2">ab</tspan></text>
        </g>
        <g className={styles.cls33}>
          <text className={styles.cls16} transform="translate(654.04 213.18)"><tspan x="0" y="0">B</tspan><tspan className={styles.cls38} x="4.52" y="0">r</tspan><tspan className={styles.cls30} x="6.85" y="0">e</tspan><tspan x="10.39" y="0">ak</tspan><tspan x="-.35" y="7.2">Room</tspan></text>
          <text className={styles.cls16} transform="translate(654.04 213.18)"><tspan x="0" y="0">B</tspan><tspan className={styles.cls38} x="4.52" y="0">r</tspan><tspan className={styles.cls30} x="6.85" y="0">e</tspan><tspan x="10.39" y="0">ak</tspan><tspan x="-.35" y="7.2">Room</tspan></text>
        </g>
        <g className={styles.cls33}>
          <text className={styles.cls16} transform="translate(657.85 296.73)"><tspan x="0" y="0">De</tspan><tspan className={styles.cls32} x="8.58" y="0">c</tspan><tspan x="11.91" y="0">k</tspan></text>
          <text className={styles.cls16} transform="translate(657.85 296.73)"><tspan x="0" y="0">De</tspan><tspan className={styles.cls32} x="8.58" y="0">c</tspan><tspan x="11.91" y="0">k</tspan></text>
        </g>
      </g>
      <g id="t2" className={styles.cls29}>
        <g className={styles.cls33}>
          <text className={styles.cls17} transform="translate(774.92 59.94)"><tspan className={styles.cls21} x="0" y="0">W</tspan><tspan x="4.22" y="0">et Shaft</tspan></text>
          <text className={styles.cls17} transform="translate(774.92 59.94)"><tspan className={styles.cls21} x="0" y="0">W</tspan><tspan x="4.22" y="0">et Shaft</tspan></text>
        </g>
        <g className={styles.cls33}>
          <text className={styles.cls17} transform="translate(802.06 92.28)"><tspan x="0" y="0">D</tspan><tspan className={styles.cls27} x="3.3" y="0">r</tspan><tspan x="4.97" y="0">y</tspan><tspan x="-1.69" y="4.8">Shaft</tspan></text>
          <text className={styles.cls17} transform="translate(802.06 92.28)"><tspan x="0" y="0">D</tspan><tspan className={styles.cls27} x="3.3" y="0">r</tspan><tspan x="4.97" y="0">y</tspan><tspan x="-1.69" y="4.8">Shaft</tspan></text>
        </g>
        <g className={styles.cls33}>
          <text className={styles.cls17} transform="translate(774.48 87.54)"><tspan x="0" y="0">El</tspan><tspan className={styles.cls1} x="3.75" y="0">e</tspan><tspan className={styles.cls19} x="6.13" y="0">v</tspan><tspan className={styles.cls28} x="8.16" y="0">. 1</tspan></text>
          <text className={styles.cls17} transform="translate(774.48 87.54)"><tspan x="0" y="0">El</tspan><tspan className={styles.cls1} x="3.75" y="0">e</tspan><tspan className={styles.cls19} x="6.13" y="0">v</tspan><tspan className={styles.cls28} x="8.16" y="0">. 1</tspan></text>
        </g>
        <g className={styles.cls33}>
          <text className={styles.cls17} transform="translate(733.96 91.3)"><tspan x="0" y="0">Hall</tspan><tspan className={styles.cls35} x="7.76" y="0">w</tspan><tspan className={styles.cls34} x="11.22" y="0">a</tspan><tspan x="13.54" y="0">y</tspan></text>
          <text className={styles.cls17} transform="translate(733.96 91.3)"><tspan x="0" y="0">Hall</tspan><tspan className={styles.cls35} x="7.76" y="0">w</tspan><tspan className={styles.cls34} x="11.22" y="0">a</tspan><tspan x="13.54" y="0">y</tspan></text>
        </g>
        <g className={styles.cls33}>
          <text className={styles.cls17} transform="translate(697.97 60.77)"><tspan x="0" y="0">Bath</tspan><tspan className={styles.cls25} x="9.71" y="0">r</tspan><tspan className={styles.cls31} x="11.26" y="0">oom</tspan></text>
          <text className={styles.cls17} transform="translate(697.97 60.77)"><tspan x="0" y="0">Bath</tspan><tspan className={styles.cls25} x="9.71" y="0">r</tspan><tspan className={styles.cls31} x="11.26" y="0">oom</tspan></text>
        </g>
        <g className={styles.cls33}>
          <text className={styles.cls17} transform="translate(725.18 60.77)"><tspan x="0" y="0">Bath</tspan><tspan className={styles.cls25} x="9.71" y="0">r</tspan><tspan className={styles.cls31} x="11.26" y="0">oom</tspan></text>
          <text className={styles.cls17} transform="translate(725.18 60.77)"><tspan x="0" y="0">Bath</tspan><tspan className={styles.cls25} x="9.71" y="0">r</tspan><tspan className={styles.cls31} x="11.26" y="0">oom</tspan></text>
        </g>
      </g>
    </g>

    {this.props.hideHVAC?'':this.getDevices()}

  </g>
    );
  }
}