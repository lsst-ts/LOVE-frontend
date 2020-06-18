import React from 'react';
import { connect } from 'react-redux';
import { getCamFeeds } from '../../redux/selectors';
import GenericCamera from './GenericCamera';

export const schema = {
  description: 'Renders the images streamed by the GenericCamera live view server into an HTML5 canvas',
  defaultSize: [10, 10],
  props: {
    titleBar: {
      type: 'boolean',
      description: 'Whether to display the title bar',
      isPrivate: false,
      default: false,
    },
    title: {
      type: 'string',
      description: 'Name diplayed in the title bar (if visible)',
      isPrivate: false,
      default: 'Generic camera',
    },
    margin: {
      type: 'boolean',
      description: 'Whether to display component with a margin',
      isPrivate: false,
      default: true,
    },
    feedKey: {
      type: 'string',
      description: 'Name to identify the live view server',
      isPrivate: false,
      default: 'generic',
    },
    hasRawMode: {
      type: 'boolean',
      description: 'Whether the component has a raw mode version',
      isPrivate: true,
      default: false,
    },
  },
};

const GenericCameraContainer = ({ ...props }) => {
  return <GenericCamera {...props} />;
};

const mapStateToProps = (state) => {
  const camFeeds = getCamFeeds(state);
  return { camFeeds };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(GenericCameraContainer);
