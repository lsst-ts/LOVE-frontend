import {
  RECEIVE_WORKSPACES,
  RECEIVE_VIEWS,
  RECEIVE_CURRENT_WORKSPACE,
  RECEIVE_VIEW,
  UPDATE_EDITED_VIEW,
  SAVING_EDITED_VIEW,
  SAVE_ERROR,
  SAVED_EDITED_VIEW,
} from '../actions/actionTypes';

export const editViewStates = {
  EMPTY: 'EMPTY',
  UNSAVED: 'UNSAVED',
  SAVING: 'SAVING',
  SAVED: 'SAVED',
  SAVE_ERROR: 'SAVE_ERROR',
};

const initialState = {
  currentView: null,
  currentWorkspace: null,
  editedView: {
    name: 'my-view',
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
  editedViewStatus: editViewStates.EMPTY,
  editedViewData: {},
  views: [],
  workspaces: [],
};


/**
 * export default - Modifies the state of the UI Framework
 *
 * @param  {object} state = initialState the current UI Framework state
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
          currentWorkspace: action.workspace.id,
          views: action.workspace.views,
        });
      }
    case UPDATE_EDITED_VIEW:
      {
        return Object.assign({}, state, {
          editedView: action.view,
          editedViewStatus: editViewStates.UNSAVED,
        });
      }
    case SAVING_EDITED_VIEW:
      {
        return Object.assign({}, state, {
          editedViewStatus: editViewStates.SAVING,
        });
      }
    case SAVE_ERROR:
      {
        return Object.assign({}, state, {
          editedViewStatus: editViewStates.SAVE_ERROR,
          editedViewData: {...state.editedViewData, error: action.response},
        });
      }
    case SAVED_EDITED_VIEW:
      {
        return Object.assign({}, state, {
          editedViewStatus: editViewStates.SAVED,
          editedViewData: action.view,
        });
      }
    default:
      return state;
  }
}
