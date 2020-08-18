import React from 'react';
import { connect } from 'react-redux';
import Network from './Network';

export const schema = {
  description: 'Component that displays the general network status',
  defaultSize: [57, 35],
  props: {
    title: {
      type: 'string',
      description: 'Name diplayed in the title bar (if visible)',
      isPrivate: false,
      default: 'Network component',
    },
    url: {
      type: 'string',
      description: 'URL to be embedded in the component',
      isPrivate: false,
      default: 'https://dashboard.ampath.net/maddash-webui/index.cgi',
    },
    hasRawMode: {
      type: 'boolean',
      description: 'Whether the component has a raw mode version',
      isPrivate: true,
      default: false,
    },
  },
};

const NetworkContainer = ({ ...props }) => {
  return <Network {...props} />;
};

export default connect(() => {return {}}, () => {return {}})(NetworkContainer);
