import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './Level1.module.css';
import Device from '../Device.jsx';
import * as d3 from 'd3';

export default class Level1 extends Component {

  static propTypes = {

  };

  static defaultProps = {
    params:{},
  };

  getDevices(){

    return(

  <React.Fragment>

    <Device
      title={'Vec 1'}
      id={702}

      width={54}
      height={45}
      posX={823}
      posY={148}

      alarm={1}
      collapsible={0}

      states={{
        'command':'1',
        'working':'1',
        'unit':null,
        'switch':'2',
      }}
    />

    <Device
      title={'Vea 1'}
      id={701}

      width={54}
      height={45}
      posX={690}
      posY={235}

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
      title={'Vin 1'}
      id={703}

      width={54}
      height={45}
      posX={810}
      posY={24}

      alarm={1}
      collapsible={0}

      states={{
        'command':'3',
        'working':'3',
        'unit':null,
        'switch':'3',
      }}
    />

    <Device
      title={'Cold Water Pump'}
      id={1}

      width={70}
      height={0}
      posX={762}
      posY={237}

      alarm={0}
      collapsible={0}

      states={{
        'command':'1',
        'working':'1',
        'unit':null,
        'switch':null,
      }}
    />

    <Device
      title={'General'}
      id={2}
      temp={25.21+'ºC'}

      width={70}
      height={0}
      posX={685}
      posY={210}

      alarm={0}
      collapsible={0}

      states={{
        'command':null,
        'working':null,
        'unit':null,
        'switch':null,
      }}
    />

    <Device
      title={'Valves'}
      id={3}

      width={70}
      height={54}
      posX={762}
      posY={237}

      alarm={0}
      collapsible={1}

      states={{
        'command':null,
        'working':null,
        'unit':null,
        'switch':null,
      }}

      parameters={{
        'estadoValvula03':{
          'type':'status',
          'name':'State Valve 03',
          'unit':null,
          'value':'ENABLED',
        },
        'estadoValvula04':{
          'type':'status',
          'name':'State Valve 04',
          'unit':null,
          'value':'ENABLED',
        },
        'estadoValvula05':{
          'type':'status',
          'name':'State Valve 05',
          'unit':null,
          'value':'ENABLED',
        },
        'estadoValvula06':{
          'type':'status',
          'name':'State Valve 06',
          'unit':null,
          'value':'ENABLED',
        },
        'estadoValvula12':{
          'type':'status',
          'name':'State Valve 12',
          'unit':null,
          'value':'ENABLED',
        },

      }}
    />

    <Device
      width={108}
      height={133}
      posX={800}
      posY={20}

      title={'Chiller 01'}

      alarm={1}
      collapsible={1}

      parameters={{
        'modoOperacion':{
          'type':'single',
          'name':'Mode Operation',
          'unit':null,
          'value':'Auto',
        },
        'potenciaTrabajo':{
          'type':'single',
          'name':'Power Work',
          'unit':'%',
          'value':32,
        },
        'potenciaDisponibleChiller':{
          'type':'single',
          'name':'Power Available',
          'unit':'%',
          'value':32,
        },
        'setpointActivo':{
          'type':'single',
          'name':'Setpoint Active',
          'unit':'ºC',
          'value':18,
        },
        'presionBajaCto':{
          'type':'group',
          'name':'Pressure Low CTO',
          'unit':null,
          'value':null,
          'params':{
            'presionBajaCto1':{
              'type':'box',
              'alarm':null,
              'name':'01',
              'state':null,
              'unit':'bar',
              'value':23.04,
            },
            'presionBajaCto2':{
              'type':'box',
              'alarm':null,
              'name':'02',
              'state':null,
              'unit':'bar',
              'value':23.04,
            }
          }
        },
        'WaterEvaporator':{
          'type':'group',
          'name':'Water Evaporator',
          'unit':null,
          'value':null,
          'params':{
            'temperaturaAguaImpulsionEvaporador':{
              'type':'badge',
              'alarm':null,
              'name':'01',
              'state':null,
              'unit':'ºC Impulse',
              'value':16.41,
            },
            'temperaturaAguaRetornoEvaporador':{
              'type':'badge',
              'alarm':null,
              'name':'02',
              'state':null,
              'unit':'ºC Return',
              'value':9.53,
            }
          }
        },
        'Compressors':{
          'type':'group',
          'name':'Compressors',
          'unit':'h mean',
          'value':0.21,
          'params':{
            'compresor01':{
              'type':'box',
              'alarm':0,
              'name':'01',
              'state':'ok',
              'unit':'h',
              'value':2.10,
            },
            'compresor02':{
              'type':'box',
              'alarm':0,
              'name':'02',
              'state':'fault',
              'unit':'h',
              'value':27.32,
            },
            'compresor03':{
              'type':'box',
              'alarm':0,
              'name':'02',
              'state':'danger',
              'unit':'h',
              'value':0.21,
            },
            'compresor04':{
              'type':'box',
              'alarm':0,
              'name':'02',
              'state':'ok',
              'unit':'h',
              'value':1.00,
            }
          }
        },
      }}

      states={{
        'command':'1',
        'working':null,
        'unit':'1',
        'switch':null,
      }}
    />

    <Device
      width={108}
      height={133}
      posX={800}
      posY={86}

      title={'Chiller 02'}

      alarm={1}
      collapsible={1}

      parameters={{
        'modoOperacion':{
          'type':'single',
          'name':'Mode Operation',
          'unit':null,
          'value':'Auto',
        },
        'potenciaTrabajo':{
          'type':'single',
          'name':'Power Work',
          'unit':'%',
          'value':32,
        },
        'potenciaDisponibleChiller':{
          'type':'single',
          'name':'Power Available',
          'unit':'%',
          'value':32,
        },
        'setpointActivo':{
          'type':'single',
          'name':'Setpoint Active',
          'unit':'ºC',
          'value':18,
        },
        'presionBajaCto':{
          'type':'group',
          'name':'Pressure Low CTO',
          'unit':null,
          'value':null,
          'params':{
            'presionBajaCto1':{
              'type':'box',
              'alarm':null,
              'name':'01',
              'state':null,
              'unit':'bar',
              'value':23.04,
            },
            'presionBajaCto2':{
              'type':'box',
              'alarm':null,
              'name':'02',
              'state':null,
              'unit':'bar',
              'value':23.04,
            }
          }
        },
        'WaterEvaporator':{
          'type':'group',
          'name':'Water Evaporator',
          'unit':null,
          'value':null,
          'params':{
            'temperaturaAguaImpulsionEvaporador':{
              'type':'badge',
              'alarm':null,
              'name':'01',
              'state':null,
              'unit':'ºC Impulse',
              'value':16.41,
            },
            'temperaturaAguaRetornoEvaporador':{
              'type':'badge',
              'alarm':null,
              'name':'02',
              'state':null,
              'unit':'ºC Return',
              'value':9.53,
            }
          }
        },
        'Compressors':{
          'type':'group',
          'name':'Compressors',
          'unit':'h mean',
          'value':0.21,
          'params':{
            'compresor01':{
              'type':'box',
              'alarm':0,
              'name':'01',
              'state':'ok',
              'unit':'h',
              'value':2.10,
            },
            'compresor02':{
              'type':'box',
              'alarm':0,
              'name':'02',
              'state':'fault',
              'unit':'h',
              'value':27.32,
            },
            'compresor03':{
              'type':'box',
              'alarm':0,
              'name':'02',
              'state':'danger',
              'unit':'h',
              'value':0.21,
            },
            'compresor04':{
              'type':'box',
              'alarm':0,
              'name':'02',
              'state':'ok',
              'unit':'h',
              'value':1.00,
            }
          }
        },
      }}

      states={{
        'command':'1',
        'working':null,
        'unit':'1',
        'switch':null,
      }}
    />

    <Device
      width={108}
      height={133}
      posX={800}
      posY={162}

      title={'Chiller 03'}

      alarm={1}
      collapsible={1}

      parameters={{
        'modoOperacion':{
          'type':'single',
          'name':'Mode Operation',
          'unit':null,
          'value':'Auto',
        },
        'potenciaTrabajo':{
          'type':'single',
          'name':'Power Work',
          'unit':'%',
          'value':32,
        },
        'potenciaDisponibleChiller':{
          'type':'single',
          'name':'Power Available',
          'unit':'%',
          'value':32,
        },
        'setpointActivo':{
          'type':'single',
          'name':'Setpoint Active',
          'unit':'ºC',
          'value':18,
        },
        'presionBajaCto':{
          'type':'group',
          'name':'Pressure Low CTO',
          'unit':null,
          'value':null,
          'params':{
            'presionBajaCto1':{
              'type':'box',
              'alarm':null,
              'name':'01',
              'state':null,
              'unit':'bar',
              'value':23.04,
            },
            'presionBajaCto2':{
              'type':'box',
              'alarm':null,
              'name':'02',
              'state':null,
              'unit':'bar',
              'value':23.04,
            }
          }
        },
        'WaterEvaporator':{
          'type':'group',
          'name':'Water Evaporator',
          'unit':null,
          'value':null,
          'params':{
            'temperaturaAguaImpulsionEvaporador':{
              'type':'badge',
              'alarm':null,
              'name':'01',
              'state':null,
              'unit':'ºC Impulse',
              'value':16.41,
            },
            'temperaturaAguaRetornoEvaporador':{
              'type':'badge',
              'alarm':null,
              'name':'02',
              'state':null,
              'unit':'ºC Return',
              'value':9.53,
            }
          }
        },
        'Compressors':{
          'type':'group',
          'name':'Compressors',
          'unit':'h mean',
          'value':0.21,
          'params':{
            'compresor01':{
              'type':'box',
              'alarm':0,
              'name':'01',
              'state':'ok',
              'unit':'h',
              'value':2.10,
            },
            'compresor02':{
              'type':'box',
              'alarm':0,
              'name':'02',
              'state':'fault',
              'unit':'h',
              'value':27.32,
            },
            'compresor03':{
              'type':'box',
              'alarm':0,
              'name':'02',
              'state':'danger',
              'unit':'h',
              'value':0.21,
            },
            'compresor04':{
              'type':'box',
              'alarm':0,
              'name':'02',
              'state':'ok',
              'unit':'h',
              'value':1.00,
            }
          }
        },
      }}

      states={{
        'command':'1',
        'working':null,
        'unit':'1',
        'switch':null,
      }}
    />

    </React.Fragment>

    );
  }

  render() {

    return (

  <g id="Level1">
  <rect className={styles.background} width="882.42" height="461.23"/>
    <g id="Building">
      <polygon id="Floor" className={styles.cls2} points="711.73 331.68 711.73 266.56 867.14 266.56 867.14 38.75 755.22 38.75 755.22 12.77 676.94 12.77 676.94 38.75 633.77 38.75 633.77 264 622.84 264 622.84 331.12 711.73 331.68"/>
      <rect id="Hatchs" className={styles.cls8} x="836.17" y="62.89" width="2.96" height="179.32"/>
      <g id="SolidWall">
        <polygon className={styles.cls13} points="643.82 41.37 643.82 46.79 648.61 46.79 648.61 41.37 693.68 41.37 693.68 46.79 698.52 46.79 698.52 38.75 678.8 38.75 678.8 12.84 675.91 12.84 675.91 38.75 633.77 38.75 633.77 264 622.84 264 622.84 333.21 711.73 333.21 711.73 330 626.52 330 626.52 266.56 636.75 266.56 636.75 242.45 642.33 242.45 642.33 233.95 636.75 233.95 636.75 227.86 642.33 227.86 642.33 219.18 636.75 219.18 636.75 165.87 642.33 165.87 642.33 157.08 636.75 157.08 636.75 151.08 642.33 151.08 642.33 142.64 636.75 142.64 636.75 106.95 642.33 106.95 642.33 98.58 636.75 98.58 636.75 41.37 643.82 41.37"/>
        <rect className={styles.cls13} x="692.09" y="98.58" width="8.16" height="8.37"/>
        <rect className={styles.cls13} x="692.09" y="178.49" width="8.16" height="8.16"/>
        <rect className={styles.cls13} x="741.95" y="178.49" width="8.16" height="8.16"/>
        <rect className={styles.cls13} x="811.72" y="178.49" width="8.16" height="8.16"/>
        <rect className={styles.cls13} x="858.98" y="98.58" width="8.16" height="8.37"/>
        <rect className={styles.cls13} x="858.98" y="178.49" width="8.16" height="8.16"/>
        <polygon className={styles.cls13} points="643.59 266.56 643.59 258.23 648.56 258.23 648.56 263.86 693.45 263.86 693.45 258.23 698.52 258.23 698.52 263.86 716.84 263.86 716.84 266.56 711.87 266.56 711.87 280.09 709.45 280.09 709.45 266.56 643.59 266.56"/>
        <rect className={styles.cls13} x="724.8" y="263.86" width="7.3" height="2.7"/>
        <polygon className={styles.cls13} points="813.07 258.27 813.07 263.86 786.3 263.86 786.3 266.56 818.41 266.56 818.41 264.35 818.41 263.86 818.41 258.27 813.07 258.27"/>
        <polygon className={styles.cls13} points="748.78 263.86 748.78 258.27 743.44 258.27 743.44 263.86 741.96 263.86 741.96 266.56 753.59 266.56 753.59 263.86 748.78 263.86"/>
        <polygon className={styles.cls13} points="743.45 46.79 743.45 38.75 818.24 38.75 818.24 46.75 816.75 46.75 816.75 104.56 810.8 104.56 810.8 101.54 814.66 101.54 814.66 78.79 767.91 78.79 767.91 76.37 814.66 76.37 814.66 46.75 813.17 46.75 813.17 42.19 748.47 42.19 748.47 46.79 743.45 46.79"/>
        <polygon className={styles.cls13} points="801.45 101.54 750.12 101.54 750.12 98.58 741.95 98.58 741.95 106.95 750.12 106.95 750.12 104.56 801.45 104.56 801.45 101.54"/>
        <rect className={styles.cls13} x="864.19" y="38.75" width="2.95" height="5.6"/>
        <rect className={styles.cls13} x="864.19" y="260.9" width="2.95" height="5.66"/>
        <rect className={styles.cls4} x="669.73" y="336.63" width="39.93" height="87.85"/>
        <rect className={styles.cls4} x="667.65" y="333.21" width="44.08" height="93.26"/>
        <g>
          <circle className={styles.cls4} cx="689.69" cy="358.42" r="11.16"/>
          <circle className={styles.cls4} cx="689.69" cy="402.69" r="11.16"/>
        </g>
      </g>
      <g id="MoveableWall" className={styles.cls45}>
        <g>
          <polyline className={styles.cls10} points="747.25 259.28 747.25 260.78 744.61 260.78 744.61 259.28"/>
          <line className={styles.cls11} x1="744.61" y1="256.82" x2="744.61" y2="105.28"/>
          <polyline className={styles.cls10} points="744.61 105.28 744.61 103.78 747.25 103.78 747.25 105.28"/>
          <line className={styles.cls11} x1="747.25" y1="107.74" x2="747.25" y2="259.28"/>
        </g>
        <g>
          <polyline className={styles.cls10} points="697.51 259.28 697.51 260.78 694.87 260.78 694.87 259.28"/>
          <line className={styles.cls6} x1="694.87" y1="256.76" x2="694.87" y2="46.24"/>
          <polyline className={styles.cls10} points="694.87 46.24 694.87 44.74 697.51 44.74 697.51 46.24"/>
          <line className={styles.cls6} x1="697.51" y1="48.76" x2="697.51" y2="259.28"/>
        </g>
        <g>
          <polyline className={styles.cls10} points="636.37 183.9 634.87 183.9 634.87 181.25 636.37 181.25"/>
          <line className={styles.cls1} x1="638.89" y1="181.25" x2="860.37" y2="181.25"/>
          <polyline className={styles.cls10} points="860.37 181.25 861.87 181.25 861.87 183.9 860.37 183.9"/>
          <line className={styles.cls1} x1="857.86" y1="183.9" x2="636.37" y2="183.9"/>
        </g>
        <g>
          <polyline className={styles.cls10} points="636.37 104.09 634.87 104.09 634.87 101.45 636.37 101.45"/>
          <line className={styles.cls1} x1="638.89" y1="101.45" x2="860.37" y2="101.45"/>
          <polyline className={styles.cls10} points="860.37 101.45 861.87 101.45 861.87 104.09 860.37 104.09"/>
          <line className={styles.cls1} x1="857.86" y1="104.09" x2="636.37" y2="104.09"/>
        </g>
        <g>
          <polyline className={styles.cls10} points="817.13 259.28 817.13 260.78 814.48 260.78 814.48 259.28"/>
          <line className={styles.cls3} x1="814.48" y1="256.8" x2="814.48" y2="104.06"/>
          <polyline className={styles.cls10} points="814.48 104.06 814.48 102.56 817.13 102.56 817.13 104.06"/>
          <line className={styles.cls3} x1="817.13" y1="106.54" x2="817.13" y2="259.28"/>
        </g>
      </g>
      <g id="Wall">
        <polygon className={styles.cls5} points="867.14 38.75 829.52 38.75 829.52 40.89 865.03 40.89 865.03 264.19 817.91 264.19 817.91 266.56 867.14 266.56 867.14 38.75"/>
        <polygon className={styles.cls5} points="698.19 38.75 718.72 38.75 718.72 36.47 720.1 36.47 720.1 45.37 722.29 45.37 722.29 46.79 718.72 46.79 718.72 40.56 698.19 40.56 698.19 38.75"/>
        <polygon className={styles.cls5} points="718.72 12.77 718.72 14.06 718.72 15.21 718.72 16.82 720.1 16.82 720.1 15.21 754.1 15.21 754.1 38.79 755.35 38.79 755.35 12.77 718.72 12.77"/>
        <line className={styles.cls5} x1="813.26" y1="46.56" x2="813.26" y2="76.51"/>
        <polygon className={styles.cls5} points="801.4 64.43 767.91 64.43 767.91 63.25 800.25 63.25 800.25 54.32 769.06 54.32 769.06 55.33 767.91 55.33 767.91 49.99 769.06 49.99 769.06 53.02 813.26 53.02 813.26 54.32 801.4 54.32 801.4 64.43"/>
        <rect className={styles.cls5} x="767.91" y="77.26" width="1.12" height="5.39"/>
        <rect className={styles.cls5} x="767.91" y="94.57" width="1.12" height="8.26"/>
        <rect className={styles.cls5} x="765.91" y="76.37" width="2" height="2.42" transform="translate(1533.83 155.17) rotate(180)"/>
        <rect className={styles.cls5} x="795.92" y="78.47" width="1.81" height="23.67"/>
      </g>
      <g id="ClosedSection" className={styles.cls45}>
        <path className={styles.cls18} d="m692.47,181.25h-56.19v2.64h56.19v-2.64Z"/>
        <path className={styles.cls18} d="m721.03,101.45h-80.79v2.64h80.79v-2.64Z"/>
        <path className={styles.cls18} d="m694.85,83.93v49.23h2.64v-49.23h-2.64Z"/>
        <path className={styles.cls18} d="m694.85,180.14v-28h2.64v28h-2.64Z"/>
        <path className={styles.cls18} d="m745.1,101.45h-5.02v2.64h5.02v-2.64Z"/>
        <path className={styles.cls18} d="m694.85,65.26v-20.37h2.64v20.37h-2.64Z"/>
      </g>
      <g id="Machines">
        <rect className={styles.cls9} x="844.52" y="190.52" width="12.7" height="55.9"/>
        <rect className={styles.cls9} x="844.52" y="114.71" width="12.7" height="55.9"/>
        <rect className={styles.cls9} x="844.52" y="48.89" width="12.7" height="55.9"/>
        <g>
          <rect className={styles.cls9} x="760.36" y="122.12" width="60.64" height="48.48"/>
          <rect className={styles.cls9} x="760.36" y="146.75" width="4.73" height="23.86"/>
          <rect className={styles.cls9} x="760.36" y="122.12" width="14.88" height="6.69"/>
          <rect className={styles.cls9} x="760.36" y="128.82" width="14.88" height="7.93"/>
          <rect className={styles.cls9} x="760.36" y="136.75" width="14.88" height="6.47"/>
          <rect className={styles.cls9} x="775.24" y="124.92" width="17.93" height="22.37" transform="translate(1568.42 272.2) rotate(180)"/>
          <rect className={styles.cls9} x="765.1" y="152.94" width="34.18" height="17.67" transform="translate(1564.37 323.54) rotate(180)"/>
          <rect className={styles.cls9} x="800.36" y="122.12" width="20.65" height="48.48"/>
        </g>
        <g>
          <rect className={styles.cls9} x="664.59" y="253.75" width="27.56" height="9.49"/>
          <rect className={styles.cls9} x="656.79" y="253.75" width="7.79" height="9.49" transform="translate(1321.38 516.98) rotate(180)"/>
          <rect className={styles.cls9} x="649.3" y="253.75" width="7.49" height="9.49"/>
          <rect className={styles.cls9} x="682.03" y="209.93" width="11.16" height="8.93"/>
          <rect className={styles.cls9} x="670.52" y="209.93" width="11.51" height="8.93"/>
          <rect className={styles.cls9} x="659.08" y="209.93" width="11.44" height="8.93" transform="translate(1329.61 428.79) rotate(180)"/>
          <rect className={styles.cls9} x="647.72" y="209.93" width="11.36" height="8.93"/>
          <rect className={styles.cls9} x="648.36" y="201.16" width="44.84" height="8.77"/>
          <rect className={styles.cls9} x="679.38" y="231.84" width="9.28" height="10.05"/>
          <rect className={styles.cls9} x="658.6" y="231.84" width="18.81" height="10.05" transform="translate(1336.02 473.72) rotate(180)"/>
          <rect className={styles.cls9} x="647.72" y="235.96" width="9.04" height="5.93" transform="translate(1304.49 477.84) rotate(180)"/>
          <rect className={styles.cls9} x="647.72" y="184.05" width="11.86" height="6.35" transform="translate(1307.3 374.45) rotate(180)"/>
          <rect className={styles.cls9} x="661.68" y="184.05" width="5" height="6.93"/>
          <rect className={styles.cls9} x="683.86" y="184.05" width="7.81" height="5.13"/>
        </g>
        <g>
          <rect className={styles.cls9} x="698.08" y="168.56" width="8.72" height="4.67"/>
          <path className={styles.cls9} d="m699.15,173.23h6.56c0,.92-.75,1.66-1.66,1.66h-3.24c-.92,0-1.66-.75-1.66-1.66h0Z"/>
          <rect className={styles.cls9} x="699.15" y="165.2" width="6.74" height="3.36"/>
          <rect className={styles.cls9} x="698.74" y="158.31" width="8.23" height="6.89"/>
          <path className={styles.cls9} d="m701.38,156.22h2.25c1.16,0,2.09.94,2.09,2.09h-6.43c0-1.16.94-2.09,2.09-2.09Z"/>
        </g>
        <rect id="elev" className={styles.cls9} x="769.73" y="80.72" width="21.7" height="14.86"/>
      </g>
      <g id="DOORS">
        <path className={styles.cls19} d="m741.81,277.05c.2,0,.35-.16.35-.35v-9.63c0-.2-.16-.35-.35-.35h-.1c-.2,0-.35.16-.35.35v9.26c-4.9-.3-8.72-4.33-8.72-9.26,0-.2-.16-.35-.35-.35s-.35.16-.35.35c0,5.37,4.21,9.76,9.57,9.99.04,0,.08,0,.12-.02.03,0,.06.02.09.02h.1-.01Z"/>
        <path className={styles.cls19} d="m742.06,36.37h-.2s-.05,0-.08.02c-4.39.25-7.96,3.29-9.06,7.35-1.11-4.11-4.76-7.18-9.22-7.37-.03,0-.05.02-.08.03-.04-.02-.09-.03-.14-.03h-.2c-.2,0-.35.16-.35.35v9.45c0,.2.16.35.35.35h.2c.2,0,.35-.16.35-.35v-9.08c4.91.29,8.73,4.33,8.73,9.26,0,.2.16.35.35.35s.35-.16.35-.35c0-4.83,3.67-8.8,8.42-9.23v9.05c0,.2.16.35.35.35h.2c.2,0,.35-.16.35-.35v-9.45c0-.2-.16-.35-.35-.35h.03Z"/>
        <path className={styles.cls19} d="m708.88,17.12v.2s0,.05.02.08c.25,4.39,3.29,7.96,7.35,9.06-4.11,1.11-7.18,4.76-7.37,9.22,0,.03.02.05.03.08-.02.04-.03.09-.03.14v.2c0,.2.16.35.35.35h9.45c.2,0,.35-.16.35-.35v-.2c0-.2-.16-.35-.35-.35h-9.08c.29-4.91,4.33-8.73,9.26-8.73.2,0,.35-.16.35-.35s-.16-.35-.35-.35c-4.83,0-8.8-3.67-9.23-8.42h9.05c.2,0,.35-.16.35-.35v-.2c0-.2-.16-.35-.35-.35h-9.45c-.2,0-.35.16-.35.35v-.03Z"/>
        <path className={styles.cls19} d="m739.59,92.8h-.2s-.05,0-.08.02c-4.39.25-7.96,3.29-9.06,7.35-1.11-4.11-4.76-7.18-9.22-7.37-.03,0-.05.02-.08.03-.04-.02-.09-.03-.14-.03h-.2c-.2,0-.35.16-.35.35v9.45c0,.2.16.35.35.35h.2c.2,0,.35-.16.35-.35v-9.08c4.91.29,8.73,4.33,8.73,9.26,0,.2.16.35.35.35s.35-.16.35-.35c0-4.83,3.67-8.8,8.42-9.23v9.05c0,.2.16.35.35.35h.2c.2,0,.35-.16.35-.35v-9.45c0-.2-.16-.35-.35-.35h.03Z"/>
        <path className={styles.cls19} d="m705.73,151.94v-.2s0-.05-.02-.08c-.25-4.39-3.29-7.96-7.35-9.06,4.11-1.11,7.18-4.76,7.37-9.22,0-.03-.02-.05-.03-.08.02-.04.03-.09.03-.14v-.2c0-.2-.16-.35-.35-.35h-9.45c-.2,0-.35.16-.35.35v.2c0,.2.16.35.35.35h9.08c-.29,4.91-4.33,8.73-9.26,8.73-.2,0-.35.16-.35.35s.16.35.35.35c4.83,0,8.8,3.67,9.23,8.42h-9.05c-.2,0-.35.16-.35.35v.2c0,.2.16.35.35.35h9.45c.2,0,.35-.16.35-.35v.03Z"/>
        <path className={styles.cls19} d="m705.8,84.04v-.2s0-.05-.02-.08c-.25-4.39-3.29-7.96-7.35-9.06,4.11-1.11,7.18-4.76,7.37-9.22,0-.03-.02-.05-.03-.08.02-.04.03-.09.03-.14v-.2c0-.2-.16-.35-.35-.35h-9.45c-.2,0-.35.16-.35.35v.2c0,.2.16.35.35.35h9.08c-.29,4.91-4.33,8.73-9.26,8.73-.2,0-.35.16-.35.35s.16.35.35.35c4.83,0,8.8,3.67,9.23,8.42h-9.05c-.2,0-.35.16-.35.35v.2c0,.2.16.35.35.35h9.45c.2,0,.35-.16.35-.35v.03Z"/>
        <path className={styles.cls19} d="m801.1,113.05c-.2,0-.35-.16-.35-.35v-9.63c0-.2.16-.35.35-.35h.1c.2,0,.35.16.35.35v9.26c4.9-.3,8.72-4.33,8.72-9.26,0-.2.16-.35.35-.35s.35.16.35.35c0,5.37-4.21,9.76-9.57,9.99-.04,0-.08,0-.12-.02-.03,0-.06.02-.09.02h-.1.01Z"/>
      </g>
      <g id="Stairs">
        <polygon className={styles.cls14} points="768.82 64.47 768.82 76.4 812.8 76.4 812.8 42.23 770.52 42.23 770.52 52.93 801.49 52.93 801.49 64.47 768.82 64.47"/>
        <line className={styles.cls14} x1="771.82" y1="64.47" x2="771.82" y2="76.4"/>
        <line className={styles.cls14} x1="795.86" y1="64.47" x2="795.86" y2="76.4"/>
        <line className={styles.cls14} x1="774.83" y1="64.47" x2="774.83" y2="76.4"/>
        <line className={styles.cls14} x1="777.83" y1="64.47" x2="777.83" y2="76.4"/>
        <line className={styles.cls14} x1="786.85" y1="64.47" x2="786.85" y2="76.4"/>
        <line className={styles.cls14} x1="780.84" y1="64.47" x2="780.84" y2="76.4"/>
        <line className={styles.cls14} x1="783.84" y1="64.47" x2="783.84" y2="76.4"/>
        <line className={styles.cls14} x1="789.85" y1="64.47" x2="789.85" y2="76.4"/>
        <line className={styles.cls14} x1="792.85" y1="64.47" x2="792.85" y2="76.4"/>
        <line className={styles.cls14} x1="798.86" y1="64.47" x2="798.86" y2="76.4"/>
        <line className={styles.cls14} x1="801.87" y1="64.47" x2="801.87" y2="76.4"/>
        <line className={styles.cls14} x1="773.52" y1="42.23" x2="773.52" y2="52.93"/>
        <line className={styles.cls14} x1="797.56" y1="42.23" x2="797.56" y2="52.93"/>
        <line className={styles.cls14} x1="776.53" y1="42.23" x2="776.53" y2="52.93"/>
        <line className={styles.cls14} x1="779.53" y1="42.23" x2="779.53" y2="52.93"/>
        <line className={styles.cls14} x1="788.54" y1="42.23" x2="788.54" y2="52.93"/>
        <line className={styles.cls14} x1="782.53" y1="42.23" x2="782.53" y2="52.93"/>
        <line className={styles.cls14} x1="785.54" y1="42.23" x2="785.54" y2="52.93"/>
        <line className={styles.cls14} x1="791.55" y1="42.23" x2="791.55" y2="52.93"/>
        <line className={styles.cls14} x1="794.55" y1="42.23" x2="794.55" y2="52.93"/>
        <line className={styles.cls14} x1="800.56" y1="42.23" x2="800.56" y2="52.93"/>
        <line className={styles.cls14} x1="812.98" y1="64.84" x2="801.49" y2="64.84"/>
        <line className={styles.cls14} x1="812.98" y1="61.86" x2="801.49" y2="61.86"/>
        <line className={styles.cls14} x1="812.98" y1="58.89" x2="801.49" y2="58.89"/>
        <line className={styles.cls14} x1="812.98" y1="55.91" x2="801.49" y2="55.91"/>
        <line className={styles.cls14} x1="801.49" y1="52.93" x2="812.98" y2="52.93"/>
        <polygon className={styles.cls12} points="772.47 43.75 772.47 51.42 769.91 47.58 772.47 43.75"/>
        <polyline className={styles.cls4} points="767.56 70.43 807.24 70.43 807.24 47.58 772.53 47.58"/>
      </g>
    </g>
    <g id="Dome">
      <line className={styles.cls5} x1="170.53" y1="192.71" x2="150.53" y2="192.71"/>
      <line className={styles.cls5} x1="160.53" y1="202.71" x2="160.53" y2="182.71"/>
      <path className={styles.cls7} d="m621.96,266.24l-328.92.47c-37.56,67.25-119.54,95.7-190.68,66.18C24.94,300.76-11.78,211.96,20.35,134.54,52.48,57.12,141.28,20.4,218.7,52.53l5.44-13.94h407.81"/>
    </g>
    <g id="text">
      <g id="t1">
        <g className={styles.cls47}>
          <text className={styles.cls20} transform="translate(655.89 60.51)"><tspan className={styles.cls42} x="0" y="0">C</tspan><tspan x="4.27" y="0">a</tspan><tspan className={styles.cls36} x="7.81" y="0">m</tspan><tspan className={styles.cls34} x="14.18" y="0">e</tspan><tspan className={styles.cls22} x="17.81" y="0">r</tspan><tspan x="20.16" y="0">a</tspan><tspan x="-7.91" y="7.2">Main</tspan><tspan className={styles.cls48} x="7.04" y="7.2">t</tspan><tspan x="9.36" y="7.2">ena</tspan><tspan className={styles.cls50} x="20.59" y="7.2">n</tspan><tspan className={styles.cls22} x="24.66" y="7.2">c</tspan><tspan x="27.98" y="7.2">e</tspan><tspan x="-8.13" y="14.4">Re</tspan><tspan className={styles.cls27} x="-.16" y="14.4">f</tspan><tspan className={styles.cls42} x="2.35" y="14.4">r</tspan><tspan className={styles.cls32} x="4.71" y="14.4">ige</tspan><tspan className={styles.cls22} x="14.06" y="14.4">r</tspan><tspan x="16.41" y="14.4">ation</tspan><tspan className={styles.cls16} x="-6.33" y="21.6">C</tspan><tspan x="-2.15" y="21.6">omp</tspan><tspan className={styles.cls51} x="12.04" y="21.6">r</tspan><tspan x="14.37" y="21.6">essor</tspan><tspan x="2.74" y="28.8">Room</tspan></text>
          <text className={styles.cls20} transform="translate(655.89 60.51)"><tspan className={styles.cls42} x="0" y="0">C</tspan><tspan x="4.27" y="0">a</tspan><tspan className={styles.cls36} x="7.81" y="0">m</tspan><tspan className={styles.cls34} x="14.18" y="0">e</tspan><tspan className={styles.cls22} x="17.81" y="0">r</tspan><tspan x="20.16" y="0">a</tspan><tspan x="-7.91" y="7.2">Main</tspan><tspan className={styles.cls48} x="7.04" y="7.2">t</tspan><tspan x="9.36" y="7.2">ena</tspan><tspan className={styles.cls50} x="20.59" y="7.2">n</tspan><tspan className={styles.cls22} x="24.66" y="7.2">c</tspan><tspan x="27.98" y="7.2">e</tspan><tspan x="-8.13" y="14.4">Re</tspan><tspan className={styles.cls27} x="-.16" y="14.4">f</tspan><tspan className={styles.cls42} x="2.35" y="14.4">r</tspan><tspan className={styles.cls32} x="4.71" y="14.4">ige</tspan><tspan className={styles.cls22} x="14.06" y="14.4">r</tspan><tspan x="16.41" y="14.4">ation</tspan><tspan className={styles.cls16} x="-6.33" y="21.6">C</tspan><tspan x="-2.15" y="21.6">omp</tspan><tspan className={styles.cls51} x="12.04" y="21.6">r</tspan><tspan x="14.37" y="21.6">essor</tspan><tspan x="2.74" y="28.8">Room</tspan></text>
        </g>
        <g className={styles.cls47}>
          <text className={styles.cls20} transform="translate(751.25 193.67)"><tspan x="0" y="0">Me</tspan><tspan className={styles.cls46} x="9.35" y="0">c</tspan><tspan x="12.68" y="0">hanical</tspan><tspan className={styles.cls46} x=".12" y="7.2">E</tspan><tspan className={styles.cls32} x="4.09" y="7.2">quip</tspan><tspan className={styles.cls36} x="17.87" y="7.2">m</tspan><tspan x="24.25" y="7.2">ent</tspan><tspan x="10.39" y="14.4">A</tspan><tspan className={styles.cls52} x="14.7" y="14.4">r</tspan><tspan className={styles.cls24} x="17.02" y="14.4">e</tspan><tspan x="20.56" y="14.4">a</tspan></text>
          <text className={styles.cls20} transform="translate(751.25 193.67)"><tspan x="0" y="0">Me</tspan><tspan className={styles.cls46} x="9.35" y="0">c</tspan><tspan x="12.68" y="0">hanical</tspan><tspan className={styles.cls46} x=".12" y="7.2">E</tspan><tspan className={styles.cls32} x="4.09" y="7.2">quip</tspan><tspan className={styles.cls36} x="17.87" y="7.2">m</tspan><tspan x="24.25" y="7.2">ent</tspan><tspan x="10.39" y="14.4">A</tspan><tspan className={styles.cls52} x="14.7" y="14.4">r</tspan><tspan className={styles.cls24} x="17.02" y="14.4">e</tspan><tspan x="20.56" y="14.4">a</tspan></text>
        </g>
        <g className={styles.cls47}>
          <text className={styles.cls20} transform="translate(721.67 68.98)"><tspan x="0" y="0">Ent</tspan><tspan className={styles.cls39} x="10.51" y="0">r</tspan><tspan x="13.01" y="0">y</tspan><tspan x="1.28" y="7.2">A</tspan><tspan className={styles.cls52} x="5.58" y="7.2">r</tspan><tspan className={styles.cls24} x="7.91" y="7.2">e</tspan><tspan x="11.44" y="7.2">a</tspan></text>
          <text className={styles.cls20} transform="translate(721.67 68.98)"><tspan x="0" y="0">Ent</tspan><tspan className={styles.cls39} x="10.51" y="0">r</tspan><tspan x="13.01" y="0">y</tspan><tspan x="1.28" y="7.2">A</tspan><tspan className={styles.cls52} x="5.58" y="7.2">r</tspan><tspan className={styles.cls24} x="7.91" y="7.2">e</tspan><tspan x="11.44" y="7.2">a</tspan></text>
        </g>
        <g className={styles.cls47}>
          <text className={styles.cls20} transform="translate(658.91 128.19)"><tspan x="0" y="0">Utili</tspan><tspan className={styles.cls15} x="12.03" y="0">t</tspan><tspan x="14.41" y="0">y</tspan><tspan x="1.03" y="7.2">S</tspan><tspan className={styles.cls50} x="4.72" y="7.2">h</tspan><tspan x="8.8" y="7.2">op</tspan></text>
          <text className={styles.cls20} transform="translate(658.91 128.19)"><tspan x="0" y="0">Utili</tspan><tspan className={styles.cls15} x="12.03" y="0">t</tspan><tspan x="14.41" y="0">y</tspan><tspan x="1.03" y="7.2">S</tspan><tspan className={styles.cls50} x="4.72" y="7.2">h</tspan><tspan x="8.8" y="7.2">op</tspan></text>
        </g>
        <g className={styles.cls47}>
          <text className={styles.cls20} transform="translate(655.67 223.64)"><tspan x="0" y="0">Ele</tspan><tspan className={styles.cls31} x="9.25" y="0">c</tspan><tspan className={styles.cls34} x="12.67" y="0">t</tspan><tspan className={styles.cls42} x="15.1" y="0">r</tspan><tspan className={styles.cls32} x="17.46" y="0">ical</tspan><tspan className={styles.cls46} x="-3.32" y="7.2">E</tspan><tspan className={styles.cls32} x=".64" y="7.2">quip</tspan><tspan className={styles.cls36} x="14.43" y="7.2">m</tspan><tspan x="20.81" y="7.2">ent</tspan><tspan x="6.95" y="14.4">A</tspan><tspan className={styles.cls52} x="11.25" y="14.4">r</tspan><tspan className={styles.cls24} x="13.58" y="14.4">e</tspan><tspan x="17.11" y="14.4">a</tspan></text>
          <text className={styles.cls20} transform="translate(655.67 223.64)"><tspan x="0" y="0">Ele</tspan><tspan className={styles.cls31} x="9.25" y="0">c</tspan><tspan className={styles.cls34} x="12.67" y="0">t</tspan><tspan className={styles.cls42} x="15.1" y="0">r</tspan><tspan className={styles.cls32} x="17.46" y="0">ical</tspan><tspan className={styles.cls46} x="-3.32" y="7.2">E</tspan><tspan className={styles.cls32} x=".64" y="7.2">quip</tspan><tspan className={styles.cls36} x="14.43" y="7.2">m</tspan><tspan x="20.81" y="7.2">ent</tspan><tspan x="6.95" y="14.4">A</tspan><tspan className={styles.cls52} x="11.25" y="14.4">r</tspan><tspan className={styles.cls24} x="13.58" y="14.4">e</tspan><tspan x="17.11" y="14.4">a</tspan></text>
        </g>
        <g className={styles.cls47}>
          <text className={styles.cls20} transform="translate(647.23 296.73)"><tspan className={styles.cls38} x="0" y="0">T</tspan><tspan className={styles.cls22} x="3.36" y="0">r</tspan><tspan x="5.71" y="0">ans</tspan><tspan className={styles.cls30} x="16.25" y="0">f</tspan><tspan className={styles.cls34} x="18.23" y="0">o</tspan><tspan className={styles.cls42} x="21.99" y="0">r</tspan><tspan className={styles.cls36} x="24.35" y="0">m</tspan><tspan x="30.73" y="0">er</tspan><tspan x="3.52" y="7.2">E</tspan><tspan className={styles.cls50} x="7.53" y="7.2">n</tspan><tspan className={styles.cls42} x="11.61" y="7.2">c</tspan><tspan x="14.94" y="7.2">losu</tspan><tspan className={styles.cls52} x="27.28" y="7.2">r</tspan><tspan x="29.61" y="7.2">e</tspan></text>
          <text className={styles.cls20} transform="translate(647.23 296.73)"><tspan className={styles.cls38} x="0" y="0">T</tspan><tspan className={styles.cls22} x="3.36" y="0">r</tspan><tspan x="5.71" y="0">ans</tspan><tspan className={styles.cls30} x="16.25" y="0">f</tspan><tspan className={styles.cls34} x="18.23" y="0">o</tspan><tspan className={styles.cls42} x="21.99" y="0">r</tspan><tspan className={styles.cls36} x="24.35" y="0">m</tspan><tspan x="30.73" y="0">er</tspan><tspan x="3.52" y="7.2">E</tspan><tspan className={styles.cls50} x="7.53" y="7.2">n</tspan><tspan className={styles.cls42} x="11.61" y="7.2">c</tspan><tspan x="14.94" y="7.2">losu</tspan><tspan className={styles.cls52} x="27.28" y="7.2">r</tspan><tspan x="29.61" y="7.2">e</tspan></text>
        </g>
        <g className={styles.cls47}>
          <text className={styles.cls20} transform="translate(632.94 373.41)"><tspan className={styles.cls16} x="0" y="0">C</tspan><tspan className={styles.cls29} x="4.18" y="0">o</tspan><tspan x="7.92" y="0">ati</tspan><tspan className={styles.cls36} x="15.51" y="0">n</tspan><tspan x="19.58" y="0">g</tspan><tspan className={styles.cls46} x="-5.28" y="7.2">E</tspan><tspan className={styles.cls32} x="-1.31" y="7.2">quip</tspan><tspan className={styles.cls36} x="12.48" y="7.2">m</tspan><tspan x="18.85" y="7.2">ent</tspan><tspan className={styles.cls49} x="5.17" y="14.4">Y</tspan><tspan x="8.59" y="14.4">a</tspan><tspan className={styles.cls52} x="12.13" y="14.4">r</tspan><tspan x="14.46" y="14.4">d</tspan></text>
          <text className={styles.cls20} transform="translate(632.94 373.41)"><tspan className={styles.cls16} x="0" y="0">C</tspan><tspan className={styles.cls29} x="4.18" y="0">o</tspan><tspan x="7.92" y="0">ati</tspan><tspan className={styles.cls36} x="15.51" y="0">n</tspan><tspan x="19.58" y="0">g</tspan><tspan className={styles.cls46} x="-5.28" y="7.2">E</tspan><tspan className={styles.cls32} x="-1.31" y="7.2">quip</tspan><tspan className={styles.cls36} x="12.48" y="7.2">m</tspan><tspan x="18.85" y="7.2">ent</tspan><tspan className={styles.cls49} x="5.17" y="14.4">Y</tspan><tspan x="8.59" y="14.4">a</tspan><tspan className={styles.cls52} x="12.13" y="14.4">r</tspan><tspan x="14.46" y="14.4">d</tspan></text>
        </g>
        <g className={styles.cls47}>
          <text className={styles.cls20} transform="translate(722.96 28.63)"><tspan className={styles.cls33} x="0" y="0">V</tspan><tspan x="3.86" y="0">estibule</tspan></text>
          <text className={styles.cls20} transform="translate(722.96 28.63)"><tspan className={styles.cls33} x="0" y="0">V</tspan><tspan x="3.86" y="0">estibule</tspan></text>
        </g>
      </g>
      <g id="t2" className={styles.cls45}>
        <g className={styles.cls47}>
          <text className={styles.cls21} transform="translate(852.29 228.04) rotate(-90)"><tspan x="0" y="0">Chiller 3</tspan></text>
          <text className={styles.cls21} transform="translate(852.29 228.04) rotate(-90)"><tspan x="0" y="0">Chiller 3</tspan></text>
        </g>
        <g className={styles.cls47}>
          <text className={styles.cls21} transform="translate(792.82 211.19)"><tspan className={styles.cls16} x="0" y="0">P</tspan><tspan className={styles.cls52} x="2.78" y="0">r</tspan><tspan x="4.33" y="0">o</tspan><tspan className={styles.cls25} x="6.84" y="0">c</tspan><tspan x="9.06" y="0">ess Air</tspan><tspan className={styles.cls26} x="-2.1" y="4.8">C</tspan><tspan x=".68" y="4.8">omp</tspan><tspan className={styles.cls35} x="10.15" y="4.8">r</tspan><tspan x="11.7" y="4.8">esso</tspan><tspan className={styles.cls37} x="20.54" y="4.8">r</tspan><tspan x="22.12" y="4.8">s</tspan></text>
          <text className={styles.cls21} transform="translate(792.82 211.19)"><tspan className={styles.cls16} x="0" y="0">P</tspan><tspan className={styles.cls52} x="2.78" y="0">r</tspan><tspan x="4.33" y="0">o</tspan><tspan className={styles.cls25} x="6.84" y="0">c</tspan><tspan x="9.06" y="0">ess Air</tspan><tspan className={styles.cls26} x="-2.1" y="4.8">C</tspan><tspan x=".68" y="4.8">omp</tspan><tspan className={styles.cls35} x="10.15" y="4.8">r</tspan><tspan x="11.7" y="4.8">esso</tspan><tspan className={styles.cls37} x="20.54" y="4.8">r</tspan><tspan x="22.12" y="4.8">s</tspan></text>
        </g>
        <g className={styles.cls47}>
          <text className={styles.cls21} transform="translate(774.92 59.94)"><tspan className={styles.cls28} x="0" y="0">W</tspan><tspan x="4.22" y="0">et Shaft</tspan></text>
          <text className={styles.cls21} transform="translate(774.92 59.94)"><tspan className={styles.cls28} x="0" y="0">W</tspan><tspan x="4.22" y="0">et Shaft</tspan></text>
        </g>
        <g>
          <text className={styles.cls21} transform="translate(771.05 162.47)"><tspan x="0" y="0">OSS </tspan><tspan className={styles.cls43} x="9.32" y="0">E</tspan><tspan x="11.97" y="0">quip</tspan></text>
          <text className={styles.cls21} transform="translate(771.05 162.47)"><tspan x="0" y="0">OSS </tspan><tspan className={styles.cls43} x="9.32" y="0">E</tspan><tspan x="11.97" y="0">quip</tspan></text>
        </g>
        <g className={styles.cls47}>
          <text className={styles.cls21} transform="translate(852.29 85.68) rotate(-90)"><tspan x="0" y="0">Chiller 1</tspan></text>
          <text className={styles.cls21} transform="translate(852.29 85.68) rotate(-90)"><tspan x="0" y="0">Chiller 1</tspan></text>
        </g>
        <g className={styles.cls47}>
          <text className={styles.cls21} transform="translate(802.06 92.28)"><tspan x="0" y="0">D</tspan><tspan className={styles.cls40} x="3.3" y="0">r</tspan><tspan x="4.97" y="0">y</tspan><tspan x="-1.69" y="4.8">Shaft</tspan></text>
          <text className={styles.cls21} transform="translate(802.06 92.28)"><tspan x="0" y="0">D</tspan><tspan className={styles.cls40} x="3.3" y="0">r</tspan><tspan x="4.97" y="0">y</tspan><tspan x="-1.69" y="4.8">Shaft</tspan></text>
        </g>
        <g className={styles.cls47}>
          <text className={styles.cls21} transform="translate(774.48 87.54)"><tspan x="0" y="0">El</tspan><tspan className={styles.cls15} x="3.75" y="0">e</tspan><tspan className={styles.cls23} x="6.13" y="0">v</tspan><tspan className={styles.cls44} x="8.16" y="0">. 1</tspan></text>
          <text className={styles.cls21} transform="translate(774.48 87.54)"><tspan x="0" y="0">El</tspan><tspan className={styles.cls15} x="3.75" y="0">e</tspan><tspan className={styles.cls23} x="6.13" y="0">v</tspan><tspan className={styles.cls44} x="8.16" y="0">. 1</tspan></text>
        </g>
        <g className={styles.cls47}>
          <text className={styles.cls21} transform="translate(711.54 176.07) rotate(-90)"><tspan x="0" y="0">Se</tspan><tspan className={styles.cls41} x="4.88" y="0">r</tspan><tspan x="6.54" y="0">vi</tspan><tspan className={styles.cls25} x="9.78" y="0">c</tspan><tspan x="12" y="0">e Air</tspan><tspan className={styles.cls26} x="-1.61" y="4.8">C</tspan><tspan x="1.17" y="4.8">omp</tspan><tspan className={styles.cls35} x="10.63" y="4.8">r</tspan><tspan x="12.19" y="4.8">essor</tspan></text>
          <text className={styles.cls21} transform="translate(711.54 176.07) rotate(-90)"><tspan x="0" y="0">Se</tspan><tspan className={styles.cls41} x="4.88" y="0">r</tspan><tspan x="6.54" y="0">vi</tspan><tspan className={styles.cls25} x="9.78" y="0">c</tspan><tspan x="12" y="0">e Air</tspan><tspan className={styles.cls26} x="-1.61" y="4.8">C</tspan><tspan x="1.17" y="4.8">omp</tspan><tspan className={styles.cls35} x="10.63" y="4.8">r</tspan><tspan x="12.19" y="4.8">essor</tspan></text>
        </g>
        <g className={styles.cls47}>
          <text className={styles.cls21} transform="translate(852.29 152.06) rotate(-90)"><tspan x="0" y="0">Chiller 2</tspan></text>
          <text className={styles.cls21} transform="translate(852.29 152.06) rotate(-90)"><tspan x="0" y="0">Chiller 2</tspan></text>
        </g>
      </g>
    </g>

    {this.getDevices()}

  </g>
    );
  }
}