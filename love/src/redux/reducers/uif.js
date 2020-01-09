import {
  RECEIVE_WORKSPACES,
  RECEIVE_VIEWS,
  RECEIVE_CURRENT_WORKSPACE,
  RECEIVE_VIEW,
  UPDATE_EDITED_VIEW,
} from '../actions/actionTypes';

const initialState = {
  current_view: null,
  current_workspace: null,
  edited_view: {
    properties: {
      type: 'container',
      x: 0,
      y: 0,
      w: 100,
      h: 2,
      i: 0,
      allowOverflow: true,
      cols: 100
    },
    content: {},
  },
  views: [],
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
    case RECEIVE_VIEWS:
      {
        return Object.assign({}, state, {
          views: action.views,
        });
      }
    case RECEIVE_CURRENT_WORKSPACE:
      {
        return Object.assign({}, state, {
          current_workspace: action.workspace.id,
          views: action.workspace.views,
        });
      }
    case UPDATE_EDITED_VIEW:
      {
        return Object.assign({}, state, {
          edited_view: action.view,
        });
      }
    default:
      return state;
  }
}
