export const uifIndex = {
    ScriptQueue: require('../../ScriptQueue/ScriptQueue.container').default,
    CSCDetail: require('../../CSCSummary/CSCDetail/CSCDetail.container').default,
    CSCExpanded: require('../../CSCSummary/CSCExpanded/CSCExpanded.container').default,
    CSCGroupLog: require('../../CSCSummary/CSCGroupLog/CSCGroupLog.container').default,
    CSCGroup: require('../../CSCSummary/CSCGroup/CSCGroup').default,
    CSCSummary: require('../../CSCSummary/CSCSummary.container').default,
    LabeledStatusText: require('../../GeneralPurpose/LabeledStatusText/LabeledStatusText.container').default,
    TimeSeriesPlot: require('../../GeneralPurpose/TimeSeriesPlot/TimeSeriesPlot.container').default,
    TelemetryLog: require('../../TelemetryLog/TelemetryLog.container').default,
    Watcher: require('../../Watcher/Watcher.container').default,
};

export const auxtelIndex = {
    MountSummaryPanel: require('../../AuxTel/Mount/SummaryPanel/SummaryPanel.container').default,
    LightPath: require('../../AuxTel/Mount/LightPath.container').default,
    MotorTable: require('../../AuxTel/Mount/MotorTable/MotorTable.container').default,
    Camera: require('../../AuxTel/Camera/Camera.container').default,
    Dome: require('../../AuxTel/Dome/Dome.container').default,
    LATISS: require('../../AuxTel/LATISS/LATISS.container').default,
};

export const mainIndex = {
};

export default {
  ...uifIndex,
  ...auxtelIndex,
  ...mainIndex,
};
