import { REQUEST_TOKEN, RECEIVE_TOKEN } from './actionTypes';
import ManagerInterface from '../../Utils';

export const requestToken = (username, password) => ({
  type: REQUEST_TOKEN,
  username,
  password,
});

export const receiveToken = (token) => ({
  type: RECEIVE_TOKEN,
  token,
});

export function fetchToken(username, password) {
  const url = `${ManagerInterface.getApiBaseUrl()}get-token/`;

  return (dispatch, getState) => {
    dispatch(requestToken(username, password));

    const storageToken = localStorage.getItem('LOVE-TOKEN');
    if(storageToken && storageToken.length>0){
      dispatch(receiveToken(storageToken));
      return new Promise((resolve)=>resolve())
    }

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
        const { token } = response;
        if (token !== undefined && token !== null) {
          dispatch(receiveToken(token));
        }
      });
  };
}
