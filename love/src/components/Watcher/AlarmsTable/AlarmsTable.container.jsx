import React from 'react';
import { connect } from 'react-redux';
import { getAllTelemetries } from '../../../redux/selectors';
import { requestGroupSubscription, requestGroupSubscriptionRemoval, requestSALCommand } from '../../../redux/actions/ws';
import AlarmsTable from './AlarmsTable';

const AlarmsTableContainer = ({ alarms, subscribeToStream, unsubscribeToStream, ...props }) => {
  return (
    <AlarmsTable
      {...props}
      subscribeToStream={subscribeToStream}
      unsubscribeToStream={unsubscribeToStream}
      alarms={alarms}
    />
  );
};

const mapStateToProps = (state) => {
  //   const alarms = getAlarms(state);
  const alarms = [
    {
      severity: 1,
      maxSeverity: 3,
      name: 'test.ConfiguredSeverities.Rule1',
      reason: `Lorem Ipsum is simply dummy text of the printing and typesetting 
industry. Lorem Ipsum has been the industry's standard dummy text 
ever since the 1500s, when an unknown printer took a galley of type 
and scrambled it to make a type specimen book. It has survived not 
only five centuries, but also the leap into electronic typesetting, 
remaining essentially unchanged. It was popularised in the 1960s 
with the release of Letraset sheets containing Lorem Ipsum passages, 
and more recently with desktop publishing software like Aldus 
PageMaker including versions of Lorem Ipsum.`,
      timestampSeverityNewest: new Date().getTime(),
    },
    {
      severity: 2,
      maxSeverity: 2,
      name: 'test.ConfiguredSeverities.Rule2',
      reason: `Lorem Ipsum is simply dummy text of the printing and typesetting 
industry. Lorem Ipsum has been the industry's standard dummy text 
ever since the 1500s, when an unknown printer took a galley of type 
and scrambled it to make a type specimen book. It has survived not 
only five centuries, but also the leap into electronic typesetting, 
remaining essentially unchanged. It was popularised in the 1960s 
with the release of Letraset sheets containing Lorem Ipsum passages, 
and more recently with desktop publishing software like Aldus 
PageMaker including versions of Lorem Ipsum.`,
      timestampSeverityNewest: new Date().getTime(),
    },
  ];
  return alarms;
};

const mapDispatchToProps = (dispatch) => {
  return {
    subscribeToStream: () => {
      //All telemetriesdsa
      //   dispatch(requestGroupSubscription('telemetry-all-all-all'));
    },
    unsubscribeToStream: () => {
      //All telemetriesdsa
      //   dispatch(requestGroupSubscriptionRemoval('telemetry-all-all-all'));
    },
    ackAlarm: (name, severity, acknowledgedBy) => {
      return dispatch(
        requestSALCommand({
          cmd: 'cmd_acknowledge',
          component: 'Watcher',
          salindex: 0,
          params: {
            name,
            severity,
            acknowledgedBy,
          },
        }),
      );
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AlarmsTableContainer);
