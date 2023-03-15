import React from 'react';
import EmbeddedView from '../EmbeddedView';
import { CLOUD_MAP_SERVICE } from 'Config';

export const schema = {
  description: 'Component to show the 2D cloud/extinction map.',
  defaultSize: [57, 35],
  props: {
    title: {
      type: 'string',
      description: 'Name diplayed in the title bar (if visible)',
      isPrivate: false,
      default: 'Cloud Map',
    },
    link: {
      type: 'boolean',
      description: 'Whether the component has a raw mode version',
      isPrivate: true,
      default: CLOUD_MAP_SERVICE.copyrigth,
    },
    hasRawMode: {
      type: 'boolean',
      description: 'Whether the component has a raw mode version',
      isPrivate: true,
      default: false,
    },
  },
};

const CloudMapViewContainer = ({ ...props }) => {
  return <EmbeddedView url={CLOUD_MAP_SERVICE.url} {...props}/>
};

export default CloudMapViewContainer;
