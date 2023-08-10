/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed for Inria Chile Tech Team.

This program is free software: you can redistribute it and/or modify it under 
the terms of the GNU General Public License as published by the Free Software 
Foundation, either version 3 of the License, or at your option) any later version.

This program is distributed in the hope that it will be useful,but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR 
 A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with 
this program. If not, see <http://www.gnu.org/licenses/>.
*/

const message = {
  data: {
    ScriptQueueState: {
      stream: {
        heartbeat_timeout: 15,
        available_scripts: [
          { type: 'standard', path: 'script2' },
          { type: 'standard', path: 'script1' },
          { type: 'standard', path: 'subdir/script3' },
          { type: 'standard', path: 'subdir/subsubdir/script4' },
          { type: 'external', path: 'script5' },
          { type: 'external', path: 'script1' },
          { type: 'external', path: 'subdir/script3' },
          { type: 'external', path: 'subdir/script6' },
        ],
        state: 'Running',
        finished_scripts: [
          {
            index: 100021,
            script_state: 'DONE',
            process_state: 'DONE',
            elapsed_time: 3290.1677939891815,
            expected_duration: 0,
            type: 'standard',
            path: 'script1',
            setup: true,
          },
          {
            index: 100020,
            script_state: 'DONE',
            process_state: 'DONE',
            elapsed_time: 2690.475613117218,
            expected_duration: 0,
            type: 'standard',
            path: 'script1',
            setup: true,
          },
          {
            index: 100019,
            script_state: 'DONE',
            process_state: 'DONE',
            elapsed_time: 2092.9176359176636,
            expected_duration: 0,
            type: 'standard',
            path: 'script1',
            setup: true,
          },
        ],
        waiting_scripts: [
          {
            index: 100023,
            script_state: 'CONFIGURED',
            process_state: 'CONFIGURED',
            elapsed_time: 0.0,
            expected_duration: 600.0,
            type: 'standard',
            path: 'script1',
            setup: true,
          },
        ],
        current: {
          index: 100022,
          script_state: 'RUNNING',
          process_state: 'RUNNING',
          elapsed_time: 0.0,
          expected_duration: 600.0,
          type: 'standard',
          path: 'script1',
          setup: true,
        },
      },
    },
  },
  category: 'event',
};

export default message;
