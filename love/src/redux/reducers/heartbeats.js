import { UPDATE_SCRIPT_HEARTBEAT, REMOVE_SCRIPTS_HEARTBEATS, UPDATE_CSC_HEARTBEATS } from '../actions/actionTypes';

const initialState = {
  scripts: [],
  cscs: [],
};
/**
 * Changes the state of the websocket connection to the LOVE-manager Django-Channels interface along with the list of subscriptions groups
 */
export default function(state = initialState, action) {
  switch (action.type) {
    case UPDATE_SCRIPT_HEARTBEAT: {
      const salindex = action.data.salindex;
      const currentHeartbeats = state.scripts;
      let found = false;

      let newHeartbeats = currentHeartbeats.map((current) => {
        if (current.salindex !== salindex) {
          return current;
        }
        found = true;
        return action.data;
      });
      if (!found) {
        newHeartbeats.push(action.data);
      }
      return { cscs: state.cscs, scripts: newHeartbeats };
    }
    case REMOVE_SCRIPTS_HEARTBEATS: {
      const currentHeartbeats = state.scripts;

      const newHeartbeats = currentHeartbeats.filter((current) => {
        return !action.salIndices.includes(current.salindex);
      });
      return {
        cscs: state.cscs,
        scripts: newHeartbeats,
      };
    }
    case UPDATE_CSC_HEARTBEATS: {
      const currentHeartbeats = state.cscs;
      let found = false;
      const salindex = action.data.salindex;
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
        cscs: newHeartbeats,
        scripts: state.scripts,
      };
    }
    default:
      return state;
  }
}
