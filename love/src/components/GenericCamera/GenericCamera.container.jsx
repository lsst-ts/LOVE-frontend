import React from 'react';
import { connect } from 'react-redux';
import { getCamFeeds } from '../../redux/selectors';
import { addGroup, removeGroup, requestSALCommand } from '../../redux/actions/ws';
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
    salIndex: {
      type: 'integer',
      description: 'The index of the GenericCamera to control',
      isPrivate: false,
      default: 1,
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
  return {
    requestSALCommand: (cmd) => {
      dispatch(
        requestSALCommand({
          ...cmd,
        }),
      );
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(GenericCameraContainer);
