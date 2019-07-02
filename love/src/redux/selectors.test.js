import {
  getStreamData,
  getTimestampedStreamData,
  getStreamsData,
  getCameraState,
  getScriptQueueState,
} from './selectors';
import { createStore, applyMiddleware } from 'redux';
import rootReducer from './reducers';
import WS from 'jest-websocket-mock';
import { openWebsocketConnection, requestGroupSubscription } from './actions/ws';
import thunkMiddleware from 'redux-thunk';
import { cameraStates, imageStates } from '../Constants';
import logger from 'redux-logger'

let store, server;
beforeEach(() => {
  store = createStore(rootReducer, applyMiddleware(thunkMiddleware));
  localStorage.setItem('LOVE-TOKEN', 'love-token');
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
  store.dispatch(openWebsocketConnection());

  // Act
  await server.connected;
  await store.dispatch(requestGroupSubscription(groupName));
  server.send({ category: 'telemetry', data: data });
  const streamData = getStreamData(store.getState(), groupName);

  // Assert
  expect(JSON.stringify(streamData)).toEqual(JSON.stringify(data.Environment.airPressure));
});

it('Should extract streams correctly with a selector', async () => {
  // Arrange
  const data = {
    Environment: {
      airPressure: {
        paAvg1M: { value: 0.12092732556005037, dataType: 'Float' },
        pateValue3H: { value: 0.2811193740140766, dataType: 'Float' },
        patrValue3H: { value: 0.04326551449696192, dataType: 'Float' },
        sensorName: { value: 'c', dataType: 'String' },
      },
      temperature: {
        sensor1: { value: 69, dataType: 'Float' },
      },
    },
  };
  const expectedData = {
    'telemetry-Environment-airPressure': {
      paAvg1M: { value: 0.12092732556005037, dataType: 'Float' },
      pateValue3H: { value: 0.2811193740140766, dataType: 'Float' },
      patrValue3H: { value: 0.04326551449696192, dataType: 'Float' },
      sensorName: { value: 'c', dataType: 'String' },
    },
    'telemetry-Environment-temperature': { sensor1: { value: 69, dataType: 'Float' } },
  };
  const groupNames = ['telemetry-Environment-airPressure', 'telemetry-Environment-temperature'];

  // Act
  store.dispatch(openWebsocketConnection());
  await server.connected;
  await store.dispatch(requestGroupSubscription(groupNames[0]));
  await store.dispatch(requestGroupSubscription(groupNames[1]));
  server.send({ category: 'telemetry', data: data });
  const streamsData = getStreamsData(store.getState(), groupNames);

  // Assert
  expect(JSON.stringify(streamsData)).toEqual(JSON.stringify(expectedData));
});

it('Should extract the timestamped stream correctly with a selector', async () => {
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
  const timestamp = new Date();
  // Act
  store.dispatch(openWebsocketConnection());
  await server.connected;
  await store.dispatch(requestGroupSubscription(groupName));
  server.send({ category: 'telemetry', data: data });
  const streamData = getTimestampedStreamData(store.getState(), groupName);

  // Assert
  expect(JSON.stringify(streamData.data)).toEqual(JSON.stringify(data.Environment.airPressure));
  expect(streamData.timestamp).toBeInstanceOf(Date);
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

it('Append readout parameters to image', async () => {
  expect(1).toEqual(1);

  const imageData = {
    ATCamera: {
      startIntegration: [
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
            value: 1,
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
      ],
    },
  };

  const data = {
    ATCamera: {
      imageReadoutParameters: [
        {
          ccdNames: {
            value: 'a',
            dataType: 'String',
          },
          ccdType: {
            value: 0,
            dataType: 'Int',
          },
          imageName: {
            value: 'Image 1',
            dataType: 'String',
          },
          overCols: {
            value: 1,
            dataType: 'Int',
          },
          overRows: {
            value: 1,
            dataType: 'Int',
          },
          postCols: {
            value: 1,
            dataType: 'Int',
          },
          preCols: {
            value: 0,
            dataType: 'Int',
          },
          preRows: {
            value: 0,
            dataType: 'Int',
          },
          priority: {
            value: 1,
            dataType: 'Int',
          },
          readCols: {
            value: 0,
            dataType: 'Int',
          },
          readCols2: {
            value: 0,
            dataType: 'Int',
          },
          readRows: {
            value: 1,
            dataType: 'Int',
          },
        },
      ],
    },
  };

  store.dispatch(openWebsocketConnection());
  await server.connected;
  await store.dispatch(requestGroupSubscription('event-ATCamera-startIntegration'));
  await store.dispatch(requestGroupSubscription('event-ATCamera-imageReadoutParameters'));
  server.send({ category: 'event', data: imageData });
  server.send({ category: 'event', data: data });
  const streamData = getCameraState(store.getState(), 'event-ATCamera-imageReadoutParameters');
  const expectedResult = {
    timeStamp: 1558368052.999,
    imageIndex: 0,
    exposureTime: 5,
    state: imageStates.INTEGRATING,
    imageReadoutParameters: {
      ccdNames: 'a',
      ccdType: 0,
      imageName: 'Image 1',
      overCols: 1,
      overRows: 1,
      postCols: 1,
      preCols: 0,
      preRows: 0,
      priority: 1,
      readCols: 0,
      readCols2: 0,
      readRows: 1,
    },
  };
  // Assert
  expect(JSON.stringify(streamData.imageSequence.images['Image 1'])).toBe(JSON.stringify(expectedResult));
});

it('Should extract the ScriptQueue state correctly with a selector', async () => {
  // Arrange
  const data = {
    data: {
      ScriptQueueState: {
        stream: {
          max_lost_heartbeats: 5,
          heartbeat_timeout: 15,
          available_scripts: [
            { type: "standard", path: "unloadable" },
            { type: "standard", path: "script2" },
            { type: "standard", path: "script1" },
            { type: "standard", path: "subdir/script3" },
            { type: "standard", path: "subdir/subsubdir/script4" },
            { type: "external", path: "script5" },
            { type: "external", path: "script1" },
            { type: "external", path: "subdir/script3" },
            { type: "external", path: "subdir/script6" }
          ],
          state: "Running",
          finished_scripts: [
            {
              index: 100000,
              script_state: "DONE",
              process_state: "DONE",
              elapsed_time: 0,
              expected_duration: 3600.0,
              type: "standard",
              path: "script1",
              lost_heartbeats: 1,
              setup: true,
              last_heartbeat_timestamp: 1562083001.530486,
              timestampConfigureEnd: 1562079403.8510532,
              timestampConfigureStart: 1562079403.739135,
              timestampProcessEnd: 1562083005.9086933,
              timestampProcessStart: 1562079400.4823232,
              timestampRunStart: 1562079403.8522232
            }
          ],
          waiting_scripts: [
            {
              index: 100002,
              script_state: "CONFIGURED",
              process_state: "CONFIGURED",
              elapsed_time: 0,
              expected_duration: 3600.0,
              type: "standard",
              path: "script1",
              lost_heartbeats: 0,
              setup: true,
              last_heartbeat_timestamp: 1562085751.474293,
              timestampConfigureEnd: 1562079406.6482723,
              timestampConfigureStart: 1562079406.523249,
              timestampProcessEnd: 0.0,
              timestampProcessStart: 1562079402.5080712,
              timestampRunStart: 0.0
            },
            {
              index: 100003,
              script_state: "CONFIGURED",
              process_state: "CONFIGURED",
              elapsed_time: 0,
              expected_duration: 3600.0,
              type: "standard",
              path: "script1",
              lost_heartbeats: 0,
              setup: true,
              last_heartbeat_timestamp: 1562085751.879635,
              timestampConfigureEnd: 1562079407.207569,
              timestampConfigureStart: 1562079407.049775,
              timestampProcessEnd: 0.0,
              timestampProcessStart: 1562079402.8352787,
              timestampRunStart: 0.0
            },
          ],
          current: {
            index: 100001,
            script_state: "RUNNING",
            process_state: "RUNNING",
            elapsed_time: 0,
            expected_duration: 3600.0,
            type: "standard",
            path: "script1",
            lost_heartbeats: 0,
            setup: true,
            last_heartbeat_timestamp: 1562085754.886316,
            timestampConfigureEnd: 1562079405.1839786,
            timestampConfigureStart: 1562079405.0609376,
            timestampProcessEnd: 0.0,
            timestampProcessStart: 1562079401.4940698,
            timestampRunStart: 1562083005.9092648
          }
        }
      }
    },
    category: "event"
  };
     
  store.dispatch(openWebsocketConnection());
  await store.dispatch(requestGroupSubscription('event-ScriptQueueState-stream'));
  await server.connected;  
  server.send(data);
  // Act
  const streamData = getScriptQueueState(store.getState());
  const expectedData = {
    state: data.data.ScriptQueueState.stream.state,
    availableScripts: data.data.ScriptQueueState.stream.available_scripts,
    waitingScripts: data.data.ScriptQueueState.stream.waiting_scripts,
    currentScript: data.data.ScriptQueueState.stream.current,
    finishedScripts: data.data.ScriptQueueState.stream.finished_scripts,
  }

  // Assert
  expect(JSON.stringify(streamData)).toEqual(JSON.stringify(expectedData));
});
