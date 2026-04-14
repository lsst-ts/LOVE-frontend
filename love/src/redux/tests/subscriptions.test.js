/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed by Inria Chile.

This program is free software: you can redistribute it and/or modify it under 
the terms of the GNU General Public License as published by the Free Software 
Foundation, either version 3 of the License, or at your option) any later version.

This program is distributed in the hope that it will be useful,but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR 
 A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with 
this program. If not, see <http://www.gnu.org/licenses/>.
*/

import { createStore, applyMiddleware } from 'redux';
import WS from 'jest-websocket-mock';
import thunkMiddleware from 'redux-thunk';
import rootReducer from '../reducers';
import { addGroup, removeGroup, groupStates } from '../actions/ws';
import { doReceiveToken } from '../actions/auth';
import { getAllTelemetries, getAllEvents, getStreamData, getSubscription } from '../selectors';

let store;
let server;

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
    const msg = {
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
    const msg = {
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
    const msg = {
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
    const msg = {
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

  it('When unsubscription is requested, then the subscription status is UNSUBSCRIBING, and when confirmation is received, then the subscription is removed', async () => {
    const eventStream = 'event-CSC-1-stream1';

    // Subscribe to stream
    await store.dispatch(addGroup(eventStream));

    // Add group triggers _requestSubscriptions, which sets status to REQUESTING
    // and sends subscription message to server.
    expect(getSubscription(store.getState(), eventStream)).toEqual({
      groupName: eventStream,
      counter: 1,
      status: groupStates.REQUESTING,
    });
    await expect(server).toReceiveMessage({
      category: 'event',
      csc: 'CSC',
      option: 'subscribe',
      salindex: '1',
      stream: 'stream1',
    });

    // Receive confirmation message, which sets status to SUBSCRIBED
    server.send({
      data: `Successfully subscribed to ${eventStream}`,
    });
    expect(getSubscription(store.getState(), eventStream)).toEqual({
      groupName: eventStream,
      counter: 1,
      status: groupStates.SUBSCRIBED,
      confirmationMessage: `Successfully subscribed to ${eventStream}`,
    });

    // Unsubscribe from stream
    await store.dispatch(removeGroup(eventStream));

    // Remove group sets status to UNSUBSCRIBING, but subscription is not removed until confirmation is received
    expect(getSubscription(store.getState(), eventStream)).toEqual({
      groupName: eventStream,
      counter: 0,
      status: groupStates.UNSUBSCRIBING,
      confirmationMessage: `Successfully subscribed to ${eventStream}`,
    });
    await expect(server).toReceiveMessage({
      category: 'event',
      csc: 'CSC',
      option: 'unsubscribe',
      salindex: '1',
      stream: 'stream1',
    });

    // Receive unsubscription confirmation, which removes subscription
    server.send({
      data: `Successfully unsubscribed to ${eventStream}`,
    });
    expect(getSubscription(store.getState(), eventStream)).toBeFalsy();
  });

  it('Unsusbscription is handled correctly even when _requestSubscriptions is called in the middle with multiple streams', async () => {
    const eventStream1 = 'event-CSC-1-stream1';
    const eventStream2 = 'event-CSC-1-stream2';

    // Subscribe to stream 1
    await store.dispatch(addGroup(eventStream1));

    // Add group triggers _requestSubscriptions, which sets status to REQUESTING
    expect(getSubscription(store.getState(), eventStream1)).toEqual({
      groupName: eventStream1,
      counter: 1,
      status: groupStates.REQUESTING,
    });
    await expect(server).toReceiveMessage({
      category: 'event',
      csc: 'CSC',
      option: 'subscribe',
      salindex: '1',
      stream: 'stream1',
    });

    // Receive confirmation message, which sets status to SUBSCRIBED
    server.send({
      data: `Successfully subscribed to ${eventStream1}`,
    });
    expect(getSubscription(store.getState(), eventStream1)).toEqual({
      groupName: eventStream1,
      counter: 1,
      status: groupStates.SUBSCRIBED,
      confirmationMessage: `Successfully subscribed to ${eventStream1}`,
    });

    // Unsusbscribe from stream 1 and subscribe to stream 2
    await store.dispatch(removeGroup(eventStream1));
    await store.dispatch(addGroup(eventStream2));

    // Remove group sets status to UNSUBSCRIBING, but subscription is not removed until confirmation is received
    expect(getSubscription(store.getState(), eventStream1)).toEqual({
      groupName: eventStream1,
      counter: 0,
      status: groupStates.UNSUBSCRIBING,
      confirmationMessage: `Successfully subscribed to ${eventStream1}`,
    });
    await expect(server).toReceiveMessage({
      category: 'event',
      csc: 'CSC',
      option: 'unsubscribe',
      salindex: '1',
      stream: 'stream1',
    });

    // Add group triggers _requestSubscriptions, which sets status to REQUESTING.
    // This should only set status to REQUESTING for eventStream2, but not change the status of eventStream1, which is UNSUBSCRIBING.
    expect(getSubscription(store.getState(), eventStream2)).toEqual({
      groupName: eventStream2,
      counter: 1,
      status: groupStates.REQUESTING,
    });
    await expect(server).toReceiveMessage({
      category: 'event',
      csc: 'CSC',
      option: 'subscribe',
      salindex: '1',
      stream: 'stream2',
    });

    // Receive unsubscription confirmation for stream1, which removes subscription
    server.send({
      data: `Successfully unsubscribed to ${eventStream1}`,
    });
    expect(getSubscription(store.getState(), eventStream1)).toBeFalsy();

    // Receive subscription confirmation for stream2, which sets status to SUBSCRIBED
    server.send({
      data: `Successfully subscribed to ${eventStream2}`,
    });
    expect(getSubscription(store.getState(), eventStream2)).toEqual({
      groupName: eventStream2,
      counter: 1,
      status: groupStates.SUBSCRIBED,
      confirmationMessage: `Successfully subscribed to ${eventStream2}`,
    });
  });
});
