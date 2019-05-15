import { getStreamData } from './selectors';
import { createStore, applyMiddleware } from 'redux';
import rootReducer from './reducers';
import WS from 'jest-websocket-mock';
import { openWebsocketConnection, requestGroupSubscription } from './actions/ws';
import thunkMiddleware from 'redux-thunk';
import logger from 'redux-logger';

let store, server;
beforeEach(() => {
  store = createStore(rootReducer, applyMiddleware(thunkMiddleware));
  localStorage.setItem('LOVE-TOKEN', '"love-token"');
  server = new WS('ws://localhost/manager/ws/subscription?token=love-token', { jsonProtocol: true });
});

afterEach(() => {
  localStorage.removeItem('LOVE-TOKEN');
});

it('Should extract the stream correctly with a selector', async () => {
  // Arrange
  const data = {
    Environment: {
      airPressure: {
        paAvg1M: { value: 0.12092732556005037, dataType: 'Float' },
        pateValue3H: { value: 0.2811193740140766, dataType: 'Float' },
        patrValue3H: { value: 0.04326551449696192, dataType: 'Float' },
        sensorName: { value: 'c', dataType: 'String' },
      },
    },
  };
  const groupName = 'telemetry-Environment-airPressure';

  // Act
  store.dispatch(openWebsocketConnection());
  await server.connected;
  await store.dispatch(requestGroupSubscription(groupName));
  server.send({ category:'telemetry', data: data });
  const streamData = getStreamData(store.getState(), groupName);

  // Assert
  expect(JSON.stringify(streamData)).toEqual(JSON.stringify(data.Environment.airPressure));
});
