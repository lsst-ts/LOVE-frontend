import React from 'react';
import { connect } from 'react-redux';
import { getEditedViewCurrent, getEditedViewStatus, getEditedViewSaved } from '../../../../redux/selectors';
import { updateEditedView, saveEditedView } from '../../../../redux/actions/uif';
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
  saveEditedView: (view) => dispatch(saveEditedView(view)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ViewEditorContainer);
