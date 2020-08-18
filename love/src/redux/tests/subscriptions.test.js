import { createStore, applyMiddleware } from 'redux';
import WS from 'jest-websocket-mock';
import rootReducer from '../reducers';
import thunkMiddleware from 'redux-thunk';
import { addGroup, removeGroup, groupStates } from '../actions/ws';
import { doReceiveToken } from '../actions/auth';
import { getAllTelemetries, getAllEvents, getStreamData, getSubscription } from '../selectors';

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

  it(`When subscriptions are added, then they are counted, and when they are removed, 
  they are discounted, and unsubscription is only requested when counter equals 0`, async () => {
    // Subscribe
    // N = 0
    expect(getSubscription(store.getState(), 'event-ATDome-1-stream1')).toBeFalsy();
    // N = 1
    await store.dispatch(addGroup('event-ATDome-1-stream1'));
    expect(getSubscription(store.getState(), 'event-ATDome-1-stream1')).toEqual({
      groupName: 'event-ATDome-1-stream1',
      counter: 1,
      status: groupStates.REQUESTING,
    });
    server.send({
      data: 'Successfully subscribed to event-ATDome-1-stream1',
    });
    expect(getSubscription(store.getState(), 'event-ATDome-1-stream1')).toEqual({
      groupName: 'event-ATDome-1-stream1',
      counter: 1,
      status: groupStates.SUBSCRIBED,
      confirmationMessage: 'Successfully subscribed to event-ATDome-1-stream1',
    });
    await expect(server).toReceiveMessage({
      category: 'event',
      csc: 'ATDome',
      option: 'subscribe',
      salindex: '1',
      stream: 'stream1',
    });
    // N = 2
    await store.dispatch(addGroup('event-ATDome-1-stream1'));
    expect(getSubscription(store.getState(), 'event-ATDome-1-stream1')).toEqual({
      groupName: 'event-ATDome-1-stream1',
      counter: 2,
      status: groupStates.SUBSCRIBED,
      confirmationMessage: 'Successfully subscribed to event-ATDome-1-stream1',
    });
    // N = 3
    await store.dispatch(addGroup('event-ATDome-1-stream1'));
    expect(getSubscription(store.getState(), 'event-ATDome-1-stream1')).toEqual({
      groupName: 'event-ATDome-1-stream1',
      counter: 3,
      status: groupStates.SUBSCRIBED,
      confirmationMessage: 'Successfully subscribed to event-ATDome-1-stream1',
    });

    // Unsubscribe
    // N = 2
    await store.dispatch(removeGroup('event-ATDome-1-stream1'));
    expect(getSubscription(store.getState(), 'event-ATDome-1-stream1')).toEqual({
      groupName: 'event-ATDome-1-stream1',
      counter: 2,
      status: groupStates.SUBSCRIBED,
      confirmationMessage: 'Successfully subscribed to event-ATDome-1-stream1',
    });
    // N = 1
    await store.dispatch(removeGroup('event-ATDome-1-stream1'));
    expect(getSubscription(store.getState(), 'event-ATDome-1-stream1')).toEqual({
      groupName: 'event-ATDome-1-stream1',
      counter: 1,
      status: groupStates.SUBSCRIBED,
      confirmationMessage: 'Successfully subscribed to event-ATDome-1-stream1',
    });
    // N = 0
    await store.dispatch(removeGroup('event-ATDome-1-stream1'));
    expect(getSubscription(store.getState(), 'event-ATDome-1-stream1')).toEqual({
      groupName: 'event-ATDome-1-stream1',
      counter: 0,
      status: groupStates.UNSUBSCRIBING,
      confirmationMessage: 'Successfully subscribed to event-ATDome-1-stream1',
    });
    await expect(server).toReceiveMessage({
      category: 'event',
      csc: 'ATDome',
      option: 'unsubscribe',
      salindex: '1',
      stream: 'stream1',
    });
    server.send({
      data: 'Successfully unsubscribed to event-ATDome-1-stream1',
    });
    expect(getSubscription(store.getState(), 'event-ATDome-1-stream1')).toBeFalsy();
  });
});
