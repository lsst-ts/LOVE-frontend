import { createStore, applyMiddleware } from 'redux';
import WS from 'jest-websocket-mock';
import rootReducer from '../reducers';
import logger from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import {
  openWebsocketConnection,
  addGroupSubscription,
  requestSubscriptions,
  confirmSubscriptions,
  subscriptionsStates,
  groupStates,
  connectionStates,
} from '../actions/ws';
import { emptyToken, doReceiveToken } from '../actions/auth';
import {
  getAllTelemetries,
  getAllEvents,
  getToken,
  getSubscriptionsStatus,
  getSubscriptions,
  getConnectionStatus,
} from '../selectors';

let store, server;

// const promiseTimeout = function(ms, promise){
//   // Create a promise that rejects in <ms> milliseconds
//   let timeout = new Promise((resolve, reject) => {
//     let id = setTimeout(() => {
//       clearTimeout(id);
//       reject('Timed out in '+ ms + 'ms.')
//       promise.reject()
//     }, ms)
//   })
//
//   // Returns a race between our timeout and the passed in promise
//   return Promise.race([
//     promise,
//     timeout
//   ])
// };

beforeEach(async () => {
  store = createStore(rootReducer, applyMiddleware(thunkMiddleware));
  server = new WS('ws://localhost/manager/ws/subscription?token=love-token', { jsonProtocol: true });
});

afterEach(() => {
  WS.clean();
});

describe('Given the CONNECTION is CLOSED and the SUBSCRIPTIONS are EMPTY, ', () => {
  it('When a SUBSCRIPTION is DISPATCHED, then it is added to the list of subscriptions as PENDING', async () => {
    expect(getSubscriptionsStatus(store.getState())).toEqual(subscriptionsStates.EMPTY);
    // ACT
    await store.dispatch(addGroupSubscription('telemetry-all-all-all'));

    // ASSERT
    const subscriptionsStatus = getSubscriptionsStatus(store.getState());
    const subscriptions = getSubscriptions(store.getState());
    expect(subscriptionsStatus).toEqual(subscriptionsStates.PENDING);
    expect(subscriptions).toEqual([
      {
        groupName: 'telemetry-all-all-all',
        status: groupStates.PENDING,
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
    expect(getSubscriptionsStatus(store.getState())).toEqual(subscriptionsStates.PENDING);
  });

  it('When the SUBSCRIPTIONS are REQUESTED, then the subscriptions state changes to REQUESTING', async () => {
    // ACT
    await store.dispatch(requestSubscriptions());

    // ASSERT
    expect(getSubscriptionsStatus(store.getState())).toEqual(subscriptionsStates.REQUESTING);
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

  it('When the SUBSCRIPTIONS update is confirmed, then the subscriptions change to SUBSCRIBED', async () => {
    // ACT
    await store.dispatch(confirmSubscription(groupName));

    // ASSERT
    expect(getSubscriptionsStatus(store.getState())).toEqual(subscriptionsStates.REQUESTING);
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
