import React, { Component } from 'react';
import { defaultNumberFormatter } from 'Utils';
import { M1M3ActuatorPositions } from 'Config';
import styles from './Map.module.css';
import Badge from '../../GeneralPurpose/Badge/Badge';

import Level1 from './Levels/Level1.jsx';
import Level2 from './Levels/Level2.jsx';
import Level3 from './Levels/Level3.jsx';
import Level4 from './Levels/Level4.jsx';
import Level5 from './Levels/Level5.jsx';
import Level6 from './Levels/Level6.jsx';
import Level7 from './Levels/Level7.jsx';
import Level8 from './Levels/Level8.jsx';

import * as d3 from 'd3';

export default class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      transformData: { k: 1, x: 0, y: 0 },
      alarms: {
        level_1: false,
        level_2: false,
        level_4: false,
        level_5: false,
      },
      hasAlarm: false,
      selectedTab: 'level_1',
    };
  }

  changeTab(tab) {
    this.setState({ selectedTab: tab });
  }

  savePos = (transformData) => {
    this.setState({ transformData: transformData });
  };

  setAlarms = (level_1, level_2, level_4, level_5) => {
    this.state.alarms = {
      level_1: level_1,
      level_2: level_2,
      level_4: level_4,
      level_5: level_5,
    };
  };

  floorSelect(tab) {
    const { HVACDataLevel1, HVACDataLevel2, HVACDataLevel4, HVACDataLevel5 } = this.props;

    switch (tab) {
      case 'level_1':
        return (
          <Level1
            hideHVAC={this.props.hideHVAC}
            HVACData={HVACDataLevel1}
            savePos={this.savePos}
            transformData={this.state.transformData}
          />
        );
      case 'level_2':
        return (
          <Level2
            hideHVAC={this.props.hideHVAC}
            HVACData={HVACDataLevel2}
            savePos={this.savePos}
            transformData={this.state.transformData}
          />
        );
      case 'level_3':
        return (
          <Level3 hideHVAC={this.props.hideHVAC} savePos={this.savePos} transformData={this.state.transformData} />
        );
      case 'level_4':
        return (
          <Level4
            hideHVAC={this.props.hideHVAC}
            HVACData={HVACDataLevel4}
            savePos={this.savePos}
            transformData={this.state.transformData}
          />
        );
      case 'level_5':
        return (
          <Level5
            hideHVAC={this.props.hideHVAC}
            HVACData={HVACDataLevel5}
            savePos={this.savePos}
            transformData={this.state.transformData}
          />
        );
      case 'level_6':
        return (
          <Level6 hideHVAC={this.props.hideHVAC} savePos={this.savePos} transformData={this.state.transformData} />
        );
      case 'level_7':
        return (
          <Level7 hideHVAC={this.props.hideHVAC} savePos={this.savePos} transformData={this.state.transformData} />
        );
      case 'level_8':
        return (
          <Level8 hideHVAC={this.props.hideHVAC} savePos={this.savePos} transformData={this.state.transformData} />
        );
      default:
        return '';
    }
  }

  componentDidMount() {}

  componentDidUpdate() {
    const chiller01P01 = this.props.HVACDataLevel1['chiller01P01'];
    const chiller02P01 = this.props.HVACDataLevel1['chiller02P01'];
    const chiller03P01 = this.props.HVACDataLevel1['chiller03P01'];

    const crack01P02 = this.props.HVACDataLevel2['crack01P02'];
    const crack02P02 = this.props.HVACDataLevel2['crack02P02'];

    const manejadoraSblancaP04 = this.props.HVACDataLevel4['manejadoraSblancaP04'];
    const manejadoraSlimpiaP04 = this.props.HVACDataLevel4['manejadoraSlimpiaP04'];
    const vex04CargaP04 = this.props.HVACDataLevel4['vex04CargaP04'];
    const vex03LowerP04 = this.props.HVACDataLevel4['vex03LowerP04'];

    const manejadoraLower01P05 = this.props.HVACDataLevel5['manejadoraLower01P05'];
    const manejadoraLower02P05 = this.props.HVACDataLevel5['manejadoraLower02P05'];
    const manejadoraLower03P05 = this.props.HVACDataLevel5['manejadoraLower03P05'];
    const manejadoraLower04P05 = this.props.HVACDataLevel5['manejadoraLower04P05'];
    const vea01P05 = this.props.HVACDataLevel5['vea01P05'];
    const vea08P05 = this.props.HVACDataLevel5['vea08P05'];
    const vea09P05 = this.props.HVACDataLevel5['vea09P05'];
    const vea10P05 = this.props.HVACDataLevel5['vea10P05'];
    const vea11P05 = this.props.HVACDataLevel5['vea11P05'];
    const vea12P05 = this.props.HVACDataLevel5['vea12P05'];
    const vea13P05 = this.props.HVACDataLevel5['vea13P05'];
    const vea14P05 = this.props.HVACDataLevel5['vea14P05'];
    const vea15P05 = this.props.HVACDataLevel5['vea15P05'];
    const vea16P05 = this.props.HVACDataLevel5['vea16P05'];
    const vea17P05 = this.props.HVACDataLevel5['vea17P05'];

    const alarms_1 = [
      //chiller01P01.alarmaGeneral?chiller01P01.alarmaGeneral.value:'',
      chiller01P01.alarmaGeneral ? chiller01P01.alarmaGeneral.value : null,
      chiller01P01.compresor01Alarmado ? chiller01P01.compresor01Alarmado.value : null,
      chiller01P01.compresor02Alarmado ? chiller01P01.compresor01Alarmado.value : null,
      chiller01P01.compresor03Alarmado ? chiller01P01.compresor01Alarmado.value : null,
      chiller02P01.alarmaGeneral ? chiller02P01.alarmaGeneral.value : null,
      chiller02P01.compresor01Alarmado ? chiller02P01.compresor01Alarmado.value : null,
      chiller02P01.compresor02Alarmado ? chiller02P01.compresor01Alarmado.value : null,
      chiller02P01.compresor03Alarmado ? chiller02P01.compresor01Alarmado.value : null,
      chiller03P01.alarmaGeneral ? chiller03P01.alarmaGeneral.value : null,
      chiller03P01.compresor01Alarmado ? chiller03P01.compresor01Alarmado.value : null,
      chiller03P01.compresor02Alarmado ? chiller03P01.compresor01Alarmado.value : null,
      chiller03P01.compresor03Alarmado ? chiller03P01.compresor01Alarmado.value : null,
    ];

    const alarms_2 = [
      crack01P02.estadoPresenciaAlarma ? crack01P02.estadoPresenciaAlarma.value : null,
      crack02P02.estadoPresenciaAlarma ? crack02P02.estadoPresenciaAlarma.value : null,
    ];

    const alarms_4 = [
      manejadoraSblancaP04.alarmaGeneral ? manejadoraSblancaP04.alarmaGeneral.value : null,
      manejadoraSblancaP04.alarmaFiltro ? manejadoraSblancaP04.alarmaFiltro.value : null,
      manejadoraSblancaP04.resetAlarma ? manejadoraSblancaP04.resetAlarma.value : null,
      manejadoraSlimpiaP04.alarmaGeneral ? manejadoraSlimpiaP04.alarmaGeneral.value : null,
      manejadoraSlimpiaP04.alarmaFiltro ? manejadoraSlimpiaP04.alarmaFiltro.value : null,
      manejadoraSlimpiaP04.resetAlarma ? manejadoraSlimpiaP04.resetAlarma.value : null,
      vex04CargaP04.fallaTermica ? vex04CargaP04.fallaTermica.value : null,
      vex03LowerP04.fallaTermica ? vex03LowerP04.fallaTermica.value : null,
    ];

    const alarms_5 = [
      manejadoraLower01P05.alarmaGeneral ? manejadoraLower01P05.alarmaGeneral.value : null,
      manejadoraLower01P05.alarmaFiltro ? manejadoraLower01P05.alarmaFiltro.value : null,
      manejadoraLower01P05.resetAlarma ? manejadoraLower01P05.resetAlarma.value : null,
      manejadoraLower02P05.alarmaGeneral ? manejadoraLower02P05.alarmaGeneral.value : null,
      manejadoraLower02P05.alarmaFiltro ? manejadoraLower02P05.alarmaFiltro.value : null,
      manejadoraLower02P05.resetAlarma ? manejadoraLower02P05.resetAlarma.value : null,
      manejadoraLower03P05.alarmaGeneral ? manejadoraLower03P05.alarmaGeneral.value : null,
      manejadoraLower03P05.alarmaFiltro ? manejadoraLower03P05.alarmaFiltro.value : null,
      manejadoraLower03P05.resetAlarma ? manejadoraLower03P05.resetAlarma.value : null,
      manejadoraLower04P05.alarmaGeneral ? manejadoraLower04P05.alarmaGeneral.value : null,
      manejadoraLower04P05.alarmaFiltro ? manejadoraLower04P05.alarmaFiltro.value : null,
      manejadoraLower04P05.resetAlarma ? manejadoraLower04P05.resetAlarma.value : null,
      vea01P05.fallaTermica ? vea01P05.fallaTermica.value : null,
      vea08P05.fallaTermica ? vea08P05.fallaTermica.value : null,
      vea09P05.fallaTermica ? vea09P05.fallaTermica.value : null,
      vea10P05.fallaTermica ? vea10P05.fallaTermica.value : null,
      vea11P05.fallaTermica ? vea11P05.fallaTermica.value : null,
      vea12P05.fallaTermica ? vea12P05.fallaTermica.value : null,
      vea13P05.fallaTermica ? vea13P05.fallaTermica.value : null,
      vea14P05.fallaTermica ? vea14P05.fallaTermica.value : null,
      vea15P05.fallaTermica ? vea15P05.fallaTermica.value : null,
      vea16P05.fallaTermica ? vea16P05.fallaTermica.value : null,
      vea17P05.fallaTermica ? vea17P05.fallaTermica.value : null,
    ];

    const isAlarmed_1 = alarms_1.some((a) => {
      return a;
    });
    const isAlarmed_2 = alarms_2.some((a) => {
      return a;
    });
    const isAlarmed_4 = alarms_4.some((a) => {
      return a;
    });
    const isAlarmed_5 = alarms_5.some((a) => {
      return a;
    });

    this.setAlarms(isAlarmed_1, isAlarmed_2, isAlarmed_4, isAlarmed_5);
  }

  render() {
    const hasAlarm = this.state.hasAlarm;

    const margin = 60;

    const alarms = this.state.alarms;

    const isAlarmed = alarms[this.state.selectedTab];

    return (
      <div className={styles.tabsWrapper}>
        <div className={styles.tabsRow}>
          <div
            className={[
              styles.tab,
              this.state.selectedTab === 'level_1' ? styles.selected : '',
              alarms['level_1'] ? styles.alarmTab : '',
            ].join(' ')}
            onClick={() => this.changeTab('level_1')}
          >
            <div className={styles.tabLabel}>Level 1</div>
          </div>

          <div
            className={[
              styles.tab,
              this.state.selectedTab === 'level_2' ? styles.selected : '',
              alarms['level_2'] ? styles.alarmTab : '',
            ].join(' ')}
            onClick={() => this.changeTab('level_2')}
          >
            <div className={styles.tabLabel}>Level 2</div>
          </div>

          <div
            className={[
              styles.tab,
              this.state.selectedTab === 'level_3' ? styles.selected : '',
              alarms['level_3'] ? styles.alarmTab : '',
            ].join(' ')}
            onClick={() => this.changeTab('level_3')}
          >
            <div className={styles.tabLabel}>Level 3</div>
          </div>

          <div
            className={[
              styles.tab,
              this.state.selectedTab === 'level_4' ? styles.selected : '',
              alarms['level_4'] ? styles.alarmTab : '',
            ].join(' ')}
            onClick={() => this.changeTab('level_4')}
          >
            <div className={styles.tabLabel}>Level 4</div>
          </div>

          <div
            className={[
              styles.tab,
              this.state.selectedTab === 'level_5' ? styles.selected : '',
              alarms['level_5'] ? styles.alarmTab : '',
            ].join(' ')}
            onClick={() => this.changeTab('level_5')}
          >
            <div className={styles.tabLabel}>Level 5</div>
          </div>

          <div
            className={[
              styles.tab,
              this.state.selectedTab === 'level_6' ? styles.selected : '',
              alarms['level_6'] ? styles.alarmTab : '',
            ].join(' ')}
            onClick={() => this.changeTab('level_6')}
          >
            <div className={styles.tabLabel}>Level 6</div>
          </div>

          <div
            className={[
              styles.tab,
              this.state.selectedTab === 'level_7' ? styles.selected : '',
              alarms['level_7'] ? styles.alarmTab : '',
            ].join(' ')}
            onClick={() => this.changeTab('level_7')}
          >
            <div className={styles.tabLabel}>Level 7</div>
          </div>

          <div
            className={[
              styles.tab,
              this.state.selectedTab === 'level_8' ? styles.selected : '',
              alarms['level_8'] ? styles.alarmTab : '',
            ].join(' ')}
            onClick={() => this.changeTab('level_8')}
          >
            <div className={styles.tabLabel}>Level 8</div>
          </div>
        </div>

        <div
          className={[
            styles.mapWrapper,
            this.props.embedded ? styles.embedded : '',
            isAlarmed ? styles.alarmWrapper : '',
          ].join(' ')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 882.42 461.23">
            {this.floorSelect(this.state['selectedTab'])}
          </svg>
        </div>
      </div>
    );
  }
}
