import rfdc from 'rfdc';
import {
  RECEIVE_WORKSPACES,
  LOADING_VIEWS,
  RECEIVE_VIEWS,
  RECEIVE_CURRENT_WORKSPACE,
  RECEIVE_VIEW,
  UPDATE_EDITED_VIEW,
  CLEAR_EDITED_VIEW,
  LOAD_EDITED_VIEW,
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

export const viewsStates = {
  EMPTY: 'EMPTY',
  LOADING: 'LOADING',
  LOADED: 'LOADED',
  ERROR: 'ERROR',
};

export const initialState = {
  currentView: null,
  currentWorkspace: null,
  editedViewCurrent: {
    name: 'Untitled view',
    data: {
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
  },
  editedViewStatus: {
    code: editViewStates.EMPTY,
    details: null,
  },
  editedViewSaved: {},
  views: [],
  viewsStatus: viewsStates.EMPTY,
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
          viewsStatus: viewsStates.LOADED,
        });
      }
    case LOADING_VIEWS:
      {
        return Object.assign({}, state, {
          viewsStatus: viewsStates.LOADING,
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
          editedViewCurrent: rfdc()(action.view),
          editedViewStatus: {
            code: editViewStates.UNSAVED,
            details: null,
          },
        });
      }
    case LOAD_EDITED_VIEW:
      {
        const view = state.views.find(view => view.id === action.id);
        return Object.assign({}, state, {
          editedViewCurrent: rfdc()(view),
          editedViewSaved: rfdc()(view),
          editedViewStatus: {
            code: editViewStates.SAVED,
            details: null,
          },
        });
      }
    case CLEAR_EDITED_VIEW:
      {
        return Object.assign({}, state, {
          editedViewCurrent: rfdc()(initialState.editedViewCurrent),
          editedViewSaved: rfdc()(initialState.editedViewSaved),
          editedViewStatus: rfdc()(initialState.editedViewStatus),
        });
      }
    case SAVING_EDITED_VIEW:
      {
        return Object.assign({}, state, {
          editedViewStatus: {
            code: editViewStates.SAVING,
            details: null,
          },
        });
      }
    case SAVE_ERROR:
      {
        return Object.assign({}, state, {
          editedViewStatus: {
            code: editViewStates.SAVE_ERROR,
            details: action.response,
          },
        });
      }
    case SAVED_EDITED_VIEW:
      {
        const newView = rfdc()(action.view);
        const index = state.views.findIndex(view => view.id === newView.id);
        if (index !== -1) {
          state.views[index] = newView;
        }
        return Object.assign({}, state, {
          editedViewStatus: {
            code: editViewStates.SAVED,
            details: null,
          },
          editedViewSaved: newView,
          views: [...state.views],
        });
      }
    default:
      return state;
  }
}
