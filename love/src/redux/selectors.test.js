import { getStreamData, getCameraState } from './selectors';
import { createStore, applyMiddleware } from 'redux';
import rootReducer from './reducers';
import WS from 'jest-websocket-mock';
import { openWebsocketConnection, requestGroupSubscription } from './actions/ws';
import thunkMiddleware from 'redux-thunk';
import logger from 'redux-logger';
import { imageStatus } from '../Config';

let store, server;
beforeEach(() => {
  store = createStore(rootReducer, applyMiddleware(thunkMiddleware));
  localStorage.setItem('LOVE-TOKEN', '"love-token"');
  server = new WS('ws://localhost/manager/ws/subscription?token=love-token', { jsonProtocol: true });
});

afterEach(() => {
  localStorage.removeItem('LOVE-TOKEN');
  server.close();
});

it('Should extract the stream correctly with a selector', async () => {
  // Arrange
  const data = {
    Environment: {
      airPressure: {
        paAvg1M: { value: 0.12092732556005037, dataType: 'Float' },
        pateValue3H: { value: 0.2811193740140766, dataType: 'Float' },
        patrValue3H: { value: 0.04326551449696192, dataType: 'Float' },
        sensorName: { value: 'c', dataType: 'String' },
      },
    },
  };
  const groupName = 'telemetry-Environment-airPressure';

  // Act
  store.dispatch(openWebsocketConnection());
  await server.connected;
  await store.dispatch(requestGroupSubscription(groupName));
  server.send({ category: 'telemetry', data: data });
  const streamData = getStreamData(store.getState(), groupName);

  // Assert
  expect(JSON.stringify(streamData)).toEqual(JSON.stringify(data.Environment.airPressure));
});
describe('Test image sequence data passes correctly to component', () => {
  const sequenceData = [
    {
      exposureTime: {
        value: 5,
        dataType: 'Float',
      },
      imageIndex: {
        value: 0,
        dataType: 'Int',
      },
      imageName: {
        value: 'Image 1',
        dataType: 'String',
      },
      imageSequenceName: {
        value: 'Image sequence 1',
        dataType: 'String',
      },
      imagesInSequence: {
        value: 2,
        dataType: 'Int',
      },
      priority: {
        value: 1,
        dataType: 'Int',
      },
      timeStamp: {
        value: 1558368052.999,
        dataType: 'Float',
      },
    },
    {
      exposureTime: {
        value: 6,
        dataType: 'Float',
      },
      imageIndex: {
        value: 1,
        dataType: 'Int',
      },
      imageName: {
        value: 'Image 2',
        dataType: 'String',
      },
      imageSequenceName: {
        value: 'Image sequence 1',
        dataType: 'String',
      },
      imagesInSequence: {
        value: 2,
        dataType: 'Int',
      },
      priority: {
        value: 1,
        dataType: 'Int',
      },
      timeStamp: {
        value: 1558568052.999,
        dataType: 'Float',
      },
    },
  ];
  
  const imageStages = [
    ['startIntegration', imageStatus.INTEGRATING],
    ['startReadout', imageStatus.READING_OUT],
    ['endReadout', imageStatus.END_READOUT],
    ['endOfImageTelemetry', imageStatus.END_TELEMETRY],
  ].forEach((stagePair) => {
    it(`Should extract ${stagePair[0]} data from image sequence message`, async () => {
      // Arrange
      const data = {
        ATCamera: {
          [stagePair[0]]: sequenceData,
        },
      };
    
      const result = {
        imageSequence: {
          images: {
            'Image 1': {
              timeStamp: 1558368052.999,
              imageIndex: 0,
              exposureTime: 5,
              state: stagePair[1],
            },
            'Image 2': {
              timeStamp: 1558568052.999,
              imageIndex: 1,
              exposureTime: 6,
              state: stagePair[1],
            },
          },
          name: 'Image sequence 1',
          imagesInSequence: 2,
        },
      };
      const groupName = `event-ATCamera-${stagePair[0]}`;
    
      // Act
      store.dispatch(openWebsocketConnection());
      await server.connected;
      await store.dispatch(requestGroupSubscription(groupName));
      server.send({ category: 'event', data: data });
      const streamData = getCameraState(store.getState(), groupName);
      // Assert
      expect(JSON.stringify(streamData.imageSequence)).toBe(JSON.stringify(result.imageSequence));
    });
  })

});

// it('Should extract the token correctly with a selector', async ()=>{
//   expect(1).toEqual(1);
// })
