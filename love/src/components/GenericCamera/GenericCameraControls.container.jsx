import React from 'react';
import { connect } from 'react-redux';
import { getCamFeeds, getStreamData } from '../../redux/selectors';
import { addGroup, removeGroup, requestSALCommand } from '../../redux/actions/ws';
import GenericCameraControls from './GenericCameraControls';

const CSC_NAME = 'GenericCamera';

export const schema = {
  description: 'Allows for control of the GenericCamera and can show the live view on an HTML5 canvas',
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
    salindex: {
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

const GenericCameraControlsContainer = ({ ...props }) => {
  return <GenericCameraControls {...props} />;
};

const mapStateToProps = (state, ownProps) => {
  const camFeeds = getCamFeeds(state);
  const summaryStateData = getStreamData(state, `event-${CSC_NAME}-${ownProps.salindex}-summaryState`);
  return { camFeeds, summaryStateData: summaryStateData ? summaryStateData?.[0] : undefined };
};

const mapDispatchToProps = (dispatch) => {
  return {
    subscribeToStreams: (index) => {
      dispatch(addGroup(`event-${CSC_NAME}-${index}-summaryState`));
    },
    unsubscribeToStreams: (index) => {
      dispatch(removeGroup(`event-${CSC_NAME}-${index}-summaryState`));
    },
    requestSALCommand: (cmd) => {
      dispatch(
        requestSALCommand({
          ...cmd,
        }),
      );
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(GenericCameraControlsContainer);
