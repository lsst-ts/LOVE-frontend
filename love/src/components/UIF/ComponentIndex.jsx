export const uifIndex = {
  ScriptQueue: {
    component: require('../ScriptQueue/ScriptQueue.container').default,
    schema: require('../ScriptQueue/ScriptQueue.container').schema,
  },
  CSCDetail: {
    component: require('../CSCSummary/CSCDetail/CSCDetail.container').default,
    schema: require('../CSCSummary/CSCDetail/CSCDetail.container').schema,
  },
  CSCExpanded: {
    component: require('../CSCSummary/CSCExpanded/CSCExpanded.container').default,
    schema: require('../CSCSummary/CSCExpanded/CSCExpanded.container').schema,
  },
  CSCGroupLog: {
    component: require('../CSCSummary/CSCGroupLog/CSCGroupLog.container').default,
    schema: require('../CSCSummary/CSCGroupLog/CSCGroupLog.container').schema,
  },
  CSCGroup: {
    component: require('../CSCSummary/CSCGroup/CSCGroup.container').default,
    schema: require('../CSCSummary/CSCGroup/CSCGroup.container').schema,
  },
  CSCSummary: {
    component: require('../CSCSummary/CSCSummary.container').default,
    schema: require('../CSCSummary/CSCSummary.container').schema,
  },
  LabeledStatusText: {
    component: require('../GeneralPurpose/LabeledStatusText/LabeledStatusText.container').default,
    schema: require('../GeneralPurpose/LabeledStatusText/LabeledStatusText.container').schema,
  },
  Watcher: {
    component: require('../Watcher/Watcher.container').default,
    schema: require('../Watcher/Watcher.container').schema,
  },
  GenericCamera: {
    component: require('../GenericCamera/GenericCamera').default,
    schema: require('../GenericCamera/GenericCamera').schema,
  },
  ObservingLogInput: {
    component: require('../ObservingLog/ObservingLogInput.container').default,
    schema: require('../ObservingLog/ObservingLogInput.container').schema,
  },
  ObservingLogMessages: {
    component: require('../ObservingLog/ObservingLogMessages.container').default,
    schema: require('../ObservingLog/ObservingLogMessages.container').schema,
  },
  HealthStatusSummary: {
    component: require('../HealthStatusSummary/HealthStatusSummary.container').default,
    schema: require('../HealthStatusSummary/HealthStatusSummary.container').schema,
  },
  TimeDisplay: {
    component: require('../Time/TimeDisplay.container').default,
    schema: require('../Time/TimeDisplay.container').schema,
  },
  InteractiveTimeSeries: {
    component: require('../TimeSeries/TimeSeries.container').default,
    schema: require('../TimeSeries/TimeSeries.container').schema,
  },
  TimeSeriesPlot: {
    component: require('../GeneralPurpose/TimeSeriesPlot/TimeSeriesPlot.container').default,
    schema: require('../GeneralPurpose/TimeSeriesPlot/TimeSeriesPlot.container').schema,
  },
  TelemetryLog: {
    component: require('../TelemetryLog/TelemetryLog.container').default,
    schema: require('../TelemetryLog/TelemetryLog.container').schema,
  }
};

export const auxtelIndex = {
  MountSummaryPanel: {
    component: require('../AuxTel/Mount/SummaryPanel/SummaryPanel.container').default,
    schema: require('../AuxTel/Mount/SummaryPanel/SummaryPanel.container').schema,
  },
  LightPath: {
    component: require('../AuxTel/Mount/LightPath.container').default,
    schema: require('../AuxTel/Mount/LightPath.container').schema,
  },
  MotorTable: {
    component: require('../AuxTel/Mount/MotorTable/MotorTable.container').default,
    schema: require('../AuxTel/Mount/MotorTable/MotorTable.container').schema,
  },
  Camera: {
    component: require('../AuxTel/Camera/Camera.container').default,
    schema: require('../AuxTel/Camera/Camera.container').schema,
  },
  Dome: {
    component: require('../AuxTel/Dome/Dome.container').default,
    schema: require('../AuxTel/Dome/Dome.container').schema,
  },
  LATISS: {
    component: require('../AuxTel/LATISS/LATISS.container').default,
    schema: require('../AuxTel/LATISS/LATISS.container').schema,
  },
};

export const mainIndex = {};

export const indexes = [
  {
    name: 'UI Framework',
    index: uifIndex,
  },
  {
    name: 'Auxiliary Telescope',
    index: auxtelIndex,
  },
  {
    name: 'Main Telescope',
    index: mainIndex,
  },
];

export default {
  ...uifIndex,
  ...auxtelIndex,
  ...mainIndex,
};
