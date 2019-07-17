import React from 'react';
import { connect } from 'react-redux';
import CSCSummary from './CSCSummary';

const CSCSummaryContainer = () => {
  return <CSCSummary />;
};

const mapStateToProps = (state) => {};

const mapDispatchToProps = (dispatch) => {
  return {
    subscribeToStreams: () => {},
    unsubscribeToStreams: () => {},
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CSCSummaryContainer);
