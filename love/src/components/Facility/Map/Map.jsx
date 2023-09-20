/** This file is part of LOVE-frontend.

Developed for Inria Chile Tech Team.

See the COPYRIGHT file at the top-level directory of this distribution
for details of code ownership.

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.*/

import React, { Component } from 'react';
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

  changeTab = (tab) => {
    this.setState({ selectedTab: tab });
  };

  savePos = (transformData) => {
    this.setState({ transformData: transformData });
  };

  setAlarms = (level, isAlarm) => {
    this.setState((prevState) => ({ alarms: { ...prevState.alarms, [level]: isAlarm } }));
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

  componentDidUpdate(prevProps, prevState) {
    const { chiller01P01, chiller02P01, chiller03P01 } = this.props.HVACDataLevel1;
    const { crack01P02, crack02P02 } = this.props.HVACDataLevel2;
    const { manejadoraSblancaP04, manejadoraSlimpiaP04, vex04CargaP04, vex03LowerP04 } = this.props.HVACDataLevel4;
    const {
      dynaleneP05Events,
      manejadoraLower01P05,
      manejadoraLower02P05,
      manejadoraLower03P05,
      manejadoraLower04P05,
    } = this.props.HVACDataLevel5;
    const {
      vea01P05,
      vea08P05,
      vea09P05,
      vea10P05,
      vea11P05,
      vea12P05,
      vea13P05,
      vea14P05,
      vea15P05,
      vea16P05,
      vea17P05,
    } = this.props.HVACDataLevel5;

    const prevHVACDataLevel1 = prevProps.HVACDataLevel1;
    const prevHVACDataLevel2 = prevProps.HVACDataLevel2;
    const prevHVACDataLevel4 = prevProps.HVACDataLevel4;
    const prevHVACDataLevel5 = prevProps.HVACDataLevel5;

    const alarms_1 = [
      chiller01P01.alarmaGeneral ? chiller01P01.alarmaGeneral.value : null,
      chiller01P01.compresor01Alarmado ? chiller01P01.compresor01Alarmado.value : null,
      chiller01P01.compresor02Alarmado ? chiller01P01.compresor02Alarmado.value : null,
      chiller01P01.compresor03Alarmado ? chiller01P01.compresor03Alarmado.value : null,
      chiller02P01.alarmaGeneral ? chiller02P01.alarmaGeneral.value : null,
      chiller02P01.compresor01Alarmado ? chiller02P01.compresor01Alarmado.value : null,
      chiller02P01.compresor02Alarmado ? chiller02P01.compresor02Alarmado.value : null,
      chiller02P01.compresor03Alarmado ? chiller02P01.compresor03Alarmado.value : null,
      chiller03P01.alarmaGeneral ? chiller03P01.alarmaGeneral.value : null,
      chiller03P01.compresor01Alarmado ? chiller03P01.compresor01Alarmado.value : null,
      chiller03P01.compresor02Alarmado ? chiller03P01.compresor02Alarmado.value : null,
      chiller03P01.compresor03Alarmado ? chiller03P01.compresor03Alarmado.value : null,
    ];

    if (
      (chiller01P01 || chiller02P01 || chiller03P01) &&
      (prevHVACDataLevel1.chiller01P01?.alarmaGeneral?.value !== chiller01P01.alarmaGeneral?.value ||
        prevHVACDataLevel1.chiller01P01?.compresor01Alarmado?.value !== chiller01P01.compresor01Alarmado?.value ||
        prevHVACDataLevel1.chiller01P01?.compresor02Alarmado?.value !== chiller01P01.compresor02Alarmado?.value ||
        prevHVACDataLevel1.chiller01P01?.compresor03Alarmado?.value !== chiller01P01.compresor03Alarmado?.value ||
        prevHVACDataLevel1.chiller02P01?.alarmaGeneral?.value !== chiller02P01.alarmaGeneral?.value ||
        prevHVACDataLevel1.chiller02P01?.compresor01Alarmado?.value !== chiller02P01.compresor01Alarmado?.value ||
        prevHVACDataLevel1.chiller02P01?.compresor02Alarmado?.value !== chiller02P01.compresor02Alarmado?.value ||
        prevHVACDataLevel1.chiller02P01?.compresor03Alarmado?.value !== chiller02P01.compresor03Alarmado?.value ||
        prevHVACDataLevel1.chiller03P01?.alarmaGeneral?.value !== chiller03P01.alarmaGeneral?.value ||
        prevHVACDataLevel1.chiller03P01?.compresor01Alarmado?.value !== chiller03P01.compresor01Alarmado?.value ||
        prevHVACDataLevel1.chiller03P01?.compresor02Alarmado?.value !== chiller03P01.compresor02Alarmado?.value ||
        prevHVACDataLevel1.chiller03P01?.compresor03Alarmado?.value !== chiller03P01.compresor03Alarmado?.value)
    ) {
      const isAlarmed_1 = alarms_1.some((a) => {
        return a;
      });
      this.setAlarms('level_1', isAlarmed_1);
    }

    const alarms_2 = [
      crack01P02.estadoPresenciaAlarma ? crack01P02.estadoPresenciaAlarma.value : null,
      crack02P02.estadoPresenciaAlarma ? crack02P02.estadoPresenciaAlarma.value : null,
    ];

    if (
      (crack01P02 || crack01P02) &&
      (prevHVACDataLevel2.crack01P02?.estadoPresenciaAlarma?.value !== crack01P02.estadoPresenciaAlarma?.value ||
        prevHVACDataLevel2.crack02P02?.estadoPresenciaAlarma?.value !== crack02P02.estadoPresenciaAlarma?.value)
    ) {
      const isAlarmed_2 = alarms_2.some((a) => {
        return a;
      });
      this.setAlarms('level_2', isAlarmed_2);
    }

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

    if (
      (manejadoraSblancaP04 || manejadoraSlimpiaP04 || vex03LowerP04 || vex04CargaP04) &&
      (prevHVACDataLevel4.manejadoraSblancaP04?.alarmaGeneral?.value !== manejadoraSblancaP04.alarmaGeneral?.value ||
        prevHVACDataLevel4.manejadoraSblancaP04?.alarmaFiltro?.value !== manejadoraSblancaP04.alarmaFiltro?.value ||
        prevHVACDataLevel4.manejadoraSblancaP04?.resetAlarma?.value !== manejadoraSblancaP04.resetAlarma?.value ||
        prevHVACDataLevel4.manejadoraSlimpiaP04?.alarmaGeneral?.value !== manejadoraSlimpiaP04.alarmaGeneral?.value ||
        prevHVACDataLevel4.manejadoraSlimpiaP04?.alarmaFiltro?.value !== manejadoraSlimpiaP04.alarmaFiltro?.value ||
        prevHVACDataLevel4.manejadoraSlimpiaP04?.resetAlarma?.value !== manejadoraSlimpiaP04.resetAlarma?.value ||
        prevHVACDataLevel4.vex03LowerP04?.fallaTermica?.value !== vex03LowerP04.fallaTermica?.value ||
        prevHVACDataLevel4.vex04CargaP04?.fallaTermica?.value !== vex04CargaP04.fallaTermica?.value)
    ) {
      const isAlarmed_4 = alarms_4.some((a) => {
        return a;
      });
      this.setAlarms('level_4', isAlarmed_4);
    }

    const alarms_5 = [
      dynaleneP05Events.dynMainGridAlarm?.value,
      dynaleneP05Events.dynMainGridFailureFlag?.value,
      dynaleneP05Events.dynSafetyResetFlag?.value,
      dynaleneP05Events.dynTAalarm?.value,
      dynaleneP05Events.dynTMAalarm?.value,
      dynaleneP05Events?.dynaleneTankLevel?.value === 0,
      manejadoraLower01P05.alarmaGeneral?.value,
      manejadoraLower01P05.alarmaFiltro?.value,
      manejadoraLower01P05.resetAlarma?.value,
      manejadoraLower02P05.alarmaGeneral?.value,
      manejadoraLower02P05.alarmaFiltro?.value,
      manejadoraLower02P05.resetAlarma?.value,
      manejadoraLower03P05.alarmaGeneral?.value,
      manejadoraLower03P05.alarmaFiltro?.value,
      manejadoraLower03P05.resetAlarma?.value,
      manejadoraLower04P05.alarmaGeneral?.value,
      manejadoraLower04P05.alarmaFiltro?.value,
      manejadoraLower04P05.resetAlarma?.value,
      vea01P05.fallaTermica?.value,
      vea08P05.fallaTermica?.value,
      vea09P05.fallaTermica?.value,
      vea10P05.fallaTermica?.value,
      vea11P05.fallaTermica?.value,
      vea12P05.fallaTermica?.value,
      vea13P05.fallaTermica?.value,
      vea14P05.fallaTermica?.value,
      vea15P05.fallaTermica?.value,
      vea16P05.fallaTermica?.value,
      vea17P05.fallaTermica?.value,
    ];

    if (
      (dynaleneP05Events ||
        manejadoraLower01P05 ||
        manejadoraLower02P05 ||
        manejadoraLower03P05 ||
        manejadoraLower04P05 ||
        vea01P05 ||
        vea08P05 ||
        vea09P05 ||
        vea10P05 ||
        vea11P05 ||
        vea12P05 ||
        vea13P05 ||
        vea14P05 ||
        vea15P05 ||
        vea16P05 ||
        vea17P05) &&
      (prevHVACDataLevel5.dynaleneP05Events?.dynMainGridAlarm?.value !== dynaleneP05Events?.dynMainGridAlarm?.value ||
        prevHVACDataLevel5.dynaleneP05Events?.dynMainGridFailureFlag?.value !==
          dynaleneP05Events?.dynMainGridFailureFlag?.value ||
        prevHVACDataLevel5.dynaleneP05Events?.dynSafetyResetFlag?.value !==
          dynaleneP05Events?.dynSafetyResetFlag?.value ||
        prevHVACDataLevel5.dynaleneP05Events?.dynTAalarm?.value !== dynaleneP05Events?.dynTAalarm?.value ||
        prevHVACDataLevel5.dynaleneP05Events?.dynTMAalarm?.value !== dynaleneP05Events?.dynTMAalarm?.value ||
        prevHVACDataLevel5.dynaleneP05Events?.dynaleneTankLevel?.value !==
          dynaleneP05Events?.dynaleneTankLevel?.value ||
        prevHVACDataLevel5.dynaleneP05Events?.dynMainGridAlarm?.value !== dynaleneP05Events?.dynMainGridAlarm?.value ||
        prevHVACDataLevel5.dynaleneP05Events?.dynMainGridAlarm?.value !== dynaleneP05Events?.dynMainGridAlarm?.value ||
        prevHVACDataLevel5.manejadoraLower01P05?.alarmaGeneral?.value !== manejadoraLower01P05.alarmaGeneral?.value ||
        prevHVACDataLevel5.manejadoraLower01P05?.alarmaFiltro?.value !== manejadoraLower01P05.alarmaFiltro?.value ||
        prevHVACDataLevel5.manejadoraLower01P05?.resetAlarma?.value !== manejadoraLower01P05.resetAlarma?.value ||
        prevHVACDataLevel5.manejadoraLower02P05?.alarmaGeneral?.value !== manejadoraLower02P05.alarmaGeneral?.value ||
        prevHVACDataLevel5.manejadoraLower02P05?.alarmaFiltro?.value !== manejadoraLower02P05.alarmaFiltro?.value ||
        prevHVACDataLevel5.manejadoraLower02P05?.resetAlarma?.value !== manejadoraLower02P05.resetAlarma?.value ||
        prevHVACDataLevel5.manejadoraLower03P05?.alarmaGeneral?.value !== manejadoraLower03P05.alarmaGeneral?.value ||
        prevHVACDataLevel5.manejadoraLower03P05?.alarmaFiltro?.value !== manejadoraLower03P05.alarmaFiltro?.value ||
        prevHVACDataLevel5.manejadoraLower03P05?.resetAlarma?.value !== manejadoraLower03P05.resetAlarma?.value ||
        prevHVACDataLevel5.manejadoraLower04P05?.alarmaGeneral?.value !== manejadoraLower04P05.alarmaGeneral?.value ||
        prevHVACDataLevel5.manejadoraLower04P05?.alarmaFiltro?.value !== manejadoraLower04P05.alarmaFiltro?.value ||
        prevHVACDataLevel5.manejadoraLower04P05?.resetAlarma?.value !== manejadoraLower04P05.resetAlarma?.value ||
        prevHVACDataLevel5.vea01P05?.fallaTermica?.value !== vea01P05.fallaTermica?.value ||
        prevHVACDataLevel5.vea08P05?.fallaTermica?.value !== vea08P05.fallaTermica?.value ||
        prevHVACDataLevel5.vea09P05?.fallaTermica?.value !== vea09P05.fallaTermica?.value ||
        prevHVACDataLevel5.vea10P05?.fallaTermica?.value !== vea10P05.fallaTermica?.value ||
        prevHVACDataLevel5.vea11P05?.fallaTermica?.value !== vea11P05.fallaTermica?.value ||
        prevHVACDataLevel5.vea12P05?.fallaTermica?.value !== vea12P05.fallaTermica?.value ||
        prevHVACDataLevel5.vea13P05?.fallaTermica?.value !== vea13P05.fallaTermica?.value ||
        prevHVACDataLevel5.vea14P05?.fallaTermica?.value !== vea14P05.fallaTermica?.value ||
        prevHVACDataLevel5.vea15P05?.fallaTermica?.value !== vea15P05.fallaTermica?.value ||
        prevHVACDataLevel5.vea16P05?.fallaTermica?.value !== vea16P05.fallaTermica?.value ||
        prevHVACDataLevel5.vea17P05?.fallaTermica?.value !== vea17P05.fallaTermica?.value)
    ) {
      const isAlarmed_5 = alarms_5.some((a) => {
        return a;
      });
      this.setAlarms('level_5', isAlarmed_5);
    }
  }

  render() {
    const { hasAlarm, alarms } = this.state;
    const isAlarmed = alarms[this.state.selectedTab];
    const margin = 60;

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
