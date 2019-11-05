import { createStore, applyMiddleware } from 'redux';
import WS from 'jest-websocket-mock';
import rootReducer from '../reducers';
import thunkMiddleware from 'redux-thunk';
import { openWebsocketConnection, requestGroupSubscription } from '../actions/ws';
import {
  getAllEvents,
  getAllAlarms,
} from '../selectors';


let store, server;

const alarms = [
  {
    // New alarm 1
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
    // New alarm 2
    name: 'Alarm-2',
    severity: 3,
    reason: 'Because of other reasons',
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
    // New alarm 3
    name: 'Alarm-3',
    severity: 2,
    reason: 'Because of yet other reasons',
    maxSeverity: 2,
    acknowledged: false,
    acknowledgedBy: '',
    escalated: false,
    escalatedTo: '',
    mutedSeverity: 0,
    mutedBy: '',
    timestampSeverityOldest: 1562258579.477827,
    timestampSeverityNewest: 1562258579.477827,
    timestampMaxSeverity: 1562258579.477827,
    timestampAcknowledged: 0,
    timestampAutoAcknowledge: 0,
    timestampAutoUnacknowledge: 0,
    timestampEscalate: 0,
    timestampUnmute: 0,
  },
];

afterEach(() => {
  server.close();
});

describe('GIVEN we have no alarms in the state', () => {

  const initialState = {
    auth: {
      username: '',
      token: null,
      status: 'EMPTY',
    },
    ws: {
      alarms: [],
      connectionState: 'CLOSED',
      subscriptions: [],
      lastSALCommand: {
        status: undefined,
        cmd: '',
        params: {},
        component: '',
      },
    },
  };

  beforeEach(async () => {
    store = createStore(rootReducer, initialState, applyMiddleware(thunkMiddleware));
    // prevent fetch call for token
    localStorage.setItem('LOVE-TOKEN', 'love-token');
    server = new WS('ws://localhost/manager/ws/subscription?token=love-token', { jsonProtocol: true });
    await store.dispatch(openWebsocketConnection());
    await store.dispatch(requestGroupSubscription('event-all-all-all'));
    await server.connected;
  });

  describe('WHEN we receive alarm events', () => {
    it('THEN the latest alarm is updated in the generic events state for the Watcher CSC,' +
      'and each alarm is stored in the watcher state accordingly ', async () => {
      // Arrange:
      let expectedAlarms = [];
      alarms.forEach((alarm) => {
        // Act:
        server.send({
          category: 'event',
          data: [
            {
              csc: 'Watcher',
              salindex: 0, // watcher salindex
              data: {
                alarm: alarm
              },
            },
          ],
        });

        // Assert:
        const expectedEventState = {
          'Watcher-0': {
            alarm: alarm,
          },
        };
        expectedAlarms.push(alarm);
        const resultEventState = getAllEvents(store.getState());
        const resultAlarms = getAllAlarms(store.getState());
        expect(resultEventState).toEqual(expectedEventState);
        expect(resultAlarms).toEqual(expectedAlarms);
      });
    });
  });
});

describe('GIVEN we have some alarms in the state', () => {

  const initialState = {
    auth: {
      username: '',
      token: null,
      status: 'EMPTY',
    },
    ws: {
      alarms: alarms,
      connectionState: 'CLOSED',
      subscriptions: [],
      lastSALCommand: {
        status: undefined,
        cmd: '',
        params: {},
        component: '',
      },
    },
  };

  beforeEach(async () => {
    store = createStore(rootReducer, initialState, applyMiddleware(thunkMiddleware));
    // prevent fetch call for token
    localStorage.setItem('LOVE-TOKEN', 'love-token');
    server = new WS('ws://localhost/manager/ws/subscription?token=love-token', { jsonProtocol: true });
    await store.dispatch(openWebsocketConnection());
    await store.dispatch(requestGroupSubscription('event-all-all-all'));
    await server.connected;
  });

  describe('WHEN we receive alarm events', () => {
    it('THEN the alarm is updated (not re-added) in the watcher state accordingly ', async () => {
      // Arrange:
      const alarm = {
        // Updated alarm 1
        name: 'Alarm-2',
        severity: 1,
        reason: 'Because of other reasons',
        maxSeverity: 2,
        acknowledged: true,
        acknowledgedBy: 'John Doe',
        escalated: false,
        escalatedTo: '',
        mutedSeverity: 0,
        mutedBy: '',
        timestampSeverityOldest: 1562258579.477827,
        timestampSeverityNewest: 1562258579.477827,
        timestampMaxSeverity: 1562258579.477827,
        timestampAcknowledged: 0,
        timestampAutoAcknowledge: 0,
        timestampAutoUnacknowledge: 0,
        timestampEscalate: 0,
        timestampUnmute: 0,
      };

      // Act:
      server.send({
        category: 'event',
        data: [
          {
            csc: 'Watcher',
            salindex: 0, // watcher salindex
            data: {
              alarm: alarm
            },
          },
        ],
      });

      // Assert:
      const expectedAlarms = [alarms[0], alarm, alarms[2]];
      const resultAlarms = getAllAlarms(store.getState());
      expect(resultAlarms).toEqual(expectedAlarms);
    });
  });
});
