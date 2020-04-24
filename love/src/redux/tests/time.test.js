import { createStore, applyMiddleware } from 'redux';
import WS from 'jest-websocket-mock';
import rootReducer from '../reducers';
import thunkMiddleware from 'redux-thunk';
import { emptyToken, doReceiveToken, logout } from '../actions/auth';
import { clockStart, clockStop } from '../actions/time';
import { clockStatuses } from '../reducers/time';
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
  it('When the clock starts, its status is STARTED', async () => {
    // ARRANGE
    expect(getAllTime(store.getState()).clock_status).toEqual(clockStatuses.STOPPED);
    // ACT
    await store.dispatch(clockStart());
    // ASSERT
    expect(getAllTime(store.getState()).clock_status).toEqual(clockStatuses.STARTED);
  });

  it('When the user logs in, the clock is STARTED', async () => {
    // ARRANGE
    expect(getAllTime(store.getState()).clock_status).toEqual(clockStatuses.STOPPED);
    // ACT
    await store.dispatch(doReceiveToken('username', 'love-token', {}, 0 ));
    // ASSERT
    expect(getAllTime(store.getState()).clock_status).toEqual(clockStatuses.STARTED);
  });
});

// TEST CLOCK STOP
describe('Given the clock is STARTED, ', () => {
  beforeEach(async () => {
    await store.dispatch(doReceiveToken('username', 'love-token', {}, 0 ));
    await server.connected;
  });

  it('When the clock stops, its status is STOPPED', async () => {
    // ARRANGE
    expect(getAllTime(store.getState()).clock_status).toEqual(clockStatuses.STARTED);
    // ACT
    await store.dispatch(clockStop());
    // ASSERT
    expect(getAllTime(store.getState()).clock_status).toEqual(clockStatuses.STOPPED);
  });

  it('When the the user logs out, its status is STOPPED', async () => {
    // ARRANGE
    expect(getAllTime(store.getState()).clock_status).toEqual(clockStatuses.STARTED);
    // ACT
    await store.dispatch(logout());
    // ASSERT
    expect(getAllTime(store.getState()).clock_status).toEqual(clockStatuses.STOPPED);
  });
});
