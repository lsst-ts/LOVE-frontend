import React from 'react';
import { connect } from 'react-redux';
import { getEditedViewCurrent, getEditedViewStatus, getEditedViewSaved } from '../../../../redux/selectors';
import { updateEditedView, saveEditedView, clearViewToEdit, loadViewToEdit } from '../../../../redux/actions/uif';
import ViewEditor from './ViewEditor';

const ViewEditorContainer = ({...props }) => {
  return (
    <ViewEditor
      {...props}
    />
  );
};

const mapStateToProps = (state) => {
  const editedViewCurrent = getEditedViewCurrent(state);
  const editedViewStatus = getEditedViewStatus(state);
  const editedViewSaved = getEditedViewSaved(state);
  return { editedViewCurrent, editedViewStatus, editedViewSaved };
};

const mapDispatchToProps = (dispatch) => ({
  updateEditedView: (view) => dispatch(updateEditedView(view)),
  loadViewToEdit: (view) => dispatch(loadViewToEdit(view)),
  clearViewToEdit: () => dispatch(clearViewToEdit),
  saveEditedView: () => dispatch(saveEditedView()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ViewEditorContainer);
