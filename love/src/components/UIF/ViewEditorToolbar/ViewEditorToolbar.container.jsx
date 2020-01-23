import React from 'react';
import { connect } from 'react-redux';
import { getEditedViewCurrent, getEditedViewStatus, getEditedViewSaved, getViewsStatus } from '../../../redux/selectors';
import { updateEditedView, saveEditedView, clearViewToEdit, loadViewToEdit, changeMode } from '../../../redux/actions/uif';
import ViewEditorToolbar from './ViewEditorToolbar';

const ViewEditorToolbarContainer = ({...props }) => {
  return (
    <ViewEditorToolbar
      {...props}
    />
  );
};

const mapStateToProps = (state) => {
  const editedViewStatus = getEditedViewStatus(state);
  return { editedViewStatus };
};

const mapDispatchToProps = (dispatch) => ({
  save: () => dispatch(saveEditedView()),
  addComponents: () => {},
  undo: () => {},
  redo: () => {},
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ViewEditorToolbarContainer);
