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

// 'GIVEN a current list of selected telemetries in the table'
// "WHEN the user clicks a checkbox of a specific row"
// "AND presses the SET button"
// "THEN shows a plot with some text indicating the name of the telemetry"
// jest.useFakeTimers();

// test(`
// GIVEN a current list of telemetries
// WHEN the user selects one telemetry with a checkbox
// AND presses the set button
// AND toggles to query mode
// AND chooses a specific date-range
// THEN it should update the plot accordingly
// `, async () => {
//     const timeSeries = render(<TimeSeries telemetries={telemetries}> </TimeSeries>);
//     const { getByAltText, getByText, getByTitle, debug, getByPlaceholderText } = timeSeries;
//     const checkBox = getByAltText('select scheduler-cameraConfig-filterChangeTime');
//     fireEvent.click(checkBox);

//     expect(getByText('TELEMETRIES:').innerHTML.includes('filterChangeTime')).toBe(true);
    
//     const setButton = getByTitle("Set selected telemetries");
//     fireEvent.click(setButton);

    

// });

// GIVEN a current list of telemetries
// WHEN the user selects one telemetry with a checkbox
// AND presses the set button
// AND chooses any timewindow
// THEN it should update the plot accordingly
describe(`
GIVEN the user has selected a telemetry from the table and pressed SET
`, () => {
    let timeSeries, mockServer;
    beforeAll( () => {
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
    
    
        const RealDate = Date;
        global.Date = jest.fn( function(...args){
            if(args.length){
                return new RealDate(...args);
            }
            return new RealDate(2019,0,1);
        });
        global.Date.parse = RealDate.parse;

        Object.defineProperty(global.Date, Symbol.hasInstance, {
            value(target) {
                return target instanceof RealDate;
            }
        });
        
    });

    afterAll( ()=>{
        mockServer.stop();
    });

    beforeEach( async ()=>{
        timeSeries = render(<TimeSeries telemetries={telemetries}> </TimeSeries>);
        const checkBox = timeSeries.getByAltText('select scheduler-cameraConfig-filterChangeTime');
        fireEvent.click(checkBox);
    
        expect(timeSeries.getByText('TELEMETRIES:').innerHTML.includes('filterChangeTime')).toBe(true);
        
        const setButton = timeSeries.getByTitle("Set selected telemetries");
        fireEvent.click(setButton);


        await waitForElement(()=> timeSeries.getByText('1h'));
    })

    test(`WHEN the plot-view shows up
        THEN it displays the name of the selected telemetry in a legend`
        , async () =>{
        await waitForElement(() => timeSeries.getByText("filterChangeTime"));
        const vegaElement = timeSeries.getByText("filterChangeTime");
        expect(vegaElement).toBeTruthy();
    });

    test(`WHEN the user chooses a date range in query mode
          THEN the plot updates accordingly`
        , async () =>{
        await waitForElement(() => timeSeries.getByAltText("Live/query mode toggle"));

        const toggleButton = timeSeries.getByAltText("Live/query mode toggle");
        expect(toggleButton).toBeTruthy();
        const a = fireEvent;
        fireEvent.click(toggleButton);
    
        await waitForElement(() => {
            return timeSeries.getByPlaceholderText("Click to set initial date") &&  timeSeries.getByPlaceholderText("Click to set final date")
        });
    
        const initialDateInput = timeSeries.getByPlaceholderText("Click to set initial date");
    
        fireEvent.click(initialDateInput);
    
        await waitForElement(() => timeSeries.getByText('5'));
        const dayFive = timeSeries.getByText('5');
        fireEvent.click(dayFive)
        
        
        
        const finalDateInput = timeSeries.getByPlaceholderText("Click to set final date");
        fireEvent.mouseDown(finalDateInput)
        fireEvent.click(finalDateInput);
        await waitForElement(() => {
            return timeSeries.getAllByText('11').length === 2
        });
        
        
        const dayEleven = timeSeries.queryAllByText('11')[1];
        fireEvent.click(dayEleven)
        fireEvent.mouseDown(initialDateInput)
           
        await waitForElement(()=> timeSeries.getByText('12 PM'));
    
        const axisDateString = timeSeries.getByText('12 PM');
        expect(axisDateString).toBeTruthy();
    });


    test(`WHEN the user selects a time window of 1h 
        THEN the plot shows las 1h of data`, async ()=>{


        await waitForElement(() => timeSeries.getByText('1h'));

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
    });

    test(`WHEN the user selects a time window of 15min 
        THEN the plot shows las 1h of data`, async () =>{

        fireEvent.click(timeSeries.getByLabelText('15min'))
        await waitForElement( () => timeSeries.queryAllByText(':', {exact:false}));
        
        const timeAxisLabels = timeSeries.queryAllByText(':',{exact:false})
                            .filter(el=>el.textContent.length <=5 && el.textContent.length>=3)
                            .map(el=>el.textContent);
        const now = new Date();
        const minAxisDate = timeAxisLabels[0].split(':').map(val=>parseFloat(val));
        const maxAxisDate = timeAxisLabels[timeAxisLabels.length-1].split(':').map(val=>parseFloat(val))
        expect(maxAxisDate[0]*60+maxAxisDate[1] - (minAxisDate[0]*60+minAxisDate[1])).toBeGreaterThanOrEqual(10);
        expect(maxAxisDate[0]*60+maxAxisDate[1] - (minAxisDate[0]*60+minAxisDate[1])).toBeLessThanOrEqual(15);
    });

    test(`WHEN the user selects a time window of 15min 
        THEN the plot shows las 15min of data`, async ()=>{
        /** 1min */

        await waitForElement(() => timeSeries.getByText('1min'));

        fireEvent.click(timeSeries.getByLabelText('1min'))
        await waitForElement( () => timeSeries.queryAllByText(':', {exact:false}));
        
        const timeAxisLabels = timeSeries.queryAllByText(':',{exact:false})
                            .filter(el=>el.textContent.length <=5 && el.textContent.length>=3)
                            .map(el=>el.textContent);
                            
        let referenceIndex = timeAxisLabels.findIndex(el=> el.length === 5)

        let minAxisDate = timeAxisLabels[0].split(':').map(val=>parseFloat(val));
        let maxAxisDate = timeAxisLabels[timeAxisLabels.length-1].split(':').map(val=>parseFloat(val))
                        
        if(!isNaN(minAxisDate[0]) ){
            minAxisDate = [NaN, 0]
        }

        if(!isNaN(maxAxisDate[0]) ){
            maxAxisDate[0] = [NaN, 0]
        }
        let difference = Math.min(Math.abs(maxAxisDate[1]-minAxisDate[1]-60),Math.abs(maxAxisDate[1]-minAxisDate[1]));
        expect(difference).toEqual(5);
        expect(referenceIndex).toBeGreaterThanOrEqual(0)
    });
                        
    test(`WHEN the user types a custom time window of 300 min
        THEN the plot shows last 300 min of data`, async () =>{
        fireEvent.click(timeSeries.getByText('Custom'));
    
        await waitForElement(()=>timeSeries.getByText('minutes'));
        const customTimeWindowInput = timeSeries.getByLabelText('Custom');
        
        fireEvent.change(customTimeWindowInput,{target:{value:'300'}});
        
        await waitForElement( ()=> timeSeries.getByValue('300'));
        
        const timeAxisLabels = timeSeries.queryAllByText(':',{exact:false})
        .filter(el=>el.textContent.length <=5 && el.textContent.length>=3)
        .map(el=>el.textContent);
    
        const minAxisDate = timeAxisLabels[0].split(':').map(val=>parseFloat(val));
        const maxAxisDate = timeAxisLabels[timeAxisLabels.length-1].split(':').map(val=>parseFloat(val))
    
        const difference = Math.min( Math.abs((maxAxisDate[0]+12)*60+maxAxisDate[1] - (minAxisDate[0]*60+minAxisDate[1])));
        expect(difference).toEqual(270);

    });
    
});