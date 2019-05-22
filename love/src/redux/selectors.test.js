import { getStreamData, getCameraState } from './selectors';
import { createStore, applyMiddleware } from 'redux';
import rootReducer from './reducers';
import WS from 'jest-websocket-mock';
import { openWebsocketConnection, requestGroupSubscription } from './actions/ws';
import thunkMiddleware from 'redux-thunk';
import { cameraStates, imageStates } from '../Constants';

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

  [
    ['startIntegration', imageStates.INTEGRATING],
    ['startReadout', imageStates.READING_OUT],
    ['endReadout', imageStates.END_READOUT],
    ['endOfImageTelemetry', imageStates.END_TELEMETRY],
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
  });
});

describe('Test camera component status data passes correctly to component', () => {
  const stateData = [
    {
      priority: {
        value: 1,
        dataType: 'Int',
      },
      substate: {
        value: 1,
        dataType: 'Int',
      },
    },
  ];
  [
    ['raftsDetailedState', cameraStates['raftsDetailedState'][1]],
    ['shutterDetailedState', cameraStates['shutterDetailedState'][1]],
    ['imageReadinessDetailedState', cameraStates['imageReadinessDetailedState'][1]],
    ['calibrationDetailedState', cameraStates['calibrationDetailedState'][1]],
  ].forEach((componentPair) => {
    it(`Should extract ${componentPair[0]} data from image sequence message`, async () => {
      const groupName = `event-ATCamera-${componentPair[0]}`;
      const data = {
        ATCamera: {},
      };
      data.ATCamera[componentPair[0]] = stateData;
      // Act
      store.dispatch(openWebsocketConnection());
      await server.connected;
      await store.dispatch(requestGroupSubscription(groupName));
      server.send({ category: 'event', data: data });
      const streamData = getCameraState(store.getState(), groupName);
      // Assert
      expect(streamData[componentPair[0]]).toBe(componentPair[1]);
    });
  });
});
// it('Should extract the token correctly with a selector', async ()=>{
//   expect(1).toEqual(1);
// })
