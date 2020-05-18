import { createStore, applyMiddleware } from 'redux';
import WS from 'jest-websocket-mock';
import rootReducer from '../reducers';
import thunkMiddleware from 'redux-thunk';
import { addGroup, removeGroup } from '../actions/ws';
import { doReceiveToken } from '../actions/auth';
import { getAllTelemetries, getAllEvents, getStreamData } from '../selectors';

let store, server;

beforeEach(async () => {
  store = createStore(rootReducer, applyMiddleware(thunkMiddleware));
  server = new WS('ws://localhost/manager/ws/subscription', { jsonProtocol: true });
  server.on('connection', (socket) => {
    const [, token] = socket.url.split('?token=');
    if (token !== 'love-token') {
      socket.close();
    }
  });
});

afterEach(() => {
  WS.clean();
});

describe('Test subscription to Telemetries and Events, given the connection is open', () => {
  beforeEach(async () => {
    await store.dispatch(doReceiveToken('username', 'love-token', {}, 0));
    await server.connected;
  });

  it('When subscribed to all telemetries, then should receive all telemetries', async () => {
    // ACT
    await store.dispatch(addGroup('telemetry-all-all-all'));
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
    // ASSERT
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

  it('When subscribed to some telemetries, then should receive those telemetries and no others', async () => {
    await store.dispatch(addGroup('telemetry-ATDome-1-stream1'));
    await expect(server).toReceiveMessage({
      category: 'telemetry',
      csc: 'ATDome',
      option: 'subscribe',
      salindex: '1',
      stream: 'stream1',
    });

    // ACT
    let msg = {
      category: 'telemetry',
      data: [
        {
          csc: 'ATDome',
          salindex: 1,
          data: {
            stream1: {
              key11: 'value11',
              key12: 'value12',
            },
            stream2: {
              key21: 'value21',
              key22: 'value22',
            },
          },
        },
      ],
    };
    server.send(msg);
    msg.data[0].csc = 'ATMCS';
    server.send(msg);
    // ASSERT
    expect(getStreamData(store.getState(), 'telemetry-ATDome-1-stream1')).toEqual({
      key11: 'value11',
      key12: 'value12',
    });
    expect(getStreamData(store.getState(), 'telemetry-ATDome-1-stream2')).toEqual(undefined);
    expect(getStreamData(store.getState(), 'telemetry-ATMCS-1-stream1')).toEqual(undefined);
    expect(getStreamData(store.getState(), 'telemetry-ATMCS-1-stream2')).toEqual(undefined);
  });

  it('When subscribed to all events, then should receive all events', async () => {
    // ACT
    await store.dispatch(addGroup('event-all-all-all'));
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
    // ASSERT
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

  it('When subscribed to some events, then should receive those events and no others', async () => {
    await store.dispatch(addGroup('event-ATDome-1-stream1'));
    await expect(server).toReceiveMessage({
      category: 'event',
      csc: 'ATDome',
      option: 'subscribe',
      salindex: '1',
      stream: 'stream1',
    });

    // ACT
    let msg = {
      category: 'event',
      data: [
        {
          csc: 'ATDome',
          salindex: 1,
          data: {
            stream1: {
              key11: 'value11',
              key12: 'value12',
            },
            stream2: {
              key21: 'value21',
              key22: 'value22',
            },
          },
        },
      ],
    };
    server.send(msg);
    msg.data[0].csc = 'ATMCS';
    server.send(msg);
    // ASSERT
    expect(getStreamData(store.getState(), 'event-ATDome-1-stream1')).toEqual({
      key11: 'value11',
      key12: 'value12',
    });
    expect(getStreamData(store.getState(), 'event-ATDome-1-stream2')).toEqual(undefined);
    expect(getStreamData(store.getState(), 'event-ATMCS-1-stream1')).toEqual(undefined);
    expect(getStreamData(store.getState(), 'event-ATMCS-1-stream2')).toEqual(undefined);
  });

  xit('When subscribed N times to an event and then unsubscribed M < N times, then should still receive the event ', async () => {
    // Subscribe N=3 times
    await store.dispatch(addGroup('event-ATDome-1-stream1'));
    await store.dispatch(addGroup('event-ATDome-1-stream1'));
    await store.dispatch(addGroup('event-ATDome-1-stream1'));
    await expect(server).toReceiveMessage({
      category: 'event',
      csc: 'ATDome',
      option: 'subscribe',
      salindex: '1',
      stream: 'stream1',
    });

    // Receive message
    let msg = {
      category: 'event',
      data: [
        {
          csc: 'ATDome',
          salindex: 1,
          data: {
            stream1: {
              key11: 'value11',
              key12: 'value12',
            },
            stream2: {
              key21: 'value21',
              key22: 'value22',
            },
          },
        },
      ],
    };
    server.send(msg);
    expect(getStreamData(store.getState(), 'event-ATDome-1-stream1')).toEqual({
      key11: 'value11',
      key12: 'value12',
    });

    // Unsubscribe M=2 times
    await store.dispatch(removeGroup('event-ATDome-1-stream1'));
    await store.dispatch(removeGroup('event-ATDome-1-stream1'));
    await expect(server).not.toReceiveMessage({
      category: 'event',
      csc: 'ATDome',
      option: 'unsubscribe',
      salindex: '1',
      stream: 'stream1',
    });

    // Still receive message
    msg = {
      category: 'event',
      data: [
        {
          csc: 'ATDome',
          salindex: 1,
          data: {
            stream1: {
              key11: 'value11_2',
              key12: 'value12_2',
            },
            stream2: {
              key21: 'value21_2',
              key22: 'value22_2',
            },
          },
        },
      ],
    };
    server.send(msg);
    expect(getStreamData(store.getState(), 'event-ATDome-1-stream1')).toEqual({
      key11: 'value11_2',
      key12: 'value12_2',
    });

    // Unsubscribe N-M = 1 times
    await store.dispatch(removeGroup('event-ATDome-1-stream1'));
    await expect(server).toReceiveMessage({
      category: 'event',
      csc: 'ATDome',
      option: 'unsubscribe',
      salindex: '1',
      stream: 'stream1',
    });

    // Not receive message
    msg = {
      category: 'event',
      data: [
        {
          csc: 'ATDome',
          salindex: 1,
          data: {
            stream1: {
              key11: 'value11_3',
              key12: 'value12_3',
            },
            stream2: {
              key21: 'value21_3',
              key22: 'value22_3',
            },
          },
        },
      ],
    };
    server.send(msg);
    expect(getStreamData(store.getState(), 'event-ATDome-1-stream1')).toEqual({
      key11: 'value11_2',
      key12: 'value12_2',
    });
  });
});
