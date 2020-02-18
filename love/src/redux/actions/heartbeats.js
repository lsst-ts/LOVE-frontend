import {
  UPDATE_SCRIPT_HEARTBEAT,
  REMOVE_SCRIPTS_HEARTBEATS,
  UPDATE_CSC_HEARTBEATS,
  RECEIVE_MANAGER_HEARTBEAT,
} from './actionTypes';

/**
 * Receives the stream data with the heartbeat of a script in a queue of index=queueSalIndex
 * @param {object} data
 * @param {number} queueSalIndex
 */
export const receiveScriptHeartbeat = (data, queueSalIndex) => {
  return {
    type: UPDATE_SCRIPT_HEARTBEAT,
    data: {
      queueSalIndex,
      salindex: data.salindex,
      lost: data.lost,
      lastHeartbeatTimestamp: data.last_heartbeat_timestamp,
    },
  };
};

export const removeScriptsHeartbeats = (salIndices) => {
  return {
    type: REMOVE_SCRIPTS_HEARTBEATS,
    salIndices,
  };
};

export const receiveCSCHeartbeat = (heartbeat) => {
  return {
    type: UPDATE_CSC_HEARTBEATS,
    data: heartbeat,
  };
};

export const receiveManagerHeartbeat = (heartbeat) => {
  return {
    type: RECEIVE_MANAGER_HEARTBEAT,
    data: {
      heartbeat,
    },
  };
};
