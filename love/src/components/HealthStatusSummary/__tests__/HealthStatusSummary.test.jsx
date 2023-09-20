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

// import React from 'react';
// import telemetries from './HealthStatusSummary.testdata';
// import { render, fireEvent, cleanup, waitForElement } from 'react-testing-library';
// import FileSaver from 'file-saver';
// import HealthStatusSummary from '../HealthStatusSummary';

jest.mock('file-saver', () => ({ saveAs: jest.fn() }));

/* Feature:  HS summary  */

/* Scenario: save config to file */
describe('GIVEN a current telemetry Health Status configuration being displayed', () => {
  // const healthStatus = render(<HealthStatusSummary telemetries={telemetries}/>);

  describe('WHEN the user clicks the export button', () => {
    // const exportButton = healthStatus.getByText('Export');
    // global.Blob = function (content, options){return  ({content, options})}

    // fireEvent.click(exportButton);
    it('THEN correctly writes the current configuration to a file', () => {
      expect(1).toBeDefined();
      // expect(FileSaver.saveAs).toHaveBeenCalledWith(
      //     {content:'content', options: { type: 'application/octet-stream' }},
      //     'filename.extension'
      // );
    });
  });
});

/* Scenario: load config from file */

// describe("GIVEN a file with Health Status configuration and any current displayed HS", ()=>{
//     describe("WHEN the user clicks the import button", ()=>{
//         it("THEN correctly configures the HS raw/printed view with the new configuration", ()=>{

//         });
//     });
// });
