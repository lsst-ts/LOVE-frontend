import {
  RECEIVE_GROUP_CONFIRMATION_MESSAGE,
  RECEIVE_GROUP_SUBSCRIPTION_DATA,
  ADD_GROUP_SUBSCRIPTION,
  REMOVE_GROUP_SUBSCRIPTION,
  CHANGE_WS_STATE,
  UPDATE_LAST_SAL_COMMAND,
  UPDATE_LAST_SAL_COMMAND_STATUS,
} from '../actions/actionTypes';
import ManagerInterface, { sockette } from '../../Utils';
import { receiveImageSequenceData, receiveCameraStateData, receiveReadoutData } from './camera';
import { receiveScriptHeartbeat, removeScriptsHeartbeats, receiveCSCHeartbeat } from './heartbeats';
import { receiveLogMessageData, receiveErrorCodeData } from './summaryData';

export const connectionStates = {
  OPENING: 'OPENING',
  OPEN: 'OPEN',
  CLOSED: 'CLOSED',
  ERROR: 'ERROR',
};

export const SALCommandStatus = {
  REQUESTED: 'REQUESTED',
  ACK: 'ACK',
};

let socket, wsPromise;

const changeWebsocketConnectionState = (connectionState) => ({
  type: CHANGE_WS_STATE,
  connectionState,
});

const receiveGroupConfirmationMessage = (data) => ({
  type: RECEIVE_GROUP_CONFIRMATION_MESSAGE,
  data,
});

const receiveGroupSubscriptionData = ({ category, csc, salindex, data }) => {
  return {
    type: RECEIVE_GROUP_SUBSCRIPTION_DATA,
    category: category,
    csc: csc,
    salindex: salindex,
    data: data,
  };
};

/**
 * Opens a new websocket connection assuming:
 * - authentication with backend went ok
 * - it does not matter if it was or was not connected before
 */
export const openWebsocketConnection = () => {
  const token = ManagerInterface.getToken();

  const connectionPath = ManagerInterface.getWebsocketsUrl() + token;

  return (dispatch, getState) => {
    changeWebsocketConnectionState(connectionStates.OPENING);

    wsPromise = new Promise((resolve) => {
      socket = sockette(connectionPath, {
        onopen: () => {
          dispatch(changeWebsocketConnectionState(connectionStates.OPEN));
          resolve();
        },
        onmessage: (msg) => {
          if (!msg.data) return;

          const data = JSON.parse(msg.data);
          if (!data.category) {
            dispatch(receiveGroupConfirmationMessage(data.data));
            return;
          }
          if (data.category === 'event') {
            const stream = data.data[0].data;
            if (data.data[0].csc === 'ATCamera') {
              if (stream.startIntegration || stream.endReadout || stream.startReadout || stream.endOfImageTelemetry) {
                dispatch(receiveImageSequenceData(stream));
              } else if (stream.imageReadoutParameters) {
                dispatch(receiveReadoutData(stream));
              } else if(stream.startIntegration || 
                stream.raftsDetailedState || 
                stream.shutterDetailedState || 
                stream.imageReadinessDetailedState || 
                stream.calibrationDetailedState){
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

          data.data.forEach((stream) => {
            dispatch(
              receiveGroupSubscriptionData({
                category: data.category,
                ...stream,
              }),
            );
          });
        },
        onclose: () => {
          dispatch(changeWebsocketConnectionState(connectionStates.CLOSED));
        },
        onerror: () => {
          dispatch(changeWebsocketConnectionState(connectionStates.ERROR));
          resolve();
        },
      });
    });
  };
};

export const addGroupSubscription = (groupName) => ({
  type: ADD_GROUP_SUBSCRIPTION,
  groupName,
});

export const removeGroupSubscription = (groupName) => ({
  type: REMOVE_GROUP_SUBSCRIPTION,
  groupName,
});

export const requestGroupSubscription = (groupName) => {
  return (dispatch, getState) => {
    if (!wsPromise) {
      dispatch(openWebsocketConnection());
      setTimeout(() => dispatch(requestGroupSubscription(groupName)), 1000);
      return;
    }

    const [category, csc, salindex, stream] = groupName.split('-');
    wsPromise.then(() => {
      const state = getState();
      if (state.ws.connectionState !== connectionStates.OPEN) {
        console.warn(`Can not subscribe to ${groupName}, websocket connection status is: ${state.ws.connectionState}`);
      }
      socket.json({
        option: 'subscribe',
        category,
        csc,
        salindex,
        stream,
      });
      dispatch(addGroupSubscription(groupName));
    });
  };
};

export const requestGroupSubscriptionRemoval = (groupName) => {
  return (dispatch, getState) => {
    if (!wsPromise) {
      dispatch(openWebsocketConnection());
      setTimeout(() => dispatch(requestGroupSubscriptionRemoval(groupName)), 1000);
      return;
    }

    const [category, csc, salindex, stream] = groupName.split('-');

    wsPromise.then(() => {
      const state = getState();
      if (state.ws.connectionState !== connectionStates.OPEN) {
        console.warn(`Can not subscribe to ${groupName}, websocket connection status is: ${state.ws.connectionState}`);
      }

      socket.json({
        option: 'unsubscribe',
        category,
        csc,
        salindex: parseInt(salindex),
        stream,
      });
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
        salindex: 1,
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
        cmd_id: commandID,
      };

      dispatch(updateLastSALCommand(commandStatus, SALCommandStatus.REQUESTED));
    });

    return commandID;
  }
}