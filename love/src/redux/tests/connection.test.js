import { createStore, applyMiddleware } from 'redux';
import WS from 'jest-websocket-mock';
import rootReducer from '../reducers';
import thunkMiddleware from 'redux-thunk';
import { openWebsocketConnection, connectionStates, closeWebsocketConnection } from '../actions/ws';
import { doReceiveToken, emptyToken } from '../actions/auth';
import {
  getToken,
  getConnectionStatus,
} from '../selectors';

let store, server;

beforeEach(async () => {
  store = createStore(rootReducer, applyMiddleware(thunkMiddleware));
  await store.dispatch(emptyToken);
  server = new WS('ws://localhost/manager/ws/subscription?token=love-token', { jsonProtocol: true });
});

afterEach(() => {
  WS.clean();
});

describe('Given the token is EMPTY and the connection is CLOSED, ', () => {
  it('When a CONNECTION IS DISPACHED, then the connection remains CLOSED and the Server DID NOT CONNECT',
  async () => {
    // ARRANGE
    let connectionAttempted = false;
    server.on('connection', _socket => {
      connectionAttempted = true;
    });
    // Assert connection is closed before
    expect(getConnectionStatus(store.getState())).toEqual(connectionStates.CLOSED);

    // ACT
    await store.dispatch(openWebsocketConnection());

    // ASSERT
    expect(getConnectionStatus(store.getState())).not.toEqual(connectionStates.OPENING);
    await new Promise(resolve => setTimeout(resolve, 1000));
    expect(connectionAttempted).toBeFalsy();
    expect(getConnectionStatus(store.getState())).toEqual(connectionStates.CLOSED);
  });

  it('When a CLOSE CONNECTION IS DISPACHED, then tnothing happens',
  async () => {
    // ARRANGE
    let connectionAttempted = false;
    server.on('connection', _socket => {
      connectionAttempted = true;
    });
    // Assert connection is closed before
    expect(getConnectionStatus(store.getState())).toEqual(connectionStates.CLOSED);

    // ACT
    await store.dispatch(closeWebsocketConnection());

    // ASSERT
    expect(getConnectionStatus(store.getState())).not.toEqual(connectionStates.OPENING);
    await new Promise(resolve => setTimeout(resolve, 1000));
    expect(connectionAttempted).toBeFalsy();
    expect(getConnectionStatus(store.getState())).toEqual(connectionStates.CLOSED);
  });
});

describe('Given an incorrect token is RECEIVED and the connection is CLOSED, ', () => {
  beforeEach(async () => {
    await store.dispatch(doReceiveToken('username', 'love-wrong-token', {}, 0 ));
  });

  it('When a CONNECTION IS DISPACHED, then the connection goes to OPENING and then CLOSED and Server DID NOT CONNECT',
  async () => {
    // ARRANGE
    let connectionStablished = false;
    server.on('connection', _socket => {
      connectionStablished = true;
    });
    // Assert connection is closed before
    expect(getConnectionStatus(store.getState())).toEqual(connectionStates.CLOSED);

    // ACT
    await store.dispatch(openWebsocketConnection());

    // ASSERT
    expect(getConnectionStatus(store.getState())).toEqual(connectionStates.OPENING);
    await new Promise(resolve => setTimeout(resolve, 1000));
    expect(connectionStablished).toBeFalsy();
    expect(getConnectionStatus(store.getState())).toEqual(connectionStates.CLOSED);
  });
});

describe('Given a correct token is RECEIVED and the connection is CLOSED, ', () => {
  beforeEach(async () => {
    await store.dispatch(doReceiveToken('username', 'love-token', {}, 0 ));
  });

  it('When a CONNECTION IS DISPACHED, then the connection goes to OPENING and then OPEN and the Server DID CONNECT',
  async () => {
    // ARRANGE
    expect(getConnectionStatus(store.getState())).toEqual(connectionStates.CLOSED);

    // ACT
    await store.dispatch(openWebsocketConnection());

    // ASSERT
    expect(getConnectionStatus(store.getState())).toEqual(connectionStates.OPENING);
    const websocket = await server.connected;
    expect(websocket.readyState).toEqual(WebSocket.OPEN);
    expect(getConnectionStatus(store.getState())).toEqual(connectionStates.OPEN);
  });
});

describe('Given a correct token is RECEIVED and the connection is CLOSED, ', () => {
  beforeEach(async () => {
    await store.dispatch(doReceiveToken('username', 'love-token', {}, 0 ));
  });

  it('When a CONNECTION IS DISPACHED but the server sends an ERROR, then connection goes to OPENING and then RETRYING',
  async () => {
    // ARRANGE
    server.on('connection', socket => {
      socket.close({ wasClean: false, code: 1003, reason: "NOPE" });
    });
    // Assert connection is closed before
    expect(getConnectionStatus(store.getState())).toEqual(connectionStates.CLOSED);
    await store.dispatch(openWebsocketConnection());
    // Assert connection is opening after dispatching connection
    expect(getConnectionStatus(store.getState())).toEqual(connectionStates.OPENING);
    await server.connected;
    expect(getConnectionStatus(store.getState())).toEqual(connectionStates.OPEN);

    // ACT
    await server.closed;

    // ASSERT
    expect(getConnectionStatus(store.getState())).toEqual(connectionStates.RETRYING);
  });
});

describe('Given a correct token is RECEIVED and the connection is OPEN, ', () => {
  beforeEach(async () => {
    await store.dispatch(doReceiveToken('username', 'love-token', {}, 0 ));
  });

  it('When the server closes the connection with a 1000 code, then connection goes to CLOSED',
  async () => {
    // ARRANGE
    let disconnected = false;
    server.on('close', _socket => { disconnected = true });
    expect(getConnectionStatus(store.getState())).toEqual(connectionStates.CLOSED);
    await store.dispatch(openWebsocketConnection());
    await server.connected;
    // Assert connection is open before
    expect(getConnectionStatus(store.getState())).toEqual(connectionStates.OPEN);

    // ACT
    server.close({ code: 1000 });

    // ASSERT
    expect(getConnectionStatus(store.getState())).toEqual(connectionStates.CLOSED);
    expect(disconnected).toBe(true);
    await server.closed;
  });
});

describe('Given a connection is OPEN, ', () => {
  beforeEach(async () => {
    await store.dispatch(doReceiveToken('username', 'love-token', {}, 0 ));
    await store.dispatch(openWebsocketConnection());
    await server.connected;
  });

  it('When a CLOSE CONNECTION is dispacthed, then connection goes to CLOSED, and the connection is closed',
  async () => {
    // ARRANGE
    let disconnected = false;
    server.on('close', _socket => { disconnected = true });
    // Assert connection is open before
    expect(getConnectionStatus(store.getState())).toEqual(connectionStates.OPEN);

    // ACT
    await store.dispatch(closeWebsocketConnection());

    // ASSERT
    expect(getConnectionStatus(store.getState())).toEqual(connectionStates.CLOSED);
    await server.closed;
    expect(disconnected).toBe(true);
  });

  it('When an OPEN CONNECTION is dispacthed, then NOTHING HAPPENS',
  async () => {
    // ARRANGE
    let reconnected = false;
    server.on('connection', _socket => { reconnected = true });
    // Assert connection is open before
    expect(getConnectionStatus(store.getState())).toEqual(connectionStates.OPEN);

    // ACT
    await store.dispatch(openWebsocketConnection());

    // ASSERT
    expect(getConnectionStatus(store.getState())).toEqual(connectionStates.OPEN);
    expect(reconnected).toBe(false);
  });
});
