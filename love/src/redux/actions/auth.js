import { REMOVE_TOKEN, REQUEST_TOKEN, RECEIVE_TOKEN, REJECT_TOKEN, EXPIRE_TOKEN } from './actionTypes';
import ManagerInterface from '../../Utils';
import { tokenStates } from '../reducers/auth';
import {getToken} from '../selectors';

export const requestToken = (username, password) => ({
  type: REQUEST_TOKEN,
  username,
  password,
});

export const receiveToken = (token) => ({
  type: RECEIVE_TOKEN,
  token,
});

export const rejectToken = {
  type: REJECT_TOKEN,
};

export function fetchToken(username, password) {
  const url = `${ManagerInterface.getApiBaseUrl()}get-token/`;

  return (dispatch, getState) => {
    const storageToken = localStorage.getItem('LOVE-TOKEN');
    if (storageToken && storageToken.length > 0) {
      dispatch(receiveToken(storageToken));
      return;
    }

    dispatch(requestToken(username, password));
    return fetch(url, {
      method: 'POST',
      headers: ManagerInterface.getHeaders(),
      body: JSON.stringify({
        username,
        password,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        const { token, status } = response;
        if (token !== undefined && token !== null) {
          dispatch(receiveToken(token));
          ManagerInterface.saveToken(token);
          return;
        }

        dispatch(rejectToken);
      })
      .catch((e) => console.log(e));
  };
}

export const removeToken = {
  type: REMOVE_TOKEN,
};

export const expireToken = {
  type: EXPIRE_TOKEN,
};

/**
 * Validates the token with the server.
 * Nothing changes if everything is ok. Other cases are handled individually.
 */
export function validateToken() {
  return async (dispatch, getState) => {
    const token = getToken(getState());
    if(token === null || token === undefined){
      return;
    }
    
    const url = `${ManagerInterface.getApiBaseUrl()}validate-token/`;
    return fetch(url, {
      method: 'GET',
      headers: ManagerInterface.getHeaders(),
    }).then((response) => {
      if (response.status >= 500) {
        // console.error('Error communicating with the server. Logging out\n', response);
        dispatch(removeToken);
      }

      if (response.status === 401 || response.status === 403) {
        // console.log('Session expired. Logging out');
        dispatch(expireToken);

      }

      return response.json().then((resp) => {
        const { detail } = resp;
        if (detail !== 'Token is valid') {
          dispatch(removeToken);
        }
      });
    });
  };
}
