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
import WS from 'jest-websocket-mock';
import thunkMiddleware from 'redux-thunk';
import rootReducer from '../reducers';
import { addGroup } from '../actions/ws';
import { doReceiveToken } from '../actions/auth';
import {
  getLastManagerHeartbeat,
  getLastComponentHeartbeat,
  getScriptHeartbeats,
  getCSCHeartbeats,
  getCSCHeartbeat,
} from '../selectors';
import * as mockData from './mock';
import { HEARTBEAT_COMPONENTS } from '../../Config';

let store;
let server;

const heartbeatsInfo = [
  {
    category: 'heartbeat',
    data: [{ csc: 'Manager', salindex: 0, data: { timestamp: 1582141499.626869 } }],
    subscription: 'heartbeat',
  },
  {
    category: 'heartbeat',
    data: [{ csc: 'Manager', salindex: 0, data: { timestamp: 1692141499.626869 } }],
    subscription: 'heartbeat',
  },
  {
    category: 'heartbeat',
    data: [{ csc: 'Commander', salindex: 0, data: { timestamp: 1792141499.626869 } }],
    subscription: 'heartbeat',
  },
];

const compareSalIndex = (a, b) => {
  if (a.salindex < b.salindex) {
    return -1;
  }
  if (a.salindex > b.salindex) {
    return 1;
  }
  return 0;
};

afterEach(() => {
  server.close();
});

// Arrange:
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

describe('GIVEN are not subscribed to the manager heartbeat', () => {
  // Arrange:
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
    await store.dispatch(addGroup('heartbeat-manager-0-stream'));
  });

  describe('WHEN we receive a manager heartbeat', () => {
    it('THEN we store it the state ', async () => {
      // Arrange:
      await server.send(heartbeatsInfo[0]);
      const lastManagerHeartbeat = getLastManagerHeartbeat(store.getState());
      // Assert:
      expect(lastManagerHeartbeat).toEqual(heartbeatsInfo[0].data[0]);
    });
  });

  describe('WHEN we receive 2 manager heartbeats', () => {
    it('THEN we store the last one ', async () => {
      // Arrange:
      await server.send(heartbeatsInfo[0]);
      await server.send(heartbeatsInfo[1]);
      const lastManagerHeartbeat = getLastManagerHeartbeat(store.getState());
      // Assert:
      expect(lastManagerHeartbeat).toEqual(heartbeatsInfo[1].data[0]);
    });
  });

  describe('WHEN we receive a commander heartbeat', () => {
    it('THEN we store it the state ', async () => {
      // Arrange:
      await server.send(heartbeatsInfo[2]);
      const lastProducerHeartbeat = getLastComponentHeartbeat(store.getState(), HEARTBEAT_COMPONENTS.COMMANDER);
      // Assert:
      expect(lastProducerHeartbeat).toEqual(heartbeatsInfo[2].data[0]);
    });
  });

  describe('WHEN we lose server connection', () => {
    it('THEN we dont receive new manager heartbeats ', async () => {
      // Arrange:
      await server.send(heartbeatsInfo[0]);
      server.close();
      await server.send(heartbeatsInfo[1]);
      const lastManagerHeartbeat = getLastManagerHeartbeat(store.getState());
      // Assert:
      expect(lastManagerHeartbeat).toEqual(heartbeatsInfo[0].data[0]);
    });
  });
});

it(`Should receive 3 sequential messages with script heartbeats (2 new and 1 update)
  from the server and save them on the state properly`, async () => {
  const heartbeats = [
    {
      // New for SAL index 100017
      queueSalIndex: 12,
      salindex: 100017,
      lost: 1,
      lastHeartbeatTimestamp: 1562258576.477827,
    },
    {
      // New for SAL index 100018
      queueSalIndex: 12,
      salindex: 100018,
      lost: 3,
      lastHeartbeatTimestamp: 1562258590.477827,
    },
    {
      // Update for SAL index 100017
      queueSalIndex: 12,
      salindex: 100017,
      lost: 5,
      lastHeartbeatTimestamp: 1562258698.477827,
    },
  ];

  let expectedState = [];
  heartbeats.forEach((heartbeat) => {
    // Act:
    server.send({
      category: 'event',
      data: [
        {
          csc: 'ScriptHeartbeats',
          salindex: 12, // scriptqueue salindex
          data: {
            stream: {
              script_heartbeat: {
                salindex: heartbeat.salindex,
                lost: heartbeat.lost,
                last_heartbeat_timestamp: heartbeat.lastHeartbeatTimestamp,
              },
            },
          },
        },
      ],
    });

    // Assert:
    const heartbeatsState = getScriptHeartbeats(store.getState(), 12);
    // We expect a list with last heartbeat for each SAL index
    expectedState = expectedState.filter((current) => current.salindex !== heartbeat.salindex);
    expectedState.push(heartbeat);

    expect(JSON.stringify(heartbeatsState.sort(compareSalIndex))).toEqual(
      JSON.stringify(expectedState.sort(compareSalIndex)),
    );
  });
});

it(`GIVEN 3 script heartbeats in the State,
    WHEN we receive an event finishing one of those scripts,
    THEN we should remove that script from the heartbeat's State`, async () => {
  // Arrange:
  const mockHeartbeats = [
    {
      queueSalIndex: 1,
      salindex: 100000,
      lost: 4,
      lastHeartbeatTimestamp: 1562258595.477827,
    },
    {
      queueSalIndex: 1,
      salindex: 100001,
      lost: 1,
      lastHeartbeatTimestamp: 1562258576.477827,
    },
    {
      queueSalIndex: 1,
      salindex: 100002,
      lost: 3,
      lastHeartbeatTimestamp: 1562258590.477827,
    },
  ];
  mockHeartbeats.forEach((heartbeat) => {
    server.send({
      category: 'event',
      data: [
        {
          csc: 'ScriptHeartbeats',
          salindex: 1, // scriptqueue salindex
          data: {
            stream: {
              script_heartbeat: {
                salindex: heartbeat.salindex,
                lost: heartbeat.lost,
                last_heartbeat_timestamp: heartbeat.lastHeartbeatTimestamp,
              },
            },
          },
        },
      ],
    });
  });

  let expectedState = [];
  // Act:
  server.send(mockData.ScriptQueueData);
  // Assert:
  expectedState = [mockHeartbeats[0], mockHeartbeats[2]];
  const heartbeatsState = getScriptHeartbeats(store.getState(), 1);
  expect(JSON.stringify(heartbeatsState.sort(compareSalIndex))).toEqual(
    JSON.stringify(expectedState.sort(compareSalIndex)),
  );
});

describe('GIVEN 2 csc salindices in different combinations', () => {
  const salindices = [1, 2];

  salindices.forEach((salindex1) => {
    salindices.forEach((salindex2) => {
      it(`WHEN the server sends two heartbeats with salindices of these combinations
        THEN it should receive two CSC heartbeats with these salindices and select them 
        from the state properly`, async () => {
        const heartbeats = [
          {
            csc: 'ScriptQueue',
            salindex: salindex1,
            lost: 5,
            last_heartbeat_timestamp: 1563801983.963551,
            max_lost_heartbeats: 5,
          },
          {
            csc: 'ATDome',
            salindex: salindex2,
            lost: 5,
            last_heartbeat_timestamp: 1563801984.226387,
            max_lost_heartbeats: 5,
          },
        ];

        heartbeats.forEach((heartbeat) => {
          // Act:
          server.send({
            category: 'event',
            data: [
              {
                csc: 'Heartbeat',
                salindex: 0, // scriptqueue salindex
                data: {
                  stream: {
                    ...heartbeat,
                  },
                },
              },
            ],
          });
        });

        const heartbeatsState = getCSCHeartbeats(store.getState());

        expect(heartbeats).toEqual(heartbeatsState);
      });

      it(`WHEN the server sends two heartbeats with salindices of these combinations
        THEN it should receive two CSC heartbeats with these salindices and select them individually
        from the state`, async () => {
        const heartbeats = [
          {
            csc: 'ScriptQueue',
            salindex: salindex1,
            lost: 5,
            last_heartbeat_timestamp: 1563801983.963551,
            max_lost_heartbeats: 5,
          },
          {
            csc: 'ATDome',
            salindex: salindex2,
            lost: 5,
            last_heartbeat_timestamp: 1563801984.226387,
            max_lost_heartbeats: 5,
          },
        ];

        heartbeats.forEach((heartbeat) => {
          // Act:
          server.send({
            category: 'event',
            data: [
              {
                csc: 'Heartbeat',
                salindex: 0, // scriptqueue salindex
                data: {
                  stream: {
                    ...heartbeat,
                  },
                },
              },
            ],
          });
        });

        const heartbeat = heartbeats[0];
        const heartbeatsState = getCSCHeartbeat(store.getState(), heartbeat.csc, heartbeat.salindex);
        expect(heartbeat).toEqual(heartbeatsState);
      });
    });
  });
});
