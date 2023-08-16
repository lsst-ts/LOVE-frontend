/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed for Inria Chile Tech Team.

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
import { sendLOVECscObservingLogs } from '../actions/ws';

import ManagerInterface from '../../Utils';

let store;

beforeAll(async () => {
  // Arrange
  const url = `${ManagerInterface.getApiBaseUrl()}lovecsc/observinglog`;
  fetchMock.mock(url, {
    status: 200,
    data: {
      ack: 'Added new observing log to SAL',
    },
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
  await store.dispatch(sendLOVECscObservingLogs({ ...observingLogMsg }));

  // Assert request was sent
  expect(fetchMock.called(url)).toBe(true);
  const [, lastCall] = fetchMock.lastCall(url);
  expect(lastCall.method).toEqual('POST');
  expect(JSON.parse(lastCall.body)).toEqual(observingLogMsg);
});
