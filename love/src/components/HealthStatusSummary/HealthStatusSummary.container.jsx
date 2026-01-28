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

import React from 'react';
import { connect } from 'react-redux';
import HealthStatusSummary from './HealthStatusSummary';
import { addGroup, removeGroup } from '../../redux/actions/ws';
import { getStreamsData } from '../../redux/selectors/selectors.js';
import SubscriptionTableContainer from '../GeneralPurpose/SubscriptionTable/SubscriptionTable.container';
import { HEALTH_STATUS_VARIABLES_DECLARATION } from './HealthStatusConfig/HealthStatusConfig';

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
