import { createStore, applyMiddleware } from 'redux';
import WS from 'jest-websocket-mock';
import rootReducer from '../reducers';
import thunkMiddleware from 'redux-thunk';
import {
  requestSALCommand,
  openWebsocketConnection,
  requestGroupSubscription,
  sendLOVECscObservingLogs,
} from '../actions/ws';
import { removeCSCLogMessages, removeCSCErrorCodeData } from '../actions/summaryData';
import { SALCommandStatus } from '../actions/ws';
import {
  getLastSALCommand,
  getCSCLogMessages,
  getCSCErrorCodeData,
  getAllStreamsAsDictionary,
  getGroupSortedErrorCodeData,
  getAllTelemetries,
  getAllEvents,
  getObservingLogs,
} from '../selectors';
import * as mockData from './mock';
import { flatMap } from '../../Utils';

let store, server;

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

it('Should send an observingLog to the LOVE-Controller and the server should receive it properly', async () => {
  const user = 'an user';
  const message = 'a message';
  await store.dispatch(sendLOVECscObservingLogs(user, message));

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

  const cscsList = [
    ['ATDome', 1],
    ['ScriptQueue', 1],
  ];

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

  expect(getCSCLogMessages(store.getState(), 'ATDome', 1)).toEqual(messages);
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

it('Should delete all logMessages of a CSC with an action ', async () => {
  // Arrange
  await server.connected;
  await store.dispatch(requestGroupSubscription('event-ATDome-1-logMessage'));

  let messages = [];

  expect(getCSCLogMessages(store.getState(), 'ATDome', 1)).toEqual(messages);
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
  });
  expect(getCSCLogMessages(store.getState(), 'ATDome', 1)).toEqual(messages);

  // Act

  store.dispatch(removeCSCLogMessages('ATDome', 1));

  // Assert
  expect(getCSCLogMessages(store.getState(), 'ATDome', 1)).toEqual([]);
});

it('It should extract all errorCode event data  from the state for a given CSC', async () => {
  await server.connected;
  await store.dispatch(requestGroupSubscription('event-Test-1-errorCode'));

  let messages = [];

  expect(getCSCErrorCodeData(store.getState(), 'Test', 1)).toEqual(messages);
  mockData.TestCSCErrorCodeData.forEach((message) => {
    server.send({
      category: 'event',
      data: [
        {
          csc: 'Test',
          salindex: 1,
          data: {
            errorCode: [message],
          },
        },
      ],
    });

    messages = [...messages, message];
    const storedMessages = getCSCErrorCodeData(store.getState(), 'Test', 1);
    expect(storedMessages).toEqual(messages);
  });
});

it('It should delete errorCode event data  from the state for a given CSC', async () => {
  // Arrange
  await server.connected;
  await store.dispatch(requestGroupSubscription('event-Test-1-errorCode'));

  let messages = [];

  expect(getCSCErrorCodeData(store.getState(), 'Test', 1)).toEqual(messages);
  mockData.TestCSCErrorCodeData.forEach((message) => {
    server.send({
      category: 'event',
      data: [
        {
          csc: 'Test',
          salindex: 1,
          data: {
            errorCode: [message],
          },
        },
      ],
    });

    messages = [...messages, message];
  });
  const storedMessages = getCSCErrorCodeData(store.getState(), 'Test', 1);
  expect(storedMessages).toEqual(messages);

  // Act
  store.dispatch(removeCSCErrorCodeData('Test', 1));

  // Assert
  expect(getCSCErrorCodeData(store.getState(), 'Test', 1)).toEqual([]);
});

it('Should extract a sorted list of a subset of errorCode event data ', async () => {
  // Arrange
  await server.connected;
  await store.dispatch(requestGroupSubscription('event-Test-1-errorCode'));
  await store.dispatch(requestGroupSubscription('event-Test-2-errorCode'));

  expect(getCSCErrorCodeData(store.getState(), 'Test', 1)).toEqual([]);
  server.send({
    category: 'event',
    data: [
      {
        csc: 'Test',
        salindex: 1,
        data: {
          errorCode: mockData.TestCSCErrorCodeData,
        },
      },
    ],
  });

  server.send({
    category: 'event',
    data: [
      {
        csc: 'Test',
        salindex: 2,
        data: {
          errorCode: mockData.TestCSCErrorCodeData,
        },
      },
    ],
  });

  const flat1 = flatMap(mockData.TestCSCErrorCodeData, (msg) => {
    return {
      csc: 'Test',
      salindex: 1,
      ...msg,
    };
  });
  const flat2 = flatMap(mockData.TestCSCErrorCodeData, (msg) => {
    return {
      csc: 'Test',
      salindex: 2,
      ...msg,
    };
  });

  let sortedMessages = [...flat1, ...flat2].sort((msg1, msg2) => {
    return msg1.private_rcvStamp.value > msg2.private_rcvStamp.value ? -1 : 1;
  });

  // Act
  const storedMessages = getGroupSortedErrorCodeData(store.getState(), [
    { name: 'Test', salindex: 1 },
    { name: 'Test', salindex: 2 },
  ]);

  // Assert
  storedMessages.forEach((msg, index) => {
    expect(msg.csc).toEqual(sortedMessages[index].csc);
    expect(msg.salindex).toEqual(sortedMessages[index].salindex);
  });
});

it('Should save all telemetries when subscribed to all', async () => {
  await server.connected;
  await store.dispatch(requestGroupSubscription('telemetry-all-all-all'));
  let msg = {
    category: 'telemetry',
    data: [
      {
        csc: 'ATDome',
        salindex: 1,
        data: {
          param1: 1234,
        },
      },
    ],
  };
  server.send(msg);
  msg.data[0].csc = 'ATMCS';
  server.send(msg);
  const expected = {
    'ATDome-1': {
      param1: 1234,
    },
    'ATMCS-1': {
      param1: 1234,
    },
  };
  const result = getAllTelemetries(store.getState());
  expect(result).toEqual(expected);
});

it('Should save all events when subscribed to all', async () => {
  await server.connected;
  await store.dispatch(requestGroupSubscription('event-all-all-all'));
  let msg = {
    category: 'event',
    data: [
      {
        csc: 'ATDome',
        salindex: 1,
        data: {
          param1: 1234,
        },
      },
    ],
  };
  server.send(msg);
  msg.data[0].csc = 'ATMCS';
  server.send(msg);
  const expected = {
    'ATDome-1': {
      param1: 1234,
    },
    'ATMCS-1': {
      param1: 1234,
    },
  };
  const result = getAllEvents(store.getState());
  expect(result).toEqual(expected);
});

it('Should get incoming observing log messages from the state', async () => {
  await server.connected;
  await store.dispatch(requestGroupSubscription('event-LOVE-0-observingLog'));

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
      priority: { value: 0, dataType: 'Int' },
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
