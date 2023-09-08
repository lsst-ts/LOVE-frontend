/** 
This file is part of LOVE-frontend.

Copyright (c) 2023 Inria Chile.

Developed for Inria Chile.

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
import { addGroup, removeGroup } from '../../../redux/actions/ws';
import { getLATISSState } from '../../../redux/selectors';
import LATISS from './LATISS';
import SubscriptionTableContainer from '../../GeneralPurpose/SubscriptionTable/SubscriptionTable.container';

export const schema = {
  description:
    'Summary view of the LATISS. Contains information about the filter and grating wheel, shutter and CCDs state',
  defaultSize: [61, 32],
  props: {
    title: {
      type: 'string',
      description: 'Name diplayed in the title bar (if visible)',
      isPrivate: false,
      default: 'LATISS',
    },
  },
};

const LATISSContainer = ({
  subscribeToStreams,
  unsubscribeToStreams,
  reportedFilterPosition,
  reportedFilterName,
  reportedDisperserPosition,
  reportedDisperserName,
  reportedLinearStagePosition,
  lsState,
  fwState,
  gwState,
  shutterDetailedState,
  raftsDetailedState,
  ...props
}) => {
  if (props.isRaw) {
    return <SubscriptionTableContainer subscriptions={props.subscriptions}></SubscriptionTableContainer>;
  }
  return (
    <LATISS
      subscribeToStreams={subscribeToStreams}
      unsubscribeToStreams={unsubscribeToStreams}
      reportedFilterPosition={reportedFilterPosition}
      reportedFilterName={reportedFilterName}
      reportedDisperserPosition={reportedDisperserPosition}
      reportedDisperserName={reportedDisperserName}
      reportedLinearStagePosition={reportedLinearStagePosition}
      lsState={lsState}
      fwState={fwState}
      gwState={gwState}
      shutterDetailedState={shutterDetailedState}
      raftsDetailedState={raftsDetailedState}
      {...props}
    />
  );
};

const mapStateToProps = (state) => {
  const latissState = getLATISSState(state);
  return {
    reportedFilterPosition: latissState['reportedFilterPosition'],
    reportedFilterName: latissState['reportedFilterName'],
    reportedDisperserPosition: latissState['reportedDisperserPosition'],
    reportedDisperserName: latissState['reportedDisperserName'],
    reportedLinearStagePosition: latissState['reportedLinearStagePosition'],
    lsState: latissState['lsState'],
    fwState: latissState['fwState'],
    gwState: latissState['gwState'],
    shutterDetailedState: latissState['shutterDetailedState'],
    raftsDetailedState: latissState['raftsDetailedState'],
  };
};

const mapDispatchToProps = (dispatch) => {
  const subscriptions = [
    'event-ATSpectrograph-0-reportedFilterPosition',
    'event-ATSpectrograph-0-reportedDisperserPosition',
    'event-ATSpectrograph-0-reportedLinearStagePosition',
    'event-ATSpectrograph-0-lsState',
    'event-ATSpectrograph-0-fwState',
    'event-ATSpectrograph-0-gwState',
    // Camera
    'event-ATCamera-0-shutterDetailedState',
    'event-ATCamera-0-raftsDetailedState',
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
export default connect(mapStateToProps, mapDispatchToProps)(LATISSContainer);
