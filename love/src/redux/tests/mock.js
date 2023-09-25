/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed by Inria Chile.

This program is free software: you can redistribute it and/or modify it under 
the terms of the GNU General Public License as published by the Free Software 
Foundation, either version 3 of the License, or at your option) any later version.

This program is distributed in the hope that it will be useful,but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR 
 A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with 
this program. If not, see <http://www.gnu.org/licenses/>.
*/

export const ScriptQueueData = {
  category: 'event',
  data: [
    {
      csc: 'ScriptQueueState',
      salindex: 1,
      data: {
        stream: {
          max_lost_heartbeats: 5,
          heartbeat_timeout: 15,
          available_scripts: [],
          state: 'Running',
          finished_scripts: [
            {
              index: 100001,
              script_state: 'CONFIGURED',
              process_state: 'CONFIGURED',
              elapsed_time: 0,
              expected_duration: 3600.0,
              type: 'standard',
              path: 'script1',
              lost_heartbeats: 0,
              setup: true,
              last_heartbeat_timestamp: 1562278042.674137,
              timestampConfigureEnd: 1562275971.1961448,
              timestampConfigureStart: 1562275971.0857928,
              timestampProcessEnd: 0.0,
              timestampProcessStart: 1562275967.8779023,
              timestampRunStart: 0.0,
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
              last_heartbeat_timestamp: 1562278044.22664,
              timestampConfigureEnd: 1562275972.5115755,
              timestampConfigureStart: 1562275972.4017982,
              timestampProcessEnd: 0.0,
              timestampProcessStart: 1562275968.8915398,
              timestampRunStart: 0.0,
            },
          ],
          current: {
            index: 100000,
            script_state: 'RUNNING',
            process_state: 'RUNNING',
            elapsed_time: 0,
            expected_duration: 3600.0,
            type: 'standard',
            path: 'script1',
            lost_heartbeats: 0,
            setup: true,
            last_heartbeat_timestamp: 1562278041.481556,
            timestampConfigureEnd: 1562275970.2090635,
            timestampConfigureStart: 1562275970.099327,
            timestampProcessEnd: 0.0,
            timestampProcessStart: 1562275966.864108,
            timestampRunStart: 1562275970.2094963,
          },
        },
      },
    },
  ],
};

export const ATDomeLogMessages = [
  {
    ATDomeID: { value: 1, dataType: 'Int' },
    private_revCode: { value: '7e3adbb4', dataType: 'String' },
    private_sndStamp: { value: 1563975795.264409, dataType: 'Float' },
    private_rcvStamp: { value: 1563975795.265255, dataType: 'Float' },
    private_seqNum: { value: 1, dataType: 'Int' },
    private_origin: { value: 32, dataType: 'Int' },
    private_host: { value: 148518437, dataType: 'Int' },
    level: { value: 20, dataType: 'Int' },
    message: { value: 'Read historical data in 5.55 sec', dataType: 'String' },
    traceback: { value: '', dataTyp: 'String' },
  },
  {
    ATDomeID: { value: 1, dataType: 'Int' },
    private_revCode: { value: '7e3adbb4', dataType: 'String' },
    private_sndStamp: { value: 1563975795.274168, dataType: 'Float' },
    private_rcvStamp: { value: 1563975795.275134, dataType: 'Float' },
    private_seqNum: { value: 2, dataType: 'Int' },
    private_origin: { value: 32, dataType: 'Int' },
    private_host: { value: 148518437, dataType: 'Int' },
    level: { value: 30, dataType: 'Int' },
    message: {
      value: "Labeled config files ['sim.yaml'] not found in /home/saluser/repos/ts_config_attcs/ATDome/v1",
      dataType: 'String',
    },
    traceback: { value: '', dataTyp: 'String' },
  },
  {
    ATDomeID: { value: 1, dataType: 'Int' },
    private_revCode: { value: '7e3adbb4', dataType: 'String' },
    private_sndStamp: { value: 1563975795.363577, dataType: 'Float' },
    private_rcvStamp: { value: 1563975795.3644, dataType: 'Float' },
    private_seqNum: { value: 3, dataType: 'Int' },
    private_origin: { value: 32, dataType: 'Int' },
    private_host: { value: 148518437, dataType: 'Int' },
    level: { value: 10, dataType: 'Int' },
    message: { value: 'connect', dataType: 'String' },
    traceback: { value: '', dataTyp: 'String' },
  },
  {
    ATDomeID: { value: 1, dataType: 'Int' },
    private_revCode: { value: '7e3adbb4', dataType: 'String' },
    private_sndStamp: { value: 1563975795.37173, dataType: 'Float' },
    private_rcvStamp: { value: 1563975795.37262, dataType: 'Float' },
    private_seqNum: { value: 4, dataType: 'Int' },
    private_origin: { value: 32, dataType: 'Int' },
    private_host: { value: 148518437, dataType: 'Int' },
    level: { value: 10, dataType: 'Int' },
    message: { value: 'connected', dataType: 'String' },
    traceback: { value: '', dataTyp: 'String' },
  },
];

export const TestCSCErrorCodeData = [
  {
    TestID: { value: 3, dataType: 'Int' },
    private_revCode: { value: '5b705f39', dataType: 'String' },
    private_sndStamp: { value: 156500000 + 50000, dataType: 'Float' },
    private_rcvStamp: { value: 156500000 + 50000, dataType: 'Float' },
    private_seqNum: { value: 10, dataType: 'Int' },
    private_origin: { value: 44, dataType: 'Int' },
    private_host: { value: 2045309654, dataType: 'Int' },
    errorCode: { value: 52, dataType: 'Int' },
    errorReport: {
      value: 'Report 1 for error code for Test-3',
      dataType: 'String',
    },
    traceback: {
      value: 'Traceback 1 for error code for Test-3',
      dataType: 'String',
    },
  },
  {
    TestID: { value: 3, dataType: 'Int' },
    private_revCode: { value: '5b705f39', dataType: 'String' },
    private_sndStamp: { value: 156500000 + 20000, dataType: 'Float' },
    private_rcvStamp: { value: 156500000 + 20000, dataType: 'Float' },
    private_seqNum: { value: 10, dataType: 'Int' },
    private_origin: { value: 44, dataType: 'Int' },
    private_host: { value: 2045309654, dataType: 'Int' },
    errorCode: { value: 52, dataType: 'Int' },
    errorReport: {
      value: 'Report 2 for error code for Test-3',
      dataType: 'String',
    },
    traceback: {
      value: 'Traceback 2 for error code for Test-3',
      dataType: 'String',
    },
  },
  {
    TestID: { value: 3, dataType: 'Int' },
    private_revCode: { value: '5b705f39', dataType: 'String' },
    private_sndStamp: { value: 156500000 + 30000, dataType: 'Float' },
    private_rcvStamp: { value: 156500000 + 30000, dataType: 'Float' },
    private_seqNum: { value: 10, dataType: 'Int' },
    private_origin: { value: 44, dataType: 'Int' },
    private_host: { value: 2045309654, dataType: 'Int' },
    errorCode: { value: 52, dataType: 'Int' },
    errorReport: {
      value: 'Report 3 for error code for Test-3',
      dataType: 'String',
    },
    traceback: {
      value: 'Traceback 3 for error code for Test-3',
      dataType: 'String',
    },
  },
];
