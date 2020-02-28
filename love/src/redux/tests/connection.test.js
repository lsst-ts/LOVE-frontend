import { createStore, applyMiddleware } from 'redux';
import WS from 'jest-websocket-mock';
import rootReducer from '../reducers';
import logger from 'redux-logger'
import thunkMiddleware from 'redux-thunk';
import { openWebsocketConnection, connectionStates, requestGroupSubscription } from '../actions/ws';
import { emptyToken, doReceiveToken } from '../actions/auth';
import {
  getAllTelemetries,
  getAllEvents,
  getToken,
  getConnectionStatus,
} from '../selectors';

let store, server;

beforeEach(async () => {
  store = createStore(rootReducer, applyMiddleware(thunkMiddleware));
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

    server.on('close', _socket => {
      connectionAttempted = true;
    });
    // Assert connection is closed before
    expect(getConnectionStatus(store.getState())).toEqual(connectionStates.CLOSED);

    // ACT
    await store.dispatch(openWebsocketConnection());

    // Assert
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

    // Assert
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
    let connectionAttempted = false;
    server.on('connection', _socket => {
      connectionAttempted = true;
    });

    server.on('close', _socket => {
      connectionAttempted = true;
    });
    // Assert connection is closed before
    expect(getConnectionStatus(store.getState())).toEqual(connectionStates.CLOSED);

    // ACT
    await store.dispatch(openWebsocketConnection());

    // Assert
    expect(getConnectionStatus(store.getState())).toEqual(connectionStates.OPENING);
    await server.connected;
    expect(connectionAttempted).toBeTruthy();
    expect(getConnectionStatus(store.getState())).toEqual(connectionStates.OPEN);
  });
});
