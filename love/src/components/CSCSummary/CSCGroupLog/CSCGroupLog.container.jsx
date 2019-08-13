import React from 'react';
import { connect } from 'react-redux';
import CSCGroupLog from './CSCGroupLog';
import { requestGroupSubscription } from '../../../redux/actions/ws';
import { getGroupSortedErrorCodeData } from '../../../redux/selectors';
import { removeCSCErrorCodeData } from '../../../redux/actions/summaryData';

const CSCGroupLogContainer = ({
  realm,
  group,
  csc,
  data,
  onCSCClick,
  hierarchy,
  clearCSCErrorCodes,
  subscribeToStream,
  errorCodeData,
}) => {
  return (
    <CSCGroupLog
      realm={realm}
      group={group}
      name={csc}
      data={data}
      onCSCClick={onCSCClick}
      hierarchy={hierarchy}
      clearCSCErrorCodes={clearCSCErrorCodes}
      subscribeToStream={subscribeToStream}
      errorCodeData={errorCodeData}
    />
  );
};

const mapDispatchtoProps = (dispatch) => {
  return {
    subscribeToStream: (cscName, index) => {
      dispatch(requestGroupSubscription(`event-${cscName}-${index}-errorCode`));
    },
    clearCSCErrorCodes: (csc, salindex) => {
      dispatch(removeCSCErrorCodeData(csc, salindex));
    },
  };
};

const mapStateToProps = (state, ownProps) => {
  const errorCodeData = getGroupSortedErrorCodeData(state, ownProps.hierarchy[ownProps.realm][ownProps.group]);
  return {
    errorCodeData: errorCodeData,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchtoProps,
)(CSCGroupLogContainer);
