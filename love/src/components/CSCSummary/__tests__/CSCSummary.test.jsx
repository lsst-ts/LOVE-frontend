/** This file is part of LOVE-frontend.

Developed for Inria Chile Tech Team.

See the COPYRIGHT file at the top-level directory of this distribution
for details of code ownership.

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.*/

import * as rtl from 'react-testing-library';
import React from 'react';
import 'jest-dom/extend-expect';
import CSCSummary from '../CSCSummary';
import { CSCSummaryHierarchy } from '../../../Config';

describe('GIVEN the CSCSummary was loaded and rendered', () => {
  let cscSummary;

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
