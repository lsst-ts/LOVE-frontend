/** This file is part of LOVE-frontend.

Developed for Inria Chile Tech Team.

See the COPYRIGHT file at the top-level directory of this distribution
for details of code ownership.

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.*/

import React from 'react';
import Mics from './Mics';

export const schema = {
  description: 'Component that displays the microphones',
  defaultSize: [75, 38],
  props: {
    title: {
      type: 'string',
      description: 'Name diplayed in the title bar (if visible)',
      isPrivate: false,
      default: 'Microphones Component',
    },
    hasRawMode: {
      type: 'boolean',
      description: 'Whether the component has a raw mode version',
      isPrivate: true,
      default: false,
    },
    mics: {
      type: 'array',
      description: 'List of the microphones. ',
      isPrivate: false,
      default: [
        {
          id: 1,
          name: 'Mic 1',
          location: 'Main Telescope',
          src: 'http://localhost/tone-400hz-20db.mp3',
          dbLimit: 20,
          minDecibels: -120,
          maxDecibels: 0,
        },
        {
          id: 2,
          name: 'Mic 2',
          location: 'Auxiliary Telescope',
          src: 'http://localhost/tone-400hz-20db.mp3',
          dbLimit: 40,
          minDecibels: -120,
          maxDecibels: 0,
        },
        {
          id: 3,
          name: 'Mic 3',
          location: 'Summit Facility',
          src: 'http://localhost/tone-400hz-20db.mp3',
          dbLimit: 20,
          minDecibels: -120,
          maxDecibels: 0,
        },
      ],
    },
  },
};

const MicsContainer = (props) => {
  const mics = props.mics || schema.props.mics.default;
  return <Mics mics={mics} />;
};

export default MicsContainer;
