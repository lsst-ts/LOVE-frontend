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

import rfdc from 'rfdc';
import {
  RECEIVE_WORKSPACES,
  RECEIVE_WORKSPACES_ERROR,
  LOADING_VIEWS,
  RECEIVE_VIEWS,
  RECEIVE_VIEW,
  RECEIVE_VIEWS_ERROR,
  RECEIVE_CURRENT_WORKSPACE,
  UPDATE_EDITED_VIEW,
  CLEAR_EDITED_VIEW,
  LOAD_EDITED_VIEW,
  SAVING_EDITED_VIEW,
  SAVE_ERROR,
  SAVED_EDITED_VIEW,
  CHANGE_MODE,
} from '../actions/actionTypes';

export const editViewStates = {
  EMPTY: 'EMPTY',
  UNSAVED: 'UNSAVED',
  SAVING: 'SAVING',
  SAVED: 'SAVED',
  SAVE_ERROR: 'SAVE_ERROR',
};

export const modes = {
  VIEW: 'VIEW',
  EDIT: 'EDIT',
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
        cols: 100,
      },
      content: {},
    },
  },
  editedViewStatus: {
    code: editViewStates.EMPTY,
    details: null,
  },
  editedViewSaved: {},
  mode: modes.VIEW,
  views: [],
  cachedViews: [],
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
export default function (state = initialState, action) {
  switch (action.type) {
    case RECEIVE_WORKSPACES: {
      return { ...state, workspaces: action.workspaces };
    }
    case RECEIVE_WORKSPACES_ERROR: {
      return { ...state, viewsStatus: viewsStates.ERROR };
    }
    case RECEIVE_VIEWS: {
      return { ...state, views: action.views, viewsStatus: viewsStates.LOADED };
    }
    case RECEIVE_VIEW: {
      const cachedViews = state.cachedViews ? [...state.cachedViews] : [];
      const oldViewIndex = cachedViews ? cachedViews.findIndex((view) => view.id === action.view.id) : undefined;
      if (oldViewIndex > -1) cachedViews.splice(oldViewIndex, 1);
      return { ...state, cachedViews: [...cachedViews, action.view] };
    }
    case RECEIVE_VIEWS_ERROR: {
      return { ...state, viewsStatus: viewsStates.ERROR };
    }
    case LOADING_VIEWS: {
      return { ...state, viewsStatus: viewsStates.LOADING };
    }
    case RECEIVE_CURRENT_WORKSPACE: {
      return { ...state, currentWorkspace: action.workspace.id, views: action.workspace.views };
    }
    case UPDATE_EDITED_VIEW: {
      return {
        ...state,
        editedViewCurrent: rfdc()(action.view),
        editedViewStatus: {
          code: editViewStates.UNSAVED,
          details: null,
        },
      };
    }
    case LOAD_EDITED_VIEW: {
      let view = state.cachedViews.find((v) => v.id === action.id);
      if (view === undefined) {
        view = rfdc()(initialState.editedViewCurrent);
      }
      return {
        ...state,
        editedViewCurrent: rfdc()(view),
        editedViewSaved: rfdc()(view),
        editedViewStatus: {
          code: editViewStates.SAVED,
          details: null,
        },
      };
    }
    case CLEAR_EDITED_VIEW: {
      return {
        ...state,
        editedViewCurrent: rfdc()(initialState.editedViewCurrent),
        editedViewSaved: rfdc()(initialState.editedViewSaved),
        editedViewStatus: rfdc()(initialState.editedViewStatus),
      };
    }
    case SAVING_EDITED_VIEW: {
      return {
        ...state,
        editedViewStatus: {
          code: editViewStates.SAVING,
          details: null,
        },
      };
    }
    case SAVE_ERROR: {
      return {
        ...state,
        editedViewStatus: {
          code: editViewStates.SAVE_ERROR,
          details: action.response,
        },
      };
    }
    case SAVED_EDITED_VIEW: {
      const newView = rfdc()(action.view);
      const index = state.views.findIndex((view) => view.id === newView.id);
      const newViews = [...state.views];
      if (index !== -1) {
        newViews[index] = newView;
      } else {
        newViews.push(newView);
      }
      return {
        ...state,
        editedViewStatus: {
          code: editViewStates.SAVED,
          details: null,
        },
        editedViewSaved: newView,
        views: newViews,
      };
    }
    case CHANGE_MODE: {
      return { ...state, mode: action.mode === modes.EDIT ? modes.EDIT : modes.VIEW };
    }
    default:
      return state;
  }
}
