import {
  RECEIVE_WORKSPACES,
  RECEIVE_VIEWS,
  RECEIVE_CURRENT_WORKSPACE,
  RECEIVE_VIEW,
  UPDATE_EDITED_VIEW,
} from './actionTypes';
import ManagerInterface from '../../Utils';


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
    }).then((response) => {
      return response.json().then((workspaces) => {
        dispatch(receiveWorkspaces(workspaces));
        return Promise.resolve();
      });
    }).catch((e) => console.error(e));
  };
}


/**
 * requestWorkspaces - Action to request the list of views
 *
 * @return {object}  the dispatched action
 */
export function requestViews() {
  return async (dispatch, getState) => {
    const url = `${ManagerInterface.getUifBaseUrl()}views`;
    return fetch(url, {
      method: 'GET',
      headers: ManagerInterface.getHeaders(),
    }).then((response) => {
      return response.json().then((views) => {
        dispatch(receiveViews(views));
        return Promise.resolve();
      });
    }).catch((e) => console.error(e));
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
    }).then((response) => {
      return response.json().then((workspace) => {
        dispatch(receiveCurrentWorkspace(workspace));
        return Promise.resolve();
      });
    }).catch((e) => console.error(e));
  };
}
