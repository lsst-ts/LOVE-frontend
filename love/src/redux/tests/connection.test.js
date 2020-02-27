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

// let store, server;

it('Should save all events when subscribed to all', async () => {
  const store = createStore(rootReducer, applyMiddleware(thunkMiddleware));
  const server = new WS('ws://localhost/manager/ws/subscription?token=love-token', { jsonProtocol: true });
  localStorage.setItem('LOVE-TOKEN', 'love-token');
  await store.dispatch(openWebsocketConnection());
  await server.connected;
  // prevent fetch call for token



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


  console.log('closing')
  WS.clean();
});


it('GIVEN there is no token, WHEN a subscription is attempted, THEN the connection is not established', async () => {
  const store = createStore(rootReducer, applyMiddleware(thunkMiddleware));
  const server = new WS('ws://localhost/manager/ws/subscription?token=love-token2', { jsonProtocol: true });
  // prevent fetch call for token
  localStorage.setItem('LOVE-TOKEN', 'love-token2');



  // Arrange
  console.log('start 3');

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
  console.log('emd 3',connectionAttempted);


  console.log('closing')
  WS.clean();
});
