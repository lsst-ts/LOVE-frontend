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
import TimeSeries from '../TimeSeries';
import {Server} from 'mock-socket';

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
jest.useFakeTimers();

describe('my ws test', () => {
  it('connects', async () => {
    process.env.REACT_APP_WEBSOCKET_HOST  = 'mockhost:8000';
    const url = 'ws://' + process.env.REACT_APP_WEBSOCKET_HOST + '/ws/subscription/';
    const mockServer = new Server(url);
    const messageObject =  {
            data:{
                cameraConfig: {
                    filterChangeTime: {
                        value: 0.8172357870183607,
                        dataType: "Float"
                    }
                }
            }    
    };
    mockServer.on('connection', socket => {
        socket.send(JSON.stringify(messageObject));
        socket.close();
    });
      
    const timeSeries = render(<TimeSeries telemetries={telemetries}> </TimeSeries>);
    const { getByAltText, getByText, getByTitle, debug, getByTestId } = timeSeries;
    const checkBox = getByAltText('select scheduler-cameraConfig-filterChangeTime');
    fireEvent.click(checkBox);

    expect(getByText('TELEMETRIES:').innerHTML.includes('filterChangeTime')).toBe(true);
    
    const setButton = getByTitle("Set selected telemetries");
    fireEvent.click(setButton);
    
    jest.runOnlyPendingTimers();

    
    await waitForElement(() => getByText("filterChangeTime"));
    const vegaElement = getByText("filterChangeTime");
    expect(vegaElement).toBeTruthy();


  });
});

'GIVEN a current list of selected telemetries in the table'
"WHEN the user clicks a checkbox of a specific row"
"AND presses the SET button"
"THEN shows a plot with some text indicating the name of the telemetry"

// jest.useFakeTimers();
describe('date picker test', () => {
  it('works', async () => {
    const timeSeries = render(<TimeSeries telemetries={telemetries}> </TimeSeries>);
    const { getByAltText, getByText, getByTitle, debug, getByPlaceholderText } = timeSeries;
    const checkBox = getByAltText('select scheduler-cameraConfig-filterChangeTime');
    fireEvent.click(checkBox);

    expect(getByText('TELEMETRIES:').innerHTML.includes('filterChangeTime')).toBe(true);
    
    const setButton = getByTitle("Set selected telemetries");
    fireEvent.click(setButton);
    
    
    
    await waitForElement(() => getByAltText("Live/query mode toggle"));
    
    // await waitForElement(() => getByText("filterChangeTime"));

    const toggleButton = getByAltText("Live/query mode toggle");
    expect(toggleButton).toBeTruthy();
    fireEvent.click(toggleButton);
    // jest.runOnlyPendingTimers();
    // console.log(toggleButton)
    // console.log(timeSeries)
    // debug();
    // done();
    // await wait(() => {
    //     console.log('AIUDSHDSIUHS')
    // })
    // await waitForElement(() => {
    //     // getByPlaceholderText("Click to set initial date");
    //     return getByPlaceholderText("Click to set final date");
    // });
    // // const initialDatePicker = getByPlaceholderText("Click to set initial date");
    // const finalDatePicker = getByPlaceholderText("Click to set final date");
    // // expect(initialDatePicker).toBeTruthy();
    // expect(finalDatePicker).toBeTruthy();
    // console.log(finalDatePicker)


  });
});