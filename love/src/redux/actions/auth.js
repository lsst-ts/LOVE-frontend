import {
  REMOVE_TOKEN,
  REMOVE_REMOTE_TOKEN,
  REQUEST_TOKEN,
  RECEIVE_TOKEN,
  REJECT_TOKEN,
  EMPTY_TOKEN,
  EXPIRE_TOKEN,
  MARK_ERROR_TOKEN
} from './actionTypes';
import ManagerInterface from '../../Utils';
import {getToken} from '../selectors';

export const requestToken = (username, password) => ({type: REQUEST_TOKEN, username, password});

export const receiveToken = (token) => ({type: RECEIVE_TOKEN, token});

export const emptyToken = {
  type: EMPTY_TOKEN
};

export const expireToken = {
  type: EXPIRE_TOKEN
};

export const markErrorToken = {
  type: MARK_ERROR_TOKEN
};

export const rejectToken = {
  type: REJECT_TOKEN
};

export const removeLocalToken = {
  type: REMOVE_TOKEN
};

export const removeRemoteToken = {
  type: REMOVE_REMOTE_TOKEN
};

function doExpireToken() {
  return(dispatch) => {
    dispatch(expireToken);
    localStorage.removeItem('LOVE-USERNAME');
    localStorage.removeItem('LOVE-TOKEN');
  };
}

function doReceiveToken(username, token) {
  return(dispatch) => {
    dispatch(receiveToken(token));
    localStorage.setItem('LOVE-USERNAME', username);
    localStorage.setItem('LOVE-TOKEN', token);
  };
}

function doRejectToken() {
  return(dispatch) => {
    dispatch(rejectToken);
    localStorage.removeItem('LOVE-USERNAME');
    localStorage.removeItem('LOVE-TOKEN');
  };
}

function doRemoveLocalToken() {
  return(dispatch) => {
    dispatch(removeLocalToken);
    localStorage.removeItem('LOVE-USERNAME');
    localStorage.removeItem('LOVE-TOKEN');
  };
}

function doRemoveRemoteToken() {
  return(dispatch) => {
    dispatch(removeRemoteToken);
  };
}

function doMarkErrorToken() {
  return(dispatch) => {
    dispatch(markErrorToken);
    localStorage.removeItem('LOVE-USERNAME');
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
  return(dispatch, getState) => {
    const storageToken = localStorage.getItem('LOVE-TOKEN');
    if (storageToken && storageToken.length > 0) {
      dispatch(receiveToken(storageToken));
      return;
    }

    dispatch(requestToken(username, password));
    return fetch(url, {
      method: 'POST',
      headers: ManagerInterface.getHeaders(),
      body: JSON.stringify({username, password})
    }).then((response) => {
      console.log('response: ', response);
      console.log('response.status: ', response.status);
      if (response.status === 200) {
        return response.json();
      } else if (response.status === 400) {
        dispatch(doRejectToken());
        return false;
      } else {
        dispatch(doMarkErrorToken());
        return false;
      }
    }).then((response) => {
      console.log('response.json(): ', response);
      if (response) {
        const {token} = response;
        if (token !== undefined && token !== null) {
          dispatch(doReceiveToken(username, token));
          return;
        }
      }
    }).catch((e) => console.log(e));
  };
}

/**
 * redux-thunk action generator that requests the deletion of a token from the LOVE-manager
 */
export function logout() {
  const url = `${ManagerInterface.getApiBaseUrl()}logout/`;

  return(dispatch, getState) => {
    const token = localStorage.getItem('LOVE-TOKEN');
    if (!token) {
      dispatch(doRemoveLocalToken());
      dispatch(doRemoveRemoteToken());
      return;
    }

    dispatch(doRemoveLocalToken());
    return fetch(url, {
      method: 'DELETE',
      headers: new Headers({Accept: 'application/json', 'Content-Type': 'application/json', Authorization: `Token ${token}`})
    }).then((response) => {
      const status = response.status;
      if (status === 204) {
        dispatch(doRemoveRemoteToken());
        return;
      }
    }).catch((e) => console.log(e));
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
      headers: new Headers({Accept: 'application/json', 'Content-Type': 'application/json', Authorization: `Token ${token}`})
    }).then((response) => {
      if (response.status >= 500) {
        // console.error('Error communicating with the server. Logging out\n', response);
        dispatch(doRemoveLocalToken());
        return Promise.resolve();
      }

      if (response.status === 401 || response.status === 403) {
        console.log('Session expired. Logging out');
        dispatch(doExpireToken());
        return Promise.resolve();
      }

      return response.json().then((resp) => {
        const {detail} = resp;
        if (detail !== 'Token is valid') {
          dispatch(doRemoveLocalToken());
        }
      });
    });
  };
}
