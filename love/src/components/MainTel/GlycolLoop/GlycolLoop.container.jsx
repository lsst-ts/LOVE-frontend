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
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addGroup, removeGroup } from '../../../redux/actions/ws';
import GlycolLoop from './GlycolLoop';
import { getGlycolPumpStatus, getGlycolTemps, getM1M3TSMixingState } from 'redux/selectors';
import SubscriptionTableContainer from '../../GeneralPurpose/SubscriptionTable/SubscriptionTable.container';

export const schema = {
  description: 'Glycol Loop',
  defaultSize: [57, 48],
  props: {
    title: {
      type: 'string',
      description: 'Glycol Loop',
      isPrivate: false,
      default: 'Glycol Loop',
    },
  },
};

const GlycolLoopContainer = ({ subscribeToStreams, unsubscribeToStreams, controls, ...props }) => {
  if (props.isRaw) {
    return <SubscriptionTableContainer subscriptions={props.subscriptions}></SubscriptionTableContainer>;
  }
  return (
    <GlycolLoop
      subscribeToStreams={subscribeToStreams}
      unsubscribeToStreams={unsubscribeToStreams}
      controls={controls}
      {...props}
    />
  );
};

const mapStateToProps = (state) => {
  const glycolPumpStatus = getGlycolPumpStatus(state);
  const glycolTemps = getGlycolTemps(state);
  const m1m3TSMixingState = getM1M3TSMixingState(state);
  return {
    ...glycolPumpStatus,
    ...glycolTemps,
    ...m1m3TSMixingState,
  };
};

const mapDispatchToProps = (dispatch) => {
  const subscriptions = [
    'event-MTM1M3TS-0-glycolPumpStatus',
    'telemetry-MTM1M3TS-0-glycolLoopTemperature',
    'telemetry-MTM1M3TS-0-mixingValve',
  ];
  return {
    subscriptions,
    subscribeToStreams: () => {
      subscriptions.forEach((s) => dispatch(addGroup(s)));
    },
    unsubscribeToStreams: () => {
      subscriptions.forEach((s) => dispatch(removeGroup(s)));
    },
  };
};

GlycolLoopContainer.propTypes = {
  /** Wheter the component is in raw mode */
  isRaw: PropTypes.bool,
  /** List of the component's subscriptions */
  subscriptions: PropTypes.array,
};

export default connect(mapStateToProps, mapDispatchToProps)(GlycolLoopContainer);
