import { createStore, applyMiddleware } from 'redux';
import fetchMock from 'fetch-mock';
import logger from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import rootReducer from '../reducers';
import ManagerInterface from '../../Utils';

import { fetchToken, doReceiveToken, validateToken, logout, getTokenFromStorage } from '../actions/auth';
import { tokenStates } from '../reducers/auth';
import { getToken, getUsername, getTokenStatus, getPermCmdExec } from '../selectors';

let store;
beforeEach(() => {
  store = createStore(rootReducer, applyMiddleware(thunkMiddleware));
});

describe('GIVEN there are no worspaces in the store', () => {
  let initialToken, url;

  beforeEach(async () => {
    const token = '"love-token"';
    localStorage.setItem('LOVE-TOKEN', token);
    await store.dispatch(getTokenFromStorage(token));
    initialToken = getToken(store.getState());
    expect(initialToken).toEqual(token);
    url = `${ManagerInterface.getApiBaseUrl()}validate-token/`;
  });

  afterEach(() => {
    localStorage.removeItem('LOVE-TOKEN');
    fetchMock.reset();
  });

  it('WHEN the workspaces are requested, THEN the state should contain the workspaces', async () => {
    // Arrange:
    // const url = `${ManagerInterface.getUifBaseUrl()}workspaces/`;
    url = `${ManagerInterface.getApiBaseUrl()}validate-token/`;
    fetchMock.mock(
      url,
      {
        detail: 'Token is valid',
        user: {
          username: 'my-user',
        },
        permissions: {
          execute_commands: true
        }
      },
      ManagerInterface.getHeaders(),
    );
    // Act:
    await store.dispatch(validateToken());
    // Assert:
    const newToken = getToken(store.getState());
    const storedToken = localStorage.getItem('LOVE-TOKEN');
    expect(newToken).toEqual(initialToken);
    expect(storedToken).toEqual(initialToken);
    expect(getUsername(store.getState())).toEqual('my-user');
    expect(getPermCmdExec(store.getState())).toEqual(true);
    expect(getTokenStatus(store.getState())).toEqual(tokenStates.RECEIVED);
  });
});
