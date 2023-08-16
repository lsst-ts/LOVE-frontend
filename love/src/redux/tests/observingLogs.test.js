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
import WS from 'jest-websocket-mock';
import thunkMiddleware from 'redux-thunk';
import rootReducer from '../reducers';
import { addGroup, _sendLOVECscObservingLogs } from '../actions/ws';
import { doReceiveToken } from '../actions/auth';
import { getObservingLogs } from '../selectors';

let store;
let server;

beforeEach(async () => {
  store = createStore(rootReducer, applyMiddleware(thunkMiddleware));
  server = new WS('ws://localhost/manager/ws/subscription', { jsonProtocol: true });
  server.on('connection', (socket) => {
    const [, token] = socket.url.split('?token=');
    if (token !== 'love-token') {
      socket.close();
    }
  });
  await store.dispatch(doReceiveToken('username', 'love-token', {}, 0));
  await server.connected;
});

afterEach(() => {
  server.close();
});

it('Should send an observingLog to the LOVE-Controller and the server should receive it properly', async () => {
  const user = 'an user';
  const message = 'a message';
  await store.dispatch(_sendLOVECscObservingLogs(user, message));

  await expect(server).toReceiveMessage({
    category: 'love_csc',
    data: [
      {
        csc: 'love',
        salindex: 0,
        data: {
          observingLog: {
            user: 'an user',
            message: 'a message',
          },
        },
      },
    ],
  });
});

it('Should get incoming observing log messages from the state', async () => {
  await store.dispatch(addGroup('event-LOVE-0-observingLog'));

  const logsSent = new Array(3).fill({}).map((_v, index) => {
    return {
      private_revCode: { value: `720ed49${index}`, dataType: 'String' },
      private_sndStamp: { value: 1581458706.6005795 + index * 1000, dataType: 'Float' },
      private_rcvStamp: { value: 1581458706.6026254 + index * 1000, dataType: 'Float' },
      private_seqNum: { value: 5, dataType: 'Int' },
      private_origin: { value: 69, dataType: 'Int' },
      private_host: { value: -1407385585, dataType: 'Int' },
      message: { value: `a message ${index}`, dataType: 'String' },
      user: { value: `an user ${index}`, dataType: 'String' },
    };
  });

  logsSent.forEach(async (log) => {
    await server.send({
      category: 'event',
      data: [
        {
          csc: 'LOVE',
          salindex: 0,
          data: {
            observingLog: [log],
          },
        },
      ],
      subscription: 'event-LOVE-0-observingLog',
    });
  });

  // no repeated logs are allowed
  await server.send({
    category: 'event',
    data: [
      {
        csc: 'LOVE',
        salindex: 0,
        data: {
          observingLog: [logsSent[0]],
        },
      },
    ],
    subscription: 'event-LOVE-0-observingLog',
  });

  const logsReceived = getObservingLogs(store.getState());
  expect(logsReceived).toEqual(logsSent);
});
