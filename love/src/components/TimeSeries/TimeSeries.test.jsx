import {
    render,
    fireEvent,
    cleanup,
    waitForElement,
    wait,
    getByTestId,
} from 'react-testing-library';
import React from 'react';
import 'jest-dom/extend-expect'
import TimeSeries from './TimeSeries';
import {Server} from 'mock-socket';
import sockette from 'sockette';

/* jest.mock('../../Utils', () => {
    return jest.fn().mockImplementation(() => {
        return {
            subscribeToTelemetry: (name, callback) => {
                const message = {
                    "data": JSON.stringify({
                        "data":{
                            "cameraConfig": {
                                "filterChangeTime": {
                                    "value": 0.8172357870183607,
                                    "dataType": "Float"
                                }
                            }
                        }
                        
                    })
                };
                setTimeout(()=>{
                    
                    //   The callback is called exactly after setState({selectedRows})
                    //    so this timeout gives it some time  until the state is updated 
                    
                    callback(message);

                },1000)
            }
        }
    });
});*/



const telemetries = {
    'interestedProposal': {
      parameters: {},
      receptionTimeStamp: "2018/11/23 21:12:24."
    },
    "bulkCloud": {
      parameters: {
        "bulkCloud": {
          "value": 0.6713680575252166,
          "dataType": "Float"
        },
        "timestamp": {
          "value": 0.5309269973966433,
          "dataType": "Float"
        },
      },
      receptionTimeStamp: "2018/11/25 12:21:12"
    },
    cameraConfig: {
        parameters:{
            "filterChangeTime": {
            "value": 0.8172357870183607,
            "dataType": "Float"
            }
        },

    }
  };

'GIVEN a current list of selected telemetries in the table'
"WHEN the user clicks a checkbox of a specific row"
"AND presses the SET button"
"THEN shows a plot with some text indicating the name of the telemetry"
test('plot works', async () => {
    const timeSeries = render(<TimeSeries telemetries={telemetries}> </TimeSeries>);
    const { getByAltText, getByText, getByTitle, debug, getByTestId } = timeSeries;
    const checkBox = getByAltText('select scheduler-cameraConfig-filterChangeTime');
    fireEvent.click(checkBox);

    expect(getByText('TELEMETRIES:').innerHTML.includes('filterChangeTime')).toBe(true);
    
    const setButton = getByTitle("Set selected telemetries");
    fireEvent.click(setButton);

    await waitForElement(() => getByText("filterChangeTime"));

    setTimeout(()=>{
        const vegaElement = getByText("filterChangeTime");
        expect(vegaElement).toBeTruthy();

    },1000)
});






jest.useFakeTimers();

describe('my ws test', () => {
  it.only('connects', () => {
    const msgs = [];
    const url = 'ws://localhost:8080';
    const mockServer = new Server(url);
    mockServer.on('connection', server => {
        server.send('you are connected');
        debugger;
    });

    debugger;
    const socket = sockette(url,{
        onopen: e => {
            console.log('open');
            debugger;
        },
        onmessage: msg => {
            console.log('callback');
            msgs.push(msg);
            debugger;
        }
    })


    jest.runOnlyPendingTimers();

    expect(msgs.length).toBe(1);
  });
});