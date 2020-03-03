import {
  RECEIVE_GROUP_CONFIRMATION_MESSAGE,
  RECEIVE_GROUP_SUBSCRIPTION_DATA,
  ADD_GROUP_SUBSCRIPTION,
  REQUEST_SUBSCRIPTIONS,
  REQUEST_GROUP_UNSUBSCRIPTION,
  RECEIVE_GROUP_REMOVAL_CONFIRMATION_MESSAGE,
  RESET_SUBSCRIPTIONS,
  CHANGE_WS_STATE,
  UPDATE_LAST_SAL_COMMAND,
  UPDATE_LAST_SAL_COMMAND_STATUS,
} from '../actions/actionTypes';
import ManagerInterface, { sockette } from '../../Utils';
import { receiveImageSequenceData, receiveCameraStateData, receiveReadoutData } from './camera';
import { receiveScriptHeartbeat, removeScriptsHeartbeats, receiveCSCHeartbeat, receiveManagerHeartbeat } from './heartbeats';
import { receiveLogMessageData, receiveErrorCodeData } from './summaryData';
import { receiveAlarms } from './alarms';
import { receiveObservingLog } from './observingLogs';
import { getConnectionStatus, getTokenStatus, getToken, getSubscriptions } from '../selectors';
import { tokenStates } from '../reducers/auth';

export const connectionStates = {
  OPENING: 'OPENING',
  OPEN: 'OPEN',
  CLOSED: 'CLOSED',
  RETRYING: 'RETRYING',
  ERROR: 'ERROR',
  REJECTED: 'REJECTED',
};

export const groupStates = {
  PENDING: 'PENDING',
  REQUESTING: 'REQUESTING',
  SUBSCRIBED: 'SUBSCRIBED',
  UNSUBSCRIBING: 'UNSUBSCRIBING',
}

const nonConnectableTokenStates = [
  tokenStates.EMPTY,
  tokenStates.REJECTED,
  tokenStates.EXPIRED,
  tokenStates.REMOVED_REMOTELY,
  tokenStates.REMOVE_REQUESTED,
  tokenStates.REMOVE_ERROR,
];

export const SALCommandStatus = {
  REQUESTED: 'REQUESTED',
  ACK: 'ACK',
};

let socket;

const _changeConnectionState = (connectionState) => ({
  type: CHANGE_WS_STATE,
  connectionState,
});

const _receiveGroupSubscriptionData = ({ category, csc, salindex, data }) => {
  return {
    type: RECEIVE_GROUP_SUBSCRIPTION_DATA,
    category: category,
    csc: csc,
    salindex: salindex,
    data: data,
  };
};

const _resetSubscriptions = (subscriptions) => {
  return {
    type: RESET_SUBSCRIPTIONS,
    subscriptions: subscriptions ? subscriptions.map( sub => ({
      ...sub,
      status: groupStates.PENDING,
      confirmationMessage: undefined,
    })) : [],
  }
}

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
        dispatch(_changeConnectionState(connectionStates.CLOSED));
      }
      return;
    }
    const connectionStatus = getConnectionStatus(getState());

    if (connectionStatus === connectionStates.OPEN || connectionStatus === connectionStates.OPENING) {
      return;
    }
    const token = getToken(getState());
    const connectionPath = ManagerInterface.getWebsocketsUrl() + token;
    console.log('Opening ws connection, token: ', token);
    dispatch(_changeConnectionState(connectionStates.OPENING));

    socket = sockette(connectionPath, {
      onopen: () => {
        dispatch(_changeConnectionState(connectionStates.OPEN));
        dispatch(_requestSubscriptions());
      },
      onclose: (event) => {
        if (event.code === 4000 || event.code === 1000) {
          dispatch(_changeConnectionState(connectionStates.CLOSED));
        } else {
          dispatch(_changeConnectionState(connectionStates.RETRYING));
          dispatch(_resetSubscriptions(getSubscriptions(getState())));
        }
      },
      onerror: () => {
        dispatch(_changeConnectionState(connectionStates.RETRYING));
        dispatch(_resetSubscriptions(getSubscriptions(getState())));
      },
      onmessage: (msg) => {
        if (!msg.data) return;

        const data = JSON.parse(msg.data);
        if (!data.category) {
          if (data.data.includes('unsubscribed')) {
            dispatch({
              type: RECEIVE_GROUP_REMOVAL_CONFIRMATION_MESSAGE,
              data: data.data,
            });
          } else {
            dispatch({
              type: RECEIVE_GROUP_CONFIRMATION_MESSAGE,
              data: data.data,
            });
          }
          return;
        }
        if (data.category === 'heartbeat') {
          dispatch(receiveManagerHeartbeat(data.data[0]));
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
            if (stream.stream.finished_scripts) {
              const finishedIndices = stream.stream.finished_scripts.map((script) => script.index);
              dispatch(removeScriptsHeartbeats(finishedIndices));
            }
          }

          if (data.data[0].csc === 'Heartbeat') {
            dispatch(receiveCSCHeartbeat(stream.stream));
          }

          if (data.data[0].csc === 'Watcher') {
            dispatch(receiveAlarms(stream.alarm));
          }

          if (data.data[0].data.logMessage) {
            dispatch(receiveLogMessageData(data.data[0].csc, data.data[0].salindex, data.data[0].data.logMessage));
          }

          if (data.data[0].data.errorCode) {
            dispatch(receiveErrorCodeData(data.data[0].csc, data.data[0].salindex, data.data[0].data.errorCode));
          }
        }

        if (data.category === 'ack') {
          dispatch(updateLastSALCommandStatus(SALCommandStatus.ACK, data.data[0].data.stream.result));
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
  };
};

/**
 * Closes the websocket connection
 */
export const closeWebsocketConnection = () => {

  return (dispatch, getState) => {
    dispatch({ type: RESET_SUBSCRIPTIONS, subscriptions: [] });
    if (socket && getConnectionStatus(getState()) !== connectionStates.CLOSED) {
      socket.close();
      dispatch(_changeConnectionState(connectionStates.CLOSED));
    }
  }
};

export const addGroupSubscription = (groupName) => {
  return (dispatch, _getState) => {
    dispatch({
      type: ADD_GROUP_SUBSCRIPTION,
      groupName,
    });
    dispatch(_requestSubscriptions());
  };
};
//
// export const removeGroupSubscription = (groupName) => ({
//   type: REMOVE_GROUP_SUBSCRIPTION,
//   groupName,
// });

// export const requestGroupSubscription = (groupName) => {
//   return (dispatch, getState) => {
//     const connected = new Promise(async(resolve) => {
//       let connectionStatus;
//       do {
//         connectionStatus = getConnectionStatus(getState());
//         if (connectionStatus === connectionStates.OPEN) {
//           resolve();
//           return;
//         }
//         await new Promise(resolve => setTimeout(resolve, 1000));
//       } while (connectionStatus !== connectionStates.REJECTED);
//     });
//
//     const [category, csc, salindex, stream] = groupName.split('-');
//     connected.then(() => {
//       const state = getState();
//       if (state.ws.connectionState !== connectionStates.OPEN) {
//         console.warn(`Can not subscribe to ${groupName}, websocket connection status is: ${state.ws.connectionState}`);
//         return;
//       }
//       socket.json({
//         option: 'subscribe',
//         category,
//         csc,
//         salindex,
//         stream,
//       });
//       dispatch(addGroupSubscription(groupName));
//     });
//   };
// };

const _requestSubscriptions = () => {
  return (dispatch, getState) => {
    const state = getState();
    const connectionStatus = getConnectionStatus(state);
    if (connectionStatus !== connectionStates.OPEN) {
      return;
    }
    const subscriptions = getSubscriptions(state);
    subscriptions.forEach( subscription => {
      if (subscription.status !== groupStates.PENDING) return;
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

export const requestGroupSubscriptionRemoval = (groupName) => {
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
      salindex: salindex,
      stream,
    });
    dispatch({
      type: REQUEST_GROUP_UNSUBSCRIPTION,
      groupName,
    });
  };
};

export const updateLastSALCommand = (cmd, status) => {
  return {
    type: UPDATE_LAST_SAL_COMMAND,
    status,
    ...cmd,
  };
};

export const updateLastSALCommandStatus = (status, result) => {
  return {
    type: UPDATE_LAST_SAL_COMMAND_STATUS,
    status,
    result,
  };
};

export const requestSALCommand = (data) => {
  /**
   * Requests the LOVE-producer to send a command to the SAL (salobj)
   * via a websocket message through the LOVE-manager.
   *
   * Tries to open a websocket connection if it does not exist and retries after 0.5s.
   */
  const commandID = `${Date.now()}-${data.cmd}`;
  return (dispatch, getState) => {
    if (!wsPromise) {
      dispatch(openWebsocketConnection());
      setTimeout(() => dispatch(requestSALCommand(data)), 500);
      return;
    }

    wsPromise.then(() => {
      const state = getState();
      if (state.ws.connectionState !== connectionStates.OPEN) {
        console.warn(`Can not send commands, websocket connection status is: ${state.ws.connectionState}`);
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
    });

    return commandID;
  };
};

export const sendLOVECscObservingLogs = (user, message) => {
  return (dispatch, getState) => {
    if (!wsPromise) {
      dispatch(openWebsocketConnection());
      setTimeout(() => dispatch(sendLOVECscObservingLogs(user, message)), 500);
      return;
    }

    wsPromise.then(() => {
      const state = getState();
      if (state.ws.connectionState !== connectionStates.OPEN) {
        console.warn(`Can not send observingLogs, websocket connection status is: ${state.ws.connectionState}`);
      }

      const logsObject = {
        csc: 'love',
        salindex: 0,
        data: {
          observingLog: {
            user: user,
            message: message,
          },
        },
      };

      socket.json({
        category: 'love_csc',
        data: [logsObject],
      });
    });
  };
};
