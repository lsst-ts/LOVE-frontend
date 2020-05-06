/* eslint-disable global-require */

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

export const uifIndex = {
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
  GenericCamera: {
    component: require('../GenericCamera/GenericCamera').default,
    schema: {
      ...require('../GenericCamera/GenericCamera').schema,
      props: {
        ...defaultSchemaProps,
        ...require('../GenericCamera/GenericCamera').schema.props,
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
  TimeDisplay: {
    component: require('../Time/TimeDisplay.container').default,
    schema: require('../Time/TimeDisplay.container').schema,
  },
  InteractiveTimeSeries: {
    component: require('../TimeSeries/TimeSeries.container').default,
    schema: {
      ...require('../TimeSeries/TimeSeries.container').schema,
      props: {
        ...defaultSchemaProps,
        ...require('../TimeSeries/TimeSeries.container').schema.props,
      },
    },
  },
  // TimeSeriesPlot: {
  //   component: require('../GeneralPurpose/TimeSeriesPlot/TimeSeriesPlot.container').default,
  //   schema: {
  //     ...require('../GeneralPurpose/TimeSeriesPlot/TimeSeriesPlot.container').schema,
  //     props: {
  //       ...defaultSchemaProps,
  //       ...require('../GeneralPurpose/TimeSeriesPlot/TimeSeriesPlot.container').schema.props,
  //     }
  //   },
  // },
  TimeSeriesPlot: {
    component: require('../GeneralPurpose/TimeSeriesPlot/TimeSeriesPlot.container').default,
    schema: require('../GeneralPurpose/TimeSeriesPlot/TimeSeriesPlot.container').schema,
  },
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
