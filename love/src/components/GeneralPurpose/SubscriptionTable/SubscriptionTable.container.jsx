/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed for Inria Chile Tech Team.

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
import SubscriptionTable from './SubscriptionTable';

export const schema = {
  description: `Table displaying raw subscription data`,
  defaultSize: [25, 30],
  props: {
    title: {
      type: 'string',
      description: 'Name diplayed in the title bar (if visible)',
      isPrivate: false,
      default: 'Subscription table',
    },
    label: {
      type: 'string',
      description: 'Status label',
      isPrivate: false,
      default: 'Azimuth state',
    },
    subscriptions: {
      type: 'array',
      description:
        'List of subscriptions in the format: <"event"|"telemetry">-<CSC>-<CSCIndex>-<topic>, e.g. "event-ATMCS-0-m3State"',
      isPrivate: false,
      default: ['event-ATMCS-0-m3State', 'telemetry-ATMCS-0-trajectory'],
    },
    accessors: {
      type: 'object',
      description:
        'Object containing the mapping of every data source to a function that extracts the value to be displayed',
      isPrivate: false,
      default: '{}',
    },
    _functionProps: {
      type: 'array',
      description: 'Array containing the props that are functions',
      isPrivate: true,
      default: ['accessors'],
    },
    hasRawMode: {
      type: 'boolean',
      description: 'Whether the component has a raw mode version',
      isPrivate: true,
      default: false,
    },
  },
};

const SubscriptionTableContainer = ({
  subscriptions,
  getStreamData,
  subscribeToStreams,
  unsubscribeToStreams,
  ...props
}) => {
  return (
    <SubscriptionTable
      subscriptions={subscriptions}
      subscribeToStreams={subscribeToStreams}
      unsubscribeToStreams={unsubscribeToStreams}
      getStreamData={getStreamData}
      {...props}
    />
  );
};

const mapStateToProps = (state, ownProps) => {
  const getStreamDataProp = (groupName) => getStreamData(state, groupName);
  return { getStreamData: getStreamDataProp };
};

const mapDispatchToProps = (dispatch) => {
  return {
    subscribeToStreams: (streams) => {
      streams.forEach((groupName) => {
        dispatch(addGroup(groupName));
      });
    },
    unsubscribeToStreams: (streams) => {
      streams.forEach((groupName) => {
        dispatch(removeGroup(groupName));
      });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SubscriptionTableContainer);
