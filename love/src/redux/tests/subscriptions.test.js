import { createStore, applyMiddleware } from 'redux';
import WS from 'jest-websocket-mock';
import rootReducer from '../reducers';
import thunkMiddleware from 'redux-thunk';
import {
  connectionStates,
  groupStates,
  openWebsocketConnection,
  addGroupSubscription,
  requestSubscriptions,
  requestGroupSubscriptionRemoval,
} from '../actions/ws';
import { emptyToken, doReceiveToken } from '../actions/auth';
import {
  getAllTelemetries,
  getAllEvents,
  getSubscriptions,
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

describe('Given the CONNECTION is CLOSED and the tere are PENDING SUBSCRIPTIONS, ', () => {
  beforeEach(async () => {
    await store.dispatch(addGroupSubscription('telemetry-all-all-all'));
    await store.dispatch(addGroupSubscription('event-all-all-all'));
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

  it('When the CONNECTION is OPEN, then the subscriptions state change to REQUESTING', async () => {
    // ACT
    await store.dispatch(doReceiveToken('username', 'love-token', {}, 0));
    await store.dispatch(openWebsocketConnection());
    await server.connected;
    expect(getConnectionStatus(store.getState())).toEqual(connectionStates.OPEN);

    // ASSERT
    const subscriptions = getSubscriptions(store.getState());
    expect(subscriptions).toEqual([
      {
        groupName: 'telemetry-all-all-all',
        status: groupStates.REQUESTING,
      },
      {
        groupName: 'event-all-all-all',
        status: groupStates.REQUESTING,
      },
    ]);
  });
});

describe('Given the CONNECTION is OPEN and there are PENDING SUBSCRIPTIONS, ', () => {
  beforeEach(async () => {
    await store.dispatch(doReceiveToken('username', 'love-token', {}, 0));
    await store.dispatch(openWebsocketConnection());
    await store.dispatch(addGroupSubscription('telemetry-all-all-all'));
    await store.dispatch(addGroupSubscription('event-all-all-all'));
    await server.connected;
    expect(getConnectionStatus(store.getState())).toEqual(connectionStates.OPEN);
  });

  it('When the SUBSCRIPTIONS are REQUESTED, then the subscriptions state change to REQUESTING, ' +
  'and when the server confirms each subscription, that subscription is updated',
  async () => {
    // Request Subscriptions
    await store.dispatch(requestSubscriptions());
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

describe('Given the CONNECTION is OPEN and there are SUBSCRIBED GROUPS, ', () => {
  beforeEach(async () => {
    await store.dispatch(doReceiveToken('username', 'love-token', {}, 0));
    await store.dispatch(openWebsocketConnection());
    await store.dispatch(addGroupSubscription('telemetry-all-all-all'));
    await store.dispatch(addGroupSubscription('event-all-all-all'));
    await server.connected;
    server.send({
      data: "Successfully subscribed to telemetry-all-all-all"
    });
    server.send({
      data: "Successfully subscribed to event-all-all-all"
    });
  });

  it('When the SUBSCRIPTIONS REMOVAL are REQUESTED, then the subscriptions state change to UNSUBSCRIBING, ' +
  'and when the server confirms each unsubscription, that subscription is removed',
  async () => {
    // Request remove group 1
    await store.dispatch(requestGroupSubscriptionRemoval('telemetry-all-all-all'));
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
});

//   it('Should save all events when subscribed to all', async () => {
//     // ACT
//     console.log('start 2');
//     await store.dispatch(requestGroupSubscription('event-all-all-all'));
//     let msg = {
//       category: 'event',
//       data: [
//         {
//           csc: 'ATDome',
//           salindex: 1,
//           data: {
//             param1: 1234,
//           },
//         },
//       ],
//     };
//     server.send(msg);
//     msg.data[0].csc = 'ATMCS';
//     server.send(msg);
//     // ASSERT
//     const subscriptionsStatus = getSubscriptionsStatus(store.getState());
//     const subscriptions = getSubscriptions(store.getState());
//     expect(subscriptionsStatus).toEqual(subscriptionsStates.NEED_SUBSCRIPTION);
//     expect(subscriptions).toEqual(['event-all-all-all']);
//   });
// });
//
// describe('Test websocket connection', () => {
//   beforeEach(async () => {
//     // prevent fetch call for token
//     // localStorage.removeItem('LOVE-TOKEN')
//   });
//
//   it('GIVEN there is no token, WHEN a subscription is attempted, THEN the connection is not established', async () => {
//     // Arrange
//     console.log('start 3');
//     // await server.closed
//     // let server2 = new WS('ws://localhost/manager/ws/subscription?token=love-token', { jsonProtocol: true });
//
//     // await store.dispatch(emptyToken);
//     console.log('token in redux: ', getToken(store.getState()));
//     let connectionAttempted = false;
//     server.on('connection', socket => {
//       console.log('server connecting, socket: ', socket)
//       connectionAttempted = true;
//     });
//     server.on('close', socket => {
//       console.log('server closing connection, socket: ', socket)
//       connectionAttempted = true;
//     });
//     // Act
//     await store.dispatch(requestGroupSubscription('telemetry-all-all-all'));
//     // Assert
//     await new Promise(resolve => setTimeout(resolve, 2000));
//     expect(connectionAttempted).toBeFalsy();
//     console.log('emd 3');
//   });
