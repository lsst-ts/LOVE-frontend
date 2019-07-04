import { UPDATE_SCRIPT_HEARTBEAT } from './actionTypes';

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
