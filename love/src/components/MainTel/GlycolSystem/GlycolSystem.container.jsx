/** 
This file is part of LOVE-frontend.

Developed for the Vera C. Rubin Observatory Telescope and Site Systems.

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
import { addGroup, removeGroup, requestSALCommand } from 'redux/actions/ws';
import { getGlycolSystemData } from 'redux/selectors';
import SubscriptionTableContainer from 'components/GeneralPurpose/SubscriptionTable/SubscriptionTable.container';
import GlycolSystem from './GlycolSystem';

export const schema = {
  description: 'Glycol system interface',
  defaultSize: [77, 32],
  props: {
    title: {
      type: 'string',
      description: 'Name displayed in the title bar (if visible)',
      isPrivate: false,
      default: 'LOVE Glycol System Monitor',
    },
    hasRawMode: {
      type: 'boolean',
      description: 'Whether the component has a raw mode version',
      isPrivate: true,
      default: true,
    },
    showTableDifferences: {
      type: 'boolean',
      description: 'Whether to show the Temperature and Pressure differences in the table for glycol measurements.',
      isPrivate: false,
      default: true,
    },
  },
};

const GlycolSystemContainer = (props) => {
  if (props.isRaw) {
    return <SubscriptionTableContainer subscriptions={props.subscriptions}></SubscriptionTableContainer>;
  }
  return <GlycolSystem {...props} />;
};

const mapStateToProps = (state, ownProps) => {
  const glycolSystemData = getGlycolSystemData(state);
  return {
    ...glycolSystemData,
  };
};

const mapDispatchToProps = (dispatch) => {
  const subscriptions = ['event-HVAC-0-summaryState', 'telemetry-HVAC-0-glycolSensor', 'telemetry-HVAC-0-dynaleneP05'];
  return {
    subscriptions,
    subscribeToStreams: () => {
      subscriptions.forEach((s) => dispatch(addGroup(s)));
    },
    unsubscribeToStreams: () => {
      subscriptions.forEach((s) => dispatch(removeGroup(s)));
    },
    requestSALCommand: (cmd) => {
      return dispatch(requestSALCommand(cmd));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(GlycolSystemContainer);
