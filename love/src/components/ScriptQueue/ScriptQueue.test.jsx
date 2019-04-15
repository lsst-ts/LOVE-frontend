import {
  render,
  fireEvent,
  cleanup,
  waitForElement,
  wait,
  getByTestId,
  getByText,
  getAllByText,
} from 'react-testing-library';
import React from 'react';
import 'jest-dom/extend-expect';
import WS from 'jest-websocket-mock';
import ScriptQueue from '../ScriptQueue/ScriptQueue';
import message from './QueueMessage';

describe('GIVEN the ScriptQueue was loaded and rendered', () => {
  let scriptQueue, server;

  beforeEach(async () => {
    localStorage.setItem('LOVE-TOKEN', '"love-token"');
    server = new WS('ws://localhost/manager/ws/subscription?token=love-token', { jsonProtocol: true });

    scriptQueue = render(<ScriptQueue />);

    await server.connected;
    await expect(server).toReceiveMessage({
      option: 'subscribe',
      category: 'event',
      csc: 'ScriptQueueState',
      stream: 'stream',
    });
    server.send(message);
  });

  afterEach(cleanup);

  it(`THEN should display the list of available scripts`, async () => {
    const availableListColumn = await waitForElement(() =>
      scriptQueue.getByText((content, el) => {
        return (
          el.textContent.includes('AVAILABLE SCRIPTS') &&
          !el.textContent.includes('WAITING')
        );
      }),
    );

    message.data.ScriptQueueState.stream.available_scripts.forEach(async (script) => {
      const scriptPath = script.path;
      let scriptName = scriptPath.split('/');
      scriptName = scriptName[scriptName.length - 1];
      const scriptType = script.type.toLowerCase();
      const b = getAllByText;
      let scriptElements = await waitForElement(() => getAllByText(availableListColumn, scriptName));

      const checks = scriptElements.filter((scriptElement) => {
        const parent = scriptElement.parentElement.parentElement;
        return parent.textContent.includes(scriptPath) && parent.textContent.toLowerCase().includes(scriptType);
      });

      expect(checks.length).toEqual(1);
    });

  });
});

('se ven los salindex  current, waiting available, finished');
('se ve el heartbeat de los scripts');
('el tooltip del heratbeat está bueno');
('el tooltip del process state/ script state está bueno');
