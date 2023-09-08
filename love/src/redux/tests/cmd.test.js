/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed for Inria Chile.

This program is free software: you can redistribute it and/or modify it under 
the terms of the GNU General Public License as published by the Free Software 
Foundation, either version 3 of the License, or at your option) any later version.

This program is distributed in the hope that it will be useful,but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR 
 A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with 
this program. If not, see <http://www.gnu.org/licenses/>.
*/

import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import fetchMock from 'fetch-mock';
import rootReducer from '../reducers';
import { requestSALCommand, SALCommandStatus } from '../actions/ws';
import { getLastSALCommand } from '../selectors';

import ManagerInterface from '../../Utils';

let store;

beforeEach(async () => {
  store = createStore(rootReducer, applyMiddleware(thunkMiddleware));
});

afterEach(() => {
  fetchMock.reset();
});

it('Should send a command to the server, save it on the state properly ', async () => {
  // Arrange
  const url = `${ManagerInterface.getApiBaseUrl()}cmd/`;
  const expectedStatusCode = 123;
  const serverResponse = new Response(JSON.stringify({ ack: 'ack message' }), { status: expectedStatusCode });
  const realDate = Date;
  global.Date.now = () => 10;
  const commandObject = {
    cmd: 'cmd_closeShutter',
    params: {},
    csc: 'ATDome',
    salindex: 2,
  };
  const cmd_id = '10-cmd_closeShutter';

  fetchMock.mock(url, (/* url1, opts */) => {
    expect(getLastSALCommand(store.getState())).toEqual({
      status: SALCommandStatus.REQUESTED,
      statusCode: null,
      ...commandObject,
      cmd_id,
    });
    return serverResponse;
  });

  // Act
  await store.dispatch(requestSALCommand({ ...commandObject, cmd_id }));

  // Assert request was sent
  expect(fetchMock.called(url)).toBe(true);
  const [, lastCall] = fetchMock.lastCall(url);
  expect(lastCall.method).toEqual('POST');
  expect(JSON.parse(lastCall.body)).toEqual(commandObject);
  global.Date = realDate;

  // Assert it is n ACK state
  await expect(getLastSALCommand(store.getState())).toEqual({
    status: SALCommandStatus.ACK,
    statusCode: expectedStatusCode,
    result: 'ack message',
    ...commandObject,
    cmd_id,
  });
});
