import * as rtl from 'react-testing-library';
import React from 'react';
import 'jest-dom/extend-expect';
import WS from 'jest-websocket-mock';
import ScriptQueue from '../ScriptQueue/ScriptQueue';
import message from './QueueMessage';

const findFirstParent = (element, criteria) => {
  if (criteria(element)) return element;

  if (!element.parentElement) return null;

  return findFirstParent(element.parentElement, criteria);
};

describe('GIVEN the ScriptQueue was loaded and rendered', () => {
  let scriptQueue, server;

  beforeEach(async () => {
    localStorage.setItem('LOVE-TOKEN', '"love-token"');
    server = new WS('ws://localhost/manager/ws/subscription?token=love-token', { jsonProtocol: true });

    scriptQueue = rtl.render(<ScriptQueue />);

    await server.connected;
    await expect(server).toReceiveMessage({
      option: 'subscribe',
      category: 'event',
      csc: 'ScriptQueueState',
      stream: 'stream',
    });
    server.send(message);
  });

  afterEach(() => {
    rtl.cleanup();
    server.close();
  });

  it(`THEN should display the list of available scripts`, async () => {
    const availableListColumn = await rtl.waitForElement(() =>
      scriptQueue.getByText((content, el) => {
        return el.textContent.includes('AVAILABLE SCRIPTS') && !el.textContent.includes('WAITING');
      }),
    );

    message.data.ScriptQueueState.stream.available_scripts.forEach(async (script) => {
      const scriptPath = script.path;
      let scriptName = scriptPath.split('/');
      scriptName = scriptName[scriptName.length - 1];
      const scriptType = script.type.toLowerCase();
      let scriptElements = await rtl.waitForElement(() => rtl.getAllByText(availableListColumn, scriptName));

      const checks = scriptElements.filter((scriptElement) => {
        const parent = scriptElement.parentElement.parentElement;
        return parent.textContent.includes(scriptPath) && parent.textContent.toLowerCase().includes(scriptType);
      });

      expect(checks.length).toEqual(1);
    });
  });

  it(`THEN should display the list of waiting scripts`, async () => {
    const waitingListColumn = await rtl.waitForElement(() =>
      scriptQueue.getByText((content, el) => {
        return el.textContent.includes('WAITING') && !el.textContent.includes('AVAILABLE SCRIPTS');
      }),
    );

    message.data.ScriptQueueState.stream.waiting_scripts.forEach(async (script) => {
      let scripIndex = '' + script.index;
      let scriptElement = await rtl.waitForElement(() =>
        rtl.getByText(waitingListColumn, scripIndex, { exact: false }),
      );

      const firstParentMatching = findFirstParent(scriptElement, (element) => {
        const hasType = element.textContent.includes(`${script.type}`.toUpperCase());
        const hasPath = element.textContent.includes(`${script.path}`);
        const hasProcessState = element.textContent.includes(`Process state${script.process_state}`);
        const hasScriptState = element.textContent.includes(`Script state${script.script_state}`);
        const hasEstimatedTime = element.textContent.includes(`Estimated time: ${script.expected_duration.toFixed(2)}`);

        return hasType && hasPath && hasProcessState && hasScriptState && hasEstimatedTime;
      });

      expect(firstParentMatching).toBeTruthy();
    });
  });
});

('se ven los salindex  current, waiting available, finished');
('se ve el heartbeat de los scripts');
('el tooltip del heratbeat está bueno');
('el tooltip del process state/ script state está bueno');
