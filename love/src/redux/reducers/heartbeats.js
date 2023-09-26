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

import {
  UPDATE_SCRIPT_HEARTBEAT,
  REMOVE_SCRIPTS_HEARTBEATS,
  UPDATE_CSC_HEARTBEATS,
  RECEIVE_HEARTBEAT_INFO,
} from '../actions/actionTypes';

const initialState = {
  scripts: [],
  cscs: [],
  lastHeartbeatInfo: undefined,
};
/**
 * Changes the state of the websocket connection to the LOVE-manager Django-Channels interface along with the list of subscriptions groups
 */
export default function (state = initialState, action) {
  switch (action.type) {
    case UPDATE_SCRIPT_HEARTBEAT: {
      const { salindex } = action.data;
      const currentHeartbeats = state.scripts;
      let found = false;

      const newHeartbeats = currentHeartbeats.map((current) => {
        if (current.salindex !== salindex) {
          return current;
        }
        found = true;
        return action.data;
      });
      if (!found) {
        newHeartbeats.push(action.data);
      }
      return { ...state, cscs: state.cscs, scripts: newHeartbeats };
    }
    case REMOVE_SCRIPTS_HEARTBEATS: {
      const currentHeartbeats = state.scripts;

      const newHeartbeats = currentHeartbeats.filter((current) => {
        return !action.salIndices.includes(current.salindex);
      });
      return {
        ...state,
        scripts: newHeartbeats,
      };
    }
    case UPDATE_CSC_HEARTBEATS: {
      const currentHeartbeats = state.cscs;
      let found = false;
      const { salindex } = action.data;
      const newHeartbeats = currentHeartbeats.map((current) => {
        if (current.csc !== action.data.csc || current.salindex !== salindex) {
          return current;
        }
        found = true;
        return action.data;
      });

      if (!found) {
        newHeartbeats.push(action.data);
      }

      return {
        ...state,
        cscs: newHeartbeats,
      };
    }
    case RECEIVE_HEARTBEAT_INFO: {
      const heartbeatDict = {};
      action.data.heartbeat.forEach((heartbeat) => {
        const name = heartbeat?.csc;
        if (name === undefined) return;
        heartbeatDict[name] = heartbeat;
      });
      return {
        ...state,
        lastHeartbeatInfo: heartbeatDict,
      };
    }
    default:
      return state;
  }
}
