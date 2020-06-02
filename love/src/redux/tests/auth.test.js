import { createStore, applyMiddleware } from 'redux';
import fetchMock from 'fetch-mock';
import logger from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import rootReducer from '../reducers';
import ManagerInterface from '../../Utils';

import { fetchToken, validateToken, logout, swapUser, getTokenFromStorage } from '../actions/auth';
import { tokenStates } from '../reducers/auth';
import {
  getToken,
  getUsername,
  getTokenStatus,
  getPermCmdExec,
  getTaiToUtc,
  getServerTime,
  getServerTimeRequest,
  getServerTimeReceive,
} from '../selectors';

let store;
beforeEach(() => {
  store = createStore(rootReducer, applyMiddleware(thunkMiddleware));
});

const mockServerTime = {
  utc: 1587156181.842506,
  tai: 1587156218.842506,
  mjd: 58956.86321576974,
  sidereal_summit: 5.762640319739233,
  sidereal_greenwich: 10.479268119739233,
  tai_to_utc: -37,
};

describe('GIVEN the token does not exist in localStorage', () => {
  beforeEach(() => {
    localStorage.removeItem('LOVE-TOKEN');
  });

  afterEach(() => {
    localStorage.removeItem('LOVE-TOKEN');
    fetchMock.reset();
  });

  it('Should save the token in localstorage and the store, and set status=RECEIVED when fetched OK', async () => {
    // Arrange:
    const url = `${ManagerInterface.getApiBaseUrl()}get-token/`;
    const newToken = 'new-token';
    fetchMock.mock(
      url,
      {
        token: newToken,
        user: {
          username: 'my-user',
        },
        permissions: {
          execute_commands: true,
        },
        time_data: mockServerTime,
      },
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
    expect(getTaiToUtc(newState)).toEqual(mockServerTime.tai_to_utc);
    expect(getServerTime(newState)).toEqual(mockServerTime);
    expect(getServerTimeRequest(newState)).toBeGreaterThan(0);
    expect(getServerTimeReceive(newState)).toBeGreaterThan(0);
    expect(getTokenStatus(newState)).toEqual(tokenStates.RECEIVED);
    expect(getPermCmdExec(newState)).toEqual(true);
    expect(storedToken).toEqual(newToken);
  });

  it('Should not save the token and set status=REJECTED when fetched Fail', async () => {
    // Arrange:
    const url = `${ManagerInterface.getApiBaseUrl()}get-token/`;
    const newToken = 'new-token';
    fetchMock.mock(url, {
      status: 400,
    });
    // Act:
    await store.dispatch(fetchToken('asdf', 'asdf'));
    // Assert:
    const newState = store.getState();
    const storedToken = localStorage.getItem('LOVE-TOKEN');
    expect(getToken(newState)).toBeNull();
    expect(getTokenStatus(newState)).toEqual(tokenStates.REJECTED);
    expect(storedToken).toBeNull();
  });
});

describe('GIVEN the token exists in localStorage', () => {
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

  it('Should not change the token state when the token is valid', async () => {
    // Arrange:
    fetchMock.mock(
      url,
      {
        detail: 'Token is valid',
        user: {
          username: 'my-user',
        },
        permissions: {
          execute_commands: true,
        },
        time_data: mockServerTime,
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
    expect(getTaiToUtc(store.getState())).toEqual(mockServerTime.tai_to_utc);
    expect(getServerTime(store.getState())).toEqual(mockServerTime);
    expect(getServerTimeRequest(store.getState())).toBeGreaterThan(0);
    expect(getServerTimeReceive(store.getState())).toBeGreaterThan(0);
    expect(getUsername(store.getState())).toEqual('my-user');
    expect(getPermCmdExec(store.getState())).toEqual(true);
    expect(getTokenStatus(store.getState())).toEqual(tokenStates.RECEIVED);
  });

  it('Should remove the token when invalid with response status >= 500', async () => {
    // Arrange:
    fetchMock.mock(
      url,
      {
        status: 500,
      },
      ManagerInterface.getHeaders(),
    );
    // Act:
    await store.dispatch(validateToken());
    // Assert:
    const newToken = getToken(store.getState());
    const storedToken = localStorage.getItem('LOVE-TOKEN');
    expect(newToken).toBeNull();
    expect(storedToken).toBeNull();
    expect(getTokenStatus(store.getState())).toEqual(tokenStates.ERROR);
  });

  [401, 403].forEach((status) => {
    it(`Should set token status=EXPIRED and delete the token when invalid with response.status ${status}`, async () => {
      // Arrange:
      fetchMock.mock(
        url,
        {
          status: status,
        },
        ManagerInterface.getHeaders(),
      );
      // Act:
      await store.dispatch(validateToken());
      // Assert:
      const newToken = getToken(store.getState());
      const storedToken = localStorage.getItem('LOVE-TOKEN');
      expect(newToken).toBeNull();
      expect(storedToken).toBeNull();
      expect(getTokenStatus(store.getState())).toEqual(tokenStates.EXPIRED);
    });
  });

  it('Should remove the token when logging out', async () => {
    // Arrange:
    url = `${ManagerInterface.getApiBaseUrl()}logout/`;
    fetchMock.mock(
      url,
      {
        status: 204,
      },
      ManagerInterface.getHeaders(),
    );
    // Act:
    await store.dispatch(logout());
    // Assert:
    const token = getToken(store.getState());
    const storedToken = localStorage.getItem('LOVE-TOKEN');
    expect(token).toBeNull();
    expect(storedToken).toBeNull();
    expect(getTokenStatus(store.getState())).toEqual(tokenStates.REMOVED_REMOTELY);
  });

  it('Should remove the token when logging out, but state when it faile din the server', async () => {
    // Arrange:
    url = `${ManagerInterface.getApiBaseUrl()}logout/`;
    fetchMock.mock(
      url,
      {
        status: 400,
      },
      ManagerInterface.getHeaders(),
    );
    // Act:
    await store.dispatch(logout());
    // ASsert:
    const token = getToken(store.getState());
    const storedToken = localStorage.getItem('LOVE-TOKEN');
    expect(token).toBeNull();
    expect(storedToken).toBeNull();
    expect(getTokenStatus(store.getState())).toEqual(tokenStates.REMOVE_ERROR);
  });

  it('Should be able to swap user account', async () => {
    // Arrange:
    url = `${ManagerInterface.getApiBaseUrl()}swap-user/`;
    fetchMock.mock(
      url,
      {
        status: 200,
        token: 'new-token',
        user: {
          username: 'my-user',
        },
        permissions: {
          execute_commands: true,
        },
        time_data: mockServerTime,
      },
      ManagerInterface.getHeaders(),
    );
    // Act:
    await store.dispatch(swapUser('username', 'password'));
    // Assert:
    const token = getToken(store.getState());
    const storedToken = localStorage.getItem('LOVE-TOKEN');
    expect(token).toEqual('new-token');
    expect(storedToken).toEqual('new-token');
    expect(getTokenStatus(store.getState())).toEqual(tokenStates.RECEIVED);
  });

  it('Should keep token if swap credentials are incorrect', async () => {
    // Arrange:
    url = `${ManagerInterface.getApiBaseUrl()}swap-user/`;
    fetchMock.mock(
      url,
      {
        status: 400,
      },
      ManagerInterface.getHeaders(),
    );
    const initialToken = getToken(store.getState());
    // Act:
    await store.dispatch(swapUser('username', 'incorrect'));
    // Assert:
    const token = getToken(store.getState());
    const storedToken = localStorage.getItem('LOVE-TOKEN');
    expect(token).toEqual(initialToken);
    expect(storedToken).toEqual(initialToken);
    expect(getTokenStatus(store.getState())).toEqual(tokenStates.READ_FROM_STORAGE);
  });
});
