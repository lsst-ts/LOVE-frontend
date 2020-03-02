import { createStore, applyMiddleware } from 'redux';
import WS from 'jest-websocket-mock';
import rootReducer from '../reducers';
import logger from 'redux-logger'
import thunkMiddleware from 'redux-thunk';
import { openWebsocketConnection, requestGroupSubscription } from '../actions/ws';
import { emptyToken } from '../actions/auth';
import {
  getAllTelemetries,
  getAllEvents,
  getToken,
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
  // prevent fetch call for token
  localStorage.setItem('LOVE-TOKEN', 'love-token');
});

afterEach(() => {
  console.log('closing')
  WS.clean();
});

describe('Test subscription to Telemetries and Events', () => {
  beforeEach(async () => {
    await store.dispatch(openWebsocketConnection());
    await server.connected;
  });

  it('Should save all telemetries when subscribed to all', async () => {
    console.log('start 1');
    // ACT
    await store.dispatch(requestGroupSubscription('telemetry-all-all-all'));
    let msg = {
      category: 'telemetry',
      data: [
        {
          csc: 'ATDome',
          salindex: 1,
          data: {
            param1: 1234,
          },
        },
      ],
    };
    server.send(msg);
    msg.data[0].csc = 'ATMCS';
    server.send(msg);
    // ASSERT
    const expected = {
      'ATDome-1': {
        param1: 1234,
      },
      'ATMCS-1': {
        param1: 1234,
      },
    };
    const result = getAllTelemetries(store.getState());
    expect(result).toEqual(expected);
    console.log('end 1');

  });

  it('Should save all events when subscribed to all', async () => {
    // ACT
    console.log('start 2');
    await store.dispatch(requestGroupSubscription('event-all-all-all'));
    let msg = {
      category: 'event',
      data: [
        {
          csc: 'ATDome',
          salindex: 1,
          data: {
            param1: 1234,
          },
        },
      ],
    };
    server.send(msg);
    msg.data[0].csc = 'ATMCS';
    server.send(msg);
    // ASSERT
    const expected = {
      'ATDome-1': {
        param1: 1234,
      },
      'ATMCS-1': {
        param1: 1234,
      },
    };
    const result = getAllEvents(store.getState());
    expect(result).toEqual(expected);
    console.log('end 2');
  });
});

describe('Test websocket connection', () => {
  beforeEach(async () => {
    // prevent fetch call for token
    // localStorage.removeItem('LOVE-TOKEN')
  });

  it('GIVEN there is no token, WHEN a subscription is attempted, THEN the connection is not established', async () => {
    // Arrange
    console.log('start 3');
    // await server.closed
    // let server2 = new WS('ws://localhost/manager/ws/subscription?token=love-token', { jsonProtocol: true });

    // await store.dispatch(emptyToken);
    console.log('token in redux: ', getToken(store.getState()));
    let connectionAttempted = false;
    server.on('connection', socket => {
      console.log('server connecting, socket: ', socket)
      connectionAttempted = true;
    });
    server.on('close', socket => {
      console.log('server closing connection, socket: ', socket)
      connectionAttempted = true;
    });
    // Act
    await store.dispatch(requestGroupSubscription('telemetry-all-all-all'));
    // Assert
    await new Promise(resolve => setTimeout(resolve, 2000));
    expect(connectionAttempted).toBeFalsy();
    console.log('emd 3');
  });
});
