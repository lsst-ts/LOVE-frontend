import React from 'react';
import { connect } from 'react-redux';
import EmbeddedView from './EmbeddedView';

export const schema = {
  description: 'Panel containing multiple buttons that execute different commands, such as closing the dome',
  defaultSize: [57, 35],
  props: {
    title: {
      type: 'string',
      description: 'Name diplayed in the title bar (if visible)',
      isPrivate: false,
      default: 'Command Panel',
    },
    url: {
      type: 'string',
      description: 'URL to be embedded in the component',
      isPrivate: false,
      default: 'http://lsst.org',
    },
    hasRawMode: {
      type: 'boolean',
      description: 'Whether the component has a raw mode version',
      isPrivate: true,
      default: false,
    },
  },
};

const EmbeddedViewContainer = ({ ...props }) => {
  return <EmbeddedView {...props} />;
};

export default connect(() => {return {}}, () => {return {}})(EmbeddedViewContainer);
