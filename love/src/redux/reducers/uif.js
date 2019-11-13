import { RECEIVE_WORKSPACES } from '../actions/actionTypes';

const initialState = {
  workspaces: [],
};

/**
 * Modifies the state of the UI Framework
 */
export default function(state = initialState, action) {
  switch (action.type) {
    case RECEIVE_WORKSPACES:
      {
        return Object.assign({}, state, {
          workspaces: action.workspaces,
        });
      }
    default:
      return state;
  }
}
