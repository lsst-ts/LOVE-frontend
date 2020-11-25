import { createStore, applyMiddleware } from 'redux';
import rootReducer from '../reducers';
import thunkMiddleware from 'redux-thunk';
import { sendLOVECscObservingLogs } from '../actions/ws';

import ManagerInterface from '../../Utils';
import fetchMock from 'fetch-mock';


let store;

beforeAll(async () => {
  // Arrange
  const url = `${ManagerInterface.getApiBaseUrl()}lovecsc/`;
  fetchMock.mock(url, {
    "status": 200,
    "data": {
      "ack": "Added new observing log to SAL"
    }
  });
});

beforeEach(async () => {
  store = createStore(rootReducer, applyMiddleware(thunkMiddleware));
});

afterEach(() => {
  fetchMock.reset();
});


it('Should send an observing log to the server, save it on the state properly ', async () => {
  // Arrange 
  const url = `${ManagerInterface.getApiBaseUrl()}lovecsc/observinglog`;
  const observingLogMsg = {
    user: 'an user',
    message: 'a message',
  };

  // Act
  await store.dispatch(sendLOVECscObservingLogs({...observingLogMsg}));

  // Assert request was sent
  expect(fetchMock.called(url)).toBe(true);
  const [, lastCall] = fetchMock.lastCall(url);
  expect(lastCall.method).toEqual('POST');
  expect(JSON.parse(lastCall.body)).toEqual(observingLogMsg);
});