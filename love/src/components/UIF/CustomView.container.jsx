import React from 'react';
import { connect } from 'react-redux';
import { getView, getViewsStatus } from '../../redux/selectors';
import CustomView from './CustomView';
import { requestView } from '../../redux/actions/uif';

const ViewEditorContainer = ({ ...props }) => {
  return <CustomView {...props} />;
};

const mapStateToProps = (state) => {
  const getCurrentView = (id) => getView(state, id);
  const viewsStatus = getViewsStatus(state);
  return { getCurrentView, viewsStatus };
};

const mapDispatchToProps = (dispatch) => ({
  requestView: (id) => dispatch(requestView(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ViewEditorContainer);
