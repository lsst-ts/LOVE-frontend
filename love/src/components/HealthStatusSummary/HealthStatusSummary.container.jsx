import React from 'react';
import { connect } from 'react-redux';
import HealthStatusSummary from './HealthStatusSummary';
import { addGroupSubscription, requestGroupSubscriptionRemoval } from '../../redux/actions/ws';
import { getStreamsData } from '../../redux/selectors/selectors.js';
import SubscriptionTableContainer from '../GeneralPurpose/SubscriptionTable/SubscriptionTable.container';

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
    telemetryConfiguration: {
      type: 'object',
      description: `Dictionary describing the telemetries to monitor
      Its shape must be: 
      {
        "<component.salindex.topic>": ["<parameter_name>", ...]
        
      }
      such that for each <parameter_name> the data could be accessed in python with 
      
      data = await salobj.Remote(domain, <component>, <salindex>).tel_<topic>
      value = data.<parameter_name>
      `,
      isPrivate: false,
      externalStep: 'TelemetrySelectionTable',
      default: {
        'ATMCS-0-mount_AzEl_Encoders': {
          cRIO_timestamp: defaultHealthFunction,
          elevationCalculatedAngle: defaultHealthFunction,
        },
        'ATDome-0-position': {
          dropoutDoorOpeningPercentage: defaultHealthFunction,
          mainDoorOpeningPercentage: defaultHealthFunction,
          azimuthPosition: defaultHealthFunction,
          azimuthEncoderPosition: defaultHealthFunction,
        },
        'ATMCS-0-mount_Nasmyth_Encoders': {
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
  telemetryConfiguration = schema.props.telemetryConfiguration.default,
  streams,
  subscribeToStreams,
  unsubscribeToStreams,
  isRaw,
  ...props
}) => {
  const parsedTelemetryConfiguration = Object.keys(telemetryConfiguration).reduce((prevDict, subscriptionName) => {
    const [component, salindex, topic] = subscriptionName.split('-');
    if (!prevDict[`${component}-${salindex}`]) prevDict[`${component}-${salindex}`] = {};
    if (!prevDict[`${component}-${salindex}`][topic]) prevDict[`${component}-${salindex}`][topic] = {};

    Object.keys(telemetryConfiguration[subscriptionName]).forEach((parameterName) => {
      prevDict[`${component}-${salindex}`][topic][parameterName] = new Function(
        telemetryConfiguration[subscriptionName][parameterName],
      );
    });
    return prevDict;
  }, {});

  if (isRaw) {
    const subscriptions = Object.keys(telemetryConfiguration).map((key) => `telemetry-${key}`);
    return <SubscriptionTableContainer subscriptions={subscriptions}></SubscriptionTableContainer>;
  }

  return (
    <HealthStatusSummary
      telemetryConfiguration={parsedTelemetryConfiguration}
      streams={streams}
      subscribeToStreams={subscribeToStreams}
      unsubscribeToStreams={unsubscribeToStreams}
    />
  );
};

const mapStateToProps = (state, ownProps) => {
  const telemetryConfiguration = ownProps.telemetryConfiguration || schema.props.telemetryConfiguration.default;
  const groupNames = Object.keys(telemetryConfiguration).map((key) => `telemetry-${key}`);
  const streams = getStreamsData(state, groupNames);
  return {
    streams,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    subscribeToStreams: () => {
      const telemetryConfiguration = ownProps.telemetryConfiguration || schema.props.telemetryConfiguration.default;
      const groupNames = Object.keys(telemetryConfiguration).map((key) => `telemetry-${key}`);

      groupNames.forEach((groupName) => {
        dispatch(addGroupSubscription(groupName));
      });
    },
    unsubscribeToStreams: () => {
      const telemetryConfiguration = ownProps.telemetryConfiguration || schema.props.telemetryConfiguration.default;
      const groupNames = Object.keys(telemetryConfiguration).map((key) => `telemetry-${key}`);

      groupNames.forEach((groupName) => {
        dispatch(requestGroupSubscriptionRemoval(groupName));
      });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HealthStatusSummaryContainer);
