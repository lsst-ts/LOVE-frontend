import { createStore, applyMiddleware } from 'redux';
import WS from 'jest-websocket-mock';
import rootReducer from '../reducers';
import thunkMiddleware from 'redux-thunk';
import { addGroupSubscription } from '../actions/ws';
import { doReceiveToken } from '../actions/auth';
import { getLastManagerHeartbeat, getScriptHeartbeats, getCSCHeartbeats, getCSCHeartbeat } from '../selectors';
import * as mockData from './mock';

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

const compareSalIndex = (a, b) => {
  if (a.salindex < b.salindex) {
    return -1;
  } else if (a.salindex > b.salindex) {
    return 1;
  } else {
    return 0;
  }
};

afterEach(() => {
  server.close();
});

// Arrange:
beforeEach(async () => {
  store = createStore(rootReducer, applyMiddleware(thunkMiddleware));
  server = new WS('ws://localhost/manager/ws/subscription?token=love-token', { jsonProtocol: true });
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
    await store.dispatch(addGroupSubscription('heartbeat-manager-0-stream'));
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

it('Should receive 3 sequential messages with script heartbeats (2 new and 1 update) from the server and save them on the state properly', async () => {
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
    let heartbeatsState = getScriptHeartbeats(store.getState(), 12);
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
  let heartbeatsState = getScriptHeartbeats(store.getState(), 1);
  expect(JSON.stringify(heartbeatsState.sort(compareSalIndex))).toEqual(
    JSON.stringify(expectedState.sort(compareSalIndex)),
  );
});

describe('GIVEN 2 csc salindices in different combinations', () => {
  const salindices = [1, 2];

  salindices.forEach((salindex1) => {
    salindices.forEach((salindex2) => {
      it(`WHEN the server sends two heartbeats with salindices of these combinations
        THEN it should receive two CSC heartbeats with these salindices and select them from the state properly`, async () => {
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
        THEN it should receive two CSC heartbeats with these salindices and select them individually from the state`, async () => {
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
