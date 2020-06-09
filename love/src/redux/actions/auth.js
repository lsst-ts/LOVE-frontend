import { DateTime } from 'luxon';
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
  REQUEST_SWAP_TOKEN,
  RECEIVE_SWAP_TOKEN,
  REJECT_SWAP_TOKEN,
  MARK_ERROR_SWAP_TOKEN,
  REQUIRE_SWAP_TOKEN,
  CANCEL_SWAP_TOKEN,
  RECEIVE_CONFIG,
} from './actionTypes';
import { requestViews } from './uif';
import ManagerInterface from '../../Utils';
import { getToken, getConfig } from '../selectors';
import { openWebsocketConnection, closeWebsocketConnection } from './ws';
import { receiveServerTime, clockStart, clockStop } from './time';

export const requestToken = (username, password) => ({ type: REQUEST_TOKEN, username, password });

export const receiveToken = (username, token, permissions) => ({
  type: RECEIVE_TOKEN,
  username,
  token,
  permissions,
});

export const receiveConfig = (config) => ({
  type: RECEIVE_CONFIG,
  config,
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

export const requestSwapToken = {
  type: REQUEST_SWAP_TOKEN,
};

export const receiveSwapToken = {
  type: RECEIVE_SWAP_TOKEN,
};

export const rejectSwapToken = {
  type: REJECT_SWAP_TOKEN,
};

export const markErrorSwapToken = {
  type: MARK_ERROR_SWAP_TOKEN,
};

export const requireSwapToken = {
  type: REQUIRE_SWAP_TOKEN,
};

export const cancelSwapToken = {
  type: CANCEL_SWAP_TOKEN,
};

export function doGetTokenFromStorage() {
  return (dispatch) => {
    const token = localStorage.getItem('LOVE-TOKEN');
    dispatch(getTokenFromStorage(token));
  };
}

export function doExpireToken() {
  return (dispatch) => {
    dispatch(expireToken);
    dispatch(closeWebsocketConnection());
    localStorage.removeItem('LOVE-TOKEN');
  };
}

function doMarkErrorToken() {
  return (dispatch) => {
    dispatch(markErrorToken);
    localStorage.removeItem('LOVE-TOKEN');
  };
}

export function doReceiveToken(username, token, permissions, time_data, request_time, config) {
  return (dispatch) => {
    dispatch(receiveToken(username, token, permissions));
    dispatch(receiveServerTime(time_data, request_time));
    if (config) {
      dispatch(receiveConfig(config));
    }
    dispatch(openWebsocketConnection());
    dispatch(clockStart());
    localStorage.setItem('LOVE-TOKEN', token);
  };
}

export function doRejectToken() {
  return (dispatch) => {
    dispatch(rejectToken);
    dispatch(closeWebsocketConnection());
    localStorage.removeItem('LOVE-TOKEN');
  };
}

export function doRequestRemoveToken() {
  return (dispatch) => {
    dispatch(requestRemoveToken);
    dispatch(closeWebsocketConnection());
    dispatch(clockStop());
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
    const request_time = DateTime.utc().toMillis() / 1000;
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
          const time_data = response.time_data;
          const permissions = response.permissions;
          const config = response.config;
          if (token !== undefined && token !== null) {
            dispatch(doReceiveToken(username, token, permissions, time_data, request_time, config));
            dispatch(requestViews());
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
    const state = getState();
    const token = getToken(state);
    if (token === null || token === undefined) {
      return Promise.resolve();
    }
    const current_config = getConfig(state);
    let url = `${ManagerInterface.getApiBaseUrl()}validate-token/`;
    if (current_config) {
      url = url + 'no_config/';
    }
    const request_time = DateTime.utc().toMillis() / 1000;
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
        let username = '';
        const { user } = resp;
        if (user) {
          ({ username } = user);
        }
        const { permissions, time_data, config } = resp;
        console.log('config: ', config);
        dispatch(doReceiveToken(username, token, permissions, time_data, request_time, config));
        return Promise.resolve();
      });
    });
  };
}

/**
 * Swaps current user for a new one.
 * Nothing changes if credentials are wrong.
 */
export function swapUser(username, password) {
  const url = `${ManagerInterface.getApiBaseUrl()}swap-user/`;
  return (dispatch, getState) => {
    dispatch(requestSwapToken);
    const request_time = DateTime.utc().toMillis() / 1000;
    return fetch(url, {
      method: 'POST',
      headers: ManagerInterface.getHeaders(),
      body: JSON.stringify({ username, password }),
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else if (response.status === 400) {
          dispatch(rejectSwapToken);
          return false;
        } else {
          dispatch(markErrorSwapToken);
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
          const time_data = response.time_data;
          const permissions = response.permissions;
          const config = response.config;
          if (token !== undefined && token !== null) {
            dispatch(receiveSwapToken);
            dispatch(doReceiveToken(username, token, permissions, time_data, request_time, config));
            return;
          }
        }
      })
      .catch((e) => console.log(e));
  };
}
