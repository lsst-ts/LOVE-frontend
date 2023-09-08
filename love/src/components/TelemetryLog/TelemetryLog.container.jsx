/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed for Inria Chile.

This program is free software: you can redistribute it and/or modify it under 
the terms of the GNU General Public License as published by the Free Software 
Foundation, either version 3 of the License, or at your option) any later version.

This program is distributed in the hope that it will be useful,but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR 
 A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with 
this program. If not, see <http://www.gnu.org/licenses/>.
*/

import React, { useState } from 'react';
import { connect } from 'react-redux';
import TelemetryLog from './TelemetryLog';
import { addGroup, removeGroup, requestSALCommand } from '../../redux/actions/ws';

export const schema = {
  description: 'Internal use',
  defaultSize: [63, 17],
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
      default: 'Telemetry log',
    },
    margin: {
      type: 'boolean',
      description: 'Whether to display component with a margin',
      isPrivate: false,
      default: true,
    },
  },
};

export const saveGroupSubscriptions = (Component) => {
  return () => {
    const [subscriptionsList, setSubscriptionsList] = useState([]);

    const saveSubscriptionLocally = (groupName) => {
      if (!subscriptionsList.includes(groupName)) {
        setSubscriptionsList([...subscriptionsList, groupName]);
      }
    };

    const removeSubscriptionLocally = (groupName) => {
      setSubscriptionsList(subscriptionsList.filter((name) => name !== groupName));
    };

    return (
      <Component
        subscriptionsList={subscriptionsList}
        saveSubscriptionLocally={saveSubscriptionLocally}
        removeSubscriptionLocally={removeSubscriptionLocally}
      />
    );
  };
};

const TelemetryLogContainer = ({
  streams,
  subscriptionsList,
  saveSubscriptionLocally,
  removeSubscriptionLocally,
  subscribeToStream,
  unsubscribeToStream,
  requestSALCommand,
}) => {
  const subscribeAndSaveGroup = (groupName) => {
    subscribeToStream(groupName);
    saveSubscriptionLocally(groupName);
  };

  const unsubscribeAndRemoveGroup = (groupName) => {
    unsubscribeToStream(groupName);
    removeSubscriptionLocally(groupName);
  };

  return (
    <TelemetryLog
      streams={streams}
      subscribeToStream={subscribeAndSaveGroup}
      unsubscribeToStream={unsubscribeAndRemoveGroup}
      subscriptionsList={subscriptionsList}
      requestSALCommand={requestSALCommand}
    />
  );
};

const mapStateToProps = (state, ownProps) => {
  let streams = state.ws.subscriptions.filter((s) => ownProps.subscriptionsList.includes(s.groupName));
  if (streams.length === 0) return {};
  streams = streams.filter((s) => s.data);

  if (streams.length === 0) return {};
  return { streams: streams };
};

const mapDispatchToProps = (dispatch) => {
  return {
    subscribeToStream: (groupName) => {
      dispatch(addGroup(groupName));
    },
    unsubscribeToStream: (groupName) => {
      dispatch(removeGroup(groupName));
    },
    requestSALCommand: (cmd) => {
      dispatch(requestSALCommand(cmd));
    },
  };
};

export default saveGroupSubscriptions(connect(mapStateToProps, mapDispatchToProps)(TelemetryLogContainer));
