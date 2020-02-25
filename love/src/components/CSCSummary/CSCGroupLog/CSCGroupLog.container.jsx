import React from 'react';
import { connect } from 'react-redux';
import CSCGroupLog from './CSCGroupLog';
import { requestGroupSubscription } from '../../../redux/actions/ws';
import { getGroupSortedErrorCodeData } from '../../../redux/selectors';
import { removeCSCErrorCodeData } from '../../../redux/actions/summaryData';

export const schema = {
  description:
    'Displays the error code logs for a set of CSCs, including error code, message, traceback and timestamp. Also includes current summary state and heartbeat for each CSC',
  defaultSize: [24, 29],
  props: {
    group: {
      type: 'string',
      description: 'Custom name of the group',
      isPrivate: false,
      default: 'CSC group',
    },
    cscList: {
      type: 'array',
      description:
        'Array of the CSCs to be included in the group, as objects with the format: {name: <component-name>, salindex: <number>}',
      isPrivate: false,
      default: [
        {
          name: 'ATMCS',
          salindex: 0,
        },
      ],
    },
  },
};

const CSCGroupLogContainer = ({
  group,
  name,
  onCSCClick,
  clearCSCErrorCodes,
  subscribeToStream,
  errorCodeData,
  cscList,
  embedded,
}) => {
  return (
    <CSCGroupLog
      group={group}
      name={name}
      onCSCClick={onCSCClick}
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
  const errorCodeData = getGroupSortedErrorCodeData(state, ownProps.cscList);
  return {
    errorCodeData: errorCodeData,
  };
};

export default connect(mapStateToProps, mapDispatchtoProps)(CSCGroupLogContainer);
