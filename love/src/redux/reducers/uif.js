import { RECEIVE_WORKSPACES, RECEIVE_WORKSPACE } from '../actions/actionTypes';

const initialState = {
  workspaces: [],
};


/**
 * export default - Modifies the state of the UI Framework
 *
 * @param  {object} state = initialState the current UI Frmaework state
 * @param  {object} action               the action that is being applied to the state
 * @return {object}                      the modified state
 */
export default function(state = initialState, action) {
  switch (action.type) {
    case RECEIVE_WORKSPACES:
      {
        return Object.assign({}, state, {
          workspaces: action.workspaces,
        });
      }
    case RECEIVE_WORKSPACE:
      {
        return Object.assign({}, state, {
          current_workspace: action.workspace,
        });
      }
    default:
      return state;
  }
}
