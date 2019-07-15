import {
  RECEIVE_GROUP_CONFIRMATION_MESSAGE,
  RECEIVE_GROUP_SUBSCRIPTION_DATA,
  ADD_GROUP_SUBSCRIPTION,
  REMOVE_GROUP_SUBSCRIPTION,
  CHANGE_WS_STATE,
  UPDATE_LAST_SAL_COMMAND,
} from '../actions/actionTypes';
import ManagerInterface, { sockette } from '../../Utils';
import { receiveImageSequenceData, receiveCameraStateData, receiveReadoutData } from './camera';
import { receiveScriptHeartbeat, removeScriptsHeartbeats } from './heartbeats';

export const connectionStates = {
  OPENING: 'OPENING',
  OPEN: 'OPEN',
  CLOSED: 'CLOSED',
  ERROR: 'ERROR',
};

export const SALCommandStatus = {
  REQUESTED: 'REQUESTED',
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

const receiveGroupSubscriptionData = ({category, csc, salindex, data}) => {
  return {
    type: RECEIVE_GROUP_SUBSCRIPTION_DATA,
    category: category,
    csc: csc,
    salindex: salindex,
    data: data
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
            if (Object.keys(data.data)[0] === 'ATCamera') {
              if (
                data.data.ATCamera.startIntegration ||
                data.data.ATCamera.endReadout ||
                data.data.ATCamera.startReadout ||
                data.data.ATCamera.endOfImageTelemetry
              ) {
                dispatch(receiveImageSequenceData(data.data));
              } else if (data.data.ATCamera.imageReadoutParameters) {
                dispatch(receiveReadoutData(data.data));
              } else {
                dispatch(receiveCameraStateData(data.data));
              }
            }
            if (Object.keys(data.data)[0] === 'ScriptHeartbeats') {
              if (
                data.data.ScriptHeartbeats.stream.script_heartbeat.salindex ||
                data.data.ScriptHeartbeats.stream.script_heartbeat.lost ||
                data.data.ScriptHeartbeats.stream.script_heartbeat.last_heartbeat_timestamp
              ) {
                dispatch(receiveScriptHeartbeat(data.data.ScriptHeartbeats.stream.script_heartbeat));
              }
            }

            if (Object.keys(data.data)[0] === 'ScriptQueueState') {
              if (data.data.ScriptQueueState.stream.finished_scripts) {
                const finishedIndices = data.data.ScriptQueueState.stream.finished_scripts.map(
                  (script) => script.index,
                );
                dispatch(removeScriptsHeartbeats(finishedIndices));
              }
            }
          }

          data.data.forEach( stream =>{
            dispatch(receiveGroupSubscriptionData({
              category: data.category,
              ...stream
            }));

          })
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

    const [category, csc, stream] = groupName.split('-');

    wsPromise.then(() => {
      const state = getState();
      if (state.ws.connectionState !== connectionStates.OPEN) {
        console.warn(`Can not subscribe to ${groupName}, websocket connection status is: ${state.ws.connectionState}`);
      }

      socket.json({
        option: 'unsubscribe',
        category,
        csc,
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
export const requestSALCommand = (data) => {
  /**
   * Requests the LOVE-producer to send a command to the SAL (salobj)
   * via a websocket message through the LOVE-manager.
   *
   * Tries to open a websocket connection if it does not exist and retries after 0.5s.
   */
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
        cmd: data.cmd,
        params: data.params,
        component: data.component,
      };

      socket.json({ option: 'cmd', type: 'command_data', ...commandObject });

      dispatch(updateLastSALCommand(commandObject, SALCommandStatus.REQUESTED));
    });
  };
};
