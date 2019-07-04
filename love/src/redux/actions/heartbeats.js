import { UPDATE_SCRIPT_HEARTBEAT } from './actionTypes';

export const receiveScriptHeartbeat = (data) => {
  return {
    type: UPDATE_SCRIPT_HEARTBEAT,
    data: data
  };
};
