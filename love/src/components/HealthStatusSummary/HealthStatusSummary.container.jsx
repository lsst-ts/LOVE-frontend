import React from 'react';
import { connect } from 'react-redux';
import HealthStatusSummary from './HealthStatusSummary';
import { addGroup, removeGroup } from '../../redux/actions/ws';
import { getStreamsData } from '../../redux/selectors/selectors.js';
import SubscriptionTableContainer from '../GeneralPurpose/SubscriptionTable/SubscriptionTable.container';
import { HEALTH_STATUS_VARIABLES_DECLARATION } from './TelemetrySelectionTable/TelemetrySelectionTable';

const defaultHealthFunction = `return Math.floor(new Date().getSeconds()  / 4) % 5 ;`;
export const schema = {
  description: `Table containing the health status for all telemetries, as defined by 
                custom health status functions defined in the component`,
  defaultSize: [78, 44],
  props: {
    titleBar: {
      type: 'boolean',
      description: 'Whether to display the title bar',
      isPrivate: false,
      default: false,
    },
    title: {
      type: 'string',
      description: 'Name diplayed in the title bar (if visible)',
      isPrivate: false,
      default: 'Health status summary',
    },
    hasRawMode: {
      type: 'boolean',
      description: 'Whether the component has a raw mode version',
      isPrivate: true,
      default: true,
    },
    topicConfiguration: {
      type: 'object',
      description: `Dictionary describing the telemetries and/or events to monitor
      and functions that can return an integer from 0 to 4 that represents
      a different health status level.
      
      Its shape must be: 
      {
        "<component.salindex.topic>": {
          <parameter_name>: healthfunction,
          ...
        }
        
      }
      such that for each <parameter_name> the data could be accessed in python with 
      
      
      >>> data = await salobj.Remote(domain, <component>, <salindex>).tel_<topic>
      >>> value = data.<parameter_name>

      
      
      `,
      isPrivate: false,
      externalStep: 'HealthStatusConfig',
      default: {
        'telemetry-ATMCS-0-mount_AzEl_Encoders': {
          cRIO_timestamp: defaultHealthFunction,
          elevationCalculatedAngle: defaultHealthFunction,
        },
        'telemetry-ATDome-0-position': {
          dropoutDoorOpeningPercentage: defaultHealthFunction,
          mainDoorOpeningPercentage: defaultHealthFunction,
          azimuthPosition: defaultHealthFunction,
          azimuthEncoderPosition: defaultHealthFunction,
        },
        'telemetry-ATMCS-0-mount_Nasmyth_Encoders': {
          nasmyth1CalculatedAngle: defaultHealthFunction,
          nasmyth2CalculatedAngle: defaultHealthFunction,
          nasmyth1Encoder1Raw: defaultHealthFunction,
          nasmyth1Encoder2Raw: defaultHealthFunction,
          nasmyth1Encoder3Raw: defaultHealthFunction,
          nasmyth2Encoder1Raw: defaultHealthFunction,
          nasmyth2Encoder2Raw: defaultHealthFunction,
          nasmyth2Encoder3Raw: defaultHealthFunction,
          trackId: defaultHealthFunction,
        },
      },
    },
  },
};

const HealthStatusSummaryContainer = ({
  topicConfiguration = schema.props.topicConfiguration.default,
  streams,
  subscribeToStreams,
  unsubscribeToStreams,
  isRaw,
  ...props
}) => {
  const parsedTelemetryConfiguration = Object.keys(topicConfiguration).reduce((prevDict, subscriptionName) => {
    const [category, component, salindex, topic] = subscriptionName.split('-');
    if (!prevDict[`${category}-${component}-${salindex}`]) prevDict[`${category}-${component}-${salindex}`] = {};
    if (!prevDict[`${category}-${component}-${salindex}`][topic])
      prevDict[`${category}-${component}-${salindex}`][topic] = {};

    Object.keys(topicConfiguration[subscriptionName]).forEach((parameterName) => {
      const code = [HEALTH_STATUS_VARIABLES_DECLARATION, topicConfiguration[subscriptionName][parameterName]].join(
        '\n',
      );
      /* eslint-disable no-new-func*/
      prevDict[`${category}-${component}-${salindex}`][topic][parameterName] = new Function(parameterName, code);
    });
    return prevDict;
  }, {});

  if (isRaw) {
    const subscriptions = Object.keys(topicConfiguration).map((key) => `${key}`);
    return <SubscriptionTableContainer subscriptions={subscriptions}></SubscriptionTableContainer>;
  }

  return (
    <HealthStatusSummary
      topicConfiguration={parsedTelemetryConfiguration}
      streams={streams}
      subscribeToStreams={subscribeToStreams}
      unsubscribeToStreams={unsubscribeToStreams}
    />
  );
};

const mapStateToProps = (state, ownProps) => {
  const topicConfiguration = ownProps.topicConfiguration || schema.props.topicConfiguration.default;
  const groupNames = Object.keys(topicConfiguration).map((key) => `${key}`);
  const streams = getStreamsData(state, groupNames);
  return {
    streams,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    subscribeToStreams: () => {
      const topicConfiguration = ownProps.topicConfiguration || schema.props.topicConfiguration.default;
      const groupNames = Object.keys(topicConfiguration).map((key) => `${key}`);

      groupNames.forEach((groupName) => {
        dispatch(addGroup(groupName));
      });
    },
    unsubscribeToStreams: () => {
      const topicConfiguration = ownProps.topicConfiguration || schema.props.topicConfiguration.default;
      const groupNames = Object.keys(topicConfiguration).map((key) => `${key}`);

      groupNames.forEach((groupName) => {
        dispatch(removeGroup(groupName));
      });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HealthStatusSummaryContainer);
