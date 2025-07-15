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

/* eslint-disable global-require */
/**
 * Important!!
 *
 * Two or more instances with the same name cannot exist. For example, there cannot be two M1M3
 */

const defaultSchemaProps = {
  titleBar: {
    type: 'boolean',
    description: 'Whether to display the title bar',
    isPrivate: false,
    default: true,
  },
  title: {
    type: 'string',
    description: 'Name diplayed in the title bar (if visible)',
    isPrivate: false,
    default: 'Title',
  },
  link: {
    type: 'string',
    description: 'Internal or external link displayed in the title bar (if visible)',
    isPrivate: false,
    default: '',
  },
  margin: {
    type: 'boolean',
    description: 'Whether to display component with a margin',
    isPrivate: false,
    default: true,
  },
  hasRawMode: {
    type: 'boolean',
    description: 'Whether the component has a raw mode version',
    isPrivate: true,
    default: true,
  },
};

export const observatoryIndex = {
  ScriptQueue: {
    component: require('../ScriptQueue/ScriptQueue.container').default,
    schema: {
      ...require('../ScriptQueue/ScriptQueue.container').schema,
      props: {
        ...defaultSchemaProps,
        ...require('../ScriptQueue/ScriptQueue.container').schema.props,
      },
    },
  },
  DataManagementFlow: {
    component: require('../DataManagementFlow/DataManagementFlow.container').default,
    schema: {
      ...require('../DataManagementFlow/DataManagementFlow.container').schema,
      props: {
        ...defaultSchemaProps,
        ...require('../DataManagementFlow/DataManagementFlow.container').schema.props,
      },
    },
  },
  CSCDetail: {
    component: require('../CSCSummary/CSCDetail/CSCDetail.container').default,
    schema: {
      ...require('../CSCSummary/CSCDetail/CSCDetail.container').schema,
      props: {
        ...defaultSchemaProps,
        ...require('../CSCSummary/CSCDetail/CSCDetail.container').schema.props,
      },
    },
  },
  AircraftTracker: {
    component: require('../FlightTracker/FlightTracker.container').default,
    schema: {
      ...require('../FlightTracker/FlightTracker.container').schema,
      props: {
        ...defaultSchemaProps,
        ...require('../FlightTracker/FlightTracker.container').schema.props,
      },
    },
  },
  CSCExpanded: {
    component: require('../CSCSummary/CSCExpanded/CSCExpanded.container').default,
    schema: {
      ...require('../CSCSummary/CSCExpanded/CSCExpanded.container').schema,
      props: {
        ...defaultSchemaProps,
        ...require('../CSCSummary/CSCExpanded/CSCExpanded.container').schema.props,
      },
    },
  },
  CSCGroupLog: {
    component: require('../CSCSummary/CSCGroupLog/CSCGroupLog.container').default,
    schema: {
      ...require('../CSCSummary/CSCGroupLog/CSCGroupLog.container').schema,
      props: {
        ...defaultSchemaProps,
        ...require('../CSCSummary/CSCGroupLog/CSCGroupLog.container').schema.props,
      },
    },
  },
  CSCGroup: {
    component: require('../CSCSummary/CSCGroup/CSCGroup.container').default,
    schema: {
      ...require('../CSCSummary/CSCGroup/CSCGroup.container').schema,
      props: {
        ...defaultSchemaProps,
        ...require('../CSCSummary/CSCGroup/CSCGroup.container').schema.props,
      },
    },
  },
  CSCSummary: {
    component: require('../CSCSummary/CSCSummary.container').default,
    schema: {
      ...require('../CSCSummary/CSCSummary.container').schema,
      props: {
        ...defaultSchemaProps,
        ...require('../CSCSummary/CSCSummary.container').schema.props,
      },
    },
  },
  CSCSummaryIcon: {
    component: require('../CSCSummary/CSCSummaryIcon/CSCSummaryIcon.container').default,
    schema: {
      ...require('../CSCSummary/CSCSummaryIcon/CSCSummaryIcon.container').schema,
      props: {
        ...defaultSchemaProps,
        ...require('../CSCSummary/CSCSummaryIcon/CSCSummaryIcon.container').schema.props,
      },
    },
  },
  Watcher: {
    component: require('../Watcher/Watcher.container').default,
    schema: {
      ...require('../Watcher/Watcher.container').schema,
      props: {
        ...defaultSchemaProps,
        ...require('../Watcher/Watcher.container').schema.props,
      },
    },
  },
  GenericCameraView: {
    component: require('../GenericCamera/GenericCameraView.container').default,
    schema: {
      ...require('../GenericCamera/GenericCameraView.container').schema,
      props: {
        ...defaultSchemaProps,
        ...require('../GenericCamera/GenericCameraView.container').schema.props,
      },
    },
  },
  ObservingLogInput: {
    component: require('../ObservingLog/ObservingLogInput.container').default,
    schema: {
      ...require('../ObservingLog/ObservingLogInput.container').schema,
      props: {
        ...defaultSchemaProps,
        ...require('../ObservingLog/ObservingLogInput.container').schema.props,
      },
    },
  },
  ObservingLogMessages: {
    component: require('../ObservingLog/ObservingLogMessages.container').default,
    schema: {
      ...require('../ObservingLog/ObservingLogMessages.container').schema,
      props: {
        ...defaultSchemaProps,
        ...require('../ObservingLog/ObservingLogMessages.container').schema.props,
      },
    },
  },
  Scheduler: {
    component: require('../Scheduler/Scheduler.container').default,
    schema: {
      ...require('../Scheduler/Scheduler.container').schema,
      props: {
        ...defaultSchemaProps,
        ...require('../Scheduler/Scheduler.container').schema.props,
      },
    },
  },
  EnvironmentSummary: {
    component: require('../EnvironmentSummary/EnvironmentSummary.container').default,
    schema: {
      ...require('../EnvironmentSummary/EnvironmentSummary.container').schema,
      props: {
        ...defaultSchemaProps,
        ...require('../EnvironmentSummary/EnvironmentSummary.container').schema.props,
      },
    },
  },
  GIS: {
    component: require('../GIS/GIS.container').default,
    schema: {
      ...require('../GIS/GIS.container').schema,
      props: {
        ...defaultSchemaProps,
        ...require('../GIS/GIS.container').schema.props,
      },
    },
  },
  Network: {
    component: require('../Network/Network.container').default,
    schema: {
      ...require('../Network/Network.container').schema,
      props: {
        ...defaultSchemaProps,
        ...require('../Network/Network.container').schema.props,
      },
    },
  },
  Microphones: {
    component: require('../Mics/Mics.container').default,
    schema: {
      ...require('../Mics/Mics.container').schema,
      props: {
        ...defaultSchemaProps,
        ...require('../Mics/Mics.container').schema.props,
      },
    },
  },
  WeatherStation: {
    component: require('../WeatherStation/WeatherStation.container').default,
    schema: {
      ...require('../WeatherStation/WeatherStation.container').schema,
      props: {
        ...defaultSchemaProps,
        ...require('../WeatherStation/WeatherStation.container').schema.props,
      },
    },
  },
  FacilityMap: {
    component: require('../Facility/FacilityMap.container').default,
    schema: {
      ...require('../Facility/FacilityMap.container').schema,
      props: {
        ...defaultSchemaProps,
        ...require('../Facility/FacilityMap.container').schema.props,
      },
    },
  },
  Dynalene: {
    component: require('../Dynalene/Dynalene.container').default,
    schema: {
      ...require('../Dynalene/Dynalene.container').schema,
      props: {
        ...defaultSchemaProps,
        ...require('../Dynalene/Dynalene.container').schema.props,
      },
    },
  },
  WeatherForecast: {
    component: require('../WeatherForecast/WeatherForecast.container').default,
    schema: {
      ...require('../WeatherForecast/WeatherForecast.container').schema,
      props: {
        ...defaultSchemaProps,
        ...require('../WeatherForecast/WeatherForecast.container').schema.props,
      },
    },
  },
  WindPlotForecast: {
    component: require('../WeatherForecast/PlotsContainer/WindPlot.container').default,
    schema: {
      ...require('../WeatherForecast/PlotsContainer/WindPlot.container').schema,
      props: {
        ...defaultSchemaProps,
        ...require('../WeatherForecast/PlotsContainer/WindPlot.container').schema.props,
      },
    },
  },
  TemperaturePlotForecast: {
    component: require('../WeatherForecast/PlotsContainer/TemperaturePlot.container').default,
    schema: {
      ...require('../WeatherForecast/PlotsContainer/TemperaturePlot.container').schema,
      props: {
        ...defaultSchemaProps,
        ...require('../WeatherForecast/PlotsContainer/TemperaturePlot.container').schema.props,
      },
    },
  },
  RainPlotForecast: {
    component: require('../WeatherForecast/PlotsContainer/RainPlot.container').default,
    schema: {
      ...require('../WeatherForecast/PlotsContainer/RainPlot.container').schema,
      props: {
        ...defaultSchemaProps,
        ...require('../WeatherForecast/PlotsContainer/RainPlot.container').schema.props,
      },
    },
  },
  CloudPlotForecast: {
    component: require('../WeatherForecast/PlotsContainer/CloudPlot.container').default,
    schema: {
      ...require('../WeatherForecast/PlotsContainer/CloudPlot.container').schema,
      props: {
        ...defaultSchemaProps,
        ...require('../WeatherForecast/PlotsContainer/CloudPlot.container').schema.props,
      },
    },
  },
  InfoHeaderForecast: {
    component: require('../WeatherForecast/InfoHeader/InfoHeader.container').default,
    schema: {
      ...require('../WeatherForecast/InfoHeader/InfoHeader.container').schema,
      props: {
        ...defaultSchemaProps,
        ...require('../WeatherForecast/InfoHeader/InfoHeader.container').schema.props,
      },
    },
  },
  TimeDisplay: {
    component: require('../Time/TimeDisplay.container').default,
    schema: require('../Time/TimeDisplay.container').schema,
  },
  GenericCameraControls: {
    component: require('../GenericCamera/GenericCameraControls.container').default,
    schema: {
      ...require('../GenericCamera/GenericCameraControls.container').schema,
      props: {
        ...defaultSchemaProps,
        ...require('../GenericCamera/GenericCameraControls.container').schema.props,
      },
    },
  },
  OLE: {
    component: require('../OLE/OLE.container').default,
    schema: {
      ...require('../OLE/OLE.container').schema,
      props: {
        ...defaultSchemaProps,
        ...require('../OLE/OLE.container').schema.props,
      },
    },
  },
  CreateOLE: {
    component: require('../OLE/CreateOLE.container').default,
    schema: {
      ...require('../OLE/CreateOLE.container').schema,
      props: {
        ...defaultSchemaProps,
        ...require('../OLE/CreateOLE.container').schema.props,
      },
    },
  },
  CreateNightReport: {
    component: require('../NightReport/CreateNightReport.container').default,
    schema: {
      ...require('../NightReport/CreateNightReport.container').schema,
      props: {
        ...defaultSchemaProps,
        ...require('../NightReport/CreateNightReport.container').schema.props,
      },
    },
  },
  HistoricNightReport: {
    component: require('../NightReport/HistoricNightReport.container').default,
    schema: {
      ...require('../NightReport/HistoricNightReport.container').schema,
      props: {
        ...defaultSchemaProps,
        ...require('../NightReport/HistoricNightReport.container').schema.props,
      },
    },
  },
  ObservatorySummary: {
    component: require('../ObservatorySummary/ObservatorySummary.container').default,
    schema: {
      ...require('../ObservatorySummary/ObservatorySummary.container').schema,
      props: {
        ...defaultSchemaProps,
        ...require('../ObservatorySummary/ObservatorySummary.container').schema.props,
      },
    },
  },
};

export const auxtelIndex = {
  MountSummaryPanel: {
    component: require('../AuxTel/Mount/SummaryPanel/SummaryPanel.container').default,
    schema: {
      ...require('../AuxTel/Mount/SummaryPanel/SummaryPanel.container').schema,
      props: {
        ...defaultSchemaProps,
        ...require('../AuxTel/Mount/SummaryPanel/SummaryPanel.container').schema.props,
      },
    },
  },
  LightPath: {
    component: require('../AuxTel/Mount/LightPath.container').default,
    schema: {
      ...require('../AuxTel/Mount/LightPath.container').schema,
      props: {
        ...defaultSchemaProps,
        ...require('../AuxTel/Mount/LightPath.container').schema.props,
      },
    },
  },
  MotorTable: {
    component: require('../AuxTel/Mount/MotorTable/MotorTable.container').default,
    schema: {
      ...require('../AuxTel/Mount/MotorTable/MotorTable.container').schema,
      props: {
        ...defaultSchemaProps,
        ...require('../AuxTel/Mount/MotorTable/MotorTable.container').schema.props,
      },
    },
  },
  Camera: {
    component: require('../AuxTel/Camera/Camera.container').default,
    schema: {
      ...require('../AuxTel/Camera/Camera.container').schema,
      props: {
        ...defaultSchemaProps,
        ...require('../AuxTel/Camera/Camera.container').schema.props,
      },
    },
  },
  Dome: {
    component: require('../AuxTel/Dome/Dome.container').default,
    schema: {
      ...require('../AuxTel/Dome/Dome.container').schema,
      props: {
        ...defaultSchemaProps,
        ...require('../AuxTel/Dome/Dome.container').schema.props,
      },
    },
  },
  LATISS: {
    component: require('../AuxTel/LATISS/LATISS.container').default,
    schema: {
      ...require('../AuxTel/LATISS/LATISS.container').schema,
      props: {
        ...defaultSchemaProps,
        ...require('../AuxTel/LATISS/LATISS.container').schema.props,
      },
    },
  },
  AuxTelESS: {
    component: require('../ESS/AuxTel/AuxTelESS.container').default,
    schema: {
      ...require('../ESS/AuxTel/AuxTelESS.container').schema,
      props: {
        ...defaultSchemaProps,
        ...require('../ESS/AuxTel/AuxTelESS.container').schema.props,
      },
    },
  },
};

export const mainIndex = {
  CableWraps: {
    component: require('../MainTel/CableWraps/CableWraps.container').default,
    schema: {
      ...require('../MainTel/CableWraps/CableWraps.container').schema,
      props: {
        ...defaultSchemaProps,
        ...require('../MainTel/CableWraps/CableWraps.container').schema.props,
      },
    },
  },
  M1M3: {
    component: require('../MainTel/M1M3/M1M3.container').default,
    schema: {
      ...require('../MainTel/M1M3/M1M3.container').schema,
      props: {
        ...defaultSchemaProps,
        ...require('../MainTel/M1M3/M1M3.container').schema.props,
      },
    },
  },
  M1M3Table: {
    component: require('../MainTel/M1M3/M1M3Table.container').default,
    schema: {
      ...require('../MainTel/M1M3/M1M3Table.container').schema,
      props: {
        ...defaultSchemaProps,
        ...require('../MainTel/M1M3/M1M3Table.container').schema.props,
      },
    },
  },
  M1M3TS: {
    component: require('../MainTel/M1M3TS/M1M3TS.container').default,
    schema: {
      ...require('../MainTel/M1M3TS/M1M3TS.container').schema,
      props: {
        ...defaultSchemaProps,
        ...require('../MainTel/M1M3TS/M1M3TS.container').schema.props,
      },
    },
  },
  M1M3Compact: {
    component: require('../MainTel/M1M3/M1M3Compact.container').default,
    schema: {
      ...require('../MainTel/M1M3/M1M3Compact.container').schema,
      props: {
        ...defaultSchemaProps,
        ...require('../MainTel/M1M3/M1M3Compact.container').schema.props,
      },
    },
  },
  M1M3HardpointsDataTable: {
    component: require('../MainTel/M1M3/M1M3HardpointsDataTable.container').default,
    schema: {
      ...require('../MainTel/M1M3/M1M3HardpointsDataTable.container').schema,
      props: {
        ...defaultSchemaProps,
        ...require('../MainTel/M1M3/M1M3HardpointsDataTable.container').schema.props,
      },
    },
  },
  GlycolLoop: {
    component: require('../MainTel/GlycolLoop/GlycolLoop.container').default,
    schema: {
      ...require('../MainTel/GlycolLoop/GlycolLoop.container').schema,
      props: {
        ...defaultSchemaProps,
        ...require('../MainTel/GlycolLoop/GlycolLoop.container').schema.props,
      },
    },
  },
  M1M3BumpTests: {
    component: require('../MainTel/M1M3/BumpTests.container').default,
    schema: {
      ...require('../MainTel/M1M3/BumpTests.container').schema,
      props: {
        ...defaultSchemaProps,
        ...require('../MainTel/M1M3/BumpTests.container').schema.props,
      },
    },
  },
  M2: {
    component: require('../MainTel/M2/M2.container').default,
    schema: {
      ...require('../MainTel/M2/M2.container').schema,
      props: {
        ...defaultSchemaProps,
        ...require('../MainTel/M2/M2.container').schema.props,
      },
    },
  },
  M2Table: {
    component: require('../MainTel/M2/M2Table.container').default,
    schema: {
      ...require('../MainTel/M2/M2Table.container').schema,
      props: {
        ...defaultSchemaProps,
        ...require('../MainTel/M2/M2Table.container').schema.props,
      },
    },
  },
  M2Compact: {
    component: require('../MainTel/M2/M2Compact.container').default,
    schema: {
      ...require('../MainTel/M2/M2Compact.container').schema,
      props: {
        ...defaultSchemaProps,
        ...require('../MainTel/M2/M2Compact.container').schema.props,
      },
    },
  },
  SimonyiDome: {
    component: require('../MainTel/MTDome/MTDome.container').default,
    schema: {
      ...require('../MainTel/MTDome/MTDome.container').schema,
      props: {
        ...defaultSchemaProps,
        ...require('../MainTel/MTDome/MTDome.container').schema.props,
      },
    },
  },
  SimonyiDomePower: {
    component: require('../MainTel/MTDomePower/MTDomePower.container').default,
    schema: {
      ...require('../MainTel/MTDomePower/MTDomePower.container').schema,
      props: {
        ...defaultSchemaProps,
        ...require('../MainTel/MTDomePower/MTDomePower.container').schema.props,
      },
    },
  },
  TMA: {
    component: require('../MainTel/TMA/TMA.container').default,
    schema: {
      ...require('../MainTel/TMA/TMA.container').schema,
      props: {
        ...defaultSchemaProps,
        ...require('../MainTel/TMA/TMA.container').schema.props,
      },
    },
  },
  MTIS: {
    component: require('../MainTel/MTIS/MTIS.container').default,
    schema: {
      ...require('../MainTel/MTIS/MTIS.container').schema,
      props: {
        ...defaultSchemaProps,
        ...require('../MainTel/MTIS/MTIS.container').schema.props,
      },
    },
  },
};

export const mainCameraIndex = {
  CameraHexapod: {
    component: require('../MainTel/CameraHexapod/CameraHexapod.container').default,
    schema: {
      ...require('../MainTel/CameraHexapod/CameraHexapod.container').schema,
      props: {
        ...defaultSchemaProps,
        ...require('../MainTel/CameraHexapod/CameraHexapod.container').schema.props,
      },
    },
  },
  SimonyiLightPath: {
    component: require('../MainTel/LightPath/SimonyiLightPath.container').default,
    schema: {
      ...require('../MainTel/LightPath/SimonyiLightPath.container').schema,
      props: {
        ...defaultSchemaProps,
        ...require('../MainTel/LightPath/SimonyiLightPath.container').schema.props,
      },
    },
  },
  MTCamera: {
    component: require('../MainTel/MTCamera/MTCamera.container').default,
    schema: {
      ...require('../MainTel/MTCamera/MTCamera.container').schema,
      props: {
        ...defaultSchemaProps,
        ...require('../MainTel/MTCamera/MTCamera.container').schema.props,
      },
    },
  },
  MTCameraSummaryDetail: {
    component: require('../MainTel/MTCameraSummaryDetail/MTCameraSummaryDetail.container').default,
    schema: {
      ...require('../MainTel/MTCameraSummaryDetail/MTCameraSummaryDetail.container').schema,
      props: {
        ...defaultSchemaProps,
        ...require('../MainTel/MTCameraSummaryDetail/MTCameraSummaryDetail.container').schema.props,
      },
    },
  },
  CCCamera: {
    component: require('../MainTel/CCCamera/CCCamera.container').default,
    schema: {
      ...require('../MainTel/CCCamera/CCCamera.container').schema,
      props: {
        ...defaultSchemaProps,
        ...require('../MainTel/CCCamera/CCCamera.container').schema.props,
      },
    },
  },
  CCCameraSummaryDetail: {
    component: require('../MainTel/CCCameraSummaryDetail/CCCameraSummaryDetail.container').default,
    schema: {
      ...require('../MainTel/CCCameraSummaryDetail/CCCameraSummaryDetail.container').schema,
      props: {
        ...defaultSchemaProps,
        ...require('../MainTel/CCCameraSummaryDetail/CCCameraSummaryDetail.container').schema.props,
      },
    },
  },
  MainTelESS: {
    component: require('../ESS/MainTel/MainTelESS.container').default,
    schema: {
      ...require('../ESS/MainTel/MainTelESS.container').schema,
      props: {
        ...defaultSchemaProps,
        ...require('../ESS/MainTel/MainTelESS.container').schema.props,
      },
    },
  },
};

const environmentIndex = {
  CloudMap: {
    component: require('../EmbeddedView/custom/CloudMapView.container').default,
    schema: {
      ...require('../EmbeddedView/custom/CloudMapView.container').schema,
      props: {
        ...defaultSchemaProps,
        ...require('../EmbeddedView/custom/CloudMapView.container').schema.props,
      },
    },
  },
};

export const utilitiesIndex = {
  LabeledStatusText: {
    component: require('../GeneralPurpose/LabeledStatusText/LabeledStatusText.container').default,
    schema: {
      ...require('../GeneralPurpose/LabeledStatusText/LabeledStatusText.container').schema,
      props: {
        ...defaultSchemaProps,
        ...require('../GeneralPurpose/LabeledStatusText/LabeledStatusText.container').schema.props,
      },
    },
  },
  HealthStatusSummary: {
    component: require('../HealthStatusSummary/HealthStatusSummary.container').default,
    schema: {
      ...require('../HealthStatusSummary/HealthStatusSummary.container').schema,
      props: {
        ...defaultSchemaProps,
        ...require('../HealthStatusSummary/HealthStatusSummary.container').schema.props,
      },
    },
  },
  Clock: {
    component: require('../Time/Clock/Clock.container').default,
    schema: require('../Time/Clock/Clock.container').schema,
  },
  VegaCustomPlot: {
    component: require('../GeneralPurpose/Plot/VegaCustomPlot/VegaCustomPlot.container').default,
    schema: require('../GeneralPurpose/Plot/VegaCustomPlot/VegaCustomPlot.container').schema,
  },
  VegaTimeSeriesPlot: {
    component: require('../GeneralPurpose/Plot/Plot.container.jsx').default,
    schema: require('../GeneralPurpose/Plot/Plot.container.jsx').schema,
  },
  PolarPlot: {
    component: require('../GeneralPurpose/Plot/PolarPlot/PolarPlot.container').default,
    schema: require('../GeneralPurpose/Plot/PolarPlot/PolarPlot.container').schema,
  },
  EmbeddedView: {
    component: require('../EmbeddedView/EmbeddedView.container').default,
    schema: {
      ...require('../EmbeddedView/EmbeddedView.container').schema,
      props: {
        ...defaultSchemaProps,
        ...require('../EmbeddedView/EmbeddedView.container').schema.props,
      },
    },
  },
  SubscriptionTable: {
    component: require('../GeneralPurpose/SubscriptionTable/SubscriptionTable.container').default,
    schema: {
      ...require('../GeneralPurpose/SubscriptionTable/SubscriptionTable.container').schema,
      props: {
        ...defaultSchemaProps,
        ...require('../GeneralPurpose/SubscriptionTable/SubscriptionTable.container').schema.props,
      },
    },
  },
  EventLog: {
    component: require('../EventLog/EventLog.container').default,
    schema: {
      ...require('../EventLog/EventLog.container').schema,
      props: {
        ...defaultSchemaProps,
        ...require('../EventLog/EventLog.container').schema.props,
      },
    },
  },
  CommandPanel: {
    component: require('../CommandPanel/CommandPanel.container').default,
    schema: {
      ...require('../CommandPanel/CommandPanel.container').schema,
      props: {
        ...defaultSchemaProps,
        ...require('../CommandPanel/CommandPanel.container').schema.props,
      },
    },
  },
  TCSCommands: {
    component: require('../TCSCommands/TCSCommands.container').default,
    schema: {
      ...require('../TCSCommands/TCSCommands.container').schema,
      props: {
        ...defaultSchemaProps,
        ...require('../TCSCommands/TCSCommands.container').schema.props,
      },
    },
  },
  TCSOffset: {
    component: require('../TCSCommands/TCSOffset/TCSOffset.container').default,
    schema: {
      ...require('../TCSCommands/TCSOffset/TCSOffset.container').schema,
      props: {
        ...defaultSchemaProps,
        ...require('../TCSCommands/TCSOffset/TCSOffset.container').schema.props,
      },
    },
  },
};

export const internalIndex = {
  // TelemetryLog: {
  //   component: require('../TelemetryLog/TelemetryLog.container').default,
  //   schema: {
  //     ...require('../TelemetryLog/TelemetryLog.container').schema,
  //     props: {
  //       ...defaultSchemaProps,
  //       ...require('../TelemetryLog/TelemetryLog.container').schema.props,
  //     }
  //   },
  // },
  TelemetryLog: {
    component: require('../TelemetryLog/TelemetryLog.container').default,
    schema: require('../TelemetryLog/TelemetryLog.container').schema,
  },
};

export const indexes = [
  {
    name: 'Observatory',
    index: observatoryIndex,
  },
  {
    name: 'Auxiliary Telescope',
    index: auxtelIndex,
  },
  {
    name: 'Simonyi Telescope',
    index: mainIndex,
  },
  {
    name: 'Simonyi Camera',
    index: mainCameraIndex,
  },
  {
    name: 'Environment',
    index: environmentIndex,
  },
  {
    name: 'Utilities',
    index: utilitiesIndex,
  },
  // {
  //   name: 'Internal',
  //   index: internalIndex,
  // },
];

export default {
  ...observatoryIndex,
  ...auxtelIndex,
  ...mainIndex,
  ...mainCameraIndex,
  ...environmentIndex,
  ...utilitiesIndex,
  ...internalIndex,
};
