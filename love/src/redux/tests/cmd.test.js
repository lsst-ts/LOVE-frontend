import { createStore, applyMiddleware } from 'redux';
import WS from 'jest-websocket-mock';
import rootReducer from '../reducers';
import thunkMiddleware from 'redux-thunk';
import {
  requestSALCommand,
  openWebsocketConnection,
} from '../actions/ws';
import { SALCommandStatus } from '../actions/ws';
import {
  getLastSALCommand,
} from '../selectors';

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

it('Should send a command to the server and save it on the state properly', async () => {
  const commandObject = {
    cmd: 'cmd_closeShutter',
    params: {},
    component: 'ATDome',
    cmd_id: '10-cmd_closeShutter',
    salindex: 2,
  };
  const realDate = Date;
  global.Date.now = () => 10;

  await store.dispatch(requestSALCommand(commandObject));

  await expect(server).toReceiveMessage({
    category: 'cmd',
    data: [
      {
        csc: 'ATDome',
        data: { stream: { cmd: 'cmd_closeShutter', cmd_id: '10-cmd_closeShutter', params: {} } },
        salindex: 2,
      },
    ],
  });

  expect(getLastSALCommand(store.getState())).toEqual({
    status: SALCommandStatus.REQUESTED,
    ...commandObject,
  });
  global.Date = realDate;
});

it('Should properly interpret an ack message', async () => {
  const commandObject = {
    cmd: 'cmd_closeShutter',
    params: {},
    component: 'ATDome',
    cmd_id: '10-cmd_closeShutter',
  };
  const realDate = Date;
  global.Date.now = () => 10;

  await store.dispatch(requestSALCommand(commandObject));
  await server.nextMessage;

  server.send({
    category: 'ack',
    data: [
      {
        csc: 'ATDome',
        data: { stream: { cmd: 'cmd_closeShutter', cmd_id: '10-cmd_closeShutter', params: {}, result: 'Done' } },
        salindex: 1,
      },
    ],
  });

  await expect(getLastSALCommand(store.getState())).toEqual({
    status: SALCommandStatus.ACK,
    result: 'Done',
    ...commandObject,
  });
  global.Date = realDate;
});
