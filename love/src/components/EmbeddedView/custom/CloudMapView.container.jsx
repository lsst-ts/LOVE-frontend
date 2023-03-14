import React from 'react';
import { connect } from 'react-redux';
import EmbeddedView from '../EmbeddedView';
import { CLOUD_MAP_SERVICE_URL } from 'Config';

export const schema = {
  description:
    'Component to show the 2D cloud/extinction map.',
  defaultSize: [57, 35],
  props: {
    title: {
      type: 'string',
      description: 'Name diplayed in the title bar (if visible)',
      isPrivate: false,
      default: 'Embedded view',
    },
  },
};

const CloudMapViewContainer = ({ ...props }) => {
  return <EmbeddedView url={CLOUD_MAP_SERVICE_URL} {...props} />;
};

export default CloudMapViewContainer;
