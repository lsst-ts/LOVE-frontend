import { createStore, applyMiddleware } from 'redux';
import WS from 'jest-websocket-mock';
import thunkMiddleware from 'redux-thunk';
import rootReducer from '../reducers';
import { doReceiveToken, emptyToken, doExpireToken, doRejectToken, doRequestRemoveToken } from '../actions/auth';
import {
  RESET_SUBS_PERIOD,
  connectionStates,
  groupStates,
  openWebsocketConnection,
  closeWebsocketConnection,
  addGroup,
  removeGroup,
  resetSubscriptions,
} from '../actions/ws';

import { getConnectionStatus, getSubscriptions } from '../selectors';

let store;
let server;

beforeEach(async () => {
  // ARRANGE
  store = createStore(rootReducer, applyMiddleware(thunkMiddleware));
  await store.dispatch(emptyToken);
  server = new WS('ws://localhost/manager/ws/subscription', { jsonProtocol: true });
  server.on('connection', (socket) => {
    const [, token] = socket.url.split('?token=');
    if (token !== 'love-token' && token !== 'swapped-token') {
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
  it('When a CONNECTION IS DISPACHED, then the connection remains CLOSED and the Server DID NOT CONNECT', async () => {
    // ACT
    await store.dispatch(openWebsocketConnection());

    // ASSERT
    expect(getConnectionStatus(store.getState())).not.toEqual(connectionStates.OPENING);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    expect(getConnectionStatus(store.getState())).toEqual(connectionStates.CLOSED);
  });

  it('When a CLOSE CONNECTION IS DISPACHED, then nothing happens', async () => {
    // ACT
    await store.dispatch(closeWebsocketConnection());

    // ASSERT
    expect(getConnectionStatus(store.getState())).not.toEqual(connectionStates.OPENING);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    expect(getConnectionStatus(store.getState())).toEqual(connectionStates.CLOSED);
  });

  it('When a correct token is RECEIVED, then the CONNECTION IS OPENING then OPEN', async () => {
    // ACT
    await store.dispatch(doReceiveToken('username', 'love-token', {}, 0));

    // ASSERT
    expect(getConnectionStatus(store.getState())).toEqual(connectionStates.OPENING);
    const connected = await server.connected;
    expect(connected.readyState).toEqual(WebSocket.OPEN);
    expect(getConnectionStatus(store.getState())).toEqual(connectionStates.OPEN);
  });

  it(`When an incorrect token is RECEIVED, then the connection is OPENING
    and then CLOSED and Server DID NOT CONNECT`, async () => {
    // ACT
    await store.dispatch(doReceiveToken('username', 'love-wrong-token', {}, 0));

    // ASSERT
    expect(getConnectionStatus(store.getState())).toEqual(connectionStates.OPENING);
    await server.closed;
    expect(getConnectionStatus(store.getState())).toEqual(connectionStates.CLOSED);
  });

  it(`When a correct token is RECEIVED but the server sends an ERROR,
    then connection goes to OPENING and RETRYING`, async () => {
    // ARRANGE
    server.on('connection', (socket) => {
      socket.close({ wasClean: false, code: 1003, reason: 'NOPE' });
    });
    await store.dispatch(doReceiveToken('username', 'love-token', {}, 0));
    expect(getConnectionStatus(store.getState())).toEqual(connectionStates.OPENING);
    await server.connected;
    expect(getConnectionStatus(store.getState())).toEqual(connectionStates.OPEN);

    // ACT
    await server.closed;

    // ASSERT
    expect(getConnectionStatus(store.getState())).toEqual(connectionStates.RETRYING);
  });

  it(`When a token is RECEIVED but the server closes the connection with a 1000 code,
    then connection is CLOSED`, async () => {
    // ARRANGE
    let disconnected = false;
    server.on('close', (/* _socket */) => {
      disconnected = true;
    });
    expect(getConnectionStatus(store.getState())).toEqual(connectionStates.CLOSED);
    await store.dispatch(doReceiveToken('username', 'love-token', {}, 0));
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
    await store.dispatch(doReceiveToken('username', 'love-token', {}, 0));
    await server.connected;
  });

  it(`When a CLOSE CONNECTION is dispatched, then connection goes to CLOSED,
    and the connection is closed`, async () => {
    // ARRANGE
    let disconnected = false;
    server.on('close', (/* _socket */) => {
      disconnected = true;
    });
    // Assert connection is open before
    expect(getConnectionStatus(store.getState())).toEqual(connectionStates.OPEN);

    // ACT
    await store.dispatch(closeWebsocketConnection());

    // ASSERT
    expect(getConnectionStatus(store.getState())).toEqual(connectionStates.CLOSED);
    await server.closed;
    expect(disconnected).toBe(true);
  });

  it('When a EXPIRE TOKEN is dispatched, then connection goes to CLOSED, and the connection is closed', async () => {
    // ARRANGE
    let disconnected = false;
    server.on('close', (/* _socket */) => {
      disconnected = true;
    });
    // Assert connection is open before
    expect(getConnectionStatus(store.getState())).toEqual(connectionStates.OPEN);

    // ACT
    await store.dispatch(doExpireToken());

    // ASSERT
    expect(getConnectionStatus(store.getState())).toEqual(connectionStates.CLOSED);
    await server.closed;
    expect(disconnected).toBe(true);
  });

  it('When a REJECT TOKEN is dispatched, then connection goes to CLOSED, and the connection is closed', async () => {
    // ARRANGE
    let disconnected = false;
    server.on('close', (/* _socket */) => {
      disconnected = true;
    });
    // Assert connection is open before
    expect(getConnectionStatus(store.getState())).toEqual(connectionStates.OPEN);

    // ACT
    await store.dispatch(doRejectToken());

    // ASSERT
    expect(getConnectionStatus(store.getState())).toEqual(connectionStates.CLOSED);
    await server.closed;
    expect(disconnected).toBe(true);
  });

  it('When a REQUEST REMOVE TOKEN is dispatched, then NOTHING HAPPENS', async () => {
    // ARRANGE
    let disconnected = false;
    server.on('close', (/* _socket */) => {
      disconnected = true;
    });
    // Assert connection is open before
    expect(getConnectionStatus(store.getState())).toEqual(connectionStates.OPEN);

    // ACT
    await store.dispatch(doRequestRemoveToken());

    // ASSERT
    expect(getConnectionStatus(store.getState())).toEqual(connectionStates.CLOSED);
    await server.closed;
    expect(disconnected).toBe(true);
  });

  it('When an OPEN CONNECTION is dispatched, then NOTHING HAPPENS', async () => {
    // ARRANGE
    let reconnected = false;
    server.on('connection', (/* _socket */) => {
      reconnected = true;
    });
    // Assert connection is open before
    expect(getConnectionStatus(store.getState())).toEqual(connectionStates.OPEN);

    // ACT
    await store.dispatch(openWebsocketConnection());

    // ASSERT
    expect(getConnectionStatus(store.getState())).toEqual(connectionStates.OPEN);
    expect(reconnected).toBe(false);
  });

  it('When we RECEIVE A NEW TOKEN, then we DISCONNECT and RECONNECT again with the new token', async () => {
    let disconnected = false;
    server.on('close', (/* _socket */) => {
      disconnected = true;
    });
    // ACT:
    await store.dispatch(doReceiveToken('new-username', 'swapped-token', {}, 0));
    // ASSERT:
    expect(getConnectionStatus(store.getState())).toEqual(connectionStates.OPENING);
    await server.closed;
    expect(disconnected).toEqual(true);
    expect(getConnectionStatus(store.getState())).toEqual(connectionStates.OPEN);
  });

  it('When we RECEIVE THE SAME TOKEN, then we NO NOT DISCONNECT', async () => {
    let disconnected = false;
    server.on('close', (/* _socket */) => {
      disconnected = true;
    });
    // ACT:
    // console.log('before: ', getConnectionStatus(store.getState()));
    await store.dispatch(doReceiveToken('new-username', 'love-token', {}, 0));
    // ASSERT:
    expect(getConnectionStatus(store.getState())).toEqual(connectionStates.OPEN);
    expect(disconnected).toEqual(false);
  });
});

// TEST SUBSCRIPTIONS AND HOW THEY INTERACT WITH CONNECTION
describe('Given the CONNECTION is CLOSED and the SUBSCRIPTIONS are EMPTY, ', () => {
  it('When a SUBSCRIPTION is DISPATCHED, then it is added to the list of subscriptions as PENDING', async () => {
    expect(getSubscriptions(store.getState())).toEqual([]);
    // ACT
    await store.dispatch(addGroup('telemetry-all-all-all'));

    // ASSERT
    const subscriptions = getSubscriptions(store.getState());
    expect(subscriptions).toEqual([
      {
        groupName: 'telemetry-all-all-all',
        status: groupStates.PENDING,
        counter: 1,
      },
    ]);
  });
});

describe('Given the CONNECTION is CLOSED and there are PENDING SUBSCRIPTIONS, ', () => {
  beforeEach(async () => {
    await store.dispatch(addGroup('telemetry-all-all-all'));
    await store.dispatch(addGroup('event-all-all-all'));
  });

  it(
    'When the CONNECTION is OPEN, then the subscriptions state change to REQUESTING, ' +
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
          counter: 1,
          status: groupStates.REQUESTING,
        },
        {
          groupName: 'event-all-all-all',
          counter: 1,
          status: groupStates.REQUESTING,
        },
      ]);

      // Server confirms group 1
      server.send({
        data: 'Successfully subscribed to telemetry-all-all-all',
      });
      expect(getSubscriptions(store.getState())).toEqual([
        {
          groupName: 'telemetry-all-all-all',
          status: groupStates.SUBSCRIBED,
          counter: 1,
          confirmationMessage: 'Successfully subscribed to telemetry-all-all-all',
        },
        {
          groupName: 'event-all-all-all',
          counter: 1,
          status: groupStates.REQUESTING,
        },
      ]);

      // Server confirms group 2
      server.send({
        data: 'Successfully subscribed to event-all-all-all',
      });
      expect(getSubscriptions(store.getState())).toEqual([
        {
          groupName: 'telemetry-all-all-all',
          status: groupStates.SUBSCRIBED,
          counter: 1,
          confirmationMessage: 'Successfully subscribed to telemetry-all-all-all',
        },
        {
          groupName: 'event-all-all-all',
          status: groupStates.SUBSCRIBED,
          counter: 1,
          confirmationMessage: 'Successfully subscribed to event-all-all-all',
        },
      ]);
    },
  );
});

// TEST SUBSCRIPTIONS
describe('Given the CONNECTION is OPEN and there are SUBSCRIBED GROUPS, ', () => {
  beforeEach(async () => {
    await store.dispatch(doReceiveToken('username', 'love-token', {}, 0));
    await store.dispatch(addGroup('telemetry-all-all-all'));
    await store.dispatch(addGroup('event-all-all-all'));
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
      data: 'Successfully subscribed to telemetry-all-all-all',
    });
    server.send({
      data: 'Successfully subscribed to event-all-all-all',
    });
  });

  it('When the CONNECTION is RETRYING, then the subscriptions are PENDING', async () => {
    server.close({ code: 1003 });
    await server.closed;
    expect(getConnectionStatus(store.getState())).toEqual(connectionStates.RETRYING);
    expect(getSubscriptions(store.getState())).toEqual([
      {
        groupName: 'telemetry-all-all-all',
        counter: 1,
        status: groupStates.PENDING,
      },
      {
        groupName: 'event-all-all-all',
        counter: 1,
        status: groupStates.PENDING,
      },
    ]);
  });

  it(
    'When the subscriptions are reset their state change to REQUESTING and send subscription messages to the server,' +
      'and when the server confirms each unsubscription, that subscription is re-added',
    async () => {
      // Add new group
      await store.dispatch(resetSubscriptions(getSubscriptions(store.getState())));
      expect(getSubscriptions(store.getState())).toEqual([
        {
          groupName: 'telemetry-all-all-all',
          status: groupStates.REQUESTING,
          counter: 1,
          confirmationMessage: undefined,
        },
        {
          groupName: 'event-all-all-all',
          status: groupStates.REQUESTING,
          counter: 1,
          confirmationMessage: undefined,
        },
      ]);
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
      // Server subscribes the groups
      server.send({
        data: 'Successfully subscribed to telemetry-all-all-all',
      });
      server.send({
        data: 'Successfully subscribed to event-all-all-all',
      });
      expect(getSubscriptions(store.getState())).toEqual([
        {
          groupName: 'telemetry-all-all-all',
          status: groupStates.SUBSCRIBED,
          counter: 1,
          confirmationMessage: 'Successfully subscribed to telemetry-all-all-all',
        },
        {
          groupName: 'event-all-all-all',
          status: groupStates.SUBSCRIBED,
          counter: 1,
          confirmationMessage: 'Successfully subscribed to event-all-all-all',
        },
      ]);
    },
  );

  it(
    'When a new GROUP IS ADDED, then the subscriptions state change to PENDING and then REQUESTING, ' +
      'and when the server confirms each unsubscription, that subscription is removed',
    async () => {
      // Add new group
      await store.dispatch(addGroup('cmd-all-all-all'));
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
          counter: 1,
          confirmationMessage: 'Successfully subscribed to telemetry-all-all-all',
        },
        {
          groupName: 'event-all-all-all',
          status: groupStates.SUBSCRIBED,
          counter: 1,
          confirmationMessage: 'Successfully subscribed to event-all-all-all',
        },
        {
          groupName: 'cmd-all-all-all',
          counter: 1,
          status: groupStates.REQUESTING,
        },
      ]);
      // Server subscribes new group
      server.send({
        data: 'Successfully subscribed to cmd-all-all-all',
      });
      expect(getSubscriptions(store.getState())).toEqual([
        {
          groupName: 'telemetry-all-all-all',
          status: groupStates.SUBSCRIBED,
          counter: 1,
          confirmationMessage: 'Successfully subscribed to telemetry-all-all-all',
        },
        {
          groupName: 'event-all-all-all',
          status: groupStates.SUBSCRIBED,
          counter: 1,
          confirmationMessage: 'Successfully subscribed to event-all-all-all',
        },
        {
          groupName: 'cmd-all-all-all',
          status: groupStates.SUBSCRIBED,
          counter: 1,
          confirmationMessage: 'Successfully subscribed to cmd-all-all-all',
        },
      ]);
    },
  );

  it(
    'When the SUBSCRIPTIONS REMOVAL are REQUESTED, then the subscriptions state change to UNSUBSCRIBING, ' +
      'and when the server confirms each unsubscription, that subscription is removed',
    async () => {
      // Request remove group 1
      await store.dispatch(removeGroup('telemetry-all-all-all'));
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
          counter: 0,
          confirmationMessage: 'Successfully subscribed to telemetry-all-all-all',
        },
        {
          groupName: 'event-all-all-all',
          status: groupStates.SUBSCRIBED,
          counter: 1,
          confirmationMessage: 'Successfully subscribed to event-all-all-all',
        },
      ]);
      // Server removes group 1
      server.send({
        data: 'Successfully unsubscribed from telemetry-all-all-all',
      });
      expect(getSubscriptions(store.getState())).toEqual([
        {
          groupName: 'event-all-all-all',
          status: groupStates.SUBSCRIBED,
          counter: 1,
          confirmationMessage: 'Successfully subscribed to event-all-all-all',
        },
      ]);

      // Request remove 2
      await store.dispatch(removeGroup('event-all-all-all'));
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
          counter: 0,
          confirmationMessage: 'Successfully subscribed to event-all-all-all',
        },
      ]);
      // Server removes 2
      server.send({
        data: 'Successfully unsubscribed from event-all-all-all',
      });
      expect(getSubscriptions(store.getState())).toEqual([]);
    },
  );

  it(`When the SUBSCRIPTIONS REMOVAL are REQUESTED, then the subscriptions state change to UNSUBSCRIBING,
    and when SUBSCRIPTION is REQUESTED AGAIN before the  server confirms each unsubscription,
    then the subscription is REQUESTING and then SUBSCRIBED
    (when unsubscription is processed before resubscription)`, async () => {
    // Request remove group 1
    await store.dispatch(removeGroup('telemetry-all-all-all'));
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
        counter: 0,
        confirmationMessage: 'Successfully subscribed to telemetry-all-all-all',
      },
      {
        groupName: 'event-all-all-all',
        status: groupStates.SUBSCRIBED,
        counter: 1,
        confirmationMessage: 'Successfully subscribed to event-all-all-all',
      },
    ]);
    // Request subscribe to group 1 again
    await store.dispatch(addGroup('telemetry-all-all-all'));
    expect(getSubscriptions(store.getState())).toEqual([
      {
        groupName: 'telemetry-all-all-all',
        status: groupStates.REQUESTING,
        counter: 1,
        confirmationMessage: 'Successfully subscribed to telemetry-all-all-all',
      },
      {
        groupName: 'event-all-all-all',
        status: groupStates.SUBSCRIBED,
        counter: 1,
        confirmationMessage: 'Successfully subscribed to event-all-all-all',
      },
    ]);
    // Server removes group 1
    server.send({
      data: 'Successfully unsubscribed from telemetry-all-all-all',
    });
    expect(getSubscriptions(store.getState())).toEqual([
      {
        groupName: 'telemetry-all-all-all',
        status: groupStates.REQUESTING,
        counter: 1,
        confirmationMessage: 'Successfully subscribed to telemetry-all-all-all',
      },
      {
        groupName: 'event-all-all-all',
        status: groupStates.SUBSCRIBED,
        counter: 1,
        confirmationMessage: 'Successfully subscribed to event-all-all-all',
      },
    ]);
    // Server subscribes group 1
    server.send({
      data: 'Successfully subscribed to telemetry-all-all-all',
    });
    expect(getSubscriptions(store.getState())).toEqual([
      {
        groupName: 'telemetry-all-all-all',
        status: groupStates.SUBSCRIBED,
        counter: 1,
        confirmationMessage: 'Successfully subscribed to telemetry-all-all-all',
      },
      {
        groupName: 'event-all-all-all',
        status: groupStates.SUBSCRIBED,
        counter: 1,
        confirmationMessage: 'Successfully subscribed to event-all-all-all',
      },
    ]);
  });

  it(
    'When the SUBSCRIPTIONS REMOVAL are REQUESTED, then the subscriptions state change to UNSUBSCRIBING, ' +
      'and when SUBSCRIPTION is REQUESTED AGAIN before the  server confirms each unsubscription, ' +
      'then the subscription is REQUESTING and then SUBSCRIBED (when unsubscription is processed after resubscription)',
    async () => {
      // Request remove group 1
      await store.dispatch(removeGroup('telemetry-all-all-all'));
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
          counter: 0,
          confirmationMessage: 'Successfully subscribed to telemetry-all-all-all',
        },
        {
          groupName: 'event-all-all-all',
          status: groupStates.SUBSCRIBED,
          counter: 1,
          confirmationMessage: 'Successfully subscribed to event-all-all-all',
        },
      ]);
      // Request subscribe to group 1 again
      await store.dispatch(addGroup('telemetry-all-all-all'));
      expect(getSubscriptions(store.getState())).toEqual([
        {
          groupName: 'telemetry-all-all-all',
          status: groupStates.REQUESTING,
          counter: 1,
          confirmationMessage: 'Successfully subscribed to telemetry-all-all-all',
        },
        {
          groupName: 'event-all-all-all',
          status: groupStates.SUBSCRIBED,
          counter: 1,
          confirmationMessage: 'Successfully subscribed to event-all-all-all',
        },
      ]);
      // Server subscribes group 1
      server.send({
        data: 'Successfully subscribed to telemetry-all-all-all',
      });
      expect(getSubscriptions(store.getState())).toEqual([
        {
          groupName: 'telemetry-all-all-all',
          status: groupStates.SUBSCRIBED,
          counter: 1,
          confirmationMessage: 'Successfully subscribed to telemetry-all-all-all',
        },
        {
          groupName: 'event-all-all-all',
          status: groupStates.SUBSCRIBED,
          counter: 1,
          confirmationMessage: 'Successfully subscribed to event-all-all-all',
        },
      ]);
      // Server removes group 1
      server.send({
        data: 'Successfully unsubscribed from telemetry-all-all-all',
      });
      expect(getSubscriptions(store.getState())).toEqual([
        {
          groupName: 'telemetry-all-all-all',
          status: groupStates.SUBSCRIBED,
          counter: 1,
          confirmationMessage: 'Successfully subscribed to telemetry-all-all-all',
        },
        {
          groupName: 'event-all-all-all',
          status: groupStates.SUBSCRIBED,
          counter: 1,
          confirmationMessage: 'Successfully subscribed to event-all-all-all',
        },
      ]);
    },
  );

  it('When the CONNECTION is CLOSED, then the subscriptions are PENDING (or REQUESTING)', async () => {
    // Close connection
    await store.dispatch(closeWebsocketConnection());
    expect(getConnectionStatus(store.getState())).toEqual(connectionStates.CLOSED);
    expect(getSubscriptions(store.getState())).toEqual([
      {
        groupName: 'telemetry-all-all-all',
        status: groupStates.REQUESTING,
        counter: 1,
        confirmationMessage: undefined,
      },
      {
        groupName: 'event-all-all-all',
        status: groupStates.REQUESTING,
        counter: 1,
        confirmationMessage: undefined,
      },
    ]);
  });

  it('The server closes the connection with a 1000 code, then connection is CLOSED', async () => {
    // ARRANGE
    let disconnected = false;
    server.on('close', (/* _socket */) => {
      disconnected = true;
    });
    // Assert connection is open before
    expect(getConnectionStatus(store.getState())).toEqual(connectionStates.OPEN);

    // ACT
    server.close({ code: 1000 });

    // ASSERT
    expect(getConnectionStatus(store.getState())).toEqual(connectionStates.CLOSED);
    expect(getSubscriptions(store.getState())).toEqual([
      {
        groupName: 'telemetry-all-all-all',
        counter: 1,
        status: groupStates.PENDING,
      },
      {
        groupName: 'event-all-all-all',
        counter: 1,
        status: groupStates.PENDING,
      },
    ]);
    expect(disconnected).toBe(true);
    await server.closed;
  });
});

// TEST SUBSCRIPTIONS RESET
describe('Given the CONNECTION is OPEN and there are SUBSCRIBED GROUPS, ', () => {
  beforeEach(async () => {
    await store.dispatch(doReceiveToken('username', 'love-token', {}, 0));
    await store.dispatch(addGroup('telemetry-all-all-all'));
    await store.dispatch(addGroup('event-all-all-all'));
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
      data: 'Successfully subscribed to telemetry-all-all-all',
    });
    server.send({
      data: 'Successfully subscribed to event-all-all-all',
    });
    expect(getSubscriptions(store.getState())).toEqual([
      {
        groupName: 'telemetry-all-all-all',
        status: groupStates.SUBSCRIBED,
        counter: 1,
        confirmationMessage: 'Successfully subscribed to telemetry-all-all-all',
      },
      {
        groupName: 'event-all-all-all',
        status: groupStates.SUBSCRIBED,
        counter: 1,
        confirmationMessage: 'Successfully subscribed to event-all-all-all',
      },
    ]);
  });

  it('RESET_SUBS_PERIOD time after resetting subscriptions the subscriptions are reset again', async () => {
    jest.useFakeTimers();
    jest.spyOn(global, 'clearInterval');
    jest.spyOn(global, 'setInterval');
    expect(clearInterval).toHaveBeenCalledTimes(0);
    expect(setInterval).toHaveBeenCalledTimes(0);

    // Reset subscriptions and assert timers were started and subscriptions reset
    await store.dispatch(resetSubscriptions());
    expect(clearInterval).toHaveBeenCalledTimes(1);
    expect(setInterval).toHaveBeenCalledTimes(1);
    expect(getSubscriptions(store.getState())).toEqual([
      {
        groupName: 'telemetry-all-all-all',
        status: groupStates.REQUESTING,
        counter: 1,
        confirmationMessage: undefined,
      },
      {
        groupName: 'event-all-all-all',
        status: groupStates.REQUESTING,
        counter: 1,
        confirmationMessage: undefined,
      },
    ]);
    // After RESET_SUBS_PERIOD the timer should have been cleared and reset
    jest.advanceTimersByTime(RESET_SUBS_PERIOD + 100);
    expect(clearInterval).toHaveBeenCalledTimes(2);
    expect(setInterval).toHaveBeenCalledTimes(2);
  });
});
