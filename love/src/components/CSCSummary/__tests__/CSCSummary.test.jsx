import * as rtl from 'react-testing-library';
import React from 'react';
import 'jest-dom/extend-expect';
import WS from 'jest-websocket-mock';
import CSCSummary from '../CSCSummary';
import { CSCSummaryHierarchy } from '../../../Config';

describe('GIVEN the CSCSummary was loaded and rendered', () => {
  let cscSummary; let
    server;

  beforeEach(async () => {
    // localStorage.setItem('LOVE-TOKEN', '"love-token"');
    // server = new WS('ws://localhost/manager/ws/subscription?token=love-token', { jsonProtocol: true });

    cscSummary = rtl.render(<CSCSummary />);

    // await server.connected;
    // await expect(server).toReceiveMessage({
    //   option: 'subscribe',
    //   category: 'event',
    //   csc: 'CSCSummaryState',
    //   stream: 'stream',
    // });
    // server.send(message);
  });

  afterEach(() => {
    rtl.cleanup();
    // server.close();
  });

  test('THEN it should display the list of realms', async () => {
    const realms = Object.keys(CSCSummaryHierarchy);
    realms.forEach((realmName) => {
      expect(cscSummary.getByText(realmName)).toBeInTheDocument();
    });
  });

  test('THEN it should display the list of groups', async () => {
    const realms = Object.keys(CSCSummaryHierarchy);
    realms.forEach((realmName) => {
      const groupNames = Object.keys(CSCSummaryHierarchy[realmName]);
      groupNames.forEach((groupName) => {
        expect(cscSummary.getByText(groupName)).toBeInTheDocument();
      });
    });
  });

  test('THEN it should display the list of CSCs', async () => {
    const realms = Object.keys(CSCSummaryHierarchy);
    realms.forEach((realmName) => {
      const groupNames = Object.keys(CSCSummaryHierarchy[realmName]);
      groupNames.forEach((groupName) => {
        CSCSummaryHierarchy[realmName][groupName].forEach((cscName) => {
          expect(cscSummary.getByText(cscName)).toBeInTheDocument();
        });
      });
    });
  });
});
