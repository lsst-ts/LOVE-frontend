/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed by Inria Chile.

This program is free software: you can redistribute it and/or modify it under 
the terms of the GNU General Public License as published by the Free Software 
Foundation, either version 3 of the License, or at your option) any later version.

This program is distributed in the hope that it will be useful,but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR 
 A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with 
this program. If not, see <http://www.gnu.org/licenses/>.
*/

import { createStore, applyMiddleware } from 'redux';
import fetchMock from 'fetch-mock';
import thunkMiddleware from 'redux-thunk';
import rootReducer from '../reducers';
import ManagerInterface from '../../Utils';

import { fetchToken, validateToken, logout, swapUser, getTokenFromStorage, receiveConfig } from '../actions/auth';
import { tokenStates, tokenSwapStates } from '../reducers/auth';
import {
  getToken,
  getUsername,
  getTokenStatus,
  getTokenSwapStatus,
  getPermCmdExec,
  getTaiToUtc,
  getServerTime,
  getServerTimeRequest,
  getServerTimeReceive,
  getConfig,
} from '../selectors';

let store;

beforeAll(async () => {
  // Arrange
  const url = `${ManagerInterface.getApiBaseUrl()}validate-token/no_config/`;
  fetchMock.mock(url, {
    status: 200,
    data: {},
  });
});

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

const initialMockConfig = {
  setting1: {
    setting11: 0,
    setting12: 0,
  },
};

const mockConfig = {
  setting1: {
    setting11: 1,
    setting12: 2,
  },
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
    const newToken = 'new-token';
    const url = `${ManagerInterface.getApiBaseUrl()}get-token/`;
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
        config: mockConfig,
      },
      new Headers({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Token ${newToken}`,
      }),
    );

    const urlViewsSummary = `${ManagerInterface.getUifBaseUrl()}views/summary/`;
    fetchMock.mock(
      urlViewsSummary,
      {},
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
    expect(getConfig(newState)).toEqual(mockConfig);
    expect(storedToken).toEqual(newToken);
  });

  it('Should not save the token and set status=REJECTED when fetched Fail', async () => {
    // Arrange:
    const url = `${ManagerInterface.getApiBaseUrl()}get-token/`;
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
  let initialToken;
  let url;
  let urlNoConfig;

  beforeEach(async () => {
    const token = '"love-token"';
    localStorage.setItem('LOVE-TOKEN', token);
    await store.dispatch(getTokenFromStorage(token));
    initialToken = getToken(store.getState());
    expect(initialToken).toEqual(token);
    url = `${ManagerInterface.getApiBaseUrl()}validate-token/`;
    urlNoConfig = `${ManagerInterface.getApiBaseUrl()}validate-token/no_config/`;
  });

  afterEach(() => {
    localStorage.removeItem('LOVE-TOKEN');
    fetchMock.reset();
  });

  it('Should validate the token and not change the token state when the token is valid', async () => {
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
        config: mockConfig,
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
    expect(getConfig(store.getState())).toEqual(mockConfig);
    expect(getTokenStatus(store.getState())).toEqual(tokenStates.RECEIVED);
  });

  it('Should not request config when validating the token if the config is already on the state', async () => {
    // Arrange:
    await store.dispatch(receiveConfig(initialMockConfig));
    fetchMock.mock(
      urlNoConfig,
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
    expect(getConfig(store.getState())).toEqual(initialMockConfig);
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
          status,
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
    expect(getTokenSwapStatus(store.getState())).toEqual(tokenSwapStates.RECEIVED);
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
    initialToken = getToken(store.getState());
    // Act:
    await store.dispatch(swapUser('username', 'incorrect'));
    // Assert:
    const token = getToken(store.getState());
    const storedToken = localStorage.getItem('LOVE-TOKEN');
    expect(token).toEqual(initialToken);
    expect(storedToken).toEqual(initialToken);
    expect(getTokenStatus(store.getState())).toEqual(tokenStates.READ_FROM_STORAGE);
    expect(getTokenSwapStatus(store.getState())).toEqual(tokenSwapStates.REJECTED);
  });

  it('Should keep token if server returns error', async () => {
    // Arrange:
    url = `${ManagerInterface.getApiBaseUrl()}swap-user/`;
    fetchMock.mock(
      url,
      {
        status: 500,
      },
      ManagerInterface.getHeaders(),
    );
    initialToken = getToken(store.getState());
    // Act:
    await store.dispatch(swapUser('username', 'password'));
    // Assert:
    const token = getToken(store.getState());
    const storedToken = localStorage.getItem('LOVE-TOKEN');
    expect(token).toEqual(initialToken);
    expect(storedToken).toEqual(initialToken);
    expect(getTokenStatus(store.getState())).toEqual(tokenStates.READ_FROM_STORAGE);
    expect(getTokenSwapStatus(store.getState())).toEqual(tokenSwapStates.ERROR);
  });
});
