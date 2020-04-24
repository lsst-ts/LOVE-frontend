import { createStore, applyMiddleware } from 'redux';
import WS from 'jest-websocket-mock';
import rootReducer from '../reducers';
import thunkMiddleware from 'redux-thunk';
import { DateTime } from 'luxon';
import { emptyToken, doReceiveToken, logout } from '../actions/auth';
import { clockStart, clockStop, receiveServerTime, tick } from '../actions/time';
import { clockStatuses, initialState } from '../reducers/time';
import { connectionStates } from '../actions/ws';
import { getConnectionStatus, getAllTime } from '../selectors';

let store, server;

beforeEach(async () => {
  // ARRANGE
  store = createStore(rootReducer, applyMiddleware(thunkMiddleware));
  await store.dispatch(emptyToken);
  server = new WS('ws://localhost/manager/ws/subscription', { jsonProtocol: true });
  server.on('connection', socket => {
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

// TEST CLOCK START
describe('Given the clock is STOPPED, ', () => {
  it('When the clock starts, then its status is STARTED', async () => {
    // BEFORE
    expect(getAllTime(store.getState()).clock_status).toEqual(clockStatuses.STOPPED);
    // ACT
    await store.dispatch(clockStart());
    // ASSERT
    expect(getAllTime(store.getState()).clock_status).toEqual(clockStatuses.STARTED);
  });

  it('When the user logs in, then the clock is STARTED and server time is received', async () => {
    // ASSERT BEFORE
    expect(getAllTime(store.getState()).clock_status).toEqual(clockStatuses.STOPPED);
    // ACT
    await store.dispatch(doReceiveToken('username', 'love-token', {}, 0 ));
    // ASSERT
    expect(getAllTime(store.getState()).clock_status).toEqual(clockStatuses.STARTED);
  });
});

// TEST CLOCK STOP
describe('Given the user is logged in and the clock is STARTED, ', () => {
  beforeEach(async () => {
    await store.dispatch(doReceiveToken('username', 'love-token', {}, 0 ));
    await server.connected;
  });

  it('When the clock stops, then its status is STOPPED', async () => {
    // BEFORE
    expect(getAllTime(store.getState()).clock_status).toEqual(clockStatuses.STARTED);
    // ACT
    await store.dispatch(clockStop());
    // ASSERT
    expect(getAllTime(store.getState()).clock_status).toEqual(clockStatuses.STOPPED);
  });

  it('When the the user logs out, then its status is STOPPED', async () => {
    // BEFORE
    expect(getAllTime(store.getState()).clock_status).toEqual(clockStatuses.STARTED);
    // ACT
    await store.dispatch(logout());
    // ASSERT
    expect(getAllTime(store.getState()).clock_status).toEqual(clockStatuses.STOPPED);
  });
});


// TEST TIME INDEPENDENTLY
describe('Given the inital state', () => {

  const request_time = DateTime.utc().toMillis() / 1000;
  const server_time = {
    utc: 1587747218.377575,
    tai: 1587747255.377575,
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

  it('When the clock ticks, then the internal clock is updated', async () => {
    // ARRANGE
    await store.dispatch(receiveServerTime(server_time, request_time));
    // ACT
    await store.dispatch(tick());
    // ASSERT
    let time = getAllTime(store.getState());
    expect(time.clock).not.toEqual(initialState.clock);
  });
});