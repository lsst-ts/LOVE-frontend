import { createStore, applyMiddleware } from 'redux';
import WS from 'jest-websocket-mock';
import rootReducer from '../reducers';
import thunkMiddleware from 'redux-thunk';
import { DateTime, Settings } from 'luxon';
import { emptyToken, doReceiveToken, logout } from '../actions/auth';
import { clockStart, clockStop, receiveServerTime, tick } from '../actions/time';
import { clockStatuses, initialState } from '../reducers/time';
import { connectionStates } from '../actions/ws';
import { getConnectionStatus, getAllTime } from '../selectors';
import { siderealSecond } from '../../Utils';

let store, server;

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
  });
  expect(getConnectionStatus(store.getState())).toEqual(connectionStates.CLOSED);
});

afterEach(() => {
  WS.clean();
});

// TEST TIME INDEPENDENTLY
describe('Given the inital state', () => {
  const request_time = DateTime.utc().toMillis() / 1000;
  const server_time = {
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
    // STOP
    await store.dispatch(clockStop());
    expect(getAllTime(store.getState()).clock_status).toEqual(clockStatuses.STOPPED);
  });

  it('When we receive server time, then it is saved', async () => {
    // ARRANGE
    let time = getAllTime(store.getState());
    expect(time).toEqual(initialState);
    // ACT
    await store.dispatch(receiveServerTime(server_time, request_time));
    // ASSERT
    time = getAllTime(store.getState());
    expect(time.server_time).toEqual(server_time);
    expect(time.request_time).toEqual(request_time);
    expect(time.receive_time).toBeTruthy();
    expect(time.clock).toEqual(initialState.clock);
  });

  it('When the CLOCK TICKS, then the internal clock is updated', async () => {
    // ARRANGE
    await store.dispatch(receiveServerTime(server_time, request_time));
    // ACT
    await store.dispatch(tick());
    // ASSERT
    let time = getAllTime(store.getState());
    expect(time.clock).not.toEqual(initialState.clock);
  });

  it('When local-time is in time with server-time, then the clock is updated correctly', async () => {
    // Config
    const request_time = server_time.utc - 1;
    const receive_time = server_time.utc + 1;
    const tick_time    = receive_time + 5;
    const diff = tick_time - (receive_time + request_time) / 2;
    // Receive Server time
    Settings.now = () => new Date(receive_time * 1000).valueOf();
    await store.dispatch(receiveServerTime(server_time, request_time));
    // Tick
    Settings.now = () => new Date(tick_time * 1000).valueOf();
    await store.dispatch(tick());
    // Assertå
    let time = getAllTime(store.getState());
    expect(time.clock.utc.toSeconds()).toEqual(server_time.utc + diff);
    expect(time.clock.tai.toSeconds()).toEqual(server_time.tai + diff);
    expect(time.clock.mjd).toEqual(server_time.mjd + diff / (3600*24));
    expect(time.clock.sidereal_greenwich.toSeconds()).toEqual(server_time.sidereal_greenwich * 3600 + diff * siderealSecond);
    expect(time.clock.sidereal_summit.toSeconds()).toEqual(server_time.sidereal_summit * 3600 + diff * siderealSecond);
  });

  it('When local-time is before server-time, then the clock is updated correctly', async () => {
    // Config
    const request_time = server_time.utc - 1 - 5*60;
    const receive_time = server_time.utc + 1 - 5*60;
    const tick_time    = receive_time + 5;
    const diff = tick_time - (receive_time + request_time) / 2;
    // Receive Server time
    Settings.now = () => new Date(receive_time * 1000).valueOf();
    await store.dispatch(receiveServerTime(server_time, request_time));
    // Tick
    Settings.now = () => new Date(tick_time * 1000).valueOf();
    await store.dispatch(tick());
    // Assertå
    let time = getAllTime(store.getState());
    expect(time.clock.utc.toSeconds()).toEqual(server_time.utc + diff);
    expect(time.clock.tai.toSeconds()).toEqual(server_time.tai + diff);
    expect(time.clock.mjd).toEqual(server_time.mjd + diff / (3600*24));
    expect(time.clock.sidereal_greenwich.toSeconds()).toEqual(server_time.sidereal_greenwich * 3600 + diff * siderealSecond);
    expect(time.clock.sidereal_summit.toSeconds()).toEqual(server_time.sidereal_summit * 3600 + diff * siderealSecond);
  });

  it('When local-time is after server-time, then the clock is updated correctly', async () => {
    // Config
    const request_time = server_time.utc - 1 + 5*60;
    const receive_time = server_time.utc + 1 + 5*60;
    const tick_time    = receive_time + 5;
    const diff = tick_time - (receive_time + request_time) / 2;
    // Receive Server time
    Settings.now = () => new Date(receive_time * 1000).valueOf();
    await store.dispatch(receiveServerTime(server_time, request_time));
    // Tick
    Settings.now = () => new Date(tick_time * 1000).valueOf();
    await store.dispatch(tick());
    // Assertå
    let time = getAllTime(store.getState());
    expect(time.clock.utc.toSeconds()).toEqual(server_time.utc + diff);
    expect(time.clock.tai.toSeconds()).toEqual(server_time.tai + diff);
    expect(time.clock.mjd).toEqual(server_time.mjd + diff / (3600*24));
    expect(time.clock.sidereal_greenwich.toSeconds()).toEqual(server_time.sidereal_greenwich * 3600 + diff * siderealSecond);
    expect(time.clock.sidereal_summit.toSeconds()).toEqual(server_time.sidereal_summit * 3600 + diff * siderealSecond);
  });
});
