import { createStore, applyMiddleware } from 'redux';
import WS from 'jest-websocket-mock';
import rootReducer from '../reducers';
import thunkMiddleware from 'redux-thunk';
import { requestSALCommand, openWebsocketConnection, requestGroupSubscription } from '../actions/ws';

import { SALCommandStatus } from '../actions/ws';
import {
  getLastSALCommand,
  getScriptHeartbeats,
  getCSCHeartbeats,
  getCSCHeartbeat,
  getCSCLogMessages,
  getAllStreamsAsDictionary,
} from '../selectors';
import * as mockData from './mock';

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

  await expect(server).toReceiveMessage({
    category: 'cmd',
    data: [
      {
        csc: 'ATDome',
        data: { stream: { cmd: 'cmd_closeShutter', params: {} } },
        salindex: 1,
      },
    ],
  });

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

it('It should extract the summary and log messages properly from the state with the generic reshape selector', async () => {
  const summaryATDome = {
    ATDomeID: { value: 1, dataType: 'Int' },
    private_revCode: { value: 'c38fc5a2', dataType: 'String' },
    private_sndStamp: { value: 1563885828.2869709, dataType: 'Float' },
    private_rcvStamp: { value: 1563885828.3042052, dataType: 'Float' },
    private_seqNum: { value: 4, dataType: 'Int' },
    private_origin: { value: 32, dataType: 'Int' },
    private_host: { value: 843720695, dataType: 'Int' },
    summaryState: { value: 1, dataType: 'Int' },
    priority: { value: 0, dataType: 'Int' },
  };

  const summaryScriptqueue = {
    ScriptQueueID: { value: 1, dataType: 'Int' },
    private_revCode: { value: '16ec6358', dataType: 'String' },
    private_sndStamp: { value: 1563885938.2406523, dataType: 'Float' },
    private_rcvStamp: { value: 1563885938.2410805, dataType: 'Float' },
    private_seqNum: { value: 4, dataType: 'Int' },
    private_origin: { value: 44, dataType: 'Int' },
    private_host: { value: 619616180, dataType: 'Int' },
    summaryState: { value: 1, dataType: 'Int' },
    priority: { value: 0, dataType: 'Int' },
  };

  await server.connected;
  await store.dispatch(requestGroupSubscription('event-ATDome-1-summaryState'));
  await store.dispatch(requestGroupSubscription('event-ATDome-1-logMessage'));
  await store.dispatch(requestGroupSubscription('event-ScriptQueue-1-summaryState'));

  server.send({
    category: 'event',
    data: [
      {
        csc: 'ATDome',
        salindex: 1,
        data: {
          summaryState: [summaryATDome],
        },
      },
    ],
  });

  server.send({
    category: 'event',
    data: [
      {
        csc: 'ScriptQueue',
        salindex: 1,
        data: {
          summaryState: [summaryScriptqueue],
        },
      },
    ],
  });

  server.send({
    category: 'event',
    data: [
      {
        csc: 'ATDome',
        salindex: 1,
        data: {
          logMessage: mockData.ATDomeLogMessages,
        },
      },
    ],
  });

  const cscsList = [['ATDome', 1], ['ScriptQueue', 1]];

  const summariesDictionary = getAllStreamsAsDictionary(store.getState(), 'event', cscsList, 'summaryState', true);

  const expectedSummaries = {
    'ScriptQueue-1': summaryScriptqueue,
    'ATDome-1': summaryATDome,
  };

  expect(summariesDictionary).toEqual(expectedSummaries);

  /**
   * When some cscs dont have data the keys return undefined values
   */
  const logMessagesDictionary = getAllStreamsAsDictionary(store.getState(), 'event', cscsList, 'logMessage');

  const expectedLogMessages = {
    'ATDome-1': mockData.ATDomeLogMessages,
  };

  expect(logMessagesDictionary).toEqual(expectedLogMessages);
});

it('It should extract all received logMessages from the state for a given CSC', async () => {
  await server.connected;
  await store.dispatch(requestGroupSubscription('event-ATDome-1-logMessage'));

  let messages = [];
  mockData.ATDomeLogMessages.forEach((message) => {
    server.send({
      category: 'event',
      data: [
        {
          csc: 'ATDome',
          salindex: 1,
          data: {
            logMessage: [message],
          },
        },
      ],
    });

    messages = [...messages, message];
    const storedMessages = getCSCLogMessages(store.getState(), 'ATDome', 1);
    expect(storedMessages).toEqual(messages);
  });
});
