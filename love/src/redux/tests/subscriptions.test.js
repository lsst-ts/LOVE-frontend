import { createStore, applyMiddleware } from 'redux';
import WS from 'jest-websocket-mock';
import rootReducer from '../reducers';
import thunkMiddleware from 'redux-thunk';
import { openWebsocketConnection, requestGroupSubscription } from '../actions/ws';
import {
  getAllTelemetries,
  getAllEvents,
} from '../selectors';

let store, server;

beforeEach(async () => {
  store = createStore(rootReducer, applyMiddleware(thunkMiddleware));
  // prevent fetch call for token
  localStorage.setItem('LOVE-TOKEN', 'love-token');
  server = new WS('ws://localhost/manager/ws/subscription?token=love-token', { jsonProtocol: true });
  await store.dispatch(openWebsocketConnection());
});

afterEach(() => {
  server.close();
});

it('Should save all telemetries when subscribed to all', async () => {
  await server.connected;
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
});

it('Should save all events when subscribed to all', async () => {
  await server.connected;
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
});
