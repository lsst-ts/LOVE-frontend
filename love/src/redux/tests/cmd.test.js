import { createStore, applyMiddleware } from 'redux';
import WS from 'jest-websocket-mock';
import rootReducer from '../reducers';
import thunkMiddleware from 'redux-thunk';
import { requestSALCommand, SALCommandStatus } from '../actions/ws';
import { doReceiveToken } from '../actions/auth';
import { getLastSALCommand } from '../selectors';

import ManagerInterface from '../../Utils';
import fetchMock, { MATCHED } from 'fetch-mock';


let store, server;

beforeEach(async () => {
  store = createStore(rootReducer, applyMiddleware(thunkMiddleware));
});

afterEach(() => {
  fetchMock.reset();
});


it('Should send a command to the server, save it on the state properly ', async () => {

  // Arrange 
  const url = `${ManagerInterface.getApiBaseUrl()}cmd/`;
  var serverResponse = new Response(JSON.stringify({ 'ack': 'ack message' }), { 'status': 200 })
  const realDate = Date;
  global.Date.now = () => 10;

  fetchMock.mock(
    url,
    (url1, opts) => {
      expect(getLastSALCommand(store.getState())).toEqual({
        status: SALCommandStatus.REQUESTED,
        ...commandObject,
      });
      return serverResponse;
    }
  );

  const commandObject = {
    cmd: 'cmd_closeShutter',
    params: {},
    component: 'ATDome',
    cmd_id: '10-cmd_closeShutter',
    salindex: 2,
  };

  // Act
  await store.dispatch(requestSALCommand(commandObject));

  // Assert request was sent
  expect(fetchMock.called(url)).toBe(true);
  const [, lastCall] = fetchMock.lastCall(url);
  expect(lastCall.method).toEqual('POST');
  expect(JSON.parse(lastCall.body)).toEqual(commandObject);
  global.Date = realDate;

  // Assert it is in ACK state
  await expect(getLastSALCommand(store.getState())).toEqual({
    status: SALCommandStatus.ACK,
    result: 'ack message',
    ...commandObject,
  });


});