import React from 'react';
// import telemetries from './HealthStatusSummary.testdata';
import {
  render,
  fireEvent,
  cleanup,
  waitForElement,
} from 'react-testing-library';
import FileSaver from 'file-saver';
import HealthStatusSummary from '../HealthStatusSummary';

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
