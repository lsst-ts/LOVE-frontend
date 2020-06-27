import React from 'react';
import { connect } from 'react-redux';
import EmbeddedView from './EmbeddedView';

export const schema = {
  description: 'Component that renders an external web page. The server hosting the page should allow it to be embeddable (no X-Frame-Options in the HTTP header)',
  defaultSize: [57, 35],
  props: {
    title: {
      type: 'string',
      description: 'Name diplayed in the title bar (if visible)',
      isPrivate: false,
      default: 'Embedded view',
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

const EmbeddedViewContainer = ({ ...props }) => {
  return <EmbeddedView {...props} />;
};

export default connect(() => {return {}}, () => {return {}})(EmbeddedViewContainer);
