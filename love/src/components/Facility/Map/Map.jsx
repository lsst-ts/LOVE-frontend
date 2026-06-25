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
import styles from './Map.module.css';
import Level1 from './Levels/Level1.jsx';
import Level2 from './Levels/Level2.jsx';
import Level3 from './Levels/Level3.jsx';
import Level4 from './Levels/Level4.jsx';
import Level5 from './Levels/Level5.jsx';
import Level6 from './Levels/Level6.jsx';
import Level7 from './Levels/Level7.jsx';
import Level8 from './Levels/Level8.jsx';

export default class Map extends Component {
  static defaultProps = {
    HVACDataLevel1: {},
    HVACDataLevel2: {},
    HVACDataLevel4: {},
    HVACDataLevel5: {},
  };

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
    const {
      coldGlycolChiller01,
      coldGlycolChiller02,
      comfortGlycolChiller03,
      status1,
      status2,
      warnings1,
      warnings2,
      errors1,
      errors2,
    } = this.props.HVACDataLevel1;

    const { crac01, crac02 } = this.props.HVACDataLevel2;
    const {
      airHandlingUnit05WhiteRoom,
      airHandlingUnit06CleanRoom,
      airExtractionFan04Dome,
      airExtractionFan03HighBay,
    } = this.props.HVACDataLevel4;
    const {
      dynaleneEvents,
      airHandlingUnit01Dome,
      airHandlingUnit02Dome,
      airHandlingUnit03Dome,
      airHandlingUnit04Dome,
    } = this.props.HVACDataLevel5;
    const {
      airCirculationFan01Lab,
      airCirculationFan08Pier,
      airCirculationFan09Pier,
      airCirculationFan10Pier,
      airCirculationFan11Pier,
      airCirculationFan12Pier,
      airCirculationFan13Pier,
      airCirculationFan14Pier,
      airCirculationFan15Pier,
      airCirculationFan16Lab,
      airCirculationFan17Lab,
    } = this.props.HVACDataLevel5;

    const prevHVACDataLevel1 = prevProps.HVACDataLevel1;
    const prevHVACDataLevel2 = prevProps.HVACDataLevel2;
    const prevHVACDataLevel4 = prevProps.HVACDataLevel4;
    const prevHVACDataLevel5 = prevProps.HVACDataLevel5;

    const alarms_1 = [
      coldGlycolChiller01.generalAlarm ? coldGlycolChiller01.generalAlarm.value : null,
      coldGlycolChiller01.compressor01Alarm ? coldGlycolChiller01.compressor01Alarm.value : null,
      coldGlycolChiller01.compressor02Alarm ? coldGlycolChiller01.compressor02Alarm.value : null,
      coldGlycolChiller01.compressor03Alarm ? coldGlycolChiller01.compressor03Alarm.value : null,
      coldGlycolChiller02.generalAlarm ? coldGlycolChiller02.generalAlarm.value : null,
      coldGlycolChiller02.compressor01Alarm ? coldGlycolChiller02.compressor01Alarm.value : null,
      coldGlycolChiller02.compressor02Alarm ? coldGlycolChiller02.compressor02Alarm.value : null,
      coldGlycolChiller02.compressor03Alarm ? coldGlycolChiller02.compressor03Alarm.value : null,
      comfortGlycolChiller03.generalAlarm ? comfortGlycolChiller03.generalAlarm.value : null,
      comfortGlycolChiller03.compressor01Alarm ? comfortGlycolChiller03.compressor01Alarm.value : null,
      comfortGlycolChiller03.compressor02Alarm ? comfortGlycolChiller03.compressor02Alarm.value : null,
      comfortGlycolChiller03.compressor03Alarm ? comfortGlycolChiller03.compressor03Alarm.value : null,
      status1.serviceRequired ? status1.serviceRequired.value : null,
      errors1.powerSupplyFailureE400 ? errors1.powerSupplyFailureE400.value : null,
      errors1.emergencyStopActivatedE401 ? errors1.emergencyStopActivatedE401.value : null,
      errors1.highMotorTemperatureM1E402 ? errors1.highMotorTemperatureM1E402.value : null,
      errors1.compressorDischargeTemperatureE403 ? errors1.compressorDischargeTemperatureE403.value : null,
      errors1.startTemperatureLowE404 ? errors1.startTemperatureLowE404.value : null,
      errors1.dischargeOverPressureE405 ? errors1.dischargeOverPressureE405.value : null,
      errors1.linePressureSensorB1E406 ? errors1.linePressureSensorB1E406.value : null,
      errors1.dischargePressureSensorB2E407 ? errors1.dischargePressureSensorB2E407.value : null,
      errors1.dischargeTemperatureSensorR2E408 ? errors1.dischargeTemperatureSensorR2E408.value : null,
      errors1.controllerHardwareE409 ? errors1.controllerHardwareE409.value : null,
      errors1.coolingE410 ? errors1.coolingE410.value : null,
      errors1.oilPressureLowE411 ? errors1.oilPressureLowE411.value : null,
      errors1.externalFaultE412 ? errors1.externalFaultE412.value : null,
      errors1.dryerE413 ? errors1.dryerE413.value : null,
      errors1.condensateDrainE414 ? errors1.condensateDrainE414.value : null,
      errors1.noPressureBuildUpE415 ? errors1.noPressureBuildUpE415.value : null,
      errors1.heavyStartupE416 ? errors1.heavyStartupE416.value : null,
      errors1.preAdjustmentVSDE500 ? errors1.preAdjustmentVSDE500.value : null,
      errors1.preAdjustmentE501 ? errors1.preAdjustmentE501.value : null,
      errors1.lockedVSDE502 ? errors1.lockedVSDE502.value : null,
      errors1.writeFaultVSDE503 ? errors1.writeFaultVSDE503.value : null,
      errors1.communicationVSDE504 ? errors1.communicationVSDE504.value : null,
      errors1.stopPressedVSDE505 ? errors1.stopPressedVSDE505.value : null,
      errors1.stopInputEMVSDE506 ? errors1.stopInputEMVSDE506.value : null,
      errors1.readFaultVSDE507 ? errors1.readFaultVSDE507.value : null,
      errors1.stopInputVSDEME508 ? errors1.stopInputVSDEME508.value : null,
      errors1.seeVSDDisplayE509 ? errors1.seeVSDDisplayE509.value : null,
      errors1.speedBelowMinLimitE510 ? errors1.speedBelowMinLimitE510.value : null,
      warnings1.serviceDueA600 ? warnings1.serviceDueA600.value : null,
      warnings1.dischargeOverPressureA601 ? warnings1.dischargeOverPressureA601.value : null,
      warnings1.compressorDischargeTemperatureA602 ? warnings1.compressorDischargeTemperatureA602.value : null,
      warnings1.linePressureHighA606 ? warnings1.linePressureHighA606.value : null,
      warnings1.controllerBatteryEmptyA607 ? warnings1.controllerBatteryEmptyA607.value : null,
      warnings1.dryerA608 ? warnings1.dryerA608?.value : null,
      warnings1.condensateDrainA609 ? warnings1.condensateDrainA609.value : null,
      warnings1.fineSeparatorA610 ? warnings1.fineSeparatorA610.value : null,
      warnings1.airFilterA611 ? warnings1.airFilterA611.value : null,
      warnings1.oilFilterA612 ? warnings1.oilFilterA612.value : null,
      warnings1.oilLevelLowA613 ? warnings1.oilLevelLowA613.value : null,
      warnings1.oilTemperatureHighA614 ? warnings1.oilTemperatureHighA614.value : null,
      warnings1.externalWarningA615 ? warnings1.externalWarningA615.value : null,
      warnings1.motorLuricationSystemA616 ? warnings1.motorLuricationSystemA616.value : null,
      warnings1.input1A617 ? warnings1.input1A617.value : null,
      warnings1.input2A618 ? warnings1.input2A618.value : null,
      warnings1.input3A619 ? warnings1.input3A619.value : null,
      warnings1.input4A620 ? warnings1.input4A620.value : null,
      warnings1.input5A621 ? warnings1.input5A621.value : null,
      warnings1.input6A622 ? warnings1.input6A622.value : null,
      warnings1.fullSDCardA623 ? warnings1.fullSDCardA623.value : null,
      warnings1.temperatureHighVSDA700 ? warnings1.temperatureHighVSDA700.value : null,
      status2.serviceRequired ? status2.serviceRequired.value : null,
      errors2.powerSupplyFailureE400 ? errors2.powerSupplyFailureE400.value : null,
      errors2.emergencyStopActivatedE401 ? errors2.emergencyStopActivatedE401.value : null,
      errors2.highMotorTemperatureM1E402 ? errors2.highMotorTemperatureM1E402.value : null,
      errors2.compressorDischargeTemperatureE403 ? errors2.compressorDischargeTemperatureE403.value : null,
      errors2.startTemperatureLowE404 ? errors2.startTemperatureLowE404.value : null,
      errors2.dischargeOverPressureE405 ? errors2.dischargeOverPressureE405.value : null,
      errors2.linePressureSensorB1E406 ? errors2.linePressureSensorB1E406.value : null,
      errors2.dischargePressureSensorB2E407 ? errors2.dischargePressureSensorB2E407.value : null,
      errors2.dischargeTemperatureSensorR2E408 ? errors2.dischargeTemperatureSensorR2E408.value : null,
      errors2.controllerHardwareE409 ? errors2.controllerHardwareE409.value : null,
      errors2.coolingE410 ? errors2.coolingE410.value : null,
      errors2.oilPressureLowE411 ? errors2.oilPressureLowE411.value : null,
      errors2.externalFaultE412 ? errors2.externalFaultE412.value : null,
      errors2.dryerE413 ? errors2.dryerE413.value : null,
      errors2.condensateDrainE414 ? errors2.condensateDrainE414.value : null,
      errors2.noPressureBuildUpE415 ? errors2.noPressureBuildUpE415.value : null,
      errors2.heavyStartupE416 ? errors2.heavyStartupE416.value : null,
      errors2.preAdjustmentVSDE500 ? errors2.preAdjustmentVSDE500.value : null,
      errors2.preAdjustmentE501 ? errors2.preAdjustmentE501.value : null,
      errors2.lockedVSDE502 ? errors2.lockedVSDE502.value : null,
      errors2.writeFaultVSDE503 ? errors2.writeFaultVSDE503.value : null,
      errors2.communicationVSDE504 ? errors2.communicationVSDE504.value : null,
      errors2.stopPressedVSDE505 ? errors2.stopPressedVSDE505.value : null,
      errors2.stopInputEMVSDE506 ? errors2.stopInputEMVSDE506.value : null,
      errors2.readFaultVSDE507 ? errors2.readFaultVSDE507.value : null,
      errors2.stopInputVSDEME508 ? errors2.stopInputVSDEME508.value : null,
      errors2.seeVSDDisplayE509 ? errors2.seeVSDDisplayE509.value : null,
      errors2.speedBelowMinLimitE510 ? errors2.speedBelowMinLimitE510.value : null,
      warnings2.serviceDueA600 ? warnings2.serviceDueA600.value : null,
      warnings2.dischargeOverPressureA601 ? warnings2.dischargeOverPressureA601.value : null,
      warnings2.compressorDischargeTemperatureA602 ? warnings2.compressorDischargeTemperatureA602.value : null,
      warnings2.linePressureHighA606 ? warnings2.linePressureHighA606.value : null,
      warnings2.controllerBatteryEmptyA607 ? warnings2.controllerBatteryEmptyA607.value : null,
      warnings2.dryerA608 ? warnings2.dryerA608?.value : null,
      warnings2.condensateDrainA609 ? warnings2.condensateDrainA609.value : null,
      warnings2.fineSeparatorA610 ? warnings2.fineSeparatorA610.value : null,
      warnings2.airFilterA611 ? warnings2.airFilterA611.value : null,
      warnings2.oilFilterA612 ? warnings2.oilFilterA612.value : null,
      warnings2.oilLevelLowA613 ? warnings2.oilLevelLowA613.value : null,
      warnings2.oilTemperatureHighA614 ? warnings2.oilTemperatureHighA614.value : null,
      warnings2.externalWarningA615 ? warnings2.externalWarningA615.value : null,
      warnings2.motorLuricationSystemA616 ? warnings2.motorLuricationSystemA616.value : null,
      warnings2.input1A617 ? warnings2.input1A617.value : null,
      warnings2.input2A618 ? warnings2.input2A618.value : null,
      warnings2.input3A619 ? warnings2.input3A619.value : null,
      warnings2.input4A620 ? warnings2.input4A620.value : null,
      warnings2.input5A621 ? warnings2.input5A621.value : null,
      warnings2.input6A622 ? warnings2.input6A622.value : null,
      warnings2.fullSDCardA623 ? warnings2.fullSDCardA623.value : null,
      warnings2.temperatureHighVSDA700 ? warnings2.temperatureHighVSDA700.value : null,
    ];

    if (
      (coldGlycolChiller01 ||
        coldGlycolChiller02 ||
        comfortGlycolChiller03 ||
        errors1 ||
        status1 ||
        warnings1 ||
        errors2 ||
        status2 ||
        warnings2) &&
      (prevHVACDataLevel1.coldGlycolChiller01?.generalAlarm?.value !== coldGlycolChiller01.generalAlarm?.value ||
        prevHVACDataLevel1.coldGlycolChiller01?.compressor01Alarm?.value !==
          coldGlycolChiller01.compressor01Alarm?.value ||
        prevHVACDataLevel1.coldGlycolChiller01?.compressor02Alarm?.value !==
          coldGlycolChiller01.compressor02Alarm?.value ||
        prevHVACDataLevel1.coldGlycolChiller01?.compressor03Alarm?.value !==
          coldGlycolChiller01.compressor03Alarm?.value ||
        prevHVACDataLevel1.coldGlycolChiller02?.generalAlarm?.value !== coldGlycolChiller02.generalAlarm?.value ||
        prevHVACDataLevel1.coldGlycolChiller02?.compressor01Alarm?.value !==
          coldGlycolChiller02.compressor01Alarm?.value ||
        prevHVACDataLevel1.coldGlycolChiller02?.compressor02Alarm?.value !==
          coldGlycolChiller02.compressor02Alarm?.value ||
        prevHVACDataLevel1.coldGlycolChiller02?.compressor03Alarm?.value !==
          coldGlycolChiller02.compressor03Alarm?.value ||
        prevHVACDataLevel1.comfortGlycolChiller03?.generalAlarm?.value !== comfortGlycolChiller03.generalAlarm?.value ||
        prevHVACDataLevel1.comfortGlycolChiller03?.compressor01Alarm?.value !==
          comfortGlycolChiller03.compressor01Alarm?.value ||
        prevHVACDataLevel1.comfortGlycolChiller03?.compressor02Alarm?.value !==
          comfortGlycolChiller03.compressor02Alarm?.value ||
        prevHVACDataLevel1.comfortGlycolChiller03?.compressor03Alarm?.value !==
          comfortGlycolChiller03.compressor03Alarm?.value ||
        prevHVACDataLevel1.status1?.serviceRequired?.value != status1.serviceRequired?.value ||
        prevHVACDataLevel1.errors1?.powerSupplyFailureE400?.value != errors1.powerSupplyFailureE400?.value ||
        prevHVACDataLevel1.errors1?.emergencyStopActivatedE401?.value != errors1.emergencyStopActivatedE401?.value ||
        prevHVACDataLevel1.errors1?.highMotorTemperatureM1E402?.value != errors1.highMotorTemperatureM1E402?.value ||
        prevHVACDataLevel1.errors1?.compressorDischargeTemperatureE403?.value !=
          errors1.compressorDischargeTemperatureE403?.value ||
        prevHVACDataLevel1.errors1?.startTemperatureLowE404?.value != errors1.startTemperatureLowE404?.value ||
        prevHVACDataLevel1.errors1?.dischargeOverPressureE405?.value != errors1.dischargeOverPressureE405?.value ||
        prevHVACDataLevel1.errors1?.linePressureSensorB1E406?.value != errors1.linePressureSensorB1E406?.value ||
        prevHVACDataLevel1.errors1?.dischargePressureSensorB2E407?.value !=
          errors1.dischargePressureSensorB2E407?.value ||
        prevHVACDataLevel1.errors1?.dischargeTemperatureSensorR2E408?.value !=
          errors1.dischargeTemperatureSensorR2E408?.value ||
        prevHVACDataLevel1.errors1?.controllerHardwareE409?.value != errors1.controllerHardwareE409?.value ||
        prevHVACDataLevel1.errors1?.coolingE410?.value != errors1.coolingE410?.value ||
        prevHVACDataLevel1.errors1?.oilPressureLowE411?.value != errors1.oilPressureLowE411?.value ||
        prevHVACDataLevel1.errors1?.externalFaultE412?.value != errors1.externalFaultE412?.value ||
        prevHVACDataLevel1.errors1?.dryerE413?.value != errors1.dryerE413?.value ||
        prevHVACDataLevel1.errors1?.condensateDrainE414?.value != errors1.condensateDrainE414?.value ||
        prevHVACDataLevel1.errors1?.noPressureBuildUpE415?.value != errors1.noPressureBuildUpE415?.value ||
        prevHVACDataLevel1.errors1?.heavyStartupE416?.value != errors1.heavyStartupE416?.value ||
        prevHVACDataLevel1.errors1?.preAdjustmentVSDE500?.value != errors1.preAdjustmentVSDE500?.value ||
        prevHVACDataLevel1.errors1?.preAdjustmentE501?.value != errors1.preAdjustmentE501?.value ||
        prevHVACDataLevel1.errors1?.lockedVSDE502?.value != errors1.lockedVSDE502?.value ||
        prevHVACDataLevel1.errors1?.writeFaultVSDE503?.value != errors1.writeFaultVSDE503?.value ||
        prevHVACDataLevel1.errors1?.communicationVSDE504?.value != errors1.communicationVSDE504?.value ||
        prevHVACDataLevel1.errors1?.stopPressedVSDE505?.value != errors1.stopPressedVSDE505?.value ||
        prevHVACDataLevel1.errors1?.stopInputEMVSDE506?.value != errors1.stopInputEMVSDE506?.value ||
        prevHVACDataLevel1.errors1?.readFaultVSDE507?.value != errors1.readFaultVSDE507?.value ||
        prevHVACDataLevel1.errors1?.stopInputVSDEME508?.value != errors1.stopInputVSDEME508?.value ||
        prevHVACDataLevel1.errors1?.seeVSDDisplayE509?.value != errors1.seeVSDDisplayE509?.value ||
        prevHVACDataLevel1.errors1?.speedBelowMinLimitE510?.value != errors1.speedBelowMinLimitE510?.value ||
        prevHVACDataLevel1.warnings1?.serviceDueA600?.value != warnings1.serviceDueA600?.value ||
        prevHVACDataLevel1.warnings1?.dischargeOverPressureA601?.value != warnings1.dischargeOverPressureA601?.value ||
        prevHVACDataLevel1.warnings1?.compressorDischargeTemperatureA602?.value !=
          warnings1.compressorDischargeTemperatureA602?.value ||
        prevHVACDataLevel1.warnings1?.linePressureHighA606?.value != warnings1.linePressureHighA606?.value ||
        prevHVACDataLevel1.warnings1?.controllerBatteryEmptyA607?.value !=
          warnings1.controllerBatteryEmptyA607?.value ||
        prevHVACDataLevel1.warnings1?.dryerA608?.value != warnings1.dryerA608?.value ||
        prevHVACDataLevel1.warnings1?.condensateDrainA609?.value != warnings1.condensateDrainA609?.value ||
        prevHVACDataLevel1.warnings1?.fineSeparatorA610?.value != warnings1.fineSeparatorA610?.value ||
        prevHVACDataLevel1.warnings1?.airFilterA611?.value != warnings1.airFilterA611?.value ||
        prevHVACDataLevel1.warnings1?.oilFilterA612?.value != warnings1.oilFilterA612?.value ||
        prevHVACDataLevel1.warnings1?.oilLevelLowA613?.value != warnings1.oilLevelLowA613?.value ||
        prevHVACDataLevel1.warnings1?.oilTemperatureHighA614?.value != warnings1.oilTemperatureHighA614?.value ||
        prevHVACDataLevel1.warnings1?.externalWarningA615?.value != warnings1.externalWarningA615?.value ||
        prevHVACDataLevel1.warnings1?.motorLuricationSystemA616?.value != warnings1.motorLuricationSystemA616?.value ||
        prevHVACDataLevel1.warnings1?.input1A617?.value != warnings1.input1A617?.value ||
        prevHVACDataLevel1.warnings1?.input2A618?.value != warnings1.input2A618?.value ||
        prevHVACDataLevel1.warnings1?.input3A619?.value != warnings1.input3A619?.value ||
        prevHVACDataLevel1.warnings1?.input4A620?.value != warnings1.input4A620?.value ||
        prevHVACDataLevel1.warnings1?.input5A621?.value != warnings1.input5A621?.value ||
        prevHVACDataLevel1.warnings1?.input6A622?.value != warnings1.input6A622?.value ||
        prevHVACDataLevel1.warnings1?.fullSDCardA623?.value != warnings1.fullSDCardA623?.value ||
        prevHVACDataLevel1.warnings1?.temperatureHighVSDA700?.value != warnings1.temperatureHighVSDA700?.value ||
        prevHVACDataLevel1.status2?.serviceRequired?.value != status2.serviceRequired?.value ||
        prevHVACDataLevel1.errors2?.powerSupplyFailureE400?.value != errors2.powerSupplyFailureE400?.value ||
        prevHVACDataLevel1.errors2?.emergencyStopActivatedE401?.value != errors2.emergencyStopActivatedE401?.value ||
        prevHVACDataLevel1.errors2?.highMotorTemperatureM1E402?.value != errors2.highMotorTemperatureM1E402?.value ||
        prevHVACDataLevel1.errors2?.compressorDischargeTemperatureE403?.value !=
          errors2.compressorDischargeTemperatureE403?.value ||
        prevHVACDataLevel1.errors2?.startTemperatureLowE404?.value != errors2.startTemperatureLowE404?.value ||
        prevHVACDataLevel1.errors2?.dischargeOverPressureE405?.value != errors2.dischargeOverPressureE405?.value ||
        prevHVACDataLevel1.errors2?.linePressureSensorB1E406?.value != errors2.linePressureSensorB1E406?.value ||
        prevHVACDataLevel1.errors2?.dischargePressureSensorB2E407?.value !=
          errors2.dischargePressureSensorB2E407?.value ||
        prevHVACDataLevel1.errors2?.dischargeTemperatureSensorR2E408?.value !=
          errors2.dischargeTemperatureSensorR2E408?.value ||
        prevHVACDataLevel1.errors2?.controllerHardwareE409?.value != errors2.controllerHardwareE409?.value ||
        prevHVACDataLevel1.errors2?.coolingE410?.value != errors2.coolingE410?.value ||
        prevHVACDataLevel1.errors2?.oilPressureLowE411?.value != errors2.oilPressureLowE411?.value ||
        prevHVACDataLevel1.errors2?.externalFaultE412?.value != errors2.externalFaultE412?.value ||
        prevHVACDataLevel1.errors2?.dryerE413?.value != errors2.dryerE413?.value ||
        prevHVACDataLevel1.errors2?.condensateDrainE414?.value != errors2.condensateDrainE414?.value ||
        prevHVACDataLevel1.errors2?.noPressureBuildUpE415?.value != errors2.noPressureBuildUpE415?.value ||
        prevHVACDataLevel1.errors2?.heavyStartupE416?.value != errors2.heavyStartupE416?.value ||
        prevHVACDataLevel1.errors2?.preAdjustmentVSDE500?.value != errors2.preAdjustmentVSDE500?.value ||
        prevHVACDataLevel1.errors2?.preAdjustmentE501?.value != errors2.preAdjustmentE501?.value ||
        prevHVACDataLevel1.errors2?.lockedVSDE502?.value != errors2.lockedVSDE502?.value ||
        prevHVACDataLevel1.errors2?.writeFaultVSDE503?.value != errors2.writeFaultVSDE503?.value ||
        prevHVACDataLevel1.errors2?.communicationVSDE504?.value != errors2.communicationVSDE504?.value ||
        prevHVACDataLevel1.errors2?.stopPressedVSDE505?.value != errors2.stopPressedVSDE505?.value ||
        prevHVACDataLevel1.errors2?.stopInputEMVSDE506?.value != errors2.stopInputEMVSDE506?.value ||
        prevHVACDataLevel1.errors2?.readFaultVSDE507?.value != errors2.readFaultVSDE507?.value ||
        prevHVACDataLevel1.errors2?.stopInputVSDEME508?.value != errors2.stopInputVSDEME508?.value ||
        prevHVACDataLevel1.errors2?.seeVSDDisplayE509?.value != errors2.seeVSDDisplayE509?.value ||
        prevHVACDataLevel1.errors2?.speedBelowMinLimitE510?.value != errors2.speedBelowMinLimitE510?.value ||
        prevHVACDataLevel1.warnings2?.serviceDueA600?.value != warnings2.serviceDueA600?.value ||
        prevHVACDataLevel1.warnings2?.dischargeOverPressureA601?.value != warnings2.dischargeOverPressureA601?.value ||
        prevHVACDataLevel1.warnings2?.compressorDischargeTemperatureA602?.value !=
          warnings2.compressorDischargeTemperatureA602?.value ||
        prevHVACDataLevel1.warnings2?.linePressureHighA606?.value != warnings2.linePressureHighA606?.value ||
        prevHVACDataLevel1.warnings2?.controllerBatteryEmptyA607?.value !=
          warnings2.controllerBatteryEmptyA607?.value ||
        prevHVACDataLevel1.warnings2?.dryerA608?.value != warnings2.dryerA608?.value ||
        prevHVACDataLevel1.warnings2?.condensateDrainA609?.value != warnings2.condensateDrainA609?.value ||
        prevHVACDataLevel1.warnings2?.fineSeparatorA610?.value != warnings2.fineSeparatorA610?.value ||
        prevHVACDataLevel1.warnings2?.airFilterA611?.value != warnings2.airFilterA611?.value ||
        prevHVACDataLevel1.warnings2?.oilFilterA612?.value != warnings2.oilFilterA612?.value ||
        prevHVACDataLevel1.warnings2?.oilLevelLowA613?.value != warnings2.oilLevelLowA613?.value ||
        prevHVACDataLevel1.warnings2?.oilTemperatureHighA614?.value != warnings2.oilTemperatureHighA614?.value ||
        prevHVACDataLevel1.warnings2?.externalWarningA615?.value != warnings2.externalWarningA615?.value ||
        prevHVACDataLevel1.warnings2?.motorLuricationSystemA616?.value != warnings2.motorLuricationSystemA616?.value ||
        prevHVACDataLevel1.warnings2?.input1A617?.value != warnings2.input1A617?.value ||
        prevHVACDataLevel1.warnings2?.input2A618?.value != warnings2.input2A618?.value ||
        prevHVACDataLevel1.warnings2?.input3A619?.value != warnings2.input3A619?.value ||
        prevHVACDataLevel1.warnings2?.input4A620?.value != warnings2.input4A620?.value ||
        prevHVACDataLevel1.warnings2?.input5A621?.value != warnings2.input5A621?.value ||
        prevHVACDataLevel1.warnings2?.input6A622?.value != warnings2.input6A622?.value ||
        prevHVACDataLevel1.warnings2?.fullSDCardA623?.value != warnings2.fullSDCardA623?.value ||
        prevHVACDataLevel1.warnings2?.temperatureHighVSDA700?.value != warnings2.temperatureHighVSDA700?.value)
    ) {
      const isAlarmed_1 = alarms_1.some((a) => {
        return a;
      });
      this.setAlarms('level_1', isAlarmed_1);
    }

    const alarms_2 = [
      crac01.alarmPresentState ? crac01.alarmPresentState.value : null,
      crac02.alarmPresentState ? crac02.alarmPresentState.value : null,
    ];

    if (
      (crac01 || crac01) &&
      (prevHVACDataLevel2.crac01?.alarmPresentState?.value !== crac01.alarmPresentState?.value ||
        prevHVACDataLevel2.crac02?.alarmPresentState?.value !== crac02.alarmPresentState?.value)
    ) {
      const isAlarmed_2 = alarms_2.some((a) => {
        return a;
      });
      this.setAlarms('level_2', isAlarmed_2);
    }

    const alarms_4 = [
      airHandlingUnit05WhiteRoom.generalAlarm ? airHandlingUnit05WhiteRoom.generalAlarm.value : null,
      airHandlingUnit05WhiteRoom.filterAlarm ? airHandlingUnit05WhiteRoom.filterAlarm.value : null,
      airHandlingUnit05WhiteRoom.alarmReset ? airHandlingUnit05WhiteRoom.alarmReset.value : null,
      airHandlingUnit06CleanRoom.generalAlarm ? airHandlingUnit06CleanRoom.generalAlarm.value : null,
      airHandlingUnit06CleanRoom.filterAlarm ? airHandlingUnit06CleanRoom.filterAlarm.value : null,
      airHandlingUnit06CleanRoom.alarmReset ? airHandlingUnit06CleanRoom.alarmReset.value : null,
      airExtractionFan04Dome.thermalFault ? airExtractionFan04Dome.thermalFault.value : null,
      airExtractionFan03HighBay.thermalFault ? airExtractionFan03HighBay.thermalFault.value : null,
    ];

    if (
      (airHandlingUnit05WhiteRoom ||
        airHandlingUnit06CleanRoom ||
        airExtractionFan03HighBay ||
        airExtractionFan04Dome) &&
      (prevHVACDataLevel4.airHandlingUnit05WhiteRoom?.generalAlarm?.value !==
        airHandlingUnit05WhiteRoom.generalAlarm?.value ||
        prevHVACDataLevel4.airHandlingUnit05WhiteRoom?.filterAlarm?.value !==
          airHandlingUnit05WhiteRoom.filterAlarm?.value ||
        prevHVACDataLevel4.airHandlingUnit05WhiteRoom?.alarmReset?.value !==
          airHandlingUnit05WhiteRoom.alarmReset?.value ||
        prevHVACDataLevel4.airHandlingUnit06CleanRoom?.generalAlarm?.value !==
          airHandlingUnit06CleanRoom.generalAlarm?.value ||
        prevHVACDataLevel4.airHandlingUnit06CleanRoom?.filterAlarm?.value !==
          airHandlingUnit06CleanRoom.filterAlarm?.value ||
        prevHVACDataLevel4.airHandlingUnit06CleanRoom?.alarmReset?.value !==
          airHandlingUnit06CleanRoom.alarmReset?.value ||
        prevHVACDataLevel4.airExtractionFan03HighBay?.thermalFault?.value !==
          airExtractionFan03HighBay.thermalFault?.value ||
        prevHVACDataLevel4.airExtractionFan04Dome?.thermalFault?.value !== airExtractionFan04Dome.thermalFault?.value)
    ) {
      const isAlarmed_4 = alarms_4.some((a) => {
        return a;
      });
      this.setAlarms('level_4', isAlarmed_4);
    }

    const alarms_5 = [
      dynaleneEvents?.dynMainGridAlarm?.value,
      dynaleneEvents?.dynMainGridFailureFlag?.value,
      dynaleneEvents?.dynSafetyResetFlag?.value,
      dynaleneEvents?.dynTAalarm?.value,
      dynaleneEvents?.dynTMAalarm?.value,
      dynaleneEvents?.dynaleneTankLevel?.value === 0,
      airHandlingUnit01Dome.generalAlarm?.value,
      airHandlingUnit01Dome.filterAlarm?.value,
      airHandlingUnit01Dome.alarmReset?.value,
      airHandlingUnit02Dome.generalAlarm?.value,
      airHandlingUnit02Dome.filterAlarm?.value,
      airHandlingUnit02Dome.alarmReset?.value,
      airHandlingUnit03Dome.generalAlarm?.value,
      airHandlingUnit03Dome.filterAlarm?.value,
      airHandlingUnit03Dome.alarmReset?.value,
      airHandlingUnit04Dome.generalAlarm?.value,
      airHandlingUnit04Dome.filterAlarm?.value,
      airHandlingUnit04Dome.alarmReset?.value,
      airCirculationFan01Lab.thermalFault?.value,
      airCirculationFan08Pier.thermalFault?.value,
      airCirculationFan09Pier.thermalFault?.value,
      airCirculationFan10Pier.thermalFault?.value,
      airCirculationFan11Pier.thermalFault?.value,
      airCirculationFan12Pier.thermalFault?.value,
      airCirculationFan13Pier.thermalFault?.value,
      airCirculationFan14Pier.thermalFault?.value,
      airCirculationFan15Pier.thermalFault?.value,
      airCirculationFan16Lab.thermalFault?.value,
      airCirculationFan17Lab.thermalFault?.value,
    ];

    if (
      (dynaleneEvents ||
        airHandlingUnit01Dome ||
        airHandlingUnit02Dome ||
        airHandlingUnit03Dome ||
        airHandlingUnit04Dome ||
        airCirculationFan01Lab ||
        airCirculationFan08Pier ||
        airCirculationFan09Pier ||
        airCirculationFan10Pier ||
        airCirculationFan11Pier ||
        airCirculationFan12Pier ||
        airCirculationFan13Pier ||
        airCirculationFan14Pier ||
        airCirculationFan15Pier ||
        airCirculationFan16Lab ||
        airCirculationFan17Lab) &&
      (prevHVACDataLevel5.dynaleneEvents?.dynMainGridAlarm?.value !== dynaleneEvents?.dynMainGridAlarm?.value ||
        prevHVACDataLevel5.dynaleneEvents?.dynMainGridFailureFlag?.value !==
          dynaleneEvents?.dynMainGridFailureFlag?.value ||
        prevHVACDataLevel5.dynaleneEvents?.dynSafetyResetFlag?.value !== dynaleneEvents?.dynSafetyResetFlag?.value ||
        prevHVACDataLevel5.dynaleneEvents?.dynTAalarm?.value !== dynaleneEvents?.dynTAalarm?.value ||
        prevHVACDataLevel5.dynaleneEvents?.dynTMAalarm?.value !== dynaleneEvents?.dynTMAalarm?.value ||
        prevHVACDataLevel5.dynaleneEvents?.dynaleneTankLevel?.value !== dynaleneEvents?.dynaleneTankLevel?.value ||
        prevHVACDataLevel5.dynaleneEvents?.dynMainGridAlarm?.value !== dynaleneEvents?.dynMainGridAlarm?.value ||
        prevHVACDataLevel5.dynaleneEvents?.dynMainGridAlarm?.value !== dynaleneEvents?.dynMainGridAlarm?.value ||
        prevHVACDataLevel5.airHandlingUnit01Dome?.generalAlarm?.value !== airHandlingUnit01Dome.generalAlarm?.value ||
        prevHVACDataLevel5.airHandlingUnit01Dome?.filterAlarm?.value !== airHandlingUnit01Dome.filterAlarm?.value ||
        prevHVACDataLevel5.airHandlingUnit01Dome?.alarmReset?.value !== airHandlingUnit01Dome.alarmReset?.value ||
        prevHVACDataLevel5.airHandlingUnit02Dome?.generalAlarm?.value !== airHandlingUnit02Dome.generalAlarm?.value ||
        prevHVACDataLevel5.airHandlingUnit02Dome?.filterAlarm?.value !== airHandlingUnit02Dome.filterAlarm?.value ||
        prevHVACDataLevel5.airHandlingUnit02Dome?.alarmReset?.value !== airHandlingUnit02Dome.alarmReset?.value ||
        prevHVACDataLevel5.airHandlingUnit03Dome?.generalAlarm?.value !== airHandlingUnit03Dome.generalAlarm?.value ||
        prevHVACDataLevel5.airHandlingUnit03Dome?.filterAlarm?.value !== airHandlingUnit03Dome.filterAlarm?.value ||
        prevHVACDataLevel5.airHandlingUnit03Dome?.alarmReset?.value !== airHandlingUnit03Dome.alarmReset?.value ||
        prevHVACDataLevel5.airHandlingUnit04Dome?.generalAlarm?.value !== airHandlingUnit04Dome.generalAlarm?.value ||
        prevHVACDataLevel5.airHandlingUnit04Dome?.filterAlarm?.value !== airHandlingUnit04Dome.filterAlarm?.value ||
        prevHVACDataLevel5.airHandlingUnit04Dome?.alarmReset?.value !== airHandlingUnit04Dome.alarmReset?.value ||
        prevHVACDataLevel5.airCirculationFan01Lab?.thermalFault?.value !== airCirculationFan01Lab.thermalFault?.value ||
        prevHVACDataLevel5.airCirculationFan08Pier?.thermalFault?.value !==
          airCirculationFan08Pier.thermalFault?.value ||
        prevHVACDataLevel5.airCirculationFan09Pier?.thermalFault?.value !==
          airCirculationFan09Pier.thermalFault?.value ||
        prevHVACDataLevel5.airCirculationFan10Pier?.thermalFault?.value !==
          airCirculationFan10Pier.thermalFault?.value ||
        prevHVACDataLevel5.airCirculationFan11Pier?.thermalFault?.value !==
          airCirculationFan11Pier.thermalFault?.value ||
        prevHVACDataLevel5.airCirculationFan12Pier?.thermalFault?.value !==
          airCirculationFan12Pier.thermalFault?.value ||
        prevHVACDataLevel5.airCirculationFan13Pier?.thermalFault?.value !==
          airCirculationFan13Pier.thermalFault?.value ||
        prevHVACDataLevel5.airCirculationFan14Pier?.thermalFault?.value !==
          airCirculationFan14Pier.thermalFault?.value ||
        prevHVACDataLevel5.airCirculationFan15Pier?.thermalFault?.value !==
          airCirculationFan15Pier.thermalFault?.value ||
        prevHVACDataLevel5.airCirculationFan16Lab?.thermalFault?.value !== airCirculationFan16Lab.thermalFault?.value ||
        prevHVACDataLevel5.airCirculationFan17Lab?.thermalFault?.value !== airCirculationFan17Lab.thermalFault?.value)
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
