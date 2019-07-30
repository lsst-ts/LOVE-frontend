import React from 'react';
import { connect } from 'react-redux';
import CSCDetail from './CSCDetail';
import { requestGroupSubscription } from '../../../redux/actions/ws';
import { getStreamData } from '../../../redux/selectors';

const CSCDetailContainer = ({
  realm,
  group,
  name,
  salindex,
  data,
  summaryStateData,
  onCSCClick,
  subscribeToStreams,
}) => {
  return (
    <CSCDetail
      realm={realm}
      group={group}
      name={name}
      salindex={salindex}
      data={data}
      summaryStateData={summaryStateData}
      onCSCClick={onCSCClick}
      subscribeToStreams={subscribeToStreams}
    />
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    subscribeToStreams: (cscName, index) => {
      dispatch(requestGroupSubscription(`event-${cscName}-${index}-summaryState`));
      dispatch(requestGroupSubscription(`event-${cscName}-${index}-logMessage`));
      dispatch(requestGroupSubscription(`event-${cscName}-${index}-errorCode`));
    },
  };
};

const mapStateToProps = (state, ownProps) => {
  const summaryStateData = getStreamData(state, `event-${ownProps.name}-${ownProps.salindex}-summaryState`);
  if (!summaryStateData) return {};
  return {
    summaryStateData: summaryStateData[0],
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CSCDetailContainer);
