import { createStore, applyMiddleware } from 'redux';
import WS from 'jest-websocket-mock';
import rootReducer from '../reducers';
import thunkMiddleware from 'redux-thunk';
import { doReceiveToken, emptyToken, doExpireToken, doRejectToken, doRequestRemoveToken } from '../actions/auth';
import {
  connectionStates,
  groupStates,
  openWebsocketConnection,
  closeWebsocketConnection,
  addGroupSubscription,
  requestGroupSubscriptionRemoval,
} from '../actions/ws';
import {
  getConnectionStatus,
  getSubscriptions,
} from '../selectors';

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

// TEST ONLY WEBSOCKET CONNECTION / DISCONNECTION
describe('Given the token is EMPTY and the connection is CLOSED, ', () => {
  it('When a CONNECTION IS DISPACHED, then the connection remains CLOSED and the Server DID NOT CONNECT',
  async () => {
    // ACT
    await store.dispatch(openWebsocketConnection());

    // ASSERT
    expect(getConnectionStatus(store.getState())).not.toEqual(connectionStates.OPENING);
    await new Promise(resolve => setTimeout(resolve, 1000));
    expect(getConnectionStatus(store.getState())).toEqual(connectionStates.CLOSED);
  });

  it('When a CLOSE CONNECTION IS DISPACHED, then nothing happens',
  async () => {
    // ACT
    await store.dispatch(closeWebsocketConnection());

    // ASSERT
    expect(getConnectionStatus(store.getState())).not.toEqual(connectionStates.OPENING);
    await new Promise(resolve => setTimeout(resolve, 1000));
    expect(getConnectionStatus(store.getState())).toEqual(connectionStates.CLOSED);
  });

  it('When a correct token is RECEIVED, then the CONNECTION IS OPENING then OPEN',
  async () => {
    // ACT
    await store.dispatch(doReceiveToken('username', 'love-token', {}, 0 ));

    // ASSERT
    expect(getConnectionStatus(store.getState())).toEqual(connectionStates.OPENING);
    const connected = await server.connected;
    expect(connected.readyState).toEqual(WebSocket.OPEN);
    expect(getConnectionStatus(store.getState())).toEqual(connectionStates.OPEN);
  });

  it('When an incorrect token is RECEIVED, then the connection is OPENING and then CLOSED and Server DID NOT CONNECT',
  async () => {
    // ACT
    await store.dispatch(doReceiveToken('username', 'love-wrong-token', {}, 0 ));

    // ASSERT
    expect(getConnectionStatus(store.getState())).toEqual(connectionStates.OPENING);
    await server.closed;
    expect(getConnectionStatus(store.getState())).toEqual(connectionStates.CLOSED);
  });

  it('When a correct token is RECEIVED but the server sends an ERROR, then connection goes to OPENING and RETRYING',
  async () => {
    // ARRANGE
    server.on('connection', socket => {
      socket.close({ wasClean: false, code: 1003, reason: "NOPE" });
    });
    await store.dispatch(doReceiveToken('username', 'love-token', {}, 0 ));
    expect(getConnectionStatus(store.getState())).toEqual(connectionStates.OPENING);
    await server.connected;
    expect(getConnectionStatus(store.getState())).toEqual(connectionStates.OPEN);

    // ACT
    await server.closed;

    // ASSERT
    expect(getConnectionStatus(store.getState())).toEqual(connectionStates.RETRYING);
  });

  it('When a token is RECEIVED but the server closes the connection with a 1000 code, then connection is CLOSED',
  async () => {
    // ARRANGE
    let disconnected = false;
    server.on('close', _socket => { disconnected = true });
    expect(getConnectionStatus(store.getState())).toEqual(connectionStates.CLOSED);
    await store.dispatch(doReceiveToken('username', 'love-token', {}, 0 ));
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
    await server.connected;
  });

  it('When a CLOSE CONNECTION is dispatched, then connection goes to CLOSED, and the connection is closed',
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

  it('When a EXPIRE TOKEN is dispatched, then connection goes to CLOSED, and the connection is closed',
  async () => {
    // ARRANGE
    let disconnected = false;
    server.on('close', _socket => { disconnected = true });
    // Assert connection is open before
    expect(getConnectionStatus(store.getState())).toEqual(connectionStates.OPEN);

    // ACT
    await store.dispatch(doExpireToken());

    // ASSERT
    expect(getConnectionStatus(store.getState())).toEqual(connectionStates.CLOSED);
    await server.closed;
    expect(disconnected).toBe(true);
  });

  it('When a REJECT TOKEN is dispatched, then connection goes to CLOSED, and the connection is closed',
  async () => {
    // ARRANGE
    let disconnected = false;
    server.on('close', _socket => { disconnected = true });
    // Assert connection is open before
    expect(getConnectionStatus(store.getState())).toEqual(connectionStates.OPEN);

    // ACT
    await store.dispatch(doRejectToken());

    // ASSERT
    expect(getConnectionStatus(store.getState())).toEqual(connectionStates.CLOSED);
    await server.closed;
    expect(disconnected).toBe(true);
  });

  it('When a REQUEST REMOVE TOKEN is dispatched, then NOTHING HAPPENS',
  async () => {
    // ARRANGE
    let disconnected = false;
    server.on('close', _socket => { disconnected = true });
    // Assert connection is open before
    expect(getConnectionStatus(store.getState())).toEqual(connectionStates.OPEN);

    // ACT
    await store.dispatch(doRequestRemoveToken());

    // ASSERT
    expect(getConnectionStatus(store.getState())).toEqual(connectionStates.CLOSED);
    await server.closed;
    expect(disconnected).toBe(true);
  });

  it('When an OPEN CONNECTION is dispatched, then NOTHING HAPPENS',
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



// TEST SUBSCRIPTIONS AND HOW THEY INTERACT WITH CONNECTION
describe('Given the CONNECTION is CLOSED and the SUBSCRIPTIONS are EMPTY, ', () => {
  it('When a SUBSCRIPTION is DISPATCHED, then it is added to the list of subscriptions as PENDING', async () => {
    expect(getSubscriptions(store.getState())).toEqual([]);
    // ACT
    await store.dispatch(addGroupSubscription('telemetry-all-all-all'));

    // ASSERT
    const subscriptions = getSubscriptions(store.getState());
    expect(subscriptions).toEqual([
      {
        groupName: 'telemetry-all-all-all',
        status: groupStates.PENDING,
      },
    ]);
  });
});

describe('Given the CONNECTION is CLOSED and there are PENDING SUBSCRIPTIONS, ', () => {
  beforeEach(async () => {
    await store.dispatch(addGroupSubscription('telemetry-all-all-all'));
    await store.dispatch(addGroupSubscription('event-all-all-all'));
  });

  it('When the CONNECTION is OPEN, then the subscriptions state change to REQUESTING, ' +
  'and when the server confirms each subscription, that subscription is updated',
  async () => {
    // Open connection
    await store.dispatch(doReceiveToken('username', 'love-token', {}, 0));
    await store.dispatch(openWebsocketConnection());
    await server.connected;
    await expect(server).toReceiveMessage({
      option: 'subscribe',
      category: 'telemetry',
      csc: 'all',
      salindex: 'all',
      stream: 'all',
    });
    await expect(server).toReceiveMessage({
      option: 'subscribe',
      category: 'event',
      csc: 'all',
      salindex: 'all',
      stream: 'all',
    });
    expect(getConnectionStatus(store.getState())).toEqual(connectionStates.OPEN);
    expect(getSubscriptions(store.getState())).toEqual([
      {
        groupName: 'telemetry-all-all-all',
        status: groupStates.REQUESTING,
      },
      {
        groupName: 'event-all-all-all',
        status: groupStates.REQUESTING,
      },
    ]);

    // Server confirms group 1
    server.send({
      data: "Successfully subscribed to telemetry-all-all-all"
    });
    expect(getSubscriptions(store.getState())).toEqual([
      {
        groupName: 'telemetry-all-all-all',
        status: groupStates.SUBSCRIBED,
        confirmationMessage: "Successfully subscribed to telemetry-all-all-all",
      },
      {
        groupName: 'event-all-all-all',
        status: groupStates.REQUESTING,
      },
    ]);

    // Server confirms group 2
    server.send({
      data: "Successfully subscribed to event-all-all-all"
    });
    expect(getSubscriptions(store.getState())).toEqual([
      {
        groupName: 'telemetry-all-all-all',
        status: groupStates.SUBSCRIBED,
        confirmationMessage: "Successfully subscribed to telemetry-all-all-all",
      },
      {
        groupName: 'event-all-all-all',
        status: groupStates.SUBSCRIBED,
        confirmationMessage: "Successfully subscribed to event-all-all-all",
      },
    ]);
  });
});

// TEST SUBSCRIPTIONS
describe('Given the CONNECTION is OPEN and there are SUBSCRIBED GROUPS, ', () => {

  beforeEach(async () => {
    await store.dispatch(doReceiveToken('username', 'love-token', {}, 0));
    await store.dispatch(addGroupSubscription('telemetry-all-all-all'));
    await store.dispatch(addGroupSubscription('event-all-all-all'));
    await expect(server).toReceiveMessage({
      option: 'subscribe',
      category: 'telemetry',
      csc: 'all',
      salindex: 'all',
      stream: 'all',
    });
    await expect(server).toReceiveMessage({
      option: 'subscribe',
      category: 'event',
      csc: 'all',
      salindex: 'all',
      stream: 'all',
    });
    server.send({
      data: "Successfully subscribed to telemetry-all-all-all"
    });
    server.send({
      data: "Successfully subscribed to event-all-all-all"
    });
  });

  it('When a new GROUP IS ADDED, then the subscriptions state change to PENDING and then REQUESTING, ' +
  'and when the server confirms each unsubscription, that subscription is removed',
  async () => {
    // Add new group
    await store.dispatch(addGroupSubscription('cmd-all-all-all'));
    await expect(server).toReceiveMessage({
      option: 'subscribe',
      category: 'cmd',
      csc: 'all',
      salindex: 'all',
      stream: 'all',
    });
    expect(getSubscriptions(store.getState())).toEqual([
      {
        groupName: 'telemetry-all-all-all',
        status: groupStates.SUBSCRIBED,
        confirmationMessage: "Successfully subscribed to telemetry-all-all-all",
      },
      {
        groupName: 'event-all-all-all',
        status: groupStates.SUBSCRIBED,
        confirmationMessage: "Successfully subscribed to event-all-all-all",
      },
      {
        groupName: 'cmd-all-all-all',
        status: groupStates.REQUESTING,
      },
    ]);
    // Server subscribes new group
    server.send({
      data: "Successfully subscribed to cmd-all-all-all"
    });
    expect(getSubscriptions(store.getState())).toEqual([
      {
        groupName: 'telemetry-all-all-all',
        status: groupStates.SUBSCRIBED,
        confirmationMessage: "Successfully subscribed to telemetry-all-all-all",
      },
      {
        groupName: 'event-all-all-all',
        status: groupStates.SUBSCRIBED,
        confirmationMessage: "Successfully subscribed to event-all-all-all",
      },
      {
        groupName: 'cmd-all-all-all',
        status: groupStates.SUBSCRIBED,
        confirmationMessage: "Successfully subscribed to cmd-all-all-all",
      },
    ]);
  });

  it('When the SUBSCRIPTIONS REMOVAL are REQUESTED, then the subscriptions state change to UNSUBSCRIBING, ' +
  'and when the server confirms each unsubscription, that subscription is removed',
  async () => {
    // Request remove group 1
    await store.dispatch(requestGroupSubscriptionRemoval('telemetry-all-all-all'));
    await expect(server).toReceiveMessage({
      option: 'unsubscribe',
      category: 'telemetry',
      csc: 'all',
      salindex: 'all',
      stream: 'all',
    });
    expect(getSubscriptions(store.getState())).toEqual([
      {
        groupName: 'telemetry-all-all-all',
        status: groupStates.UNSUBSCRIBING,
        confirmationMessage: "Successfully subscribed to telemetry-all-all-all",
      },
      {
        groupName: 'event-all-all-all',
        status: groupStates.SUBSCRIBED,
        confirmationMessage: "Successfully subscribed to event-all-all-all",
      },
    ]);
    // Server removes group 1
    server.send({
      data: "Successfully unsubscribed from telemetry-all-all-all"
    });
    expect(getSubscriptions(store.getState())).toEqual([
      {
        groupName: 'event-all-all-all',
        status: groupStates.SUBSCRIBED,
        confirmationMessage: "Successfully subscribed to event-all-all-all",
      },
    ]);

    // Request remove 2
    await store.dispatch(requestGroupSubscriptionRemoval('event-all-all-all'));
    await expect(server).toReceiveMessage({
      option: 'unsubscribe',
      category: 'event',
      csc: 'all',
      salindex: 'all',
      stream: 'all',
    });
    expect(getSubscriptions(store.getState())).toEqual([
      {
        groupName: 'event-all-all-all',
        status: groupStates.UNSUBSCRIBING,
        confirmationMessage: "Successfully subscribed to event-all-all-all",
      },
    ]);
    // Server removes 2
    server.send({
      data: "Successfully unsubscribed from event-all-all-all"
    });
    expect(getSubscriptions(store.getState())).toEqual([]);
  });

  it.only('When the SUBSCRIPTIONS REMOVAL are REQUESTED, then the subscriptions state change to UNSUBSCRIBING, ' +
  'and when SUBSCRIPTION is REQUESTED AGAIN before the  server confirms each unsubscription, ' +
  'the subscription changes to PENDING, its is REQUESTED AGAIN to the server and it is NOT REMOVED',
  async () => {
    // Request remove group 1
    await store.dispatch(requestGroupSubscriptionRemoval('telemetry-all-all-all'));
    await expect(server).toReceiveMessage({
      option: 'unsubscribe',
      category: 'telemetry',
      csc: 'all',
      salindex: 'all',
      stream: 'all',
    });
    expect(getSubscriptions(store.getState())).toEqual([
      {
        groupName: 'telemetry-all-all-all',
        status: groupStates.UNSUBSCRIBING,
        confirmationMessage: "Successfully subscribed to telemetry-all-all-all",
      },
      {
        groupName: 'event-all-all-all',
        status: groupStates.SUBSCRIBED,
        confirmationMessage: "Successfully subscribed to event-all-all-all",
      },
    ]);
    // Request subscribe to group 1 again
    await store.dispatch(addGroupSubscription('telemetry-all-all-all'));
    expect(getSubscriptions(store.getState())).toEqual([
      {
        groupName: 'telemetry-all-all-all',
        status: groupStates.PENDING,
        confirmationMessage: "Successfully subscribed to telemetry-all-all-all",
      },
      {
        groupName: 'event-all-all-all',
        status: groupStates.SUBSCRIBED,
        confirmationMessage: "Successfully subscribed to event-all-all-all",
      },
    ]);
    // Server removes group 1
    server.send({
      data: "Successfully unsubscribed from telemetry-all-all-all"
    });
    expect(getSubscriptions(store.getState())).toEqual([
      {
        groupName: 'telemetry-all-all-all',
        status: groupStates.PENDING,
        confirmationMessage: "Successfully subscribed to telemetry-all-all-all",
      },
      {
        groupName: 'event-all-all-all',
        status: groupStates.SUBSCRIBED,
        confirmationMessage: "Successfully subscribed to event-all-all-all",
      },
    ]);
  });

  it('When the CONNECTION is CLOSED, then the subscriptions are EMPTY',
  async () => {
    // Close connection
    await store.dispatch(closeWebsocketConnection());
    expect(getConnectionStatus(store.getState())).toEqual(connectionStates.CLOSED);
    expect(getSubscriptions(store.getState())).toEqual([]);
  });

  it('When the CONNECTION is RETRYING, then the subscriptions are PENDING',
  async () => {
    server.close({ code: 1003 });
    await server.closed;
    expect(getConnectionStatus(store.getState())).toEqual(connectionStates.RETRYING);
    expect(getSubscriptions(store.getState())).toEqual([
      {
        groupName: 'telemetry-all-all-all',
        status: groupStates.PENDING,
      },
      {
        groupName: 'event-all-all-all',
        status: groupStates.PENDING,
      },
    ]);
  });
});
