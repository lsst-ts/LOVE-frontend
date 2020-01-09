import {
  REQUEST_TOKEN,
  RECEIVE_TOKEN,
  REJECT_TOKEN,
  EXPIRE_TOKEN,
  EMPTY_TOKEN,
  MARK_ERROR_TOKEN,
  REQUEST_REMOVE_TOKEN,
  REMOVE_REMOTE_TOKEN,
  MARK_ERROR_REMOVE_TOKEN,
  GET_TOKEN_FROM_LOCALSTORAGE,
} from './actionTypes';
import ManagerInterface from '../../Utils';
import { getToken } from '../selectors';

export const requestToken = (username, password) => ({ type: REQUEST_TOKEN, username, password });

export const receiveToken = (username, token, permissions, tai_to_utc) => ({
  type: RECEIVE_TOKEN,
  username,
  token,
  permissions,
  tai_to_utc,
});

export const getTokenFromStorage = (token) => ({ type: GET_TOKEN_FROM_LOCALSTORAGE, token });

export const emptyToken = {
  type: EMPTY_TOKEN,
};

export const expireToken = {
  type: EXPIRE_TOKEN,
};

export const markErrorToken = {
  type: MARK_ERROR_TOKEN,
};

export const rejectToken = {
  type: REJECT_TOKEN,
};

export const requestRemoveToken = {
  type: REQUEST_REMOVE_TOKEN,
};

export const removeRemoteToken = {
  type: REMOVE_REMOTE_TOKEN,
};

export const markErrorRemoveToken = {
  type: MARK_ERROR_REMOVE_TOKEN,
};

export function doGetTokenFromStorage() {
  return (dispatch) => {
    const token = localStorage.getItem('LOVE-TOKEN');
    dispatch(getTokenFromStorage(token));
  };
}

function doExpireToken() {
  return (dispatch) => {
    dispatch(expireToken);
    localStorage.removeItem('LOVE-TOKEN');
  };
}

function doMarkErrorToken() {
  return (dispatch) => {
    dispatch(markErrorToken);
    localStorage.removeItem('LOVE-TOKEN');
  };
}

function doReceiveToken(username, token, permissions, tai_to_utc) {
  return (dispatch) => {
    dispatch(receiveToken(username, token, permissions, tai_to_utc));
    localStorage.setItem('LOVE-TOKEN', token);
  };
}

function doRejectToken() {
  return (dispatch) => {
    dispatch(rejectToken);
    localStorage.removeItem('LOVE-TOKEN');
  };
}

function doRequestRemoveToken() {
  return (dispatch) => {
    dispatch(requestRemoveToken);
    localStorage.removeItem('LOVE-TOKEN');
  };
}

function doRemoveRemoteToken() {
  return (dispatch) => {
    dispatch(removeRemoteToken);
    localStorage.removeItem('LOVE-TOKEN');
  };
}

/**
 * redux-thunk action generator that requests a token from the LOVE-manager in case it does not exist in the localstorage and handles its response.
 *
 * @param {string} username
 * @param {string} password
 */
export function fetchToken(username, password) {
  const url = `${ManagerInterface.getApiBaseUrl()}get-token/`;
  return (dispatch, getState) => {
    dispatch(requestToken(username, password));
    return fetch(url, {
      method: 'POST',
      headers: ManagerInterface.getHeaders(),
      body: JSON.stringify({ username, password }),
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else if (response.status === 400) {
          dispatch(doRejectToken());
          return false;
        } else {
          dispatch(doMarkErrorToken());
          return false;
        }
      })
      .then((response) => {
        if (response) {
          const token = response.token;
          let username = '';
          if (response.user) {
            username = response.user.username;
          }
          const tai_to_utc = response.tai_to_utc;
          const permissions = response.permissions;
          if (token !== undefined && token !== null) {
            dispatch(doReceiveToken(username, token, permissions, tai_to_utc));
            return;
          }
        }
      })
      .catch((e) => console.log(e));
  };
}

/**
 * redux-thunk action generator that requests the deletion of a token from the LOVE-manager
 */
export function logout() {
  const url = `${ManagerInterface.getApiBaseUrl()}logout/`;

  return (dispatch, getState) => {
    const token = localStorage.getItem('LOVE-TOKEN');
    if (!token) {
      dispatch(doRemoveRemoteToken());
      return;
    }

    dispatch(doRequestRemoveToken());
    return fetch(url, {
      method: 'DELETE',
      headers: new Headers({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      }),
    })
      .then((response) => {
        if (response.status === 204) {
          dispatch(doRemoveRemoteToken());
          return;
        } else {
          dispatch(markErrorRemoveToken);
        }
      })
      .catch((e) => console.log(e));
  };
}

/**
 * Validates the token with the server.
 * Nothing changes if everything is ok. Other cases are handled individually.
 */
export function validateToken() {
  return async (dispatch, getState) => {
    const token = getToken(getState());
    if (token === null || token === undefined) {
      return Promise.resolve();
    }

    const url = `${ManagerInterface.getApiBaseUrl()}validate-token/`;
    return fetch(url, {
      method: 'GET',
      headers: new Headers({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      }),
    }).then((response) => {
      if (response.status >= 500) {
        dispatch(doMarkErrorToken());
        return Promise.resolve();
      }

      if (response.status === 401 || response.status === 403) {
        console.log('Session expired. Logging out');
        dispatch(doExpireToken());
        return Promise.resolve();
      }

      return response.json().then((resp) => {
        const detail = resp.detail;
        let username = '';
        if (resp.user) {
          username = resp.user.username;
        }
        const permissions = resp.permissions;
        const tai_to_utc = resp.tai_to_utc;
        dispatch(doReceiveToken(username, token, permissions, tai_to_utc));
        return Promise.resolve();
      });
    });
  };
}
