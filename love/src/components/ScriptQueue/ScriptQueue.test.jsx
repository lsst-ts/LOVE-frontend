import { render, fireEvent, cleanup, waitForElement, wait, getByTestId } from 'react-testing-library';
import React from 'react';
import 'jest-dom/extend-expect';
import WS from 'jest-websocket-mock';

import sockette from 'sockette';
import ScriptQueue from '../ScriptQueue/ScriptQueue';
import message from './QueueMessage';


describe('my ws test', () => {
  test.only('asdf', async () => {
    localStorage.setItem('LOVE-TOKEN', '"love-token"');
    const server = new WS('ws://localhost/manager/ws/subscription?token=love-token', { jsonProtocol: true });

    debugger;
    let scriptQueue = render(<ScriptQueue />);

    await server.connected;
    await expect(server).toReceiveMessage({
      option: 'subscribe',
      category: 'event',
      csc: 'ScriptQueueState',
      stream: 'stream',
    });

    
    server.send(message);
  });
  
});
