import { createStore, applyMiddleware } from 'redux';
import rootReducer from '../reducers';
import thunkMiddleware from 'redux-thunk';
import logger from 'redux-logger';
import ManagerInterface from '../../Utils';

import { fetchToken, validateToken } from '../actions/auth';
import fetchMock from 'fetch-mock';

import { getToken, getTokenStatus } from '../selectors';

import { tokenStates } from '../reducers/auth';

let store;
beforeEach(() => {
  store = createStore(rootReducer, applyMiddleware(thunkMiddleware));
});

describe('GIVEN the token does not exist in localStorage', () => {
  beforeEach(() => {
    localStorage.removeItem('LOVE-TOKEN');
  });

  it('Should save the token in localstorage and the store, and set status=RECEIVED when fetched OK', async () => {
    const url = `${ManagerInterface.getApiBaseUrl()}get-token/`;
    const newToken = 'new-token';
    fetchMock.mock(url, { token: newToken }, new Headers({
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Token ${newToken}`,
    }));

    await store.dispatch(fetchToken('asdf', 'asdf'));

    const newState = store.getState();
    expect(localStorage.getItem('LOVE-TOKEN')).toEqual(newToken);
    expect(getToken(newState)).toEqual(newToken);
    expect(getTokenStatus(newState)).toEqual(tokenStates.RECEIVED);
  });
});

describe('GIVEN the token exists in localStorage', () => {
  let initialToken, url;

  beforeEach(async () => {
    localStorage.setItem('LOVE-TOKEN', '"love-token"');
    await store.dispatch(fetchToken('asdf', 'asdf'));
    initialToken = getToken(store.getState());
    expect(initialToken).toEqual('"love-token"');
    url = `${ManagerInterface.getApiBaseUrl()}validate-token/`;
  });

  afterEach(() => {
    localStorage.removeItem('LOVE-TOKEN');
    fetchMock.reset();
  });

  it('Should not change the token state when the token is valid', async () => {
    fetchMock.mock(url, { detail: 'Token is valid' }, ManagerInterface.getHeaders());

    await store.dispatch(validateToken());

    const newToken = getToken(store.getState());
    expect(newToken).toEqual(initialToken);
  });

  it('Should remove the token when invalid with response status >= 500', async () => {
    fetchMock.mock(url, { status: 500 }, ManagerInterface.getHeaders());

    await store.dispatch(validateToken());

    const newToken = getToken(store.getState());
    expect(newToken).toBeNull();
  });

  [401, 403].forEach((status) => {
    it(`Should set token status=EXPIRED and delete the token when invalid with response.status ${status}`, async () => {
      fetchMock.mock(url, { status: status }, ManagerInterface.getHeaders());

      await store.dispatch(validateToken());

      const newToken = getToken(store.getState());
      expect(newToken).toBeNull();
      expect(getTokenStatus(store.getState())).toEqual(tokenStates.EXPIRED);
    });
  });
});
