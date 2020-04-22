import React from 'react';
import { connect } from 'react-redux';
import ViewsIndex from './ViewsIndex';
import { getViews } from '../../../redux/selectors/uif';
import { deleteView } from '../../../redux/actions/uif';

const ViewsIndexContainer = ({ ...props }) => {
  return <ViewsIndex {...props} />;
};

const mapStateToProps = (state) => ({
  views: getViews(state),
});

const mapDispatchToProps = (dispatch) => ({
  deleteView: (view) => dispatch(deleteView(view)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ViewsIndexContainer);
