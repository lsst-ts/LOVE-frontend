import React from 'react';
import { connect } from 'react-redux';
import { getView } from '../../../redux/selectors';
import CustomView from './CustomView';

const ViewEditorContainer = ({...props }) => {
  return (
    <CustomView
      {...props}
    />
  );
};

const mapStateToProps = (state) => {
  const getCurrentView = (id) => getView(state, id);
  return { getCurrentView };
};

const mapDispatchToProps = () => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ViewEditorContainer);
