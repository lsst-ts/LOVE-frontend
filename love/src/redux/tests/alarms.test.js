import { createStore, applyMiddleware } from 'redux';
import WS from 'jest-websocket-mock';
import rootReducer from '../reducers';
import thunkMiddleware from 'redux-thunk';
import { requestSALCommand, openWebsocketConnection, requestGroupSubscription } from '../actions/ws';
import { removeCSCLogMessages, removeCSCErrorCodeData } from '../actions/summaryData';
import { SALCommandStatus } from '../actions/ws';
import {
  getLastSALCommand,
  getScriptHeartbeats,
  getCSCHeartbeats,
  getCSCHeartbeat,
  getCSCLogMessages,
  getCSCErrorCodeData,
  getAllStreamsAsDictionary,
  getGroupSortedErrorCodeData,
  getAllTelemetries,
  getAllEvents,
} from '../selectors';
import * as mockData from './mock';
import { flatMap } from '../../Utils';

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
  watcher: {
    alarms: [],
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

describe('GIVEN we have no alarms in the state', () => {
  describe('WHEN we receive alarm events', () => {
    it('THEN the latest alarm is updated in the generic events state for the Watcher CSC,' +
      'and each alarm is stored/updated in the watcher state accordingly ', async () => {
      // Arrange:
      await server.connected;
      await store.dispatch(requestGroupSubscription('event-all-all-all'));
      const alarms = [
        {
          // New for SAL index 100017
          name: 'Alarm-1',
          severity: 1,
          reason: 'Because of reasons',
          maxSeverity: 1,
          acknowledged: false,
          acknowledgedBy: '',
          escalated: false,
          escalatedTo: '',
          mutedSeverity: 0,
          mutedBy: '',
          timestampSeverityOldest: 1562258576.477827,
          timestampSeverityNewest: 1562258577.477827,
          timestampMaxSeverity: 1562258577.477827,
          timestampAcknowledged: 0,
          timestampAutoAcknowledge: 0,
          timestampAutoUnacknowledge: 0,
          timestampEscalate: 0,
          timestampUnmute: 0,
        },
        {
          // New for SAL index 100017
          name: 'Alarm-2',
          severity: 3,
          reason: 'Because of other reasons',
          maxSeverity: 1,
          acknowledged: true,
          acknowledgedBy: 'john Doe',
          escalated: false,
          escalatedTo: '',
          mutedSeverity: 0,
          mutedBy: '',
          timestampSeverityOldest: 1562258576.477827,
          timestampSeverityNewest: 1562258577.477827,
          timestampMaxSeverity: 1562258577.477827,
          timestampAcknowledged: 0,
          timestampAutoAcknowledge: 0,
          timestampAutoUnacknowledge: 0,
          timestampEscalate: 0,
          timestampUnmute: 0,
        },
      ];
      let expectedAlarms = [];
      alarms.forEach((alarm) => {
        // Act:
        server.send({
          category: 'event',
          data: [
            {
              csc: 'Watcher',
              salindex: 1, // watcher salindex
              data: {
                alarm: alarm
              },
            },
          ],
        });

        // Assert:
        const expectedEventState = {
          'Watcher-1': {
            alarm: alarm,
          },
        };
        expectedAlarms.append(alarm);
        const resultEventState = getAllEvents(store.getState());
        const resultAlarms = getAllAlarms(store.getState());
        expect(resultEventState).toEqual(expectedEventState);
        expect(resultAlarms).toEqual(expectedAlarms);
      });
    });
  });
});
