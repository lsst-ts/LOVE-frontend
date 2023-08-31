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

import React from 'react';
import { connect } from 'react-redux';
import { getClock } from '../../redux/selectors';
import TimeDisplay from './TimeDisplay';

export const schema = {
  description: `Component displaying the clocks with relevant times, such as UTC, TAI, summit time, etc`,
  defaultSize: [63, 17],
  props: {
    titleBar: {
      type: 'boolean',
      description: 'Whether to display the title bar',
      isPrivate: false,
      default: true,
    },
    title: {
      type: 'string',
      description: 'Name diplayed in the title bar (if visible)',
      isPrivate: false,
      default: 'TimeDisplay',
    },
    margin: {
      type: 'boolean',
      description: 'Whether to display component with a margin',
      isPrivate: false,
      default: true,
    },
    locale: {
      type: 'string',
      description: `Locale string used to configure how to display the UTC Offset.
        'en-GB' by default (so it is displayed as GMT always). Null or empty to use the browser locale.
        The format for this string must be: <language (2 lowercase chars)>-<COUNTRY (2 uppercase chars)>`,
      isPrivate: false,
      default: 'en-GB',
    },
    clocks_layout: {
      type: 'array',
      description: `Layout of clocks in JSON format.
        It is a list of horizontalGroups, each of which list of vertically-aligned elements.
        Each clock has the following properties:

        1. name: (string) name of the clock, to be displayed above it.
        2. hideAnalog: (boolean = false) flag to hide the analog clock.
        3. hideDate: (boolean = false) flag to hide the date.
        4. hideOffset: (boolean = false) flag to hide the UTC offset, displayed at the right of the name.
        5. timezone: timezone string used to configure which UTC offset to use. 'local' if current should be used. 'local' by default.

        The format for the timezone string can be a fixed string (for UTC or TAI); a fixed-offset string (e.g. UTC+5);
        or a location string in the format <Continent>/<City> (use camelcase with underscores instead of spaces, like America/New_York)
        For example:
        - For local time use local
        - For UTC use UTC
        - For TAI use TAI
        - For Greenwich Sidereal Time use sidereal-greenwich
        - For Summit Sidereal Time use sidereal-summit
        - For Survey Time use survey-time
        - For Observing Day use observing-day
        - For La Serena use America/Santiago
        - For Arizona use America/Phoenix
        - For California use America/Los_Angeles
        Note that not every city is available, check the IANA DB documentation for more info: https://www.iana.org/time-zones.
        https://time.is/ is a good website to check the current time in different timezones too.
        See the default value as an example.`,
      isPrivate: false,
      default: [
        [
          {
            name: 'Local Time',
            hideAnalog: false,
            hideDate: false,
            hideOffset: false,
            timezone: 'local',
          },
          {
            name: 'Sidereal Time',
            hideAnalog: false,
            hideDate: true,
            hideOffset: false,
            timezone: 'sidereal-summit',
          },
        ],
        [
          [
            {
              name: 'La Serena',
              hideAnalog: true,
              hideDate: false,
              hideOffset: false,
              timezone: 'America/Santiago',
            },
            {
              name: 'Arizona',
              hideAnalog: true,
              hideDate: false,
              hideOffset: false,
              timezone: 'America/Phoenix',
            },
            {
              name: 'California',
              hideAnalog: true,
              hideDate: false,
              hideOffset: false,
              timezone: 'America/Los_Angeles',
            },
          ],
          [
            {
              name: 'Universal Time',
              hideAnalog: true,
              hideDate: false,
              hideOffset: false,
              timezone: 'UTC',
            },
            {
              name: 'International Atomic Time',
              hideAnalog: true,
              hideDate: false,
              hideOffset: false,
              timezone: 'TAI',
            },
            {
              name: 'UTC',
              hideAnalog: true,
              hideDate: false,
              hideOffset: false,
              timezone: 'MJD',
            },
          ],
        ],
        [
          [
            {
              name: 'Observing Day',
              hideAnalog: true,
              hideDate: false,
              hideOffset: true,
              timezone: 'observing-day',
            },
            {
              name: 'Survey Duration',
              hideAnalog: true,
              hideDate: false,
              hideOffset: true,
              timezone: 'survey-time',
            },
          ],
        ],
      ],
    },
  },
};

const TimeDisplayContainer = ({ ...props }) => {
  return <TimeDisplay {...props} />;
};

const mapStateToProps = (state) => {
  const clock = getClock(state);
  return { clock };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(TimeDisplayContainer);
