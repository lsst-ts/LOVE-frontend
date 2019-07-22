import { createStore, applyMiddleware } from 'redux';
import WS from 'jest-websocket-mock';
import rootReducer from '../reducers';
import thunkMiddleware from 'redux-thunk';
import { requestSALCommand, openWebsocketConnection } from '../actions/ws';

import { SALCommandStatus } from '../actions/ws';
import { getLastSALCommand, getScriptHeartbeats, getCSCHeartbeats } from '../selectors';
import { mockScriptQueueData } from './mock';

let store, server;
const initialState = {
  auth: {
    username: '',
    token: null,
    status: 'EMPTY',
  },
  ws: {
    connectionState: 'CLOSED',
    subscriptions: [],
    lastSALCommand: {
      status: undefined,
      cmd: '',
      params: {},
      component: '',
    },
  },
  camera: {
    raftsDetailedState: 'UNKNOWN',
    imageReadinessDetailedState: 'UNKNOWN',
    calibrationDetailedState: 'UNKNOWN',
    shutterDetailedState: 'UNKNOWN',
    imageSequence: {},
  },
  heartbeats: {
    scripts: [
      {
        salindex: 1000,
        lost: 1,
        lastHeartbeatTimestamp: 1562258576.477827,
      },
      {
        salindex: 1001,
        lost: 3,
        lastHeartbeatTimestamp: 1562258590.477827,
      },
    ],
    cscs: [],
  },
};

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

it('Should send a command to the server and save it on the state properly', async () => {
  const commandObject = {
    cmd: 'cmd_closeShutter',
    params: {},
    component: 'ATDome',
  };

  await store.dispatch(requestSALCommand(commandObject));

  await expect(server).toReceiveMessage({ option: 'cmd', type: 'command_data', ...commandObject });

  expect(getLastSALCommand(store.getState())).toEqual({
    status: SALCommandStatus.REQUESTED,
    ...commandObject,
  });
});

const compareSalIndex = (a, b) => {
  if (a.salindex < b.salindex) {
    return -1;
  } else if (a.salindex > b.salindex) {
    return 1;
  } else {
    return 0;
  }
};

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
  server.send(mockScriptQueueData);
  // Assert:
  expectedState = [mockHeartbeats[0], mockHeartbeats[2]];
  let heartbeatsState = getScriptHeartbeats(store.getState(), 1);
  expect(JSON.stringify(heartbeatsState.sort(compareSalIndex))).toEqual(
    JSON.stringify(expectedState.sort(compareSalIndex)),
  );
});

it('Should receive two CSC heartbeats from the server and select them from the state properly', async () => {
  const heartbeats = [
    {
      csc: 'ScriptQueue',
      salindex: 2,
      lost: 5,
      last_heartbeat_timestamp: 1563801983.963551,
      max_lost_heartbeats: 5,
    },
    {
      csc: 'ATDome',
      salindex: 1,
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
            stream:  {
                ...heartbeat
              }
          },
        },
      ],
    });
  });

  const heartbeatsState = getCSCHeartbeats(store.getState());

  expect(JSON.stringify(heartbeats)).toEqual(JSON.stringify(heartbeatsState));
  
});
