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

afterEach(cleanup);

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
    mockServer.stop();


  });
});

test(`
GIVEN a current list of telemetries
WHEN the user selects one telemetry with a checkbox
AND presses the set button
AND toggles to query mode
AND chooses a specific date-range
THEN it should update the plot accordingly
`, async () => {
    const timeSeries = render(<TimeSeries telemetries={telemetries}> </TimeSeries>);
    const { getByAltText, getByText, getByTitle, debug, getByPlaceholderText } = timeSeries;
    const checkBox = getByAltText('select scheduler-cameraConfig-filterChangeTime');
    fireEvent.click(checkBox);

    expect(getByText('TELEMETRIES:').innerHTML.includes('filterChangeTime')).toBe(true);
    
    const setButton = getByTitle("Set selected telemetries");
    fireEvent.click(setButton);

    await waitForElement(() => getByAltText("Live/query mode toggle"));

    const toggleButton = getByAltText("Live/query mode toggle");
    expect(toggleButton).toBeTruthy();
    const a = fireEvent;
    fireEvent.click(toggleButton);

    await waitForElement(() => {
        return getByPlaceholderText("Click to set initial date") &&  getByPlaceholderText("Click to set final date")
    });

    const initialDateInput = getByPlaceholderText("Click to set initial date");

    fireEvent.click(initialDateInput);

    await waitForElement(() => getByText('5'));
    const dayFive = getByText('5');
    fireEvent.click(dayFive)
    
    
    
    const finalDateInput = getByPlaceholderText("Click to set final date");
    fireEvent.mouseDown(finalDateInput)
    fireEvent.click(finalDateInput);
    await waitForElement(() => {
        return timeSeries.getAllByText('11').length === 2
    });
    
    
    const dayEleven = timeSeries.queryAllByText('11')[1];
    fireEvent.click(dayEleven)
    fireEvent.mouseDown(initialDateInput)


    await waitForElement(()=> getByText('12 PM'));

    const axisDateString = getByText('12 PM');
    expect(axisDateString).toBeTruthy();

});



test(`
GIVEN a current list of telemetries
WHEN the user selects one telemetry with a checkbox
AND presses the set button
AND chooses any timewindow
THEN it should update the plot accordingly
`, async () => {
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
    });

    const timeSeries = render(<TimeSeries telemetries={telemetries}> </TimeSeries>);
    const { getByAltText, getByText, getByTitle, debug, getByPlaceholderText } = timeSeries;
    const checkBox = getByAltText('select scheduler-cameraConfig-filterChangeTime');
    fireEvent.click(checkBox);

    expect(getByText('TELEMETRIES:').innerHTML.includes('filterChangeTime')).toBe(true);
    
    const setButton = getByTitle("Set selected telemetries");
    fireEvent.click(setButton);


    /** 1h */

    await waitForElement(() => getByText('1h'));

    fireEvent.click(timeSeries.getByLabelText('1h'))
    await waitForElement( () => timeSeries.queryAllByText(':', {exact:false}));
    
    let timeAxisLabels = timeSeries.queryAllByText(':',{exact:false})
                        .filter(el=>el.textContent.length ===5)
                        .map(el=>el.textContent);
                        
                        

    let now = new Date();
    let minAxisDate = timeAxisLabels[0].split(':').map(val=>parseFloat(val));
    let maxAxisDate = timeAxisLabels[timeAxisLabels.length-1].split(':').map(val=>parseFloat(val))
                        
                        
                        
    let T  = (now.getUTCHours() % 12) * 60 + now.getUTCMinutes();
    let T1 = (Math.floor((T-60)/5)*5 +5 ) % (12*60);
    let T2 = (T1 + 55) % (12 * 60);
    expect(Math.abs(minAxisDate[0]*60+minAxisDate[1]-T1)).toBeLessThanOrEqual(5);
    expect(Math.abs(maxAxisDate[0]*60+maxAxisDate[1]-T2)).toBeLessThanOrEqual(5);

    /** 15 min */

    await waitForElement(() => getByText('15min'));

    fireEvent.click(timeSeries.getByLabelText('15min'))
    await waitForElement( () => timeSeries.queryAllByText(':', {exact:false}));
    
    timeAxisLabels = timeSeries.queryAllByText(':',{exact:false})
                        .filter(el=>el.textContent.length <=5 && el.textContent.length>=3)
                        .map(el=>el.textContent);
    now = new Date();
    minAxisDate = timeAxisLabels[0].split(':').map(val=>parseFloat(val));
    maxAxisDate = timeAxisLabels[timeAxisLabels.length-1].split(':').map(val=>parseFloat(val))
    expect(maxAxisDate[0]*60+maxAxisDate[1] - (minAxisDate[0]*60+minAxisDate[1])).toBeGreaterThanOrEqual(10);
    expect(maxAxisDate[0]*60+maxAxisDate[1] - (minAxisDate[0]*60+minAxisDate[1])).toBeLessThanOrEqual(15);

    /** 1min */

    await waitForElement(() => getByText('1min'));

    fireEvent.click(timeSeries.getByLabelText('1min'))
    await waitForElement( () => timeSeries.queryAllByText(':', {exact:false}));
    
    timeAxisLabels = timeSeries.queryAllByText(':',{exact:false})
                        .filter(el=>el.textContent.length <=5 && el.textContent.length>=3)
                        .map(el=>el.textContent);
                        
    let referenceIndex = timeAxisLabels.findIndex(el=> el.length === 5)

    now = new Date();
    minAxisDate = timeAxisLabels[0].split(':').map(val=>parseFloat(val));
    maxAxisDate = timeAxisLabels[timeAxisLabels.length-1].split(':').map(val=>parseFloat(val))
                       
    if(!isNaN(minAxisDate[0]) ){
        minAxisDate = [NaN, 0]
    }

    if(!isNaN(maxAxisDate[0]) ){
        maxAxisDate[0] = [NaN, 0]
    }
    const difference = Math.min(Math.abs(maxAxisDate[1]-minAxisDate[1]-60),Math.abs(maxAxisDate[1]-minAxisDate[1]));
    expect(difference).toEqual(5);
    expect(referenceIndex).toBeGreaterThanOrEqual(0)
    
});
