/* eslint camelcase: 0 */
/* eslint no-await-in-loop: 0 */
/* eslint no-restricted-syntax: 0 */

import { createStore, applyMiddleware } from 'redux';
import WS from 'jest-websocket-mock';
import thunkMiddleware from 'redux-thunk';
import { DateTime, Settings } from 'luxon';
import fetchMock from 'fetch-mock';
import rootReducer from '../reducers';
import { emptyToken, doReceiveToken, logout } from '../actions/auth';
import { clockStart, clockStop, receiveServerTime, tick, SYNC_PERIOD } from '../actions/time';
import { clockStatuses, initialState } from '../reducers/time';
import { connectionStates } from '../actions/ws';
import { getConnectionStatus, getAllTime } from '../selectors';
import ManagerInterface from '../../Utils';
import { SIDEREAL_SECOND } from '../../Constants';

let store;
let server;

beforeAll(async () => {
  // ARRANGE
  const url = `${ManagerInterface.getApiBaseUrl()}logout/`;
  fetchMock.mock(url, {
    status: 204,
    data: {
      detail: 'Logout successful, Token succesfully deleted',
    },
  });
});

beforeEach(async () => {
  // ARRANGE
  store = createStore(rootReducer, applyMiddleware(thunkMiddleware));
  await store.dispatch(emptyToken);
  jest.useFakeTimers();
  jest.spyOn(global, 'clearInterval');
  jest.spyOn(global, 'setInterval');
});

afterEach(() => {
  jest.useRealTimers();
});

// TEST TIME INDEPENDENTLY
describe('Given the inital state', () => {
  const serverTime = {
    utc: 1587747218.377,
    tai: 1587747255.377,
    mjd: 58963.70391640712,
    sidereal_greenwich: 7.105572546869015,
    sidereal_summit: 2.388944746869015,
    tai_to_utc: -37,
  };

  it('When the clock starts then its status is STARTED, and when it stops then the status is STOPPED', async () => {
    // BEFORE
    expect(getAllTime(store.getState()).clock_status).toEqual(clockStatuses.STOPPED);
    // START
    await store.dispatch(clockStart());
    expect(getAllTime(store.getState()).clock_status).toEqual(clockStatuses.STARTED);
    expect(clearInterval).toHaveBeenCalledTimes(2);
    expect(setInterval).toHaveBeenCalledTimes(2);
    // STOP
    await store.dispatch(clockStop());
    expect(getAllTime(store.getState()).clock_status).toEqual(clockStatuses.STOPPED);
    expect(clearInterval).toHaveBeenCalledTimes(4);
  });

  it('When we receive server time, then it is saved', async () => {
    // ARRANGE
    let time = getAllTime(store.getState());
    expect(time).toEqual(initialState);
    const requestTime = DateTime.utc().toMillis() / 1000;
    // ACT
    await store.dispatch(receiveServerTime(serverTime, requestTime));
    // ASSERT
    time = getAllTime(store.getState());
    expect(time.server_time).toEqual(serverTime);
    expect(time.request_time).toEqual(requestTime);
    expect(time.receive_time).toBeTruthy();
    expect(time.clock).toEqual(initialState.clock);
  });

  it('When the CLOCK TICKS, then the internal clock is updated', async () => {
    // ARRANGE
    const requestTime = DateTime.utc().toMillis() / 1000;
    await store.dispatch(receiveServerTime(serverTime, requestTime));
    // ACT
    await store.dispatch(tick());
    // ASSERT
    const time = getAllTime(store.getState());
    expect(time.clock).not.toEqual(initialState.clock);
  });

  it('Test tick under different cases of differences between local and server time', async () => {
    // Config
    const cases = [
      {
        // In sync
        requestTime: serverTime.utc - 1,
        receiveTime: serverTime.utc + 1,
      },
      {
        // Local 5 minutes behind server
        requestTime: serverTime.utc - 1 - 5 * 60,
        receiveTime: serverTime.utc + 1 - 5 * 60,
      },
      {
        // Local 5 minutes ahead of server
        requestTime: serverTime.utc - 1 + 5 * 60,
        receiveTime: serverTime.utc + 1 + 5 * 60,
      },
    ];
    for (const element of cases) {
      const { requestTime } = element;
      const { receiveTime } = element;
      const tickTime = receiveTime + 5;
      const diff = tickTime - (receiveTime + requestTime) / 2;
      // Receive Server time
      Settings.now = () => new Date(receiveTime * 1000).valueOf();
      await store.dispatch(receiveServerTime(serverTime, requestTime));
      // Tick
      Settings.now = () => new Date(tickTime * 1000).valueOf();
      await store.dispatch(tick());
      // Assert
      const time = getAllTime(store.getState());
      expect(time.clock.utc.toSeconds()).toEqual(serverTime.utc + diff);
      expect(time.clock.tai.toSeconds()).toEqual(serverTime.tai + diff);
      expect(time.clock.mjd).toEqual(serverTime.mjd + diff / (3600 * 24));
      expect(time.clock.sidereal_greenwich.toSeconds()).toEqual(
        serverTime.sidereal_greenwich * 3600 + diff * SIDEREAL_SECOND,
      );
      expect(time.clock.sidereal_summit.toSeconds()).toEqual(serverTime.sidereal_summit * 3600 + diff * SIDEREAL_SECOND);
    }
  });
});

// TEST TIME PASS
describe('Given the inital state', () => {
  const server_time = {
    utc: 1587747218.377,
    tai: 1587747255.377,
    mjd: 58963.70391640712,
    sidereal_greenwich: 7.105572546869015,
    sidereal_summit: 2.388944746869015,
    tai_to_utc: -37,
  };

  it('When the clock starts then its status is STARTED, and when it stops then the status is STOPPED', async () => {
    // Arrange
    const request_time = server_time.utc - 1;
    const receive_time = server_time.utc + 1;
    let time = getAllTime(store.getState());
    expect(time.clock_status).toEqual(clockStatuses.STOPPED);
    expect(time.clock).toEqual(initialState.clock);

    // Login should start timer
    let tick_time = (receive_time + request_time) / 2 + 1;
    Settings.now = () => new Date(receive_time * 1000).valueOf();
    await store.dispatch(doReceiveToken('username', 'love-token', {}, server_time, request_time));
    time = getAllTime(store.getState());
    expect(time.clock_status).toEqual(clockStatuses.STARTED);

    // It should have ticked once
    expect(time.clock.utc.toSeconds()).toEqual(server_time.utc + 1);
    expect(time.clock.tai.toSeconds()).toEqual(server_time.tai + 1);
    expect(time.clock.mjd).toEqual(server_time.mjd + 1 / (3600 * 24));
    expect(time.clock.sidereal_greenwich.toSeconds()).toEqual(
      server_time.sidereal_greenwich * 3600 + 1 * SIDEREAL_SECOND,
    );
    expect(time.clock.sidereal_summit.toSeconds()).toEqual(server_time.sidereal_summit * 3600 + 1 * SIDEREAL_SECOND);

    // Next 10 ticks
    for (let diff = 2; diff < 10; diff++) {
      tick_time += 1; // tick_time == server_time.utc + 1
      Settings.now = () => new Date(tick_time * 1000).valueOf();
      jest.advanceTimersByTime(1000);
      time = getAllTime(store.getState());
      expect(time.clock).not.toEqual(initialState.clock);
      expect(time.clock.utc.toSeconds()).toEqual(server_time.utc + diff);
      expect(time.clock.tai.toSeconds()).toEqual(server_time.tai + diff);
      expect(time.clock.mjd).toEqual(server_time.mjd + diff / (3600 * 24));
      expect(time.clock.sidereal_greenwich.toSeconds().toFixed(10)).toEqual(
        (server_time.sidereal_greenwich * 3600 + diff * SIDEREAL_SECOND).toFixed(10),
      );
      expect(time.clock.sidereal_summit.toSeconds().toFixed(10)).toEqual(
        (server_time.sidereal_summit * 3600 + diff * SIDEREAL_SECOND).toFixed(10),
      );
    }

    // Logout should stop timer
    await store.dispatch(logout());
    time = getAllTime(store.getState());
    expect(time.clock_status).toEqual(clockStatuses.STOPPED);
  });
});

// TEST TIME PASS
describe('Given the inital state', () => {
  const server_time = [
    {
      utc: 1587747218.377,
      tai: 1587747255.377,
      mjd: 58963.70391640712,
      sidereal_greenwich: 7.105572546869015,
      sidereal_summit: 2.388944746869015,
      tai_to_utc: -37,
    },
    {
      utc: 1587747228.377,
      tai: 1587747265.377,
      mjd: 58963.80391640712,
      sidereal_greenwich: 7.205572546869015,
      sidereal_summit: 2.488944746869015,
      tai_to_utc: -37,
    },
    {
      utc: 1587747238.377,
      tai: 1587747275.377,
      mjd: 58963.90391640712,
      sidereal_greenwich: 7.305572546869015,
      sidereal_summit: 2.588944746869015,
      tai_to_utc: -37,
    },
    {
      utc: 1587747248.377,
      tai: 1587747285.377,
      mjd: 58964.00391640712,
      sidereal_greenwich: 7.405572546869015,
      sidereal_summit: 2.688944746869015,
      tai_to_utc: -37,
    },
  ];
  let serverIndex = 0;

  beforeEach(async () => {
    // ARRANGE
    store = createStore(rootReducer, applyMiddleware(thunkMiddleware));
    await store.dispatch(emptyToken);
    server = new WS('ws://localhost/manager/ws/subscription', { jsonProtocol: true });
    server.on('connection', (socket) => {
      const [, token] = socket.url.split('?token=');
      if (token !== 'love-token') {
        socket.close();
      }
      socket.on('message', (msg) => {
        const message = JSON.parse(msg);
        serverIndex++;
        server.send({
          time_data: server_time[serverIndex],
          request_time: message.request_time,
        });
      });
    });
    expect(getConnectionStatus(store.getState())).toEqual(connectionStates.CLOSED);
  });

  afterEach(() => {
    WS.clean();
  });

  it('When the clock starts then its requests and receives server time periodically', async () => {
    // Arrange
    let time = getAllTime(store.getState());
    expect(time.clock_status).toEqual(clockStatuses.STOPPED);
    expect(time.clock).toEqual(initialState.clock);

    // Login should start timer
    await store.dispatch(
      doReceiveToken('username', 'love-token', {}, server_time[serverIndex], DateTime.utc().toSeconds()),
    );
    expect(getConnectionStatus(store.getState())).toEqual(connectionStates.OPENING);
    jest.advanceTimersByTime(10);
    const connected = await server.connected;
    expect(connected.readyState).toEqual(WebSocket.OPEN);
    expect(getConnectionStatus(store.getState())).toEqual(connectionStates.OPEN);

    time = getAllTime(store.getState());
    expect(time.clock_status).toEqual(clockStatuses.STARTED);
    expect(time.server_time).toEqual(server_time[serverIndex]);

    for (let count = 1; count < 4; count++) {
      jest.advanceTimersByTime(SYNC_PERIOD);
      time = getAllTime(store.getState());
      expect(time.server_time).toEqual(server_time[count]);
    }

    // Logout should stop timer
    await store.dispatch(logout());
    time = getAllTime(store.getState());
    expect(time.clock_status).toEqual(clockStatuses.STOPPED);
  });
});
