/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed by Inria Chile and the Telescope and Site Software team.

Developed for the Vera C. Rubin Observatory Telescope and Site Systems.

This program is free software: you can redistribute it and/or modify it under 
the terms of the GNU General Public License as published by the Free Software 
Foundation, either version 3 of the License, or at your option) any later version.

This program is distributed in the hope that it will be useful,but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR 
 A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with 
this program. If not, see <http://www.gnu.org/licenses/>.
*/

/**
 * Important!!
 *
 * Two or more instances with the same name cannot exist. For example, there cannot be two M1M3
 */

// Observatory imports
import ScriptQueueContainer, { schema as ScriptQueueSchema } from '../ScriptQueue/ScriptQueue.container';
import DataManagementFlowContainer, {
  schema as DataManagementFlowSchema,
} from '../DataManagementFlow/DataManagementFlow.container';
import CSCDetailContainer, { schema as CSCDetailSchema } from '../CSCSummary/CSCDetail/CSCDetail.container';
import FlightTrackerContainer, { schema as FlightTrackerSchema } from '../FlightTracker/FlightTracker.container';
import CSCExpandedContainer, { schema as CSCExpandedSchema } from '../CSCSummary/CSCExpanded/CSCExpanded.container';
import CSCGroupLogContainer, { schema as CSCGroupLogSchema } from '../CSCSummary/CSCGroupLog/CSCGroupLog.container';
import CSCGroupContainer, { schema as CSCGroupSchema } from '../CSCSummary/CSCGroup/CSCGroup.container';
import CSCSummaryContainer, { schema as CSCSummarySchema } from '../CSCSummary/CSCSummary.container';
import WatcherContainer, { schema as WatcherSchema } from '../Watcher/Watcher.container';
import GenericCameraViewContainer, {
  schema as GenericCameraViewSchema,
} from '../GenericCamera/GenericCameraView.container';
import ObservingLogInputContainer, {
  schema as ObservingLogInputSchema,
} from '../ObservingLog/ObservingLogInput.container';
import ObservingLogMessagesContainer, {
  schema as ObservingLogMessagesSchema,
} from '../ObservingLog/ObservingLogMessages.container';
import SchedulerContainer, { schema as SchedulerSchema } from '../Scheduler/Scheduler.container';
import EnvironmentSummaryContainer, {
  schema as EnvironmentSummarySchema,
} from '../EnvironmentSummary/EnvironmentSummary.container';
import WindDirectionContainer, {
  schema as WindDirectionSchema,
} from '../EnvironmentSummary/Cartoons/WindDirection.container';
import GISContainer, { schema as GISSchema } from '../GIS/GIS.container';
import NetworkContainer, { schema as NetworkSchema } from '../Network/Network.container';
import MicsContainer, { schema as MicsSchema } from '../Mics/Mics.container';
import WeatherStationContainer, { schema as WeatherStationSchema } from '../WeatherStation/WeatherStation.container';
import FacilityMapContainer, { schema as FacilityMapSchema } from '../Facility/FacilityMap.container';
import DynaleneContainer, { schema as DynaleneSchema } from '../Dynalene/Dynalene.container';
import WeatherForecastContainer, {
  schema as WeatherForecastSchema,
} from '../WeatherForecast/WeatherForecast.container';
import ForecastPlotContainer from '../GeneralPurpose/Plot/ForecastPlot/ForecastPlot.container';
import { schema as WindPlotSchema } from '../WeatherForecast/PlotsContainer/WindPlot.container';
import { schema as TemperaturePlotSchema } from '../WeatherForecast/PlotsContainer/TemperaturePlot.container';
import { schema as RainPlotSchema } from '../WeatherForecast/PlotsContainer/RainPlot.container';
import { schema as CloudPlotSchema } from '../WeatherForecast/PlotsContainer/CloudPlot.container';
import InfoHeaderContainer, { schema as InfoHeaderSchema } from '../WeatherForecast/InfoHeader/InfoHeader.container';
import TimeDisplayContainer, { schema as TimeDisplaySchema } from '../Time/TimeDisplay.container';
import GenericCameraControlsContainer, {
  schema as GenericCameraControlsSchema,
} from '../GenericCamera/GenericCameraControls.container';
import OLEContainer, { schema as OLESchema } from '../OLE/OLE.container';
import CreateOLEContainer, { schema as CreateOLESchema } from '../OLE/CreateOLE.container';
import CreateNightReportContainer, {
  schema as CreateNightReportSchema,
} from '../NightReport/CreateNightReport.container';
import HistoricNightReportContainer, {
  schema as HistoricNightReportSchema,
} from '../NightReport/HistoricNightReport.container';
import ObservatorySummaryContainer, {
  schema as ObservatorySummarySchema,
} from '../ObservatorySummary/ObservatorySummary.container';

// AuxTel imports
import MountSummaryPanelContainer, {
  schema as MountSummaryPanelSchema,
} from '../AuxTel/Mount/SummaryPanel/SummaryPanel.container';
import LightPathContainer, { schema as LightPathSchema } from '../AuxTel/Mount/LightPath.container';
import MotorTableContainer, { schema as MotorTableSchema } from '../AuxTel/Mount/MotorTable/MotorTable.container';
import CameraContainer, { schema as CameraSchema } from '../AuxTel/Camera/Camera.container';
import DomeContainer, { schema as DomeSchema } from '../AuxTel/Dome/Dome.container';
import LATISSContainer, { schema as LATISSSchema } from '../AuxTel/LATISS/LATISS.container';
import AuxTelESSContainer, { schema as AuxTelESSSchema } from '../ESS/AuxTel/AuxTelESS.container';

// MainTel imports
import CableWrapsContainer, { schema as CableWrapsSchema } from '../MainTel/CableWraps/CableWraps.container';
import M1M3Container, { schema as M1M3Schema } from '../MainTel/M1M3/M1M3.container';
import M1M3TableContainer, { schema as M1M3TableSchema } from '../MainTel/M1M3/M1M3Table.container';
import M1M3TSContainer, { schema as M1M3TSSchema } from '../MainTel/M1M3TS/M1M3TS.container';
import M1M3CompactContainer, { schema as M1M3CompactSchema } from '../MainTel/M1M3/M1M3Compact.container';
import M1M3HardpointsDataTableContainer, {
  schema as M1M3HardpointsDataTableSchema,
} from '../MainTel/M1M3/M1M3HardpointsDataTable.container';
import GlycolLoopContainer, { schema as GlycolLoopSchema } from '../MainTel/GlycolLoop/GlycolLoop.container';
import HeatMonitorContainer, { schema as HeatMonitorSchema } from '../MainTel/GlycolSystem/HeatMonitor.container';
import DeviceTableContainer, { schema as DeviceTableSchema } from '../MainTel/GlycolSystem/DeviceTable.container';
import BumpTestsContainer, { schema as BumpTestsSchema } from '../MainTel/M1M3/BumpTests.container';
import M2Container, { schema as M2Schema } from '../MainTel/M2/M2.container';
import M2TableContainer, { schema as M2TableSchema } from '../MainTel/M2/M2Table.container';
import M2CompactContainer, { schema as M2CompactSchema } from '../MainTel/M2/M2Compact.container';
import MTDomeContainer, { schema as MTDomeSchema } from '../MainTel/MTDome/MTDome.container';
import MTDomePowerContainer, { schema as MTDomePowerSchema } from '../MainTel/MTDomePower/MTDomePower.container';
import TMAContainer, { schema as TMASchema } from '../MainTel/TMA/TMA.container';
import MTISContainer, { schema as MTISSchema } from '../MainTel/MTIS/MTIS.container';

// MainCamera imports
import CameraHexapodContainer, {
  schema as CameraHexapodSchema,
} from '../MainTel/CameraHexapod/CameraHexapod.container';
import SimonyiLightPathContainer, {
  schema as SimonyiLightPathSchema,
} from '../MainTel/LightPath/SimonyiLightPath.container';
import MTCameraContainer, { schema as MTCameraSchema } from '../MainTel/MTCamera/MTCamera.container';
import MTCameraSummaryDetailContainer, {
  schema as MTCameraSummaryDetailSchema,
} from '../MainTel/MTCameraSummaryDetail/MTCameraSummaryDetail.container';
import CCCameraContainer, { schema as CCCameraSchema } from '../MainTel/CCCamera/CCCamera.container';
import CCCameraSummaryDetailContainer, {
  schema as CCCameraSummaryDetailSchema,
} from '../MainTel/CCCameraSummaryDetail/CCCameraSummaryDetail.container';
import MainTelESSContainer, { schema as MainTelESSSchema } from '../ESS/MainTel/MainTelESS.container';

// Environment imports
import CloudMapViewContainer, { schema as CloudMapViewSchema } from '../EmbeddedView/custom/CloudMapView.container';

// Utilities imports
import LabeledStatusTextContainer, {
  schema as LabeledStatusTextSchema,
} from '../GeneralPurpose/LabeledStatusText/LabeledStatusText.container';
import HealthStatusSummaryContainer, {
  schema as HealthStatusSummarySchema,
} from '../HealthStatusSummary/HealthStatusSummary.container';
import ClockContainer, { schema as ClockSchema } from '../Time/Clock/Clock.container';
import VegaCustomPlotContainer, {
  schema as VegaCustomPlotSchema,
} from '../GeneralPurpose/Plot/VegaCustomPlot/VegaCustomPlot.container';
import PlotContainer, { schema as PlotSchema } from '../GeneralPurpose/Plot/Plot.container.jsx';
import PolarPlotContainer, { schema as PolarPlotSchema } from '../GeneralPurpose/Plot/PolarPlot/PolarPlot.container';
import EmbeddedViewContainer, { schema as EmbeddedViewSchema } from '../EmbeddedView/EmbeddedView.container';
import SubscriptionTableContainer, {
  schema as SubscriptionTableSchema,
} from '../GeneralPurpose/SubscriptionTable/SubscriptionTable.container';
import EventLogContainer, { schema as EventLogSchema } from '../EventLog/EventLog.container';
import CommandPanelContainer, { schema as CommandPanelSchema } from '../CommandPanel/CommandPanel.container';
import TCSCommandsContainer, { schema as TCSCommandsSchema } from '../TCSCommands/TCSCommands.container';
import TCSOffsetContainer, { schema as TCSOffsetSchema } from '../TCSCommands/TCSOffset/TCSOffset.container';

// Internal imports
import TelemetryLogContainer, { schema as TelemetryLogSchema } from '../TelemetryLog/TelemetryLog.container';

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
    component: ScriptQueueContainer,
    schema: {
      ...ScriptQueueSchema,
      props: {
        ...defaultSchemaProps,
        ...ScriptQueueSchema.props,
      },
    },
  },
  DataManagementFlow: {
    component: DataManagementFlowContainer,
    schema: {
      ...DataManagementFlowSchema,
      props: {
        ...defaultSchemaProps,
        ...DataManagementFlowSchema.props,
      },
    },
  },
  CSCDetail: {
    component: CSCDetailContainer,
    schema: {
      ...CSCDetailSchema,
      props: {
        ...defaultSchemaProps,
        ...CSCDetailSchema.props,
      },
    },
  },
  AircraftTracker: {
    component: FlightTrackerContainer,
    schema: {
      ...FlightTrackerSchema,
      props: {
        ...defaultSchemaProps,
        ...FlightTrackerSchema.props,
      },
    },
  },
  CSCExpanded: {
    component: CSCExpandedContainer,
    schema: {
      ...CSCExpandedSchema,
      props: {
        ...defaultSchemaProps,
        ...CSCExpandedSchema.props,
      },
    },
  },
  CSCGroupLog: {
    component: CSCGroupLogContainer,
    schema: {
      ...CSCGroupLogSchema,
      props: {
        ...defaultSchemaProps,
        ...CSCGroupLogSchema.props,
      },
    },
  },
  CSCGroup: {
    component: CSCGroupContainer,
    schema: {
      ...CSCGroupSchema,
      props: {
        ...defaultSchemaProps,
        ...CSCGroupSchema.props,
      },
    },
  },
  CSCSummary: {
    component: CSCSummaryContainer,
    schema: {
      ...CSCSummarySchema,
      props: {
        ...defaultSchemaProps,
        ...CSCSummarySchema.props,
      },
    },
  },
  Watcher: {
    component: WatcherContainer,
    schema: {
      ...WatcherSchema,
      props: {
        ...defaultSchemaProps,
        ...WatcherSchema.props,
      },
    },
  },
  GenericCameraView: {
    component: GenericCameraViewContainer,
    schema: {
      ...GenericCameraViewSchema,
      props: {
        ...defaultSchemaProps,
        ...GenericCameraViewSchema.props,
      },
    },
  },
  ObservingLogInput: {
    component: ObservingLogInputContainer,
    schema: {
      ...ObservingLogInputSchema,
      props: {
        ...defaultSchemaProps,
        ...ObservingLogInputSchema.props,
      },
    },
  },
  ObservingLogMessages: {
    component: ObservingLogMessagesContainer,
    schema: {
      ...ObservingLogMessagesSchema,
      props: {
        ...defaultSchemaProps,
        ...ObservingLogMessagesSchema.props,
      },
    },
  },
  Scheduler: {
    component: SchedulerContainer,
    schema: {
      ...SchedulerSchema,
      props: {
        ...defaultSchemaProps,
        ...SchedulerSchema.props,
      },
    },
  },
  EnvironmentSummary: {
    component: EnvironmentSummaryContainer,
    schema: {
      ...EnvironmentSummarySchema,
      props: {
        ...defaultSchemaProps,
        ...EnvironmentSummarySchema.props,
      },
    },
  },
  WindDirection: {
    component: WindDirectionContainer,
    schema: {
      ...WindDirectionSchema,
      props: {
        ...defaultSchemaProps,
        ...WindDirectionSchema.props,
      },
    },
  },
  GIS: {
    component: GISContainer,
    schema: {
      ...GISSchema,
      props: {
        ...defaultSchemaProps,
        ...GISSchema.props,
      },
    },
  },
  Network: {
    component: NetworkContainer,
    schema: {
      ...NetworkSchema,
      props: {
        ...defaultSchemaProps,
        ...NetworkSchema.props,
      },
    },
  },
  Microphones: {
    component: MicsContainer,
    schema: {
      ...MicsSchema,
      props: {
        ...defaultSchemaProps,
        ...MicsSchema.props,
      },
    },
  },
  WeatherStation: {
    component: WeatherStationContainer,
    schema: {
      ...WeatherStationSchema,
      props: {
        ...defaultSchemaProps,
        ...WeatherStationSchema.props,
      },
    },
  },
  FacilityMap: {
    component: FacilityMapContainer,
    schema: {
      ...FacilityMapSchema,
      props: {
        ...defaultSchemaProps,
        ...FacilityMapSchema.props,
      },
    },
  },
  Dynalene: {
    component: DynaleneContainer,
    schema: {
      ...DynaleneSchema,
      props: {
        ...defaultSchemaProps,
        ...DynaleneSchema.props,
      },
    },
  },
  WeatherForecast: {
    component: WeatherForecastContainer,
    schema: {
      ...WeatherForecastSchema,
      props: {
        ...defaultSchemaProps,
        ...WeatherForecastSchema.props,
      },
    },
  },
  WindPlotForecast: {
    component: ForecastPlotContainer,
    schema: {
      ...WindPlotSchema,
      props: {
        ...defaultSchemaProps,
        ...WindPlotSchema.props,
      },
    },
  },
  TemperaturePlotForecast: {
    component: ForecastPlotContainer,
    schema: {
      ...TemperaturePlotSchema,
      props: {
        ...defaultSchemaProps,
        ...TemperaturePlotSchema.props,
      },
    },
  },
  RainPlotForecast: {
    component: ForecastPlotContainer,
    schema: {
      ...RainPlotSchema,
      props: {
        ...defaultSchemaProps,
        ...RainPlotSchema.props,
      },
    },
  },
  CloudPlotForecast: {
    component: ForecastPlotContainer,
    schema: {
      ...CloudPlotSchema,
      props: {
        ...defaultSchemaProps,
        ...CloudPlotSchema.props,
      },
    },
  },
  InfoHeaderForecast: {
    component: InfoHeaderContainer,
    schema: {
      ...InfoHeaderSchema,
      props: {
        ...defaultSchemaProps,
        ...InfoHeaderSchema.props,
      },
    },
  },
  TimeDisplay: {
    component: TimeDisplayContainer,
    schema: TimeDisplaySchema,
  },
  GenericCameraControls: {
    component: GenericCameraControlsContainer,
    schema: {
      ...GenericCameraControlsSchema,
      props: {
        ...defaultSchemaProps,
        ...GenericCameraControlsSchema.props,
      },
    },
  },
  OLE: {
    component: OLEContainer,
    schema: {
      ...OLESchema,
      props: {
        ...defaultSchemaProps,
        ...OLESchema.props,
      },
    },
  },
  CreateOLE: {
    component: CreateOLEContainer,
    schema: {
      ...CreateOLESchema,
      props: {
        ...defaultSchemaProps,
        ...CreateOLESchema.props,
      },
    },
  },
  CreateNightReport: {
    component: CreateNightReportContainer,
    schema: {
      ...CreateNightReportSchema,
      props: {
        ...defaultSchemaProps,
        ...CreateNightReportSchema.props,
      },
    },
  },
  HistoricNightReport: {
    component: HistoricNightReportContainer,
    schema: {
      ...HistoricNightReportSchema,
      props: {
        ...defaultSchemaProps,
        ...HistoricNightReportSchema.props,
      },
    },
  },
  ObservatorySummary: {
    component: ObservatorySummaryContainer,
    schema: {
      ...ObservatorySummarySchema,
      props: {
        ...defaultSchemaProps,
        ...ObservatorySummarySchema.props,
      },
    },
  },
};

export const auxtelIndex = {
  MountSummaryPanel: {
    component: MountSummaryPanelContainer,
    schema: {
      ...MountSummaryPanelSchema,
      props: {
        ...defaultSchemaProps,
        ...MountSummaryPanelSchema.props,
      },
    },
  },
  LightPath: {
    component: LightPathContainer,
    schema: {
      ...LightPathSchema,
      props: {
        ...defaultSchemaProps,
        ...LightPathSchema.props,
      },
    },
  },
  MotorTable: {
    component: MotorTableContainer,
    schema: {
      ...MotorTableSchema,
      props: {
        ...defaultSchemaProps,
        ...MotorTableSchema.props,
      },
    },
  },
  Camera: {
    component: CameraContainer,
    schema: {
      ...CameraSchema,
      props: {
        ...defaultSchemaProps,
        ...CameraSchema.props,
      },
    },
  },
  Dome: {
    component: DomeContainer,
    schema: {
      ...DomeSchema,
      props: {
        ...defaultSchemaProps,
        ...DomeSchema.props,
      },
    },
  },
  LATISS: {
    component: LATISSContainer,
    schema: {
      ...LATISSSchema,
      props: {
        ...defaultSchemaProps,
        ...LATISSSchema.props,
      },
    },
  },
  AuxTelESS: {
    component: AuxTelESSContainer,
    schema: {
      ...AuxTelESSSchema,
      props: {
        ...defaultSchemaProps,
        ...AuxTelESSSchema.props,
      },
    },
  },
};

export const mainIndex = {
  CableWraps: {
    component: CableWrapsContainer,
    schema: {
      ...CableWrapsSchema,
      props: {
        ...defaultSchemaProps,
        ...CableWrapsSchema.props,
      },
    },
  },
  M1M3: {
    component: M1M3Container,
    schema: {
      ...M1M3Schema,
      props: {
        ...defaultSchemaProps,
        ...M1M3Schema.props,
      },
    },
  },
  M1M3Table: {
    component: M1M3TableContainer,
    schema: {
      ...M1M3TableSchema,
      props: {
        ...defaultSchemaProps,
        ...M1M3TableSchema.props,
      },
    },
  },
  M1M3TS: {
    component: M1M3TSContainer,
    schema: {
      ...M1M3TSSchema,
      props: {
        ...defaultSchemaProps,
        ...M1M3TSSchema.props,
      },
    },
  },
  M1M3Compact: {
    component: M1M3CompactContainer,
    schema: {
      ...M1M3CompactSchema,
      props: {
        ...defaultSchemaProps,
        ...M1M3CompactSchema.props,
      },
    },
  },
  M1M3HardpointsDataTable: {
    component: M1M3HardpointsDataTableContainer,
    schema: {
      ...M1M3HardpointsDataTableSchema,
      props: {
        ...defaultSchemaProps,
        ...M1M3HardpointsDataTableSchema.props,
      },
    },
  },
  GlycolLoop: {
    component: GlycolLoopContainer,
    schema: {
      ...GlycolLoopSchema,
      props: {
        ...defaultSchemaProps,
        ...GlycolLoopSchema.props,
      },
    },
  },
  GlycolHeatMonitor: {
    component: HeatMonitorContainer,
    schema: {
      ...HeatMonitorSchema,
      props: {
        ...defaultSchemaProps,
        ...HeatMonitorSchema.props,
      },
    },
  },
  GlycolDeviceTable: {
    component: DeviceTableContainer,
    schema: {
      ...DeviceTableSchema,
      props: {
        ...defaultSchemaProps,
        ...DeviceTableSchema.props,
      },
    },
  },
  M1M3BumpTests: {
    component: BumpTestsContainer,
    schema: {
      ...BumpTestsSchema,
      props: {
        ...defaultSchemaProps,
        ...BumpTestsSchema.props,
      },
    },
  },
  M2: {
    component: M2Container,
    schema: {
      ...M2Schema,
      props: {
        ...defaultSchemaProps,
        ...M2Schema.props,
      },
    },
  },
  M2Table: {
    component: M2TableContainer,
    schema: {
      ...M2TableSchema,
      props: {
        ...defaultSchemaProps,
        ...M2TableSchema.props,
      },
    },
  },
  M2Compact: {
    component: M2CompactContainer,
    schema: {
      ...M2CompactSchema,
      props: {
        ...defaultSchemaProps,
        ...M2CompactSchema.props,
      },
    },
  },
  SimonyiDome: {
    component: MTDomeContainer,
    schema: {
      ...MTDomeSchema,
      props: {
        ...defaultSchemaProps,
        ...MTDomeSchema.props,
      },
    },
  },
  SimonyiDomePower: {
    component: MTDomePowerContainer,
    schema: {
      ...MTDomePowerSchema,
      props: {
        ...defaultSchemaProps,
        ...MTDomePowerSchema.props,
      },
    },
  },
  TMA: {
    component: TMAContainer,
    schema: {
      ...TMASchema,
      props: {
        ...defaultSchemaProps,
        ...TMASchema.props,
      },
    },
  },
  MTIS: {
    component: MTISContainer,
    schema: {
      ...MTISSchema,
      props: {
        ...defaultSchemaProps,
        ...MTISSchema.props,
      },
    },
  },
};

export const mainCameraIndex = {
  CameraHexapod: {
    component: CameraHexapodContainer,
    schema: {
      ...CameraHexapodSchema,
      props: {
        ...defaultSchemaProps,
        ...CameraHexapodSchema.props,
      },
    },
  },
  SimonyiLightPath: {
    component: SimonyiLightPathContainer,
    schema: {
      ...SimonyiLightPathSchema,
      props: {
        ...defaultSchemaProps,
        ...SimonyiLightPathSchema.props,
      },
    },
  },
  MTCamera: {
    component: MTCameraContainer,
    schema: {
      ...MTCameraSchema,
      props: {
        ...defaultSchemaProps,
        ...MTCameraSchema.props,
      },
    },
  },
  MTCameraSummaryDetail: {
    component: MTCameraSummaryDetailContainer,
    schema: {
      ...MTCameraSummaryDetailSchema,
      props: {
        ...defaultSchemaProps,
        ...MTCameraSummaryDetailSchema.props,
      },
    },
  },
  CCCamera: {
    component: CCCameraContainer,
    schema: {
      ...CCCameraSchema,
      props: {
        ...defaultSchemaProps,
        ...CCCameraSchema.props,
      },
    },
  },
  CCCameraSummaryDetail: {
    component: CCCameraSummaryDetailContainer,
    schema: {
      ...CCCameraSummaryDetailSchema,
      props: {
        ...defaultSchemaProps,
        ...CCCameraSummaryDetailSchema.props,
      },
    },
  },
  MainTelESS: {
    component: MainTelESSContainer,
    schema: {
      ...MainTelESSSchema,
      props: {
        ...defaultSchemaProps,
        ...MainTelESSSchema.props,
      },
    },
  },
};

const environmentIndex = {
  CloudMap: {
    component: CloudMapViewContainer,
    schema: {
      ...CloudMapViewSchema,
      props: {
        ...defaultSchemaProps,
        ...CloudMapViewSchema.props,
      },
    },
  },
};

export const utilitiesIndex = {
  LabeledStatusText: {
    component: LabeledStatusTextContainer,
    schema: {
      ...LabeledStatusTextSchema,
      props: {
        ...defaultSchemaProps,
        ...LabeledStatusTextSchema.props,
      },
    },
  },
  HealthStatusSummary: {
    component: HealthStatusSummaryContainer,
    schema: {
      ...HealthStatusSummarySchema,
      props: {
        ...defaultSchemaProps,
        ...HealthStatusSummarySchema.props,
      },
    },
  },
  Clock: {
    component: ClockContainer,
    schema: ClockSchema,
  },
  VegaCustomPlot: {
    component: VegaCustomPlotContainer,
    schema: VegaCustomPlotSchema,
  },
  VegaTimeSeriesPlot: {
    component: PlotContainer,
    schema: PlotSchema,
  },
  PolarPlot: {
    component: PolarPlotContainer,
    schema: PolarPlotSchema,
  },
  EmbeddedView: {
    component: EmbeddedViewContainer,
    schema: {
      ...EmbeddedViewSchema,
      props: {
        ...defaultSchemaProps,
        ...EmbeddedViewSchema.props,
      },
    },
  },
  SubscriptionTable: {
    component: SubscriptionTableContainer,
    schema: {
      ...SubscriptionTableSchema,
      props: {
        ...defaultSchemaProps,
        ...SubscriptionTableSchema.props,
      },
    },
  },
  EventLog: {
    component: EventLogContainer,
    schema: {
      ...EventLogSchema,
      props: {
        ...defaultSchemaProps,
        ...EventLogSchema.props,
      },
    },
  },
  CommandPanel: {
    component: CommandPanelContainer,
    schema: {
      ...CommandPanelSchema,
      props: {
        ...defaultSchemaProps,
        ...CommandPanelSchema.props,
      },
    },
  },
  TCSCommands: {
    component: TCSCommandsContainer,
    schema: {
      ...TCSCommandsSchema,
      props: {
        ...defaultSchemaProps,
        ...TCSCommandsSchema.props,
      },
    },
  },
  TCSOffset: {
    component: TCSOffsetContainer,
    schema: {
      ...TCSOffsetSchema,
      props: {
        ...defaultSchemaProps,
        ...TCSOffsetSchema.props,
      },
    },
  },
};

export const internalIndex = {
  // TelemetryLog: {
  //   component: TelemetryLogContainer,
  //   schema: {
  //     ...TelemetryLogSchema,
  //     props: {
  //       ...defaultSchemaProps,
  //       ...TelemetryLogSchema.props,
  //     }
  //   },
  // },
  TelemetryLog: {
    component: TelemetryLogContainer,
    schema: TelemetryLogSchema,
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
