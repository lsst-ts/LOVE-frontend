/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed for Inria Chile.

This program is free software: you can redistribute it and/or modify it under 
the terms of the GNU General Public License as published by the Free Software 
Foundation, either version 3 of the License, or at your option) any later version.

This program is distributed in the hope that it will be useful,but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR 
 A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with 
this program. If not, see <http://www.gnu.org/licenses/>.
*/

import { createStore, applyMiddleware } from 'redux';
import WS from 'jest-websocket-mock';
import thunkMiddleware from 'redux-thunk';
import {
  getStreamData,
  getTimestampedStreamData,
  getStreamsData,
  getCameraState,
  getScriptQueueState,
  getSummaryStateValue,
  getMountMotorsState,
} from './selectors';
import rootReducer from './reducers';
import { doReceiveToken } from './actions/auth';
import { addGroup } from './actions/ws';
import { cameraStates } from 'Config';
import { IMAGE_STATES } from 'Constants';

let store;
let server;
beforeEach(async () => {
  store = createStore(rootReducer, applyMiddleware(thunkMiddleware));
  localStorage.setItem('LOVE-TOKEN', 'love-token');
  server = new WS('ws://localhost/manager/ws/subscription', { jsonProtocol: true });
  server.on('connection', (socket) => {
    const [, token] = socket.url.split('?token=');
    if (token !== 'love-token') {
      socket.close();
    }
  });
  await store.dispatch(doReceiveToken('username', 'love-token', {}, 0));
  await server.connected;
});

afterEach(() => {
  localStorage.removeItem('LOVE-TOKEN');
  server.close();
});

it('Should extract the stream correctly with a selector', async () => {
  // Arrange
  const streams = {
    airPressure: {
      paAvg1M: {
        value: 0.12092732556005037,
        dataType: 'Float',
      },
      pateValue3H: {
        value: 0.2811193740140766,
        dataType: 'Float',
      },
      patrValue3H: {
        value: 0.04326551449696192,
        dataType: 'Float',
      },
      sensorName: {
        value: 'c',
        dataType: 'String',
      },
    },
  };
  const category = 'telemetry';
  const csc = 'WeatherStation';
  const salindex = 1;
  const stream = 'airPressure';
  const groupName = [category, csc, salindex, stream].join('-');

  // Act
  await store.dispatch(addGroup(groupName));
  server.send({
    category,
    data: [
      {
        csc,
        salindex,
        data: streams,
      },
    ],
  });
  const streamData = getStreamData(store.getState(), groupName);

  // Assert
  expect(JSON.stringify(streamData)).toEqual(JSON.stringify(streams.airPressure));
});

it('Should extract streams correctly with a selector', async () => {
  // Arrange
  const streams = {
    airPressure: {
      paAvg1M: {
        value: 0.12092732556005037,
        dataType: 'Float',
      },
      pateValue3H: {
        value: 0.2811193740140766,
        dataType: 'Float',
      },
      patrValue3H: {
        value: 0.04326551449696192,
        dataType: 'Float',
      },
      sensorName: {
        value: 'c',
        dataType: 'String',
      },
    },
    temperature: {
      sensor1: {
        value: 69,
        dataType: 'Float',
      },
    },
  };
  const expectedData = {
    'telemetry-WeatherStation-1-airPressure': {
      paAvg1M: {
        value: 0.12092732556005037,
        dataType: 'Float',
      },
      pateValue3H: {
        value: 0.2811193740140766,
        dataType: 'Float',
      },
      patrValue3H: {
        value: 0.04326551449696192,
        dataType: 'Float',
      },
      sensorName: {
        value: 'c',
        dataType: 'String',
      },
    },
    'telemetry-WeatherStation-1-temperature': {
      sensor1: {
        value: 69,
        dataType: 'Float',
      },
    },
  };
  const groupNames = ['telemetry-WeatherStation-1-airPressure', 'telemetry-WeatherStation-1-temperature'];

  // Act
  await store.dispatch(addGroup(groupNames[0]));
  await store.dispatch(addGroup(groupNames[1]));
  server.send({
    category: 'telemetry',
    data: [
      {
        csc: 'WeatherStation',
        salindex: 1,
        data: streams,
      },
    ],
  });
  const streamsData = getStreamsData(store.getState(), groupNames);

  // Assert
  expect(JSON.stringify(streamsData)).toEqual(JSON.stringify(expectedData));
});

it('Should extract the timestamped stream correctly with a selector', async () => {
  // Arrange
  const streams = {
    airPressure: {
      paAvg1M: {
        value: 0.12092732556005037,
        dataType: 'Float',
      },
      pateValue3H: {
        value: 0.2811193740140766,
        dataType: 'Float',
      },
      patrValue3H: {
        value: 0.04326551449696192,
        dataType: 'Float',
      },
      sensorName: {
        value: 'c',
        dataType: 'String',
      },
    },
  };
  const groupName = 'telemetry-WeatherStation-1-airPressure';

  // Act
  await store.dispatch(addGroup(groupName));
  server.send({
    category: 'telemetry',
    data: [
      {
        csc: 'WeatherStation',
        salindex: 1,
        data: streams,
      },
    ],
  });
  const streamData = getTimestampedStreamData(store.getState(), groupName);

  // Assert
  expect(JSON.stringify(streamData.data)).toEqual(JSON.stringify(streams.airPressure));
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
      timestampAcquisitionStart: {
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
      timestampAcquisitionStart: {
        value: 1558568052.999,
        dataType: 'Float',
      },
    },
  ];

  [
    ['startIntegration', IMAGE_STATES.INTEGRATING],
    ['startReadout', IMAGE_STATES.READING_OUT],
    ['endReadout', IMAGE_STATES.END_READOUT],
    ['endOfImageTelemetry', IMAGE_STATES.END_TELEMETRY],
  ].forEach((stagePair) => {
    it(`Should extract ${stagePair[0]} data from image sequence message`, async () => {
      // Arrange
      const streams = {
        [stagePair[0]]: sequenceData,
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
      const groupName = `event-ATCamera-1-${stagePair[0]}`;

      // Act
      await store.dispatch(addGroup(groupName));
      server.send({
        category: 'event',
        data: [
          {
            csc: 'ATCamera',
            salindex: 1,
            data: streams,
          },
        ],
      });
      const streamData = getCameraState(store.getState(), groupName);
      // Assert
      expect(JSON.stringify(streamData.imageSequence)).toBe(JSON.stringify(result.imageSequence));
    });
  });
});

describe('Test camera component status data passes correctly to component', () => {
  const stateData = [
    {
      substate: {
        value: 1,
        dataType: 'Int',
      },
    },
  ];
  [
    ['raftsDetailedState', cameraStates.raftsDetailedState[1]],
    ['shutterDetailedState', cameraStates.shutterDetailedState[1]],
    ['imageReadinessDetailedState', cameraStates.imageReadinessDetailedState[1]],
    ['calibrationDetailedState', cameraStates.calibrationDetailedState[1]],
  ].forEach((componentPair) => {
    it(`Should extract ${componentPair[0]} data from image sequence message`, async () => {
      const groupName = `event-ATCamera-1-${componentPair[0]}`;
      const streams = {
        [componentPair[0]]: stateData,
      };
      // Act
      await store.dispatch(addGroup(groupName));

      server.send({
        category: 'event',
        data: [
          {
            csc: 'ATCamera',
            salindex: 1,
            data: streams,
          },
        ],
      });

      const streamData = getCameraState(store.getState());
      // Assert
      expect(streamData[componentPair[0]]).toBe(componentPair[1]);
    });
  });
});

it('Append readout parameters to image', async () => {
  expect(1).toEqual(1);

  const imageData = {
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
        timestampAcquisitionStart: {
          value: 1558368052.999,
          dataType: 'Float',
        },
      },
    ],
  };

  const data = {
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
  };

  await store.dispatch(addGroup('event-ATCamera-1-startIntegration'));
  await store.dispatch(addGroup('event-ATCamera-1-imageReadoutParameters'));

  server.send({
    category: 'event',
    data: [
      {
        csc: 'ATCamera',
        salindex: 1,
        data: imageData,
      },
    ],
  });

  server.send({
    category: 'event',
    data: [
      {
        csc: 'ATCamera',
        salindex: 1,
        data,
      },
    ],
  });

  const streamData = getCameraState(store.getState());
  const expectedResult = {
    timeStamp: 1558368052.999,
    imageIndex: 0,
    exposureTime: 5,
    state: IMAGE_STATES.INTEGRATING,
    imageReadoutParameters: {
      ccdNames: 'a',
      ccdType: 0,
      imageName: 'Image 1',
      overCols: 1,
      overRows: 1,
      postCols: 1,
      preCols: 0,
      preRows: 0,
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

  const scriptQueueStateStream = {
    stream: {
      max_lost_heartbeats: 5,
      heartbeat_timeout: 15,
      available_scripts: [
        {
          type: 'standard',
          path: 'unloadable',
        },
        {
          type: 'standard',
          path: 'script2',
        },
        {
          type: 'standard',
          path: 'script1',
        },
        {
          type: 'standard',
          path: 'subdir/script3',
        },
        {
          type: 'standard',
          path: 'subdir/subsubdir/script4',
        },
        {
          type: 'external',
          path: 'script5',
        },
        {
          type: 'external',
          path: 'script1',
        },
        {
          type: 'external',
          path: 'subdir/script3',
        },
        {
          type: 'external',
          path: 'subdir/script6',
        },
      ],
      // state: 'Running',
      running: true,
      finished_scripts: [
        {
          index: 100000,
          script_state: 'DONE',
          process_state: 'DONE',
          elapsed_time: 0,
          expected_duration: 3600.0,
          type: 'standard',
          path: 'script1',
          lost_heartbeats: 1,
          setup: true,
          last_heartbeat_timestamp: 1562083001.530486,
          timestampConfigureEnd: 1562079403.8510532,
          timestampConfigureStart: 1562079403.739135,
          timestampProcessEnd: 1562083005.9086933,
          timestampProcessStart: 1562079400.4823232,
          timestampRunStart: 1562079403.8522232,
        },
      ],
      waiting_scripts: [
        {
          index: 100002,
          script_state: 'CONFIGURED',
          process_state: 'CONFIGURED',
          elapsed_time: 0,
          expected_duration: 3600.0,
          type: 'standard',
          path: 'script1',
          lost_heartbeats: 0,
          setup: true,
          last_heartbeat_timestamp: 1562085751.474293,
          timestampConfigureEnd: 1562079406.6482723,
          timestampConfigureStart: 1562079406.523249,
          timestampProcessEnd: 0.0,
          timestampProcessStart: 1562079402.5080712,
          timestampRunStart: 0.0,
        },
        {
          index: 100003,
          script_state: 'CONFIGURED',
          process_state: 'CONFIGURED',
          elapsed_time: 0,
          expected_duration: 3600.0,
          type: 'standard',
          path: 'script1',
          lost_heartbeats: 0,
          setup: true,
          last_heartbeat_timestamp: 1562085751.879635,
          timestampConfigureEnd: 1562079407.207569,
          timestampConfigureStart: 1562079407.049775,
          timestampProcessEnd: 0.0,
          timestampProcessStart: 1562079402.8352787,
          timestampRunStart: 0.0,
        },
      ],
      current: {
        index: 100001,
        script_state: 'RUNNING',
        process_state: 'RUNNING',
        elapsed_time: 0,
        expected_duration: 3600.0,
        type: 'standard',
        path: 'script1',
        lost_heartbeats: 0,
        setup: true,
        last_heartbeat_timestamp: 1562085754.886316,
        timestampConfigureEnd: 1562079405.1839786,
        timestampConfigureStart: 1562079405.0609376,
        timestampProcessEnd: 0.0,
        timestampProcessStart: 1562079401.4940698,
        timestampRunStart: 1562083005.9092648,
      },
    },
  };

  await store.dispatch(addGroup('event-ScriptQueueState-1-stream'));
  server.send({
    category: 'event',
    data: [
      {
        csc: 'ScriptQueueState',
        salindex: 1,
        data: scriptQueueStateStream,
      },
    ],
  });
  // Act
  const streamData = getScriptQueueState(store.getState(), 1);
  const expectedData = {
    state: scriptQueueStateStream.stream.running ? 'Running' : 'Stopped',
    availableScriptList: scriptQueueStateStream.stream.available_scripts,
    waitingScriptList: scriptQueueStateStream.stream.waiting_scripts,
    current: scriptQueueStateStream.stream.current,
    finishedScriptList: scriptQueueStateStream.stream.finished_scripts,
  };

  // Assert
  expect(JSON.stringify(streamData)).toEqual(JSON.stringify(expectedData));
});

it('Should extract the SummaryStateValue stream correctly with a selector', async () => {
  // Arrange
  const streams = {
    summaryState: [
      {
        ScriptQueueID: {
          value: 1,
          dataType: 'Int',
        },
        private_host: {
          value: 798089283,
          dataType: 'Int',
        },
        private_origin: {
          value: 56,
          dataType: 'Int',
        },
        private_rcvStamp: {
          value: 1562605145.9171262,
          dataType: 'Float',
        },
        private_revCode: {
          value: '16ec6358',
          dataType: 'String',
        },
        private_seqNum: {
          value: 2,
          dataType: 'Int',
        },
        private_sndStamp: {
          value: 1562605145.9079509,
          dataType: 'Float',
        },
        summaryState: {
          value: 4,
          dataType: 'Int',
        },
      },
    ],
  };
  const groupName = 'event-ScriptQueue-1-summaryState';

  // Act
  await store.dispatch(addGroup(groupName));

  server.send({
    category: 'event',
    data: [
      {
        csc: 'ScriptQueue',
        salindex: 1,
        data: streams,
      },
    ],
  });

  const summaryStateValue = getSummaryStateValue(store.getState(), groupName);

  // Assert
  expect(summaryStateValue).toEqual(streams.summaryState[0].summaryState.value);
});

it('Should extract the Mount motors values correctly with a selector', async () => {
  // Arrange
  const dataStreams = {
    torqueDemand: [
      {
        elevationMotorTorque: { value: 0.0, dataType: 'Float' },
        azimuthMotor1Torque: { value: 0.0, dataType: 'Float' },
        azimuthMotor2Torque: { value: 0.0, dataType: 'Float' },
        nasmyth1MotorTorque: { value: 0.0, dataType: 'Float' },
        nasmyth2MotorTorque: { value: 0.0, dataType: 'Float' },
      },
    ],
    measuredMotorVelocity: [
      {
        elevationMotorVelocity: { value: 0.0, dataType: 'Float' },
        azimuthMotor1Velocity: { value: 0.0, dataType: 'Float' },
        azimuthMotor2Velocity: { value: 0.0, dataType: 'Float' },
        nasmyth1MotorVelocity: { value: 0.0, dataType: 'Float' },
        nasmyth2MotorVelocity: { value: 0.0, dataType: 'Float' },
        m3Velocity: { value: 0.0, dataType: 'Float' },
      },
    ],
    mountEncoders: [
      {
        elevationCalculatedAngle: { value: 23.019065046896525, dataType: 'Float' },
        azimuthCalculatedAngle: { value: -94.28605043926653, dataType: 'Float' },
        nasmyth1CalculatedAngle: { value: 19.595513971283157, dataType: 'Float' },
        nasmyth2CalculatedAngle: { value: 19.59460890961316, dataType: 'Float' },
        trackId: { value: 1, dataType: 'Int' },
      },
    ],
  };

  const groupNames = [
    'telemetry-ATMCS-0-torqueDemand',
    'telemetry-ATMCS-0-measuredMotorVelocity',
    'telemetry-ATMCS-0-mountEncoders',
  ];

  const expected = {
    azimuthBrake1: 'Unknown',
    azimuthBrake2: 'Unknown',
    azimuthDrive1Status: 'Unknown',
    azimuthDrive2Status: 'Unknown',
    elevationBrake: 'Unknown',
    elevationDriveStatus: 'Unknown',
    m3DriveStatus: 'Unknown',
    measuredMotorVelocity: [
      {
        azimuthMotor1Velocity: {
          dataType: 'Float',
          value: 0,
        },
        azimuthMotor2Velocity: {
          dataType: 'Float',
          value: 0,
        },
        elevationMotorVelocity: {
          dataType: 'Float',
          value: 0,
        },
        m3Velocity: {
          dataType: 'Float',
          value: 0,
        },
        nasmyth1MotorVelocity: {
          dataType: 'Float',
          value: 0,
        },
        nasmyth2MotorVelocity: {
          dataType: 'Float',
          value: 0,
        },
      },
    ],
    measuredTorque: {},
    mountEncoders: [
      {
        azimuthCalculatedAngle: {
          dataType: 'Float',
          value: -94.28605043926653,
        },
        elevationCalculatedAngle: {
          dataType: 'Float',
          value: 23.019065046896525,
        },
        nasmyth1CalculatedAngle: {
          dataType: 'Float',
          value: 19.595513971283157,
        },
        nasmyth2CalculatedAngle: {
          dataType: 'Float',
          value: 19.59460890961316,
        },
        trackId: {
          dataType: 'Int',
          value: 1,
        },
      },
    ],
    mountMotorEncoders: {},
    nasmyth1Brake: 'Unknown',
    nasmyth1DriveStatus: 'Unknown',
    nasmyth2Brake: 'Unknown',
    nasmyth2DriveStatus: 'Unknown',
    torqueDemand: [
      {
        azimuthMotor1Torque: {
          dataType: 'Float',
          value: 0,
        },
        azimuthMotor2Torque: {
          dataType: 'Float',
          value: 0,
        },
        elevationMotorTorque: {
          dataType: 'Float',
          value: 0,
        },
        nasmyth1MotorTorque: {
          dataType: 'Float',
          value: 0,
        },
        nasmyth2MotorTorque: {
          dataType: 'Float',
          value: 0,
        },
      },
    ],
  };
  // Act
  await store.dispatch(addGroup(groupNames[0]));
  await store.dispatch(addGroup(groupNames[1]));
  await store.dispatch(addGroup(groupNames[2]));
  server.send({
    category: 'telemetry',
    data: [
      {
        csc: 'ATMCS',
        salindex: 0,
        data: dataStreams,
      },
    ],
  });

  const mountMotorsStateValue = getMountMotorsState(store.getState(), 0);
  // Assert
  expect(mountMotorsStateValue).toEqual(expected);
});
