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
import DataManagementFlow from './DataManagementFlow';
import { addGroup, removeGroup } from 'redux/actions/ws';
import SubscriptionTableContainer from 'components/GeneralPurpose/SubscriptionTable/SubscriptionTable.container';
import { getDMFlowState } from 'redux/selectors';

export const schema = {
  description: 'Data Management Flow',
  defaultSize: [12, 6],
  props: {
    title: {
      type: 'string',
      description: 'Name displayed in the title bar (if visible)',
      isPrivate: false,
      default: 'Data Management Flow',
    },
  },
};

const DataManagementFlowContainer = ({
  subscribeToStreams,
  unsubscribeToStreams,
  dmFlowState,
  oodsState,
  usdfState,
  ...props
}) => {
  if (props.isRaw) {
    return <SubscriptionTableContainer subscriptions={props.subscriptions}></SubscriptionTableContainer>;
  }
  return (
    <DataManagementFlow
      subscribeToStreams={subscribeToStreams}
      unsubscribeToStreams={unsubscribeToStreams}
      dmFlowState={dmFlowState}
      oodsState={oodsState}
      usdfState={usdfState}
    />
  );
};

const mapStateToProps = (state) => {
  const dmFlow = getDMFlowState(state);
  return dmFlow;
};

const mapDispatchToProps = (dispatch) => {
  // TODO: Add the corresponding events and telemetries when they gets integrated into SAL
  const subscriptions = [];
  return {
    subscriptions,
    subscribeToStreams: () => {
      subscriptions.forEach((stream) => dispatch(addGroup(stream)));
    },
    unsubscribeToStreams: () => {
      subscriptions.forEach((stream) => dispatch(removeGroup(stream)));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DataManagementFlowContainer);
