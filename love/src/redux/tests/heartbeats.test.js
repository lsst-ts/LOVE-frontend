import { createStore, applyMiddleware } from 'redux';
import WS from 'jest-websocket-mock';
import rootReducer from '../reducers';
import thunkMiddleware from 'redux-thunk';
import { openWebsocketConnection, requestGroupSubscription, requestGroupSubscriptionRemoval } from '../actions/ws';
import { getLastManagerHeartbeat } from '../selectors';

let store, server;

const managerHeartbeats = [
  {
    category: 'heartbeat',
    data: [{ csc: 'manager', salindex: 0, data: { timestamp: 1582141499.626869 } }],
    subscription: 'heartbeat',
  },
  {
    category: 'heartbeat',
    data: [{ csc: 'manager', salindex: 0, data: { timestamp: 1692141499.626869 } }],
    subscription: 'heartbeat',
  },
];

afterEach(() => {
  server.close();
});

describe('GIVEN are not subscribed to the manager heartbeat', () => {
  // Arrange:
  beforeEach(async () => {
    store = createStore(rootReducer, applyMiddleware(thunkMiddleware));
    // prevent fetch call for token
    localStorage.setItem('LOVE-TOKEN', 'love-token');
    server = new WS('ws://localhost/manager/ws/subscription?token=love-token', { jsonProtocol: true });
    await store.dispatch(openWebsocketConnection());
    await server.connected;
  });

  describe('WHEN we query for the last heartbeat received', () => {
    it('THEN we get undefined ', async () => {
      // Arrange:
      const lastManagerHeartbeat = getLastManagerHeartbeat(store);
      // Assert:
      expect(lastManagerHeartbeat).toEqual(undefined);
    });
  });
});

describe('GIVEN we are subscribed to the manager heartbeat', () => {
  // Arrange:
  beforeEach(async () => {
    store = createStore(rootReducer, applyMiddleware(thunkMiddleware));
    // prevent fetch call for token
    localStorage.setItem('LOVE-TOKEN', 'love-token');
    server = new WS('ws://localhost/manager/ws/subscription?token=love-token', { jsonProtocol: true });
    await store.dispatch(openWebsocketConnection());
    await store.dispatch(requestGroupSubscription('heartbeat-manager-0-stream'));
    await server.connected;
  });

  describe('WHEN we receive a heartbeat', () => {
    it('THEN we store it the state ', async () => {
      // Arrange:
      await server.send(managerHeartbeats[0]);
      const lastManagerHeartbeat = getLastManagerHeartbeat(store.getState());
      // Assert:
      expect(lastManagerHeartbeat).toEqual(managerHeartbeats[0].data[0]);
    });
  });

  describe('WHEN we receive 2 heartbeats', () => {
    it('THEN we store the last one ', async () => {
      // Arrange:
      await server.send(managerHeartbeats[0]);
      await server.send(managerHeartbeats[1]);
      const lastManagerHeartbeat = getLastManagerHeartbeat(store.getState());
      // Assert:
      expect(lastManagerHeartbeat).toEqual(managerHeartbeats[1].data[0]);
    });
  });

  describe('WHEN we lose server connection', () => {
    it('THEN we dont receive new heartbeats ', async () => {
      // Arrange:
      await server.send(managerHeartbeats[0]);
      server.close();
      await server.send(managerHeartbeats[1]);
      const lastManagerHeartbeat = getLastManagerHeartbeat(store.getState());
      // Assert:
      expect(lastManagerHeartbeat).toEqual(managerHeartbeats[0].data[0]);
    });
  });
});
