import {
  RECEIVE_WORKSPACES,
  LOADING_VIEWS,
  RECEIVE_VIEWS,
  RECEIVE_CURRENT_WORKSPACE,
  UPDATE_EDITED_VIEW,
  LOAD_EDITED_VIEW,
  CLEAR_EDITED_VIEW,
  SAVING_EDITED_VIEW,
  SAVE_ERROR,
  SAVED_EDITED_VIEW,
  CHANGE_MODE,
} from './actionTypes';
import { getEditedViewCurrent, getEditedViewSaved } from '../selectors/uif';
import ManagerInterface from '../../Utils';

/**
 * Action to receive a list of workspaces
 */
export const changeMode = (mode) => {
  return {
    type: CHANGE_MODE,
    mode,
  };
};

/**
 * Action to receive a list of workspaces
 */
export const receiveWorkspaces = (workspaces) => {
  return {
    type: RECEIVE_WORKSPACES,
    workspaces,
  };
};

/**
 * Action to mark the views as in process of being loaded
 */
export const loadingViews = {
  type: LOADING_VIEWS,
};

/**
 * Action to receive a list of views
 */
export const receiveViews = (views) => {
  return {
    type: RECEIVE_VIEWS,
    views,
  };
};

/**
 * Action to receive a particular (the current) workspace
 */
export const receiveCurrentWorkspace = (workspace) => {
  return {
    type: RECEIVE_CURRENT_WORKSPACE,
    workspace,
  };
};

/**
 * Action to update the view under edition
 */
export const updateEditedView = (view) => {
  return {
    type: UPDATE_EDITED_VIEW,
    view,
  };
};

/**
 * Action to update the view under edition
 */
export const clearViewToEdit = {
  type: CLEAR_EDITED_VIEW,
};

/**
 * Action to update the view under edition
 */
export const loadViewToEdit = (id) => {
  // const view = getViews(id);
  return {
    type: LOAD_EDITED_VIEW,
    id,
  };
};

/**
 * Action to mark the editView as in process of being saved
 */
export const savingEditedView = {
  type: SAVING_EDITED_VIEW,
};

/**
 * Action to mark the editView as failed saving
 */
export const saveErrorEditedView = (response) => {
  return {
    type: SAVE_ERROR,
    response: response,
  };
};

/**
 * Action to mark the editView as saved
 */
export const savedEditedView = (view) => {
  return {
    type: SAVED_EDITED_VIEW,
    view: view,
  };
};

/**
 * requestWorkspaces - Action to request the list of workspaces
 *
 * @return {object}  the dispatched action
 */
export function requestWorkspaces() {
  return async (dispatch, getState) => {
    const url = `${ManagerInterface.getUifBaseUrl()}workspaces/with_view_name`;
    return fetch(url, {
      method: 'GET',
      headers: ManagerInterface.getHeaders(),
    })
      .then((response) => {
        return response.json().then((workspaces) => {
          dispatch(receiveWorkspaces(workspaces));
          return Promise.resolve();
        });
      })
      .catch((e) => console.error(e));
  };
}

/**
 * requestWorkspaces - Action to request the list of views
 *
 * @return {object}  the dispatched action
 */
export function requestViews() {
  return async (dispatch, getState) => {
    dispatch(loadingViews);
    const url = `${ManagerInterface.getUifBaseUrl()}views`;
    return fetch(url, {
      method: 'GET',
      headers: ManagerInterface.getHeaders(),
    })
      .then((response) => {
        return response.json().then((views) => {
          dispatch(receiveViews(views));
          return Promise.resolve();
        });
      })
      .catch((e) => console.error(e));
  };
}

/**
 * requestWorkspace - Action to request a full workspace by its given id
 *
 * @param  {number} id the id of the QWorkspace to retrieve
 * @return {object}    the dispatched action
 */
export function requestWorkspace(id) {
  return async (dispatch, getState) => {
    const url = `${ManagerInterface.getUifBaseUrl()}workspaces/${id}/full`;
    return fetch(url, {
      method: 'GET',
      headers: ManagerInterface.getHeaders(),
    })
      .then((response) => {
        return response.json().then((workspace) => {
          dispatch(receiveCurrentWorkspace(workspace));
          return Promise.resolve();
        });
      })
      .catch((e) => console.error(e));
  };
}

/**
 * saveEditedView - Action to save the view under edition to the server
 *
 * @return {object}    the dispatched action
 */
export function saveEditedView() {
  return async (dispatch, getState) => {
    const current = getEditedViewCurrent(getState());
    dispatch(savingEditedView);
    const saved = getEditedViewSaved(getState());
    let url = `${ManagerInterface.getUifBaseUrl()}views/`;
    let method = 'POST';
    let expectedCode = 201;
    const dataToSend = { ...saved, name: current.name, data: current.data };

    if (saved !== undefined && saved.id !== undefined) {
      url = `${ManagerInterface.getUifBaseUrl()}views/${saved.id}/`;
      method = 'PUT';
      expectedCode = 200;
    }
    return fetch(url, {
      method,
      headers: ManagerInterface.getHeaders(),
      body: JSON.stringify(dataToSend),
    })
      .then((response) => {
        if (response.status === expectedCode) {
          return response.json().then((view) => {
            dispatch(savedEditedView(view));
            return Promise.resolve();
          });
        }
        return response.json().then((json) => {
          dispatch(saveErrorEditedView(json));
          return Promise.resolve();
        });
      })
      .catch((e) => console.error(e));
  };
}

/**
 * deleteView - Action to save the view under edition to the server
 *
 * @param  {number} id the id of the View to delete
 * @return {object}    the dispatched action
 */
export function deleteView(id) {
  return async (dispatch, getState) => {
    const url = `${ManagerInterface.getUifBaseUrl()}views/${id}/`;
    const expectedCode = 204;
    return fetch(url, {
      method: 'DELETE',
      headers: ManagerInterface.getHeaders(),
    })
      .then((response) => {
        if (response.status === expectedCode) {
          dispatch(requestViews());
          return Promise.resolve(true);
        }
        return Promise.resolve(false);
      })
      .catch((e) => console.error(e));
  };
}
