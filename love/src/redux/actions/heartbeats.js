import { UPDATE_SCRIPT_HEARTBEAT, REMOVE_SCRIPTS_HEARTBEATS } from './actionTypes';

export const receiveScriptHeartbeat = (data) => {
  return {
    type: UPDATE_SCRIPT_HEARTBEAT,
    data: {
      salindex: data.salindex,
      lost: data.lost,
      lastHeartbeatTimestamp: data.last_heartbeat_timestamp,
    }
  };
};


export const removeScriptsHeartbeats = (salIndices) => {
  console.log(salIndices);
  return {
    type: REMOVE_SCRIPTS_HEARTBEATS,
    salIndices
  }
}