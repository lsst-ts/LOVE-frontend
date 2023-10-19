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
import MTIS from './MTIS';
import { addGroup, removeGroup } from 'redux/actions/ws';
import SubscriptionTableContainer from 'components/GeneralPurpose/SubscriptionTable/SubscriptionTable.container';
import { getMTIS } from 'redux/selectors';

export const schema = {
  description:
    'Summary view of the Simonyi Interlock Signals. Contains general information about the MTDome, TMA, and M1M3 Interlocks Signals.',
  defaultSize: [51, 45],
  props: {
    title: {
      type: 'string',
      description: 'Name displayed in the title bar (if visible)',
      isPrivate: false,
      default: 'MT Interlock System',
    },
  },
};

const MTISContainer = ({ subscribeToStream, unsubscribeToStream, ...props }) => {
  if (props.isRaw) {
    return <SubscriptionTableContainer subscriptions={props.subscriptions}></SubscriptionTableContainer>;
  }
  return <MTIS subscribeToStream={subscribeToStream} unsubscribeToStream={unsubscribeToStream} {...props} />;
};

const mapStateToProps = (state) => {
  const MTISState = getMTIS(state);
  return {
    ...MTISState,
  };
};

const mapDispatchToProps = (dispatch) => {
  const subscriptions = [
    'event-MTMount-0-safetyInterlocks',
    'event-MTDome-0-interlocks',
    'event-MTM1M3-0-interlockWarning',
  ];
  return {
    subscriptions,
    subscribeToStream: () => {
      subscriptions.forEach((stream) => dispatch(addGroup(stream)));
    },
    unsubscribeToStream: () => {
      subscriptions.forEach((stream) => dispatch(removeGroup(stream)));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MTISContainer);
