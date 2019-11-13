import { RECEIVE_WORKSPACES } from './actionTypes';
import ManagerInterface from '../../Utils';

export const receiveWorkspaces = (workspaces) => {
  return {
    type: RECEIVE_WORKSPACES,
    workspaces,
  };
};


/**
 * Validates the token with the server.
 * Nothing changes if everything is ok. Other cases are handled individually.
 */
export function requestWorkspaces() {
  return async (dispatch, getState) => {

    const url = `${ManagerInterface.getUifBaseUrl()}workspaces/`;
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
