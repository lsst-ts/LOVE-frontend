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

export const SIDEREAL_SECOND = 1.00273788;
export const MAX_CCW_FOLLOWING_ERROR = 2.0;
export const LOG_LEVELS = { debug: 10, info: 20, warning: 30, error: 40 };
export const IMAGE_STATES = {
  INTEGRATING: 'INTEGRATING',
  READING_OUT: 'READING_OUT',
  END_READOUT: 'END_READOUT',
  END_TELEMETRY: 'END_TELEMETRY',
};

export const VALUE_TYPES = {
  BOOLEAN: 'boolean',
  INTEGER: 'integer',
  FLOAT: 'float',
  STRING: 'string',
  ARRAY: 'array',
  OBJECT: 'object',
};
