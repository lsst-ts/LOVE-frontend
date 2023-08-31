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
import { getAllTelemetries } from '../../../redux/selectors';
import { addGroup, removeGroup } from '../../../redux/actions/ws';
import HealthStatusConfig from './HealthStatusConfig';

const HealthStatusConfigContainer = ({
  allTelemetries,
  subscribeToStream,
  unsubscribeToStream,
  onSave,
  onCancel,
  ...props
}) => {
  const [telemetries, setTelemetries] = React.useState({});

  if (allTelemetries && Object.keys(allTelemetries).length > 4 && Object.keys(telemetries).length === 0) {
    setTelemetries(allTelemetries);
  }
  return (
    <HealthStatusConfig
      {...props}
      subscribeToStream={subscribeToStream}
      unsubscribeToStream={unsubscribeToStream}
      allTelemetries={telemetries}
      onCancel={onCancel}
      onSetSelection={onSave}
    />
  );
};

const mapStateToProps = (state) => {
  const allTelemetries = getAllTelemetries(state);
  return { allTelemetries };
};

const mapDispatchToProps = (dispatch) => {
  return {
    subscribeToStream: () => {
      //All telemetriesdsa
      dispatch(addGroup('telemetry-all-all-all'));
    },
    unsubscribeToStream: () => {
      //All telemetriesdsa
      dispatch(removeGroup('telemetry-all-all-all'));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HealthStatusConfigContainer);
