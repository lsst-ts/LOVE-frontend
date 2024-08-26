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

import React from 'react';
import { connect } from 'react-redux';
import { getStreamData } from '../../../redux/selectors';
import { addGroup, removeGroup } from '../../../redux/actions/ws';
import EventState from './EventState';

const exampleStateMap = {
  0: 'UNKNOWN',
  1: 'OFF',
  2: 'STANDBY',
  3: 'DISABLED',
  4: 'ENABLED',
  5: 'FAULT',
  7: 'CUSTOM',
};

export const schema = {
  description: `Component for displaying CSCs states`,
  defaultSize: [25, 30],
  props: {
    title: {
      type: 'string',
      description: 'Name diplayed in the title bar (if visible)',
      isPrivate: false,
      default: 'EventState',
    },
    label: {
      type: 'string',
      description: 'Status label',
      isPrivate: false,
      default: 'Azimuth state',
    },
    subscription: {
      type: 'string',
      description:
        'Telemetry/Event to listen to in the format: <"event"|"telemetry">-<CSC>-<CSCIndex>-<topic>, e.g. "event-ATMCS-0-m3State"',
      isPrivate: false,
      default: 'event-ATMCS-0-m3State',
    },
    stateMap: {
      type: 'object',
      description: 'Object containing the mapping of every state to a text',
      isPrivate: false,
      default: exampleStateMap,
    },
    hasRawMode: {
      type: 'boolean',
      description: 'Whether the component has a raw mode version',
      isPrivate: false,
      default: false,
    },
  },
};

const EventStateContainer = ({
  subscription,
  streamData,
  stateMap,
  subscribeToStreams,
  unsubscribeToStreams,
  ...props
}) => {
  return (
    <EventState
      subscription={subscription}
      subscribeToStreams={subscribeToStreams}
      unsubscribeToStreams={unsubscribeToStreams}
      streamData={streamData}
      stateMap={stateMap}
      {...props}
    />
  );
};

const mapStateToProps = (state, ownProps) => {
  const streamData = getStreamData(state, ownProps.subscription);
  return { streamData: streamData };
};

const mapDispatchToProps = (dispatch) => {
  return {
    subscribeToStreams: (streams) => {
      // streams.forEach((groupName) => {
      //   dispatch(addGroup(groupName));
      // });
      dispatch(addGroup(streams));
    },
    unsubscribeToStreams: (streams) => {
      // streams.forEach((groupName) => {
      //   dispatch(removeGroup(groupName));
      // });
      dispatch(removeGroup(streams));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EventStateContainer);
