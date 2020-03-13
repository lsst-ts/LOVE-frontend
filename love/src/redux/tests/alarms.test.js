import { createStore, applyMiddleware } from 'redux';
import WS from 'jest-websocket-mock';
import rootReducer from '../reducers';
import thunkMiddleware from 'redux-thunk';
import { addGroupSubscription } from '../actions/ws';
import { doReceiveToken } from '../actions/auth';
import { receiveAlarms } from '../actions/alarms';
import {
  getStreamData,
  getLastAlarm,
  getAllAlarms,
} from '../selectors';


let store, server;

function cleanAlarm(alarm) {
  const cleanAlarm = {};
  Object.keys(alarm).map((key) => {
    cleanAlarm[key] = alarm[key].value;
  });
  return cleanAlarm;
}

const alarms = [
  {
    // New alarm 1
    name: {value: 'Alarm-1', dataType: 'String'},
    severity: {value: 1, dataType: 'Int'},
    reason: {value: 'Because of reasons', dataType: 'String'},
    maxSeverity: {value: 1, dataType: 'Int'},
    acknowledged: {value: 0, dataType: 'Int'},
    acknowledgedBy: {value: '', dataType: 'String'},
    escalated: {value: 0, dataType: 'Int'},
    escalatedTo: {value: '', dataType: 'String'},
    mutedSeverity: {value: 0, dataType: 'Int'},
    mutedBy: {value: '', dataType: 'String'},
    timestampSeverityOldest: {value: 1562258576.477827, dataType: 'Float'},
    timestampSeverityNewest: {value: 1562258577.477827, dataType: 'Float'},
    timestampMaxSeverity: {value: 1562258577.477827, dataType: 'Float'},
    timestampAcknowledged: {value: 0, dataType: 'Float'},
    timestampAutoAcknowledge: {value: 0, dataType: 'Float'},
    timestampAutoUnacknowledge: {value: 0, dataType: 'Float'},
    timestampEscalate: {value: 0, dataType: 'Float'},
    timestampUnmute: {value: 0, dataType: 'Float'},
  },
  {
    // New alarm 2
    name: {value: 'Alarm-2', dataType: 'String'},
    severity: {value: 3, dataType: 'Int'},
    reason: {value: 'Because of other reasons', dataType: 'String'},
    maxSeverity: {value: 1, dataType: 'Int'},
    acknowledged: {value: 0, dataType: 'Int'},
    acknowledgedBy: {value: '', dataType: 'String'},
    escalated: {value: 0, dataType: 'Int'},
    escalatedTo: {value: '', dataType: 'String'},
    mutedSeverity: {value: 0, dataType: 'Int'},
    mutedBy: {value: '', dataType: 'String'},
    timestampSeverityOldest: {value: 1562258576.477827, dataType: 'Float'},
    timestampSeverityNewest: {value: 1562258577.477827, dataType: 'Float'},
    timestampMaxSeverity: {value: 1562258577.477827, dataType: 'Float'},
    timestampAcknowledged: {value: 0, dataType: 'Float'},
    timestampAutoAcknowledge: {value: 0, dataType: 'Float'},
    timestampAutoUnacknowledge: {value: 0, dataType: 'Float'},
    timestampEscalate: {value: 0, dataType: 'Float'},
    timestampUnmute: {value: 0, dataType: 'Float'},
  },
  {
    // New alarm 3
    name: {value: 'Alarm-3', dataType: 'String'},
    severity: {value: 2, dataType: 'Int'},
    reason: {value: 'Because of yet other reasons', dataType: 'String'},
    maxSeverity: {value: 2, dataType: 'Int'},
    acknowledged: {value: 0, dataType: 'Int'},
    acknowledgedBy: {value: '', dataType: 'String'},
    escalated: {value: 0, dataType: 'Int'},
    escalatedTo: {value: '', dataType: 'String'},
    mutedSeverity: {value: 0, dataType: 'Int'},
    mutedBy: {value: '', dataType: 'String'},
    timestampSeverityOldest: {value: 1562258579.477827, dataType: 'Float'},
    timestampSeverityNewest: {value: 1562258579.477827, dataType: 'Float'},
    timestampMaxSeverity: {value: 1562258579.477827, dataType: 'Float'},
    timestampAcknowledged: {value: 0, dataType: 'Float'},
    timestampAutoAcknowledge: {value: 0, dataType: 'Float'},
    timestampAutoUnacknowledge: {value: 0, dataType: 'Float'},
    timestampEscalate: {value: 0, dataType: 'Float'},
    timestampUnmute: {value: 0, dataType: 'Float'},
  },
];

const updatedAlarm = {
  // Updated alarm 2
  name: {value: 'Alarm-2', dataType: 'String'},
  severity: {value: 3, dataType: 'Int'},
  reason: {value: 'Because of other reasons', dataType: 'String'},
  maxSeverity: {value: 1, dataType: 'Int'},
  acknowledged: {value: 1, dataType: 'Int'},
  acknowledgedBy: {value: 'John Doe', dataType: 'String'},
  escalated: {value: 0, dataType: 'Int'},
  escalatedTo: {value: '', dataType: 'String'},
  mutedSeverity: {value: 0, dataType: 'Int'},
  mutedBy: {value: '', dataType: 'String'},
  timestampSeverityOldest: {value: 1562258577.477827, dataType: 'Float'},
  timestampSeverityNewest: {value: 1562258577.477827, dataType: 'Float'},
  timestampMaxSeverity: {value: 1562258577.477827, dataType: 'Float'},
  timestampAcknowledged: {value: 1562258579.477827, dataType: 'Float'},
  timestampAutoAcknowledge: {value: 0, dataType: 'Float'},
  timestampAutoUnacknowledge: {value: 0, dataType: 'Float'},
  timestampEscalate: {value: 0, dataType: 'Float'},
  timestampUnmute: {value: 0, dataType: 'Float'},
};

const cleanAlarms = alarms.map( (alarm) => { return cleanAlarm(alarm) });
const cleanUpdatedAlarm = cleanAlarm(updatedAlarm);

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

  // Arrange:
  beforeEach(async () => {
    store = createStore(rootReducer, initialState, applyMiddleware(thunkMiddleware));
    server = new WS('ws://localhost/manager/ws/subscription', { jsonProtocol: true });
    server.on('connection', socket => {
      const [, token] = socket.url.split('?token=');
      if (token !== 'love-token') {
        socket.close();
      }
    });
    await store.dispatch(doReceiveToken('username', 'love-token', {}, 0));
    await server.connected;
    await store.dispatch(addGroupSubscription('event-Watcher-0-alarm'));
  });

  describe('WHEN we receive alarm events', () => {
    it('THEN the latest alarm is updated in the group event-Watcher-0-alarm,' +
      'and each alarm is stored in the watcher state accordingly ', async () => {
      // Arrange:
      let expectedAlarms = [];
      alarms.forEach((alarm, index) => {
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
        const expectedAlarm = cleanAlarms[index]
        expectedAlarms.push(cleanAlarms[index]);
        const watcherAlarmStream = getStreamData(store.getState(), 'event-Watcher-0-alarm');
        const lastAlarm = getLastAlarm(store.getState());
        const allAlarms = getAllAlarms(store.getState());
        expect(watcherAlarmStream).toEqual(alarm);
        expect(lastAlarm).toEqual(expectedAlarm);
        expect(allAlarms).toEqual(expectedAlarms);
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

  // Arrange:
  beforeEach(async () => {
    store = createStore(rootReducer, initialState, applyMiddleware(thunkMiddleware));
    server = new WS('ws://localhost/manager/ws/subscription', { jsonProtocol: true });
    server.on('connection', socket => {
      const [, token] = socket.url.split('?token=');
      if (token !== 'love-token') {
        socket.close();
      }
    });
    await store.dispatch(doReceiveToken('username', 'love-token', {}, 0));
    await server.connected;
    await store.dispatch(addGroupSubscription('event-Watcher-0-alarm'));
  });

  describe('WHEN we receive alarm events', () => {
    it('THEN the latest alarm is updated in the group event-Watcher-0-alarm,' +
      'the alarm is updated (not re-added) in the watcher state accordingly ', async () => {
      // Act:
      server.send({
        category: 'event',
        data: [
          {
            csc: 'Watcher',
            salindex: 0, // watcher salindex
            data: {
              alarm: updatedAlarm
            },
          },
        ],
      });

      // Assert:
      const expectedAlarms = [cleanAlarms[0], cleanUpdatedAlarm, cleanAlarms[2]];
      const watcherAlarmStream = getStreamData(store.getState(), 'event-Watcher-0-alarm');
      const lastAlarm = getLastAlarm(store.getState());
      const allAlarms = getAllAlarms(store.getState());
      expect(watcherAlarmStream).toEqual(updatedAlarm);
      expect(lastAlarm).toEqual(cleanUpdatedAlarm);
      expect(allAlarms).toEqual(expectedAlarms);
    });
  });
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

  // Arrange:
  beforeEach(async () => {
    store = createStore(rootReducer, initialState, applyMiddleware(thunkMiddleware));
  });

  describe('WHEN we dispatch a receiveAlarms event with 1 alarm', () => {
    it('THEN the alarm is stored in the watcher state accordingly ', async () => {
      // Act:
      await store.dispatch(receiveAlarms(alarms[0]));
      // Assert:
      const allAlarms = getAllAlarms(store.getState());
      expect(allAlarms).toEqual([cleanAlarms[0]]);
    });
  });

  describe('WHEN we dispatch a receiveAlarms event with multiple alarms', () => {
    it('THEN all the alarms are stored in the watcher state accordingly ', async () => {
      // Act:
      await store.dispatch(receiveAlarms(alarms));
      // Assert:
      const allAlarms = getAllAlarms(store.getState());
      expect(allAlarms).toEqual(cleanAlarms);
    });
  });
});
