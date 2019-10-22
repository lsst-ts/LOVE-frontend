import { createStore, applyMiddleware } from 'redux';
import fetchMock from 'fetch-mock';
import logger from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import rootReducer from '../reducers';
import ManagerInterface from '../../Utils';

import { fetchToken, validateToken, logout, getTokenFromStorage } from '../actions/auth';
import { tokenStates } from '../reducers/auth';
import { getToken, getUsername, getTokenStatus, getPermCmdExec } from '../selectors';

let store;
beforeEach(() => {
  store = createStore(rootReducer, applyMiddleware(thunkMiddleware));
});

describe('GIVEN there are no worspaces in the store', () => {

  afterEach(() => {
    fetchMock.reset();
  });

  it('WHEN the workspaces are requested, THEN the state should contain the workspaces', async () => {
    // Arrange:
    const url = `${ManagerInterface.getUifBaseUrl()}workspaces/`;
    fetchMock.mock(
      url
      new Headers({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Token ${newToken}`,
      }),
    );
    // Act:
    await store.dispatch(fetchToken('asdds', 'asdf'));
    // Assert:
    const newState = store.getState();
    const storedToken = localStorage.getItem('LOVE-TOKEN');
    expect(getToken(newState)).toEqual(newToken);
    expect(getUsername(newState)).toEqual('my-user');
    expect(getTokenStatus(newState)).toEqual(tokenStates.RECEIVED);
    expect(getPermCmdExec(newState)).toEqual(true);
    expect(storedToken).toEqual(newToken);
  });
});
