import { RECEIVE_WORKSPACES, RECEIVE_WORKSPACE } from './actionTypes';
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
 * Action to receive a particular workspace
 */
export const receiveWorkspace = (workspace) => {
  return {
    type: RECEIVE_WORKSPACE,
    workspace,
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
        dispatch(receiveWorkspace(workspace));
        return Promise.resolve();
      });
    }).catch((e) => console.error(e));
  };
}
