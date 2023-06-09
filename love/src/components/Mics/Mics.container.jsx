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
      ]
    }
  },
};

const MicsContainer = (props) => {
  const mics = props.mics || schema.props.mics.default;
  return (
    <Mics 
      mics={mics}
    />
  );
};

export default MicsContainer;