import { createStore, applyMiddleware } from 'redux';
import WS from 'jest-websocket-mock';
import rootReducer from '../reducers';
import thunkMiddleware from 'redux-thunk';
import {
  addGroupSubscription,
  sendLOVECscObservingLogs,
} from '../actions/ws';
import { doReceiveToken } from '../actions/auth';
import { getObservingLogs } from '../selectors';

let store, server;

beforeEach(async () => {
  store = createStore(rootReducer, applyMiddleware(thunkMiddleware));
  server = new WS('ws://localhost/manager/ws/subscription?token=love-token', { jsonProtocol: true });
  await store.dispatch(doReceiveToken('username', 'love-token', {}, 0));
  await server.connected;
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

it('Should get incoming observing log messages from the state', async () => {
  await store.dispatch(addGroupSubscription('event-LOVE-0-observingLog'));

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
