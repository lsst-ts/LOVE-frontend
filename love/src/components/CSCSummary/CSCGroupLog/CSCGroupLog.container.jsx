import React from 'react';
import { connect } from 'react-redux';
import CSCGroupLog from './CSCGroupLog';
import { requestGroupSubscription } from '../../../redux/actions/ws';
import { getGroupSortedErrorCodeData } from '../../../redux/selectors';
import { removeCSCErrorCodeData } from '../../../redux/actions/summaryData';

const CSCGroupLogContainer = ({
  realm,
  group,
  name,
  onCSCClick,
  hierarchy,
  clearCSCErrorCodes,
  subscribeToStream,
  errorCodeData,
  cscList,
  embedded,
}) => {
  return (
    <CSCGroupLog
      realm={realm}
      group={group}
      name={name}
      onCSCClick={onCSCClick}
      hierarchy={hierarchy}
      clearCSCErrorCodes={clearCSCErrorCodes}
      subscribeToStream={subscribeToStream}
      errorCodeData={errorCodeData}
      cscList={cscList}
      embedded={embedded}
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
  if (ownProps.realm && ownProps.hierarchy[ownProps.realm] && ownProps.hierarchy[ownProps.realm][ownProps.group]) {
    const errorCodeData = getGroupSortedErrorCodeData(state, ownProps.hierarchy[ownProps.realm][ownProps.group]);
    return {
      errorCodeData: errorCodeData,
    };
  }
  if (ownProps.cscList) {
    const errorCodeData = getGroupSortedErrorCodeData(state, ownProps.cscList);
    return {
      errorCodeData: errorCodeData,
    };
  }
  return {
    errorCodeData: [],
  };
};

export default connect(mapStateToProps, mapDispatchtoProps)(CSCGroupLogContainer);
