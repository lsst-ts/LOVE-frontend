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

import {
  UPDATE_SCRIPT_HEARTBEAT,
  REMOVE_SCRIPTS_HEARTBEATS,
  UPDATE_CSC_HEARTBEATS,
  RECEIVE_HEARTBEAT_INFO,
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

export const receiveHeartbeatInfo = (heartbeat) => {
  return {
    type: RECEIVE_HEARTBEAT_INFO,
    data: {
      heartbeat,
    },
  };
};
