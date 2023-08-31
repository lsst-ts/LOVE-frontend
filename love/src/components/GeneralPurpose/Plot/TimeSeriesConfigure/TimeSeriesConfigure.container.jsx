/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed by Inria Chile.

This program is free software: you can redistribute it and/or modify it under 
the terms of the GNU General Public License as published by the Free Software 
Foundation, either version 3 of the License, or at your option) any later version.

This program is distributed in the hope that it will be useful,but WITHOUT ANY
 WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR 
 A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with 
this program. If not, see <http://www.gnu.org/licenses/>.
*/

import React from 'react';
import { connect } from 'react-redux';
import { getAllTelemetries } from 'redux/selectors';
import { addGroup, removeGroup } from 'redux/actions/ws';
import TimeSeriesConfigure from './TimeSeriesConfigure';

export const schema = {
  description: `Timeseries Configure`,
  props: {
    subscriptions: {
      type: 'array',
      description:
        'List of subscriptions in the format: <"event"|"telemetry">-<CSC>-<CSCIndex>-<topic>, e.g. "telemetry-all-all-all"',
      isPrivate: false,
      default: ['telemetry-all-all-all'],
    },
  },
};

const TimeSeriesConfigureContainer = ({
  subscriptions,
  subscribeToStreams,
  unsubscribeToStreams,
  onSave,
  onCancel,
  ...props
}) => {
  const [telemetries, setTelemetries] = React.useState({});
  if (subscriptions && Object.keys(subscriptions).length > 4 && Object.keys(telemetries).length === 0) {
    setTelemetries(subscriptions);
  }
  return (
    <TimeSeriesConfigure
      subscriptions={subscriptions}
      getStreamData={getStreamData}
      subscribeToStreams={subscribeToStreams}
      unsubscribeToStreams={unsubscribeToStreams}
      onCancel={onCancel}
      onSetSelection={onSave}
      {...props}
    />
  );
};

const mapStateToProps = (state, ownProps) => {
  const getStreamDataProp = (groupName) => getStreamData(state, groupName);
  return { getStreamData: getStreamDataProp };
};

const mapDispatchToProps = (dispatch) => {
  return {
    subscribeToStreams: (streams) => {
      streams.forEach((groupName) => {
        dispatch(addGroup(groupName));
      });
    },
    unsubscribeToStreams: (streams) => {
      streams.forEach((groupName) => {
        dispatch(removeGroup(groupName));
      });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TimeSeriesConfigureContainer);
