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

import { DateTime } from 'luxon';
import {
  RECEIVE_GROUP_CONFIRMATION_MESSAGE,
  RECEIVE_GROUP_SUBSCRIPTION_DATA,
  ADD_GROUP,
  REMOVE_GROUP,
  REQUEST_SUBSCRIPTIONS,
  REQUEST_GROUP_UNSUBSCRIPTION,
  RECEIVE_GROUP_UNSUBSCRIPTION_CONFIRMATION,
  RESET_SUBSCRIPTIONS,
  CHANGE_WS_STATE,
  UPDATE_LAST_SAL_COMMAND,
  UPDATE_LAST_SAL_COMMAND_STATUS,
  SEND_ACTION,
} from './actionTypes';
import ManagerInterface, { sockette } from '../../Utils';
import { receiveImageSequenceData, receiveCameraStateData, receiveReadoutData } from './camera';
import {
  receiveScriptHeartbeat,
  removeScriptsHeartbeats,
  receiveCSCHeartbeat,
  receiveHeartbeatInfo,
} from './heartbeats';
import { receiveLogMessageData, receiveErrorCodeData } from './summaryData';
import { receiveAlarm, receiveAllAlarms } from './alarms';
import { receiveServerTime } from './time';
import { receiveObservingLog } from './observingLogs';
import { getConnectionStatus, getTokenStatus, getToken, getSubscriptions, getSubscription } from '../selectors';
import { tokenStates } from '../reducers/auth';

/**
 * Time to wait before reseting subscriptions in miliseconds
 * Now set to 5 minutes
 */
export const RESET_SUBS_PERIOD = 5 * 60000;

/**
 * Set of possible connection status values
 */
export const connectionStates = {
  OPENING: 'OPENING',
  OPEN: 'OPEN',
  CLOSED: 'CLOSED',
  RETRYING: 'RETRYING',
};

/**
 * Set of possible group status values
 */
export const groupStates = {
  PENDING: 'PENDING',
  REQUESTING: 'REQUESTING',
  SUBSCRIBED: 'SUBSCRIBED',
  UNSUBSCRIBING: 'UNSUBSCRIBING',
};

/**
 * Set of Token statuses that are non capable of establishing a websocket connection
 */
const nonConnectableTokenStates = [
  tokenStates.EMPTY,
  tokenStates.REJECTED,
  tokenStates.EXPIRED,
  tokenStates.REMOVED_REMOTELY,
  tokenStates.REMOVE_REQUESTED,
  tokenStates.REMOVE_ERROR,
];

/**
 * Set of possible SALCommandStatus values
 */
export const SALCommandStatus = {
  REQUESTED: 'REQUESTED',
  ACK: 'ACK',
};

let socket;

/**
 * Change to connectionState to the given value
 */
const _changeConnectionState = (connectionState, currentSocket) => ({
  type: CHANGE_WS_STATE,
  connectionState,
  socket: currentSocket,
});

/**
 * Receive subscription confirmaiton message
 */
const _receiveSubscriptionConfirmation = (data) => ({
  type: RECEIVE_GROUP_CONFIRMATION_MESSAGE,
  data,
});

/**
 * Receive unsubscription confirmaiton message
 */
const _receiveUnsubscriptionConfirmation = (data) => ({
  type: RECEIVE_GROUP_UNSUBSCRIPTION_CONFIRMATION,
  data,
});

/**
 * Receive data from a subscribed group
 */
const _receiveGroupSubscriptionData = ({ category, csc, salindex, data }) => {
  return {
    type: RECEIVE_GROUP_SUBSCRIPTION_DATA,
    category,
    csc,
    salindex,
    data,
  };
};

/**
 * Reference to the timer used to reset subscriptions periodically
 */
let resetSubsTimer = null;

/**
 * Reset all the given subscriptions (status PENDING and no confirmationMessage)
 * If the "subscriptions" argument is absent or null, then all the subscriptions are reset
 * It also sets a timer to reset the subscriptions again (calling itself) after the priod defined by RESET_SUBS_PERIOD
 */
export const resetSubscriptions = (subscriptions = null) => {
  return (dispatch, getState) => {
    const subs = subscriptions || getSubscriptions(getState());
    clearInterval(resetSubsTimer);
    resetSubsTimer = setInterval(() => dispatch(resetSubscriptions()), RESET_SUBS_PERIOD);
    dispatch({
      type: RESET_SUBSCRIPTIONS,
      subscriptions:
        subs?.map((sub) => ({
          ...sub,
          status: groupStates.PENDING,
          confirmationMessage: undefined,
        })) || [],
    });
    dispatch(_requestSubscriptions());
  };
};

/**
 * Opens a new websocket connection assuming:
 * - authentication with backend went ok
 * - it does not matter if it was or was not connected before
 */
export const openWebsocketConnection = () => {
  return (dispatch, getState) => {
    const tokenStatus = getTokenStatus(getState());

    if (nonConnectableTokenStates.includes(tokenStatus)) {
      const connectionStatus = getConnectionStatus(getState());
      if (connectionStatus !== connectionStates.CLOSED) {
        dispatch(_changeConnectionState(connectionStates.CLOSED, socket));
        dispatch(resetSubscriptions(getSubscriptions(getState())));
      }
      return;
    }
    const connectionStatus = getConnectionStatus(getState());

    if (connectionStatus === connectionStates.OPEN || connectionStatus === connectionStates.OPENING) {
      return;
    }
    const token = getToken(getState());

    const connectionPath = ManagerInterface.getWebsocketsUrl() + token;

    socket = sockette(connectionPath, {
      onopen: () => {
        dispatch(_changeConnectionState(connectionStates.OPEN, socket));
        dispatch(_requestSubscriptions());
        clearInterval(resetSubsTimer);
        resetSubsTimer = setInterval(() => dispatch(resetSubscriptions()), RESET_SUBS_PERIOD);
      },
      onclose: (event) => {
        if (event.code === 4000 || event.code === 1000) {
          dispatch(_changeConnectionState(connectionStates.CLOSED, socket));
        } else {
          dispatch(_changeConnectionState(connectionStates.RETRYING, socket));
        }
        dispatch(resetSubscriptions(getSubscriptions(getState())));
      },
      onerror: () => {
        dispatch(_changeConnectionState(connectionStates.RETRYING, socket));
        dispatch(resetSubscriptions(getSubscriptions(getState())));
      },
      onmessage: (msg) => {
        if (!msg.data) return;

        let cleanMsgData = msg.data;
        cleanMsgData = cleanMsgData.replace(/NaN/g, '"NaN"');
        cleanMsgData = cleanMsgData.replace(/-?Infinity/g, (match) => {
          return match === '-Infinity' ? '"-Infinity"' : '"Infinity"';
        });

        const data = JSON.parse(cleanMsgData);
        if (!data.category) {
          if (data.time_data) {
            dispatch(receiveServerTime(data.time_data, data.request_time));
          } else if (data.data.includes('unsubscribed')) {
            dispatch(_receiveUnsubscriptionConfirmation(data.data));
          } else {
            dispatch(_receiveSubscriptionConfirmation(data.data));
          }
          return;
        }
        if (data.category === 'heartbeat') {
          dispatch(receiveHeartbeatInfo(data.data));
        }
        if (data.category === 'event') {
          const stream = data.data[0].data;
          if (data.data[0].csc === 'ATCamera') {
            if (stream.startIntegration || stream.endReadout || stream.startReadout || stream.endOfImageTelemetry) {
              dispatch(receiveImageSequenceData(stream));
            } else if (stream.imageReadoutParameters) {
              dispatch(receiveReadoutData(stream));
            } else if (
              stream.startIntegration ||
              stream.raftsDetailedState ||
              stream.shutterDetailedState ||
              stream.imageReadinessDetailedState ||
              stream.calibrationDetailedState
            ) {
              dispatch(receiveCameraStateData(stream));
            }
          }
          if (data.data[0].csc === 'ScriptHeartbeats') {
            if (
              stream.stream.script_heartbeat.salindex ||
              stream.stream.script_heartbeat.lost ||
              stream.stream.script_heartbeat.last_heartbeat_timestamp
            ) {
              const queueSalindex = data.data[0].salindex;
              dispatch(receiveScriptHeartbeat(stream.stream.script_heartbeat, queueSalindex));
            }
          }

          if (data.data[0].csc === 'ScriptQueueState') {
            if (stream.scriptsStream?.finished_scripts) {
              const finishedIndices = stream.scriptsStream.finished_scripts.map((script) => script.index);
              dispatch(removeScriptsHeartbeats(finishedIndices));
            }
          }

          if (data.data[0].csc === 'Heartbeat') {
            dispatch(receiveCSCHeartbeat(stream.stream));
          }

          if (data.data[0].csc === 'Watcher') {
            if (stream.alarm) dispatch(receiveAlarm(stream.alarm[0]));
            else if (stream.stream) dispatch(receiveAllAlarms(stream.stream.alarms));
          }

          if (data.data[0].data.logMessage) {
            dispatch(receiveLogMessageData(data.data[0].csc, data.data[0].salindex, data.data[0].data.logMessage));
          }

          if (data.data[0].data.errorCode) {
            dispatch(receiveErrorCodeData(data.data[0].csc, data.data[0].salindex, data.data[0].data.errorCode));
          }
        }

        if (data.data[0].data.observingLog) {
          dispatch(receiveObservingLog(data.data[0].data.observingLog));
        }

        data.data.forEach((stream) => {
          dispatch(
            _receiveGroupSubscriptionData({
              category: data.category,
              ...stream,
            }),
          );
        });
      },
    });
    dispatch(_changeConnectionState(connectionStates.OPENING, socket));
  };
};

/**
 * Closes the websocket connection
 */
export const closeWebsocketConnection = () => {
  return (dispatch, getState) => {
    dispatch(resetSubscriptions(getSubscriptions(getState())));
    if (socket && getConnectionStatus(getState()) !== connectionStates.CLOSED) {
      socket.close();
      dispatch(_changeConnectionState(connectionStates.CLOSED, socket));
    }
  };
};

/**
 * Add a group to the list of subscriptions, groups are added in PENDING state
 */
export const addGroup = (groupName) => {
  return (dispatch, _getState) => {
    dispatch({
      type: ADD_GROUP,
      groupName,
    });
    dispatch(_requestSubscriptions());
  };
};

/**
 * Request subscription for all PENDING subscriptions
 */
const _requestSubscriptions = () => {
  return (dispatch, getState) => {
    const state = getState();
    const connectionStatus = getConnectionStatus(state);
    if (connectionStatus !== connectionStates.OPEN) {
      return;
    }
    const subscriptions = getSubscriptions(state);
    subscriptions.forEach((subscription) => {
      if (subscription.status !== groupStates.PENDING && subscription.status !== groupStates.UNSUBSCRIBING) return;
      const [category, csc, salindex, stream] = subscription.groupName.split('-');
      socket.json({
        option: 'subscribe',
        category,
        csc,
        salindex,
        stream,
      });
    });
    dispatch({
      type: REQUEST_SUBSCRIPTIONS,
      subscriptions,
    });
  };
};

/**
 * Reduce the counter of subscriptions for a given group. If the counter reaches 0 then an unsubscription is requested
 */
export const removeGroup = (groupName) => {
  return (dispatch, getState) => {
    const state = getState();
    const subscription = getSubscription(state, groupName);
    if (!subscription) return;
    dispatch({
      type: REMOVE_GROUP,
      groupName,
    });
    if (subscription.counter === 1) {
      dispatch(requestGroupRemoval(groupName));
    }
  };
};
/**
 * Request the unsubscription of a given group
 */
export const requestGroupRemoval = (groupName) => {
  return (dispatch, getState) => {
    const state = getState();
    const connectionStatus = getConnectionStatus(state);
    if (connectionStatus !== connectionStates.OPEN) {
      return;
    }

    const [category, csc, salindex, stream] = groupName.split('-');
    socket.json({
      option: 'unsubscribe',
      category,
      csc,
      salindex,
      stream,
    });
    dispatch({
      type: REQUEST_GROUP_UNSUBSCRIPTION,
      groupName,
    });
  };
};

export const updateLastSALCommand = (cmd, status, statusCode) => {
  return {
    type: UPDATE_LAST_SAL_COMMAND,
    status,
    statusCode,
    ...cmd,
  };
};

export const updateLastSALCommandStatus = (status, statusCode, result) => {
  return {
    type: UPDATE_LAST_SAL_COMMAND_STATUS,
    status,
    statusCode,
    result,
  };
};

/**
 * Requests the LOVE-producer to send a command to the SAL (salobj)
 * via an HTTP request through the LOVE-manager.
 *
 */
export const requestSALCommand = (data) => {
  return (dispatch, getState) => {
    const url = `${ManagerInterface.getApiBaseUrl()}cmd/`;
    const commandID = `${Date.now()}-${data.cmd}`;
    const commandStatus = {
      cmd: data.cmd,
      params: data.params,
      csc: data.csc ?? data.component, // this is for backwards compatibility
      salindex: data.salindex,
    };
    dispatch(
      updateLastSALCommand(
        {
          ...commandStatus,
          statusCode: null,
          cmd_id: commandID,
        },
        SALCommandStatus.REQUESTED,
        null,
      ),
    );

    return fetch(url, {
      method: 'POST',
      body: JSON.stringify({ ...commandStatus }),
      headers: ManagerInterface.getHeaders(),
    })
      .then((r) => {
        return r.json().then((data) => ({
          statusCode: r.status,
          data,
        }));
      })
      .then(({ statusCode, data }) => {
        dispatch(updateLastSALCommandStatus(SALCommandStatus.ACK, statusCode, data?.ack));
      });
  };
};

export const _requestSALCommand = (data) => {
  const commandID = `${Date.now()}-${data.cmd}`;
  return (dispatch, getState) => {
    const state = getState();
    const connectionStatus = getConnectionStatus(state);
    if (connectionStatus !== connectionStates.OPEN) {
      return false;
    }

    const commandObject = {
      csc: data.component,
      salindex: data.salindex,
      data: {
        stream: {
          cmd: data.cmd,
          params: data.params,
          cmd_id: commandID,
        },
      },
    };

    socket.json({
      category: 'cmd',
      data: [commandObject],
    });

    const commandStatus = {
      cmd: data.cmd,
      params: data.params,
      component: data.component,
      salindex: data.salindex,
      cmd_id: commandID,
    };

    dispatch(updateLastSALCommand(commandStatus, SALCommandStatus.REQUESTED));
    return commandID;
  };
};

/**
 * Requests the LOVE-producer to send a command to the SAL (salobj)
 * via an HTTP request through the LOVE-manager.
 *
 */
export const sendLOVECscObservingLogs = (observingLogMsg) => {
  return (dispatch, getState) => {
    const url = `${ManagerInterface.getApiBaseUrl()}lovecsc/observinglog`;

    return fetch(url, {
      method: 'POST',
      body: JSON.stringify(observingLogMsg),
      headers: ManagerInterface.getHeaders(),
    })
      .then((r) => r.json())
      .then((data) => {
        // TODO: confirmation to the user? what kind?
        // console.log(data);
      });
  };
};

export const _sendLOVECscObservingLogs = (user, message) => {
  return (dispatch, getState) => {
    const state = getState();
    const connectionStatus = getConnectionStatus(state);
    if (connectionStatus !== connectionStates.OPEN) {
      return false;
    }

    const logsObject = {
      csc: 'love',
      salindex: 0,
      data: {
        observingLog: {
          user,
          message,
        },
      },
    };

    socket.json({
      category: 'love_csc',
      data: [logsObject],
    });
  };
};

/**
 * Request an action to the server
 */
export const sendAction = (action) => {
  return (dispatch, getState) => {
    if (getConnectionStatus(getState()) !== connectionStates.OPEN) {
      return;
    }
    socket.json({
      action,
      request_time: DateTime.utc().toSeconds(),
    });
    dispatch({
      type: SEND_ACTION,
      action,
    });
  };
};
